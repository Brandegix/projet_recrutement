import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/css/AdminTable.css';
import Navbar from "../components/Navbara";
import Footer from "../components/Footer";

const RecruiterManageCandidates = () => {
  const [allCandidates, setAllCandidates] = useState([]); // Full list
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/candidates`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setAllCandidates(data); // Store all candidates
      } else {
        console.error("Error fetching candidates:", response.status);
      }
    } catch (error) {
      console.error("Fetch candidates failed:", error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleViewProfile = (candidateId) => {
    navigate(`/recruiter/candidate/${candidateId}`);
  };

  // Filter candidates based on name or email (case-insensitive)
  const filteredCandidates = allCandidates.filter(candidate =>
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <h1>Recruter des Candidats</h1>

        {/* Search Bar */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Rechercher par nom ou email"
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>

        <div className="table-container">
          {filteredCandidates.length === 0 ? (
            <p>Aucun candidat trouvé.</p>
          ) : (
            <table className="candidates-table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCandidates.map(candidate => (
                  <tr key={candidate.id}>
                    <td>{candidate.name}</td>
                    <td>{candidate.email}</td>
                    <td className="action-buttons">
                      <button
                        onClick={() => handleViewProfile(candidate.id)}
                        className="browse-profile-btn"
                      >
                        Voir Profil
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default RecruiterManageCandidates;
