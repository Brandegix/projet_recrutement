import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../assets/css/JobOfferForm.css";
import Navbar from "../components/Navbara";
import Footer from "../components/Footer";

function JobOfferForm() {
    const [title, setTitle] = useState("");
    const [location, setLocation] = useState("");
    const [experience, setExperience] = useState("");
    const [description, setDescription] = useState("");
    const [skills, setSkills] = useState("");
    const [salary, setSalary] = useState("");
    const [type, setType] = useState("");
    const [logo, setLogo] = useState(null);
    const navigate = useNavigate();

    const recruiterId = localStorage.getItem("userId");
    const companyName = localStorage.getItem("companyName");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', title);
        formData.append('company', companyName);
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
            <div className="job-offer-form-container">
                <div className="form-header">
                    <h1>Publier une Nouvelle Offre d'Emploi</h1>
                    <p>Créez une offre d'emploi attractive pour trouver les candidats parfaits</p>
                </div>

                <form 
    onSubmit={handleSubmit} 
    className="job-form"
    style={{
        maxWidth: "1000px",  // Increase form width
        width: "90%",  // Ensure responsiveness
        margin: "auto",  // Keep it centered
        padding: "20px",  // Add spacing
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
                            <label> Salaire</label>
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
                        <button className="cancel-button" onClick={() => navigate("/RecruiterJobOffers")} type="button">
                            Annuler
                        </button>
                        <button className="submit-button" type="submit">
                            Publier l'Offre
                        </button>
                    </div>
                </form>
            </div>
            <Footer />
        </>
    );
}

export default JobOfferForm;