import React, { useEffect, useState } from 'react';
import '../assets/css/AdminTable.css';
import { FiSearch } from 'react-icons/fi';
import { Link, useNavigate } from "react-router-dom";
import { FiHome, FiUsers, FiBriefcase, FiCalendar, FiBarChart, FiClipboard, FiLogOut } from "react-icons/fi";

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
            // Update the job in the state *after* the save is successful.
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

    const toggleSliderStyle = (isActive) => ({
        position: 'absolute',
        cursor: 'pointer',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: isActive ? 'green' : '#ccc',
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
        <div className="candidates-container">
            <div className="sidebar">
                <div className="sidebar-header"><h2>Casajobs.ma</h2></div>
                <nav className="sidebar-nav">
                    <ul>
                        <li>
                            <FiHome className="icon" />
                            <Link to="/Dashboard_admin">
                                <span>Tableau de bord</span>
                            </Link>
                        </li>
                        <li>
                            <FiUsers className="icon" />
                            <Link to="/Candidatesadmin">
                                <span>Gérer les candidats</span>
                            </Link>
                        </li>
                        <li>
                            <FiUsers className="icon" />
                            <Link to="/ManageRecruiters">
                                <span>Gérer les recruteurs</span>
                            </Link>
                        </li>
                        <li>
                            <FiClipboard className="icon" />
                            <Link to="/applicationss">
                                <span>Candidats et leurs postulations</span>
                            </Link>
                        </li>
                        <li>
                            <FiBarChart className="icon" />
                            <Link to="/AdminDashboard">
                                <span>Statistiques</span>
                            </Link>
                        </li>
                        <li className="active">
                            <FiBriefcase className="icon" />
                            <Link to="/ManageJobs">
                                <span>Gérer les offres</span>
                            </Link>
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
            <header className="candidates-header">
                <h1>Gestion des Offres d'Emploi</h1>
                <p>Gérez et suivez toutes les offres publiées.</p>
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
                <h2>Liste des offres</h2>

                {filteredJobs.length === 0 ? (
                    <div className="no-results">
                        {jobs.length === 0
                            ? "Aucune offre dans la base de données."
                            : "Aucune offre ne correspond à votre recherche."}
                    </div>
                ) : (
                    <div className="table-container">
                        <table className="candidates-table">
                            <thead>
                                <tr>
                                    <th>Poste</th>
                                    <th>Entreprise</th>
                                    <th>Lieu</th>
                                    <th>Salaire</th>
                                    <th>Active</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredJobs.map(job => (
                                    <tr key={job.id}>
                                        <td>{job.title}</td>
                                        <td>{job.company}</td>
                                        <td>{job.location}</td>
                                        <td>{job.salary} MAD</td>
                                        <td>
                                            <label style={toggleContainerStyle} className="switch">
                                                <input
                                                    type="checkbox"
                                                    style={toggleInputStyle}
                                                    checked={job.is_active}
                                                    disabled // Keep it disabled
                                                />
                                                <span style={toggleSliderStyle(job.is_active)} className="slider round">
                                                    <span style={sliderBeforeStyle(job.is_active)}></span>
                                                </span>
                                            </label>
                                        </td>
                                        <td>
                                            <button className="edit-button" onClick={() => handleEditClick(job)}>Modifier</button>
                                            <button className="delete-button" onClick={() => handleDelete(job.id)}>Supprimer</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
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


