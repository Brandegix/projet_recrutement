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
  Menu
} from 'lucide-react';

// Enhanced Job Card Component
const JobCard = ({ job, onApply, isApplied, onSave, isSaved }) => {
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
          <div className="meta-item">
            <DollarSign size={16} />
            <span className="salary">{job.salary}</span>
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
          >
            {isSaved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
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
          <ArrowRight size={16} />
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
    const fetchJobs = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/je`);
        const data = await response.json();
        
        const updatedJobs = data.map(job => ({
          ...job,
          logo: job.logo || "https://via.placeholder.com/60x60/4f46e5/ffffff?text=" + job.company.charAt(0)
        }));
        
        setJobs(updatedJobs);
        setFilteredJobs(updatedJobs);
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement des offres :", error);
        setError(true);
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Fetch saved jobs
  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/saved-jobs`, { 
          credentials: 'include' 
        });
        const data = await response.json();
        const savedJobIds = data.map(job => job.id);
        setSavedJobs(savedJobIds);
      } catch (error) {
        console.error("Erreur lors du chargement des jobs sauvegardés:", error);
      }
    };

    if (candidateId) {
      fetchSavedJobs();
    }
  }, [candidateId]);

  // Fetch candidate data and applications
  useEffect(() => {
    const fetchCandidateData = async () => {
      try {
        const candidateResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/current_candidate`, { 
          credentials: 'include' 
        });
        const candidateData = await candidateResponse.json();
        setCandidate(candidateData);
        setCandidateId(candidateData.id);

        const applicationsResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/getapplications`, {
          credentials: 'include'
        });
        const applications = await applicationsResponse.json();
        const appliedJobIds = applications.map(app => app.job_offer_id);
        setAppliedJobs(appliedJobIds);
      } catch (error) {
        console.error("Erreur candidate ou applications:", error);
      }
    };

    fetchCandidateData();
  }, []);

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

  // Handle job save/unsave
  const handleSaveJob = useCallback(async (jobId, currentlySaved) => {
    try {
      const url = currentlySaved 
        ? `${process.env.REACT_APP_API_URL}/api/unsave-job`
        : `${process.env.REACT_APP_API_URL}/api/save-job`;
      
      const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job_offer_id: jobId, candidate_id: candidateId })
      });

      if (!response.ok) throw new Error('Failed to save/unsave job');

      setSavedJobs(prev => 
        currentlySaved 
          ? prev.filter(id => id !== jobId)
          : [...prev, jobId]
      );
    } catch (error) {
      console.error('Erreur sauvegarde de l\'offre :', error);
      alert("Impossible de modifier la sauvegarde pour le moment.");
    }
  }, [candidateId]);

  // Handle job application
  const handleApply = useCallback(async (jobId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/applications`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job_offer_id: jobId, candidate_id: candidateId })
      });

      const data = await response.json();
      alert("Votre candidature a été soumise avec succès !");
      setAppliedJobs(prev => [...prev, jobId]);

      // Notify recruiter
      fetch(`${process.env.REACT_APP_API_URL}/api/notify-recruiter/${jobId}`, {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Erreur postulation :', error);
      alert("Erreur lors de la soumission de la candidature.");
    }
  }, [candidateId]);

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
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        }

        /* Hero Section */
        .hero-section {
          background: linear-gradient(135deg, #000000 0%, #212529 100%);
          color: white;
          padding: 4rem 1rem 6rem;
          position: relative;
          overflow: hidden;
        }

        .hero-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100"><polygon fill="rgba(255,165,0,0.1)" points="0,0 1000,0 1000,60 0,100"/></svg>') no-repeat center bottom;
          background-size: 100% 100px;
        }

        .hero-content {
          max-width: 1200px;
          margin: 0 auto;
          text-align: center;
          position: relative;
          z-index: 1;
        }

        .hero-text h1 {
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 800;
          margin: 0 0 1rem;
          line-height: 1.1;
          letter-spacing: -0.02em;
        }

        .hero-text p {
          font-size: clamp(1.1rem, 2vw, 1.3rem);
          margin: 0 0 2rem;
          opacity: 0.9;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .hero-stats {
          display: flex;
          justify-content: center;
          gap: 3rem;
          margin-top: 2rem;
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
          margin: -3rem 1rem 0;
          border-radius: 1.5rem;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
          position: relative;
          z-index: 10;
          border: 2px solid #f8f9fa;
        }

        .search-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
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
          padding: 1.25rem 1.5rem 1.25rem 3.5rem;
          border: 2px solid #e9ecef;
          border-radius: 1rem;
          font-size: 1.1rem;
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

        .filters-btn:hover, .filters-btn.active {
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
          padding: 1.5rem;
          max-height: 500px;
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
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
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
          padding: 3rem 1rem;
        }

        .results-header {
          margin-bottom: 2rem;
          text-align: center;
        }

        .results-info h2 {
          font-size: 1.75rem;
          font-weight: 700;
          color: #212529;
          margin: 0 0 0.5rem;
        }

        .results-info p {
          color: #6c757d;
          font-size: 1.1rem;
          margin: 0;
        }

        /* Jobs Grid */
        .jobs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        /* Job Card */
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
        }

        .company-info {
          display: flex;
          gap: 1rem;
          flex: 1;
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
        }

        .job-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #212529;
          margin: 0 0 0.25rem;
          line-height: 1.3;
        }

        .company-name {
          color: #6c757d;
          font-size: 0.95rem;
          margin: 0;
          font-weight: 500;
        }

        .job-type-badge {
          flex-shrink: 0;
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
          padding: 1.5rem;
        }

        .job-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #6c757d;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .meta-item svg {
          color: #ff8c00;
        }

        .salary {
          font-weight: 700;
          color: #212529;
        }

        .job-description {
          color: #495057;
          line-height: 1.6;
          margin: 0 0 1rem;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
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
          padding: 0.25rem 0.75rem;
          background: #f8f9fa;
          color: #495057;
          border-radius: 9999px;
          font-size: 0.8rem;
          font-weight: 500;
          border: 1px solid #e9ecef;
        }

        .skill-tag.more {
          background: #212529;
          color: white;
          border-color: #212529;
        }

        .job-card-footer {
          padding: 1.5rem;
          border-top: 2px solid #f8f9fa;
        }

        .action-buttons {
          display: flex;
          gap: 0.75rem;
        }

        .btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          border-radius: 0.5rem;
          font-size: 0.9rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s;
          cursor: pointer;
          border: 2px solid transparent;
          flex: 1;
          justify-content: center;
        }

        .btn-primary {
          background: #ff8c00;
          color: white;
          border-color: #ff8c00;
        }

        .btn-primary:hover {
          background: #e67e00;
          border-color: #e67e00;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(255, 140, 0, 0.3);
        }

        .btn-applied {
          background: #f8f9fa;
          color: #6c757d;
          border-color: #e9ecef;
          cursor: not-allowed;
        }

        .btn-save {
          background: white;
          color: #495057;
          border-color: #dee2e6;
          flex: 0 0 auto;
          padding: 0.75rem;
        }

        .btn-save:hover {
          background: #f8f9fa;
          color: #ff8c00;
          border-color: #ff8c00;
        }

        .btn-save.saved {
          background: #212529;
          color: white;
          border-color: #212529;
        }

        /* Pagination */
        .pagination-wrapper {
          display: flex;
          justify-content: center;
          margin-top: 3rem;
        }

        .pagination {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: white;
          padding: 1rem;
          border-radius: 1rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          border: 2px solid #f8f9fa;
        }

        .pagination-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: #f8f9fa;
          border: 2px solid #e9ecef;
          border-radius: 0.5rem;
          color: #495057;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .pagination-btn:hover:not(:disabled) {
          background: #ff8c00;
          color: white;
          border-color: #ff8c00;
          transform: translateY(-1px);
        }

        .pagination-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .pagination-numbers {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          margin: 0 0.5rem;
        }

        .pagination-number {
          width: 2.5rem;
          height: 2.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 0.5rem;
          border: 2px solid transparent;
          background: transparent;
          color: #6c757d;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .pagination-number:hover {
          background: #f8f9fa;
          color: #212529;
        }

        .pagination-number.active {
          background: #ff8c00;
          color: white;
          border-color: #ff8c00;
        }

        .pagination-dots {
          width: 2.5rem;
          height: 2.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #adb5bd;
        }

        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          color: #6c757d;
        }

        .empty-icon {
          margin-bottom: 1rem;
          color: #adb5bd;
        }

        .empty-state h3 {
          font-size: 1.5rem;
          color: #212529;
          margin: 0 0 0.5rem;
          font-weight: 700;
        }

        .empty-state p {
          font-size: 1.1rem;
          margin: 0 0 2rem;
          max-width: 500px;
          margin-left: auto;
          margin-right: auto;
        }

        /* Saved Jobs CTA */
        .saved-jobs-cta {
          background: linear-gradient(135deg, #212529 0%, #000000 100%);
          margin: 4rem 1rem 0;
          border-radius: 1.5rem;
          overflow: hidden;
          position: relative;
          border: 2px solid #343a40;
        }

        .cta-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 3rem 2rem;
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
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.7; }
          50% { transform: translateY(-20px) scale(1.1); opacity: 1; }
        }

        .cta-text {
          flex: 1;
          color: white;
        }

        .cta-text h3 {
          font-size: 1.75rem;
          font-weight: 700;
          margin: 0 0 0.5rem;
        }

        .cta-text p {
          font-size: 1.1rem;
          opacity: 0.8;
          margin: 0;
          line-height: 1.6;
        }

        .cta-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 1.5rem;
          background: #ff8c00;
          color: white;
          border: 2px solid #ff8c00;
          border-radius: 0.75rem;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          flex-shrink: 0;
        }

        .cta-button:hover {
          background: #e67e00;
          border-color: #e67e00;
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(255, 140, 0, 0.4);
        }

        /* Loading State */
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 50vh;
          padding: 2rem;
        }

        .loading-spinner {
          margin-bottom: 1rem;
        }

        .spinner {
          width: 48px;
          height: 48px;
          border: 4px solid #e9ecef;
          border-top: 4px solid #ff8c00;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .loading-text {
          color: #6c757d;
          font-size: 1.1rem;
          margin: 0;
          font-weight: 500;
        }

        /* Error State */
        .error-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 50vh;
          padding: 2rem;
          text-align: center;
        }

        .error-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .error-container h2 {
          color: #212529;
          font-size: 1.75rem;
          margin: 0 0 0.5rem;
          font-weight: 700;
        }

        .error-container p {
          color: #6c757d;
          font-size: 1.1rem;
          margin: 0 0 2rem;
          max-width: 500px;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .hero-stats {
            gap: 2rem;
          }
          
          .jobs-grid {
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          }
          
          .filters-grid {
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          }
        }

        @media (max-width: 768px) {
          .hero-section {
            padding: 3rem 1rem 4rem;
          }
          
          .hero-stats {
            flex-direction: column;
            gap: 1.5rem;
          }
          
          .search-section {
            margin: -2rem 1rem 0;
            border-radius: 1rem;
          }
          
          .search-container {
            padding: 1.5rem;
          }
          
          .jobs-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          
          .job-card-header {
            padding: 1rem;
          }
          
          .job-card-body {
            padding: 1rem;
          }
          
          .job-card-footer {
            padding: 1rem;
          }
          
          .company-info {
            gap: 0.75rem;
          }
          
          .company-logo {
            width: 50px;
            height: 50px;
          }
          
          .job-title {
            font-size: 1.1rem;
          }
          
          .job-meta {
            flex-direction: column;
            gap: 0.5rem;
          }
          
          .meta-item {
            font-size: 0.85rem;
          }
          
          .filters-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          
          .cta-content {
            flex-direction: column;
            text-align: center;
            padding: 2rem 1.5rem;
          }
          
          .cta-text h3 {
            font-size: 1.5rem;
          }
          
          .pagination {
            flex-wrap: wrap;
            gap: 0.25rem;
          }
          
          .pagination-btn .btn-text {
            display: none;
          }
          
          .results-section {
            padding: 2rem 1rem;
          }
        }

        @media (max-width: 480px) {
          .hero-section {
            padding: 2rem 1rem 3rem;
          }
          
          .search-input {
            font-size: 1rem;
            padding: 1rem 1rem 1rem 3rem;
          }
          
          .search-icon {
            left: 1rem;
          }
          
          .clear-search {
            right: 0.75rem;
          }
          
          .job-card-header {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }
          
          .job-type-badge {
            align-self: flex-start;
          }
          
          .action-buttons {
            flex-direction: column;
          }
          
          .btn-save {
            flex: 1;
            justify-content: center;
          }
          
          .company-info {
            width: 100%;
          }
          
          .job-title {
            font-size: 1rem;
          }
          
          .company-name {
            font-size: 0.9rem;
          }
          
          .pagination-numbers {
            order: -1;
            margin: 0;
          }
          
          .pagination {
            flex-direction: column;
            gap: 1rem;
          }
        }

        @media (max-width: 360px) {
          .search-container {
            padding: 1rem;
          }
          
          .hero-text h1 {
            font-size: 2rem;
          }
          
          .hero-text p {
            font-size: 1rem;
          }
          
          .job-card-header,
          .job-card-body,
          .job-card-footer {
            padding: 0.75rem;
          }
          
          .btn {
            padding: 0.625rem 1rem;
            font-size: 0.85rem;
          }
          
          .filters-panel.show {
            padding: 1rem;
          }
        }

        /* High DPI displays */
        @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
          .company-logo img {
            image-rendering: -webkit-optimize-contrast;
            image-rendering: crisp-edges;
          }
        }

        /* Landscape orientation adjustments */
        @media (max-height: 500px) and (orientation: landscape) {
          .hero-section {
            padding: 2rem 1rem 3rem;
          }
          
          .hero-stats {
            flex-direction: row;
            gap: 1.5rem;
          }
        }

        /* Dark mode friendly adjustments */
        @media (prefers-color-scheme: dark) {
          .job-search-container {
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
          }
          
          .search-section {
            background: #ffffff;
            border-color: #e9ecef;
          }
          
          .job-card {
            background: #ffffff;
            border-color: #e9ecef;
          }
        }

        /* Print styles */
        @media print {
          .hero-section,
          .search-section,
          .saved-jobs-cta {
            display: none;
          }
          
          .job-card {
            break-inside: avoid;
            box-shadow: none;
            border: 2px solid #000;
          }
          
          .pagination-wrapper {
            display: none;
          }
          
          .btn-primary {
            background: #000 !important;
            color: #fff !important;
          }
          
          .btn-save.saved {
            background: #000 !important;
            color: #fff !important;
          }
        }
        `}</style>
    </>
  );
};

export default JobSearchAndOffers;
