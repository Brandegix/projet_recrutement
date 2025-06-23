import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbara';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import {
    FaChartBar, FaCalendarAlt, FaUserCheck, FaToggleOn, FaToggleOff, FaSearch, FaEye
} from 'react-icons/fa';
import Footer from "../components/Footer";
import SEO from "./SEO";


const JobOfferStatistics = () => {
    const [statistics, setStatistics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const [selectedOffer, setSelectedOffer] = useState(null);
    const [viewType, setViewType] = useState('pie');

    const COLORS = ['#ff9800', '#f57c00', '#ffb74d']; // Orange shades

    useEffect(() => {
        fetchStatistics();
    }, []);

    const fetchStatistics = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/recruiter/job_offers_statisticcs`, {
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
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/recruiter/job_offers/${offerId}/toggle`, {}, {
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
            console.error("Error toggling job offer:", err);
            setError('Erreur lors de la modification du statut de l\'offre.');
        }
    };

    const openGraphModal = (offer) => {
        setSelectedOffer(offer);
    };

    const closeGraphModal = () => {
        setSelectedOffer(null);
    };

    const filteredStatistics = statistics.filter(stat =>
        stat.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stat.company?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const globalTotals = statistics.reduce((acc, stat) => {
        acc.applications += stat.application_count || 0;
        acc.views += stat.views || 0;
        acc.saved += stat.saved_count || 0;
        return acc;
    }, { applications: 0, views: 0, saved: 0 });

    const pieData = [
        { name: 'Candidatures', value: globalTotals.applications },
        { name: 'Vues', value: globalTotals.views },
        { name: 'Enregistrés', value: globalTotals.saved },
    ];

    const barData = [
        { name: 'Candidatures', value: globalTotals.applications },
        { name: 'Vues', value: globalTotals.views },
        { name: 'Enregistrés', value: globalTotals.saved },
    ];

    // Removed the loading page - now it just shows error if there's an error
    if (error) return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8f8f8', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <SEO
        title="Statistiques"
       /> 
            <div style={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
                <div style={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', borderLeft: '5px solid #f44336', overflow: 'hidden' }}>
                    <div style={{ padding: '20px' }}>
                        <h2 style={{ color: '#f44336', fontWeight: 'bold', marginBottom: '10px' }}>Erreur</h2>
                        <p style={{ color: '#555', marginBottom: '20px' }}>{error}</p>
                        <button
                            onClick={() => fetchStatistics()}
                            style={{ backgroundColor: '#ff9800', color: '#fff', border: 'none', borderRadius: '5px', padding: '10px 20px', cursor: 'pointer', fontWeight: 'bold', transition: 'background-color 0.3s ease' }}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#f57c00'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#ff9800'}
                        >
                            Réessayer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8f8f8' }}>
            <Navbar />
            <SEO
        title="Statistiques"
       /> 
            <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', marginBottom: '20px' }}>
                    Tableau de bord des Offres d'Emploi
                </h1>

                {/* Key Metrics Section - Show loading state within content */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                    <div style={{ backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', borderRadius: '8px', padding: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                            <div style={{ backgroundColor: '#ffe0b2', color: '#f57c00', borderRadius: '5px', padding: '10px', marginRight: '10px' }}>
                                <FaUserCheck style={{ fontSize: '20px' }} />
                            </div>
                            <p style={{ color: '#555', fontWeight: 'bold' }}>Candidatures</p>
                        </div>
                        <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#f57c00' }}>
                            {loading ? '...' : globalTotals.applications}
                        </p>
                    </div>
                    <div style={{ backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', borderRadius: '8px', padding: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                            <div style={{ backgroundColor: '#ffe0b2', color: '#f57c00', borderRadius: '5px', padding: '10px', marginRight: '10px' }}>
                                <FaEye style={{ fontSize: '20px' }} />
                            </div>
                            <p style={{ color: '#555', fontWeight: 'bold' }}>Vues</p>
                        </div>
                        <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#f57c00' }}>
                            {loading ? '...' : globalTotals.views}
                        </p>
                    </div>
                    <div style={{ backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', borderRadius: '8px', padding: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                            <div style={{ backgroundColor: '#ffe0b2', color: '#f57c00', borderRadius: '5px', padding: '10px', marginRight: '10px' }}>
                                <FaSearch style={{ fontSize: '20px' }} />
                            </div>
                            <p style={{ color: '#555', fontWeight: 'bold' }}>Enregistrés</p>
                        </div>
                        <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#f57c00' }}>
                            {loading ? '...' : globalTotals.saved}
                        </p>
                    </div>
                </div>

                {/* Search and Global Chart */}
                <div style={{ backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', borderRadius: '8px', padding: '20px', marginBottom: '30px' }}>
                <div style={{ marginBottom: '20px', position: 'relative' }}>
    <input
        type="text"
        placeholder="Rechercher une offre par titre ou entreprise..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ width: '100%', padding: '10px 15px', borderColor: '#ddd', borderRadius: '5px', outline: 'none' }}
        disabled={loading}
    />
</div>

                    <div style={{ borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#333' }}>
                            {loading ? 'Chargement...' : 'Répartition Globale'}
                        </h2>
                        <div>
                            <button
                                onClick={() => setViewType('pie')}
                                disabled={loading}
                                style={{ padding: '8px 15px', border: 'none', borderRadius: '5px', cursor: loading ? 'not-allowed' : 'pointer', marginRight: '10px', backgroundColor: viewType === 'pie' ? '#ff9800' : '#f8f9fa', color: viewType === 'pie' ? '#fff' : '#555', fontWeight: 'bold', transition: 'background-color 0.3s ease, color 0.3s ease', marginBottom:  '10px', opacity: loading ? 0.6 : 1}}
                            >
                                Circulaire
                            </button>
                            <button
                                onClick={() => setViewType('bar')}
                                disabled={loading}
                                style={{ padding: '8px 15px', border: 'none', borderRadius: '5px', cursor: loading ? 'not-allowed' : 'pointer', backgroundColor: viewType === 'bar' ? '#ff9800' : '#f8f9fa', color: viewType === 'bar' ? '#fff' : '#555', fontWeight: 'bold', transition: 'background-color 0.3s ease, color 0.3s ease', opacity: loading ? 0.6 : 1 }}
                            >
                                Barres
                            </button>
                        </div>
                    </div>

                    <div style={{ width: '100%', height: '350px' }}>
                        {loading ? (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#555' }}>
                                <p>Chargement des données...</p>
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                {viewType === 'pie' ? (
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={70}
                                            outerRadius={120}
                                            dataKey="value"
                                            nameKey="name"
                                            labelLine={false}
                                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                                    </PieChart>
                                ) : (
                                    <BarChart data={barData} margin={{ top: 15, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="value" fill="#ff9800" barSize={20} /> {/* Smaller bars */}
                                    </BarChart>
                                )}
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* Detailed Job Offer Table */}
                <div style={{ backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', borderRadius: '8px', overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ backgroundColor: '#f8f9fa', borderBottom: '1px solid #eee' }}>
                            <tr>
                                <th style={tableHeaderStyle}>Offre</th>
                                <th style={tableHeaderStyle}>Création</th>
                                <th style={tableHeaderStyle}>Candidatures</th>
                                <th style={tableHeaderStyle}>Vues</th>
                                <th style={tableHeaderStyle}>Enregistrés</th>
                                <th style={tableHeaderStyle}>Statut</th>
                                <th style={tableHeaderStyle}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={7} style={{ padding: '15px', textAlign: 'center', color: '#777' }}>
                                        Chargement des offres...
                                    </td>
                                </tr>
                            ) : filteredStatistics.length === 0 ? (
                                <tr>
                                    <td colSpan={7} style={{ padding: '15px', textAlign: 'center', color: '#777' }}>
                                        {searchTerm ? 'Aucune offre trouvée.' : 'Liste des offres vide.'}
                                    </td>
                                </tr>
                            ) : (
                                filteredStatistics.map((stat) => (
                                    <tr key={stat.id} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={tableCellStyle}>{stat.title} <span style={{ color: '#777' }}></span></td>
                                        <td style={tableCellStyle}>{new Date(stat.created_at).toLocaleDateString()}</td>
                                        <td style={tableCellStyle}>{stat.application_count}</td>
                                        <td style={tableCellStyle}>{stat.views}</td>
                                        <td style={tableCellStyle}>{stat.saved_count}</td>
                                        <td style={{ ...tableCellStyle, textAlign: 'center' }}>
                                            <span style={{
                                                padding: '5px 10px',
                                                borderRadius: '5px',
                                                fontSize: '0.9em',
                                                fontWeight: 'bold',
                                                backgroundColor: stat.is_active ? '#f0fff0' : '#ffe6e6',
                                                color: stat.is_active ? '#f57c00' : '#000000'
                                            }}>
                                                {stat.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td style={{ ...tableCellStyle, textAlign: 'right' }}>
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                                <button
                                                    onClick={() => toggleJobOffer(stat.id)}
                                                    style={actionButtonStyle}
                                                >
                                                    {stat.is_active ? <FaToggleOn style={actionIconStyle} /> : <FaToggleOff style={actionIconStyle} />}</button>
                                                <button
                                                    onClick={() => openGraphModal(stat)}
                                                    style={actionButtonStyle}
                                                >
                                                    <FaChartBar style={actionIconStyle} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {selectedOffer && (
                <div style={modalOverlayStyle}>
                    <div style={modalStyle}>
                        <div style={modalHeaderStyle}>
                            <h2 style={modalTitleStyle}>{selectedOffer.title}</h2>
                            <button onClick={closeGraphModal} style={modalCloseButtonStyle}>
                                X
                            </button>
                        </div>
                        <div style={modalContentStyle}>
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie
                                        data={[
                                            { name: 'Candidatures', value: selectedOffer.application_count || 0 },
                                            { name: 'Vues', value: selectedOffer.views || 0 },
                                            { name: 'Enregistrés', value: selectedOffer.saved_count || 0 },
                                        ]}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={70}
                                        labelLine={false}
                                        label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                                    >
                                        <Cell fill={COLORS[0]} />
                                        <Cell fill={COLORS[1]} />
                                        <Cell fill={COLORS[2]} />
                                    </Pie>
                                    <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
};

const tableHeaderStyle = {
    padding: '15px',
    textAlign: 'left',
    fontWeight: 'bold',
    color: '#333',
    fontSize: '0.9em'
};

const tableCellStyle = {
    padding: '15px',
    textAlign: 'left',
    color: '#555'
};

const actionButtonStyle = {
    background: 'none',
    border: 'none',
    padding: '8px',
    borderRadius: '5px',
    cursor: 'pointer',
    outline: 'none'
};

const actionIconStyle = {
    fontSize: '1.1em',
    color: '#ff9800'
};

const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
};

const modalStyle = {
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    maxWidth: '500px',
    width: '90%',
    overflow: 'hidden'
};

const modalHeaderStyle = {
    background: '#ff9800',
    color: '#fff',
    padding: '20px',
    borderBottom: '1px solid #f57c00',
    position: 'relative'
};

const modalTitleStyle = {
    fontSize: '1.5em',
    fontWeight: 'bold',
    marginBottom: '5px'
};

const modalSubtitleStyle = {
    fontSize: '0.9em',
    color: '#fff'
};

const modalCloseButtonStyle = {
    position: 'absolute',
    bottom: 40px ,
    left: 400px ,
    background: 'none',
    border: 'none',
    color: '#fff',
    fontSize: '1.2em',
    cursor: 'pointer',
    outline: 'none'
};

const modalContentStyle = {
    padding: '20px',
    marginTop: '20px', // Added margin at the top
};

export default JobOfferStatistics;
