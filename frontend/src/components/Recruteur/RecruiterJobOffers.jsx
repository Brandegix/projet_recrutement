import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../../assets/css/RecruiterJobOffers.css";
import Navbar from "../Navbara";
import Footer from "../Footer";
import { Link } from "react-router-dom";
import ApplicationChat from './ApplicationChat';

const RecruiterJobOffers = () => {
    const [offers, setOffers] = useState([]);
    const [applications, setApplications] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const [selectedApplicationId, setSelectedApplicationId] = useState(null);
    const [user, setUser] = useState(null); // To store recruiter's user data, to get the recruiter ID

    useEffect(() => {
        setIsLoading(true);

        // Fetch recruiter's user data first
        fetch('http://localhost:5000/api/recruiter/profile', {  // Corrected endpoint
            method: 'GET',
            credentials: 'include',
        })
            .then((response) => {
                if (!response.ok) throw new Error("Failed to fetch recruiter profile");
                return response.json();
            })
            .then((userData) => {
                setUser(userData); // Store recruiter data
                // Fetch job offers *after* getting recruiter data
                fetch('http://localhost:5000/api/recruiter/job_offers', {
                    method: 'GET',
                    credentials: 'include',
                })
                    .then((response) => {
                        if (!response.ok) throw new Error("Failed to fetch job offers");
                        return response.json();
                    })
                    .then((data) => setOffers(data))
                    .catch((error) => {
                        console.error(error);
                        setError("Pas de candidatures pour l'instant");
                    });

                // Fetch applications
                fetch('http://localhost:5000/api/recruiter/applications', {
                    method: 'GET',
                    credentials: 'include',
                })
                    .then((response) => {
                        if (!response.ok) throw new Error("Failed to fetch applications");
                        return response.json();
                    })
                    .then((data) => {
                        setApplications(data);
                        setIsLoading(false);
                    })
                    .catch((error) => {
                        console.error(error);
                        setError("Pas de candidatures pour l'instant");
                        setIsLoading(false);
                    });
            })
            .catch((error) => {
                console.error(error);
                setError("Impossible de charger votre profil. Veuillez réessayer plus tard.");
                setIsLoading(false); // Ensure loading is set to false on error
            });
    }, []);


    const handleCreateJobOffer = () => {
        navigate('/JobOfferForm');
    };

    const handleDeleteOffer = (offerId) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cette offre ?")) {
            fetch(`http://localhost:5000/api/recruiter/job_offers/${offerId}`, {
                method: 'DELETE',
                credentials: 'include',
            })
                .then((response) => {
                    if (!response.ok) throw new Error("Erreur lors de la suppression");
                    setOffers(prev => prev.filter(offer => offer.id !== offerId));
                    setSuccessMessage("Offre supprimée avec succès !");
                    setTimeout(() => setSuccessMessage(null), 4000);
                })
                .catch((error) => {
                    console.error(error);
                    alert("Une erreur est survenue. Veuillez réessayer.");
                });
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('fr-FR', options);
    };

    const filteredOffers = offers.filter(offer =>
        offer.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <Navbar />
            <div className="recruiter-dashboard">
                <div className="dashboard-header">
                    <h1>Mes Offres d'Emploi</h1>
                    <div style={{ textAlign: "center", marginTop: "20px" }}>
                        <Link to="/recruiter-profile" className="view-jobs-link">
                            Explorer les candidats
                        </Link>
                    </div>
                    <button className="create-job-button" onClick={handleCreateJobOffer}>
                        <span className="button-icon">+</span> Publier une nouvelle offre
                    </button>
                </div>

                <input
                    type="text"
                    placeholder="Rechercher une offre..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />

                {successMessage && <div className="success-message">{successMessage}</div>}
                {error && <div className="error-message">{error}</div>}

                {isLoading ? (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Chargement en cours...</p>
                    </div>
                ) : filteredOffers.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">📄</div>
                        <h2>Aucune offre d'emploi disponible</h2>
                        <p>Commencez par publier votre première offre d'emploi pour attirer des candidats.</p>
                        <button className="create-first-job-button" onClick={handleCreateJobOffer}>
                            Créer ma première offre
                        </button>
                    </div>
                ) : (
                    <div className="offers-grid">
                        {filteredOffers.map((offer) => (
                            <div key={offer.id} className="job-offer-card">
                                <div className="offer-header">
                                    <h2>{offer.title}</h2>
                                    <div className="offer-badges">
                                        <span className="badge badge-type">{offer.type || 'CDI'}</span>
                                        <span className="badge badge-location">{offer.location}</span>
                                        {offer.is_active ? (
                                            <span className="status-text active">
                                                ✅ Active
                                            </span>
                                        ) : (
                                            <span className="status-text inactive">
                                                ❌ Inactive
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="offer-details">
                                    <div className="offer-detail">
                                        <span className="detail-icon" role="img" aria-label="entreprise">🏢</span>
                                        <span className="detail-text">{offer.company}</span>
                                    </div>
                                    <div className="offer-detail">
                                        <span className="detail-icon" role="img" aria-label="salaire">💰</span>
                                        <span className="detail-text">{offer.salary} MAD</span>
                                    </div>
                                    <div className="offer-detail">
                                        <span className="detail-icon" role="img" aria-label="description">📝</span>
                                        <span className="detail-text">{offer.description.substring(0, 120)}...</span>
                                    </div>
                                </div>

                                <div className="offer-actions">
                                    <button className="action-button edit" onClick={() => navigate(`/edit-offer/${offer.id}`)}>
                                        ✏️ Modifier
                                    </button>
                                    <button className="action-button delete" onClick={() => handleDeleteOffer(offer.id)}>
                                        🗑️ Supprimer
                                    </button>
                                </div>

                                <div style={{ 
    padding: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)"
}}>
    <h3 style={{ 
        fontSize: "24px",
        fontWeight: "bold",
        marginBottom: "15px",
        textAlign: "center",
        color: "#333"
    }}>
        Candidatures
        <span style={{ 
            fontSize: "18px",
            fontWeight: "bold",
            color: "#007bff",
            marginLeft: "8px"
        }}>
            {applications.filter(app => app.job_offer_id === offer.id).length}
        </span>
    </h3>

    {applications.filter(app => app.job_offer_id === offer.id).length === 0 ? (
        <p style={{ 
            textAlign: "center",
            fontSize: "16px",
            color: "#888",
            padding: "10px",
            backgroundColor: "#fff",
            borderRadius: "10px",
            boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)"
        }}>
            Aucune candidature pour cette offre.
        </p>
    ) : (
        <div style={{ 
            display: "flex",
            flexDirection: "column",
            gap: "15px"
        }}>
            {applications
                .filter(app => app.job_offer_id === offer.id)
                .map((app) => (
                    <div key={app.id} style={{ 
                        display: "flex",
                        flexDirection: "column",
                        backgroundColor: "#fff",
                        padding: "15px",
                        borderRadius: "10px",
                        boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
                        transition: "0.3s",
                        ":hover": {
                            transform: "scale(1.02)"
                        }
                    }}>
                        <div style={{ 
                            display: "flex",
                            alignItems: "center",
                            gap: "15px",
                            borderBottom: "2px solid #ddd",
                            paddingBottom: "10px",
                            marginBottom: "10px"
                        }}>
                            <div style={{ 
                                width: "50px",
                                height: "50px",
                                borderRadius: "50%",
                                backgroundColor: "#007bff",
                                color: "#fff",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                fontSize: "20px",
                                fontWeight: "bold"
                            }}>
                                {app.candidate?.name?.charAt(0) || "?"}
                            </div>
                            <div style={{ flex: 1 }}>
                                <h4>{app.candidate?.name}</h4>
                                <div style={{ display: "grid", gap: "5px" }}>
                                    <div style={{ fontSize: "14px", color: "#555" }}>
                                        <strong>Email:</strong> {app.candidate?.email || "N/A"}
                                    </div>
                                    <div style={{ fontSize: "14px", color: "#555" }}>
                                        <strong>Téléphone:</strong> {app.candidate?.phoneNumber || "N/A"}
                                    </div>
                                    <div style={{ fontSize: "14px", color: "#555" }}>
                                        <strong>CV:</strong>
                                        <a href={`http://localhost:5000/uploads/cv/${app.candidate?.cv_filename}`} 
                                           target="_blank" 
                                           rel="noopener noreferrer"
                                           style={{ textDecoration: "none", color: "#007bff", fontWeight: "bold" }}>
                                            Voir CV
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style={{ textAlign: "right", fontSize: "14px", color: "#666" }}>
                            Candidature reçue le {formatDate(app.application_date)}
                        </div>
                        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
                            <button style={{ 
                                padding: "10px 15px",
                                backgroundColor: "#007bff",
                                color: "#fff",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                                transition: "0.3s",
                            }} 
                            onClick={() => setSelectedApplicationId(app.id)}>
                                Contacter
                            </button>
                        </div>
                    </div>
                ))}
        </div>
    )}
</div>

                                   
                            </div>
                        ))}
                    </div>
                )}
                {selectedApplicationId && (
                    <div className="chat-section">
                        <ApplicationChat
                            userId={user?.id}
                            userType={'recruiter'}
                            applicationId={selectedApplicationId}
                        />
                        <button onClick={() => setSelectedApplicationId(null)}>
                            Close Chat
                        </button>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};

export default RecruiterJobOffers;

