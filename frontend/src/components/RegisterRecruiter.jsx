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
  const [position, setPosition] = useState([33.57311, -7.589843]) // Default Casablanca
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
    readOnly = false,
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
            readOnly={readOnly}
            className={`form-input ${isValid ? "input-valid" : ""} ${isInvalid ? "input-invalid" : ""}`}
          />

          {showPasswordToggle && (
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="password-toggle">
              {showPassword ? <EyeOff className="toggle-icon" /> : <Eye className="toggle-icon" />}
            </button>
          )}
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

  return (
    <div className="register-page">
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

              <div className="map-section">
                <div className="map-header">
                  <div className="label-content">
                    <MapPin className="input-icon" />
                    <span className="label-text">Sélectionnez l'emplacement sur la carte</span>
                    <span className="required-asterisk">*</span>
                  </div>
                  {validations.address && formData.address && <CheckCircle className="validation-icon success" />}
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
          background: #f0f2f5; /* Light grey background */
          padding: 2rem 1rem;
          font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        .register-container {
          position: relative;
          z-index: 100;
          width: 100%;
          max-width: 900px;
        }

        .register-card {
          background: #ffffff;
          border-radius: 16px;
          padding: 3rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease-in-out;
        }

        .register-card:hover {
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.07);
        }

        .register-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .icon-container {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 70px;
          height: 70px;
          background: linear-gradient(45deg, #007bff, #00c6ff); /* Blue-green gradient */
          border-radius: 50%;
          margin-bottom: 1.25rem;
          box-shadow: 0 8px 20px rgba(0, 123, 255, 0.2);
        }

        .main-icon {
          width: 2rem;
          height: 2rem;
          color: white;
        }

        .register-title {
          font-size: 2.25rem;
          font-weight: 700;
          color: #333333;
          margin: 0 0 0.75rem 0;
        }

        .register-subtitle {
          color: #666666;
          font-size: 1rem;
          margin: 0;
          max-width: 500px;
          margin: 0 auto;
          line-height: 1.5;
        }

        .error-message {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 2rem;
          padding: 1rem 1.25rem;
          background: #ffebeb; /* Light red background */
          border: 1px solid #ffcccc; /* Red border */
          border-radius: 8px;
          color: #cc0000; /* Dark red text */
          font-weight: 500;
          animation: fadeIn 0.3s ease-out;
        }

        .error-icon {
          width: 1.25rem;
          height: 1.25rem;
          flex-shrink: 0;
          color: #cc0000;
        }

        @keyframes fadeIn {
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
          gap: 1.25rem;
        }

        .section-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #333333;
          margin: 0;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid #eeeeee;
          position: relative;
        }

        .section-title::after {
          content: "";
          position: absolute;
          bottom: -1px;
          left: 0;
          width: 40px;
          height: 3px;
          background: linear-gradient(45deg, #007bff, #00c6ff);
          border-radius: 2px;
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
          font-weight: 500;
          color: #555555;
          font-size: 0.9rem;
          margin-bottom: 0.25rem;
        }

        .label-content {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .input-icon {
          width: 1rem;
          height: 1rem;
          color: #007bff; /* Blue accent for icons */
        }

        .label-text {
          font-weight: 600;
        }

        .required-asterisk {
          color: #e74c3c; /* Red for required */
          font-weight: 700;
        }

        .validation-icon {
          width: 1rem;
          height: 1rem;
        }

        .validation-icon.success {
          color: #27ae60; /* Green for success */
        }

        .validation-icon.error {
          color: #e74c3c; /* Red for error */
        }

        .input-container {
          position: relative;
        }

        .form-input {
          width: 100%;
          padding: 0.9rem 1.1rem;
          border: 1px solid #dddddd;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.2s ease-in-out;
          background: #fdfdfd;
          color: #333333;
          font-family: inherit;
          box-sizing: border-box;
        }

        .form-input::placeholder {
          color: #aaaaaa;
        }

        .form-input:focus {
          outline: none;
          border-color: #007bff; /* Accent color on focus */
          box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
          background: #ffffff;
        }

        .form-input.input-valid {
          border-color: #27ae60;
        }

        .form-input.input-invalid {
          border-color: #e74c3c;
        }

        .password-toggle {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #888888;
          transition: color 0.2s ease;
          padding: 0.25rem;
          border-radius: 4px;
        }

        .password-toggle:hover {
          color: #007bff;
        }

        .toggle-icon {
          width: 1rem;
          height: 1rem;
        }

        .validation-message {
          font-size: 0.8rem;
          font-weight: 400;
          margin-top: 0.4rem;
        }

        .validation-message.error {
          color: #e74c3c;
        }

        /* Map styling */
        .map-section {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 0.5rem;
        }

        .map-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-weight: 500;
          color: #555555;
          font-size: 0.9rem;
          margin-bottom: 0.25rem;
        }

        .map-container {
          height: 300px;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid #dddddd;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          transition: all 0.2s ease-in-out;
        }

        .map-container:hover {
          border-color: #007bff;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .map-helper-text {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #777777;
          font-size: 0.85rem;
          margin: 0;
          padding-top: 0.5rem;
        }

        .helper-icon {
          width: 0.9rem;
          height: 0.9rem;
          color: #007bff;
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
          border-radius: 8px;
        }

        .submit-button {
          width: 100%;
          padding: 1rem 1.5rem;
          background: #cccccc; /* Default grey for disabled */
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1.05rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          margin-top: 1.5rem;
          font-family: inherit;
        }

        .submit-button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }

        .submit-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .submit-button.ready {
          background: linear-gradient(45deg, #007bff, #00c6ff); /* Blue-green gradient for active */
          box-shadow: 0 5px 15px rgba(0, 123, 255, 0.2);
        }

        .submit-button.ready:hover:not(:disabled) {
          background: linear-gradient(45deg, #0056b3, #0099cc); /* Darker gradient on hover */
          box-shadow: 0 8px 20px rgba(0, 123, 255, 0.3);
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
          width: 1.1rem;
          height: 1.1rem;
          transition: transform 0.2s ease;
        }

        .submit-button.ready:hover:not(:disabled) .button-icon {
          transform: translateX(3px);
        }

        .loading-spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255, 255, 255, 0.4);
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
          padding-top: 1.5rem;
          border-top: 1px solid #eeeeee;
        }

        .form-footer p {
          color: #777777;
          font-size: 0.9rem;
          margin: 0;
        }

        .login-link {
          color: #007bff;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.2s ease;
          position: relative;
        }

        .login-link:hover {
          color: #0056b3;
          text-decoration: underline;
        }

        @media (max-width: 768px) {
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
            padding: 0.8rem 1rem;
          }

          .submit-button {
            padding: 0.9rem 1.2rem;
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
