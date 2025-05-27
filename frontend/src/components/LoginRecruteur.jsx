"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { FaBuilding } from "react-icons/fa"
import "../assets/css/Login.css"
import Navbar from "../components/Navbara"
import Footer from "../components/Footer"

function LoginRecruteur() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [emailFocused, setEmailFocused] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)
  const [emailValid, setEmailValid] = useState(false)
  const [passwordValid, setPasswordValid] = useState(false)

  const navigate = useNavigate()
  const loginBoxRef = useRef(null)
  const formRef = useRef(null)

  useEffect(() => {
    // Animation d'entrée
    const elements = document.querySelectorAll(".login-form > *")
    elements.forEach((el, index) => {
      el.style.opacity = "0"
      el.style.transform = "translateY(30px)"
      setTimeout(() => {
        el.style.transition = "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)"
        el.style.opacity = "1"
        el.style.transform = "translateY(0)"
      }, 150 * index)
    })

    // Animation du titre
    const title = document.querySelector(".login-title")
    if (title) {
      title.style.opacity = "0"
      title.style.transform = "scale(0.8)"
      setTimeout(() => {
        title.style.transition = "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)"
        title.style.opacity = "1"
        title.style.transform = "scale(1)"
      }, 200)
    }
  }, [])

  // Validation en temps réel
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    setEmailValid(emailRegex.test(email))
  }, [email])

  useEffect(() => {
    setPasswordValid(password.length >= 6)
  }, [password])

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Animation de chargement
    if (loginBoxRef.current) {
      loginBoxRef.current.style.transform = "scale(0.98)"
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/recruiters/login`,
        { email, password },
        { withCredentials: true },
      )

      // Animation de succès
      if (loginBoxRef.current) {
        loginBoxRef.current.style.transform = "scale(1.02)"
        loginBoxRef.current.style.boxShadow = "0 20px 40px rgba(255, 140, 0, 0.3)"

        setTimeout(() => {
          loginBoxRef.current.style.transform = "scale(0.95)"
          loginBoxRef.current.style.opacity = "0.8"
          setTimeout(() => {
            const userType = response.data.user_type
            if (userType === "admin") {
              navigate("/Dashboard_admin")
            } else {
              navigate("/RecruiterJobOffers")
            }
          }, 300)
        }, 500)
      }
    } catch (error) {
      console.error(error)
      const message = error.response?.data?.error || "Email ou mot de passe incorrect"
      setError(message)

      // Animation d'erreur
      if (loginBoxRef.current) {
        loginBoxRef.current.style.animation = "shake 0.6s ease-in-out"
        loginBoxRef.current.style.boxShadow = "0 10px 30px rgba(239, 68, 68, 0.3)"

        setTimeout(() => {
          loginBoxRef.current.style.animation = ""
          loginBoxRef.current.style.boxShadow = ""
        }, 600)
      }
    } finally {
      setIsLoading(false)
      if (loginBoxRef.current) {
        loginBoxRef.current.style.transform = "scale(1)"
      }
    }
  }

  const handleEmailFocus = () => {
    setEmailFocused(true)
  }

  const handleEmailBlur = () => {
    setEmailFocused(false)
  }

  const handlePasswordFocus = () => {
    setPasswordFocused(true)
  }

  const handlePasswordBlur = () => {
    setPasswordFocused(false)
  }

  return (
    <>
      <Navbar />
      <div className="login-page">
        {/* Éléments décoratifs d'arrière-plan */}
        <div className="background-decoration">
          <div className="floating-shape shape-1"></div>
          <div className="floating-shape shape-2"></div>
          <div className="floating-shape shape-3"></div>
          <div className="grid-pattern"></div>
        </div>

        <div className="login-container">
          <div className="login-box" ref={loginBoxRef}>
            <div className="login-header">
              <div className="icon-container">
                <FaBuilding className="main-icon" />
              </div>
              <h2 className="login-title">Connexion Recruteur</h2>
              <p className="login-subtitle">Accédez à votre espace recruteur</p>
            </div>

            <form onSubmit={handleLogin} className="login-form" ref={formRef}>
              <div className={`input-group ${emailFocused ? "focused" : ""} ${emailValid && email ? "valid" : ""}`}>
                <label className="input-label">
                  <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  Email
                  {emailValid && email && (
                    <svg className="validation-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <polyline points="20,6 9,17 4,12"></polyline>
                    </svg>
                  )}
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
                    className={`form-input ${error ? "error" : ""} ${emailValid && email ? "valid" : ""}`}
                  />
                  <div className="input-border"></div>
                </div>
              </div>

              <div
                className={`input-group ${passwordFocused ? "focused" : ""} ${passwordValid && password ? "valid" : ""}`}
              >
                <label className="input-label">
                  <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <circle cx="12" cy="16" r="1"></circle>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  Mot de passe
                  {passwordValid && password && (
                    <svg className="validation-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <polyline points="20,6 9,17 4,12"></polyline>
                    </svg>
                  )}
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
                      className={`form-input ${error ? "error" : ""} ${passwordValid && password ? "valid" : ""}`}
                    />
                    <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                          <line x1="1" y1="1" x2="23" y2="23"></line>
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      )}
                    </button>
                  </div>
                  <div className="input-border"></div>
                </div>
              </div>

              {error && (
                <div className="error-message">
                  <div className="error-content">
                    <svg className="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="15" y1="9" x2="9" y2="15"></line>
                      <line x1="9" y1="9" x2="15" y2="15"></line>
                    </svg>
                    {error}
                  </div>
                </div>
              )}

              <button
                className={`login-button ${isLoading ? "loading" : ""} ${emailValid && passwordValid ? "ready" : ""}`}
                type="submit"
                disabled={isLoading}
              >
                <span className="button-content">
                  {isLoading ? (
                    <>
                      <div className="loading-spinner"></div>
                      Connexion en cours...
                    </>
                  ) : (
                    <>
                      Se connecter
                      <svg className="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12,5 19,12 12,19"></polyline>
                      </svg>
                    </>
                  )}
                </span>
                <div className="button-overlay"></div>
              </button>

              <div className="form-footer">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    navigate("/recruiter/request-reset")
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
                      e.preventDefault()
                      navigate("/register/recruteur")
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
      </div>
      <Footer />

      <style jsx>{`
        .login-page {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0a0a0a;
          padding: 6rem 1rem 4rem 1rem;
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

        .grid-pattern {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            linear-gradient(rgba(255, 140, 0, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 140, 0, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
          animation: gridMove 20s linear infinite;
        }

        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }

        .floating-shape {
          position: absolute;
          border-radius: 50%;
          background: linear-gradient(45deg, rgba(255, 140, 0, 0.1), rgba(255, 140, 0, 0.05));
          animation: float 6s ease-in-out infinite;
        }

        .shape-1 {
          width: 100px;
          height: 100px;
          top: 20%;
          left: 10%;
          animation-delay: 0s;
        }

        .shape-2 {
          width: 150px;
          height: 150px;
          top: 60%;
          right: 15%;
          animation-delay: 2s;
        }

        .shape-3 {
          width: 80px;
          height: 80px;
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

        .login-container {
          position: relative;
          z-index: 100;
          width: 100%;
          max-width: 450px;
        }

        .login-box {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 3rem 2.5rem;
          box-shadow: 
            0 25px 50px rgba(0, 0, 0, 0.3),
            0 0 0 1px rgba(255, 140, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .login-box::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #ff8c00, transparent);
          animation: shimmer 2s ease-in-out infinite;
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .login-box:hover {
          transform: translateY(-5px);
          box-shadow: 
            0 35px 70px rgba(0, 0, 0, 0.4),
            0 0 0 1px rgba(255, 140, 0, 0.2);
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
          background: linear-gradient(135deg, #ff8c00, #ff6b35);
          border-radius: 50%;
          margin-bottom: 1.5rem;
          box-shadow: 
            0 10px 30px rgba(255, 140, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
          position: relative;
        }

        .icon-container::after {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(45deg, #ff8c00, transparent, #ff8c00);
          border-radius: 50%;
          z-index: -1;
          animation: rotate 3s linear infinite;
        }

        @keyframes rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .main-icon {
          font-size: 2rem;
          color: white;
        }

        .login-title {
          font-size: 2rem;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 0.5rem 0;
          background: linear-gradient(135deg, #1a1a1a, #333);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .login-subtitle {
          color: #666;
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
          color: #333;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
        }

        .input-icon {
          width: 1rem;
          height: 1rem;
          margin-right: 0.5rem;
          color: #ff8c00;
          stroke-width: 2;
        }

        .validation-icon {
          width: 1rem;
          height: 1rem;
          color: #10b981;
          stroke-width: 2;
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
          color: #1a1a1a;
        }

        .form-input::placeholder {
          color: #999;
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
          background: linear-gradient(135deg, #ff8c00, #ff6b35);
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: 1px;
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
          background: none;
          border: none;
          cursor: pointer;
          color: #666;
          transition: all 0.3s ease;
          padding: 0.5rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .toggle-password:hover {
          color: #ff8c00;
          background: rgba(255, 140, 0, 0.1);
        }

        .toggle-password svg {
          width: 1.25rem;
          height: 1.25rem;
          stroke-width: 2;
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
          width: 1rem;
          height: 1rem;
          margin-right: 0.5rem;
          stroke-width: 2;
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
          background: linear-gradient(135deg, #1a1a1a, #333);
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
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
          background: linear-gradient(135deg, #ff8c00, #ff6b35);
        }

        .login-button:active {
          transform: translateY(0);
        }

        .login-button:disabled {
          opacity: 0.8;
          cursor: not-allowed;
        }

        .login-button.ready {
          background: linear-gradient(135deg, #ff8c00, #ff6b35);
        }

        .login-button.ready:hover {
          background: linear-gradient(135deg, #ff6b35, #ff8c00);
        }

        .button-content {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .button-icon {
          width: 1.25rem;
          height: 1.25rem;
          margin-left: 0.5rem;
          transition: transform 0.3s ease;
          stroke-width: 2;
        }

        .login-button:hover .button-icon {
          transform: translateX(3px);
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
          color: #ff6b35;
        }

        .forgot-password-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(135deg, #ff8c00, #ff6b35);
          transition: width 0.3s ease;
        }

        .forgot-password-link:hover::after {
          width: 100%;
        }

        .register-link {
          color: #666;
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
          color: #ff6b35;
        }

        .register-link-text::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(135deg, #ff8c00, #ff6b35);
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
          .login-page {
            padding: 5rem 1rem 3rem 1rem;
          }
          
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
  )
}

export default LoginRecruteur
