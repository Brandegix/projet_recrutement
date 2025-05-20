import React, { useState, useEffect } from 'react';
import '../assets/css/Candidatesadmin.css';
import { FiSearch, FiMoreVertical } from 'react-icons/fi';
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
      fetch("http://localhost:5000/api/session", {
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
      fetch("http://localhost:5000/api/logout", {
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
      const response = await fetch('http://localhost:5000/api/candidates1');
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
      const response = await fetch(`http://localhost:5000/api/candidates/${id}`, { method: 'DELETE' });
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
      const response = await fetch(`http://localhost:5000/api/candidates/${selectedCandidate.id}`, {
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
          <div className="table-container">
            <table className="candidates-table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Téléphone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCandidates.map((candidate) => (
                  <tr key={candidate.id}>
                    <td>{candidate.name}</td>
                    <td>{candidate.email}</td>
                    <td>{candidate.phoneNumber}</td>
                    

                    <td>
                      <button onClick={() => handleDelete(candidate.id)}>Supprimer</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && selectedCandidate && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Modifier le candidat</h3>
            <label>Nom :</label>
            <input
              type="text"
              value={selectedCandidate.name}
              onChange={(e) =>
                setSelectedCandidate({ ...selectedCandidate, name: e.target.value })
              }
            />
            <label>Email :</label>
            <input
              type="email"
              value={selectedCandidate.email}
              onChange={(e) =>
                setSelectedCandidate({ ...selectedCandidate, email: e.target.value })
              }
            />
            <label>Téléphone :</label>
            <input
              type="text"
              value={selectedCandidate.phoneNumber}
              onChange={(e) =>
                setSelectedCandidate({ ...selectedCandidate, phoneNumber: e.target.value })
              }
            />
            <label>Compétences :</label>
            <input
              type="text"
              value={selectedCandidate.skills}
              onChange={(e) =>
                setSelectedCandidate({ ...selectedCandidate, skills: e.target.value })
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

export default Candidatesadmin;