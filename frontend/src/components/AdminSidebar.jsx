import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
// Using react-icons/fi for feather icons - make sure you've installed it: npm install react-icons
import { FiHome, FiUsers, FiBriefcase, FiClipboard, FiBarChart, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import './AdminSidebar.css'; // Make sure this path is correct

const AdminSidebar = ({ isLoggedIn, user, darkMode }) => {
    // isVisible controls if the sidebar is open/closed (mainly for mobile)
    const [isVisible, setIsVisible] = useState(false);
    // isMobile detects if the screen width is less than or equal to 768px
    const [isMobile, setIsMobile] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    // Effect to check screen size on mount and resize
    useEffect(() => {
        const checkScreenSize = () => {
            const isCurrentMobile = window.innerWidth <= 768;
            setIsMobile(isCurrentMobile);
            // On larger screens, ensure sidebar is "closed" (not mobile-visible)
            // It will be fixed/always visible by CSS on desktop.
            if (!isCurrentMobile) {
                setIsVisible(false); // Hide the mobile menu if resizing to desktop
            }
        };

        checkScreenSize(); // Initial check
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize); // Cleanup
    }, []);

    // Effect to handle clicks outside the sidebar (for mobile)
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Only close if it's a mobile view, the sidebar is visible,
            // and the click is not on the sidebar itself or the hamburger button.
            if (isMobile && isVisible && 
                !event.target.closest('.admin-sidebar') && 
                !event.target.closest('.hamburger-btn')) 
            {
                setIsVisible(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside); // Cleanup
    }, [isMobile, isVisible]); // Dependencies ensure effect re-runs if these states change

    // Logout handler
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

    // Closes sidebar after a navigation link is clicked (for mobile)
    const handleLinkClick = () => {
        if (isMobile) {
            setIsVisible(false);
        }
    };

    // Toggles sidebar visibility
    const toggleSidebar = () => {
        setIsVisible(!isVisible);
    };

    // Define navigation items
    const navigationItems = [
        { path: '/Dashboard_admin', icon: FiHome, label: 'Dashboard' },
        { path: '/Candidatesadmin', icon: FiUsers, label: 'Manage Candidates' },
        { path: '/ManageRecruiters', icon: FiUsers, label: 'Manage Recruiters' },
        { path: '/applicationss', icon: FiClipboard, label: 'Candidates & Applications' },
        { path: '/AdminDashboard', icon: FiBarChart, label: 'Statistics' },
        { path: '/ManageJobs', icon: FiBriefcase, label: 'Manage Job Offers' }
    ];

    // Restrict access if not logged in or not an admin
    if (!isLoggedIn || user?.role !== 'admin') {
        return null; // Or render a "No access" message outside this component
    }

    return (
        <>
            {/* Hamburger Button: Only visible on mobile (`isMobile` is true) */}
            {isMobile && (
                <button
                    className={`hamburger-btn ${darkMode ? 'dark' : ''}`}
                    onClick={toggleSidebar}
                    aria-label="Toggle sidebar"
                >
                    {/* Change icon based on sidebar visibility */}
                    {isVisible ? <FiX /> : <FiMenu />}
                </button>
            )}

            {/* Overlay for mobile: Only visible on mobile when sidebar is open */}
            {isMobile && isVisible && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setIsVisible(false)} // Closes sidebar if overlay clicked
                />
            )}

            {/* Main Sidebar Component */}
            <div
                // Apply 'admin-sidebar', 'dark-mode' (if applicable)
                // On mobile, apply 'mobile-visible' or 'mobile-hidden' based on `isVisible`
                className={`admin-sidebar ${darkMode ? 'dark-mode' : ''} ${isMobile ? (isVisible ? 'mobile-visible' : 'mobile-hidden') : ''}`}
            >
                <div className="sidebar-header">
                    <h2>Casajobs.ma</h2>
                </div>

                <nav className="sidebar-nav">
                    <ul>
                        {navigationItems.map((item) => {
                            const IconComponent = item.icon; // Get the icon component from react-icons
                            const isActive = location.pathname === item.path; // Check if current path matches item path

                            return (
                                <li key={item.path} className={isActive ? 'active' : ''}>
                                    <Link to={item.path} onClick={handleLinkClick}>
                                        <IconComponent className="icon" />
                                        <span>{item.label}</span>
                                    </Link>
                                </li>
                            );
                        })}

                        {/* Logout Button */}
                        <li className="logout-item" onClick={handleLogout}>
                            <FiLogOut className="icon" />
                            <span>Logout</span>
                        </li>
                    </ul>
                </nav>
            </div>
        </>
    );
};

export default AdminSidebar;
