import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dash = () => {
  const [recruiterId, setRecruiterId] = useState(null);
  const [offers, setOffers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState('');
  const [stats, setStats] = useState([]);


  useEffect(() => {
    // D'abord, récupérer l'ID du recruteur depuis Flask (session)
    axios.get(`${process.env.REACT_APP_API_URL}/api/current_recruiter`, { withCredentials: true })
    .then((res) => {
        const id = res.data.recruiter_id;
        setRecruiterId(id);
      })
      .catch((err) => {
        setError("Erreur d'authentification : recruteur non connecté.");
        console.error(err);
      });
  }, []);

  useEffect(() => {
    if (!recruiterId) return;

    const fetchOffers = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/recruiter/${recruiterId}/offers`);
        setOffers(response.data);
      } catch (err) {
        setError('Erreur lors de la récupération des offres.');
        console.error(err);
      }
    };

    const fetchApplications = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/recruiter/${recruiterId}/applications`);
        setApplications(response.data);
      } catch (err) {
        setError('Erreur lors de la récupération des candidatures.');
        console.error(err);
      }
    };

    fetchOffers();
    fetchApplications();
  }, [recruiterId]);

  return (
    <div>
      <h1>Dashboard du Recruteur</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h2>Offres d'Emploi</h2>
      {offers.length === 0 ? (
        <p>Aucune offre d'emploi disponible.</p>
      ) : (
        <ul>
          {offers.map((offer) => (
            <li key={offer.id}>
              <h3>{offer.title}</h3>
              <p>Entreprise : {offer.company}</p>
              <p>Lieu : {offer.location}</p>
              <p>Expérience : {offer.experience}</p>
              <p>Compétences requises : {offer.skills}</p>
              <p>Salaire : {offer.salary}</p>
            </li>
          ))}
        </ul>
      )}

      <h2>Candidatures</h2>
      {applications.length === 0 ? (
        <p>Aucune candidature pour ces offres.</p>
      ) : (
        <ul>
          {applications.map((app) => (
            <li key={app.id}>
              <p>Candidat ID : {app.candidate_id}</p>
              <p>Offre d'emploi ID : {app.job_offer_id}</p>
              <p>Date de candidature : {app.application_date}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dash;
