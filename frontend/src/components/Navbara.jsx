import React from 'react';

import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../assets/css/Nav.css";
import { LogOut } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [logoutMessage, setLogoutMessage] = useState('');
  console.log(isLoggedIn);
  const handleLogout = () => {
    fetch('http://localhost:5000/api/logout', {
      method: 'POST',
      credentials: 'include',
    })
      .then(res => {
        if (!res.ok) throw new Error("Logout failed");
        return res.json();
      })
      .then(() => {
        setIsLoggedIn(false);
        setLogoutMessage("Vous avez été déconnecté avec succès.");
        navigate('/');
      })
      .catch(err => {
        console.error("Logout error:", err);
        alert("Erreur lors de la déconnexion.");
      });
  };

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/session`, {
      credentials: 'include',
    })
      .then(res => {
        if (!res.ok) throw new Error('Not logged in');
        return res.json();
      })
      .then(data => {
        if (data && data.isLoggedIn) {
          setIsLoggedIn(true);
          setUser(data.user);
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      })
      .catch(() => {
        setIsLoggedIn(false);
        setUser(null);
      });
  }, [LogOut]);

  // const handleLogout = () => {
  //   fetch(`${process.env.REACT_APP_API_URL}/api/logout`, {
  //     method: 'POST',
  //     credentials: 'include',
  //   })
  //     .then(res => {
  //       if (!res.ok) throw new Error("Logout failed");
  //       return res.json();
  //     })
  //     .then(() => {
  //       setIsLoggedIn(false);
  //       navigate('/');
  //     })
  //     .catch(err => {
  //       console.error("Logout error:", err);
  //       alert("Erreur lors de la déconnexion.");
  //     });
  // };

  return (
    <nav className="nav-wrapper">
      <div className="nav-left">
        <div className="nav-logo">
          <span className="nav-logo-white">C</span>asajobs.
          <span className="nav-logo-orange">ma</span>
        </div>
      </div>

      <div className="nav-right">
        <ul className="nav-links">
          <li><Link to="/">Accueil</Link></li>
          <li><Link to="/AboutUs">À propos</Link></li>
          <li><Link to="/ConseilsPage">Conseils</Link></li>
          {/* {!isLoggedIn && (
            // <li><Link to="/ChoixRole2">Se connecter</Link></li>
          )} */}

          {isLoggedIn && user ? (
            <>
              {/* Adjust the profile link based on the role */}
              <li>
                {user.role === "recruiter" ? (
                  <Link to="/RecruiterProfile" className="nav-username">{user.name}</Link>
                ) : (
                  <Link to="/candidate-profile" className="nav-username">{user.name}</Link>
                )}
              </li>

              {/* Add subscriptions link for candidates */}
              {(user.role === "candidate"  )&& (
                <li><Link to="/applications">Mes candidatures</Link></li>
              )}
            </>
          ) : (
            <>
            <li><Link to="/ChoixRole">S'inscrire</Link></li>
            <li><Link to="/ChoixRole2">Se connecter</Link></li></>

          )}
        </ul>

        {isLoggedIn && user && (
          <div className="nav-userinfo">
            <button onClick={handleLogout} className="nav-logout-btn">
              Se déconnecter
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
