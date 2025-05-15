import React, { useEffect, useState } from 'react';
import '../assets/css/AdminTable.css';
import Navbar from "../components/Navbara";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

const ManageCandidates = () => {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/candidates`)
      .then(res => res.json())
      .then(data => setCandidates(data))
      .catch(err => console.error("Erreur lors du chargement des candidats:", err));
  }, []);

  // ✅ Delete Candidate Function
  const handleDelete = (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce candidat ?")) return; // ✅ Confirmation popup

    fetch(`${process.env.REACT_APP_API_URL}/api/candidates/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })
    .then((res) => {
      if (res.ok) {
        setCandidates(candidates.filter(candidate => candidate.id !== id)); // ✅ Update UI after deletion
      } else {
        alert("Erreur lors de la suppression du candidat.");
      }
    })
    .catch(err => console.error("Erreur lors de la suppression:", err));
  };
  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <h1>Gestion des Candidats</h1>
        <div className="table-container">
          {candidates.length === 0 ? (
            <p>Aucun candidat trouvé.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Actions</th> {/* ✅ Added column for Edit/Delete */}
                </tr>
              </thead>
              <tbody>
                {candidates.map(candidate => (
                  <tr key={candidate.id}>
                    <td>{candidate.name}</td>
                    <td>{candidate.email}</td>
                    <td className="action-buttons">
                      <Link to={`/edit-candidate/${candidate.id}`} className="edit-link">Modifier</Link>
                      <button onClick={() => handleDelete(candidate.id)} className="delete-btn">Supprimer</button> {/* ✅ Delete button */}                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="back-to-dashboard">
  <Link to="/AdminDashboard" className="dashboard-link">⬅ Retour au Tableau de Bord</Link>
</div>

      </div>
      <Footer />
    </>
  );
};

export default ManageCandidates;
