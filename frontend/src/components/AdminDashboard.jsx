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
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Customizable colors - Orange palette
    const [barColor, setBarColor] = useState('#ff8c42');
    const [pieColor1, setPieColor1] = useState('#ff6b1a');
    const [pieColor2, setPieColor2] = useState('#e55100');

    // State for screen width to handle responsiveness
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setScreenWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const fetchAuthAndStats = async () => {
            setLoading(true);
            try {
                const sessionRes = await fetch(`${process.env.REACT_APP_API_URL}/api/session`, {
                    credentials: "include",
                });
                const sessionData = await (sessionRes.ok ? sessionRes.json() : Promise.reject("Not logged in"));

                if (sessionData?.isLoggedIn && sessionData.user?.role === 'admin') {
                    setIsLoggedIn(true);
                    setUser(sessionData.user);

                    const statsRes = await fetch(`${process.env.REACT_APP_API_URL}/api/stats`, {
                        method: "GET",
                        credentials: "include",
                    });
                    const statsData = await statsRes.json();
                    setTotalCandidates(statsData.totalCandidates);
                    setTotalRecruiters(statsData.totalRecruiters);
                    setTotalJobs(statsData.totalJobs);
                    setRecentJobs(statsData.recentJobs);
                    setSystemStats(statsData.systemStats);
                    setTotalApplications(statsData.totalApplications);
                } else {
                    setIsLoggedIn(false);
                    setUser(null);
                    navigate('/');
                }
            } catch (error) {
                console.error("Error during initial fetch:", error);
                setIsLoggedIn(false);
                setUser(null);
                navigate('/');
            } finally {
                setLoading(false);
            }
        };

        fetchAuthAndStats();
    }, [navigate]);

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

    // --- Embedded CSS String for full control including media queries and hovers ---
    // This is placed inside a <style> tag in the render method below.
    const cssStyles = `
        :root {
            --sidebar-width: 260px;
            --main-content-margin-left: 260px;
            --main-content-width: calc(100% - 260px);

            /* Light Mode Colors */
            --light-bg: #f8f9fa;
            --light-card-bg: #ffffff;
            --light-border: #e5e5e5;
            --light-text-primary: #1a1a1a;
            --light-text-secondary: #666666;
            --light-sidebar-bg: #ffffff;
            --light-sidebar-text: #333;
            --light-sidebar-link: #555;
            --light-sidebar-link-hover: rgba(255, 140, 66, 0.1);
            --light-sidebar-link-active: #ff6b1a;
            --light-toggle-bg: #f0f0f0;
            --light-toggle-switch-bg: #cccccc;
            --light-shadow: rgba(0, 0, 0, 0.05);
            --light-card-shadow: rgba(0,0,0,0.06);

            /* Dark Mode Colors */
            --dark-bg: #1a1a1a;
            --dark-card-bg: #2d2d2d;
            --dark-border: #404040;
            --dark-text-primary: #ffffff;
            --dark-text-secondary: #cccccc;
            --dark-sidebar-bg: #2d2d2d;
            --dark-sidebar-text: #e5e5e5;
            --dark-sidebar-link: #b0b0b0;
            --dark-sidebar-link-hover: rgba(255, 140, 66, 0.15);
            --dark-sidebar-link-active: #e55100;
            --dark-toggle-bg: #404040;
            --dark-toggle-switch-bg: #ff8c42;
            --dark-shadow: rgba(0, 0, 0, 0.2);
            --dark-card-shadow: rgba(0,0,0,0.2);

            /* Brand Colors (Orange Palette) */
            --brand-orange-light: #ff8c42;
            --brand-orange-medium: #ff6b1a;
            --brand-orange-dark: #e55100;
            --brand-gradient: linear-gradient(135deg, var(--brand-orange-light) 0%, var(--brand-orange-medium) 50%, var(--brand-orange-dark) 100%);
        }

        /* Dark Mode Overrides */
        .dark-mode {
            background-color: var(--dark-bg);
            color: var(--dark-text-primary);
        }

        .dark-mode .sidebar {
            background-color: var(--dark-sidebar-bg);
            color: var(--dark-sidebar-text);
            box-shadow: 2px 0 10px var(--dark-shadow);
        }
        .dark-mode .sidebar-header h2 {
            background: var(--brand-gradient);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .dark-mode .sidebar-nav-link {
            color: var(--dark-sidebar-link);
        }
        .dark-mode .sidebar-nav-link svg {
            color: var(--dark-sidebar-link);
        }
        .dark-mode .sidebar-nav-link:hover {
            background-color: var(--dark-sidebar-link-hover);
            color: var(--brand-orange-light);
        }
        .dark-mode .sidebar-nav-link:hover svg {
            color: var(--brand-orange-light);
        }
        .dark-mode .sidebar-nav-link.active {
            background-color: var(--dark-sidebar-link-active);
            color: #ffffff;
            box-shadow: 0 4px 10px rgba(229, 81, 0, 0.4);
        }
        .dark-mode .sidebar-nav-link.active svg {
            color: #ffffff;
        }
        .dark-mode .logout-link {
            border-top: 1px solid var(--dark-border);
        }
        .dark-mode .logout-link-style {
            color: #ff6f61; /* Specific logout red */
        }
        .dark-mode .logout-link-style:hover {
            background-color: rgba(255, 111, 97, 0.15);
            color: #ff6f61;
        }

        .dark-mode .main-content {
            background-color: var(--dark-bg);
        }
        .dark-mode .main-header {
            background-color: var(--dark-card-bg);
            border-bottom: 1px solid var(--dark-border);
        }
        .dark-mode .header-title {
            color: var(--dark-text-primary);
            background: var(--brand-gradient);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        .dark-mode .theme-toggle {
            background-color: var(--dark-toggle-bg);
        }
        .dark-mode .theme-text {
            color: var(--dark-sidebar-text);
        }
        .dark-mode .switch {
            background-color: var(--dark-toggle-switch-bg);
        }

        .dark-mode .stat-card,
        .dark-mode .color-section,
        .dark-mode .chart-card {
            background-color: var(--dark-card-bg);
            box-shadow: 0 6px 25px var(--dark-shadow);
            border: 1px solid var(--dark-border);
        }
        .dark-mode .stat-title,
        .dark-mode .color-section-title,
        .dark-mode .chart-title {
            color: var(--dark-text-primary);
        }
        .dark-mode .stat-value {
            color: var(--dark-text-primary);
        }
        .dark-mode .color-label {
            color: var(--dark-text-secondary);
        }
        .dark-mode .color-input-field {
             background-color: var(--dark-card-bg); /* Match card background */
        }
        .dark-mode .toggle-button {
            background-color: var(--dark-toggle-bg);
        }

        /* Recharts specific dark mode adjustments */
        .dark-mode .recharts-surface .recharts-cartesian-axis-line,
        .dark-mode .recharts-surface .recharts-cartesian-axis-tick-line {
            stroke: var(--dark-text-secondary) !important;
        }
        .dark-mode .recharts-surface .recharts-text.recharts-cartesian-axis-tick-value {
            fill: var(--dark-text-secondary) !important;
        }
        .dark-mode .recharts-legend-wrapper .recharts-legend-item-text {
            color: var(--dark-text-secondary) !important;
        }


        /* Base Styles (applied to both light and dark mode unless overridden) */
        .dashboard-wrapper {
            display: flex;
            min-height: 100vh;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            transition: background-color 0.3s ease;
            background-color: var(--light-bg);
        }

        .sidebar {
            width: var(--sidebar-width);
            background-color: var(--light-sidebar-bg);
            color: var(--light-sidebar-text);
            padding: 20px 0;
            box-shadow: 2px 0 10px var(--light-shadow);
            display: flex;
            flex-direction: column;
            transition: background-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease;
            flex-shrink: 0;
            z-index: 1000;
        }
        .sidebar-header {
            text-align: center;
            margin-bottom: 30px;
            padding: 0 20px;
        }
        .sidebar-header h2 {
            font-size: 28px;
            font-weight: 800;
            margin: 0;
            background: var(--brand-gradient);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            line-height: 1.2;
        }
        .sidebar-nav ul {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .sidebar-nav li {
            margin-bottom: 8px;
            position: relative;
        }
        .sidebar-nav-link {
            display: flex;
            align-items: center;
            padding: 12px 20px;
            color: var(--light-sidebar-link);
            text-decoration: none;
            font-weight: 500;
            transition: background-color 0.2s ease, color 0.2s ease;
            border-radius: 8px;
            margin: 0 10px;
        }
        .sidebar-nav-link svg {
            margin-right: 12px;
            font-size: 20px;
            color: #888;
            transition: color 0.2s ease;
        }
        .sidebar-nav-link:hover {
            background-color: var(--light-sidebar-link-hover);
            color: var(--brand-orange-medium);
        }
        .sidebar-nav-link:hover svg {
            color: var(--brand-orange-medium);
        }
        .sidebar-nav-link.active {
            background-color: var(--light-sidebar-link-active);
            color: #ffffff;
            box-shadow: 0 4px 10px rgba(255, 107, 26, 0.3);
        }
        .sidebar-nav-link.active svg {
            color: #ffffff;
        }
        .logout-link {
            cursor: pointer;
            margin-top: auto;
            border-top: 1px solid rgba(0, 0, 0, 0.05);
            padding-top: 15px;
        }
        .logout-link-style {
            color: #d9534f;
        }
        .logout-link-style:hover {
            background-color: rgba(217, 83, 79, 0.1);
            color: #c9302c;
        }

        .main-content {
            flex: 1;
            background-color: var(--light-bg);
            transition: all 0.3s ease;
            display: flex;
            flex-direction: column;
            margin-left: var(--main-content-margin-left);
            width: var(--main-content-width);
        }
        .main-header {
            padding: 20px 32px;
            background-color: var(--light-card-bg);
            border-bottom: 1px solid var(--light-border);
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            flex-wrap: wrap;
            gap: 15px;
        }
        .header-title {
            font-size: 28px;
            font-weight: 700;
            color: var(--light-text-primary);
            margin: 0;
            background: var(--brand-gradient);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        .theme-toggle-container {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .theme-toggle {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 6px 15px;
            border-radius: 50px;
            background-color: var(--light-toggle-bg);
            transition: all 0.3s ease;
            cursor: pointer;
            user-select: none;
        }
        .theme-text {
            font-size: 13px;
            font-weight: 600;
            color: var(--light-text-secondary);
        }
        .switch {
            position: relative;
            width: 48px;
            height: 24px;
            background-color: var(--light-toggle-switch-bg);
            border-radius: 50px;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }
        .slider {
            position: absolute;
            top: 3px;
            left: 3px;
            width: 18px;
            height: 18px;
            background-color: #ffffff;
            border-radius: 50%;
            transition: all 0.3s ease;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .dark-mode .slider {
            left: 22px; /* Position for dark mode */
        }
        .content-area {
            padding: 24px 32px;
            flex: 1;
            overflow-y: auto;
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 25px;
            margin-bottom: 35px;
        }
        .stat-card {
            background-color: var(--light-card-bg);
            border-radius: 12px;
            padding: 25px;
            box-shadow: 0 6px 25px var(--light-card-shadow);
            border: 1px solid var(--light-border);
            transition: all 0.3s ease;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        .stat-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        .dark-mode .stat-card:hover {
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        .stat-card-gradient {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #ff8c42, #ff6b1a, #e55100);
        }
        .stat-card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }
        .stat-icon {
            font-size: 26px;
            padding: 10px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: rgba(255, 140, 66, 0.1);
            color: #ff8c42;
        }
        .stat-title {
            font-size: 15px;
            font-weight: 600;
            color: var(--light-text-secondary);
            margin: 0;
            letter-spacing: 0.5px;
        }
        .stat-value {
            font-size: 32px;
            font-weight: 700;
            color: var(--light-text-primary);
            margin: 8px 0 0 0;
        }

        .color-section {
            background-color: var(--light-card-bg);
            border-radius: 12px;
            padding: 25px;
            margin-bottom: 35px;
            box-shadow: 0 6px 25px var(--light-card-shadow);
            border: 1px solid var(--light-border);
            transition: all 0.3s ease;
        }
        .color-section-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 18px;
            flex-wrap: wrap;
            gap: 10px;
        }
        .color-section-title {
            font-size: 18px;
            font-weight: 600;
            color: var(--light-text-primary);
            margin: 0;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .toggle-button {
            background-color: var(--light-toggle-bg);
            border: 2px solid var(--brand-orange-light);
            border-radius: 8px;
            padding: 8px 15px;
            cursor: pointer;
            color: var(--brand-orange-light);
            transition: all 0.2s ease;
            font-size: 13px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .toggle-button:hover {
            background-color: rgba(255, 140, 66, 0.15);
            transform: translateY(-1px);
        }
        .color-picker {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 20px;
            margin-top: 15px;
        }
        .color-input-group {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        .color-label {
            font-size: 13px;
            font-weight: 600;
            color: var(--light-text-secondary);
        }
        .color-input-field {
            width: 100%;
            height: 38px;
            border: 2px solid var(--brand-orange-light);
            border-radius: 8px;
            cursor: pointer;
            background-color: var(--light-card-bg);
        }

        .charts-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 28px;
        }
        .chart-card {
            background-color: var(--light-card-bg);
            border-radius: 12px;
            padding: 25px;
            box-shadow: 0 6px 25px var(--light-card-shadow);
            border: 1px solid var(--light-border);
            transition: all 0.3s ease;
            min-height: 380px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        .chart-title {
            font-size: 18px;
            font-weight: 600;
            color: var(--light-text-primary);
            margin-bottom: 22px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .chart-icon {
            font-size: 18px;
            color: var(--brand-orange-light);
        }

        /* Recharts specific styles for Tooltip/Axis/Legend backgrounds/colors */
        .recharts-tooltip-wrapper .recharts-tooltip-item-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .recharts-tooltip-wrapper .recharts-tooltip-label {
            font-weight: 600;
            margin-bottom: 5px;
        }
        .custom-recharts-tooltip {
            background-color: var(--light-card-bg);
            border: 1px solid var(--light-border);
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            color: var(--light-text-primary);
            font-size: 12px;
            padding: 10px;
        }
        .dark-mode .custom-recharts-tooltip {
            background-color: var(--dark-card-bg);
            border: 1px solid var(--dark-border);
            color: var(--dark-text-primary);
        }

        /* Loading Page Styles */
        .loading-container {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background-color: var(--light-bg);
            color: var(--light-text-primary);
            font-family: 'Inter', sans-serif;
            transition: all 0.3s ease;
        }
        .dark-mode .loading-container {
            background-color: var(--dark-bg);
            color: var(--dark-text-primary);
        }

        .spinner {
            border: 6px solid #e0e0e0;
            border-top: 6px solid #ff8c42;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            animation: spin 1s linear infinite;
            margin-bottom: 20px;
        }
        .dark-mode .spinner {
            border: 6px solid #444;
        }

        .loading-text {
            font-size: 18px;
            font-weight: 500;
            color: #666;
        }
        .dark-mode .loading-text {
            color: #ccc;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        /* --- Responsive Media Queries --- */

        /* Tablets and smaller desktops */
        @media (max-width: 1024px) {
            :root {
                --sidebar-width: 220px;
                --main-content-margin-left: 220px;
                --main-content-width: calc(100% - 220px);
            }
            .main-header {
                padding: 15px 25px;
            }
            .header-title {
                font-size: 24px;
            }
            .content-area {
                padding: 20px 25px;
            }
            .stats-grid {
                grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                gap: 20px;
            }
            .stat-card, .color-section, .chart-card {
                padding: 20px;
            }
            .charts-grid {
                grid-template-columns: 1fr; /* Stack charts on smaller screens */
            }
        }

        /* Mobile devices */
        @media (max-width: 768px) {
            .dashboard-wrapper {
                flex-direction: column;
            }
            .sidebar {
                width: 100%;
                height: auto;
                padding: 15px 0;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
                position: static; /* Ensure it flows naturally */
            }
            .sidebar-nav ul {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                gap: 10px;
            }
            .sidebar-nav li {
                margin-bottom: 0;
            }
            .sidebar-nav-link {
                padding: 10px 15px;
                margin: 0 5px;
            }
            .sidebar-nav-link svg {
                margin-right: 8px;
                font-size: 18px;
            }
            .logout-link {
                margin-top: 10px;
                border-top: none;
                padding-top: 0;
                width: 100%;
                text-align: center;
            }
            .logout-link-style {
                justify-content: center;
            }

            .main-content {
                margin-left: 0;
                width: 100%;
            }
            .main-header {
                flex-direction: column;
                align-items: flex-start;
                padding: 15px 20px;
            }
            .header-title {
                font-size: 22px;
                margin-bottom: 15px;
            }
            .theme-toggle-container {
                width: 100%;
                justify-content: center;
            }
            .content-area {
                padding: 20px;
            }
            .stats-grid {
                grid-template-columns: 1fr;
                gap: 18px;
            }
            .stat-card, .color-section, .chart-card {
                padding: 18px;
            }
            .stat-title {
                font-size: 14px;
            }
            .stat-value {
                font-size: 28px;
            }
            .color-section-header {
                flex-direction: column;
                align-items: flex-start;
            }
            .color-section-title {
                font-size: 16px;
            }
            .toggle-button {
                width: 100%;
                text-align: center;
            }
            .color-picker {
                grid-template-columns: 1fr;
                gap: 15px;
            }
            .chart-title {
                font-size: 16px;
            }
        }

        /* Extra small mobile devices */
        @media (max-width: 480px) {
            .sidebar-nav li {
                width: 90%; /* Make nav items stack on very small screens */
            }
            .sidebar-nav-link {
                justify-content: center;
            }
            .header-title {
                font-size: 20px;
            }
            .content-area {
                padding: 15px;
            }
        }
    `;

    if (loading) {
        return (
            <div className={`loading-container ${darkMode ? 'dark-mode' : ''}`}>
                <style>{cssStyles}</style>
                <div className={`spinner ${darkMode ? 'dark-mode' : ''}`}></div>
                <p className={`loading-text ${darkMode ? 'dark-mode' : ''}`}>Chargement du tableau de bord...</p>
            </div>
        );
    }

    if (!isLoggedIn || user?.role !== 'admin') {
        return (
            <div className={`loading-container ${darkMode ? 'dark-mode' : ''}`}>
                <style>{cssStyles}</style>
                <p className={`loading-text ${darkMode ? 'dark-mode' : ''}`}>Accès refusé. Redirection...</p>
            </div>
        );
    }

    return (
        <div className={`dashboard-wrapper ${darkMode ? 'dark-mode' : ''}`}>
            <SEO title="Admin Dashboard - Statistiques" description="Tableau de bord administrateur avec statistiques des utilisateurs et des offres." />

            {/* Embed the CSS directly in a style tag */}
            <style>{cssStyles}</style>

            <div className={`sidebar ${darkMode ? 'dark-mode' : ''}`}>
                <div className="sidebar-header"><h2 className="sidebar-title">Casajobs.ma</h2></div>
                <nav className="sidebar-nav">
                    <ul>
                        <li>
                            <Link to="/Dashboard_admin" className={`sidebar-nav-link ${window.location.pathname === '/Dashboard_admin' ? 'active' : ''}`}>
                                <FiHome />
                                <span>Tableau de bord</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/Candidatesadmin" className={`sidebar-nav-link ${window.location.pathname === '/Candidatesadmin' ? 'active' : ''}`}>
                                <FiUsers />
                                <span>Gérer les candidats</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/ManageRecruiters" className={`sidebar-nav-link ${window.location.pathname === '/ManageRecruiters' ? 'active' : ''}`}>
                                <FiUsers />
                                <span>Gérer les recruteurs</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/applicationss" className={`sidebar-nav-link ${window.location.pathname === '/applicationss' ? 'active' : ''}`}>
                                <FiClipboard />
                                <span>Candidats et leurs postulations</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/AdminDashboard" className={`sidebar-nav-link ${window.location.pathname === '/AdminDashboard' ? 'active' : ''}`}>
                                <FiBarChart />
                                <span>Statistiques</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/ManageJobs" className={`sidebar-nav-link ${window.location.pathname === '/ManageJobs' ? 'active' : ''}`}>
                                <FiBriefcase />
                                <span>Gérer les offres</span>
                            </Link>
                        </li>
                        {isLoggedIn && user && (
                            <li onClick={handleLogout} className={`logout-link ${darkMode ? 'dark-mode' : ''}`}>
                                <div className={`sidebar-nav-link logout-link-style ${darkMode ? 'dark-mode' : ''}`}>
                                    <FiLogOut />
                                    <span>Se déconnecter</span>
                                </div>
                            </li>
                        )}
                    </ul>
                </nav>
            </div>

            <div className={`main-content ${darkMode ? 'dark-mode' : ''}`}>
                <header className={`main-header ${darkMode ? 'dark-mode' : ''}`}>
                    <h1 className="header-title">Statistiques</h1>
                    <div className="theme-toggle-container">
                        <div className={`theme-toggle ${darkMode ? 'dark-mode' : ''}`} onClick={() => setDarkMode(!darkMode)}>
                            <span className={`theme-text ${darkMode ? 'dark-mode' : ''}`}>
                                {darkMode ? "Mode sombre" : "Mode clair"}
                            </span>
                            <div className={`switch ${darkMode ? 'dark-mode' : ''}`}>
                                <div className={`slider ${darkMode ? 'dark-mode' : ''}`}></div>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="content-area">
                    <div className="stats-grid">
                        {statCards.map((card, index) => (
                            <div key={index} className={`stat-card ${darkMode ? 'dark-mode' : ''}`}>
                                <div className="stat-card-gradient"></div>
                                <div className="stat-card-header">
                                    <div className="stat-icon">
                                        {card.icon}
                                    </div>
                                </div>
                                <h3 className={`stat-title ${darkMode ? 'dark-mode' : ''}`}>{card.title}</h3>
                                <p className={`stat-value ${darkMode ? 'dark-mode' : ''}`}>{card.value.toLocaleString()}</p>
                            </div>
                        ))}
                    </div>

                    <div className={`color-section ${darkMode ? 'dark-mode' : ''}`}>
                        <div className="color-section-header">
                            <h3 className={`color-section-title ${darkMode ? 'dark-mode' : ''}`}>
                                <span className="chart-icon"><Palette /></span>
                                Personnaliser les couleurs des graphiques
                            </h3>
                            <button
                                className={`toggle-button ${darkMode ? 'dark-mode' : ''}`}
                                onClick={() => setShowColorInputs(!showColorInputs)}
                            >
                                {showColorInputs ? '▲ Masquer' : '▼ Afficher'}
                            </button>
                        </div>
                        {showColorInputs && (
                            <div className="color-picker">
                                <div className="color-input-group">
                                    <label className={`color-label ${darkMode ? 'dark-mode' : ''}`}>Couleur des barres :</label>
                                    <input
                                        type="color"
                                        value={barColor}
                                        onChange={(e) => setBarColor(e.target.value)}
                                        className={`color-input-field ${darkMode ? 'dark-mode' : ''}`}
                                    />
                                </div>
                                <div className="color-input-group">
                                    <label className={`color-label ${darkMode ? 'dark-mode' : ''}`}>Couleur secteur 1 :</label>
                                    <input
                                        type="color"
                                        value={pieColor1}
                                        onChange={(e) => setPieColor1(e.target.value)}
                                        className={`color-input-field ${darkMode ? 'dark-mode' : ''}`}
                                    />
                                </div>
                                <div className="color-input-group">
                                    <label className={`color-label ${darkMode ? 'dark-mode' : ''}`}>Couleur secteur 2 :</label>
                                    <input
                                        type="color"
                                        value={pieColor2}
                                        onChange={(e) => setPieColor2(e.target.value)}
                                        className={`color-input-field ${darkMode ? 'dark-mode' : ''}`}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="charts-grid">
                        <div className={`chart-card ${darkMode ? 'dark-mode' : ''}`}>
                            <h3 className={`chart-title ${darkMode ? 'dark-mode' : ''}`}>
                                <span className="chart-icon"><BarChart3 /></span>
                                Répartition des Membres
                            </h3>
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"} />
                                    <XAxis dataKey="name" stroke={darkMode ? "#e5e5e5" : "#666666"} tick={{ fill: darkMode ? "#e5e5e5" : "#666666", fontSize: 11 }} />
                                    <YAxis stroke={darkMode ? "#e5e5e5" : "#666666"} tick={{ fill: darkMode ? "#e5e5e5" : "#666666", fontSize: 11 }} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: darkMode ? '#2d2d2d' : '#ffffff',
                                            border: darkMode ? '1px solid #404040' : '1px solid #e5e5e5',
                                            borderRadius: '8px',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                            color: darkMode ? '#ffffff' : '#1a1a1a',
                                            fontSize: '12px'
                                        }}
                                        itemStyle={{ color: darkMode ? '#ffffff' : '#1a1a1a' }}
                                        labelStyle={{ color: darkMode ? '#ffffff' : '#1a1a1a' }}
                                    />
                                    <Legend wrapperStyle={{ color: darkMode ? '#e5e5e5' : '#1a1a1a', fontSize: '12px' }} />
                                    <Bar
                                        dataKey="value"
                                        fill={barColor}
                                        radius={[6, 6, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        <div className={`chart-card ${darkMode ? 'dark-mode' : ''}`}>
                            <h3 className={`chart-title ${darkMode ? 'dark-mode' : ''}`}>
                                <span className="chart-icon"><Activity /></span>
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
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: darkMode ? '#2d2d2d' : '#ffffff',
                                            border: darkMode ? '1px solid #404040' : '1px solid #e5e5e5',
                                            borderRadius: '8px',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                            color: darkMode ? '#ffffff' : '#1a1a1a',
                                            fontSize: '12px'
                                        }}
                                        itemStyle={{ color: darkMode ? '#ffffff' : '#1a1a1a' }}
                                        labelStyle={{ color: darkMode ? '#ffffff' : '#1a1a1a' }}
                                    />
                                    <Legend wrapperStyle={{ color: darkMode ? '#e5e5e5' : '#1a1a1a', fontSize: '12px' }} />
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
