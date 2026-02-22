import { supabase } from './supabase';

const API_URL = import.meta.env.VITE_API_URL || '';

async function getAuthHeaders() {
    if (!supabase) {
        return { 'Content-Type': 'application/json' };
    }
    try {
        const { data: { session } } = await supabase.auth.getSession();
        return {
            'Content-Type': 'application/json',
            ...(session?.access_token && {
                Authorization: `Bearer ${session.access_token}`,
            }),
        };
    } catch {
        return { 'Content-Type': 'application/json' };
    }
}

async function request(endpoint, options = {}) {
    const headers = await getAuthHeaders();
    const url = `${API_URL}${endpoint}`;

    const res = await fetch(url, {
        ...options,
        headers: {
            ...headers,
            ...options.headers,
        },
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({ detail: 'Request failed' }));
        throw new Error(error.detail || `HTTP ${res.status}`);
    }

    return res.json();
}

async function uploadFile(endpoint, file) {
    let session = null;
    if (supabase) {
        try {
            const result = await supabase.auth.getSession();
            session = result.data?.session;
        } catch { }
    }
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
            ...(session?.access_token && {
                Authorization: `Bearer ${session.access_token}`,
            }),
        },
        body: formData,
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({ detail: 'Upload failed' }));
        throw new Error(error.detail || `HTTP ${res.status}`);
    }

    return res.json();
}

// ===== Chat =====
export const chatApi = {
    createSession: (module, title) =>
        request('/api/chat/sessions', {
            method: 'POST',
            body: JSON.stringify({ module, title }),
        }),
    listSessions: () => request('/api/chat/sessions'),
    getMessages: (sessionId) =>
        request(`/api/chat/sessions/${sessionId}/messages`),
    sendMessage: (sessionId, content) =>
        request(`/api/chat/sessions/${sessionId}/messages`, {
            method: 'POST',
            body: JSON.stringify({ content }),
        }),
    deleteSession: (sessionId) =>
        request(`/api/chat/sessions/${sessionId}`, { method: 'DELETE' }),
};

// ===== Study Buddy =====
export const studyApi = {
    upload: (file) => uploadFile('/api/study/upload', file),
    listMaterials: () => request('/api/study/materials'),
    deleteMaterial: (id) =>
        request(`/api/study/materials/${id}`, { method: 'DELETE' }),
    ask: (question, materialId) =>
        request('/api/study/ask', {
            method: 'POST',
            body: JSON.stringify({ question, material_id: materialId }),
        }),
    summarize: (materialId) =>
        request('/api/study/summarize', {
            method: 'POST',
            body: JSON.stringify({ material_id: materialId }),
        }),
    quiz: (materialId, numQuestions = 5) =>
        request('/api/study/quiz', {
            method: 'POST',
            body: JSON.stringify({ material_id: materialId, num_questions: numQuestions }),
        }),
};

// ===== Placement Prep =====
export const placementApi = {
    aptitude: (topic = 'general') =>
        request('/api/placement/aptitude', {
            method: 'POST',
            body: JSON.stringify({ topic }),
        }),
    uploadResume: (file) => uploadFile('/api/placement/resume-upload', file),
    resumeTips: (resumeText = '') =>
        request('/api/placement/resume-tips', {
            method: 'POST',
            body: JSON.stringify({ resume_text: resumeText }),
        }),
    resumeAsk: (question) =>
        request('/api/placement/resume-ask', {
            method: 'POST',
            body: JSON.stringify({ question }),
        }),
    mockInterview: (question, answer, role = 'Software Engineer') =>
        request('/api/placement/mock-interview', {
            method: 'POST',
            body: JSON.stringify({ question, answer, role }),
        }),
    getQuestion: (role = 'Software Engineer', roundType = 'technical') =>
        request('/api/placement/interview-question', {
            method: 'POST',
            body: JSON.stringify({ role, round_type: roundType }),
        }),
};

// ===== Feedback =====
export const feedbackApi = {
    submit: (category, subject, rating, comments) =>
        request('/api/feedback/submit', {
            method: 'POST',
            body: JSON.stringify({ category, subject, rating, comments }),
        }),
    myResponses: () => request('/api/feedback/my-responses'),
};

// ===== Analytics (Admin) =====
export const analyticsApi = {
    summary: () => request('/api/analytics/summary'),
    sentiment: () => request('/api/analytics/sentiment'),
    ratingsOverTime: () => request('/api/analytics/ratings-over-time'),
};
