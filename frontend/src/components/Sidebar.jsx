import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    HiOutlineBookOpen,
    HiOutlineBriefcase,
    HiOutlineChatBubbleLeftRight,
    HiOutlineChartBarSquare,
    HiOutlineArrowRightOnRectangle,
    HiOutlineSparkles,
} from 'react-icons/hi2';

const navItems = [
    {
        path: '/study-buddy',
        label: 'Study Buddy',
        icon: HiOutlineBookOpen,
        color: '#6C63FF',
    },
    {
        path: '/placement-prep',
        label: 'Placement Prep',
        icon: HiOutlineBriefcase,
        color: '#00D9FF',
    },
    {
        path: '/feedback',
        label: 'Feedback',
        icon: HiOutlineChatBubbleLeftRight,
        color: '#10B981',
    },
    {
        path: '/admin',
        label: 'Analytics',
        icon: HiOutlineChartBarSquare,
        color: '#F59E0B',
    },
];

export default function Sidebar() {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await signOut();
        navigate('/login');
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="sidebar-logo">
                    <div className="logo-icon-wrapper">
                        <HiOutlineSparkles />
                    </div>
                    <span className="logo-text">CampusAI</span>
                </div>
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
                        <span className="user-email">{user?.email}</span>
                    </div>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={handleSignOut} title="Sign out">
                    <HiOutlineArrowRightOnRectangle />
                </button>
            </div>

            <style>{`
        .sidebar {
          width: var(--sidebar-width);
          height: 100vh;
          position: fixed;
          left: 0;
          top: 0;
          display: flex;
          flex-direction: column;
          background: var(--bg-secondary);
          border-right: 1px solid var(--border);
          z-index: 100;
          animation: slideInLeft 0.3s ease;
        }

        .sidebar-header {
          padding: 20px;
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
          font-size: 1.3rem;
          color: white;
        }

        .logo-text {
          font-size: 1.25rem;
          font-weight: 700;
          background: linear-gradient(135deg, var(--text-primary), var(--text-secondary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .sidebar-nav {
          flex: 1;
          padding: 16px 12px;
          overflow-y: auto;
        }

        .nav-section-label {
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: var(--text-muted);
          padding: 8px 12px;
          margin-bottom: 4px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          border-radius: var(--radius-sm);
          color: var(--text-secondary);
          font-size: 0.9rem;
          font-weight: 500;
          transition: all var(--transition-fast);
          margin-bottom: 2px;
          text-decoration: none;
        }

        .nav-item:hover {
          background: var(--bg-glass);
          color: var(--text-primary);
        }

        .nav-item.active {
          background: rgba(108, 99, 255, 0.12);
          color: var(--primary-light);
        }

        .nav-icon {
          font-size: 1.2rem;
          display: flex;
          transition: all var(--transition-fast);
        }

        .nav-item.active .nav-icon {
          color: var(--item-color, var(--primary));
          filter: drop-shadow(0 0 6px var(--item-color, var(--primary-glow)));
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
          background: linear-gradient(135deg, var(--primary), var(--primary-dark));
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.85rem;
          font-weight: 600;
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

        @media (max-width: 768px) {
          .sidebar {
            display: none;
          }
        }
      `}</style>
        </aside>
    );
}
