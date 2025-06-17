import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaMapMarkerAlt, FaBriefcase, FaBookmark, FaRegBookmark, FaChevronLeft, FaChevronRight, FaEllipsisH, FaHeart, FaArrowRight, FaSearch, FaFilter, FaStar, FaBuilding, FaClock } from 'react-icons/fa';
import "../../assets/css/JobCards.css";
import Footer from '../../components/Footer';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";

const JobCard = ({ job, onApply, isApplied, onSave, isSaved }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/offres/${job.id}`);
  };

  return (
    <div className="job-card-enhanced">
      <div className="job-card-header">
        <div className="company-info">
          <div className="company-logo-wrapper">
            <img
              src={job.logo || "https://dummyimage.com/60x60/f8f9fa/6c757d.png&text=Logo"}
              alt="Logo entreprise"
              className="company-logo"
            />
          </div>
          <div className="job-title-info">
            <h3 className="job-title">{job.title}</h3>
            <div className="company-details">
              <span className="company-name">
                <FaBuilding className="icon-small" />
                {job.company}
              </span>
              <span className="job-type-badge">{job.type}</span>
            </div>
          </div>
        </div>
        
        <button 
          className={`save-button ${isSaved ? 'saved' : ''}`}
          onClick={() => onSave(job.id, isSaved)} 
          title={isSaved ? "Retirer des sauvegardés" : "Sauvegarder l'offre"}
        >
          {isSaved ? <FaBookmark /> : <FaRegBookmark />}
        </button>
      </div>
      
      <div className="job-card-body">
        <div className="job-meta">
          <div className="meta-item">
            <FaMapMarkerAlt className="meta-icon" />
            <span>{job.location}</span>
          </div>
          <div className="meta-item">
            <FaBriefcase className="meta-icon" />
            <span>{job.experience}</span>
          </div>
          <div className="meta-item">
            <FaClock className="meta-icon" />
            <span>Publié récemment</span>
          </div>
        </div>
        
        <p className="job-description">{job.description}</p>
        
        {job.skills && job.skills.length > 0 && (
          <div className="skills-section">
            <div className="skills-grid">
              {job.skills.slice(0, 4).map((skill, index) => (
                <span key={index} className="skill-tag">
                  {skill}
                </span>
              ))}
              {job.skills.length > 4 && (
                <span className="skill-tag more-skills">
                  +{job.skills.length - 4} plus
                </span>
              )}
            </div>
          </div>
        )}
      </div>
      
      <div className="job-card-footer">
        <div className="salary-info">
          <span className="salary-label">Salaire</span>
          <strong className="salary-amount">{job.salary}</strong>
        </div>
        
        <div className="action-buttons">
          {isApplied ? (
            <button className="applied-button" disabled>
              <FaStar className="button-icon" />
              Candidature envoyée
            </button>
          ) : (
            <button 
              className="apply-button"
              onClick={handleViewDetails}
            >
              Postuler maintenant
              <FaArrowRight className="button-icon" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

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
    <div className="pagination-wrapper">
      <button
        className={`pagination-nav ${currentPage === 1 ? 'disabled' : ''}`}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <FaChevronLeft />
        <span>Précédent</span>
      </button>

      <div className="pagination-numbers">
        {getVisiblePages().map((page, index) => (
          page === '...' ? (
            <div key={`dots-${index}`} className="pagination-dots">
              <FaEllipsisH />
            </div>
          ) : (
            <button
              key={page}
              className={`pagination-number ${currentPage === page ? 'active' : ''}`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          )
        ))}
      </div>

      <button
        className={`pagination-nav ${currentPage === totalPages ? 'disabled' : ''}`}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <span>Suivant</span>
        <FaChevronRight />
      </button>
    </div>
  );
};

const SavedJobsPromoSection = () => {
  return (
    <div className="saved-jobs-promo">
      <div className="promo-card">
        <div className="promo-icon">
          <FaHeart />
        </div>
        
        <div className="promo-content">
          <h3>Vos Offres Favorites</h3>
          <p>Retrouvez facilement toutes les opportunités qui vous intéressent dans votre espace personnalisé</p>
          
          <Link to="/SavedJobOffers" className="promo-button">
            <span>Consulter mes favoris</span>
            <FaArrowRight />
          </Link>
          
          <div className="promo-tip">
            <span className="tip-icon">💡</span>
            <p><strong>Astuce :</strong> Sauvegardez les offres qui vous intéressent pour les retrouver plus tard !</p>
          </div>
        </div>
        
        <div className="promo-decoration"></div>
      </div>
    </div>
  );
};

const JobSearchAndOffers = () => {
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
  const jobsPerPage = 6;
  const [searchTerm, setSearchTerm] = useState('');
  const [candidate, setCandidate] = useState(null);
  const [savedJobs, setSavedJobs] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

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

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Chargement des offres d'emploi...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h3>Erreur de chargement</h3>
        <p>Impossible de charger les offres pour le moment. Veuillez réessayer plus tard.</p>
      </div>
    );
  }

  return (
    <div className="job-search-page">
      {/* Search Header */}
      <div className="search-header">
        <div className="search-header-content">
          <div className="search-title-section">
            <h1>Découvrez votre prochaine opportunité</h1>
            <p>Trouvez le poste idéal parmi {jobs.length} offres d'emploi disponibles</p>
          </div>
          
          <div className="search-main">
            <div className="search-input-wrapper">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Rechercher un poste, une entreprise..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input-main"
              />
              <button 
                className="search-button"
                onClick={handleSearch}
              >
                Rechercher
              </button>
            </div>
            
            <button 
              className={`filter-toggle ${showFilters ? 'active' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <FaFilter />
              Filtres
            </button>
          </div>
          
          {showFilters && (
            <div className="filters-panel">
              <div className="filters-grid">
                <div className="filter-group">
                  <label>Poste</label>
                  <select value={selectedPoste} onChange={(e) => setSelectedPoste(e.target.value)}>
                    <option value="">Tous les postes</option>
                    {[...new Set(jobs.map(job => job.title))].map((poste, index) => (
                      <option key={index} value={poste}>{poste}</option>
                    ))}
                  </select>
                </div>
                
                <div className="filter-group">
                  <label>Localisation</label>
                  <select value={selectedLieu} onChange={(e) => setSelectedLieu(e.target.value)}>
                    <option value="">Toutes les villes</option>
                    {[...new Set(jobs.map(job => job.location))].map((lieu, index) => (
                      <option key={index} value={lieu}>{lieu}</option>
                    ))}
                  </select>
                </div>
                
                <div className="filter-group">
                  <label>Salaire</label>
                  <select value={selectedSalaire} onChange={(e) => setSelectedSalaire(e.target.value)}>
                    <option value="">Tous les salaires</option>
                    {[...new Set(jobs.map(job => job.salary))].map((salaire, index) => (
                      <option key={index} value={salaire}>{salaire}</option>
                    ))}
                  </select>
                </div>
                
                <div className="filter-group">
                  <label>Domaine</label>
                  <select value={selectedDomaine} onChange={(e) => setSelectedDomaine(e.target.value)}>
                    <option value="">Tous les domaines</option>
                    {[...new Set(jobs.map(job => job.type))].map((domaine, index) => (
                      <option key={index} value={domaine}>{domaine}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="filters-actions">
                <button 
                  className="apply-filters-button"
                  onClick={handleSearch}
                >
                  Appliquer les filtres
                </button>
                <button 
                  className="reset-filters-button"
                  onClick={() => {
                    setSelectedPoste('');
                    setSelectedLieu('');
                    setSelectedSalaire('');
                    setSelectedDomaine('');
                    setSearchTerm('');
                    setFilteredJobs(jobs);
                  }}
                >
                  Réinitialiser
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results Section */}
      <div className="results-section">
        <div className="results-header">
          <div className="results-info">
            <h2>
              {filteredJobs.length} offre{filteredJobs.length > 1 ? 's' : ''} trouvée{filteredJobs.length > 1 ? 's' : ''}
            </h2>
            <p>Page {currentPage} sur {totalPages}</p>
          </div>
        </div>

        {filteredJobs.length === 0 ? (
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <h3>Aucune offre trouvée</h3>
            <p>Essayez de modifier vos critères de recherche ou supprimez quelques filtres.</p>
            <button 
              className="reset-search-button"
              onClick={() => {
                setSearchTerm('');
                setSelectedPoste('');
                setSelectedLieu('');
                setSelectedSalaire('');
                setSelectedDomaine('');
                setFilteredJobs(jobs);
              }}
            >
              Voir toutes les offres
            </button>
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
                  onSave={handleSaveJob}
                  isSaved={savedJobs.includes(job.id)}
                />
              ))}
            </div>

            <PaginationComponent 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={paginate}
            />
          </>
        )}
      </div>

      <SavedJobsPromoSection />
    </div>
  );
};

export default JobSearchAndOffers;
