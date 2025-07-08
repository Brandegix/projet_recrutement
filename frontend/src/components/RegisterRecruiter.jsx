"use client"
import { useState, useEffect, useRef } from "react"
import {
  User,
  Mail,
  Phone,
  Building,
  Lock,
  CheckCircle,
  MapPin,
  FileText,
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react"

// API Configuration
// Replace this with your actual backend URL
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000"

// InputField component
const InputField = ({
  name,
  type = "text",
  placeholder,
  icon: Icon,
  label,
  required = true,
  showPasswordToggle = false,
  readOnly = false,
  value,
  onChange,
  showPassword,
  setShowPassword,
  isValid,
  isInvalid,
  isFocused,
  validationMessage,
  onFocus,
  onBlur,
}) => {
  const inputType = showPasswordToggle ? (showPassword ? "text" : "password") : type

  return (
    <div className={`input-group ${isFocused ? "focused" : ""} ${isValid ? "valid" : ""}`}>
      <label htmlFor={name} className="input-label">
        <div className="label-content">
          {Icon && <Icon className="input-icon" />}
          <span className="label-text">{label}</span>
          {required && <span className="required-asterisk">*</span>}
        </div>
        {isValid && <CheckCircle className="validation-icon success" />}
        {isInvalid && <AlertCircle className="validation-icon error" />}
      </label>

      <div className="input-container">
        <input
          id={name}
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          required={required}
          placeholder={placeholder}
          readOnly={readOnly}
          className={`form-input ${isValid ? "input-valid" : ""} ${isInvalid ? "input-invalid" : ""}`}
          style={{ zIndex: 2, position: 'relative' }}
        />

        {showPasswordToggle && (
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="password-toggle">
            {showPassword ? <EyeOff className="toggle-icon" /> : <Eye className="toggle-icon" />}
          </button>
        )}

        <div className="input-border" />
      </div>

      {isInvalid && validationMessage && (
        <div className="validation-message error">
          {validationMessage}
        </div>
      )}
    </div>
  )
}

const RegisterRecruteur = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
    email: "",
    phoneNumber: "",
    companyName: "",
    address: "",
    rc: "",
    latitude: 33.57311, // Default Casablanca latitude
    longitude: -7.589843, // Default Casablanca longitude
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [focusedFields, setFocusedFields] = useState({})
  const [mapPosition, setMapPosition] = useState([33.57311, -7.589843])

  const [validations, setValidations] = useState({
    username: false,
    email: false,
    password: false,
    name: false,
    phoneNumber: false,
    companyName: false,
    address: false,
    rc: false,
  })

  const mapRef = useRef(null)
  const leafletMapInstance = useRef(null)
  const markerInstance = useRef(null)

  // Effect to load Leaflet and initialize the map
  useEffect(() => {
    let map = null;
    let marker = null;

    const loadLeaflet = () => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';
      document.head.appendChild(link);

      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.js';
      script.onload = () => {
        if (window.L) {
          delete window.L.Icon.Default.prototype._getIconUrl;
          window.L.Icon.Default.mergeOptions({
            iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
            iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
            shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
          });
          initializeMap();
        }
      };
      document.body.appendChild(script);
    };

    const initializeMap = () => {
      if (mapRef.current && !leafletMapInstance.current && window.L) {
        map = window.L.map(mapRef.current).setView(mapPosition, 13);
        leafletMapInstance.current = map;

        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        marker = window.L.marker(mapPosition).addTo(map);
        markerInstance.current = marker;

        map.on('click', function(e) {
          const newLat = e.latlng.lat;
          const newLng = e.latlng.lng;
          setMapPosition([newLat, newLng]);
          updateFormLocation(newLat, newLng);
          marker.setLatLng([newLat, newLng]);
        });
      }
    };

    if (typeof window.L === 'undefined') {
      loadLeaflet();
    } else {
      initializeMap();
    }

    return () => {
      if (leafletMapInstance.current) {
        leafletMapInstance.current.remove();
        leafletMapInstance.current = null;
        markerInstance.current = null;
      }
    };
  }, [mapPosition]);

  // Real-time validation
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const phoneRegex = /^[0-9]{10}$/
    const rcRegex = /^[0-9]+$/

    setValidations({
      username: formData.username.length >= 3,
      email: emailRegex.test(formData.email),
      password: formData.password.length >= 6,
      name: formData.name.length >= 3,
      phoneNumber: phoneRegex.test(formData.phoneNumber),
      companyName: formData.companyName.length >= 2,
      address: formData.address.length > 0,
      rc: rcRegex.test(formData.rc) && formData.rc.length >= 4,
    })
  }, [formData])

  // Function to get address from coordinates using Nominatim
  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      )
      const data = await response.json()

      if (data && data.display_name) {
        setFormData((prev) => ({
          ...prev,
          address: data.display_name,
        }))
      }
    } catch (error) {
      console.error("Error reverse geocoding:", error)
    }
  }

  // Update form location data and trigger reverse geocoding
  const updateFormLocation = (lat, lng) => {
    setFormData((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }))
    reverseGeocode(lat, lng)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error when user starts typing
    if (error) setError("")
  }

  const handleFocus = (fieldName) => {
    setFocusedFields((prev) => ({ ...prev, [fieldName]: true }))
  }

  const handleBlur = (fieldName) => {
    setFocusedFields((prev) => ({ ...prev, [fieldName]: false }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    // Check if all fields are valid before submission
    if (!Object.values(validations).every((valid) => valid)) {
      setError("Veuillez remplir correctement tous les champs requis.")
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/recruiters/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          name: formData.name,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          companyName: formData.companyName,
          address: formData.address,
          rc: formData.rc,
          latitude: formData.latitude,
          longitude: formData.longitude,
        }),
      });

      let data;
      try {
        data = await response.json();
      } catch (e) {
        data = {};
      }

      if (response.ok) {
        console.log("📦 Inscription réussie:", data);
        setSuccess(`Inscription réussie ! Bienvenue ${data.username}. Un email de confirmation a été envoyé.`);
        
        // Reset form
        setFormData({
          username: "",
          password: "",
          name: "",
          email: "",
          phoneNumber: "",
          companyName: "",
          address: "",
          rc: "",
          latitude: 33.57311,
          longitude: -7.589843,
        });
        
        // Redirect after 3 seconds
        setTimeout(() => {
          window.location.href = '/CandidatePagefrom';
        }, 3000);
        
      } else {
        // Handle specific error cases
        if (response.status === 409) {
          if (data.error && data.error.includes('Username')) {
            setError('Ce nom d\'utilisateur est déjà pris. Veuillez en choisir un autre.');
          } else if (data.error && data.error.includes('Email')) {
            setError('Cette adresse email est déjà enregistrée. Veuillez utiliser une autre adresse.');
          } else {
            setError(data.error || 'Nom d\'utilisateur ou email déjà utilisé.');
          }
        } else {
          setError(data.error || data.message || 'Erreur lors de l\'inscription. Veuillez réessayer.');
        }
      }
    } catch (err) {
      console.error("Error during registration API call:", err);
      setError('Erreur de connexion au serveur. Veuillez vérifier votre connexion ou réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  }

  const allFieldsValid = Object.values(validations).every((valid) => valid)

  // Function to get validation message for InputField
  const getValidationMessage = (name) => {
    if (validations[name] || focusedFields[name]) return ""

    switch (name) {
      case "email":
        return "Format d'email invalide"
      case "phoneNumber":
        return "Le numéro doit contenir 10 chiffres"
      case "password":
        return "Le mot de passe doit contenir au moins 6 caractères"
      case "rc":
        return "Le RC doit contenir au moins 4 chiffres"
      case "name":
      case "username":
        return "Minimum 3 caractères requis"
      case "companyName":
        return "Minimum 2 caractères requis"
      case "address":
        return "Adresse requise (cliquez sur la carte)"
      default:
        return ""
    }
  }

  return (
    <div className="register-page">
      {/* Background Elements */}
      <div className="background-decoration">
        <div className="floating-shape shape-1" />
        <div className="floating-shape shape-2" />
        <div className="floating-shape shape-3" />
        <div className="grid-pattern" />
      </div>

      <div className="register-container">
        <div className="register-card">
          {/* Header */}
          <div className="register-header">
            <div className="icon-container">
              <Building className="main-icon" />
            </div>
            <h1 className="register-title">Inscription Recruteur</h1>
            <p className="register-subtitle">Créez votre compte entreprise pour recruter les meilleurs talents</p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="success-message">
              <CheckCircle className="success-icon" />
              <span>{success}</span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="error-message">
              <AlertCircle className="error-icon" />
              <span>{error}</span>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="register-form">
            {/* Personal Information Section */}
            <div className="form-section">
              <h3 className="section-title">Informations Personnelles</h3>
              <div className="form-grid">
                <InputField
                  name="name"
                  placeholder="Votre nom complet"
                  icon={User}
                  label="Nom complet"
                  value={formData.name}
                  onChange={handleChange}
                  isValid={validations.name && formData.name.length > 0}
                  isInvalid={!validations.name && formData.name.length > 0 && !focusedFields.name}
                  isFocused={focusedFields.name}
                  onFocus={() => handleFocus("name")}
                  onBlur={() => handleBlur("name")}
                  validationMessage={getValidationMessage("name")}
                />
                <InputField
                  name="email"
                  type="email"
                  placeholder="votre@email.com"
                  icon={Mail}
                  label="Email"
                  value={formData.email}
                  onChange={handleChange}
                  isValid={validations.email && formData.email.length > 0}
                  isInvalid={!validations.email && formData.email.length > 0 && !focusedFields.email}
                  isFocused={focusedFields.email}
                  onFocus={() => handleFocus("email")}
                  onBlur={() => handleBlur("email")}
                  validationMessage={getValidationMessage("email")}
                />
                <InputField
                  name="phoneNumber"
                  type="tel"
                  placeholder="0123456789"
                  icon={Phone}
                  label="Téléphone"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  isValid={validations.phoneNumber && formData.phoneNumber.length > 0}
                  isInvalid={!validations.phoneNumber && formData.phoneNumber.length > 0 && !focusedFields.phoneNumber}
                  isFocused={focusedFields.phoneNumber}
                  onFocus={() => handleFocus("phoneNumber")}
                  onBlur={() => handleBlur("phoneNumber")}
                  validationMessage={getValidationMessage("phoneNumber")}
                />
              </div>
            </div>

            {/* Company Information Section */}
            <div className="form-section">
              <h3 className="section-title">Informations Entreprise</h3>
              <div className="form-grid">
                <InputField
                  name="companyName"
                  placeholder="Nom de votre entreprise"
                  icon={Building}
                  label="Nom de l'entreprise"
                  value={formData.companyName}
                  onChange={handleChange}
                  isValid={validations.companyName && formData.companyName.length > 0}
                  isInvalid={!validations.companyName && formData.companyName.length > 0 && !focusedFields.companyName}
                  isFocused={focusedFields.companyName}
                  onFocus={() => handleFocus("companyName")}
                  onBlur={() => handleBlur("companyName")}
                  validationMessage={getValidationMessage("companyName")}
                />
                <InputField
                  name="rc"
                  placeholder="Numéro de Registre du Commerce"
                  icon={FileText}
                  label="RC (Registre du Commerce)"
                  value={formData.rc}
                  onChange={handleChange}
                  isValid={validations.rc && formData.rc.length > 0}
                  isInvalid={!validations.rc && formData.rc.length > 0 && !focusedFields.rc}
                  isFocused={focusedFields.rc}
                  onFocus={() => handleFocus("rc")}
                  onBlur={() => handleBlur("rc")}
                  validationMessage={getValidationMessage("rc")}
                />
              </div>

              {/* Map Component */}
              <div className="map-section">
                <div className="map-header">
                  <div className="label-content">
                    <MapPin className="input-icon" />
                    <span className="label-text">Localisation de l'entreprise</span>
                    <span className="required-asterisk">*</span>
                  </div>
                  {validations.address && formData.address && <CheckCircle className="validation-icon success" />}
                </div>

                <div className="map-container" ref={mapRef}>
                  {/* Leaflet map will be rendered here */}
                </div>

                <p className="map-helper-text">
                  <MapPin className="helper-icon" />
                  Cliquez sur la carte pour sélectionner l'emplacement de votre entreprise
                </p>

                <InputField
                  name="address"
                  type="text"
                  placeholder="Adresse (sera remplie automatiquement par la carte)"
                  icon={MapPin}
                  label="Adresse complète"
                  required={true}
                  readOnly={true}
                  value={formData.address}
                  onChange={handleChange}
                  isValid={validations.address && formData.address.length > 0}
                  isInvalid={!validations.address && formData.address.length > 0 && !focusedFields.address}
                  isFocused={focusedFields.address}
                  onFocus={() => handleFocus("address")}
                  onBlur={() => handleBlur("address")}
                  validationMessage={getValidationMessage("address")}
                />
              </div>
            </div>

            {/* Account Information Section */}
            <div className="form-section">
              <h3 className="section-title">Informations de Connexion</h3>
              <div className="form-grid">
                <InputField
                  name="username"
                  placeholder="Votre identifiant"
                  icon={User}
                  label="Nom d'utilisateur"
                  value={formData.username}
                  onChange={handleChange}
                  isValid={validations.username && formData.username.length > 0}
                  isInvalid={!validations.username && formData.username.length > 0 && !focusedFields.username}
                  isFocused={focusedFields.username}
                  onFocus={() => handleFocus("username")}
                  onBlur={() => handleBlur("username")}
                  validationMessage={getValidationMessage("username")}
                />
                <InputField
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  icon={Lock}
                  label="Mot de passe"
                  showPasswordToggle={true}
                  value={formData.password}
                  onChange={handleChange}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  isValid={validations.password && formData.password.length > 0}
                  isInvalid={!validations.password && formData.password.length > 0 && !focusedFields.password}
                  isFocused={focusedFields.password}
                  onFocus={() => handleFocus("password")}
                  onBlur={() => handleBlur("password")}
                  validationMessage={getValidationMessage("password")}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !allFieldsValid}
              className={`submit-button ${loading ? "loading" : ""} ${allFieldsValid ? "ready" : ""}`}
            >
              <div className="button-content">
                {loading ? (
                  <>
                    <div className="loading-spinner" />
                    <span>en cours...</span>
                  </>
                ) : (
                  <>
                    <span>S'inscrire</span>
                    <ArrowRight className="button-icon" />
                  </>
                )}
              </div>
            </button>
          </form>

          {/* Footer */}
          <div className="form-footer">
            <p>
              Déjà inscrit ?{" "}
              <a href="/LoginRecruteur" className="login-link">
                Se connecter
              </a>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Using a more robust font-family stack */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

        .register-page {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%);
          padding: 2rem 1rem;
          overflow: hidden;
          font-family: 'Inter', sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          color: #1a1a1a; /* Default text color for the card */
        }

        /* Background elements */
        .background-decoration {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none; /* Crucial: ensures clicks go through to elements below */
          z-index: 1; /* Low z-index to stay behind main content */
        }

        .grid-pattern {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: linear-gradient(rgba(255, 140, 0, 0.1) 1px, transparent 1px),
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
          filter: blur(20px); /* Add blur for softer look */
        }

        .shape-1 { width: 100px; height: 100px; top: 20%; left: 10%; animation-delay: 0s; }
        .shape-2 { width: 150px; height: 150px; top: 60%; right: 15%; animation-delay: 2s; }
        .shape-3 { width: 80px; height: 80px; bottom: 20%; left: 20%; animation-delay: 4s; }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }

        /* Main registration container and card */
        .register-container {
          position: relative;
          z-index: 10; /* Higher than background */
          width: 100%;
          max-width: 900px;
          display: flex; /* Ensure centering within container */
          justify-content: center;
          align-items: center;
        }

        .register-card {
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 3rem;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 140, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden; /* Keep overflow hidden for pseudo-element */
          z-index: 10; /* Ensure card is on top of container's potential children */
          width: 100%; /* Take full width of its container */
        }

        .register-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, transparent, #ff8c00, transparent);
          animation: shimmer 2s ease-in-out infinite;
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        /* Header styles */
        .register-header {
          text-align: center;
          margin-bottom: 3rem;
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
          box-shadow: 0 10px 30px rgba(255, 140, 0, 0.3);
          position: relative;
          z-index: 2; /* Ensure icon is above its pseudo-element */
        }

        .icon-container::after {
          content: "";
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(45deg, #ff8c00, transparent, #ff8c00);
          border-radius: 50%;
          z-index: -1; /* Keep behind icon */
          animation: rotate 3s linear infinite;
        }

        @keyframes rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .main-icon {
          width: 2rem;
          height: 2rem;
          color: white;
        }

        .register-title {
          font-size: 2.5rem;
          font-weight: 800;
          color: #1a1a1a;
          margin: 0 0 0.5rem 0;
          background: linear-gradient(135deg, #1a1a1a, #333);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .register-subtitle {
          color: #666;
          font-size: 1.1rem;
          margin: 0;
          max-width: 500px;
          margin: 0 auto;
          line-height: 1.6;
        }

        /* Error message styles */
        .error-message {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 2rem;
          padding: 1rem 1.25rem;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 12px;
          color: #dc2626;
          font-weight: 500;
          animation: slideIn 0.3s ease-out;
          position: relative; /* Ensure it respects z-index if needed */
          z-index: 15; /* Ensure error message is always visible */
        }

        .error-icon {
          width: 1.25rem;
          height: 1.25rem;
          flex-shrink: 0;
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Form styles */
        .register-form {
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }

        .form-section {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .section-title {
          font-size: 1.3rem;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #f3f4f6;
          position: relative;
        }

        .section-title::after {
          content: "";
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 60px;
          height: 2px;
          background: linear-gradient(135deg, #ff8c00, #ff6b35);
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        /* Input field group styles */
        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative; /* Establish stacking context for elements inside */
          z-index: auto; /* Default auto, but can be set if input fields need to overlap others */
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
          font-size: 0.9rem;
          position: relative; /* Needed for validation icons to float */
          z-index: 2; /* Keep label above border effect */
        }

        .label-content {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .input-icon {
          width: 1.1rem;
          height: 1.1rem;
          color: #ff8c00;
        }

        .label-text {
          font-weight: 600;
        }

        .required-asterisk {
          color: #ef4444;
          font-weight: 700;
        }

        .validation-icon {
          width: 1.1rem;
          height: 1.1rem;
        }

        .validation-icon.success {
          color: #10b981;
        }

        .validation-icon.error {
          color: #ef4444;
        }

        .input-container {
          position: relative; /* Crucial: This makes form-input z-index work within this wrapper */
        }

        .form-input {
          width: 100%;
          padding: 1rem 1.25rem;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          color: #1a1a1a;
          font-family: inherit;
          box-sizing: border-box;
          position: relative; /* Explicitly positioned for z-index */
          z-index: 2; /* Ensures the input field itself is above its border and any other low-level elements */
        }

        .form-input::placeholder {
          color: #9ca3af;
        }

        .form-input:focus {
          outline: none;
          border-color: #ff8c00;
          box-shadow: 0 0 0 3px rgba(255, 140, 0, 0.1);
          background: rgba(255, 255, 255, 1);
        }

        .form-input.input-valid {
          border-color: #10b981;
          background: rgba(16, 185, 129, 0.05);
        }

        .form-input.input-invalid {
          border-color: #ef4444;
          background: rgba(239, 68, 68, 0.05);
        }

        .password-toggle {
          position: absolute;
          right: 1rem;
          top: 50%;
          width : 50px !important;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #6b7280;
          transition: color 0.3s ease;
          padding: 0.25rem;
          border-radius: 4px;
          z-index: 3; /* Ensures the toggle button is on top of the input field */
        }

        .password-toggle:hover {
          color: #ff8c00;
        }

        .toggle-icon {
          width: 1.1rem;
          height: 1.1rem;
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
          z-index: 1; /* Sits below the input field but still positioned */
        }

        .input-group.focused .input-border {
          width: 100%;
        }

        .validation-message {
          font-size: 0.8rem;
          font-weight: 500;
          margin-top: 0.25rem;
        }

        .validation-message.error {
          color: #ef4444;
        }

        /* Map styling */
        .map-section {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .map-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-weight: 600;
          color: #374151;
          font-size: 0.9rem;
        }

        .map-container {
          height: 300px;
          border-radius: 12px;
          overflow: hidden;
          border: 2px solid #e5e7eb;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          position: relative; /* Crucial for z-index of Leaflet internals */
          z-index: 5; /* Mid-level z-index for the map to ensure it's above background but below form elements */
        }

        .map-container:hover {
          border-color: #ff8c00;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
        }

        .map-helper-text {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #6b7280;
          font-size: 0.85rem;
          margin: 0;
          padding: 0.5rem 0;
        }

        .helper-icon {
          width: 0.9rem;
          height: 0.9rem;
          color: #ff8c00;
        }

        /* Global Leaflet CSS overrides - ensure these target the actual Leaflet elements */
        :global(.leaflet-control-container .leaflet-top),
        :global(.leaflet-control-container .leaflet-bottom) {
          z-index: 999 !important; /* Ensure controls are always on top */
        }
        :global(.leaflet-container) {
          font-family: inherit;
          border-radius: 12px;
          /* z-index should be managed by .map-container now */
        }
        /* More specific Leaflet internal z-index adjustments for clickability */
        :global(.leaflet-pane) {
            z-index: 0; /* Base map pane */
        }
        :global(.leaflet-pane > svg),
        :global(.leaflet-pane > canvas) { /* Tile layers, paths */
            z-index: 1;
        }
        :global(.leaflet-marker-pane) { /* Markers */
            z-index: 2;
        }
        :global(.leaflet-tooltip-pane),
        :global(.leaflet-popup-pane) { /* Tooltips and popups */
            z-index: 3;
        }
        :global(.leaflet-control-zoom) { /* Zoom controls */
            z-index: 10; /* Higher z-index for direct user interaction */
        }
        :global(.leaflet-marker-icon) {
            pointer-events: auto; /* Ensure markers are clickable */
        }


        /* Submit button styles */
        .submit-button {
          width: 100%;
         justifyContent: "center", // Add this line
    textAlign: "center", // Add this line
          background: linear-gradient(135deg, #6b7280, #4b5563);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          margin-top: 1rem;
          font-family: inherit;
          z-index: 10; /* Ensure submit button is clickable and on top */
        }

        .submit-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
        }

        .submit-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .submit-button.ready {
          background: linear-gradient(135deg, #ff8c00, #ff6b35);
          box-shadow: 0 10px 30px rgba(255, 140, 0, 0.3);
        }

        .submit-button.ready:hover:not(:disabled) {
          background: linear-gradient(135deg, #ff6b35, #ff8c00);
          box-shadow: 0 15px 35px rgba(255, 140, 0, 0.4);
        }

        .button-content {
          display: flex;
          align-items: center;
          
         justifyContent: "center", // Add this line
    textAlign: "center", // Add this line
          gap: 0.75rem;
          position: relative;
          z-index: 2;
          background: '#ff6b35',
        }

        .button-icon {
          width: 1.25rem;
          height: 1.25rem;
          transition: transform 0.3s ease;
        }

        .submit-button:hover:not(:disabled) .button-icon {
          transform: translateX(3px);
        }

        .loading-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          padding-top:-83px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Footer styles */
        .form-footer {
          text-align: center;
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid #e5e7eb;
        }

        .form-footer p {
          color: #6b7280;
          font-size: 0.95rem;
          margin: 0;
        }

        .login-link {
          color: #ff8c00;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
          position: relative;
        }

        .login-link:hover {
          color: #ff6b35;
        }

        .login-link::after {
          content: "";
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

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .register-page { padding: 1rem; }
          .register-card { padding: 2rem 1.5rem; }
          .register-title { font-size: 2rem; }
          .icon-container { width: 60px; height: 60px; }
          .main-icon { width: 1.5rem; height: 1.5rem; }
          .form-grid { grid-template-columns: 1fr; gap: 1rem; }
          .form-section { gap: 1rem; }
          .register-form { gap: 2rem; }
          .map-container { height: 250px; }
        }

        @media (max-width: 480px) {
          .register-card { padding: 1.5rem 1rem; }
          .register-title { font-size: 1.75rem; }
          .section-title { font-size: 1.1rem; }
          .form-input { padding: 0.875rem 1rem; }
          .submit-button { padding: 1rem 1.5rem; }
          .map-container { height: 200px; }
        }
      `}</style>
    </div>
  )
}

export default RegisterRecruteur
