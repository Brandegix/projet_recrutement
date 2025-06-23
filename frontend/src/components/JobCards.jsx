import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaBriefcase, FaSearch, FaFilter, FaChevronLeft, FaChevronRight, FaEllipsisH } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Custom hook for responsive design
function useWindowWidth() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowWidth;
}

// --- Modified JobCard Component ---
const JobCard = ({ job, isLoggedIn, user }) => { // Accept isLoggedIn and user as props
  const navigate = useNavigate();
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth < 768; // Mobile breakpoint

  const handleApplyClick = () => {
    if (isLoggedIn) {
      if (user && user.role === 'candidate') {
        // If the user is a candidate, navigate to their applications or a specific job application page
        navigate('/Offres'); // Or a more specific path like `/apply/${job.id}`
        alert("Redirection vers la page de candidature."); // For demonstration
      } else if (user && user.role === 'recruiter') {
        // If the user is a recruiter, navigate them to their job offers dashboard
        navigate('/RecruiterJobOffers);
        alert("Vous êtes un recruteur. Redirection vers votre tableau de bord."); // For demonstration
      } else {
        // Fallback for logged-in users with unexpected or no role
        navigate('/'); // Or a general logged-in user dashboard
        alert("Redirection vers le tableau de bord."); // For demonstration
      }
    } else {
      // If not logged in, redirect to the login page for candidates
      navigate('/ChoixRole2'); // Assuming '/ChoixRole2' is your login page
      alert("Veuillez vous connecter pour postuler."); // For demonstration
    }
  };

  // MOBILE CARD LAYOUT (unchanged visually, only logic for handleApplyClick updated)
  if (isMobile) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%)',
        border: '1px solid #333',
        borderRadius: '20px',
        padding: '25px',
        marginBottom: '20px',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden'
      }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-5px)';
          e.currentTarget.style.boxShadow = '0 20px 40px rgba(255, 107, 53, 0.1)';
          e.currentTarget.style.borderColor = '#ff6b35';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
          e.currentTarget.style.borderColor = '#333';
        }}>

        {/* Gradient accent line */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)'
        }} />

        {/* Company Logo - Mobile: Centered at top */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '20px'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '12px',
            overflow: 'hidden',
            border: '2px solid #333'
          }}>
            <img
              src={job.logo && job.logo.startsWith("http")
                ? job.logo
                : "https://dummyimage.com/80x80/333/fff.png&text=" + (job.company ? job.company.charAt(0) : 'C')}
              alt={job.logo ? "Logo de l'entreprise" : "Logo par défaut"}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>
        </div>

        {/* Job Title and Company - Mobile: Centered */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h3 style={{
            color: '#ffffff',
            fontSize: '1.3rem',
            fontWeight: '600',
            margin: '0 0 8px 0',
            lineHeight: '1.3'
          }}>
            {job.title}
          </h3>
          <p style={{
            color: '#cccccc',
            fontSize: '1rem',
            margin: '0 0 15px 0',
            fontWeight: '500'
          }}>
            {job.company}
          </p>

          {/* Job Type Badge - Mobile: Centered */}
          <span style={{
            background: 'rgba(255, 107, 53, 0.1)',
            color: '#ff6b35',
            padding: '6px 15px',
            borderRadius: '20px',
            fontSize: '0.85rem',
            fontWeight: '600',
            border: '1px solid rgba(255, 107, 53, 0.3)',
            display: 'inline-block'
          }}>
            {job.type}
          </span>
        </div>

        <div style={{ marginBottom: '20px' }}>
          {/* Mobile: Centered icons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginBottom: '15px', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cccccc' }}>
              <FaMapMarkerAlt style={{ color: '#ff6b35' }} />
              <span>{job.location}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cccccc' }}>
              <FaBriefcase style={{ color: '#ff6b35' }} />
              <span>{job.experience}</span>
            </div>
          </div>

          {/* Mobile: Centered text */}
          <p style={{
            color: '#aaaaaa',
            fontSize: '0.95rem',
            lineHeight: '1.6',
            margin: '0 0 15px 0',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            textAlign: 'center'
          }}>
            {job.description}
          </p>

          {/* Skills - Mobile: Centered */}
          {job.skills && job.skills.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '15px', justifyContent: 'center' }}>
              {job.skills.map((skill, index) => (
                <span key={index} style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#ffffff',
                  padding: '4px 12px',
                  borderRadius: '15px',
                  fontSize: '0.8rem',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Mobile: Centered full-width button */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={handleApplyClick}
            style={{
              background: 'linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)',
              color: '#ffffff',
              border: 'none',
              padding: '15px 0',
              borderRadius: '25px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              width: '100%',
              maxWidth: '280px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 10px 20px rgba(255, 107, 53, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Postuler
          </button>
        </div>
      </div>
    );
  }

  // DESKTOP CARD LAYOUT (unchanged visually, only logic for handleApplyClick updated)
  return (
    <div style={{
      background: 'linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%)',
      border: '1px solid #333',
      borderRadius: '20px',
      padding: '25px',
      marginBottom: '20px',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      position: 'relative',
      overflow: 'hidden'
    }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 20px 40px rgba(255, 107, 53, 0.1)';
        e.currentTarget.style.borderColor = '#ff6b35';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = '#333';
      }}>

      {/* Gradient accent line */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: 'linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)'
      }} />

      {/* Desktop: Horizontal layout for logo, title and badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '12px',
            overflow: 'hidden',
            border: '2px solid #333'
          }}>
            <img
              src={job.logo && job.logo.startsWith("http")
                ? job.logo
                : "https://dummyimage.com/60x60/333/fff.png&text=" + (job.company ? job.company.charAt(0) : 'C')}
              alt={job.logo ? "Logo de l'entreprise" : "Logo par défaut"}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>
          <div>
            <h3 style={{
              color: '#ffffff',
              fontSize: '1.3rem',
              fontWeight: '600',
              margin: '0 0 5px 0',
              lineHeight: '1.3'
            }}>
              {job.title}
            </h3>
            <p style={{
              color: '#cccccc',
              fontSize: '1rem',
              margin: '0',
              fontWeight: '500'
            }}>
              {job.company}
            </p>
          </div>
        </div>

        {/* Desktop: Badge at right */}
        <span style={{
          background: 'rgba(255, 107, 53, 0.1)',
          color: '#ff6b35',
          padding: '6px 15px',
          borderRadius: '20px',
          fontSize: '0.85rem',
          fontWeight: '600',
          border: '1px solid rgba(255, 107, 53, 0.3)'
        }}>
          {job.type}
        </span>
      </div>

      <div style={{ marginBottom: '20px' }}>
        {/* Desktop: Left-aligned icons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginBottom: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cccccc' }}>
            <FaMapMarkerAlt style={{ color: '#ff6b35' }} />
            <span>{job.location}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ff6b35' }}>
            <FaBriefcase />
            <span>{job.experience}</span>
          </div>
        </div>

        {/* Desktop: Left-aligned description */}
        <p style={{
          color: '#aaaaaa',
          fontSize: '0.95rem',
          lineHeight: '1.6',
          margin: '0 0 15px 0',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
        }}>
          {job.description}
        </p>

        {/* Skills - Desktop: Left aligned */}
        {job.skills && job.skills.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '15px' }}>
            {job.skills.map((skill, index) => (
              <span key={index} style={{
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#ffffff',
                padding: '4px 12px',
                borderRadius: '15px',
                fontSize: '0.8rem',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Desktop: Salary on left, button on right */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>


        <button
          onClick={handleApplyClick}
          style={{
            background: 'linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)',
            color: '#ffffff',
            border: 'none',
            padding: '12px 25px',
            borderRadius: '25px',
            fontSize: '0.9rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 10px 20px rgba(255, 107, 53, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          Postuler
        </button>
      </div>
    </div>
  );
};

// --- Modified JobCards Component ---
function JobCards() {
  const navigate = useNavigate(); // Add navigate here if not already present
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth < 768;
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = isMobile ? 3 : 3;
  const [filteredJobs, setFilteredJobs] = useState([]);

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // --- Authentication States ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true); // New state for auth check loading

  const [selectedPoste, setSelectedPoste] = useState('');
  const [selectedLieu, setSelectedLieu] = useState('');
  const [selectedSalaire, setSelectedSalaire] = useState('');
  const [selectedDomaine, setSelectedDomaine] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // --- Auth Check Logic (Copied from Navbar) ---
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/session`, {
          credentials: 'include',
        });

        if (!res.ok) {
          // If not OK, it means no active session or an error
          setIsLoggedIn(false);
          setUser(null);
          // throw new Error('Not logged in'); // Don't throw, just set state
        } else {
          const data = await res.json();
          if (data && data.isLoggedIn) {
            setIsLoggedIn(true);
            setUser(data.user); // data.user should contain { id, name, role }
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
        setIsCheckingAuth(false);
      }
    };

    checkAuthStatus();
  }, []); // Run once on component mount

  // --- Job Fetching Logic ---
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/je`)
      .then(response => {
        const updatedJobs = response.data.map(job => ({
          ...job,
          logo: job.logo && job.logo.startsWith("http")
            ? job.logo
            : "https://dummyimage.com/80x80/000/fff.png&text=No+Logo"
        }));
        setJobs(updatedJobs);
        setFilteredJobs(updatedJobs);
        setLoading(false);
      })
      .catch(error => {
        console.error("Erreur lors du chargement des offres :", error);
        setError(true);
        setLoading(false);
      });
  }, []);

  const handleSearch = () => {
    const results = jobs.filter(job =>
      (selectedPoste === '' || job.title.toLowerCase().includes(selectedPoste.toLowerCase())) &&
      (selectedLieu === '' || job.location.toLowerCase().includes(selectedLieu.toLowerCase())) &&
      (selectedSalaire === '' || (job.salary && job.salary.toLowerCase().includes(selectedSalaire.toLowerCase()))) && // Check for job.salary existence
      (selectedDomaine === '' || job.type.toLowerCase().includes(selectedDomaine.toLowerCase())) &&
      (
        searchTerm === '' ||
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredJobs(results);
    setCurrentPage(1);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  // Display loading for both jobs and auth check
  if (loading || isCheckingAuth) {
    return <p style={{ textAlign: 'center', color: '#fff', fontSize: '1.2rem', padding: '50px' }}>
      Chargement des offres et vérification de l'authentification...
    </p>;
  }
  if (error) return <p style={{ textAlign: 'center', color: '#ff6b35', fontSize: '1.2rem', padding: '50px' }}>
    Erreur de chargement des offres. Veuillez réessayer plus tard.
  </p>;

  // Responsive search and pagination styles (unchanged)
  const searchSectionStyle = {
    background: 'linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%)',
    border: '1px solid #333',
    borderRadius: isMobile ? '16px' : '20px',
    padding: isMobile ? '20px 15px' : '30px',
    marginBottom: isMobile ? '25px' : '40px'
  };

  const paginationStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: isMobile ? '5px' : '8px',
    marginTop: isMobile ? '30px' : '40px',
    padding: isMobile ? '15px' : '24px',
    background: 'linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%)',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
    border: '1px solid #333',
    flexWrap: isMobile ? 'wrap' : 'nowrap'
  };

  return (
    <>
      {/* Search Section */}
      <div style={searchSectionStyle}>
        {/* Search Bar */}
        <div style={{ position: 'relative', marginBottom: '25px' }}>
          <FaSearch style={{
            position: 'absolute',
            left: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#ff6b35',
            fontSize: '1.1rem'
          }} />
          <input
            type="text"
            placeholder="Rechercher une offre d'emploi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '15px 20px 15px 50px',
              borderRadius: '25px',
              border: '1px solid #444',
              background: 'rgba(255, 255, 255, 0.05)',
              color: '#ffffff',
              fontSize: isMobile ? '0.9rem' : '1rem',
              outline: 'none',
              transition: 'all 0.3s ease',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#ff6b35';
              e.target.style.boxShadow = '0 0 0 3px rgba(255, 107, 53, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#444';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* Filters */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile
            ? 'repeat(auto-fit, minmax(140px, 1fr))'
            : 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: isMobile ? '15px' : '20px',
          marginBottom: '20px'
        }}>
          <div>
            <label style={{
              display: 'block',
              color: '#cccccc',
              fontSize: '0.9rem',
              fontWeight: '600',
              marginBottom: '8px'
            }}>
              Poste
            </label>
            <select
              value={selectedPoste}
              onChange={(e) => setSelectedPoste(e.target.value)}
              style={{
                width: '100%',
                padding: isMobile ? '10px 12px' : '12px 15px',
                borderRadius: '12px',
                border: '1px solid #444',
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#ffffff',
                fontSize: '0.95rem',
                outline: 'none'
              }}
            >
              <option value="">Tous les postes</option>
              {[...new Set(jobs.map(job => job.title))].map((poste, index) => (
                <option key={index} value={poste}>{poste}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{
              display: 'block',
              color: '#cccccc',
              fontSize: '0.9rem',
              fontWeight: '600',
              marginBottom: '8px'
            }}>
              Lieu
            </label>
            <select
              value={selectedLieu}
              onChange={(e) => setSelectedLieu(e.target.value)}
              style={{
                width: '100%',
                padding: isMobile ? '10px 12px' : '12px 15px',
                borderRadius: '12px',
                border: '1px solid #444',
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#ffffff',
                fontSize: '0.95rem',
                outline: 'none'
              }}
            >
              <option value="">Toutes les villes</option>
              {[...new Set(jobs.map(job => job.location))].map((lieu, index) => (
                <option key={index} value={lieu}>{lieu}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{
              display: 'block',
              color: '#cccccc',
              fontSize: '0.9rem',
              fontWeight: '600',
              marginBottom: '8px'
            }}>
              Salaire
            </label>
            <select
              value={selectedSalaire}
              onChange={(e) => setSelectedSalaire(e.target.value)}
              style={{
                width: '100%',
                padding: isMobile ? '10px 12px' : '12px 15px',
                borderRadius: '12px',
                border: '1px solid #444',
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#ffffff',
                fontSize: '0.95rem',
                outline: 'none'
              }}
            >
              <option value="">Tous les salaires</option>
              {[...new Set(jobs.map(job => job.salary).filter(Boolean))].map((salaire, index) => ( // Filter out undefined/null salaries
                <option key={index} value={salaire}>{salaire}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{
              display: 'block',
              color: '#cccccc',
              fontSize: '0.9rem',
              fontWeight: '600',
              marginBottom: '8px'
            }}>
              Type
            </label>
            <select
              value={selectedDomaine}
              onChange={(e) => setSelectedDomaine(e.target.value)}
              style={{
                width: '100%',
                padding: isMobile ? '10px 12px' : '12px 15px',
                borderRadius: '12px',
                border: '1px solid #444',
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#ffffff',
                fontSize: '0.95rem',
                outline: 'none'
              }}
            >
              <option value="">Tous les types</option>
              {[...new Set(jobs.map(job => job.type))].map((domaine, index) => (
                <option key={index} value={domaine}>{domaine}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <button
            onClick={handleSearch}
            style={{
              background: 'linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)',
              color: '#ffffff',
              border: 'none',
              padding: isMobile ? '10px 25px' : '12px 30px',
              borderRadius: '25px',
              fontSize: isMobile ? '0.95rem' : '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(255, 107, 53, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <FaFilter />
            Rechercher
          </button>
        </div>
      </div>

      {/* Job Cards Display */}
      <div className="offers-wrapper">
        {filteredJobs.length === 0 ? (
          <p style={{
            textAlign: 'center',
            padding: '30px',
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '12px',
            color: '#aaa',
            border: '1px dashed #444'
          }}>
            Aucune offre disponible pour le moment.
          </p>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile
              ? '1fr'
              : 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: isMobile ? '15px' : '25px'
          }}>
            {currentJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                isLoggedIn={isLoggedIn} // Pass isLoggedIn prop
                user={user}         // Pass user prop
              />
            ))}
          </div>
        )}
      </div>

      {/* Enhanced Pagination - Integrated directly */}
      {totalPages > 1 && (
        <div style={paginationStyle}>
          {/* Previous Button */}
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: isMobile ? '8px 12px' : '12px 16px',
              fontSize: isMobile ? '0.8rem' : '0.9rem',
              fontWeight: '600',
              border: 'none',
              backgroundColor: currentPage === 1 ? '#333' : 'rgba(255, 107, 53, 0.1)',
              color: currentPage === 1 ? '#666' : '#ff6b35',
              borderRadius: '12px',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: currentPage === 1 ? 'none' : '0 2px 8px rgba(255, 107, 53, 0.15)',
              transform: 'translateY(0)',
              opacity: currentPage === 1 ? 0.5 : 1,
              order: isMobile ? '1' : '0'
            }}
            onMouseEnter={(e) => {
              if (currentPage !== 1) {
                e.target.style.backgroundColor = 'rgba(255, 107, 53, 0.2)';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 12px rgba(255, 107, 53, 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              if (currentPage !== 1) {
                e.target.style.backgroundColor = 'rgba(255, 107, 53, 0.1)';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 8px rgba(255, 107, 53, 0.15)';
              }
            }}
          >
            <FaChevronLeft size={12} />
            {!isMobile && <span>Précédent</span>}
          </button>

          {/* Page Numbers */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            order: isMobile ? '0' : '1',
            width: isMobile ? '100%' : 'auto',
            justifyContent: 'center',
            margin: isMobile ? '10px 0' : '0'
          }}>
            {(() => {
              const delta = isMobile ? 1 : 2;
              const range = [];
              const rangeWithDots = [];

              if (totalPages <= (isMobile ? 5 : 7)) {
                for (let i = 1; i <= totalPages; i++) {
                  rangeWithDots.push(i);
                }
              } else {
                rangeWithDots.push(1);

                if (currentPage > delta + 1) {
                  rangeWithDots.push('...');
                }

                for (
                  let i = Math.max(2, currentPage - delta);
                  i <= Math.min(totalPages - 1, currentPage + delta);
                  i++
                ) {
                  range.push(i);
                }
                rangeWithDots.push(...range);

                if (currentPage < totalPages - delta) {
                  rangeWithDots.push('...');
                }

                rangeWithDots.push(totalPages);
              }

              return rangeWithDots.map((page, index) => (
                page === '...' ? (
                  <div
                    key={`dots-${index}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: isMobile ? '32px' : '40px',
                      height: isMobile ? '32px' : '40px',
                      color: '#666',
                      fontSize: '1rem'
                    }}
                  >
                    <FaEllipsisH size={12} />
                  </div>
                ) : (
                  <button
                    key={page}
                    onClick={() => paginate(page)}
                    style={{
                      width: isMobile ? '32px' : '40px',
                      height: isMobile ? '32px' : '40px',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      border: 'none',
                      backgroundColor: currentPage === page
                        ? '#ff6b35'
                        : 'rgba(255, 255, 255, 0.05)',
                      color: currentPage === page ? '#ffffff' : '#cccccc',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: currentPage === page
                        ? '0 4px 12px rgba(255, 107, 53, 0.4)'
                        : '0 2px 4px rgba(0, 0, 0, 0.2)',
                      transform: 'translateY(0)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onMouseEnter={(e) => {
                      if (currentPage !== page) {
                        e.target.style.backgroundColor = 'rgba(255, 107, 53, 0.2)';
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 4px 8px rgba(255, 107, 53, 0.3)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (currentPage !== page) {
                        e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
                      }
                    }}
                  >
                    {page}
                  </button>
                )
              ));
            })()}
          </div>

          {/* Next Button */}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: isMobile ? '8px 12px' : '12px 16px',
              fontSize: isMobile ? '0.8rem' : '0.9rem',
              fontWeight: '600',
              border: 'none',
              backgroundColor: currentPage === totalPages ? '#333' : 'rgba(255, 107, 53, 0.1)',
              color: currentPage === totalPages ? '#666' : '#ff6b35',
              borderRadius: '12px',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: currentPage === totalPages ? 'none' : '0 2px 8px rgba(255, 107, 53, 0.15)',
              transform: 'translateY(0)',
              opacity: currentPage === totalPages ? 0.5 : 1,
              order: isMobile ? '2' : '2'
            }}
            onMouseEnter={(e) => {
              if (currentPage !== totalPages) {
                e.target.style.backgroundColor = 'rgba(255, 107, 53, 0.2)';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 12px rgba(255, 107, 53, 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              if (currentPage !== totalPages) {
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 8px rgba(255, 107, 53, 0.15)';
              }
            }}
          >
            {!isMobile && <span>Suivant</span>}
            <FaChevronRight size={12} />
          </button>
        </div>
      )}
    </>
  );
}

export default JobCards;
