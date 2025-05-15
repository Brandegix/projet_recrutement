import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaMapMarkerAlt, FaBriefcase } from 'react-icons/fa';
import '../assets/css/JobCards.css';

const JobCard = ({ job }) => (
  <div className="job-card">
    <div className="job-header">
      <div className="job-logo">
        <img
          src={job.logo && job.logo.startsWith("http")
            ? job.logo
            : "https://dummyimage.com/80x80/000/fff.png&text=No+Logo"}
          alt={job.logo ? "Logo de l'entreprise" : "Logo par défaut"}
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
    </div>
  </div>
);

function JobCards() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [selectedPoste, setSelectedPoste] = useState('');
  const [selectedLieu, setSelectedLieu] = useState('');
  const [selectedSalaire, setSelectedSalaire] = useState('');
  const [selectedDomaine, setSelectedDomaine] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/je')
      .then(response => {
        const updatedJobs = response.data.map(job => ({
          ...job,
          logo: job.logo && job.logo.startsWith("http")
            ? job.logo
            : "https://dummyimage.com/80x80/000/fff.png&text=No+Logo"
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

  const handleSearch = () => {
    const results = jobs.filter(job =>
      (selectedPoste === '' || job.title.toLowerCase().includes(selectedPoste.toLowerCase())) &&
      (selectedLieu === '' || job.location.toLowerCase().includes(selectedLieu.toLowerCase())) &&
      (selectedSalaire === '' || job.salary.toLowerCase().includes(selectedSalaire.toLowerCase())) &&
      (selectedDomaine === '' || job.type.toLowerCase().includes(selectedDomaine.toLowerCase()))
    );
    setFilteredJobs(results);
  };

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
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default JobCards;
