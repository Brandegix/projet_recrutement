import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';
import { FiHome, FiUsers, FiBriefcase, FiClipboard, FiBarChart, FiLogOut } from 'react-icons/fi';
import { Users, Briefcase, Clipboard, BarChart3, Activity, Palette } from 'lucide-react';
import styled, { css, keyframes } from 'styled-components'; // Import styled, css, and keyframes
import SEO from "./SEO";

// --- Keyframes for Loading Spinner ---
const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

// --- Styled Components for the Entire Dashboard ---

const DashboardWrapper = styled.div`
    display: flex;
    min-height: 100vh;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    transition: background-color 0.3s ease;
    background-color: ${props => props.$darkMode ? '#1a1a1a' : '#f8f9fa'};

    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

const Sidebar = styled.div`
    width: 260px;
    background-color: ${props => props.$darkMode ? '#2d2d2d' : '#ffffff'};
    color: ${props => props.$darkMode ? '#e5e5e5' : '#333'};
    padding: 20px 0;
    box-shadow: ${props => props.$darkMode ? '2px 0 10px rgba(0, 0, 0, 0.2)' : '2px 0 10px rgba(0, 0, 0, 0.05)'};
    display: flex;
    flex-direction: column;
    transition: background-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease;
    flex-shrink: 0;
    z-index: 1000;

    @media (max-width: 768px) {
        width: 100%;
        height: auto;
        padding: 15px 0;
        box-shadow: ${props => props.$darkMode ? '0 2px 10px rgba(0, 0, 0, 0.2)' : '0 2px 10px rgba(0, 0, 0, 0.05)'};
        position: static;
    }
`;

const SidebarHeader = styled.div`
    text-align: center;
    margin-bottom: 30px;
    padding: 0 20px;
`;

const SidebarTitle = styled.h2`
    font-size: 28px;
    font-weight: 800;
    margin: 0;
    background: linear-gradient(135deg, #ff8c42 0%, #ff6b1a 50%, #e55100 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 1.2;
`;

const SidebarNav = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;

    @media (max-width: 768px) {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 10px;
    }
`;

const NavItem = styled.li`
    margin-bottom: 8px;
    position: relative;

    @media (max-width: 768px) {
        margin-bottom: 0;
    }
    @media (max-width: 480px) {
        width: 90%;
    }
`;

const NavLink = styled(Link)`
    display: flex;
    align-items: center;
    padding: 12px 20px;
    color: ${props => props.$darkMode ? '#b0b0b0' : '#555'};
    text-decoration: none;
    font-weight: 500;
    transition: background-color 0.2s ease, color 0.2s ease;
    border-radius: 8px;
    margin: 0 10px;

    ${props => props.$active && css`
        background-color: ${props.$darkMode ? '#e55100' : '#ff6b1a'};
        color: #ffffff !important; // !important to ensure override
        box-shadow: ${props => props.$darkMode ? '0 4px 10px rgba(229, 81, 0, 0.4)' : '0 4px 10px rgba(255, 107, 26, 0.3)'};
        & svg {
            color: #ffffff !important; // Active icon color
        }
    `}

    &:hover {
        background-color: ${props => props.$darkMode ? 'rgba(255, 140, 66, 0.15)' : 'rgba(255, 140, 66, 0.1)'};
        color: ${props => props.$darkMode ? '#ff9942' : '#ff6b1a'};
        & svg {
            color: ${props => props.$darkMode ? '#ff9942' : '#ff6b1a'};
        }
    }

    @media (max-width: 768px) {
        padding: 10px 15px;
        margin: 0 5px;
    }
    @media (max-width: 480px) {
        justify-content: center;
    }
`;

const NavIcon = styled.div`
    margin-right: 12px;
    font-size: 20px;
    color: ${props => props.$darkMode ? '#b0b0b0' : '#888'};
    transition: color 0.2s ease;

    @media (max-width: 768px) {
        margin-right: 8px;
        font-size: 18px;
    }
`;

const LogoutItem = styled(NavItem)`
    margin-top: auto;
    border-top: ${props => props.$darkMode ? '1px solid #404040' : '1px solid rgba(0, 0, 0, 0.05)'};
    padding-top: 15px;
    cursor: pointer;

    @media (max-width: 768px) {
        margin-top: 10px;
        border-top: none;
        padding-top: 0;
        width: 100%;
        text-align: center;
    }
`;

const LogoutLinkStyled = styled.div`
    display: flex;
    align-items: center;
    padding: 12px 20px;
    color: ${props => props.$darkMode ? '#ff6f61' : '#d9534f'};
    text-decoration: none;
    font-weight: 500;
    transition: background-color 0.2s ease, color 0.2s ease;
    border-radius: 8px;
    margin: 0 10px;

    &:hover {
        background-color: ${props => props.$darkMode ? 'rgba(255, 111, 97, 0.15)' : 'rgba(217, 83, 79, 0.1)'};
        color: ${props => props.$darkMode ? '#ff6f61' : '#c9302c'};
    }

    @media (max-width: 768px) {
        padding: 10px 15px;
        margin: 0 5px;
        justify-content: center;
    }
    @media (max-width: 480px) {
        justify-content: center;
    }
`;

const MainContent = styled.div`
    flex: 1;
    background-color: ${props => props.$darkMode ? '#1a1a1a' : '#f8f9fa'};
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    margin-left: 260px; /* Adjust for sidebar width */
    width: calc(100% - 260px);

    @media (max-width: 1024px) {
        margin-left: 220px;
        width: calc(100% - 220px);
    }
    @media (max-width: 768px) {
        margin-left: 0;
        width: 100%;
    }
`;

const MainHeader = styled.header`
    padding: 20px 32px;
    background-color: ${props => props.$darkMode ? '#2d2d2d' : '#ffffff'};
    border-bottom: ${props => props.$darkMode ? '1px solid #404040' : '1px solid #e5e5e5'};
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    flex-wrap: wrap;
    gap: 15px;

    @media (max-width: 1024px) {
        padding: 15px 25px;
    }
    @media (max-width: 768px) {
        flex-direction: column;
        align-items: flex-start;
        padding: 15px 20px;
    }
`;

const HeaderTitle = styled.h1`
    font-size: 28px;
    font-weight: 700;
    color: ${props => props.$darkMode ? '#ffffff' : '#1a1a1a'};
    margin: 0;
    background: linear-gradient(135deg, #ff8c42 0%, #ff6b1a 50%, #e55100 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;

    @media (max-width: 1024px) {
        font-size: 24px;
    }
    @media (max-width: 768px) {
        font-size: 22px;
        margin-bottom: 15px;
    }
    @media (max-width: 480px) {
        font-size: 20px;
    }
`;

const ThemeToggleContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    @media (max-width: 768px) {
        width: 100%;
        justify-content: center;
    }
`;

const ThemeToggle = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 6px 15px;
    border-radius: 50px;
    background-color: ${props => props.$darkMode ? '#404040' : '#f0f0f0'};
    transition: all 0.3s ease;
    cursor: pointer;
    user-select: none;
`;

const ThemeText = styled.span`
    font-size: 13px;
    font-weight: 600;
    color: ${props => props.$darkMode ? '#e5e5e5' : '#666666'};
`;

const Switch = styled.div`
    position: relative;
    width: 48px;
    height: 24px;
    background-color: ${props => props.$darkMode ? '#ff8c42' : '#cccccc'};
    border-radius: 50px;
    cursor: pointer;
    transition: background-color 0.3s ease;
`;

const Slider = styled.div`
    position: absolute;
    top: 3px;
    left: ${props => props.$darkMode ? '22px' : '3px'};
    width: 18px;
    height: 18px;
    background-color: #ffffff;
    border-radius: 50%;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
`;

const ContentArea = styled.div`
    padding: 24px 32px;
    flex: 1;
    overflow-y: auto;

    @media (max-width: 1024px) {
        padding: 20px 25px;
    }
    @media (max-width: 768px) {
        padding: 20px;
    }
    @media (max-width: 480px) {
        padding: 15px;
    }
`;

const StatsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 25px;
    margin-bottom: 35px;

    @media (max-width: 1024px) {
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 20px;
    }
    @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 18px;
    }
`;

const StatCard = styled.div`
    background-color: ${props => props.$darkMode ? '#2d2d2d' : '#ffffff'};
    border-radius: 12px;
    padding: 25px;
    box-shadow: ${props => props.$darkMode ? '0 6px 25px rgba(0,0,0,0.2)' : '0 6px 25px rgba(0,0,0,0.06)'};
    border: ${props => props.$darkMode ? '1px solid #404040' : '1px solid #e5e5e5'};
    transition: all 0.3s ease;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    &:hover {
        transform: translateY(-5px);
        box-shadow: ${props => props.$darkMode ? '0 10px 30px rgba(0,0,0,0.3)' : '0 10px 30px rgba(0,0,0,0.1)'};
    }

    @media (max-width: 1024px) {
        padding: 20px;
    }
    @media (max-width: 768px) {
        padding: 18px;
    }
`;

const StatCardGradient = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #ff8c42, #ff6b1a, #e55100);
`;

const StatCardHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
`;

const StatIcon = styled.div`
    font-size: 26px;
    padding: 10px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(255, 140, 66, 0.1);
    color: #ff8c42;
`;

const StatTitle = styled.h3`
    font-size: 15px;
    font-weight: 600;
    color: ${props => props.$darkMode ? '#cccccc' : '#666666'};
    margin: 0;
    letter-spacing: 0.5px;
    @media (max-width: 768px) {
        font-size: 14px;
    }
`;

const StatValue = styled.p`
    font-size: 32px;
    font-weight: 700;
    color: ${props => props.$darkMode ? '#ffffff' : '#1a1a1a'};
    margin: 8px 0 0 0;
    @media (max-width: 768px) {
        font-size: 28px;
    }
`;

const ColorSection = styled.div`
    background-color: ${props => props.$darkMode ? '#2d2d2d' : '#ffffff'};
    border-radius: 12px;
    padding: 25px;
    margin-bottom: 35px;
    box-shadow: ${props => props.$darkMode ? '0 6px 25px rgba(0,0,0,0.2)' : '0 6px 25px rgba(0,0,0,0.06)'};
    border: ${props => props.$darkMode ? '1px solid #404040' : '1px solid #e5e5e5'};
    transition: all 0.3s ease;

    @media (max-width: 1024px) {
        padding: 20px;
    }
    @media (max-width: 768px) {
        padding: 18px;
    }
`;

const ColorSectionHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 18px;
    flex-wrap: wrap;
    gap: 10px;

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: flex-start;
    }
`;

const ColorSectionTitle = styled.h3`
    font-size: 18px;
    font-weight: 600;
    color: ${props => props.$darkMode ? '#ffffff' : '#1a1a1a'};
    margin: 0;
    display: flex;
    align-items: center;
    gap: 10px;
    @media (max-width: 768px) {
        font-size: 16px;
    }
`;

const ToggleButton = styled.button`
    background-color: ${props => props.$darkMode ? '#404040' : '#f0f0f0'};
    border: 2px solid #ff8c42;
    border-radius: 8px;
    padding: 8px 15px;
    cursor: pointer;
    color: #ff8c42;
    transition: all 0.2s ease;
    font-size: 13px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;

    &:hover {
        background-color: rgba(255, 140, 66, 0.15);
        transform: translateY(-1px);
    }
    @media (max-width: 768px) {
        width: 100%;
        text-align: center;
    }
`;

const ColorPicker = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 20px;
    margin-top: 15px;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 15px;
    }
`;

const ColorInputGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const ColorLabel = styled.label`
    font-size: 13px;
    font-weight: 600;
    color: ${props => props.$darkMode ? '#cccccc' : '#666666'};
`;

const ColorInputField = styled.input`
    width: 100%;
    height: 38px;
    border: 2px solid #ff8c42;
    border-radius: 8px;
    cursor: pointer;
    background-color: ${props => props.$darkMode ? '#2d2d2d' : '#ffffff'};
`;

const ChartsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 28px;

    @media (max-width: 1024px) {
        grid-template-columns: 1fr;
    }
    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;

const ChartCard = styled.div`
    background-color: ${props => props.$darkMode ? '#2d2d2d' : '#ffffff'};
    border-radius: 12px;
    padding: 25px;
    box-shadow: ${props => props.$darkMode ? '0 6px 25px rgba(0,0,0,0.2)' : '0 6px 25px rgba(0,0,0,0.06)'};
    border: ${props => props.$darkMode ? '1px solid #404040' : '1px solid #e5e5e5'};
    transition: all 0.3s ease;
    min-height: 380px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    @media (max-width: 1024px) {
        padding: 20px;
    }
    @media (max-width: 768px) {
        padding: 18px;
        min-height: auto;
    }
`;

const ChartTitle = styled.h3`
    font-size: 18px;
    font-weight: 600;
    color: ${props => props.$darkMode ? '#ffffff' : '#1a1a1a'};
    margin-bottom: 22px;
    display: flex;
    align-items: center;
    gap: 10px;
    @media (max-width: 768px) {
        font-size: 16px;
    }
`;

const ChartIcon = styled.div`
    font-size: 18px;
    color: #ff8c42;
`;

// Styles for Recharts Tooltip/Axis/Legend (customize these through props if needed)
const RechartsTooltipContent = styled.div`
    background-color: ${props => props.$darkMode ? '#2d2d2d' : '#ffffff'};
    border: ${props => props.$darkMode ? '1px solid #404040' : '1px solid #e5e5e5'};
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    color: ${props => props.$darkMode ? '#ffffff' : '#1a1a1a'};
    font-size: 12px;
    padding: 10px;
`;

const RechartsAxisText = styled.div`
    font-size: 11px;
    fill: ${props => props.$darkMode ? "#e5e5e5" : "#666666"};
`;

const RechartsLegendText = styled.div`
    font-size: 12px;
    color: ${props => props.$darkMode ? '#e5e5e5' : '#1a1a1a'};
`;

// Loading page styles
const LoadingContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: ${props => props.$darkMode ? '#1a1a1a' : '#f8f9fa'};
    color: ${props => props.$darkMode ? '#ffffff' : '#333'};
    font-family: 'Inter', sans-serif;
    transition: all 0.3s ease;
`;

const Spinner = styled.div`
    border: 6px solid ${props => props.$darkMode ? '#444' : '#e0e0e0'};
    border-top: 6px solid #ff8c42;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: ${rotate} 1s linear infinite;
    margin-bottom: 20px;
`;

const LoadingText = styled.p`
    font-size: 18px;
    font-weight: 500;
    color: ${props => props.$darkMode ? '#ccc' : '#666'};
`;

// --- AdminDashboard Component ---

const AdminDashboard = () => {
    const [totalCandidates, setTotalCandidates] = useState(0);
    const [totalRecruiters, setTotalRecruiters] = useState(0);
    const [totalJobs, setTotalJobs] = useState(0);
    const [recentJobs, setRecentJobs] = useState([]); // Not used in display, but kept for data fetching
    const [systemStats, setSystemStats] = useState({}); // Not used in display, but kept for data fetching
    const [totalApplications, setTotalApplications] = useState(0);

    const [darkMode, setDarkMode] = useState(false);
    const [showColorInputs, setShowColorInputs] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // New loading state
    const navigate = useNavigate();

    // Customizable colors - Orange palette
    const [barColor, setBarColor] = useState('#ff8c42');
    const [pieColor1, setPieColor1] = useState('#ff6b1a');
    const [pieColor2, setPieColor2] = useState('#e55100');

    useEffect(() => {
        const fetchAuthAndStats = async () => {
            setLoading(true);
            try {
                // Fetch session
                const sessionRes = await fetch(`${process.env.REACT_APP_API_URL}/api/session`, {
                    credentials: "include",
                });
                const sessionData = await (sessionRes.ok ? sessionRes.json() : Promise.reject("Not logged in"));

                if (sessionData?.isLoggedIn && sessionData.user?.role === 'admin') {
                    setIsLoggedIn(true);
                    setUser(sessionData.user);

                    // Fetch stats if admin
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

    if (loading) {
        return (
            <LoadingContainer $darkMode={darkMode}>
                <Spinner $darkMode={darkMode} />
                <LoadingText $darkMode={darkMode}>Chargement du tableau de bord...</LoadingText>
            </LoadingContainer>
        );
    }

    if (!isLoggedIn || user?.role !== 'admin') {
        // This case should ideally be handled by the useEffect navigate, but as a fallback
        return (
            <LoadingContainer $darkMode={darkMode}>
                <LoadingText $darkMode={darkMode}>Accès refusé. Redirection...</LoadingText>
            </LoadingContainer>
        );
    }

    return (
        <DashboardWrapper $darkMode={darkMode}>
            <SEO title="Admin Dashboard - Statistiques" description="Tableau de bord administrateur avec statistiques des utilisateurs et des offres." />

            <Sidebar $darkMode={darkMode}>
                <SidebarHeader><SidebarTitle>Casajobs.ma</SidebarTitle></SidebarHeader>
                <nav>
                    <SidebarNav>
                        <NavItem>
                            <NavLink to="/Dashboard_admin" $darkMode={darkMode} $active={window.location.pathname === '/Dashboard_admin'}>
                                <NavIcon $darkMode={darkMode}><FiHome /></NavIcon>
                                <span>Tableau de bord</span>
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink to="/Candidatesadmin" $darkMode={darkMode} $active={window.location.pathname === '/Candidatesadmin'}>
                                <NavIcon $darkMode={darkMode}><FiUsers /></NavIcon>
                                <span>Gérer les candidats</span>
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink to="/ManageRecruiters" $darkMode={darkMode} $active={window.location.pathname === '/ManageRecruiters'}>
                                <NavIcon $darkMode={darkMode}><FiUsers /></NavIcon>
                                <span>Gérer les recruteurs</span>
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink to="/applicationss" $darkMode={darkMode} $active={window.location.pathname === '/applicationss'}>
                                <NavIcon $darkMode={darkMode}><FiClipboard /></NavIcon>
                                <span>Candidats et leurs postulations</span>
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink to="/AdminDashboard" $darkMode={darkMode} $active={window.location.pathname === '/AdminDashboard'}>
                                <NavIcon $darkMode={darkMode}><FiBarChart /></NavIcon>
                                <span>Statistiques</span>
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink to="/ManageJobs" $darkMode={darkMode} $active={window.location.pathname === '/ManageJobs'}>
                                <NavIcon $darkMode={darkMode}><FiBriefcase /></NavIcon>
                                <span>Gérer les offres</span>
                            </NavLink>
                        </NavItem>
                        {isLoggedIn && user && (
                            <LogoutItem $darkMode={darkMode} onClick={handleLogout}>
                                <LogoutLinkStyled $darkMode={darkMode}>
                                    <NavIcon $darkMode={darkMode}><FiLogOut /></NavIcon>
                                    <span>Se déconnecter</span>
                                </LogoutLinkStyled>
                            </LogoutItem>
                        )}
                    </SidebarNav>
                </nav>
            </Sidebar>

            <MainContent $darkMode={darkMode}>
                <MainHeader $darkMode={darkMode}>
                    <HeaderTitle>Statistiques</HeaderTitle>
                    <ThemeToggleContainer>
                        <ThemeToggle $darkMode={darkMode} onClick={() => setDarkMode(!darkMode)}>
                            <ThemeText $darkMode={darkMode}>
                                {darkMode ? "Mode sombre" : "Mode clair"}
                            </ThemeText>
                            <Switch $darkMode={darkMode}>
                                <Slider $darkMode={darkMode}></Slider>
                            </Switch>
                        </ThemeToggle>
                    </ThemeToggleContainer>
                </MainHeader>

                <ContentArea>
                    <StatsGrid>
                        {statCards.map((card, index) => (
                            <StatCard key={index} $darkMode={darkMode}>
                                <StatCardGradient />
                                <StatCardHeader>
                                    <StatIcon>{card.icon}</StatIcon>
                                </StatCardHeader>
                                <StatTitle $darkMode={darkMode}>{card.title}</StatTitle>
                                <StatValue $darkMode={darkMode}>{card.value.toLocaleString()}</StatValue>
                            </StatCard>
                        ))}
                    </StatsGrid>

                    <ColorSection $darkMode={darkMode}>
                        <ColorSectionHeader>
                            <ColorSectionTitle $darkMode={darkMode}>
                                <ChartIcon><Palette /></ChartIcon>
                                Personnaliser les couleurs des graphiques
                            </ColorSectionTitle>
                            <ToggleButton $darkMode={darkMode} onClick={() => setShowColorInputs(!showColorInputs)}>
                                {showColorInputs ? '▲ Masquer' : '▼ Afficher'}
                            </ToggleButton>
                        </ColorSectionHeader>
                        {showColorInputs && (
                            <ColorPicker>
                                <ColorInputGroup>
                                    <ColorLabel $darkMode={darkMode}>Couleur des barres :</ColorLabel>
                                    <ColorInputField
                                        type="color"
                                        value={barColor}
                                        onChange={(e) => setBarColor(e.target.value)}
                                        $darkMode={darkMode}
                                    />
                                </ColorInputGroup>
                                <ColorInputGroup>
                                    <ColorLabel $darkMode={darkMode}>Couleur secteur 1 :</ColorLabel>
                                    <ColorInputField
                                        type="color"
                                        value={pieColor1}
                                        onChange={(e) => setPieColor1(e.target.value)}
                                        $darkMode={darkMode}
                                    />
                                </ColorInputGroup>
                                <ColorInputGroup>
                                    <ColorLabel $darkMode={darkMode}>Couleur secteur 2 :</ColorLabel>
                                    <ColorInputField
                                        type="color"
                                        value={pieColor2}
                                        onChange={(e) => setPieColor2(e.target.value)}
                                        $darkMode={darkMode}
                                    />
                                </ColorInputGroup>
                            </ColorPicker>
                        )}
                    </ColorSection>

                    <ChartsGrid>
                        <ChartCard $darkMode={darkMode}>
                            <ChartTitle $darkMode={darkMode}>
                                <ChartIcon><BarChart3 /></ChartIcon>
                                Répartition des Membres
                            </ChartTitle>
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"} />
                                    <XAxis dataKey="name" tick={<RechartsAxisText $darkMode={darkMode} />} />
                                    <YAxis tick={<RechartsAxisText $darkMode={darkMode} />} />
                                    <Tooltip content={({ active, payload, label }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <RechartsTooltipContent $darkMode={darkMode}>
                                                    <p>{`${label} : ${payload[0].value.toLocaleString()}`}</p>
                                                </RechartsTooltipContent>
                                            );
                                        }
                                        return null;
                                    }} />
                                    <Legend wrapperStyle={{ color: darkMode ? '#e5e5e5' : '#1a1a1a', fontSize: '12px' }} />
                                    <Bar
                                        dataKey="value"
                                        fill={barColor}
                                        radius={[6, 6, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartCard>

                        <ChartCard $darkMode={darkMode}>
                            <ChartTitle $darkMode={darkMode}>
                                <ChartIcon><Activity /></ChartIcon>
                                Taux de Candidatures par Rapport aux Offres
                            </ChartTitle>
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
                                    <Tooltip content={({ active, payload, label }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <RechartsTooltipContent $darkMode={darkMode}>
                                                    <p>{`${payload[0].name} : ${payload[0].value.toLocaleString()} (${(payload[0].percent * 100).toFixed(0)}%)`}</p>
                                                </RechartsTooltipContent>
                                            );
                                        }
                                        return null;
                                    }} />
                                    <Legend wrapperStyle={{ color: darkMode ? '#e5e5e5' : '#1a1a1a', fontSize: '12px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </ChartCard>
                    </ChartsGrid>
                </ContentArea>
            </MainContent>
        </DashboardWrapper>
    );
};

export default AdminDashboard;
