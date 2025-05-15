import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../assets/css/EditPage.css";
import Navbar from "../components/Navbara";
import Footer from "../components/Footer";

const EditJobOffer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState({ title: "", company: "", location: "", salary: "" });

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/job_offers/${id}`)
      .then(res => res.json())
      .then(data => setJob(data))
      .catch(err => console.error("Erreur lors du chargement de l'offre:", err));
  }, [id]);

  const handleUpdate = () => {
    fetch(`${process.env.REACT_APP_API_URL}/api/job_offers/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(job),
    })
    .then(() => navigate("/ManageJobs"))
    .catch(err => console.error("Erreur lors de la modification:", err));
  };

  return (
    <>
      <Navbar />
      <div className="edit-container">
        <h1>Modifier Offre d'Emploi</h1>
        <form>
          <input type="text" value={job.title} onChange={(e) => setJob({...job, title: e.target.value})} />
          <input type="text" value={job.company} onChange={(e) => setJob({...job, company: e.target.value})} />
          <input type="text" value={job.location} onChange={(e) => setJob({...job, location: e.target.value})} />
          <input type="number" value={job.salary} onChange={(e) => setJob({...job, salary: e.target.value})} />
          <button type="button" onClick={handleUpdate}>Enregistrer</button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default EditJobOffer;
