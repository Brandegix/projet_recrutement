import React, { useEffect, useState } from 'react';
import { FiSearch, FiHome, FiUsers, FiBriefcase, FiCalendar, FiBarChart, FiClipboard, FiLogOut, FiEdit, FiTrash } from 'react-icons/fi';
import { Link, useNavigate } from "react-router-dom";

const ManageJobs = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedJob, setSelectedJob] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [darkMode, setDarkMode] = useState(false); // Assuming you want dark mode capability

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
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/job_offers`);
            if (!response.ok) {
                throw new Error(`Failed to fetch jobs: ${response.status} ${response.statusText}`);
            }
            const data = await response.json();
            setJobs(data);
            setError(null);
        } catch (err) {
            setError(err.message);
            setJobs([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette offre d'emploi ?")) return;
        try {
            const response = await fetch(`<span class="math-inline">\{process\.env\.REACT\_APP\_API\_URL\}/api/job\_offers/</span>{id}`, { method: "DELETE" });
            if (!response.ok) {
                throw new Error(`Failed to delete job: ${response.status} ${response.statusText}`);
            }
            fetchJobs();
        } catch (err) {
            alert(`Erreur lors de la suppression: ${err.message}`);
        }
    };

    const handleEditClick = (job) => {
        setSelectedJob({ ...job });
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setSelectedJob(null);
    };

    const handleSaveChanges = async () => {
        if (!selectedJob) return;
        try {
            const response = await fetch(`<span class="math-inline">\{process\.env\.REACT\_APP\_API\_URL\}/api/job\_offers/</span>{selectedJob.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(selectedJob),
            });
            if (!response.ok) {
                throw new Error(`Failed to update job: ${response.status} ${response.statusText}`);
            }
            setJobs(prevJobs =>
                prevJobs.map(j => (j.id === selectedJob.id ? { ...selectedJob, is_active: selectedJob.is_active } : j))
            );
            handleModalClose();
        } catch (err) {
            alert(`Erreur lors de la mise à jour: ${err.message}`);
        }
    };

    const filteredJobs = jobs.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleContainerStyle = {
        position: 'relative',
        display: 'inline-block',
        width: '40px',
        height: '20px',
    };

    const toggleInputStyle = {
        opacity: 0,
        width: 0,
        height: 0,
    };

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
                backgroundColor: darkMode ? '#3a3a3a' : '#e9e9e9',
                color: darkMode ? '#eee' : '#555',
                padding: '10px 16px',
                textAlign: 'left',
                borderBottom: darkMode ? '1px solid #555' : '1px solid #ccc',
                fontSize: '12px',
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
            width: '40px',
            height: '22px',
            backgroundColor: darkMode ? '#007bff' : '#cccccc', // Blue when active in dark mode
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

    const toggleSliderStyle = (isActive) => ({
        position: 'absolute',
        cursor: 'pointer',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: isActive ? '#ff8c42' : '#ccc', // Blue when active
        transition: '.4s',
        borderRadius: '34px',
    });

    const sliderBeforeStyle = (isActive) => ({
        position: 'absolute',
        content: '""',
        height: '14px',
        width: '14px',
        left: '3px',
        bottom: '3px',
        backgroundColor: 'white',
        transition: '.4s',
        borderRadius: '50%',
        transform: isActive ? 'translateX(20px)' : 'translateX(0)',
    });

    if (loading) return <div className="loading">Chargement des offres...</div>;
    if (error) return <div className="error-message">Erreur : {error}</div>;

    return (
        <div className={`dashboard-container ${darkMode ? 'dark-mode' : ''}`} style={{ display: 'flex', minHeight: '100vh', backgroundColor: darkMode ? '#1a1a1a' : '#ffffff', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", transition: 'all 0.3s ease' }}>
            <div className="sidebar">
                <div className="sidebar-header"><h2>Casajobs.ma</h2></div>
                <nav className="sidebar-nav">
                    <ul>
                        <li><FiHome className="icon" /><Link to="/Dashboard_admin"><span>Tableau de bord</span></Link></li>
                        <li><FiUsers className="icon" /><Link to="/Candidatesadmin"><span>Gérer les candidats</span></Link></li>
                        <li><FiUsers className="icon" /><Link to="/ManageRecruiters"><span>Gérer les recruteurs</span></Link></li>
                        <li><FiClipboard className="icon" /><Link to="/applicationss"><span>Candidats et leurs postulations</span></Link></li>
                        <li><FiBarChart className="icon" /><Link to="/AdminDashboard"><span>Statistiques</span></Link></li>
                        <li className="active"><FiBriefcase className="icon" /><Link to="/ManageJobs"><span>Gérer les offres</span></Link></li>
                        {isLoggedIn && user && (
                            <li onClick={handleLogout} className="logout-link"><FiLogOut className="icon" /><span>Se déconnecter</span></li>
                        )}
                    </ul>
                </nav>
            </div>

            <div style={styles.mainContent}>
                <header style={styles.header}>
                    <h1 style={styles.headerTitle}>Gestion des Offres d'Emploi</h1>
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
                            placeholder="Rechercher par titre, entreprise ou lieu..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={styles.searchInput}
                        />
                    </div>

                    <div style={styles.tableContainer}>
                        {filteredJobs.length === 0 ? (
                            <p style={styles.emptyMessage}>Aucune offre d'emploi trouvée.</p>
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
                                        }}>Lieu</th>
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
                                        }}>Salaire</th>
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
                                        }}>Active</th>
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
                                        }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredJobs.map((job, index) => (
                                        <tr
                                            key={job.id}
                                            style={{
                                                borderBottom: darkMode ? '1px solid #444' : '1px solid #ddd',
                                                backgroundColor: (index % 2 === 1) ? (darkMode ? '#222' : '#f9f9f9') : 'transparent'
                                            }}
                                        >
                                            <td style={{
                                                padding: '12px 16px',
                                                color: darkMode ? '#ccc' : '#666',
                                            }}>{job.title}</td>
                                            <td style={{
                                                padding: '12px 16px',
                                                color: darkMode ? '#ccc' : '#666',
                                            }}>{job.company}</td>
                                            <td style={{
                                                padding: '12px 16px',
                                                color: darkMode ? '#ccc' : '#666',
                                            }}>{job.location}</td>
                                            <td style={{
                                                padding: '12px 16px',
                                                color: darkMode ? '#ccc' : '#666',
                                            }}>{job.salary} MAD</td>
                                           <td style={{
                                                padding: '8px 16px', // Slightly reduce vertical padding
                                                color: darkMode ? '#ccc' : '#666',
                                                textAlign: 'center', // Center the toggle switch
                                          }}>
                                                <label style={toggleContainerStyle} className="switch">
                                                    <input
                                                        type="checkbox"
                                                        style={toggleInputStyle}
                                                        checked={job.is_active}
                                                        disabled
                                                    />
                                                    <span style={toggleSliderStyle(job.is_active)} >
                                                        <span style={sliderBeforeStyle(job.is_active)}></span>
                                                    </span>
                                                </label>
                                            </td>
                                            <td style={{
                    padding: '12px 16px',
                    color: darkMode ? '#ccc' : '#666',
                    textAlign: 'center' // Align icons in the center
                }}>
                    <button
                        style={{
                            background: 'none',
                            border: 'none',
                            color: darkMode ? '#8ac4ff' : '#007bff',
                            cursor: 'pointer',
                            marginRight: '8px',
                            padding: '4px',
                            borderRadius: '4px',
                        }}
                        onClick={() => handleEditClick(job)}
                    >
                        <FiEdit size={18} />
                    </button>
                    <button
                        style={{
                            background: 'none',
                            border: 'none',
                            color: darkMode ? '#ff7878' : '#dc3545',
                            cursor: 'pointer',
                            marginLeft: '8px',
                            padding: '4px',
                            borderRadius: '4px',
                        }}
                        onClick={() => handleDelete(job.id)}
                    >
                        <FiTrash size={18} />
                    </button>
                </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>

            {showModal && selectedJob && (
                <div className="modal-backdrop">
                    <div className="modal">
                        <h3>Modifier l'offre d'emploi</h3>
                        <label>Poste :</label>
                        <input
                            type="text"
                            value={selectedJob.title}
                            onChange={(e) => setSelectedJob({ ...selectedJob, title: e.target.value })}
                        />
                        <label>Entreprise :</label>
                        <input
                            type="text"
                            value={selectedJob.company}
                            onChange={(e) => setSelectedJob({ ...selectedJob, company: e.target.value })}
                        />
                        <label>Lieu :</label>
                        <input
                            type="text"
                            value={selectedJob.location}
                            onChange={(e) => setSelectedJob({ ...selectedJob, location: e.target.value })}
                        />
                        <label>Salaire :</label>
                        <input
                            type="number"
                            value={selectedJob.salary}
                            onChange={(e) => setSelectedJob({ ...selectedJob, salary: e.target.value })}
                        />
                        <label>Active :</label>
                        <label style={toggleContainerStyle} className="switch">
                            <input
                                type="checkbox"
                                style={toggleInputStyle}
                                checked={selectedJob.is_active}
                                onChange={(e) => setSelectedJob({ ...selectedJob, is_active: e.target.checked })}
                            />
                            <span style={toggleSliderStyle(selectedJob.is_active)} className="slider round">
                                <span style={sliderBeforeStyle(selectedJob.is_active)}></span>
                            </span>
                        </label>
                        <div className="modal-actions">
                            <button onClick={handleSaveChanges}>Enregistrer</button>
                            <button onClick={handleModalClose}>Annuler</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageJobs;