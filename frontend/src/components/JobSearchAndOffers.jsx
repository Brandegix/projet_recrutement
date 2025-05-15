import React, { useEffect, useState } from "react";
import "../assets/css/stylee.css";

const JobSearchAndOffers = () => {
  const [offres, setOffres] = useState([]);
  const [selectedPoste, setSelectedPoste] = useState('');
  const [selectedLieu, setSelectedLieu] = useState('');
  const [selectedSalaire, setSelectedSalaire] = useState('');
  const [selectedDomaine, setSelectedDomaine] = useState('');
  const [candidate, setCandidate] = useState(null);
  const [candidateId, setCandidateId] = useState(null);  
  const [appliedJobs, setAppliedJobs] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/job_offers`)
      .then((res) => res.json())
      .then((data) => setOffres(data))
      .catch((err) => console.error("Erreur lors du chargement des offres :", err));
      fetch(`${process.env.REACT_APP_API_URL}/api/applications?candidate_id=${candidateId}`)
      .then((res) => res.json())
      .then((data) => setAppliedJobs(data.map(application => application.job_offer_id)))
      .catch((err) => console.error("Erreur lors du chargement des candidatures :", err));
    
  }, [candidateId]);

  const getUniqueValues = (array, key) => {
    return [...new Set(array.map(item => item[key]))].filter(Boolean);
  };

  const handleSearch = async () => {
    const filters = {
      title: selectedPoste,
      location: selectedLieu,
      salary: selectedSalaire,
    };
  
    const cleanedFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== "")
    );
  
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/job_offers/filter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanedFilters),
      });
  
      const data = await res.json();
      console.log("Filter result:", data); // 👈 for debugging
  
      if (Array.isArray(data)) {
        setOffres(data);
      } else if (data && Array.isArray(data.offres)) {
        setOffres(data.offres);
      } else {
        console.error("Format inattendu reçu du backend:", data);
        setOffres([]); // fallback
      }
    } catch (err) {
      console.error("Erreur de filtrage:", err);
    }
  };
  

  const handleApply = async (jobOfferId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/applications`, {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          job_offer_id: jobOfferId,
        }),
      });

      if (response.ok) {
        alert("Votre candidature a été soumise avec succès !");
        setAppliedJobs(prev => [...prev, jobOfferId]);
      } else {
        alert("Erreur lors de la soumission de la candidature.");
      }
    } catch (err) {
      console.error("Erreur de candidature:", err);
    }
  };

  return (
    <>
      <div className="job-search-box">
        <div className="job-search-form">
          <div className="form-group">
            <label>Poste</label>
            <select onChange={(e) => setSelectedPoste(e.target.value)}>
              <option value="">Sélectionner le poste</option>
              {getUniqueValues(offres, "title").map((poste, index) => (
                <option key={index} value={poste}>{poste}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Lieu</label>
            <select onChange={(e) => setSelectedLieu(e.target.value)}>
              <option value="">Sélectionner le lieu</option>
              {getUniqueValues(offres, "location").map((lieu, index) => (
                <option key={index} value={lieu}>{lieu}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Salaire</label>
            <select onChange={(e) => setSelectedSalaire(e.target.value)}>
              <option value="">Sélectionner le salaire</option>
              {getUniqueValues(offres, "salary").map((salaire, index) => (
                <option key={index} value={salaire}>{salaire}</option>
              ))}
            </select>
          </div>
         
          <div className="form-group search-btn">
            <button onClick={handleSearch}>Rechercher</button>
          </div>
        </div>
      </div>

      <div className="offers-wrapper">
        {offres.length === 0 ? (
          <p className="empty-message">Aucune offre disponible pour le moment.</p>
        ) : (
          <div className="offers-grid">
            {offres.map((offre) => (
              <div key={offre.id} className="offer-card">
                <div className="offer-content">
                  <h3 className="offer-title">{offre.title}</h3>
                  <p className="offer-company">{offre.company}</p> {/* ✅ updated */}
                  <p className="offer-location">
                    <i className="fas fa-map-marker-alt"></i> {offre.location}
                  </p>
                  <p className="offer-salary">{offre.salary} MAD</p>
                </div>
                <div className="offer-actions">
                  {appliedJobs.includes(offre.id) ? (
                    <button className="applied-btn" disabled>Déjà postulé</button>
                  ) : (
                    <button className="apply-btn" onClick={() => handleApply(offre.id)}>
                      Postuler
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default JobSearchAndOffers;