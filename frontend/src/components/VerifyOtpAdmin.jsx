import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

function VerifyOtpAdmin() {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setEmail(params.get("email") || "");
  }, [location.search]);

  const handleVerifyOtp = async () => {
    try {
      await axios.post("http://localhost:5000/api/admin/verify-otp", { email, otp });
      alert("Code vérifié avec succès !");
      navigate(`/admin/reset-password?email=${email}`);
    } catch (error) {
      alert("Code invalide.");
    }
  };

  return (
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
          animation: "fadeIn 0.5s ease-in-out"
        }}
      >
        <h2 
          style={{
            fontSize: "22px",
            color: "#333",
            marginBottom: "15px",
          }}
        >
          Vérification du Code - Admin
        </h2>

        <label 
          style={{
            display: "block",
            fontSize: "14px",
            fontWeight: "600",
            marginBottom: "5px",
            color: "#555",
          }}
        >
          Entrez le code reçu :
        </label>

        <input 
          type="text" 
          value={otp} 
          onChange={(e) => setOtp(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "6px",
            fontSize: "16px",
            outline: "none",
            transition: "border-color 0.3s ease",
          }}
        />

        <button 
          onClick={handleVerifyOtp}
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
          Vérifier le code
        </button>
      </div>
    </div>
  );
}

export default VerifyOtpAdmin;
