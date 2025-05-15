import React, { useState, useEffect } from 'react';
import "../assets/css/dashboard.css";
import Navbar from '../components/Navbara';
import Footer from '../components/Footer';
export default function Dashboard() {
  const [candidates, setCandidates] = useState([]);
  const [dashboardData, setDashboardData] = useState({
    totalCandidates: 0,
    jobOffers: 0,
    openPositions: 0,
    candidatesInProgress: 0,
    conversionRate: 0,
  });

  useEffect(() => {
    // Récupérer l'ID du recruteur à partir de la session ou du localStorage
    const recruiterId = localStorage.getItem('user_id'); // Assure-toi que user_id est stocké correctement

    if (recruiterId) {
      // Charger les candidats
      fetch(`${process.env.REACT_APP_API_URL}/recruiter/candidates?recruiter_id=${recruiterId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setCandidates(data);
          } else {
            console.error("Données invalides : la réponse n'est pas un tableau.");
          }
        })
        .catch((err) => console.error("Erreur lors du chargement des candidats:", err));

      // Charger les données du tableau de bord
      fetch(`${process.env.REACT_APP_API_URL}/recruiterr/dashboard?recruiter_id=${recruiterId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then((res) => res.json())
        .then((data) => {
          setDashboardData(data);
        })
        .catch((err) => console.error("Erreur lors du chargement des données du tableau de bord:", err));
    } else {
      console.error("ID du recruteur introuvable dans la session.");
    }
  }, []);

  return (<>

<Navbar />

    <div className="dashboard-container">
      <h1>Tableau de Bord Recruteur</h1>
      <div className="dashboard-grid">
        {/* Carte Total Candidats */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3>Total Candidats</h3>
            <span className="card-value">{dashboardData.totalCandidates}</span>
          </div>
        </div>

        {/* Carte Postes Ouverts */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3>Postes Ouverts</h3>
          </div>
          <div className="card-body">
            <span>{dashboardData.openPositions} postes ouverts</span>
          </div>
        </div>

        {/* Carte Conversion */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3>Conversion</h3>
          </div>
          <div className="card-body">
            <span>Taux de Conversion: {dashboardData.conversionRate}%</span>
          </div>
        </div>

        {/* Carte Nouveau Candidat */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3>Nouveau Candidat</h3>
          </div>
          <div className="card-body">
            <button className="add-candidate-btn">+ Ajouter un candidat</button>
          </div>
        </div>
      </div>

      {/* Section des candidats récents */}
      <div className="recent-candidates">
        <h2>Candidats Récents</h2>
        <p>Vous avez {candidates.length} candidatures à traiter ce mois-ci</p>
        <table>
          <thead>
            <tr>
              <th>Candidat</th>
              <th>Email</th>
              <th>Téléphone</th>
              <th>Compétences</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(candidates) && candidates.length > 0 ? (
              candidates.map((candidate) => (
                <tr key={candidate.id}>
                  <td>{candidate.name}</td>
                  <td>{candidate.email}</td>
                  <td>{candidate.phoneNumber}</td>
                  <td>{candidate.skills ? candidate.skills.join(', ') : 'Aucune compétence'}</td>
                  <td>
                    <button>Email</button>
                    <button>Editer</button>
                    <button>Supprimer</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">Aucun candidat trouvé</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>      <Footer /></>

  );
}

   
