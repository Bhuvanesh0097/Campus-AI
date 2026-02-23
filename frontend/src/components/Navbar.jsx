import { useAuth } from '../context/AuthContext';
import {
    HiOutlineSparkles,
    HiOutlineBars3,
    HiOutlineArrowRightOnRectangle,
} from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ onToggleSidebar }) {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await signOut();
        navigate('/login');
    };

    const displayName =
        user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
    const initials = displayName.charAt(0).toUpperCase();

    return (
        <header className="navbar" role="banner">
            <div className="navbar-left">
                <button
                    className="navbar-toggle"
                    onClick={onToggleSidebar}
                    aria-label="Toggle sidebar"
                    id="sidebar-toggle"
                >
                    <HiOutlineBars3 />
                </button>
                <div className="navbar-brand">
                    <div className="navbar-logo-icon">
                        <HiOutlineSparkles />
                    </div>
                    <span className="navbar-logo-text">CampusAI</span>
                </div>
            </div>

            <div className="navbar-right">
                <div className="navbar-user" id="navbar-user-profile">
                    <div className="navbar-avatar">{initials}</div>
                    <span className="navbar-username">{displayName}</span>
                </div>
                <button
                    className="navbar-signout"
                    onClick={handleSignOut}
                    title="Sign out"
                    aria-label="Sign out"
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
                    background: rgba(255, 255, 255, 0.85);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border-bottom: 1px solid var(--border);
                    z-index: 90;
                    transition: left var(--transition-base);
                }

                .navbar-left {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .navbar-toggle {
                    display: none;
                    width: 40px;
                    height: 40px;
                    align-items: center;
                    justify-content: center;
                    border-radius: var(--radius-sm);
                    font-size: 1.3rem;
                    color: var(--text-secondary);
                    transition: all var(--transition-fast);
                    cursor: pointer;
                    background: none;
                    border: none;
                }

                .navbar-toggle:hover {
                    background: var(--bg-muted);
                    color: var(--text-primary);
                }

                .navbar-brand {
                    display: none;
                    align-items: center;
                    gap: 10px;
                }

                .navbar-logo-icon {
                    width: 36px;
                    height: 36px;
                    background: linear-gradient(135deg, var(--primary), var(--accent));
                    border-radius: var(--radius-sm);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.1rem;
                    color: white;
                }

                .navbar-logo-text {
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: var(--text-primary);
                    letter-spacing: -0.01em;
                }

                .navbar-right {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .navbar-user {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 6px 12px 6px 6px;
                    border-radius: var(--radius-full);
                    background: var(--bg-muted);
                    transition: all var(--transition-fast);
                }

                .navbar-user:hover {
                    background: var(--border);
                }

                .navbar-avatar {
                    width: 32px;
                    height: 32px;
                    border-radius: var(--radius-full);
                    background: linear-gradient(135deg, var(--primary), var(--accent));
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.8rem;
                    font-weight: 700;
                    color: white;
                    flex-shrink: 0;
                }

                .navbar-username {
                    font-size: 0.85rem;
                    font-weight: 500;
                    color: var(--text-primary);
                    max-width: 120px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .navbar-signout {
                    width: 36px;
                    height: 36px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: var(--radius-sm);
                    color: var(--text-muted);
                    font-size: 1.15rem;
                    transition: all var(--transition-fast);
                    cursor: pointer;
                    background: none;
                    border: none;
                }

                .navbar-signout:hover {
                    background: var(--error-pale);
                    color: var(--error);
                }

                @media (max-width: 768px) {
                    .navbar {
                        left: 0;
                        padding: 0 16px;
                    }

                    .navbar-toggle {
                        display: flex;
                    }

                    .navbar-brand {
                        display: flex;
                    }

                    .navbar-username {
                        display: none;
                    }
                }
            `}</style>
        </header>
    );
}
