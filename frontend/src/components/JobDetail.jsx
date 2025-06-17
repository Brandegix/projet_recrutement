import React, { useState, useEffect, useRef } from 'react';
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

    // No need for imageLoaded and imageError states if we're not blocking on them
    // const [imageLoaded, setImageLoaded] = useState(false);
    // const [imageError, setImageError] = useState(false);

    const [experience, setExperience] = useState('');
    const [domain, setDomain] = useState('');
    const [motivationLetter, setMotivationLetter] = useState('');

    // Using useRef for cleaner timeout management
    const loadingTimeoutRef = useRef(null);

    useEffect(() => {
        const fetchJobDetails = async () => {
            // Reset states for new fetch
            setLoading(true); // Always start loading
            setJob(null);
            setError(null);

            // Clear any pending timeouts from previous renders/fetches
            if (loadingTimeoutRef.current) {
                clearTimeout(loadingTimeoutRef.current);
            }

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

                // Immediately set loading to false after job data is fetched
                // The image will load asynchronously and not block the main content
                setLoading(false);

            } catch (err) {
                console.error("Error fetching job details:", err);
                setError("Impossible de charger les détails de l'offre. Veuillez réessayer.");
                setLoading(false); // Set to false on error so the error message can be displayed
            }
        };

        fetchJobDetails();

        // Cleanup function for the effect
        return () => {
            if (loadingTimeoutRef.current) {
                clearTimeout(loadingTimeoutRef.current);
            }
        };
    }, [id]); // Depend on ID, so it re-fetches when ID changes

    useEffect(() => {
        // This can run independently, it doesn't block the job detail display
        fetch(`${process.env.REACT_APP_API_URL}/api/current_candidate`, { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                setCandidateId(data.id);
            })
            .catch(err => console.error("Erreur candidate:", err));
    }, []); // Runs only once on mount

    // Removed the image-specific useEffect and states (imageLoaded, imageError)
    // because we are no longer blocking the `loading` state on image completion.
    // The image will load in the background, and the default image handling will
    // still work if the original image fails.

    const handleApply = (jobId) => {
       

        fetch(`${process.env.REACT_APP_API_URL}/api/applications`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ job_offer_id: jobId, candidate_id: candidateId })
        })
        .then(response => {
            if (!response.ok) {
                // If response is not 2xx, throw an error to be caught by .catch()
                return response.json().then(errData => {
                    throw new Error(errData.message || "Erreur lors de la soumission de la candidature.");
                });
            }
            return response.json();
        })
        .then(data => {
            alert("Votre candidature a été soumise avec succès !");
            navigate('/applications');

            // Notify recruiter with additional info - this is a separate, non-blocking call
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
            alert(`Erreur lors de la soumission de la candidature: ${error.message || 'Veuillez réessayer.'}`);
        });
    };

    if (loading) {
        return (
            <Loading message="Chargement des détails de l'offre..." />
        );
    }

    if (error) {
        return (
            <>
                <Navbar />
                <div className="job-detail-container">
                    <div className="error-message">{error}</div>
                </div>
                <Footer />
            </>
        );
    }

    // Only render if job data is available (which it should be if not loading and no error)
    if (!job) {
        // This case should ideally not be reached if loading is handled correctly,
        // but it's a good safeguard.
        return (
            <>
                <Navbar />
                <div className="job-detail-container">
                    <div className="error-message">Offre non trouvée ou données manquantes.</div>
                </div>
                <Footer />
            </>
        );
    }

    // Render the actual content
    return (
        <>
            <Navbar />
            <div className="job-detail-container">
                <div className="job-detail-card">
                    <div className="job-headerr">
                        <div className="company-info">
                            <img
                                src={job.logo || '/default-company.png'}
                                alt={job.company || 'Company Logo'}
                                className="company-logo"
                                // handleImageLoad and handleImageError are less critical for blocking loading now
                                // but still useful for debugging or specific image-related UX.
                                // You can keep them if you have specific visual feedback for image load/error.
                                // onLoad={handleImageLoad}
                                // onError={handleImageError}
                                loading="lazy" // Still beneficial for images not immediately in viewport
                            />
                        </div>
                        <h2>{job.company}</h2>
                        <h1>{job.title}</h1>
                    </div>

                    <div className="job-details">
                        <div className="detail-section">
                            <h3>Description</h3>
                            {/* Using dangerouslySetInnerHTML for HTML descriptions, be cautious of XSS */}
                            <p className="job-description" dangerouslySetInnerHTML={{ __html: job.description }}></p>

                            <div className="detail-section">
                                <h3>Compétences requises</h3>
                                <div className="skills-list">
                                    {Array.isArray(job.skills) && job.skills.length > 0 ? job.skills.map((skill, index) => (
                                        <span key={index} className="skill-tag">{skill}</span>
                                    )) : <p>Aucune compétence spécifiée.</p>}
                                </div>
                            </div>
                        </div>
                        <div className="job-info-grid">
                            <div className="info-item">
                                <h4>Localisation</h4>
                                <p>{job.location || 'Non spécifié'}</p>
                            </div>
                            <div className="info-item">
                                <h4>Type de contrat</h4>
                                <p>{job.type || 'Non spécifié'}</p>
                            </div>
                            <div className="info-item">
                                <h4>Expérience</h4>
                                <p>{job.experience || 'Non spécifié'}</p>
                            </div>
                            <div className="info-item">
                                <h4>Salaire</h4>
                                <p>{job.salary || 'Non spécifié'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="application-form">
                        <h3>Informations supplémentaires pour la candidature</h3>

                        <label htmlFor="experience">Expérience</label>
                        <input
                            id="experience"
                            type="text"
                            value={experience}
                            onChange={(e) => setExperience(e.target.value)}
                            placeholder="Ex : 3 ans en développement web"
                            className="form-input"
                        />

                        <label htmlFor="domain">Domaine d'activité</label>
                        <input
                            id="domain"
                            type="text"
                            value={domain}
                            onChange={(e) => setDomain(e.target.value)}
                            placeholder="Ex : Développement informatique"
                            className="form-input"
                        />

                        <label htmlFor="motivationLetter">Lettre de motivation</label>
                        <textarea
                            id="motivationLetter"
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
                        <button onClick={() => navigate(-1)} className="apply-button secondary-button"> {/* Added a class for styling */}
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
