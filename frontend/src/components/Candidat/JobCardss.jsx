import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Search, 
  Briefcase, 
  Bookmark, 
  BookmarkCheck,
  ChevronLeft, 
  ChevronRight,
  MoreHorizontal,
  Heart,
  ArrowRight,
  Building,
  DollarSign,
  Clock,
  Users,
  Filter
} from 'lucide-react';

const JobCard = ({ job, onApply, isApplied, onSave, isSaved }) => {
  const handleViewDetails = () => {
    window.location.href = `/offres/${job.id}`;
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center overflow-hidden">
            {job.logo ? (
              <img src={job.logo} alt="Logo" className="w-full h-full object-cover" />
            ) : (
              <Building className="w-6 h-6 text-white" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-lg text-gray-900 mb-1">{job.title}</h3>
            <p className="text-gray-600 text-sm">{job.company}</p>
          </div>
        </div>
        <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
          {job.type}
        </span>
      </div>

      {/* Info */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-gray-600 text-sm">
          <MapPin className="w-4 h-4" />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 text-sm">
          <Clock className="w-4 h-4" />
          <span>{job.experience}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 text-sm">
          <DollarSign className="w-4 h-4" />
          <span className="font-medium text-gray-900">{job.salary}</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
        {job.description}
      </p>

      {/* Skills */}
      {job.skills && job.skills.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {job.skills.slice(0, 4).map((skill, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
            >
              {skill}
            </span>
          ))}
          {job.skills.length > 4 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-md">
              +{job.skills.length - 4}
            </span>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
        {isApplied ? (
          <button 
            disabled
            className="flex-1 bg-gray-100 text-gray-500 px-4 py-2 rounded-lg font-medium cursor-not-allowed"
          >
            Déjà postulé
          </button>
        ) : (
          <button 
            onClick={handleViewDetails}
            className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
          >
            Postuler
          </button>
        )}
        
        <button 
          onClick={() => onSave(job.id, isSaved)}
          className={`p-2 rounded-lg transition-all duration-200 ${
            isSaved 
              ? 'bg-orange-100 text-orange-600 hover:bg-orange-200' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          title={isSaved ? "Retirer des favoris" : "Ajouter aux favoris"}
        >
          {isSaved ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getVisiblePages = () => {
    const delta = 1;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
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
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots.filter((item, index, arr) => arr.indexOf(item) === index);
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Précédent</span>
      </button>

      <div className="hidden sm:flex items-center gap-1">
        {getVisiblePages().map((page, index) => (
          page === '...' ? (
            <span key={`dots-${index}`} className="px-3 py-2 text-gray-500">
              <MoreHorizontal className="w-4 h-4" />
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-10 h-10 text-sm font-medium rounded-lg transition-colors ${
                currentPage === page
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {page}
            </button>
          )
        ))}
      </div>

      <div className="sm:hidden flex items-center gap-2 px-3 py-2 text-sm text-gray-600">
        <span>{currentPage}</span>
        <span>/</span>
        <span>{totalPages}</span>
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="hidden sm:inline">Suivant</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

const SavedJobsSection = () => {
  return (
    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-8 text-center mb-8">
      <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Heart className="w-8 h-8 text-white" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Vos Offres Favorites</h2>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        Retrouvez facilement toutes les opportunités qui vous intéressent
      </p>
      <a
        href="/SavedJobOffers"
        className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
      >
        Consulter mes favoris
        <ArrowRight className="w-4 h-4" />
      </a>
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
  const [searchTerm, setSearchTerm] = useState('');
  const [savedJobs, setSavedJobs] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  
  const jobsPerPage = 6;

  // Fetch jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/je`);
        const data = await response.json();
        const updatedJobs = data.map(job => ({
          ...job,
          logo: job.logo || null
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

  // Fetch candidate info and applied jobs
  useEffect(() => {
    const fetchCandidateData = async () => {
      try {
        const candidateResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/current_candidate`, { 
          credentials: 'include' 
        });
        const candidateData = await candidateResponse.json();
        setCandidateId(candidateData.id);

        const [applicationsResponse, savedJobsResponse] = await Promise.all([
          fetch(`${process.env.REACT_APP_API_URL}/api/getapplications`, { credentials: 'include' }),
          fetch(`${process.env.REACT_APP_API_URL}/api/saved-jobs`, { credentials: 'include' })
        ]);

        const applications = await applicationsResponse.json();
        const savedJobsData = await savedJobsResponse.json();

        setAppliedJobs(applications.map(app => app.job_offer_id));
        setSavedJobs(savedJobsData.map(job => job.id));
      } catch (error) {
        console.error("Erreur lors du chargement des données candidat:", error);
      }
    };

    fetchCandidateData();
  }, []);

  // Filter jobs
  useEffect(() => {
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
  }, [searchTerm, selectedPoste, selectedLieu, selectedSalaire, selectedDomaine, jobs]);

  const handleApply = async (jobId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/applications`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job_offer_id: jobId, candidate_id: candidateId })
      });
      
      if (response.ok) {
        alert("Votre candidature a été soumise avec succès !");
        setAppliedJobs(prev => [...prev, jobId]);
        
        // Notify recruiter
        fetch(`${process.env.REACT_APP_API_URL}/api/notify-recruiter/${jobId}`, {
          method: 'POST',
          credentials: 'include'
        }).catch(err => console.error("Erreur notification recruteur:", err));
      }
    } catch (error) {
      console.error('Erreur postulation :', error);
      alert("Erreur lors de la soumission de la candidature.");
    }
  };

  const handleSaveJob = async (jobId, currentlySaved) => {
    const endpoint = currentlySaved ? 'unsave-job' : 'save-job';
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/${endpoint}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job_offer_id: jobId, candidate_id: candidateId })
      });
      
      if (response.ok) {
        setSavedJobs(prev => 
          currentlySaved 
            ? prev.filter(id => id !== jobId)
            : [...prev, jobId]
        );
      }
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      alert("Impossible de modifier la sauvegarde pour le moment.");
    }
  };

  // Pagination
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des offres...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500 text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Erreur de chargement</h2>
          <p className="text-gray-600">Impossible de charger les offres. Veuillez réessayer plus tard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Section */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Main Search */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher un poste, une entreprise..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
            />
          </div>

          {/* Filters Toggle */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors lg:hidden"
            >
              <Filter className="w-4 h-4" />
              Filtres
            </button>
            
            <div className="text-sm text-gray-600">
              {filteredJobs.length} offre{filteredJobs.length > 1 ? 's' : ''} trouvée{filteredJobs.length > 1 ? 's' : ''}
            </div>
          </div>

          {/* Filters */}
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 ${showFilters ? 'block' : 'hidden lg:grid'}`}>
            <select
              value={selectedPoste}
              onChange={(e) => setSelectedPoste(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
            >
              <option value="">Tous les postes</option>
              {[...new Set(jobs.map(job => job.title))].map((poste, index) => (
                <option key={index} value={poste}>{poste}</option>
              ))}
            </select>

            <select
              value={selectedLieu}
              onChange={(e) => setSelectedLieu(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
            >
              <option value="">Toutes les villes</option>
              {[...new Set(jobs.map(job => job.location))].map((lieu, index) => (
                <option key={index} value={lieu}>{lieu}</option>
              ))}
            </select>

            <select
              value={selectedSalaire}
              onChange={(e) => setSelectedSalaire(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
            >
              <option value="">Tous les salaires</option>
              {[...new Set(jobs.map(job => job.salary))].map((salaire, index) => (
                <option key={index} value={salaire}>{salaire}</option>
              ))}
            </select>

            <select
              value={selectedDomaine}
              onChange={(e) => setSelectedDomaine(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
            >
              <option value="">Tous les domaines</option>
              {[...new Set(jobs.map(job => job.type))].map((domaine, index) => (
                <option key={index} value={domaine}>{domaine}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Saved Jobs CTA */}
        <SavedJobsSection />

        {/* Job Results */}
        {filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune offre trouvée</h3>
            <p className="text-gray-600">Essayez d'ajuster vos critères de recherche</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default JobSearchAndOffers;
