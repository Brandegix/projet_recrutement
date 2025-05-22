import React, { useState, useEffect } from 'react';
import '../assets/css/Candidatesadmin.css'; // Réutilisation du style
import { FiSearch, FiHome, FiUsers, FiBriefcase, FiCalendar } from 'react-icons/fi';
import { Link , useNavigate} from "react-router-dom";
import { FiBarChart, FiClipboard , FiLogOut} from "react-icons/fi";  // ✅ Import the icon

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
          <div className="table-container">
            <table className="candidates-table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Entreprise</th>
                  <th>Email</th>
                  <th>subscription</th>

                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
  {filteredRecruiters.map(recruiter => (
    <tr key={recruiter.id}>
      <td>{recruiter.name}</td>
      <td>{recruiter.companyName}</td>
      <td>{recruiter.email}</td>
      <td>
  <span
    style={{
      color: recruiter.subscription_active ? "green" : "orange",
      fontWeight: "bold",
      display: "block",
      marginBottom: "6px"
    }}
  >
    {recruiter.subscription_active ? "approuvé" : "en attente"}
  </span>
  <button
    onClick={() => toggleSubscription(recruiter.id)}
    style={{
      padding: "6px 12px",
      border: "none",
      borderRadius: "6px",
      fontSize: "14px",
      fontWeight: "500",
      color: "white",
      backgroundColor: recruiter.subscription_active ? "#f44336" : "#4CAF50", // Red for 'Refuser', Green for 'Approuver'
      cursor: "pointer",
      margin: "3px 0",
      transition: "background-color 0.2s ease",
      width: "100px"
    }}
  >
    {recruiter.subscription_active ? "Refuser" : "Approuver"}
  </button>
</td>

<td>
  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
    <button
      onClick={() => handleEditClick(recruiter)}
      style={{
        padding: "6px 12px",
        border: "none",
        borderRadius: "6px",
        fontSize: "14px",
        fontWeight: "500",
        color: "white",
        backgroundColor: "#2196F3", // Blue for 'Modifier'
        cursor: "pointer",
        margin: "3px 0",
        transition: "background-color 0.2s ease",
        width: "100px"
      }}
    >
      Modifier
    </button>
    <button
      onClick={() => handleDelete(recruiter.id)}
      style={{
        padding: "6px 12px",
        border: "none",
        borderRadius: "6px",
        fontSize: "14px",
        fontWeight: "500",
        color: "white",
        backgroundColor: "#f44336", // Red for 'Supprimer'
        cursor: "pointer",
        margin: "3px 0",
        transition: "background-color 0.2s ease",
        width: "100px"
      }}
    >
      Supprimer
    </button>
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
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Modifier le recruteur</h3>
            <label>Nom :</label>
            <input
              type="text"
              value={selectedRecruiter.name}
              onChange={(e) =>
                setSelectedRecruiter({ ...selectedRecruiter, name: e.target.value })
              }
            />
            <label>Entreprise :</label>
            <input
              type="text"
              value={selectedRecruiter.companyName}
              onChange={(e) =>
                setSelectedRecruiter({ ...selectedRecruiter, companyName: e.target.value })
              }
            />
            <label>Email :</label>
            <input
              type="email"
              value={selectedRecruiter.email}
              onChange={(e) =>
                setSelectedRecruiter({ ...selectedRecruiter, email: e.target.value })
              }
            />
            <div className="modal-actions">
              <button onClick={handleSaveChanges}>Enregistrer</button>
              <button onClick={handleModalClose}>Annuler</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recruitersadmin;