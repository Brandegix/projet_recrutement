import React, { useState, useEffect, useRef } from 'react';
import { 
  FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaBuilding, 
  FaUsers, FaLock, FaCheckCircle, FaArrowRight, FaInfoCircle,
  FaBriefcase, FaGlobe, FaIndustry, FaEdit, FaEye, FaEyeSlash
} from 'react-icons/fa';

function RegisterRecruiter() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    company: "",
    position: "",
    companySize: "",
    industry: "",
    website: "",
    address: "",
    city: "",
    description: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validations, setValidations] = useState({
    username: false,
    email: false,
    password: false,
    confirmPassword: false,
    firstName: false,
    lastName: false,
    phoneNumber: false,
    company: false,
    position: false
  });
  
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
      confirmPassword: formData.password === formData.confirmPassword && formData.confirmPassword.length > 0,
      firstName: formData.firstName.length >= 2,
      lastName: formData.lastName.length >= 2,
      phoneNumber: phoneRegex.test(formData.phoneNumber),
      company: formData.company.length >= 2,
      position: formData.position.length >= 2
    });
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const nextStep = () => {
    if (currentStep === 1 && (!validations.username || !validations.email || !validations.password || !validations.confirmPassword)) {
      const invalidInputs = document.querySelectorAll('.form-section.active .input-invalid');
      invalidInputs.forEach(input => {
        input.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
          input.style.animation = '';
        }, 500);
      });
      return;
    }
    
    if (currentStep === 2 && (!validations.firstName || !validations.lastName || !validations.phoneNumber)) {
      const invalidInputs = document.querySelectorAll('.form-section.active .input-invalid');
      invalidInputs.forEach(input => {
        input.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
          input.style.animation = '';
        }, 500);
      });
      return;
    }
    
    if (currentStep === 3 && (!validations.company || !validations.position)) {
      const invalidInputs = document.querySelectorAll('.form-section.active .input-invalid');
      invalidInputs.forEach(input => {
        input.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
          input.style.animation = '';
        }, 500);
      });
      return;
    }
    
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Animation de succès
      if (registerCardRef.current) {
        registerCardRef.current.style.transform = 'scale(1.02)';
        registerCardRef.current.style.boxShadow = '0 20px 40px rgba(34, 197, 94, 0.3)';
        
        setTimeout(() => {
          alert("Inscription réussie! Redirection vers le tableau de bord...");
        }, 500);
      }

    } catch (err) {
      setError("Erreur lors de l'inscription");
      // Animation d'erreur
      if (registerCardRef.current) {
        registerCardRef.current.style.animation = 'shake 0.6s ease-in-out';
        setTimeout(() => {
          registerCardRef.current.style.animation = '';
        }, 600);
      }
    } finally {
      setLoading(false);
    }
  };

  // Calculer la progression
  const progress = ((currentStep - 1) / 3) * 100;

  return (
    <div className="register-page">
      {/* Éléments décoratifs d'arrière-plan */}
      <div className="background-decoration">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
        <div className="floating-shape shape-4"></div>
      </div>

      <div className="register-card" ref={registerCardRef}>
        <div className="register-header">
          <div className="icon-container">
            <FaBriefcase className="main-icon" />
          </div>
          <h2 className="register-title">
            Inscription Recruteur
          </h2>
          <p className="register-subtitle">
            Créez votre compte pour publier des offres d'emploi et recruter les meilleurs candidats
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
              <span className="step-label">Compte</span>
            </div>
            <div className={`step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
              <div className="step-number">
                {currentStep > 2 ? <FaCheckCircle /> : 2}
              </div>
              <span className="step-label">Personnel</span>
            </div>
            <div className={`step ${currentStep >= 3 ? 'active' : ''} ${currentStep > 3 ? 'completed' : ''}`}>
              <div className="step-number">
                {currentStep > 3 ? <FaCheckCircle /> : 3}
              </div>
              <span className="step-label">Entreprise</span>
            </div>
            <div className={`step ${currentStep >= 4 ? 'active' : ''}`}>
              <div className="step-number">4</div>
              <span className="step-label">Finalisation</span>
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
          {/* Étape 1: Informations de compte */}
          <div className={`form-section ${currentStep === 1 ? 'active' : ''}`}>
            <h3 className="section-title">
              <FaLock className="section-icon" />
              Informations de compte
            </h3>
            
            <div className="form-row">
              <div className="input-group">
                <label className="input-label">
                  <FaUser className="input-icon" /> 
                  Nom d'utilisateur *
                  {validations.username && formData.username && <FaCheckCircle className="validation-icon" />}
                </label>
                <div className="input-container">
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    minLength={3}
                    placeholder="Votre nom d'utilisateur"
                    className={`form-input ${!validations.username && formData.username ? 'input-invalid' : ''} ${validations.username && formData.username ? 'input-valid' : ''}`}
                  />
                  <div className="input-border"></div>
                </div>
                {!validations.username && formData.username && (
                  <p className="input-error">Le nom d'utilisateur doit contenir au moins 3 caractères</p>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label className="input-label">
                  <FaEnvelope className="input-icon" /> 
                  Adresse email *
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
                  <div className="input-border"></div>
                </div>
                {!validations.email && formData.email && (
                  <p className="input-error">Veuillez entrer une adresse email valide</p>
                )}
              </div>
            </div>

            <div className="form-row-split">
              <div className="input-group">
                <label className="input-label">
                  <FaLock className="input-icon" /> 
                  Mot de passe *
                  {validations.password && formData.password && <FaCheckCircle className="validation-icon" />}
                </label>
                <div className="input-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    placeholder="••••••••"
                    className={`form-input ${!validations.password && formData.password ? 'input-invalid' : ''} ${validations.password && formData.password ? 'input-valid' : ''}`}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                  <div className="input-border"></div>
                </div>
                {!validations.password && formData.password && (
                  <p className="input-error">Le mot de passe doit contenir au moins 6 caractères</p>
                )}
              </div>

              <div className="input-group">
                <label className="input-label">
                  <FaLock className="input-icon" /> 
                  Confirmer le mot de passe *
                  {validations.confirmPassword && formData.confirmPassword && <FaCheckCircle className="validation-icon" />}
                </label>
                <div className="input-container">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="••••••••"
                    className={`form-input ${!validations.confirmPassword && formData.confirmPassword ? 'input-invalid' : ''} ${validations.confirmPassword && formData.confirmPassword ? 'input-valid' : ''}`}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                  <div className="input-border"></div>
                </div>
                {!validations.confirmPassword && formData.confirmPassword && (
                  <p className="input-error">Les mots de passe ne correspondent pas</p>
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

            <div className="form-row-split">
              <div className="input-group">
                <label className="input-label">
                  <FaUser className="input-icon" /> 
                  Prénom *
                  {validations.firstName && formData.firstName && <FaCheckCircle className="validation-icon" />}
                </label>
                <div className="input-container">
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    placeholder="Votre prénom"
                    className={`form-input ${!validations.firstName && formData.firstName ? 'input-invalid' : ''} ${validations.firstName && formData.firstName ? 'input-valid' : ''}`}
                  />
                  <div className="input-border"></div>
                </div>
                {!validations.firstName && formData.firstName && (
                  <p className="input-error">Le prénom doit contenir au moins 2 caractères</p>
                )}
              </div>

              <div className="input-group">
                <label className="input-label">
                  <FaUser className="input-icon" /> 
                  Nom *
                  {validations.lastName && formData.lastName && <FaCheckCircle className="validation-icon" />}
                </label>
                <div className="input-container">
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    placeholder="Votre nom"
                    className={`form-input ${!validations.lastName && formData.lastName ? 'input-invalid' : ''} ${validations.lastName && formData.lastName ? 'input-valid' : ''}`}
                  />
                  <div className="input-border"></div>
                </div>
                {!validations.lastName && formData.lastName && (
                  <p className="input-error">Le nom doit contenir au moins 2 caractères</p>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label className="input-label">
                  <FaPhone className="input-icon" /> 
                  Numéro de téléphone *
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
                    placeholder="0123456789"
                    className={`form-input ${!validations.phoneNumber && formData.phoneNumber ? 'input-invalid' : ''} ${validations.phoneNumber && formData.phoneNumber ? 'input-valid' : ''}`}
                  />
                  <div className="input-border"></div>
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

          {/* Étape 3: Informations entreprise */}
          <div className={`form-section ${currentStep === 3 ? 'active' : ''}`}>
            <h3 className="section-title">
              <FaBuilding className="section-icon" />
              Informations entreprise
            </h3>

            <div className="form-row">
              <div className="input-group">
                <label className="input-label">
                  <FaBuilding className="input-icon" /> 
                  Nom de l'entreprise *
                  {validations.company && formData.company && <FaCheckCircle className="validation-icon" />}
                </label>
                <div className="input-container">
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    required
                    placeholder="Nom de votre entreprise"
                    className={`form-input ${!validations.company && formData.company ? 'input-invalid' : ''} ${validations.company && formData.company ? 'input-valid' : ''}`}
                  />
                  <div className="input-border"></div>
                </div>
                {!validations.company && formData.company && (
                  <p className="input-error">Le nom de l'entreprise est requis</p>
                )}
              </div>
            </div>

            <div className="form-row-split">
              <div className="input-group">
                <label className="input-label">
                  <FaBriefcase className="input-icon" /> 
                  Votre poste *
                  {validations.position && formData.position && <FaCheckCircle className="validation-icon" />}
                </label>
                <div className="input-container">
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    required
                    placeholder="Votre poste dans l'entreprise"
                    className={`form-input ${!validations.position && formData.position ? 'input-invalid' : ''} ${validations.position && formData.position ? 'input-valid' : ''}`}
                  />
                  <div className="input-border"></div>
                </div>
                {!validations.position && formData.position && (
                  <p className="input-error">Votre poste est requis</p>
                )}
              </div>

              <div className="input-group">
                <label className="input-label">
                  <FaUsers className="input-icon" /> 
                  Taille de l'entreprise
                </label>
                <div className="input-container">
                  <select
                    name="companySize"
                    value={formData.companySize}
                    onChange={handleChange}
                    className="form-input"
                  >
                    <option value="">Sélectionnez</option>
                    <option value="1-10">1-10 employés</option>
                    <option value="11-50">11-50 employés</option>
                    <option value="51-200">51-200 employés</option>
                    <option value="201-500">201-500 employés</option>
                    <option value="500+">500+ employés</option>
                  </select>
                  <div className="input-border"></div>
                </div>
              </div>
            </div>

            <div className="form-row-split">
              <div className="input-group">
                <label className="input-label">
                  <FaIndustry className="input-icon" /> 
                  Secteur d'activité
                </label>
                <div className="input-container">
                  <select
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    className="form-input"
                  >
                    <option value="">Sélectionnez</option>
                    <option value="Informatique">Informatique</option>
                    <option value="Finance">Finance</option>
                    <option value="Marketing">Marketing</option>
                    <option value="RH">Ressources Humaines</option>
                    <option value="Vente">Vente</option>
                    <option value="Autre">Autre</option>
                  </select>
                  <div className="input-border"></div>
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">
                  <FaGlobe className="input-icon" /> 
                  Site web
                </label>
                <div className="input-container">
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://www.exemple.com"
                    className="form-input"
                  />
                  <div className="input-border"></div>
                </div>
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

          {/* Étape 4: Finalisation */}
          <div className={`form-section ${currentStep === 4 ? 'active' : ''}`}>
            <h3 className="section-title">
              <FaEdit className="section-icon" />
              Finalisation du profil
            </h3>

            <div className="form-row-split">
              <div className="input-group">
                <label className="input-label">
                  <FaMapMarkerAlt className="input-icon" /> 
                  Adresse
                </label>
                <div className="input-container">
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Adresse de l'entreprise"
                    className="form-input"
                  />
                  <div className="input-border"></div>
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">
                  <FaMapMarkerAlt className="input-icon" /> 
                  Ville
                </label>
                <div className="input-container">
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Ville"
                    className="form-input"
                  />
                  <div className="input-border"></div>
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label className="input-label">
                  <FaInfoCircle className="input-icon" /> 
                  Description de l'entreprise
                </label>
                <div className="input-container">
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Décrivez votre entreprise et votre activité..."
                    className="form-textarea"
                    rows="4"
                  />
                  <div className="input-border"></div>
                </div>
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
                    "Créer mon compte recruteur"
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
                alert("Redirection vers la page de connexion recruteur");
              }}
              className="login-link"
            >
              Se connecter
            </a>
          </p>
        </div>
      </div>

      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .register-page {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
          padding: 2rem 1rem;
          overflow: hidden;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
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
          background: rgba(255, 255, 255, 0.08);
          animation: float 12s ease-in-out infinite;
        }

        .shape-1 {
          width: 80px;
          height: 80px;
          top: 15%;
          left: 10%;
          animation-delay: 0s;
        }

        .shape-2 {
          width: 120px;
          height: 120px;
          top: 70%;
          right: 15%;
          animation-delay: 3s;
        }

        .shape-3 {
          width: 60px;
          height: 60px;
          bottom: 25%;
          left: 20%;
          animation-delay: 6s;
        }

        .shape-4 {
          width: 100px;
          height: 100px;
          top: 40%;
          right: 25%;
          animation-delay: 9s;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-30px) rotate(180deg);
          }
        }

        .register-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 3rem;
          width: 100%;
          max-width: 600px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          position: relative;
          z-index: 2;
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
        }

        .register-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .icon-container {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2100%);
          border-radius: 50%;
          margin-bottom: 1.5rem;
          border: 3px solid rgba(255, 255, 255, 0.9);
          box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
        }

        .main-icon {
          font-size: 2rem;
          color: white;
        }

        .register-title {
          font-size: 2.2rem;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 0.5rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .register-subtitle {
          color: #718096;
          font-size: 1rem;
          line-height: 1.5;
          max-width: 400px;
          margin: 0 auto;
        }

        .progress-container {
          margin-bottom: 2rem;
        }

        .progress-bar-container {
          width: 100%;
          height: 4px;
          background: #e2e8f0;
          border-radius: 2px;
          margin-bottom: 1.5rem;
          overflow: hidden;
        }

        .progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
          border-radius: 2px;
          transition: width 0.5s ease;
        }

        .steps-indicator {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
          position: relative;
        }

        .step:not(:last-child)::after {
          content: '';
          position: absolute;
          top: 15px;
          left: 60%;
          width: 80%;
          height: 2px;
          background: #e2e8f0;
          z-index: -1;
        }

        .step.completed:not(:last-child)::after {
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        }

        .step-number {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          transition: all 0.3s ease;
          background: #e2e8f0;
          color: #a0aec0;
        }

        .step.active .step-number {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          transform: scale(1.1);
        }

        .step.completed .step-number {
          background: #48bb78;
          color: white;
        }

        .step-label {
          font-size: 0.7rem;
          color: #a0aec0;
          font-weight: 500;
        }

        .step.active .step-label {
          color: #667eea;
          font-weight: 600;
        }

        .step.completed .step-label {
          color: #48bb78;
        }

        .error-message {
          background: linear-gradient(135deg, #feb2b2 0%, #fc8181 100%);
          color: #742a2a;
          padding: 1rem;
          border-radius: 12px;
          margin-bottom: 1.5rem;
          border: 1px solid #fed7d7;
          animation: slideDown 0.3s ease;
        }

        .error-content {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .error-icon {
          font-size: 1.2rem;
        }

        @keyframes slideDown {
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
        }

        .form-section {
          display: none;
          opacity: 0;
          transform: translateY(30px);
        }

        .form-section.active {
          display: block;
          opacity: 1;
          transform: translateY(0);
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 1.3rem;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 1.5rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #e2e8f0;
        }

        .section-icon {
          color: #667eea;
          font-size: 1.1rem;
        }

        .form-row {
          margin-bottom: 1.5rem;
        }

        .form-row-split {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .input-group {
          position: relative;
        }

        .input-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          font-weight: 600;
          color: #4a5568;
          margin-bottom: 0.5rem;
        }

        .input-icon {
          color: #a0aec0;
          font-size: 0.8rem;
        }

        .validation-icon {
          color: #48bb78;
          margin-left: auto;
        }

        .input-container {
          position: relative;
        }

        .form-input, .form-textarea {
          width: 100%;
          padding: 0.875rem 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 0.95rem;
          background: white;
          transition: all 0.3s ease;
          outline: none;
          font-family: inherit;
        }

        .form-input:focus, .form-textarea:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
          transform: translateY(-1px);
        }

        .form-input.input-valid {
          border-color: #48bb78;
          background: rgba(72, 187, 120, 0.05);
        }

        .form-input.input-invalid {
          border-color: #f56565;
          background: rgba(245, 101, 101, 0.05);
        }

        .form-textarea {
          resize: vertical;
          min-height: 100px;
        }

        .password-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #a0aec0;
          cursor: pointer;
          padding: 0.25rem;
          border-radius: 4px;
          font-size: 0.9rem;
          transition: color 0.2s ease;
        }

        .password-toggle:hover {
          color: #667eea;
        }

        .input-border {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
          transition: width 0.3s ease;
        }

        .form-input:focus + .input-border,
        .form-textarea:focus + .input-border {
          width: 100%;
        }

        .input-error {
          color: #e53e3e;
          font-size: 0.8rem;
          margin-top: 0.25rem;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .form-navigation {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid #e2e8f0;
        }

        .prev-button {
          background: #f7fafc;
          color: #4a5568;
          border: 2px solid #e2e8f0;
          padding: 0.875rem 1.5rem;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.9rem;
        }

        .prev-button:hover {
          background: #edf2f7;
          border-color: #cbd5e0;
          transform: translateY(-1px);
        }

        .next-button, .submit-button {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 0.875rem 1.5rem;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.9rem;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex: 1;
          justify-content: center;
          max-width: 250px;
          margin-left: auto;
        }

        .next-button:hover, .submit-button:hover:not(.loading) {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
        }

        .submit-button {
          max-width: none;
          position: relative;
        }

        .button-content {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          z-index: 2;
          position: relative;
        }

        .button-overlay {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s ease;
        }

        .next-button:hover .button-overlay,
        .submit-button:hover:not(.loading) .button-overlay {
          left: 100%;
        }

        .button-icon {
          font-size: 0.8rem;
        }

        .loading-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .submit-button.loading {
          opacity: 0.8;
          cursor: not-allowed;
        }

        .form-footer {
          text-align: center;
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid #e2e8f0;
          font-size: 0.9rem;
          color: #718096;
        }

        .login-link {
          color: #667eea;
          text-decoration: none;
          font-weight: 600;
          margin-left: 0.5rem;
          transition: color 0.2s ease;
        }

        .login-link:hover {
          color: #5a67d8;
          text-decoration: underline;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .register-page {
            padding: 1rem;
          }

          .register-card {
            padding: 2rem 1.5rem;
            border-radius: 16px;
          }

          .register-title {
            font-size: 1.8rem;
          }

          .form-row-split {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .steps-indicator {
            overflow-x: auto;
            padding-bottom: 0.5rem;
          }

          .step {
            min-width: 80px;
          }

          .step-label {
            font-size: 0.65rem;
          }

          .form-navigation {
            flex-direction: column;
          }

          .next-button, .submit-button {
            max-width: none;
            margin-left: 0;
          }

          .floating-shape {
            display: none;
          }
        }

        @media (max-width: 480px) {
          .register-card {
            padding: 1.5rem 1rem;
          }

          .register-title {
            font-size: 1.6rem;
          }

          .register-subtitle {
            font-size: 0.9rem;
          }

          .section-title {
            font-size: 1.1rem;
          }

          .form-input, .form-textarea {
            padding: 0.75rem;
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
}

export default RegisterRecruiter;
