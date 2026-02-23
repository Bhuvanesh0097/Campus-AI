import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiOutlineSparkles, HiOutlineEnvelope, HiOutlineLockClosed } from 'react-icons/hi2';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signIn, configured } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!configured) {
            navigate('/study-buddy');
            return;
        }

        try {
            const { error } = await signIn(email, password);
            if (error) {
                setError(error.message);
            } else {
                navigate('/study-buddy');
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card glass-card">
                <div className="auth-logo">
                    <div className="logo-icon">
                        <HiOutlineSparkles />
                    </div>
                    <span className="logo-text">CampusAI</span>
                </div>

                <h1>Welcome back! 👋</h1>
                <p className="subtitle">
                    We missed you! Sign in and let's get learning together.
                </p>

                {!configured && (
                    <div className="demo-notice">
                        <span className="demo-icon">💡</span>
                        <div>
                            <strong>Demo Mode</strong>
                            <p>
                                Supabase isn't configured yet. Click below to explore
                                the app freely!
                            </p>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="error-msg" role="alert">
                        <span>⚠️</span> {error}
                    </div>
                )}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="login-email">Email</label>
                        <div className="auth-input-wrapper">
                            <span className="auth-input-icon">
                                <HiOutlineEnvelope />
                            </span>
                            <input
                                id="login-email"
                                type="email"
                                className="input auth-input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                required={configured}
                                autoComplete="email"
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label htmlFor="login-password">Password</label>
                        <div className="auth-input-wrapper">
                            <span className="auth-input-icon">
                                <HiOutlineLockClosed />
                            </span>
                            <input
                                id="login-password"
                                type="password"
                                className="input auth-input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Your password"
                                required={configured}
                                autoComplete="current-password"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-lg"
                        disabled={loading}
                        style={{ width: '100%', marginTop: '4px' }}
                        id="login-submit-btn"
                    >
                        {loading ? (
                            <>
                                <div className="spinner" style={{ width: 18, height: 18 }} />
                                Signing in…
                            </>
                        ) : !configured ? (
                            '🚀 Enter Demo Mode'
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    Don't have an account?{' '}
                    <Link to="/signup">Create one — it's free!</Link>
                </div>
            </div>

            <style>{`
                .demo-notice {
                    display: flex;
                    gap: 12px;
                    padding: 14px 16px;
                    background: var(--warning-pale);
                    border: 1px solid rgba(251, 191, 36, 0.15);
                    border-radius: var(--radius-sm);
                    margin-bottom: 8px;
                    font-size: 0.85rem;
                    color: var(--text-primary);
                    animation: slideDown 0.3s ease;
                }

                .demo-notice .demo-icon {
                    font-size: 1.3rem;
                    flex-shrink: 0;
                    margin-top: 2px;
                }

                .demo-notice strong {
                    font-weight: 600;
                    display: block;
                    margin-bottom: 2px;
                    color: var(--warning);
                }

                .demo-notice p {
                    color: var(--text-secondary);
                    font-size: 0.8rem;
                    line-height: 1.4;
                    margin: 0;
                }

                .auth-input-wrapper {
                    position: relative;
                    display: flex;
                    align-items: center;
                }

                .auth-input-icon {
                    position: absolute;
                    left: 14px;
                    color: var(--text-muted);
                    font-size: 1.1rem;
                    display: flex;
                    pointer-events: none;
                    transition: color var(--transition-fast);
                    z-index: 1;
                }

                .auth-input {
                    padding-left: 42px !important;
                    width: 100%;
                }

                .auth-input-wrapper:focus-within .auth-input-icon {
                    color: var(--primary);
                }
            `}</style>
        </div>
    );
}
