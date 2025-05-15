import { useEffect, useState } from 'react';
import "../assets/css/recruteurepage.css";

const ProfileRecruteur = () => {
    const [recruiterProfile, setRecruiterProfile] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
              const response = await fetch('http://localhost:5000/api/recruiters/profile', {
                method: 'GET',
                credentials: 'include',  // garde bien ça pour envoyer les cookies de session
            });
            
                const data = await response.json();

                if (response.ok) {
                    setRecruiterProfile(data); // Stocke les données du recruteur dans l'état
                } else {
                    setError(data.error); // Affiche l'erreur si la requête échoue
                }
            } catch (err) {
                setError('Erreur de récupération du profil');
            }
        };

        fetchProfile();
    }, []);  // Utilisation d'un useEffect pour charger les données dès le premier rendu du composant

    if (error) {
        return <div className="error">{error}</div>;
    }

    if (!recruiterProfile) {
        return <div>Chargement du profil...</div>;
    }

    return (
        <div>
            <h2>Profil du recruteur</h2>
            <p><strong>Nom d'utilisateur:</strong> {recruiterProfile.username}</p>
            <p><strong>Nom:</strong> {recruiterProfile.name}</p>
            <p><strong>Email:</strong> {recruiterProfile.email}</p>
            <p><strong>Téléphone:</strong> {recruiterProfile.phoneNumber}</p>
            <p><strong>Nom de l'entreprise:</strong> {recruiterProfile.companyName}</p>
            <p><strong>Adresse:</strong> {recruiterProfile.address}</p>
        </div>
    );
};

export default ProfileRecruteur;
