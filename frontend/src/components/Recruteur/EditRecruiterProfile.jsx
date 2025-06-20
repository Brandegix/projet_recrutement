"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../Navbara"
import Footer from "../Footer"

function EditRecruiterProfile() {
  const [profile, setProfile] = useState({
    companyName: "",
    email: "",
    description: "",
    phoneNumber: "",
    address: "",
    name: "",
    creationDate: "",
    public_profile: false,
  })

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState("")

  const navigate = useNavigate()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true)
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/recruiter/profile`, {
          credentials: "include",
        })
        if (res.ok) {
          const data = await res.json()
          setProfile(data)
        } else {
          setErrors({ general: "Erreur lors du chargement du profil" })
        }
      } catch (error) {
        setErrors({ general: "Erreur de connexion" })
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const validateForm = () => {
    const newErrors = {}

    if (!profile.name.trim()) {
      newErrors.name = "Le nom est requis"
    }

    if (!profile.email.trim()) {
      newErrors.email = "L'email est requis"
    } else if (!/\S+@\S+\.\S+/.test(profile.email)) {
      newErrors.email = "Format d'email invalide"
    }

    if (!profile.companyName.trim()) {
      newErrors.companyName = "Le nom de l'entreprise est requis"
    }

    if (profile.phoneNumber && !/^[\d\s\-+$$$$]+$/.test(profile.phoneNumber)) {
      newErrors.phoneNumber = "Format de téléphone invalide"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setProfile({
      ...profile,
      [name]: value,
    })

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setIsSaving(true)
      setErrors({})

      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/recruiter/update_profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(profile),
      })

      if (res.ok) {
        const updatedProfile = await res.json()
        setProfile(updatedProfile)
        setSuccessMessage("Profil mis à jour avec succès !")

        // Navigate after showing success message
        setTimeout(() => {
          navigate("/RecruiterProfile")
        }, 1500)
      } else {
        const errorData = await res.json()
        setErrors({ general: errorData.message || "Erreur lors de la mise à jour" })
      }
    } catch (error) {
      setErrors({ general: "Erreur de connexion" })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <>
        <style>{responsiveStyles}</style>
        <div style={styles.container}>
          <Navbar />
          <div style={styles.loadingContainer}>
            <div style={styles.loadingSpinner}>
              <div style={styles.spinnerRing}></div>
              <div style={styles.spinnerRing}></div>
              <div style={styles.spinnerRing}></div>
            </div>
            <p style={styles.loadingText}>Chargement du profil...</p>
          </div>
          <Footer />
        </div>
      </>
    )
  }

  return (
    <>
      <style>{responsiveStyles}</style>
      <div style={styles.container}>
        <Navbar />

        <div style={styles.mainContent} className="main-content">
          <div style={styles.formContainer} className="form-container">
            {/* Header Section */}
            <div style={styles.header}>
              <div style={styles.headerIcon}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
                    fill="#ff6b35"
                  />
                  <path d="M12 14C7.58172 14 4 17.5817 4 22H20C20 17.5817 16.4183 14 12 14Z" fill="#ff6b35" />
                </svg>
              </div>
              <h1 style={styles.title} className="title">
                Modifier votre profil
              </h1>
              <p style={styles.subtitle}>Mettez à jour vos informations professionnelles</p>
            </div>

            {/* Success Message */}
            {successMessage && (
              <div style={styles.successMessage} className="success-message">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                    stroke="#10b981"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {successMessage}
              </div>
            )}

            {/* General Error */}
            {errors.general && (
              <div style={styles.errorMessage} className="error-message">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                    stroke="#ef4444"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {errors.general}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} style={styles.form} className="profile-form">
              {/* Personal Information Section */}
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>Informations personnelles</h3>

                <div style={styles.formGrid} className="form-grid">
                  <div style={styles.inputGroup} className="input-group">
                    <label htmlFor="name" style={styles.label}>
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={profile.name}
                      onChange={handleChange}
                      placeholder="Votre nom complet"
                      style={{
                        ...styles.input,
                        ...(errors.name ? styles.inputError : {}),
                      }}
                      className="form-input"
                    />
                    {errors.name && <span style={styles.fieldError}>{errors.name}</span>}
                  </div>

                  <div style={styles.inputGroup} className="input-group">
                    <label htmlFor="email" style={styles.label}>
                      Adresse email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={profile.email}
                      onChange={handleChange}
                      placeholder="votre.email@exemple.com"
                      style={{
                        ...styles.input,
                        ...(errors.email ? styles.inputError : {}),
                      }}
                      className="form-input"
                    />
                    {errors.email && <span style={styles.fieldError}>{errors.email}</span>}
                  </div>
                </div>

                <div style={styles.inputGroup} className="input-group">
                  <label htmlFor="phoneNumber" style={styles.label}>
                    Numéro de téléphone
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={profile.phoneNumber}
                    onChange={handleChange}
                    placeholder="+33 1 23 45 67 89"
                    style={{
                      ...styles.input,
                      ...(errors.phoneNumber ? styles.inputError : {}),
                    }}
                    className="form-input"
                  />
                  {errors.phoneNumber && <span style={styles.fieldError}>{errors.phoneNumber}</span>}
                </div>
              </div>

              {/* Company Information Section */}
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>Informations de l'entreprise</h3>

                <div style={styles.inputGroup} className="input-group">
                  <label htmlFor="companyName" style={styles.label}>
                    Nom de l'entreprise *
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={profile.companyName}
                    onChange={handleChange}
                    placeholder="Nom de votre entreprise"
                    style={{
                      ...styles.input,
                      ...(errors.companyName ? styles.inputError : {}),
                    }}
                    className="form-input"
                  />
                  {errors.companyName && <span style={styles.fieldError}>{errors.companyName}</span>}
                </div>

                <div style={styles.inputGroup} className="input-group">
                  <label htmlFor="address" style={styles.label}>
                    Adresse de l'entreprise
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={profile.address}
                    onChange={handleChange}
                    placeholder="Adresse complète"
                    style={styles.input}
                    className="form-input"
                  />
                </div>

                <div style={styles.inputGroup} className="input-group">
                  <label htmlFor="description" style={styles.label}>
                    Description de l'entreprise
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={profile.description}
                    onChange={handleChange}
                    placeholder="Décrivez votre entreprise, ses activités, sa culture..."
                    rows={5}
                    style={styles.textarea}
                    className="form-textarea"
                  />
                  <div style={styles.charCount}>{profile.description.length}/500 caractères</div>
                </div>
              </div>

              {/* Privacy Settings Section */}
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>Paramètres de confidentialité</h3>

                <div style={styles.checkboxGroup} className="checkbox-group">
                  <div style={styles.checkboxContainer}>
                    <input
                      type="checkbox"
                      id="public_profile"
                      name="public_profile"
                      checked={profile.public_profile}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          public_profile: e.target.checked,
                        })
                      }
                      style={styles.checkbox}
                    />
                    <label htmlFor="public_profile" style={styles.checkboxLabel}>
                      <span style={styles.checkboxText}>Rendre mon profil public</span>
                      <span style={styles.checkboxDescription}>
                        Permettre aux candidats de voir votre profil d'entreprise
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={styles.actionButtons} className="action-buttons">
                <button
                  type="button"
                  onClick={() => navigate("/RecruiterProfile")}
                  style={styles.cancelButton}
                  className="cancel-button"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  style={{
                    ...styles.submitButton,
                    ...(isSaving ? styles.submitButtonDisabled : {}),
                  }}
                  className="submit-button"
                >
                  {isSaving ? (
                    <>
                      <div style={styles.buttonSpinner}></div>
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M19 21H5C4.44772 21 4 20.5523 4 20V4C4 3.44772 4.44772 3 5 3H16L20 7V20C20 20.5523 19.5523 21 19 21Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M17 21V13H7V21"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M7 3V8H15"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Enregistrer les modifications
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        <Footer />
      </div>
    </>
  )
}

const styles = {
  container: {
    backgroundColor: "#f8fafc",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },

  mainContent: {
    flex: 1,
    padding: "40px 20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
  },

  formContainer: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
    maxWidth: "800px",
    width: "100%",
    overflow: "hidden",
    border: "1px solid #e2e8f0",
  },

  header: {
    background: "linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)",
    padding: "40px",
    textAlign: "center",
    color: "white",
  },

  headerIcon: {
    marginBottom: "16px",
    display: "flex",
    justifyContent: "center",
  },

  title: {
    fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
    fontWeight: "800",
    margin: "0 0 8px 0",
    letterSpacing: "-0.02em",
  },

  subtitle: {
    fontSize: "1.1rem",
    margin: 0,
    opacity: 0.9,
    fontWeight: "400",
  },

  form: {
    padding: "40px",
  },

  section: {
    marginBottom: "40px",
    paddingBottom: "30px",
    borderBottom: "1px solid #e2e8f0",
  },

  sectionTitle: {
    fontSize: "1.3rem",
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: "24px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "24px",
    marginBottom: "24px",
  },

  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  label: {
    fontSize: "0.95rem",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "4px",
  },

  input: {
    padding: "14px 16px",
    borderRadius: "8px",
    border: "2px solid #e2e8f0",
    fontSize: "1rem",
    transition: "all 0.2s ease",
    backgroundColor: "#ffffff",
    outline: "none",
    fontFamily: "inherit",
  },

  inputError: {
    borderColor: "#ef4444",
    backgroundColor: "#fef2f2",
  },

  textarea: {
    padding: "14px 16px",
    borderRadius: "8px",
    border: "2px solid #e2e8f0",
    fontSize: "1rem",
    transition: "all 0.2s ease",
    backgroundColor: "#ffffff",
    outline: "none",
    fontFamily: "inherit",
    resize: "vertical",
    minHeight: "120px",
  },

  charCount: {
    fontSize: "0.85rem",
    color: "#6b7280",
    textAlign: "right",
    marginTop: "4px",
  },

  fieldError: {
    fontSize: "0.85rem",
    color: "#ef4444",
    marginTop: "4px",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },

  checkboxGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },

  checkboxContainer: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    padding: "16px",
    backgroundColor: "#f8fafc",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
  },

  checkbox: {
    width: "18px",
    height: "18px",
    marginTop: "2px",
    accentColor: "#ff6b35",
  },

  checkboxLabel: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    cursor: "pointer",
    flex: 1,
  },

  checkboxText: {
    fontSize: "1rem",
    fontWeight: "600",
    color: "#1e293b",
  },

  checkboxDescription: {
    fontSize: "0.9rem",
    color: "#6b7280",
    lineHeight: "1.4",
  },

  actionButtons: {
    display: "flex",
    gap: "16px",
    justifyContent: "flex-end",
    paddingTop: "30px",
    borderTop: "1px solid #e2e8f0",
    marginTop: "40px",
  },

  cancelButton: {
    padding: "12px 24px",
    borderRadius: "8px",
    border: "2px solid #e2e8f0",
    backgroundColor: "#ffffff",
    color: "#6b7280",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  submitButton: {
    padding: "12px 24px",
    borderRadius: "8px",
    border: "none",
    background: "linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)",
    color: "#ffffff",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    boxShadow: "0 4px 12px rgba(255, 107, 53, 0.3)",
  },

  submitButtonDisabled: {
    opacity: 0.7,
    cursor: "not-allowed",
    transform: "none",
  },

  buttonSpinner: {
    width: "16px",
    height: "16px",
    border: "2px solid transparent",
    borderTop: "2px solid currentColor",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },

  successMessage: {
    padding: "16px",
    backgroundColor: "#f0fdf4",
    border: "1px solid #bbf7d0",
    borderRadius: "8px",
    color: "#166534",
    fontSize: "0.95rem",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "24px",
  },

  errorMessage: {
    padding: "16px",
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "8px",
    color: "#dc2626",
    fontSize: "0.95rem",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "24px",
  },

  loadingContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 20px",
  },

  loadingSpinner: {
    position: "relative",
    width: "60px",
    height: "60px",
    marginBottom: "20px",
  },

  spinnerRing: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    border: "3px solid transparent",
    borderTop: "3px solid #ff6b35",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },

  loadingText: {
    fontSize: "1.1rem",
    color: "#6b7280",
    fontWeight: "500",
  },
}

const responsiveStyles = `
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

/* Tablet Styles */
@media (max-width: 1024px) {
    .main-content {
        padding: 30px 15px !important;
    }
    
    .form-container {
        max-width: 100% !important;
    }
    
    .form-grid {
        grid-template-columns: 1fr !important;
        gap: 20px !important;
    }
}

/* Mobile Styles */
@media (max-width: 768px) {
    .main-content {
        padding: 20px 10px !important;
    }
    
    .form-container {
        border-radius: 12px !important;
        margin: 0 !important;
    }
    
    .title {
        font-size: 1.8rem !important;
    }
    
    .profile-form {
        padding: 30px 20px !important;
    }
    
    .form-grid {
        grid-template-columns: 1fr !important;
        gap: 16px !important;
        margin-bottom: 20px !important;
    }
    
    .action-buttons {
        flex-direction: column-reverse !important;
        gap: 12px !important;
    }
    
    .cancel-button,
    .submit-button {
        width: 100% !important;
        justify-content: center !important;
        padding: 14px 20px !important;
    }
    
    .checkbox-group {
        gap: 12px !important;
    }
    
    .checkbox-container {
        padding: 12px !important;
    }
}

/* Small Mobile Styles */
@media (max-width: 480px) {
    .main-content {
        padding: 15px 5px !important;
    }
    
    .profile-form {
        padding: 25px 15px !important;
    }
    
    .title {
        font-size: 1.6rem !important;
    }
    
    .form-input,
    .form-textarea {
        padding: 12px 14px !important;
        font-size: 0.95rem !important;
    }
    
    .section {
        margin-bottom: 30px !important;
        padding-bottom: 20px !important;
    }
}

/* Focus and Hover States */
.form-input:focus,
.form-textarea:focus {
    border-color: #ff6b35 !important;
    box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1) !important;
}

.cancel-button:hover {
    background-color: #f8fafc !important;
    border-color: #cbd5e1 !important;
    color: #475569 !important;
}

.submit-button:hover:not(:disabled) {
    transform: translateY(-2px) !important;
    box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4) !important;
}

.submit-button:active:not(:disabled) {
    transform: translateY(0) !important;
}

.checkbox-container:hover {
    background-color: #f1f5f9 !important;
    border-color: #cbd5e1 !important;
}

/* Loading Animation */
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

.form-container {
    animation: fadeIn 0.5s ease-out !important;
}

.success-message,
.error-message {
    animation: fadeIn 0.3s ease-out !important;
}
`

export default EditRecruiterProfile
