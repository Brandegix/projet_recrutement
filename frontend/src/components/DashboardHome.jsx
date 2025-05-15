import DashboardCharts from '../components/DashboardCharts';
import React from 'react';

const DashboardHome = ({ recruiterId }) => {
  if (!recruiterId) {
    // Si `recruiterId` n'est pas encore défini, on affiche un message ou un chargement
    return <div>Chargement...</div>;
  }

  return (
    <div>
      <h2>Tableau de bord</h2>
      {/* autres stats */}
      <DashboardCharts recruiterId={recruiterId} />
    </div>
  );
};

export default DashboardHome;
