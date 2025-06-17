import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaMapMarkerAlt, FaBriefcase, FaBookmark, FaRegBookmark, FaCalendarAlt, FaClock, FaBuilding } from 'react-icons/fa';
import "../../assets/css/JobCards.css";
import Footer from '../../components/Footer';
import { useNavigate } from 'react-router-dom';
import Navbar from "../Navbara";

// Enhanced ReadMoreText component for job descriptions
const ReadMoreText = ({ text, maxLength = 120 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!text) return <p className="job-description">Aucune description fournie</p>;
  
  if (text.length <= maxLength) return <p className="job-description">{text}</p>;
  
  return (
    <div>
      <p className="job-description">
        {isExpanded ? text : `${text.slice(0, maxLength)}...`}
      </p>
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          background: 'none',
          border: 'none',
          color: '#ff6b35',
          fontSize: '0.8rem',
          cursor: 'pointer',
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontWeight: '600'
        }}
      >
        {isExpanded ? 'Voir moins' : 'Lire la suite'}
      </button>
    </div>
  );
};

// Enhanced Job Card with improved visuals
const JobCard = ({job, onApply, isApplied, onSave, isSaved }) => {
  const navigate = useNavigate();
  const [isHovering, setIsHovering] = useState(false);

  const handleViewDetails = () => {
    navigate(`/offres/${job.id}`);
  };
  
  // Format date for better readability
  const formatDate = (dateString) => {
    if (!dateString) return "Date inconnue";
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  // Check if job is new (posted within last 3 days)
  const isNewJob = () => {
    if (!job.created_at) return false;
    const jobDate = new Date(job.created_at);
    const now = new Date();
    const diffTime = Math.abs(now - jobDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3;
  };

  return (
    <div 
      className="job-card"
      style={{
        background: 'linear-gradient(145deg, #1e1e1e, #0f0f0f)',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
        border: '1px solid #333',
        transition: 'all 0.3s ease',
        transform: isHovering ? 'translateY(-5px)' : 'translateY(0)',
        position: 'relative'
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* New badge for recent jobs */}
      {isNewJob() && (
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          background: 'linear-gradient(135deg, #ff6b35, #ff8c42)',
          padding: '4px 10px',
          borderRadius: '20px',
          fontSize: '0.7rem',
          fontWeight: 'bold',
          color: '#fff',
          textTransform: 'uppercase',
          boxShadow: '0 2px 10px rgba(255, 107, 53, 0.3)',
        }}>
          Nouveau
        </div>
      )}
      
      <div className="job-header" style={{
        display: 'flex',
        alignItems: 'center',
        padding: '20px',
        borderBottom: '1px solid rgba(255,255,255,0.05)'
      }}>
        <div className="job-logo" style={{
          width: '60px',
          height: '60px',
          borderRadius: '8px',
          overflow: 'hidden',
          marginRight: '15px',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#2a2a2a',
          border: '1px solid #444'
        }}>
          <img
            src={job.logo ? job.logo : "https://via.placeholder.com/60?text=Logo"}
            alt={job.logo ? "Logo de l'entreprise" : ""}
            style={{ objectFit: 'cover', width: '100%' }}
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/60?text=Logo";
            }}
          />
        </div>
        <div>
          <h3 style={{ 
            fontSize: '1.2rem', 
            fontWeight: '600', 
            color: '#fff',
            marginBottom: '4px'
          }}>{job.title}</h3>
          <div className="job-info" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span style={{
              display: 'flex',
              alignItems: 'center',
              color: '#aaa',
              fontSize: '0.9rem',
              gap: '4px'
            }}>
              <FaBuilding /> {job.company}
            </span>
            {job.type && (
              <span className="badge" style={{
                backgroundColor: 'rgba(255, 107, 53, 0.1)',
                color: '#ff6b35',
                padding: '4px 10px',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: '500',
              }}>
                {job.type}
              </span>
            )}
          </div>
        </div>
      </div>
      
      <div className="job-body" style={{ padding: '20px' }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '15px',
          marginBottom: '15px'
        }}>
          {job.location && (
            <p style={{
              color: '#aaa',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <FaMapMarkerAlt /> {job.location}
            </p>
          )}
          {job.experience && (
            <p style={{
              color: '#aaa',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <FaBriefcase /> {job.experience}
            </p>
          )}
          {job.created_at && (
            <p style={{
              color: '#aaa',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <FaCalendarAlt /> {formatDate(job.created_at)}
            </p>
          )}
        </div>
        
        <ReadMoreText text={job.description} maxLength={120} />
        
        {job.skills && job.skills.length > 0 && (
          <div className="skills" style={{ 
            marginTop: '15px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px'
          }}>
            {job.skills.slice(0, 3).map((skill, index) => (
              <span key={index} style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                color: '#ddd',
                padding: '3px 10px',
                borderRadius: '4px',
                fontSize: '0.75rem',
              }}>
                {skill}
              </span>
            ))}
            {job.skills.length > 3 && (
              <span style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                color: '#aaa',
                padding: '3px 10px',
                borderRadius: '4px',
                fontSize: '0.75rem',
              }}>
                +{job.skills.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
      
      <div className="job-footer" style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        padding: '15px 20px',
        backgroundColor: 'rgba(0,0,0,0.1)'
      }}>
        {job.salary && (
          <strong style={{
            color: '#68d391',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}>
            <FaClock /> {job.salary}
          </strong>
        )}
        <div style={{ display: 'flex', gap: '10px' }}>
          {isApplied ? (
            <button 
              className="applied-btn" 
              disabled
              style={{
                backgroundColor: '#444',
                color: '#aaa',
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '0.9rem',
                cursor: 'not-allowed'
              }}
            >
              Déjà postulé
            </button>
          ) : (
            <button 
              className="view-details-btn" 
              onClick={handleViewDetails}
              style={{
                backgroundColor: '#ff6b35',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontSize: '0.9rem'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#ff8c42';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#ff6b35';
              }}
            >
              Postuler
            </button>
          )}
          <button 
            className="save-btn" 
            onClick={() => onSave(job.id)} 
            title={isSaved ? "Retirer des sauvegardés" : "Sauvegarder l'offre"}
            style={{
              backgroundColor: 'transparent',
              border: '1px solid ' + (isSaved ? '#ffb347' : '#666'),
              borderRadius: '8px',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(255,255,255,0.05)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
            }}
          >
            {isSaved ? <FaBookmark color="#ffb347" /> : <FaRegBookmark color="#ccc" />}
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Component
const SavedJobOffers = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [candidateId, setCandidateId] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);

  // Fetch all jobs
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/je`)
    .then(response => {
        const updatedJobs = response.data.map(job => ({
          ...job,
          logo: job.logo || "https://dummyimage.com/80x80/000/fff.png&text=No+Logo"
        }));
        setJobs(updatedJobs);
        setLoading(false);
      })
      .catch(error => {
        console.error("Erreur lors du chargement des offres :", error);
        setError("Impossible de charger les offres d'emploi. Veuillez réessayer plus tard.");
        setLoading(false);
      });
  }, []);
  
  // Fetch candidate info and applications
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/current_candidate`, { credentials: 'include' })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch candidate data');
        return res.json();
      })
      .then(data => {
        setCandidate(data);
        setCandidateId(data.id);

        // Then get applied jobs
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
        setError("Impossible de récupérer vos informations. Veuillez vous reconnecter.");
      });
  }, []);

  // Fetch saved jobs
  useEffect(() => {
    if (!candidateId) return;
    
    axios.get(`${process.env.REACT_APP_API_URL}/api/saved-jobs`, { withCredentials: true })
      .then(response => {
        const savedJobIds = response.data.map(job => job.id);
        setSavedJobs(savedJobIds);
      })
      .catch(error => {
        console.error("Erreur lors du chargement des jobs sauvegardés:", error);
      });
  }, [candidateId]);

  // Toggle save/unsave job
  const handleSaveJob = (jobId) => {
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

  // Calculate saved job offers
  const savedJobOffers = jobs.filter(job => savedJobs.includes(job.id));

  // Loading state JSX
  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{
          minHeight: '70vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '6px solid rgba(255,255,255,0.1)',
            borderTop: '6px solid #ff6b35',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '20px'
          }}></div>
          <style>
            {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
          </style>
          <p style={{ color: '#aaa', fontSize: '1.1rem' }}>Chargement de vos offres sauvegardées...</p>
        </div>
        <Footer/>
      </>
    );
  }

  // Error state JSX
  if (error) {
    return (
      <>
        <Navbar />
        <div style={{
          minHeight: '70vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px'
        }}>
          <div style={{
            backgroundColor: 'rgba(255, 0, 0, 0.1)',
            border: '1px solid rgba(255, 0, 0, 0.3)',
            borderRadius: '8px',
            padding: '20px',
            maxWidth: '500px',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#ff6b6b', marginBottom: '10px' }}>Erreur</h3>
            <p style={{ color: '#f8f9fa' }}>{error}</p>
            <button 
              onClick={() => window.location.reload()}
              style={{
                marginTop: '20px',
                backgroundColor: '#ff6b35',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Réessayer
            </button>
          </div>
        </div>
        <Footer/>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 20px'
      }}>
        <header style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px'
        }}>
          <h2 style={{ 
            fontSize: '1.8rem',
            color: '#fff',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <FaBookmark color="#ffb347" />
            Offres sauvegardées
            <span style={{
              backgroundColor: 'rgba(255, 107, 53, 0.1)',
              color: '#ff6b35',
              borderRadius: '20px',
              fontSize: '0.9rem',
              padding: '4px 12px',
              marginLeft: '10px'
            }}>
              {savedJobOffers.length}
            </span>
          </h2>
        </header>

        {/* Empty state */}
        {savedJobOffers.length === 0 ? (
          <div style={{
            backgroundColor: 'rgba(255,255,255,0.03)',
            borderRadius: '16px',
            padding: '60px 40px',
            textAlign: 'center',
            border: '1px dashed #444',
            marginBottom: '40px'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
            }}>
              <FaBookmark size={30} color="#666" />
            </div>
            <h3 style={{
              color: '#fff',
              fontSize: '1.4rem',
              marginBottom: '10px',
            }}>
              Aucune offre sauvegardée
            </h3>
            <p style={{
              color: '#aaa',
              fontSize: '1rem',
              marginBottom: '20px',
              maxWidth: '500px',
              margin: '0 auto 20px',
            }}>
              Explorez les offres d'emploi et sauvegardez celles qui vous intéressent pour les retrouver facilement plus tard.
            </p>
            <button 
              onClick={() => window.location.href = '/offres'}
              style={{
                backgroundColor: '#ff6b35',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '1rem',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#ff8c42';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#ff6b35';
              }}
            >
              Explorer les offres
            </button>
          </div>
        ) : (
          <div className="offers-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '25px',
          }}>
            {savedJobOffers.map(job => (
              <JobCard
                key={job.id}
                job={job}
                onApply={() => {}}
                isApplied={appliedJobs.includes(job.id)}
                onSave={handleSaveJob}
                isSaved={savedJobs.includes(job.id)}
              />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default SavedJobOffers;
