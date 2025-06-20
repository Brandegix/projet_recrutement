import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Users, Briefcase, Clipboard, BarChart3, LogOut } from 'lucide-react';
import '../assets/css/AdminDashboard.css'; // Assuming your shared CSS is here

const AdminSidebar = ({ isLoggedIn, user, darkMode, handleLogout, sidebarVisible, setSidebarVisible }) => {
    return (
        <>
            {/* Hamburger button for mobile */}
            <button
                className={`hamburger-btn ${darkMode ? 'dark' : ''}`}
                onClick={() => setSidebarVisible(!sidebarVisible)}
                aria-label="Toggle sidebar"
                // Inline styles from CSS are preferred, keeping basic ones for quick adjustments
                style={{
                    position: 'fixed',
                    top: '16px',
                    left: '16px',
                    zIndex: 1100,
                    // backgroundColor, border, padding, font-size, border-radius, cursor, boxShadow, color handled by CSS classes
                    display: 'none', // Controlled by CSS media query
                }}
            >
                ☰
            </button>

            {/* Sidebar Overlay for mobile */}
            {sidebarVisible && <div className="sidebar-overlay" onClick={() => setSidebarVisible(false)}></div>}

            {/* Main Sidebar */}
            <div
                className={`admin-sidebar ${darkMode ? 'dark-mode' : ''} ${sidebarVisible ? 'mobile-visible' : 'mobile-hidden'}`}
                // Styles for width, height, position, background-color, color, padding, transition, z-index are in CSS
            >
                <div className="sidebar-header">
                    <h2>Casajobs.ma</h2>
                </div>
                <nav className="sidebar-nav">
                    <ul>
                        <li>
                            <Home className="icon" />
                            <Link to="/Dashboard_admin" onClick={() => setSidebarVisible(false)}>
                                <span>Tableau de bord</span>
                            </Link>
                        </li>
                        <li>
                            <Users className="icon" />
                            <Link to="/Candidatesadmin" onClick={() => setSidebarVisible(false)}>
                                <span>Gérer les candidats</span>
                            </Link>
                        </li>
                        <li>
                            <Users className="icon" />
                            <Link to="/ManageRecruiters" onClick={() => setSidebarVisible(false)}>
                                <span>Gérer les recruteurs</span>
                            </Link>
                        </li>
                        <li>
                            <Clipboard className="icon" />
                            <Link to="/applicationss" onClick={() => setSidebarVisible(false)}>
                                <span>Candidats et leurs postulations</span>
                            </Link>
                        </li>
                        <li className="active">
                            <BarChart3 className="icon" />
                            <Link to="/AdminDashboard" onClick={() => setSidebarVisible(false)}>
                                <span>Statistiques</span>
                            </Link>
                        </li>
                        <li>
                            <Briefcase className="icon" />
                            <Link to="/ManageJobs" onClick={() => setSidebarVisible(false)}>
                                <span>Gérer les offres</span>
                            </Link>
                        </li>
                        {isLoggedIn && user && (
                            <li onClick={handleLogout} className="logout-item"> {/* Use logout-item for specific styling */}
                                <LogOut className="icon" />
                                <span>Se déconnecter</span>
                            </li>
                        )}
                    </ul>
                </nav>
            </div>
        </>
    );
};

export default AdminSidebar;
