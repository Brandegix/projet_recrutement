import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/Footer.css';
import logo from '../assets/ourlogo.jpeg'; // adjust the path if needed


const Footer = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

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
      }
    };

    checkAuthStatus();
  }, []);

  return (
    <footer className="casajobs-footer">
      <div className="casajobs-footer-wrapper">
        <div className="casajobs-footer-section casajobs-footer-about">
  <img src={logo} alt="CasaJobs Logo" className="footer-logo" />
  <p>
    La plateforme marocaine dédiée à la recherche d'emploi et de talents. Rejoignez-nous pour trouver les meilleures opportunités ou les meilleurs profils.
  </p>
</div>

        
        <div className="casajobs-footer-section casajobs-footer-links">
          <h3>Liens utiles</h3>
          <ul>
            <li><Link to="/">Accueil</Link></li>
            <li><Link to="/AboutUs">À propos</Link></li>
            <li><Link to="/ConseilsPage">Conseils</Link></li>
            
            {/* Dynamic links based on authentication status */}
            {!isCheckingAuth && (
              <>
                {isLoggedIn && user ? (
                  <>
                    {user.role === "recruiter" ? (
                      <>
                        <li><Link to="/RecruiterProfile">Mon profil</Link></li>
                        <li><Link to="/RecruiterJobOffers">Offres d'emploi</Link></li>
                        <li><Link to="/job-offer-statistics">Statistiques</Link></li>
                      </>
                    ) : (
                      <>
                        <li><Link to="/candidate-profile">Mon profil</Link></li>
                        <li><Link to="/Offres">Offres d'emploi</Link></li>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <li><Link to="/ChoixRole">S'inscrire</Link></li>
                    <li><Link to="/ChoixRole2">Se connecter</Link></li>
                  </>
                )}
              </>
            )}
          </ul>
        </div>

        <div className="casajobs-footer-section casajobs-footer-contact">
          <h3>Contact</h3>
          <p>Email : contact@casajobs.ma</p>
          <p>Téléphone : +212 666-557106</p>
          <p>Adresse : Casablanca, Maroc</p>
          
          {/* Show user-specific contact info when logged in */}
          {isLoggedIn && user && (
            <div className="footer-user-info">
              <p>Connecté en tant que : <strong>{user.name}</strong></p>
              <p>Rôle : <em>{user.role === "recruiter" ? "Recruteur" : "Candidat"}</em></p>
            </div>
          )}
        </div>
      </div>
      
      <div className="casajobs-footer-bottom">
        <div className="footer-bottom-content">
          <p>&copy; {new Date().getFullYear()} CasaJobs.ma - Tous droits réservés</p>
          
          {/* Dynamic bottom section based on user status */}
          {!isCheckingAuth && (
            <div className="footer-user-status">
              {isLoggedIn && user ? (
                <span className="status-connected">
                  ● Connecté ({user.role === "recruiter" ? "Recruteur" : "Candidat"})
                </span>
              ) : (
                <span className="status-guest">
                  ● Visiteur - <Link to="/ChoixRole2">Se connecter</Link>
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
