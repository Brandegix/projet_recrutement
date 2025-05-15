import React, { useState, useEffect } from "react";
import "../assets/css/dashboardd.css";

const DashboardHomee = () => {
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/dashboardd`)
      .then((res) => res.json())
      .then((data) => setDashboardData(data))
      .catch((err) => console.error("Erreur chargement dashboard :", err));
  }, []);

  if (!dashboardData) {
    return <p>Chargement des données...</p>;
  }

  return (
    <div className="dashboard-home">
      <h2>Bienvenue sur votre espace recruteur</h2>

      {/* Stats Section */}
      <div className="dashboard-grid">
        {dashboardData.stats.map((stat, index) => (
          <div className="dashboard-card" key={index}>
            <h3>{stat.label}</h3>
            <p>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Activities Section */}
      {/* <div className="recent-activities">
        <h3>Activités récentes</h3>
        <ul>
          {dashboardData.recent_activities.map((activity, index) => (
            <li key={index}>{activity}</li>
          ))}
        </ul>
      </div> */}
    </div>
  );
};

export default DashboardHomee;
