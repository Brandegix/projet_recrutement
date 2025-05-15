import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../assets/css/form.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, role }),
      });

      const result = await response.json();

      if (response.ok) {
        // ✅ Enregistrement de l'ID dans le localStorage
        localStorage.setItem("userId", result.id);
        localStorage.setItem("userRole", role); // (optionnel, si tu veux l'utiliser plus tard)
        
        alert(result.message);

        if (role === "candidate") {
          navigate("/CandidatePagefrom");
        } else {
          navigate("/Recruteur");
        }
      } else {
        alert("Erreur : " + result.error);
      }
    } catch (error) {
      alert("Erreur de connexion : " + error.message);
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="title"><span className="t1">C</span>asajobs.<span className="t2">ma</span></div>
      </nav>

      <div className="App">
        <div className="loginContainer">
          <h1>Connexion</h1>

          <form onSubmit={handleSubmit}>
            <div className="input-container">
              <label>Nom d'utilisateur</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="input-container">
              <label>Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="input-container">
              <label>Rôle</label>
              <select value={role} onChange={(e) => setRole(e.target.value)} required>
                <option value="">Sélectionner un rôle</option>
                <option value="candidate">Candidat</option>
                <option value="recruiter">Recruteur</option>
              </select>
            </div>

            <button className="loginBut" type="submit">
              <p>Se connecter</p>
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
