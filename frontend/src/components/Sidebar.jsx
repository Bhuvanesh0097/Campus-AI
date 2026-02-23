import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HiOutlineBookOpen,
  HiOutlineBriefcase,
  HiOutlineChatBubbleLeftRight,
  HiOutlineChartBarSquare,
  HiOutlineArrowRightOnRectangle,
  HiOutlineSparkles,
  HiOutlineXMark,
} from 'react-icons/hi2';

const navItems = [
  {
    path: '/study-buddy',
    label: 'Study Buddy',
    icon: HiOutlineBookOpen,
    color: '#5B8DEF',
    emoji: '📚',
  },
  {
    path: '/placement-prep',
    label: 'Placement Prep',
    icon: HiOutlineBriefcase,
    color: '#8FD6C6',
    emoji: '💼',
  },
  {
    path: '/feedback',
    label: 'Feedback',
    icon: HiOutlineChatBubbleLeftRight,
    color: '#22C55E',
    emoji: '💬',
  },
  {
    path: '/admin',
    label: 'Analytics',
    icon: HiOutlineChartBarSquare,
    color: '#F59E0B',
    emoji: '📊',
  },
];

export default function Sidebar({ isOpen, onClose }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const handleNavClick = () => {
    // Close sidebar on mobile after navigation
    if (window.innerWidth <= 768) {
      onClose?.();
    }
  };

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
        className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="logo-icon-wrapper">
              <HiOutlineSparkles />
            </div>
            <span className="logo-text">CampusAI</span>
          </div>
          <button
            className="sidebar-close"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <HiOutlineXMark />
          </button>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-label">Modules</div>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'active' : ''}`
              }
              onClick={handleNavClick}
              id={`nav-${item.path.replace('/', '')}`}
            >
              <span
                className="nav-icon"
                style={{ '--item-color': item.color }}
              >
                <item.icon />
              </span>
              <span className="nav-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="user-details">
              <span className="user-name">
                {user?.user_metadata?.full_name || 'User'}
              </span>
              <span className="user-email">{user?.email || 'demo@campus.ai'}</span>
            </div>
          </div>
          <button
            className="sidebar-signout"
            onClick={handleSignOut}
            title="Sign out"
            aria-label="Sign out"
          >
            <HiOutlineArrowRightOnRectangle />
          </button>
        </div>

        <style>{`
                    .sidebar-overlay {
                        display: none;
                        position: fixed;
                        inset: 0;
                        background: rgba(0, 0, 0, 0.3);
                        z-index: 99;
                        animation: fadeIn 0.2s ease;
                    }

                    .sidebar {
                        width: var(--sidebar-width);
                        height: 100vh;
                        position: fixed;
                        left: 0;
                        top: 0;
                        display: flex;
                        flex-direction: column;
                        background: var(--bg-surface);
                        border-right: 1px solid var(--border);
                        z-index: 100;
                        transition: transform var(--transition-base);
                    }

                    .sidebar-header {
                        padding: 20px 20px 16px;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        border-bottom: 1px solid var(--border);
                    }

                    .sidebar-logo {
                        display: flex;
                        align-items: center;
                        gap: 12px;
                    }

                    .logo-icon-wrapper {
                        width: 40px;
                        height: 40px;
                        background: linear-gradient(135deg, var(--primary), var(--accent));
                        border-radius: var(--radius-sm);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 1.2rem;
                        color: white;
                        box-shadow: 0 2px 8px rgba(91, 141, 239, 0.25);
                    }

                    .logo-text {
                        font-size: 1.2rem;
                        font-weight: 700;
                        color: var(--text-primary);
                        letter-spacing: -0.01em;
                    }

                    .sidebar-close {
                        display: none;
                        width: 32px;
                        height: 32px;
                        align-items: center;
                        justify-content: center;
                        border-radius: var(--radius-xs);
                        color: var(--text-muted);
                        font-size: 1.2rem;
                        cursor: pointer;
                        background: none;
                        border: none;
                        transition: all var(--transition-fast);
                    }

                    .sidebar-close:hover {
                        background: var(--bg-muted);
                        color: var(--text-primary);
                    }

                    .sidebar-nav {
                        flex: 1;
                        padding: 16px 12px;
                        overflow-y: auto;
                    }

                    .nav-section-label {
                        font-size: 0.7rem;
                        font-weight: 700;
                        text-transform: uppercase;
                        letter-spacing: 1.5px;
                        color: var(--text-muted);
                        padding: 8px 12px 8px;
                        margin-bottom: 4px;
                    }

                    .nav-item {
                        display: flex;
                        align-items: center;
                        gap: 12px;
                        padding: 11px 14px;
                        border-radius: var(--radius-sm);
                        color: var(--text-secondary);
                        font-size: 0.9rem;
                        font-weight: 500;
                        transition: all var(--transition-fast);
                        margin-bottom: 2px;
                        text-decoration: none;
                        position: relative;
                    }

                    .nav-item:hover {
                        background: var(--bg-muted);
                        color: var(--text-primary);
                    }

                    .nav-item.active {
                        background: var(--primary-pale);
                        color: var(--primary);
                        font-weight: 600;
                    }

                    .nav-item.active::before {
                        content: '';
                        position: absolute;
                        left: 0;
                        top: 50%;
                        transform: translateY(-50%);
                        width: 3px;
                        height: 24px;
                        background: var(--primary);
                        border-radius: 0 var(--radius-full) var(--radius-full) 0;
                    }

                    .nav-icon {
                        font-size: 1.2rem;
                        display: flex;
                        transition: all var(--transition-fast);
                    }

                    .nav-item.active .nav-icon {
                        color: var(--item-color, var(--primary));
                    }

                    .sidebar-footer {
                        padding: 16px;
                        border-top: 1px solid var(--border);
                        display: flex;
                        align-items: center;
                        gap: 8px;
                    }

                    .user-info {
                        flex: 1;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        min-width: 0;
                    }

                    .user-avatar {
                        width: 34px;
                        height: 34px;
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

                    .user-details {
                        display: flex;
                        flex-direction: column;
                        min-width: 0;
                    }

                    .user-name {
                        font-size: 0.8rem;
                        font-weight: 600;
                        color: var(--text-primary);
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }

                    .user-email {
                        font-size: 0.7rem;
                        color: var(--text-muted);
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }

                    .sidebar-signout {
                        width: 34px;
                        height: 34px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border-radius: var(--radius-sm);
                        color: var(--text-muted);
                        font-size: 1.1rem;
                        cursor: pointer;
                        background: none;
                        border: none;
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
                            box-shadow: none;
                        }

                        .sidebar.sidebar-open {
                            transform: translateX(0);
                            box-shadow: var(--shadow-xl);
                        }

                        .sidebar-close {
                            display: flex;
                        }
                    }
                `}</style>
      </aside>
    </>
  );
}
