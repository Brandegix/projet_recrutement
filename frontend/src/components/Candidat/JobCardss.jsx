import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaMapMarkerAlt, FaBriefcase, FaBookmark, FaRegBookmark, FaChevronLeft, FaChevronRight, FaEllipsisH, FaHeart, FaArrowRight, FaSearch, FaFilter } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";

const JobCard = ({ job, onApply, isApplied, onSave, isSaved }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/offres/${job.id}`);
  };

  return (
    <div style={{
      background: 'linear-gradient(145deg, #ffffff 0%, #fafafa 100%)',
      borderRadius: '20px',
      padding: '28px',
      marginBottom: '24px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
      border: '1px solid rgba(255, 140, 0, 0.1)',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      overflow: 'hidden'
    }}
    onMouseEnter={(e) => {
      e.target.style.transform = 'translateY(-8px)';
      e.target.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.15)';
      e.target.style.borderColor = 'rgba(255, 140, 0, 0.3)';
    }}
    onMouseLeave={(e) => {
      e.target.style.transform = 'translateY(0)';
      e.target.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.08)';
      e.target.style.borderColor = 'rgba(255, 140, 0, 0.1)';
    }}
    >
      {/* Decorative Orange Accent */}
      <div style={{
        position: 'absolute',
        top: '0',
        right: '0',
        width: '100px',
        height: '4px',
        background: 'linear-gradient(90deg, #ff8c00 0%, #ffa500 100%)',
        borderRadius: '0 20px 0 20px'
      }}></div>

      {/* Header Section */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: '24px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          flex: '1'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '16px',
            background: job.logo 
              ? `url(${job.logo}) center/cover` 
              : 'linear-gradient(135deg, #ff8c00 0%, #ffa500 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '24px',
            fontWeight: 'bold',
            boxShadow: '0 4px 16px rgba(255, 140, 0, 0.3)'
          }}>
            {!job.logo && job.company.charAt(0).toUpperCase()}
          </div>
          
          <div>
            <h3 style={{
              margin: '0 0 4px 0',
              fontSize: '1.4rem',
              fontWeight: '700',
              color: '#1a1a1a',
              lineHeight: '1.3',
              letterSpacing: '-0.02em'
            }}>
              {job.title}
            </h3>
            <p style={{
              margin: '0',
              fontSize: '1.1rem',
              color: '#666',
              fontWeight: '500'
            }}>
              {job.company}
            </p>
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <span style={{
            background: 'linear-gradient(135deg, #ff8c00 0%, #ffa500 100%)',
            color: 'white',
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '0.85rem',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            boxShadow: '0 2px 8px rgba(255, 140, 0, 0.3)'
          }}>
            {job.type}
          </span>
          
          <button 
            style={{
              width: '44px',
              height: '44px',
              border: '2px solid #ff8c00',
              borderRadius: '12px',
              background: isSaved ? 'linear-gradient(135deg, #ff8c00 0%, #ffa500 100%)' : 'white',
              color: isSaved ? 'white' : '#ff8c00',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1rem',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
            }}
            onClick={() => onSave(job.id, isSaved)} 
            title={isSaved ? "Retirer des sauvegardés" : "Sauvegarder l'offre"}
            onMouseEnter={(e) => {
              if (!isSaved) {
                e.target.style.background = 'rgba(255, 140, 0, 0.1)';
              }
              e.target.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = isSaved ? 'linear-gradient(135deg, #ff8c00 0%, #ffa500 100%)' : 'white';
              e.target.style.transform = 'scale(1)';
            }}
          >
            {isSaved ? <FaBookmark /> : <FaRegBookmark />}
          </button>
        </div>
      </div>

      {/* Job Details */}
      <div style={{
        marginBottom: '24px'
      }}>
        <div style={{
          display: 'flex',
          gap: '24px',
          marginBottom: '16px',
          flexWrap: 'wrap'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#555',
            fontSize: '0.95rem',
            fontWeight: '500'
          }}>
            <FaMapMarkerAlt style={{ color: '#ff8c00' }} />
            {job.location}
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#555',
            fontSize: '0.95rem',
            fontWeight: '500'
          }}>
            <FaBriefcase style={{ color: '#ff8c00' }} />
            {job.experience}
          </div>
        </div>
        
        <p style={{
          fontSize: '1rem',
          lineHeight: '1.6',
          margin: '0 0 20px 0',
          color: '#444',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
        }}>
          {job.description}
        </p>
        
        {/* Skills Section */}
        {job.skills && job.skills.length > 0 && (
          <div style={{
            marginBottom: '20px'
          }}>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              alignItems: 'flex-start'
            }}>
              {job.skills.map((skill, index) => (
                <span 
                  key={index} 
                  style={{
                    background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                    color: '#2c3e50',
                    padding: '6px 12px',
                    borderRadius: '16px',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    border: '1px solid #dee2e6',
                    whiteSpace: 'nowrap',
                    display: 'inline-block',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'linear-gradient(135deg, #ff8c00 0%, #ffa500 100%)';
                    e.target.style.color = 'white';
                    e.target.style.borderColor = '#ff8c00';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)';
                    e.target.style.color = '#2c3e50';
                    e.target.style.borderColor = '#dee2e6';
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Footer Section */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '24px',
        borderTop: '2px solid #f8f9fa'
      }}>
        <div style={{
          fontSize: '1.3rem',
          fontWeight: '700',
          color: '#1a1a1a',
          letterSpacing: '-0.02em'
        }}>
          {job.salary}
        </div>
        
        {isApplied ? (
          <button 
            style={{
              background: 'linear-gradient(135deg, #6c757d 0%, #5a6268 100%)',
              color: 'white',
              border: 'none',
              padding: '14px 28px',
              borderRadius: '12px',
              fontSize: '0.95rem',
              fontWeight: '600',
              cursor: 'not-allowed',
              opacity: '0.8',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
            }}
            disabled
          >
            Déjà postulé
          </button>
        ) : (
          <button 
            style={{
              background: 'linear-gradient(135deg, #1a1a1a 0%, #2c2c2c 100%)',
              color: 'white',
              border: '2px solid #ff8c00',
              padding: '14px 28px',
              borderRadius: '12px',
              fontSize: '0.95rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              boxShadow: '0 4px 16px rgba(26, 26, 26, 0.2)',
              transform: 'translateY(0)',
              position: 'relative',
              overflow: 'hidden'
            }}
            onClick={handleViewDetails}
            onMouseEnter={(e) => {
              e.target.style.background = 'linear-gradient(135deg, #ff8c00 0%, #ffa500 100%)';
              e.target.style.borderColor = '#ff8c00';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 24px rgba(255, 140, 0, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'linear-gradient(135deg, #1a1a1a 0%, #2c2c2c 100%)';
              e.target.style.borderColor = '#ff8c00';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 16px rgba(26, 26, 26, 0.2)';
            }}
          >
            Postuler Maintenant
          </button>
        )}
      </div>
    </div>
  );
};

// Enhanced Pagination Component
const PaginationComponent = ({ currentPage, totalPages, onPageChange }) => {
  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      marginTop: '48px',
      padding: '32px',
      background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
      borderRadius: '24px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      border: '1px solid rgba(255, 140, 0, 0.1)'
    }}>
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '14px 20px',
          fontSize: '0.95rem',
          fontWeight: '600',
          border: '2px solid #ff8c00',
          backgroundColor: currentPage === 1 ? '#f1f3f4' : '#ffffff',
          color: currentPage === 1 ? '#9aa0a6' : '#1a1a1a',
          borderRadius: '16px',
          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: currentPage === 1 ? 'none' : '0 4px 12px rgba(255, 140, 0, 0.2)',
          transform: 'translateY(0)',
          opacity: currentPage === 1 ? 0.5 : 1
        }}
        onMouseEnter={(e) => {
          if (currentPage !== 1) {
            e.target.style.backgroundColor = '#ff8c00';
            e.target.style.color = 'white';
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 8px 20px rgba(255, 140, 0, 0.3)';
          }
        }}
        onMouseLeave={(e) => {
          if (currentPage !== 1) {
            e.target.style.backgroundColor = '#ffffff';
            e.target.style.color = '#1a1a1a';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 12px rgba(255, 140, 0, 0.2)';
          }
        }}
      >
        <FaChevronLeft size={14} />
        <span>Précédent</span>
      </button>

      {/* Page Numbers */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {getVisiblePages().map((page, index) => (
          page === '...' ? (
            <div
              key={`dots-${index}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '44px',
                height: '44px',
                color: '#9aa0a6',
                fontSize: '1rem'
              }}
            >
              <FaEllipsisH size={14} />
            </div>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              style={{
                width: '44px',
                height: '44px',
                fontSize: '0.95rem',
                fontWeight: '700',
                border: '2px solid #ff8c00',
                backgroundColor: currentPage === page 
                  ? '#ff8c00' 
                  : '#ffffff',
                color: currentPage === page ? '#ffffff' : '#1a1a1a',
                borderRadius: '14px',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: currentPage === page 
                  ? '0 6px 16px rgba(255, 140, 0, 0.4)' 
                  : '0 2px 8px rgba(0, 0, 0, 0.05)',
                transform: 'translateY(0)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                if (currentPage !== page) {
                  e.target.style.backgroundColor = '#ff8c00';
                  e.target.style.color = 'white';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 16px rgba(255, 140, 0, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (currentPage !== page) {
                  e.target.style.backgroundColor = '#ffffff';
                  e.target.style.color = '#1a1a1a';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
                }
              }}
            >
              {page}
            </button>
          )
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '14px 20px',
          fontSize: '0.95rem',
          fontWeight: '600',
          border: '2px solid #ff8c00',
          backgroundColor: currentPage === totalPages ? '#f1f3f4' : '#ffffff',
          color: currentPage === totalPages ? '#9aa0a6' : '#1a1a1a',
          borderRadius: '16px',
          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: currentPage === totalPages ? 'none' : '0 4px 12px rgba(255, 140, 0, 0.2)',
          transform: 'translateY(0)',
          opacity: currentPage === totalPages ? 0.5 : 1
        }}
        onMouseEnter={(e) => {
          if (currentPage !== totalPages) {
            e.target.style.backgroundColor = '#ff8c00';
            e.target.style.color = 'white';
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 8px 20px rgba(255, 140, 0, 0.3)';
          }
        }}
        onMouseLeave={(e) => {
          if (currentPage !== totalPages) {
            e.target.style.backgroundColor = '#ffffff';
            e.target.style.color = '#1a1a1a';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 12px rgba(255, 140, 0, 0.2)';
          }
        }}
      >
        <span>Suivant</span>
        <FaChevronRight size={14} />
      </button>
    </div>
  );
};

// Premium Saved Jobs Section
const SavedJobsSection = () => {
  return (
    <div style={{
      margin: '80px 0 60px 0',
      display: 'flex',
      justifyContent: 'center',
      padding: '0 20px'
    }}>
      <div style={{
        position: 'relative',
        background: 'linear-gradient(145deg, #1a1a1a 0%, #2c2c2c 100%)',
        borderRadius: '32px',
        padding: '48px',
        boxShadow: '0 24px 80px rgba(0, 0, 0, 0.25)',
        border: '2px solid #ff8c00',
        maxWidth: '700px',
        width: '100%',
        overflow: 'hidden',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = 'translateY(-12px)';
        e.target.style.boxShadow = '0 40px 120px rgba(0, 0, 0, 0.3)';
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = '0 24px 80px rgba(0, 0, 0, 0.25)';
      }}
      >
        {/* Animated Orange Glow */}
        <div style={{
          position: 'absolute',
          top: '-50%',
          right: '-30%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(255, 140, 0, 0.15) 0%, rgba(255, 165, 0, 0.08) 50%, transparent 100%)',
          borderRadius: '50%',
          zIndex: '0',
          animation: 'pulse 4s ease-in-out infinite'
        }}></div>
        
        <div style={{
          position: 'absolute',
          bottom: '-30%',
          left: '-20%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(255, 140, 0, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          zIndex: '0'
        }}></div>

        <div style={{ position: 'relative', zIndex: '1', textAlign: 'center' }}>
          {/* Premium Icon */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100px',
            height: '100px',
            background: 'linear-gradient(135deg, #ff8c00 0%, #ffa500 100%)',
            borderRadius: '28px',
            marginBottom: '32px',
            boxShadow: '0 16px 48px rgba(255, 140, 0, 0.4)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '0',
              left: '0',
              right: '0',
              bottom: '0',
              background: 'linear-gradient(45deg, rgba(255, 255, 255, 0.2) 0%, transparent 50%)',
              borderRadius: '28px'
            }}></div>
            <FaHeart style={{ color: 'white', fontSize: '36px', zIndex: '1' }} />
          </div>
          
          {/* Title */}
          <h2 style={{
            margin: '0 0 16px 0',
            fontSize: '2.2rem',
            fontWeight: '800',
            color: 'white',
            letterSpacing: '-0.03em',
            lineHeight: '1.1'
          }}>
            Vos Offres Favorites
          </h2>
          
          {/* Subtitle */}
          <p style={{
            margin: '0 0 40px 0',
            fontSize: '1.2rem',
            color: '#b0b0b0',
            lineHeight: '1.6',
            fontWeight: '400',
            maxWidth: '500px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            Accédez instantanément à toutes les opportunités qui vous passionnent dans votre espace personnalisé
          </p>
          
          {/* CTA Button */}
          <Link 
            to="/SavedJobOffers" 
            style={{ 
              display: 'inline-flex',
              alignItems: 'center',
              gap: '16px',
              color: '#1a1a1a',
              textDecoration: 'none',
              fontSize: '1.2rem',
              fontWeight: '700',
              padding: '20px 40px',
              background: 'linear-gradient(135deg, #ff8c00 0%, #ffa500 100%)',
              borderRadius: '20px',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 12px 32px rgba(255, 140, 0, 0.4)',
              border: 'none',
              letterSpacing: '0.02em',
              position: 'relative',
              overflow: 'hidden',
              transform: 'translateY(0)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-4px) scale(1.05)';
              e.target.style.boxShadow = '0 20px 60px rgba(255, 140, 0, 0.5)';
              e.target.style.background = 'linear-gradient(135deg, #ffa500 0%, #ff8c00 100%)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0) scale(1)';
              e.target.style.boxShadow = '0 12px 32px rgba(255, 140, 0, 0.4)';
              e.target.style.background = 'linear-gradient(135deg, #ff8c00 0%, #ffa500 100%)';
            }}
          >
            <span style={{ position: 'relative', zIndex: '1' }}>Consulter mes favoris</span>
            <FaArrowRight 
              style={{ 
                fontSize: '18px', 
                transition: 'transform 0.3s ease',
                position: 'relative',
                zIndex: '1'
              }} 
            />
          </Link>

          {/* Info Card */}
          <div style={{
            marginTop: '40px',
            padding: '24px',
            background: 'rgba(255, 140, 0, 0.1)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 140, 0, 0.2)'
          }}>
            <p style={{
              margin: '0',
              fontSize: '1rem',
              color: '#e0e0e0',
              fontWeight: '500',
              lineHeight: '1.5'
            }}>
              💡 <strong style={{color: '#ff8c00'}}>Astuce Pro :</strong> Sauvegardez les offres qui vous intéressent et créez votre collection personnelle d'opportunités pour ne jamais manquer la chance parfaite !
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};


const JobSearchAndOffers = (job, onApply, isApplied, onSave, isSaved) => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [candidateId, setCandidateId] = useState(null);
  const [selectedPoste, setSelectedPoste] = useState('');
  const [selectedLieu, setSelectedLieu] = useState('');
  const [selectedSalaire, setSelectedSalaire] = useState('');
  const [selectedDomaine, setSelectedDomaine] = useState('');
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 3;
  const [searchTerm, setSearchTerm] = useState('');
  const [candidate, setCandidate] = useState(null);
  const [savedJobs, setSavedJobs] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/je`)
    .then(response => {
        const updatedJobs = response.data.map(job => ({
          ...job,
          logo: job.logo || "https://dummyimage.com/80x80/000/fff.png&text=No+Logo"
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

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/saved-jobs`, { withCredentials: true })
    .then(response => {
        const savedJobIds = response.data.map(job => job.id);
        setSavedJobs(savedJobIds);
      })
      .catch(error => {
        console.error("Erreur lors du chargement des jobs sauvegardés:", error);
      });
  }, [candidateId]);

  const handleSavedJob = (jobId) => {
    fetch(`${process.env.REACT_APP_API_URL}/api/save-job`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ job_offer_id: jobId, candidate_id: candidateId })
    })
    .then(res => {
      if (!res.ok) throw new Error('Failed to save job');
      return res.json();
    })
    .then(data => {
      setSavedJobs(prev =>
        prev.includes(jobId) ? prev.filter(id => id !== jobId) : [...prev, jobId]
      );
    })
    .catch(error => {
      console.error('Erreur sauvegarde de l\'offre :', error);
      alert("Impossible de sauvegarder l'offre pour le moment.");
    });
  };

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/current_candidate`, { credentials: 'include' })
    .then(res => res.json())
      .then(data => {
        setCandidate(data);
        setCandidateId(data.id);

        return fetch(`${process.env.REACT_APP_API_URL}/api/getapplications`, {
          credentials: 'include'
        });
      })
      .then(res => res.json())
      .then(applications => {
        const appliedJobIds = applications.map(app => app.job_offer_id);
        setAppliedJobs(appliedJobIds);
      })
      .catch(err => console.error("Erreur candidate ou applications:", err));
  }, []);

  const handleSaveJob = (jobId, currentlySaved) => {
    if (currentlySaved) {
      handleUnsaveJob(jobId);
    } else {
      fetch(`${process.env.REACT_APP_API_URL}/api/save-job`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job_offer_id: jobId, candidate_id: candidateId })
      })
        .then(res => {
          if (!res.ok) throw new Error('Failed to save job');
          return res.json();
        })
        .then(() => {
          setSavedJobs(prev => [...prev, jobId]);
        })
        .catch(error => {
          console.error('Erreur sauvegarde de l\'offre :', error);
          alert("Impossible de sauvegarder l'offre pour le moment.");
        });
    }
  };

  const handleUnsaveJob = (jobId) => {
    fetch(`${process.env.REACT_APP_API_URL}/api/unsave-job`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ job_offer_id: jobId, candidate_id: candidateId })
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to unsave job');
        return res.json();
      })
      .then(() => {
        setSavedJobs(prev => prev.filter(id => id !== jobId));
      })
      .catch(error => {
        console.error("Erreur lors de la suppression de l'enregistrement :", error);
        alert("Impossible de retirer l'offre des sauvegardés pour le moment.");
      });
  };

  const handleSearch = () => {
    const results = jobs.filter(job =>
      (selectedPoste === '' || job.title.toLowerCase().includes(selectedPoste.toLowerCase())) &&
      (selectedLieu === '' || job.location.toLowerCase().includes(selectedLieu.toLowerCase())) &&
      (selectedSalaire === '' || job.salary.toLowerCase().includes(selectedSalaire.toLowerCase())) &&
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

  const handleApply = (jobId) => {
    fetch(`${process.env.REACT_APP_API_URL}/api/applications`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ job_offer_id: jobId, candidate_id: candidateId })
    })
      .then(response => response.json())
      .then(data => {
        alert("Votre candidature a été soumise avec succès !");
        setAppliedJobs(prev => [...prev, jobId]);
        setFilteredJobs(prev => prev.filter(job => job.id !== jobId));

        fetch(`${process.env.REACT_APP_API_URL}/api/notify-recruiter/${jobId}`, {
          method: 'POST',
          credentials: 'include'
        })
          .then(res => res.json())
          .then(response => console.log("Recruiter notified:", response))
          .catch(err => console.error("Erreur notification recruteur:", err));
      })
      .catch(error => {
        console.error('Erreur postulation :', error);
        alert("Erreur lors de la soumission de la candidature.");
      });
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  if (loading) return <p>Chargement des offres...</p>;
  if (error) return <p>Erreur de chargement des offres. Vérifiez le backend.</p>;

  return (
    <>
      <div className="job-search-box">
        <input
          type="text"
          placeholder="Rechercher une offre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <div className="job-search-form">
          <div className="form-group">
            <label>Poste</label>
            <select value={selectedPoste} onChange={(e) => setSelectedPoste(e.target.value)}>
              <option value="">Tous</option>
              {[...new Set(jobs.map(job => job.title))].map((poste, index) => (
                <option key={index} value={poste}>{poste}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Lieu</label>
            <select value={selectedLieu} onChange={(e) => setSelectedLieu(e.target.value)}>
              <option value="">Tous</option>
              {[...new Set(jobs.map(job => job.location))].map((lieu, index) => (
                <option key={index} value={lieu}>{lieu}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Salaire</label>
            <select value={selectedSalaire} onChange={(e) => setSelectedSalaire(e.target.value)}>
              <option value="">Tous</option>
              {[...new Set(jobs.map(job => job.salary))].map((salaire, index) => (
                <option key={index} value={salaire}>{salaire}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Domaine</label>
            <select value={selectedDomaine} onChange={(e) => setSelectedDomaine(e.target.value)}>
              <option value="">Tous</option>
              {[...new Set(jobs.map(job => job.type))].map((domaine, index) => (
                <option key={index} value={domaine}>{domaine}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <button 
              onClick={handleSearch}
              style={{
                background: 'linear-gradient(135deg, #fc8e20 0%, #ff7b00 100%)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '0.95rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                boxShadow: '0 3px 6px rgba(252, 142, 32, 0.3)',
                transform: 'translateY(0)',
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #ff7b00 0%, #fc8e20 100%)';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 5px 12px rgba(252, 142, 32, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #fc8e20 0%, #ff7b00 100%)';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 3px 6px rgba(252, 142, 32, 0.3)';
              }}
            >
              Rechercher
            </button>
          </div>
        </div>
      </div>

      <div className="offers-wrapper">
        {filteredJobs.length === 0 ? (
          <p className="empty-message">Aucune offre disponible pour le moment.</p>
        ) : (
          <div className="offers-grid">
            {currentJobs.map((job) => (
              <JobCard 
                key={job.id} 
                job={job} 
                onApply={handleApply} 
                isApplied={appliedJobs.includes(job.id)}
                onSave={handleSaveJob}
                isSaved={savedJobs.includes(job.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Enhanced Pagination */}
      <div style={{ 
        display: 'flex', 
        gap: '0.5rem', 
        justifyContent: 'center', 
        marginTop: '2rem',
        alignItems: 'center'
      }}>
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          style={{
            padding: '10px 16px',
            fontSize: '0.85rem',
            fontWeight: '600',
            border: '2px solid #fc8e20',
            backgroundColor: currentPage === 1 ? '#f8f9fa' : 'white',
            color: currentPage === 1 ? '#6c757d' : '#fc8e20',
            borderRadius: '8px',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            opacity: currentPage === 1 ? 0.6 : 1,
            transition: 'all 0.3s ease',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            boxShadow: currentPage === 1 ? 'none' : '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}
          onMouseEnter={(e) => {
            if (currentPage !== 1) {
              e.target.style.backgroundColor = 'rgba(252, 142, 32, 0.1)';
              e.target.style.transform = 'translateY(-1px)';
            }
          }}
          onMouseLeave={(e) => {
            if (currentPage !== 1) {
              e.target.style.backgroundColor = 'white';
              e.target.style.transform = 'translateY(0)';
            }
          }}
        >
          Précédent
        </button>

        {[...Array(totalPages)].map((_, idx) => (
          <button
            key={idx}
            onClick={() => paginate(idx + 1)}
            style={{
              padding: '10px 14px',
              fontSize: '0.85rem',
              fontWeight: '600',
              border: '2px solid #fc8e20',
              backgroundColor: currentPage === idx + 1 ? 'linear-gradient(135deg, #fc8e20 0%, #ff7b00 100%)' : 'white',
              background: currentPage === idx + 1 ? 'linear-gradient(135deg, #fc8e20 0%, #ff7b00 100%)' : 'white',
              color: currentPage === idx + 1 ? 'white' : '#fc8e20',
              borderRadius: '8px',
              cursor: 'pointer',
              minWidth: '40px',
              transition: 'all 0.3s ease',
              boxShadow: currentPage === idx + 1 ? '0 3px 6px rgba(252, 142, 32, 0.3)' : '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}
            onMouseEnter={(e) => {
              if (currentPage !== idx + 1) {
                e.target.style.backgroundColor = 'rgba(252, 142, 32, 0.1)';
                e.target.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseLeave={(e) => {
              if (currentPage !== idx + 1) {
                e.target.style.backgroundColor = 'white';
                e.target.style.transform = 'translateY(0)';
              }
            }}
          >
            {idx + 1}
          </button>
        ))}

        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{
            padding: '10px 16px',
            fontSize: '0.85rem',
            fontWeight: '600',
            border: '2px solid #fc8e20',
            backgroundColor: currentPage === totalPages ? '#f8f9fa' : 'white',
            color: currentPage === totalPages ? '#6c757d' : '#fc8e20',
            borderRadius: '8px',
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            opacity: currentPage === totalPages ? 0.6 : 1,
            transition: 'all 0.3s ease',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            boxShadow: currentPage === totalPages ? 'none' : '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}
          onMouseEnter={(e) => {
            if (currentPage !== totalPages) {
              e.target.style.backgroundColor = 'rgba(252, 142, 32, 0.1)';
              e.target.style.transform = 'translateY(-1px)';
            }
          }}
          onMouseLeave={(e) => {
            if (currentPage !== totalPages) {
              e.target.style.backgroundColor = 'white';
              e.target.style.transform = 'translateY(0)';
            }
          }}
        >
          Suivant
        </button>
      </div>

      {/* Premium Saved Jobs Section */}
      <div style={{ 
        display: 'flex',
        justifyContent: 'center',
        marginTop: '40px',
        marginBottom: '20px'
      }}>
        <div style={{
          position: 'relative',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
          borderRadius: '16px',
          padding: '24px 32px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          border: '1px solid rgba(252, 142, 32, 0.15)',
          maxWidth: '500px',
          width: '100%',
          textAlign: 'center',
          overflow: 'hidden'
        }}>
          {/* Decorative background element */}
          <div style={{
            position: 'absolute',
            top: '-50%',
            right: '-20%',
            width: '200px',
            height: '200px',
            background: 'linear-gradient(135deg, rgba(252, 142, 32, 0.08) 0%, rgba(255, 123, 0, 0.05) 100%)',
            borderRadius: '50%',
            zIndex: '0'
          }}></div>
          
          <div style={{ position: 'relative', zIndex: '1' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #fc8e20 0%, #ff7b00 100%)',
              borderRadius: '12px',
              marginBottom: '16px',
              boxShadow: '0 4px 12px rgba(252, 142, 32, 0.3)'
            }}>
              <FaBookmark style={{ color: 'white', fontSize: '20px' }} />
            </div>
            
            <h3 style={{
              margin: '0 0 8px 0',
              fontSize: '1.25rem',
              fontWeight: '700',
              color: '#2c3e50',
              letterSpacing: '-0.02em'
            }}>
              Offres Sauvegardées
            </h3>
            
            <p style={{
              margin: '0 0 24px 0',
              fontSize: '0.95rem',
              color: '#64748b',
              lineHeight: '1.5',
              fontWeight: '400'
            }}>
              Accédez rapidement à toutes vos offres d'emploi favorites
            </p>
            
            <Link 
              to="/SavedJobOffers" 
              style={{ 
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                color: 'white',
                textDecoration: 'none',
                fontSize: '1rem',
                fontWeight: '600',
                padding: '14px 28px',
                background: 'linear-gradient(135deg, #fc8e20 0%, #ff7b00 100%)',
                borderRadius: '12px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 4px 12px rgba(252, 142, 32, 0.35)',
                border: 'none',
                letterSpacing: '0.02em',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px) scale(1.02)';
                e.target.style.boxShadow = '0 8px 25px rgba(252, 142, 32, 0.4)';
                e.target.style.background = 'linear-gradient(135deg, #ff7b00 0%, #fc8e20 100%)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.boxShadow = '0 4px 12px rgba(252, 142, 32, 0.35)';
                e.target.style.background = 'linear-gradient(135deg, #fc8e20 0%, #ff7b00 100%)';
              }}
            >
              <span>Consulter mes favoris</span>
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                style={{ transition: 'transform 0.3s ease' }}
              >
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default JobSearchAndOffers;
