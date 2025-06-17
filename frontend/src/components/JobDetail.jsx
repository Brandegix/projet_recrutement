import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../assets/css/JobDetail.css';
import Navbar from "./Navbara";
import Footer from "./Footer";
import Loading from './Loading'; // Import your Loading component

const JobDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [candidateId, setCandidateId] = useState(null);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    const [experience, setExperience] = useState('');
    const [domain, setDomain] = useState('');
    const [motivationLetter, setMotivationLetter] = useState('');

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/job_offers/${id}`);
                const jobData = response.data;

                // Provide a default logo if none present
                const jobWithDefaults = {
                    ...jobData,
                    logo: jobData.logo || "/default-company.png",
                    description: jobData.description || "Description non disponible."
                };

                setJob(jobWithDefaults);
                // We no longer set loading to false here.
                // It will be set false once the image loads or errors,
                // or after a fallback timeout in the next useEffect.

            } catch (err) {
                console.error("Error fetching job details:", err);
                setError("Impossible de charger les détails de l'offre");
                setLoading(false); // Set to false on error so the error message can be displayed
            }
        };

        // Reset loading states when ID changes or component mounts
        setLoading(true);
        setImageLoaded(false);
        setImageError(false);
        setJob(null); // Clear previous job data when fetching new one
        setError(null); // Clear previous error

        fetchJobDetails();
    }, [id]);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/api/current_candidate`, { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                setCandidateId(data.id);
            })
            .catch(err => console.error("Erreur candidate:", err));
    }, []);

    // Handle image loading completion and set final loading state
    useEffect(() => {
        if (job) { // Only proceed if job data is successfully fetched
            // If the logo URL is empty/default, or if the image has truly loaded/errored
            if (!job.logo || job.logo === "/default-company.png" || imageLoaded || imageError) {
                // Small delay to ensure smooth transition
                const timer = setTimeout(() => {
                    setLoading(false); // Set loading to false only when job data is here AND image is handled
                }, 200); // You can adjust this delay (e.g., to 0 if no transition needed)
                return () => clearTimeout(timer);
            }
            // Fallback for cases where image might never fire load/error (e.g., broken URL not caught by browser)
            const fallbackTimer = setTimeout(() => {
                setLoading(false);
            }, 3000); // 3-second fallback to ensure it eventually loads
            return () => clearTimeout(fallbackTimer);

        }
    }, [job, imageLoaded, imageError]);


    const handleImageLoad = () => {
        setImageLoaded(true);
    };

    const handleImageError = () => {
        console.warn("Company logo failed to load or is missing");
        setImageError(true);
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
            navigate('/applications');

            // ✅ Notifier le recruteur avec infos supplémentaires
            fetch(`${process.env.REACT_APP_API_URL}/api/notify-recruiter/${jobId}`, {
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
            // Using your imported Loading component directly
            <Loading message="Chargement des détails de l'offre..." />
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
                            <img
                                src={job.logo || '/default-company.png'}
                                alt={job.company}
                                className="company-logo"
                                onLoad={handleImageLoad}
                                onError={handleImageError}
                                loading="lazy" // Add lazy loading
                            />
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
