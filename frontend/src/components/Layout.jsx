import { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import {
    HiOutlineBookOpen,
    HiOutlineBriefcase,
    HiOutlineChatBubbleLeftRight,
    HiOutlineChartBarSquare,
} from 'react-icons/hi2';

const MOBILE_NAV = [
    { to: '/study-buddy', label: 'Study', icon: HiOutlineBookOpen },
    { to: '/placement-prep', label: 'Prep', icon: HiOutlineBriefcase },
    { to: '/feedback', label: 'Feedback', icon: HiOutlineChatBubbleLeftRight },
    { to: '/admin', label: 'Analytics', icon: HiOutlineChartBarSquare },
];

export default function Layout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="app-layout">
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />
            <Navbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
            <main className="app-main">
                <div className="app-content">
                    <Outlet />
                </div>
                <footer className="app-footer">
                    © Baby — All rights reserved
                </footer>
            </main>

            {/* Mobile Bottom Navigation */}
            <div className="mobile-nav-bar">
                <div className="mobile-nav-items">
                    {MOBILE_NAV.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                `mobile-nav-item ${isActive ? 'active' : ''}`
                            }
                            id={`mobile-nav-${item.to.slice(1)}`}
                        >
                            <item.icon className="nav-icon" />
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </div>
            </div>
        </div>
    );
}
