import React, { useEffect, useState } from "react";
// import "../../assets/css/CandidateProfile.css"; // Removed import of external CSS
import Navbar from "../Navbara";
import Footer from "../Footer";
import candidatImage from '../../assets/images/choixRole/recruiter.jpg';
import JobSearchAndOffers from "../JobSearchAndOffers";
import { Link } from "react-router-dom";
import JobCardss from "./JobCardss";
import SEO from "../SEO";

function CandidateProfile() {
  const [candidate, setCandidate] = useState(null);
  const [cvFile, setCvFile] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [applicationCount, setApplicationCount] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    // Récupérer les détails du candidat, y compris les compétences
    fetch(`${process.env.REACT_APP_API_URL}/api/candidates/profile`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        console.log(res);
        if (!res.ok) throw new Error("Échec de la récupération des données du candidat");
        return res.json();
      })
      .then(data => {
        if (typeof data.skills === 'string') {
          data.skills = JSON.parse(data.skills);
        }
        if (data.profile_image) {
          console.log('Image de profil disponible:', data.profile_image);
        }
        setCandidate(data);
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
        setApplicationCount(data.statistics.application_count);
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
        return res.json();
      })
      .then(data => {
        setCandidate(prevState => ({
          ...prevState,
          profile_image: data.profile_image,
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

  const styles = {
    profilePage: {
      minHeight: '100vh',
      backgroundColor: '#fafafa',
      paddingTop: '20px',
      paddingBottom: '60px',
      '@media (min-width: 768px)': {
        paddingTop: '40px',
      }
    },
    profileContainer: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 15px',
      '@media (min-width: 768px)': {
        padding: '0 20px',
      }
    },
    profileHeader: {
      background: 'linear-gradient(135deg, #fff 0%, #f8f8f8 100%)',
      borderRadius: '15px',
      padding: '20px',
      marginBottom: '20px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
      border: '1px solid #f0f0f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '20px',
      flexDirection: 'column',
      textAlign: 'center',
      '@media (min-width: 768px)': {
        borderRadius: '20px',
        padding: '40px',
        marginBottom: '30px',
        flexDirection: 'row',
        gap: '40px',
        textAlign: 'left',
      }
    },
    profilePicture: {
      position: 'relative',
      width: '120px',
      height: '120px',
      cursor: 'pointer',
      flexShrink: 0,
      '@media (min-width: 768px)': {
        width: '180px',
        height: '180px',
      }
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
    hoverOverlay: {
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
      fontSize: '0.9rem',
      userSelect: 'none',
      transition: 'all 0.3s ease',
      '@media (min-width: 768px)': {
        fontSize: '1.1rem',
      }
    },
    profileInfo: {
      flex: 1,
      minWidth: '250px',
    },
    profileName: {
      fontSize: '2rem',
      fontWeight: '300',
      marginBottom: '0.5rem',
      background: 'linear-gradient(45deg, #ff6b35, #ff8c42)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      letterSpacing: '-1px',
      '@media (min-width: 768px)': {
        fontSize: '3rem',
      }
    },
    profileRole: {
      fontSize: '1rem',
      color: '#666',
      marginBottom: '15px',
      fontWeight: '400',
      '@media (min-width: 768px)': {
        fontSize: '1.2rem',
        marginBottom: '20px',
      }
    },
    editLink: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '10px 20px',
      backgroundColor: '#fff',
      color: '#333',
      border: '2px solid #ff6b35',
      borderRadius: '25px',
      fontSize: '0.9rem',
      textDecoration: 'none',
      fontWeight: '500',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(255, 107, 53, 0.1)',
      '@media (min-width: 768px)': {
        padding: '12px 24px',
        fontSize: '0.95rem',
      }
    },
    completionSection: {
      backgroundColor: '#fff',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '20px',
      boxShadow: '0 5px 20px rgba(0,0,0,0.06)',
      border: '1px solid #f0f0f0',
      '@media (min-width: 768px)': {
        borderRadius: '15px',
        padding: '25px',
        marginBottom: '30px',
      }
    },
    completionTitle: {
      fontSize: '1.1rem',
      fontWeight: '600',
      color: '#333',
      marginBottom: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      '@media (min-width: 768px)': {
        fontSize: '1.3rem',
        marginBottom: '15px',
        gap: '10px',
      }
    },
    progressBar: {
      width: '100%',
      height: '10px',
      backgroundColor: '#f0f0f0',
      borderRadius: '5px',
      overflow: 'hidden',
      marginBottom: '8px',
      '@media (min-width: 768px)': {
        height: '12px',
        borderRadius: '6px',
        marginBottom: '10px',
      }
    },
    progressFill: {
      height: '100%',
      background: 'linear-gradient(90deg, #ff6b35, #ff8c42)',
      borderRadius: '5px',
      transition: 'width 0.3s ease',
      '@media (min-width: 768px)': {
        borderRadius: '6px',
      }
    },
    mainContent: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '20px',
      marginBottom: '30px',
      '@media (min-width: 768px)': {
        gridTemplateColumns: '1fr 1fr',
        gap: '30px',
        marginBottom: '40px',
      }
    },
    card: {
      backgroundColor: '#fff',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 5px 20px rgba(0,0,0,0.06)',
      border: '1px solid #f0f0f0',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      '@media (min-width: 768px)': {
        borderRadius: '15px',
        padding: '30px',
      }
    },
    cardTitle: {
      fontSize: '1.2rem',
      fontWeight: '600',
      color: '#333',
      marginBottom: '15px',
      paddingBottom: '8px',
      borderBottom: '3px solid #ff6b35',
      display: 'inline-block',
      '@media (min-width: 768px)': {
        fontSize: '1.4rem',
        marginBottom: '20px',
        paddingBottom: '10px',
      }
    },
    profileDetail: {
      display: 'flex',
      alignItems: 'flex-start',
      padding: '10px 0',
      borderBottom: '1px solid #f5f5f5',
      flexDirection: 'column',
      gap: '4px',
      '@media (min-width: 768px)': {
        flexDirection: 'row',
        alignItems: 'center',
        padding: '12px 0',
        gap: '0',
      }
    },
    profileDetailLabel: {
      fontWeight: '600',
      color: '#555',
      minWidth: '100px',
      fontSize: '0.9rem',
      '@media (min-width: 768px)': {
        minWidth: '120px',
        fontSize: '0.95rem',
      }
    },
    profileDetailValue: {
      color: '#333',
      fontSize: '0.9rem',
      wordBreak: 'break-word',
      '@media (min-width: 768px)': {
        fontSize: '0.95rem',
      }
    },
    skillsSection: {
      backgroundColor: '#fff',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 5px 20px rgba(0,0,0,0.06)',
      border: '1px solid #f0f0f0',
      '@media (min-width: 768px)': {
        borderRadius: '15px',
        padding: '30px',
      }
    },
    skillItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 15px',
      borderRadius: '10px',
      backgroundColor: '#fafafa',
      marginBottom: '10px',
      border: '1px solid #f0f0f0',
      transition: 'all 0.3s ease',
      '@media (min-width: 768px)': {
        gap: '15px',
        padding: '15px 20px',
        borderRadius: '12px',
        marginBottom: '12px',
      }
    },
    skillIndicator: {
      width: '16px',
      height: '16px',
      borderRadius: '50%',
      flexShrink: 0,
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      '@media (min-width: 768px)': {
        width: '20px',
        height: '20px',
      }
    },
    skillName: {
      flex: 1,
      fontWeight: '600',
      fontSize: '0.9rem',
      color: '#333',
      '@media (min-width: 768px)': {
        fontSize: '1rem',
      }
    },
    skillLevel: {
      fontWeight: 'bold',
      fontSize: '0.8rem',
      '@media (min-width: 768px)': {
        fontSize: '0.9rem',
      }
    },
    cvSection: {
      backgroundColor: '#fff',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 5px 20px rgba(0,0,0,0.06)',
      border: '1px solid #f0f0f0',
      marginBottom: '20px',
      '@media (min-width: 768px)': {
        borderRadius: '15px',
        padding: '30px',
        marginBottom: '30px',
      }
    },
    cvForm: {
      display: 'flex',
      gap: '12px',
      alignItems: 'center',
      marginBottom: '15px',
      flexDirection: 'column',
      '@media (min-width: 768px)': {
        flexDirection: 'row',
        gap: '15px',
        marginBottom: '20px',
      }
    },
    fileInput: {
      width: '100%',
      padding: '10px 14px',
      border: '2px solid #f0f0f0',
      borderRadius: '8px',
      fontSize: '0.9rem',
      backgroundColor: '#fafafa',
      transition: 'border-color 0.3s ease',
      '@media (min-width: 768px)': {
        flex: '1',
        minWidth: '250px',
        padding: '12px 16px',
        borderRadius: '10px',
        fontSize: '0.95rem',
      }
    },
    uploadBtn: {
      backgroundColor: '#ff6b35',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      padding: '10px 20px',
      cursor: 'pointer',
      fontSize: '0.9rem',
      fontWeight: '600',
      width: '100%',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(255, 107, 53, 0.2)',
      '@media (min-width: 768px)': {
        borderRadius: '10px',
        padding: '12px 24px',
        fontSize: '0.95rem',
        minWidth: '180px',
        width: 'auto',
      }
    },
    currentCv: {
      padding: '12px 16px',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      border: '1px solid #e9ecef',
      '@media (min-width: 768px)': {
        padding: '15px 20px',
        borderRadius: '10px',
      }
    },
    cvLink: {
      color: '#ff6b35',
      textDecoration: 'none',
      fontWeight: '600',
      transition: 'color 0.3s ease',
    },
    offersLink: {
      textAlign: 'center',
      marginTop: '30px',
      '@media (min-width: 768px)': {
        marginTop: '40px',
      }
    },
    offersLinkBtn: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '12px 24px',
      backgroundColor: '#ff6b35',
      color: '#fff',
      textDecoration: 'none',
      borderRadius: '25px',
      fontSize: '1rem',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      boxShadow: '0 6px 20px rgba(255, 107, 53, 0.3)',
      '@media (min-width: 768px)': {
        gap: '10px',
        padding: '15px 30px',
        fontSize: '1.1rem',
      }
    },
  };

  const getSkillColor = (level) => {
    if (level >= 80) return '#ff6b35';
    if (level >= 50) return '#ff8c42';
    return '#ffb366';
  };

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
                src={candidate && candidate.profile_image 
                  ? `${process.env.REACT_APP_API_URL}/uploads/profile_images/${candidate.profile_image}`
                  : candidatImage}
                alt="Profil"
                style={{
                  ...styles.profileImg,
                  transform: isHovering ? 'scale(1.05)' : 'scale(1)',
                }}
              />

              {isHovering && (
                <div
                  style={styles.hoverOverlay}
                  onClick={() => document.getElementById('profile-image-input').click()}
                >
                  📸 Modifier
                </div>
              )}

              <input
                id="profile-image-input"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleProfileImageChange}
              />
            </div>

            <div style={styles.profileInfo}>
              <h2 style={styles.profileName}>
                {candidate ? candidate.name : "Chargement..."}
              </h2>
              <p style={styles.profileRole}>Profil candidat</p>
              <a
                href="/edit-profile"
                style={{
                  ...styles.editLink,
                  ':hover': {
                    backgroundColor: '#ff6b35',
                    color: '#fff',
                    transform: 'translateY(-2px)',
                  }
                }}
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
              </a>
            </div>
          </div>

          {/* Profile Completion */}
          {candidate && typeof candidate.completion === 'number' && (
            <div style={styles.completionSection}>
              <h4 style={styles.completionTitle}>
                📊 Complétion du profil
              </h4>
              <div style={styles.progressBar}>
                <div 
                  style={{
                    ...styles.progressFill,
                    width: `${candidate.completion}%`
                  }}
                />
              </div>
              <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>
                {candidate.completion}% complété
              </p>
            </div>
          )}

          {/* Main Content Grid */}
          <div style={styles.mainContent}>
            {/* Personal Details Card */}
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
              <h4 style={styles.cardTitle}> Informations personnelles</h4>
              <div style={styles.profileDetail}>
                <span style={styles.profileDetailLabel}>Email:</span>
                <span style={styles.profileDetailValue}>
                  {candidate ? candidate.email : "Chargement..."}
                </span>
              </div>
              <div style={styles.profileDetail}>
                <span style={styles.profileDetailLabel}>Téléphone:</span>
                <span style={styles.profileDetailValue}>
                  {candidate ? candidate.phoneNumber : "Chargement..."}
                </span>
              </div>
              <div style={styles.profileDetail}>
                <span style={styles.profileDetailLabel}>Adresse:</span>
                <span style={styles.profileDetailValue}>
                  {candidate ? candidate.address : "Chargement..."}
                </span>
              </div>
              <div style={styles.profileDetail}>
                <span style={styles.profileDetailLabel}>Naissance:</span>
                <span style={styles.profileDetailValue}>
                  {candidate ? candidate.dateOfBirth : "Chargement..."}
                </span>
              </div>
            </div>

            {/* Skills Card */}
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
              <h4 style={styles.cardTitle}> Compétences</h4>
              {candidate && candidate.skills ? (
                <div>
                  {candidate.skills.map((skill) => (
                    <div
                      key={skill.name}
                      style={{
                        ...styles.skillItem,
                        ':hover': {
                          backgroundColor: '#f5f5f5',
                          transform: 'translateX(5px)',
                        }
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f5f5f5';
                        e.currentTarget.style.transform = 'translateX(5px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#fafafa';
                        e.currentTarget.style.transform = 'translateX(0)';
                      }}
                    >
                      <div
                        style={{
                          ...styles.skillIndicator,
                          backgroundColor: getSkillColor(skill.level),
                        }}
                        title={`Niveau : ${skill.level}%`}
                      />
                      <span style={styles.skillName}>{skill.name}</span>
                      <span 
                        style={{
                          ...styles.skillLevel,
                          color: getSkillColor(skill.level)
                        }}
                      >
                        {skill.level}%
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: '#666', fontStyle: 'italic' }}>
                  Chargement des compétences...
                </p>
              )}
            </div>
          </div>

          {/* CV Upload Section */}
          <div style={styles.cvSection}>
            <h4 style={styles.cardTitle}> Téléchargez votre CV  (format PDF)</h4>
            
            <form onSubmit={handleCvUpload} style={styles.cvForm}>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleCvChange}
                style={{
                  ...styles.fileInput,
                  ':focus': {
                    borderColor: '#ff6b35',
                    outline: 'none',
                  }
                }}
                onFocus={(e) => e.target.style.borderColor = '#ff6b35'}
                onBlur={(e) => e.target.style.borderColor = '#f0f0f0'}
              />
              <button
                type="submit"
                style={styles.uploadBtn}
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
                 Télécharger CV
              </button>
            </form>

            {candidate && candidate.cv_filename ? (
              <div style={styles.currentCv}>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#555' }}>
                  <strong>CV actuel:</strong>{' '}
                  <a
                    href={candidate.cv_filename}
                    download // Forces download instead of opening
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.cvLink}
                  >
                    Voir CV
                  </a>
                </p>
              </div>
            ) : (
              <p style={{ fontSize: '0.9rem', color: '#999', fontStyle: 'italic' }}>
                Aucun CV téléchargé pour l'instant.
              </p>
            )}
          </div>


          {/* Job Offers Link */}
          <div style={styles.offersLink}>
            <Link 
              to="/offres" 
              style={styles.offersLinkBtn}
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
