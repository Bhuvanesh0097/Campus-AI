export default function TypingIndicator() {
    return (
        <div className="typing-wrapper">
            <div className="typing-avatar">
                <span>✨</span>
            </div>
            <div className="typing-bubble">
                <div className="typing-dot" />
                <div className="typing-dot" />
                <div className="typing-dot" />
            </div>

            <style>{`
                .typing-wrapper {
                    display: flex;
                    align-items: flex-end;
                    gap: 10px;
                    align-self: flex-start;
                    animation: fadeIn 0.3s ease;
                }

                .typing-avatar {
                    width: 32px;
                    height: 32px;
                    border-radius: var(--radius-full);
                    background: linear-gradient(135deg, var(--primary-pale), var(--accent-pale));
                    border: 1.5px solid var(--accent);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.85rem;
                    flex-shrink: 0;
                    animation: float 2s ease-in-out infinite;
                }

                .typing-bubble {
                    display: flex;
                    gap: 5px;
                    padding: 14px 18px;
                    background: var(--bg-muted);
                    border: 1px solid var(--border);
                    border-radius: 18px 18px 18px 4px;
                }

                .typing-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: var(--primary);
                    animation: typing 1.4s ease-in-out infinite;
                }

                .typing-dot:nth-child(2) {
                    animation-delay: 0.2s;
                }

                .typing-dot:nth-child(3) {
                    animation-delay: 0.4s;
                }
            `}</style>
        </div>
    );
}
