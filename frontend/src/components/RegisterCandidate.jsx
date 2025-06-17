"use client"

import { useState, useEffect, useRef } from "react"
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaCheckCircle,
  FaUserGraduate,
  FaArrowRight,
  FaArrowLeft,
  FaInfoCircle,
  FaGraduationCap,
  FaPlus,
  FaTrash,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa"

function RegisterCandidate() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
    phoneNumber: "",
    skills: [],
  })

  const [skills, setSkills] = useState([{ name: "", level: 0 }])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [currentStep, setCurrentStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [focusedField, setFocusedField] = useState("")
  const [validations, setValidations] = useState({
    username: false,
    email: false,
    password: false,
    name: false,
    phoneNumber: false,
  })

  const registerCardRef = useRef(null)

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
    })
  }, [formData])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSkillChange = (index, field, value) => {
    const updatedSkills = [...skills]
    updatedSkills[index][field] = field === "level" ? Number.parseInt(value) || 0 : value
    setSkills(updatedSkills)
  }

  const addSkill = () => {
    setSkills([...skills, { name: "", level: 0 }])
  }

  const removeSkill = (index) => {
    if (skills.length > 1) {
      const updatedSkills = [...skills]
      updatedSkills.splice(index, 1)
      setSkills(updatedSkills)
    }
  }

  const nextStep = () => {
    if (currentStep === 1 && (!validations.username || !validations.email || !validations.password)) {
      setError("Veuillez remplir correctement tous les champs requis")
      return
    }

    if (currentStep === 2 && (!validations.name || !validations.phoneNumber)) {
      setError("Veuillez remplir correctement tous les champs requis")
      return
    }

    setError("")
    setCurrentStep((prev) => prev + 1)
  }

  const prevStep = () => {
    setError("")
    setCurrentStep((prev) => prev - 1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const hasEmptySkills = skills.some((skill) => !skill.name.trim())
    if (hasEmptySkills) {
      setError("Veuillez nommer toutes vos compétences ou les supprimer")
      setLoading(false)
      return
    }

    const updatedFormData = {
      ...formData,
      skills: skills
        .filter((skill) => skill.name.trim())
        .map((skill) => ({
          name: skill.name,
          level: skill.level,
        })),
    }

    try {
      // Simulation d'appel API
      await new Promise((resolve) => setTimeout(resolve, 2000))
      console.log("Inscription réussie:", updatedFormData)

      // Reset form
      setFormData({
        username: "",
        email: "",
        password: "",
        name: "",
        phoneNumber: "",
        skills: [],
      })
      setSkills([{ name: "", level: 0 }])
      setCurrentStep(1)
    } catch (err) {
      setError("Erreur lors de l'inscription. Veuillez réessayer.")
    } finally {
      setLoading(false)
    }
  }

  // Composant Input réutilisable
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
    const isFocused = focusedField === name

    const getValidationMessage = () => {
      if (!isInvalid) return ""

      switch (name) {
        case "email":
          return "Format d'email invalide"
        case "phoneNumber":
          return "Le numéro doit contenir 10 chiffres"
        case "password":
          return "Le mot de passe doit contenir au moins 6 caractères"
        case "name":
        case "username":
          return "Minimum 3 caractères requis"
        default:
          return "Champ invalide"
      }
    }

    return (
      <div
        className={`input-field ${isFocused ? "focused" : ""} ${isValid ? "valid" : ""} ${isInvalid ? "invalid" : ""}`}
      >
        <label className="input-label">
          <div className="label-content">
            <Icon className="label-icon" />
            <span className="label-text">{label}</span>
            {required && <span className="required">*</span>}
          </div>
          {isValid && <FaCheckCircle className="validation-success" />}
        </label>

        <div className="input-wrapper">
          <input
            type={showPasswordToggle && showPassword ? "text" : type}
            name={name}
            value={formData[name]}
            onChange={handleChange}
            onFocus={() => setFocusedField(name)}
            onBlur={() => setFocusedField("")}
            placeholder={placeholder}
            required={required}
            className="input-control"
          />

          {showPasswordToggle && (
            <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          )}

          <div className="input-border" />
        </div>

        {isInvalid && <div className="validation-error">{getValidationMessage()}</div>}
      </div>
    )
  }

  // Composant Skill réutilisable
  const SkillField = ({ skill, index, onUpdate, onRemove, canRemove }) => {
    const getSkillLevel = (level) => {
      if (level >= 80) return { label: "Expert", color: "#10b981" }
      if (level >= 60) return { label: "Avancé", color: "#3b82f6" }
      if (level >= 40) return { label: "Intermédiaire", color: "#f59e0b" }
      if (level >= 20) return { label: "Débutant", color: "#ef4444" }
      return { label: "Novice", color: "#6b7280" }
    }

    const skillLevel = getSkillLevel(skill.level)

    return (
      <div className="skill-field">
        <div className="skill-inputs">
          <div className="skill-name-input">
            <input
              type="text"
              placeholder="Nom de la compétence (ex: JavaScript, Marketing...)"
              value={skill.name}
              onChange={(e) => onUpdate(index, "name", e.target.value)}
              className="skill-input"
            />
          </div>

          <div className="skill-level-input">
            <input
              type="number"
              placeholder="0-100"
              value={skill.level}
              onChange={(e) => onUpdate(index, "level", e.target.value)}
              min="0"
              max="100"
              className="skill-input level-input"
            />
            <div className="skill-level-info">
              <span className="level-label" style={{ color: skillLevel.color }}>
                {skillLevel.label}
              </span>
              <span className="level-percentage">{skill.level}%</span>
            </div>
          </div>

          <button
            type="button"
            className="remove-skill"
            onClick={() => onRemove(index)}
            disabled={!canRemove}
            title="Supprimer cette compétence"
          >
            <FaTrash />
          </button>
        </div>

        {skill.name && (
          <div className="skill-progress">
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{
                  width: `${skill.level}%`,
                  backgroundColor: skillLevel.color,
                }}
              />
            </div>
          </div>
        )}
      </div>
    )
  }

  const progress = ((currentStep - 1) / 2) * 100

  return (
    <div className="register-page">
      {/* Background décoratif */}
      <div className="background-decoration">
        <div className="floating-shape shape-1" />
        <div className="floating-shape shape-2" />
        <div className="floating-shape shape-3" />
        <div className="grid-overlay" />
      </div>

      <div className="register-container">
        <div className="register-card" ref={registerCardRef}>
          {/* Header */}
          <div className="register-header">
            <div className="icon-container">
              <FaUserGraduate className="main-icon" />
            </div>
            <h1 className="register-title">Inscription Candidat</h1>
            <p className="register-subtitle">Créez votre compte pour trouver votre prochain emploi</p>
          </div>

          {/* Progress Indicator */}
          <div className="progress-section">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <div className="steps-indicator">
              {[
                { number: 1, label: "Connexion", icon: FaLock },
                { number: 2, label: "Profil", icon: FaUser },
                { number: 3, label: "Compétences", icon: FaGraduationCap },
              ].map((step) => (
                <div
                  key={step.number}
                  className={`step ${currentStep >= step.number ? "active" : ""} ${currentStep > step.number ? "completed" : ""}`}
                >
                  <div className="step-number">{currentStep > step.number ? <FaCheckCircle /> : step.number}</div>
                  <span className="step-label">{step.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-alert">
              <FaInfoCircle className="error-icon" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="register-form">
            {/* Étape 1: Connexion */}
            {currentStep === 1 && (
              <div className="form-step active">
                <div className="step-header">
                  <FaLock className="step-icon" />
                  <h3 className="step-title">Informations de connexion</h3>
                </div>

                <div className="form-grid">
                  <InputField name="username" placeholder="Votre identifiant" icon={FaUser} label="Nom d'utilisateur" />
                  <InputField
                    name="email"
                    type="email"
                    placeholder="votre@email.com"
                    icon={FaEnvelope}
                    label="Adresse email"
                  />
                  <InputField
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    icon={FaLock}
                    label="Mot de passe"
                    showPasswordToggle={true}
                  />
                </div>

                <div className="form-actions">
                  <div></div>
                  <button type="button" className="btn btn-primary" onClick={nextStep}>
                    <span>Suivant</span>
                    <FaArrowRight />
                  </button>
                </div>
              </div>
            )}

            {/* Étape 2: Profil */}
            {currentStep === 2 && (
              <div className="form-step active">
                <div className="step-header">
                  <FaUser className="step-icon" />
                  <h3 className="step-title">Informations personnelles</h3>
                </div>

                <div className="form-grid">
                  <InputField name="name" placeholder="Votre nom complet" icon={FaUser} label="Nom complet" />
                  <InputField
                    name="phoneNumber"
                    type="tel"
                    placeholder="0123456789"
                    icon={FaPhone}
                    label="Numéro de téléphone"
                  />
                </div>

                <div className="form-actions">
                  <button type="button" className="btn btn-secondary" onClick={prevStep}>
                    <FaArrowLeft />
                    <span>Précédent</span>
                  </button>
                  <button type="button" className="btn btn-primary" onClick={nextStep}>
                    <span>Suivant</span>
                    <FaArrowRight />
                  </button>
                </div>
              </div>
            )}

            {/* Étape 3: Compétences */}
            {currentStep === 3 && (
              <div className="form-step active">
                <div className="step-header">
                  <FaGraduationCap className="step-icon" />
                  <h3 className="step-title">Vos compétences</h3>
                </div>

                <div className="skills-info">
                  <FaInfoCircle className="info-icon" />
                  <p>Ajoutez vos compétences et évaluez votre niveau de maîtrise (0-100)</p>
                </div>

                <div className="skills-container">
                  {skills.map((skill, index) => (
                    <SkillField
                      key={index}
                      skill={skill}
                      index={index}
                      onUpdate={handleSkillChange}
                      onRemove={removeSkill}
                      canRemove={skills.length > 1}
                    />
                  ))}

                  <button type="button" className="btn btn-outline add-skill" onClick={addSkill}>
                    <FaPlus />
                    <span>Ajouter une compétence</span>
                  </button>
                </div>

                <div className="form-actions">
                  <button type="button" className="btn btn-secondary" onClick={prevStep}>
                    <FaArrowLeft />
                    <span>Précédent</span>
                  </button>
                  <button type="submit" disabled={loading} className={`btn btn-success ${loading ? "loading" : ""}`}>
                    {loading ? (
                      <>
                        <div className="spinner" />
                        <span>Inscription en cours...</span>
                      </>
                    ) : (
                      <>
                        <span>S'inscrire</span>
                        <FaCheckCircle />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>

          {/* Footer */}
          <div className="form-footer">
            <p>
              Déjà inscrit ?
              <a href="/login/candidat" className="login-link">
                Se connecter
              </a>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .register-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
          padding: 2rem 1rem;
          position: relative;
          overflow: hidden;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
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

        .grid-overlay {
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
          width: 120px;
          height: 120px;
          top: 15%;
          left: 10%;
          animation-delay: 0s;
        }

        .shape-2 {
          width: 80px;
          height: 80px;
          top: 70%;
          right: 15%;
          animation-delay: 2s;
        }

        .shape-3 {
          width: 100px;
          height: 100px;
          bottom: 20%;
          left: 20%;
          animation-delay: 4s;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }

        .register-container {
          position: relative;
          z-index: 100;
          width: 100%;
          max-width: 800px;
        }

        .register-card {
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 3rem;
          box-shadow: 
            0 25px 50px rgba(0, 0, 0, 0.3),
            0 0 0 1px rgba(255, 140, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          position: relative;
          overflow: hidden;
          animation: slideUp 0.6s ease-out;
        }

        .register-card::before {
          content: '';
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

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
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
          box-shadow: 0 10px 30px rgba(255, 140, 0, 0.3);
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
          line-height: 1.6;
        }

        .progress-section {
          margin-bottom: 2.5rem;
        }

        .progress-bar {
          height: 8px;
          background-color: #e5e7eb;
          border-radius: 4px;
          margin-bottom: 1.5rem;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #ff8c00, #ff6b35);
          border-radius: 4px;
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
        }

        .step-number {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: #e5e7eb;
          color: #6b7280;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          margin-bottom: 0.5rem;
          transition: all 0.3s ease;
          font-size: 0.9rem;
        }

        .step.active .step-number {
          background: linear-gradient(135deg, #ff8c00, #ff6b35);
          color: white;
          box-shadow: 0 5px 15px rgba(255, 140, 0, 0.3);
          transform: scale(1.1);
        }

        .step.completed .step-number {
          background: #10b981;
          color: white;
        }

        .step-label {
          font-size: 0.85rem;
          color: #6b7280;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .step.active .step-label {
          color: #ff8c00;
          font-weight: 700;
        }

        .step.completed .step-label {
          color: #10b981;
          font-weight: 600;
        }

        .error-alert {
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
          animation: errorSlide 0.3s ease-out;
        }

        .error-icon {
          width: 1.25rem;
          height: 1.25rem;
          flex-shrink: 0;
        }

        @keyframes errorSlide {
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

        .form-step {
          animation: fadeIn 0.5s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .step-header {
          display: flex;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #f3f4f6;
          position: relative;
        }

        .step-header::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 80px;
          height: 2px;
          background: linear-gradient(135deg, #ff8c00, #ff6b35);
        }

        .step-icon {
          width: 1.5rem;
          height: 1.5rem;
          color: #ff8c00;
          margin-right: 0.75rem;
        }

        .step-title {
          font-size: 1.4rem;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-bottom: 2.5rem;
        }

        .input-field {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .input-field.focused {
          transform: translateY(-2px);
        }

        .input-label {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-weight: 600;
          color: #374151;
          font-size: 0.95rem;
        }

        .label-content {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .label-icon {
          width: 1.1rem;
          height: 1.1rem;
          color: #ff8c00;
        }

        .label-text {
          font-weight: 600;
        }

        .required {
          color: #ef4444;
          font-weight: 700;
        }

        .validation-success {
          width: 1.1rem;
          height: 1.1rem;
          color: #10b981;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-control {
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
        }

        .input-control::placeholder {
          color: #9ca3af;
        }

        .input-control:focus {
          outline: none;
          border-color: #ff8c00;
          box-shadow: 0 0 0 3px rgba(255, 140, 0, 0.1);
          background: rgba(255, 255, 255, 1);
        }

        .input-field.valid .input-control {
          border-color: #10b981;
          background: rgba(16, 185, 129, 0.05);
        }

        .input-field.invalid .input-control {
          border-color: #ef4444;
          background: rgba(239, 68, 68, 0.05);
        }

        .password-toggle {
          position: absolute;
          right: 1rem;
          background: none;
          border: none;
          color: #6b7280;
          cursor: pointer;
          padding: 0.25rem;
          border-radius: 4px;
          transition: all 0.3s ease;
        }

        .password-toggle:hover {
          color: #ff8c00;
          background: rgba(255, 140, 0, 0.1);
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

        .input-field.focused .input-border {
          width: 100%;
        }

        .validation-error {
          font-size: 0.85rem;
          color: #ef4444;
          font-weight: 500;
          margin-top: -0.25rem;
          animation: errorFade 0.3s ease-out;
        }

        @keyframes errorFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .skills-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: rgba(255, 140, 0, 0.1);
          padding: 1rem;
          border-radius: 12px;
          margin-bottom: 2rem;
          border: 1px solid rgba(255, 140, 0, 0.2);
        }

        .info-icon {
          color: #ff8c00;
          width: 1.2rem;
          height: 1.2rem;
          flex-shrink: 0;
        }

        .skills-info p {
          margin: 0;
          font-size: 0.95rem;
          color: #4b5563;
          line-height: 1.5;
        }

        .skills-container {
          margin-bottom: 2.5rem;
        }

        .skill-field {
          margin-bottom: 1.5rem;
          padding: 1.5rem;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          transition: all 0.3s ease;
          animation: skillSlide 0.3s ease-out;
        }

        .skill-field:hover {
          background: rgba(255, 255, 255, 0.7);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        @keyframes skillSlide {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .skill-inputs {
          display: grid;
          grid-template-columns: 2fr 1fr auto;
          gap: 1rem;
          align-items: start;
          margin-bottom: 1rem;
        }

        .skill-name-input,
        .skill-level-input {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .skill-input {
          padding: 0.875rem 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 0.95rem;
          transition: all 0.3s ease;
          background: rgba(255, 255, 255, 0.9);
          color: #1a1a1a;
          font-family: inherit;
        }

        .skill-input:focus {
          outline: none;
          border-color: #ff8c00;
          box-shadow: 0 0 0 3px rgba(255, 140, 0, 0.1);
          background: rgba(255, 255, 255, 1);
        }

        .level-input {
          text-align: center;
        }

        .skill-level-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.8rem;
        }

        .level-label {
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .level-percentage {
          font-weight: 700;
          color: #374151;
        }

        .remove-skill {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #ef4444;
          padding: 0.75rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          height: fit-content;
        }

        .remove-skill:hover:not(:disabled) {
          background: rgba(239, 68, 68, 0.2);
          transform: scale(1.05);
        }

        .remove-skill:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .skill-progress {
          margin-top: 0.5rem;
        }

        .progress-track {
          height: 8px;
          background-color: #e5e7eb;
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          border-radius: 4px;
          transition: all 0.5s ease;
          position: relative;
        }

        .progress-fill::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          animation: progressShimmer 2s ease-in-out infinite;
        }

        @keyframes progressShimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .form-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 2.5rem;
          gap: 1rem;
        }

        .btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 2rem;
          border-radius: 12px;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: none;
          font-family: inherit;
          position: relative;
          overflow: hidden;
        }

        .btn-primary {
          background: linear-gradient(135deg, #ff8c00, #ff6b35);
          color: white;
          box-shadow: 0 4px 15px rgba(255, 140, 0, 0.3);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(255, 140, 0, 0.4);
        }

        .btn-secondary {
          background: rgba(107, 114, 128, 0.1);
          border: 2px solid rgba(107, 114, 128, 0.2);
          color: #6b7280;
        }

        .btn-secondary:hover {
          background: rgba(107, 114, 128, 0.2);
          transform: translateY(-2px);
        }

        .btn-success {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
        }

        .btn-success:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
        }

        .btn-outline {
          background: transparent;
          border: 2px solid #ff8c00;
          color: #ff8c00;
        }

        .btn-outline:hover {
          background: #ff8c00;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(255, 140, 0, 0.3);
        }

        .btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .btn.loading {
          pointer-events: none;
        }

        .add-skill {
          width: 100%;
          justify-content: center;
          margin-top: 1rem;
        }

        .spinner {
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
            gap: 1.5rem;
          }

          .skill-inputs {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .remove-skill {
            justify-self: end;
            width: fit-content;
          }

          .form-actions {
            flex-direction: column;
            gap: 1rem;
          }

          .btn {
            width: 100%;
            justify-content: center;
          }

          .steps-indicator {
            gap: 0.5rem;
          }

          .step-number {
            width: 35px;
            height: 35px;
          }

          .step-label {
            font-size: 0.8rem;
          }
        }

        @media (max-width: 480px) {
          .register-card {
            padding: 1.5rem 1rem;
          }

          .register-title {
            font-size: 1.75rem;
          }

          .step-title {
            font-size: 1.2rem;
          }

          .input-control {
            padding: 0.875rem 1rem;
          }

          .skill-field {
            padding: 1rem;
          }

          .skill-level-info {
            flex-direction: column;
            align-items: center;
            gap: 0.25rem;
          }
        }
      `}</style>
    </div>
  )
}

export default RegisterCandidate
