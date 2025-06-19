import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaMapMarkerAlt, FaBriefcase, FaBookmark, FaRegBookmark, FaClock, FaHeart, FaRegHeart, FaSearch, FaFilter } from 'react-icons/fa';
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
    <div className="enhanced-job-card">
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

  const savedJobOffers = jobs.filter(job => savedJobs.includes(job.id));

  return (
    <>
      <Navbar />
      <div className="saved-jobs-container">
        <div className="page-header">
          <div className="header-content">
            <div className="breadcrumb">
              <Link to="/" className="breadcrumb-link">Accueil</Link>
              <span className="breadcrumb-separator">•</span>
              <span className="breadcrumb-current">Mes offres sauvegardées</span>
            </div>
            <h1 className="page-title">
              <FaBookmark className="title-icon" />
              Mes offres sauvegardées
            </h1>
            <p className="page-subtitle">
              Retrouvez toutes les offres d'emploi que vous avez sauvegardées pour les consulter plus tard
            </p>
            <div className="stats-section">
              <div className="stat-card">
                <div className="stat-number">{savedJobOffers.length}</div>
                <div className="stat-label">
                  Offre{savedJobOffers.length !== 1 ? 's' : ''} sauvegardée{savedJobOffers.length !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="saved-jobs-content">
          {savedJobOffers.length === 0 ? (
            <div className="empty-state">
              <div className="empty-illustration">
                <FaBookmark size={64} />
              </div>
              <h3>Aucune offre sauvegardée</h3>
              <p>Vous n'avez pas encore sauvegardé d'offres d'emploi. Commencez à explorer les opportunités disponibles.</p>
              <Link to="/offres" className="browse-jobs-btn">
                <FaSearch className="btn-icon" />
                Parcourir les offres
              </Link>
            </div>
          ) : (
            <div className="jobs-section">
              <div className="section-header">
                <h2 className="section-title">Vos offres sauvegardées</h2>
                <div className="view-options">
                  <span className="jobs-count">{savedJobOffers.length} résultat{savedJobOffers.length !== 1 ? 's' : ''}</span>
                </div>
              </div>
              
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
            </div>
          )}
        </div>
      </div>
      <Footer />

      <style jsx>{`
        .saved-jobs-container {
          min-height: 100vh;
          background: #fafbfc;
        }

        .page-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          position: relative;
          overflow: hidden;
          padding: 100px 0 80px;
        }

        .page-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%);
          backdrop-filter: blur(10px);
        }

        .page-header::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          right: 0;
          height: 60px;
          background: #fafbfc;
          clip-path: ellipse(100% 100% at 50% 100%);
        }

        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          position: relative;
          z-index: 2;
          text-align: center;
        }

        .breadcrumb {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 24px;
          font-size: 0.875rem;
        }

        .breadcrumb-link {
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .breadcrumb-link:hover {
          color: white;
        }

        .breadcrumb-separator {
          color: rgba(255, 255, 255, 0.6);
        }

        .breadcrumb-current {
          color: white;
          font-weight: 500;
        }

        .page-title {
          font-size: 2.75rem;
          font-weight: 700;
          margin: 0 0 16px;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .title-icon {
          font-size: 2.25rem;
          opacity: 0.9;
        }

        .page-subtitle {
          font-size: 1.125rem;
          margin: 0 0 40px;
          color: rgba(255, 255, 255, 0.9);
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
          line-height: 1.6;
        }

        .stats-section {
          display: flex;
          justify-content: center;
          gap: 24px;
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 16px;
          padding: 24px 32px;
          min-width: 140px;
          text-align: center;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: 700;
          color: white;
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 500;
        }

        .saved-jobs-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 60px 24px 80px;
        }

        .jobs-section {
          margin-top: 0;
        }

        .section-header {
          display: flex;
          justify-content: between;
          align-items: center;
          margin-bottom: 32px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .section-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1a202c;
          margin: 0;
          flex: 1;
        }

        .view-options {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .jobs-count {
          color: #64748b;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .jobs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
          gap: 24px;
        }

        .enhanced-job-card {
          background: white;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
          transition: all 0.3s ease;
          border: 1px solid #e2e8f0;
          position: relative;
          overflow: hidden;
        }

        .enhanced-job-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          border-color: #cbd5e0;
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
          width: 56px;
          height: 56px;
          border-radius: 12px;
          object-fit: cover;
          border: 2px solid #f7fafc;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .job-title-section {
          flex: 1;
          min-width: 0;
        }

        .job-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1a202c;
          margin: 0 0 6px;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .company-name {
          font-size: 0.95rem;
          color: #64748b;
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
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          padding: 4px 12px;
          border-radius: 16px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: capitalize;
          letter-spacing: 0.025em;
        }

        .save-job-btn {
          position: absolute;
          top: -4px;
          right: -4px;
          background: white;
          border: 1px solid #e2e8f0;
          padding: 8px;
          cursor: pointer;
          color: #64748b;
          transition: all 0.2s ease;
          border-radius: 50%;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .save-job-btn:hover {
          background: #f7fafc;
          color: #e53e3e;
          transform: scale(1.05);
          border-color: #e53e3e;
        }

        .saved-icon {
          color: #e53e3e;
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
          color: #64748b;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .detail-icon {
          color: #94a3b8;
          font-size: 0.75rem;
        }

        .job-description-container {
          margin-bottom: 16px;
        }

        .job-description {
          color: #4a5568;
          font-size: 0.875rem;
          line-height: 1.6;
          margin: 0 0 8px;
        }

        .read-more-btn {
          background: none;
          border: none;
          color: #667eea;
          font-size: 0.875rem;
          cursor: pointer;
          font-weight: 600;
          padding: 0;
          transition: color 0.2s ease;
        }

        .read-more-btn:hover {
          color: #764ba2;
        }

        .skills-container {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .skill-tag {
          background: #f7fafc;
          color: #4a5568;
          padding: 6px 12px;
          border-radius: 16px;
          font-size: 0.75rem;
          font-weight: 500;
          transition: all 0.2s ease;
          border: 1px solid #e2e8f0;
        }

        .skill-tag:hover {
          background: #edf2f7;
          transform: translateY(-1px);
          border-color: #cbd5e0;
        }

        .more-skills {
          background: #667eea;
          color: white;
          border-color: #667eea;
        }

        .job-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 20px;
          border-top: 1px solid #e2e8f0;
        }

        .salary-section {
          flex: 1;
        }

        .salary-amount {
          font-size: 1.125rem;
          font-weight: 700;
          color: #1a202c;
          background: linear-gradient(135deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .action-buttons {
          display: flex;
          gap: 12px;
        }

        .apply-button {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: capitalize;
          letter-spacing: 0.025em;
        }

        .apply-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        }

        .applied-button {
          background: #48bb78;
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.875rem;
          cursor: not-allowed;
          opacity: 0.9;
          text-transform: capitalize;
          letter-spacing: 0.025em;
        }

        .empty-state {
          text-align: center;
          padding: 80px 20px;
          background: white;
          border-radius: 20px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          border: 1px solid #e2e8f0;
        }

        .empty-illustration {
          color: #cbd5e0;
          margin-bottom: 32px;
        }

        .empty-state h3 {
          font-size: 1.5rem;
          color: #1a202c;
          margin: 0 0 12px;
          font-weight: 700;
        }

        .empty-state p {
          color: #64748b;
          font-size: 1rem;
          margin: 0 0 32px;
          line-height: 1.6;
          max-width: 400px;
          margin-left: auto;
          margin-right: auto;
        }

        .browse-jobs-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          padding: 14px 28px;
          border-radius: 10px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
          text-transform: capitalize;
          letter-spacing: 0.025em;
        }

        .browse-jobs-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        }

        .btn-icon {
          font-size: 0.875rem;
        }

        @media (max-width: 1024px) {
          .jobs-grid {
            grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          }
        }

        @media (max-width: 768px) {
          .page-header {
            padding: 80px 0 60px;
          }

          .header-content {
            padding: 0 20px;
          }
          
          .page-title {
            font-size: 2rem;
            flex-direction: column;
            gap: 12px;
          }

          .title-icon {
            font-size: 1.75rem;
          }
          
          .stats-section {
            flex-direction: column;
            align-items: center;
          }

          .stat-card {
            min-width: 200px;
          }
          
          .saved-jobs-content {
            padding: 40px 20px 60px;
          }

          .section-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
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

          .breadcrumb {
            flex-wrap: wrap;
          }
        }

        @media (max-width: 480px) {
          .page-title {
            font-size: 1.75rem;
          }

          .enhanced-job-card {
            padding: 20px;
          }

          .company-logo img {
            width: 48px;
            height: 48px;
          }

          .job-title {
            font-size: 1.125rem;
          }

          .empty-state {
            padding: 60px 20px;
          }

          .empty-illustration {
            margin-bottom: 24px;
          }
        }
      `}</style>
    </>
  );
};

export default SavedJobOffers;
