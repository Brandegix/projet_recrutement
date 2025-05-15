import React, { useEffect, useState } from "react";
import "../assets/css/EditProfile.css";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbara";
import Footer from "../components/Footer";

function EditProfile() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    skills: [],
    dateOfBirth: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/edit/candidate-profile`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        const formattedDate = data.dateOfBirth
          ? new Date(data.dateOfBirth).toISOString().split("T")[0]
          : "";
        setProfile({ ...data, dateOfBirth: formattedDate, skills: Array.isArray(data.skills) ? data.skills : [] });
      })
      .catch((err) => console.error("Erreur :", err));
  }, []);

  const handleSkillChange = (e, index) => {
    const { name, value } = e.target;
  
    setProfile((prev) => {
      const updatedSkills = [...prev.skills];
      if (!updatedSkills[index]) return prev;
  
      updatedSkills[index] = {
        ...updatedSkills[index],
        [name]: name === "level" ? Number(value) : value,
      };
  
      return { ...prev, skills: updatedSkills };
    });
  };
  
  const addSkill = () => {
    setProfile((prev) => ({
      ...prev,
      skills: [...prev.skills, { name: "", level: 0 }]
    }));
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${process.env.REACT_APP_API_URL}/edit/candidate-profile`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(profile),
    })
      .then((res) => {
        if (res.ok) {
          alert("Profil mis à jour avec succès!");
          navigate("/candidate-profile");
        } else throw new Error("Erreur de mise à jour");
      })
      .catch((err) => alert("Erreur : " + err.message));
  };

  return (
    <>
      <Navbar />
      <div className="edit-profile__container">
        <div className="edit-profile__card">
          <h1 className="edit-profile__title">Mettre à jour mon profil</h1>
          <form onSubmit={handleSubmit} className="edit-profile__form">
            <div className="edit-profile__form-group">
              <label>Nom complet</label>
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="edit-profile__form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="edit-profile__form-group">
              <label>Téléphone</label>
              <input
                type="text"
                name="phoneNumber"
                value={profile.phoneNumber}
                onChange={handleChange}
              />
            </div>

            <div className="edit-profile__form-group">
              <label>Adresse</label>
              <input
                type="text"
                name="address"
                value={profile.address}
                onChange={handleChange}
              />
            </div>

            <div className="edit-profile__form-group edit-profile__skills-container">
              <label>Compétences</label>
              {Array.isArray(profile.skills) && profile.skills.map((skill, index) => (
                <div key={index} className="edit-profile__skill-item">
                  <input
                    type="text"
                    name="name"
                    placeholder="Nom de la compétence"
                    value={skill.name}
                    onChange={(e) => handleSkillChange(e, index)}
                  />
                  <input
                    type="number"
                    name="level"
                    placeholder="Niveau (0-100)"
                    value={skill.level}
                    onChange={(e) => handleSkillChange(e, index)}
                    min="0"
                    max="100"
                  />
                </div>
              ))}
              <button 
                type="button" 
                onClick={addSkill}
                className="edit-profile__add-skill-btn"
              >
                Ajouter une compétence
              </button>
            </div>

            <div className="edit-profile__form-group">
              <label>Date de naissance</label>
              <input
                type="date"
                name="dateOfBirth"
                value={profile.dateOfBirth}
                onChange={handleChange}
              />
            </div>

            <div className="edit-profile__button-container">
              <button type="submit" className="edit-profile__submit-btn">Enregistrer</button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default EditProfile;