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
      <div className={`input-group ${isFocused ? "focused" : ""} ${isValid ? "valid" : ""}`}>
        <label className="input-label">
          <div className="label-content">
            <Icon className="input-icon" />
            <span className="label-text">{label}</span>
            {required && <span className="required-asterisk">*</span>}
          </div>
          {isValid && <CheckCircle className="validation-icon success" />}
          {isInvalid && <AlertCircle className="validation-icon error" />}
        </label>

        <div className="input-container">
          <input
            type={showPasswordToggle && showPassword ? "text" : type}
            name={name}
            value={formData[name]}
            onChange={handleChange}
            onFocus={() => handleFocus(name)}
            onBlur={() => handleBlur(name)}
            required={required}
            placeholder={placeholder}
            className={`form-inputs ${isValid ? "input-valid" : ""} ${isInvalid ? "input-invalid" : ""}`}
            // Remove inline style pointer-events, user-select, zIndex from here
            // They are better handled in the global CSS to ensure consistency and override
          />

          {showPasswordToggle && (
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="password-toggle">
              {showPassword ? <EyeOff className="toggle-icon" /> : <Eye className="toggle-icon" />}
            </button>
          )}

          <div className="input-border" />
        </div>

        {isInvalid && (
          <div className="validation-message error">
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
    <div className="register-page">
      {/* Background Elements */}
      <div className="background-decoration">
        <div className="floating-shape shape-1" />
        <div className="floating-shape shape-2" />
        <div className="floating-shape shape-3" />
        <div className="grid-pattern" />
      </div>

      {/* Main content container - give it a higher z-index than background */}
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
                <InputField name="name" placeholder="Votre nom complet" icon={User} label="Nom complet" />
                <InputField name="email" type="email" placeholder="votre@email.com" icon={Mail} label="Email" />
                <InputField name="phoneNumber" type="tel" placeholder="0123456789" icon={Phone} label="Téléphone" />
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
              <h3 className="section-title">Localisation de l'entreprise</h3>

              {/* Map Component */}
              <div className="map-section">
                <div className="map-header">
                  <div className="label-content">
                    <MapPin className="input-icon" />
                    <span className="label-text">Sélectionnez l'emplacement sur la carte</span>
                    <span className="required-asterisk">*</span>
                  </div>
                  {validations.address && formData.address && <CheckCircle className="validation-icon success" />}
                </div>

                <div className="map-container" onClick={handleMapClick}>
                  <div className="map-placeholder">
                    <MapPin size={48} className="map-icon" />
                    <p>Cliquez ici pour sélectionner l'emplacement</p>
                    <p className="map-coordinates">
                      Lat: {formData.latitude.toFixed(6)}, Lng: {formData.longitude.toFixed(6)}
                    </p>
                  </div>
                </div>

                <p className="map-helper-text">
                  <MapPin className="helper-icon" />
                  Cliquez sur la carte pour sélectionner l'emplacement de votre entreprise
                </p>
              </div>

              {/* Address Input */}
              <div className="address-input-section">
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
              <h3 className="section-title">Informations de Connexion</h3>
              <div className="form-grid">
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

        /* Essential: Ensure background elements do not interfere with interaction */
        .background-decoration {
          position: fixed; /* Use fixed for full viewport coverage */
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          /* IMPORTANT: These two properties are crucial */
          pointer-events: none; /* Allows clicks to pass through */
          z-index: 0; /* Ensures it's behind everything else */
        }

        .floating-shape,
        .grid-pattern {
          pointer-events: none; /* Redundant but good for explicit safety */
          z-index: 0; /* Ensures it's behind everything else */
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
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }

        /* Ensure content container is above background */
        .register-container {
          position: relative;
          z-index: 10; /* Higher than background (0) */
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
          z-index: 11; /* Higher than register-container (10) */
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
          pointer-events: none; /* Prevent interference */
          z-index: -1; /* Ensure it's behind card content */
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .register-header {
          text-align: center;
          margin-bottom: 3rem;
          position: relative; /* Ensure it establishes its own stacking context */
          z-index: 12;
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
          z-index: 1; /* Stacking context for its pseudo-element */
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
          z-index: -1; /* Behind the icon itself */
          animation: rotate 3s linear infinite;
          pointer-events: none; /* Crucial for background effects */
        }

        @keyframes rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
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
          position: relative; /* Ensure it's part of the main stacking context */
          z-index: 12;
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

        /* The form and its interactive elements */
        .register-form {
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
          position: relative;
          z-index: 15; /* Crucial: This z-index should be higher than all non-interactive elements */
        }

        .form-section {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          position: relative;
          z-index: 1; /* Within the form's stacking context */
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
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          z-index: 1; /* Each input group should have a stacking context */
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
          pointer-events: none; /* Ensure icons don't block input */
        }

        .validation-icon.success {
          color: #10b981;
        }

        .validation-icon.error {
          color: #ef4444;
        }

        .input-container {
          position: relative;
          /* isolation: isolate; */ /* Not always needed but can help create new stacking context */
          z-index: 1; /* Ensures input and its children are on top within this group */
        }

        /* THIS IS THE MOST CRITICAL PART: Ensure all interactive form elements are fully clickable */
        .form-inputs {
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
          position: relative; /* Essential for z-index to work */
          z-index: 2; /* Higher than input-border, but within input-container's stacking context */
          pointer-events: auto; /* Explicitly allow pointer events */
          user-select: text; /* Allow text selection */
          -webkit-user-select: text;
          cursor: text; /* Show text cursor */
        }

        .form-input::placeholder {
          color: #9ca3af;
        }

        .form-input:focus {
          outline: none;
          border-color: #ff8c00;
          box-shadow: 0 0 0 3px rgba(255, 140, 0, 0.1);
          background: rgba(255, 255, 255, 1);
          z-index: 3; /* Even higher when focused */
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
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          z-index: 3; /* Ensure it's above the input field */
          display: flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          border-radius: 6px;
          transition: background-color 0.2s ease;
          pointer-events: auto; /* Allow interaction */
        }

        .password-toggle:hover {
          background-color: rgba(255, 140, 0, 0.1);
        }

        .toggle-icon {
          width: 1.1rem;
          height: 1.1rem;
          color: #6b7280;
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
          pointer-events: none; /* Does not need to be clickable */
          z-index: 1; /* Below the input field */
        }

        .input-group.focused .input-border {
          width: 100%;
        }

        .validation-message {
          font-size: 0.8rem;
          font-weight: 500;
          margin-top: 0.25rem;
          position: relative; /* Ensure it's part of the stacking context */
          z-index: 1;
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
          position: relative;
          z-index: 1;
        }

        .map-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-weight: 600;
          color: #374151;
          font-size: 0.9rem;
          position: relative;
          z-index: 1;
        }

        .map-container {
          height: 300px;
          border-radius: 12px;
          overflow: hidden;
          border: 2px solid #e5e7eb;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f8fafc, #f1f5f9);
          position: relative;
          z-index: 2; /* Higher than map-header */
          pointer-events: auto; /* Explicitly allow clicks */
        }

        .map-container:hover {
          border-color: #ff8c00;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
        }

        .map-placeholder {
          text-align: center;
          color: #6b7280;
          position: relative;
          z-index: 1; /* Ensure text/icons are visible */
        }

        .map-icon {
          color: #ff8c00;
          margin-bottom: 1rem;
        }

        .map-placeholder p {
          margin: 0.5rem 0;
          font-weight: 500;
        }

        .map-coordinates {
          font-size: 0.8rem;
          color: #9ca3af;
          font-family: monospace;
        }

        .map-helper-text {
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

        .helper-icon {
          width: 0.9rem;
          height: 0.9rem;
          color: #ff8c00;
        }

        .address-input-section {
          margin-top: 0.5rem;
          position: relative;
          z-index: 1;
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
          z-index: 1; /* Relative to the form, but still interactive */
          pointer-events: auto; /* Explicitly allow clicks */
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
          z-index: 2; /* Ensures content is above potential button effects */
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
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .form-footer {
          text-align: center;
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid #e5e7eb;
          position: relative;
          z-index: 1;
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
          z-index: 1; /* Ensure link is clickable */
          pointer-events: auto;
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
          background: linear-gradient(90deg, transparent, #ff8c00, transparent);
          animation: shimmer 2s ease-in-out infinite;
          pointer-events: none; /* Should not block link */
        }

        /* --- Consolidated Z-index and Pointer Events Fixes --- */

        /* 1. Reset base pointer-events for all elements to auto where needed */
        /* This rule targets common interactive elements */
        input, textarea, select, button, a {
          pointer-events: auto;
        }

        /* 2. Ensure all background/decorative elements have pointer-events: none and a low z-index */
        .background-decoration,
        .floating-shape,
        .grid-pattern,
        .register-card::before, /* Shimmer on top of card */
        .icon-container::after, /* Rotating border around icon */
        .input-border, /* Underline animation */
        .validation-icon, /* Check/Alert icons */
        .login-link::after /* Shimmer under login link */
        {
          pointer-events: none;
          z-index: -1; /* Place them safely behind all content */
        }

        /* 3. Establish clear stacking contexts and higher z-index for main content */

        /* The overall container for the interactive card */
        .register-container {
          z-index: 100; /* A high base z-index for the entire card wrapper */
          position: relative; /* Crucial for z-index to work */
        }

        /* The card itself */
        .register-card {
          z-index: 101; /* Slightly higher than its container */
          position: relative; /* Crucial for z-index to work */
        }

        /* The form and all its contents should be above the card's background/decorations */
        .register-form {
          z-index: 102; /* Ensures the form is on top of the card's base elements */
          position: relative; /* Establishes a stacking context for its children */
        }

        /* Input fields and their direct containers (including password toggle) */
        .input-container {
          position: relative; /* Creates stacking context for input and toggle */
          z-index: 1; /* Relative to its parent .input-group */
        }

        .form-input {
          z-index: 2; /* Above input-border within .input-container */
        }

        .password-toggle {
          z-index: 3; /* Above form-input within .input-container */
        }

        .submit-button {
          z-index: 103; /* Make sure the button is always clickable and on top */
          position: relative;
        }

        /* Elements that might have pseudo-elements or specific animations */
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
          /* pointer-events: none; is already on the element via .floating-shape */
        }

        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
          /* pointer-events: none; is already on the element via .grid-pattern */
        }

        /* Remove the problematic inline styles from InputField component */
        /* style={{
          zIndex: 1000,
          position: 'relative',
          pointerEvents: 'auto',
          userSelect: 'text',
          WebkitUserSelect: 'text',
          cursor: 'text'
        }} */
        /* These properties are now handled universally in the CSS block */

      `}</style>
    </div>
  )
}

export default RegisterRecruteur;
