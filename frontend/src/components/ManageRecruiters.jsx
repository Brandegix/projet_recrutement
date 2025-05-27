import React, { useState, useEffect } from 'react';
import '../assets/css/Candidatesadmin.css'; // Réutilisation du style
import { FiSearch, FiHome, FiUsers, FiBriefcase, FiCalendar } from 'react-icons/fi';
import { Link , useNavigate} from "react-router-dom";
import { FiBarChart, FiClipboard , FiLogOut, FiEdit, FiTrash} from "react-icons/fi";  // ✅ Import the icon

const Recruitersadmin = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRecruiter, setSelectedRecruiter] = useState(null);
  const [showModal, setShowModal] = useState(false);

    const navigate = useNavigate();
      const [isLoggedIn, setIsLoggedIn] = useState(false);
      const [user, setUser] = useState(null);

      const toggleSubscription = async (id) => {
        try {
          const recruiter = recruiters.find(r => r.id === id);
          if (!recruiter) return;

          const updatedSubscriptionStatus = recruiter.subscription_active ?? false; // ✅ Ensure it has a default value

          const response = await fetch(`${process.env.REACT_APP_API_URL}/api/recruiters/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ subscription_active: !updatedSubscriptionStatus })
          });

          if (!response.ok) throw new Error("Failed to update subscription status");

          const updatedRecruiter = await response.json();
          setRecruiters(prevRecruiters =>
            prevRecruiters.map(r =>
              r.id === id ? { ...r, subscription_active: updatedRecruiter.subscription_active } : r
            )
          );
        } catch (err) {
          alert("Error updating subscription status");
        }
      };

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
    fetchRecruiters();
  }, []);

  const fetchRecruiters = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/recruiters`);
      if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);

      const data = await response.json();

      console.log("📢 Recruiter Data in Frontend BEFORE setting state:", data);  // ✅ Debugging statement

      setRecruiters(data.map(recruiter => ({
        ...recruiter,
        subscription_active: recruiter.subscription_active ?? false // ✅ Prevent undefined values
      })));

      setError(null);
    } catch (err) {
      setError(err.message);
      setRecruiters([]);
    } finally {
      setLoading(false);
    }
  };


  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce recruteur ?')) return;
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/recruiters/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error("Erreur lors de la suppression.");
      fetchRecruiters();
    } catch (err) {
      alert("Erreur lors de la suppression");
    }
  };

  const handleEditClick = (recruiter) => {
    setSelectedRecruiter(recruiter);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedRecruiter(null);
  };

  const handleSaveChanges = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/recruiters/${selectedRecruiter.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedRecruiter),
      });
      if (!response.ok) throw new Error("Erreur lors de la mise à jour.");
      fetchRecruiters();
      handleModalClose();
    } catch (err) {
      alert("Erreur lors de la mise à jour");
    }
  };

  const filteredRecruiters = recruiters.filter(r =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.subscription_active === (searchTerm === "true") // ✅ Direct boolean comparison
      );


  if (loading) return <div className="loading">Chargement des recruteurs...</div>;
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
  <Link to="/Candidatesadmin">    <span>Gérer les candidats</span>
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
        <h1>Recruteurs</h1>
        <p>Gérez et suivez tous vos recruteurs.</p>
      </header>

      <div className="search-bar">
        <FiSearch className="search-icon" />
        <input
          type="text"
          placeholder="Rechercher par nom, entreprise ou email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="candidates-header">
        <h2>Liste des recruteurs</h2>

        {filteredRecruiters.length === 0 ? (
          <div className="no-results">
            {recruiters.length === 0
              ? "Aucun recruteur dans la base de données."
              : "Aucun recruteur ne correspond à votre recherche."}
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
                  }}>Entreprise</th>
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
                  }}>RC</th>
                  <th style={{
                    color: "white",
                    fontWeight: "600",
                    fontSize: "14px",
                    padding: "18px 16px",
                    textAlign: "center",
                    letterSpacing: "0.5px",
                    textTransform: "uppercase"
                  }}>Status</th>
                  <th style={{
                    color: "white",
                    fontWeight: "600",
                    fontSize: "14px",
                    padding: "18px 16px",
                    textAlign: "center",
                    letterSpacing: "0.5px",
                    textTransform: "uppercase"
                  }}>Actions Abonnement</th>
                  <th style={{
                    color: "white",
                    fontWeight: "600",
                    fontSize: "14px",
                    padding: "18px 16px",
                    textAlign: "center",
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                    width: "140px"
                  }}>Gestion</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecruiters.map((recruiter, index) => (
                  <tr key={recruiter.id} style={{
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
                    }}>{recruiter.name}</td>
                    <td style={{
                      padding: "16px",
                      fontSize: "14px",
                      color: "#2d2d2d",
                      fontWeight: "500"
                    }}>{recruiter.companyName}</td>
                    <td style={{
                      padding: "16px",
                      fontSize: "13px",
                      color: "#666666"
                    }}>{recruiter.email}</td>
                    <td style={{
                      padding: "16px",
                      fontSize: "14px",
                      color: "#666666"
                    }}>{recruiter.rc || "N/A"}</td>
                    <td style={{
                      padding: "16px",
                      textAlign: "center"
                    }}>
                      <span style={{
                        display: "inline-block",
                        padding: "6px 14px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: "700",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        backgroundColor: recruiter.subscription_active ? "#e8f5e8" : "#fff3e0",
                        color: recruiter.subscription_active ? "#2e7d32" : "#f57c00",
                        border: `2px solid ${recruiter.subscription_active ? "#4caf50" : "#ff9800"}`
                      }}>
                        {recruiter.subscription_active ? "Approuvé" : "En Attente"}
                      </span>
                    </td>
                    <td style={{
                      padding: "16px",
                      textAlign: "center"
                    }}>
                      <button
                        onClick={() => toggleSubscription(recruiter.id)}
                        style={{
                          padding: "8px 16px",
                          border: "none",
                          borderRadius: "8px",
                          fontSize: "13px",
                          fontWeight: "600",
                          color: "white",
                          backgroundColor: recruiter.subscription_active ? "#d32f2f" : "#ff6b35",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          minWidth: "100px"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-2px)";
                          e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.2)";
                          e.currentTarget.style.backgroundColor = recruiter.subscription_active ? "#b71c1c" : "#e55722";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "0 2px 6px rgba(0, 0, 0, 0.1)";
                          e.currentTarget.style.backgroundColor = recruiter.subscription_active ? "#d32f2f" : "#ff6b35";
                        }}
                      >
                        {recruiter.subscription_active ? "Refuser" : "Approuver"}
                      </button>
                    </td>
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
                          onClick={() => handleEditClick(recruiter)}
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
                          onClick={() => handleDelete(recruiter.id)}
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

      {showModal && selectedRecruiter && (
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
            }}>Modifier le recruteur</h3>
            
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
                value={selectedRecruiter.name}
                onChange={(e) =>
                  setSelectedRecruiter({ ...selectedRecruiter, name: e.target.value })
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
              }}>Entreprise :</label>
              <input
                type="text"
                value={selectedRecruiter.companyName}
                onChange={(e) =>
                  setSelectedRecruiter({ ...selectedRecruiter, companyName: e.target.value })
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
              }}>Email :</label>
              <input
                type="email"
                value={selectedRecruiter.email}
                onChange={(e) =>
                  setSelectedRecruiter({ ...selectedRecruiter, email: e.target.value })
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

export default Recruitersadmin;