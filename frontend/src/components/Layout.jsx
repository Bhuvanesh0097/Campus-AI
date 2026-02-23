import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

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
        </div>
    );
}
