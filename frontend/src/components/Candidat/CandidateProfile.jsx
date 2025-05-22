import React, { useEffect, useState } from "react";
// import "../../assets/css/CandidateProfile.css"; // Removed import of external CSS
import Navbar from "../Navbara";
import Footer from "../Footer";
import candidatImage from '../../assets/images/choixRole/recruiter.jpg';
import JobSearchAndOffers from "../JobSearchAndOffers";
import { Link } from "react-router-dom";
import JobCardss from "./JobCardss";


function CandidateProfile() {
  const [candidate, setCandidate] = useState(null);
  const [cvFile, setCvFile] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [applicationCount, setApplicationCount] = useState(0); // État pour le nombre de candidatures
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    // Récupérer les détails du candidat, y compris les compétences
    fetch(`${process.env.REACT_APP_API_URL}/api/candidates/profile`, {
      method: "GET",
      credentials: "include", // ✅ permet d'envoyer les cookies
    })
      .then((res) => {
        console.log(res); // 👈 Affiche la réponse pour débogage
        if (!res.ok) throw new Error("Échec de la récupération des données du candidat");
        return res.json();
      })
      .then(data => {
        // Analyser la chaîne JSON des compétences si c'est une chaîne
        if (typeof data.skills === 'string') {
          data.skills = JSON.parse(data.skills);
        }
        // Vérifier que profile_image fait bien partie de la réponse
        if (data.profile_image) {
          console.log('Image de profil disponible:', data.profile_image); // Débogage
        }
        setCandidate(data); // Mettre à jour les données du candidat après la récupération
      })
      .catch((err) => console.error("Erreur lors du chargement:", err));

    // Récupérer le nombre de candidatures pour le candidat
    fetch(`${process.env.REACT_APP_API_URL}/api/getapplicationsCount`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Échec de la récupération du nombre de candidatures");
        return res.json();
      })
      .then(data => {
        setApplicationCount(data.statistics.application_count); // Définir le nombre de candidatures
      })
      .catch((err) => console.error("Erreur lors de la récupération du nombre de candidatures:", err));
  }, []);

  const handleCvChange = (e) => {
    setCvFile(e.target.files[0]);
  };

  const handleCvUpload = (e) => {
    e.preventDefault();
    if (!cvFile) return;

    const formData = new FormData();
    formData.append("cv", cvFile);

    fetch(`${process.env.REACT_APP_API_URL}/api/upload-cv`, {
      method: "POST",
      body: formData,
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Échec du téléchargement du CV");
        alert("CV téléchargé avec succès");
        window.location.reload();
      })
      .catch((err) => {
        console.error(err);
        alert("Échec du téléchargement du CV");
      });
  };

  const handleProfileImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImageFile(file);
  
      // Automatically upload on file select
      const formData = new FormData();
      formData.append("profile_image", file);
  
      fetch(`${process.env.REACT_APP_API_URL}/api/upload-profile-image`, {
        method: "POST",
        body: formData,
        credentials: "include",
      })
        .then((res) => {
          if (!res.ok) throw new Error("Échec du téléchargement de l'image de profil");
          return res.json();
        })
        .then(data => {
          setCandidate(prev => ({
            ...prev,
            profile_image: data.profile_image,
          }));
          alert("Image de profil téléchargée avec succès");
          window.location.reload();

        })
        .catch((err) => {
          console.error(err);
          alert("Échec du téléchargement de l'image de profil");
        });
    }
  };
  
  const handleProfileImageUpload = (e) => {
    e.preventDefault();
    if (!profileImageFile) return;

    const formData = new FormData();
    formData.append("profile_image", profileImageFile);

    fetch(`${process.env.REACT_APP_API_URL}/api/upload-profile-image`, {
      method: "POST",
      body: formData,
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Échec du téléchargement de l'image de profil");
        return res.json(); // On attend l'objet candidat mis à jour avec profile_image
      })
      .then(data => {
        setCandidate(prevState => ({
          ...prevState,
          profile_image: data.profile_image,   // Mettre à jour l'image de profil dans l'état
        }));
        alert("Image de profil téléchargée avec succès");
        window.location.reload();
      })
      .catch((err) => {
        console.error(err);
        alert("Échec du téléchargement de l'image de profil");
      });
  };

  const staticExperience = "5 ans en développement web, axé sur les applications Full-stack.";
  const staticJobOffers = [
    { id: 1, title: "Développeur Front-End", description: "Collaborer sur des tâches front-end et back-end." },
    { id: 2, title: "Développeur Back-End", description: "Travailler avec Node.js pour construire des services API." },
    { id: 3, title: "Développeur Full-Stack", description: "Développer des interfaces utilisateur avec React." },
  ];

  return (
    <>
      <Navbar />
      <div className="profile-page">
        <div className="profile-container">
          <div className="profile-header">
          <div
  className="profile-picture"
  onMouseEnter={() => setIsHovering(true)}
  onMouseLeave={() => setIsHovering(false)}
  style={{ position: 'relative', width: '150px', height: '150px', cursor: 'pointer' }}
>
  <img
    src={candidate && candidate.profile_image 
      ? `${process.env.REACT_APP_API_URL}/uploads/profile_images/${candidate.profile_image}`
      : candidatImage}
    alt="Profil"
    className="profile-img"
    style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
  />

  {/* Overlay with modifier button */}
  {isHovering && (
    <div
      style={{
        position: 'absolute',
        top: 0, left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '1.1rem',
        userSelect: 'none',
      }}
      onClick={() => document.getElementById('profile-image-input').click()}
    >
      Modifier
    </div>
  )}

  {/* Hidden file input */}
 <input
  id="profile-image-input"
  type="file"
  accept="image/*"
  style={{ display: 'none' }}
  onChange={handleProfileImageChange} // ✅ Change this from `onSubmit` to `onChange`
/>

</div>


            <div className="profile-info">
              <h2 className="profile-name">
                {candidate ? candidate.name : "Chargement..."}
              </h2>
              <p className="profile-role">
                Profil candidat

              </p>
              <a
                href={`/edit-profile`}
                className="edit-link"
                style={{
                  display: 'inline-block',
                  padding: '8px 12px',
                  backgroundColor: '#f8f9fa',
                  color: '#495057',
                  border: 'none', // Removed the border
                  borderRadius: '5px',
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                  marginTop: '10px',
                }}
              >
                ✏️ Modifier le profil
              </a>
            </div>
          </div>

          <div
            style={{
              marginTop: '20px',
              marginBottom: '20px',
              display: 'flex',
              gap: '20px', // Space between the two upload sections
              flexWrap: 'wrap', // Allows them to wrap on smaller screens
            }}
          >
           
           
          </div>

          {candidate && typeof candidate.completion === 'number' && (
            <div className="profile-completion">
              <h4>Complétion du profil</h4>
              <progress value={candidate.completion} max="100"></progress>
              <p>{candidate.completion}% complété</p>
            </div>
          )}

          <div className="container" style={{ display: 'flex', gap: '20px', flexDirection: 'row', alignItems: 'stretch' }}>
            <div className="card profile-card">
              <div className="profile-details">
                <div className="profile-detail">
                  <strong>Email: </strong>{candidate ? candidate.email : "Chargement..."}
                </div>
                <div className="profile-detail">
                  <strong>Téléphone: </strong>{candidate ? `${candidate.phoneNumber}` : "Chargement..."}
                </div>
                <div className="profile-detail">
                  <strong>Adresse: </strong>{candidate ? candidate.address : "Chargement..."}
                </div>
                <div className="profile-detail">
                  <strong>Date de naissance: </strong>{candidate ? candidate.dateOfBirth : "Chargement..."}
                </div>
                <div className="profile-detail">
                <p>                           .</p>
                </div>

              </div>
            </div>

            <div className="skills-section" style={{ maxWidth: 400, margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
  <h4 style={{ borderBottom: '2px solid #FFA500', paddingBottom: '5px', color: '#495057' }}>Compétences</h4>

  {candidate && candidate.skills ? (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '15px' }}>
      {candidate.skills.map((skill) => {
        // Choose a color shade based on skill level (green-orange-red scale)
        const getColor = (level) => {
          if (level >= 80) return '#28a745'; // green
          if (level >= 50) return '#FFA500'; // orange
          return '#dc3545'; // red
        };

        return (
          <div
            key={skill.name}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 12px',
              borderRadius: '8px',
              backgroundColor: '#f9f9f9',
              color: '#495057',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}
          >
            <div
              style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                backgroundColor: getColor(skill.level),
                flexShrink: 0,
                boxShadow: `0 0 6px ${getColor(skill.level)}55`,
              }}
              title={`Niveau : ${skill.level}%`}
            />
            <span style={{ flex: 1, fontWeight: '600', fontSize: '16px' }}>{skill.name}</span>
            <span style={{ fontWeight: 'bold', color: getColor(skill.level) }}>{skill.level}%</span>
          </div>
        );
      })}
    </div>
  ) : (
    <p>Chargement des compétences...</p>
  )}
</div>
  </div>
 {/* Upload CV Section */}
 <div style={{ flex: '1 1 300px', marginTop: '30px' }}>
              <h4 style={{ color: '#495057', fontSize: '1.2rem', marginBottom: '15px' }}>
                Téléchargez votre CV
              </h4>
              <form
                onSubmit={handleCvUpload}
                style={{
                  marginTop: '15px',
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'center',
                  border: 'none'
                }}
              >
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleCvChange}
                  style={{
                    flexGrow: 1,
                    padding: '10px',
                    border: 'none',
                    outline: 'none',
                    borderRadius: '5px',
                    fontSize: '0.9rem',
                    backgroundColor: '#f8f9fa',
                  }}
                />
                <button
                  className="upload-btn"
                  type="submit"
                  style={{
                    padding: '10px 15px',
                    backgroundColor: '#28a745',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    transition: 'background-color 0.3s ease',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#1e7e34')}
                  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#28a745')}
                >
                  Télécharger votre CV
                </button>
                
              </form>
              {candidate && candidate.cv_filename ? (
                <div style={{ marginTop: '10px' }}>
                  <p style={{ fontSize: '0.95rem', color: '#495057' }}>
                    CV actuel :{' '}
                    <a
href={`${process.env.REACT_APP_API_URL}/uploads/${candidate.cv_filename}`}
target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#007bff', textDecoration: 'none', color: '#fc8e20' }}
                    >
                      {candidate.cv_filename}
                    </a>
                  </p>
                </div>
              ) : (
                <p style={{ fontSize: '0.95rem', color: '#6c757d', marginTop: '10px' }}>
                  Aucun CV téléchargé pour l'instant.
                </p>
              )}
            </div>
          
          <div style={{ textAlign: "center", marginTop: "20px" ,color: '#fc8e20'}}>
                       <Link to="/offres" style={{ color: '#007bff', textDecoration: 'none', color: '#fc8e20' }}>
                          Consulter les offres d'emploi
                       </Link>
                     </div>

          
        </div>
      </div>
      <Footer />
    </>
  );
}

export default CandidateProfile;