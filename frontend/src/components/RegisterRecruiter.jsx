import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../assets/css/Login2.css";
import Footer from '../components/Footer'; // chemin correct selon ton arborescence
import Navbar from "../components/Navbara";

const RegisterRecruteur = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/api/recruiters/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password, name, email, phoneNumber, companyName }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log("📦 Inscription réussie");
                navigate('/CandidatePagefrom'); // Rediriger vers la page après inscription réussie
            } else {
                setError(data.error || 'Erreur lors de l\'inscription');
            }
        } catch (err) {
            setError('Erreur de connexion au serveur');
        }
    };

    return (
        <>
            <Navbar />
            <div className="form-container">
                <h2>Inscription Recruteur</h2>
                <form onSubmit={handleRegister}>
                    <div className="form-group">
                        <label>Nom complet</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Numéro de téléphone</label>
                        <input
                            type="text"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Nom de l'entreprise</label>
                        <input
                            type="text"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Nom d'utilisateur</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Mot de passe</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">S'inscrire</button>
                    {error && <p className="error">{error}</p>}
                </form>
            </div>
            <Footer />
        </>
    );
};

export default RegisterRecruteur;