import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../assets/css/JobDetail.css';
import Navbar from "./Navbara";
import Footer from "./Footer";
const JobDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [candidateId, setCandidateId] = useState(null);

    const [experience, setExperience] = useState('');
  const [domain, setDomain] = useState('');
  const [motivationLetter, setMotivationLetter] = useState('');

    useEffect(() => {
        const fetchJobDetails = async () => {
          try {
            const response = await axios.get(`http://localhost:5000/api/job_offers/${id}`);
            const jobData = response.data;
      
            // Provide a default logo if none present
            const jobWithDefaults = {
              ...jobData,
              logo: jobData.logo || "https://dummyimage.com/80x80/000/fff.png&text=No+Logo",
              description: jobData.description || "Description non disponible."
            };
      
            setJob(jobWithDefaults);
            setLoading(false);
          } catch (err) {
            setError("Impossible de charger les détails de l'offre");
            setLoading(false);
          }
        };
      
        fetchJobDetails();
      }, [id]);
      

    useEffect(() => {
        fetch("http://localhost:5000/api/current_candidate", { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                setCandidateId(data.id);
            })
            .catch(err => console.error("Erreur candidate:", err));
    }, []);

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
            navigate('/applications');
    
            // ✅ Notifier le recruteur avec infos supplémentaires
            fetch(`http://localhost:5000/api/notify-recruiter/${jobId}`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    experience: experience,
                    domain: domain,
                    motivationLetter: motivationLetter
                })
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
    
    if (loading) {
        return (
            <div className="job-detail-container">
                <div className="loading">Chargement...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="job-detail-container">
                <div className="error-message">{error}</div>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="job-detail-container">
                <div className="error-message">Offre non trouvée</div>
            </div>
        );
    }

    return (
        <>
      <Navbar />
        <div className="job-detail-container">
            <div className="job-detail-card">
                <div className="job-headerr">
                    
                    <div className="company-info">
                        <img src={job.logo || '/default-company.png'} alt={job.company} className="company-logo" />
                    </div>
                    <h2>{job.company}</h2>

                    <h1>{job.title}</h1>
                  


                </div>

                <div className="job-details">
                <div className="detail-section">
  <h3>Description</h3>
  <p className="job-description">{job.description}</p>

                    <div className="detail-section">
                        <h3>Compétences requises</h3>
                        <div className="skills-list">
                            {Array.isArray(job.skills) ? job.skills.map((skill, index) => (
                                <span key={index} className="skill-tag">{skill}</span>
                            )) : <span className="skill-tag">{job.skills}</span>}
                        </div>
                    </div>
                    </div>
                    <div className="job-info-grid">
                        <div className="info-item">
                            <h4>Localisation</h4>
                            <p>{job.location}</p>
                        </div>
                        <div className="info-item">
                            <h4>Type de contrat</h4>
                            <p>{job.type}</p>
                        </div>
                        <div className="info-item">
                            <h4>Expérience</h4>
                            <p>{job.experience}</p>
                        </div>
                        <div className="info-item">
                            <h4>Salaire</h4>
                            <p>{job.salary}</p>
                        </div>
                    </div>
                </div>

                <div className="application-form">
    <h3>Informations supplémentaires</h3>

    <label>Expérience</label>
    <input
        type="text"
        value={experience}
        onChange={(e) => setExperience(e.target.value)}
        placeholder="Ex : 3 ans en développement web"
        className="form-input"
    />

    <label>Domaine d'activité</label>
    <input
        type="text"
        value={domain}
        onChange={(e) => setDomain(e.target.value)}
        placeholder="Ex : Développement informatique"
        className="form-input"
    />

    <label>Lettre de motivation</label>
    <textarea
        value={motivationLetter}
        onChange={(e) => setMotivationLetter(e.target.value)}
        placeholder="Expliquez pourquoi vous postulez..."
        rows={5}
        className="form-textarea"
    />
</div>

                <div className="job-actions">
                    <button onClick={() => handleApply(job.id)} className="apply-button">
                        Postuler
                    </button>
                    <button onClick={() => navigate(-1)} className="apply-button">
                        Retour
                    </button>
                </div>
            </div>
        </div>
        <Footer />
        </>
    );
};

export default JobDetail; 