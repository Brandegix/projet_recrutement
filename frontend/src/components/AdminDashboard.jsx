import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';
import { FiHome, FiUsers, FiBriefcase, FiClipboard, FiBarChart, FiLogOut } from 'react-icons/fi';
import { Users, Briefcase, Clipboard, BarChart3, Activity, Palette } from 'lucide-react';
import SEO from "./SEO";

const AdminDashboard = () => {
    const [totalCandidates, setTotalCandidates] = useState(0);
    const [totalRecruiters, setTotalRecruiters] = useState(0);
    const [totalJobs, setTotalJobs] = useState(0);
    const [recentJobs, setRecentJobs] = useState([]);
    const [systemStats, setSystemStats] = useState({});
    const [totalApplications, setTotalApplications] = useState(0);

    const [darkMode, setDarkMode] = useState(false);
    const [showColorInputs, setShowColorInputs] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    // Customizable colors - Orange palette
    const [barColor, setBarColor] = useState('#ff8c42');
    const [pieColor1, setPieColor1] = useState('#ff6b1a');
    const [pieColor2, setPieColor2] = useState('#e55100');

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/api/session`, {
            credentials: "include",
        })
            .then(res => res.ok ? res.json() : Promise.reject("Not logged in"))
            .then(data => {
                if (data?.isLoggedIn && data.user?.role === 'admin') {
                    setIsLoggedIn(true);
                    setUser(data.user);
                } else {
                    setIsLoggedIn(false);
                    setUser(null);
                    navigate('/');
                }
            })
            .catch(() => {
                setIsLoggedIn(false);
                setUser(null);
                navigate('/');
            });
    }, [navigate]);

    useEffect(() => {
        if (isLoggedIn && user?.role === 'admin') {
            fetch(`${process.env.REACT_APP_API_URL}/api/stats`, {
                method: "GET",
                credentials: "include",
            })
                .then(res => res.json())
                .then(data => {
                    setTotalCandidates(data.totalCandidates);
                    setTotalRecruiters(data.totalRecruiters);
                    setTotalJobs(data.totalJobs);
                    setRecentJobs(data.recentJobs);
                    setSystemStats(data.systemStats);
                    setTotalApplications(data.totalApplications);
                })
                .catch(error => {
                    console.error("Error fetching stats:", error);
                });
        }
    }, [isLoggedIn, user?.role]);


    const handleLogout = () => {
        fetch(`${process.env.REACT_APP_API_URL}/api/logout`, {
            method: "POST",
            credentials: "include",
        })
            .then(res => res.ok ? res.json() : Promise.reject("Logout failed"))
            .then(() => navigate("/"))
            .catch(() => alert("Erreur lors de la déconnexion."));
    };

    const chartData = [
        { name: 'Candidats', value: totalCandidates },
        { name: 'Recruteurs', value: totalRecruiters },
        { name: 'Offres', value: totalJobs },
    ];

    const chartData1 = [
        { name: 'Offres', value: totalJobs },
        { name: 'Candidatures', value: totalApplications },
    ];

    const statCards = [
        {
            title: 'Total des Candidats',
            value: totalCandidates,
            icon: <Users />
        },
        {
            title: 'Total des Recruteurs',
            value: totalRecruiters,
            value: totalRecruiters,
            icon: <Briefcase />
        },
        {
            title: 'Total des Offres d\'Emploi',
            value: totalJobs,
            icon: <Clipboard />
        }
    ];

    // --- Inline Styles Object ---
    const styles = {
        dashboardWrapper: {
            display: 'flex',
            minHeight: '100vh',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            transition: 'background-color 0.3s ease',
            backgroundColor: darkMode ? '#1a1a1a' : '#f8f9fa',
            '@media (max-width: 768px)': {
                flexDirection: 'column',
            }
        },
        // Sidebar styles (kept largely as is, adjusted for dark mode variables)
        sidebar: {
            width: '260px',
            backgroundColor: darkMode ? '#2d2d2d' : '#ffffff',
            color: darkMode ? '#e5e5e5' : '#333',
            padding: '20px 0',
            boxShadow: darkMode ? '2px 0 10px rgba(0, 0, 0, 0.2)' : '2px 0 10px rgba(0, 0, 0, 0.05)',
            display: 'flex',
            flexDirection: 'column',
            transition: 'background-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease',
            flexShrink: 0,
            zIndex: 1000,
            '@media (max-width: 768px)': {
                width: '100%',
                height: 'auto',
                padding: '15px 0',
                boxShadow: darkMode ? '0 2px 10px rgba(0, 0, 0, 0.2)' : '0 2px 10px rgba(0, 0, 0, 0.05)',
                position: 'static',
            }
        },
        sidebarHeader: {
            textAlign: 'center',
            marginBottom: '30px',
            padding: '0 20px',
        },
        sidebarHeaderH2: {
            fontSize: '28px',
            fontWeight: '800',
            margin: 0,
            background: 'linear-gradient(135deg, #ff8c42 0%, #ff6b1a 50%, #e55100 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            lineHeight: '1.2',
        },
        sidebarNavUl: {
            listStyle: 'none',
            padding: 0,
            margin: 0,
            '@media (max-width: 768px)': {
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '10px',
            }
        },
        sidebarNavLi: {
            marginBottom: '8px',
            position: 'relative',
            '@media (max-width: 768px)': {
                marginBottom: 0,
            },
            '@media (max-width: 480px)': {
                width: '90%',
            }
        },
        sidebarNavLink: {
            display: 'flex',
            alignItems: 'center',
            padding: '12px 20px',
            color: darkMode ? '#b0b0b0' : '#555',
            textDecoration: 'none',
            fontWeight: '500',
            transition: 'background-color 0.2s ease, color 0.2s ease',
            borderRadius: '8px',
            margin: '0 10px',
            ':hover': {
                backgroundColor: darkMode ? 'rgba(255, 140, 66, 0.15)' : 'rgba(255, 140, 66, 0.1)',
                color: darkMode ? '#ff9942' : '#ff6b1a',
            },
            '@media (max-width: 768px)': {
                padding: '10px 15px',
                margin: '0 5px',
            },
            '@media (max-width: 480px)': {
                justifyContent: 'center',
            }
        },
        sidebarNavIcon: {
            marginRight: '12px',
            fontSize: '20px',
            color: darkMode ? '#b0b0b0' : '#888',
            transition: 'color 0.2s ease',
            ':hover': {
                color: darkMode ? '#ff9942' : '#ff6b1a',
            },
            '@media (max-width: 768px)': {
                marginRight: '8px',
                fontSize: '18px',
            }
        },
        sidebarNavLiActive: {
            backgroundColor: darkMode ? '#e55100' : '#ff6b1a',
            color: '#ffffff',
            boxShadow: darkMode ? '0 4px 10px rgba(229, 81, 0, 0.4)' : '0 4px 10px rgba(255, 107, 26, 0.3)',
            borderRadius: '8px',
            margin: '0 10px', // Re-apply margin for active state
        },
        sidebarNavLiActiveIcon: {
            color: '#ffffff',
        },
        logoutLink: {
            cursor: 'pointer',
            marginTop: 'auto',
            borderTop: darkMode ? '1px solid #404040' : '1px solid rgba(0, 0, 0, 0.05)',
            paddingTop: '15px',
            '@media (max-width: 768px)': {
                marginTop: '10px',
                borderTop: 'none',
                paddingTop: '0',
                width: '100%',
                textAlign: 'center',
            }
        },
        logoutLinkStyle: { // Apply this to the Link within logoutLi
            color: darkMode ? '#ff6f61' : '#d9534f',
            ':hover': {
                backgroundColor: darkMode ? 'rgba(255, 111, 97, 0.15)' : 'rgba(217, 83, 79, 0.1)',
                color: darkMode ? '#ff6f61' : '#c9302c',
            }
        },

        // Main content area
        mainContent: {
            flex: 1,
            backgroundColor: darkMode ? '#1a1a1a' : '#f8f9fa',
            transition: 'all 0.3s ease',
            display: 'flex',
            flexDirection: 'column',
            marginLeft: '260px',
            width: 'calc(100% - 260px)',
            '@media (max-width: 1024px)': {
                marginLeft: '220px',
                width: 'calc(100% - 220px)',
            },
            '@media (max-width: 768px)': {
                marginLeft: 0,
                width: '100%',
            }
        },
        mainHeader: {
            padding: '20px 32px',
            backgroundColor: darkMode ? '#2d2d2d' : '#ffffff',
            borderBottom: darkMode ? '1px solid #404040' : '1px solid #e5e5e5',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            flexWrap: 'wrap',
            gap: '15px',
            '@media (max-width: 1024px)': {
                padding: '15px 25px',
            },
            '@media (max-width: 768px)': {
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '15px 20px',
            }
        },
        headerTitle: {
            fontSize: '28px',
            fontWeight: '700',
            color: darkMode ? '#ffffff' : '#1a1a1a',
            margin: 0,
            background: 'linear-gradient(135deg, #ff8c42 0%, #ff6b1a 50%, #e55100 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            '@media (max-width: 1024px)': {
                fontSize: '24px',
            },
            '@media (max-width: 768px)': {
                fontSize: '22px',
                marginBottom: '15px',
            },
            '@media (max-width: 480px)': {
                fontSize: '20px',
            }
        },
        themeToggleContainer: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            '@media (max-width: 768px)': {
                width: '100%',
                justifyContent: 'center',
            }
        },
        themeToggle: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '6px 15px',
            borderRadius: '50px',
            backgroundColor: darkMode ? '#404040' : '#f0f0f0',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            userSelect: 'none',
        },
        themeText: {
            fontSize: '13px',
            fontWeight: '600',
            color: darkMode ? '#e5e5e5' : '#666666',
        },
        switch: {
            position: 'relative',
            width: '48px',
            height: '24px',
            backgroundColor: darkMode ? '#ff8c42' : '#cccccc',
            borderRadius: '50px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
        },
        slider: {
            position: 'absolute',
            top: '3px',
            left: darkMode ? '22px' : '3px',
            width: '18px',
            height: '18px',
            backgroundColor: '#ffffff',
            borderRadius: '50%',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        },
        contentArea: {
            padding: '24px 32px',
            flex: 1,
            overflowY: 'auto',
            '@media (max-width: 1024px)': {
                padding: '20px 25px',
            },
            '@media (max-width: 768px)': {
                padding: '20px',
            },
            '@media (max-width: 480px)': {
                padding: '15px',
            }
        },
        statsGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '25px',
            marginBottom: '35px',
            '@media (max-width: 1024px)': {
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '20px',
            },
            '@media (max-width: 768px)': {
                gridTemplateColumns: '1fr',
                gap: '18px',
            }
        },
        statCard: {
            backgroundColor: darkMode ? '#2d2d2d' : '#ffffff',
            borderRadius: '12px',
            padding: '25px',
            boxShadow: darkMode ? '0 6px 25px rgba(0,0,0,0.2)' : '0 6px 25px rgba(0,0,0,0.06)',
            border: darkMode ? '1px solid #404040' : '1px solid #e5e5e5',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            ':hover': {
                transform: 'translateY(-5px)',
                boxShadow: darkMode ? '0 10px 30px rgba(0,0,0,0.3)' : '0 10px 30px rgba(0,0,0,0.1)',
            },
            '@media (max-width: 1024px)': {
                padding: '20px',
            },
            '@media (max-width: 768px)': {
                padding: '18px',
            }
        },
        statCardGradient: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #ff8c42, #ff6b1a, #e55100)'
        },
        statCardHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '15px'
        },
        statIcon: {
            fontSize: '26px',
            padding: '10px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 140, 66, 0.1)',
            color: '#ff8c42'
        },
        statTitle: {
            fontSize: '15px',
            fontWeight: '600',
            color: darkMode ? '#cccccc' : '#666666',
            margin: 0,
            letterSpacing: '0.5px',
            '@media (max-width: 768px)': {
                fontSize: '14px',
            }
        },
        statValue: {
            fontSize: '32px',
            fontWeight: '700',
            color: darkMode ? '#ffffff' : '#1a1a1a',
            margin: '8px 0 0 0',
            '@media (max-width: 768px)': {
                fontSize: '28px',
            }
        },
        colorSection: {
            backgroundColor: darkMode ? '#2d2d2d' : '#ffffff',
            borderRadius: '12px',
            padding: '25px',
            marginBottom: '35px',
            boxShadow: darkMode ? '0 6px 25px rgba(0,0,0,0.2)' : '0 6px 25px rgba(0,0,0,0.06)',
            border: darkMode ? '1px solid #404040' : '1px solid #e5e5e5',
            transition: 'all 0.3s ease',
            '@media (max-width: 1024px)': {
                padding: '20px',
            },
            '@media (max-width: 768px)': {
                padding: '18px',
            }
        },
        colorSectionHeader: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '18px',
            flexWrap: 'wrap',
            gap: '10px',
            '@media (max-width: 768px)': {
                flexDirection: 'column',
                alignItems: 'flex-start',
            }
        },
        colorSectionTitle: {
            fontSize: '18px',
            fontWeight: '600',
            color: darkMode ? '#ffffff' : '#1a1a1a',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            '@media (max-width: 768px)': {
                fontSize: '16px',
            }
        },
        toggleButton: {
            backgroundColor: darkMode ? '#404040' : '#f0f0f0',
            border: '2px solid #ff8c42',
            borderRadius: '8px',
            padding: '8px 15px',
            cursor: 'pointer',
            color: '#ff8c42',
            transition: 'all 0.2s ease',
            fontSize: '13px',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            ':hover': {
                backgroundColor: 'rgba(255, 140, 66, 0.15)',
                transform: 'translateY(-1px)',
            },
            '@media (max-width: 768px)': {
                width: '100%',
                textAlign: 'center',
            }
        },
        colorPicker: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '20px',
            marginTop: '15px',
            '@media (max-width: 768px)': {
                gridTemplateColumns: '1fr',
                gap: '15px',
            }
        },
        colorInputGroup: {
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
        },
        colorLabel: {
            fontSize: '13px',
            fontWeight: '600',
            color: darkMode ? '#cccccc' : '#666666'
        },
        colorInputField: {
            width: '100%',
            height: '38px',
            border: '2px solid #ff8c42',
            borderRadius: '8px',
            cursor: 'pointer',
            backgroundColor: darkMode ? '#2d2d2d' : '#ffffff',
        },
        chartsGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '28px',
            '@media (max-width: 1024px)': {
                gridTemplateColumns: '1fr',
            },
            '@media (max-width: 768px)': {
                gridTemplateColumns: '1fr', // Remains 1fr on smaller screens
            }
        },
        chartCard: {
            backgroundColor: darkMode ? '#2d2d2d' : '#ffffff',
            borderRadius: '12px',
            padding: '25px',
            boxShadow: darkMode ? '0 6px 25px rgba(0,0,0,0.2)' : '0 6px 25px rgba(0,0,0,0.06)',
            border: darkMode ? '1px solid #404040' : '1px solid #e5e5e5',
            transition: 'all 0.3s ease',
            minHeight: '380px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            '@media (max-width: 1024px)': {
                padding: '20px',
            },
            '@media (max-width: 768px)': {
                padding: '18px',
                minHeight: 'auto',
            }
        },
        chartTitle: {
            fontSize: '18px',
            fontWeight: '600',
            color: darkMode ? '#ffffff' : '#1a1a1a',
            marginBottom: '22px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            '@media (max-width: 768px)': {
                fontSize: '16px',
            }
        },
        chartIcon: {
            fontSize: '18px',
            color: '#ff8c42'
        },
        rechartsTooltipContent: {
            backgroundColor: darkMode ? '#2d2d2d' : '#ffffff',
            border: darkMode ? '1px solid #404040' : '1px solid #e5e5e5',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            color: darkMode ? '#ffffff' : '#1a1a1a',
            fontSize: '12px'
        },
        rechartsAxisText: {
            fontSize: '11px',
            fill: darkMode ? "#e5e5e5" : "#666666"
        },
        rechartsLegendText: {
            fontSize: '12px',
            color: darkMode ? '#e5e5e5' : '#1a1a1a'
        }
    };

    // To handle hover effects with inline styles, you typically need to use state or a wrapper.
    // For simplicity with this approach, I've left hover effects primarily in the CSS if they were there,
    // or applied basic ones where possible via conditional styling.
    // Full :hover support with inline styles generally requires libraries or more complex JS.

    if (!isLoggedIn || user?.role !== 'admin') {
        return <div>Accès refusé. Vous devez être administrateur pour voir cette page.</div>;
    }

    return (
        <div style={styles.dashboardWrapper}>
            <SEO title="Admin Dashboard - Statistiques" description="Tableau de bord administrateur avec statistiques des utilisateurs et des offres." />

            {/* Sidebar */}
            <div style={styles.sidebar}>
                <div style={styles.sidebarHeader}><h2 style={styles.sidebarHeaderH2}>Casajobs.ma</h2></div>
                <nav>
                    <ul style={styles.sidebarNavUl}>
                        <li style={styles.sidebarNavLi}>
                            <Link to="/Dashboard_admin" style={{ ...styles.sidebarNavLink, ...(window.location.pathname === '/Dashboard_admin' ? styles.sidebarNavLiActive : {}) }}>
                                <FiHome style={{ ...styles.sidebarNavIcon, ...(window.location.pathname === '/Dashboard_admin' ? styles.sidebarNavLiActiveIcon : {}) }} />
                                <span>Tableau de bord</span>
                            </Link>
                        </li>
                        <li style={styles.sidebarNavLi}>
                            <Link to="/Candidatesadmin" style={{ ...styles.sidebarNavLink, ...(window.location.pathname === '/Candidatesadmin' ? styles.sidebarNavLiActive : {}) }}>
                                <FiUsers style={{ ...styles.sidebarNavIcon, ...(window.location.pathname === '/Candidatesadmin' ? styles.sidebarNavLiActiveIcon : {}) }} />
                                <span>Gérer les candidats</span>
                            </Link>
                        </li>
                        <li style={styles.sidebarNavLi}>
                            <Link to="/ManageRecruiters" style={{ ...styles.sidebarNavLink, ...(window.location.pathname === '/ManageRecruiters' ? styles.sidebarNavLiActive : {}) }}>
                                <FiUsers style={{ ...styles.sidebarNavIcon, ...(window.location.pathname === '/ManageRecruiters' ? styles.sidebarNavLiActiveIcon : {}) }} />
                                <span>Gérer les recruteurs</span>
                            </Link>
                        </li>
                        <li style={styles.sidebarNavLi}>
                            <Link to="/applicationss" style={{ ...styles.sidebarNavLink, ...(window.location.pathname === '/applicationss' ? styles.sidebarNavLiActive : {}) }}>
                                <FiClipboard style={{ ...styles.sidebarNavIcon, ...(window.location.pathname === '/applicationss' ? styles.sidebarNavLiActiveIcon : {}) }} />
                                <span>Candidats et leurs postulations</span>
                            </Link>
                        </li>
                        <li style={styles.sidebarNavLi}> {/* Changed to conditional active class directly */}
                            <Link to="/AdminDashboard" style={{ ...styles.sidebarNavLink, ...(window.location.pathname === '/AdminDashboard' ? styles.sidebarNavLiActive : {}) }}>
                                <FiBarChart style={{ ...styles.sidebarNavIcon, ...(window.location.pathname === '/AdminDashboard' ? styles.sidebarNavLiActiveIcon : {}) }} />
                                <span>Statistiques</span>
                            </Link>
                        </li>
                        <li style={styles.sidebarNavLi}>
                            <Link to="/ManageJobs" style={{ ...styles.sidebarNavLink, ...(window.location.pathname === '/ManageJobs' ? styles.sidebarNavLiActive : {}) }}>
                                <FiBriefcase style={{ ...styles.sidebarNavIcon, ...(window.location.pathname === '/ManageJobs' ? styles.sidebarNavLiActiveIcon : {}) }} />
                                <span>Gérer les offres</span>
                            </Link>
                        </li>
                        {isLoggedIn && user && (
                            <li onClick={handleLogout} style={{ ...styles.sidebarNavLi, ...styles.logoutLink }}>
                                <div style={{ ...styles.sidebarNavLink, ...styles.logoutLinkStyle }}>
                                    <FiLogOut style={styles.sidebarNavIcon} />
                                    <span>Se déconnecter</span>
                                </div>
                            </li>
                        )}
                    </ul>
                </nav>
            </div>

            {/* Main Content Area */}
            <div style={styles.mainContent}>
                <header style={styles.mainHeader}>
                    <h1 style={styles.headerTitle}>Statistiques</h1>
                    <div style={styles.themeToggleContainer}>
                        <div style={styles.themeToggle} onClick={() => setDarkMode(!darkMode)}>
                            <span style={styles.themeText}>
                                {darkMode ? "Mode sombre" : "Mode clair"}
                            </span>
                            <div style={styles.switch}>
                                <div style={styles.slider}></div>
                            </div>
                        </div>
                    </div>
                </header>

                <div style={styles.contentArea}>
                    <div style={styles.statsGrid}>
                        {statCards.map((card, index) => (
                            <div key={index} style={styles.statCard}>
                                <div style={styles.statCardGradient}></div>
                                <div style={styles.statCardHeader}>
                                    <div style={styles.statIcon}>
                                        {card.icon}
                                    </div>
                                </div>
                                <h3 style={styles.statTitle}>{card.title}</h3>
                                <p style={styles.statValue}>{card.value.toLocaleString()}</p>
                            </div>
                        ))}
                    </div>

                    <div style={styles.colorSection}>
                        <div style={styles.colorSectionHeader}>
                            <h3 style={styles.colorSectionTitle}>
                                <Palette style={styles.chartIcon} />
                                Personnaliser les couleurs des graphiques
                            </h3>
                            <button
                                style={styles.toggleButton}
                                onClick={() => setShowColorInputs(!showColorInputs)}
                            >
                                {showColorInputs ? '▲' : '▼'}
                            </button>
                        </div>
                        {showColorInputs && (
                            <div style={styles.colorPicker}>
                                <div style={styles.colorInputGroup}>
                                    <label style={styles.colorLabel}>Couleur des barres :</label>
                                    <input
                                        type="color"
                                        value={barColor}
                                        onChange={(e) => setBarColor(e.target.value)}
                                        style={styles.colorInputField}
                                    />
                                </div>
                                <div style={styles.colorInputGroup}>
                                    <label style={styles.colorLabel}>Couleur secteur 1 :</label>
                                    <input
                                        type="color"
                                        value={pieColor1}
                                        onChange={(e) => setPieColor1(e.target.value)}
                                        style={styles.colorInputField}
                                    />
                                </div>
                                <div style={styles.colorInputGroup}>
                                    <label style={styles.colorLabel}>Couleur secteur 2 :</label>
                                    <input
                                        type="color"
                                        value={pieColor2}
                                        onChange={(e) => setPieColor2(e.target.value)}
                                        style={styles.colorInputField}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div style={styles.chartsGrid}>
                        <div style={styles.chartCard}>
                            <h3 style={styles.chartTitle}>
                                <BarChart3 style={styles.chartIcon} />
                                Répartition des Membres
                            </h3>
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"} />
                                    <XAxis dataKey="name" style={styles.rechartsAxisText} />
                                    <YAxis style={styles.rechartsAxisText} />
                                    <Tooltip contentStyle={styles.rechartsTooltipContent} />
                                    <Legend wrapperStyle={styles.rechartsLegendText} />
                                    <Bar
                                        dataKey="value"
                                        fill={barColor}
                                        radius={[6, 6, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        <div style={styles.chartCard}>
                            <h3 style={styles.chartTitle}>
                                <Activity style={styles.chartIcon} />
                                Taux de Candidatures par Rapport aux Offres
                            </h3>
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie
                                        data={chartData1}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                        labelLine={false}
                                    >
                                        <Cell key="cell-0" fill={pieColor1} />
                                        <Cell key="cell-1" fill={pieColor2} />
                                    </Pie>
                                    <Tooltip contentStyle={styles.rechartsTooltipContent} />
                                    <Legend wrapperStyle={styles.rechartsLegendText} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
