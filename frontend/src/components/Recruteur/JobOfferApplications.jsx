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
                    <h1 style={jobAppStyles.h1}>Candidatures pour "{offer?.title}"</h1>
                    <Link to="/RecruiterJobOffers" style={jobAppStyles.backButtonLink}>
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
                    />
                </div>

                {filteredApplications.length === 0 ? (
                    <p style={jobAppStyles.noApplications}>Aucune candidature pour cette offre.</p>
                ) : (
                    <div style={jobAppStyles.applicationList}>
                        {filteredApplications.map(app => (
                            <div key={app.id} style={jobAppStyles.applicationItem}>
                                <div style={jobAppStyles.applicantInfo}>
                                    <div style={jobAppStyles.applicantAvatar}>
                                        {app.candidate?.name?.charAt(0) || "?"}
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
>
  Voir CV
</a>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ 
  display: "flex", 
  alignItems: "center", 
  gap: "15px", 
  padding: "10px", 
  border: "1px solid #ddd", 
  borderRadius: "8px", 
  backgroundColor: "#f9f9f9" 
}}>
  <div style={{ fontSize: "14px", fontWeight: "bold", color: "#555" }}>
    Reçu le {formatDate(app.application_date)}
  </div>

  <button
    style={{ 
      ...jobAppStyles.contactButton, 
      padding: "8px 15px", 
      backgroundColor: "#007bff", 
      color: "#fff", 
      borderRadius: "5px", 
      cursor: "pointer", 
      transition: "background 0.3s" 
    }}
    onClick={() => openChatModal(app.id)}
    onMouseOver={(e) => e.target.style.backgroundColor = "#0056b3"}
    onMouseOut={(e) => e.target.style.backgroundColor = "#007bff"}
  >
    Contacter
  </button>

  {/* Mark as Viewed button (if not already viewed) */}
  
  {/* Show "Vu" label if already viewed */}
  {app.viewed && (
    <span style={{ marginLeft: "10px", color: "#28a745", fontWeight: "bold", fontSize: "14px" }}>
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
                <button onClick={closeChatModal} style={jobAppStyles.closeChatButton}>Fermer le chat</button>
            </Modal>
        </>
    );
};

const jobAppStyles = {
    applicationsContainer: { fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif', padding: '30px', backgroundColor: '#f4f4f4', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', width: '90%', maxWidth: '1200px' },
    h1: { color: '#333', fontSize: '2.4em', fontWeight: '500' },
    backButtonLink: {
        backgroundColor: '#6c757d',
        color: 'white',
        border: 'none',
        padding: '10px 18px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '1em',
        textDecoration: 'none',
        transition: 'background-color 0.3s ease-in-out',
        width: 'auto', // Adjust width to content
        textAlign: 'center',
        display: 'inline-block',
        height: 'auto',
    },
    backButtonLinkHover: { backgroundColor: '#5a6268' },
    searchContainer: { width: '90%', maxWidth: '1200px', marginBottom: '20px' },
    searchInput: { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box', fontSize: '1em' },
    applicationList: { width: '90%', maxWidth: '1200px' },
    applicationItem: { backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e0e0e0' },
    applicantInfo: { display: 'flex', alignItems: 'center' },
    applicantAvatar: { backgroundColor: '#ff8f00', color: 'white', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.2em', marginRight: '15px' },
    applicantDetails: {},
    applicantName: { color: '#333', fontSize: '1.4em', fontWeight: '500', marginBottom: '5px' },
    applicantContact: { fontSize: '0.95em', color: '#555' },
    contactItem: { marginBottom: '3px' },
    cvLink: { color: '#ff8f00', textDecoration: 'none', fontWeight: 'bold' },
    applicationActions: { textAlign: 'right' },
    applicationDate: { color: '#777', fontSize: '0.9em', marginBottom: '10px' },
    contactButton: { backgroundColor: '#ff8f00', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', fontSize: '1em', transition: 'background-color 0.3s ease-in-out' },
    contactButtonHover: { backgroundColor: '#e65100' },
    noApplications: { textAlign: 'center', marginTop: '30px', color: '#777', fontSize: '1.1em' },
    loading: { textAlign: 'center', marginTop: '30px', color: '#777', fontSize: '1.1em' },
    error: { textAlign: 'center', marginTop: '30px', color: '#d32f2f', fontSize: '1.1em', backgroundColor: '#ffebee', padding: '15px', borderRadius: '8px' },
    chatModal: {
        overlay: { backgroundColor: 'rgba(0, 0, 0, 0.6)', zIndex: 1050 }, /* Added zIndex to the overlay */
        content: {
            top: '50%', left: '50%', right: 'auto', bottom: 'auto',
            marginRight: '-50%', transform: 'translate(-50%, -50%)',
            padding: '20px', borderRadius: '12px', maxWidth: '600px', width: '90%',
            borderColor: '#e0e0e0',
            maxHeight: '80vh', // Limit the maximum height
            overflow: 'auto', // Enable scrolling if content overflows
            zIndex: 1051, /* Added zIndex to the content */
        }
    },
    modalTitle: { color: '#333', fontSize: '1.6em', fontWeight: '500', marginBottom: '15px' },
    closeChatButton: { backgroundColor: '#6c757d', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '8px', cursor: 'pointer', fontSize: '1em', marginTop: '15px' },
    closeChatButtonHover: { backgroundColor: '#5a6268' },
};

export default JobOfferApplications;