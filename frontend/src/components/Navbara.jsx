import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import "../assets/css/Nav.css";
import { LogOut, Menu } from "lucide-react";

const Navbar = ({ onAuthCheckComplete }) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [logoutMessage, setLogoutMessage] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true); // Add loading state

  const handleLogout = () => {
    fetch(`${process.env.REACT_APP_API_URL}/api/logout`, {
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
    const checkAuthStatus = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/session`, {
          credentials: 'include',
        });
        
        if (!res.ok) throw new Error('Not logged in');
        
        const data = await res.json();
        if (data && data.isLoggedIn) {
          setIsLoggedIn(true);
          setUser(data.user);
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      } catch (error) {
        setIsLoggedIn(false);
        setUser(null);
      } finally {
        setIsCheckingAuth(false);
        // Notify parent component that auth check is complete
        if (onAuthCheckComplete) {
          onAuthCheckComplete();
        }
      }
    };

    checkAuthStatus();
  }, [onAuthCheckComplete]);

  // Don't render navbar content while checking authentication
  if (isCheckingAuth) {
    return (
      <nav className="nav-wrapper">
        <div className="nav-left">
          <div className="nav-logo">
            <span className="nav-logo-white">C</span>asajobs.<span className="nav-logo-orange">ma</span>
          </div>
        </div>
        {/* Render minimal navbar structure while loading */}
        <div className="nav-right">
          <ul className="nav-links">
            {/* Empty or skeleton content */}
          </ul>
        </div>
      </nav>
    );
  }

  return (
    <nav className="nav-wrapper">
      <div className="nav-left">
        <div className="nav-logo">
          <span className="nav-logo-white">C</span>asajobs.<span className="nav-logo-orange">ma</span>
        </div>
        {/* Hamburger Menu Button */}
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          <Menu size={28} color="#fff" />
        </button>
      </div>
      
      {/* Nav content - collapsible */}
      <div className={`nav-right ${menuOpen ? 'open' : ''}`}>
        <ul className="nav-links">
          <li><Link to="/">Accueil</Link></li>
          <li><Link to="/AboutUs">À propos</Link></li>
          <li><Link to="/ConseilsPage">Conseils</Link></li>
          {isLoggedIn && user ? (
            <>
              {user.role === "recruiter" ? (
                <>
                  <li><Link to="/RecruiterProfile" className="nav-username">{user.name}</Link></li>
                  <li><Link to="/Subscribers">Newsletter</Link></li>
                  <li><Link to="/job-offer-statistics">Statistiques</Link></li>
                </>
              ) : (
                <>
                  <li><Link to="/candidate-profile" className="nav-username">{user.name}</Link></li>
                  <li><Link to="/applications">Mes candidatures</Link></li>
                </>
              )}
            </>
          ) : (
            <>
              <li><Link to="/ChoixRole">S'inscrire</Link></li>
              <li><Link to="/ChoixRole2">Se connecter</Link></li>
            </>
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
