"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { FaUser, FaEnvelope, FaPhone, FaBuilding, FaLock, FaCheckCircle, FaMapMarkerAlt } from "react-icons/fa"
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import "../assets/css/Login.css"
import Footer from "../components/Footer"
import Navbar from "../components/Navbara"

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const RegisterRecruteur = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
    email: "",
    phoneNumber: "",
    companyName: "",
    address: "",
    latitude: 33.573110,  // Default Casablanca
    longitude: -7.589843,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [position, setPosition] = useState([33.573110, -7.589843]) // Default Casablanca
  const [validations, setValidations] = useState({
    username: false,
    email: false,
    password: false,
    name: false,
    phoneNumber: false,
    companyName: false,
    address: false,
  })
  const [focusedFields, setFocusedFields] = useState({})

  const navigate = useNavigate()
  const registerCardRef = useRef(null)

  // Location marker component for the map
  function LocationMarker() {
    useMapEvents({
      click(e) {
        setPosition([e.latlng.lat, e.latlng.lng])
        // Update formData with new coordinates
        setFormData(prev => ({
          ...prev,
          latitude: e.latlng.lat,
          longitude: e.latlng.lng
        }))
        // Get address from coordinates
        reverseGeocode(e.latlng.lat, e.latlng.lng)
      },
    })
    return <Marker position={position} />
  }

  // Function to get address from coordinates
  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      )
      const data = await response.json()
      
      if (data && data.display_name) {
        setFormData(prev => ({
          ...prev,
          address: data.display_name
        }))
      }
    } catch (error) {
      console.error("Error reverse geocoding:", error)
    }
  }

  useEffect(() => {
    const elements = document.querySelectorAll(".register-card > *")
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
    const title = document.querySelector(".register-title")
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
    const phoneRegex = /^[0-9]{10}$/

    setValidations({
      username: formData.username.length >= 3,
      email: emailRegex.test(formData.email),
      password: formData.password.length >= 6,
      name: formData.name.length >= 3,
      phoneNumber: phoneRegex.test(formData.phoneNumber),
      companyName: formData.companyName.length >= 2,
      address: formData.address.length > 0,
    })
  }, [formData])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFocus = (fieldName) => {
    setFocusedFields((prev) => ({ ...prev, [fieldName]: true }))
  }

  const handleBlur = (fieldName) => {
    setFocusedFields((prev) => ({ ...prev, [fieldName]: false }))
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Animation de chargement
    if (registerCardRef.current) {
      registerCardRef.current.style.transform = "scale(0.98)"
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/recruiters/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        // Animation de succès
        if (registerCardRef.current) {
          registerCardRef.current.style.transform = "scale(1.02)"
          registerCardRef.current.style.boxShadow = "0 20px 40px rgba(255, 140, 0, 0.3)"

          setTimeout(() => {
            registerCardRef.current.style.transform = "scale(0.95)"
            registerCardRef.current.style.opacity = "0.8"
            setTimeout(() => {
              navigate("/CandidatePagefrom")
            }, 300)
          }, 500)
        }
      } else {
        throw new Error(data.error || "Erreur lors de l'inscription")
      }
    } catch (err) {
      setError(err.message)
      // Animation d'erreur
      if (registerCardRef.current) {
        registerCardRef.current.style.animation = "shake 0.6s ease-in-out"
        registerCardRef.current.style.boxShadow = "0 10px 30px rgba(239, 68, 68, 0.3)"

        setTimeout(() => {
          registerCardRef.current.style.animation = ""
          registerCardRef.current.style.boxShadow = ""
        }, 600)
      }
    } finally {
      setLoading(false)
      if (registerCardRef.current) {
        registerCardRef.current.style.transform = "scale(1)"
      }
    }
  }

  const allFieldsValid = Object.values(validations).every((valid) => valid)

  return (
    <>
      <Navbar />
      <div className="register-page">
        {/* Éléments décoratifs d'arrière-plan */}
        <div className="background-decoration">
          <div className="floating-shape shape-1"></div>
          <div className="floating-shape shape-2"></div>
          <div className="floating-shape shape-3"></div>
          <div className="grid-pattern"></div>
        </div>

        <div className="register-container">
          <div className="register-card" ref={registerCardRef}>
            <div className="register-header">
              <div className="icon-container">
                <FaBuilding className="main-icon" />
              </div>
              <h2 className="register-title">Inscription Recruteur</h2>
              <p className="register-subtitle">Créez votre compte entreprise pour recruter les meilleurs talents</p>
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

            <form onSubmit={handleRegister} className="register-form">
              <div className="form-row">
                <div
                  className={`input-group ${focusedFields.name ? "focused" : ""} ${validations.name && formData.name ? "valid" : ""}`}
                >
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
                      onFocus={() => handleFocus("name")}
                      onBlur={() => handleBlur("name")}
                      required
                      placeholder="Votre nom complet"
                      className={`form-input ${!validations.name && formData.name ? "input-invalid" : ""} ${validations.name && formData.name ? "input-valid" : ""}`}
                    />
                    <div className="input-border"></div>
                  </div>
                </div>
                <div
                  className={`input-group ${focusedFields.email ? "focused" : ""} ${validations.email && formData.email ? "valid" : ""}`}
                >
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
                      onFocus={() => handleFocus("email")}
                      onBlur={() => handleBlur("email")}
                      required
                      placeholder="votre@email.com"
                      className={`form-input ${!validations.email && formData.email ? "input-invalid" : ""} ${validations.email && formData.email ? "input-valid" : ""}`}
                    />
                    <div className="input-border"></div>
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div
                  className={`input-group ${focusedFields.phoneNumber ? "focused" : ""} ${validations.phoneNumber && formData.phoneNumber ? "valid" : ""}`}
                >
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
                      onFocus={() => handleFocus("phoneNumber")}
                      onBlur={() => handleBlur("phoneNumber")}
                      required
                      placeholder="0123456789"
                      className={`form-input ${!validations.phoneNumber && formData.phoneNumber ? "input-invalid" : ""} ${validations.phoneNumber && formData.phoneNumber ? "input-valid" : ""}`}
                    />
                    <div className="input-border"></div>
                  </div>
                </div>
                <div
                  className={`input-group ${focusedFields.companyName ? "focused" : ""} ${validations.companyName && formData.companyName ? "valid" : ""}`}
                >
                  <label className="input-label">
                    <FaBuilding className="input-icon" />
                    Entreprise
                    {validations.companyName && formData.companyName && <FaCheckCircle className="validation-icon" />}
                  </label>
                  <div className="input-container">
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      onFocus={() => handleFocus("companyName")}
                      onBlur={() => handleBlur("companyName")}
                      required
                      placeholder="Nom de votre entreprise"
                      className={`form-input ${!validations.companyName && formData.companyName ? "input-invalid" : ""} ${validations.companyName && formData.companyName ? "input-valid" : ""}`}
                    />
                    <div className="input-border"></div>
                  </div>
                </div>
              </div>

              {/* Map Component */}
              <div className="form-row">
                <div 
                  className={`input-group map-group ${focusedFields.address ? "focused" : ""} ${validations.address && formData.address ? "valid" : ""}`}
                  style={{ gridColumn: "1 / span 2" }}
                >
                  <label className="input-label">
                    <FaMapMarkerAlt className="input-icon" />
                    Localisation
                    {validations.address && formData.address && <FaCheckCircle className="validation-icon" />}
                  </label>
                  <div className="map-container">
                    <MapContainer 
                      center={position} 
                      zoom={13} 
                      style={{ height: "300px", width: "100%" }}
                    >
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      <LocationMarker />
                    </MapContainer>
                  </div>
                  <small className="map-helper-text">
                    Cliquez sur la carte pour sélectionner l'emplacement de votre entreprise
                  </small>
                  <div className="input-container">
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      onFocus={() => handleFocus("address")}
                      onBlur={() => handleBlur("address")}
                      required
                      placeholder="Adresse (cliquez sur la carte)"
                      className={`form-input ${!validations.address && formData.address ? "input-invalid" : ""} ${validations.address && formData.address ? "input-valid" : ""}`}
                    />
                    <div className="input-border"></div>
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div
                  className={`input-group ${focusedFields.username ? "focused" : ""} ${validations.username && formData.username ? "valid" : ""}`}
                >
                  <label className="input-label">
                    <FaUser className="input-icon" />
                    Identifiant
                    {validations.username && formData.username && <FaCheckCircle className="validation-icon" />}
                  </label>
                  <div className="input-container">
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      onFocus={() => handleFocus("username")}
                      onBlur={() => handleBlur("username")}
                      required
                      placeholder="Votre identifiant"
                      className={`form-input ${!validations.username && formData.username ? "input-invalid" : ""} ${validations.username && formData.username ? "input-valid" : ""}`}
                    />
                    <div className="input-border"></div>
                  </div>
                </div>
                <div
                  className={`input-group ${focusedFields.password ? "focused" : ""} ${validations.password && formData.password ? "valid" : ""}`}
                >
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
                      onFocus={() => handleFocus("password")}
                      onBlur={() => handleBlur("password")}
                      required
                      placeholder="••••••••"
                      className={`form-input ${!validations.password && formData.password ? "input-invalid" : ""} ${validations.password && formData.password ? "input-valid" : ""}`}
                    />
                    <div className="input-border"></div>
                  </div>
                </div>
              </div>

              <button
                className={`register-button ${loading ? "loading" : ""} ${allFieldsValid ? "ready" : ""}`}
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
                    <>
                      S'inscrire
                      <svg className="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12,5 19,12 12,19"></polyline>
                      </svg>
                    </>
                  )}
                </span>
                <div className="button-overlay"></div>
              </button>
            </form>

            <div className="form-footer">
              <p>
                Déjà inscrit ?
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    navigate("/LoginRecruteur")
                  }}
                  className="login-link"
                >
                  Se connecter
                </a>
              </p>
            </div>
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

                .register-container {
                    position: relative;
                    z-index: 100;
                    width: 100%;
                    max-width: 800px;
                }

                .register-card {
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

                .register-card::before {
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

                .register-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 
                        0 35px 70px rgba(0, 0, 0, 0.4),
                        0 0 0 1px rgba(255, 140, 0, 0.2);
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

                .register-title {
                    font-size: 2rem;
                    font-weight: 700;
                    color: #1a1a1a;
                    margin: 0 0 0.5rem 0;
                    background: linear-gradient(135deg, #1a1a1a, #333);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .register-subtitle {
                    color: #666;
                    font-size: 1rem;
                    margin: 0;
                    max-width: 500px;
                    margin: 0 auto;
                    line-height: 1.5;
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

                .register-form {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.5rem;
                }

                .input-group {
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
                    background: linear-gradient(135deg, #ff8c00, #ff6b35);
                    transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    border-radius: 1px;
                }

                .input-group.focused .input-border {
                    width: 100%;
                }

                /* Map styling */
                .map-group {
                    margin-bottom: 0.5rem;
                }
                
                .map-container {
                    height: 300px;
                    margin-bottom: 10px;
                    border-radius: 12px;
                    overflow: hidden;
                    border: 2px solid #e5e7eb;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                
                .map-container:hover {
                    border-color: #ff8c00;
                    box-shadow: 0 0 0 3px rgba(255, 140, 0, 0.1);
                }
                
                .map-helper-text {
                    display: block;
                    margin-bottom: 8px;
                    color: #666;
                    font-size: 0.8rem;
                }
                
                /* Fix for Leaflet controls */
                .leaflet-control-container .leaflet-top,
                .leaflet-control-container .leaflet-bottom {
                    z-index: 999 !important;
                }
                
                .leaflet-container {
                    font-family: inherit;
                    border-radius: 12px;
                }

                .register-button {
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
                    margin-top: 1rem;
                }

                .register-button:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
                    background: linear-gradient(135deg, #ff8c00, #ff6b35);
                }

                .register-button:active {
                    transform: translateY(0);
                }

                .register-button:disabled {
                    opacity: 0.8;
                    cursor: not-allowed;
                }

                .register-button.ready {
                    background: linear-gradient(135deg, #ff8c00, #ff6b35);
                }

                .register-button.ready:hover {
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

                .register-button:hover .button-icon {
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

                .register-button:hover .button-overlay {
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
                    color: #666;
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
                    color: #ff6b35;
                }

                .login-link::after {
                    content: '';
                    position: absolute;
                    bottom: -2px;
                    left: 0;
                    width: 0;
                    height: 2px;
                    background: linear-gradient(135deg, #ff8c00, #ff6b35);
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
                    .register-page {
                        padding: 5rem 1rem 3rem 1rem;
                    }
                    
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

                    .form-row {
                        grid-template-columns: 1fr;
                        gap: 1rem;
                    }
                }
            `}</style>
    </>
  )
}

export default RegisterRecruteur