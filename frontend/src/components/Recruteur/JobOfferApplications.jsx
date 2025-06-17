import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../Navbara';
import Footer from '../Footer';
import ApplicationChat from './ApplicationChat';
import Modal from 'react-modal';

Modal.setAppElement('#root');

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
                setFilteredApplications(filteredByOffer); // Initialize filtered list
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

            // Update state: mark the application as viewed locally
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

    if (isLoading) {
        return <div style={jobAppStyles.loading}>Chargement des candidatures...</div>;
    }

    if (error) {
        return <div style={jobAppStyles.error}>{error}</div>;
    }

    return (
        <>
            <Navbar />
            <div style={jobAppStyles.applicationsContainer}>
                <div style={jobAppStyles.header}>
                    <h1 style={jobAppStyles.h1}>Candidatures pour " {offer?.title} "</h1>
                    <Link
                        to="/RecruiterJobOffers"
                        style={jobAppStyles.backButtonLink}
                        onMouseEnter={(e) => e.target.style.backgroundColor = jobAppStyles.backButtonLinkHover.backgroundColor}
                        onMouseLeave={(e) => e.target.style.backgroundColor = jobAppStyles.backButtonLink.backgroundColor}
                    >
                        Retour aux offres
                    </Link>
                </div>

                <div style={jobAppStyles.searchContainer}>
                    <input
                        type="text"
                        placeholder="Rechercher par nom du candidat..."
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                        style={jobAppStyles.searchInput}
                        // Added focus styles dynamically
                        onFocus={(e) => e.target.style.borderColor = jobAppStyles.searchInputFocus.borderColor}
                        onBlur={(e) => e.target.style.borderColor = jobAppStyles.searchInput.borderColor}
                    />
                </div>

                {filteredApplications.length === 0 ? (
                    <p style={jobAppStyles.noApplications}>Aucune candidature pour cette offre.</p>
                ) : (
                    <div style={jobAppStyles.applicationList}>
                        {filteredApplications.map(app => (
                            <div
                                key={app.id}
                                style={jobAppStyles.applicationItem}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = jobAppStyles.applicationItemHover.transform;
                                    e.currentTarget.style.boxShadow = jobAppStyles.applicationItemHover.boxShadow;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = jobAppStyles.applicationItem.transform; // Reset
                                    e.currentTarget.style.boxShadow = jobAppStyles.applicationItem.boxShadow; // Reset
                                }}
                            >
                                <div style={jobAppStyles.applicantInfo}>
                                    <div style={jobAppStyles.applicantAvatar}>
                                        {app.candidate?.name?.charAt(0).toUpperCase() || "?"}
                                    </div>
                                    <div style={jobAppStyles.applicantDetails}>
                                        <h4 style={jobAppStyles.applicantName}>{app.candidate?.name}</h4>
                                        <div style={jobAppStyles.applicantContact}>
                                            <div style={jobAppStyles.contactItem}>Email: {app.candidate?.email || "N/A"}</div>
                                            <div style={jobAppStyles.contactItem}>Téléphone: {app.candidate?.phoneNumber || "N/A"}</div>
                                            <div style={jobAppStyles.contactItem}>
                                                CV: <a
                                                    href={`${process.env.REACT_APP_API_URL}/uploads/cv/${app.candidate?.cv_filename}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={jobAppStyles.cvLink}
                                                    onClick={() => markAsViewed(app.id)}
                                                    onMouseEnter={(e) => e.target.style.color = jobAppStyles.cvLinkHover.color}
                                                    onMouseLeave={(e) => e.target.style.color = jobAppStyles.cvLink.color}
                                                >
                                                    Voir CV
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div style={jobAppStyles.applicationActions}>
                                    <div style={jobAppStyles.applicationDate}>
                                        Reçu le {formatDate(app.application_date)}
                                    </div>

                                    <button
                                        style={jobAppStyles.contactButton}
                                        onClick={() => openChatModal(app.id)}
                                        onMouseEnter={(e) => e.target.style.backgroundColor = jobAppStyles.contactButtonHover.backgroundColor}
                                        onMouseLeave={(e) => e.target.style.backgroundColor = jobAppStyles.contactButton.backgroundColor}
                                    >
                                        Contacter
                                    </button>

                                    {app.viewed && (
                                        <span style={jobAppStyles.viewedTag}>
                                            Vu ✔
                                        </span>
                                    )}
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
                <h2 style={jobAppStyles.modalTitle}>Chat avec le candidat</h2>
                {chatApplicationId && user?.id && (
                    <ApplicationChat
                        userId={user.id}
                        userType={'recruiter'}
                        applicationId={chatApplicationId}
                    />
                )}
                <button
                    onClick={closeChatModal}
                    style={jobAppStyles.closeChatButton}
                    onMouseEnter={(e) => e.target.style.backgroundColor = jobAppStyles.closeChatButtonHover.backgroundColor}
                    onMouseLeave={(e) => e.target.style.backgroundColor = jobAppStyles.closeChatButton.backgroundColor}
                >
                    Fermer le chat
                </button>
            </Modal>
        </>
    );
};

---

## Styles (jobAppStyles object)

```javascript
const jobAppStyles = {
    // --- Page Container & General Layout ---
    applicationsContainer: {
        fontFamily: 'Arial, sans-serif', // Modern, clean font
        padding: '40px 20px',
        backgroundColor: '#FFFFFF', // White background
        minHeight: 'calc(100vh - 120px)', // Adjust for Navbar/Footer height
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        width: '100%',
        maxWidth: '1000px',
        flexWrap: 'wrap', // Allow wrapping on smaller screens
        gap: '20px',
    },
    h1: {
        color: '#000000', // Black
        fontSize: '2.2em',
        fontWeight: '700', // Bolder for headings
        margin: 0,
        flexGrow: 1, // Allow title to take available space
    },

    // --- Buttons & Links ---
    backButtonLink: {
        backgroundColor: '#FF6B35', // Orange
        color: '#FFFFFF', // White text
        border: 'none',
        padding: '12px 25px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '1em',
        textDecoration: 'none',
        transition: 'background-color 0.3s ease, transform 0.2s ease',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        display: 'inline-block',
    },
    backButtonLinkHover: {
        backgroundColor: '#E55A2B', // Darker orange on hover
        transform: 'translateY(-2px)',
    },
    cvLink: {
        color: '#FF6B35', // Orange
        textDecoration: 'none',
        fontWeight: 'bold',
        transition: 'color 0.3s ease',
    },
    cvLinkHover: {
        color: '#E55A2B', // Darker orange on hover
    },
    contactButton: {
        backgroundColor: '#FF6B35', // Orange
        color: '#FFFFFF', // White text
        border: 'none',
        padding: '10px 20px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '0.95em',
        transition: 'background-color 0.3s ease, transform 0.2s ease',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
        fontWeight: '600',
    },
    contactButtonHover: {
        backgroundColor: '#E55A2B', // Darker orange on hover
        transform: 'translateY(-1px)',
    },
    closeChatButton: {
        backgroundColor: '#000000', // Black
        color: '#FFFFFF', // White text
        border: 'none',
        padding: '12px 25px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '1em',
        marginTop: '20px',
        transition: 'background-color 0.3s ease, transform 0.2s ease',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    },
    closeChatButtonHover: {
        backgroundColor: '#333333', // Slightly lighter black/dark gray on hover
        transform: 'translateY(-2px)',
    },

    // --- Search Bar ---
    searchContainer: {
        width: '100%',
        maxWidth: '1000px',
        marginBottom: '25px',
    },
    searchInput: {
        width: '100%',
        padding: '12px 15px',
        borderRadius: '8px',
        border: '1px solid #E0E0E0',
        boxSizing: 'border-box',
        fontSize: '1em',
        color: '#333333', // Dark gray for text
        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)',
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
    },
    searchInputFocus: {
        borderColor: '#FF6B35', // Orange border on focus
        boxShadow: '0 0 8px rgba(255, 107, 53, 0.2)',
    },

    // --- Application List & Items ---
    applicationList: {
        width: '100%',
        maxWidth: '1000px',
    },
    applicationItem: {
        backgroundColor: '#FFFFFF', // White
        padding: '25px',
        borderRadius: '12px',
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.08)',
        marginBottom: '20px',
        display: 'flex',
        flexDirection: 'column', // Stack on small screens, then row
        gap: '20px',
        border: '1px solid #F0F0F0',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        transform: 'translateY(0)', // Default transform for reset
    },
    applicationItemHover: {
        transform: 'translateY(-3px)',
        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.12)',
    },
    applicantInfo: {
        display: 'flex',
        alignItems: 'center',
        flexGrow: 1, // Allows it to take up more space
    },
    applicantAvatar: {
        backgroundColor: '#FF6B35', // Orange background
        color: '#000000', // Black text for contrast
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '1.8em', // Larger initial
        fontWeight: 'bold',
        marginRight: '20px',
        flexShrink: 0,
    },
    applicantDetails: {},
    applicantName: {
        color: '#000000', // Black
        fontSize: '1.6em',
        fontWeight: '700',
        marginBottom: '5px',
    },
    applicantContact: {
        fontSize: '0.95em',
        color: '#333333', // Dark gray
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px 20px', // Spacing between contact items
    },
    contactItem: {
        marginBottom: '0', // Reset margin from previous style
    },
    applicationActions: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end', // Align buttons/date to the right
        gap: '10px',
    },
    applicationDate: {
        color: '#333333', // Dark gray
        fontSize: '0.9em',
        fontWeight: '600',
    },
    viewedTag: {
        marginLeft: '10px',
        color: '#FF6B35', // Orange for "Vu"
        fontWeight: 'bold',
        fontSize: '0.9em',
        backgroundColor: '#FFF5E5', // Light orange background for the tag
        padding: '5px 10px',
        borderRadius: '5px',
    },

    // --- Empty State, Loading, Error ---
    noApplications: {
        textAlign: 'center',
        marginTop: '50px',
        color: '#333333', // Dark gray
        fontSize: '1.2em',
        padding: '20px',
        backgroundColor: '#FFFFFF',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        maxWidth: '600px',
        width: '100%',
    },
    loading: {
        textAlign: 'center',
        marginTop: '50px',
        color: '#333333',
        fontSize: '1.2em',
        padding: '20px',
        backgroundColor: '#FFFFFF',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        maxWidth: '600px',
        width: '100%',
    },
    error: {
        textAlign: 'center',
        marginTop: '50px',
        color: '#FFFFFF', // White text on orange error
        fontSize: '1.2em',
        backgroundColor: '#FF6B35', // Orange background for error
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        maxWidth: '600px',
        width: '100%',
        fontWeight: 'bold',
    },

    // --- Modal Styles ---
    chatModal: {
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.7)', // Darker overlay
            zIndex: 1050,
        },
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            padding: '30px',
            borderRadius: '12px',
            maxWidth: '650px', // Slightly wider modal
            width: '90%',
            borderColor: '#E0E0E0',
            maxHeight: '85vh', // Increased max height
            overflow: 'auto',
            zIndex: 1051,
            backgroundColor: '#FFFFFF', // White modal background
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
        }
    },
    modalTitle: {
        color: '#000000', // Black
        fontSize: '1.8em',
        fontWeight: '700',
        marginBottom: '20px',
        borderBottom: '2px solid #FF6B35', // Orange underline
        paddingBottom: '10px',
    },
};

export default JobOfferApplications;
