import { useState, useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import { HiOutlinePaperAirplane } from 'react-icons/hi2';

export default function ChatWindow({
    messages = [],
    onSendMessage,
    placeholder = 'Type your message...',
    loading = false,
    emptyMessage = 'Start a conversation!',
}) {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;
        onSendMessage(input.trim());
        setInput('');
    };

    return (
        <div className="chat-window">
            <div className="chat-messages">
                {messages.length === 0 && !loading ? (
                    <div className="chat-empty">
                        <div className="chat-empty-icon">💬</div>
                        <p>{emptyMessage}</p>
                    </div>
                ) : (
                    messages.map((msg, i) => (
                        <MessageBubble
                            key={msg.id || i}
                            role={msg.role}
                            content={msg.content}
                            timestamp={msg.created_at}
                        />
                    ))
                )}
                {loading && (
                    <div className="typing-indicator">
                        <span />
                        <span />
                        <span />
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form className="chat-input-bar" onSubmit={handleSubmit}>
                <input
                    ref={inputRef}
                    type="text"
                    className="chat-input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={placeholder}
                    disabled={loading}
                />
                <button
                    type="submit"
                    className="chat-send-btn"
                    disabled={!input.trim() || loading}
                >
                    <HiOutlinePaperAirplane />
                </button>
            </form>

            <style>{`
        .chat-window {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          overflow: hidden;
        }

        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .chat-empty {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          gap: 12px;
        }

        .chat-empty-icon {
          font-size: 3rem;
          opacity: 0.5;
        }

        .typing-indicator {
          display: flex;
          gap: 6px;
          padding: 16px 20px;
          align-self: flex-start;
        }

        .typing-indicator span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--primary);
          animation: typing 1.4s infinite;
        }

        .typing-indicator span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing-indicator span:nth-child(3) {
          animation-delay: 0.4s;
        }

        .chat-input-bar {
          display: flex;
          gap: 8px;
          padding: 16px;
          border-top: 1px solid var(--border);
          background: var(--bg-glass);
        }

        .chat-input {
          flex: 1;
          padding: 12px 16px;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: var(--radius-full);
          color: var(--text-primary);
          font-size: 0.9rem;
          transition: all var(--transition-fast);
        }

        .chat-input:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px var(--primary-glow);
        }

        .chat-input::placeholder {
          color: var(--text-muted);
        }

        .chat-send-btn {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-full);
          background: linear-gradient(135deg, var(--primary), var(--primary-dark));
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          transition: all var(--transition-base);
          flex-shrink: 0;
        }

        .chat-send-btn:hover:not(:disabled) {
          transform: scale(1.05);
          box-shadow: 0 4px 15px var(--primary-glow);
        }

        .chat-send-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
      `}</style>
        </div>
    );
}
