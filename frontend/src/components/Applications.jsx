import React, { useEffect, useState } from 'react';
import { FiSearch, FiHome, FiUsers, FiBriefcase, FiCalendar, FiBarChart, FiClipboard, FiLogOut } from 'react-icons/fi';
import { Link, useNavigate } from "react-router-dom";
import { Users, Briefcase, Clipboard, BarChart3, LogOut, Home } from 'lucide-react'; // Importing Lucide icons

const Applications = () => {
    const [applications, setApplications] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [darkMode, setDarkMode] = useState(false); // To match the dashboard's theme

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/api/session`, {
            credentials: "include",
        })
            .then(res => res.ok ? res.json() : Promise.reject("Not logged in"))
            .then(data => {
                if (data?.isLoggedIn) {
                    setIsLoggedIn(true);
                    setUser(data.user);
                } else {
                    setIsLoggedIn(false);
                    setUser(null);
                }
            })
            .catch(() => {
                setIsLoggedIn(false);
                setUser(null);
            });
    }, []);

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
        fetch(`${process.env.REACT_APP_API_URL}/api/sapplications`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setApplications(data);
                } else if (Array.isArray(data.applications)) {
                    setApplications(data.applications);
                } else {
                    console.error("Format inattendu:", data);
                    setApplications([]);
                }
            })
            .catch(err => console.error("Erreur lors du chargement des candidatures:", err));
    }, []);

    const filteredApplications = Array.isArray(applications)
        ? applications.filter(app => {
            if (!app.candidate?.name) return false;
            return app.candidate.name.toLowerCase().includes(searchTerm.toLowerCase());
        })
        : [];

    // Styles similar to AdminDashboard
    const styles = {
        mainContent: {
            flex: 1,
            backgroundColor: darkMode ? '#1a1a1a' : '#f8f9fa',
            transition: 'all 0.3s ease',
            display: 'flex',
            flexDirection: 'column',
            marginLeft: '260px', // Adjust based on your sidebar width
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
        contentArea: {
            padding: '24px 32px',
            flex: 1,
            overflow: 'auto'
        },
        searchBar: {
            backgroundColor: darkMode ? '#2d2d2d' : '#ffffff',
            padding: '16px',
            borderRadius: '12px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            border: darkMode ? '1px solid #404040' : '1px solid #e5e5e5',
            boxShadow: darkMode ? '0 2px 8px rgba(0,0,0,0.1)' : '0 1px 3px rgba(0,0,0,0.03)'
        },
        searchIcon: {
            fontSize: '20px',
            marginRight: '12px',
            color: darkMode ? '#cccccc' : '#666666'
        },
        searchInput: {
            flex: 1,
            border: 'none',
            padding: '10px',
            borderRadius: '8px',
            fontSize: '16px',
            backgroundColor: 'transparent',
            color: darkMode ? '#ffffff' : '#1a1a1a',
            '&::placeholder': {
                color: darkMode ? '#999999' : '#bbbbbb'
            }
        },
        tableContainer: {
            backgroundColor: darkMode ? '#2d2d2d' : '#ffffff',
            borderRadius: '12px',
            boxShadow: darkMode ? '0 4px 20px rgba(0,0,0,0.2)' : '0 4px 20px rgba(0,0,0,0.06)',
            border: darkMode ? '1px solid #404040' : '1px solid #e5e5e5',
            overflow: 'auto'
        },
        
        applicationsTable: {
          width: '100%',
          borderCollapse: 'collapse',
          borderSpacing: 0,
          '& th': {
              backgroundColor: darkMode ? '#3a3a3a' : '#e9e9e9', // A lighter background
              color: darkMode ? '#eee' : '#555',
              padding: '10px 16px', // Reduced vertical padding
              textAlign: 'left',
              borderBottom: darkMode ? '1px solid #555' : '1px solid #ccc',
              fontSize: '12px', // Smaller font size
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.3px',
          },
          '& td': {
              padding: '12px 16px',
              color: darkMode ? '#ccc' : '#666',
          },
          '& tr:nth-child(even) td': {
              backgroundColor: darkMode ? '#222' : '#f9f9f9',
          },
          '& tr:last-child td': {
              borderBottom: 'none'
          },
          '& tr': {
              borderBottom: darkMode ? '1px solid #444' : '1px solid #ddd',
          },
          '& thead tr': {
              borderBottom: darkMode ? '2px solid #555' : '2px solid #bbb',
          }
      },
        emptyMessage: {
            padding: '20px',
            color: darkMode ? '#cccccc' : '#666666',
            textAlign: 'center'
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
        }
    };

    return (
        <div className={`dashboard-container ${darkMode ? 'dark-mode' : ''}`} style={{ display: 'flex', minHeight: '100vh', backgroundColor: darkMode ? '#1a1a1a' : '#ffffff', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", transition: 'all 0.3s ease' }}>
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

            <div style={styles.mainContent}>
                <header style={styles.header}>
                    <h1 style={styles.headerTitle}>Liste des Candidatures</h1>
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
                    <div style={styles.searchBar}>
                        <FiSearch style={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Rechercher par nom..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={styles.searchInput}
                        />
                    </div>

                    <div style={styles.tableContainer}>
                        {filteredApplications.length === 0 ? (
                            <p style={styles.emptyMessage}>Aucune candidature trouvée.</p>
                        ) : (
                          <table style={{
                            width: '100%',
                            borderCollapse: 'collapse',
                            borderSpacing: 0,
                        }}>
                          <thead>
                            <tr style={{
                              borderBottom: darkMode ? '2px solid #555' : '2px solid #bbb'
                            }}>
                              <th style={{
                                backgroundColor: darkMode ? '#3a3a3a' : '#e9e9e9',
                                color: darkMode ? '#eee' : '#555',
                                padding: '10px 16px',
                                textAlign: 'left',
                                borderBottom: darkMode ? '1px solid #555' : '1px solid #ccc',
                                fontSize: '12px',
                                fontWeight: '600',
                                textTransform: 'uppercase',
                                letterSpacing: '0.3px',
                              }}>Nom du Candidat</th>
                              <th style={{
                                backgroundColor: darkMode ? '#3a3a3a' : '#e9e9e9',
                                color: darkMode ? '#eee' : '#555',
                                padding: '10px 16px',
                                textAlign: 'left',
                                borderBottom: darkMode ? '1px solid #555' : '1px solid #ccc',
                                fontSize: '12px',
                                fontWeight: '600',
                                textTransform: 'uppercase',
                                letterSpacing: '0.3px',
                              }}>Email</th>
                              <th style={{
                                backgroundColor: darkMode ? '#3a3a3a' : '#e9e9e9',
                                color: darkMode ? '#eee' : '#555',
                                padding: '10px 16px',
                                textAlign: 'left',
                                borderBottom: darkMode ? '1px solid #555' : '1px solid #ccc',
                                fontSize: '12px',
                                fontWeight: '600',
                                textTransform: 'uppercase',
                                letterSpacing: '0.3px',
                              }}>Téléphone</th>
                              <th style={{
                                backgroundColor: darkMode ? '#3a3a3a' : '#e9e9e9',
                                color: darkMode ? '#eee' : '#555',
                                padding: '10px 16px',
                                textAlign: 'left',
                                borderBottom: darkMode ? '1px solid #555' : '1px solid #ccc',
                                fontSize: '12px',
                                fontWeight: '600',
                                textTransform: 'uppercase',
                                letterSpacing: '0.3px',
                              }}>Poste</th>
                              <th style={{
                                backgroundColor: darkMode ? '#3a3a3a' : '#e9e9e9',
                                color: darkMode ? '#eee' : '#555',
                                padding: '10px 16px',
                                textAlign: 'left',
                                borderBottom: darkMode ? '1px solid #555' : '1px solid #ccc',
                                fontSize: '12px',
                                fontWeight: '600',
                                textTransform: 'uppercase',
                                letterSpacing: '0.3px',
                              }}>Entreprise</th>
                              <th style={{
                                backgroundColor: darkMode ? '#3a3a3a' : '#e9e9e9',
                                color: darkMode ? '#eee' : '#555',
                                padding: '10px 16px',
                                textAlign: 'left',
                                borderBottom: darkMode ? '1px solid #555' : '1px solid #ccc',
                                fontSize: '12px',
                                fontWeight: '600',
                                textTransform: 'uppercase',
                                letterSpacing: '0.3px',
                              }}>Date de Candidature</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredApplications.map((app, index) => (
                              <tr
                                key={app.id}
                                style={{
                                  borderBottom: darkMode ? '1px solid #444' : '1px solid #ddd',
                                  backgroundColor: (index % 2 === 1) ? (darkMode ? '#222' : '#f9f9f9') : 'transparent'
                                }}
                              >
                                <td style={{
                                  padding: '12px 16px',
                                  color: darkMode ? '#ccc' : '#666',
                                }}>{app.candidate?.name || "Inconnu"}</td>
                                <td style={{
                                  padding: '12px 16px',
                                  color: darkMode ? '#ccc' : '#666',
                                }}>{app.candidate?.email || "N/A"}</td>
                                <td style={{
                                  padding: '12px 16px',
                                  color: darkMode ? '#ccc' : '#666',
                                }}>{app.candidate?.phoneNumber || "N/A"}</td>
                                <td style={{
                                  padding: '12px 16px',
                                  color: darkMode ? '#ccc' : '#666',
                                }}>{app.job_offer?.title || "Inconnu"}</td>
                                <td style={{
                                  padding: '12px 16px',
                                  color: darkMode ? '#ccc' : '#666',
                                }}>{app.job_offer?.company || "N/A"}</td>
                                <td style={{
                                  padding: '12px 16px',
                                  color: darkMode ? '#ccc' : '#666',
                                }}>{app.application_date}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Applications;