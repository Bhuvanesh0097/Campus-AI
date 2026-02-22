import io
from PyPDF2 import PdfReader


def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extract text content from a PDF file."""
    try:
        reader = PdfReader(io.BytesIO(file_bytes))
        text_parts = []
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text_parts.append(page_text)
        return "\n\n".join(text_parts)
    except Exception as e:
        return f"Error extracting text from PDF: {str(e)}"


def chunk_text(text: str, chunk_size: int = 2000, overlap: int = 200) -> list[str]:
    """Split text into overlapping chunks for better context retrieval."""
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunk = text[start:end]
        chunks.append(chunk)
        start = end - overlap
    return chunks


def find_relevant_chunks(query: str, chunks: list[str], top_k: int = 3) -> str:
    """Find the most relevant text chunks for a query using simple keyword matching.
    For MVP — a production system would use vector embeddings."""
    query_words = set(query.lower().split())
    scored_chunks = []

    for chunk in chunks:
        chunk_words = set(chunk.lower().split())
        # Simple Jaccard-like similarity
        overlap = len(query_words & chunk_words)
        score = overlap / max(len(query_words), 1)
        scored_chunks.append((score, chunk))

    scored_chunks.sort(key=lambda x: x[0], reverse=True)
    top_chunks = [chunk for _, chunk in scored_chunks[:top_k]]
    return "\n\n---\n\n".join(top_chunks)
