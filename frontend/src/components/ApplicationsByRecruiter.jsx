import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ApplicationsByRecruiter = () => {
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState(null);
  const [recruiterId, setRecruiterId] = useState(null);

  useEffect(() => {
    // Appel à l'API pour récupérer l'ID du recruteur connecté
    axios.get(`${process.env.REACT_APP_API_URL}/api/recruiter/me`, { withCredentials: true })
      .then(res => {
        const id = res.data.recruiter_id;
        setRecruiterId(id);
        console.log('Recruiter ID récupéré:', id); // Affiche l'ID du recruteur dans la console
      })
      .catch(error => {
        console.error('Erreur lors de la récupération de l\'ID du recruteur :', error);
      });
  }, []);

  useEffect(() => {
    if (recruiterId) {
      // Récupérer les applications du recruteur connecté
      axios.get(`${process.env.REACT_APP_API_URL}/api/recruiter/${recruiterId}/applications`)
        .then(response => {
          console.log('Candidatures récupérées:', response.data); // Vérifie les données des candidatures
          setApplications(response.data);
        })
        .catch(err => {
          setError("Erreur lors de la récupération des candidatures");
          console.error('Erreur de récupération des candidatures:', err);
        });
    }
  }, [recruiterId]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!applications.length) {
    return <div>Aucune candidature à afficher pour ce recruteur.</div>;
  }

  return (
    <div>
      <h2>Candidatures pour le recruteur ID: {recruiterId}</h2>
      <table>
        <thead>
          <tr>
            <th>ID Candidature</th>
            <th>ID Candidat</th>
            <th>ID Offre</th>
            <th>Date de Candidature</th>
          </tr>
        </thead>
        <tbody>
          {applications.map(application => (
            <tr key={application.id}>
              <td>{application.id}</td>
              <td>{application.candidate_id}</td>
              <td>{application.job_offer_id}</td>
              <td>{new Date(application.application_date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ApplicationsByRecruiter;
