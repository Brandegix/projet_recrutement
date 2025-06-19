"use client";

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

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
  const [termsChecked, setTermsChecked] = useState(false); // New state for the checkbox

  const navigate = useNavigate();

  const loginBoxRef = useRef(null);
  const emailInputGroupRef = useRef(null);
  const passwordInputGroupRef = useRef(null);
  const loginButtonRef = useRef(null);

  useEffect(() => {
    const elements = document.querySelectorAll(".login-form > *");
    elements.forEach((el, index) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(30px)";
      setTimeout(() => {
        el.style.transition = "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)";
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }, 150 * index);
    });

    const title = document.querySelector(".form-title");
    if (title) {
      title.style.opacity = "0";
      title.style.transform = "scale(0.8)";
      setTimeout(() => {
        title.style.transition = "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)";
        title.style.opacity = "1";
        title.style.transform = "scale(1)";
      }, 200);
    }
  }, []);

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailValid(emailRegex.test(email));
  }, [email]);

  useEffect(() => {
    setPasswordValid(password.length >= 6);
  }, [password]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (loginButtonRef.current) {
      loginButtonRef.current.style.transform = "scale(0.98)";
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/candidates/login`,
        { email, password },
        { withCredentials: true }
      );

      if (loginBoxRef.current) {
        loginBoxRef.current.style.transform = "scale(1.02)";
        loginBoxRef.current.style.boxShadow = "0 20px 40px rgba(34, 197, 94, 0.3)";

        setTimeout(() => {
          loginBoxRef.current.style.transform = "scale(0.95)";
          loginBoxRef.current.style.opacity = "0.8";
          setTimeout(() => {
            navigate("/JobCardss");
          }, 300);
        }, 500);
      }
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.error || "Email ou mot de passe incorrect";
      setError(message);

      if (loginBoxRef.current) {
        loginBoxRef.current.style.animation = "shake 0.6s ease-in-out";
        loginBoxRef.current.style.boxShadow = "0 10px 30px rgba(239, 68, 68, 0.3)";

        setTimeout(() => {
          loginBoxRef.current.style.animation = "";
          loginBoxRef.current.style.boxShadow = "";
        }, 600);
      }
    } finally {
      setIsLoading(false);
      if (loginButtonRef.current) {
        loginButtonRef.current.style.transform = "scale(1)";
      }
    }
  };

  const handleEmailFocus = () => {
    setEmailFocused(true);
    if (emailInputGroupRef.current) {
      emailInputGroupRef.current.style.transform = "translateY(-2px)";
    }
  };

  const handleEmailBlur = () => {
    setEmailFocused(false);
    if (emailInputGroupRef.current) {
      emailInputGroupRef.current.style.transform = "translateY(0)";
    }
  };

  const handlePasswordFocus = () => {
    setPasswordFocused(true);
    if (passwordInputGroupRef.current) {
      passwordInputGroupRef.current.style.transform = "translateY(-2px)";
    }
  };

  const handlePasswordBlur = () => {
    setPasswordFocused(false);
    if (passwordInputGroupRef.current) {
      passwordInputGroupRef.current.style.transform = "translateY(0)";
    }
  };

  return (
    <>
      
      <div className="login-page">
        <div className="login-container">
          {/* Left Visual Section */}
          <div className="visual-section">
            <div className="visual-content">
              <div className="abstract-pattern">
                <div className="pattern-layer layer-1"></div>
                <div className="pattern-layer layer-2"></div>
                <div className="pattern-layer layer-3"></div>
              </div>
              <div className="visual-text">
                <h1>Welcome Back</h1>
                <p>Access your candidate dashboard and explore new opportunities</p>
              </div>
            </div>
          </div>

          {/* Right Form Section */}
          <div className="form-section js-form-reset">
            <div className="form-container js-form-reset" ref={loginBoxRef}>
              <div className="form-header">
                <h2 className="form-title">Sign In</h2>
              </div>

              <form onSubmit={handleLogin} className="login-form js-login-form-reset">
                
                <div
                  className={`input-group ${emailFocused ? "focused" : ""} ${emailValid && email ? "valid" : ""}`}
                  ref={emailInputGroupRef}
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={handleEmailFocus}
                    onBlur={handleEmailBlur}
                    placeholder="Email address"
                    required
                    className={`form-input ${error ? "error" : ""} ${emailValid && email ? "valid" : ""}`}
                  />
                  
                </div>

                
                <div
                  className={`input-group ${passwordFocused ? "focused" : ""} ${passwordValid && password ? "valid" : ""}`}
                  ref={passwordInputGroupRef}
                >
                  <div className="password-container">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={handlePasswordFocus}
                      onBlur={handlePasswordBlur}
                      placeholder="Password"
                      required
                      className={`form-input ${error ? "error" : ""} ${passwordValid && password ? "valid" : ""}`}
                    />
                    <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                    
                  </div>
                </div>

                {/* Styled "Accept Terms & Conditions" Checkbox */}
                <div className="form-options">
                  <label
                    className="checkbox-container"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      cursor: 'pointer',
                      gap: '10px',
                      fontWeight: 'bold',
                      color: '#6b7280',
                      position: 'relative',
                      fontSize: '0.9rem',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={termsChecked}
                      onChange={() => setTermsChecked(!termsChecked)}
                      style={{
                        position: 'absolute',
                        opacity: 0,
                        cursor: 'pointer',
                        height: 0,
                        width: 0,
                      }}
                    />
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '20px',
                        width: '20px',
                        backgroundColor: termsChecked ? '#ff6b00' : '#fff',
                        border: `2px solid ${termsChecked ? '#ff6b00' : '#ccc'}`,
                        borderRadius: '4px',
                        color: '#fff',
                        transition: 'all 0.2s ease',
                        fontSize: '14px',
                        fontWeight: 'bold',
                      }}
                    >
                      {termsChecked && '✓'}
                    </span>
                    Accept Terms & Conditions
                  </label>
                </div>

                {error && (
                  <div className="error-message">
                    <span className="error-icon">⚠️</span>
                    {error}
                  </div>
                )}

                <button
                  className={`login-button ${isLoading ? "loading" : ""} ${emailValid && passwordValid ? "ready" : ""}`}
                  type="submit"
                  disabled={isLoading}
                  ref={loginButtonRef}
                >
                  {isLoading ? (
                    <>
                      <div className="loading-spinner"></div>
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in
                      <span className="arrow">→</span>
                    </>
                  )}
                </button>

                {/* Moved form footer content here */}
                <div style={{ marginTop: '1rem' }}>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/candidate/request-reset");
                    }}
                    className="forgot-password-link"
                  >
                    Forgot password?
                  </a>
                  <div className="register-link">
                    Don't have an account?
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate("/register/candidat");
                      }}
                      className="register-link-text"
                    >
                      Sign up
                    </a>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .login-page {
          min-height: 100vh;
          background: #000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          overflow-y: auto;
        }

        .login-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          width: 100%;
          max-width: 1200px;
          height: 100vh;
          background: #000;
          overflow: hidden;
        }

        .visual-section {
          background: #000;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow:overflow: hidden;
        }

        .visual-content {
          position: relative;
          z-index: 2;
          text-align: center;
          padding: 2rem;
        }

        .abstract-pattern {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }

        .pattern-layer {
          position: absolute;
          border-radius: 50%;
          background: linear-gradient(135deg, #ff8c00, #ff4400);
          opacity: 0.1;
          animation: float 8s ease-in-out infinite;
        }

        .layer-1 {
          width: 300px;
          height: 300px;
          top: 20%;
          left: 10%;
          animation-delay: 0s;
        }

        .layer-2 {
          width: 200px;
          height: 200px;
          top: 60%;
          right: 20%;
          animation-delay: 2s;
          background: linear-gradient(135deg, #ff4400, #ff8c00);
        }

        .layer-3 {
          width: 150px;
          height: 150px;
          bottom: 30%;
          left: 30%;
          animation-delay: 4s;
          background: linear-gradient(135deg, #ff8c00, #ff6600);
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-30px) scale(1.1);
          }
        }

        .visual-text h1 {
          font-size: 3rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 1rem;
          line-height: 1.2;
        }

        .visual-text p {
          font-size: 1.2rem;
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.6;
          max-width: 400px;
          margin: 0 auto;
        }

        /* Styling for the form section */
        .form-section.js-form-reset {
          background: #fff; /* Ensure a white background for the form area */
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .form-container.js-form-reset {
          width: 100%;
          max-width: 400px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .form-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .form-title {
          font-size: 2rem;
          font-weight: 700;
          color: #000;
          margin: 0;
        }

        /* Reset for .login-form */
        .js-login-form-reset {
          all: initial;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .input-group {
          position: relative;
          transition: all 0.3s ease;
        }

        .form-input {
          width: 100%;
          padding: 1rem 1.25rem;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          font-size: 1rem;
          background: #f9fafb;
          transition: all 0.3s ease;
          box-sizing: border-box;
        }

        .form-input:focus {
          outline: none;
          border-color: #ff8c00;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(255, 140, 0, 0.1);
        }

        .form-input.valid {
          border-color: #10b981;
          background: #fff;
          padding-right: 3rem;
        }

        .form-input.error {
          border-color: #ef4444;
          background: rgba(239, 68, 68, 0.05);
        }

        .password-container {
          position: relative;
          display: flex;
          align-items: center;
        }

        .toggle-password {
          position: absolute;
          right: 1rem;
          cursor: pointer;
          color: #6b7280;
          transition: color 0.3s ease;
          z-index: 2;
          margin-top: -8px;
        }

        .toggle-password:hover {
          color: #ff8c00;
        }

        .validation-icon {
          position: absolute;
          right: 1rem;
          color: #10b981;
          font-size: 1rem;
          z-index: 2;
        }

        .password-container .validation-icon {
          right: 3rem;
        }

        .form-options {
          margin-bottom: 1rem; /* Add some margin below the checkbox */
        }

        .checkbox-container {
          display: flex;
          align-items: center;
          cursor: pointer;
          font-size: 0.9rem;
          color: #6b7280;
          gap: 10px;
          font-weight: bold;
          position: relative;
        }

        .error-message {
          display: flex;
          align-items: center;
          padding: 0.75rem 1rem;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 8px;
          color: #dc2626;
          font-size: 0.9rem;
          animation: slideIn 0.3s ease-out;
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
          padding: 1rem 1.5rem;
          background: #000;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          position: relative;
          overflow: hidden;
        }

        .login-button:hover:not(:disabled) {
          background: #1f1f1f;
          transform: translateY(-1px);
        }

        .login-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .arrow {
          transition: transform 0.3s ease;
        }

        .login-button:hover .arrow {
          transform: translateX(4px);
        }

        .loading-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid #fff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Override form-footer styling for these specific links */
        .form-footer {
          margin-top: 1rem; /* Adjust top margin if needed */
          margin-left: 0; /* Reset left margin */
          text-align: left; /* Align links to the left */
          display: flex;
          flex-direction: column; /* Stack the links vertically */
          gap: 0.5rem; /* Add some space between the links */
        }

        .forgot-password-link {
          color: #6b7280;
          text-decoration: none;
          font-size: 0.9rem;
          transition: color 0.3s ease;
          display: inline-block; /* Ensure it behaves as a block for margin-bottom */
          margin-bottom: 0; /* Reset margin-bottom as it's handled by gap now */
        }

        .forgot-password-link:hover {
          color: #ff8c00;
        }

        .register-link {
          color: #6b7280;
          font-size: 0.9rem;
        }

        .register-link-text {
          color: #ff8c00;
          text-decoration: none;
          font-weight: 600;
          margin-left: 0.25rem;
          transition: color 0.3s ease;
        }

        .register-link-text:hover {
          color: #ff4400;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        @media (max-width: 768px) {
          .login-container {
            grid-template-columns: 1fr;
            grid-template-rows: 40vh 1fr;
          }

          .visual-section {
            padding: 1rem;
          }

          .visual-text h1 {
            font-size: 2rem;
          }

          .visual-text p {
            font-size: 1rem;
          }

          .form-section {
            padding: 1rem;
          }

          .form-container {
            max-width: 100%;
          }
        }

        @media (max-width: 480px) {
          .login-container {
            grid-template-rows: 30vh 1fr;
          }

          .visual-text h1 {
            font-size: 1.5rem;
          }

          .form-title {
            font-size: 1.5rem;
          }
          input.form-input {
            margin-bottom: -20px;
          }
        }
      `}</style>
    </>
  );
}

export default LoginCandidat;
