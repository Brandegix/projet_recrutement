import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Search,
  MapPin,
  Briefcase,
  Bookmark,
  BookmarkCheck,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Heart,
  ArrowRight,
  Filter,
  SlidersHorizontal,
  Building2,
  DollarSign,
  Clock,
  Eye,
  Star,
  X,
  Menu,
  Loader2 // Import Loader2 for the spinning animation
} from 'lucide-react';
import axios from 'axios';

// Enhanced Job Card Component
const JobCard = ({ job, onApply, isApplied, onSave, isSaved, isSaving }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleViewDetails = () => {
    // Replace with your navigation logic
    window.location.href = `/offres/${job.id}`;
  };

  return (
    <div
      className={`job-card ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card Header */}
      <div className="job-card-header">
        <div className="company-info">
          <div className="company-logo">
            <img
              src={job.logo || "/api/placeholder/60/60"}
              alt={`${job.company} logo`}
              onError={(e) => {
                e.target.src = "/api/placeholder/60/60";
              }}
            />
          </div>
          <div className="job-title-info">
            <h3 className="job-title">{job.title}</h3>
            <p className="company-name">{job.company}</p>
          </div>
        </div>
        <div className="job-type-badge">
          <span className={`badge ${job.type?.toLowerCase()}`}>{job.type}</span>
        </div>
      </div>

      {/* Card Body */}
      <div className="job-card-body">
        <div className="job-meta">
          <div className="meta-item">
            <MapPin size={16} />
            <span>{job.location}</span>
          </div>
          <div className="meta-item">
            <Briefcase size={16} />
            <span>{job.experience}</span>
          </div>

        </div>

        <p className="job-description">
          {job.description}
        </p>

        {/* Skills */}
        {job.skills && job.skills.length > 0 && (
          <div className="skills-container">
            <div className="skills-list">
              {job.skills.slice(0, 4).map((skill, index) => (
                <span key={index} className="skill-tag">
                  {skill}
                </span>
              ))}
              {job.skills.length > 4 && (
                <span className="skill-tag more">
                  +{job.skills.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="job-card-footer">
        <div className="action-buttons">
          {isApplied ? (
            <button className="btn btn-applied" disabled>
              <Eye size={16} />
              Postulé
            </button>
          ) : (
            <button
              className="btn btn-primary"
              onClick={handleViewDetails}
            >
              <ArrowRight size={16} />
              Postuler
            </button>
          )}

          <button
            className={`btn btn-save ${isSaved ? 'saved' : ''}`}
            onClick={() => onSave(job.id, isSaved)}
            title={isSaved ? "Retirer des favoris" : "Ajouter aux favoris"}
            disabled={isSaving} 
          >
            {isSaving ? (
              <Loader2 size={16} className="spinner" /> // Show spinner when loading
            ) : (
              isSaved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Enhanced Pagination Component
const PaginationComponent = ({ currentPage, totalPages, onPageChange }) => {
  const getVisiblePages = () => {
    const delta = 1;
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
      if (totalPages > 1) rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="pagination-wrapper">
      <div className="pagination">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="pagination-btn prev"
        >
          <ChevronLeft size={16} />
          <span className="btn-text">Précédent</span>
        </button>

        <div className="pagination-numbers">
          {getVisiblePages().map((page, index) => (
            page === '...' ? (
              <div key={`dots-${index}`} className="pagination-dots">
                <MoreHorizontal size={16} />
              </div>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`pagination-number ${currentPage === page ? 'active' : ''}`}
              >
                {page}
              </button>
            )
          ))}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="pagination-btn next"
        >
          <span className="btn-text">Suivant</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

// Saved Jobs CTA Component

const SavedJobsCTA = () => {
  return (
    <div className="saved-jobs-cta">
      <div className="cta-content">
        <div className="cta-visual">
          <div className="cta-icon">
            <Heart size={24} />
          </div>
          <div className="floating-elements">
            <div className="floating-element"></div>
            <div className="floating-element"></div>
            <div className="floating-element"></div>
          </div>
        </div>
        
        <div className="cta-text">
          <h3>Vos Offres Favorites</h3>
          <p>Retrouvez facilement toutes les opportunités qui vous intéressent dans votre espace personnalisé</p>
        </div>
        
        <button 
          className="cta-button"
          onClick={() => window.location.href = '/SavedJobOffers'}
        >
          <span>Consulter mes favoris</span>
        </button>
      </div>
    </div>
  );
};


// Main Component
const JobSearchAndOffers = () => {
  // State management
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [candidateId, setCandidateId] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [savingJobId, setSavingJobId] = useState(null); // New state to track which job is being saved/unsaved
  const [currentPage, setCurrentPage] = useState(1);
  const [candidate, setCandidate] = useState(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPoste, setSelectedPoste] = useState('');
  const [selectedLieu, setSelectedLieu] = useState('');
  const [selectedSalaire, setSelectedSalaire] = useState('');
  const [selectedDomaine, setSelectedDomaine] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const jobsPerPage = 6;

  // Fetch jobs data
 useEffect(() => {
  axios.get(`${process.env.REACT_APP_API_URL}/api/je`)
    .then(response => {
      const updatedJobs = response.data.map(job => ({
        ...job,
        logo: job.logo || "https://dummyimage.com/80x80/000/fff.png&text=No+Logo",
        // Normalize these fields:
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


  const handleSaveJob = async (jobId, currentlySaved) => {
    setSavingJobId(jobId); // Set loading for this specific job
    try {
      if (currentlySaved) {
        await fetch(`${process.env.REACT_APP_API_URL}/api/unsave-job`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ job_offer_id: jobId, candidate_id: candidateId })
        });
        setSavedJobs(prev => prev.filter(id => id !== jobId));
      } else {
        await fetch(`${process.env.REACT_APP_API_URL}/api/save-job`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ job_offer_id: jobId, candidate_id: candidateId })
        });
        setSavedJobs(prev => [...prev, jobId]);
      }
    } catch (error) {
      console.error(`Erreur lors de la ${currentlySaved ? 'suppression' : 'sauvegarde'} de l'offre :`, error);
      alert(`Impossible de ${currentlySaved ? 'retirer' : 'sauvegarder'} l'offre pour le moment.`);
    } finally {
      setSavingJobId(null); // Reset loading
    }
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

  // Filter jobs based on search criteria
  useEffect(() => {
    const filterJobs = () => {
      const results = jobs.filter(job => {
        const matchesSearch = searchTerm === '' ||
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesPoste = selectedPoste === '' ||
          job.title.toLowerCase().includes(selectedPoste.toLowerCase());

        const matchesLieu = selectedLieu === '' ||
          job.location.toLowerCase().includes(selectedLieu.toLowerCase());

        const matchesSalaire = selectedSalaire === '' ||
          (job.salary && job.salary.toLowerCase().includes(selectedSalaire.toLowerCase()));

        const matchesDomaine = selectedDomaine === '' ||
          job.type.toLowerCase().includes(selectedDomaine.toLowerCase());

        return matchesSearch && matchesPoste && matchesLieu && matchesSalaire && matchesDomaine;
      });

      setFilteredJobs(results);
      setCurrentPage(1);
    };

    filterJobs();
  }, [searchTerm, selectedPoste, selectedLieu, selectedSalaire, selectedDomaine, jobs]);


  // Get unique filter options
  const filterOptions = useMemo(() => ({
    postes: [...new Set(jobs.map(job => job.title))],
    lieux: [...new Set(jobs.map(job => job.location))],
    salaires: [...new Set(jobs.map(job => job.salary))],
    domaines: [...new Set(jobs.map(job => job.type))]
  }), [jobs]);

  // Pagination
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const currentJobs = useMemo(() => {
    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    return filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  }, [filteredJobs, currentPage, jobsPerPage]);

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedPoste('');
    setSelectedLieu('');
    setSelectedSalaire('');
    setSelectedDomaine('');
  };

  // Loading state
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
        <p className="loading-text">Chargement des offres d'emploi...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <h2>Erreur de chargement</h2>
        <p>Impossible de charger les offres. Veuillez réessayer plus tard.</p>
        <button onClick={() => window.location.reload()} className="btn btn-primary">
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="job-search-container">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Trouvez votre emploi idéal</h1>
            <p>Découvrez des milliers d'opportunités qui correspondent à vos compétences et aspirations</p>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">{jobs.length}</span>
                <span className="stat-label">Offres disponibles</span>
              </div>
              <div className="stat">
                <span className="stat-number">{filterOptions.postes.length}</span>
                <span className="stat-label">Métiers différents</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="search-section">
        <div className="search-container">
          {/* Main Search Bar */}
          <div className="main-search">
            <div className="search-input-wrapper">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                placeholder="Rechercher un poste, une entreprise, une compétence..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="clear-search"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Filters Toggle */}
          <div className="filters-toggle">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`filters-btn ${showFilters ? 'active' : ''}`}
            >
              <SlidersHorizontal size={16} />
              <span>Filtres</span>
              {(selectedPoste || selectedLieu || selectedSalaire || selectedDomaine) && (
                <div className="filter-indicator"></div>
              )}
            </button>
          </div>

          {/* Filters Panel */}
          <div className={`filters-panel ${showFilters ? 'show' : ''}`}>
            <div className="filters-header">
              <h3>Filtres de recherche</h3>
              <button onClick={clearFilters} className="clear-filters">
                Tout effacer
              </button>
            </div>

            <div className="filters-grid">
              <div className="filter-group">
                <label className="filter-label">
                  <Briefcase size={16} />
                  Poste
                </label>
                <select
                  value={selectedPoste}
                  onChange={(e) => setSelectedPoste(e.target.value)}
                  className="filter-select"
                >
                  <option value="">Tous les postes</option>
                  {filterOptions.postes.map((poste, index) => (
                    <option key={index} value={poste}>{poste}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">
                  <MapPin size={16} />
                  Lieu
                </label>
                <select
                  value={selectedLieu}
                  onChange={(e) => setSelectedLieu(e.target.value)}
                  className="filter-select"
                >
                  <option value="">Toutes les villes</option>
                  {filterOptions.lieux.map((lieu, index) => (
                    <option key={index} value={lieu}>{lieu}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">
                  <DollarSign size={16} />
                  Salaire
                </label>
                <select
                  value={selectedSalaire}
                  onChange={(e) => setSelectedSalaire(e.target.value)}
                  className="filter-select"
                >
                  <option value="">Tous les salaires</option>
                  {filterOptions.salaires.map((salaire, index) => (
                    <option key={index} value={salaire}>{salaire}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">
                  <Building2 size={16} />
                  Type de contrat
                </label>
                <select
                  value={selectedDomaine}
                  onChange={(e) => setSelectedDomaine(e.target.value)}
                  className="filter-select"
                >
                  <option value="">Tous les types</option>
                  {filterOptions.domaines.map((domaine, index) => (
                    <option key={index} value={domaine}>{domaine}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="results-section">
        <div className="results-header">
          <div className="results-info">
            <h2>
              {filteredJobs.length} offre{filteredJobs.length !== 1 ? 's' : ''} trouvée{filteredJobs.length !== 1 ? 's' : ''}
            </h2>
            {searchTerm && (
              <p>pour "{searchTerm}"</p>
            )}
          </div>
        </div>

        {filteredJobs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <Search size={48} />
            </div>
            <h3>Aucune offre trouvée</h3>
            <p>Essayez d'ajuster vos critères de recherche ou explorez d'autres opportunités</p>
            <button onClick={clearFilters} className="btn btn-primary">
              Effacer les filtres
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
                  isSaving={savingJobId === job.id} // Pass loading state for this specific job
                />
              ))}
            </div>

            <PaginationComponent
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>

      {/* Saved Jobs CTA */}
      <SavedJobsCTA />

     <style jsx>{`
  .job-search-container {
    min-height: 100vh;
    background: linear-gradient(to right, #f8f9fa, #e9ecef);
    border-radius: 1rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }

  /* Hero Section */
  .hero-section {
    background: linear-gradient(to right, #f8f9fa, #e9ecef);
    color: #212529;
    padding: 3rem 1rem 4rem;
    position: relative;
    overflow: hidden;
    border-radius: 1rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }

  .hero-section::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100"><polygon fill="rgba(0,0,0,0.03)" points="0,0 1000,0 1000,60 0,100"/></svg>') no-repeat center bottom;
    background-size: cover;
    opacity: 0.3;
    z-index: 0;
  }

  .hero-content {
    max-width: 1000px;
    margin: 0 auto;
    text-align: center;
    position: relative;
    z-index: 1;
  }

  .hero-text h1 {
    font-size: clamp(2rem, 5vw, 3rem); /* Excellent use of clamp! */
    font-weight: 700;
    color: #343a40;
    margin-bottom: 1rem;
  }

  .hero-text p {
    font-size: clamp(1rem, 2vw, 1.25rem); /* Excellent use of clamp! */
    margin-bottom: 2rem;
    color: #6c757d;
    max-width: 700px;
    margin-left: auto;
    margin-right: auto;
    line-height: 1.6;
  }

  .hero-stats {
    display: flex;
    justify-content: center;
    flex-wrap: wrap; /* Allow stats to wrap onto new lines */
    gap: 2rem;
    margin-top: 2rem;
  }

  .hero-stats > div {
    background: #fff;
    padding: 1rem 1.5rem;
    border-radius: 0.75rem;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
    min-width: 120px;
    flex-grow: 1; /* Allow stats to grow and fill space */
    flex-basis: 0; /* Important for flex-grow to work as expected */
  }

  .stat {
    text-align: center;
  }

  .stat-number {
    display: block;
    font-size: 2.5rem;
    font-weight: 700;
    line-height: 1;
    color: #ff8c00;
  }

  .stat-label {
    font-size: 0.9rem;
    opacity: 0.8;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  /* Search Section */
  .search-section {
    background: white;
    margin: -3rem 1rem 0; /* Adjusted in media queries */
    border-radius: 1.5rem;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
    position: relative;
    z-index: 10;
    border: 2px solid #f8f9fa;
  }

  .search-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem; /* Adjusted in media queries */
  }

  .main-search {
    margin-bottom: 1rem;
  }

  .search-input-wrapper {
    position: relative;
    max-width: 800px;
    margin: 0 auto;
  }

  .search-icon {
    position: absolute;
    left: 1.5rem;
    top: 50%;
    transform: translateY(-50%);
    color: #6c757d;
  }

  .search-input {
    width: 100%;
    padding: 1.25rem 1.5rem 1.25rem 3.5rem; /* Adjusted in media queries */
    border: 2px solid #e9ecef;
    border-radius: 1rem;
    font-size: 1.1rem; /* Adjusted in media queries */
    background: #f8f9fa;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    color: #212529;
  }

  .search-input:focus {
    outline: none;
    border-color: #ff8c00;
    background: white;
    box-shadow: 0 0 0 4px rgba(255, 140, 0, 0.1);
  }

  .search-input::placeholder {
    color: #6c757d;
  }

  .clear-search {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    background: #e9ecef;
    border: none;
    border-radius: 50%;
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
    color: #495057;
  }

  .clear-search:hover {
    background: #dee2e6;
    color: #212529;
  }

  .filters-toggle {
    display: flex;
    justify-content: center;
    margin-bottom: 1rem;
  }

  .filters-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background: #f8f9fa;
    border: 2px solid #e9ecef;
    border-radius: 0.75rem;
    cursor: pointer;
    transition: all 0.3s;
    position: relative;
    color: #495057;
    font-weight: 500;
  }

  .filters-btn:hover,
  .filters-btn.active {
    background: #ff8c00;
    color: white;
    border-color: #ff8c00;
    transform: translateY(-1px);
  }

  .filter-indicator {
    position: absolute;
    top: -0.25rem;
    right: -0.25rem;
    width: 0.75rem;
    height: 0.75rem;
    background: #ff8c00;
    border-radius: 50%;
    border: 2px solid white;
  }

  .filters-panel {
    background: #f8f9fa;
    border-radius: 1rem;
    border: 2px solid #e9ecef;
    padding: 0;
    max-height: 0;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .filters-panel.show {
    padding: 1.5rem; /* Adjusted in media queries */
    max-height: 500px; /* Adjust as needed, a large value works with overflow:hidden */
  }

  .filters-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .filters-header h3 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
    color: #212529;
  }

  .clear-filters {
    background: none;
    border: none;
    color: #ff8c00;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.2s;
  }

  .clear-filters:hover {
    opacity: 0.7;
  }

  .filters-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); /* Good for responsiveness */
    gap: 1.5rem;
  }

  .filter-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .filter-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
    font-weight: 600;
    color: #495057;
  }

  .filter-label svg {
    color: #ff8c00;
  }

  .filter-select {
    padding: 0.75rem 1rem;
    border: 2px solid #dee2e6;
    border-radius: 0.5rem;
    background: white;
    font-size: 0.95rem;
    transition: all 0.2s;
    color: #495057;
  }

  .filter-select:focus {
    outline: none;
    border-color: #ff8c00;
    box-shadow: 0 0 0 3px rgba(255, 140, 0, 0.1);
  }

  /* Results Section */
  .results-section {
    max-width: 1200px;
    margin: 0 auto;
    padding: 3rem 1rem; /* Adjusted in media queries */
  }

  .results-header {
    margin-bottom: 2rem;
    text-align: center;
  }

  .results-info h2 {
    font-size: 1.75rem; /* Adjusted in media queries */
    font-weight: 700;
    color: #212529;
    margin: 0 0 0.5rem;
  }

  .results-info p {
    color: #6c757d;
    font-size: 1.1rem; /* Adjusted in media queries */
    margin: 0;
  }

  /* Jobs Grid */
  .jobs-grid {
    display: grid;
    /* This is great! minmax(400px, 1fr) ensures cards are at least 400px
       or take up available space. We'll adjust this for smaller screens. */
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    gap: 1.5rem;
    margin-bottom: 3rem;
  }

  /* Job Card - Existing styles remain */
  .job-card {
    background: white;
    border-radius: 1rem;
    border: 2px solid #e9ecef;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
  }

  .job-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    border-color: #ff8c00;
  }

  .job-card-header {
    padding: 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    border-bottom: 2px solid #f8f9fa;
    flex-wrap: nowrap; /* Default: no wrapping */
    gap: 1rem;
  }

  .company-info {
    display: flex;
    gap: 1rem;
    flex: 1;
    min-width: 0; /* Ensures text can shrink */
  }

  .company-logo {
    width: 60px;
    height: 60px;
    border-radius: 0.75rem;
    overflow: hidden;
    background: #f8f9fa;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    border: 2px solid #e9ecef;
  }

  .company-logo img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .job-title-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .job-title {
    font-size: 1.25rem; /* Base size */
    font-weight: 700;
    color: #212529;
    margin: 0 0 0.25rem;
    line-height: 1.3;
    word-break: break-word;
    overflow-wrap: break-word;
  }

  .company-name {
    color: #6c757d;
    font-size: 0.95rem; /* Base size */
    margin: 0;
    font-weight: 500;
    word-break: break-word;
    overflow-wrap: break-word;
  }

  .job-type-badge {
    flex-shrink: 0;
    margin-left: 1rem;
  }

  .badge {
    padding: 0.375rem 0.75rem;
    border-radius: 0.5rem;
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border: 2px solid transparent;
  }

  .badge.cdi {
    background: #212529;
    color: white;
  }

  .badge.cdd {
    background: #ff8c00;
    color: white;
  }

  .badge.freelance {
    background: white;
    color: #212529;
    border-color: #212529;
  }

  .badge.stage {
    background: #f8f9fa;
    color: #495057;
    border-color: #dee2e6;
  }

  .job-card-body {
    padding: 1.5rem; /* Adjusted in media queries */
  }

  .job-meta {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap; /* Good, allows meta items to wrap */
    margin-bottom: 1rem;
    color: #495057;
    font-size: 0.9rem; /* Adjusted in media queries */
  }

  .meta-item {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .meta-item svg {
    color: #ff8c00;
  }

  .job-description {
    font-size: 0.95rem; /* Adjusted in media queries */
    color: #495057;
    line-height: 1.6;
    margin-bottom: 1.5rem;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .skills-container {
    margin-top: 1rem;
  }

  .skills-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .skill-tag {
    background: #e9ecef;
    color: #495057;
    padding: 0.3rem 0.7rem;
    border-radius: 0.375rem;
    font-size: 0.8rem; /* Adjusted in media queries */
    font-weight: 500;
    white-space: nowrap;
  }

  .skill-tag.more {
    background: #dee2e6;
    color: #6c757d;
  }

  .job-card-footer {
    padding: 1.5rem; /* Adjusted in media queries */
    border-top: 2px solid #f8f9fa;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap; /* Allow footer items to wrap */
  }

  .action-buttons {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap; /* Allow buttons to wrap */
    justify-content: flex-end; /* Align buttons to the end */
    flex-grow: 1; /* Allow action buttons to take up available space */
  }

  .btn {
    padding: 0.75rem 1.25rem; /* Adjusted in media queries */
    border-radius: 0.75rem;
    font-size: 0.95rem; /* Adjusted in media queries */
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    white-space: nowrap;
    flex-grow: 1; /* Allows buttons to grow */
    flex-basis: auto; /* Default basis */
  }

  .btn-primary {
    background: #ff8c00;
    color: white;
    border: 2px solid #ff8c00;
  }

  .btn-primary:hover {
    background: #e67e00;
    border-color: #e67e00;
    box-shadow: 0 4px 12px rgba(255, 140, 0, 0.2);
    transform: translateY(-1px);
  }

  .btn-primary:disabled {
    background: #cccccc;
    border-color: #cccccc;
    cursor: not-allowed;
    box-shadow: none;
  }

  .btn-applied {
    background: #e9ecef;
    color: #6c757d;
    border: 2px solid #e9ecef;
    cursor: not-allowed;
  }

  .btn-save {
    background: #f8f9fa;
    color: #6c757d;
    border: 2px solid #dee2e6;
    width: 20px !important;
    height: 3rem;
    padding: 0;
    flex-shrink: 0;
  }

  .btn-save:hover:not(:disabled) {
    border-color: #ff8c00;
    color: #ff8c00;
    background: #fff5e6;
  }

  .btn-save.saved {
    background: #ff8c00;
    color: white;
    border-color: #ff8c00;
  }

  .btn-save.saved:hover:not(:disabled) {
    background: #e67e00;
    border-color: #e67e00;
  }

  .btn-save:disabled {
    background: #e9ecef;
    color: #adb5bd;
    border-color: #e9ecef;
    cursor: not-allowed;
  }

  /* Pagination */
  .pagination-wrapper {
    display: flex;
    justify-content: center;
    margin-top: 2rem;
  }

  .pagination {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    background: white;
    padding: 0.75rem 1rem; /* Adjusted in media queries */
    border-radius: 1rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border: 2px solid #f8f9fa;
    flex-wrap: wrap; /* Allow pagination items to wrap */
    justify-content: center; /* Center items when wrapped */
  }

  .pagination-btn {
    background: #f8f9fa;
    border: 2px solid #e9ecef;
    color: #495057;
    padding: 0.6rem 1rem; /* Adjusted in media queries */
    border-radius: 0.75rem;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-weight: 500;
  }

  .pagination-btn:hover:not(:disabled) {
    background: #ff8c00;
    color: white;
    border-color: #ff8c00;
    transform: translateY(-1px);
  }

  .pagination-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: #f1f3f5;
    border-color: #f1f3f5;
  }

  .pagination-btn.prev .btn-text {
    margin-right: 0.25rem;
  }

  .pagination-btn.next .btn-text {
    margin-left: 0.25rem;
  }

  .pagination-numbers {
    display: flex;
    gap: 0.5rem;
  }

  .pagination-number {
    background: #f8f9fa;
    border: 2px solid #e9ecef;
    color: #495057;
    min-width: 2.5rem; /* Adjusted in media queries */
    height: 2.5rem; /* Adjusted in media queries */
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.75rem;
    cursor: pointer;
    transition: all 0.2s;
    font-weight: 600;
  }

  .pagination-number:hover:not(.active) {
    background: #ff8c00;
    color: white;
    border-color: #ff8c00;
  }

  .pagination-number.active {
    background: #ff8c00;
    color: white;
    border-color: #ff8c00;
    cursor: default;
    box-shadow: 0 2px 8px rgba(255, 140, 0, 0.2);
  }

  .pagination-dots {
    color: #6c757d;
    display: flex;
    align-items: flex-end;
    padding-bottom: 0.2rem;
  }

  /* Loading and Error States */
  .loading-container,
  .error-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
    text-align: center;
    padding: 2rem;
    background: #f8f9fa;
    border-radius: 1rem;
    margin: 2rem auto;
    max-width: 800px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  }

  .loading-spinner {
    width: 60px;
    height: 60px;
    border: 6px solid #e9ecef;
    border-top-color: #ff8c00;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1.5rem;
  }

  .loading-text {
    font-size: 1.25rem;
    color: #495057;
    font-weight: 500;
  }

  .error-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }

  .error-container h2 {
    color: #dc3545;
    margin-bottom: 0.75rem;
  }

  .error-container p {
    color: #6c757d;
    margin-bottom: 1.5rem;
  }

  .spinner {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  /* Empty State */
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 1rem;
    text-align: center;
    background: white;
    border-radius: 1rem;
    border: 2px dashed #e9ecef;
    color: #6c757d;
    max-width: 600px;
    margin: 3rem auto;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  }

  .empty-icon {
    margin-bottom: 1.5rem;
    color: #adb5bd;
  }

  .empty-state h3 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #343a40;
    margin-bottom: 0.75rem;
  }

  .empty-state p {
    font-size: 1rem;
    margin-bottom: 2rem;
    max-width: 400px;
  }

  /* Saved Jobs CTA */
  .saved-jobs-cta {
    background: linear-gradient(135deg, #212529 0%, #000000 100%);
    margin: 4rem 1rem 0; /* Adjusted in media queries */
    border-radius: 1.5rem;
    overflow: hidden;
    position: relative;
    border: 2px solid #343a40;
  }

  .cta-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 3rem 2rem; /* Adjusted in media queries */
    display: flex;
    align-items: center;
    gap: 2rem;
    position: relative;
    z-index: 1;
  }

  .cta-visual {
    position: relative;
    flex-shrink: 0;
  }

  .cta-icon {
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, #ff8c00, #e67e00);
    border-radius: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    position: relative;
    z-index: 2;
    border: 3px solid #343a40;
  }

  .floating-elements {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .floating-element {
    position: absolute;
    width: 8px;
    height: 8px;
    background: rgba(255, 140, 0, 0.4);
    border-radius: 50%;
    animation: float 6s ease-in-out infinite;
  }

  .floating-element:nth-child(1) {
    top: -10px;
    left: -10px;
    animation-delay: 0s;
  }

  .floating-element:nth-child(2) {
    top: -5px;
    right: -15px;
    animation-delay: 2s;
  }

  .floating-element:nth-child(3) {
    bottom: -10px;
    left: 50%;
    animation-delay: 4s;
  }

  @keyframes float {
    0%,
    100% {
      transform: translateY(0px) scale(1);
      opacity: 0.7;
    }
    50% {
      transform: translateY(-20px) scale(1.1);
      opacity: 1;
    }
  }

  .cta-text {
    flex: 1;
    color: white;
  }

  .cta-text h3 {
    font-size: 1.75rem; /* Adjusted in media queries */
    font-weight: 700;
    margin: 0 0 0.5rem;
  }

  .cta-text p {
    font-size: 1.1rem; /* Adjusted in media queries */
    opacity: 0.8;
    margin: 0;
    line-height: 1.6;
  }

  .cta-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: #ff8c00;
    color: white;
    border: none;
    border-radius: 0.75rem;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    flex-shrink: 0;
    width: 200px; /* Adjusted in media queries */
    padding: 0.75rem 1.25rem; /* Giving it proper padding */
  }

  .cta-button:hover {
    background: #e67e00;
    border-color: #e67e00;
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(255, 140, 0, 0.4);
  }

  ---

  ## Responsive Adjustments

  These media queries adapt the layout and typography for different screen sizes.

  ---

  /* For larger desktops (e.g., max-width: 1400px - optional, depends on base design) */
  /* If your design starts to feel too stretched on very wide screens,
     you might add max-width to containers, but for this, existing max-width is good. */

  /* For smaller desktops and large tablets (e.g., max-width: 1200px) */
  @media (max-width: 1200px) {
    .hero-section {
      padding: 2.5rem 0.8rem 3.5rem;
    }

    .hero-stats > div {
      min-width: 100px; /* Slightly smaller stat boxes */
    }

    .stat-number {
      font-size: 2.2rem;
    }

    .search-container {
      padding: 1.5rem;
    }

    .search-input {
      font-size: 1.05rem;
      padding: 1.1rem 1.2rem 1.1rem 3.2rem;
    }

    .filters-panel.show {
      padding: 1.25rem;
    }

    .filters-grid {
      gap: 1rem;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    }

    .results-section {
      padding: 2.5rem 0.8rem;
    }

    .results-info h2 {
      font-size: 1.6rem;
    }

    .results-info p {
      font-size: 1.05rem;
    }

    .jobs-grid {
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); /* Allow cards to be smaller */
      gap: 1.25rem;
    }

    .job-title {
      font-size: 1.15rem;
    }

    .company-name {
      font-size: 0.9rem;
    }

    .job-card-body {
      padding: 1.25rem;
    }

    .job-meta {
      font-size: 0.85rem;
    }

    .job-description {
      font-size: 0.9rem;
    }

    .skill-tag {
      font-size: 0.75rem;
      padding: 0.25rem 0.6rem;
    }

    .job-card-footer {
      padding: 1.25rem;
    }

    .btn {
      padding: 0.65rem 1rem;
      font-size: 0.9rem;
    }

    .pagination {
      padding: 0.6rem 0.8rem;
      gap: 0.6rem;
    }

    .pagination-btn {
      padding: 0.5rem 0.8rem;
    }

    .pagination-number {
      min-width: 2.2rem;
      height: 2.2rem;
    }

    .saved-jobs-cta {
      margin: 3.5rem 0.8rem 0;
    }

    .cta-content {
      padding: 2.5rem 1.5rem;
      gap: 1.5rem;
    }

    .cta-icon {
      width: 70px;
      height: 70px;
    }

    .cta-text h3 {
      font-size: 1.5rem;
    }

    .cta-text p {
      font-size: 1rem;
    }

    .cta-button {
      width: 180px;
      padding: 0.65rem 1rem;
      font-size: 0.95rem;
    }
  }

  /* For tablets and smaller (e.g., max-width: 992px) - This is where significant layout shifts occur */
  @media (max-width: 992px) {
    .hero-section {
      padding: 2rem 0.5rem 3rem;
    }

    .hero-stats {
      flex-direction: column; /* Stack stats vertically */
      gap: 1rem;
      align-items: center; /* Center stacked stats */
    }

    .hero-stats > div {
      width: 100%; /* Take full width when stacked */
      max-width: 250px; /* Limit width for aesthetics on smaller screens */
    }

    .stat-number {
      font-size: 2rem;
    }

    .search-section {
      margin: -2.5rem 0.5rem 0; /* Adjust margin to pull it up more */
      border-radius: 1.25rem;
      padding: 1.5rem;
    }

    .search-container {
      padding: 1rem;
    }

    .search-input {
      padding: 1rem 1rem 1rem 3rem; /* Adjust padding for icon */
      font-size: 1rem;
    }

    .search-icon {
      left: 1rem; /* Move icon closer to edge */
    }

    .filters-btn {
      width: 100%; /* Make filter button full width */
      justify-content: center;
      font-size: 0.9rem;
      padding: 0.65rem 1rem;
    }

    .filters-panel.show {
      padding: 1rem;
    }

    .filters-grid {
      grid-template-columns: 1fr; /* Stack filters vertically */
      gap: 1rem;
    }

    .results-section {
      padding: 2rem 0.5rem;
    }

    .results-info h2 {
      font-size: 1.5rem;
    }

    .results-info p {
      font-size: 1rem;
    }

    .jobs-grid {
      grid-template-columns: 1fr; /* Single column for job cards */
      gap: 1.25rem;
    }

    .job-card-header {
      flex-wrap: wrap; /* Allow wrapping */
      justify-content: center; /* Center items when wrapped */
      text-align: center; /* Center text within header elements */
      padding: 1.25rem;
      gap: 0.75rem;
    }

    .company-info {
      flex-direction: column; /* Stack logo and title/company */
      align-items: center; /* Center logo and text within company-info */
      flex-basis: 100%; /* Occupy full width when wrapped */
      margin-bottom: 0.5rem; /* Space below when badge wraps */
    }

    .company-logo {
      width: 50px;
      height: 50px;
      margin-bottom: 0.5rem; /* Space below logo when stacked */
    }

    .job-title-info {
      text-align: center; /* Ensure title/company text is centered */
      margin-bottom: 0.5rem; /* Space below title/company when badge wraps */
    }

    .job-title {
      font-size: 1.05rem;
      line-height: 1.2;
    }

    .company-name {
      font-size: 0.85rem;
    }

    .job-type-badge {
      margin-left: 0; /* Remove left margin */
      margin-top: 0.5rem; /* Add top margin if it wraps */
      flex-basis: 100%; /* Take full width */
      max-width: fit-content; /* Shrink badge to content width */
      margin: 0 auto; /* Center the badge */
    }

    .job-card-body {
      padding: 1.1rem;
    }

    .job-meta {
      font-size: 0.8rem;
      justify-content: center; /* Center meta items when wrapped */
    }

    .job-description {
      font-size: 0.85rem;
    }

    .skill-tag {
      font-size: 0.7rem;
      padding: 0.2rem 0.5rem;
    }

    .job-card-footer {
      flex-direction: column; /* Stack footer items */
      align-items: stretch; /* Stretch buttons to full width */
      padding: 1.1rem;
      gap: 0.5rem;
    }

    .action-buttons {
      flex-direction: column; /* Stack buttons vertically */
      width: 100%; /* Make buttons take full width */
      gap: 0.5rem;
    }

    .btn {
      width: 100%; /* Ensure all buttons take full width */
      padding: 0.6rem 1rem;
      font-size: 0.85rem;
    }

    .btn-save {
      width: 100%; /* Make save button full width */
      border-radius: 0.75rem; /* Square up the save button */
      padding: 0.6rem 1rem;
      height: auto;
    }

    .pagination {
      flex-wrap: wrap; /* Allow items to wrap */
      justify-content: center;
      gap: 0.5rem;
      padding: 0.5rem;
    }

    .pagination-btn {
      padding: 0.5rem 0.75rem;
      font-size: 0.85rem;
    }

    .pagination-numbers {
      flex-basis: 100%; /* Force numbers to a new line */
      justify-content: center;
      order: 3; /* Visually move numbers below buttons */
      margin-top: 0.5rem;
    }

    .pagination-number {
      min-width: 2rem;
      height: 2rem;
      font-size: 0.9rem;
    }

    .saved-jobs-cta {
      margin: 3rem 0.5rem 0; /* Adjust margin for smaller screens */
      border-radius: 1rem;
    }

    .cta-content {
      padding: 2rem 1rem; /* Further reduce padding */
      flex-direction: column; /* Stack items vertically */
      gap: 1.5rem;
    }

    .cta-visual {
      margin-bottom: 1rem;
    }

    .cta-icon {
      width: 60px;
      height: 60px;
    }

    .cta-text h3 {
      font-size: 1.3rem;
    }

    .cta-text p {
      font-size: 0.95rem;
    }

    .cta-button {
      width: 100%; /* Make button full width on smaller screens */
      max-width: 250px; /* Limit max width for aesthetics */
      font-size: 0.9rem;
      padding: 0.8rem 1.2rem;
    }
  }

  /* For small mobile devices (e.g., max-width: 576px - common phone breakpoint) */
  @media (max-width: 576px) {
    .hero-section {
      padding: 1.5rem 0.5rem 2.5rem;
    }

    .search-section {
      margin: -2rem 0.25rem 0;
      border-radius: 1rem;
      padding: 1rem;
    }

    .search-input {
      padding: 0.9rem 0.9rem 0.9rem 2.5rem;
      font-size: 0.9rem;
    }

    .search-icon {
      left: 0.8rem;
      font-size: 0.9rem;
    }

    .clear-search {
      width: 1.8rem;
      height: 1.8rem;
      right: 0.8rem;
    }

    .filters-btn {
      font-size: 0.85rem;
      padding: 0.6rem 0.8rem;
    }

    .filters-panel.show {
      padding: 0.75rem;
    }

    .filters-header h3 {
      font-size: 1rem;
    }

    .filter-label {
      font-size: 0.85rem;
    }

    .filter-select {
      font-size: 0.9rem;
      padding: 0.6rem 0.8rem;
    }

    .results-section {
      padding: 1.5rem 0.25rem;
    }

    .results-info h2 {
      font-size: 1.3rem;
    }

    .results-info p {
      font-size: 0.9rem;
    }

    .job-title {
      font-size: 0.95rem; /* Final size for title on small mobiles */
      line-height: 1.1;
    }

    .company-name {
      font-size: 0.8rem; /* Final size for company name on small mobiles */
    }

    .badge {
      font-size: 0.7rem;
      padding: 0.25rem 0.6rem;
    }

    .job-card-body {
      padding: 0.9rem;
    }

    .job-meta {
      font-size: 0.75rem;
      gap: 0.75rem;
    }

    .job-description {
      font-size: 0.8rem;
    }

    .skill-tag {
      font-size: 0.65rem;
      padding: 0.15rem 0.4rem;
    }

    .job-card-footer {
      padding: 0.9rem;
    }

    .btn {
      padding: 0.5rem 0.8rem;
      font-size: 0.8rem;
    }

    .btn-save {
      padding: 0.5rem 0.8rem;
    }

    .pagination {
      padding: 0.4rem;
      gap: 0.4rem;
    }

    .pagination-btn {
      padding: 0.4rem 0.6rem;
      font-size: 0.8rem;
    }

    .pagination-number {
      min-width: 1.8rem;
      height: 1.8rem;
      font-size: 0.8rem;
    }

    .saved-jobs-cta {
      margin: 2rem 0.25rem 0;
      border-radius: 0.75rem;
    }

    .cta-content {
      padding: 1.5rem 0.8rem;
      gap: 1rem;
    }

    .cta-icon {
      width: 50px;
      height: 50px;
    }

    .cta-text h3 {
      font-size: 1.1rem;
    }

    .cta-text p {
      font-size: 0.85rem;
    }

    .cta-button {
      padding: 0.6rem 0.9rem;
      font-size: 0.8rem;
    }
  }

  /* For very small mobile devices (e.g., max-width: 400px) */
  @media (max-width: 400px) {
    .hero-section {
      padding: 1rem 0.25rem 2rem;
    }

    .search-section {
      margin: -1.5rem 0.1rem 0;
      border-radius: 0.8rem;
      padding: 0.8rem;
    }

    .search-input {
      padding: 0.7rem 0.7rem 0.7rem 2.2rem;
      font-size: 0.85rem;
    }

    .search-icon {
      left: 0.7rem;
    }

    .clear-search {
      width: 1.6rem;
      height: 1.6rem;
      right: 0.7rem;
    }

    .results-section {
      padding: 1rem 0.1rem;
    }

    .results-info h2 {
      font-size: 1.2rem;
    }

    .results-info p {
      font-size: 0.85rem;
    }

    .job-card-header {
      padding: 0.8rem;
      gap: 0.5rem;
    }

    .company-logo {
      width: 40px;
      height: 40px;
    }

    .job-title {
      font-size: 0.9rem;
    }

    .company-name {
      font-size: 0.75rem;
    }

    .job-card-body {
      padding: 0.7rem;
    }

    .job-card-footer {
      padding: 0.7rem;
    }

    .btn {
      padding: 0.4rem 0.6rem;
      font-size: 0.75rem;
    }

    .btn-save {
      padding: 0.4rem 0.6rem;
    }

    .pagination-btn {
      padding: 0.3rem 0.5rem;
      font-size: 0.75rem;
    }

    .pagination-number {
      min-width: 1.6rem;
      height: 1.6rem;
      font-size: 0.75rem;
    }

    .saved-jobs-cta {
      margin: 1.5rem 0.1rem 0;
      border-radius: 0.6rem;
    }

    .cta-content {
      padding: 1.2rem 0.6rem;
    }

    .cta-icon {
      width: 45px;
      height: 45px;
    }

    .cta-text h3 {
      font-size: 1rem;
    }

    .cta-text p {
      font-size: 0.8rem;
    }

    .cta-button {
      padding: 0.5rem 0.8rem;
      font-size: 0.75rem;
    }
  }
`}</style>
    </div>
  );
};

export default JobSearchAndOffers;
