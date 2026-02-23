import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HiOutlineBookOpen,
  HiOutlineBriefcase,
  HiOutlineChatBubbleLeftRight,
  HiOutlineChartBarSquare,
  HiOutlineArrowRightOnRectangle,
  HiOutlineXMark,
} from 'react-icons/hi2';

const NAV_ITEMS = [
  { to: '/study-buddy', label: 'Study Buddy', icon: HiOutlineBookOpen },
  { to: '/placement-prep', label: 'Placement Prep', icon: HiOutlineBriefcase },
  { to: '/feedback', label: 'Feedback', icon: HiOutlineChatBubbleLeftRight },
  { to: '/admin', label: 'Analytics', icon: HiOutlineChartBarSquare },
];

export default function Sidebar({ isOpen, onClose }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const email = user?.email || 'user@example.com';
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`sidebar ${isOpen ? 'open' : ''}`}
        role="navigation"
        aria-label="Sidebar navigation"
      >
        {/* Mobile close */}
        <button
          className="sidebar-close"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <HiOutlineXMark />
        </button>

        {/* Nav links */}
        <div className="sidebar-nav">
          <div className="sidebar-section-label">MODULES</div>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
              onClick={onClose}
              id={`nav-${item.to.slice(1)}`}
            >
              <item.icon className="sidebar-link-icon" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>

        {/* User info */}
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">{initials}</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{displayName}</div>
              <div className="sidebar-user-email">{email}</div>
            </div>
            <button
              className="sidebar-signout"
              onClick={handleSignOut}
              aria-label="Sign out"
              title="Sign out"
            >
              <HiOutlineArrowRightOnRectangle />
            </button>
          </div>
        </div>
      </aside>

      <style>{`
                .sidebar-overlay {
                    display: none;
                    position: fixed;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.6);
                    backdrop-filter: blur(4px);
                    z-index: 999;
                    animation: fadeIn 0.2s ease;
                }

                .sidebar {
                    position: fixed;
                    top: 0;
                    left: 0;
                    bottom: 0;
                    width: var(--sidebar-width);
                    background: var(--bg-surface);
                    border-right: 1px solid var(--border);
                    display: flex;
                    flex-direction: column;
                    z-index: 1000;
                    transition: transform var(--transition-base);
                    overflow-y: auto;
                }

                .sidebar-close {
                    display: none;
                    position: absolute;
                    top: 14px;
                    right: 14px;
                    width: 32px;
                    height: 32px;
                    border-radius: var(--radius-sm);
                    align-items: center;
                    justify-content: center;
                    font-size: 1.2rem;
                    color: var(--text-muted);
                    z-index: 10;
                }

                .sidebar-close:hover {
                    background: var(--bg-elevated);
                    color: var(--text-primary);
                }

                .sidebar-nav {
                    flex: 1;
                    padding: 80px 16px 16px;
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }

                .sidebar-section-label {
                    font-size: 0.65rem;
                    font-weight: 700;
                    letter-spacing: 1.5px;
                    color: var(--text-muted);
                    padding: 8px 12px 12px;
                    text-transform: uppercase;
                }

                .sidebar-link {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 10px 12px;
                    border-radius: var(--radius-sm);
                    font-size: 0.88rem;
                    font-weight: 500;
                    color: var(--text-secondary);
                    text-decoration: none;
                    transition: all var(--transition-fast);
                    position: relative;
                }

                .sidebar-link:hover {
                    background: var(--bg-elevated);
                    color: var(--text-primary);
                }

                .sidebar-link.active {
                    background: var(--primary-pale);
                    color: var(--primary);
                    font-weight: 600;
                }

                .sidebar-link.active::before {
                    content: '';
                    position: absolute;
                    left: -16px;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 3px;
                    height: 24px;
                    background: var(--primary);
                    border-radius: 0 3px 3px 0;
                }

                .sidebar-link-icon {
                    font-size: 1.15rem;
                    flex-shrink: 0;
                }

                .sidebar-footer {
                    padding: 16px;
                    border-top: 1px solid var(--border);
                }

                .sidebar-user {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .sidebar-avatar {
                    width: 36px;
                    height: 36px;
                    border-radius: var(--radius-full);
                    background: linear-gradient(135deg, var(--primary), var(--accent));
                    color: var(--text-inverse);
                    font-size: 0.85rem;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }

                .sidebar-user-info {
                    flex: 1;
                    min-width: 0;
                }

                .sidebar-user-name {
                    font-size: 0.85rem;
                    font-weight: 600;
                    color: var(--text-primary);
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .sidebar-user-email {
                    font-size: 0.72rem;
                    color: var(--text-muted);
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .sidebar-signout {
                    width: 32px;
                    height: 32px;
                    border-radius: var(--radius-sm);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.05rem;
                    color: var(--text-muted);
                    flex-shrink: 0;
                    transition: all var(--transition-fast);
                }

                .sidebar-signout:hover {
                    background: var(--error-pale);
                    color: var(--error);
                }

                @media (max-width: 768px) {
                    .sidebar-overlay {
                        display: block;
                    }

                    .sidebar {
                        transform: translateX(-100%);
                        box-shadow: var(--shadow-xl);
                    }

                    .sidebar.open {
                        transform: translateX(0);
                    }

                    .sidebar-close {
                        display: flex;
                    }
                }
            `}</style>
    </>
  );
}
