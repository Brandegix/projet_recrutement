import React from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/ChoixRole.css";  // Assurez-vous que ce fichier CSS est bien importé

import Navbar from '../components/Navbara';
import Footer from '../components/Footer';
import candidatImg from '../assets/images/choixRole/Candidate_business_generated - Edited - Edited.jpg';
import recruiterImg from '../assets/images/choixRole/recruiter.jpg';


const ChoixRole = () => {
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    if (role === "candidat") {
      navigate("/register/candidat");
    } else if (role === "recruteur") {
      navigate("/register/recruteur");
    }
  };

  return (
    <>
      <Navbar />

      <div className="roleSelectionContainer">
        <div className="roleSelectionContent">
          <h1 className="mainTitle">Bienvenue sur CasaJobs</h1>
          <p className="subTitle">Veuillez choisir votre rôle pour continuer :</p>

          <div className="rolesWrapper">
            <div className="roleCard">
              <h3 className="roleName">Candidat</h3>
              <img src={candidatImg} alt="Candidat" className="roleImage" />
              <button onClick={() => handleRoleSelect("candidat")} className="selectButton">
                cliquez ici
              </button>
            </div>

            <div className="roleCard">
              <h3 className="roleName">Recruteur</h3>
              <img src={recruiterImg} alt="Recruteur" className="roleImage" />
              <button onClick={() => handleRoleSelect("recruteur")} className="selectButton">
                cliquez ici
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};



export default ChoixRole;
