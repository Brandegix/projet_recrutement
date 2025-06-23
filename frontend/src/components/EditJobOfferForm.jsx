import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbara';
import Footer from '../components/Footer';

const EditJobOfferForm = () => {
    const { offerId } = useParams();
    const navigate = useNavigate();
    const [offer, setOffer] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [generalError, setGeneralError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        const fetchOffer = async () => {
            try {
                setIsLoading(true);
                const res = await fetch(`${process.env.REACT_APP_API_URL}/api/recruiter/job_offers/${offerId}`, {
                    credentials: 'include',
                    method: 'GET',
                });
                if (res.ok) {
                    const data = await res.json();
                    setOffer(data);
                } else {
                    const errorData = await res.json();
                    setGeneralError(errorData.message || "Erreur lors du chargement de l'offre.");
                }
            } catch (err) {
                console.error("Erreur lors du chargement de l'offre:", err);
                setGeneralError("Erreur de connexion. Veuillez réessayer.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchOffer();
    }, [offerId]);

    const handleChange = (e) => {
        setOffer({ ...offer, [e.target.name]: e.target.value });
        setGeneralError(""); // Clear errors on change
        setSuccessMessage(""); // Clear success on change
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setGeneralError("");
        setSuccessMessage("");

        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/recruiter/job_offers/${offerId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(offer),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Échec de la modification.");
            }
            setSuccessMessage("Offre mise à jour avec succès !");
            setTimeout(() => navigate('/RecruiterJobOffers'), 1500);
        } catch (err) {
            setGeneralError(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    // --- Inline Styles Definitions ---
    const pageContainerStyle = {
        backgroundColor: '#f8fafc',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
        color: '#1a202c'
    };

    const mainContentStyle = {
        flex: 1,
        padding: '40px 20px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start'
    };

    const formCardStyle = {
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
        maxWidth: '600px',
        width: '100%',
        overflow: 'hidden',
        border: '1px solid #e2e8f0',
        // Animation cannot be defined inline
    };

    const headerStyle = {
        background: 'linear-gradient(135deg, #ff8c42 0%, #ff6b35 100%)',
        padding: '30px 25px',
        textAlign: 'center',
        color: 'white',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
    };

    const titleStyle = {
        fontSize: '2.2rem',
        fontWeight: '700',
        margin: 0,
        letterSpacing: '-0.02em'
    };

    const formSectionStyle = {
        padding: '30px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    };

    const inputGroupStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    };

    const labelStyle = {
        fontSize: '0.95rem',
        fontWeight: '600',
        color: '#374151'
    };

    const baseInputStyle = {
        padding: '12px 16px',
        borderRadius: '8px',
        border: '1px solid #cbd5e1',
        fontSize: '1rem',
        outline: 'none',
        transition: 'border-color 0.2s', // Note: :focus styles not possible with inline CSS
        boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)'
    };

    const textareaStyle = {
        ...baseInputStyle,
        height: '120px',
        resize: 'vertical',
        minHeight: '80px'
    };

    const actionButtonsStyle = {
        display: 'flex',
        gap: '15px',
        justifyContent: 'flex-end',
        paddingTop: '15px'
    };

    const baseButtonStyle = {
        padding: '10px 20px',
        borderRadius: '8px',
        border: 'none',
        fontSize: '0.95rem',
        fontWeight: '600',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
        // :hover, :active styles not possible with inline CSS
    };

    const cancelButtonPrimaryStyle = {
        ...baseButtonStyle,
        border: '1px solid #cbd5e1',
        backgroundColor: '#ffffff',
        color: '#475569',
    };

    const saveButtonPrimaryStyle = {
        ...baseButtonStyle,
        background: 'linear-gradient(135deg, #ff8c42 0%, #ff6b35 100%)',
        color: '#ffffff',
        boxShadow: '0 4px 10px rgba(255, 107, 53, 0.3)',
        opacity: isSaving ? 0.7 : 1,
        cursor: isSaving ? 'not-allowed' : 'pointer',
    };

    const messageStyle = {
        padding: '12px 16px',
        borderRadius: '8px',
        fontSize: '0.95rem',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
    };

    const successMessageStyle = {
        ...messageStyle,
        backgroundColor: '#f0fdf4',
        border: '1px solid #bbf7d0',
        color: '#16a34a',
    };

    const errorMessageStyle = {
        ...messageStyle,
        backgroundColor: '#fef2f2',
        border: '1px solid #fecaca',
        color: '#dc2626',
    };

    const loadingContainerStyle = {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 20px'
    };

    const loadingSpinnerStyle = {
        position: 'relative',
        width: '70px',
        height: '70px',
        marginBottom: '25px',
    };

    const spinnerRingStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        border: '4px solid transparent',
        borderTop: '4px solid #ff6b35',
        borderRadius: '50%',
        // animation: 'spin 1s linear infinite' // Cannot define @keyframes inline
    };

    const loadingTextStyle = {
        fontSize: '1.2rem',
        color: '#475569',
        fontWeight: '500'
    };


    if (isLoading || !offer) {
        return (
            <div style={pageContainerStyle}>
                <Navbar />
                <main style={loadingContainerStyle}>
                    <div style={loadingSpinnerStyle}>
                        <div style={spinnerRingStyle}></div>
                    </div>
                    <div style={loadingTextStyle}>Chargement de l'offre...</div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div style={pageContainerStyle}>
            <Navbar />
            <main style={mainContentStyle}>
                <div style={formCardStyle}>
                    <div style={headerStyle}>
                        <h1 style={titleStyle}>Modifier l'Offre</h1>
                    </div>

                    <form onSubmit={handleSubmit} style={formSectionStyle}>
                        {successMessage && (
                            <div style={successMessageStyle}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
                                    <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="currentColor"/>
                                </svg>
                                {successMessage}
                            </div>
                        )}
                        {generalError && (
                            <div style={errorMessageStyle}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
                                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="currentColor"/>
                                </svg>
                                {generalError}
                            </div>
                        )}

                        <div style={inputGroupStyle}>
                            <label htmlFor="title" style={labelStyle}>Titre de l'offre</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={offer.title || ''}
                                onChange={handleChange}
                                placeholder="Ex: Développeur Full Stack"
                                style={baseInputStyle}
                            />
                        </div>

                        <div style={inputGroupStyle}>
                            <label htmlFor="description" style={labelStyle}>Description</label>
                            <textarea
                                id="description"
                                name="description"
                                value={offer.description || ''}
                                onChange={handleChange}
                                placeholder="Décrivez les responsabilités, les compétences requises, les avantages..."
                                style={textareaStyle}
                            />
                        </div>

                        <div style={inputGroupStyle}>
                            <label htmlFor="company" style={labelStyle}>Entreprise</label>
                            <input
                                type="text"
                                id="company"
                                name="company"
                                value={offer.company || ''}
                                onChange={handleChange}
                                placeholder="Ex: Ma Super Entreprise"
                                style={baseInputStyle}
                            />
                        </div>

                        <div style={inputGroupStyle}>
                            <label htmlFor="salary" style={labelStyle}>Salaire (Optionnel)</label>
                            <input
                                type="number"
                                id="salary"
                                name="salary"
                                value={offer.salary || ''}
                                onChange={handleChange}
                                placeholder="Ex: 45000"
                                style={baseInputStyle}
                            />
                        </div>

                        <div style={inputGroupStyle}>
                            <label htmlFor="location" style={labelStyle}>Localisation</label>
                            <input
                                type="text"
                                id="location"
                                name="location"
                                value={offer.location || ''}
                                onChange={handleChange}
                                placeholder="Ex: Paris, France (télétravail accepté)"
                                style={baseInputStyle}
                            />
                        </div>

                        <div style={inputGroupStyle}>
                            <label htmlFor="experience" style={labelStyle}>Expérience requise</label>
                            <input
                                type="text"
                                id="experience"
                                name="experience"
                                value={offer.experience || ''}
                                onChange={handleChange}
                                placeholder="Ex: 2 ans d'expérience"
                                style={baseInputStyle}
                            />
                        </div>

                        <div style={inputGroupStyle}>
                            <label htmlFor="skills" style={labelStyle}>Compétences (séparées par des virgules)</label>
                            <input
                                type="text"
                                id="skills"
                                name="skills"
                                value={offer.skills || ''}
                                onChange={handleChange}
                                placeholder="Ex: JavaScript, React, Node.js"
                                style={baseInputStyle}
                            />
                        </div>

                        <div style={inputGroupStyle}>
                            <label htmlFor="type" style={labelStyle}>Type de contrat</label>
                            <input
                                type="text"
                                id="type"
                                name="type"
                                value={offer.type || ''}
                                onChange={handleChange}
                                placeholder="Ex: CDI, Freelance, Stage"
                                style={baseInputStyle}
                            />
                        </div>

                        <div style={actionButtonsStyle}>
                            <button
                                type="button"
                                onClick={() => navigate('/RecruiterJobOffers')}
                                style={cancelButtonPrimaryStyle}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
                                    <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor"/>
                                </svg>
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={isSaving}
                                style={saveButtonPrimaryStyle}
                            >
                                {isSaving ? (
                                    <>
                                        <div style={{
                                            width: '16px', height: '16px', border: '2px solid transparent',
                                            borderTop: '2px solid currentColor', borderRadius: '50%',
                                            // No direct inline animation for spin, will rely on external if defined
                                        }}></div>
                                        Enregistrement...
                                    </>
                                ) : (
                                    <>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
                                            <path d="M17 3H7C5.9 3 5 3.9 5 5V19C5 20.1 5.9 21 7 21H17C18.1 21 19 20.1 19 19V5C19 3.9 18.1 3 17 3ZM17 19H7V5H17V19ZM16 10H8V8H16V10Z" fill="currentColor"/>
                                        </svg>
                                        Enregistrer
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default EditJobOfferForm;
