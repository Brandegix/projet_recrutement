import React from 'react';
import { useEffect, useRef, useState } from "react";
// import "../../assets/css/r.css"; // Removed import of external CSS
import Navbar from "../Navbara";
import Footer from "../Footer";
import candidatImage from '../../assets/images/choixRole/recruiter.jpg';
import { Link } from "react-router-dom";
import SEO from "../SEO";
function RecruiterProfile() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [jobStats, setJobStats] = useState(null);
  const [domains, setDomains] = useState([]);
  const [newDomain, setNewDomain] = useState("");
  const [isHovering, setIsHovering] = useState(false);
  const fileInputRef = useRef(null);

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profile_image", file);

    fetch(`${process.env.REACT_APP_API_URL}/api/upload-profile-image-recruiter`, {
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
    fetch(`${process.env.REACT_APP_API_URL}/api/recruiter/profile`, {
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

      fetch(`${process.env.REACT_APP_API_URL}/api/recruiter/job_offers_statistics`, {
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


  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const formData = new FormData();
    formData.append("cover_image", file);
  
    fetch(`${process.env.REACT_APP_API_URL}/api/upload-cover-image-recruiter`, {
      method: "POST",
      body: formData,
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Cover image upload failed");
        return res.json();
      })
      .then(data => {
        setProfile(prevState => ({
          ...prevState,
          cover_image: data.cover_image,
        }));
        alert("Image de couverture mise à jour avec succès !");
        window.location.reload();
      })
      .catch((err) => {
        console.error(err);
        alert("Échec du téléchargement de l'image de couverture");
      });
  };
  
  const handleAddDomain = () => {
    if (newDomain.trim() === "") return;
    const updatedDomains = [...domains, { name: newDomain, selected: true }];
    setDomains(updatedDomains);
    setNewDomain("");
  };

  const handleSaveDomains = () => {
    const selectedDomains = domains.filter(domain => domain.selected).map(domain => domain.name);
    fetch(`${process.env.REACT_APP_API_URL}/recruiter/profile`, {
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

  const styles = {
    profilePage: {
      minHeight: '100vh',
      backgroundColor: '#fafafa',
      paddingTop: '40px',
      paddingBottom: '60px',
    },
    coverImageContainer: {
      width: '100%',
      marginBottom: '30px', // Add some space below the cover image
      borderRadius: '0 0 15px 15px', // Optional: slightly round the bottom corners
      overflow: 'hidden', // To contain the rounded corners
    },
    coverImage: {
      width: '100%',
      height: '250px', // Adjust the height as needed
      objectFit: 'cover',
    },
    profileContainer: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px',
    },
    profileHeader: {
      background: profile?.cover_image
        ? `linear-gradient(to right, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.85) 60%, transparent 100%), url(${process.env.REACT_APP_API_URL}${profile.cover_image})`
        : 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #ff6b35 100%)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      borderRadius: '20px',
      padding: '40px',
      marginBottom: '30px',
      border: '1px solid #f0f0f0',
      display: 'flex',
      alignItems: 'center',
      gap: '40px',
      flexWrap: 'wrap',
    },
    profilePicture: {
      position: 'relative',
      width: '180px',
      height: '180px',
      cursor: 'pointer',
      flexShrink: 0,
    },
    profileImg: {
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      objectFit: 'cover',
      border: '4px solid #ff6b35',
      boxShadow: '0 8px 25px rgba(255, 107, 53, 0.2)',
      transition: 'all 0.3s ease',
    },
    uploadOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(255, 107, 53, 0.8)',
      borderRadius: '50%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white',
      fontWeight: 'bold',
      fontSize: '1.1rem',
      opacity: 0,
      transition: 'opacity 0.3s ease',
      userSelect: 'none',
    },
    profileInfo: {
      flex: 1,
      minWidth: '300px',
    },
    companyName: {
      fontSize: '3rem',
      fontWeight: '500',
      marginBottom: '0.5rem',
      background: 'linear-gradient(45deg, #ff6b35, #ff8c42)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      letterSpacing: '-1px',
    },
    profileTitle: {
      fontSize: '1.4rem',
      color: 'white',
      marginBottom: '20px',
      fontWeight: '400',
    },
    editLink: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '12px 24px',
      backgroundColor: '#fff',
      color: '#333',
      border: '2px solid #ff6b35',
      borderRadius: '25px',
      fontSize: '0.95rem',
      textDecoration: 'none',
      fontWeight: '500',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(255, 107, 53, 0.1)',
    },
    aboutSection: {
      backgroundColor: '#fff',
      borderRadius: '15px',
      padding: '30px',
      marginBottom: '30px',
      boxShadow: '0 5px 20px rgba(0,0,0,0.06)',
      border: '1px solid #f0f0f0',
    },
    sectionTitle: {
      fontSize: '1.4rem',
      fontWeight: '600',
      color: '#333',
      marginBottom: '20px',
      paddingBottom: '10px',
      borderBottom: '3px solid #ff6b35',
      display: 'inline-block',
    },
    aboutText: {
      color: '#555',
      fontSize: '1rem',
      lineHeight: '1.6',
      margin: 0,
    },
    cardsContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
      gap: '30px',
      marginBottom: '40px',
    },
    card: {
      backgroundColor: '#fff',
      borderRadius: '15px',
      padding: '30px',
      boxShadow: '0 5px 20px rgba(0,0,0,0.06)',
      border: '1px solid #f0f0f0',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    },
    cardTitle: {
      fontSize: '1.3rem',
      fontWeight: '600',
      color: '#333',
      marginBottom: '20px',
      paddingBottom: '10px',
      borderBottom: '2px solid #ff6b35',
    },
    profileDetail: {
      display: 'flex',
      alignItems: 'flex-start',
      padding: '12px 0',
      borderBottom: '1px solid #f5f5f5',
      gap: '10px',
    },
    profileDetailLabel: {
      fontWeight: '600',
      color: '#555',
      minWidth: '120px',
      fontSize: '0.95rem',
    },
    profileDetailValue: {
      color: '#333',
      fontSize: '0.95rem',
      flex: 1,
    },
    domainsSection: {
      backgroundColor: '#fff',
      borderRadius: '15px',
      padding: '30px',
      marginBottom: '30px',
      boxShadow: '0 5px 20px rgba(0,0,0,0.06)',
      border: '1px solid #f0f0f0',
    },
    domainsList: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '12px',
      marginBottom: '25px',
    },
    domainItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '12px 16px',
      backgroundColor: '#fafafa',
      borderRadius: '10px',
      border: '1px solid #f0f0f0',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontSize: '0.95rem',
    },
    domainCheckbox: {
      width: '18px',
      height: '18px',
      accentColor: '#ff6b35',
      cursor: 'pointer',
    },
    domainInputGroup: {
      display: 'flex',
      gap: '12px',
      marginBottom: '20px',
      flexWrap: 'wrap',
    },
    domainInput: {
      flex: 1,
      minWidth: '250px',
      padding: '12px 16px',
      border: '2px solid #f0f0f0',
      borderRadius: '10px',
      fontSize: '0.95rem',
      backgroundColor: '#fafafa',
      transition: 'border-color 0.3s ease',
    },
    button: {
      padding: '12px 24px',
      borderRadius: '10px',
      border: 'none',
      fontSize: '0.95rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textDecoration: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
    },
    addButton: {
      backgroundColor: '#ff6b35',
      color: '#fff',
      boxShadow: '0 4px 15px rgba(255, 107, 53, 0.2)',
    },
    saveButton: {
      backgroundColor: '#28a745',
      color: '#fff',
      boxShadow: '0 4px 15px rgba(40, 167, 69, 0.2)',
      width: '100%',
      justifyContent: 'center',
    },
    viewJobsLink: {
      textAlign: 'center',
      marginTop: '40px',
    },
    viewJobsButton: {
      backgroundColor: '#ff6b35',
      color: '#fff',
      padding: '15px 30px',
      borderRadius: '25px',
      fontSize: '1.1rem',
      fontWeight: '600',
      textDecoration: 'none',
      boxShadow: '0 6px 20px rgba(255, 107, 53, 0.3)',
      transition: 'all 0.3s ease',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '10px',
    },
    error: {
      color: '#dc3545',
      backgroundColor: '#f8d7da',
      border: '1px solid #f5c6cb',
      borderRadius: '10px',
      padding: '15px',
      margin: '20px 0',
      textAlign: 'center',
    },
    loading: {
      color: '#666',
      backgroundColor: '#f8f9fa',
      border: '1px solid #e9ecef',
      borderRadius: '10px',
      padding: '30px',
      margin: '20px 0',
      textAlign: 'center',
      fontSize: '1.1rem',
    },
  };

  if (error) return (
    <>
      <Navbar />
      <SEO
        title="Profile"
       /> 
      <div style={styles.profilePage}>
        <div style={styles.profileContainer}>
          <p style={styles.error}>❌ Erreur : {error}</p>
        </div>
      </div>
      <Footer />
    </>
  );

  if (!profile) return (
    <>
      <Navbar />
      <SEO
        title="Profile"
       /> 
      <div style={styles.profilePage}>
        <div style={styles.profileContainer}>
          <p style={styles.loading}>⏳ Chargement du profil...</p>
        </div>
      </div>
      <Footer />
    </>
  );

  return (
    <>
      <Navbar />
      <SEO
        title="Profile"
       /> 

      <div style={styles.profilePage}>
      <div style={styles.profileContainer}>

{/* Profile Header */}
<div style={styles.profileHeader}>
            <div
              style={styles.profilePicture}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <img
                src={
                  profile.profile_image
                  ? `${process.env.REACT_APP_API_URL}/uploads/profile_images/${profile.profile_image}`
                  : candidatImage
                }
                alt="Recruiter Profile"
                style={{
                  ...styles.profileImg,
                  transform: isHovering ? 'scale(1.05)' : 'scale(1)',
                }}
              />
              <div
                style={{
                  ...styles.uploadOverlay,
                  opacity: isHovering ? 1 : 0,
                }}
                onClick={() => fileInputRef.current.click()}
              >
                📸 Modifier
              </div>
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                ref={fileInputRef}
                onChange={handleProfileImageChange}
              />
            </div>

            <div style={styles.profileInfo}>
              <h2 style={styles.companyName}>
                {profile.companyName || "Entreprise Anonyme"}
              </h2>
              <p style={styles.profileTitle}>Profil de l'entreprise</p>
              <Link 
                to="/EditRecruiterProfile" 
                style={styles.editLink}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#ff6b35';
                  e.target.style.color = '#fff';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#fff';
                  e.target.style.color = '#333';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                 Modifier le profil
              </Link>
            </div>
          </div>

          {/* About Section */}
          <div style={styles.aboutSection}>
            <h3 style={styles.sectionTitle}> À propos de l'entreprise</h3>
            <p style={styles.aboutText}>
              {profile.description || "Vous n'avez pas encore ajouté de description d'entreprise. Cliquez sur 'Modifier le profil' pour en ajouter une."}
            </p>
          </div>

{/* COVER IMAGE Upload Section */}
<div style={{ marginBottom: '20px' }}>
  <label htmlFor="coverImageUpload" style={{ fontWeight: 'bold', marginBottom: '10px', display: 'block' }}>
    Upload Cover Image:
  </label>
  <input
    type="file"
    accept="image/*"
    onChange={handleCoverImageChange}
    id="coverImageUpload"
  />
</div>

          {/* Info Cards */}
          <div style={styles.cardsContainer}>
            <div 
              style={styles.card}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 5px 20px rgba(0,0,0,0.06)';
              }}
            >
              <h4 style={styles.cardTitle}> Informations de contact</h4>
              <div style={styles.profileDetail}>
                <span style={styles.profileDetailLabel}>Email:</span>
                <span style={styles.profileDetailValue}>{profile.email}</span>
              </div>
              <div style={styles.profileDetail}>
                <span style={styles.profileDetailLabel}>Téléphone:</span>
                <span style={styles.profileDetailValue}>{profile.phoneNumber || "Non renseigné"}</span>
              </div>
              <div style={styles.profileDetail}>
                <span style={styles.profileDetailLabel}>Adresse:</span>
                <span style={styles.profileDetailValue}>{profile.address || "Non renseignée"}</span>
              </div>
              <div style={styles.profileDetail}>
                <span style={styles.profileDetailLabel}>Responsable:</span>
                <span style={styles.profileDetailValue}>{profile.name || "Non renseigné"}</span>
              </div>
              <div style={styles.profileDetail}>
                <span style={styles.profileDetailLabel}>Création:</span>
                <span style={styles.profileDetailValue}>{profile.creationDate || "Date inconnue"}</span>
              </div>
            </div>

            <div 
              style={styles.card}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 5px 20px rgba(0,0,0,0.06)';
              }}
            >
              <h4 style={styles.cardTitle}> Statistiques</h4>
              <div style={styles.profileDetail}>
                <span style={styles.profileDetailLabel}>Offres publiées:</span>
                <span style={styles.profileDetailValue}>{jobStats?.jobCount ?? "Chargement..."}</span>
              </div>
              <div style={styles.profileDetail}>
                <span style={styles.profileDetailLabel}>Candidats embauchés:</span>
                <span style={styles.profileDetailValue}>5</span>
              </div>
              <div style={styles.profileDetail}>
                <span style={styles.profileDetailLabel}>Délai moyen:</span>
                <span style={styles.profileDetailValue}>10 jours</span>
              </div>
            </div>
          </div>

          {/* Domains Section */}
          <div style={styles.domainsSection}>
            <h4 style={styles.sectionTitle}> Domaines d'activité</h4>
            <div style={styles.domainsList}>
              {domains.length > 0 ? (
                domains.map((domain, i) => (
                  <label 
                    key={i} 
                    style={{
                      ...styles.domainItem,
                      backgroundColor: domain.selected ? '#fff5f0' : '#fafafa',
                      borderColor: domain.selected ? '#ff6b35' : '#f0f0f0',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = domain.selected ? '#ffede5' : '#f0f0f0';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = domain.selected ? '#fff5f0' : '#fafafa';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <input
                      type="checkbox"
                      style={styles.domainCheckbox}
                      checked={domain.selected}
                      onChange={() => {
                        const updated = domains.map((d, index) =>
                          index === i ? { ...d, selected: !d.selected } : d
                        );
                        setDomains(updated);
                      }}
                    />
                    <span style={{ fontWeight: domain.selected ? '600' : '400' }}>
                      {domain.name}
                    </span>
                  </label>
                ))
              ) : (
                <p style={{ color: '#666', fontStyle: 'italic' }}>Aucun domaine défini.</p>
              )}
            </div>

            <div style={styles.domainInputGroup}>
              <input
                type="text"
                style={styles.domainInput}
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
                placeholder="Ajouter un nouveau domaine"
                onFocus={(e) => e.target.style.borderColor = '#ff6b35'}
                onBlur={(e) => e.target.style.borderColor = '#f0f0f0'}
              />
              <button 
                onClick={handleAddDomain} 
                style={{
                  ...styles.button,
                  ...styles.addButton,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#e55a2b';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 107, 53, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ff6b35';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 107, 53, 0.2)';
                }}
              >
                 Ajouter
              </button>
            </div>

            <button 
              onClick={handleSaveDomains} 
              style={{
                ...styles.button,
                ...styles.saveButton,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#218838';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(40, 167, 69, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#28a745';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(40, 167, 69, 0.2)';
              }}
            >
               Sauvegarder les domaines
            </button>
          </div>
          
          {/* View Jobs Link */}
          <div style={styles.viewJobsLink}>
            <Link 
              to="/RecruiterJobOffers" 
              style={styles.viewJobsButton}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#e55a2b';
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(255, 107, 53, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ff6b35';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 107, 53, 0.3)';
              }}
            >
               Voir mes offres d'emploi
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default RecruiterProfile;