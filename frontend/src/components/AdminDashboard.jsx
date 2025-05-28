import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import '../assets/css/AdminDashboard.css';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';
import { FiHome, FiUsers, FiBriefcase, FiClipboard, FiBarChart ,FiLogOut} from 'react-icons/fi';
import { Home, Users, Briefcase, Clipboard, BarChart3, LogOut, TrendingUp, Activity } from 'lucide-react'; // Importing Lucide icons

const AdminDashboard = () => {
    const [totalCandidates, setTotalCandidates] = useState(0);
    const [totalRecruiters, setTotalRecruiters] = useState(0);
    const [totalJobs, setTotalJobs] = useState(0);
    const [recentJobs, setRecentJobs] = useState([]);
    const [systemStats, setSystemStats] = useState({});
    const [darkMode, setDarkMode] = useState(false);
    const [totalApplications, setTotalApplications] = useState(0);
    const [showColorInputs, setShowColorInputs] = useState(false); // <-- toggle
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate(); // Initialize navigate
    // Couleurs personnalisables - Orange palette (from the first component)
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
                    // Optionally redirect non-admins
                    navigate('/'); // Redirect to home or login page
                }
            })
            .catch(() => {
                setIsLoggedIn(false);
                setUser(null);
                navigate('/'); // Redirect if session check fails
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

    // Styles from the first AdminDashboard component
    const styles = {
        mainContent: {
            flex: 1,
            backgroundColor: darkMode ? '#1a1a1a' : '#f8f9fa',
            transition: 'all 0.3s ease',
            display: 'flex',
            flexDirection: 'column',
            marginLeft: '260px',
            width: '100%',
            marginRight:'0px',
        },
        header: {
            padding: '20px 32px',
            backgroundColor: darkMode ? '#2d2d2d' : '#ffffff',
            borderBottom: darkMode ? '1px solid #404040' : '1px solid #e5e5e5',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        },
        headerTitle: {
            fontSize: '24px',
            fontWeight: '700',
            color: darkMode ? '#ffffff' : '#1a1a1a',
            margin: 0,
            background: 'linear-gradient(135deg, #ff8c42 0%, #ff6b1a 50%, #e55100 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
        },
        themeToggleContainer: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
        },
        themeToggle: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '6px 12px',
            borderRadius: '50px',
            backgroundColor: darkMode ? '#404040' : '#f0f0f0',
            transition: 'all 0.3s ease'
        },
        switch: {
            position: 'relative',
            width: '44px',
            height: '22px',
            backgroundColor: darkMode ? '#ff8c42' : '#cccccc',
            borderRadius: '50px',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
        },
        slider: {
            position: 'absolute',
            top: '2px',
            left: darkMode ? '22px' : '2px',
            width: '18px',
            height: '18px',
            backgroundColor: '#ffffff',
            borderRadius: '50%',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
        },
        contentArea: {
            padding: '24px 32px',
            flex: 1,
            overflow: 'auto'
        },
        statsGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '20px',
            marginBottom: '28px'
        },
        statCard: {
            backgroundColor: darkMode ? '#2d2d2d' : '#ffffff',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: darkMode ? '0 4px 20px rgba(0,0,0,0.2)' : '0 4px 20px rgba(0,0,0,0.06)',
            border: darkMode ? '1px solid #404040' : '1px solid #e5e5e5',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden'
        },
        statCardGradient: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, #ff8c42, #ff6b1a, #e55100)'
        },
        statCardHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px'
        },
        statIcon: {
            fontSize: '24px',
            padding: '8px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 140, 66, 0.1)',
            color: '#ff8c42'
        },
        statTitle: {
            fontSize: '14px',
            fontWeight: '600',
            color: darkMode ? '#cccccc' : '#666666',
            margin: 0
        },
        statValue: {
            fontSize: '28px',
            fontWeight: '700',
            color: darkMode ? '#ffffff' : '#1a1a1a',
            margin: '6px 0 0 0'
        },
        colorSection: {
            backgroundColor: darkMode ? '#2d2d2d' : '#ffffff',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '24px',
            boxShadow: darkMode ? '0 4px 20px rgba(0,0,0,0.2)' : '0 4px 20px rgba(0,0,0,0.06)',
            border: darkMode ? '1px solid #404040' : '1px solid #e5e5e5'
        },
        colorSectionHeader: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px'
        },
        colorSectionTitle: {
            fontSize: '16px',
            fontWeight: '600',
            color: darkMode ? '#ffffff' : '#1a1a1a',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
        },
        toggleButton: {
            backgroundColor: darkMode ? '#404040' : '#f0f0f0',
            border: '2px solid #ff8c42',
            borderRadius: '6px',
            padding: '6px 12px',
            cursor: 'pointer',
            color: '#ff8c42',
            transition: 'all 0.2s ease',
            fontSize: '12px',
            fontWeight: '600'
        },
        colorPicker: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '12px',
            marginTop: '12px'
        },
        colorInput: {
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
        },
        colorLabel: {
            fontSize: '12px',
            fontWeight: '600',
            color: darkMode ? '#cccccc' : '#666666'
        },
        colorInputField: {
            width: '100%',
            height: '32px',
            border: '2px solid #ff8c42',
            borderRadius: '6px',
            cursor: 'pointer'
        },
        chartsGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '24px'
        },
        chartCard: {
            backgroundColor: darkMode ? '#2d2d2d' : '#ffffff',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: darkMode ? '0 4px 20px rgba(0,0,0,0.2)' : '0 4px 20px rgba(0,0,0,0.06)',
            border: darkMode ? '1px solid #404040' : '1px solid #e5e5e5',
            minHeight: '350px'
        },
        chartTitle: {
            fontSize: '16px',
            fontWeight: '600',
            color: darkMode ? '#ffffff' : '#1a1a1a',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
        },
        chartIcon: {
            fontSize: '16px',
            color: '#ff8c42'
        }
    };

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
        // You can return a loading state, a "not authorized" message, or redirect to another page
        return <div>Accès refusé. Vous devez être administrateur pour voir cette page.</div>;
        // Or, to redirect:
        // useEffect(() => { navigate('/'); }, [navigate]);
        // return null; // Render nothing while redirecting
    }

    return (
        <div className={`dashboard-container ${darkMode ? 'dark-mode' : ''}`} style={{ display: 'flex', minHeight: '100vh', backgroundColor: darkMode ? '#1a1a1a' : '#ffffff', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", transition: 'all 0.3s ease' }}>
            <div className="sidebar">
                <div className="sidebar-header"><h2>Casajobs.ma</h2></div>
                <nav className="sidebar-nav">
                    <ul>
                        <li >
                            <FiHome className="icon" />
                            <Link to="/Dashboard_admin">
                                <span>Tableau de bord</span>
                            </Link>
                        </li>
                        <li>
                            <FiUsers className="icon" />
                            <Link to="/Candidatesadmin"><span>Gérer les candidats</span></Link>
                        </li>
                        <li>
                            <FiUsers className="icon" />
                            <Link to="/ManageRecruiters"><span>Gérer les recruteurs</span></Link>
                        </li>
                        <li>
                            <FiClipboard className="icon" />
                            <Link to="/applicationss"><span>Candidats et leurs postulations</span></Link>
                        </li>
                        <li className="active">
                            <FiBarChart className="icon" />
                            <Link to="/AdminDashboard"><span>Statistiques</span></Link>
                        </li>
                        <li>
                            <FiBriefcase className="icon" />
                            <Link to="/ManageJobs"><span>Gérer les offres</span></Link>
                        </li>
                        {isLoggedIn && user && (
                            <li onClick={handleLogout} className="logout-link">
                                <FiLogOut className="icon" />
                                <span>Se déconnecter</span>
                            </li>
                        )}
                    </ul>
                </nav>
            </div>

            <div style={styles.mainContent}>
                <header style={styles.header}>
                    <h1 style={styles.headerTitle}>Statistiques</h1>
                    <div style={styles.themeToggleContainer}>
                        <div style={styles.themeToggle}>
                            <span style={{ color: darkMode ? '#e5e5e5' : '#666666', fontSize: '12px', fontWeight: '600' }}>
                                {darkMode ? "Mode sombre" : "Mode clair"}
                            </span>
                            <div style={styles.switch} onClick={() => setDarkMode(!darkMode)}>
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
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}>
                                    <path d="M12 2v20M17 5h-4l-2 7H7"/>
                                    <path d="M22 16.3a5 5 0 0 0-1.5-2.7l-4-4L9 13a5 5 0 0 0-3 8.7"/>
                                </svg>
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
                                <div style={styles.colorInput}>
                                    <label style={styles.colorLabel}>Couleur des barres :</label>
                                    <input
                                        type="color"
                                        value={barColor}
                                        onChange={(e) => setBarColor(e.target.value)}
                                        style={styles.colorInputField}
                                    />
                                </div>
                                <div style={styles.colorInput}>
                                    <label style={styles.colorLabel}>Couleur secteur 1 :</label>
                                    <input
                                        type="color"
                                        value={pieColor1}
                                        onChange={(e) => setPieColor1(e.target.value)}
                                        style={styles.colorInputField}
                                    />
                                </div>
                                <div style={styles.colorInput}>
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
                                        labelStyle={{ fontSize: '12px', fontWeight: '600' }}
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