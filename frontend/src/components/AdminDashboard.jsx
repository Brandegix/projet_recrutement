import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/css/AdminDashboard.css'; // Make sure this path is correct for your main CSS
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';
import { Users, Briefcase, Clipboard, BarChart3, TrendingUp } from 'lucide-react';
import SEO from "./SEO";
import AdminSidebar from './AdminSidebar'; // Import the new sidebar component

const AdminDashboard = () => {
    const [totalCandidates, setTotalCandidates] = useState(0);
    const [totalRecruiters, setTotalRecruiters] = useState(0);
    const [totalJobs, setTotalJobs] = useState(0);
    const [recentJobs, setRecentJobs] = useState([]);
    const [systemStats, setSystemStats] = useState({});
    const [darkMode, setDarkMode] = useState(false);
    const [totalApplications, setTotalApplications] = useState(0);
    const [showColorInputs, setShowColorInputs] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [sidebarVisible, setSidebarVisible] = useState(false); // State for responsive sidebar toggle
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

    const styles = {
        // dashboardContainer styles moved to CSS :root and .dashboard-container
        mainContent: {
            flex: 1,
            // background-color, color, transition handled by CSS .main-content and .dark-mode
            display: 'flex',
            flexDirection: 'column',
            marginLeft: '250px', // Matches sidebar width, managed by CSS for responsiveness
            width: '100%',
            // marginRight:'0px' is default and not needed as inline style
        },
        header: {
            padding: '20px 32px',
            backgroundColor: darkMode ? 'var(--card-bg)' : 'var(--card-bg)', // Use CSS variables
            borderBottom: darkMode ? '1px solid var(--border-color)' : '1px solid var(--border-color)', // Use CSS variables
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: 'var(--shadow)' // Use CSS variable
        },
        headerTitle: {
            fontSize: '24px',
            fontWeight: '700',
            color: 'var(--text-color)', // Use CSS variable
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
            backgroundColor: darkMode ? '#404040' : '#f0f0f0', // Can use CSS variables if defined specifically
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
            backgroundColor: 'var(--card-bg)', // Use CSS variable
            borderRadius: '12px',
            padding: '20px',
            boxShadow: 'var(--shadow)', // Use CSS variable
            border: '1px solid var(--border-color)', // Use CSS variable
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
            color: 'var(--text-light)', // Use CSS variable
            margin: 0
        },
        statValue: {
            fontSize: '28px',
            fontWeight: '700',
            color: 'var(--text-color)', // Use CSS variable (or primary if preferred)
            margin: '6px 0 0 0'
        },
        colorSection: {
            backgroundColor: 'var(--card-bg)', // Use CSS variable
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '24px',
            boxShadow: 'var(--shadow)', // Use CSS variable
            border: '1px solid var(--border-color)' // Use CSS variable
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
            color: 'var(--text-color)', // Use CSS variable
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
        },
        toggleButton: {
            backgroundColor: darkMode ? '#404040' : '#f0f0f0', // Can be refined with CSS vars if available
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
            color: 'var(--text-light)' // Use CSS variable
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
            backgroundColor: 'var(--card-bg)', // Use CSS variable
            borderRadius: '12px',
            padding: '24px',
            boxShadow: 'var(--shadow)', // Use CSS variable
            border: '1px solid var(--border-color)', // Use CSS variable
            minHeight: '350px'
        },
        chartTitle: {
            fontSize: '16px',
            fontWeight: '600',
            color: 'var(--text-color)', // Use CSS variable
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
        return <div>Accès refusé. Vous devez être administrateur pour voir cette page.</div>;
    }

    return (
        <>
            <SEO /> {/* SEO component remains here */}
            <div
                className={`dashboard-container ${darkMode ? 'dark-mode' : ''}`}
                // styles.dashboardContainer handled by CSS .dashboard-container
            >
                {/* AdminSidebar component - passes necessary props */}
                <AdminSidebar
                    isLoggedIn={isLoggedIn}
                    user={user}
                    darkMode={darkMode}
                    handleLogout={handleLogout}
                    sidebarVisible={sidebarVisible}
                    setSidebarVisible={setSidebarVisible}
                />

                <div
                    style={styles.mainContent}
                    className={`main-content ${darkMode ? 'dark-mode' : ''}`} // Add dark-mode class here
                >
                    <header style={styles.header}>
                        <h1 style={styles.headerTitle}>Statistiques</h1>
                        <div style={styles.themeToggleContainer}>
                            <div style={styles.themeToggle}>
                                <span style={{ color: darkMode ? 'var(--text-light)' : 'var(--text-light)', fontSize: '12px', fontWeight: '600' }}>
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
                                        <label style={styles.colorLabel} htmlFor="barColor">Couleur des barres (BarChart)</label>
                                        <input
                                            id="barColor"
                                            type="color"
                                            value={barColor}
                                            onChange={e => setBarColor(e.target.value)}
                                            style={styles.colorInputField}
                                        />
                                    </div>
                                    <div style={styles.colorInput}>
                                        <label style={styles.colorLabel} htmlFor="pieColor1">Couleur 1 (PieChart)</label>
                                        <input
                                            id="pieColor1"
                                            type="color"
                                            value={pieColor1}
                                            onChange={e => setPieColor1(e.target.value)}
                                            style={styles.colorInputField}
                                        />
                                    </div>
                                    <div style={styles.colorInput}>
                                        <label style={styles.colorLabel} htmlFor="pieColor2">Couleur 2 (PieChart)</label>
                                        <input
                                            id="pieColor2"
                                            type="color"
                                            value={pieColor2}
                                            onChange={e => setPieColor2(e.target.value)}
                                            style={styles.colorInputField}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div style={styles.chartsGrid}>
                            <div style={styles.chartCard}>
                                <h2 style={styles.chartTitle}>
                                    <BarChart3 style={styles.chartIcon} />
                                    Répartition des utilisateurs et offres
                                </h2>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart
                                        data={chartData}
                                        margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="value" fill={barColor} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            <div style={styles.chartCard}>
                                <h2 style={styles.chartTitle}>
                                    <TrendingUp style={styles.chartIcon} />
                                    Offres et candidatures
                                </h2>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={chartData1}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                            outerRadius={100}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            <Cell key="cell-0" fill={pieColor1} />
                                            <Cell key="cell-1" fill={pieColor2} />
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminDashboard;
