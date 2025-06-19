import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaMapMarkerAlt, FaBriefcase, FaBookmark, FaRegBookmark, FaClock, FaHeart, FaRegHeart, FaSearch } from 'react-icons/fa';
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
        {/* Enhanced Hero Section */}
        <div className="page-hero">
          <div className="hero-background">
            <div className="hero-pattern"></div>
            <div className="hero-gradient"></div>
          </div>
          <div className="hero-content">
            <div className="hero-icon">
              <FaBookmark />
            </div>
            <h1 className="hero-title">Mes offres sauvegardées</h1>
            <p className="hero-subtitle">
              Retrouvez et gérez toutes les offres d'emploi que vous avez mises de côté
            </p>
            <div className="hero-stats">
              <div className="stat-card">
                <div className="stat-number">{savedJobOffers.length}</div>
                <div className="stat-label">
                  Offre{savedJobOffers.length !== 1 ? 's' : ''} sauvegardée{savedJobOffers.length !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          <div className="content-wrapper">
            {savedJobOffers.length === 0 ? (
              <div className="empty-state">
                <div className="empty-illustration">
                  <div className="empty-icon">
                    <FaSearch />
                  </div>
                  <div className="empty-circle-1"></div>
                  <div className="empty-circle-2"></div>
                </div>
                <h3 className="empty-title">Aucune offre sauvegardée</h3>
                <p className="empty-description">
                  Commencez à explorer nos offres d'emploi et sauvegardez celles qui vous intéressent pour les retrouver facilement ici.
                </p>
                <Link to="/offres" className="cta-button">
                  <FaSearch className="cta-icon" />
                  Parcourir les offres
                </Link>
              </div>
            ) : (
              <>
                <div className="content-header">
                  <h2 className="section-title">Vos offres sauvegardées</h2>
                  <p className="section-subtitle">
                    Cliquez sur une offre pour postuler ou gérer vos sauvegardes
                  </p>
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
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />

      <style jsx>{`
        .saved-jobs-container {
          min-height: 100vh;
          background: #ffffff;
        }

        /* Enhanced Hero Section */
        .page-hero {
          position: relative;
          background: #ffffff;
          padding: 120px 0 80px;
          overflow: hidden;
          border-bottom: 1px solid #f0f0f0;
        }

        .hero-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          overflow: hidden;
        }

        .hero-pattern {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            radial-gradient(circle at 20% 20%, rgba(255, 107, 53, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(255, 140, 66, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 40% 60%, rgba(0, 0, 0, 0.02) 0%, transparent 50%);
        }

        .hero-gradient {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 100px;
          background: linear-gradient(to bottom, transparent, rgba(248, 249, 250, 0.3));
        }

        .hero-content {
          position: relative;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          text-align: center;
          z-index: 1;
        }

        .hero-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #ff6b35, #ff8c42);
          border-radius: 20px;
          margin-bottom: 32px;
          box-shadow: 0 10px 30px rgba(255, 107, 53, 0.2);
        }

        .hero-icon svg {
          font-size: 32px;
          color: white;
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: 800;
          color: #1a1a1a;
          margin: 0 0 20px;
          line-height: 1.1;
          letter-spacing: -0.02em;
        }

        .hero-subtitle {
          font-size: 1.25rem;
          color: #666666;
          margin: 0 0 48px;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
          line-height: 1.6;
        }

        .hero-stats {
          display: flex;
          justify-content: center;
          gap: 24px;
        }

        .stat-card {
          background: white;
          border: 2px solid #f0f0f0;
          border-radius: 16px;
          padding: 24px 32px;
          text-align: center;
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02);
        }

        .stat-card:hover {
          border-color: #ff6b35;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
        }

        .stat-number {
          font-size: 2.5rem;
          font-weight: 800;
          color: #ff6b35;
          line-height: 1;
          margin-bottom: 8px;
        }

        .stat-label {
          font-size: 0.875rem;
          color: #666666;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* Main Content */
        .main-content {
          background: #f8f9fa;
          min-height: 60vh;
          padding: 60px 0;
        }

        .content-wrapper {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .content-header {
          text-align: center;
          margin-bottom: 48px;
        }

        .section-title {
          font-size: 2rem;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 12px;
        }

        .section-subtitle {
          font-size: 1rem;
          color: #666666;
          margin: 0;
        }

        /* Enhanced Empty State */
        .empty-state {
          background: white;
          border-radius: 24px;
          padding: 80px 40px;
          text-align: center;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02);
          border: 1px solid #f0f0f0;
          position: relative;
          overflow: hidden;
          max-width: 600px;
          margin: 0 auto;
        }

        .empty-illustration {
          position: relative;
          margin-bottom: 40px;
          height: 120px;
        }

        .empty-icon {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #f8f9fa, #e9ecef);
          border-radius: 20px;
          z-index: 2;
        }

        .empty-icon svg {
          font-size: 28px;
          color: #999999;
        }

        .empty-circle-1, .empty-circle-2 {
          position: absolute;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(255, 107, 53, 0.1), rgba(255, 140, 66, 0.05));
        }

        .empty-circle-1 {
          width: 100px;
          height: 100px;
          top: 10px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 1;
        }

        .empty-circle-2 {
          width: 150px;
          height: 150px;
          top: -25px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 0;
          opacity: 0.5;
        }

        .empty-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 16px;
        }

        .empty-description {
          font-size: 1rem;
          color: #666666;
          line-height: 1.6;
          margin: 0 0 32px;
          max-width: 400px;
          margin-left: auto;
          margin-right: auto;
        }

        .cta-button {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          background: linear-gradient(135deg, #ff6b35, #ff8c42);
          color: white;
          padding: 16px 32px;
          border-radius: 12px;
          text-decoration: none;
          font-weight: 600;
          font-size: 1rem;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(255, 107, 53, 0.2);
        }

        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(255, 107, 53, 0.3);
          text-decoration: none;
          color: white;
        }

        .cta-icon {
          font-size: 0.875rem;
        }

        /* Jobs Grid */
        .jobs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
          gap: 24px;
        }

        /* Enhanced Job Cards */
        .modern-job-card {
          background: white;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02), 0 8px 16px rgba(0, 0, 0, 0.04);
          transition: all 0.3s ease;
          border: 1px solid #f0f0f0;
          position: relative;
          overflow: hidden;
        }

        .modern-job-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #ff6b35, #ff8c42);
        }

        .modern-job-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.04), 0 16px 32px rgba(0, 0, 0, 0.08);
          border-color: #e0e0e0;
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
          border: 2px solid #f8f9fa;
        }

        .job-title-section {
          flex: 1;
          min-width: 0;
        }

        .job-title {
          font-size: 1.2rem;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 6px;
          line-height: 1.3;
        }

        .company-name {
          font-size: 0.95rem;
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
          background: linear-gradient(135deg, #1a1a1a, #333333);
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
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
          color: #555555;
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
          color: #555555;
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
          background: #1a1a1a;
          color: white;
          border-color: #1a1a1a;
        }

        .job-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 20px;
          border-top: 1px solid #f0f0f0;
        }

        .salary-section {
          flex: 1;
        }

        .salary-amount {
          font-size: 1.1rem;
          font-weight: 700;
          color: #ff6b35;
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
        }

        .apply-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
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
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .jobs-grid {
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          }
        }

        @media (max-width: 768px) {
          .page-hero {
            padding: 80px 0 60px;
          }

          .hero-title {
            font-size: 2.5rem;
          }

          .hero-subtitle {
            font-size: 1.1rem;
          }

          .hero-icon {
            width: 64px;
            height: 64px;
            margin-bottom: 24px;
          }

          .hero-icon svg {
            font-size: 24px;
          }

          .stat-card {
            padding: 20px 24px;
          }

          .stat-number {
            font-size: 2rem;
          }

          .jobs-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .main-content {
            padding: 40px 0;
          }

          .empty-state {
            padding: 60px 24px;
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

        @media (max-width: 480px) {
          .hero-title {
            font-size: 2rem;
          }

          .hero-stats {
            flex-direction: column;
            align-items: center;
          }

          .stat-card {
            min-width: 200px;
          }

          .content-wrapper {
            padding: 0 16px;
          }

          .empty-state {
            margin: 0 16px;
          }
        }
      `}</style>
    </>
  );
};

export default SavedJobOffers;
