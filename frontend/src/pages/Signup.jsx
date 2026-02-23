import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    HiOutlineSparkles,
    HiOutlineEnvelope,
    HiOutlineLockClosed,
    HiOutlineUser,
} from 'react-icons/hi2';

export default function Signup() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const { signUp } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            setLoading(false);
            return;
        }

        try {
            const { error } = await signUp(email, password, fullName);
            if (error) {
                setError(error.message);
            } else {
                setSuccess(true);
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="auth-page">
                <div className="auth-card glass-card" style={{ textAlign: 'center' }}>
                    <div className="success-illustration">
                        <div className="success-icon-circle">
                            <span>🎉</span>
                        </div>
                    </div>
                    <h1 style={{ marginTop: '20px' }}>You're all set!</h1>
                    <p className="subtitle">
                        Check your email for a confirmation link, then come back and sign in.
                        We can't wait to help you learn!
                    </p>
                    <Link
                        to="/login"
                        className="btn btn-primary btn-lg"
                        style={{ marginTop: '8px', width: '100%', textDecoration: 'none' }}
                    >
                        Go to Login
                    </Link>
                </div>

                <style>{`
                    .success-illustration {
                        display: flex;
                        justify-content: center;
                    }

                    .success-icon-circle {
                        width: 80px;
                        height: 80px;
                        border-radius: var(--radius-full);
                        background: var(--success-pale);
                        border: 2px solid var(--success);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 2.2rem;
                        animation: float 3s ease-in-out infinite;
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div className="auth-page">
            <div className="auth-card glass-card">
                <div className="auth-logo">
                    <div className="logo-icon">
                        <HiOutlineSparkles />
                    </div>
                    <span className="logo-text">CampusAI</span>
                </div>

                <h1>Join the crew! 🚀</h1>
                <p className="subtitle">
                    Create your account and start your smart learning journey today.
                </p>

                {error && (
                    <div className="error-msg" role="alert">
                        <span>⚠️</span> {error}
                    </div>
                )}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="signup-name">Full Name</label>
                        <div className="auth-input-wrapper">
                            <span className="auth-input-icon">
                                <HiOutlineUser />
                            </span>
                            <input
                                id="signup-name"
                                type="text"
                                className="input auth-input"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="What should we call you?"
                                required
                                autoComplete="name"
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label htmlFor="signup-email">Email</label>
                        <div className="auth-input-wrapper">
                            <span className="auth-input-icon">
                                <HiOutlineEnvelope />
                            </span>
                            <input
                                id="signup-email"
                                type="email"
                                className="input auth-input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email, we'll keep it safe 🙂"
                                required
                                autoComplete="email"
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label htmlFor="signup-password">Password</label>
                        <div className="auth-input-wrapper">
                            <span className="auth-input-icon">
                                <HiOutlineLockClosed />
                            </span>
                            <input
                                id="signup-password"
                                type="password"
                                className="input auth-input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Your secret password (min 6 chars)"
                                required
                                autoComplete="new-password"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-lg"
                        disabled={loading}
                        style={{ width: '100%', marginTop: '4px' }}
                        id="signup-submit-btn"
                    >
                        {loading ? (
                            <>
                                <div className="spinner" style={{ width: 18, height: 18 }} />
                                Creating your account…
                            </>
                        ) : (
                            'Create Account'
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    Already have an account?{' '}
                    <Link to="/login">Sign in</Link>
                </div>
            </div>

            <style>{`
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

                .auth-input:focus + .auth-input-icon,
                .auth-input-wrapper:focus-within .auth-input-icon {
                    color: var(--primary);
                }
            `}</style>
        </div>
    );
}
