import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaMapMarkerAlt, FaBriefcase ,FaBookmark, FaRegBookmark} from 'react-icons/fa';
import "../../assets/css/JobCards.css";
import Footer from '../../components/Footer';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import SavedJobOffers from  './SavedJobOffers';



const JobCard = ({job, onApply, isApplied, onSave, isSaved }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/offres/${job.id}`);
  };

  return (
  <div className="job-card">
    <div className="job-header">
      <div className="job-logo">
  <img
    src={job.logo ? job.logo : ""}
    alt={job.logo ? "Logo de l'entreprise" : ""}
  />
  <h3>{job.title}</h3> {/* Title now directly under the logo */}
</div>

<div className="job-info">
  <p>{job.company}</p>
  <span className="badge">{job.type}</span>
</div>

    </div>
    <div className="job-body">
      <p><FaMapMarkerAlt /> {job.location}</p>
      <p><FaBriefcase /> {job.experience}</p>
      <p style={{
          fontSize: '0.95rem',
          lineHeight: '1.6',
          margin: '0 0 15px 0',
          overflow: 'hidden', // Add this to prevent overflow
          display: '-webkit-box',
          WebkitLineClamp: 3, // Number of lines to show
          WebkitBoxOrient: 'vertical',
        }}>
          {job.description}
        </p>
      <div className="skills">
        {job.skills && job.skills.map((skill, index) => (
          <span key={index}>{skill}</span>
        ))}
      </div>
    </div>
    <div className="job-footer">
      <strong>{job.salary}</strong>
      {isApplied ? (
        <button className="applied-btn" disabled>Déjà postulé</button>
      ) : (
        <div className="button-group">
        <button className="view-details-btn" onClick={handleViewDetails}>Postuler</button>
      </div>

      )}
    <button 
  className="save-btn" style={{marginLeft: '10px', width:  '60px'}}
  onClick={() => onSave(job.id, isSaved)} 
  title={isSaved ? "Retirer des sauvegardés" : "Sauvegarder l'offre"}
>
  {isSaved ? <FaBookmark color="gold" /> : <FaRegBookmark />}
</button>

    </div>
  </div>
);

};
const JobSearchAndOffers = (job, onApply, isApplied, onSave, isSaved) => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [candidateId, setCandidateId] = useState(null);
  const [selectedPoste, setSelectedPoste] = useState('');
  const [selectedLieu, setSelectedLieu] = useState('');
  const [selectedSalaire, setSelectedSalaire] = useState('');
  const [selectedDomaine, setSelectedDomaine] = useState('');
  const [appliedJobs, setAppliedJobs] = useState([]); // Store IDs of jobs already applied to
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 10;
  const [searchTerm, setSearchTerm] = useState('');
  const [candidate, setCandidate] = useState(null);
  const [savedJobs, setSavedJobs] = useState([]); // Store IDs of saved jobs

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
  

  // After you get candidateId and set it somewhere (your existing useEffect)
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

const handleSavedJob = (jobId) => {
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

    // Fetch candidate & applications
    useEffect(() => {
      fetch(`${process.env.REACT_APP_API_URL}/api/current_candidate`, { credentials: 'include' })
      .then(res => res.json())
        .then(data => {
          setCandidate(data);
          setCandidateId(data.id);
  
          // Then get applied jobs
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
        // Unsave job
        handleUnsaveJob(jobId);
      } else {
        // Save job
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
        setAppliedJobs(prev => [...prev, jobId]);  // Mark job as applied
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

  if (loading) return <p>Chargement des offres...</p>;
  if (error) return <p>Erreur de chargement des offres. Vérifiez le backend.</p>;

  return (
    <>
      <div className="job-search-box">
        <input
          type="text"
          placeholder="Rechercher une offre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <div className="job-search-form">
          
          <div className="form-group">
            <label>Poste</label>
            <select value={selectedPoste} onChange={(e) => setSelectedPoste(e.target.value)}>
              <option value="">Tous</option>
              {[...new Set(jobs.map(job => job.title))].map((poste, index) => (
                <option key={index} value={poste}>{poste}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Lieu</label>
            <select value={selectedLieu} onChange={(e) => setSelectedLieu(e.target.value)}>
              <option value="">Tous</option>
              {[...new Set(jobs.map(job => job.location))].map((lieu, index) => (
                <option key={index} value={lieu}>{lieu}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Salaire</label>
            <select value={selectedSalaire} onChange={(e) => setSelectedSalaire(e.target.value)}>
              <option value="">Tous</option>
              {[...new Set(jobs.map(job => job.salary))].map((salaire, index) => (
                <option key={index} value={salaire}>{salaire}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Domaine</label>
            <select value={selectedDomaine} onChange={(e) => setSelectedDomaine(e.target.value)}>
              <option value="">Tous</option>
              {[...new Set(jobs.map(job => job.type))].map((domaine, index) => (
                <option key={index} value={domaine}>{domaine}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <button onClick={handleSearch}>Rechercher</button>
          </div>
        </div>
      </div>

      <div className="offers-wrapper">
        {filteredJobs.length === 0 ? (
          <p className="empty-message">Aucune offre disponible pour le moment.</p>
        ) : (
          <div className="offers-grid">
            {currentJobs.map((job) => (
              <JobCard 
                key={job.id} 
                job={job} 
                onApply={handleApply} 
                isApplied={appliedJobs.includes(job.id)}
                onSave={handleSaveJob}
                            />
            ))}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '1rem' }}>
  {/* Précédent button */}
  <button
    onClick={() => paginate(currentPage - 1)}
    disabled={currentPage === 1}
    style={{
      padding: '0.25rem 0.5rem',
      fontSize: '0.75rem',
      border: '1px solid #ccc',
      backgroundColor: '#f8f9fa',
      borderRadius: '4px',
      width: '70px',
      cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
      opacity: currentPage === 1 ? 0.6 : 1,
    }}
  >
    Précédent
  </button>

  {/* Page numbers */}
  {[...Array(totalPages)].map((_, idx) => (
    <button
      key={idx}
      onClick={() => paginate(idx + 1)}
      style={{
        padding: '0.25rem 0.5rem',
        fontSize: '0.75rem',
        border: '1px solid #ccc',
        backgroundColor: currentPage === idx + 1 ? '#007bff' : '#f8f9fa',
        color: currentPage === idx + 1 ? 'white' : 'black',
        borderRadius: '4px',
        width: '70px',
        cursor: 'pointer',
      }}
    >
      {idx + 1}
    </button>
  ))}

  {/* Suivant button */}
  <button
    onClick={() => paginate(currentPage + 1)}
    disabled={currentPage === totalPages}
    style={{
      padding: '0.25rem 0.5rem',
      fontSize: '0.75rem',
      border: '1px solid #ccc',
      backgroundColor: '#f8f9fa',
      borderRadius: '4px',
      width: '70px',
      cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
      opacity: currentPage === totalPages ? 0.6 : 1,
    }}
  >
    Suivant
  </button>
</div>

 <div style={{ textAlign: "center", marginTop: "20px" ,color: '#fc8e20'}}>
                       <Link to="/SavedJobOffers" style={{ color: '#007bff', textDecoration: 'none', color: '#fc8e20' }}>
                          Consulter les offres d'emploi sauvegardés
                       </Link>
                     </div>

    </>
  );
};

export default JobSearchAndOffers;


