import { forwardRef } from 'react';

const Input = forwardRef(function Input(
    {
        label,
        hint,
        error,
        icon: Icon,
        id,
        className = '',
        ...props
    },
    ref
) {
    return (
        <div className={`form-input-group ${error ? 'has-error' : ''} ${className}`}>
            {label && (
                <label htmlFor={id} className="form-label">
                    {label}
                </label>
            )}
            <div className="form-input-wrapper">
                {Icon && (
                    <span className="form-input-icon">
                        <Icon />
                    </span>
                )}
                <input
                    ref={ref}
                    id={id}
                    className={`form-input ${Icon ? 'has-icon' : ''}`}
                    {...props}
                />
            </div>
            {hint && !error && (
                <span className="form-hint">{hint}</span>
            )}
            {error && (
                <span className="form-error">{error}</span>
            )}

            <style>{`
                .form-input-group {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }

                .form-label {
                    font-size: 0.85rem;
                    font-weight: 600;
                    color: var(--text-primary);
                }

                .form-input-wrapper {
                    position: relative;
                    display: flex;
                    align-items: center;
                }

                .form-input-icon {
                    position: absolute;
                    left: 14px;
                    color: var(--text-muted);
                    font-size: 1.1rem;
                    display: flex;
                    pointer-events: none;
                    transition: color var(--transition-fast);
                }

                .form-input {
                    width: 100%;
                    padding: 13px 16px;
                    background: var(--bg-input);
                    border: 1.5px solid var(--border);
                    border-radius: var(--radius-sm);
                    color: var(--text-primary);
                    font-size: 0.9rem;
                    transition: all var(--transition-fast);
                    font-family: inherit;
                }

                .form-input.has-icon {
                    padding-left: 42px;
                }

                .form-input:hover {
                    border-color: var(--border-hover);
                }

                .form-input:focus {
                    border-color: var(--primary);
                    box-shadow: 0 0 0 3px var(--primary-glow);
                    background: var(--bg-surface);
                }

                .form-input:focus ~ .form-input-icon,
                .form-input-wrapper:focus-within .form-input-icon {
                    color: var(--primary);
                }

                .form-input::placeholder {
                    color: var(--text-muted);
                }

                .has-error .form-input {
                    border-color: var(--error);
                }

                .has-error .form-input:focus {
                    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
                }

                .form-hint {
                    font-size: 0.75rem;
                    color: var(--text-muted);
                }

                .form-error {
                    font-size: 0.75rem;
                    color: var(--error);
                    font-weight: 500;
                }
            `}</style>
        </div>
    );
});

export default Input;
