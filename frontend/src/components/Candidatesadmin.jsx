import React, { useState, useEffect } from 'react';
import '../assets/css/Candidatesadmin.css';
import { FiSearch, FiMoreVertical, FiEdit, FiTrash } from 'react-icons/fi';
import { Link , useNavigate } from "react-router-dom";
import { FiHome, FiUsers, FiBriefcase, FiCalendar, FiMail, FiSettings, FiChevronDown } from 'react-icons/fi';
import { FiBarChart, FiClipboard,FiLogOut } from "react-icons/fi";  // ✅ Import the icon

const Candidatesadmin = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
  
    useEffect(() => {
      fetch(`${process.env.REACT_APP_API_URL}/api/session`, {
        credentials: "include",
      })
        .then(res => res.ok ? res.json() : Promise.reject("Not logged in"))
        .then(data => {
          if (data?.isLoggedIn) {
            setIsLoggedIn(true);
            setUser(data.user);
          } else {
            setIsLoggedIn(false);
            setUser(null);
          }
        })
        .catch(() => {
          setIsLoggedIn(false);
          setUser(null);
        });
    }, []);
  
    const handleLogout = () => {
      fetch(`${process.env.REACT_APP_API_URL}/api/logout`, {
        method: "POST",
        credentials: "include",
      })
        .then(res => res.ok ? res.json() : Promise.reject("Logout failed"))
        .then(() => {
          setIsLoggedIn(false);
          navigate("/");
        })
        .catch(() => alert("Erreur lors de la déconnexion."));
    };
  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/candidates1`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (!Array.isArray(data)) throw new Error('API response is not an array');
      setCandidates(data);
      setError(null);
    } catch (error) {
      console.error("Fetch error:", error);
      setError(error.message);
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce candidat ?')) return;
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/candidates/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Erreur lors de la suppression.');
      fetchCandidates(); // rafraîchit la liste
    } catch (err) {
      alert("Erreur lors de la suppression");
    }
  };

  const handleEditClick = (candidate) => {
    setSelectedCandidate(candidate);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedCandidate(null);
  };

  const handleSaveChanges = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/candidates/${selectedCandidate.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedCandidate),
      });
      if (!response.ok) throw new Error('Erreur lors de la mise à jour.');
      fetchCandidates();
      handleModalClose();
    } catch (err) {
      alert("Erreur lors de la mise à jour");
    }
  };

  const filteredCandidates = candidates.filter(candidate => {
    if (!candidate || !candidate.name) return false;
    const nameMatch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase());
    const skillsMatch = candidate.skills &&
      candidate.skills.toLowerCase().includes(searchTerm.toLowerCase());
    return nameMatch || skillsMatch;
  });

  if (loading) return <div className="loading">Chargement des candidats...</div>;
  if (error) return <div className="error-message">Erreur : {error}</div>;

  return (
    <div className="candidates-container">
    <div className="sidebar">
           <div className="sidebar-header"><h2>Casajobs.ma</h2></div>
           <nav className="sidebar-nav">
             <ul>
             <li className="active">
  <FiHome className="icon" />
  <Link to="/Dashboard_admin">
    <span>Tableau de bord</span>
  </Link>
</li>
                        
               <li>
       <FiUsers className="icon" />  
       <Link to="/Candidatesadmin">      <span>Gérer les candidats</span>
       </Link>
     </li>
     <li>
       <FiUsers className="icon" />  
       <Link to="/ManageRecruiters">
         <span>Gérer les recruteurs</span>
       </Link>
     </li>
     <li>
       <FiClipboard className="icon" />
       <Link to="/applicationss">
         <span>Candidats et leurs postulations</span>
       </Link>
     </li>
   
     <li>
       <FiBarChart className="icon" />
       <Link to="/AdminDashboard">
         <span>Statistiques</span>
       </Link>
     </li>
   
     <li>
       <FiBriefcase className="icon" />
       <Link to="/ManageJobs">  {/* ✅ Link to ManageJobs */}
         <span>Gérer les offres</span>
       </Link>
     </li>
   
    
      {/* ✅ Logout Styled as a Sidebar Link */}
      {isLoggedIn && user && (
        <li onClick={handleLogout} className="logout-link">
          <FiLogOut className="icon" />
          <span>Se déconnecter</span>
        </li>
      )}
             </ul>
           </nav>

   
         </div>
   
  
      <header className="candidates-header">
        <h1>Candidats</h1>
        <p>Gérez et suivez tous vos candidats.</p>
      </header>

      <div className="search-bar">
        <FiSearch className="search-icon" />
        <input
          type="text"
          placeholder="Rechercher par nom ou compétences..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="candidates-content">
        <h2>Tous les candidats</h2>

        {filteredCandidates.length === 0 ? (
          <div className="no-results">
            {candidates.length === 0
              ? "Aucun candidat dans la base de données."
              : "Aucun candidat ne correspond à votre recherche."}
          </div>
        ) : (
          <div style={{
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
            overflow: "hidden",
            border: "1px solid #f0f0f0",
            marginTop: "20px"
          }}>
            <table style={{
              width: "100%",
              borderCollapse: "collapse",
              backgroundColor: "white"
            }}>
              <thead>
                <tr style={{
                  background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
                  borderBottom: "2px solid #ff6b35"
                }}>
                  <th style={{
                    color: "white",
                    fontWeight: "600",
                    fontSize: "14px",
                    padding: "18px 16px",
                    textAlign: "left",
                    letterSpacing: "0.5px",
                    textTransform: "uppercase"
                  }}>Nom</th>
                  <th style={{
                    color: "white",
                    fontWeight: "600",
                    fontSize: "14px",
                    padding: "18px 16px",
                    textAlign: "left",
                    letterSpacing: "0.5px",
                    textTransform: "uppercase"
                  }}>Email</th>
                  <th style={{
                    color: "white",
                    fontWeight: "600",
                    fontSize: "14px",
                    padding: "18px 16px",
                    textAlign: "left",
                    letterSpacing: "0.5px",
                    textTransform: "uppercase"
                  }}>Téléphone</th>
                 
                  <th style={{
                    color: "white",
                    fontWeight: "600",
                    fontSize: "14px",
                    padding: "18px 16px",
                    textAlign: "center",
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                    width: "140px"
                  }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCandidates.map((candidate, index) => (
                  <tr key={candidate.id} style={{
                    backgroundColor: index % 2 === 0 ? "#ffffff" : "#fafafa",
                    borderBottom: "1px solid #e8e8e8",
                    transition: "all 0.3s ease",
                    cursor: "pointer"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#fff5f0";
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(255, 107, 53, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = index % 2 === 0 ? "#ffffff" : "#fafafa";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}>
                    <td style={{
                      padding: "16px",
                      fontSize: "14px",
                      color: "#2d2d2d",
                      fontWeight: "500"
                    }}>{candidate.name}</td>
                    <td style={{
                      padding: "16px",
                      fontSize: "13px",
                      color: "#666666"
                    }}>{candidate.email}</td>
                    <td style={{
                      padding: "16px",
                      fontSize: "14px",
                      color: "#666666"
                    }}>{candidate.phoneNumber}</td>
                    
                    <td style={{
                      padding: "16px",
                      textAlign: "center"
                    }}>
                      <div style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "12px",
                        alignItems: "center"
                      }}>
                        <div
                          onClick={() => handleEditClick(candidate)}
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            backgroundColor: "#ff6b35",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            boxShadow: "0 2px 8px rgba(255, 107, 53, 0.3)"
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#e55722";
                            e.currentTarget.style.transform = "scale(1.1)";
                            e.currentTarget.style.boxShadow = "0 4px 16px rgba(255, 107, 53, 0.4)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "#ff6b35";
                            e.currentTarget.style.transform = "scale(1)";
                            e.currentTarget.style.boxShadow = "0 2px 8px rgba(255, 107, 53, 0.3)";
                          }}
                        >
                          <FiEdit style={{
                            fontSize: "16px",
                            color: "white"
                          }} />
                        </div>
                        <div
                          onClick={() => handleDelete(candidate.id)}
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            backgroundColor: "#2d2d2d",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            boxShadow: "0 2px 8px rgba(45, 45, 45, 0.3)"
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#1a1a1a";
                            e.currentTarget.style.transform = "scale(1.1)";
                            e.currentTarget.style.boxShadow = "0 4px 16px rgba(45, 45, 45, 0.4)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "#2d2d2d";
                            e.currentTarget.style.transform = "scale(1)";
                            e.currentTarget.style.boxShadow = "0 2px 8px rgba(45, 45, 45, 0.3)";
                          }}
                        >
                          <FiTrash style={{
                            fontSize: "16px",
                            color: "white"
                          }} />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && selectedCandidate && (
        <div style={{
          position: "fixed",
          top: "0",
          left: "0",
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: "1000",
          backdropFilter: "blur(4px)"
        }}>
          <div style={{
            backgroundColor: "white",
            borderRadius: "16px",
            padding: "32px",
            width: "90%",
            maxWidth: "500px",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
            border: "2px solid #ff6b35"
          }}>
            <h3 style={{
              margin: "0 0 24px 0",
              color: "#2d2d2d",
              fontSize: "24px",
              fontWeight: "700",
              textAlign: "center",
              paddingBottom: "16px",
              borderBottom: "2px solid #ff6b35"
            }}>Modifier le candidat</h3>
            
            <div style={{ marginBottom: "20px" }}>
              <label style={{
                display: "block",
                marginBottom: "8px",
                color: "#2d2d2d",
                fontSize: "14px",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}>Nom :</label>
              <input
                type="text"
                value={selectedCandidate.name}
                onChange={(e) =>
                  setSelectedCandidate({ ...selectedCandidate, name: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "2px solid #e8e8e8",
                  borderRadius: "8px",
                  fontSize: "14px",
                  backgroundColor: "#fafafa",
                  transition: "all 0.3s ease",
                  outline: "none",
                  boxSizing: "border-box"
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#ff6b35";
                  e.currentTarget.style.backgroundColor = "white";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#e8e8e8";
                  e.currentTarget.style.backgroundColor = "#fafafa";
                }}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{
                display: "block",
                marginBottom: "8px",
                color: "#2d2d2d",
                fontSize: "14px",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}>Email :</label>
              <input
                type="email"
                value={selectedCandidate.email}
                onChange={(e) =>
                  setSelectedCandidate({ ...selectedCandidate, email: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "2px solid #e8e8e8",
                  borderRadius: "8px",
                  fontSize: "14px",
                  backgroundColor: "#fafafa",
                  transition: "all 0.3s ease",
                  outline: "none",
                  boxSizing: "border-box"
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#ff6b35";
                  e.currentTarget.style.backgroundColor = "white";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#e8e8e8";
                  e.currentTarget.style.backgroundColor = "#fafafa";
                }}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{
                display: "block",
                marginBottom: "8px",
                color: "#2d2d2d",
                fontSize: "14px",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}>Téléphone :</label>
              <input
                type="text"
                value={selectedCandidate.phoneNumber}
                onChange={(e) =>
                  setSelectedCandidate({ ...selectedCandidate, phoneNumber: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "2px solid #e8e8e8",
                  borderRadius: "8px",
                  fontSize: "14px",
                  backgroundColor: "#fafafa",
                  transition: "all 0.3s ease",
                  outline: "none",
                  boxSizing: "border-box"
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#ff6b35";
                  e.currentTarget.style.backgroundColor = "white";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#e8e8e8";
                  e.currentTarget.style.backgroundColor = "#fafafa";
                }}
              />
            </div>

            <div style={{ marginBottom: "32px" }}>
              <label style={{
                display: "block",
                marginBottom: "8px",
                color: "#2d2d2d",
                fontSize: "14px",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}>Compétences :</label>
              <input
                type="text"
                value={selectedCandidate.skills || ''}
                onChange={(e) =>
                  setSelectedCandidate({ ...selectedCandidate, skills: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "2px solid #e8e8e8",
                  borderRadius: "8px",
                  fontSize: "14px",
                  backgroundColor: "#fafafa",
                  transition: "all 0.3s ease",
                  outline: "none",
                  boxSizing: "border-box"
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#ff6b35";
                  e.currentTarget.style.backgroundColor = "white";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#e8e8e8";
                  e.currentTarget.style.backgroundColor = "#fafafa";
                }}
              />
            </div>

            <div style={{
              display: "flex",
              gap: "16px",
              justifyContent: "center"
            }}>
              <button
                onClick={handleSaveChanges}
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#ff6b35",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  minWidth: "120px"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#e55722";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(255, 107, 53, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#ff6b35";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                Enregistrer
              </button>
              <button
                onClick={handleModalClose}
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#2d2d2d",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  minWidth: "120px"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#1a1a1a";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(45, 45, 45, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#2d2d2d";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Candidatesadmin;