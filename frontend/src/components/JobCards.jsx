import React, { useState, useEffect, useMemo } from 'react'; // Added useMemo import
import { FaMapMarkerAlt, FaBriefcase, FaSearch, FaFilter, FaChevronLeft, FaChevronRight, FaEllipsisH, FaTimes } from 'react-icons/fa';
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

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPoste, setSelectedPoste] = useState('');
  const [selectedLieu, setSelectedLieu] = useState('');
  const [selectedSalaire, setSelectedSalaire] = useState('');
  const [selectedDomaine, setSelectedDomaine] = useState('');
  const [showFilters, setShowFilters] = useState(false);

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
          logo: job.logo || "https://dummyimage.com/80x80/000/fff.png&text=No+Logo",
          // Keep original casing for display, but normalize for filtering
          originalTitle: job.title || '',
          originalLocation: job.location || '',
          originalSalary: job.salary || '',
          originalType: job.type || '',
          // Normalized for filtering
          title: job.title ? job.title.toLowerCase().trim() : '',
          location: job.location ? job.location.toLowerCase().trim() : '',
          salary: job.salary ? job.salary.toLowerCase().trim() : '',
          type: job.type ? job.type.toLowerCase().trim() : '',
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

  // Filter jobs based on search criteria
  useEffect(() => {
    const filterJobs = () => {
      const results = jobs.filter(job => {
        const matchesSearch = searchTerm === '' ||
          job.title.includes(searchTerm.toLowerCase()) ||
          job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesPoste = selectedPoste === '' ||
          job.originalTitle.toLowerCase().includes(selectedPoste.toLowerCase());

        const matchesLieu = selectedLieu === '' ||
          job.originalLocation.toLowerCase().includes(selectedLieu.toLowerCase());

        const matchesSalaire = selectedSalaire === '' ||
          (job.originalSalary && job.originalSalary.toLowerCase().includes(selectedSalaire.toLowerCase()));

        const matchesDomaine = selectedDomaine === '' ||
          job.originalType.toLowerCase().includes(selectedDomaine.toLowerCase());

        return matchesSearch && matchesPoste && matchesLieu && matchesSalaire && matchesDomaine;
      });

      setFilteredJobs(results);
      setCurrentPage(1);
    };

    filterJobs();
  }, [searchTerm, selectedPoste, selectedLieu, selectedSalaire, selectedDomaine, jobs]);

  // Get unique filter options - using original casing for display
  const filterOptions = useMemo(() => ({
    postes: [...new Set(jobs.map(job => job.originalTitle).filter(Boolean))],
    lieux: [...new Set(jobs.map(job => job.originalLocation).filter(Boolean))],
    salaires: [...new Set(jobs.map(job => job.originalSalary).filter(Boolean))],
    domaines: [...new Set(jobs.map(job => job.originalType).filter(Boolean))]
  }), [jobs]);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  // Clear all filters function
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedPoste('');
    setSelectedLieu('');
    setSelectedSalaire('');
    setSelectedDomaine('');
  };

  // Check if any filters are active
  const hasActiveFilters = searchTerm || selectedPoste || selectedLieu || selectedSalaire || selectedDomaine;

  if (loading || isCheckingAuth) {
    return <p style={{ textAlign: 'center', color: '#fff', fontSize: '1.2rem', padding: '50px' }}>
      Chargement des offres et vérification de l'authentification...
    </p>;
  }
  if (error) return <p style={{ textAlign: 'center', color: '#ff6b35', fontSize: '1.2rem', padding: '50px' }}>
    Erreur de chargement des offres. Veuillez réessayer plus tard.
  </p>;

  // Responsive search and pagination styles
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
    justifyContent: 'center', // Initial justify content
    gap: isMobile ? '6px' : '10px',
    marginTop: isMobile ? '30px' : '40px',
    padding: isMobile ? '15px' : '20px',
    background: 'linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%)',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
    border: '1px solid #333',
    flexWrap: isMobile ? 'wrap' : 'nowrap',
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
  });

  // Style for individual page number buttons
  const pageNumberButtonStyle = (isActive) => ({
    ...paginationButtonBase,
    width: isMobile ? '36px' : '44px', // Fixed width matching height
    padding: '0', // No horizontal padding for number buttons, width/height handle size
    backgroundColor: isActive ? '#ff6b35' : 'rgba(255, 255, 255, 0.05)',
    color: isActive ? '#ffffff' : '#cccccc',
    boxShadow: isActive ? '0 4px 12px rgba(255, 107, 53, 0.3)' : 'none',
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
      {/* Search Section */}
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
                color: '#ffffff',
                fontSize: '0.95rem',
                outline: 'none'
              }}
            >
              <option value="">Tous les postes</option>
              {filterOptions.postes.map((poste, index) => (
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
              {filterOptions.lieux.map((lieu, index) => (
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
                outline: 'none' }}
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
 
         
       </div>
 
       {/* Job Cards Display (unchanged) */}
       <div className="offers-wrapper">
         {filteredJobs.length === 0 ? (
           <p style={{
             textAlign: 'center',
             color: '#fff',
           fontSize: '1.1rem',
           padding: '50px 20px',
           background: 'linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%)',
           borderRadius: '16px',
           border: '1px solid #333',
           margin: '20px auto',
           maxWidth: '600px'
         }}>
           Aucune offre d'emploi ne correspond à vos critères de recherche.
         </p>
         ) : (
           <div style={{
             display: 'grid',
             gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(350px, 1fr))',
             gap: '30px',
             maxWidth: '1200px',
             margin: '0 auto'
           }}>
             {currentJobs.map(job => (
               <JobCard key={job._id} job={job} isLoggedIn={isLoggedIn} user={user} />
             ))}
           </div>
         )}
       </div>
 
       {/* --- UPDATED PAGINATION CONTROLS --- */}
       {totalPages > 1 && (
         <div style={paginationContainerStyle}>
           {/* Previous Button */}
           <button
             onClick={() => paginate(currentPage - 1)}
             disabled={currentPage === 1}
             style={{
               ...prevNextButtonStyle(currentPage === 1),
               order: 1, // Ensure it's the first element
             }}
             onMouseEnter={(e) => {
               if (currentPage !== 1) {
                 e.currentTarget.style.backgroundColor = '#ff8c42';
                 e.currentTarget.style.borderColor = '#ff8c42';
                 e.currentTarget.style.transform = 'translateY(-2px)';
                 e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 107, 53, 0.3)';
               }
             }}
             onMouseLeave={(e) => {
               if (currentPage !== 1) {
                 e.currentTarget.style.backgroundColor = '#ff6b35';
                 e.currentTarget.style.borderColor = '#ff6b35';
                 e.currentTarget.style.transform = 'translateY(0)';
                 e.currentTarget.style.boxShadow = '0 2px 8px rgba(255, 107, 53, 0.15)';
               }
             }}
           >
             <FaChevronLeft style={{ marginRight: isMobile ? '0' : '8px' }} />
             {!isMobile && 'Précédent'}
           </button>
 
           {/* Page Numbers Container */}
           <div style={{
             display: 'flex',
             gap: isMobile ? '4px' : '8px',
             alignItems: 'center',
             order: 2, // Place it in the middle
             flexGrow: 1, // Allow it to take available space
             justifyContent: 'center', // Center numbers within their container
             flexWrap: 'wrap', // Allow numbers to wrap on smaller screens
           }}>
             {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => {
               // Logic to show a limited set of page numbers around the current page
               const showPage =
                 number === 1 ||
                 number === totalPages ||
                 (number >= currentPage - 1 && number <= currentPage + 1);
 
               const showEllipsis =
                 (number === currentPage - 2 && currentPage > 3) ||
                 (number === currentPage + 2 && currentPage < totalPages - 2);
 
               if (showEllipsis) {
                 return <span key={`ellipsis-${number}`} style={ellipsisStyle}><FaEllipsisH /></span>;
               }
 
               if (showPage) {
                 return (
                   <button
                     key={number}
                     onClick={() => paginate(number)}
                     style={{
                       ...pageNumberButtonStyle(number === currentPage),
                       // Apply hover effects using inline style for React (simulating :hover)
                     }}
                     onMouseEnter={(e) => {
                       if (number !== currentPage) {
                         e.currentTarget.style.backgroundColor = 'rgba(255, 107, 53, 0.15)';
                         e.currentTarget.style.color = '#ff8c42';
                         e.currentTarget.style.transform = 'translateY(-2px)';
                         e.currentTarget.style.boxShadow = '0 4px 10px rgba(255, 107, 53, 0.25)';
                       }
                     }}
                     onMouseLeave={(e) => {
                       if (number !== currentPage) {
                         e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                         e.currentTarget.style.color = '#cccccc';
                         e.currentTarget.style.transform = 'translateY(0)';
                         e.currentTarget.style.boxShadow = 'none';
                       }
                     }}
                   >
                     {number}
                   </button>
                 );
               }
               return null;
             })}
           </div>
 
           {/* Next Button */}
           <button
             onClick={() => paginate(currentPage + 1)}
             disabled={currentPage === totalPages}
             style={{
               ...prevNextButtonStyle(currentPage === totalPages),
               order: 3, // Ensure it's the last element
             }}
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
             {!isMobile && 'Suivant'}
             <FaChevronRight style={{ marginLeft: isMobile ? '0' : '8px' }} />
           </button>
         </div>
       )}
     </>
   );
 }
 
 export default JobCards;
