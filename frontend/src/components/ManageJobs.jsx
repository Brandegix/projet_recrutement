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
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/job_offers`, {
                method: "GET", // Changed from POST to GET
                credentials: "include",
            });
            if (!response.ok) {
                if (response.status === 403) {
                    navigate('/forbidden');
                    return;
                }
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
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/job_offers/${id}`, { method: "DELETE" });
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
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/job_offers/${selectedJob.id}`, {
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

    if (loading) return <div className="loading">Chargement des offres...</div>;
    if (error) return <div className="error-message">Erreur : {error}</div>;

    return (
        <div className="candidates-container">
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

            <header className="candidates-header">
                <h1>Offres d'Emploi</h1>
                <p>Gérez et suivez toutes vos offres d'emploi.</p>
            </header>

            <div className="search-bar">
                <FiSearch className="search-icon" />
                <input
                    type="text"
                    placeholder="Rechercher par titre, entreprise ou lieu..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="candidates-content">
                <h2>Toutes les offres d'emploi</h2>

                {filteredJobs.length === 0 ? (
                    <div className="no-results">
                        {jobs.length === 0
                            ? "Aucune offre d'emploi dans la base de données."
                            : "Aucune offre d'emploi ne correspond à votre recherche."}
                    </div>
                ) : (
                    <div style={{
                        backgroundColor: "#ffffff",
                        borderRadius: "12px",
                        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                        overflow: "hidden",
                        border: "1px solid #f0f0f0",
                        marginTop: "20px"
                    }}>
                        <table style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            backgroundColor: "white"
                        }}>
                            <thead>
                                <tr style={{
                                    background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
                                    borderBottom: "2px solid #ff6b35"
                                }}>
                                    <th style={{
                                        color: "white",
                                        fontWeight: "600",
                                        fontSize: "14px",
                                        padding: "18px 16px",
                                        textAlign: "left",
                                        letterSpacing: "0.5px",
                                        textTransform: "uppercase"
                                    }}>Poste</th>
                                    <th style={{
                                        color: "white",
                                        fontWeight: "600",
                                        fontSize: "14px",
                                        padding: "18px 16px",
                                        textAlign: "left",
                                        letterSpacing: "0.5px",
                                        textTransform: "uppercase"
                                    }}>Entreprise</th>
                                    <th style={{
                                        color: "white",
                                        fontWeight: "600",
                                        fontSize: "14px",
                                        padding: "18px 16px",
                                        textAlign: "left",
                                        letterSpacing: "0.5px",
                                        textTransform: "uppercase"
                                    }}>Lieu</th>
                                    <th style={{
                                        color: "white",
                                        fontWeight: "600",
                                        fontSize: "14px",
                                        padding: "18px 16px",
                                        textAlign: "left",
                                        letterSpacing: "0.5px",
                                        textTransform: "uppercase"
                                    }}>Salaire</th>
                                    <th style={{
                                        color: "white",
                                        fontWeight: "600",
                                        fontSize: "14px",
                                        padding: "18px 16px",
                                        textAlign: "center",
                                        letterSpacing: "0.5px",
                                        textTransform: "uppercase"
                                    }}>Statut</th>
                                    <th style={{
                                        color: "white",
                                        fontWeight: "600",
                                        fontSize: "14px",
                                        padding: "18px 16px",
                                        textAlign: "center",
                                        letterSpacing: "0.5px",
                                        textTransform: "uppercase",
                                        width: "140px"
                                    }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredJobs.map((job, index) => (
                                    <tr key={job.id} style={{
                                        backgroundColor: index % 2 === 0 ? "#ffffff" : "#fafafa",
                                        borderBottom: "1px solid #e8e8e8",
                                        transition: "all 0.3s ease",
                                        cursor: "pointer"
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = "#fff5f0";
                                        e.currentTarget.style.transform = "translateY(-1px)";
                                        e.currentTarget.style.boxShadow = "0 2px 8px rgba(255, 107, 53, 0.1)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = index % 2 === 0 ? "#ffffff" : "#fafafa";
                                        e.currentTarget.style.transform = "translateY(0)";
                                        e.currentTarget.style.boxShadow = "none";
                                    }}>
                                        <td style={{
                                            padding: "16px",
                                            fontSize: "14px",
                                            color: "#2d2d2d",
                                            fontWeight: "500"
                                        }}>{job.title}</td>
                                        <td style={{
                                            padding: "16px",
                                            fontSize: "13px",
                                            color: "#666666"
                                        }}>{job.company}</td>
                                        <td style={{
                                            padding: "16px",
                                            fontSize: "14px",
                                            color: "#666666"
                                        }}>{job.location}</td>
                                        <td style={{
                                            padding: "16px",
                                            fontSize: "14px",
                                            color: "#666666"
                                        }}>{job.salary} MAD</td>
                                        <td style={{
                                            padding: "16px",
                                            textAlign: "center"
                                        }}>
                                            <span style={{
                                                padding: "6px 12px",
                                                borderRadius: "20px",
                                                fontSize: "12px",
                                                fontWeight: "600",
                                                textTransform: "uppercase",
                                                letterSpacing: "0.5px",
                                                backgroundColor: job.is_active ? "#e8f5e8" : "#fff5f5",
                                                color: job.is_active ? "#2d7d32" : "#d32f2f"
                                            }}>
                                                {job.is_active ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                        <td style={{
                                            padding: "16px",
                                            textAlign: "center"
                                        }}>
                                            <div style={{
                                                display: "flex",
                                                justifyContent: "center",
                                                gap: "12px",
                                                alignItems: "center"
                                            }}>
                                                <div
                                                    onClick={() => handleEditClick(job)}
                                                    style={{
                                                        width: "40px",
                                                        height: "40px",
                                                        borderRadius: "50%",
                                                        backgroundColor: "#ff6b35",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        cursor: "pointer",
                                                        transition: "all 0.3s ease",
                                                        boxShadow: "0 2px 8px rgba(255, 107, 53, 0.3)"
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.backgroundColor = "#e55722";
                                                        e.currentTarget.style.transform = "scale(1.1)";
                                                        e.currentTarget.style.boxShadow = "0 4px 16px rgba(255, 107, 53, 0.4)";
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.backgroundColor = "#ff6b35";
                                                        e.currentTarget.style.transform = "scale(1)";
                                                        e.currentTarget.style.boxShadow = "0 2px 8px rgba(255, 107, 53, 0.3)";
                                                    }}
                                                >
                                                    <FiEdit style={{
                                                        fontSize: "16px",
                                                        color: "white"
                                                    }} />
                                                </div>
                                                <div
                                                    onClick={() => handleDelete(job.id)}
                                                    style={{
                                                        width: "40px",
                                                        height: "40px",
                                                        borderRadius: "50%",
                                                        backgroundColor: "#2d2d2d",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        cursor: "pointer",
                                                        transition: "all 0.3s ease",
                                                        boxShadow: "0 2px 8px rgba(45, 45, 45, 0.3)"
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.backgroundColor = "#1a1a1a";
                                                        e.currentTarget.style.transform = "scale(1.1)";
                                                        e.currentTarget.style.boxShadow = "0 4px 16px rgba(45, 45, 45, 0.4)";
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.backgroundColor = "#2d2d2d";
                                                        e.currentTarget.style.transform = "scale(1)";
                                                        e.currentTarget.style.boxShadow = "0 2px 8px rgba(45, 45, 45, 0.3)";
                                                    }}
                                                >
                                                    <FiTrash style={{
                                                        fontSize: "16px",
                                                        color: "white"
                                                    }} />
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {showModal && selectedJob && (
                <div style={{
                    position: "fixed",
                    top: "0",
                    left: "0",
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.6)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: "1000",
                    backdropFilter: "blur(4px)"
                }}>
                    <div style={{
                        backgroundColor: "white",
                        borderRadius: "16px",
                        padding: "32px",
                        width: "90%",
                        maxWidth: "500px",
                        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
                        border: "2px solid #ff6b35"
                    }}>
                        <h3 style={{
                            margin: "0 0 24px 0",
                            color: "#2d2d2d",
                            fontSize: "24px",
                            fontWeight: "700",
                            textAlign: "center",
                            paddingBottom: "16px",
                            borderBottom: "2px solid #ff6b35"
                        }}>Modifier l'offre d'emploi</h3>
                        
                        <div style={{ marginBottom: "20px" }}>
                            <label style={{
                                display: "block",
                                marginBottom: "8px",
                                color: "#2d2d2d",
                                fontSize: "14px",
                                fontWeight: "600",
                                textTransform: "uppercase",
                                letterSpacing: "0.5px"
                            }}>Poste :</label>
                            <input
                                type="text"
                                value={selectedJob.title}
                                onChange={(e) => setSelectedJob({ ...selectedJob, title: e.target.value })}
                                style={{
                                    width: "100%",
                                    padding: "12px 16px",
                                    border: "2px solid #e8e8e8",
                                    borderRadius: "8px",
                                    fontSize: "14px",
                                    backgroundColor: "#fafafa",
                                    transition: "all 0.3s ease",
                                    outline: "none",
                                    boxSizing: "border-box"
                                }}
                                onFocus={(e) => {
                                    e.currentTarget.style.borderColor = "#ff6b35";
                                    e.currentTarget.style.backgroundColor = "white";
                                }}
                                onBlur={(e) => {
                                    e.currentTarget.style.borderColor = "#e8e8e8";
                                    e.currentTarget.style.backgroundColor = "#fafafa";
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: "20px" }}>
                            <label style={{
                                display: "block",
                                marginBottom: "8px",
                                color: "#2d2d2d",
                                fontSize: "14px",
                                fontWeight: "600",
                                textTransform: "uppercase",
                                letterSpacing: "0.5px"
                            }}>Entreprise :</label>
                            <input
                                type="text"
                                value={selectedJob.company}
                                onChange={(e) => setSelectedJob({ ...selectedJob, company: e.target.value })}
                                style={{
                                    width: "100%",
                                    padding: "12px 16px",
                                    border: "2px solid #e8e8e8",
                                    borderRadius: "8px",
                                    fontSize: "14px",
                                    backgroundColor: "#fafafa",
                                    transition: "all 0.3s ease",
                                    outline: "none",
                                    boxSizing: "border-box"
                                }}
                                onFocus={(e) => {
                                    e.currentTarget.style.borderColor = "#ff6b35";
                                    e.currentTarget.style.backgroundColor = "white";
                                }}
                                onBlur={(e) => {
                                    e.currentTarget.style.borderColor = "#e8e8e8";
                                    e.currentTarget.style.backgroundColor = "#fafafa";
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: "20px" }}>
                            <label style={{
                                display: "block",
                                marginBottom: "8px",
                                color: "#2d2d2d",
                                fontSize: "14px",
                                fontWeight: "600",
                                textTransform: "uppercase",
                                letterSpacing: "0.5px"
                            }}>Lieu :</label>
                            <input
                                type="text"
                                value={selectedJob.location}
                                onChange={(e) => setSelectedJob({ ...selectedJob, location: e.target.value })}
                                style={{
                                    width: "100%",
                                    padding: "12px 16px",
                                    border: "2px solid #e8e8e8",
                                    borderRadius: "8px",
                                    fontSize: "14px",
                                    backgroundColor: "#fafafa",
                                    transition: "all 0.3s ease",
                                    outline: "none",
                                    boxSizing: "border-box"
                                }}
                                onFocus={(e) => {
                                    e.currentTarget.style.borderColor = "#ff6b35";
                                    e.currentTarget.style.backgroundColor = "white";
                                }}
                                onBlur={(e) => {
                                    e.currentTarget.style.borderColor = "#e8e8e8";
                                    e.currentTarget.style.backgroundColor = "#fafafa";
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: "20px" }}>
                            <label style={{
                                display: "block",
                                marginBottom: "8px",
                                color: "#2d2d2d",
                                fontSize: "14px",
                                fontWeight: "600",
                                textTransform: "uppercase",
                                letterSpacing: "0.5px"
                            }}>Salaire :</label>
                            <input
                                type="number"
                                value={selectedJob.salary}
                                onChange={(e) => setSelectedJob({ ...selectedJob, salary: e.target.value })}
                                style={{
                                    width: "100%",
                                    padding: "12px 16px",
                                    border: "2px solid #e8e8e8",
                                    borderRadius: "8px",
                                    fontSize: "14px",
                                    backgroundColor: "#fafafa",
                                    transition: "all 0.3s ease",
                                    outline: "none",
                                    boxSizing: "border-box"
                                }}
                                onFocus={(e) => {
                                    e.currentTarget.style.borderColor = "#ff6b35";
                                    e.currentTarget.style.backgroundColor = "white";
                                }}
                                onBlur={(e) => {
                                    e.currentTarget.style.borderColor = "#e8e8e8";
                                    e.currentTarget.style.backgroundColor = "#fafafa";
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: "32px" }}>
                            <label style={{
                                display: "block",
                                marginBottom: "12px",
                                color: "#2d2d2d",
                                fontSize: "14px",
                                fontWeight: "600",
                                textTransform: "uppercase",
                                letterSpacing: "0.5px"
                            }}>Statut Active :</label>
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "12px"
                            }}>
                                <div
                                    onClick={() => setSelectedJob({ ...selectedJob, is_active: !selectedJob.is_active })}
                                    style={{
                                        position: "relative",
                                        width: "50px",
                                        height: "26px",
                                        backgroundColor: selectedJob.is_active ? "#ff6b35" : "#cccccc",
                                        borderRadius: "50px",
                                        cursor: "pointer",
                                        transition: "all 0.3s ease"
                                    }}
                                >
                                    <div style={{
                                        position: "absolute",
                                        top: "3px",
                                        left: selectedJob.is_active ? "27px" : "3px",
                                        width: "20px",
                                        height: "20px",
                                        backgroundColor: "white",
                                        borderRadius: "50%",
                                        transition: "all 0.3s ease",
                                        boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                                    }}></div>
                                </div>
                                <span style={{
                                    fontSize: "14px",
                                    color: "#666666",
                                    fontWeight: "500"
                                }}>
                                    {selectedJob.is_active ? "Active" : "Inactive"}
                                </span>
                            </div>
                        </div>

                        <div style={{
                            display: "flex",
                            gap: "16px",
                            justifyContent: "center"
                        }}>
                            <button
                                onClick={handleSaveChanges}
                                style={{
                                    padding: "12px 24px",
                                    backgroundColor: "#ff6b35",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "8px",
                                    fontSize: "14px",
                                    fontWeight: "600",
                                    cursor: "pointer",
                                    transition: "all 0.3s ease",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.5px",
                                    minWidth: "120px"
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = "#e55722";
                                    e.currentTarget.style.transform = "translateY(-2px)";
                                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(255, 107, 53, 0.3)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = "#ff6b35";
                                    e.currentTarget.style.transform = "translateY(0)";
                                    e.currentTarget.style.boxShadow = "none";
                                }}
                            >
                                Enregistrer
                            </button>
                            <button
                                onClick={handleModalClose}
                                style={{
                                    padding: "12px 24px",
                                    backgroundColor: "#2d2d2d",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "8px",
                                    fontSize: "14px",
                                    fontWeight: "600",
                                    cursor: "pointer",
                                    transition: "all 0.3s ease",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.5px",
                                    minWidth: "120px"
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = "#1a1a1a";
                                    e.currentTarget.style.transform = "translateY(-2px)";
                                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(45, 45, 45, 0.3)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = "#2d2d2d";
                                    e.currentTarget.style.transform = "translateY(0)";
                                    e.currentTarget.style.boxShadow = "none";
                                }}
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageJobs;