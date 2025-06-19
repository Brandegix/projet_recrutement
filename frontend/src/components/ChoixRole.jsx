import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaBuilding, FaArrowRight, FaUserGraduate, FaBriefcase } from 'react-icons/fa';
import "../assets/css/ChoixRole.css";

import Navbar from '../components/Navbara';
import Footer from '../components/Footer';
import candidatImg from '../assets/images/choixRole/Candidate_business_generated - Edited - Edited.jpg';
import recruiterImg from '../assets/images/choixRole/recruiter.jpg';

const ChoixRole = () => {
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
            navigate("/register/candidat");
          } else if (role === "recruteur") {
            navigate("/register/recruteur");
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
              <FaUser className="main-icon" />
            </div>
            <h1 className="main-title">Bienvenue sur CasaJobs</h1>
            <p className="sub-title">Choisissez votre profil pour commencer votre aventure professionnelle</p>
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
                {/* <h3 className="role-name">Candidat</h3> */}
                {/* <p className="role-description">
                  Trouvez l'emploi de vos rêves et développez votre carrière
                </p> */}
              </div>
              
              <div className="image-container">
                <img src={candidatImg || "/placeholder.svg"} alt="Candidat" className="role-image" />
                <div className="image-overlay"></div>
              </div>
              
              <div className="card-content">
                <ul className="role-features">
                  <li>Accès aux offres d'emploi</li>
                  <li>Création de profil professionnel</li>
                  <li>Candidature en un clic</li>
                  <li>Suivi des candidatures</li>
                </ul>
                
                <button 
                  onClick={() => handleRoleSelect("candidat")} 
                  className="select-button candidat-button"
                >
                  <span className="button-content">
                   Candidat
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
                {/* <h3 className="role-name">Recruteur</h3>
                <p className="role-description">
                  Trouvez les meilleurs talents pour votre entreprise
                </p> */}
              </div>
              
              <div className="image-container">
                <img src={recruiterImg || "/placeholder.svg"} alt="Recruteur" className="role-image" />
                <div className="image-overlay"></div>
              </div>
              
              <div className="card-content">
                <ul className="role-features">
                  <li>Publication d'offres d'emploi</li>
                  <li>Gestion des candidatures</li>
                  <li>Recherche de profils</li>
                  <li>Outils de recrutement</li>
                </ul>
                
                <button 
                  onClick={() => handleRoleSelect("recruteur")} 
                  className="select-button recruteur-button"
                >
                  <span className="button-content">
                    Recruteur
                    <FaArrowRight className="button-icon" />
                  </span>
                  <div className="button-overlay"></div>
                </button>
              </div>
            </div>
          </div>

          <div className="additional-info">
            <p className="info-text">
              Vous pourrez toujours modifier votre choix plus tard dans les paramètres de votre compte
            </p>
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
          align-items: center;
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
  .candidat-icon, .recruteur-icon {
  margin-left: auto;
  margin-right: auto;
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

        .card-content {
          text-align: left;
        }

        .role-features {
          list-style: none;
          padding: 0;
          margin: 0 0 2rem 0;
        }

        .role-features li {
          padding: 0.5rem 0;
          color: #4b5563;
          position: relative;
          padding-left: 1.5rem;
        }

        .role-features li::before {
          content: '✓';
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
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          color: white;
          white-space: nowrap;
          text-overflow: ellipsis;
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
          gap: 0.5rem;
          width: 100%;
        }

        .button-icon {
          margin-left: 0.5rem;
          transition: transform 0.3s ease;
          flex-shrink: 0;
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

        .info-text {
          color: #6b7280;
          font-size: 0.9rem;
          margin: 0;
          font-style: italic;
        }

        @media (max-width: 768px) {
          .role-selection-content {
            padding: 2rem 1.5rem;
            margin: 1rem;
          }
          
          .main-title {
    font-size: 2rem;
    margin-bottom: 0.75rem;
    word-break: break-word;
  }
          
          .sub-title {
    font-size: 1rem;
  }
          
          .roles-wrapper {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          
          .role-card {
            padding: 1.5rem;
          }
          
          .icon-container {
            width: 70px;
            height: 80px;
            margin-bottom: 1.5rem;
          }
          
          .main-icon {
            font-size: 1.75rem;
          }
          
          .role-icon-container {
            width: 60px;
            height: 60px;
          }
          
          .role-icon {
            font-size: 1.5rem;
          }
          
          .image-container {
            height: 180px;
          }
          
          .select-button {
            font-size: 0.9rem;
            padding: 0.9rem 1.2rem;
          }
        }

        @media (max-width: 480px) {
          .roles-wrapper {
            grid-template-columns: 1fr;
          }
          
          .role-card {
            min-width: auto;
          }
          
          .select-button {
            font-size: 0.85rem;
            padding: 0.8rem 1rem;
          }
        }
        @media (max-width: 360px) {
  .role-selection-content {
    padding: 1.5rem 1rem; /* Reduced padding */
  }
  
  .main-title {
    font-size: 1.4rem; /* Reduced from 1.5rem */
    max-width: 100%;
    word-break: break-word;
    margin: 0 auto 0.75rem; /* Center with margin */
  }
  
  .icon-container {
    width: 50px;
    height: 50px;
    margin-bottom: 1.75rem; /* Increased spacing between icon and title */
  }
  
  .main-icon {
    font-size: 1.5rem;
  }
  
  .header-section {
    margin-bottom: 1.5rem; /* Reduced overall header section margin */
  }
}
      `}</style>
    </>
  );
};

export default ChoixRole;
