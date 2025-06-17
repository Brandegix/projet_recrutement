import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaMapMarkerAlt, FaBriefcase ,FaBookmark, FaRegBookmark} from 'react-icons/fa';
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
const ReadMoreText = ({ text, maxLength = 150 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!text) return <p style={{ color: '#aaa', fontSize: '0.9rem' }}>Aucune description fournie</p>;
  
  if (text.length <= maxLength) return <p style={{ color: '#aaa', fontSize: '0.9rem' }}>{text}</p>;
  
  return (
    <div>
      <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '8px' }}>
        {isExpanded ? text : `${text.slice(0, maxLength)}...`}
      </p>
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          background: 'none',
          border: 'none',
          color: '#ff6b35',
          fontSize: '0.8rem',
          cursor: 'pointer',
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontWeight: '600'
        }}
      >
        {isExpanded ? (
          <>
            <span>Voir moins</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
          </>
        ) : (
          <>
            <span>Lire la suite</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </>
        )}
      </button>
    </div>
  );
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
      <ReadMoreText text={job.description} maxLength={150} />
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
          className="save-btn" 
          onClick={() => onSave(job.id)} 
          title={isSaved ? "Retirer des sauvegardés" : "Sauvegarder l'offre"}
          style={{marginLeft: '10px', width:  '60px'}}
        >
          {isSaved ? <FaBookmark color="gold" /> : <FaRegBookmark />}
        </button>
    </div>
  </div>
);

};
const SavedJobOffers = (job, onApply, isApplied, onSave, isSaved) => {
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
        console.log(savedJobs);
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
  

    const handleSaveJob = (jobId) => {
      // Send POST request to backend to save job
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
        // If job was saved before, API might toggle it, so toggle locally as well
        setSavedJobs(prev =>
          prev.includes(jobId) ? prev.filter(id => id !== jobId) : [...prev, jobId]
        );
      })
      .catch(error => {
        console.error('Erreur sauvegarde de l\'offre :', error);
        alert("Impossible de sauvegarder l'offre pour le moment.");
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
  const savedJobOffers = jobs.filter(job => savedJobs.includes(job.id));

  return (
    <>
      <Navbar />
      <h2 style={{ marginTop: "40px" }}>Offres sauvegardées</h2>
      <div className="offers-wrapper">
    <div className="offers-grid">
      {savedJobOffers.length === 0 ? (
        <p>Aucune offre sauvegardée.</p>
      ) : (
        savedJobOffers.map(job => (
          <JobCard
            key={job.id}
            job={job}
            onApply={() => {}} // Optional: disable apply or reuse
            isApplied={appliedJobs.includes(job.id)}
            onSave={handleSaveJob}
            isSaved={savedJobs.includes(job.id)}
          />
        ))
      )}
        </div>
      
    </div>
    <Footer/></>
  );
};

export default SavedJobOffers;

