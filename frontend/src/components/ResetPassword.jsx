import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbara";
import Footer from "../components/Footer";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function ResetPassword() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setEmail(params.get("email") || "");
  }, [location.search]);

  const handleResetPassword = async () => {
    try {
      await axios.post("http://localhost:5000/api/reset-password", { email, password: newPassword });
      alert("Mot de passe réinitialisé avec succès !");
      navigate("/LoginRecruteur");
    } catch (err) {
      alert("Échec de la réinitialisation.");
    }
  };

  return (
    <>
      <Navbar />
      <div 
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#f4f7fc",
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        <div 
          style={{
            background: "#ffffff",
            padding: "40px",
            borderRadius: "12px",
            boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
            textAlign: "center",
            maxWidth: "400px",
            width: "100%",
          }}
        >
          <h2 
            style={{
              fontSize: "22px",
              color: "#333",
              marginBottom: "15px",
            }}
          >
            Réinitialisation du mot de passe
          </h2>

          <p 
            style={{
              fontSize: "14px",
              color: "#666",
              marginBottom: "20px",
            }}
          >
            Vous êtes en train de réinitialiser le mot de passe pour: <b>{email}</b>
          </p>

          <div style={{ textAlign: "left", marginBottom: "15px", position: "relative" }}>
            <label style={{ fontSize: "14px", fontWeight: "600", color: "#555" }}>
              Entrez votre nouveau mot de passe :
            </label>

            <input 
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                fontSize: "16px",
                outline: "none",
                transition: "border-color 0.3s ease",
                paddingRight: "40px",
              }}
            />

            {/* ✅ Eye Icon for Show/Hide Password */}
            <span 
              onClick={() => setShowNewPassword(!showNewPassword)}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                fontSize: "18px",
                color: "#777",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "30px",
                height: "100%",
              }}
            >
                {showNewPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
          </div>

          <button 
            onClick={handleResetPassword}
            style={{
              background: "#ff5a00", /* ✅ Orange button */
              color: "#fff",
              padding: "12px 15px",
              fontSize: "16px",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              transition: "background 0.3s ease",
              width: "100%",
              marginTop: "15px",
            }}
          >
            Réinitialiser
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ResetPassword;
