import React from 'react';

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbara";
import Footer from "../Footer";
function EditRecruiterProfile() {
    const [profile, setProfile] = useState({
        companyName: '',
        email: '',
        description: '',
        phoneNumber: '',
        address: '',
        name: '',
        creationDate: '',
      });
      
     
      
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/recruiter/profile`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setProfile(data));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/recruiter/update_profile`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(profile),
    });
  
    if (res.ok) {
      const updatedProfile = await res.json();  // Get the updated profile
      setProfile(updatedProfile);  // Update the state with the new profile
      navigate("/RecruiterProfile");
    } else {
      alert("Erreur lors de la mise à jour");
    }
  };
  

  return (
    <>
      <Navbar />
    <div
      style={{
        backgroundColor: "#fff",
        padding: "30px",
        borderRadius: "12px",
        boxShadow: "0 2px 12px rgba(0, 0, 0, 0.1)",
        maxWidth: "700px",
        margin: "50px auto",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h2 style={{ color: "#fa5c01", fontSize: "24px", marginBottom: "25px" }}>
        ✏️ Modifier votre profil recruteur
      </h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", color: "#555", marginBottom: "8px" }}>Nom</label>
          <input
            name="name"
            value={profile.name}
            onChange={handleChange}
            placeholder="Nom"
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", color: "#555", marginBottom: "8px" }}>Email</label>
          <input
            name="email"
            value={profile.email}
            onChange={handleChange}
            placeholder="Email"
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", color: "#555", marginBottom: "8px" }}>Entreprise</label>
          <input
            name="companyName"
            value={profile.companyName}
            onChange={handleChange}
            placeholder="Entreprise"
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", color: "#555", marginBottom: "8px" }}>Téléphone</label>
          <input
            name="phoneNumber"
            value={profile.phoneNumber}
            onChange={handleChange}
            placeholder="Téléphone"
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div style={{ marginBottom: "30px" }}>
          <label style={{ display: "block", color: "#555", marginBottom: "8px" }}>Description</label>
          <textarea
            name="description"
            value={profile.description}
            onChange={handleChange}
            placeholder="Description de l'entreprise"
            rows={5}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              resize: "vertical",
              fontSize: "14px",
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            backgroundColor: "#fa5c01",
            color: "#fff",
            padding: "12px 24px",
            border: "none",
            borderRadius: "6px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          💾 Enregistrer les modifications
        </button>
      </form>
    </div>
    <Footer />
    </>

  );
  
}

export default EditRecruiterProfile;
