import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../Navbara';
import Footer from '../Footer';
import ApplicationChat from './ApplicationChat'; // Make sure this path is correct
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Important for accessibility

const JobOfferApplications = () => {
    const { offerId } = useParams();
    const [applications, setApplications] = useState([]);
    const [filteredApplications, setFilteredApplications] = useState([]);
    const [offer, setOffer] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [isChatModalOpen, setIsChatModalOpen] = useState(false);
    const [chatApplicationId, setChatApplicationId] = useState(null);
    const [searchName, setSearchName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoading(true);

        // Fetch recruiter profile
        fetch(`${process.env.REACT_APP_API_URL}/api/recruiter/profile`, { method: 'GET', credentials: 'include' })
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch recruiter profile");
                return res.json();
            })
            .then(userData => setUser(userData))
            .catch(err => console.error("Error fetching recruiter profile:", err));

        // Fetch all applications for the recruiter
        fetch(`${process.env.REACT_APP_API_URL}/api/recruiter/applications`, { method: 'GET', credentials: 'include' })
            .then(response => {
                if (!response.ok) throw new Error("Failed to fetch applications");
                return response.json();
            })
            .then(allApplications => {
                const filteredByOffer = allApplications.filter(app => app.job_offer_id === parseInt(offerId));
                setApplications(filteredByOffer);
                setFilteredApplications(filteredByOffer);
            })
            .catch(err => setError("Failed to load applications."))
            .finally(() => setIsLoading(false));

        // Fetch job offer details
        fetch(`${process.env.REACT_APP_API_URL}/api/job_offers/${offerId}`)
            .then(response => {
                if (!response.ok) throw new Error("Failed to fetch job offer details");
                return response.json();
            })
            .then(data => setOffer(data))
            .catch(err => console.error("Error fetching job offer:", err));

    }, [offerId]);

    useEffect(() => {
        const lowerCaseSearch = searchName.toLowerCase();
        const filtered = applications.filter(app =>
            app.candidate?.name?.toLowerCase().includes(lowerCaseSearch)
        );
        setFilteredApplications(filtered);
    }, [searchName, applications]);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('fr-FR', options);
    };

    const openChatModal = (applicationId) => {
        setChatApplicationId(applicationId);
        setIsChatModalOpen(true);
    };

    const closeChatModal = () => {
        setIsChatModalOpen(false);
        setChatApplicationId(null);
    };

    const markAsViewed = async (applicationId) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/mark_as_viewed/${applicationId}`, {
                method: 'POST',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to mark application as viewed');
            }

            setApplications(prevApps =>
                prevApps.map(app =>
                    app.id === applicationId ? { ...app, viewed: true } : app
                )
            );

            setFilteredApplications(prevApps =>
                prevApps.map(app =>
                    app.id === applicationId ? { ...app, viewed: true } : app
                )
            );
        } catch (error) {
            console.error(error);
        }
    };

    // Enhanced Loading Component
    const LoadingScreen = () => (
        <div style={jobAppStyles.loadingContainer}>
            <div style={jobAppStyles.loadingContent}>
                <div style={jobAppStyles.loadingSpinner}>
                    <div style={jobAppStyles.spinnerRing}></div>
                </div>
                <h2 style={jobAppStyles.loadingTitle}>Chargement des candidatures</h2>
                <p style={jobAppStyles.loadingText}>Veuillez patienter pendant que nous récupérons les données...</p>
                <div style={jobAppStyles.loadingDots}>
                    <span style={{...jobAppStyles.dot, animationDelay: '0s'}}></span>
                    <span style={{...jobAppStyles.dot, animationDelay: '0.2s'}}></span>
                    <span style={{...jobAppStyles.dot, animationDelay: '0.4s'}}></span>
                </div>
            </div>
        </div>
    );

    if (isLoading) {
        return (
            <>
                <Navbar />
                <LoadingScreen />
                <Footer />
            </>
        );
    }

    if (error) {
        return (
            <>
                <Navbar />
                <div style={jobAppStyles.errorContainer}>
                    <div style={jobAppStyles.errorContent}>
                        <div style={jobAppStyles.errorIcon}>⚠️</div>
                        <h2 style={jobAppStyles.errorTitle}>Erreur de chargement</h2>
                        <p style={jobAppStyles.errorText}>{error}</p>
                        <button 
                            style={jobAppStyles.retryButton}
                            onClick={() => window.location.reload()}
                        >
                            Réessayer
                        </button>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div style={jobAppStyles.applicationsContainer}>
                <div style={jobAppStyles.header}>
                    <div style={jobAppStyles.headerContent}>
                        <h1 style={jobAppStyles.h1}>
                            Candidatures pour <span style={jobAppStyles.jobTitle}>"{offer?.title}"</span>
                        </h1>
                        <div style={jobAppStyles.headerStats}>
                            <span style={jobAppStyles.statsItem}>
                                {filteredApplications.length} candidature{filteredApplications.length !== 1 ? 's' : ''}
                            </span>
                        </div>
                    </div>
                    <Link
                        to="/RecruiterJobOffers"
                        style={jobAppStyles.backButtonLink}
                    >
                        ← Retour aux offres
                    </Link>
                </div>

                <div style={jobAppStyles.searchContainer}>
                    <div style={jobAppStyles.searchWrapper}>
                        <input
                            type="text"
                            placeholder=" Rechercher par nom du candidat..."
                            value={searchName}
                            onChange={(e) => setSearchName(e.target.value)}
                            style={jobAppStyles.searchInput}
                        />
                        {searchName && (
                            <button
                                style={jobAppStyles.clearSearch}
                                onClick={() => setSearchName('')}
                            >
                                ✕
                            </button>
                        )}
                    </div>
                </div>

                {filteredApplications.length === 0 ? (
                    <div style={jobAppStyles.emptyState}>
                        <div style={jobAppStyles.emptyStateIcon}></div>
                        <h3 style={jobAppStyles.emptyStateTitle}>
                            {searchName ? 'Aucun résultat trouvé' : 'Aucune candidature'}
                        </h3>
                        <p style={jobAppStyles.emptyStateText}>
                            {searchName 
                                ? `Aucune candidature ne correspond à "${searchName}"`
                                : 'Cette offre n\'a encore reçu aucune candidature.'
                            }
                        </p>
                        {searchName && (
                            <button
                                style={jobAppStyles.clearSearchButton}
                                onClick={() => setSearchName('')}
                            >
                                Effacer la recherche
                            </button>
                        )}
                    </div>
                ) : (
                    <div style={jobAppStyles.applicationList}>
                        {filteredApplications.map(app => (
                            <div key={app.id} style={jobAppStyles.applicationItem}>
                                <div style={jobAppStyles.applicationHeader}>
                                    <div style={jobAppStyles.applicantInfo}>
                                        <div style={jobAppStyles.applicantAvatar}>
                                            {app.candidate?.name?.charAt(0).toUpperCase() || "?"}
                                        </div>
                                        <div style={jobAppStyles.applicantDetails}>
                                            <h4 style={jobAppStyles.applicantName}>{app.candidate?.name}</h4>
                                            <div style={jobAppStyles.applicationMeta}>
                                                <span style={jobAppStyles.applicationDate}>
                                                        Reçu le {formatDate(app.application_date)}
                                                </span>
                                                {app.viewed && (
                                                    <span style={jobAppStyles.viewedTag}>
                                                        ✓ Consulté
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div style={jobAppStyles.contactGrid}>
                                    <div style={jobAppStyles.contactItem}>
                                        <span style={jobAppStyles.contactLabel}> Email:</span>
                                        <span style={jobAppStyles.contactValue}>{app.candidate?.email || "N/A"}</span>
                                    </div>
                                    <div style={jobAppStyles.contactItem}>
                                        <span style={jobAppStyles.contactLabel}> Téléphone:</span>
                                        <span style={jobAppStyles.contactValue}>{app.candidate?.phoneNumber || "N/A"}</span>
                                    </div>
                                    <div style={jobAppStyles.contactItem}>
                                        <span style={jobAppStyles.contactLabel}> CV:</span>
                                        <a
                                            href={`${process.env.REACT_APP_API_URL}/uploads/cv/${app.candidate?.cv_filename}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={jobAppStyles.cvLink}
                                            onClick={() => markAsViewed(app.id)}
                                        >
                                            Télécharger CV
                                        </a>
                                    </div>
                                </div>

                                <div style={jobAppStyles.actionButtons}>
                                    <button
                                        style={jobAppStyles.contactButton}
                                        onClick={() => openChatModal(app.id)}
                                    >
                                        💬 Contacter
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />

            <Modal
                isOpen={isChatModalOpen}
                onRequestClose={closeChatModal}
                style={jobAppStyles.chatModal}
            >
                <div style={jobAppStyles.modalHeader}>
                    <h2 style={jobAppStyles.modalTitle}>💬 Chat avec le candidat</h2>
                    <button
                        onClick={closeChatModal}
                        style={jobAppStyles.modalCloseButton}
                    >
                        ✕
                    </button>
                </div>
                {chatApplicationId && user?.id && (
                    // This div will serve as the scrollable area for your chat
                    <div style={jobAppStyles.chatContentArea}>
                        <ApplicationChat
                            userId={user.id}
                            userType={'recruiter'}
                            applicationId={chatApplicationId}
                        />
                    </div>
                )}
                <button
                    onClick={closeChatModal}
                    style={jobAppStyles.closeChatButton}
                >
                    Fermer
                </button>
            </Modal>
        </>
    );
};

const jobAppStyles = {
    // Loading Screen Styles
    loadingContainer: {
        minHeight: 'calc(100vh - 120px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fafafa',
        padding: '20px',
    },
    loadingContent: {
        textAlign: 'center',
        backgroundColor: '#ffffff',
        padding: '60px 40px',
        borderRadius: '20px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        maxWidth: '400px',
        width: '100%',
    },
    loadingSpinner: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '30px',
    },
    spinnerRing: {
        width: '60px',
        height: '60px',
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #FF6B35',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
    },
    loadingTitle: {
        color: '#212529',
        fontSize: '1.8em',
        fontWeight: '700',
        marginBottom: '15px',
        margin: '0 0 15px 0',
    },
    loadingText: {
        color: '#6c757d',
        fontSize: '1.1em',
        marginBottom: '30px',
        lineHeight: '1.5',
    },
    loadingDots: {
        display: 'flex',
        justifyContent: 'center',
        gap: '8px',
    },
    dot: {
        width: '12px',
        height: '12px',
        backgroundColor: '#FF6B35',
        borderRadius: '50%',
        animation: 'bounce 1.4s ease-in-out infinite both',
    },

    // Error Screen Styles
    errorContainer: {
        minHeight: 'calc(100vh - 120px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fafafa',
        padding: '20px',
    },
    errorContent: {
        textAlign: 'center',
        backgroundColor: '#ffffff',
        padding: '60px 40px',
        borderRadius: '20px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        maxWidth: '400px',
        width: '100%',
        border: '2px solid #dc3545',
    },
    errorIcon: {
        fontSize: '4em',
        marginBottom: '20px',
    },
    errorTitle: {
        color: '#dc3545',
        fontSize: '1.8em',
        fontWeight: '700',
        marginBottom: '15px',
    },
    errorText: {
        color: '#6c757d',
        fontSize: '1.1em',
        marginBottom: '30px',
        lineHeight: '1.5',
    },
    retryButton: {
        backgroundColor: '#FF6B35',
        color: '#ffffff',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '8px',
        fontSize: '1em',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
    },

    // Main Container Styles
    applicationsContainer: {
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        padding: '20px',
        backgroundColor: '#fafafa',
        minHeight: 'calc(100vh - 120px)',
        
        '@media (min-width: 768px)': {
            padding: '40px 20px',
        },
        '@media (min-width: 1200px)': {
            padding: '60px 20px',
        },
    },

    // Header Styles
    header: {
        maxWidth: '1200px',
        margin: '0 auto',
        marginBottom: '40px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        
        '@media (min-width: 768px)': {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
        },
    },
    headerContent: {
        flex: 1,
    },
    h1: {
        color: '#212529',
        fontSize: 'clamp(1.5em, 4vw, 2.5em)',
        fontWeight: '800',
        margin: '0 0 15px 0',
        lineHeight: '1.2',
    },
    jobTitle: {
        color: '#FF6B35',
        fontStyle: 'italic',
    },
    headerStats: {
        display: 'flex',
        gap: '20px',
        flexWrap: 'wrap',
    },
    statsItem: {
        backgroundColor: '#ffffff',
        padding: '8px 16px',
        borderRadius: '20px',
        fontSize: '0.9em',
        color: '#6c757d',
        fontWeight: '600',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    },

    // Button Styles
    backButtonLink: {
        backgroundColor: '#212529',
        color: '#ffffff',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '12px',
        cursor: 'pointer',
        fontSize: '1em',
        textDecoration: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        fontWeight: '600',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        whiteSpace: 'nowrap',
        alignSelf: 'flex-start',
    },

    // Search Styles
    searchContainer: {
        maxWidth: '1200px',
        margin: '0 auto',
        marginBottom: '30px',
    },
    searchWrapper: {
        position: 'relative',
        maxWidth: '600px',
        margin: '0 auto',
    },
    searchInput: {
        width: '100%',
        padding: '16px 24px',
        borderRadius: '16px',
        border: '2px solid #e9ecef',
        boxSizing: 'border-box',
        fontSize: '1.1em',
        color: '#495057',
        backgroundColor: '#ffffff',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        transition: 'all 0.3s ease',
        outline: 'none',
    },
    clearSearch: {
        position: 'absolute',
        right: '16px',
        top: '50%',
        transform: 'translateY(-50%)',
        background: '#6c757d',
        color: '#ffffff',
        border: 'none',
        borderRadius: '50%',
        width: '24px',
        height: '24px',
        cursor: 'pointer',
        fontSize: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Application List Styles
    applicationList: {
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gap: '24px',
        
        '@media (min-width: 768px)': {
            gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
        },
    },
    applicationItem: {
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        padding: '24px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
        border: '1px solid #f1f3f4',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        
        '@media (min-width: 768px)': {
            padding: '32px',
        },
    },
    applicationHeader: {
        marginBottom: '20px',
    },
    applicantInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
    },
    applicantAvatar: {
        backgroundColor: '#FF6B35',
        color: '#ffffff',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '1.5em',
        fontWeight: '700',
        flexShrink: 0,
        boxShadow: '0 4px 12px rgba(255,107,53,0.3)',
    },
    applicantDetails: {
        flex: 1,
    },
    applicantName: {
        color: '#212529',
        fontSize: '1.4em',
        fontWeight: '700',
        margin: '0 0 8px 0',
        
        '@media (min-width: 768px)': {
            fontSize: '1.6em',
        },
    },
    applicationMeta: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
        alignItems: 'center',
    },
    applicationDate: {
        color: '#6c757d',
        fontSize: '0.9em',
        fontWeight: '500',
    },
    viewedTag: {
        backgroundColor: '#d4edda',
        color: '#155724',
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '0.8em',
        fontWeight: '600',
    },

    // Contact Grid Styles
    contactGrid: {
        display: 'grid',
        gap: '16px',
        marginBottom: '24px',
        
        '@media (min-width: 480px)': {
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        },
    },
    contactItem: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
    },
    contactLabel: {
        color: '#6c757d',
        fontSize: '0.85em',
        fontWeight: '600',
    },
    contactValue: {
        color: '#212529',
        fontSize: '0.95em',
        fontWeight: '500',
        wordBreak: 'break-word',
    },
    cvLink: {
        color: '#FF6B35',
        textDecoration: 'none',
        fontWeight: '600',
        fontSize: '0.95em',
        transition: 'color 0.3s ease',
        borderBottom: '1px solid rgba(255,107,53,0.3)',
    },

    // Action Buttons
    actionButtons: {
        display: 'flex',
        gap: '12px',
        justifyContent: 'flex-end',
    },
    contactButton: {
        backgroundColor: '#FF6B35',
        color: '#ffffff',
        border: 'none',
        padding: '12px 20px',
        borderRadius: '12px',
        cursor: 'pointer',
        fontSize: '0.95em',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 12px rgba(255,107,53,0.3)',
    },

    // Empty State Styles
    emptyState: {
        textAlign: 'center',
        maxWidth: '500px',
        margin: '60px auto',
        padding: '40px 20px',
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
    },
    emptyStateIcon: {
        fontSize: '4em',
        marginBottom: '20px',
        opacity: '0.7',
    },
    emptyStateTitle: {
        color: '#212529',
        fontSize: '1.5em',
        fontWeight: '700',
        marginBottom: '12px',
    },
    emptyStateText: {
        color: '#6c757d',
        fontSize: '1.1em',
        lineHeight: '1.6',
        marginBottom: '24px',
    },
    clearSearchButton: {
        backgroundColor: '#FF6B35',
        color: '#ffffff',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '12px',
        fontSize: '1em',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
    },

    // Modal Styles - UPDATED FOR SCROLLING
    chatModal: {
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            zIndex: 1050,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        content: {
            position: 'relative',
            top: 'auto',
            left: 'auto',
            right: 'auto',
            bottom: 'auto',
            transform: 'none',
            margin: '20px',
            padding: '0', // No padding here, padding will be inside sub-components
            borderRadius: '20px',
            maxWidth: '800px',
            width: '100%',
            maxHeight: '90vh', // Limit modal height to 90% of viewport height
            border: 'none',
            backgroundColor: '#ffffff',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            display: 'flex',         // Use flexbox for layout
            flexDirection: 'column', // Arrange items vertically
            overflow: 'hidden',      // Hide overflow of the main modal content, we'll scroll specific areas
        }
    },
    modalHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '24px 32px',
        borderBottom: '1px solid #e9ecef',
        backgroundColor: '#fafafa',
        flexShrink: 0, // Prevent header from shrinking
    },
    modalTitle: {
        color: '#212529',
        fontSize: '1.5em',
        fontWeight: '700',
        margin: 0,
    },
    modalCloseButton: {
        backgroundColor: 'transparent',
        border: 'none',
        fontSize: '1.5em',
        cursor: 'pointer',
        color: '#6c757d',
        padding: '4px',
        borderRadius: '4px',
        transition: 'color 0.3s ease',
    },
    // New style for the area containing the chat component
    chatContentArea: {
        flexGrow: 1,       // This allows the chat area to take up all available vertical space
        overflowY: 'auto', // THIS IS CRUCIAL: enables scrolling within this area
        padding: '20px 32px', // Add padding here if you want space around the chat component
        display: 'flex', // If ApplicationChat is also a flex container, this helps
        flexDirection: 'column', // Align chat content properly
    },
    closeChatButton: {
        backgroundColor: '#212529',
        color: '#ffffff',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '12px',
        cursor: 'pointer',
        fontSize: '1em',
        margin: '24px 32px', // Apply margin here
        fontWeight: '600',
        transition: 'all 0.3s ease',
        width: 'calc(100% - 64px)', // Adjust width for margins
        flexShrink: 0, // Prevent button from shrinking
    },
};

// Add CSS animations
const styleSheet = document.createElement("style");
styleSheet.textContent = `
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

@keyframes bounce {
    0%, 80%, 100% { 
        transform: scale(0);
        opacity: 0.5;
    } 
    40% { 
        transform: scale(1.0);
        opacity: 1;
    }
}

/* Responsive hover effects */
@media (hover: hover) {
    .job-app-item:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 32px rgba(0,0,0,0.12);
    }
    
    .job-app-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(0,0,0,0.2);
    }
    
    .job-app-search:focus {
        border-color: #FF6B35;
        box-shadow: 0 0 0 3px rgba(255,107,53,0.1);
    }
}

/* Mobile optimizations */
@media (max-width: 767px) {
    .job-app-grid {
        grid-template-columns: 1fr;
    }
    
    .job-app-contact-grid {
        grid-template-columns: 1fr;
    }
    
    .job-app-header {
        flex-direction: column;
        align-items: stretch;
    }
    
    .job-app-actions {
        justify-content: center;
    }
}
`;
document.head.appendChild(styleSheet);

export default JobOfferApplications;
