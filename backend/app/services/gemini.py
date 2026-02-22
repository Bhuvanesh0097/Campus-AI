import os
import google.generativeai as genai

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

MODEL_NAME = "gemini-2.0-flash"


def get_model():
    """Get the Gemini generative model."""
    return genai.GenerativeModel(MODEL_NAME)


async def generate_response(prompt: str, context: str = "") -> str:
    """Generate a response using Gemini with optional context."""
    model = get_model()
    full_prompt = prompt
    if context:
        full_prompt = f"""Use the following context to answer the question. 
If the context doesn't contain relevant information, use your general knowledge but mention that.

CONTEXT:
{context}

QUESTION/REQUEST:
{prompt}"""
    try:
        response = model.generate_content(full_prompt)
        return response.text
    except Exception as e:
        return f"I'm sorry, I encountered an error generating a response: {str(e)}"


async def generate_study_response(question: str, material_text: str) -> str:
    """Generate a study-related answer using uploaded material as context."""
    prompt = f"""You are a helpful Study Buddy AI assistant. A student has uploaded study materials and is asking a question.
Answer the question thoroughly based on the provided study material. If the material doesn't cover the topic, 
say so and provide a general answer.

STUDY MATERIAL:
{material_text[:8000]}

STUDENT'S QUESTION:
{question}

Provide a clear, educational response with examples where appropriate."""
    model = get_model()
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Error generating study response: {str(e)}"


async def generate_summary(text: str) -> str:
    """Summarize study material."""
    prompt = f"""Summarize the following study material in a clear, structured way. 
Use bullet points and headers where appropriate. Highlight key concepts.

MATERIAL:
{text[:8000]}

Provide a comprehensive yet concise summary."""
    model = get_model()
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Error generating summary: {str(e)}"


async def generate_quiz(text: str, num_questions: int = 5) -> str:
    """Generate quiz questions from study material."""
    prompt = f"""Based on the following study material, generate {num_questions} quiz questions.

For each question provide:
1. The question
2. Four options (A, B, C, D)
3. The correct answer
4. A brief explanation

Format each question clearly with numbering.

STUDY MATERIAL:
{text[:8000]}"""
    model = get_model()
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Error generating quiz: {str(e)}"


async def generate_aptitude_questions(topic: str = "general") -> str:
    """Generate aptitude questions for placement prep."""
    prompt = f"""Generate 5 aptitude questions for placement preparation on the topic: {topic}.

For each question:
1. State the question clearly
2. Provide 4 options (A, B, C, D)
3. Give the correct answer
4. Provide a step-by-step solution

Cover topics like: quantitative aptitude, logical reasoning, verbal ability, and data interpretation.
Make them similar to questions asked in actual placement tests."""
    model = get_model()
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Error generating aptitude questions: {str(e)}"


async def generate_resume_tips(resume_text: str = "") -> str:
    """Generate resume improvement tips."""
    if resume_text:
        prompt = f"""Review the following resume content and provide detailed improvement suggestions:

RESUME:
{resume_text[:4000]}

Provide:
1. Overall assessment
2. Specific improvements for each section
3. Keywords to add for ATS optimization
4. Formatting suggestions
5. Common mistakes to avoid"""
    else:
        prompt = """Provide comprehensive resume tips for a college student preparing for placements:

1. Essential sections to include
2. How to write impactful bullet points
3. Action verbs to use
4. Common mistakes to avoid
5. Tips for ATS-friendly resumes
6. How to highlight projects and internships
7. Sample formats and templates advice"""
    model = get_model()
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Error generating resume tips: {str(e)}"


async def generate_resume_review(resume_text: str) -> str:
    """Perform a comprehensive resume review with mistake detection and tips."""
    prompt = f"""You are a senior HR recruiter and career coach with 15+ years of experience reviewing resumes.
A student has uploaded their resume for review. Analyze it thoroughly and provide actionable feedback.

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

Be specific, honest, and encouraging. Use real examples from their resume when pointing out mistakes."""
    model = get_model()
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Error reviewing resume: {str(e)}"


async def generate_resume_chat_response(question: str, resume_text: str) -> str:
    """Answer questions about the user's resume and provide contextual advice."""
    prompt = f"""You are a career advisor and resume expert. The student has uploaded their resume and is asking a question about it.

STUDENT'S RESUME:
{resume_text[:6000]}

STUDENT'S QUESTION:
{question}

Provide a helpful, specific response based on their actual resume content. If they ask:
- About improving a section → give specific rewriting suggestions with examples
- About adding something → explain where and how to add it
- About mistakes → point out the exact issue and how to fix it
- About job-specific tailoring → suggest specific changes for that role
- General questions → give advice relevant to their resume's current state

Always reference specific parts of their resume in your answer. Be practical and actionable."""
    model = get_model()
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Error generating resume advice: {str(e)}"


async def mock_interview_response(
    question: str, answer: str, role: str = "Software Engineer"
) -> str:
    """Provide mock interview feedback."""
    prompt = f"""You are an experienced interviewer conducting a mock interview for a {role} position.

The candidate was asked: "{question}"
The candidate answered: "{answer}"

Provide:
1. Rating (1-10)
2. What was good about the answer
3. Areas for improvement
4. A model answer for comparison
5. Follow-up question to ask next

Be encouraging but honest in your feedback."""
    model = get_model()
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Error generating interview feedback: {str(e)}"


async def generate_interview_question(role: str = "Software Engineer", round_type: str = "technical") -> str:
    """Generate an interview question."""
    prompt = f"""Generate one {round_type} interview question for a {role} position.

The question should be:
- Appropriate for a college student/fresh graduate
- Clear and specific
- Commonly asked in actual interviews

Just provide the question, nothing else."""
    model = get_model()
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Error generating question: {str(e)}"
