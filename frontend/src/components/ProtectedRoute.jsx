import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
    const { user, loading, configured } = useAuth();

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                gap: '12px',
                color: 'var(--text-secondary)',
            }}>
                <div className="spinner" />
                <span>Loading...</span>
            </div>
        );
    }

    // If Supabase isn't configured, allow access in demo mode
    if (!configured) {
        return children;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
