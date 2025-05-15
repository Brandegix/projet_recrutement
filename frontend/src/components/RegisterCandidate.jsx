import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../assets/css/form.css";
import { Link } from "react-router-dom";
import Footer from '../components/Footer'; // chemin correct selon ton arborescence
import Navbar from "../components/Navbara";

function RegisterCandidate() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    dateOfBirth: "",
    skills: [] // Array for skills with their levels
  });

  const [skills, setSkills] = useState([{ name: '', level: 0 }]); // Each skill with a level

  // Handle changes for skills
  const handleSkillChange = (index, field, value) => {
    const updatedSkills = [...skills];
    updatedSkills[index][field] = field === "level" ? parseInt(value) : value;
    setSkills(updatedSkills);
  };

  // Add a new skill entry
  const addSkill = () => {
    setSkills([...skills, { name: '', level: 0 }]);
  };

  // Remove a skill entry
  const removeSkill = (index) => {
    const updatedSkills = [...skills];
    updatedSkills.splice(index, 1);
    setSkills(updatedSkills);
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Handle form data changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Include skills data in form submission
    const updatedFormData = {
      ...formData,
      skills: skills.map(skill => ({ name: skill.name, level: skill.level }))
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/candidates/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFormData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de l'inscription");
      }

      localStorage.setItem("userId", data.id);
      localStorage.setItem("userRole", "candidate");
      navigate("/CandidatePagefrom");

    } catch (err) {
      setError(err.message);
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Navbar />
     
      <div className="register-card">
        <div className="register-header">Inscription </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <input
              type="text"
              name="username"
              placeholder="Identifiant *"
              value={formData.username}
              onChange={handleChange}
              required
              minLength={3}
            />
            <input
              type="password"
              name="password"
              placeholder="Mot de passe *"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>
          <div className="form-row">
            <input
              type="text"
              name="name"
              placeholder="Nom complet *"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email *"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="tel"
              name="phoneNumber"
              placeholder="Téléphone *"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              pattern="[0-9]{10}"
              title="Numéro à 10 chiffres"
            />
          </div>

          <div className="form-row">
            <input
              type="text"
              name="address"
              placeholder="Adresse"
              value={formData.address}
              onChange={handleChange}
            />
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="form-row">
            <h4>Compétences</h4>
            {skills.map((skill, index) => (
              <div key={index} className="skill-entry">
                <input
                  type="text"
                  placeholder="Nom de la compétence"
                  value={skill.name}
                  onChange={(e) => handleSkillChange(index, 'name', e.target.value)}
                  required
                />
                <input
                  type="number"
                  placeholder="Niveau (0-100)"
                  value={skill.level}
                  onChange={(e) => handleSkillChange(index, 'level', e.target.value)}
                  min="0"
                  max="100"
                  required
                />
                                <button  type="button" onClick={addSkill}>Ajouter une compétence</button>

                <button  type="button" onClick={() => removeSkill(index)}>Supprimer</button>
              </div>
              
            ))}
         
          </div>

          <button 
            className="submit-btn" 
            type="submit"
            disabled={loading}
          >
            {loading ? "Chargement..." : "S'inscrire"}
          </button>
        </form>
      </div>
      <Footer/>
    </>
  );
}

export default RegisterCandidate;