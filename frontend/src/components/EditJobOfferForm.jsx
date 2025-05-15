import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

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
        console.log(data);  // Add this line to check the response format
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
      .then(res => {
        if (!res.ok) throw new Error();
        navigate('/RecruiterJobOffers');
      })
      .catch(() => setError("Échec de la modification."));
  };

  if (error) return <p>{error}</p>;
  if (!offer) return <p>Chargement...</p>;

  return (
    <form onSubmit={handleSubmit}>
      <h2>Modifier l'offre</h2>
      <input name="title" value={offer.title} onChange={handleChange} />
      <textarea name="description" value={offer.description} onChange={handleChange} />
      <input name="company" value={offer.company} onChange={handleChange} />
      <input name="salary" value={offer.salary} onChange={handleChange} />
      <input name="location" value={offer.location} onChange={handleChange} />
      <input name="experience" value={offer.experience} onChange={handleChange} />
      <input name="skills" value={offer.skills} onChange={handleChange} />
      <input name="type" value={offer.type} onChange={handleChange} />
      <button type="submit">Enregistrer</button>
    </form>
  );
};

export default EditJobOfferForm;
