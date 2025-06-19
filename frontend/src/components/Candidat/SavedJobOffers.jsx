import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaMapMarkerAlt, FaBriefcase, FaBookmark, FaRegBookmark, FaClock, FaHeart, FaRegHeart, FaSearch, FaStar, FaBuilding } from 'react-icons/fa';
import "../../assets/css/JobCards.css"; 
import Footer from '../../components/Footer';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import Navbar from "../Navbara";

const JobCard = ({ job, onApply, isApplied, onSave, isSaved }) => {
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
      <div className="card-accent"></div>
      
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
          <div className="company-info">
            <FaBuilding className="company-icon" />
            <span className="company-name">{job.company}</span>
          </div>
          <div className="job-meta">
            <span className="job-type-badge">{job.type}</span>
          </div>
        </div>
        
        <button
          className={`save-job-btn ${isSaved ? 'saved' : ''}`}
          onClick={() => onSave(job.id)}
          title={isSaved ? "Retirer des sauvegardés" : "Sauvegarder l'offre"}
        >
          {isSaved ? <FaHeart className="saved-icon" /> : <FaRegHeart />}
        </button>
      </div>

      <div className="job-card-body">
        <div className="job-details">
          <div className="job-detail-item">
            <FaMapMarkerAlt className="detail-icon" />
            <span>{job.location}</span>
          </div>
          <div className="job-detail-item">
            <FaBriefcase className="detail-icon" />
            <span>{job.experience}</span>
          </div>
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
          <span className="salary-label">Salaire</span>
          <span className="salary-amount">{job.salary}</span>
        </div>
        <div className="action-buttons">
          {isApplied ? (
            <button className="applied-button" disabled>
              <FaStar className="button-icon" />
              Déjà postulé
            </button>
          ) : (
            <button className="apply-button" onClick={handleViewDetails}>
              <FaSearch className="button-icon" />
              Voir détails
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
    // Fetch all job offers
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
    // Fetch saved jobs for the current user
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
    // Fetch current candidate and their applications
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
    // Optimistically update UI
    setSavedJobs(prev =>
      prev.includes(jobId) ? prev.filter(id => id !== jobId) : [...prev, jobId]
    );

    fetch(`${process.env.REACT_APP_API_URL}/api/save-job`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ job_offer_id: jobId, candidate_id: candidateId })
    })
      .then(res => {
        if (!res.ok) {
          // If API call fails, revert UI change
          setSavedJobs(prev =>
            prev.includes(jobId) ? prev.filter(id => id !== jobId) : [...prev, jobId]
          );
          throw new Error('Failed to save/unsave job');
        }
        return res.json();
      })
      .then(data => {
        console.log("Job save/unsave successful:", data);
      })
      .catch(error => {
        console.error('Erreur sauvegarde de l\'offre :', error);
        alert("Impossible de sauvegarder/désauvegarder l'offre pour le moment.");
      });
  };

  // Filter jobs to only show saved ones
  const savedJobOffers = jobs.filter(job => savedJobs.includes(job.id));

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Chargement de vos offres sauvegardées...</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="saved-jobs-page">
        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-content">
            <div className="hero-badge">
              <FaBookmark className="hero-icon" />
            </div>
            <h1 className="hero-title">Mes Offres Sauvegardées</h1>
            <p className="hero-description">
              Retrouvez et gérez facilement toutes les opportunités qui vous intéressent
            </p>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">{savedJobOffers.length}</span>
                <span className="stat-label">
                  Offre{savedJobOffers.length !== 1 ? 's' : ''} sauvegardée{savedJobOffers.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>
          <div className="hero-decoration">
            <div className="decoration-circle circle-1"></div>
            <div className="decoration-circle circle-2"></div>
            <div className="decoration-circle circle-3"></div>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          <div className="content-container">
            {error ? (
              <div className="error-state">
                <div className="error-icon">⚠️</div>
                <h3>Erreur de chargement</h3>
                <p>Impossible de charger les offres. Veuillez réessayer plus tard.</p>
                <button onClick={() => window.location.reload()} className="retry-button">
                  Réessayer
                </button>
              </div>
            ) : savedJobOffers.length === 0 ? (
              <div className="empty-state">
                <div className="empty-illustration">
                  <div className="empty-icon-container">
                    <FaSearch className="empty-icon" />
                  </div>
                  <div className="empty-bg-circles">
                    <div className="bg-circle circle-1"></div>
                    <div className="bg-circle circle-2"></div>
                  </div>
                </div>
                <h3 className="empty-title">Aucune offre sauvegardée</h3>
                <p className="empty-description">
                  Découvrez nos offres d'emploi et sauvegardez celles qui vous intéressent pour les retrouver ici facilement.
                </p>
                <Link to="/offres" className="explore-button">
                  <FaSearch className="button-icon" />
                  Explorer les offres
                </Link>
              </div>
            ) : (
              <>
                <div className="content-header">
                  <div className="header-info">
                    <h2 className="section-title">Vos offres favorites</h2>
                    <p className="section-description">
                      Gérez vos opportunités sauvegardées et postulez en un clic
                    </p>
                  </div>
                  <div className="header-actions">
                    <span className="results-count">
                      {savedJobOffers.length} offre{savedJobOffers.length !== 1 ? 's' : ''}
                    </span>
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
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />

      <style jsx>{`
        /* Global Styles */
        .saved-jobs-page {
          min-height: 100vh;
          background: #ffffff;
        }

        /* Loading State */
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          gap: 24px;
        }

        .loading-spinner {
          width: 48px;
          height: 48px;
          border: 4px solid #f3f4f6;
          border-top: 4px solid #ff6b35;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Hero Section */
        .hero-section {
          position: relative;
          background: linear-gradient(135deg, #ffffff 0%, #fafafa 100%);
          padding: 120px 0 80px;
          overflow: hidden;
        }

        .hero-content {
          position: relative;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          text-align: center;
          z-index: 2;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #ff6b35, #ff8c42);
          border-radius: 24px;
          margin-bottom: 32px;
          box-shadow: 0 12px 32px rgba(255, 107, 53, 0.25);
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }

        .hero-icon {
          font-size: 32px;
          color: white;
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: 800;
          color: #1a1a1a;
          margin: 0 0 24px;
          line-height: 1.1;
          letter-spacing: -0.02em;
        }

        .hero-description {
          font-size: 1.3rem;
          color: #6b7280;
          margin: 0 0 48px;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
          line-height: 1.6;
        }

        .hero-stats {
          display: flex;
          justify-content: center;
        }

        .stat-item {
          background: white;
          border: 2px solid #f1f5f9;
          border-radius: 20px;
          padding: 32px 48px;
          text-align: center;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }

        .stat-item:hover {
          transform: translateY(-4px);
          border-color: #ff6b35;
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
        }

        .stat-number {
          display: block;
          font-size: 3rem;
          font-weight: 800;
          color: #ff6b35;
          line-height: 1;
          margin-bottom: 8px;
        }

        .stat-label {
          font-size: 0.9rem;
          color: #6b7280;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .hero-decoration {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          z-index: 1;
        }

        .decoration-circle {
          position: absolute;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(255, 107, 53, 0.05), rgba(255, 140, 66, 0.05));
        }

        .circle-1 {
          width: 200px;
          height: 200px;
          top: 10%;
          left: 10%;
          animation: float 4s ease-in-out infinite;
        }

        .circle-2 {
          width: 150px;
          height: 150px;
          top: 20%;
          right: 15%;
          animation: float 5s ease-in-out infinite reverse;
        }

        .circle-3 {
          width: 100px;
          height: 100px;
          bottom: 20%;
          left: 20%;
          animation: float 3.5s ease-in-out infinite;
        }

        /* Main Content */
        .main-content {
          background: #f8fafc;
          min-height: 60vh;
          padding: 80px 0;
        }

        .content-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .content-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 48px;
          flex-wrap: wrap;
          gap: 24px;
        }

        .header-info h2 {
          font-size: 2.25rem;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 8px;
        }

        .section-description {
          font-size: 1.1rem;
          color: #6b7280;
          margin: 0;
        }

        .results-count {
          background: #1a1a1a;
          color: white;
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 0.9rem;
        }

        /* Error State */
        .error-state {
          text-align: center;
          padding: 80px 24px;
          background: white;
          border-radius: 24px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          max-width: 500px;
          margin: 0 auto;
        }

        .error-icon {
          font-size: 4rem;
          margin-bottom: 24px;
        }

        .error-state h3 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 16px;
        }

        .error-state p {
          color: #6b7280;
          margin: 0 0 32px;
        }

        .retry-button {
          background: #ff6b35;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .retry-button:hover {
          background: #ff8c42;
          transform: translateY(-2px);
        }

        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 80px 40px;
          background: white;
          border-radius: 24px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          position: relative;
          overflow: hidden;
          max-width: 600px;
          margin: 0 auto;
        }

        .empty-illustration {
          position: relative;
          margin-bottom: 48px;
          height: 140px;
        }

        .empty-icon-container {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 90px;
          height: 90px;
          background: linear-gradient(135deg, #f8fafc, #e2e8f0);
          border-radius: 24px;
          z-index: 2;
        }

        .empty-icon {
          font-size: 32px;
          color: #94a3b8;
        }

        .empty-bg-circles {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
        }

        .bg-circle {
          position: absolute;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(255, 107, 53, 0.08), rgba(255, 140, 66, 0.04));
        }

        .bg-circle.circle-1 {
          width: 120px;
          height: 120px;
          top: -15px;
          left: -60px;
          z-index: 1;
        }

        .bg-circle.circle-2 {
          width: 180px;
          height: 180px;
          top: -40px;
          left: -90px;
          z-index: 0;
          opacity: 0.6;
        }

        .empty-title {
          font-size: 2rem;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 20px;
        }

        .empty-description {
          font-size: 1.1rem;
          color: #6b7280;
          line-height: 1.6;
          margin: 0 0 40px;
          max-width: 450px;
          margin-left: auto;
          margin-right: auto;
        }

        .explore-button {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          background: linear-gradient(135deg, #ff6b35, #ff8c42);
          color: white;
          padding: 16px 32px;
          border-radius: 16px;
          text-decoration: none;
          font-weight: 600;
          font-size: 1.1rem;
          transition: all 0.3s ease;
          box-shadow: 0 8px 24px rgba(255, 107, 53, 0.25);
        }

        .explore-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(255, 107, 53, 0.35);
          text-decoration: none;
          color: white;
        }

        .button-icon {
          font-size: 1rem;
        }

        /* Jobs Grid */
        .jobs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 32px;
          justify-items: center;
        }

        /* Enhanced Job Cards */
        .enhanced-job-card {
          background: white;
          border-radius: 20px;
          padding: 32px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.03), 0 12px 24px rgba(0, 0, 0, 0.06);
          transition: all 0.4s ease;
          border: 1px solid #f1f5f9;
          position: relative;
          overflow: hidden;
          width: 100%;
          max-width: 450px;
        }

        .card-accent {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #ff6b35, #ff8c42);
        }

        .enhanced-job-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 8px 12px rgba(0, 0, 0, 0.06), 0 20px 40px rgba(0, 0, 0, 0.12);
          border-color: #e2e8f0;
        }

        .job-card-header {
          display: flex;
          align-items: flex-start;
          gap: 20px;
          margin-bottom: 24px;
          position: relative;
        }

        .company-logo {
          flex-shrink: 0;
        }

        .company-logo img {
          width: 64px;
          height: 64px;
          border-radius: 16px;
          object-fit: cover;
          border: 3px solid #f8fafc;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .job-title-section {
          flex: 1;
          min-width: 0;
        }

        .job-title {
          font-size: 1.3rem;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 12px;
          line-height: 1.3;
        }

        .company-info {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
        }

        .company-icon {
          font-size: 0.8rem;
          color: #94a3b8;
        }

        .company-name {
          font-size: 1rem;
          color: #6b7280;
          font-weight: 500;
        }

        .job-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .job-type-badge {
          background: linear-gradient(135deg, #1a1a1a, #374151);
          color: white;
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .save-job-btn {
          position: absolute;
          top: 0;
          right: 0;
          background: #f8fafc;
          border: 2px solid #e2e8f0;
          padding: 12px;
          cursor: pointer;
          color: #94a3b8;
          transition: all 0.3s ease;
          border-radius: 12px;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .save-job-btn:hover {
          background: #fff5f0;
          border-color: #ff6b35;
          color: #ff6b35;
          transform: scale(1.05);
        }

        .save-job-btn.saved {
          background: #fff5f0;
          border-color: #ff6b35;
        }

        .saved-icon {
          color: #ff6b35;
        }

        .job-card-body {
          margin-bottom: 28px;
        }

        .job-details {
          display: flex;
          gap: 24px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .job-detail-item {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #6b7280;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .detail-icon {
          color: #94a3b8;
          font-size: 0.8rem;
        }

        .job-description-container {
          margin-bottom: 20px;
        }

        .job-description {
          color: #4b5563;
          font-size: 0.95rem;
          line-height: 1.7;
          margin: 0 0 12px;
        }

        .read-more-btn {
          background: none;
          border: none;
          color: #ff6b35;
          font-size: 0.9rem;
          cursor: pointer;
          font-weight: 600;
          padding: 0;
          transition: color 0.3s ease;
        }

        .read-more-btn:hover {
          color: #ff8c42;
        }

        .skills-container {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .skill-tag {
          background: #f8fafc;
          color: #4b5563;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 500;
          transition: all 0.3s ease;
          border: 1px solid #e2e8f0;
        }

        .skill-tag:hover {
          background: #fff5f0;
          border-color: #ff6b35;
          transform: translateY(-2px);
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
          padding-top: 24px;
          border-top: 2px solid #f1f5f
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
            grid-template-columns: 1fr; /* On smaller screens, stack cards vertically */
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
