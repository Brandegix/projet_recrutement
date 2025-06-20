import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiHome, FiUsers, FiBriefcase, FiClipboard, FiBarChart, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import '../assets/css/AdminSidebar.css'; // We'll create this CSS file

const AdminSidebar = ({ isLoggedIn, user, darkMode }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Check if current screen is mobile
    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth <= 768);
            if (window.innerWidth > 768) {
                setIsVisible(false); // Hide mobile menu on desktop
            }
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    // Close sidebar when clicking outside (mobile only)
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isMobile && isVisible && !event.target.closest('.admin-sidebar') && !event.target.closest('.hamburger-btn')) {
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
            console.error("Erreur lors de la déconnexion:", error);
            alert("Erreur lors de la déconnexion.");
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

    // Navigation items
    const navigationItems = [
        {
            path: '/Dashboard_admin',
            icon: FiHome,
            label: 'Tableau de bord'
        },
        {
            path: '/Candidatesadmin',
            icon: FiUsers,
            label: 'Gérer les candidats'
        },
        {
            path: '/ManageRecruiters',
            icon: FiUsers,
            label: 'Gérer les recruteurs'
        },
        {
            path: '/applicationss',
            icon: FiClipboard,
            label: 'Candidats et leurs postulations'
        },
        {
            path: '/AdminDashboard',
            icon: FiBarChart,
            label: 'Statistiques'
        },
        {
            path: '/ManageJobs',
            icon: FiBriefcase,
            label: 'Gérer les offres'
        }
    ];

    if (!isLoggedIn || user?.role !== 'admin') {
        return null;
    }

    return (
        <>
            {/* Mobile Hamburger Button */}
            {isMobile && (
                <button
                    className={`hamburger-btn ${darkMode ? 'dark' : ''}`}
                    onClick={toggleSidebar}
                    aria-label="Toggle sidebar"
                >
                    {isVisible ? <FiX /> : <FiMenu />}
                </button>
            )}

            {/* Overlay for mobile */}
            {isMobile && isVisible && (
                <div 
                    className="sidebar-overlay"
                    onClick={() => setIsVisible(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`admin-sidebar ${darkMode ? 'dark-mode' : ''} ${isMobile ? (isVisible ? 'mobile-visible' : 'mobile-hidden') : ''}`}>
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
                        
                        {/* Logout Button */}
                        <li className="logout-item" onClick={handleLogout}>
                            <FiLogOut className="icon" />
                            <span>Se déconnecter</span>
                        </li>
                    </ul>
                </nav>
            </div>
        </>
    );
};

export default AdminSidebar;
