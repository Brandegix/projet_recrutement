import React, { useEffect, useState } from 'react';
import { FiSearch, FiHome, FiUsers, FiBriefcase, FiCalendar, FiBarChart, FiClipboard, FiLogOut } from 'react-icons/fi';
import { Link, useNavigate } from "react-router-dom";

const Applications = () => {
    const [applications, setApplications] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/api/session`, {
            credentials: "include",
        })
            .then(res => res.ok ? res.json() : Promise.reject("Not logged in"))
            .then(data => {
                if (data?.isLoggedIn && data.user?.role === 'admin') { // Check if logged in AND is admin
                    setIsLoggedIn(true);
                    setUser(data.user);
                } else {
                    setIsLoggedIn(false);
                    setUser(null);
                    // Optionally redirect non-admins
                    // navigate('/some-other-page');
                }
            })
            .catch(() => {
                setIsLoggedIn(false);
                setUser(null);
                // Optionally redirect if session check fails
                // navigate('/login');
            });
    }, [navigate]); // Added navigate to dependency array

    const handleLogout = () => {
        fetch(`${process.env.REACT_APP_API_URL}/api/logout`, {
            method: "POST",
            credentials: "include",
        })
            .then(res => res.ok ? res.json() : Promise.reject("Logout failed"))
            .then(() => {
                setIsLoggedIn(false);
                navigate("/");
            })
            .catch(() => alert("Erreur lors de la déconnexion."));
    };

    useEffect(() => {
        if (isLoggedIn && user?.role === 'admin') { // Only fetch applications if logged in as admin
            fetch(`${process.env.REACT_APP_API_URL}/api/sapplications`, {
                credentials: "include",
            })
                .then(res => {
                    if (res.status === 403) {
                        setErrorMessage("Accès refusé : vous devez être administrateur pour accéder à cette page.");
                        setApplications([]);
                        throw new Error("Accès refusé. Veuillez vous connecter en tant qu'administrateur.");
                    }
                    return res.json();
                })
                .then(data => {
                    setErrorMessage('');
                    if (Array.isArray(data)) {
                        setApplications(data);
                    } else if (Array.isArray(data.applications)) {
                        setApplications(data.applications);
                    } else {
                        console.error("Format inattendu:", data);
                        setApplications([]);
                    }
                })
                .catch(err => {
                    console.error("Erreur lors du chargement des candidatures:", err);
                    if (!errorMessage) {
                        setApplications([]);
                    }
                });
        } else {
            // If not logged in as admin, clear applications
            setApplications([]);
        }
    }, [isLoggedIn, user?.role]); // Re-fetch if login status or role changes

    const filteredApplications = Array.isArray(applications)
        ? applications.filter(app => {
            if (!app.candidate?.name) return false;
            return app.candidate.name.toLowerCase().includes(searchTerm.toLowerCase());
        })
        : [];

    return (
        <div className="candidates-container">
            {isLoggedIn && user?.role === 'admin' && (
                <div className="sidebar">
                    <div className="sidebar-header"><h2>Casajobs.ma</h2></div>
                    <nav className="sidebar-nav">
                        <ul>
                            <li>
                                <FiHome className="icon" />
                                <Link to="/Dashboard_admin"><span>Tableau de bord</span></Link>
                            </li>
                            <li>
                                <FiUsers className="icon" />
                                <Link to="/Candidatesadmin"><span>Gérer les candidats</span></Link>
                            </li>
                            <li>
                                <FiUsers className="icon" />
                                <Link to="/ManageRecruiters"><span>Gérer les recruteurs</span></Link>
                            </li>
                            <li className="active">
                                <FiClipboard className="icon" />
                                <Link to="/applicationss"><span>Candidats et leurs postulations</span></Link>
                            </li>
                            <li>
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
            )}

            <div className={`candidates-content ${isLoggedIn && user?.role === 'admin' ? 'shifted' : ''}`}>
                <header className="candidates-header">
                    <h1>Liste des Candidatures</h1>
                    <p>Gérez et suivez toutes les candidatures des candidats.</p>
                </header>

                <div className="search-bar">
                    <FiSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Rechercher par nom..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {errorMessage ? (
                    <div className="error-message">{errorMessage}</div>
                ) : (
                    <div className="applications-list">
                        <h2>Toutes les candidatures</h2>
                        {filteredApplications.length === 0 ? (
                            <div className="no-results">
                                {applications.length === 0
                                    ? "Aucune candidature dans la base de données."
                                    : "Aucune candidature ne correspond à votre recherche."}
                            </div>
                        ) : (
                            <div style={{ /* Table styles here */
                                backgroundColor: "#ffffff",
                                borderRadius: "12px",
                                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                                overflow: "hidden",
                                border: "1px solid #f0f0f0",
                                marginTop: "20px"
                            }}>
                                <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "white" }}>
                                    <thead>
                                        <tr style={{ background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)", borderBottom: "2px solid #ff6b35" }}>
                                            <th style={tableHeaderStyle}>Nom du Candidat</th>
                                            <th style={tableHeaderStyle}>Email</th>
                                            <th style={tableHeaderStyle}>Téléphone</th>
                                            <th style={tableHeaderStyle}>Poste</th>
                                            <th style={tableHeaderStyle}>Entreprise</th>
                                            <th style={tableHeaderStyle}>Date de Candidature</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredApplications.map((app, index) => (
                                            <tr key={app.id} style={tableRowStyle(index)} onMouseEnter={tableRowMouseEnter} onMouseLeave={tableRowMouseLeave(index)}>
                                                <td style={tableCellStyle}>{app.candidate?.name || "Inconnu"}</td>
                                                <td style={tableCellStyle}>{app.candidate?.email || "N/A"}</td>
                                                <td style={tableCellStyle}>{app.candidate?.phoneNumber || "N/A"}</td>
                                                <td style={tableCellStyle}>{app.job_offer?.title || "Inconnu"}</td>
                                                <td style={tableCellStyle}>{app.job_offer?.company || "N/A"}</td>
                                                <td style={tableCellStyle}>{app.application_date}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const tableHeaderStyle = { color: "white", fontWeight: "600", fontSize: "14px", padding: "18px 16px", textAlign: "left", letterSpacing: "0.5px", textTransform: "uppercase" };
const tableCellStyle = { padding: "16px", fontSize: "14px", color: "#2d2d2d", fontWeight: "500" };
const tableRowStyle = (index) => ({ backgroundColor: index % 2 === 0 ? "#ffffff" : "#fafafa", borderBottom: "1px solid #e8e8e8", transition: "all 0.3s ease", cursor: "pointer" });
const tableRowMouseEnter = (e) => { e.currentTarget.style.backgroundColor = "#fff5f0"; e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(255, 107, 53, 0.1)"; };
const tableRowMouseLeave = (index) => (e) => { e.currentTarget.style.backgroundColor = index % 2 === 0 ? "#ffffff" : "#fafafa"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; };

export default Applications;