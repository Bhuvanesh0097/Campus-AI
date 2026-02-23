import { useState, useEffect } from 'react';
import ChatWindow from '../components/ChatWindow';
import FileUpload from '../components/FileUpload';
import { placementApi, chatApi } from '../services/api';
import { HiOutlineDocumentCheck } from 'react-icons/hi2';

export default function PlacementPrep() {
    const [mode, setMode] = useState('aptitude');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sessionId, setSessionId] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState('');
    const [resumeUploaded, setResumeUploaded] = useState(false);
    const [uploadingResume, setUploadingResume] = useState(false);

    const modes = [
        { id: 'aptitude', label: '📊 Aptitude', desc: 'Practice aptitude questions' },
        { id: 'resume', label: '📄 Resume', desc: 'Upload & review your resume' },
        { id: 'interview', label: '🎤 Mock Interview', desc: 'Practice with AI interviewer' },
    ];

    useEffect(() => {
        initSession();
    }, []);

    // Reset messages when mode changes
    useEffect(() => {
        setMessages([]);
        setCurrentQuestion('');
    }, [mode]);

    const initSession = async () => {
        try {
            const res = await chatApi.createSession('placement_prep', 'Placement Prep');
            setSessionId(res.session?.id);
        } catch (err) {
            console.error('Failed to create session:', err);
        }
    };

    const handleResumeUpload = async (file) => {
        if (!file.name.toLowerCase().endsWith('.pdf')) {
            setMessages((prev) => [
                ...prev,
                { role: 'assistant', content: '❌ Please upload a PDF file only.' },
            ]);
            return;
        }

        setUploadingResume(true);
        setMessages((prev) => [
            ...prev,
            { role: 'user', content: `📄 Uploading resume: ${file.name}` },
        ]);

        try {
            const res = await placementApi.uploadResume(file);
            setResumeUploaded(true);
            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    content: `✅ **${res.file_name}** uploaded successfully!\n\nHere's my detailed review of your resume:\n\n---\n\n${res.review}`,
                },
            ]);
        } catch (err) {
            setMessages((prev) => [
                ...prev,
                { role: 'assistant', content: `❌ Upload failed: ${err.message}` },
            ]);
        } finally {
            setUploadingResume(false);
        }
    };

    const handleSendMessage = async (content) => {
        setMessages((prev) => [...prev, { role: 'user', content }]);
        setLoading(true);

        try {
            if (mode === 'aptitude') {
                const res = await placementApi.aptitude(content || 'general');
                setMessages((prev) => [
                    ...prev,
                    { role: 'assistant', content: res.questions },
                ]);
            } else if (mode === 'resume') {
                if (resumeUploaded) {
                    const res = await placementApi.resumeAsk(content);
                    setMessages((prev) => [
                        ...prev,
                        { role: 'assistant', content: res.answer },
                    ]);
                } else {
                    const res = await placementApi.resumeTips(content);
                    setMessages((prev) => [
                        ...prev,
                        { role: 'assistant', content: res.tips },
                    ]);
                }
            } else if (mode === 'interview') {
                if (currentQuestion) {
                    const res = await placementApi.mockInterview(currentQuestion, content);
                    setMessages((prev) => [
                        ...prev,
                        { role: 'assistant', content: res.feedback },
                    ]);
                    setCurrentQuestion('');
                } else {
                    if (sessionId) {
                        const res = await chatApi.sendMessage(sessionId, content);
                        setMessages((prev) => [
                            ...prev,
                            { role: 'assistant', content: res.assistant_message },
                        ]);
                    }
                }
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

    const handleGetQuestion = async () => {
        setLoading(true);
        try {
            const roundType = mode === 'interview' ? 'technical' : 'aptitude';
            const res = await placementApi.getQuestion('Software Engineer', roundType);
            setCurrentQuestion(res.question);
            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    content: `🎯 **Interview Question:**\n\n${res.question}\n\n*Type your answer below and I'll give you feedback!*`,
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

    const handleGetResumeTips = async () => {
        setLoading(true);
        setMessages((prev) => [
            ...prev,
            { role: 'user', content: '💡 Give me resume tips and suggestions' },
        ]);
        try {
            const res = await placementApi.resumeTips();
            setMessages((prev) => [
                ...prev,
                { role: 'assistant', content: res.tips },
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

    const getPlaceholder = () => {
        switch (mode) {
            case 'aptitude':
                return 'Enter a topic (e.g., probability, logical reasoning)… 📊';
            case 'resume':
                return resumeUploaded
                    ? 'Ask anything about your resume… I\'m here to help! 📄'
                    : 'Paste your resume text or ask for general tips…';
            case 'interview':
                return currentQuestion
                    ? 'Type your answer… take your time! 💪'
                    : 'Ask about interviews or click "Get Question"… 🎤';
            default:
                return "Ask me anything… I'm listening";
        }
    };

    const getEmptyMsg = () => {
        switch (mode) {
            case 'aptitude':
                return 'Enter a topic to generate practice aptitude questions! Let\'s sharpen those skills 🧠';
            case 'resume':
                return 'Upload your resume PDF to get a detailed review with tips and improvements!';
            case 'interview':
                return 'Ready for a mock interview? Click "Get Question" or ask anything!';
            default:
                return 'Select a mode to get started!';
        }
    };

    const getEmptyIcon = () => {
        switch (mode) {
            case 'aptitude': return '📊';
            case 'resume': return '📄';
            case 'interview': return '🎤';
            default: return '💬';
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - var(--navbar-height) - 48px)', animation: 'fadeIn 0.4s ease' }}>
            {/* Mode Tabs */}
            <div className="mode-selector">
                {modes.map((m) => (
                    <button
                        key={m.id}
                        className={`mode-btn ${mode === m.id ? 'active' : ''}`}
                        onClick={() => {
                            setMode(m.id);
                            setCurrentQuestion('');
                        }}
                        id={`mode-${m.id}`}
                    >
                        {m.label}
                    </button>
                ))}
            </div>

            {/* Mode-specific action bars */}
            {mode === 'interview' && (
                <div className="action-buttons">
                    <button
                        className="btn btn-primary btn-sm"
                        onClick={handleGetQuestion}
                        disabled={loading}
                        id="get-question-btn"
                    >
                        🎯 Get Question
                    </button>
                    {currentQuestion && (
                        <span className="badge badge-primary" style={{ fontSize: '0.75rem' }}>
                            Answering a question…
                        </span>
                    )}
                </div>
            )}

            {mode === 'resume' && (
                <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', flex: 1, minHeight: 0 }}>
                    {/* Resume Upload Panel */}
                    <div style={{ width: '320px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto' }}>
                        <FileUpload
                            onUpload={handleResumeUpload}
                            loading={uploadingResume}
                            accept=".pdf"
                            title="Upload Your Resume"
                            subtitle="Drag & drop your resume PDF or click to browse"
                        />

                        {resumeUploaded && (
                            <div className="card" style={{ padding: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <HiOutlineDocumentCheck style={{ fontSize: '1.4rem', color: 'var(--success)' }} />
                                <div>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--success)' }}>
                                        Resume Uploaded ✓
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                        Ask questions about your resume below
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="action-buttons" style={{ flexDirection: 'column' }}>
                            <button
                                className="btn btn-secondary btn-sm"
                                onClick={handleGetResumeTips}
                                disabled={loading}
                                style={{ width: '100%' }}
                            >
                                💡 Get Resume Tips
                            </button>
                        </div>

                        {/* Quick question suggestions */}
                        {resumeUploaded && (
                            <div className="card" style={{ padding: '14px' }}>
                                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                    Try asking:
                                </div>
                                {[
                                    'What mistakes are in my resume?',
                                    'How can I improve my skills section?',
                                    'Is my resume ATS-friendly?',
                                    'Rewrite my experience section better',
                                ].map((q) => (
                                    <button
                                        key={q}
                                        className="btn btn-ghost btn-sm"
                                        style={{ width: '100%', justifyContent: 'flex-start', fontSize: '0.8rem', padding: '8px 10px', marginBottom: '4px' }}
                                        onClick={() => handleSendMessage(q)}
                                        disabled={loading}
                                    >
                                        → {q}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Chat Area */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                        <ChatWindow
                            messages={messages}
                            onSendMessage={handleSendMessage}
                            loading={loading}
                            placeholder={getPlaceholder()}
                            emptyMessage={getEmptyMsg()}
                            emptyIcon={getEmptyIcon()}
                        />
                    </div>
                </div>
            )}

            {/* For non-resume modes, just show the chat */}
            {mode !== 'resume' && (
                <ChatWindow
                    messages={messages}
                    onSendMessage={handleSendMessage}
                    loading={loading}
                    placeholder={getPlaceholder()}
                    emptyMessage={getEmptyMsg()}
                    emptyIcon={getEmptyIcon()}
                />
            )}
        </div>
    );
}
