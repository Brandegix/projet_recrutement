import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbara';
import Footer from '../components/Footer';

const EditJobOfferForm = () => {
  const { offerId } = useParams();
  const navigate = useNavigate();
  const [offer, setOffer] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/recruiter/job_offers/${offerId}`, {
      credentials: 'include',
      method: 'GET',
    })
      .then(res => res.json())
      .then(data => {
        setOffer(data);
      })
      .catch(() => setError("Erreur lors du chargement de l'offre."));
  }, [offerId]);

  const handleChange = (e) => {
    setOffer({ ...offer, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`${process.env.REACT_APP_API_URL}/api/recruiter/job_offers/${offerId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(offer),
    })
      .then(async res => {
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Échec de la modification.");
        }
        navigate('/RecruiterJobOffers');
      })
      .catch(err => {
        alert(err.message);
      });
  };

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!offer) return <p style={{ color: '#555' }}>Chargement...</p>;

  const containerStyle = {
    maxWidth: '500px',
    margin: '40px auto',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    backgroundColor: '#fff',
    fontFamily: 'Arial, sans-serif',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    marginBottom: '12px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '14px',
  };

  const buttonStyle = {
    width: '100%',
    padding: '10px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
  };

  const headingStyle = {
    textAlign: 'center',
    marginBottom: '20px',
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#333',
  };

  return (
    <>
      <Navbar />
    <form onSubmit={handleSubmit} style={containerStyle}>
      <h2 style={headingStyle}>Modifier l'offre</h2>

      <input
        name="title"
        value={offer.title}
        onChange={handleChange}
        placeholder="Titre de l'offre"
        style={inputStyle}
      />

      <textarea
        name="description"
        value={offer.description}
        onChange={handleChange}
        placeholder="Description"
        style={{ ...inputStyle, height: '100px', resize: 'none' }}
      />

      <input
        name="company"
        value={offer.company}
        onChange={handleChange}
        placeholder="Entreprise"
        style={inputStyle}
      />

      <input
        name="salary"
        value={offer.salary}
        onChange={handleChange}
        placeholder="Salaire"
        style={inputStyle}
      />

      <input
        name="location"
        value={offer.location}
        onChange={handleChange}
        placeholder="Lieu"
        style={inputStyle}
      />

      <input
        name="experience"
        value={offer.experience}
        onChange={handleChange}
        placeholder="Expérience requise"
        style={inputStyle}
      />

      <input
        name="skills"
        value={offer.skills}
        onChange={handleChange}
        placeholder="Compétences"
        style={inputStyle}
      />

      <input
        name="type"
        value={offer.type}
        onChange={handleChange}
        placeholder="Type de contrat"
        style={inputStyle}
      />

      <button type="submit" style={buttonStyle}>
        Enregistrer
      </button>
    </form>
    <Footer />
    </>
  );
};

export default EditJobOfferForm;
