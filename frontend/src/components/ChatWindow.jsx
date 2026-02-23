import { useState, useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import { HiOutlinePaperAirplane } from 'react-icons/hi2';

export default function ChatWindow({
  messages = [],
  onSendMessage,
  placeholder = "Ask me anything… I'm listening",
  loading = false,
  emptyMessage = "It's quiet here… start the first message!",
  emptyIcon = '💬',
}) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    onSendMessage(input.trim());
    setInput('');
    // Focus back on input
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit(e);
    }
  };

  return (
    <div className="chat-window" role="region" aria-label="Chat conversation">
      <div className="chat-messages" role="log" aria-live="polite">
        {messages.length === 0 && !loading ? (
          <div className="chat-empty">
            <div className="chat-empty-illustration">
              <div className="empty-icon-circle">
                <span className="empty-icon">{emptyIcon}</span>
              </div>
              <div className="empty-dots">
                <span />
                <span />
                <span />
              </div>
            </div>
            <h3 className="chat-empty-title">Start a conversation!</h3>
            <p className="chat-empty-text">{emptyMessage}</p>
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
        {loading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      <form
        className="chat-input-bar"
        onSubmit={handleSubmit}
        role="search"
      >
        <div className="chat-input-wrapper">
          <input
            ref={inputRef}
            type="text"
            className="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={loading}
            aria-label="Type your message"
            id="chat-input-field"
            autoComplete="off"
          />
          <button
            type="submit"
            className="chat-send-btn"
            disabled={!input.trim() || loading}
            aria-label="Send message"
            id="chat-send-btn"
          >
            <HiOutlinePaperAirplane />
          </button>
        </div>
      </form>

      <style>{`
                .chat-window {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    background: var(--bg-surface);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-lg);
                    overflow: hidden;
                    box-shadow: var(--shadow-card);
                }

                .chat-messages {
                    flex: 1;
                    overflow-y: auto;
                    padding: 24px;
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    scroll-behavior: smooth;
                }

                /* ─── Empty State ─── */
                .chat-empty {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    padding: 40px 20px;
                    text-align: center;
                }

                .chat-empty-illustration {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 8px;
                }

                .empty-icon-circle {
                    width: 80px;
                    height: 80px;
                    border-radius: var(--radius-full);
                    background: linear-gradient(135deg, var(--primary-pale) 0%, var(--accent-pale) 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    animation: float 3s ease-in-out infinite;
                }

                .empty-icon {
                    font-size: 2.2rem;
                }

                .empty-dots {
                    display: flex;
                    gap: 6px;
                }

                .empty-dots span {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background: var(--border);
                    animation: typing 1.4s ease-in-out infinite;
                }

                .empty-dots span:nth-child(2) { animation-delay: 0.2s; }
                .empty-dots span:nth-child(3) { animation-delay: 0.4s; }

                .chat-empty-title {
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: var(--text-primary);
                }

                .chat-empty-text {
                    font-size: 0.9rem;
                    color: var(--text-secondary);
                    max-width: 300px;
                    line-height: 1.5;
                }

                /* ─── Input Bar ─── */
                .chat-input-bar {
                    padding: 16px 20px;
                    border-top: 1px solid var(--border);
                    background: var(--bg-surface);
                }

                .chat-input-wrapper {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 6px 6px 6px 20px;
                    background: var(--bg-muted);
                    border: 1.5px solid var(--border);
                    border-radius: var(--radius-full);
                    transition: all var(--transition-fast);
                }

                .chat-input-wrapper:focus-within {
                    border-color: var(--primary);
                    box-shadow: 0 0 0 3px var(--primary-glow);
                    background: var(--bg-surface);
                }

                .chat-input {
                    flex: 1;
                    padding: 8px 0;
                    background: transparent;
                    border: none;
                    color: var(--text-primary);
                    font-size: 0.9rem;
                    outline: none;
                }

                .chat-input::placeholder {
                    color: var(--text-muted);
                }

                .chat-send-btn {
                    width: 40px;
                    height: 40px;
                    border-radius: var(--radius-full);
                    background: var(--primary);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.05rem;
                    transition: all var(--transition-base);
                    flex-shrink: 0;
                    cursor: pointer;
                    border: none;
                    box-shadow: 0 2px 8px rgba(91, 141, 239, 0.25);
                }

                .chat-send-btn:hover:not(:disabled) {
                    background: var(--primary-hover);
                    transform: scale(1.05);
                    box-shadow: 0 4px 12px rgba(91, 141, 239, 0.35);
                }

                .chat-send-btn:active:not(:disabled) {
                    transform: scale(0.98);
                }

                .chat-send-btn:disabled {
                    opacity: 0.35;
                    cursor: not-allowed;
                    box-shadow: none;
                }

                @media (max-width: 768px) {
                    .chat-messages {
                        padding: 16px;
                    }

                    .chat-input-bar {
                        padding: 12px 16px;
                        position: sticky;
                        bottom: 0;
                    }
                }
            `}</style>
    </div>
  );
}
