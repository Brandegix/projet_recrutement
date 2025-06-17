import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaMapMarkerAlt, FaBriefcase, FaBookmark, FaRegBookmark, FaClock, FaHeart, FaRegHeart } from 'react-icons/fa';
import "../../assets/css/JobCards.css";
import Footer from '../../components/Footer';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import Navbar from "../Navbara";

const JobCard = ({job, onApply, isApplied, onSave, isSaved }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/offres/${job.id}`);
  };

  const ReadMoreText = ({ text, maxLength = 120 }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    
    if (!text) return <p className="job-description">Aucune description fournie</p>;
    
    if (text.length <= maxLength) return <p className="job-description">{text}</p>;
    
    return (
      <div className="job-description-container">
        <p className="job-description">
          {isExpanded ? text : `${text.slice(0, maxLength)}...`}
        </p>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="read-more-btn"
        >
          {isExpanded ? 'Voir moins' : 'Lire la suite'}
        </button>
      </div>
    );
  };

  return (
    <div className="modern-job-card">
      <div className="job-card-header">
        <div className="company-logo">
          <img
            src={job.logo || "https://via.placeholder.com/60x60/f8f9fa/6c757d?text=Logo"}
            alt="Company Logo"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/60x60/f8f9fa/6c757d?text=Logo";
            }}
          />
        </div>
        <div className="job-title-section">
          <h3 className="job-title">{job.title}</h3>
          <p className="company-name">{job.company}</p>
          <div className="job-meta">
            <span className="job-type-badge">{job.type}</span>
            <span className="job-posted"><FaClock size={12} /> Il y a 2 jours</span>
          </div>
        </div>
        <button 
          className="save-job-btn"
          onClick={() => onSave(job.id)} 
          title={isSaved ? "Retirer des sauvegardés" : "Sauvegarder l'offre"}
        >
          {isSaved ? <FaHeart className="saved-icon" /> : <FaRegHeart />}
        </button>
      </div>

      <div className="job-card-body">
        <div className="job-details">
          <span className="job-detail-item">
            <FaMapMarkerAlt className="detail-icon" />
            {job.location}
          </span>
          <span className="job-detail-item">
            <FaBriefcase className="detail-icon" />
            {job.experience}
          </span>
        </div>
        
        <ReadMoreText text={job.description} maxLength={120} />
        
        {job.skills && job.skills.length > 0 && (
          <div className="skills-container">
            {job.skills.slice(0, 4).map((skill, index) => (
              <span key={index} className="skill-tag">{skill}</span>
            ))}
            {job.skills.length > 4 && (
              <span className="skill-tag more-skills">+{job.skills.length - 4}</span>
            )}
          </div>
        )}
      </div>

      <div className="job-card-footer">
        <div className="salary-section">
          <span className="salary-amount">{job.salary}</span>
        </div>
        <div className="action-buttons">
          {isApplied ? (
            <button className="applied-button" disabled>
              ✓ Déjà postulé
            </button>
          ) : (
            <button className="apply-button" onClick={handleViewDetails}>
              Postuler maintenant
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const SavedJobOffers = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [candidateId, setCandidateId] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [candidate, setCandidate] = useState(null);
  const [savedJobs, setSavedJobs] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/je`)
    .then(response => {
        const updatedJobs = response.data.map(job => ({
          ...job,
          logo: job.logo || "https://via.placeholder.com/60x60/f8f9fa/6c757d?text=Logo"
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

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="saved-jobs-container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Chargement de vos offres sauvegardées...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="saved-jobs-container">
          <div className="error-container">
            <h2>Erreur de chargement</h2>
            <p>Impossible de charger vos offres sauvegardées. Veuillez réessayer plus tard.</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const savedJobOffers = jobs.filter(job => savedJobs.includes(job.id));

  return (
    <>
      <Navbar />
      <div className="saved-jobs-container">
        <div className="page-header">
          <div className="header-content">
            <h1 className="page-title">Mes offres sauvegardées</h1>
            <p className="page-subtitle">
              Retrouvez toutes les offres d'emploi que vous avez sauvegardées
            </p>
            <div className="stats-bar">
              <span className="stat-item">
                {savedJobOffers.length} offre{savedJobOffers.length !== 1 ? 's' : ''} sauvegardée{savedJobOffers.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>

        <div className="saved-jobs-content">
          {savedJobOffers.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <FaBookmark size={48} />
              </div>
              <h3>Aucune offre sauvegardée</h3>
              <p>Vous n'avez pas encore sauvegardé d'offres d'emploi.</p>
              <Link to="/offres" className="browse-jobs-btn">
                Parcourir les offres
              </Link>
            </div>
          ) : (
            <div className="jobs-grid">
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
      </div>
      <Footer />

      <style jsx>{`
        .saved-jobs-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
          padding: 0;
        }

        .page-header {
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

        .saved-jobs-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
        }

        .jobs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 24px;
          margin-top: 20px;
        }

        .modern-job-card {
          background: white;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 10px 20px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          border: 1px solid rgba(0,0,0,0.05);
          position: relative;
          overflow: hidden;
        }

        .modern-job-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #ff6b35, #ff8c42);
        }

        .modern-job-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .job-card-header {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 20px;
          position: relative;
        }

        .company-logo {
          flex-shrink: 0;
        }

        .company-logo img {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          object-fit: cover;
          border: 2px solid #f8f9fa;
        }

        .job-title-section {
          flex: 1;
          min-width: 0;
        }

        .job-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 8px;
          line-height: 1.3;
        }

        .company-name {
          font-size: 1rem;
          color: #666666;
          margin: 0 0 12px;
          font-weight: 500;
        }

        .job-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .job-type-badge {
          background: linear-gradient(135deg, #ff6b35, #ff8c42);
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .job-posted {
          color: #999999;
          font-size: 0.875rem;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .save-job-btn {
          position: absolute;
          top: 0;
          right: 0;
          background: none;
          border: none;
          padding: 8px;
          cursor: pointer;
          color: #999999;
          transition: all 0.2s ease;
          border-radius: 50%;
        }

        .save-job-btn:hover {
          background: #f8f9fa;
          color: #ff6b35;
          transform: scale(1.1);
        }

        .saved-icon {
          color: #ff6b35;
        }

        .job-card-body {
          margin-bottom: 24px;
        }

        .job-details {
          display: flex;
          gap: 20px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }

        .job-detail-item {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #666666;
          font-size: 0.875rem;
        }

        .detail-icon {
          color: #999999;
          font-size: 0.75rem;
        }

        .job-description-container {
          margin-bottom: 16px;
        }

        .job-description {
          color: #333333;
          font-size: 0.875rem;
          line-height: 1.6;
          margin: 0 0 8px;
        }

        .read-more-btn {
          background: none;
          border: none;
          color: #ff6b35;
          font-size: 0.875rem;
          cursor: pointer;
          font-weight: 600;
          padding: 0;
          transition: color 0.2s ease;
        }

        .read-more-btn:hover {
          color: #ff8c42;
        }

        .skills-container {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .skill-tag {
          background: #f8f9fa;
          color: #333333;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 500;
          transition: all 0.2s ease;
          border: 1px solid #e9ecef;
        }

        .skill-tag:hover {
          background: #e9ecef;
          transform: translateY(-1px);
          border-color: #ff6b35;
        }

        .more-skills {
          background: #ff6b35;
          color: white;
          border-color: #ff6b35;
        }

        .job-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 20px;
          border-top: 1px solid #e9ecef;
        }

        .salary-section {
          flex: 1;
        }

        .salary-amount {
          font-size: 1.125rem;
          font-weight: 700;
          color: #1a1a1a;
          background: linear-gradient(135deg, #ff6b35, #ff8c42);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .action-buttons {
          display: flex;
          gap: 12px;
        }

        .apply-button {
          background: linear-gradient(135deg, #ff6b35, #ff8c42);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .apply-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(255, 107, 53, 0.4);
        }

        .applied-button {
          background: #28a745;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.875rem;
          cursor: not-allowed;
          opacity: 0.8;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .empty-state {
          text-align: center;
          padding: 80px 20px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        .empty-icon {
          color: #999999;
          margin-bottom: 24px;
        }

        .empty-state h3 {
          font-size: 1.5rem;
          color: #1a1a1a;
          margin: 0 0 12px;
          font-weight: 700;
        }

        .empty-state p {
          color: #666666;
          font-size: 1rem;
          margin: 0 0 32px;
        }

        .browse-jobs-btn {
          display: inline-block;
          background: linear-gradient(135deg, #ff6b35, #ff8c42);
          color: white;
          padding: 14px 28px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .browse-jobs-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(255, 107, 53, 0.4);
        }

        .loading-container, .error-container {
          text-align: center;
          padding: 100px 20px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          margin: 40px auto;
          max-width: 600px;
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

        .error-container h2 {
          color: #dc3545;
          font-size: 1.5rem;
          margin: 0 0 12px;
        }

        .error-container p {
          color: #666666;
          font-size: 1rem;
        }

        @media (max-width: 768px) {
          .page-title {
            font-size: 2rem;
          }
          
          .jobs-grid {
            grid-template-columns: 1fr;
          }
          
          .job-details {
            flex-direction: column;
            gap: 12px;
          }
          
          .job-card-footer {
            flex-direction: column;
            gap: 16px;
            align-items: stretch;
          }
          
          .apply-button, .applied-button {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </>
  );
};

export default SavedJobOffers;
