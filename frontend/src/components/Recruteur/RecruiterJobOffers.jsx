import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from "../Navbara";
import Footer from "../Footer";
import ApplicationChat from './ApplicationChat';
import SEO from "../SEO";

// Custom hook to detect screen size
const useMediaQuery = (query) => {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const media = window.matchMedia(query);
        if (media.matches !== matches) {
            setMatches(media.matches);
        }
        const listener = () => setMatches(media.matches);
        media.addEventListener('change', listener);
        return () => media.removeEventListener('change', listener);
    }, [matches, query]);

    return matches;
};

const RecruiterJobOffers = () => {
    const [offers, setOffers] = useState([]);
    const [applications, setApplications] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const [selectedApplicationId, setSelectedApplicationId] = useState(null);
    const [user, setUser] = useState(null);

    // Media Queries for responsiveness
    const isMobile = useMediaQuery('(max-width: 767px)');
    const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)');

    useEffect(() => {
        setIsLoading(true);
        fetch(`${process.env.REACT_APP_API_URL}/api/recruiter/profile`, { method: 'GET', credentials: 'include' })
            .then(res => res.json())
            .then(userData => setUser(userData))
            .catch(err => console.error("Error fetching recruiter profile:", err));

        fetch(`${process.env.REACT_APP_API_URL}/api/recruiter/job_offers`, { method: 'GET', credentials: 'include' })
            .then(response => {
                if (!response.ok) throw new Error("Failed to fetch job offers");
                return response.json();
            })
            .then(data => setOffers(data))
            .catch(error => setError("Impossible de charger les offres d'emploi."))
            .finally(() => setIsLoading(false));

        fetch(`${process.env.REACT_APP_API_URL}/api/recruiter/applications`, { method: 'GET', credentials: 'include' })
            .then(response => response.json())
            .then(data => setApplications(data))
            .catch(error => console.error("Error fetching applications:", error));

    }, []);

    const handleCreateJobOffer = () => navigate('/JobOfferForm');
    const handleDeleteOffer = (offerId) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cette offre ?")) {
            fetch(`${process.env.REACT_APP_API_URL}/api/recruiter/job_offers/${offerId}`, { method: 'DELETE', credentials: 'include' })
                .then(response => {
                    if (!response.ok) throw new Error("Erreur lors de la suppression");
                    setOffers(prev => prev.filter(o => o.id !== offerId));
                    setSuccessMessage("Offre supprimée !");
                    setTimeout(() => setSuccessMessage(null), 3000);
                })
                .catch(error => alert("Erreur lors de la suppression."));
        }
    };
    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
    const filteredOffers = offers.filter(offer => offer.title.toLowerCase().includes(searchTerm.toLowerCase()));

    // Responsive styles based on screen size
    const responsiveStyles = {
        dashboard: {
            padding: isMobile ? '15px' : '30px',
            alignItems: 'stretch', // Allow children to stretch horizontally
        },
        header: {
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'center' : 'center',
            textAlign: isMobile ? 'center' : 'left',
            marginBottom: isMobile ? '20px' : '30px',
            width: '100%', // Use full width on all screens
            maxWidth: '1200px', // Maintain max width
        },
        h1: {
            fontSize: isMobile ? '1.8em' : '2.5em',
            marginBottom: isMobile ? '15px' : '0',
        },
        createButton: {
            width: isMobile ? '100%' : 'auto', // Full width on mobile
            fontSize: isMobile ? '1em' : '1.1em',
            padding: isMobile ? '10px 15px' : '12px 20px',
            minWidth: isMobile ? 'auto' : '200px',
        },
        searchContainer: {
            width: '100%', // Use full width on all screens
            maxWidth: '1200px',
        },
        offerList: {
            gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(auto-fit, minmax(320px, 1fr))' : 'repeat(auto-fit, minmax(380px, 1fr))',
            gap: isMobile ? '15px' : '25px',
            width: '100%', // Use full width on all screens
            maxWidth: '1200px',
        },
        offerCard: {
            padding: isMobile ? '20px' : '25px',
        },
        offerTitle: {
            fontSize: isMobile ? '1.4em' : '1.7em',
        },
        offerDetails: {
            fontSize: isMobile ? '0.9em' : '1em',
        },
        offerDescription: {
            fontSize: isMobile ? '0.9em' : '1em',
        },
        applicationsPreviewTitle: {
            fontSize: isMobile ? '1em' : '1.1em',
        },
        applicationItem: {
            fontSize: isMobile ? '0.85em' : '0.95em',
        },
        offerActions: {
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? '8px' : '10px',
            marginTop: isMobile ? '15px' : '0',
            width: isMobile ? '100%' : 'auto',
            '& > *': {
                width: isMobile ? '100%' : 'auto', // Make buttons full width on mobile
            }
        },
        editButton: {
            padding: isMobile ? '8px 15px' : '10px 18px',
            fontSize: isMobile ? '0.8em' : '0.9em',
        },
        deleteButton: {
            padding: isMobile ? '8px 15px' : '10px 18px',
            fontSize: isMobile ? '0.8em' : '0.9em',
        },
        chatSection: {
            padding: isMobile ? '15px' : '20px',
            width: '100%', // Full width on mobile
            maxWidth: '1200px',
        },
        closeChatButton: {
            padding: isMobile ? '8px 15px' : '10px 18px',
            fontSize: isMobile ? '0.8em' : '0.9em',
            width: isMobile ? '100%' : 'auto', // Full width on mobile
        },
    };

    return (
        <>
            <Navbar />
            <SEO title="Mes Offres" />
            <div style={{ ...enhancedStyles.dashboard, ...responsiveStyles.dashboard }}>
                <div style={{ ...enhancedStyles.header, ...responsiveStyles.header }}>
                    <h1 style={{ ...enhancedStyles.h1, ...responsiveStyles.h1 }}>Gestion des Offres</h1>
                    <button
                        style={{ ...enhancedStyles.createButton, ...responsiveStyles.createButton }}
                        onClick={handleCreateJobOffer}
                    >
                        <span style={{ fontSize: '1em', marginRight: '8px' }}>+</span> Ajouter Offre
                    </button>
                </div>
                <div style={{ ...enhancedStyles.searchContainer, ...responsiveStyles.searchContainer }}>
                    <input
                        type="text"
                        placeholder="Rechercher par titre..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={enhancedStyles.searchInput}
                    />
                </div>
                {successMessage && <div style={enhancedStyles.success}>{successMessage}</div>}
                {error && <div style={enhancedStyles.error}>{error}</div>}
                {isLoading ? (
                    <div style={enhancedStyles.loading}>Chargement...</div>
                ) : filteredOffers.length === 0 ? (
                    <div style={enhancedStyles.empty}>Aucune offre d'emploi disponible.</div>
                ) : (
                    <div style={{ ...enhancedStyles.offerList, ...responsiveStyles.offerList }}>
                        {filteredOffers.map(offer => (
                            <div key={offer.id} style={{ ...enhancedStyles.offerCard, ...responsiveStyles.offerCard }}>
                                <h3 style={{ ...enhancedStyles.offerTitle, ...responsiveStyles.offerTitle }}>{offer.title}</h3>
                                <div style={{ ...enhancedStyles.offerDetails, ...responsiveStyles.offerDetails }}>
                                    <p><strong style={enhancedStyles.strong}>Entreprise:</strong> {offer.company}</p>
                                    <p><strong style={enhancedStyles.strong}>Lieu:</strong> {offer.location}</p>
                                    <p><strong style={enhancedStyles.strong}>Type:</strong> {offer.type || 'N/A'}</p>
                                    <p style={{ ...enhancedStyles.offerDescription, ...responsiveStyles.offerDescription }}>{offer.description.substring(0, 100)}...</p>
                                </div>
                                <div style={enhancedStyles.applicationsPreview}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexDirection: isMobile ? 'column' : 'row' }}>
                                        <h4 style={{ ...enhancedStyles.applicationsPreviewTitle, ...responsiveStyles.applicationsPreviewTitle }}>Candidatures Récentes</h4>
                                        {applications.filter(app => app.job_offer_id === offer.id).length > 0 && (
                                            <Link to={`/recruiter/job-offers/${offer.id}/applications`} style={enhancedStyles.viewAllApplications}>
                                                Voir toutes ({applications.filter(a => a.job_offer_id === offer.id).length})
                                            </Link>
                                        )}
                                    </div>
                                    {applications.filter(app => app.job_offer_id === offer.id).length === 0 ? (
                                        <p style={{ fontStyle: 'italic', color: '#777', fontSize: '0.9em', marginTop: '5px' }}>Aucune candidature pour le moment.</p>
                                    ) : (
                                        applications
                                            .filter(app => app.job_offer_id === offer.id)
                                            .slice(-1)
                                            .map(app => (
                                                <div key={app.id} style={{ ...enhancedStyles.applicationItem, ...responsiveStyles.applicationItem }}>
                                                    {app.candidate?.name} ({formatDate(app.application_date)})
                                                </div>
                                            ))
                                    )}
                                </div>
                                <div style={{ ...enhancedStyles.offerActions, ...responsiveStyles.offerActions }}>
                                    <Link to={`/edit-offer/${offer.id}`} style={{ ...enhancedStyles.editButton, ...responsiveStyles.editButton }}>Modifier</Link>
                                    <button style={{ ...enhancedStyles.deleteButton, ...responsiveStyles.deleteButton }} onClick={() => handleDeleteOffer(offer.id)}>Supprimer</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {selectedApplicationId && user?.id && (
                    <div style={{ ...enhancedStyles.chatSection, ...responsiveStyles.chatSection }}>
                        <ApplicationChat userId={user.id} userType={'recruiter'} applicationId={selectedApplicationId} />
                        <button onClick={() => setSelectedApplicationId(null)} style={{ ...enhancedStyles.closeChatButton, ...responsiveStyles.closeChatButton }}>Fermer Chat</button>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};

const enhancedStyles = {
    dashboard: { fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif', backgroundColor: '#f4f4f4', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '90%', maxWidth: '1200px' },
    h1: { color: '#333', fontWeight: '600' },
    createButton: {
        backgroundColor: '#ff8f00',
        color: 'white',
        border: 'none',
        borderRadius: '10px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease-in-out',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    createButtonHover: { backgroundColor: '#e65100' },
    searchContainer: { marginBottom: '20px' },
    searchInput: { width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ccc', boxSizing: 'border-box', fontSize: '1em' },
    offerList: { display: 'grid', gap: '25px' },
    offerCard: {
        backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        border: '1px solid #ddd'
    },
    offerTitle: { color: '#333', fontWeight: '600', marginBottom: '12px' },
    offerDetails: { marginBottom: '15px', color: '#555' },
    strong: { fontWeight: 'bold' },
    offerDescription: { color: '#555', marginBottom: '15px' },
    applicationsPreview: { marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '15px' },
    applicationsPreviewTitle: { color: '#333', fontWeight: '500', marginBottom: '10px' },
    applicationItem: { backgroundColor: '#f9f9f9', padding: '8px', borderRadius: '4px', marginBottom: '5px', color: '#555' },
    viewAllApplications: { color: '#ff8f00', textDecoration: 'none', fontSize: '0.9em', fontWeight: '500' },
    offerActions: { display: 'flex', gap: '10px', alignItems: 'center' },
    editButton: { backgroundColor: '#424242', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', textDecoration: 'none', transition: 'background-color 0.3s ease-in-out' },
    editButtonHover: { backgroundColor: '#212121' },
    deleteButton: { backgroundColor: '#d32f2f', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', transition: 'background-color 0.3s ease-in-out' },
    deleteButtonHover: { backgroundColor: '#b71c1c' },
    applicationsButton: { backgroundColor: '#ff8f00', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', textDecoration: 'none', transition: 'background-color 0.3s ease-in-out' },
    applicationsButtonHover: { backgroundColor: '#e65100' },
    loading: { textAlign: 'center', marginTop: '30px', color: '#777', fontSize: '1.1em' },
    empty: { textAlign: 'center', marginTop: '30px', color: '#777', fontSize: '1.1em' },
    success: { backgroundColor: '#fff3e0', color: '#e65100', padding: '15px', margin: '20px auto', borderRadius: '8px', width: '90%', maxWidth: '1200px' },
    error: { backgroundColor: '#ffebee', color: '#d32f2f', padding: '15px', margin: '20px auto', borderRadius: '8px', width: '90%', maxWidth: '1200px' },
    chatSection: { marginTop: '30px', padding: '20px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' },
    closeChatButton: { backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', marginTop: '15px' },
};

export default RecruiterJobOffers;
