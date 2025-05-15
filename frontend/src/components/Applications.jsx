import React, { useEffect, useState } from 'react';
import '../assets/css/Applications.css';
import { FiSearch, FiHome, FiUsers, FiBriefcase, FiCalendar, FiBarChart, FiClipboard, FiLogOut } from 'react-icons/fi';
import Navbar from "../components/Navbara";
import Footer from "../components/Footer";
import { Link, useNavigate } from "react-router-dom";

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
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
    fetch('http://localhost:5000/api/sapplications')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setApplications(data);
        } else if (Array.isArray(data.applications)) {
          setApplications(data.applications);
        } else {
          console.error("Format inattendu:", data);
          setApplications([]);
        }
      })
      .catch(err => console.error("Erreur lors du chargement des candidatures:", err));
  }, []);

  const filteredApplications = Array.isArray(applications)
    ? applications.filter(app => {
        if (!app.candidate?.name) return false;
        return app.candidate.name.toLowerCase().includes(searchTerm.toLowerCase());
      })
    : [];

  return (
    <div className="candidates-container">
      <div className="sidebar">
        <div className="sidebar-header"><h2>Casajobs.ma</h2></div>
        <nav className="sidebar-nav">
          <ul>
            <li className="active">
              <FiHome className="icon" />
              <Link to="/Dashboard_admin"><span>Tableau de bord</span></Link>
            </li>
            <li>
              <FiUsers className="icon" />
              <Link to="/Candidatesadmin"><span>Gérer les candidats</span></Link>
            </li>
            <li>
              <FiUsers className="icon" />
              <Link to="/ManageRecruiters"><span>Gérer les recruteurs</span></Link>
            </li>
            <li>
              <FiClipboard className="icon" />
              <Link to="/applicationss"><span>Candidats et leurs postulations</span></Link>
            </li>
            <li>
              <FiBarChart className="icon" />
              <Link to="/AdminDashboard"><span>Statistiques</span></Link>
            </li>
            <li>
              <FiBriefcase className="icon" />
              <Link to="/ManageJobs"><span>Gérer les offres</span></Link>
            </li>
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
        <h1>Liste des Candidatures</h1>
        <p>Gérez et suivez toutes les candidatures reçues.</p>
      </header>

      <div className="search-bar">
        <FiSearch className="search-icon" />
        <input
          type="text"
          placeholder="Rechercher par nom..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="table-container">
        {filteredApplications.length === 0 ? (
          <p className="empty-message">Aucune candidature trouvée.</p>
        ) : (
          <table className="applications-table">
            <thead>
              <tr>
                <th>Nom du Candidat</th>
                <th>Email</th>
                <th>Téléphone</th>
                <th>Poste</th>
                <th>Entreprise</th>
                <th>Date de Candidature</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.map(app => (
                <tr key={app.id}>
                  <td>{app.candidate?.name || "Inconnu"}</td>
                  <td>{app.candidate?.email || "N/A"}</td>
                  <td>{app.candidate?.phoneNumber || "N/A"}</td>
                  <td>{app.job_offer?.title || "Inconnu"}</td>
                  <td>{app.job_offer?.company || "N/A"}</td>
                  <td>{app.application_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Applications;
