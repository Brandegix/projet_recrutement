import React, { useState, useEffect } from "react";
import axios from "axios";

const RecruteurAjout = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    companyName: "",
    salary: "",
    location: "",
    recruiter_id: "",
  });

  useEffect(() => {
    // ✅ Charger l'ID du recruteur depuis le localStorage
    const recruiterId = localStorage.getItem("userId");
    if (recruiterId) {
      setFormData((prev) => ({
        ...prev,
        recruiter_id: recruiterId,
      }));
    }
  }, []);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/job_offers`, formData);
      alert("Offre ajoutée avec succès !");
      setFormData({
        title: "",
        description: "",
        companyName: "",
        salary: "",
        location: "",
        recruiter_id: localStorage.getItem("userId") || "",
      });
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'ajout.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Ajouter une offre d'emploi</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input name="title" placeholder="Titre" value={formData.title} onChange={handleChange} className="border p-2 w-full" />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="border p-2 w-full" />
        <input name="companyName" placeholder="Nom de l'entreprise" value={formData.companyName} onChange={handleChange} className="border p-2 w-full" />
        <input name="salary" placeholder="Salaire" value={formData.salary} onChange={handleChange} className="border p-2 w-full" />
        <input name="location" placeholder="Lieu" value={formData.location} onChange={handleChange} className="border p-2 w-full" />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">Ajouter</button>
      </form>
    </div>
  );
};

export default RecruteurAjout;
