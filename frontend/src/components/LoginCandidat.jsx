import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../assets/css/Login.css'; 
import Navbar from "../components/Navbara";
import Footer from "../components/Footer";


function LoginCandidat() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/candidates/login`,
        { email, password },
        { withCredentials: true } // pour les cookies / sessions
      );

      alert("Connexion réussie !");
      navigate("/Offres");
    } catch (error) {
      console.error(error);
      const message =
        error.response?.data?.error || "Erreur lors de la connexion";
      alert("Erreur : " + message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="login-page">
        <div className="login-box">
          <h2 className="login-title">Connexion Candidat</h2>
          <form onSubmit={handleLogin} className="login-form">
            <div className="input-group">
              <label>Nom d'utilisateur</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label>Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button className="login-button" type="submit">Se connecter</button>

        <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                navigate("/candidate/request-reset");
              }}
              style={{
                display: "block", 
                textAlign: "center", 
                marginTop: "15px", 
                fontSize: "14px", 
                color: "#007bff", 
                textDecoration: "none", 
                cursor: "pointer",
                transition: "0.3s",
              }}
              onMouseEnter={(e) => e.target.style.textDecoration = "underline"}
              onMouseLeave={(e) => e.target.style.textDecoration = "none"}
            >
              Mot de passe oublié ?
            </a>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default LoginCandidat;
