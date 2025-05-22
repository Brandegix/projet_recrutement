import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from "react-icons/fa";  // ✅ Import eye icons
import '../assets/css/Login.css'; // Ensure correct path
import Navbar from "../components/Navbara";
import Footer from "../components/Footer";

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // ✅ State for toggling password visibility
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const loginData = { email, password };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", 
        body: JSON.stringify(loginData),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Connexion réussie !");
        navigate("/Dashboard_admin");
      } else {
        setErrorMsg(result.error || 'Login failed');
      }
    } catch (error) {
      setErrorMsg('Erreur de connexion: ' + error.message);
    }

    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <div className="login-page">
        <div className="login-box">
          <h2 className="login-title">Connexion Admin</h2>
          <form onSubmit={handleLogin} className="login-form">
            <div className="input-group">
              <label>Email :</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* ✅ Password Input with Eye Icon Toggle */}
            <div className="form-group">
            <div className="input-group">
            <label>Mot de passe :</label>

            <div className="password-input-container" style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingRight: "40px" }} /* ✅ Space for icon */
              />
              {/* ✅ Eye Icon Toggle */}
              <span 
  onClick={() => setShowPassword(!showPassword)} 
  style={{
    position: "absolute", 
    right: "10px", 
    top: "50%", /* ✅ Move to center */
    transform: "translateY(-50%)", /* ✅ Ensures proper vertical alignment */
    cursor: "pointer", 
    fontSize: "18px", 
    color: "#777", 
    display: "flex", 
    width: "30px", 
    height: "100%", /* ✅ Ensures full alignment */
    justifyContent: "center", /* ✅ Centers horizontally */
    alignItems: "center",

    /* ✅ Centers vertically */
  }}
>
                {showPassword ? <FaEye /> : <FaEyeSlash />}
</span>
</div>
            </div>
            </div>

            {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}

            <button className="login-button" type="submit" disabled={loading}>
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>

            {/* ✅ Forgot Password Link Styled for Separate Line */}
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                navigate("/admin/request-reset");
              }}
              style={{
                display: "block", 
                textAlign: "center", 
                marginTop: "15px", 
                fontSize: "14px", 
                color: "#007bff", 
                textDecoration: "none", 
                cursor: "pointer",
                transition: "0.3s"
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

export default AdminLogin;
