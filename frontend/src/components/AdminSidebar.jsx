import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiHome, FiUsers, FiBriefcase, FiClipboard, FiBarChart, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import '../assets/css/AdminSidebar.css'; // Make sure this path is correct

const AdminSidebar = ({ isLoggedIn, user, darkMode }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const checkScreenSize = () => {
            const isCurrentMobile = window.innerWidth <= 768;
            setIsMobile(isCurrentMobile);
            if (!isCurrentMobile) {
                setIsVisible(false);
            }
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isMobile && isVisible &&
                !event.target.closest('.admin-sidebar') &&
                !event.target.closest('.hamburger-btn'))
            {
                setIsVisible(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isMobile, isVisible]);

    const handleLogout = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/logout`, {
                method: "POST",
                credentials: "include",
            });

            if (response.ok) {
                navigate("/");
            } else {
                throw new Error("Logout failed");
            }
        } catch (error) {
            console.error("Error during logout:", error);
            alert("Error during logout.");
        }
    };

    const handleLinkClick = () => {
        if (isMobile) {
            setIsVisible(false);
        }
    };

    const toggleSidebar = () => {
        setIsVisible(!isVisible);
    };

    const navigationItems = [
        { path: '/Dashboard_admin', icon: FiHome, label: 'Dashboard' },
        { path: '/Candidatesadmin', icon: FiUsers, label: 'Manage Candidates' },
        { path: '/ManageRecruiters', icon: FiUsers, label: 'Manage Recruiters' },
        { path: '/applicationss', icon: FiClipboard, label: 'Candidates & Applications' },
        { path: '/AdminDashboard', icon: FiBarChart, label: 'Statistics' },
        { path: '/ManageJobs', icon: FiBriefcase, label: 'Manage Job Offers' }
    ];

    if (!isLoggedIn || user?.role !== 'admin') {
        return null;
    }

    return (
        <>
            {/* Hamburger Button: Only visible on mobile (`isMobile` is true) */}
            {isMobile && (
                <button
                    className={`hamburger-btn ${darkMode ? 'dark' : ''} ${isVisible ? 'is-hidden-when-sidebar-open' : ''}`}
                    onClick={toggleSidebar}
                    aria-label="Toggle sidebar"
                >
                    {isVisible ? <FiX /> : <FiMenu />}
                </button>
            )}

            {/* Overlay for mobile: Only visible on mobile when sidebar is open */}
            {isMobile && isVisible && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setIsVisible(false)}
                />
            )}

            {/* Main Sidebar Component */}
            <div
                className={`admin-sidebar ${darkMode ? 'dark-mode' : ''} ${isMobile ? (isVisible ? 'mobile-visible' : 'mobile-hidden') : ''}`}
            >
                <div className="sidebar-header">
                    <h2>Casajobs.ma</h2>
                </div>

                <nav className="sidebar-nav">
                    <ul>
                        {navigationItems.map((item) => {
                            const IconComponent = item.icon;
                            const isActive = location.pathname === item.path;

                            return (
                                <li key={item.path} className={isActive ? 'active' : ''}>
                                    <Link to={item.path} onClick={handleLinkClick}>
                                        <IconComponent className="icon" />
                                        <span>{item.label}</span>
                                    </Link>
                                </li>
                            );
                        })}

                        {/* Logout Button: Now with a wrapper div inside */}
                        <li className="logout-item" onClick={handleLogout}>
                            {/* ADDED THIS WRAPPER DIV */}
                            <div className="logout-content-wrapper">
                                <FiLogOut className="icon" />
                                <span>Logout</span>
                            </div>
                        </li>
                    </ul>
                </nav>
            </div>
        </>
    );
};

export default AdminSidebar;
