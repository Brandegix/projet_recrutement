import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaMapMarkerAlt,FaSearch, FaBriefcase, FaBookmark, FaRegBookmark, FaChevronLeft, FaChevronRight, FaEllipsisH, FaHeart, FaArrowRight } from 'react-icons/fa';
import "../../assets/css/JobCards.css";
import Footer from '../../components/Footer';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import SavedJobOffers from './SavedJobOffers';
import Navbar from "../Navbara";
const JobCard = ({ job, onApply, isApplied, onSave, isSaved }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/offres/${job.id}`);
  };

  // Debug: Log the job data to see what skills look like
  console.log('Job data:', job);
  console.log('Skills:', job.skills);

  return (
    <div className="job-card">
      <div className="job-header">
        <div className="job-logo">
          <img
            src={job.logo ? job.logo : ""}
            alt={job.logo ? "Logo de l'entreprise" : ""}
          />
          <h3>{job.title}</h3>
        </div>

        <div className="job-info">
          <p>{job.company}</p>
          <span className="badge">{job.type}</span>
        </div>
      </div>
      
      <div className="job-body">
        <p><FaMapMarkerAlt /> {job.location}</p>
        <p><FaBriefcase /> {job.experience}</p>
        <p style={{
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
        
        {/* Fixed Skills Section */}
        {job.skills && job.skills.length > 0 && (
          <div className="skills-container" style={{
              marginTop: '15px',
              marginBottom: '10px'
          }}>
            <div className="skills" style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                alignItems: 'flex-start'
            }}>
              {job.skills.map((skill, index) => (
                <span 
                  key={index} 
                  className="skill-tag"
                  style={{
                    backgroundColor: '#f0f0f0',
                    color: '#333',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    fontWeight: '500',
                    border: '1px solid #ddd',
                    whiteSpace: 'nowrap',
                    display: 'inline-block'
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* Debug: Show skills data - Remove this after debugging */}
        {(!job.skills || job.skills.length === 0) && (
          <div style={{ 
            marginTop: '15px', 
            padding: '8px', 
            backgroundColor: '#fff3cd', 
            border: '1px solid #ffeaa7',
            borderRadius: '4px',
            fontSize: '0.8rem',
            color: '#856404'
          }}>
            Debug: No skills data available for this job
            {job.skills && <div>Skills array exists but is empty: {JSON.stringify(job.skills)}</div>}
            {!job.skills && <div>Skills property does not exist</div>}
          </div>
        )}
      </div>
      
      <div className="job-footer">
        <strong>{job.salary}</strong>
        {isApplied ? (
          <button 
            style={{
              background: 'linear-gradient(135deg, #6c757d 0%, #5a6268 100%)',
              color: 'white',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: 'not-allowed',
              opacity: '0.7',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}
            disabled
          >
            Déjà postulé
          </button>
        ) : (
          <div className="button-group">
            <button 
              style={{
                background: 'linear-gradient(135deg, #fc8e20 0%, #ff7b00 100%)',
                color: 'white',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                boxShadow: '0 3px 6px rgba(252, 142, 32, 0.3)',
                transform: 'translateY(0)',
              }}
              className="view-details-btn" 
              onClick={handleViewDetails}
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
              Postuler
            </button>
          </div>
        )}
        
        <button 
          style={{
            marginLeft: '12px',
            width: '50px',
            height: '45px',
            border: '2px solid #fc8e20',
            borderRadius: '8px',
            background: isSaved ? 'linear-gradient(135deg, #fc8e20 0%, #ff7b00 100%)' : 'white',
            color: isSaved ? 'white' : '#fc8e20',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.1rem',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}
          onClick={() => onSave(job.id, isSaved)} 
          title={isSaved ? "Retirer des sauvegardés" : "Sauvegarder l'offre"}
          onMouseEnter={(e) => {
            if (!isSaved) {
              e.target.style.background = 'rgba(252, 142, 32, 0.1)';
            }
            e.target.style.transform = 'translateY(-1px)';
            e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = isSaved ? 'linear-gradient(135deg, #fc8e20 0%, #ff7b00 100%)' : 'white';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
          }}
        >
          {isSaved ? <FaBookmark /> : <FaRegBookmark />}
        </button>
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
      gap: '8px',
      marginTop: '40px',
      padding: '24px',
      background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
      borderRadius: '16px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      border: '1px solid rgba(0, 0, 0, 0.04)'
    }}>
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 16px',
          fontSize: '0.9rem',
          fontWeight: '600',
          border: 'none',
          backgroundColor: currentPage === 1 ? '#f1f3f4' : '#ffffff',
          color: currentPage === 1 ? '#9aa0a6' : '#fc8e20',
          borderRadius: '12px',
          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: currentPage === 1 ? 'none' : '0 2px 8px rgba(252, 142, 32, 0.15)',
          transform: 'translateY(0)',
          opacity: currentPage === 1 ? 0.5 : 1
        }}
        onMouseEnter={(e) => {
          if (currentPage !== 1) {
            e.target.style.backgroundColor = 'rgba(252, 142, 32, 0.08)';
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 4px 12px rgba(252, 142, 32, 0.2)';
          }
        }}
        onMouseLeave={(e) => {
          if (currentPage !== 1) {
            e.target.style.backgroundColor = '#ffffff';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 2px 8px rgba(252, 142, 32, 0.15)';
          }
        }}
      >
        <FaChevronLeft size={12} />
        <span>Précédent</span>
      </button>

      {/* Page Numbers */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        {getVisiblePages().map((page, index) => (
          page === '...' ? (
            <div
              key={`dots-${index}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                color: '#9aa0a6',
                fontSize: '1rem'
              }}
            >
              <FaEllipsisH size={12} />
            </div>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              style={{
                width: '40px',
                height: '40px',
                fontSize: '0.9rem',
                fontWeight: '600',
                border: 'none',
                backgroundColor: currentPage === page 
                  ? '#fc8e20' 
                  : '#ffffff',
                color: currentPage === page ? '#ffffff' : '#374151',
                borderRadius: '10px',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: currentPage === page 
                  ? '0 4px 12px rgba(252, 142, 32, 0.4)' 
                  : '0 2px 4px rgba(0, 0, 0, 0.05)',
                transform: 'translateY(0)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                if (currentPage !== page) {
                  e.target.style.backgroundColor = 'rgba(252, 142, 32, 0.1)';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.12)';
                }
              }}
              onMouseLeave={(e) => {
                if (currentPage !== page) {
                  e.target.style.backgroundColor = '#ffffff';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
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
          gap: '8px',
          padding: '12px 16px',
          fontSize: '0.9rem',
          fontWeight: '600',
          border: 'none',
          backgroundColor: currentPage === totalPages ? '#f1f3f4' : '#ffffff',
          color: currentPage === totalPages ? '#9aa0a6' : '#fc8e20',
          borderRadius: '12px',
          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: currentPage === totalPages ? 'none' : '0 2px 8px rgba(252, 142, 32, 0.15)',
          transform: 'translateY(0)',
          opacity: currentPage === totalPages ? 0.5 : 1
        }}
        onMouseEnter={(e) => {
          if (currentPage !== totalPages) {
            e.target.style.backgroundColor = 'rgba(252, 142, 32, 0.08)';
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 4px 12px rgba(252, 142, 32, 0.2)';
          }
        }}
        onMouseLeave={(e) => {
          if (currentPage !== totalPages) {
            e.target.style.backgroundColor = '#ffffff';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 2px 8px rgba(252, 142, 32, 0.15)';
          }
        }}
      >
        <span>Suivant</span>
        <FaChevronRight size={12} />
      </button>
    </div>
  );
};

// Enhanced Saved Jobs Section
const SavedJobsSection = () => {
  return (
    <div style={{
      margin: '60px 0 40px 0',
      display: 'flex',
      justifyContent: 'center'
    }}>
      <div style={{
        position: 'relative',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        borderRadius: '24px',
        padding: '40px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(252, 142, 32, 0.1)',
        maxWidth: '600px',
        width: '100%',
        overflow: 'hidden',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = 'translateY(-8px)';
        e.target.style.boxShadow = '0 30px 80px rgba(0, 0, 0, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.1)';
      }}
      >
        {/* Decorative Elements */}
        <div style={{
          position: 'absolute',
          top: '-30%',
          right: '-20%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(252, 142, 32, 0.08) 0%, rgba(255, 123, 0, 0.03) 70%, transparent 100%)',
          borderRadius: '50%',
          zIndex: '0'
        }}></div>
        
        <div style={{
          position: 'absolute',
          bottom: '-20%',
          left: '-15%',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(252, 142, 32, 0.05) 0%, transparent 70%)',
          borderRadius: '50%',
          zIndex: '0'
        }}></div>

        {/* Floating Elements */}
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '30px',
          width: '60px',
          height: '60px',
          background: 'linear-gradient(135deg, rgba(252, 142, 32, 0.1) 0%, rgba(255, 123, 0, 0.05) 100%)',
          borderRadius: '50%',
          zIndex: '0',
          animation: 'float 6s ease-in-out infinite'
        }}></div>

        <div style={{ position: 'relative', zIndex: '1', textAlign: 'center' }}>
          {/* Icon */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #fc8e20 0%, #ff7b00 100%)',
            borderRadius: '20px',
            marginBottom: '24px',
            boxShadow: '0 12px 32px rgba(252, 142, 32, 0.3)',
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
              borderRadius: '20px'
            }}></div>
            <FaHeart style={{ color: 'white', fontSize: '28px', zIndex: '1' }} />
          </div>
          
          {/* Title */}
          <h2 style={{
            margin: '0 0 12px 0',
            fontSize: '1.75rem',
            fontWeight: '700',
            color: '#1a202c',
            letterSpacing: '-0.025em',
            lineHeight: '1.2'
          }}>
            Vos Offres Favorites
          </h2>
          
          {/* Subtitle */}
          <p style={{
            margin: '0 0 32px 0',
            fontSize: '1.1rem',
            color: '#64748b',
            lineHeight: '1.6',
            fontWeight: '400',
            maxWidth: '400px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            Retrouvez facilement toutes les opportunités qui vous intéressent dans votre espace personnalisé
          </p>
          
          {/* CTA Button */}
          <Link 
            to="/SavedJobOffers" 
            style={{ 
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              color: 'white',
              textDecoration: 'none',
              fontSize: '1.1rem',
              fontWeight: '600',
              padding: '16px 32px',
              background: 'linear-gradient(135deg, #fc8e20 0%, #ff7b00 100%)',
              borderRadius: '16px',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 8px 25px rgba(252, 142, 32, 0.35)',
              border: 'none',
              letterSpacing: '0.01em',
              position: 'relative',
              overflow: 'hidden',
              transform: 'translateY(0)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-3px) scale(1.02)';
              e.target.style.boxShadow = '0 15px 40px rgba(252, 142, 32, 0.4)';
              e.target.style.background = 'linear-gradient(135deg, #ff7b00 0%, #fc8e20 100%)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0) scale(1)';
              e.target.style.boxShadow = '0 8px 25px rgba(252, 142, 32, 0.35)';
              e.target.style.background = 'linear-gradient(135deg, #fc8e20 0%, #ff7b00 100%)';
            }}
          >
            {/* Button shine effect */}
            <div style={{
              position: 'absolute',
              top: '0',
              left: '-100%',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
              transition: 'left 0.6s'
            }}></div>
            
            <span style={{ position: 'relative', zIndex: '1' }}>Consulter mes favoris</span>
            <FaArrowRight 
              style={{ 
                fontSize: '16px', 
                transition: 'transform 0.3s ease',
                position: 'relative',
                zIndex: '1'
              }} 
            />
          </Link>

          {/* Stats or additional info */}
          <div style={{
            marginTop: '32px',
            padding: '20px',
            background: 'rgba(252, 142, 32, 0.05)',
            borderRadius: '12px',
            border: '1px solid rgba(252, 142, 32, 0.1)'
          }}>
            <p style={{
              margin: '0',
              fontSize: '0.9rem',
              color: '#64748b',
              fontWeight: '500'
            }}>
              💡 <strong>Astuce :</strong> Sauvegardez les offres qui vous intéressent pour les retrouver plus tard et ne manquer aucune opportunité !
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const JobSearchAndOffers = () => {
  // State variables
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
  // const [candidate, setCandidate] = useState(null); // This state might be redundant, depending on usage
  const [savedJobs, setSavedJobs] = useState([]);

  // Effect to fetch all job offers on component mount
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
  }, []); // Empty dependency array means this runs once on mount

  // Effect to fetch saved jobs for the current candidate
  useEffect(() => {
    if (candidateId) { // Only fetch if candidateId is available
      axios.get(`${process.env.REACT_APP_API_URL}/api/saved-jobs`, { withCredentials: true })
        .then(response => {
          const savedJobIds = response.data.map(job => job.id);
          setSavedJobs(savedJobIds);
        })
        .catch(error => {
          console.error("Erreur lors du chargement des jobs sauvegardés:", error);
        });
    }
  }, [candidateId]); // Re-run when candidateId changes

  // Effect to get current candidate and their applications
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/current_candidate`, { credentials: 'include' })
      .then(res => {
        if (!res.ok) {
          // If not authenticated or error, handle it gracefully
          console.error("Failed to fetch current candidate. Status:", res.status);
          setCandidateId(null); // Ensure candidateId is null if not logged in
          return Promise.reject('No current candidate');
        }
        return res.json();
      })
      .then(data => {
        // setCandidate(data); // If you still need the full candidate object
        setCandidateId(data.id);

        return fetch(`${process.env.REACT_APP_API_URL}/api/getapplications`, {
          credentials: 'include'
        });
      })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch applications');
        return res.json();
      })
      .then(applications => {
        const appliedJobIds = applications.map(app => app.job_offer_id);
        setAppliedJobs(appliedJobIds);
      })
      .catch(err => {
        console.error("Erreur candidate ou applications:", err);
        // Handle cases where user is not logged in gracefully, e.g., by not fetching applied/saved jobs
      });
  }, []); // Runs once on mount

  // Handles saving a job
  const handleSaveJob = (jobId, currentlySaved) => {
    if (!candidateId) {
      alert("Veuillez vous connecter pour sauvegarder des offres.");
      return;
    }

    // Determine the API endpoint and method based on whether it's currently saved
    const url = currentlySaved ? `${process.env.REACT_APP_API_URL}/api/unsave-job` : `${process.env.REACT_APP_API_URL}/api/save-job`;
    const method = 'POST'; // Both save and unsave are POST with job_offer_id and candidate_id

    fetch(url, {
      method: method,
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ job_offer_id: jobId, candidate_id: candidateId })
    })
      .then(res => {
        if (!res.ok) throw new Error(`Failed to ${currentlySaved ? 'unsave' : 'save'} job`);
        return res.json();
      })
      .then(() => {
        setSavedJobs(prev =>
          currentlySaved ? prev.filter(id => id !== jobId) : [...prev, jobId]
        );
        alert(`Offre ${currentlySaved ? 'retirée des' : 'ajoutée aux'} favoris !`);
      })
      .catch(error => {
        console.error(`Erreur ${currentlySaved ? 'de suppression' : 'de sauvegarde'} de l'offre :`, error);
        alert(`Impossible de ${currentlySaved ? 'retirer' : 'sauvegarder'} l'offre pour le moment.`);
      });
  };

  // Handles job application
  const handleApply = (jobId) => {
    if (!candidateId) {
      alert("Veuillez vous connecter pour postuler.");
      return;
    }

    fetch(`${process.env.REACT_APP_API_URL}/api/applications`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ job_offer_id: jobId, candidate_id: candidateId })
    })
      .then(response => {
        if (!response.ok) throw new Error('Failed to apply');
        return response.json();
      })
      .then(data => {
        alert("Votre candidature a été soumise avec succès !");
        setAppliedJobs(prev => [...prev, jobId]);
        // Optionally, you might want to remove the job from filteredJobs if it cannot be applied to again
        // setFilteredJobs(prev => prev.filter(job => job.id !== jobId));

        // Notify recruiter (optional, consider if this should be a backend responsibility after application)
        fetch(`${process.env.REACT_APP_API_URL}/api/notify-recruiter/${jobId}`, {
          method: 'POST',
          credentials: 'include'
        })
          .then(res => {
            if (!res.ok) throw new Error('Failed to notify recruiter');
            return res.json();
          })
          .then(response => console.log("Recruiter notified:", response))
          .catch(err => console.error("Erreur notification recruteur:", err));
      })
      .catch(error => {
        console.error('Erreur postulation :', error);
        alert("Erreur lors de la soumission de la candidature.");
      });
  };

  // Handles filtering jobs based on search term and selected filters
  useEffect(() => {
    const results = jobs.filter(job =>
      (selectedPoste === '' || job.title.toLowerCase().includes(selectedPoste.toLowerCase())) &&
      (selectedLieu === '' || job.location.toLowerCase().includes(selectedLieu.toLowerCase())) &&
      // Check if job.salary exists before calling toLowerCase() to prevent errors
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
    setCurrentPage(1); // Reset to first page on filter/search change
  }, [searchTerm, selectedPoste, selectedLieu, selectedSalaire, selectedDomaine, jobs]); // Re-run when these dependencies change

  // This `handleSearch` function is now redundant as filtering is handled by the useEffect above.
  // You can remove the `handleSearch` button and just let the select/input changes trigger the useEffect.
  // If you want a specific "Search" button to apply filters, then remove the `searchTerm`, `selectedPoste`, etc.
  // from the useEffect dependency array and call `handleSearch` on button click.
  // For now, I'll keep the button and make the useEffect react to the button's intended behavior.
  const triggerSearch = () => {
    // This function will effectively re-trigger the useEffect by changing a state it depends on,
    // or you could directly put the filtering logic here.
    // For now, it will rely on the useEffect.
    // If you prefer explicit button click:
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


  // Pagination logic
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  // Early return for loading and error states
  if (loading) {
    return (
      <div className="results-section">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Chargement des offres...</p>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="results-section">
        <div className="error-container">
          <h2>Erreur de chargement</h2>
          <p>Impossible de charger les offres. Veuillez réessayer plus tard. Vérifiez votre connexion ou le backend.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="job-search-container">
        {/* Modern Search Section */}
        <div className="search-section">
          <div className="search-container">
            <div className="main-search">
              <div className="search-input-wrapper">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Rechercher un poste, une entreprise..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="main-search-input"
                />
              </div>
            </div>

            <div className="filters-section">
              <div className="filters-grid">
                <div className="filter-group">
                  <label className="filter-label">
                    <FaBriefcase className="filter-icon" />
                    Poste
                  </label>
                  <select
                    value={selectedPoste}
                    onChange={(e) => setSelectedPoste(e.target.value)}
                    className="filter-select"
                  >
                    <option value="">Tous les postes</option>
                    {[...new Set(jobs.map(job => job.title))].map((poste, index) => (
                      <option key={index} value={poste}>{poste}</option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label className="filter-label">
                    <FaMapMarkerAlt className="filter-icon" />
                    Lieu
                  </label>
                  <select
                    value={selectedLieu}
                    onChange={(e) => setSelectedLieu(e.target.value)}
                    className="filter-select"
                  >
                    <option value="">Toutes les villes</option>
                    {[...new Set(jobs.map(job => job.location))].map((lieu, index) => (
                      <option key={index} value={lieu}>{lieu}</option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label className="filter-label">Salaire</label>
                  <select
                    value={selectedSalaire}
                    onChange={(e) => setSelectedSalaire(e.target.value)}
                    className="filter-select"
                  >
                    <option value="">Tous les salaires</option>
                    {[...new Set(jobs.map(job => job.salary))].map((salaire, index) => (
                      <option key={index} value={salaire}>{salaire}</option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label className="filter-label">Domaine</label>
                  <select
                    value={selectedDomaine}
                    onChange={(e) => setSelectedDomaine(e.target.value)}
                    className="filter-select"
                  >
                    <option value="">Tous les domaines</option>
                    {[...new Set(jobs.map(job => job.type))].map((domaine, index) => (
                      <option key={index} value={domaine}>{domaine}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button onClick={triggerSearch} className="search-button">
                <FaSearch />
                Rechercher
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="results-section">
          {filteredJobs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <FaSearch size={48} />
              </div>
              <h3>Aucune offre trouvée</h3>
              <p>Essayez d'ajuster vos critères de recherche</p>
            </div>
          ) : (
            <>
              <div className="jobs-grid">
                {currentJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onApply={handleApply}
                    isApplied={appliedJobs.includes(job.id)}
                    onSave={() => handleSaveJob(job.id, savedJobs.includes(job.id))}
                    isSaved={savedJobs.includes(job.id)}
                  />
                ))}
              </div>

              {/* Modern Pagination */}
              {totalPages > 1 && (
                <div className="pagination-container">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`pagination-btn ${currentPage === 1 ? 'disabled' : ''}`}
                  >
                    Précédent
                  </button>

                  <div className="pagination-numbers">
                    {[...Array(totalPages)].map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => paginate(idx + 1)}
                        className={`pagination-number ${currentPage === idx + 1 ? 'active' : ''}`}
                      >
                        {idx + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`pagination-btn ${currentPage === totalPages ? 'disabled' : ''}`}
                  >
                    Suivant
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Saved Jobs CTA */}
        <div className="saved-jobs-cta">
          <div className="cta-content">
            <div className="cta-icon">
              <FaBookmark />
            </div>
            <div className="cta-text">
              <h3>Offres Sauvegardées</h3>
              <p>Accédez rapidement à toutes vos offres d'emploi favorites</p>
            </div>
            <Link to="/SavedJobOffers" className="cta-button">
              Consulter mes favoris
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>
      <Footer />

      {/* Styles (Assuming Next.js or similar handling for <style jsx>) */}
      <style jsx>{`
        .job-search-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
        }

        .page-header { /* Removed from JSX, but keeping styles here in case other components use it or for future reference */
          background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%);
          color: white;
          padding: 80px 0 60px;
          position: relative;
          overflow: hidden;
        }

        .page-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 20"><defs><radialGradient id="a" cx="50%" cy="0%" r="100%"><stop offset="0%" stop-color="white" stop-opacity="0.1"/><stop offset="100%" stop-color="white" stop-opacity="0"/></radialGradient></defs><ellipse cx="50" cy="0" rx="50" ry="20" fill="url(%23a)"/></svg>') no-repeat center top;
          background-size: 100% 200px;
        }

        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          text-align: center;
          position: relative;
          z-index: 1;
        }

        .page-title {
          font-size: 3rem;
          font-weight: 700;
          margin: 0 0 16px;
          text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .page-subtitle {
          font-size: 1.2rem;
          margin: 0 0 32px;
          opacity: 0.9;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .stats-bar {
          display: inline-flex;
          background: rgba(255,255,255,0.2);
          backdrop-filter: blur(10px);
          border-radius: 50px;
          padding: 12px 24px;
          border: 1px solid rgba(255,255,255,0.3);
        }

        .stat-item {
          font-weight: 600;
          font-size: 1rem;
        }

        .search-section {
          background: white;
          padding: 40px 0;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          position: relative;
          z-index: 10;
          margin-top: 0; /* Changed from -30px to 0 as there's no header above it */
          border-radius: 20px; /* Adjusted radius for top corners */
        }

        .search-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .main-search {
          margin-bottom: 32px;
        }

        .search-input-wrapper {
          position: relative;
          max-width: 600px;
          margin: 0 auto;
        }

        .search-icon {
          position: absolute;
          left: 20px;
          top: 50%;
          transform: translateY(-50%);
          color: #999;
          font-size: 18px;
        }

        .main-search-input {
          width: 100%;
          padding: 18px 20px 18px 50px;
          border: 2px solid #e9ecef;
          border-radius: 12px;
          font-size: 1.1rem;
          transition: all 0.3s ease;
          background: #f8f9fa;
        }

        .main-search-input:focus {
          outline: none;
          border-color: #ff6b35;
          background: white;
          box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
        }

        .filters-section {
          background: #f8f9fa;
          border-radius: 16px;
          padding: 32px;
          border: 1px solid #e9ecef;
        }

        .filters-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .filter-label {
          font-weight: 600;
          color: #333;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .filter-icon {
          color: #ff6b35;
          font-size: 0.8rem;
        }

        .filter-select {
          padding: 12px 16px;
          border: 2px solid #e9ecef;
          border-radius: 8px;
          font-size: 1rem;
          background: white;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .filter-select:focus {
          outline: none;
          border-color: #ff6b35;
          box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
        }

        .search-button {
          background: linear-gradient(135deg, #ff6b35, #ff8c42);
          color: white;
          border: none;
          padding: 16px 32px;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 0 auto;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
        }

        .search-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4);
        }

        .results-section {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
        }

        .jobs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 24px;
          margin-bottom: 40px;
        }

        .loading-container, .error-container, .empty-state {
          text-align: center;
          padding: 80px 20px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 4px solid #e9ecef;
          border-top: 4px solid #ff6b35;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 24px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .empty-icon, .error-container h2 {
          color: #999;
          margin-bottom: 24px;
        }

        .pagination-container {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
          margin-top: 40px;
        }

        .pagination-btn {
          padding: 12px 20px;
          border: 2px solid #ff6b35;
          background: white;
          color: #ff6b35;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .pagination-btn:hover:not(.disabled) {
          background: rgba(255, 107, 53, 0.1);
          transform: translateY(-1px);
        }

        .pagination-btn.disabled {
          opacity: 0.5;
          cursor: not-allowed;
          color: #999;
          border-color: #ddd;
        }

        .pagination-numbers {
          display: flex;
          gap: 4px;
        }

        .pagination-number {
          padding: 12px 16px;
          border: 2px solid #ff6b35;
          background: white;
          color: #ff6b35;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 48px;
        }

        .pagination-number.active {
          background: linear-gradient(135deg, #ff6b35, #ff8c42);
          color: white;
          box-shadow: 0 3px 6px rgba(255, 107, 53, 0.3);
        }

        .pagination-number:hover:not(.active) {
          background: rgba(255, 107, 53, 0.1);
          transform: translateY(-1px);
        }

        .saved-jobs-cta {
          background: white;
          margin: 40px auto;
          max-width: 1000px;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          border: 1px solid rgba(255, 107, 53, 0.1);
        }

        .cta-content {
          display: flex;
          align-items: center;
          padding: 32px;
          gap: 24px;
          position: relative;
          background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
        }

        .cta-content::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: linear-gradient(135deg, #ff6b35, #ff8c42);
        }

        .cta-icon {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #ff6b35, #ff8c42);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 24px;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
        }

        .cta-text {
          flex: 1;
        }

        .cta-text h3 {
          margin: 0 0 8px;
          font-size: 1.25rem;
          font-weight: 700;
          color: #333;
        }

        .cta-text p {
          margin: 0;
          color: #666;
          font-size: 1rem;
        }

        .cta-button {
          display: flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #ff6b35, #ff8c42);
          color: white;
          padding: 14px 24px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
        }

        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4);
        }

        @media (max-width: 768px) {
          .page-title {
            font-size: 2rem;
          }
          
          .filters-grid {
            grid-template-columns: 1fr;
          }
          
          .jobs-grid {
            grid-template-columns: 1fr;
          }
          
          .cta-content {
            flex-direction: column;
            text-align: center;
            gap: 20px;
          }
          
         .pagination-container {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </>
  );
};

export default JobSearchAndOffers;
