import { useState, useEffect, useCallback } from 'react';
import ChatWindow from '../components/ChatWindow';
import FileUpload from '../components/FileUpload';
import { studyApi, chatApi } from '../services/api';
import {
    HiOutlineDocumentText,
    HiOutlineTrash,
    HiOutlineSparkles,
    HiOutlineListBullet,
    HiOutlineAcademicCap,
} from 'react-icons/hi2';

export default function StudyBuddy() {
    const [materials, setMaterials] = useState([]);
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [sessionId, setSessionId] = useState(null);

    const loadMaterials = useCallback(async () => {
        try {
            const res = await studyApi.listMaterials();
            setMaterials(res.materials || []);
        } catch (err) {
            console.error('Failed to load materials:', err);
        }
    }, []);

    useEffect(() => {
        loadMaterials();
        initSession();
    }, [loadMaterials]);

    const initSession = async () => {
        try {
            const res = await chatApi.createSession('study_buddy', 'Study Session');
            setSessionId(res.session?.id);
        } catch (err) {
            console.error('Failed to create session:', err);
        }
    };

    const handleUpload = async (file) => {
        setUploading(true);
        try {
            const res = await studyApi.upload(file);
            await loadMaterials();
            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    content: `📄 **${file.name}** uploaded successfully!\n\n${res.message}\n\nYou can now ask questions about this material, generate a summary, or create a quiz.`,
                },
            ]);
            if (res.material) {
                setSelectedMaterial(res.material.id);
            }
        } catch (err) {
            setMessages((prev) => [
                ...prev,
                { role: 'assistant', content: `❌ Upload failed: ${err.message}` },
            ]);
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteMaterial = async (id, e) => {
        e.stopPropagation();
        try {
            await studyApi.deleteMaterial(id);
            setMaterials((prev) => prev.filter((m) => m.id !== id));
            if (selectedMaterial === id) setSelectedMaterial(null);
        } catch (err) {
            console.error('Failed to delete:', err);
        }
    };

    const handleSendMessage = async (content) => {
        setMessages((prev) => [...prev, { role: 'user', content }]);
        setLoading(true);

        try {
            if (sessionId) {
                const res = await chatApi.sendMessage(sessionId, content);
                setMessages((prev) => [
                    ...prev,
                    { role: 'assistant', content: res.assistant_message },
                ]);
            } else {
                const res = await studyApi.ask(content, selectedMaterial);
                setMessages((prev) => [
                    ...prev,
                    { role: 'assistant', content: res.answer },
                ]);
            }
        } catch (err) {
            setMessages((prev) => [
                ...prev,
                { role: 'assistant', content: `❌ Error: ${err.message}` },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleSummarize = async () => {
        if (!selectedMaterial) return;
        setMessages((prev) => [
            ...prev,
            { role: 'user', content: '📝 Summarize this material' },
        ]);
        setLoading(true);
        try {
            const res = await studyApi.summarize(selectedMaterial);
            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    content: `## Summary of ${res.file_name}\n\n${res.summary}`,
                },
            ]);
        } catch (err) {
            setMessages((prev) => [
                ...prev,
                { role: 'assistant', content: `❌ Error: ${err.message}` },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleQuiz = async () => {
        if (!selectedMaterial) return;
        setMessages((prev) => [
            ...prev,
            { role: 'user', content: '🧠 Generate a quiz from this material' },
        ]);
        setLoading(true);
        try {
            const res = await studyApi.quiz(selectedMaterial, 5);
            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    content: `## Quiz from ${res.file_name}\n\n${res.quiz}`,
                },
            ]);
        } catch (err) {
            setMessages((prev) => [
                ...prev,
                { role: 'assistant', content: `❌ Error: ${err.message}` },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="chat-page">
            <div className="chat-sidebar-panel">
                <FileUpload onUpload={handleUpload} loading={uploading} />

                {materials.length > 0 && (
                    <div className="card" style={{ padding: '16px' }}>
                        <h3
                            style={{
                                fontSize: '0.85rem',
                                fontWeight: 600,
                                marginBottom: '12px',
                                color: 'var(--text-secondary)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                            }}
                        >
                            📚 Your Materials
                        </h3>
                        <div className="materials-list">
                            {materials.map((m) => (
                                <div
                                    key={m.id}
                                    className={`material-item ${selectedMaterial === m.id ? 'active' : ''}`}
                                    onClick={() => setSelectedMaterial(m.id)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => e.key === 'Enter' && setSelectedMaterial(m.id)}
                                >
                                    <HiOutlineDocumentText className="mat-icon" />
                                    <span className="mat-name">{m.file_name}</span>
                                    <button
                                        className="mat-delete"
                                        onClick={(e) => handleDeleteMaterial(m.id, e)}
                                        title="Delete"
                                        aria-label={`Delete ${m.file_name}`}
                                    >
                                        <HiOutlineTrash />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {selectedMaterial && (
                    <div className="action-buttons">
                        <button
                            className="btn btn-secondary btn-sm"
                            onClick={handleSummarize}
                            disabled={loading}
                        >
                            <HiOutlineListBullet /> Summarize
                        </button>
                        <button
                            className="btn btn-secondary btn-sm"
                            onClick={handleQuiz}
                            disabled={loading}
                        >
                            <HiOutlineAcademicCap /> Quiz Me
                        </button>
                    </div>
                )}
            </div>

            <div className="chat-main-panel">
                <ChatWindow
                    messages={messages}
                    onSendMessage={handleSendMessage}
                    loading={loading}
                    placeholder="Ask about your study materials… I'm here to help! 📖"
                    emptyMessage="Upload a PDF to get started! I can answer questions, summarize, and generate quizzes for you."
                    emptyIcon="📚"
                />
            </div>
        </div>
    );
}
