import ReactMarkdown from 'react-markdown';

export default function MessageBubble({ role, content, timestamp }) {
  const isUser = role === 'user';

  return (
    <div className={`message-bubble ${isUser ? 'user' : 'assistant'}`}>
      {!isUser && (
        <div className="msg-avatar" aria-hidden="true">
          <span>✨</span>
        </div>
      )}
      <div className="msg-body">
        <div className="msg-content">
          {isUser ? (
            <p>{content}</p>
          ) : (
            <ReactMarkdown
              components={{
                p: ({ children }) => <p>{children}</p>,
                code: ({ inline, children }) =>
                  inline ? (
                    <code className="inline-code">{children}</code>
                  ) : (
                    <pre className="code-block">
                      <code>{children}</code>
                    </pre>
                  ),
              }}
            >
              {content}
            </ReactMarkdown>
          )}
        </div>
        {timestamp && (
          <span className="msg-time">
            {new Date(timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        )}
      </div>

      <style>{`
                .message-bubble {
                    display: flex;
                    gap: 10px;
                    max-width: 80%;
                    animation: fadeIn 0.35s ease;
                }

                .message-bubble.user {
                    align-self: flex-end;
                    flex-direction: row-reverse;
                }

                .message-bubble.assistant {
                    align-self: flex-start;
                }

                .msg-avatar {
                    width: 34px;
                    height: 34px;
                    border-radius: var(--radius-full);
                    background: linear-gradient(135deg, var(--primary-pale), var(--accent-pale));
                    border: 1px solid rgba(124, 156, 255, 0.15);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.9rem;
                    flex-shrink: 0;
                    margin-top: 2px;
                }

                .msg-body {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }

                .msg-content {
                    padding: 12px 16px;
                    font-size: 0.9rem;
                    line-height: 1.65;
                    word-wrap: break-word;
                }

                .user .msg-content {
                    background: var(--primary);
                    color: var(--text-inverse);
                    border-radius: 20px 20px 4px 20px;
                    box-shadow: var(--shadow-primary);
                }

                .assistant .msg-content {
                    background: var(--bg-elevated);
                    border: 1px solid var(--border);
                    color: var(--text-primary);
                    border-radius: 20px 20px 20px 4px;
                    box-shadow: var(--shadow-xs);
                }

                .msg-content p {
                    margin: 0 0 8px 0;
                }

                .msg-content p:last-child {
                    margin-bottom: 0;
                }

                .msg-content h1, .msg-content h2, .msg-content h3,
                .msg-content h4, .msg-content h5, .msg-content h6 {
                    margin: 12px 0 6px;
                    font-weight: 600;
                    color: var(--text-primary);
                }

                .msg-content ul, .msg-content ol {
                    margin: 8px 0;
                    padding-left: 20px;
                }

                .msg-content li {
                    margin-bottom: 4px;
                }

                .msg-content strong {
                    font-weight: 600;
                }

                .inline-code {
                    background: var(--primary-pale);
                    color: var(--primary);
                    padding: 2px 7px;
                    border-radius: 4px;
                    font-size: 0.85em;
                    font-family: 'SF Mono', 'Fira Code', 'Courier New', monospace;
                    font-weight: 500;
                }

                .user .inline-code {
                    background: rgba(255, 255, 255, 0.2);
                    color: white;
                }

                .code-block {
                    background: #0D1117;
                    color: #E2E8F0;
                    padding: 14px 16px;
                    border-radius: var(--radius-sm);
                    overflow-x: auto;
                    margin: 10px 0;
                    font-size: 0.83rem;
                    border: 1px solid var(--border);
                }

                .code-block code {
                    font-family: 'SF Mono', 'Fira Code', 'Courier New', monospace;
                }

                .msg-time {
                    font-size: 0.7rem;
                    color: var(--text-muted);
                    padding: 0 4px;
                }

                .user .msg-time {
                    text-align: right;
                }

                @media (max-width: 768px) {
                    .message-bubble {
                        max-width: 88%;
                    }

                    .msg-content {
                        padding: 10px 14px;
                        font-size: 0.87rem;
                    }

                    .msg-avatar {
                        width: 28px;
                        height: 28px;
                        font-size: 0.75rem;
                    }
                }
            `}</style>
    </div>
  );
}
