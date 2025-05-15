import { useEffect, useState } from 'react';
import "../../assets/css/recruteurepage.css";
import React from 'react';

const ProfileRecruteur = () => {
    const [recruiterProfile, setRecruiterProfile] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/recruiters/profile`, {
                    method: 'GET',
                    credentials: 'include',
                });

                const data = await response.json();

                if (response.ok) {
                    setRecruiterProfile(data);
                } else {
                    setError(data.error);
                }
            } catch (err) {
                setError('Erreur de récupération du profil');
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRecruiterProfile({ ...recruiterProfile, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/recruiters/update-profile`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(recruiterProfile),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess("✅ Profil mis à jour avec succès !");
                setError(null);
            } else {
                setError(data.error || "❌ Erreur lors de la mise à jour");
                setSuccess(null);
            }
        } catch (err) {
            setError("❌ Erreur de communication avec le serveur");
            setSuccess(null);
        }
    };

    if (error) return <div className="error">{error}</div>;
    if (!recruiterProfile) return <div>Chargement du profil...</div>;

    return (
        <div className="profile-container">
            <h2>🧑‍💼 Mon Profil Recruteur</h2>
            {success && <div className="success-message">{success}</div>}
            <form onSubmit={handleSubmit} className="profile-form">
                {["username", "name", "email", "phoneNumber", "companyName", "address"].map((field) => (
                    <div className="form-group" key={field}>
                        <label htmlFor={field}>
                            {field === "username" ? "Nom d'utilisateur" :
                            field === "name" ? "Nom" :
                            field === "email" ? "Email" :
                            field === "phoneNumber" ? "Téléphone" :
                            field === "companyName" ? "Nom de l'entreprise" :
                            "Adresse"}
                        </label>
                        <input
                            type={field === "email" ? "email" : "text"}
                            id={field}
                            name={field}
                            value={recruiterProfile[field] || ""}
                            onChange={handleChange}
                            required
                        />
                    </div>
                ))}
                <button type="submit" className="btn-update">Mettre à jour</button>
            </form>
        </div>
    );
};

export default ProfileRecruteur;
