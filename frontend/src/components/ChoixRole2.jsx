import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaBuilding, FaArrowRight, FaUserGraduate, FaBriefcase, FaSignInAlt, FaClock, FaShieldAlt } from 'react-icons/fa';
import "../assets/css/ChoixRole.css";

import Navbar from './Navbara';
import Footer from './Footer';
import candidatImg from '../assets/images/choixRole/Candidate_business_generated - Edited - Edited.jpg';
import recruiterImg from '../assets/images/choixRole/recruiter.jpg';

const ChoixRole2 = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    // Animation d'entrée pour le titre et sous-titre
    const title = document.querySelector('.main-title');
    const subtitle = document.querySelector('.sub-title');
    
    if (title) {
      title.style.opacity = '0';
      title.style.transform = 'translateY(-30px)';
      setTimeout(() => {
        title.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        title.style.opacity = '1';
        title.style.transform = 'translateY(0)';
      }, 200);
    }

    if (subtitle) {
      subtitle.style.opacity = '0';
      subtitle.style.transform = 'translateY(-20px)';
      setTimeout(() => {
        subtitle.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        subtitle.style.opacity = '1';
        subtitle.style.transform = 'translateY(0)';
      }, 400);
    }

    // Animation d'entrée pour les cartes
    cardsRef.current.forEach((card, index) => {
      if (card) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px) scale(0.9)';
        setTimeout(() => {
          card.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0) scale(1)';
        }, 600 + (index * 200));
      }
    });
  }, []);

  const handleRoleSelect = (role) => {
    // Animation de sélection
    const selectedCard = role === "candidat" ? cardsRef.current[0] : cardsRef.current[1];
    if (selectedCard) {
      selectedCard.style.transform = 'scale(1.05)';
      selectedCard.style.boxShadow = '0 25px 50px rgba(255, 140, 0, 0.4)';
      
      setTimeout(() => {
        selectedCard.style.transform = 'scale(0.95)';
        selectedCard.style.opacity = '0.8';
        
        setTimeout(() => {
          if (role === "candidat") {
            navigate("/login/candidat");
          } else if (role === "recruteur") {
            navigate("/LoginRecruteur");
          }
        }, 300);
      }, 500);
    }
  };

  const handleCardHover = (index, isHovering) => {
    const card = cardsRef.current[index];
    if (card) {
      if (isHovering) {
        card.style.transform = 'translateY(-10px) scale(1.02)';
        card.style.boxShadow = '0 20px 40px rgba(255, 140, 0, 0.2)';
      } else {
        card.style.transform = 'translateY(0) scale(1)';
        card.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
      }
    }
  };

  return (
    <>
      <Navbar />

      <div className="role-selection-container" ref={containerRef}>
        {/* Éléments décoratifs d'arrière-plan */}
        <div className="background-decoration">
          <div className="floating-shape shape-1"></div>
          <div className="floating-shape shape-2"></div>
          <div className="floating-shape shape-3"></div>
          <div className="floating-shape shape-4"></div>
        </div>

        <div className="role-selection-content">
          <div className="header-section">
            <div className="icon-container">
              <FaSignInAlt className="main-icon" />
            </div>
            <h1 className="main-title">Connexion à CasaJobs</h1>
            <p className="sub-title">Sélectionnez votre profil pour accéder à votre espace personnel</p>
          </div>

          <div className="roles-wrapper">
            <div 
              className="role-card candidat-card"
              ref={el => cardsRef.current[0] = el}
              onMouseEnter={() => handleCardHover(0, true)}
              onMouseLeave={() => handleCardHover(0, false)}
            >
              <div className="card-header">
                <div className="role-icon-container candidat-icon">
                  <FaUserGraduate className="role-icon" />
                </div>
                <h3 className="role-name">Espace Candidat</h3>
                <p className="role-description">
                  Accédez à votre profil et gérez vos candidatures
                </p>
              </div>
              <div className="image-container">
                <img src={candidatImg || "/placeholder.svg"} alt="Candidat" className="role-image" />
                <div className="image-overlay"></div>
                <div className="login-badge">
                  <FaClock className="badge-icon" />
                  <span>Accès rapide</span>
                </div>
              </div>
              
              <div className="card-content">
                <div className="quick-access-info">
                  <h4 className="access-title">Accès rapide à :</h4>
                  <ul className="role-features">
                    <li>Tableau de bord personnel</li>
                    <li>Offres d'emploi recommandées</li>
                    <li>Suivi des candidatures</li>
                    <li>Messages des recruteurs</li>
                  </ul>
                </div>
                
                <button 
                  onClick={() => handleRoleSelect("candidat")} 
                  className="select-button candidat-button"
                >
                  <span className="button-content">
                    Connexion
                    <FaArrowRight className="button-icon" />
                  </span>
                  <div className="button-overlay"></div>
                </button>
              </div>
            </div>

            <div 
              className="role-card recruteur-card"
              ref={el => cardsRef.current[1] = el}
              onMouseEnter={() => handleCardHover(1, true)}
              onMouseLeave={() => handleCardHover(1, false)}
            >
              <div className="card-header">
                <div className="role-icon-container recruteur-icon">
                  <FaBriefcase className="role-icon" />
                </div>
                <h3 className="role-name">Espace Recruteur</h3>
                <p className="role-description">
                  Gérez vos offres et trouvez les meilleurs talents
                </p>
              </div>
              
              <div className="image-container">
                <img src={recruiterImg || "/placeholder.svg"} alt="Recruteur" className="role-image" />
                <div className="image-overlay"></div>
                <div className="login-badge">
                  <FaShieldAlt className="badge-icon" />
                  <span>Espace sécurisé</span>
                </div>
              </div>
              
              <div className="card-content">
                <div className="quick-access-info">
                  <h4 className="access-title">Accès rapide à :</h4>
                  <ul className="role-features">
                    <li>Gestion des offres d'emploi</li>
                    <li>Base de données candidats</li>
                    <li>Statistiques de recrutement</li>
                    <li>Outils de communication</li>
                  </ul>
                </div>
                
                <button 
                  onClick={() => handleRoleSelect("recruteur")} 
                  className="select-button recruteur-button"
                >
                  <span className="button-content">
                     Connexion
                    <FaArrowRight className="button-icon" />
                  </span>
                  <div className="button-overlay"></div>
                </button>
              </div>
            </div>
          </div>

          <div className="additional-info">
            <div className="help-section">
              <p className="info-text">
                <strong>Première visite ?</strong> 
                <a 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/choixRole");
                  }}
                  className="register-link"
                >
                  Créer un compte
                </a>
              </p>
              <p className="security-note">
                <FaShieldAlt className="security-icon" />
                Connexion sécurisée avec chiffrement SSL
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      <style jsx>{`
        .role-selection-container {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #ff8c00 0%, #f56040 100%);
          padding: 2rem 1rem;
          overflow: hidden;
        }

        .background-decoration {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }

        .floating-shape {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          animation: float 8s ease-in-out infinite;
        }

        .shape-1 {
          width: 100px;
          height: 100px;
          top: 15%;
          left: 8%;
          animation-delay: 0s;
        }

        .shape-2 {
          width: 150px;
          height: 150px;
          top: 70%;
          right: 10%;
          animation-delay: 2s;
        }

        .shape-3 {
          width: 80px;
          height: 80px;
          bottom: 15%;
          left: 15%;
          animation-delay: 4s;
        }

        .shape-4 {
          width: 120px;
          height: 120px;
          top: 30%;
          right: 20%;
          animation-delay: 6s;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-30px) rotate(180deg);
          }
        }

        .role-selection-content {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 3rem 2rem;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 1200px;
          position: relative;
          z-index: 10;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .header-section {
          text-align: center;
          margin-bottom: 3rem;
        }

        .icon-container {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 100px;
          height: 100px;
          background: linear-gradient(135deg, #ff8c00, #f56040);
          border-radius: 50%;
          margin-bottom: 2rem;
          box-shadow: 0 15px 35px rgba(255, 140, 0, 0.3);
        }

        .main-icon {
          font-size: 2.5rem;
          color: white;
        }

        .main-title {
          font-size: 3rem;
          font-weight: 800;
          color: #1f2937;
          margin: 0 0 1rem 0;
          background: linear-gradient(135deg, #ff8c00, #f56040);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .sub-title {
          font-size: 1.25rem;
          color: #6b7280;
          margin: 0;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .roles-wrapper {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .role-card {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(15px);
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          border: 2px solid transparent;
          position: relative;
          overflow: hidden;
        }

        .role-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #ff8c00, #f56040);
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }

        .role-card:hover::before {
          transform: scaleX(1);
        }

        .candidat-card:hover {
          border-color: rgba(255, 140, 0, 0.3);
        }

        .recruteur-card:hover {
          border-color: rgba(245, 96, 64, 0.3);
        }

        .card-header {
          text-align: center;
          margin-bottom: 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;  /* Ensure everything is centered */
        }

        .role-icon-container {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 70px;
          height: 70px;
          border-radius: 50%;
          margin-bottom: 1rem;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .candidat-icon {
          background: linear-gradient(135deg, #ff8c00, #ffa500);
        }

        .recruteur-icon {
          background: linear-gradient(135deg, #f56040, #ff6b6b);
        }

        .role-icon {
          font-size: 1.75rem;
          color: white;
        }

        .role-name {
          font-size: 1.75rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 0.5rem 0;
        }

        .role-description {
          color: #6b7280;
          font-size: 1rem;
          margin: 0;
          line-height: 1.5;
          max-width: 100%;  /* Ensure text wraps */
          padding: 0 10px;  /* Add some padding */
        }

        .image-container {
          position: relative;
          margin-bottom: 1.5rem;
          border-radius: 16px;
          overflow: hidden;
          height: 200px;
        }

        .role-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .role-card:hover .role-image {
          transform: scale(1.05);
        }

        .image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, rgba(255, 140, 0, 0.1), rgba(245, 96, 64, 0.1));
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .role-card:hover .image-overlay {
          opacity: 1;
        }

        .login-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          padding: 0.5rem 0.75rem;
          border-radius: 20px;
          display: flex;
          align-items: center;
          font-size: 0.8rem;
          font-weight: 600;
          color: #ff8c00;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .badge-icon {
          margin-right: 0.5rem;
          font-size: 0.9rem;
        }

        .card-content {
          text-align: left;
        }

        .quick-access-info {
          margin-bottom: 2rem;
        }

        .access-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: #374151;
          margin: 0 0 1rem 0;
        }

        .role-features {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .role-features li {
          padding: 0.5rem 0;
          color: #4b5563;
          position: relative;
          padding-left: 1.5rem;
        }

        .role-features li::before {
          content: '→';
          position: absolute;
          left: 0;
          color: #ff8c00;
          font-weight: bold;
          font-size: 1.1rem;
        }

        .select-button {
          width: 100%;
          padding: 1rem 1.5rem;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          color: white;
        }

        .candidat-button {
          background: linear-gradient(135deg, #ff8c00, #ffa500);
        }

        .recruteur-button {
          background: linear-gradient(135deg, #f56040, #ff6b6b);
        }

        .select-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 35px rgba(255, 140, 0, 0.4);
        }

        .select-button:active {
          transform: translateY(-1px);
        }

        .button-content {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .button-icon {
          margin-left: 0.75rem;
          transition: transform 0.3s ease;
        }

        .select-button:hover .button-icon {
          transform: translateX(5px);
        }

        .button-overlay {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.6s ease;
        }

        .select-button:hover .button-overlay {
          left: 100%;
        }

        .additional-info {
          text-align: center;
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid #e5e7eb;
        }

        .help-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .info-text {
          color: #6b7280;
          font-size: 0.9rem;
          margin: 0;
        }

        .register-link {
          color: #ff8c00;
          text-decoration: none;
          font-weight: 600;
          margin-left: 0.5rem;
          transition: all 0.3s ease;
          position: relative;
        }

        .register-link:hover {
          color: #f56040;
        }

        .register-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(135deg, #ff8c00, #f56040);
          transition: width 0.3s ease;
        }

        .register-link:hover::after {
          width: 100%;
        }

        .security-note {
          display: flex;
          align-items: center;
          justify-content: center;
          color: #10b981;
          font-size: 0.85rem;
          margin: 0;
        }

        .security-icon {
          margin-right: 0.5rem;
          font-size: 0.9rem;
        }

        @media (max-width: 768px) {
          .role-selection-content {
            padding: 2rem 1.5rem;
            margin: 1rem;
          }
          
          .main-title {
            font-size: 2rem;  /* Reduced from 2.25rem */
            margin-bottom: 0.75rem;
            word-break: break-word;  /* Allow text to wrap properly */
          }
          
          .sub-title {
            font-size: 1rem;  /* Slightly smaller */
          }
          
          .roles-wrapper {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          
          .role-card {
            padding: 1.5rem;
          }
          
          .icon-container {
            width: 70px;  /* Reduced from 80px */
            height: 70px;
            margin-bottom: 1.5rem;
          }
          
          .main-icon {
            font-size: 1.75rem;  /* Reduced from 2rem */
          }
          
          .role-description {
            max-width: 100%;  /* Ensure text wraps */
            padding: 0 10px;  /* Add some padding */
          }
        }

        @media (max-width: 480px) {
          .roles-wrapper {
            grid-template-columns: 1fr;
          }
          
          .role-card {
            min-width: auto;
          }
        }

        @media (max-width: 360px) {
          .main-title {
            font-size: 1.5rem;
          }
          
          .icon-container {
            width: 60px;
            height: 60px;
          }
          
          .main-icon {
            font-size: 1.5rem;
          }
          
          .role-name {
            font-size: 1.5rem;  /* Smaller title */
          }
          
          .role-description {
            font-size: 0.9rem;  /* Smaller description text */
          }
          
          .role-icon-container {
            width: 50px;  /* Smaller icon container */
            height: 50px;
          }
        }
      `}</style>
    </>
  );
};

export default ChoixRole2;
