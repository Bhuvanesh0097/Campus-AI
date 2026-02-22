from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from pydantic import BaseModel
from app.auth import get_current_user
from app.database import get_supabase
from app.services.gemini import (
    generate_aptitude_questions,
    generate_resume_tips,
    generate_resume_review,
    generate_resume_chat_response,
    mock_interview_response,
    generate_interview_question,
)
from app.services.pdf_processor import extract_text_from_pdf

router = APIRouter()


class AptitudeRequest(BaseModel):
    topic: str = "general"


class ResumeTipsRequest(BaseModel):
    resume_text: str = ""


class ResumeAskRequest(BaseModel):
    question: str


class MockInterviewRequest(BaseModel):
    question: str
    answer: str
    role: str = "Software Engineer"


class InterviewQuestionRequest(BaseModel):
    role: str = "Software Engineer"
    round_type: str = "technical"  # technical, hr, behavioral


@router.post("/aptitude")
async def get_aptitude_questions(
    req: AptitudeRequest, user: dict = Depends(get_current_user)
):
    """Generate aptitude questions for placement prep."""
    questions = await generate_aptitude_questions(req.topic)
    return {"topic": req.topic, "questions": questions}


@router.post("/resume-upload")
async def upload_resume(
    file: UploadFile = File(...), user: dict = Depends(get_current_user)
):
    """Upload a resume PDF, extract text, auto-analyze, and return tips."""
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    file_bytes = await file.read()
    extracted_text = extract_text_from_pdf(file_bytes)

    if not extracted_text or len(extracted_text.strip()) < 20:
        raise HTTPException(
            status_code=400,
            detail="Could not extract meaningful text from the PDF. Make sure it's a text-based PDF, not a scanned image.",
        )

    db = get_supabase()

    # Store the resume text in the user's profile or a dedicated table
    # For simplicity, we store it in a "resumes" concept using study_materials table
    # with a special marker
    existing = (
        db.table("study_materials")
        .select("id")
        .eq("user_id", user["user_id"])
        .eq("file_name", f"__resume__{file.filename}")
        .execute()
    )

    if existing.data:
        # Update existing resume
        db.table("study_materials").update(
            {
                "extracted_text": extracted_text,
                "file_size": len(file_bytes),
            }
        ).eq("id", existing.data[0]["id"]).execute()
        resume_id = existing.data[0]["id"]
    else:
        # Insert new resume
        result = (
            db.table("study_materials")
            .insert(
                {
                    "user_id": user["user_id"],
                    "file_name": f"__resume__{file.filename}",
                    "file_path": f"resumes/{user['user_id']}/{file.filename}",
                    "file_size": len(file_bytes),
                    "extracted_text": extracted_text,
                }
            )
            .execute()
        )
        resume_id = result.data[0]["id"] if result.data else None

    # Auto-analyze the resume
    review = await generate_resume_review(extracted_text)

    return {
        "resume_id": resume_id,
        "file_name": file.filename,
        "text_length": len(extracted_text),
        "review": review,
        "message": f"Resume '{file.filename}' uploaded and analyzed successfully!",
    }


@router.post("/resume-tips")
async def get_resume_tips(
    req: ResumeTipsRequest, user: dict = Depends(get_current_user)
):
    """Get resume improvement tips and suggestions."""
    # If no resume text provided, try to load it from DB
    resume_text = req.resume_text
    if not resume_text:
        db = get_supabase()
        result = (
            db.table("study_materials")
            .select("extracted_text")
            .eq("user_id", user["user_id"])
            .like("file_name", "__resume__%")
            .order("created_at", desc=True)
            .limit(1)
            .execute()
        )
        if result.data:
            resume_text = result.data[0].get("extracted_text", "")

    tips = await generate_resume_tips(resume_text)
    return {"tips": tips}


@router.post("/resume-ask")
async def ask_about_resume(
    req: ResumeAskRequest, user: dict = Depends(get_current_user)
):
    """Ask a question about the uploaded resume."""
    db = get_supabase()

    # Load the user's latest resume
    result = (
        db.table("study_materials")
        .select("extracted_text")
        .eq("user_id", user["user_id"])
        .like("file_name", "__resume__%")
        .order("created_at", desc=True)
        .limit(1)
        .execute()
    )

    if not result.data or not result.data[0].get("extracted_text"):
        raise HTTPException(
            status_code=400,
            detail="No resume found. Please upload your resume first.",
        )

    resume_text = result.data[0]["extracted_text"]
    response = await generate_resume_chat_response(req.question, resume_text)
    return {"answer": response}


@router.post("/mock-interview")
async def mock_interview(
    req: MockInterviewRequest, user: dict = Depends(get_current_user)
):
    """Get feedback on mock interview answers."""
    feedback = await mock_interview_response(req.question, req.answer, req.role)
    return {
        "question": req.question,
        "your_answer": req.answer,
        "feedback": feedback,
    }


@router.post("/interview-question")
async def get_interview_question(
    req: InterviewQuestionRequest, user: dict = Depends(get_current_user)
):
    """Generate a new interview question."""
    question = await generate_interview_question(req.role, req.round_type)
    return {
        "question": question,
        "role": req.role,
        "round_type": req.round_type,
    }
