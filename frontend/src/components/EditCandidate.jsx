import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../assets/css/EditPage.css";
import Navbar from "../components/Navbara";
import Footer from "../components/Footer";

const EditCandidate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState({ name: "", email: "" });

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/candidates/${id}`)
      .then(res => res.json())
      .then(data => setCandidate(data))
      .catch(err => console.error("Erreur lors du chargement du candidat:", err));
  }, [id]);

  const handleUpdate = () => {
    fetch(`${process.env.REACT_APP_API_URL}/api/candidates/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(candidate),
    })
    .then(() => navigate("/ManageCandidates"))
    .catch(err => console.error("Erreur lors de la modification:", err));
  };

  return (
    <>
      <Navbar />
      <div className="edit-container">
        <h1>Modifier Candidat</h1>
        <form>
          <input type="text" value={candidate.name} onChange={(e) => setCandidate({...candidate, name: e.target.value})} />
          <input type="email" value={candidate.email} onChange={(e) => setCandidate({...candidate, email: e.target.value})} />
          
          <button type="button" onClick={handleUpdate}>Enregistrer</button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default EditCandidate;
