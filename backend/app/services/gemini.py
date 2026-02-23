import os
from dotenv import load_dotenv
import httpx

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
MODEL_NAME = "llama-3.3-70b-versatile"


async def _call_groq(messages: list, temperature: float = 0.7) -> str:
    """Call the Groq API with the given messages."""
    if not GROQ_API_KEY:
        return "Error: GROQ_API_KEY is not configured. Please set it in environment variables."

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": MODEL_NAME,
        "messages": messages,
        "temperature": temperature,
        "max_tokens": 4096,
    }

    try:
        async with httpx.AsyncClient(timeout=60) as client:
            response = await client.post(GROQ_API_URL, headers=headers, json=payload)

        if response.status_code != 200:
            return f"Error: API returned status {response.status_code}: {response.text[:200]}"

        data = response.json()
        return data["choices"][0]["message"]["content"]
    except Exception as e:
        return f"Error generating response: {str(e)}"


async def generate_response(prompt: str, context: str = "") -> str:
    """Generate a response using Groq with optional context."""
    full_prompt = prompt
    if context:
        full_prompt = f"""Use the following context to answer the question. 
If the context doesn't contain relevant information, use your general knowledge but mention that.

CONTEXT:
{context}

QUESTION/REQUEST:
{prompt}"""

    messages = [
        {"role": "system", "content": "You are a helpful AI assistant for college students."},
        {"role": "user", "content": full_prompt},
    ]
    return await _call_groq(messages)


async def generate_study_response(question: str, material_text: str) -> str:
    """Generate a study-related answer using uploaded material as context."""
    messages = [
        {"role": "system", "content": "You are Study Buddy, an AI learning assistant. Help students understand concepts, explain topics clearly, provide examples, and assist with study-related questions. Be encouraging and educational."},
        {"role": "user", "content": f"""A student has uploaded study materials and is asking a question.
Answer the question thoroughly based on the provided study material. If the material doesn't cover the topic, 
say so and provide a general answer.

STUDY MATERIAL:
{material_text[:8000]}

STUDENT'S QUESTION:
{question}

Provide a clear, educational response with examples where appropriate."""},
    ]
    return await _call_groq(messages)


async def generate_summary(text: str) -> str:
    """Summarize study material."""
    messages = [
        {"role": "system", "content": "You are an expert at summarizing educational content clearly and concisely."},
        {"role": "user", "content": f"""Summarize the following study material in a clear, structured way. 
Use bullet points and headers where appropriate. Highlight key concepts.

MATERIAL:
{text[:8000]}

Provide a comprehensive yet concise summary."""},
    ]
    return await _call_groq(messages)


async def generate_quiz(text: str, num_questions: int = 5) -> str:
    """Generate quiz questions from study material."""
    messages = [
        {"role": "system", "content": "You are an expert quiz creator for educational purposes."},
        {"role": "user", "content": f"""Based on the following study material, generate {num_questions} quiz questions.

For each question provide:
1. The question
2. Four options (A, B, C, D)
3. The correct answer
4. A brief explanation

Format each question clearly with numbering.

STUDY MATERIAL:
{text[:8000]}"""},
    ]
    return await _call_groq(messages)


async def generate_aptitude_questions(topic: str = "general") -> str:
    """Generate aptitude questions for placement prep."""
    messages = [
        {"role": "system", "content": "You are a placement preparation expert who creates high-quality aptitude questions."},
        {"role": "user", "content": f"""Generate 5 aptitude questions for placement preparation on the topic: {topic}.

For each question:
1. State the question clearly
2. Provide 4 options (A, B, C, D)
3. Give the correct answer
4. Provide a step-by-step solution

Cover topics like: quantitative aptitude, logical reasoning, verbal ability, and data interpretation.
Make them similar to questions asked in actual placement tests."""},
    ]
    return await _call_groq(messages)


async def generate_resume_tips(resume_text: str = "") -> str:
    """Generate resume improvement tips."""
    if resume_text:
        content = f"""Review the following resume content and provide detailed improvement suggestions:

RESUME:
{resume_text[:4000]}

Provide:
1. Overall assessment
2. Specific improvements for each section
3. Keywords to add for ATS optimization
4. Formatting suggestions
5. Common mistakes to avoid"""
    else:
        content = """Provide comprehensive resume tips for a college student preparing for placements:

1. Essential sections to include
2. How to write impactful bullet points
3. Action verbs to use
4. Common mistakes to avoid
5. Tips for ATS-friendly resumes
6. How to highlight projects and internships
7. Sample formats and templates advice"""

    messages = [
        {"role": "system", "content": "You are a senior career advisor and resume expert with 15+ years of experience."},
        {"role": "user", "content": content},
    ]
    return await _call_groq(messages)


async def generate_resume_review(resume_text: str) -> str:
    """Perform a comprehensive resume review with mistake detection and tips."""
    messages = [
        {"role": "system", "content": "You are a senior HR recruiter and career coach with 15+ years of experience reviewing resumes."},
        {"role": "user", "content": f"""A student has uploaded their resume for review. Analyze it thoroughly and provide actionable feedback.

RESUME CONTENT:
{resume_text[:6000]}

Provide a detailed review in the following format:

## 📊 Overall Score: X/10

## ✅ What's Good
- List things that are done well

## ❌ Mistakes Found
- List each mistake clearly
- Explain WHY it's a mistake
- Tell the user EXACTLY how to fix it

## 💡 Missing Sections
- List any important sections that are missing (e.g., Skills, Projects, Certifications)

## 🔑 Keywords & ATS Optimization
- Suggest industry keywords that are missing
- Tips to pass Applicant Tracking Systems

## 📝 Specific Improvements
For each section of the resume, provide:
1. What to change
2. Example of how to rewrite it better

## 🎯 Action Items (Priority Order)
1. Most important fix first
2. Second priority
3. Third priority
(list at least 5 actionable items)

Be specific, honest, and encouraging. Use real examples from their resume when pointing out mistakes."""},
    ]
    return await _call_groq(messages)


async def generate_resume_chat_response(question: str, resume_text: str) -> str:
    """Answer questions about the user's resume and provide contextual advice."""
    messages = [
        {"role": "system", "content": "You are a career advisor and resume expert. Always reference specific parts of the student's resume in your answer. Be practical and actionable."},
        {"role": "user", "content": f"""The student has uploaded their resume and is asking a question about it.

STUDENT'S RESUME:
{resume_text[:6000]}

STUDENT'S QUESTION:
{question}

Provide a helpful, specific response based on their actual resume content."""},
    ]
    return await _call_groq(messages)


async def mock_interview_response(
    question: str, answer: str, role: str = "Software Engineer"
) -> str:
    """Provide mock interview feedback."""
    messages = [
        {"role": "system", "content": f"You are an experienced interviewer conducting a mock interview for a {role} position. Be encouraging but honest in your feedback."},
        {"role": "user", "content": f"""The candidate was asked: "{question}"
The candidate answered: "{answer}"

Provide:
1. Rating (1-10)
2. What was good about the answer
3. Areas for improvement
4. A model answer for comparison
5. Follow-up question to ask next"""},
    ]
    return await _call_groq(messages)


async def generate_interview_question(role: str = "Software Engineer", round_type: str = "technical") -> str:
    """Generate an interview question."""
    messages = [
        {"role": "system", "content": "You are an expert interviewer. Generate clear, commonly-asked interview questions appropriate for college students and fresh graduates."},
        {"role": "user", "content": f"Generate one {round_type} interview question for a {role} position. Just provide the question, nothing else."},
    ]
    return await _call_groq(messages, temperature=0.9)
