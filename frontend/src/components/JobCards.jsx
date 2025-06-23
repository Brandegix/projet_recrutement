import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaBriefcase, FaSearch, FaFilter, FaChevronLeft, FaChevronRight, FaEllipsisH } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Custom hook for responsive design (unchanged, good to keep)
function useWindowWidth() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowWidth;
}

// --- JobCard Component (No changes needed for pagination) ---
const JobCard = ({ job, isLoggedIn, user }) => {
  const navigate = useNavigate();
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth < 768;

  const handleApplyClick = () => {
    if (isLoggedIn) {
      if (user && user.role === 'candidate') {
        navigate('/Offres');
      } else if (user && user.role === 'recruiter') {
        navigate('/');
        alert("Veuillez vous connecter en tant que candidat pour postuler.");
      } else {
        navigate('/');
        alert("Redirection vers le tableau de bord.");
      }
    } else {
      navigate('/ChoixRole2');
      alert("Veuillez vous connecter pour postuler.");
    }
  };

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

        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)'
        }} />

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

      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: 'linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)'
      }} />

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '20px'
      }}>
        <div style={{
          display: 'flex',
          gap: '15px',
          flex: '1'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '12px',
            overflow: 'hidden',
            background: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: '0',
            border: '2px solid #333'
          }}>
            <img
              src={job.logo && job.logo.startsWith("http")
                ? job.logo
                : `/api/placeholder/60/60?text=${job.company ? job.company.charAt(0) : 'C'}`}
              alt={`${job.company} logo`}
              onError={(e) => {
                e.target.src = `https://dummyimage.com/60x60/333/fff.png&text=${job.company ? job.company.charAt(0) : 'C'}`;
              }}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>
          <div style={{
            flex: '1',
            minWidth: '0'
          }}>
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

// --- Enhanced JobCards Component with updated Pagination ---
function JobCards() {
  const navigate = useNavigate();
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth < 768;
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = isMobile ? 3 : 3; // Keep consistency for now, could be different
  const [filteredJobs, setFilteredJobs] = useState([]);

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const [selectedPoste, setSelectedPoste] = useState('');
  const [selectedLieu, setSelectedLieu] = useState('');
  const [selectedSalaire, setSelectedSalaire] = useState('');
  const [selectedDomaine, setSelectedDomaine] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/session`, {
          credentials: 'include',
        });

        if (!res.ok) {
          setIsLoggedIn(false);
          setUser(null);
        } else {
          const data = await res.json();
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
        setIsCheckingAuth(false);
      }
    };

    checkAuthStatus();
  }, []);

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
      (selectedSalaire === '' || (job.salary && job.salary.toLowerCase().includes(selectedSalaire.toLowerCase()))) &&
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

  if (loading || isCheckingAuth) {
    return <p style={{ textAlign: 'center', color: '#fff', fontSize: '1.2rem', padding: '50px' }}>
      Chargement des offres et vérification de l'authentification...
    </p>;
  }
  if (error) return <p style={{ textAlign: 'center', color: '#ff6b35', fontSize: '1.2rem', padding: '50px' }}>
    Erreur de chargement des offres. Veuillez réessayer plus tard.
  </p>;

  // Responsive search and pagination styles (unchanged, as they are container styles)
  const searchSectionStyle = {
    background: 'linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%)',
    border: '1px solid #333',
    borderRadius: isMobile ? '16px' : '20px',
    padding: isMobile ? '20px 15px' : '30px',
    marginBottom: isMobile ? '25px' : '40px'
  };

  // --- UPDATED PAGINATION CONTAINER STYLE ---
  const paginationContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center', // Centers items horizontally
    gap: isMobile ? '6px' : '10px',
    marginTop: isMobile ? '30px' : '40px',
    padding: isMobile ? '15px' : '20px',
    background: 'linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%)',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
    border: '1px solid #333',
    flexWrap: isMobile ? 'wrap' : 'nowrap'
  };

  // Base style for all pagination buttons
  const paginationButtonBase = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid transparent', // Prevent layout shift on hover
    borderRadius: '12px', // Consistent border-radius for all buttons
    fontSize: isMobile ? '0.85rem' : '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    height: isMobile ? '36px' : '44px', // Standard height for all buttons
    boxSizing: 'border-box',
    textDecoration: 'none', // For anchor tags if used instead of buttons
  };

  // --- UPDATED STYLE FOR PREV/NEXT BUTTONS (ARROWS) ---
  const prevNextButtonStyle = (isDisabled) => ({
    ...paginationButtonBase,
    padding: isMobile ? '0 12px' : '0 18px',
    // Always white color for the arrow icon
    color: 'white',
    // Background changes based on disabled state
    backgroundColor: isDisabled ? '#6c757d' : '#ff6b35', // Grey for blocked, orange for active
    borderColor: isDisabled ? '#6c757d' : '#ff6b35', // Match border color
    boxShadow: isDisabled ? 'none' : '0 2px 8px rgba(255, 107, 53, 0.15)',
    opacity: isDisabled ? 0.7 : 1, // Slight dim for disabled
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    '&:hover': isDisabled ? {} : { // Hover effects for non-disabled state
      backgroundColor: '#ff8c42', // Slightly lighter orange on hover
      borderColor: '#ff8c42',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)',
    }
  });

  // Style for individual page number buttons
  const pageNumberButtonStyle = (isActive) => ({
    ...paginationButtonBase,
    width: isMobile ? '36px' : '44px', // Fixed width matching height
    padding: '0', // No horizontal padding for number buttons, width/height handle size
    backgroundColor: isActive ? '#ff6b35' : 'rgba(255, 255, 255, 0.05)',
    color: isActive ? '#ffffff' : '#cccccc',
    boxShadow: isActive ? '0 4px 12px rgba(255, 107, 53, 0.3)' : 'none',
    '&:not(:active):hover': isActive ? {} : { // Hover for inactive pages
      backgroundColor: 'rgba(255, 107, 53, 0.15)',
      color: '#ff8c42',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 10px rgba(255, 107, 53, 0.25)',
    },
  });

  // Style for ellipsis
  const ellipsisStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: isMobile ? '36px' : '44px',
    height: isMobile ? '36px' : '44px',
    color: '#666',
    fontSize: '1rem'
  };

  return (
    <>
      {/* Search Section (unchanged) */}
      <div style={searchSectionStyle}>
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
              {[...new Set(jobs.map(job => job.salary).filter(Boolean))].map((salaire, index) => (
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

      {/* Job Cards Display (unchanged) */}
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
                isLoggedIn={isLoggedIn}
                user={user}
              />
            ))}
          </div>
        )}
      </div>

      {/* Enhanced Pagination */}
      {totalPages > 1 && (
        <div style={paginationContainerStyle}>
          {/* Previous Button */}
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            style={prevNextButtonStyle(currentPage === 1)}
            onMouseEnter={(e) => {
              // Apply hover styles only if not disabled
              if (currentPage !== 1) {
                e.currentTarget.style.backgroundColor = '#ff8c42';
                e.currentTarget.style.borderColor = '#ff8c42';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 107, 53, 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              // Revert to non-hover styles if not disabled
              if (currentPage !== 1) {
                e.currentTarget.style.backgroundColor = '#ff6b35';
                e.currentTarget.style.borderColor = '#ff6b35';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(255, 107, 53, 0.15)';
              }
            }}
          >
            <FaChevronLeft size={16} /> {/* Larger icon size for better visibility */}
          </button>

          {/* Page Numbers */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            order: isMobile ? '0' : '1', // Mobile moves page numbers above prev/next
            width: isMobile ? '100%' : 'auto',
            justifyContent: 'center',
            margin: isMobile ? '10px 0' : '0'
          }}>
            {(() => {
              const delta = isMobile ? 1 : 2; // How many pages around current
              const rangeWithDots = [];

              let start = Math.max(1, currentPage - delta);
              let end = Math.min(totalPages, currentPage + delta);

              // Adjust start/end to always show a consistent number of pages
              if (start === 1) {
                  end = Math.min(totalPages, delta * 2 + 1);
              }
              if (end === totalPages) {
                  start = Math.max(1, totalPages - delta * 2);
              }
              
              if (start > 1) {
                rangeWithDots.push(1);
                if (start > 2) {
                  rangeWithDots.push('...');
                }
              }

              for (let i = start; i <= end; i++) {
                rangeWithDots.push(i);
              }

              if (end < totalPages) {
                if (end < totalPages - 1) {
                  rangeWithDots.push('...');
                }
                rangeWithDots.push(totalPages);
              }

              return rangeWithDots.map((page, index) => (
                page === '...' ? (
                  <div
                    key={`dots-${index}`}
                    style={ellipsisStyle}
                  >
                    <FaEllipsisH size={12} />
                  </div>
                ) : (
                  <button
                    key={page}
                    onClick={() => paginate(page)}
                    style={pageNumberButtonStyle(currentPage === page)}
                    onMouseEnter={(e) => {
                      if (currentPage !== page) {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 107, 53, 0.15)';
                        e.currentTarget.style.color = '#ff8c42';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 4px 10px rgba(255, 107, 53, 0.25)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (currentPage !== page) {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                        e.currentTarget.style.color = '#cccccc';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
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
            style={prevNextButtonStyle(currentPage === totalPages)}
            onMouseEnter={(e) => {
              if (currentPage !== totalPages) {
                e.currentTarget.style.backgroundColor = '#ff8c42';
                e.currentTarget.style.borderColor = '#ff8c42';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 107, 53, 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              if (currentPage !== totalPages) {
                e.currentTarget.style.backgroundColor = '#ff6b35';
                e.currentTarget.style.borderColor = '#ff6b35';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(255, 107, 53, 0.15)';
              }
            }}
          >
            <FaChevronRight size={16} /> {/* Larger icon size for better visibility */}
          </button>
        </div>
      )}
    </>
  );
}

export default JobCards;
