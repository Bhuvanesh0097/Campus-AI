import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiOutlineSparkles } from 'react-icons/hi2';

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
                    <div style={{ fontSize: '3rem', marginBottom: '16px' }}>✅</div>
                    <h1>Account Created!</h1>
                    <p className="subtitle">
                        Check your email for a confirmation link, then sign in.
                    </p>
                    <Link to="/login" className="btn btn-primary btn-lg" style={{ marginTop: '16px' }}>
                        Go to Login
                    </Link>
                </div>
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

                <h1>Create Account</h1>
                <p className="subtitle">Join CampusAI and boost your learning</p>

                {error && <div className="error-msg">{error}</div>}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="signup-name">Full Name</label>
                        <input
                            id="signup-name"
                            type="text"
                            className="input"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="John Doe"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="signup-email">Email</label>
                        <input
                            id="signup-email"
                            type="email"
                            className="input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@college.edu"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="signup-password">Password</label>
                        <input
                            id="signup-password"
                            type="password"
                            className="input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Min 6 characters"
                            required
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
                                Creating account...
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
        </div>
    );
}
