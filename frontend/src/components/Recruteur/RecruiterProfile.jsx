import React from 'react';

import { useEffect, useRef, useState } from "react";
import "../../assets/css/r.css";
import Navbar from "../Navbara";
import Footer from "../Footer";
import candidatImage from '../../assets/images/choixRole/recruiter.jpg';
import { Link } from "react-router-dom";

function RecruiterProfile() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [jobStats, setJobStats] = useState(null);
  const [domains, setDomains] = useState([]);
  const [newDomain, setNewDomain] = useState("");
  const fileInputRef = useRef(null);

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profile_image", file);

    fetch("http://localhost:5000/api/upload-profile-image-recruiter", {
      method: "POST",
      body: formData,
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Profile image upload failed");
        return res.json();
      })
      .then(data => {
        setProfile(prevState => ({
          ...prevState,
          profile_image: data.profile_image,
        }));
        alert("Image de profil mise à jour avec succès !");
        window.location.reload();
      })
      .catch((err) => {
        console.error(err);
        alert("Échec du téléchargement de l'image");
      });
  };

  useEffect(() => {
    fetch("http://localhost:5000/api/recruiter/profile", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch recruiter profile");
        return res.json();
      })
      .then((data) => {
        setProfile(data);
        const selectedSet = new Set(data.selected_domains || []);
        const allDomainNames = new Set([...data.predefined_domains, ...data.selected_domains]);
        const updatedDomains = [...allDomainNames].map(domain => ({
          name: domain,
          selected: selectedSet.has(domain),
        }));
        setDomains(updatedDomains);
      })
      .catch((err) => {
        setError(err.message);
      });

    fetch("http://localhost:5000/api/recruiter/job_offers_statistics", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch job statistics");
        return res.json();
      })
      .then((data) => {
        setJobStats(data.statistics);
      })
      .catch((err) => {
        console.error("Job stats error:", err);
      });

  }, []);

  const handleAddDomain = () => {
    if (newDomain.trim() === "") return;
    const updatedDomains = [...domains, { name: newDomain, selected: true }];
    setDomains(updatedDomains);
    setNewDomain("");
  };

  const handleSaveDomains = () => {
    const selectedDomains = domains.filter(domain => domain.selected).map(domain => domain.name);
    fetch("http://localhost:5000/recruiter/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ domains: selectedDomains }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to save domains");
        return res.json();
      })
      .then(() => {
        alert("Domaines sauvegardés avec succès !");
      })
      .catch((err) => {
        console.error(err);
        alert("Échec de la sauvegarde des domaines");
      });
  };

  if (error) return <p className="error">Erreur : {error}</p>;
  if (!profile) return <p className="loading">Chargement du profil...</p>;

  return (
    <>
      <Navbar />
      <div className="profile-page">
        <div className="profile-container">
          <div className="profile-header">
            <div className="profile-picture">
              <img
                src={
                  profile.profile_image
                    ? `http://localhost:5000/uploads/profile_images/${profile.profile_image}`
                    : candidatImage
                }
                alt="Recruiter Profile"
                className="profile-img"
              />
              <div
                className="upload-overlay"
                onClick={() => fileInputRef.current.click()}
              >
                ✏️ Modifier
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden-file-input"
                ref={fileInputRef}
                onChange={handleProfileImageChange}
              />
            </div>

            <div className="profile-info">
              <h2 className="profile-name">{profile.companyName || "Entreprise Anonyme"}</h2>
              <p className="profile-title">Recruteur</p>
              <Link to="/EditRecruiterProfile" className="edit-link">
                ✏ Modifier le profil
              </Link>
            </div>
          </div>
  
            <div className="about-section">
              <h3 className="section-title">🏢 À propos de l'entreprise</h3>
              <p>
                {profile.description || "Vous n'avez pas encore ajouté de description d'entreprise. Cliquez sur 'Modifier le profil' pour en ajouter une."}
              </p>
            </div>
  
            <div className="cards-container">
              <div className="profile-card">
                <h4>📋 Informations de contact</h4>
                <div className="profile-detail"><strong>Email: </strong>{profile.email}</div>
                <div className="profile-detail"><strong>Téléphone: </strong>{profile.phoneNumber || "Non renseigné"}</div>
                <div className="profile-detail"><strong>Adresse: </strong>{profile.address || "Non renseignée"}</div>
                <div className="profile-detail"><strong>Responsable: </strong>{profile.name || "Non renseigné"}</div>
                <div className="profile-detail"><strong>Date de création: </strong>{profile.creationDate || "Date inconnue"}</div>
              </div>
  
              <div className="profile-card">
                <h4>📊 Statistiques</h4>
                <div className="profile-detail"><strong>Offres publiées: </strong>{jobStats?.jobCount ?? "Chargement..."}</div>
                <div className="profile-detail"><strong>Candidats embauchés: </strong>5</div>
                <div className="profile-detail"><strong>Délai moyen de recrutement: </strong>10 jours</div>
              </div>
            </div>
  
            <div className="domains-section">
              <h4 className="section-title">🛠 Domaines d'activité</h4>
              <div className="domains-list">
                {domains.length > 0 ? (
                  domains.map((domain, i) => (
                    <label key={i} className="domain-item">
                      <input
                        type="checkbox"
                        checked={domain.selected}
                        onChange={() => {
                          const updated = domains.map((d, index) =>
                            index === i ? { ...d, selected: !d.selected } : d
                          );
                          setDomains(updated);
                        }}
                      />
                      <span>{domain.name}</span>
                    </label>
                  ))
                ) : (
                  <p>Aucun domaine défini.</p>
                )}
              </div>
  
              <div className="domain-input-group">
                <input
                  type="text"
                  className="domain-input"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  placeholder="Ajouter un nouveau domaine"
                />
                <button onClick={handleAddDomain} className="add-domain-btn">
                  ➕ Ajouter
                </button>
              </div>
  
              <button onClick={handleSaveDomains} className="save-domains-btn">
                💾 Sauvegarder les domaines
              </button>
            </div>
            
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <Link to="/RecruiterJobOffers" className="view-jobs-link">
                📂 Voir mes offres d'emploi
              </Link>
            </div>
          </div>
        </div>
  
        <Footer />
      </>
    );
  }export default RecruiterProfile;
