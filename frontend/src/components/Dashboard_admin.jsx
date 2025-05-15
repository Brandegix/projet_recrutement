import React, { useState, useEffect } from 'react';
import "../assets/css/Dashboard_admin.css";
import { FaChartLine, FaUserPlus, FaClipboardList } from 'react-icons/fa';
import { FiHome, FiUsers, FiBriefcase, FiCalendar, FiMail, FiSettings, FiChevronDown } from 'react-icons/fi';
import { Link , useNavigate } from "react-router-dom";
import { FiBarChart, FiClipboard,FiLogOut } from "react-icons/fi";  // ✅ Import the icon
const Dashboard_admin = () => {
    const [candidats, setCandidats] = useState([]);  // Initialiser comme un tableau vide

  const [dashboardData, setDashboardData] = useState({
    total_candidates: 0,
    total_recruiters: 0,
    total_job_offers: 0,
    applications_this_week: 0,
    new_applications_today: 0,
    avg_applications_per_offer: 0,
    offers_with_applications: 0,
    offers_without_applications: 0,
    recent_applications: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/dashboardd');
        const data = await response.json();
  
        console.log("Fetched Dashboard Data:", data); // ✅ Debugging Log
        setDashboardData(data); // ✅ Set correct API response
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);
  

  if (loading) {
    return (
      <div className="app-container">
     <div className="sidebar">
                       <div className="sidebar-header"><h2>Casajobs.ma</h2></div>
                       <nav className="sidebar-nav">
                         <ul>
                           <li className="active"><FiHome className="icon" /><span>Tableau de bord</span></li>
                                    
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
        <main className="main-content">
          <div className="loading">Chargement en cours...</div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container">
        <main className="main-content">
          <div className="error">Erreur: {error}</div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-container">
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

      <main className="main-content">
        <header className="main-header">
          <h1>Tableau de bord</h1>
          <div className="user-profile"><span>Admin</span><div className="avatar">A</div></div>
        </header>

        <div className="dashboard">
          <p className="subtitle">Aperçu de vos activités de recrutement</p>

          <div className="grid-container">
            <div className="card">
              <div className="card-header"><FaChartLine className="card-icon" /><span className="card-title">Candidats totaux</span></div>
              <div className="big-number">{dashboardData.total_candidates}</div>
            </div>

            <div className="card">
              <div className="card-header"><FiUsers className="card-icon" /><span className="card-title">Recruteurs totaux</span></div>
              <div className="big-number">{dashboardData.total_recruiters}</div>
            </div>

            <div className="card">
              <div className="card-header"><FiBriefcase className="card-icon" /><span className="card-title">Offres totales</span></div>
              <div className="big-number">{dashboardData.total_job_offers}</div>
            </div>

            <div className="card">
              <div className="card-header"><FiCalendar className="card-icon" /><span className="card-title">Candidatures cette semaine</span></div>
              <div className="big-number">{dashboardData.applications_this_week}</div>
            </div>

            <div className="card">
              <div className="card-header"><FaUserPlus className="card-icon" /><span className="card-title">Candidatures aujourd’hui</span></div>
              <div className="big-number">{dashboardData.new_applications_today}</div>
            </div>

            <div className="card">
              <div className="card-header"><FaClipboardList className="card-icon" /><span className="card-title">Moy. de candidatures / offre</span></div>
              <div className="big-number">{dashboardData.avg_applications_per_offer}</div>
            </div>

            <div className="card">
              <div className="card-header"><FiBriefcase className="card-icon" /><span className="card-title">Offres avec candidatures</span></div>
              <div className="big-number">{dashboardData.offers_with_applications}</div>
            </div>

            <div className="card">
              <div className="card-header"><FiBriefcase className="card-icon" /><span className="card-title">Offres sans candidatures</span></div>
              <div className="big-number">{dashboardData.offers_without_applications}</div>
            </div>

            <div className="card recent-apps full-width">
              <div className="card-header"><FaUserPlus className="card-icon" /><span className="card-title">Candidatures récentes</span></div>
              {dashboardData.recent_applications.length > 0 ? (
                dashboardData.recent_applications.map((app, index) => (
                  <div key={index} className="applicant">
                    <div className="initials" style={{ backgroundColor: app.avatar || '#4285F4' }}>
                      {app.initials || 'NA'}
                    </div>
                    <div className="info">
                      <div className="name">{app.name || 'Nom inconnu'}</div>
                      <div className="position">{app.position || 'Poste non spécifié'}</div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-applications">Aucune candidature récente</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard_admin;