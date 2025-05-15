import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/AdminDashboard.css';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';
import { FiHome, FiUsers, FiBriefcase, FiClipboard, FiBarChart } from 'react-icons/fi';

const AdminDashboard = () => {
  const [totalCandidates, setTotalCandidates] = useState(0);
  const [totalRecruiters, setTotalRecruiters] = useState(0);
  const [totalJobs, setTotalJobs] = useState(0);
  const [recentJobs, setRecentJobs] = useState([]);
  const [systemStats, setSystemStats] = useState({});
  const [darkMode, setDarkMode] = useState(false);
  const [totalApplications, setTotalApplications] = useState(0);
  const [showColorInputs, setShowColorInputs] = useState(false); // <-- toggle

  // Couleurs personnalisables
  const [barColor, setBarColor] = useState('#4cc9f0');
  const [pieColor1, setPieColor1] = useState('#4895ef');
  const [pieColor2, setPieColor2] = useState('#7209b7');

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = () => {
    fetch('http://localhost:5000/api/stats')
      .then(res => res.json())
      .then(data => {
        setTotalCandidates(data.totalCandidates);
        setTotalRecruiters(data.totalRecruiters);
        setTotalJobs(data.totalJobs);
        setRecentJobs(data.recentJobs);
        setSystemStats(data.systemStats);
        setTotalApplications(data.totalApplications);
      });
  };

  const handleLogout = () => {
    fetch("http://localhost:5000/api/logout", {
      method: "POST",
      credentials: "include",
    })
      .then(res => res.ok ? res.json() : Promise.reject("Logout failed"))
      .then(() => window.location.href = "/")
      .catch(() => alert("Erreur lors de la déconnexion."));
  };

  const chartData = [
    { name: 'Candidats', value: totalCandidates },
    { name: 'Recruteurs', value: totalRecruiters },
    { name: 'Offres', value: totalJobs },
  ];

  const chartData1 = [
    { name: 'Offres', value: totalJobs },
    { name: 'Candidatures', value: totalApplications },
  ];

  return (
    <div className={`dashboard-container ${darkMode ? 'dark-mode' : ''}`}>
      <div className="sidebar">
        <div className="sidebar-header"><h2>Casajobs.ma</h2></div>
        <nav className="sidebar-nav">
          <ul>
            <li className="active"><FiHome className="icon" /><span>Tableau de bord</span></li>
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
          </ul>
        </nav>
      </div>

      <div className='ikram'>
        <header>
          <h1>Statistiques</h1>
          <div className="theme-toggle-container">
            <div className="theme-toggle">
              <span>{darkMode ? "Mode sombre" : "Mode clair"}</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={() => setDarkMode(!darkMode)}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        </header>

        <div className="stats-container">
          <div className={`stat-box ${darkMode ? 'dark-mode' : ''}`}>
            <h3>Total des Candidats</h3>
            <p>{totalCandidates}</p>
          </div>
          <div className={`stat-box ${darkMode ? 'dark-mode' : ''}`}>
            <h3>Total des Recruteurs</h3>
            <p>{totalRecruiters}</p>
          </div>
          <div className={`stat-box ${darkMode ? 'dark-mode' : ''}`}>
            <h3>Total des Offres d'Emploi</h3>
            <p>{totalJobs}</p>
          </div>
        </div>

        {/* 🎨 Sélecteurs de couleurs */}
        <div className="color-picker-container">
        <h3 className='ikram2'>
            🎨 Personnaliser les couleurs des graphiques
            <button
  className="add-btn"
  style={{ color: 'white', backgroundColor: 'white' }}
  onClick={() => setShowColorInputs(!showColorInputs)}
>
  {showColorInputs ? '▲' : '▼'}
</button>

          </h3>

          {showColorInputs && (
            <div className="color-picker">
              <label>
                Couleur des barres :
                <input type="color" value={barColor} onChange={(e) => setBarColor(e.target.value)} />
              </label>
              <label>
                Couleur secteur 1 :
                <input type="color" value={pieColor1} onChange={(e) => setPieColor1(e.target.value)} />
              </label>
              <label>
                Couleur secteur 2 :
                <input type="color" value={pieColor2} onChange={(e) => setPieColor2(e.target.value)} />
              </label>
            </div>
          )}
        </div>


        <div className="charts-section">
          <div className="chart-container">
            <h3>Répartition des Membres</h3>
            <ResponsiveContainer width="100%" height="80%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.08} />
                <XAxis dataKey="name" stroke={darkMode ? "#eee" : "#555"} />
                <YAxis stroke={darkMode ? "#eee" : "#555"} />
                <Tooltip />
                <Legend />
                <Bar 
                  dataKey="value" 
                  fill={barColor}
                  radius={[8, 8, 0, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-container">
            <h3>Taux de Candidatures par Rapport aux Offres</h3>
            <ResponsiveContainer width="100%" height="70%">
              <PieChart>
                <Pie
                  data={chartData1}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  <Cell key="cell-0" fill={pieColor1} />
                  <Cell key="cell-1" fill={pieColor2} />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
