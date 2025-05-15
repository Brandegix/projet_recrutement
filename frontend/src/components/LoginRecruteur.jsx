import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import '../assets/css/Login.css';
import Navbar from '../components/Navbara';
import Footer from '../components/Footer';

function LoginRecruteur() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      console.log("Email: ", email);
console.log("Password: ", password);

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/recruiters/login`,
        { email, password },
        { withCredentials: true }
      );
  
      alert("Connexion réussie !");
      
      const userType = response.data.user_type;
  
      if (userType === 'admin') {
        navigate("/Dashboard_admin"); // rediriger vers la page admin
      } else {
        navigate("/RecruiterJobOffers"); // rediriger vers la page recruteur
      }
  
    } catch (error) {
      const message = error.response?.data?.error || "Email ou mot de passe incorrect";
      alert("Erreur : " + message);
    }
  };
  
  const handleRequestReset = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/request-reset`, { email: resetEmail });
      alert("Code de réinitialisation envoyé à votre email.");
      navigate(`/verify-otp?email=${resetEmail}`);
    } catch (err) {
      alert("Email non trouvé.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="login-page">
        <div className="login-box">
          <h2 className="login-title">Connexion Recruteur</h2>
          <form onSubmit={handleLogin} className="login-form">
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label>Mot de passe</label>
              <div className="password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>
            </div>
            <button className="login-button" type="submit">Se connecter</button>
          </form>

          <a 
  href="#" 
  style={{
    display: "block",  /* ✅ Forces the link onto a new line */
    marginTop: "15px", /* ✅ Adds space above */
    fontSize: "14px",
    textAlign: "center",
    color: "#007bff",
    textDecoration: "none",
    cursor: "pointer",
    transition: "0.3s",
  }}
  onMouseOver={(e) => e.target.style.textDecoration = "underline"} 
  onMouseOut={(e) => e.target.style.textDecoration = "none"}
  onClick={(e) => {
    e.preventDefault();
    navigate("/recruiter/request-reset"); // ✅ Redirects to reset page
  }}
  >
  Mot de passe oublié ?
</a>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default LoginRecruteur;
