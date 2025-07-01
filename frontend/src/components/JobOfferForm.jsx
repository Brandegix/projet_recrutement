import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../assets/css/JobOfferForm.css";
import Navbar from "../components/Navbara";
import Footer from "../components/Footer";
import SEO from "./SEO";

function JobOfferForm() {
    const [title, setTitle] = useState("");
    const [location, setLocation] = useState("");
    const [experience, setExperience] = useState("");
    const [description, setDescription] = useState("");
    const [skills, setSkills] = useState("");
    const [salary, setSalary] = useState("");
    const [company, setCompany] = useState("");
    const [type, setType] = useState("");
    const [logo, setLogo] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);
    const navigate = useNavigate();

    const recruiterId = localStorage.getItem("userId");

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
            if (!allowedTypes.includes(file.type)) {
                alert('Veuillez sélectionner un fichier image valide (JPEG, PNG, GIF)');
                return;
            }
            
            // Validate file size (e.g., max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('La taille du fichier ne doit pas dépasser 5MB');
                return;
            }
            
            setLogo(file);
            
            // Create preview URL
            const reader = new FileReader();
            reader.onload = (e) => {
                setLogoPreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeLogo = () => {
        setLogo(null);
        setLogoPreview(null);
        // Reset the file input
        const fileInput = document.getElementById('logo-input');
        if (fileInput) {
            fileInput.value = '';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', title);
        formData.append('company', company);
        formData.append('location', location);
        formData.append('experience', experience);
        formData.append('description', description);
        formData.append('skills', skills);
        formData.append('salary', salary);
        formData.append('type', type);
        formData.append('recruiter_id', recruiterId);
        if (logo) {
            formData.append('logo', logo);
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/job_offers`, {
                method: "POST",
                body: formData,
                credentials: 'include',
            });

            const result = await response.json();

            if (response.ok) {
                alert("Offre d'emploi publiée avec succès !");
                navigate("/RecruiterJobOffers");
            } else {
                if (response.status === 403) {
                    alert("Votre abonnement n'est pas actif. Veuillez contacter l'administrateur.");
                } else {
                    alert("Erreur : " + result.error);
                }
            }
            
        } catch (error) {
            alert("Erreur lors de la publication de l'offre : " + error.message);
        }
    };

    return (
        <>
            <Navbar />
            <SEO title="Publier offre" /> 
            <div className="job-offer-form-container">
                <div className="form-header">
                    <h1>Publier une Nouvelle Offre d'Emploi</h1>
                    <p>Créez une offre d'emploi attractive pour trouver les candidats parfaits</p>
                </div>

                <form 
                    onSubmit={handleSubmit} 
                    className="job-form"
                    style={{
                        maxWidth: "1000px",
                        width: "90%",
                        margin: "auto",
                        padding: "20px",
                    }}
                >
                    <div className="form-row">
                        <div className="input-group">
                            <label>Titre du Poste</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="ex: Développeur Web Senior"
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Lieu</label>
                            <input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="ex: Casablanca, Rabat .."
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="input-group">
                            <label>Expérience Requise</label>
                            <input
                                type="text"
                                value={experience}
                                onChange={(e) => setExperience(e.target.value)}
                                placeholder="ex: 2+ ans"
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Type de Contrat</label>
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                required
                            >
                                <option value="">Sélectionner un type</option>
                                <option value="CDI">CDI</option>
                                <option value="CDD">CDD</option>
                                <option value="Freelance">Freelance</option>
                                <option value="Stage">Stage</option>
                                <option value="Télétravail">Télétravail</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="input-group">
                            <label>Compétences Requises</label>
                            <input
                                type="text"
                                value={skills}
                                onChange={(e) => setSkills(e.target.value)}
                                placeholder="ex: JavaScript, React, Node.js"
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Salaire</label>
                            <input
                                type="text"
                                value={salary}
                                onChange={(e) => setSalary(e.target.value)}
                                placeholder="ex: 8 000 MAD"
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group full-width">
                        <label>Entreprise</label>
                        <input
                            type="text"
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            placeholder="ex: BrandeGix"
                            required
                        />
                    </div>

                    {/* Logo Upload Section */}
                    <div className="input-group full-width">
                        <label>Logo de l'Entreprise</label>
                        <div className="logo-upload-container" style={{
                            border: '2px dashed #ddd',
                            borderRadius: '8px',
                            padding: '20px',
                            textAlign: 'center',
                            backgroundColor: '#fafafa'
                        }}>
                            {!logoPreview ? (
                                <div>
                                    <input
                                        type="file"
                                        id="logo-input"
                                        accept="image/*"
                                        onChange={handleLogoChange}
                                        style={{ display: 'none' }}
                                    />
                                    <label 
                                        htmlFor="logo-input" 
                                        style={{
                                            cursor: 'pointer',
                                            color: '#007bff',
                                            fontSize: '16px',
                                            display: 'block'
                                        }}
                                    >
                                        📁 Cliquez pour sélectionner un logo
                                    </label>
                                    <p style={{ 
                                        margin: '10px 0 0 0', 
                                        fontSize: '12px', 
                                        color: '#666' 
                                    }}>
                                        Formats acceptés: JPEG, PNG, GIF (Max: 5MB)
                                    </p>
                                </div>
                            ) : (
                                <div>
                                    <img 
                                        src={logoPreview} 
                                        alt="Logo preview" 
                                        style={{
                                            maxWidth: '150px',
                                            maxHeight: '150px',
                                            objectFit: 'contain',
                                            border: '1px solid #ddd',
                                            borderRadius: '4px'
                                        }}
                                    />
                                    <div style={{ marginTop: '10px' }}>
                                        <button
                                            type="button"
                                            onClick={removeLogo}
                                            style={{
                                                background: '#dc3545',
                                                color: 'white',
                                                border: 'none',
                                                padding: '5px 15px',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                fontSize: '12px'
                                            }}
                                        >
                                            Supprimer
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="input-group full-width">
                        <label>Description du Poste</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Décrivez le rôle, les responsabilités, les qualifications et les avantages..."
                            required
                            rows="6"
                        />
                    </div>

                    <div className="form-actions">
                        <button 
                            className="submit-button" 
                            onClick={() => navigate("/RecruiterJobOffers")} 
                            type="button"
                        >
                            Annuler
                        </button>
                        <button className="submit-button" type="submit">
                            Publier 
                        </button>
                    </div>
                </form>
            </div>
            <Footer />
        </>
    );
}

export default JobOfferForm;
