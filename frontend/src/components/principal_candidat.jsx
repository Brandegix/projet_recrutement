// CandidatePage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../assets/css/candidats.css";
const CandidatePage = () => {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/job_offers")
      .then(res => setOffers(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <>
      <div class="account-container">
        <div class="left-box">
          <h2>Identifiants et données</h2>
          <div class="profile-section">
            <div class="avatar"></div>
            <div class="user-info">
              <p><strong>Nom :</strong> aboussafi</p>
              <p><strong>Prénom :</strong> oumaima</p>
              <p><strong>Dernière connexion :</strong> 18.04.2025</p>
              <p><strong>Inscription :</strong> 18.04.2025</p>
            </div>
          </div>
        </div>
    
        <div class="right-box">
          <p><strong>Complété à 5%</strong></p>
          <div class="progress-bar">
            <div class="progress" style="width: 5%;"></div>
          </div>
          <p>Votre profil n'est pas complet à 100%</p>
          <p>Complétez votre profil <a href="#">ici</a></p>
        </div>
      </div>
    
    
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Offres d'emploi disponibles</h2>
      {offers.length === 0 ? (
        <p>Aucune offre pour le moment.</p>
      ) : (
        <ul className="space-y-4">
          {offers.map((offer) => (
            <li key={offer.id} className="border p-4 rounded">
              <h3 className="text-lg font-semibold">{offer.title}</h3>
              <p className="text-gray-700">{offer.description}</p>
              <p><strong>Entreprise:</strong> {offer.companyName}</p>
              <p><strong>Lieu:</strong> {offer.location}</p>
              <p><strong>Salaire:</strong> {offer.salary}</p>
            </li>
          ))}
        </ul>
      )}
    </div></>
  );
};

export default CandidatePage;
