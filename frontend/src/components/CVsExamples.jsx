import React, { useState, useEffect } from 'react';
import { Eye, Star, X } from 'lucide-react'; // Added X for close icon, removed User as it's not used
const candidatImage = 'https://placehold.co/100x100/000000/FFFFFF?text=User'; // Placeholder image URL
import { useNavigate } from 'react-router-dom';

/**
 * Custom Modal Component for displaying messages.
 * This modal will now only feature a "Fermer" button.
 */
const CustomModal = ({ message, onClose }) => {
  if (!message) return null; // Don't render if there's no message

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      fontFamily: 'Inter, sans-serif'
    }}>
      <div style={{
        backgroundColor: '#1a1a1a',
        padding: '30px',
        borderRadius: '15px',
        maxWidth: '400px',
        width: '90%',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
        position: 'relative',
        border: '1px solid #333',
        textAlign: 'center'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            background: 'none',
            border: 'none',
            color: '#cccccc',
            cursor: 'pointer',
            fontSize: '1.5rem',
            padding: '5px'
          }}
        >
          <X size={24} />
        </button>
        <p style={{
          color: '#ffffff',
          fontSize: '1.1rem',
          marginBottom: '25px',
          lineHeight: '1.5'
        }}>
          {message}
        </p>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={onClose} // "Fermer" button now directly triggers the onClose prop
            style={{
              background: 'linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)',
              color: '#ffffff',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '20px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};


/**
 * CVsExamples Component
 * Displays example CVs and navigates users based on their login status,
 * using a custom modal for messages.
 */
function CVsExamples() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [modalMessage, setModalMessage] = useState('');
  const [modalAction, setModalAction] = useState(() => () => {}); // Function to execute on modal close

  // Authentication check effect
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Assuming REACT_APP_API_URL is defined in your environment for the backend API
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/session`, {
          credentials: 'include', // Important for sending cookies/session
        });

        if (!res.ok) {
          // If response is not OK (e.g., 401 Unauthorized, 404 Not Found), user is not logged in
          setIsLoggedIn(false);
          setUser(null);
        } else {
          const data = await res.json();
          // Assuming the session API returns { isLoggedIn: true, user: { role: 'candidate' } } etc.
          if (data && data.isLoggedIn) {
            setIsLoggedIn(true);
            setUser(data.user);
          } else {
            setIsLoggedIn(false);
            setUser(null);
          }
        }
      } catch (error) {
        console.error("Authentication check error:", error);
        setIsLoggedIn(false);
        setUser(null);
      } finally {
        setIsCheckingAuth(false); // Authentication check is complete
      }
    };

    checkAuthStatus();
  }, []); // Empty dependency array means this runs once on component mount

  // Function to close the modal and execute the associated action
  const handleModalCloseAndNavigate = () => {
    setModalMessage(''); // Clear the message to hide the modal
    modalAction();       // Execute the stored navigation/action
    setModalAction(() => () => {}); // Reset action
  };

  const handleViewCV = () => {
    if (isLoggedIn) {
      if (user && user.role === 'candidate') {
        setModalMessage("Vous êtes connecté en tant que candidat. Vous pouvez envoyer vos CV avec vos candidatures.");
        setModalAction(() => () => navigate('/Offres')); // Changed to /Offres as per your original code
      } else if (user && user.role === 'recruiter') {
        setModalMessage("Vous êtes connecté en tant que recruteur. Vous allez trouver les cvs des candidats en consultant vos offres.");
        setModalAction(() => () => navigate('/RecruiterJobOffers')); // Changed to /RecruiterJobOffers as per your original code
      } else {
        // Fallback for other logged-in users or undefined roles
        setModalMessage("Vous êtes connecté. Redirection vers l'accueil.");
        setModalAction(() => () => navigate('/')); // Changed to / as per your original code
      }
    } else {
      // If no user is logged in (visitor), redirect to the role selection/login page.
      setModalMessage("Veuillez vous connecter pour voir les CVs. Vous serez redirigé vers la page de sélection de rôle.");
      setModalAction(() => () => navigate('/choixRole'));
    }
  };

  const exampleCVs = [
    {
      name: 'Sara B.',
      title: 'Développeuse Web',
      summary: 'Passionnée par la création de sites web modernes et d\'applications interactives. Expertise en React, Node.js et design UX/UI.',
      image: candidatImage
    },
    {
      name: 'Yassine M.',
      title: 'Ingénieur DevOps',
      summary: 'Expérience dans le déploiement et l\'automatisation des infrastructures cloud. Spécialiste Docker, Kubernetes et CI/CD.',
      image: candidatImage
    },
    {
      name: 'Hanae R.',
      title: 'Analyste de Données',
      summary: 'Compétences en Python, SQL, visualisation de données et machine learning. Transformation des données en insights stratégiques.',
      image: candidatImage
    }
  ];

  // Show a loading indicator while authentication status is being checked
  if (isCheckingAuth) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '300px', // Increased height for better visibility
        color: '#ffffff',
        fontSize: '1.5rem',
        fontFamily: 'Inter, sans-serif'
      }}>
        <div style={{
          border: '4px solid rgba(255, 255, 255, 0.3)',
          borderTop: '4px solid #ff6b35',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          animation: 'spin 1s linear infinite',
          marginRight: '20px'
        }}></div>
        Vérification de l'état d'authentification...
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{
      padding: '80px 0',
      backgroundColor: 'transparent',
      color: '#ffffff',
      fontFamily: 'Inter, sans-serif'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>

        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '600',
            marginBottom: '25px',
            background: 'linear-gradient(135deg, #ffffff 0%, #ff6b35 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Exemples de CVs
          </h2>
          <p style={{
            fontSize: '1.2rem',
            color: '#cccccc',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Découvrez des profils inspirants et créez le vôtre dès maintenant
          </p>
        </div>

        {/* CV Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '30px',
          justifyContent: 'center'
        }}>
          {exampleCVs.map((cv, index) => (
            <div
              key={index}
              onClick={handleViewCV} // This will now trigger the modal
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '20px',
                padding: '30px 25px',
                border: '1px solid rgba(255, 165, 0, 0.2)',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 165, 0, 0.1)';
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(255, 107, 53, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
              }}
            >

              {/* Profile Image */}
              <div style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                margin: '0 auto 20px',
                overflow: 'hidden',
                border: '3px solid #ff6b35',
                position: 'relative'
              }}>
                <img
                  src={cv.image}
                  alt={cv.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                  onError={(e) => { e.target.src = "https://placehold.co/100x100/000000/FFFFFF?text=User"; }} // Fallback
                />
                {/* Profile badge */}
                <div style={{
                  position: 'absolute',
                  bottom: '-5px',
                  right: '-5px',
                  background: '#ff6b35',
                  borderRadius: '50%',
                  width: '30px',
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '3px solid #000000'
                }}>
                  <Star style={{ width: '14px', height: '14px', color: '#ffffff', fill: '#ffffff' }} />
                </div>
              </div>

              {/* Name */}
              <h3 style={{
                fontSize: '1.4rem',
                fontWeight: '600',
                marginBottom: '8px',
                color: '#ffffff'
              }}>
                {cv.name}
              </h3>

              {/* Job Title */}
              <div style={{
                background: 'rgba(255, 107, 53, 0.2)',
                color: '#ff6b35',
                padding: '6px 15px',
                borderRadius: '20px',
                fontSize: '0.95rem',
                fontWeight: '600',
                margin: '0 auto 20px',
                display: 'inline-block'
              }}>
                {cv.title}
              </div>

              {/* Summary */}
              <p style={{
                color: '#cccccc',
                fontSize: '0.95rem',
                lineHeight: '1.6',
                marginBottom: '25px',
                minHeight: '60px'
              }}>
                {cv.summary}
              </p>

              {/* View CV Button */}
              <button
                onClick={handleViewCV}
                style={{
                  background: 'linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '12px 25px',
                  borderRadius: '25px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 10px 20px rgba(255, 107, 53, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <Eye style={{ width: '16px', height: '16px' }} />
                Voir le CV
              </button>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div style={{
          textAlign: 'center',
          marginTop: '60px',
          padding: '40px 30px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 165, 0, 0.2)'
        }}>
          <h3 style={{
            fontSize: '1.8rem',
            fontWeight: '600',
            marginBottom: '15px',
            background: 'linear-gradient(135deg, #ffffff 0%, #ff6b35 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Créez votre CV professionnel
          </h3>
          <p style={{
            color: '#cccccc',
            fontSize: '1.1rem',
            marginBottom: '25px',
            maxWidth: '500px',
            margin: '0 auto 25px'
          }}>
            Rejoignez des milliers de candidats qui ont déjà créé leur profil sur Casajobs.ma
          </p>
          {/* You might want to add a button here to navigate to CV creation page */}
        </div>
      </div>

      {/* Render the CustomModal */}
      <CustomModal
        message={modalMessage}
        onClose={handleModalCloseAndNavigate} // Pass the handler that closes and navigates
      />
    </div>
  );
}

export default CVsExamples;
