import '../assets/css/CandidatePagefrom.css';
import React from "react";
import { FaEnvelope } from "react-icons/fa";

import Navbar from './Navbara';
import Footer from './Footer';

const CandidatePagefrom = () => {
  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <div className="confirmation-container">
          <div className="confirmation-box">
            <FaEnvelope className="confirmation-icon" />
            <h2>Vérifie ton email</h2>
            <p>
              Un lien de confirmation a été envoyé à ton adresse email.
              <br />
              Merci de vérifier ta boîte de réception pour activer ton compte.
            </p>
            <a href="/">Retour à l'accueil</a>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CandidatePagefrom;
