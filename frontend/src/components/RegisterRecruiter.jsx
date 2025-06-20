"use client"
import { useState, useEffect, useRef } from "react"
import {
  User,
  Mail,
  Phone,
  Building,
  Lock,
  MapPin,
  FileText,
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react"
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
})

// Location marker component for the map
function LocationMarker({ position, setPosition, updateFormLocation }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng])
      updateFormLocation(e.latlng.lat, e.latlng.lng)
    },
  })
  return <Marker position={position} />
}

// Move InputField component OUTSIDE of RegisterRecruteur
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
}) => {
  // Determine the actual input type for password fields
  const inputType = showPasswordToggle ? (showPassword ? "text" : "password") : type;

  return (
    <div className={`input-group`}>
      <label htmlFor={name} className="input-label">
        <div className="label-content">
          <Icon className="input-icon" />
          <span className="label-text">{label}</span>
          {required && <span className="required-asterisk">*</span>}
        </div>
      </label>

      <div className="input-container">
        <input
          id={name}
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          readOnly={readOnly}
          className={`form-input`}
        />

        {showPasswordToggle && (
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="password-toggle">
            {showPassword ? <EyeOff className="toggle-icon" /> : <Eye className="toggle-icon" />}
          </button>
        )}

        <div className="input-border" />
      </div>
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
    latitude: 33.57311,
    longitude: -7.589843,
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [position, setPosition] = useState([33.57311, -7.589843])
  
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

  const registerCardRef = useRef(null)

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

  // Function to get address from coordinates
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

  // Update form location data
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
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Perform validation checks before submission
    const currentValidations = {
      username: formData.username.length >= 3,
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email),
      password: formData.password.length >= 6,
      name: formData.name.length >= 3,
      phoneNumber: /^[0-9]{10}$/.test(formData.phoneNumber),
      companyName: formData.companyName.length >= 2,
      address: formData.address.length > 0,
      rc: /^[0-9]+$/.test(formData.rc) && formData.rc.length >= 4,
    }

    setValidations(currentValidations)

    if (!Object.values(currentValidations).every((valid) => valid)) {
      setError("Veuillez remplir correctement tous les champs requis.")
      setLoading(false)
      return
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate success
      console.log("Registration successful:", formData)

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
      })
      setError("Inscription réussie !")
    } catch (err) {
      setError("Erreur lors de l'inscription. Veuillez réessayer.")
    } finally {
      setLoading(false)
    }
  }

  const allFieldsValid = Object.values(validations).every((valid) => valid)

  return (
    <div className="register-page">
      <div className="background-decoration">
        <div className="floating-shape shape-1" />
        <div className="floating-shape shape-2" />
        <div className="floating-shape shape-3" />
        <div className="grid-pattern" />
      </div>

      <div className="register-container">
        <div className="register-card" ref={registerCardRef}>
          {/* Header */}
          <div className="register-header">
            <div className="icon-container">
              <Building className="main-icon" />
            </div>
            <h1 className="register-title">Inscription Recruteur</h1>
            <p className="register-subtitle">Créez votre compte entreprise pour recruter les meilleurs talents</p>
          </div>

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
                />
                <InputField 
                  name="email" 
                  type="email" 
                  placeholder="votre@email.com" 
                  icon={Mail} 
                  label="Email" 
                  value={formData.email} 
                  onChange={handleChange} 
                />
                <InputField 
                  name="phoneNumber" 
                  type="tel" 
                  placeholder="0123456789" 
                  icon={Phone} 
                  label="Téléphone" 
                  value={formData.phoneNumber} 
                  onChange={handleChange} 
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
                />
                <InputField
                  name="rc"
                  placeholder="Numéro de Registre du Commerce"
                  icon={FileText}
                  label="RC (Registre du Commerce)"
                  value={formData.rc} 
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Location Section */}
            <div className="form-section">
              <h3 className="section-title">Localisation de l'entreprise</h3>

              <div className="map-section">
                <div className="map-header">
                  <div className="label-content">
                    <MapPin className="input-icon" />
                    <span className="label-text">Sélectionnez l'emplacement sur la carte</span>
                    <span className="required-asterisk">*</span>
                  </div>
                </div>

                <div className="map-container">
                  <MapContainer center={position} zoom={13} style={{ height: "100%", width: "100%" }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <LocationMarker
                      position={position}
                      setPosition={setPosition}
                      updateFormLocation={updateFormLocation}
                    />
                  </MapContainer>
                </div>

                <p className="map-helper-text">
                  <MapPin className="helper-icon" />
                  Cliquez sur la carte pour sélectionner l'emplacement de votre entreprise
                </p>
              </div>

              {/* Address Input - Now editable */}
              <div className="address-input-section">
                <InputField
                  name="address"
                  placeholder="Adresse (sera remplie automatiquement ou modifiable)"
                  icon={MapPin}
                  label="Adresse complète"
                  readOnly={false}
                  value={formData.address} 
                  onChange={handleChange}
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
                    <span>Inscription en cours...</span>
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
              <a href="/login" className="login-link">
                Se connecter
              </a>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .register-page {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%);
          padding: 2rem 1rem;
          overflow: hidden;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
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
          background-image: linear-gradient(rgba(255, 140, 0, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 140, 0, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
          animation: gridMove 20s linear infinite;
        }

        @keyframes gridMove {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(50px, 50px);
          }
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
          0%,
          100% {
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
          max-width: 900px;
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
          overflow: hidden;
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
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

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
          z-index: -1;
          animation: rotate 3s linear infinite;
        }

        @keyframes rotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
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
        }

        .error-icon {
          width: 1.25rem;
          height: 1.25rem;
          flex-shrink: 0;
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

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .input-label {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-weight: 600;
          color: #374151;
          font-size: 0.9rem;
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
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          color: #1a1a1a;
          font-family: inherit;
          box-sizing: border-box;
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

        .password-toggle {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #6b7280;
          transition: color 0.3s ease;
          padding: 0.25rem;
          border-radius: 4px;
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
        }

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

        .address-input-section {
          margin-top: 0.5rem;
        }

        /* Fix for Leaflet controls */
        :global(.leaflet-control-container .leaflet-top),
        :global(.leaflet-control-container .leaflet-bottom) {
          z-index: 999 !important;
        }

        :global(.leaflet-container) {
          font-family: inherit;
          border-radius: 12px;
        }

        .submit-button {
          width: 100%;
          padding: 1.25rem 2rem;
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
          justify-content: center;
          gap: 0.75rem;
          position: relative;
          z-index: 2;
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
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

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

        @media (max-width: 768px) {
          .register-page {
            padding: 1rem;
          }

          .register-card {
            padding: 2rem 1.5rem;
          }

          .register-title {
            font-size: 2rem;
          }

          .icon-container {
            width: 60px;
            height: 60px;
          }

          .main-icon {
            width: 1.5rem;
            height: 1.5;
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
        }

        .error-icon {
          width: 1.25rem;
          height: 1.25rem;
          flex-shrink: 0;
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

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .input-label {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-weight: 600;
          color: #374151;
          font-size: 0.9rem;
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
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          color: #1a1a1a;
          font-family: inherit;
          box-sizing: border-box;
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

        .password-toggle {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #6b7280;
          transition: color 0.3s ease;
          padding: 0.25rem;
          border-radius: 4px;
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
        }

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

        .address-input-section {
          margin-top: 0.5rem;
        }

        /* Fix for Leaflet controls */
        :global(.leaflet-control-container .leaflet-top),
        :global(.leaflet-control-container .leaflet-bottom) {
          z-index: 999 !important;
        }

        :global(.leaflet-container) {
          font-family: inherit;
          border-radius: 12px;
        }

        .submit-button {
          width: 100%;
          padding: 1.25rem 2rem;
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
          justify-content: center;
          gap: 0.75rem;
          position: relative;
          z-index: 2;
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
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

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

        @media (max-width: 768px) {
          .register-page {
            padding: 1rem;
          }

          .register-card {
            padding: 2rem 1.5rem;
          }

          .register-title {
            font-size: 2rem;
          }

          .icon-container {
            width: 60px;
            height: 60px;
          }

          .main-icon {
            width: 1.5rem;
            height: 1.5rem;
          }

          .form-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .form-section {
            gap: 1rem;
          }

          .register-form {
            gap: 2rem;
          }

          .map-container {
            height: 250px;
          }
        }

        @media (max-width: 480px) {
          .register-card {
            padding: 1.5rem 1rem;
          }

          .register-title {
            font-size: 1.75rem;
          }

          .section-title {
            font-size: 1.1rem;
          }

          .form-input {
            padding: 0.875rem 1rem;
          }

          .submit-button {
            padding: 1rem 1.5rem;
          }

          .map-container {
            height: 200px;
          }
        }
      `}</style>
    </div>
  )
}

export default RegisterRecruteur
