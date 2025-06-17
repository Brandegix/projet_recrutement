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
                                    e.currentTarget.style.transform = jobAppStyles.applicationItem.transform;
                                    e.currentTarget.style.boxShadow = jobAppStyles.applicationItem.boxShadow;
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

// Start of jobAppStyles object (this replaces your existing jobAppStyles)
const jobAppStyles = {
    // --- Page Container & General Layout ---
    applicationsContainer: {
        fontFamily: 'Roboto, sans-serif', // More modern font
        padding: '50px 20px', // Increased padding for more breathing room
        backgroundColor: '#F8F9FA', // Light gray background for a premium feel
        minHeight: 'calc(100vh - 120px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '40px', // More space below header
        width: '100%',
        maxWidth: '1000px',
        flexWrap: 'wrap',
        gap: '20px',
    },
    h1: {
        color: '#212529', // Darker black for text
        fontSize: '2.5em', // Slightly larger for impact
        fontWeight: '700',
        margin: 0,
        flexGrow: 1,
        letterSpacing: '-0.02em', // Subtle letter spacing for premium look
    },

    // --- Buttons & Links ---
    backButtonLink: {
        backgroundColor: '#FF6B35', // Orange
        color: '#FFFFFF',
        border: 'none',
        padding: '12px 28px', // Slightly more padding
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '1em',
        textDecoration: 'none',
        transition: 'background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)', // Softer, more pronounced shadow
        display: 'inline-block',
        fontWeight: '600',
    },
    backButtonLinkHover: {
        backgroundColor: '#E55A2B',
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 15px rgba(0, 0, 0, 0.2)', // More shadow on hover
    },
    cvLink: {
        color: '#FF6B35',
        textDecoration: 'none',
        fontWeight: 'bold',
        transition: 'color 0.3s ease',
        borderBottom: '1px solid transparent', // Subtle underline effect
    },
    cvLinkHover: {
        color: '#E55A2B',
        borderBottom: '1px solid #E55A2B', // Underline appears on hover
    },
    contactButton: {
        backgroundColor: '#FF6B35',
        color: '#FFFFFF',
        border: 'none',
        padding: '10px 22px', // Slightly adjusted padding
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '0.95em',
        transition: 'background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', // Softer shadow
        fontWeight: '600',
    },
    contactButtonHover: {
        backgroundColor: '#E55A2B',
        transform: 'translateY(-1px)',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
    },
    closeChatButton: {
        backgroundColor: '#212529', // Darker black
        color: '#FFFFFF',
        border: 'none',
        padding: '12px 28px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '1em',
        marginTop: '25px', // More margin
        transition: 'background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        fontWeight: '600',
    },
    closeChatButtonHover: {
        backgroundColor: '#343A40', // Slightly lighter dark gray on hover
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 15px rgba(0, 0, 0, 0.2)',
    },

    // --- Search Bar ---
    searchContainer: {
        width: '100%',
        maxWidth: '1000px',
        marginBottom: '30px', // More space
    },
    searchInput: {
        width: '100%',
        padding: '14px 20px', // Increased padding
        borderRadius: '10px', // Slightly more rounded
        border: '1px solid #CED4DA', // Softer border color
        boxSizing: 'border-box',
        fontSize: '1em',
        color: '#495057', // Darker gray for text
        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.06)', // Deeper inset shadow
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
    },
    searchInputFocus: {
        borderColor: '#FF6B35',
        boxShadow: '0 0 0 3px rgba(255, 107, 53, 0.25)', // More prominent focus ring
    },

    // --- Application List & Items ---
    applicationList: {
        width: '100%',
        maxWidth: '1000px',
    },
    applicationItem: {
        backgroundColor: '#FFFFFF',
        padding: '30px', // More padding
        borderRadius: '15px', // More rounded corners
        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)', // Larger, softer shadow
        marginBottom: '25px', // More space between items
        display: 'flex',
        flexDirection: 'column',
        gap: '25px',
        border: '1px solid #E9ECEF', // Very light border
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        transform: 'translateY(0)',
    },
    applicationItemHover: {
        transform: 'translateY(-5px)', // More pronounced lift
        boxShadow: '0 12px 25px rgba(0, 0, 0, 0.15)', // Darker, larger shadow on hover
    },
    applicantInfo: {
        display: 'flex',
        alignItems: 'center',
        flexGrow: 1,
    },
    applicantAvatar: {
        backgroundColor: '#FF6B35',
        color: '#FFFFFF', // White text for stronger contrast
        width: '55px', // Slightly smaller avatar
        height: '55px',
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '1.2em', // **Adjusted: Smaller font size for the initial**
        fontWeight: 'bold',
        marginRight: '25px', // More margin
        flexShrink: 0,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
    },
    applicantDetails: {
        flexGrow: 1, // Allows details to fill space
    },
    applicantName: {
        color: '#212529', // Darker black
        fontSize: '1.8em', // Slightly larger name
        fontWeight: '700',
        marginBottom: '8px', // More space below name
    },
    applicantContact: {
        fontSize: '1em', // Slightly larger text
        color: '#495057', // Darker gray
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px 25px', // Increased spacing
    },
    contactItem: {
        display: 'flex', // Ensures consistent layout for each item
        alignItems: 'center',
    },
    applicationActions: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '15px', // Increased space between actions
    },
    applicationDate: {
        color: '#495057', // Darker gray
        fontSize: '0.95em', // Slightly larger font
        fontWeight: '600',
        opacity: 0.8, // Slightly softer date text
    },
    viewedTag: {
        marginLeft: '15px',
        color: '#FF6B35',
        fontWeight: 'bold',
        fontSize: '0.9em',
        backgroundColor: '#FFF5E5',
        padding: '6px 12px', // Slightly more padding
        borderRadius: '6px', // Slightly more rounded
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)', // Subtle shadow for the tag
    },

    // --- Empty State, Loading, Error ---
    noApplications: {
        textAlign: 'center',
        marginTop: '60px', // More margin
        color: '#495057',
        fontSize: '1.3em', // Slightly larger
        padding: '30px', // More padding
        backgroundColor: '#FFFFFF',
        borderRadius: '15px',
        boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
        maxWidth: '650px', // Slightly wider
        width: '100%',
        fontWeight: '600',
    },
    loading: {
        textAlign: 'center',
        marginTop: '60px',
        color: '#495057',
        fontSize: '1.3em',
        padding: '30px',
        backgroundColor: '#FFFFFF',
        borderRadius: '15px',
        boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
        maxWidth: '650px',
        width: '100%',
        fontWeight: '600',
    },
    error: {
        textAlign: 'center',
        marginTop: '60px',
        color: '#FFFFFF',
        fontSize: '1.3em',
        backgroundColor: '#DC3545', // A standard, slightly more subdued error red
        padding: '30px',
        borderRadius: '15px',
        boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
        maxWidth: '650px',
        width: '100%',
        fontWeight: 'bold',
    },

    // --- Modal Styles ---
    chatModal: {
        overlay: {
            backgroundColor: 'rgba(33, 37, 41, 0.8)', // Darker, slightly softer overlay
            zIndex: 1050,
        },
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            padding: '40px', // More padding
            borderRadius: '15px',
            maxWidth: '700px', // Wider modal for chat
            width: '90%',
            border: 'none', // No border for a cleaner look
            maxHeight: '90vh', // Increased max height
            overflow: 'auto',
            zIndex: 1051,
            backgroundColor: '#FFFFFF',
            boxShadow: '0 15px 40px rgba(0, 0, 0, 0.3)', // Deeper, softer shadow
        }
    },
    modalTitle: {
        color: '#212529',
        fontSize: '2em', // Larger title
        fontWeight: '700',
        marginBottom: '25px', // More space below title
        borderBottom: '3px solid #FF6B35', // Thicker orange underline
        paddingBottom: '12px',
        letterSpacing: '-0.02em',
    },
};
// End of jobAppStyles object

export default JobOfferApplications;
