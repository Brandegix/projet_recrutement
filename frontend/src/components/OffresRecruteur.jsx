import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // pour la redirection

const OffresRecruteur = () => {
    const [offres, setOffres] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        console.log("📦 Token récupéré dans OffresRecruteur :", token);

        if (!token) {
            setError('Token introuvable');
            return;
        }

        fetch('http://localhost:5000/api/job_offersr', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setOffres(data.offres);
            })
            .catch((err) => {
                setError('Erreur lors du chargement des offres');
            });
    }, []);

    return (
        <div className="listeOffres">
            <button
                className="profilButton"
                onClick={() => navigate('/RecruteurPage')}
            >
                Mon profil
            </button>

            {Array.isArray(offres) && offres.length > 0 ? (
                offres.map(offre => (
                    <div key={offre.id} className="offreCard">
                        <h2>{offre.title}</h2>
                        <p>{offre.description}</p>
                        <div className="actions">
                            {/* <button onClick={() => modifierOffre(offre.id)}>Modifier</button>
                            <button onClick={() => supprimerOffre(offre.id)}>Supprimer</button> */}
                        </div>
                    </div>
                ))
            ) : (
                <p>Aucune offre disponible pour le moment.</p>
            )}
        </div>
    );
};

export default OffresRecruteur;
