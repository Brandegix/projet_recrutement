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
  const [focusedFields, setFocusedFields] = useState({})
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate success
      console.log("Registration successful:", formData)
      alert("Inscription réussie!")

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
    } catch (err) {
      setError("Erreur lors de l'inscription. Veuillez réessayer.")
    } finally {
      setLoading(false)
    }
  }

  const allFieldsValid = Object.values(validations).every((valid) => valid)

  const InputField = ({
    name,
    type = "text",
    placeholder,
    icon: Icon,
    label,
    required = true,
    showPasswordToggle = false,
  }) => {
    const isValid = validations[name] && formData[name]
    const isInvalid = !validations[name] && formData[name]
    const isFocused = focusedFields[name]

    return (
      <div className={`field-wrapper ${isFocused ? "field-focused" : ""} ${isValid ? "field-valid" : ""}`}>
        <label className="field-label">
          <div className="label-content">
            <Icon className="label-icon" />
            <span className="label-text">{label}</span>
            {required && <span className="required-mark">*</span>}
          </div>
          {isValid && <CheckCircle className="validation-indicator success-indicator" />}
          {isInvalid && <AlertCircle className="validation-indicator error-indicator" />}
        </label>

        <div className="input-wrapper">
          <input
            type={showPasswordToggle && showPassword ? "text" : type}
            name={name}
            value={formData[name]}
            onChange={handleChange}
            onFocus={() => handleFocus(name)}
            onBlur={() => handleBlur(name)}
            required={required}
            placeholder={placeholder}
            className={`text-input ${isValid ? "valid-input" : ""} ${isInvalid ? "invalid-input" : ""}`}
          />

          {showPasswordToggle && (
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="password-visibility-toggle">
              {showPassword ? <EyeOff className="visibility-icon" /> : <Eye className="visibility-icon" />}
            </button>
          )}

          <div className="input-underline" />
        </div>

        {isInvalid && (
          <div className="validation-error-message">
            {name === "email" && "Format d'email invalide"}
            {name === "phoneNumber" && "Le numéro doit contenir 10 chiffres"}
            {name === "password" && "Le mot de passe doit contenir au moins 6 caractères"}
            {name === "rc" && "Le RC doit contenir au moins 4 chiffres"}
            {(name === "name" || name === "username") && "Minimum 3 caractères requis"}
            {name === "companyName" && "Minimum 2 caractères requis"}
            {name === "address" && "Adresse requise"}
          </div>
        )}
      </div>
    )
  }

  const handleMapClick = () => {
    // Simple map interaction simulation
    const newAddress = "123 Avenue Mohammed V, Casablanca, Morocco"
    setFormData(prev => ({
      ...prev,
      address: newAddress
    }))
  }

  return (
    <div className="registration-page">
      {/* Background Elements */}
      <div className="bg-decoration">
        <div className="floating-element element-1" />
        <div className="floating-element element-2" />
        <div className="floating-element element-3" />
        <div className="grid-overlay" />
      </div>

      {/* Main content container */}
      <div className="main-container">
        <div className="registration-card" ref={registerCardRef}>
          {/* Header */}
          <div className="card-header">
            <div className="header-icon-container">
              <Building className="header-icon" />
            </div>
            <h1 className="main-title">Inscription Recruteur</h1>
            <p className="main-subtitle">Créez votre compte entreprise pour recruter les meilleurs talents</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-alert">
              <AlertCircle className="alert-icon" />
              <span>{error}</span>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="registration-form">
            {/* Personal Information Section */}
            <div className="form-section">
              <h3 className="section-heading">Informations Personnelles</h3>
              <div className="fields-grid">
                <InputField name="name" placeholder="Votre nom complet" icon={User} label="Nom complet" />
                <InputField name="email" type="email" placeholder="votre@email.com" icon={Mail} label="Email" />
                <InputField name="phoneNumber" type="tel" placeholder="0123456789" icon={Phone} label="Téléphone" />
              </div>
            </div>

            {/* Company Information Section */}
            <div className="form-section">
              <h3 className="section-heading">Informations Entreprise</h3>
              <div className="fields-grid">
                <InputField
                  name="companyName"
                  placeholder="Nom de votre entreprise"
                  icon={Building}
                  label="Nom de l'entreprise"
                />
                <InputField
                  name="rc"
                  placeholder="Numéro de Registre du Commerce"
                  icon={FileText}
                  label="RC (Registre du Commerce)"
                />
              </div>
            </div>

            {/* Location Section */}
            <div className="form-section">
              <h3 className="section-heading">Localisation de l'entreprise</h3>

              {/* Map Component */}
              <div className="map-section">
                <div className="map-label">
                  <div className="label-content">
                    <MapPin className="label-icon" />
                    <span className="label-text">Sélectionnez l'emplacement sur la carte</span>
                    <span className="required-mark">*</span>
                  </div>
                  {validations.address && formData.address && <CheckCircle className="validation-indicator success-indicator" />}
                </div>

                <div className="map-area" onClick={handleMapClick}>
                  <div className="map-placeholder">
                    <MapPin size={48} className="map-pin-icon" />
                    <p>Cliquez ici pour sélectionner l'emplacement</p>
                    <p className="coordinates-display">
                      Lat: {formData.latitude.toFixed(6)}, Lng: {formData.longitude.toFixed(6)}
                    </p>
                  </div>
                </div>

                <p className="map-help-text">
                  <MapPin className="help-icon" />
                  Cliquez sur la carte pour sélectionner l'emplacement de votre entreprise
                </p>
              </div>

              {/* Address Input */}
              <div className="address-section">
                <InputField
                  name="address"
                  placeholder="Adresse (sera remplie automatiquement)"
                  icon={MapPin}
                  label="Adresse complète"
                />
              </div>
            </div>

            {/* Account Information Section */}
            <div className="form-section">
              <h3 className="section-heading">Informations de Connexion</h3>
              <div className="fields-grid">
                <InputField name="username" placeholder="Votre identifiant" icon={User} label="Nom d'utilisateur" />
                <InputField
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  icon={Lock}
                  label="Mot de passe"
                  showPasswordToggle={true}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !allFieldsValid}
              className={`submit-btn ${loading ? "btn-loading" : ""} ${allFieldsValid ? "btn-ready" : ""}`}
            >
              <div className="btn-content">
                {loading ? (
                  <>
                    <div className="loading-spinner" />
                    <span>Inscription en cours...</span>
                  </>
                ) : (
                  <>
                    <span>S'inscrire</span>
                    <ArrowRight className="btn-arrow" />
                  </>
                )}
              </div>
            </button>
          </form>

          {/* Footer */}
          <div className="card-footer">
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
        /* CSS Reset and Base Styles */
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          border: 0;
          font-size: 100%;
          font: inherit;
          vertical-align: baseline;
          outline: none;
          text-decoration: none;
          list-style: none;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        /* Remove all inherited styles and set defaults */
        input, textarea, select, button {
          all: unset;
          display: block;
          box-sizing: border-box;
          font-family: inherit;
          font-size: inherit;
          line-height: inherit;
          color: inherit;
        }

        a {
          all: unset;
          cursor: pointer;
        }

        button {
          cursor: pointer;
        }

        /* Main Page Layout */
        .registration-page {
          all: unset;
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%);
          padding: 2rem 1rem;
          overflow: hidden;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          font-size: 16px;
          line-height: 1.5;
          color: #1a1a1a;
        }

        /* Background Decorations */
        .bg-decoration {
          all: unset;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
        }

        .floating-element,
        .grid-overlay {
          all: unset;
          pointer-events: none;
          z-index: 0;
        }

        .grid-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: linear-gradient(rgba(255, 140, 0, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 140, 0, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
          animation: gridAnimation 20s linear infinite;
        }

        @keyframes gridAnimation {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }

        .floating-element {
          position: absolute;
          border-radius: 50%;
          background: linear-gradient(45deg, rgba(255, 140, 0, 0.1), rgba(255, 140, 0, 0.05));
          animation: floatAnimation 6s ease-in-out infinite;
        }

        .element-1 {
          width: 100px;
          height: 100px;
          top: 20%;
          left: 10%;
          animation-delay: 0s;
        }

        .element-2 {
          width: 150px;
          height: 150px;
          top: 60%;
          right: 15%;
          animation-delay: 2s;
        }

        .element-3 {
          width: 80px;
          height: 80px;
          bottom: 20%;
          left: 20%;
          animation-delay: 4s;
        }

        @keyframes floatAnimation {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }

        /* Main Container */
        .main-container {
          all: unset;
          position: relative;
          z-index: 100;
          width: 100%;
          max-width: 900px;
        }

        .registration-card {
          all: unset;
          display: block;
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 3rem;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 140, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          z-index: 101;
        }

        .registration-card::before {
          all: unset;
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, transparent, #ff8c00, transparent);
          animation: shimmerAnimation 2s ease-in-out infinite;
          pointer-events: none;
          z-index: -1;
        }

        @keyframes shimmerAnimation {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        /* Header Styles */
        .card-header {
          all: unset;
          display: block;
          text-align: center;
          margin-bottom: 3rem;
          position: relative;
          z-index: 102;
        }

        .header-icon-container {
          all: unset;
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
          z-index: 1;
        }

        .header-icon-container::after {
          all: unset;
          content: "";
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(45deg, #ff8c00, transparent, #ff8c00);
          border-radius: 50%;
          z-index: -1;
          animation: rotateAnimation 3s linear infinite;
          pointer-events: none;
        }

        @keyframes rotateAnimation {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .header-icon {
          all: unset;
          width: 2rem;
          height: 2rem;
          color: white;
        }

        .main-title {
          all: unset;
          display: block;
          font-size: 2.5rem;
          font-weight: 800;
          color: #1a1a1a;
          margin: 0 0 0.5rem 0;
          background: linear-gradient(135deg, #1a1a1a, #333);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .main-subtitle {
          all: unset;
          display: block;
          color: #666;
          font-size: 1.1rem;
          margin: 0;
          max-width: 500px;
          margin: 0 auto;
          line-height: 1.6;
        }

        /* Error Alert */
        .error-alert {
          all: unset;
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
          animation: slideInAnimation 0.3s ease-out;
          position: relative;
          z-index: 102;
        }

        .alert-icon {
          all: unset;
          width: 1.25rem;
          height: 1.25rem;
          flex-shrink: 0;
        }

        @keyframes slideInAnimation {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Form Styles */
        .registration-form {
          all: unset;
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
          position: relative;
          z-index: 103;
        }

        .form-section {
          all: unset;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          position: relative;
          z-index: 1;
        }

        .section-heading {
          all: unset;
          display: block;
          font-size: 1.3rem;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #f3f4f6;
          position: relative;
        }

        .section-heading::after {
          all: unset;
          content: "";
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 60px;
          height: 2px;
          background: linear-gradient(135deg, #ff8c00, #ff6b35);
        }

        .fields-grid {
          all: unset;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        /* Input Field Styles */
        .field-wrapper {
          all: unset;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          z-index: 1;
        }

        .field-wrapper.field-focused {
          transform: translateY(-2px);
        }

        .field-label {
          all: unset;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-weight: 600;
          color: #374151;
          font-size: 0.9rem;
          cursor: pointer;
        }

        .label-content {
          all: unset;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .label-icon {
          all: unset;
          width: 1.1rem;
          height: 1.1rem;
          color: #ff8c00;
        }

        .label-text {
          all: unset;
          font-weight: 600;
        }

        .required-mark {
          all: unset;
          color: #ef4444;
          font-weight: 700;
        }

        .validation-indicator {
          all: unset;
          width: 1.1rem;
          height: 1.1rem;
          pointer-events: none;
        }

        .validation-indicator.success-indicator {
          color: #10b981;
        }

        .validation-indicator.error-indicator {
          color: #ef4444;
        }

        .input-wrapper {
          all: unset;
          position: relative;
          display: block;
          z-index: 1;
        }

        .text-input {
          all: unset;
          display: block;
          width: 100%;
          padding: 1rem 1.25rem;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          color: #1a1a1a;
          font-family: inherit;
          box-sizing: border-box;
          position: relative;
          z-index: 2;
          pointer-events: auto;
          user-select: text;
          -webkit-user-select: text;
          cursor: text;
        }

        .text-input::placeholder {
          color: #9ca3af;
        }

        .text-input:focus {
          border-color: #ff8c00;
          box-shadow: 0 0 0 3px rgba(255, 140, 0, 0.1);
          background: rgba(255, 255, 255, 1);
          z-index: 3;
        }

        .text-input.valid-input {
          border-color: #10b981;
          background: rgba(16, 185, 129, 0.05);
        }

        .text-input.invalid-input {
          border-color: #ef4444;
          background: rgba(239, 68, 68, 0.05);
        }

        .password-visibility-toggle {
          all: unset;
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          cursor: pointer;
          z-index: 3;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          border-radius: 6px;
          transition: background-color 0.2s ease;
          pointer-events: auto;
        }

        .password-visibility-toggle:hover {
          background-color: rgba(255, 140, 0, 0.1);
        }

        .visibility-icon {
          all: unset;
          width: 1.1rem;
          height: 1.1rem;
          color: #6b7280;
        }

        .input-underline {
          all: unset;
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(135deg, #ff8c00, #ff6b35);
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: 1px;
          pointer-events: none;
          z-index: 1;
        }

        .field-wrapper.field-focused .input-underline {
          width: 100%;
        }

        .validation-error-message {
          all: unset;
          display: block;
          font-size: 0.8rem;
          font-weight: 500;
          margin-top: 0.25rem;
          position: relative;
          z-index: 1;
          color: #ef4444;
        }

        /* Map Styles */
        .map-section {
          all: unset;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1rem;
          position: relative;
          z-index: 1;
        }

        .map-label {
          all: unset;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-weight: 600;
          color: #374151;
          font-size: 0.9rem;
          position: relative;
          z-index: 1;
        }

        .map-area {
          all: unset;
          display: flex;
          height: 300px;
          border-radius: 12px;
          overflow: hidden;
          border: 2px solid #e5e7eb;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          cursor: pointer;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f8fafc, #f1f5f9);
          position: relative;
          z-index: 2;
          pointer-events: auto;
        }

        .map-area:hover {
          border-color: #ff8c00;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
        }

        .map-placeholder {
          all: unset;
          display: block;
          text-align: center;
          color: #6b7280;
          position: relative;
          z-index: 1;
        }

        .map-pin-icon {
          all: unset;
          color: #ff8c00;
          margin-bottom: 1rem;
          width: 48px;
          height: 48px;
        }

        .map-placeholder p {
          all: unset;
          display: block;
          margin: 0.5rem 0;
          font-weight: 500;
        }

        .coordinates-display {
          font-size: 0.8rem;
          color: #9ca3af;
          font-family: monospace;
        }

        .map-help-text {
          all: unset;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #6b7280;
          font-size: 0.85rem;
          margin: 0;
          padding: 0.5rem 0;
          position: relative;
          z-index: 1;
        }

        .help-icon {
          all: unset;
          width: 0.9rem;
          height: 0.9rem;
          color: #ff8c00;
        }

        .address-section {
          all: unset;
          display: block;
          margin-top: 0.5rem;
          position: relative;
          z-index: 1;
        }

        /* Submit Button */
        .submit-btn {
          all: unset;
          display: block;
          width: 100%;
          padding: 1.25rem 2rem;
          background: linear-gradient(135deg, #6b7280, #4b5563);
          color: white;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          text-align: center;
          position: relative;
          overflow: hidden;
          will-change: transform, background;
          z-index: 1;
        }

        .submit-btn:not(:disabled):hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        }

        .submit-btn:not(:disabled):active {
          transform: translateY(0px);
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }

        .submit-btn.btn-ready {
          background: linear-gradient(135deg, #ff8c00, #ff6b35);
          animation: pulseEffect 2s infinite;
        }

        .submit-btn:disabled {
          cursor: not-allowed;
          opacity: 0.7;
          background: linear-gradient(135deg, #a0a0a0, #808080);
        }

        .btn-content {
          all: unset;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          position: relative;
          z-index: 2;
        }

        .btn-arrow {
          all: unset;
          width: 1.2rem;
          height: 1.2rem;
          transition: transform 0.2s ease-out;
        }

        .submit-btn:not(:disabled):hover .btn-arrow {
          transform: translateX(5px);
        }

        .btn-loading .loading-spinner {
          all: unset;
          display: inline-block;
          width: 1.25rem;
          height: 1.25rem;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: #fff;
          animation: spin 1s ease-in-out infinite;
          margin-right: 0.5rem;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @keyframes pulseEffect {
          0% { box-shadow: 0 4px 15px rgba(255, 140, 0, 0.3); }
          50% { box-shadow: 0 8px 25px rgba(255, 140, 0, 0.5); }
          100% { box-shadow: 0 4px 15px rgba(255, 140, 0, 0.3); }
        }

        /* Footer Styles */
        .card-footer {
          all: unset;
          display: block;
          text-align: center;
          margin-top: 2.5rem;
          font-size: 0.95rem;
          color: #6b7280;
          position: relative;
          z-index: 104;
        }

        .login-link {
          all: unset;
          color: #ff8c00;
          font-weight: 600;
          margin-left: 0.25rem;
          position: relative;
          z-index: 1;
        }

        .login-link:hover {
          text-decoration: underline;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .registration-card {
            padding: 2rem;
            margin: 1rem;
          }

          .main-title {
            font-size: 2rem;
          }

          .main-subtitle {
            font-size: 1rem;
          }

          .fields-grid {
            grid-template-columns: 1fr; /* Stack fields on smaller screens */
          }
        }

        @media (max-width: 480px) {
          .registration-card {
            padding: 1.5rem;
          }

          .header-icon-container {
            width: 60px;
            height: 60px;
            margin-bottom: 1rem;
          }

          .header-icon {
            width: 1.5rem;
            height: 1.5rem;
          }

          .main-title {
            font-size: 1.8rem;
          }

          .main-subtitle {
            font-size: 0.9rem;
          }

          .form-section {
            gap: 1rem;
          }

          .section-heading {
            font-size: 1.1rem;
          }

          .text-input {
            padding: 0.8rem 1rem;
            font-size: 0.9rem;
          }

          .submit-btn {
            padding: 1rem 1.5rem;
            font-size: 1rem;
          }
;
          .map-area {
            height: 200px;
          }
        }
      `}</style>
    </div>
  )
}

export default RegisterRecruteur;
