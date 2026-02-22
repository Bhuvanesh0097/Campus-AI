from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from pydantic import BaseModel
from app.auth import get_current_user
from app.database import get_supabase
from app.services.gemini import (
    generate_study_response,
    generate_summary,
    generate_quiz,
)
from app.services.pdf_processor import extract_text_from_pdf, chunk_text, find_relevant_chunks
import uuid

router = APIRouter()

BUCKET_NAME = "study-materials"


class AskRequest(BaseModel):
    question: str
    material_id: str | None = None


class SummarizeRequest(BaseModel):
    material_id: str


class QuizRequest(BaseModel):
    material_id: str
    num_questions: int = 5


@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...), user: dict = Depends(get_current_user)
):
    """Upload a PDF file to Supabase Storage and extract text."""
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    db = get_supabase()
    file_bytes = await file.read()

    # Generate unique file path
    file_id = str(uuid.uuid4())
    file_path = f"{user['user_id']}/{file_id}_{file.filename}"

    # Upload to Supabase Storage
    try:
        db.storage.from_(BUCKET_NAME).upload(
            file_path, file_bytes, {"content-type": "application/pdf"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

    # Extract text
    extracted_text = extract_text_from_pdf(file_bytes)

    # Save metadata to database
    result = (
        db.table("study_materials")
        .insert(
            {
                "user_id": user["user_id"],
                "file_name": file.filename,
                "file_path": file_path,
                "file_size": len(file_bytes),
                "extracted_text": extracted_text,
            }
        )
        .execute()
    )

    return {
        "material": result.data[0] if result.data else None,
        "text_length": len(extracted_text),
        "message": f"Successfully uploaded '{file.filename}' and extracted {len(extracted_text)} characters of text.",
    }


@router.get("/materials")
async def list_materials(user: dict = Depends(get_current_user)):
    """List all uploaded study materials for the current user."""
    db = get_supabase()
    result = (
        db.table("study_materials")
        .select("id, file_name, file_size, created_at")
        .eq("user_id", user["user_id"])
        .order("created_at", desc=True)
        .execute()
    )
    return {"materials": result.data}


@router.delete("/materials/{material_id}")
async def delete_material(material_id: str, user: dict = Depends(get_current_user)):
    """Delete an uploaded study material."""
    db = get_supabase()
    # Get material info
    material = (
        db.table("study_materials")
        .select("*")
        .eq("id", material_id)
        .eq("user_id", user["user_id"])
        .single()
        .execute()
    )
    if not material.data:
        raise HTTPException(status_code=404, detail="Material not found")

    # Delete from storage
    try:
        db.storage.from_(BUCKET_NAME).remove([material.data["file_path"]])
    except Exception:
        pass  # Continue even if storage delete fails

    # Delete from database
    db.table("study_materials").delete().eq("id", material_id).execute()
    return {"status": "deleted"}


@router.post("/ask")
async def ask_question(req: AskRequest, user: dict = Depends(get_current_user)):
    """Ask a question about uploaded study materials."""
    db = get_supabase()

    # Get material text
    if req.material_id:
        material = (
            db.table("study_materials")
            .select("extracted_text")
            .eq("id", req.material_id)
            .eq("user_id", user["user_id"])
            .single()
            .execute()
        )
        if not material.data:
            raise HTTPException(status_code=404, detail="Material not found")
        material_text = material.data.get("extracted_text", "")
    else:
        # Use all materials
        materials = (
            db.table("study_materials")
            .select("extracted_text")
            .eq("user_id", user["user_id"])
            .execute()
        )
        material_text = "\n\n".join(
            [m.get("extracted_text", "") for m in (materials.data or [])]
        )

    if not material_text:
        raise HTTPException(
            status_code=400,
            detail="No study materials found. Please upload a PDF first.",
        )

    # Use RAG-style retrieval
    chunks = chunk_text(material_text)
    relevant_context = find_relevant_chunks(req.question, chunks)

    response = await generate_study_response(req.question, relevant_context)
    return {"answer": response}


@router.post("/summarize")
async def summarize_material(
    req: SummarizeRequest, user: dict = Depends(get_current_user)
):
    """Summarize an uploaded study material."""
    db = get_supabase()
    material = (
        db.table("study_materials")
        .select("extracted_text, file_name")
        .eq("id", req.material_id)
        .eq("user_id", user["user_id"])
        .single()
        .execute()
    )
    if not material.data:
        raise HTTPException(status_code=404, detail="Material not found")

    text = material.data.get("extracted_text", "")
    if not text:
        raise HTTPException(status_code=400, detail="No text found in this material")

    summary = await generate_summary(text)
    return {
        "file_name": material.data["file_name"],
        "summary": summary,
    }


@router.post("/quiz")
async def generate_quiz_from_material(
    req: QuizRequest, user: dict = Depends(get_current_user)
):
    """Generate quiz questions from study material."""
    db = get_supabase()
    material = (
        db.table("study_materials")
        .select("extracted_text, file_name")
        .eq("id", req.material_id)
        .eq("user_id", user["user_id"])
        .single()
        .execute()
    )
    if not material.data:
        raise HTTPException(status_code=404, detail="Material not found")

    text = material.data.get("extracted_text", "")
    if not text:
        raise HTTPException(status_code=400, detail="No text found in this material")

    quiz = await generate_quiz(text, req.num_questions)
    return {
        "file_name": material.data["file_name"],
        "quiz": quiz,
        "num_questions": req.num_questions,
    }
