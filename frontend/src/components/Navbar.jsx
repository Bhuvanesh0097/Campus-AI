import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { HiOutlineBars3, HiOutlineArrowRightOnRectangle, HiOutlineSparkles } from 'react-icons/hi2';

export default function Navbar({ onToggleSidebar }) {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await signOut();
        navigate('/login');
    };

    const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
    const initials = displayName.charAt(0).toUpperCase();

    return (
        <nav className="navbar" role="navigation" aria-label="Main navigation">
            <div className="nav-left">
                <button
                    className="nav-mobile-toggle"
                    onClick={onToggleSidebar}
                    aria-label="Toggle sidebar"
                    id="sidebar-toggle"
                >
                    <HiOutlineBars3 />
                </button>
                <div className="nav-brand">
                    <div className="nav-logo">
                        <HiOutlineSparkles />
                    </div>
                    <span className="nav-title">CampusAI</span>
                </div>
            </div>

            <div className="nav-right">
                <div className="nav-user">
                    <div className="nav-avatar">{initials}</div>
                    <span className="nav-username">{displayName}</span>
                </div>
                <button
                    className="nav-signout"
                    onClick={handleSignOut}
                    aria-label="Sign out"
                    title="Sign out"
                    id="signout-btn"
                >
                    <HiOutlineArrowRightOnRectangle />
                </button>
            </div>

            <style>{`
                .navbar {
                    position: fixed;
                    top: 0;
                    left: var(--sidebar-width);
                    right: 0;
                    height: var(--navbar-height);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 24px;
                    background: rgba(17, 24, 39, 0.85);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border-bottom: 1px solid var(--border);
                    z-index: 800;
                    transition: left var(--transition-base);
                }

                .nav-left {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .nav-mobile-toggle {
                    display: none;
                    width: 38px;
                    height: 38px;
                    border-radius: var(--radius-sm);
                    align-items: center;
                    justify-content: center;
                    font-size: 1.3rem;
                    color: var(--text-secondary);
                    transition: all var(--transition-fast);
                }

                .nav-mobile-toggle:hover {
                    background: var(--bg-elevated);
                    color: var(--text-primary);
                }

                .nav-brand {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .nav-logo {
                    width: 34px;
                    height: 34px;
                    border-radius: var(--radius-sm);
                    background: var(--primary-pale);
                    border: 1px solid rgba(124, 156, 255, 0.15);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1rem;
                    color: var(--primary);
                }

                .nav-title {
                    font-size: 1.05rem;
                    font-weight: 700;
                    color: var(--text-primary);
                    letter-spacing: -0.3px;
                }

                .nav-right {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .nav-user {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .nav-avatar {
                    width: 32px;
                    height: 32px;
                    border-radius: var(--radius-full);
                    background: linear-gradient(135deg, var(--primary), var(--accent));
                    color: var(--text-inverse);
                    font-size: 0.8rem;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .nav-username {
                    font-size: 0.85rem;
                    font-weight: 500;
                    color: var(--text-primary);
                }

                .nav-signout {
                    width: 34px;
                    height: 34px;
                    border-radius: var(--radius-sm);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.1rem;
                    color: var(--text-muted);
                    transition: all var(--transition-fast);
                }

                .nav-signout:hover {
                    background: var(--error-pale);
                    color: var(--error);
                }

                @media (max-width: 768px) {
                    .navbar {
                        left: 0;
                        padding: 0 16px;
                    }

                    .nav-mobile-toggle {
                        display: flex;
                    }

                    .nav-brand .nav-logo,
                    .nav-brand .nav-title {
                        display: none;
                    }

                    .nav-username {
                        display: none;
                    }
                }
            `}</style>
        </nav>
    );
}
