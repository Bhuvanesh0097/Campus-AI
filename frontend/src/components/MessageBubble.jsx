import ReactMarkdown from 'react-markdown';

export default function MessageBubble({ role, content, timestamp }) {
    const isUser = role === 'user';

    return (
        <div className={`message-bubble ${isUser ? 'user' : 'assistant'}`}>
            {!isUser && (
                <div className="msg-avatar">
                    <span>🤖</span>
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
          max-width: 85%;
          animation: fadeIn 0.3s ease;
        }

        .message-bubble.user {
          align-self: flex-end;
          flex-direction: row-reverse;
        }

        .message-bubble.assistant {
          align-self: flex-start;
        }

        .msg-avatar {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-full);
          background: linear-gradient(135deg, var(--primary), var(--accent));
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
          border-radius: var(--radius-md);
          font-size: 0.9rem;
          line-height: 1.6;
          word-wrap: break-word;
        }

        .user .msg-content {
          background: linear-gradient(135deg, var(--primary), var(--primary-dark));
          color: white;
          border-bottom-right-radius: 4px;
        }

        .assistant .msg-content {
          background: var(--bg-glass);
          border: 1px solid var(--border);
          color: var(--text-primary);
          border-bottom-left-radius: 4px;
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
        }

        .msg-content ul, .msg-content ol {
          margin: 8px 0;
          padding-left: 20px;
        }

        .msg-content li {
          margin-bottom: 4px;
        }

        .inline-code {
          background: rgba(108, 99, 255, 0.15);
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.85em;
          font-family: 'Courier New', monospace;
        }

        .code-block {
          background: var(--bg-primary);
          padding: 12px 16px;
          border-radius: var(--radius-sm);
          overflow-x: auto;
          margin: 8px 0;
          font-size: 0.85rem;
          border: 1px solid var(--border);
        }

        .code-block code {
          font-family: 'Courier New', monospace;
        }

        .msg-time {
          font-size: 0.7rem;
          color: var(--text-muted);
          padding: 0 4px;
        }

        .user .msg-time {
          text-align: right;
        }
      `}</style>
        </div>
    );
}
