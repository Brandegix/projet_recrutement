"use client"

import { useState, useEffect, useRef } from "react"
import {
  User,
  Mail,
  Phone,
  Lock,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Info,
  GraduationCap,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Sparkles,
  Target,
  Award,
  Zap,
} from "lucide-react"

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

  const progress = ((currentStep - 1) / 2) * 100

  const getSkillLevel = (level) => {
    if (level >= 90) return { label: "Expert", color: "#f97316", bg: "rgba(249, 115, 22, 0.1)" }
    if (level >= 70) return { label: "Avancé", color: "#fb923c", bg: "rgba(251, 146, 60, 0.1)" }
    if (level >= 50) return { label: "Intermédiaire", color: "#fdba74", bg: "rgba(253, 186, 116, 0.1)" }
    if (level >= 30) return { label: "Débutant", color: "#ffedd5", bg: "rgba(255, 237, 213, 0.1)" }
    return { label: "Novice", color: "#fff7ed", bg: "rgba(255, 247, 237, 0.1)" }
  }

  const InputField = ({ name, type = "text", placeholder, icon: Icon, label, required = true }) => {
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
          {isValid && <CheckCircle className="validation-success" />}
        </label>

        <div className="input-wrapper">
          <input
            type={name === "password" && showPassword ? "text" : type}
            name={name}
            value={formData[name]}
            onChange={handleChange}
            onFocus={() => setFocusedField(name)}
            onBlur={() => setFocusedField("")}
            placeholder={placeholder}
            required={required}
            className="input-control"
          />

          {name === "password" && (
            <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}

          <div className="input-glow" />
        </div>

        {isInvalid && <div className="validation-error">{getValidationMessage()}</div>}
      </div>
    )
  }

  return (
    <div className="register-page">
      {/* Background Effects */}
      <div className="background-effects">
        <div className="gradient-orb orb-1" />
        <div className="gradient-orb orb-2" />
        <div className="gradient-orb orb-3" />
        <div className="mesh-gradient" />
        <div className="floating-particles">
          {[...Array(20)].map((_, i) => (
            <div key={i} className={`particle particle-${i + 1}`} />
          ))}
        </div>
      </div>

      <div className="register-container">
        <div className="register-card" ref={registerCardRef}>
          {/* Header */}
          <div className="register-header">
            <div className="icon-container">
              <div className="icon-bg">
                <GraduationCap className="main-icon" />
              </div>
              <div className="icon-ring" />
            </div>
            <h1 className="register-title">
              <span className="title-gradient">Rejoignez-nous</span>
              <br />
              <span className="title-sub">Candidat Talentueux</span>
            </h1>
            <p className="register-subtitle">
              Créez votre profil professionnel et découvrez des opportunités qui vous correspondent
            </p>
          </div>

          {/* Progress */}
          <div className="progress-section">
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
              <div className="progress-glow" style={{ left: `${progress}%` }} />
            </div>
            <div className="steps-container">
              {[
                { number: 1, label: "Connexion", icon: Lock },
                { number: 2, label: "Profil", icon: User },
                { number: 3, label: "Compétences", icon: Award },
              ].map((step) => (
                <div
                  key={step.number}
                  className={`step-item ${currentStep >= step.number ? "active" : ""} ${currentStep > step.number ? "completed" : ""}`}
                >
                  <div className="step-circle">
                    {currentStep > step.number ? (
                      <CheckCircle className="step-check" />
                    ) : (
                      <step.icon className="step-icon" />
                    )}
                  </div>
                  <span className="step-label">{step.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="error-alert">
              <div className="error-icon-wrapper">
                <Info className="error-icon" />
              </div>
              <div className="error-content">
                <h4 className="error-title">Attention</h4>
                <p className="error-message">{error}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="register-form">
            {/* Step 1: Login */}
            {currentStep === 1 && (
              <div className="form-step">
                <div className="step-header">
                  <div className="step-icon-wrapper">
                    <Lock className="step-header-icon" />
                  </div>
                  <div className="step-info">
                    <h3 className="step-title">Informations de connexion</h3>
                    <p className="step-description">Créez vos identifiants de connexion sécurisés</p>
                  </div>
                </div>

                <div className="form-grid">
                  <InputField
                    name="username"
                    placeholder="Votre identifiant unique"
                    icon={User}
                    label="Nom d'utilisateur"
                  />
                  <InputField
                    name="email"
                    type="email"
                    placeholder="votre@email.com"
                    icon={Mail}
                    label="Adresse email"
                  />
                  <InputField
                    name="password"
                    type="password"
                    placeholder="••••••••••"
                    icon={Lock}
                    label="Mot de passe"
                  />
                </div>

                <div className="form-actions">
                  <div></div>
                  <button type="button" className="btn btn-primary" onClick={nextStep}>
                    <span>Continuer</span>
                    <ArrowRight className="btn-icon" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Profile */}
            {currentStep === 2 && (
              <div className="form-step">
                <div className="step-header">
                  <div className="step-icon-wrapper">
                    <User className="step-header-icon" />
                  </div>
                  <div className="step-info">
                    <h3 className="step-title">Informations personnelles</h3>
                    <p className="step-description">Complétez votre profil avec vos informations de contact</p>
                  </div>
                </div>

                <div className="form-grid">
                  <InputField name="name" placeholder="Votre nom complet" icon={User} label="Nom complet" />
                  <InputField
                    name="phoneNumber"
                    type="tel"
                    placeholder="0123456789"
                    icon={Phone}
                    label="Numéro de téléphone"
                  />
                </div>

                <div className="form-actions">
                  <button type="button" className="btn btn-secondary" onClick={prevStep}>
                    <ArrowLeft className="btn-icon" />
                    <span>Retour</span>
                  </button>
                  <button type="button" className="btn btn-primary" onClick={nextStep}>
                    <span>Continuer</span>
                    <ArrowRight className="btn-icon" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Skills */}
            {currentStep === 3 && (
              <div className="form-step">
                <div className="step-header">
                  <div className="step-icon-wrapper">
                    <Award className="step-header-icon" />
                  </div>
                  <div className="step-info">
                    <h3 className="step-title">Vos compétences</h3>
                    <p className="step-description">Mettez en valeur vos talents et votre expertise</p>
                  </div>
                </div>

                <div className="skills-info-card">
                  <div className="info-icon-wrapper">
                    <Sparkles className="info-icon" />
                  </div>
                  <div className="info-content">
                    <h4 className="info-title">Conseil</h4>
                    <p className="info-text">Évaluez honnêtement votre niveau pour chaque compétence (0-100)</p>
                  </div>
                </div>

                <div className="skills-container">
                  {skills.map((skill, index) => {
                    const skillLevel = getSkillLevel(skill.level)
                    return (
                      <div key={index} className="skill-card">
                        <div className="skill-inputs">
                          <div className="skill-name-input">
                            <input
                              type="text"
                              placeholder="Ex: JavaScript, Marketing Digital, Photoshop..."
                              value={skill.name}
                              onChange={(e) => handleSkillChange(index, "name", e.target.value)}
                              className="skill-input"
                            />
                          </div>

                          <div className="skill-level-input">
                            <input
                              type="number"
                              placeholder="0-100"
                              value={skill.level}
                              onChange={(e) => handleSkillChange(index, "level", e.target.value)}
                              min="0"
                              max="100"
                              className="skill-input level-input"
                            />
                            <div
                              className="skill-badge"
                              style={{ backgroundColor: skillLevel.bg, color: skillLevel.color }}
                            >
                              <Target className="badge-icon" />
                              <span>{skillLevel.label}</span>
                            </div>
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

                        {skill.name && skill.level > 0 && (
                          <div className="skill-progress">
                            <div className="progress-bar-bg">
                              <div
                                className="progress-bar-fill"
                                style={{
                                  width: `${skill.level}%`,
                                  backgroundColor: skillLevel.color,
                                }}
                              />
                            </div>
                            <div className="skill-stats">
                              <span className="skill-name-display">{skill.name}</span>
                              <span className="skill-percentage">{skill.level}%</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}

                  <button type="button" className="add-skill-btn" onClick={addSkill}>
                    <div className="add-skill-icon">
                      <Plus className="plus-icon" />
                    </div>
                    <div className="add-skill-content">
                      <span className="add-skill-title">Ajouter une compétence</span>
                      <span className="add-skill-subtitle">Enrichissez votre profil</span>
                    </div>
                  </button>
                </div>

                <div className="form-actions">
                  <button type="button" className="btn btn-secondary" onClick={prevStep}>
                    <ArrowLeft className="btn-icon" />
                    <span>Retour</span>
                  </button>
                  <button type="submit" disabled={loading} className={`btn btn-success ${loading ? "loading" : ""}`}>
                    {loading ? (
                      <>
                        <div className="spinner" />
                        <span>Création en cours...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="btn-icon" />
                        <span>Créer mon compte</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>

          {/* Footer */}
          <div className="form-footer">
            <p className="footer-text">
              Déjà membre ?
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
          background: #0a0a0f;
          padding: 2rem 1rem;
          position: relative;
          overflow: hidden;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .background-effects {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }

        .mesh-gradient {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: 
            radial-gradient(circle at 20% 80%, rgba(249, 115, 22, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 237, 213, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(251, 146, 60, 0.2) 0%, transparent 50%);
          animation: meshMove 20s ease-in-out infinite;
        }

        @keyframes meshMove {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.1) rotate(180deg); }
        }

        .gradient-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(40px);
          animation: orbFloat 8s ease-in-out infinite;
        }

        .orb-1 {
          width: 300px;
          height: 300px;
          background: linear-gradient(45deg, #f97316, #fdba74);
          top: 10%;
          left: 10%;
          animation-delay: 0s;
        }

        .orb-2 {
          width: 200px;
          height: 200px;
          background: linear-gradient(45deg, #fb923c, #fff7ed);
          top: 60%;
          right: 10%;
          animation-delay: 2s;
        }

        .orb-3 {
          width: 250px;
          height: 250px;
          background: linear-gradient(45deg, #ea580c, #fb923c);
          bottom: 10%;
          left: 30%;
          animation-delay: 4s;
        }

        @keyframes orbFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }

        .floating-particles {
          position: absolute;
          width: 100%;
          height: 100%;
        }

        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: rgba(255, 255, 255, 0.6);
          border-radius: 50%;
          animation: particleFloat 15s linear infinite;
        }

        .particle:nth-child(odd) {
          background: rgba(249, 115, 22, 0.6);
        }

        .particle:nth-child(even) {
          background: rgba(253, 186, 116, 0.6);
        }

        @keyframes particleFloat {
          0% {
            transform: translateY(100vh) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) translateX(100px);
            opacity: 0;
          }
        }

        .particle-1 { left: 10%; animation-delay: 0s; }
        .particle-2 { left: 20%; animation-delay: 1s; }
        .particle-3 { left: 30%; animation-delay: 2s; }
        .particle-4 { left: 40%; animation-delay: 3s; }
        .particle-5 { left: 50%; animation-delay: 4s; }
        .particle-6 { left: 60%; animation-delay: 5s; }
        .particle-7 { left: 70%; animation-delay: 6s; }
        .particle-8 { left: 80%; animation-delay: 7s; }
        .particle-9 { left: 90%; animation-delay: 8s; }
        .particle-10 { left: 15%; animation-delay: 9s; }
        .particle-11 { left: 25%; animation-delay: 10s; }
        .particle-12 { left: 35%; animation-delay: 11s; }
        .particle-13 { left: 45%; animation-delay: 12s; }
        .particle-14 { left: 55%; animation-delay: 13s; }
        .particle-15 { left: 65%; animation-delay: 14s; }
        .particle-16 { left: 75%; animation-delay: 15s; }
        .particle-17 { left: 85%; animation-delay: 16s; }
        .particle-18 { left: 95%; animation-delay: 17s; }
        .particle-19 { left: 5%; animation-delay: 18s; }
        .particle-20 { left: 95%; animation-delay: 19s; }

        .register-container {
          position: relative;
          z-index: 100;
          width: 100%;
          max-width: 900px;
        }

        .register-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 32px;
          padding: 3rem;
          border: 1px solid rgba(249, 115, 22, 0.2);
          box-shadow: 
            0 25px 50px rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.6);
          position: relative;
          overflow: hidden;
          animation: cardSlideUp 0.8s ease-out;
        }

        .register-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(249, 115, 22, 0.8), transparent);
          animation: shimmer 3s ease-in-out infinite;
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes cardSlideUp {
          from {
            opacity: 0;
            transform: translateY(50px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .register-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .icon-container {
          position: relative;
          display: inline-block;
          margin-bottom: 2rem;
        }

        .icon-bg {
          width: 100px;
          height: 100px;
          background: linear-gradient(135deg, #f97316, #fdba74);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 2;
        }

        .icon-ring {
          position: absolute;
          top: -10px;
          left: -10px;
          width: 120px;
          height: 120px;
          border: 2px solid rgba(249, 115, 22, 0.3);
          border-radius: 50%;
          animation: ringPulse 2s ease-in-out infinite;
        }

        @keyframes ringPulse {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.1); opacity: 0.6; }
        }

        .main-icon {
          width: 2.5rem;
          height: 2.5rem;
          color: white;
        }

        .register-title {
          font-size: 3rem;
          font-weight: 900;
          margin: 0 0 1rem 0;
          line-height: 1.1;
          color: #0f172a;
        }

        .title-gradient {
          background: linear-gradient(135deg, #f97316, #fdba74);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .title-sub {
          color: #334155;
          font-weight: 600;
        }

        .register-subtitle {
          color: #64748b;
          font-size: 1.1rem;
          margin: 0;
          max-width: 500px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .progress-section {
          margin-bottom: 3rem;
        }

        .progress-track {
          height: 6px;
          background: rgba(249, 115, 22, 0.1);
          border-radius: 3px;
          margin-bottom: 2rem;
          position: relative;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #f97316, #fdba74);
          border-radius: 3px;
          transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }

        .progress-fill::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
          animation: progressShimmer 2s ease-in-out infinite;
        }

        @keyframes progressShimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .progress-glow {
          position: absolute;
          top: -2px;
          width: 10px;
          height: 10px;
          background: #fdba74;
          border-radius: 50%;
          box-shadow: 0 0 20px #f97316;
          transform: translateX(-50%);
          transition: left 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .steps-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .step-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
        }

        .step-circle {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: rgba(249, 115, 22, 0.05);
          border: 2px solid rgba(249, 115, 22, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.75rem;
          transition: all 0.3s ease;
        }

        .step-item.active .step-circle {
          background: linear-gradient(135deg, #f97316, #fdba74);
          border-color: transparent;
          box-shadow: 0 8px 25px rgba(249, 115, 22, 0.4);
          transform: scale(1.1);
        }

        .step-item.completed .step-circle {
          background: linear-gradient(135deg, #15803d, #22c55e);
          border-color: transparent;
        }

        .step-icon, .step-check {
          width: 1.2rem;
          height: 1.2rem;
          color: #64748b;
        }

        .step-item.active .step-icon,
        .step-item.completed .step-check {
          color: white;
        }

        .step-label {
          font-size: 0.9rem;
          color: #64748b;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .step-item.active .step-label {
          color: #f97316;
          font-weight: 700;
        }

        .step-item.completed .step-label {
          color: #15803d;
          font-weight: 600;
        }

        .error-alert {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          margin-bottom: 2rem;
          padding: 1.25rem;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 16px;
          animation: errorSlide 0.4s ease-out;
        }

        .error-icon-wrapper {
          width: 40px;
          height: 40px;
          background: rgba(239, 68, 68, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .error-icon {
          width: 1.2rem;
          height: 1.2rem;
          color: #ef4444;
        }

        .error-content {
          flex: 1;
        }

        .error-title {
          font-size: 1rem;
          font-weight: 700;
          color: #ef4444;
          margin: 0 0 0.25rem 0;
        }

        .error-message {
          font-size: 0.9rem;
          color: rgba(239, 68, 68, 0.8);
          margin: 0;
          line-height: 1.4;
        }

        @keyframes errorSlide {
          from {
            opacity: 0;
            transform: translateY(-20px);
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
          animation: stepFadeIn 0.6s ease-out;
        }

        @keyframes stepFadeIn {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .step-header {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 2.5rem;
          padding: 1.5rem;
          background: rgba(249, 115, 22, 0.05);
          border-radius: 20px;
          border: 1px solid rgba(249, 115, 22, 0.1);
        }

        .step-icon-wrapper {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #f97316, #fdba74);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .step-header-icon {
          width: 1.5rem;
          height: 1.5rem;
          color: white;
        }

        .step-info {
          flex: 1;
        }

        .step-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 0.5rem 0;
        }

        .step-description {
          font-size: 1rem;
          color: #64748b;
          margin: 0;
          line-height: 1.5;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .input-field {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          transition: all 0.3s ease;
        }

        .input-field.focused {
          transform: translateY(-2px);
        }

        .input-label {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-weight: 600;
          color: #334155;
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
          color: #f97316;
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
          color: #15803d;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-control {
          width: 100%;
          padding: 1.25rem 1.5rem;
          border: 2px solid rgba(249, 115, 22, 0.2);
          border-radius: 16px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: white;
          color: #0f172a;
          font-family: inherit;
          z-index: 1;
        }

        .input-control::placeholder {
          color: #94a3b8;
        }

        .input-control:focus {
          outline: none;
          border-color: #f97316;
          box-shadow: 0 0 0 4px rgba(249, 115, 22, 0.1);
          background: white;
        }

        .input-field.valid .input-control {
          border-color: #15803d;
          background: rgba(22, 163, 74, 0.05);
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
          color: #94a3b8;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 8px;
          transition: all 0.3s ease;
          z-index: 2;
        }

        .password-toggle:hover {
          color: #f97316;
          background: rgba(249, 115, 22, 0.1);
        }

        .input-glow {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #f97316, #fdba74);
          transition: width 0.3s ease;
          border-radius: 1px;
        }

        .input-field.focused .input-glow {
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

        .skills-info-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: rgba(249, 115, 22, 0.1);
          padding: 1.25rem;
          border-radius: 16px;
          margin-bottom: 2rem;
          border: 1px solid rgba(249, 115, 22, 0.2);
        }

        .info-icon-wrapper {
          width: 40px;
          height: 40px;
          background: rgba(249, 115, 22, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .info-icon {
          width: 1.2rem;
          height: 1.2rem;
          color: #f97316;
        }

        .info-content {
          flex: 1;
        }

        .info-title {
          font-size: 1rem;
          font-weight: 700;
          color: #f97316;
          margin: 0 0 0.25rem 0;
        }

        .info-text {
          font-size: 0.9rem;
          color: #334155;
          margin: 0;
          line-height: 1.4;
        }

        .skills-container {
          margin-bottom: 3rem;
        }

        .skill-card {
          margin-bottom: 1.5rem;
          padding: 1.5rem;
          background: white;
          border-radius: 20px;
          border: 1px solid rgba(249, 115, 22, 0.1);
          transition: all 0.3s ease;
          animation: skillSlide 0.4s ease-out;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        .skill-card:hover {
          background: white;
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(249, 115, 22, 0.1);
          border-color: rgba(249, 115, 22, 0.2);
        }

        @keyframes skillSlide {
          from {
            opacity: 0;
            transform: translateY(20px);
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
          padding: 1rem;
          border: 2px solid rgba(249, 115, 22, 0.2);
          border-radius: 12px;
          font-size: 0.95rem;
          transition: all 0.3s ease;
          background: white;
          color: #0f172a;
          font-family: inherit;
        }

        .skill-input::placeholder {
          color: #94a3b8;
        }

        .skill-input:focus {
          outline: none;
          border-color: #f97316;
          box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
          background: white;
        }

        .level-input {
          text-align: center;
        }

        .skill-badge {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.5rem 0.75rem;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .badge-icon {
          width: 0.8rem;
          height: 0.8rem;
        }

        .remove-skill-btn {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #ef4444;
          padding: 1rem;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          height: fit-content;
        }

        .remove-skill-btn:hover:not(:disabled) {
          background: rgba(239, 68, 68, 0.2);
          transform: scale(1.05);
        }

        .remove-skill-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .remove-icon {
          width: 1rem;
          height: 1rem;
        }

        .skill-progress {
          margin-top: 1rem;
        }

        .progress-bar-bg {
          height: 8px;
          background: rgba(249, 115, 22, 0.1);
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 0.75rem;
        }

        .progress-bar-fill {
          height: 100%;
          border-radius: 4px;
          transition: all 0.6s ease;
          position: relative;
        }

        .progress-bar-fill::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          animation: skillShimmer 2s ease-in-out infinite;
        }

        @keyframes skillShimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .skill-stats {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .skill-name-display {
          font-size: 0.9rem;
          color: #334155;
          font-weight: 600;
        }

        .skill-percentage {
          font-size: 0.9rem;
          font-weight: 700;
          color: #0f172a;
        }

        .add-skill-btn {
          width: 100%;
          background: white;
          border: 2px dashed rgba(249, 115, 22, 0.2);
          color: #64748b;
          padding: 1.5rem;
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 1rem;
          font-family: inherit;
        }

        .add-skill-btn:hover {
          background: rgba(249, 115, 22, 0.05);
          border-color: rgba(249, 115, 22, 0.3);
          color: #f97316;
          transform: translateY(-2px);
        }

        .add-skill-icon {
          width: 40px;
          height: 40px;
          background: rgba(249, 115, 22, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .plus-icon {
          width: 1.2rem;
          height: 1.2rem;
        }

        .add-skill-content {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.25rem;
        }

        .add-skill-title {
          font-size: 1rem;
          font-weight: 600;
        }

        .add-skill-subtitle {
          font-size: 0.85rem;
          opacity: 0.7;
        }

        .form-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 3rem;
          gap: 1rem;
        }

        .btn {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1.25rem 2rem;
          border-radius: 16px;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
          font-family: inherit;
          position: relative;
          overflow: hidden;
        }

        .btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.6s ease;
        }

        .btn:hover::before {
          left: 100%;
        }

        .btn-primary {
          background: linear-gradient(135deg, #f97316, #fdba74);
          color: white;
          box-shadow: 0 8px 25px rgba(249, 115, 22, 0.3);
        }

        .btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 35px rgba(249, 115, 22, 0.4);
        }

        .btn-secondary {
          background: white;
          border: 2px solid rgba(249, 115, 22, 0.2);
          color: #334155;
        }

        .btn-secondary:hover {
          background: rgba(249, 115, 22, 0.05);
          transform: translateY(-2px);
          border-color: rgba(249, 115, 22, 0.3);
        }

        .btn-success {
          background: linear-gradient(135deg, #15803d, #22c55e);
          color: white;
          box-shadow: 0 8px 25px rgba(22, 163, 74, 0.3);
        }

        .btn-success:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 12px 35px rgba(22, 163, 74, 0.4);
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .btn.loading {
          pointer-events: none;
        }

        .btn-icon {
          width: 1.2rem;
          height: 1.2rem;
          transition: transform 0.3s ease;
        }

        .btn:hover .btn-icon {
          transform: translateX(3px);
        }

        .btn-secondary:hover .btn-icon {
          transform: translateX(-3px);
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
          margin-top: 3rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(249, 115, 22, 0.1);
        }

        .footer-text {
          color: #64748b;
          font-size: 1rem;
          margin: 0;
        }

        .login-link {
          color: #f97316;
          text-decoration: none;
          font-weight: 700;
          margin-left: 0.5rem;
          transition: all 0.3s ease;
          position: relative;
        }

        .login-link:hover {
          color: #ea580c;
        }

        .login-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #f97316, #fdba74);
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
            font-size: 2.5rem;
          }

          .icon-bg {
            width: 80px;
            height: 80px;
          }

          .icon-ring {
            width: 100px;
            height: 100px;
            top: -10px;
            left: -10px;
          }

          .main-icon {
            width: 2rem;
            height: 2rem;
          }

          .form-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .skill-inputs {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .remove-skill-btn {
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

          .steps-container {
            gap: 0.5rem;
          }

          .step-circle {
            width: 45px;
            height: 45px;
          }

          .step-label {
            font-size: 0.8rem;
          }

          .step-header {
            flex-direction: column;
            text-align: center;
            gap: 1rem;
          }
        }

        @media (max-width: 480px) {
          .register-card {
            padding: 1.5rem 1rem;
          }

          .register-title {
            font-size: 2rem;
          }

          .step-title {
            font-size: 1.3rem;
          }

          .input-control {
            padding: 1rem;
          }

          .skill-card {
            padding: 1rem;
          }

          .skill-badge {
            flex-direction: column;
            gap: 0.25rem;
            text-align: center;
          }
        }
      `}</style>
    </div>
  )
}

export default RegisterCandidate
