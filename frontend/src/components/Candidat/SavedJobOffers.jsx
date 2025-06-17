import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaMapMarkerAlt, FaBriefcase, FaBookmark, FaRegBookmark, FaClock, FaBuilding, FaHeart, FaRegHeart } from 'react-icons/fa';
import "../../assets/css/JobCards.css";
import Footer from '../../components/Footer';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import Navbar from "../Navbara";

const JobCard = ({ job, onApply, isApplied, onSave, isSaved }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleViewDetails = () => {
    navigate(`/offres/${job.id}`);
  };

  return (
    <div 
      className={`modern-job-card ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="job-card-header">
        <div className="company-logo-section">
          <div className="logo-container">
            <img
              src={job.logo || "https://dummyimage.com/60x60/4f46e5/ffffff.png&text=?"}
              alt="Company logo"
              className="company-logo"
            />
          </div>
          <div className="job-title-section">
            <h3 className="job-title">{job.title}</h3>
            <div className="company-info">
              <FaBuilding className="company-icon" />
              <p className="company-name">{job.company}</p>
            </div>
          </div>
        </div>
        <div className="job-badge-container">
          <span className="job-type-badge">{job.type}</span>
          <button 
            className={`save-heart-btn ${isSaved ? 'saved' : ''}`}
            onClick={() => onSave(job.id)} 
            title={isSaved ? "Retirer des sauvegardés" : "Sauvegarder l'offre"}
          >
            {isSaved ? <FaHeart /> : <FaRegHeart />}
          </button>
        </div>
      </div>

      <div className="job-card-body">
        <div className="job-meta-info">
          <div className="meta-item">
            <FaMapMarkerAlt className="meta-icon location-icon" />
            <span>{job.location}</span>
          </div>
          <div className="meta-item">
            <FaBriefcase className="meta-icon experience-icon" />
            <span>{job.experience}</span>
          </div>
          <div className="meta-item">
            <FaClock className="meta-icon time-icon" />
            <span>Il y a 2 jours</span>
          </div>
        </div>

        <p className="job-description">{job.description}</p>

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
          <strong className="salary-amount">{job.salary}</strong>
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
          logo: job.logo || "https://dummyimage.com/80x80/4f46e5/ffffff.png&text=?"
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
    if (candidateId) {
      axios.get(`${process.env.REACT_APP_API_URL}/api/saved-jobs`, { withCredentials: true })
        .then(response => {
          const savedJobIds = response.data.map(job => job.id);
          setSavedJobs(savedJobIds);
        })
        .catch(error => {
          console.error("Erreur lors du chargement des jobs sauvegardés:", error);
        });
    }
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
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Chargement de vos offres sauvegardées...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h3>Erreur de chargement</h3>
          <p>Impossible de charger vos offres sauvegardées. Veuillez réessayer plus tard.</p>
        </div>
        <Footer />
      </>
    );
  }

  const savedJobOffers = jobs.filter(job => savedJobs.includes(job.id));

  return (
    <>
      <Navbar />
      <div className="saved-offers-page">
        <div className="page-header">
          <div className="header-content">
            <h1 className="page-title">
              <FaBookmark className="title-icon" />
              Mes offres sauvegardées
            </h1>
            <p className="page-subtitle">
              Retrouvez toutes les offres d'emploi que vous avez sauvegardées
            </p>
            <div className="stats-bar">
              <span className="stat-item">
                <strong>{savedJobOffers.length}</strong> offre{savedJobOffers.length !== 1 ? 's' : ''} sauvegardée{savedJobOffers.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>

        <div className="content-container">
          {savedJobOffers.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <FaRegBookmark />
              </div>
              <h3>Aucune offre sauvegardée</h3>
              <p>Vous n'avez pas encore sauvegardé d'offres d'emploi.</p>
              <p>Explorez nos offres et sauvegardez celles qui vous intéressent !</p>
              <Link to="/offres" className="browse-offers-btn">
                Parcourir les offres
              </Link>
            </div>
          ) : (
            <div className="saved-jobs-grid">
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
    </>
  );
};

export default SavedJobOffers;
