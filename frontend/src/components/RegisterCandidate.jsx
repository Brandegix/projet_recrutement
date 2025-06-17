"use client"
import { useState, useEffect, useRef } from "react"
import {
  User,
  Mail,
  Phone,
  Lock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Plus,
  Trash2,
  GraduationCap,
  Info,
  Target,
  Award,
} from "lucide-react"

const RegisterCandidate = () => {
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
  const [focusedFields, setFocusedFields] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [validations, setValidations] = useState({
    username: false,
    email: false,
    password: false,
    name: false,
    phoneNumber: false,
  })

  const registerCardRef = useRef(null)

  // Real-time validation
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

  const handleFocus = (fieldName) => {
    setFocusedFields((prev) => ({ ...prev, [fieldName]: true }))
  }

  const handleBlur = (fieldName) => {
    setFocusedFields((prev) => ({ ...prev, [fieldName]: false }))
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

    // Validate skills
    const hasEmptySkills = skills.some((skill) => !skill.name.trim())
    if (hasEmptySkills) {
      setError("Veuillez nommer toutes vos compétences ou les supprimer")
      setLoading(false)
      return
    }

    const updatedFormData = {
      ...formData,
      skills: skills.filter((skill) => skill.name.trim()).map((skill) => ({ name: skill.name, level: skill.level })),
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      console.log("Registration successful:", updatedFormData)

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

  const progress = ((currentStep - 1) / 2) * 100

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
            className={`form-input ${isValid ? "input-valid" : ""} ${isInvalid ? "input-invalid" : ""}`}
          />

          <div className="input-border" />
        </div>

        {isInvalid && (
          <div className="validation-message error">
            {name === "email" && "Format d'email invalide"}
            {name === "phoneNumber" && "Le numéro doit contenir 10 chiffres"}
            {name === "password" && "Le mot de passe doit contenir au moins 6 caractères"}
            {(name === "name" || name === "username") && "Minimum 3 caractères requis"}
          </div>
        )}
      </div>
    )
  }

  const getStepIcon = (stepNumber) => {
    if (currentStep > stepNumber) return <CheckCircle className="step-check" />
    if (currentStep === stepNumber) return stepNumber
    return stepNumber
  }

  const getSkillLevelLabel = (level) => {
    if (level >= 80) return "Expert"
    if (level >= 60) return "Avancé"
    if (level >= 40) return "Intermédiaire"
    if (level >= 20) return "Débutant"
    return "Novice"
  }

  const getSkillLevelColor = (level) => {
    if (level >= 80) return "#10b981"
    if (level >= 60) return "#3b82f6"
    if (level >= 40) return "#f59e0b"
    if (level >= 20) return "#ef4444"
    return "#6b7280"
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
        <div className="register-card" ref={registerCardRef}>
          {/* Header */}
          <div className="register-header">
            <div className="icon-container">
              <GraduationCap className="main-icon" />
            </div>
            <h1 className="register-title">Inscription Candidat</h1>
            <p className="register-subtitle">Créez votre compte pour trouver votre prochain emploi</p>
          </div>

          {/* Progress Indicator */}
          <div className="progress-container">
            <div className="progress-bar-bg">
              <div className="progress-bar" style={{ width: `${progress}%` }} />
            </div>
            <div className="steps-indicator">
              <div className={`step ${currentStep >= 1 ? "active" : ""} ${currentStep > 1 ? "completed" : ""}`}>
                <div className="step-number">{getStepIcon(1)}</div>
                <span className="step-label">Connexion</span>
              </div>
              <div className={`step ${currentStep >= 2 ? "active" : ""} ${currentStep > 2 ? "completed" : ""}`}>
                <div className="step-number">{getStepIcon(2)}</div>
                <span className="step-label">Profil</span>
              </div>
              <div className={`step ${currentStep >= 3 ? "active" : ""}`}>
                <div className="step-number">{getStepIcon(3)}</div>
                <span className="step-label">Compétences</span>
              </div>
            </div>
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
            {/* Step 1: Login Information */}
            {currentStep === 1 && (
              <div className="form-section active">
                <h3 className="section-title">
                  <Lock className="section-icon" />
                  Informations de connexion
                </h3>
                <div className="form-grid">
                  <InputField name="username" placeholder="Votre identifiant" icon={User} label="Nom d'utilisateur" />
                  <InputField name="email" type="email" placeholder="votre@email.com" icon={Mail} label="Email" />
                  <InputField
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    icon={Lock}
                    label="Mot de passe"
                    showPasswordToggle={true}
                  />
                </div>
                <div className="form-navigation">
                  <div></div>
                  <button type="button" className="next-button" onClick={nextStep}>
                    <span>Suivant</span>
                    <ArrowRight className="button-icon" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Personal Information */}
            {currentStep === 2 && (
              <div className="form-section active">
                <h3 className="section-title">
                  <User className="section-icon" />
                  Informations personnelles
                </h3>
                <div className="form-grid">
                  <InputField name="name" placeholder="Votre nom complet" icon={User} label="Nom complet" />
                  <InputField name="phoneNumber" type="tel" placeholder="0123456789" icon={Phone} label="Téléphone" />
                </div>
                <div className="form-navigation">
                  <button type="button" className="prev-button" onClick={prevStep}>
                    <ArrowLeft className="button-icon" />
                    <span>Précédent</span>
                  </button>
                  <button type="button" className="next-button" onClick={nextStep}>
                    <span>Suivant</span>
                    <ArrowRight className="button-icon" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Skills */}
            {currentStep === 3 && (
              <div className="form-section active">
                <h3 className="section-title">
                  <Award className="section-icon" />
                  Vos compétences
                </h3>

                <div className="skills-info">
                  <Info className="info-icon" />
                  <p>Ajoutez vos compétences et évaluez votre niveau de maîtrise (0-100)</p>
                </div>

                <div className="skills-container">
                  {skills.map((skill, index) => (
                    <div key={index} className="skill-entry">
                      <div className="skill-header">
                        <div className="skill-inputs">
                          <div className="skill-name-input">
                            <input
                              type="text"
                              placeholder="Nom de la compétence (ex: JavaScript, Marketing...)"
                              value={skill.name}
                              onChange={(e) => handleSkillChange(index, "name", e.target.value)}
                              className="form-input"
                            />
                          </div>
                          <div className="skill-level-input">
                            <input
                              type="number"
                              placeholder="Niveau"
                              value={skill.level}
                              onChange={(e) => handleSkillChange(index, "level", e.target.value)}
                              min="0"
                              max="100"
                              className="form-input"
                            />
                            <span className="level-label" style={{ color: getSkillLevelColor(skill.level) }}>
                              {getSkillLevelLabel(skill.level)}
                            </span>
                          </div>
                          <button
                            type="button"
                            className="remove-skill-btn"
                            onClick={() => removeSkill(index)}
                            disabled={skills.length === 1}
                          >
                            <Trash2 className="remove-icon" />
                          </button>
                        </div>
                      </div>

                      {skill.name && (
                        <div className="skill-visual">
                          <div className="skill-progress-bg">
                            <div
                              className="skill-progress-bar"
                              style={{
                                width: `${skill.level}%`,
                                backgroundColor: getSkillLevelColor(skill.level),
                              }}
                            />
                          </div>
                          <div className="skill-percentage">{skill.level}%</div>
                        </div>
                      )}
                    </div>
                  ))}

                  <button type="button" className="add-skill-btn" onClick={addSkill}>
                    <Plus className="add-icon" />
                    <span>Ajouter une compétence</span>
                  </button>
                </div>

                <div className="form-navigation">
                  <button type="button" className="prev-button" onClick={prevStep}>
                    <ArrowLeft className="button-icon" />
                    <span>Précédent</span>
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`submit-button ${loading ? "loading" : ""} ${skills.every((s) => s.name.trim()) ? "ready" : ""}`}
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
                          <Target className="button-icon" />
                        </>
                      )}
                    </div>
                  </button>
                </div>
              </div>
            )}
          </form>

          {/* Footer */}
          <div className="form-footer">
            <p>
              Déjà inscrit ?{" "}
              <a href="/login/candidat" className="login-link">
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
          max-width: 800px;
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
          animation: slideIn 0.6s ease-out;
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

        @keyframes slideIn {
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

        .progress-container {
          margin-bottom: 2.5rem;
        }

        .progress-bar-bg {
          height: 8px;
          background-color: #e5e7eb;
          border-radius: 4px;
          margin-bottom: 1.5rem;
          overflow: hidden;
        }

        .progress-bar {
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
          position: relative;
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

        .step-check {
          width: 1.2rem;
          height: 1.2rem;
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
          animation: errorSlideIn 0.3s ease-out;
        }

        .error-icon {
          width: 1.25rem;
          height: 1.25rem;
          flex-shrink: 0;
        }

        @keyframes errorSlideIn {
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

        .form-section {
          animation: fadeIn 0.5s ease-out;
        }

        .form-section.active {
          display: block;
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

        .section-title {
          display: flex;
          align-items: center;
          font-size: 1.4rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 2rem;
          padding-bottom: 0.75rem;
          border-bottom: 2px solid #f3f4f6;
          position: relative;
        }

        .section-title::after {
          content: "";
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 80px;
          height: 2px;
          background: linear-gradient(135deg, #ff8c00, #ff6b35);
        }

        .section-icon {
          margin-right: 0.75rem;
          color: #ff8c00;
          width: 1.5rem;
          height: 1.5rem;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
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
        }

        .validation-icon.success {
          color: #10b981;
        }

        .validation-icon.error {
          color: #ef4444;
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

        .validation-message {
          font-size: 0.8rem;
          font-weight: 500;
          margin-top: 0.25rem;
        }

        .validation-message.error {
          color: #ef4444;
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
          font-size: 0.9rem;
          color: #4b5563;
          line-height: 1.5;
        }

        .skills-container {
          margin-bottom: 2rem;
        }

        .skill-entry {
          margin-bottom: 1.5rem;
          padding: 1.5rem;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          transition: all 0.3s ease;
          animation: skillFadeIn 0.3s ease-out;
        }

        .skill-entry:hover {
          background: rgba(255, 255, 255, 0.7);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        @keyframes skillFadeIn {
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
          align-items: center;
          margin-bottom: 1rem;
        }

        .skill-name-input,
        .skill-level-input {
          position: relative;
        }

        .skill-level-input {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .level-label {
          font-size: 0.75rem;
          font-weight: 600;
          text-align: center;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .remove-skill-btn {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #ef4444;
          padding: 0.75rem;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .remove-skill-btn:hover:not(:disabled) {
          background: rgba(239, 68, 68, 0.2);
          transform: scale(1.05);
        }

        .remove-skill-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .remove-icon {
          width: 1rem;
          height: 1rem;
        }

        .skill-visual {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .skill-progress-bg {
          flex: 1;
          height: 8px;
          background-color: #e5e7eb;
          border-radius: 4px;
          overflow: hidden;
        }

        .skill-progress-bar {
          height: 100%;
          border-radius: 4px;
          transition: all 0.5s ease;
          position: relative;
        }

        .skill-progress-bar::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          animation: progressShimmer 2s ease-in-out infinite;
        }

        @keyframes progressShimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .skill-percentage {
          font-size: 0.9rem;
          font-weight: 700;
          color: #374151;
          min-width: 40px;
          text-align: right;
        }

        .add-skill-btn {
          width: 100%;
          background: linear-gradient(135deg, #ff8c00, #ff6b35);
          border: none;
          color: white;
          padding: 1rem 1.5rem;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-size: 1rem;
        }

        .add-skill-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(255, 140, 0, 0.3);
        }

        .add-icon {
          width: 1.2rem;
          height: 1.2rem;
        }

        .form-navigation {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 2rem;
          gap: 1rem;
        }

        .prev-button,
        .next-button,
        .submit-button {
          padding: 1rem 2rem;
          border-radius: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1rem;
          font-family: inherit;
          border: none;
        }

        .prev-button {
          background: rgba(107, 114, 128, 0.1);
          border: 2px solid rgba(107, 114, 128, 0.2);
          color: #6b7280;
        }

        .prev-button:hover {
          background: rgba(107, 114, 128, 0.2);
          transform: translateY(-2px);
        }

        .next-button {
          background: linear-gradient(135deg, #ff8c00, #ff6b35);
          color: white;
          box-shadow: 0 4px 15px rgba(255, 140, 0, 0.3);
        }

        .next-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(255, 140, 0, 0.4);
        }

        .submit-button {
          background: linear-gradient(135deg, #6b7280, #4b5563);
          color: white;
          position: relative;
          overflow: hidden;
        }

        .submit-button.ready {
          background: linear-gradient(135deg, #ff8c00, #ff6b35);
          box-shadow: 0 4px 15px rgba(255, 140, 0, 0.3);
        }

        .submit-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
        }

        .submit-button.ready:hover:not(:disabled) {
          box-shadow: 0 8px 25px rgba(255, 140, 0, 0.4);
        }

        .submit-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .button-content {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          position: relative;
          z-index: 2;
        }

        .button-icon {
          width: 1.2rem;
          height: 1.2rem;
          transition: transform 0.3s ease;
        }

        .next-button:hover .button-icon,
        .submit-button:hover .button-icon {
          transform: translateX(3px);
        }

        .prev-button:hover .button-icon {
          transform: translateX(-3px);
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

          .skill-inputs {
            grid-template-columns: 1fr;
            gap: 0.75rem;
          }

          .remove-skill-btn {
            justify-self: end;
            width: fit-content;
          }

          .form-navigation {
            flex-direction: column;
            gap: 1rem;
          }

          .prev-button,
          .next-button,
          .submit-button {
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

          .section-title {
            font-size: 1.2rem;
          }

          .form-input {
            padding: 0.875rem 1rem;
          }

          .skill-entry {
            padding: 1rem;
          }

          .skill-visual {
            flex-direction: column;
            align-items: stretch;
            gap: 0.5rem;
          }

          .skill-percentage {
            text-align: center;
            min-width: auto;
          }
        }
      `}</style>
    </div>
  )
}

export default RegisterCandidate
