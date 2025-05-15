import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaMapMarkerAlt, FaBriefcase } from 'react-icons/fa';
import "../../assets/css/JobCards.css";
import Footer from '../../components/Footer';

const JobCard = ({ job, onApply }) => (
  <div className="job-card">
    <div className="job-header">
      <div className="job-logo">
        <img 
          src={job.logo ? job.logo : "https://dummyimage.com/80x80/000/fff.png&text=No+Logo"} 
          alt={job.logo ? "Logo de l'entreprise" : "Pas de logo"} 
        />
      </div>
      <div className="job-info">
        <h3>{job.title}</h3>
        <p>{job.company}</p>
        <span className="badge">{job.type}</span>
      </div>
    </div>
    <div className="job-body">
      <p><FaMapMarkerAlt /> {job.location}</p>
      <p><FaBriefcase /> {job.experience}</p>
      <p>{job.description}</p>
      <div className="skills">
        {job.skills && job.skills.map((skill, index) => (
          <span key={index}>{skill}</span>
        ))}
      </div>
    </div>
    <div className="job-footer">
      <strong>{job.salary}</strong>
      <button className="apply-btn" onClick={() => onApply(job.id)}>Postuler</button>
    </div>
  </div>
);

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
  const jobsPerPage = 9;

  useEffect(() => {
    axios.get('http://localhost:5000/api/je')
      .then(response => {
        const updatedJobs = response.data.map(job => ({
          ...job,
          logo: job.logo && job.logo.startsWith("http") ? job.logo : "https://dummyimage.com/80x80/000/fff.png&text=No+Logo"
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
    fetch("http://localhost:5000/api/current_candidate", { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setCandidateId(data.id);
      })
      .catch(err => console.error("Erreur candidate:", err));
  }, []);

  const handleSearch = () => {
    const results = jobs.filter(job =>
      (selectedPoste === '' || job.title.toLowerCase().includes(selectedPoste.toLowerCase())) &&
      (selectedLieu === '' || job.location.toLowerCase().includes(selectedLieu.toLowerCase())) &&
      (selectedSalaire === '' || job.salary.toLowerCase().includes(selectedSalaire.toLowerCase())) &&
      (selectedDomaine === '' || job.type.toLowerCase().includes(selectedDomaine.toLowerCase()))
    );
    setFilteredJobs(results);
    setCurrentPage(1);
  };

  const handleApply = (jobId) => {
    fetch('http://localhost:5000/api/applications', {
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

        // ✅ Correction ici : guillemets autour de l'URL avec template string
        fetch(`http://localhost:5000/api/notify-recruiter/${jobId}`, {
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
              <JobCard key={job.id} job={job} onApply={handleApply} />
            ))}
          </div>
        )}
      </div>

      <div className="pagination">
        <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>Précédent</button>
        <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>Suivant</button>
      </div>

    </>
  );
};

export default JobSearchAndOffers;
