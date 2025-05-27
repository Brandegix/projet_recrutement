import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../assets/css/Login.css';
import Navbar from "../components/Navbara";
import Footer from "../components/Footer";
import { FaEye, FaEyeSlash, FaUser, FaLock, FaUserGraduate, FaCheckCircle } from 'react-icons/fa';

function LoginCandidat() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [emailValid, setEmailValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  
  const navigate = useNavigate();
  
  // Utiliser useRef au lieu de querySelector pour éviter les erreurs
  const loginBoxRef = useRef(null);
  const emailInputGroupRef = useRef(null);
  const passwordInputGroupRef = useRef(null);
  const loginButtonRef = useRef(null);

  useEffect(() => {
    // Animation d'entrée pour les éléments du formulaire
    const elements = document.querySelectorAll('.login-form > *');
    elements.forEach((el, index) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      setTimeout(() => {
        el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 150 * index);
    });

    // Animation du titre
    const title = document.querySelector('.login-title');
    if (title) {
      title.style.opacity = '0';
      title.style.transform = 'scale(0.8)';
      setTimeout(() => {
        title.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        title.style.opacity = '1';
        title.style.transform = 'scale(1)';
      }, 200);
    }
  }, []);

  // Validation email en temps réel
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailValid(emailRegex.test(email));
  }, [email]);

  // Validation mot de passe en temps réel
  useEffect(() => {
    setPasswordValid(password.length >= 6);
  }, [password]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Animation de chargement
    if (loginButtonRef.current) {
      loginButtonRef.current.style.transform = 'scale(0.98)';
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/candidates/login`,
        { email, password },
        { withCredentials: true }
      );

      // Animation de succès
      if (loginBoxRef.current) {
        loginBoxRef.current.style.transform = 'scale(1.02)';
        loginBoxRef.current.style.boxShadow = '0 20px 40px rgba(34, 197, 94, 0.3)';
        
        setTimeout(() => {
          loginBoxRef.current.style.transform = 'scale(0.95)';
          loginBoxRef.current.style.opacity = '0.8';
          setTimeout(() => {
            navigate("/Offres");
          }, 300);
        }, 500);
      }

    } catch (error) {
      console.error(error);
      const message = error.response?.data?.error || "Email ou mot de passe incorrect";
      setError(message);
      
      // Animation d'erreur améliorée
      if (loginBoxRef.current) {
        loginBoxRef.current.style.animation = 'shake 0.6s ease-in-out';
        loginBoxRef.current.style.boxShadow = '0 10px 30px rgba(239, 68, 68, 0.3)';
        
        setTimeout(() => {
          loginBoxRef.current.style.animation = '';
          loginBoxRef.current.style.boxShadow = '';
        }, 600);
      }
    } finally {
      setIsLoading(false);
      if (loginButtonRef.current) {
        loginButtonRef.current.style.transform = 'scale(1)';
      }
    }
  };

  const handleEmailFocus = () => {
    setEmailFocused(true);
    if (emailInputGroupRef.current) {
      emailInputGroupRef.current.style.transform = 'translateY(-2px)';
    }
  };

  const handleEmailBlur = () => {
    setEmailFocused(false);
    if (emailInputGroupRef.current) {
      emailInputGroupRef.current.style.transform = 'translateY(0)';
    }
  };

  const handlePasswordFocus = () => {
    setPasswordFocused(true);
    if (passwordInputGroupRef.current) {
      passwordInputGroupRef.current.style.transform = 'translateY(-2px)';
    }
  };

  const handlePasswordBlur = () => {
    setPasswordFocused(false);
    if (passwordInputGroupRef.current) {
      passwordInputGroupRef.current.style.transform = 'translateY(0)';
    }
  };

  return (
    <>
      <Navbar />
      <div className="login-page">
        {/* Éléments décoratifs d'arrière-plan */}
        <div className="background-decoration">
          <div className="floating-shape shape-1"></div>
          <div className="floating-shape shape-2"></div>
          <div className="floating-shape shape-3"></div>
        </div>

        <div className="login-box" ref={loginBoxRef}>
          <div className="login-header">
            <div className="icon-container">
              <FaUserGraduate className="main-icon" />
            </div>
            <h2 className="login-title">
              Connexion Candidat
            </h2>
            <p className="login-subtitle">
              Accédez à votre espace candidat
            </p>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            <div 
              className={`input-group ${emailFocused ? 'focused' : ''} ${emailValid && email ? 'valid' : ''}`}
              ref={emailInputGroupRef}
            >
              <label className="input-label">
                <FaUser className="input-icon" /> 
                Email
                {emailValid && email && <FaCheckCircle className="validation-icon" />}
              </label>
              <div className="input-container">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={handleEmailFocus}
                  onBlur={handleEmailBlur}
                  placeholder="votre@email.com"
                  required
                  className={`form-input ${error ? 'error' : ''} ${emailValid && email ? 'valid' : ''}`}
                />
                <div className="input-border"></div>
              </div>
            </div>

            <div 
              className={`input-group ${passwordFocused ? 'focused' : ''} ${passwordValid && password ? 'valid' : ''}`}
              ref={passwordInputGroupRef}
            >
              <label className="input-label">
                <FaLock className="input-icon" /> 
                Mot de passe
                {passwordValid && password && <FaCheckCircle className="validation-icon" />}
              </label>
              <div className="input-container">
                <div className="password-input-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={handlePasswordFocus}
                    onBlur={handlePasswordBlur}
                    placeholder="••••••••"
                    required
                    className={`form-input ${error ? 'error' : ''} ${passwordValid && password ? 'valid' : ''}`}
                  />
                  <span
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                <div className="input-border"></div>
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

            <button 
              className={`login-button ${isLoading ? 'loading' : ''} ${emailValid && passwordValid ? 'ready' : ''}`} 
              type="submit"
              disabled={isLoading}
              ref={loginButtonRef}
            >
              <span className="button-content">
                {isLoading ? (
                  <>
                    <div className="loading-spinner"></div>
                    Connexion en cours...
                  </>
                ) : (
                  'Se connecter'
                )}
              </span>
              <div className="button-overlay"></div>
            </button>

            <div className="form-footer">
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/candidate/request-reset");
                }}
                className="forgot-password-link"
              >
                Mot de passe oublié ?
              </a>
              <div className="register-link">
                Pas encore inscrit ? 
                <a 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/register/candidat");
                  }}
                  className="register-link-text"
                >
                  Créer un compte
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>
      <Footer />

      <style jsx>{`
        .login-page {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #ff8c00 0%, #ff4400 100%);
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

        .login-box {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 3rem 2.5rem;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 450px;
          position: relative;
          z-index: 10;
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .login-box:hover {
          transform: translateY(-5px);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
        }

        .login-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .icon-container {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #ff8c00, #ff4400);
          border-radius: 50%;
          margin-bottom: 1.5rem;
          box-shadow: 0 10px 30px rgba(255, 140, 0, 0.3);
        }

        .main-icon {
          font-size: 2rem;
          color: white;
        }

        .login-title {
          font-size: 2rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 0.5rem 0;
          background: linear-gradient(135deg, #ff8c00, #ff4400);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .login-subtitle {
          color: #6b7280;
          font-size: 1rem;
          margin: 0;
        }

        .input-group {
          margin-bottom: 1.5rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .input-group.focused {
          transform: translateY(-2px);
        }

        .input-label {
          display: flex;
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
          padding: 1rem 1.25rem;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
        }

        .form-input:focus {
          outline: none;
          border-color: #ff8c00;
          box-shadow: 0 0 0 3px rgba(255, 140, 0, 0.1);
          background: rgba(255, 255, 255, 0.95);
        }

        .form-input.valid {
          border-color: #10b981;
          background: rgba(16, 185, 129, 0.05);
        }

        .form-input.error {
          border-color: #ef4444;
          background: rgba(239, 68, 68, 0.05);
        }

        .input-border {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(135deg, #ff8c00, #ff4400);
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .input-group.focused .input-border {
          width: 100%;
        }

        .password-input-container {
          position: relative;
          display: flex;
          align-items: center;
        }

        .toggle-password {
          position: absolute;
          right: 1rem;
          cursor: pointer;
          color: #6b7280;
          transition: all 0.3s ease;
          padding: 0.5rem;
          border-radius: 50%;
        }

        .toggle-password:hover {
          color: #ff8c00;
          background: rgba(255, 140, 0, 0.1);
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

        .login-button {
          width: 100%;
          padding: 1.25rem;
          background: linear-gradient(135deg, #ff8c00, #ff4400);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          margin-bottom: 1.5rem;
        }

        .login-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 15px 35px rgba(255, 140, 0, 0.4);
        }

        .login-button:active {
          transform: translateY(0);
        }

        .login-button:disabled {
          opacity: 0.8;
          cursor: not-allowed;
        }

        .login-button.ready {
          background: linear-gradient(135deg, #ff8c00, #ff4400);
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

        .login-button:hover .button-overlay {
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
        }

        .forgot-password-link {
          color: #ff8c00;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.3s ease;
          position: relative;
          display: inline-block;
          margin-bottom: 1rem;
        }

        .forgot-password-link:hover {
          color: #ff4400;
        }

        .forgot-password-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(135deg, #ff8c00, #ff4400);
          transition: width 0.3s ease;
        }

        .forgot-password-link:hover::after {
          width: 100%;
        }

        .register-link {
          color: #6b7280;
          font-size: 0.9rem;
        }

        .register-link-text {
          color: #ff8c00;
          text-decoration: none;
          font-weight: 600;
          margin-left: 0.5rem;
          transition: all 0.3s ease;
          position: relative;
        }

        .register-link-text:hover {
          color: #ff4400;
        }

        .register-link-text::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(135deg, #ff8c00, #ff4400);
          transition: width 0.3s ease;
        }

        .register-link-text:hover::after {
          width: 100%;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }

        @media (max-width: 768px) {
          .login-box {
            padding: 2rem 1.5rem;
            margin: 1rem;
          }
          
          .login-title {
            font-size: 1.75rem;
          }
          
          .icon-container {
            width: 60px;
            height: 60px;
          }
          
          .main-icon {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </>
  );
}

export default LoginCandidat;