import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../assets/css/EditPage.css";
import Navbar from "../components/Navbara";
import Footer from "../components/Footer";

const EditRecruiter = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recruiter, setRecruiter] = useState({ name: "", companyName: "", email: "" });

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/recruiters/${id}`)
      .then(res => res.json())
      .then(data => setRecruiter(data))
      .catch(err => console.error("Erreur lors du chargement du recruteur:", err));
  }, [id]);

  const handleUpdate = () => {
    fetch(`${process.env.REACT_APP_API_URL}/api/recruiters/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(recruiter),
    })
    .then(() => navigate("/ManageRecruiters"))
    .catch(err => console.error("Erreur lors de la modification:", err));
  };

  return (
    <>
      <Navbar />
      <div className="edit-container">
        <h1>Modifier Recruteur</h1>
        <form>
          <input type="text" value={recruiter.name} onChange={(e) => setRecruiter({...recruiter, name: e.target.value})} />
          <input type="text" value={recruiter.companyName} onChange={(e) => setRecruiter({...recruiter, companyName: e.target.value})} />
          <input type="email" value={recruiter.email} onChange={(e) => setRecruiter({...recruiter, email: e.target.value})} />
          <button type="button" onClick={handleUpdate}>Enregistrer</button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default EditRecruiter;
