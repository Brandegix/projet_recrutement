import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendarAlt, 
  FaGraduationCap, FaPlus, FaTrash, FaLock, FaCheckCircle, 
  FaUserGraduate, FaArrowRight, FaInfoCircle
} from 'react-icons/fa';
import "../assets/css/Login.css";
import Footer from '../components/Footer';
import Navbar from "../components/Navbara";

function RegisterCandidate() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
    phoneNumber: "",
    skills: []
  });

  const [skills, setSkills] = useState([{ name: '', level: 0 }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [validations, setValidations] = useState({
    username: false,
    email: false,
    password: false,
    name: false,
    phoneNumber: false
  });
  
  const navigate = useNavigate();
  const registerCardRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    // Animation d'entrée pour les éléments du formulaire
    if (formRef.current) {
      const elements = formRef.current.querySelectorAll('.form-section');
      elements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        setTimeout(() => {
          el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }, 150 * index);
      });
    }

    // Animation du titre
    const title = document.querySelector('.register-title');
    if (title) {
      title.style.opacity = '0';
      title.style.transform = 'scale(0.8)';
      setTimeout(() => {
        title.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        title.style.opacity = '1';
        title.style.transform = 'scale(1)';
      }, 200);
    }
  }, [currentStep]);

  // Validation en temps réel
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    
    setValidations({
      username: formData.username.length >= 3,
      email: emailRegex.test(formData.email),
      password: formData.password.length >= 6,
      name: formData.name.length >= 3,
      phoneNumber: phoneRegex.test(formData.phoneNumber)
    });
  }, [formData]);

  const handleSkillChange = (index, field, value) => {
    const updatedSkills = [...skills];
    updatedSkills[index][field] = field === "level" ? parseInt(value) : value;
    setSkills(updatedSkills);
  };

  const addSkill = () => {
    setSkills([...skills, { name: '', level: 0 }]);
  };

  const removeSkill = (index) => {
    const updatedSkills = [...skills];
    updatedSkills.splice(index, 1);
    setSkills(updatedSkills);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const nextStep = () => {
    if (currentStep === 1 && (!validations.username || !validations.email || !validations.password)) {
      // Animer les champs invalides
      const invalidInputs = document.querySelectorAll('.form-section:first-child .input-invalid');
      invalidInputs.forEach(input => {
        input.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
          input.style.animation = '';
        }, 500);
      });
      return;
    }
    
    if (currentStep === 2 && (!validations.name || !validations.phoneNumber)) {
      // Animer les champs invalides
      const invalidInputs = document.querySelectorAll('.form-section:nth-child(2) .input-invalid');
      invalidInputs.forEach(input => {
        input.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
          input.style.animation = '';
        }, 500);
      });
      return;
    }
    
    // Animation de transition
    if (formRef.current) {
      const currentSection = formRef.current.querySelector(`.form-section:nth-child(${currentStep})`);
      if (currentSection) {
        currentSection.style.transform = 'translateX(-50px)';
        currentSection.style.opacity = '0';
        setTimeout(() => {
          setCurrentStep(prev => prev + 1);
          setTimeout(() => {
            const nextSection = formRef.current.querySelector(`.form-section:nth-child(${currentStep + 1})`);
            if (nextSection) {
              nextSection.style.transform = 'translateX(0)';
              nextSection.style.opacity = '1';
            }
          }, 50);
        }, 300);
      }
    }
  };

  const prevStep = () => {
    // Animation de transition
    if (formRef.current) {
      const currentSection = formRef.current.querySelector(`.form-section:nth-child(${currentStep})`);
      if (currentSection) {
        currentSection.style.transform = 'translateX(50px)';
        currentSection.style.opacity = '0';
        setTimeout(() => {
          setCurrentStep(prev => prev - 1);
          setTimeout(() => {
            const prevSection = formRef.current.querySelector(`.form-section:nth-child(${currentStep - 1})`);
            if (prevSection) {
              prevSection.style.transform = 'translateX(0)';
              prevSection.style.opacity = '1';
            }
          }, 50);
        }, 300);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Vérifier si toutes les compétences ont un nom
    const hasEmptySkills = skills.some(skill => !skill.name.trim());
    if (hasEmptySkills) {
      setError("Veuillez nommer toutes vos compétences ou les supprimer");
      setLoading(false);
      return;
    }

    const updatedFormData = {
      ...formData,
      skills: skills.filter(skill => skill.name.trim()).map(skill => ({ name: skill.name, level: skill.level }))
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/candidates/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFormData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de l'inscription");
      }

      // Animation de succès
      if (registerCardRef.current) {
        registerCardRef.current.style.transform = 'scale(1.02)';
        registerCardRef.current.style.boxShadow = '0 20px 40px rgba(34, 197, 94, 0.3)';
        
        setTimeout(() => {
          registerCardRef.current.style.transform = 'scale(0.95)';
          registerCardRef.current.style.opacity = '0.8';
          setTimeout(() => {
      localStorage.setItem("userId", data.id);
      localStorage.setItem("userRole", "candidate");
      navigate("/CandidatePagefrom");
          }, 300);
        }, 500);
      }

    } catch (err) {
      setError(err.message);
      // Animation d'erreur
      if (registerCardRef.current) {
        registerCardRef.current.style.animation = 'shake 0.6s ease-in-out';
        registerCardRef.current.style.boxShadow = '0 10px 30px rgba(239, 68, 68, 0.3)';
        
        setTimeout(() => {
          registerCardRef.current.style.animation = '';
          registerCardRef.current.style.boxShadow = '';
        }, 600);
      }
    } finally {
      setLoading(false);
    }
  };

  // Calculer la progression
  const progress = ((currentStep - 1) / 2) * 100;

  return (
    <>
    <Navbar />
      <div className="register-page">
        {/* Éléments décoratifs d'arrière-plan */}
        <div className="background-decoration">
          <div className="floating-shape shape-1"></div>
          <div className="floating-shape shape-2"></div>
          <div className="floating-shape shape-3"></div>
        </div>

        <div className="register-card" ref={registerCardRef}>
          <div className="register-header">
            <div className="icon-container">
              <FaUserGraduate className="main-icon" />
            </div>
            <h2 className="register-title">
              Inscription Candidat
            </h2>
            <p className="register-subtitle">
              Créez votre compte pour trouver votre prochain emploi
            </p>
          </div>

          {/* Indicateur de progression */}
          <div className="progress-container">
            <div className="progress-bar-container">
              <div 
                className="progress-bar" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="steps-indicator">
              <div className={`step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
                <div className="step-number">
                  {currentStep > 1 ? <FaCheckCircle /> : 1}
                </div>
                <span className="step-label">Connexion</span>
              </div>
              <div className={`step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
                <div className="step-number">
                  {currentStep > 2 ? <FaCheckCircle /> : 2}
                </div>
                <span className="step-label">Profil</span>
              </div>
              <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
                <div className="step-number">3</div>
                <span className="step-label">Compétences</span>
              </div>
            </div>
          </div>
          
          {error && (
            <div className="error-message">
              <div className="error-content">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="register-form" ref={formRef}>
            {/* Étape 1: Informations de connexion */}
            <div className={`form-section ${currentStep === 1 ? 'active' : ''}`}>
              <h3 className="section-title">
                <FaLock className="section-icon" />
                Informations de connexion
              </h3>
          <div className="form-row">
                <div className="input-group">
                  <div className="input-container">
                  <label className="input-label">
                    <FaUser className="input-icon" /> 
                    Identifiant
                   
                  </label>
                  
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              minLength={3}
                      placeholder="Votre identifiant"
                      className={`form-input ${!validations.username && formData.username ? 'input-invalid' : ''} ${validations.username && formData.username ? 'input-valid' : ''}`}
                    />
                    {validations.username && formData.username && <FaCheckCircle className="validation-icon" />}
                  </div>
                  {!validations.username && formData.username && (
                    <p className="input-error">L'identifiant doit contenir au moins 3 caractères</p>
                  )}
                </div>
              </div>
              <div className="form-row">
                <div className="input-group">
                  <label className="input-label">
                    <FaEnvelope className="input-icon" /> 
                    Email
                    {validations.email && formData.email && <FaCheckCircle className="validation-icon" />}
                  </label>
                  <div className="input-container">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="votre@email.com"
                      className={`form-input ${!validations.email && formData.email ? 'input-invalid' : ''} ${validations.email && formData.email ? 'input-valid' : ''}`}
                    />
                   
                  </div>
                  {!validations.email && formData.email && (
                    <p className="input-error">Veuillez entrer une adresse email valide</p>
                  )}
                </div>
              </div>
              <div className="form-row">
                <div className="input-group">
                  <label className="input-label">
                    <FaLock className="input-icon" /> 
                    Mot de passe
                    {validations.password && formData.password && <FaCheckCircle className="validation-icon" />}
                  </label>
                  <div className="input-container">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
                      placeholder="••••••••"
                      className={`form-input ${!validations.password && formData.password ? 'input-invalid' : ''} ${validations.password && formData.password ? 'input-valid' : ''}`}
                    />
                    
                  </div>
                  {!validations.password && formData.password && (
                    <p className="input-error">Le mot de passe doit contenir au moins 6 caractères</p>
                  )}
                </div>
              </div>
              <div className="form-navigation">
                <button 
                  type="button" 
                  className="next-button"
                  onClick={nextStep}
                >
                  Suivant <FaArrowRight className="button-icon" />
                </button>
              </div>
          </div>

            {/* Étape 2: Informations personnelles */}
            <div className={`form-section ${currentStep === 2 ? 'active' : ''}`}>
              <h3 className="section-title">
                <FaUser className="section-icon" />
                Informations personnelles
              </h3>
          <div className="form-row">
                <div className="input-group">
                  <label className="input-label">
                    <FaUser className="input-icon" /> 
                    Nom complet
                    {validations.name && formData.name && <FaCheckCircle className="validation-icon" />}
                  </label>
                  <div className="input-container">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
                      placeholder="Votre nom complet"
                      className={`form-input ${!validations.name && formData.name ? 'input-invalid' : ''} ${validations.name && formData.name ? 'input-valid' : ''}`}
                    />
                   
                  </div>
                  {!validations.name && formData.name && (
                    <p className="input-error">Le nom doit contenir au moins 3 caractères</p>
                  )}
                </div>
              </div>
              <div className="form-row">
                <div className="input-group">
                  <label className="input-label">
                    <FaPhone className="input-icon" /> 
                    Téléphone
                    {validations.phoneNumber && formData.phoneNumber && <FaCheckCircle className="validation-icon" />}
                  </label>
                  <div className="input-container">
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              pattern="[0-9]{10}"
              title="Numéro à 10 chiffres"
                      placeholder="0123456789"
                      className={`form-input ${!validations.phoneNumber && formData.phoneNumber ? 'input-invalid' : ''} ${validations.phoneNumber && formData.phoneNumber ? 'input-valid' : ''}`}
                    />
                    
                  </div>
                  {!validations.phoneNumber && formData.phoneNumber && (
                    <p className="input-error">Le numéro de téléphone doit contenir 10 chiffres</p>
                  )}
                </div>
              </div>
              <div className="form-navigation">
                <button 
                  type="button" 
                  className="prev-button"
                  onClick={prevStep}
                >
                  Précédent
                </button>
                <button 
                  type="button" 
                  className="next-button"
                  onClick={nextStep}
                >
                  Suivant <FaArrowRight className="button-icon" />
                </button>
              </div>
          </div>

            {/* Étape 3: Compétences */}
            <div className={`form-section ${currentStep === 3 ? 'active' : ''}`}>
              <h3 className="section-title">
                <FaGraduationCap className="section-icon" />
                Compétences
              </h3>
              <div className="skills-info">
                <FaInfoCircle className="info-icon" />
                <p>Ajoutez vos compétences et évaluez votre niveau (0-100)</p>
          </div>
              <div className="skills-container">
            {skills.map((skill, index) => (
              <div key={index} className="skill-entry">
                    <div className="skill-inputs">
                      <div className="input-group skill-name">
                <input
                  type="text"
                  placeholder="Nom de la compétence"
                  value={skill.name}
                  onChange={(e) => handleSkillChange(index, 'name', e.target.value)}
                  required
                          className="form-input"
                />
                      </div>
                      <div className="input-group skill-level">
                <input
                  type="number"
                          placeholder="Niveau"
                  value={skill.level}
                  onChange={(e) => handleSkillChange(index, 'level', e.target.value)}
                  min="0"
                  max="100"
                  required
                          className="form-input"
                        />
                        <div className="skill-level-visual">
                          <div 
                            className="skill-level-bar" 
                            style={{ width: `${skill.level}%` }}
                          ></div>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="skill-button remove"
                        onClick={() => removeSkill(index)}
                        disabled={skills.length === 1}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  className="skill-button add"
                  onClick={addSkill}
                >
                  <FaPlus /> Ajouter une compétence
                </button>
              </div>
              <div className="form-navigation">
                <button 
                  type="button" 
                  className="prev-button"
                  onClick={prevStep}
                >
                  Précédent
                </button>
          <button 
                  className={`submit-button ${loading ? 'loading' : ''}`}
            type="submit"
            disabled={loading}
          >
                  <span className="button-content">
                    {loading ? (
                      <>
                        <div className="loading-spinner"></div>
                        Inscription en cours...
                      </>
                    ) : (
                      "S'inscrire"
                    )}
                  </span>
                  <div className="button-overlay"></div>
          </button>
              </div>
            </div>
        </form>
          
          <div className="form-footer">
            <p>
              Déjà inscrit ? 
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/login/candidat");
                }}
                className="login-link"
              >
                Se connecter
              </a>
            </p>
          </div>
        </div>
      </div>
      <Footer />

      <style jsx>{`
        .register-page {
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
          animation: float 6s ease-in-out infinite;
        }

        .shape-1 {
          width: 80px;
          height: 80px;
          top: 20%;
          left: 10%;
          animation-delay: 0s;
        }

        .shape-2 {
          width: 120px;
          height: 120px;
          top: 60%;
          right: 15%;
          animation-delay: 2s;
        }

        .shape-3 {
          width: 60px;
          height: 60px;
          bottom: 20%;
          left: 20%;
          animation-delay: 4s;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }

        .register-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 2.5rem 2rem;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 700px;
          position: relative;
          z-index: 10;
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          margin: 2rem 0;
        }

        .register-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
        }

        .register-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .icon-container {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #ff8c00, #f56040);
          border-radius: 50%;
          margin-bottom: 1.5rem;
          box-shadow: 0 10px 30px rgba(255, 140, 0, 0.3);
        }

        .main-icon {
          font-size: 2rem;
          color: white;
        }

        .register-title {
          font-size: 2rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 0.5rem 0;
          background: linear-gradient(135deg, #ff8c00, #f56040);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .register-subtitle {
          color: #6b7280;
          font-size: 1rem;
          margin: 0 0 1.5rem 0;
        }

        .progress-container {
          margin-bottom: 2rem;
        }

        .progress-bar-container {
          height: 8px;
          background-color: #e5e7eb;
          border-radius: 4px;
          margin-bottom: 1rem;
          overflow: hidden;
        }

        .progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #ff8c00, #f56040);
          border-radius: 4px;
          transition: width 0.5s ease;
        }

        .steps-indicator {
          display: flex;
          justify-content: space-between;
        }

        .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          flex: 1;
        }

        .step-number {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background-color: #e5e7eb;
          color: #6b7280;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          margin-bottom: 0.5rem;
          transition: all 0.3s ease;
        }

        .step.active .step-number {
          background: linear-gradient(135deg, #ff8c00, #f56040);
          color: white;
          box-shadow: 0 5px 15px rgba(255, 140, 0, 0.3);
        }

        .step.completed .step-number {
          background: #10b981;
          color: white;
        }

        .step-label {
          font-size: 0.85rem;
          color: #6b7280;
          transition: all 0.3s ease;
        }

        .step.active .step-label {
          color: #ff8c00;
          font-weight: 600;
        }

        .step.completed .step-label {
          color: #10b981;
        }

        .error-message {
          margin-bottom: 1.5rem;
          padding: 1rem;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 12px;
          animation: slideIn 0.3s ease-out;
        }

        .error-content {
          display: flex;
          align-items: center;
          color: #dc2626;
          font-size: 0.9rem;
        }

        .error-icon {
          margin-right: 0.5rem;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .register-form {
          position: relative;
          overflow: hidden;
        }

        .form-section {
          display: none;
          opacity: 0;
          transform: translateX(50px);
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .form-section.active {
          display: block;
          opacity: 1;
          transform: translateX(0);
        }

        .section-title {
          display: flex;
          align-items: center;
          font-size: 1.25rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 1.5rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #f3f4f6;
        }

        .section-icon {
          margin-right: 0.75rem;
          color: #ff8c00;
        }

        .form-row {
          margin-bottom: 1.5rem;
        }

        .input-group {
          margin-bottom: 1rem;
        }

        .input-label {
        
          align-items: center;
          justify-content: space-between;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
        }

        .input-icon {
          margin-right: 0.5rem;
          color: #ff8c00;
        }

        .validation-icon {
          color: #10b981;
          font-size: 0.9rem;
        }

        .input-container {
          position: relative;
        }

.form-input {
  width: 100%;
  max-width: 400px; /* Ajoutez cette ligne pour limiter la largeur */
  margin: 0 auto; /* Centre les inputs */
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(255, 255, 255, 0.8);
  display: block; /* Assure que margin: 0 auto fonctionne */
}

        .form-input:focus {
          outline: none;
          border-color: #ff8c00;
          box-shadow: 0 0 0 3px rgba(255, 140, 0, 0.1);
          background: rgba(255, 255, 255, 0.95);
        }

        .form-input.input-valid {
          border-color: #10b981;
          background: rgba(16, 185, 129, 0.05);
        }

        .form-input.input-invalid {
          border-color: #ef4444;
          background: rgba(239, 68, 68, 0.05);
        }

        .input-border {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(135deg, #ff8c00, #f56040);
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .input-group:focus-within .input-border {
          width: 100%;
        }

        .input-error {
          color: #ef4444;
          font-size: 0.8rem;
          margin-top: 0.25rem;
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .skills-info {
          display: flex;
          align-items: center;
          background: rgba(255, 140, 0, 0.1);
          padding: 0.75rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
        }

        .info-icon {
          color: #ff8c00;
          margin-right: 0.75rem;
          flex-shrink: 0;
        }

        .skills-info p {
          margin: 0;
          font-size: 0.9rem;
          color: #4b5563;
        }

        .skills-container {
          margin-bottom: 1.5rem;
        }

        .skill-entry {
          margin-bottom: 1rem;
          animation: fadeIn 0.3s ease-out;
        }

        .skill-inputs {
          display: flex;
          gap: 0.75rem;
          align-items: center;
        }

        .skill-name {
          flex: 2;
          margin-bottom: 0;
        }

        .skill-level {
          flex: 1;
          margin-bottom: 0;
          position: relative;
        }

        .skill-level-visual {
          height: 4px;
          background-color: #e5e7eb;
          border-radius: 2px;
          margin-top: 0.25rem;
          overflow: hidden;
        }

        .skill-level-bar {
          height: 100%;
          background: linear-gradient(90deg, #ff8c00, #f56040);
          border-radius: 2px;
          transition: width 0.3s ease;
        }

        .skill-button {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.5rem;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 600;
        }

        .skill-button.add {
          background: linear-gradient(135deg, #ff8c00, #f56040);
          color: white;
          padding: 0.75rem 1rem;
          margin-top: 1rem;
          width: 100%;
          justify-content: center;
        }

        .skill-button.add:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(255, 140, 0, 0.3);
        }

        .skill-button.remove {
          background-color: #f3f4f6;
          color: #ef4444;
          height: 40px;
          width: 40px;
          flex-shrink: 0;
        }

        .skill-button.remove:hover {
          background-color: #fee2e2;
        }

        .skill-button.remove:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .form-navigation {
          display: flex;
          justify-content: space-between;
          margin-top: 2rem;
        }

        .prev-button, .next-button, .submit-button {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .prev-button {
          background-color: #f3f4f6;
          color: #4b5563;
        }

        .prev-button:hover {
          background-color: #e5e7eb;
        }

        .next-button, .submit-button {
          background: linear-gradient(135deg, #ff8c00, #f56040);
          color: white;
          display: flex;
          align-items: center;
          position: relative;
          overflow: hidden;
        }

        .next-button:hover, .submit-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(255, 140, 0, 0.3);
        }

        .button-icon {
          margin-left: 0.5rem;
        }

        .button-content {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
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

        .next-button:hover .button-overlay,
        .submit-button:hover .button-overlay {
          left: 100%;
        }

        .loading-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-right: 0.5rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .form-footer {
          text-align: center;
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid #e5e7eb;
        }

        .form-footer p {
          color: #6b7280;
          font-size: 0.9rem;
          margin: 0;
        }

        .login-link {
          color: #ff8c00;
          text-decoration: none;
          font-weight: 600;
          margin-left: 0.5rem;
          transition: all 0.3s ease;
          position: relative;
        }

        .login-link:hover {
          color: #f56040;
        }

        .login-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(135deg, #ff8c00, #f56040);
          transition: width 0.3s ease;
        }

        .login-link:hover::after {
          width: 100%;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }

        @media (max-width: 768px) {
          .register-card {
            padding: 2rem 1.5rem;
            margin: 1rem;
          }
          
          .register-title {
            font-size: 1.75rem;
          }
          
          .icon-container {
            width: 60px;
            height: 60px;
          }
          
          .main-icon {
            font-size: 1.5rem;
          }
          
          .skill-inputs {
            flex-direction: column;
            gap: 0.5rem;
          }
          
          .skill-name, .skill-level {
            width: 100%;
          }
          
          .skill-button.remove {
            position: absolute;
            right: 0;
            top: 0;
          }
          
          .form-navigation {
            flex-direction: column;
            gap: 1rem;
          }
          
          .prev-button, .next-button, .submit-button {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </>
  );
}

export default RegisterCandidate;
