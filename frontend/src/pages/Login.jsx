import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiOutlineSparkles } from 'react-icons/hi2';

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

                <h1>Welcome back</h1>
                <p className="subtitle">Sign in to continue to your AI assistant</p>

                {!configured && (
                    <div
                        style={{
                            padding: '12px 16px',
                            background: 'rgba(245, 158, 11, 0.1)',
                            border: '1px solid rgba(245, 158, 11, 0.3)',
                            borderRadius: 'var(--radius-sm)',
                            color: 'var(--warning)',
                            fontSize: '0.85rem',
                            marginBottom: '16px',
                        }}
                    >
                        ⚠️ Supabase not configured. Set <code>VITE_SUPABASE_URL</code> and{' '}
                        <code>VITE_SUPABASE_ANON_KEY</code> in <code>.env</code> for full auth.
                        You can click Sign In to explore the UI in demo mode.
                    </div>
                )}

                {error && <div className="error-msg">{error}</div>}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="login-email">Email</label>
                        <input
                            id="login-email"
                            type="email"
                            className="input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@college.edu"
                            required={configured}
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="login-password">Password</label>
                        <input
                            id="login-password"
                            type="password"
                            className="input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required={configured}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-lg"
                        disabled={loading}
                        style={{ width: '100%' }}
                    >
                        {loading ? (
                            <>
                                <div className="spinner" />
                                Signing in...
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
                    <Link to="/signup">Create one</Link>
                </div>
            </div>
        </div>
    );
}
