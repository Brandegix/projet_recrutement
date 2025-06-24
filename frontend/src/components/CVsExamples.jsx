import React, { useState, useEffect } from 'react';
import { Eye, Star, X } from 'lucide-react'; // X for close icon. User was not used.
// Using a placeholder image URL for robustness in different environments.
// If you have a local image, ensure its path is correctly resolved by your bundler.
const candidatImage = 'https://placehold.co/100x100/000000/FFFFFF?text=User';
import { useNavigate } from 'react-router-dom';

/**
 * Custom Modal Component for displaying messages.
 * This modal provides a consistent appearance with a message and a "Fermer" button.
 *
 * @param {Object} props - The component props.
 * @param {string} props.message - The message text to display inside the modal.
 * @param {function} props.onClose - Callback function to execute when the modal is closed.
 */
const CustomModal = ({ message, onClose }) => {
  // If no message is provided, the modal should not be rendered.
  if (!message) return null;

  return (
    <div style={{
      position: 'fixed', // Positions the modal over all other content
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)', // Semi-transparent black overlay
      display: 'flex',
      justifyContent: 'center', // Center content horizontally
      alignItems: 'center', // Center content vertically
      zIndex: 1000, // Ensures the modal is on top
      fontFamily: 'Inter, sans-serif' // Apply consistent font
    }}>
      <div style={{
        backgroundColor: '#1a1a1a', // Dark background for the modal content area
        padding: '30px',
        borderRadius: '15px', // Rounded corners for the modal box
        maxWidth: '400px', // Max width for larger screens
        width: '90%', // Responsive width for smaller screens
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)', // Adds a shadow for depth
        position: 'relative', // Allows absolute positioning of the close button inside
        border: '1px solid #333', // Subtle border
        textAlign: 'center' // Center text inside the modal
      }}>
        {/* Close button (X icon) positioned at the top right corner */}
        <button
          onClick={onClose} // Triggers the onClose function passed from parent
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            background: 'none',
            border: 'none',
            color: '#cccccc', // Light gray color for the icon
            cursor: 'pointer', // Indicates interactivity
            fontSize: '1.5rem',
            padding: '5px'
          }}
        >
          <X size={24} /> {/* Lucide React 'X' icon */}
        </button>
        {/* The main message displayed in the modal */}
        <p style={{
          color: '#ffffff', // White text for readability
          fontSize: '1.1rem',
          marginBottom: '25px',
          lineHeight: '1.5'
        }}>
          {message}
        </p>
        {/* Container for the action button(s) */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={onClose} // This button also triggers the onClose function
            style={{
              background: 'linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)', // Orange gradient for the button
              color: '#ffffff',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '20px', // Pill-shaped button
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease', // Smooth transition for hover effects
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }} // Slight scale on hover
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }} // Reset scale on mouse leave
          >
            Fermer {/* Text for the button */}
          </button>
        </div>
      </div>
    </div>
  );
};


/**
 * CVsExamples Component
 * Displays example CV cards and handles navigation based on user authentication and role.
 * It uses a custom modal to provide feedback to the user before redirecting.
 */
function CVsExamples() {
  const navigate = useNavigate(); // Hook for navigation
  // State variables for managing authentication status
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true); // Tracks auth loading state

  // State variables for controlling the custom modal
  const [modalMessage, setModalMessage] = useState(''); // Holds the message to display in the modal
  // Stores the function to execute after the modal is closed (e.g., a navigate call)
  const [modalAction, setModalAction] = useState(() => () => {}); // Initializes with a no-operation function

  // useEffect hook to perform authentication check when the component mounts
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Fetch session data from your backend API.
        // `process.env.REACT_APP_API_URL` needs to be configured in your project's .env file.
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/session`, {
          credentials: 'include', // Essential for sending cookies (e.g., session IDs)
        });

        if (!res.ok) {
          // If the response indicates an error (e.g., 401 Unauthorized), the user is not logged in.
          setIsLoggedIn(false);
          setUser(null);
        } else {
          const data = await res.json();
          // Assuming the API returns { isLoggedIn: boolean, user: { role: string, ... } }
          if (data && data.isLoggedIn) {
            setIsLoggedIn(true);
            setUser(data.user); // Set user data, including their role
          } else {
            setIsLoggedIn(false);
            setUser(null);
          }
        }
      } catch (error) {
        // Log any errors during the authentication check
        console.error("Authentication check error:", error);
        setIsLoggedIn(false);
        setUser(null);
      } finally {
        setIsCheckingAuth(false); // Authentication check is complete, regardless of outcome
      }
    };

    checkAuthStatus(); // Call the async function
  }, []); // Empty dependency array ensures this runs only once on component mount

  /**
   * Handles the closing of the custom modal.
   * It clears the modal message (hiding the modal) and then executes the stored action.
   */
  const handleModalCloseAndNavigate = () => {
    setModalMessage(''); // Clear the message to hide the CustomModal
    modalAction();       // Execute the function that was previously set (e.g., navigate('/Offres'))
    setModalAction(() => () => {}); // Reset the action to a no-op to prevent accidental re-execution
  };

  /**
   * Determines the appropriate modal message and navigation action based on the user's status.
   * This function is triggered when a CV card's "Voir le CV" button is clicked.
   */
  const handleViewCV = () => {
    if (isLoggedIn) {
      // Logic for logged-in users
      if (user && user.role === 'candidate') {
        setModalMessage("Vous êtes connecté en tant que candidat. Vous pouvez envoyer vos CV avec vos candidatures.");
        setModalAction(() => () => navigate('/Offres')); // Candidate redirected to offers page
      } else if (user && user.role === 'recruiter') {
        setModalMessage("Vous êtes connecté en tant que recruteur. Vous allez trouver les CVs des candidats en consultant vos offres.");
        setModalAction(() => () => navigate('/RecruiterJobOffers')); // Recruiter redirected to their job offers page
      } else {
        // Fallback for any other logged-in user role or if role is undefined
        setModalMessage("Vous êtes connecté. Redirection vers l'accueil.");
        setModalAction(() => () => navigate('/')); // Generic redirection to home page
      }
    } else {
      // Logic for visitors (not logged in)
      setModalMessage("Veuillez vous connecter pour voir les CVs. Vous serez redirigé vers la page de sélection de rôle.");
      setModalAction(() => () => navigate('/choixRole')); // Visitor redirected to role selection/login page
    }
  };

  // Static data for example CVs (unchanged)
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

  // Conditional rendering for a loading state while authentication is being checked
  if (isCheckingAuth) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '300px', // Ensures the loading spinner is visible and centered
        color: '#ffffff',
        fontSize: '1.5rem',
        fontFamily: 'Inter, sans-serif'
      }}>
        <div style={{
          border: '4px solid rgba(255, 255, 255, 0.3)', // Light border for the spinner circle
          borderTop: '4px solid #ff6b35', // Primary color for the spinning part
          borderRadius: '50%', // Makes it a circle
          width: '50px',
          height: '50px',
          animation: 'spin 1s linear infinite', // Applies the spinning animation
          marginRight: '20px'
        }}></div>
        Vérification de l'état d'authentification... {/* Loading text */}
        {/* CSS for the spinning animation */}
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Main component rendering once authentication check is complete
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
            background: 'linear-gradient(135deg, #ffffff 0%, #ff6b35 100%)', // Gradient background for text
            WebkitBackgroundClip: 'text', // Clips the gradient to the text shape
            WebkitTextFillColor: 'transparent' // Makes the text transparent to show the gradient
          }}>
            Exemples de CVs
          </h2>
          <p style={{
            fontSize: '1.2rem',
            color: '#cccccc', // Light gray text
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Découvrez des profils inspirants et créez le vôtre dès maintenant
          </p>
        </div>

        {/* CV Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', // Responsive grid layout
          gap: '30px', // Space between grid items
          justifyContent: 'center' // Centers the grid items
        }}>
          {/* Map through exampleCVs to render each CV card */}
          {exampleCVs.map((cv, index) => (
            <div
              key={index} // Unique key for list rendering
              onClick={handleViewCV} // Click handler for the whole card, triggers modal
              style={{
                background: 'rgba(255, 255, 255, 0.05)', // Semi-transparent white background
                borderRadius: '20px', // Rounded corners
                padding: '30px 25px',
                border: '1px solid rgba(255, 165, 0, 0.2)', // Subtle orange border
                textAlign: 'center',
                cursor: 'pointer', // Indicates clickable element
                transition: 'all 0.3s ease', // Smooth transitions for hover effects
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)' // Initial shadow
              }}
              // Hover effects for the card
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

              {/* Profile Image Section */}
              <div style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%', // Makes the image circular
                margin: '0 auto 20px',
                overflow: 'hidden',
                border: '3px solid #ff6b35', // Orange border around the image
                position: 'relative' // For positioning the badge
              }}>
                <img
                  src={cv.image}
                  alt={cv.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover' // Ensures the image fills the container
                  }}
                  onError={(e) => { e.target.src = "https://placehold.co/100x100/000000/FFFFFF?text=User"; }} // Fallback image if original fails to load
                />
                {/* Profile badge (star icon) */}
                <div style={{
                  position: 'absolute',
                  bottom: '-5px',
                  right: '-5px',
                  background: '#ff6b35', // Orange background for the badge
                  borderRadius: '50%',
                  width: '30px',
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '3px solid #000000' // Dark border for the badge
                }}>
                  <Star style={{ width: '14px', height: '14px', color: '#ffffff', fill: '#ffffff' }} /> {/* Star icon */}
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
                background: 'rgba(255, 107, 53, 0.2)', // Light orange transparent background
                color: '#ff6b35', // Orange text
                padding: '6px 15px',
                borderRadius: '20px', // Rounded pill shape
                fontSize: '0.95rem',
                fontWeight: '600',
                margin: '0 auto 20px',
                display: 'inline-block' // Ensures it only takes necessary width
              }}>
                {cv.title}
              </div>

              {/* Summary */}
              <p style={{
                color: '#cccccc', // Light gray text
                fontSize: '0.95rem',
                lineHeight: '1.6',
                marginBottom: '25px',
                minHeight: '60px' // Ensures consistent height for summary blocks
              }}>
                {cv.summary}
              </p>

              {/* View CV Button */}
              <button
                onClick={handleViewCV} // This button also triggers the modal
                style={{
                  background: 'linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)', // Orange gradient button
                  color: '#ffffff',
                  border: 'none',
                  padding: '12px 25px',
                  borderRadius: '25px', // Rounded button
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'inline-flex', // Allows icon and text alignment
                  alignItems: 'center',
                  gap: '8px'
                }}
                // Hover effects for the button
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 10px 20px rgba(255, 107, 53, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <Eye style={{ width: '16px', height: '16px' }} /> {/* Eye icon */}
                Voir le CV
              </button>
            </div>
          ))}
        </div>

        {/* Call to Action Section at the bottom */}
        <div style={{
          textAlign: 'center',
          marginTop: '60px',
          padding: '40px 30px',
          background: 'rgba(255, 255, 255, 0.05)', // Subtle transparent background
          borderRadius: '20px',
          border: '1px solid rgba(255, 165, 0, 0.2)' // Orange border
        }}>
          <h3 style={{
            fontSize: '1.8rem',
            fontWeight: '600',
            marginBottom: '15px',
            background: 'linear-gradient(135deg, #ffffff 0%, #ff6b35 100%)', // Gradient text
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
          {/* A button to navigate to CV creation page could be added here */}
        </div>
      </div>

      {/* The CustomModal component, which will be visible when modalMessage has content */}
      <CustomModal
        message={modalMessage}
        onClose={handleModalCloseAndNavigate} // Pass the handler that closes the modal and performs navigation
      />
    </div>
  );
}

export default CVsExamples;
