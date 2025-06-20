import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../assets/css/AdminDashboard.css'; // Ensure this path is correct
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';
import { FiHome, FiUsers, FiBriefcase, FiClipboard, FiBarChart, FiLogOut, FiMenu } from 'react-icons/fi'; // Import FiMenu
import { Home, Users, Briefcase, Clipboard, BarChart3, LogOut, Activity } from 'lucide-react'; // Importing Lucide icons
import SEO from "./SEO"; // Assuming SEO component exists

const AdminDashboard = () => {
    const [totalCandidates, setTotalCandidates] = useState(0);
    const [totalRecruiters, setTotalRecruiters] = useState(0);
    const [totalJobs, setTotalJobs] = useState(0);
    const [recentJobs, setRecentJobs] = useState([]); // Not used in render, but kept for data fetching
    const [systemStats, setSystemStats] = useState({}); // Not used in render, but kept for data fetching
    const [totalApplications, setTotalApplications] = useState(0);

    const [darkMode, setDarkMode] = useState(false);
    const [showColorInputs, setShowColorInputs] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for mobile sidebar

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
            icon: <Briefcase />
        },
        {
            title: 'Total des Offres d\'Emploi',
            value: totalJobs,
            icon: <Clipboard />
        }
    ];

    if (!isLoggedIn || user?.role !== 'admin') {
        return <div>Accès refusé. Vous devez être administrateur pour voir cette page.</div>;
    }

    return (
        <div className={`dashboard-container ${darkMode ? 'dark-mode' : ''} ${isSidebarOpen ? 'sidebar-open' : ''}`}>
            <SEO title="Admin Dashboard - Statistiques" description="Statistiques globales de la plateforme d'emploi." />

            <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <h2>Casajobs.ma</h2>
                    <button className="close-sidebar-btn" onClick={() => setIsSidebarOpen(false)}>×</button>
                </div>
                <nav className="sidebar-nav">
                    <ul>
                        <li className="sidebar-item">
                            <FiHome className="icon" />
                            <Link to="/Dashboard_admin">
                                <span>Tableau de bord</span>
                            </Link>
                        </li>
                        <li className="sidebar-item">
                            <FiUsers className="icon" />
                            <Link to="/Candidatesadmin"><span>Gérer les candidats</span></Link>
                        </li>
                        <li className="sidebar-item">
                            <FiUsers className="icon" />
                            <Link to="/ManageRecruiters"><span>Gérer les recruteurs</span></Link>
                        </li>
                        <li className="sidebar-item">
                            <FiClipboard className="icon" />
                            <Link to="/applicationss"><span>Candidats et leurs postulations</span></Link>
                        </li>
                        <li className="sidebar-item active">
                            <FiBarChart className="icon" />
                            <Link to="/AdminDashboard"><span>Statistiques</span></Link>
                        </li>
                        <li className="sidebar-item">
                            <FiBriefcase className="icon" />
                            <Link to="/ManageJobs"><span>Gérer les offres</span></Link>
                        </li>
                        {isLoggedIn && user && (
                            <li onClick={handleLogout} className="sidebar-item logout-link">
                                <FiLogOut className="icon" />
                                <span>Se déconnecter</span>
                            </li>
                        )}
                    </ul>
                </nav>
            </div>

            <div className="main-content">
                <header className="header">
                    <button className="menu-toggle" onClick={() => setIsSidebarOpen(true)}>
                        <FiMenu />
                    </button>
                    <h1 className="header-title">Statistiques</h1>
                    <div className="theme-toggle-container">
                        <div className="theme-toggle">
                            <span className="theme-label">
                                {darkMode ? "Mode sombre" : "Mode clair"}
                            </span>
                            <div className="switch" onClick={() => setDarkMode(!darkMode)}>
                                <div className="slider" style={{ left: darkMode ? '22px' : '2px' }}></div>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="content-area">
                    <div className="stats-grid">
                        {statCards.map((card, index) => (
                            <div key={index} className="stat-card">
                                <div className="stat-card-gradient"></div>
                                <div className="stat-card-header">
                                    <div className="stat-icon">
                                        {card.icon}
                                    </div>
                                </div>
                                <h3 className="stat-title">{card.title}</h3>
                                <p className="stat-value">{card.value.toLocaleString()}</p>
                            </div>
                        ))}
                    </div>

                    <div className="color-section">
                        <div className="color-section-header">
                            <h3 className="color-section-title">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}>
                                    <path d="M12 2v20M17 5h-4l-2 7H7" />
                                    <path d="M22 16.3a5 5 0 0 0-1.5-2.7l-4-4L9 13a5 5 0 0 0-3 8.7" />
                                </svg>
                                Personnaliser les couleurs des graphiques
                            </h3>
                            <button
                                className="toggle-button"
                                onClick={() => setShowColorInputs(!showColorInputs)}
                            >
                                {showColorInputs ? '▲' : '▼'}
                            </button>
                        </div>
                        {showColorInputs && (
                            <div className="color-picker">
                                <div className="color-input">
                                    <label className="color-label">Couleur des barres :</label>
                                    <input
                                        type="color"
                                        value={barColor}
                                        onChange={(e) => setBarColor(e.target.value)}
                                        className="color-input-field"
                                    />
                                </div>
                                <div className="color-input">
                                    <label className="color-label">Couleur secteur 1 :</label>
                                    <input
                                        type="color"
                                        value={pieColor1}
                                        onChange={(e) => setPieColor1(e.target.value)}
                                        className="color-input-field"
                                    />
                                </div>
                                <div className="color-input">
                                    <label className="color-label">Couleur secteur 2 :</label>
                                    <input
                                        type="color"
                                        value={pieColor2}
                                        onChange={(e) => setPieColor2(e.target.value)}
                                        className="color-input-field"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="charts-grid">
                        <div className="chart-card">
                            <h3 className="chart-title">
                                <BarChart3 className="chart-icon" />
                                Répartition des Membres
                            </h3>
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.08} />
                                    <XAxis dataKey="name" stroke={darkMode ? "#e5e5e5" : "#666666"} fontSize={11} />
                                    <YAxis stroke={darkMode ? "#e5e5e5" : "#666666"} fontSize={11} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: darkMode ? '#2d2d2d' : '#ffffff',
                                            border: darkMode ? '1px solid #404040' : '1px solid #e5e5e5',
                                            borderRadius: '8px',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                            color: darkMode ? '#ffffff' : '#1a1a1a',
                                            fontSize: '12px'
                                        }}
                                    />
                                    <Legend />
                                    <Bar
                                        dataKey="value"
                                        fill={barColor}
                                        radius={[6, 6, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="chart-card">
                            <h3 className="chart-title">
                                <Activity className="chart-icon" />
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
                                        labelLine={false} // Hide label lines for cleaner look
                                    >
                                        <Cell key="cell-0" fill={pieColor1} />
                                        <Cell key="cell-1" fill={pieColor2} />
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: darkMode ? '#2d2d2d' : '#ffffff',
                                            border: darkMode ? '1px solid #404040' : '1px solid #e5e5e5',
                                            borderRadius: '8px',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                            color: darkMode ? '#ffffff' : '#1a1a1a',
                                            fontSize: '12px'
                                        }}
                                    />
                                    <Legend />
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
