import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbara";
import Footer from "../components/Footer";

function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Extract email from query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setEmail(params.get("email") || "");
  }, [location.search]);

  const handleVerifyOtp = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/verify-otp`, { email, otp }, { withCredentials: true });
      alert("Code vérifié avec succès !");
      
      // ✅ Redirect to reset password page after successful verification
      navigate(`/reset-password?email=${email}`);
    } catch (err) {
      alert("Code invalide.");
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
            Vérification du Code
          </h2>

          <p 
            style={{
              fontSize: "14px",
              color: "#666",
              marginBottom: "20px",
            }}
          >
            Un code a été envoyé à votre email: <b>{email}</b>
          </p>

          <div style={{ textAlign: "left", marginBottom: "15px" }}>
            <label style={{ fontSize: "14px", fontWeight: "600", color: "#555" }}>
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
          </div>

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
      <Footer />
    </>
  );
}

export default VerifyOtp;
