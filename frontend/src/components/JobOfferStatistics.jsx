import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaChartBar, FaBuilding, FaCalendarAlt, FaUserCheck, FaToggleOn, FaToggleOff, FaSearch, FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbara';

const STATUS_COLORS = {
  active: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  inactive: 'bg-rose-100 text-rose-800 border-rose-200'
};

const JobOfferStatistics = () => {
  const [statistics, setStatistics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/recruiter/job_offers_statisticcs', {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      if (Array.isArray(response.data)) {
        setStatistics(response.data);
      } else if (response.data.error) {
        setError(response.data.message || 'Une erreur est survenue');
        setStatistics([]);
      } else {
        setError('Format de données inattendu reçu du serveur');
        setStatistics([]);
      }
      setLoading(false);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        navigate('/LoginRecruteur');
        return;
      }
      setError('Erreur lors du chargement des statistiques');
      setLoading(false);
    }
  };

  const toggleJobOffer = async (offerId) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/recruiter/job_offers/${offerId}/toggle`, {}, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (response.data.success) {
        setStatistics(prevStats =>
          prevStats.map(stat =>
            stat.id === offerId
              ? { ...stat, is_active: response.data.is_active }
              : stat
          )
        );
      } else {
        setError(response.data.message || 'Erreur lors de la modification du statut de l\'offre');
      }
    } catch (err) {
      if (err.response) {
        if (err.response.status === 401) {
          navigate('/LoginRecruteur');
          return;
        }
        setError(err.response.data.message || 'Erreur lors de la modification du statut de l\'offre');
      } else {
        setError('Erreur de connexion au serveur');
      }
    }
  };

  const filteredStatistics = statistics.filter(stat =>
    stat.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stat.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      <Navbar />
      <div className="flex justify-center items-center h-[calc(100vh-64px)]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500"></div>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-red-500">
          <h2 className="text-xl font-bold text-red-600 mb-2">Erreur !</h2>
          <p className="text-gray-700">{error}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-xl p-6 mb-8 transform transition-all duration-300 hover:shadow-2xl">
          <h1 className="text-4xl font-bold mb-8 flex items-center justify-center text-gradient bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
            <FaChartBar className="mr-3 text-orange-500" />
            Statistiques des offres d'emploi
          </h1>

          <input
            type="text"
            placeholder="🔍 Rechercher une offre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-4 py-2 rounded-lg border border-orange-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300"
          />

          <div className="overflow-x-auto rounded-lg shadow-lg">
            <table className="min-w-full bg-white rounded-lg">
              <thead>
                <tr className="bg-gradient-to-r from-orange-500 to-orange-400 text-white">
                  <th className="py-4 px-6 text-left font-semibold rounded-tl-lg"><FaChartBar className="inline mr-2" />Titre</th>
                  <th className="py-4 px-6 text-left font-semibold"><FaBuilding className="inline mr-2" />Entreprise</th>
                  <th className="py-4 px-6 text-left font-semibold"><FaCalendarAlt className="inline mr-2" />Date de création</th>
                  <th className="py-4 px-6 text-left font-semibold"><FaUserCheck className="inline mr-2" />Candidatures</th>
                  <th className="py-4 px-6 text-left font-semibold"><FaEye className="inline mr-2" />Vues</th>
                  <th className="py-4 px-6 text-left font-semibold">Statut</th>
                  <th className="py-4 px-6 text-left font-semibold rounded-tr-lg">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-orange-100">
                {filteredStatistics.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-500 bg-orange-50">
                      {searchTerm ? 'Aucune offre ne correspond à votre recherche.' : 'Aucune offre d\'emploi trouvée.'}
                    </td>
                  </tr>
                ) : (
                  filteredStatistics.map((stat) => (
                    <tr key={stat.id} className="hover:bg-orange-50 transition-colors duration-200">
                      <td className="py-4 px-6 font-medium text-gray-800">{stat.title || 'Sans titre'}</td>
                      <td className="py-4 px-6 text-gray-600">{stat.company || 'Non renseignée'}</td>
                      <td className="py-4 px-6 text-gray-600">{stat.created_at || 'Non renseignée'}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-orange-600">{stat.application_count || 0}</span>
                          <div className="flex-1 h-2 bg-orange-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full transition-all duration-500"
                              style={{
                                width: `${Math.min((stat.application_count || 0) * 10, 100)}%`
                              }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-purple-600">{stat.views || 0}</span>
                          <div className="flex-1 h-2 bg-purple-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-purple-400 to-purple-500 rounded-full transition-all duration-500"
                              style={{
                                width: `${Math.min((stat.views || 0) * 5, 100)}%`
                              }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${stat.is_active ? STATUS_COLORS.active : STATUS_COLORS.inactive}`}>
                          {stat.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => toggleJobOffer(stat.id)}
                          className="text-2xl focus:outline-none transform hover:scale-110 transition-transform duration-200"
                          title={stat.is_active ? "Désactiver l'offre" : "Activer l'offre"}
                        >
                          {stat.is_active ? (
                            <FaToggleOn className="text-emerald-500" />
                          ) : (
                            <FaToggleOff className="text-rose-400" />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobOfferStatistics;