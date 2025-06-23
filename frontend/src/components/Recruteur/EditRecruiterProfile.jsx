"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbara";
import Footer from "../Footer";

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
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/api/recruiter/profile`,
          {
            credentials: "include",
          }
        );
        if (res.ok) {
          const data = await res.json();
          setProfile({
            ...data,
            description: data.description || "",
            public_profile: data.public_profile || false,
          });
        } else {
          setErrors({ general: "Erreur lors du chargement du profil" });
        }
      } catch (error) {
        setErrors({ general: "Erreur de connexion" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!profile.name.trim()) {
      newErrors.name = "Le nom est requis";
    }

    if (!profile.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(profile.email)) {
      newErrors.email = "Format d'email invalide";
    }

    if (!profile.companyName.trim()) {
      newErrors.companyName = "Le nom de l'entreprise est requis";
    }

    if (profile.phoneNumber && !/^[\d\s\-+]+$/.test(profile.phoneNumber)) {
      newErrors.phoneNumber = "Format de téléphone invalide";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile({
      ...profile,
      [name]: type === "checkbox" ? checked : value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSaving(true);
      setErrors({});

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/recruiter/update_profile`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(profile),
        }
      );

      if (res.ok) {
        const updatedProfile = await res.json();
        setProfile(updatedProfile);
        setSuccessMessage("Profil mis à jour avec succès !");

        setTimeout(() => {
          navigate("/RecruiterProfile");
        }, 1500);
      } else {
        const errorData = await res.json();
        setErrors({ general: errorData.message || "Erreur lors de la mise à jour" });
      }
    } catch (error) {
      setErrors({ general: "Erreur de connexion" });
    } finally {
      setIsSaving(false);
    }
  };

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
    );
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
              <div style={styles.headerContent}>
                <div style={styles.headerIcon}>
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="12" cy="7" r="4" fill="currentColor" />
                    <path d="M12 14c-5.33 0-8 2.67-8 8v2h16v-2c0-5.33-2.67-8-8-8z" fill="currentColor" />
                  </svg>
                </div>
                <div style={styles.headerText}>
                  <h1 style={styles.title} className="title">
                    Modifier votre profil
                  </h1>
                  <p style={styles.subtitle}>
                    Mettez à jour vos informations professionnelles
                  </p>
                </div>
              </div>
              <div style={styles.headerDecoration}></div>
            </div>

            {/* Success Message */}
            {successMessage && (
              <div style={styles.successMessage} className="success-message">
                <div style={styles.messageIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span>{successMessage}</span>
              </div>
            )}

            {/* General Error */}
            {errors.general && (
              <div style={styles.errorMessage} className="error-message">
                <div style={styles.messageIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span>{errors.general}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} style={styles.form} className="profile-form">
              {/* Personal Information Section */}
              <div style={styles.section}>
                <div style={styles.sectionHeader}>
                  <div style={styles.sectionIcon}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </div>
                  <h3 style={styles.sectionTitle}>Informations personnelles</h3>
                </div>

                <div style={styles.formGrid} className="form-grid">
                  <div style={styles.inputGroup} className="input-group">
                    <label htmlFor="name" style={styles.label}>
                      Nom complet <span style={styles.required}>*</span>
                    </label>
                    <div style={styles.inputWrapper}>
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
                      <div style={styles.inputIcon}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
                          <path d="M12 14c-5.33 0-8 2.67-8 8v2h16v-2c0-5.33-2.67-8-8-8z" stroke="currentColor" strokeWidth="2" />
                        </svg>
                      </div>
                    </div>
                    {errors.name && <span style={styles.fieldError}>{errors.name}</span>}
                  </div>

                  <div style={styles.inputGroup} className="input-group">
                    <label htmlFor="email" style={styles.label}>
                      Adresse email <span style={styles.required}>*</span>
                    </label>
                    <div style={styles.inputWrapper}>
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
                      <div style={styles.inputIcon}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path
                            d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                          <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" />
                        </svg>
                      </div>
                    </div>
                    {errors.email && <span style={styles.fieldError}>{errors.email}</span>}
                  </div>
                </div>

                <div style={styles.inputGroup} className="input-group">
                  <label htmlFor="phoneNumber" style={styles.label}>
                    Numéro de téléphone
                  </label>
                  <div style={styles.inputWrapper}>
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
                    <div style={styles.inputIcon}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M22 16.92V19.92C22 20.52 21.52 21 20.92 21C9.4 21 1 12.6 1 1.08C1 0.48 1.48 0 2.08 0H5.08C5.68 0 6.16 0.48 6.16 1.08C6.16 2.25 6.35 3.39 6.72 4.47C6.86 4.84 6.74 5.26 6.41 5.54L4.84 6.91C6.21 9.97 9.03 12.79 12.09 14.16L13.46 12.59C13.74 12.26 14.16 12.14 14.53 12.28C15.61 12.65 16.75 12.84 17.92 12.84C18.52 12.84 19 13.32 19 13.92V16.92Z"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                      </svg>
                    </div>
                  </div>
                  {errors.phoneNumber && <span style={styles.fieldError}>{errors.phoneNumber}</span>}
                </div>
              </div>

              {/* Company Information Section */}
              <div style={styles.section}>
                <div style={styles.sectionHeader}>
                  <div style={styles.sectionIcon}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M3 21H21M5 21V7L13 3L21 7V21M9 9H11M9 12H11M9 15H11M15 9H17M15 12H17M15 15H17"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <h3 style={styles.sectionTitle}>Informations de l'entreprise</h3>
                </div>

                <div style={styles.inputGroup} className="input-group">
                  <label htmlFor="companyName" style={styles.label}>
                    Nom de l'entreprise <span style={styles.required}>*</span>
                  </label>
                  <div style={styles.inputWrapper}>
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
                    <div style={styles.inputIcon}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M3 21H21M5 21V7L13 3L21 7V21"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                  {errors.companyName && <span style={styles.fieldError}>{errors.companyName}</span>}
                </div>

                <div style={styles.inputGroup} className="input-group">
                  <label htmlFor="address" style={styles.label}>
                    Adresse de l'entreprise
                  </label>
                  <div style={styles.inputWrapper}>
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
                    <div style={styles.inputIcon}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M21 10C21 17 12 23 12 23S3 17 3 10C3 5.03 7.03 1 12 1S21 5.03 21 10Z"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div style={styles.inputGroup} className="input-group">
                  <label htmlFor="description" style={styles.label}>
                    Description de l'entreprise
                  </label>
                  <div style={styles.textareaWrapper}>
                    <textarea
                      id="description"
                      name="description"
                      value={profile.description}
                      onChange={handleChange}
                      placeholder="Décrivez votre entreprise, ses activités, sa culture..."
                      rows={5}
                      style={styles.textarea}
                      className="form-textarea"
                      maxLength={500}
                    />
                    <div style={styles.textareaIcon}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" />
                        <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" />
                        <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" />
                        <polyline points="10,9 9,9 8,9" stroke="currentColor" strokeWidth="2" />
                      </svg>
                    </div>
                  </div>
                  <div style={styles.charCount}>
                    {(profile.description || "").length}/500 caractères
                  </div>
                </div>
              </div>

              {/* Privacy Settings Section */}
              <div style={styles.section}>
                <div style={styles.sectionHeader}>
                  <div style={styles.sectionIcon}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 22S8 18 8 13V7L12 5L16 7V13C16 18 12 22 12 22Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <h3 style={styles.sectionTitle}>Paramètres de confidentialité</h3>
                </div>

                <div style={styles.checkboxGroup} className="checkbox-group">
                  <div style={styles.checkboxContainer}>
                    <div style={styles.checkboxWrapper}>
                      <input
                        type="checkbox"
                        id="public_profile"
                        name="public_profile"
                        checked={profile.public_profile}
                        onChange={handleChange}
                        style={styles.checkbox}
                        className="custom-checkbox"
                      />
                      <div style={styles.checkboxIndicator} className="checkbox-indicator">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                          <polyline points="20,6 9,17 4,12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </div>
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
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
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
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M19 21H5C4.44772 21 4 20.5523 4 20V4C4 3.44772 4.44772 3 5 3H16L20 7V20C20 20.5523 19.5523 21 19 21Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path d="M17 21V13H7V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M7 3V8H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
  );
}

const styles = {
  container: {
    backgroundColor: "#fafafa",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },

  mainContent: {
    flex: 1,
    padding: "2rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
  },

  formContainer: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    maxWidth: "900px",
    width: "100%",
    overflow: "hidden",
    border: "1px solid #e5e7eb",
  },

  header: {
    background: "linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)",
    padding: "3rem 2rem",
    position: "relative",
    overflow: "hidden",
  },

  headerContent: {
    display: "flex",
    alignItems: "center",
    gap: "1.5rem",
    position: "relative",
    zIndex: 2,
  },

  headerIcon: {
    width: "80px",
    height: "80px",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
  },

  headerText: {
    flex: 1,
  },

  title: {
    fontSize: "clamp(2rem, 5vw, 3rem)",
    fontWeight: "800",
    margin: "0 0 0.5rem 0",
    color: "white",
    letterSpacing: "-0.02em",
    lineHeight: "1.2",
  },

  subtitle: {
    fontSize: "1.125rem",
    margin: 0,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "400",
    lineHeight: "1.4",
  },

  headerDecoration: {
    position: "absolute",
    top: "-50%",
    right: "-20%",
    width: "40%",
    height: "200%",
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: "50%",
    transform: "rotate(15deg)",
  },

  form: {
    padding: "2.5rem",
  },

  section: {
    marginBottom: "3rem",
    paddingBottom: "2rem",
    borderBottom: "1px solid #f3f4f6",
  },

  sectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    marginBottom: "2rem",
  },

  sectionIcon: {
    width: "40px",
    height: "40px",
    backgroundColor: "#fff5f2",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#ff6b35",
    border: "1px solid #fed7cc",
  },

  sectionTitle: {
    fontSize: "1.5rem",
    fontWeight: "700",
    color: "#111827",
    margin: 0,
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "1.5rem",
    marginBottom: "1.5rem",
  },

  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },

  label: {
    fontSize: "0.875rem",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "0.25rem",
  },

  required: {
    color: "#ff6b35",
    fontWeight: "bold",
  },

  inputWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },

  input: {
    width: "100%",
    padding: "0.875rem 1rem",
    paddingRight: "2.5rem",
    borderRadius: "8px",
    border: "2px solid #e5e7eb",
    fontSize: "0.875rem",
    transition: "all 0.2s ease",
    backgroundColor: "#ffffff",
    outline: "none",
    fontFamily: "inherit",
  },

  inputIcon: {
    position: "absolute",
    right: "1rem",
    color: "#9ca3af",
    pointerEvents: "none",
  },

  inputError: {
    borderColor: "#ef4444",
    backgroundColor: "#fef2f2",
  },

  textareaWrapper: {
    position: "relative",
  },

  textarea: {
    width: "100%",
    padding: "0.875rem 1rem",
    paddingRight: "2.5rem",
    borderRadius: "8px",
    border: "2px solid #e5e7eb",
    fontSize: "0.875rem",
    transition: "all 0.2s ease",
    backgroundColor: "#ffffff",
    outline: "none",
    fontFamily: "inherit",
    resize: "vertical",
    minHeight: "120px",
  },

  textareaIcon: {
    position: "absolute",
    top: "1rem",
    right: "1rem",
    color: "#9ca3af",
    pointerEvents: "none",
  },

  charCount: {
    fontSize: "0.75rem",
    color: "#6b7280",
    textAlign: "right",
    marginTop: "0.25rem",
  },

  fieldError: {
    fontSize: "0.75rem",
    color: "#ef4444",
    marginTop: "0.25rem",
    display: "flex",
    alignItems: "center",
    gap: "0.25rem",
  },

  checkboxGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },

checkboxContainer: {
    display: "flex",
    alignItems: "flex-start",
    gap: "1rem",
    padding: "1.5rem",
    backgroundColor: "#f9fafb",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    transition: "all 0.2s ease",
  },

  checkboxWrapper: {
    position: "relative",
    flexShrink: 0,
  },

  checkbox: {
    position: "absolute",
    opacity: 0,
    width: "20px",
    height: "20px",
    cursor: "pointer",
  },

  checkboxIndicator: {
    width: "20px",
    height: "20px",
    borderRadius: "4px",
    border: "2px solid #d1d5db",
    backgroundColor: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
    cursor: "pointer",
  },

  checkboxLabel: {
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
    cursor: "pointer",
    flex: 1,
  },

  checkboxText: {
    fontSize: "0.875rem",
    fontWeight: "600",
    color: "#374151",
  },

  checkboxDescription: {
    fontSize: "0.75rem",
    color: "#6b7280",
    lineHeight: "1.4",
  },

  actionButtons: {
    display: "flex",
    gap: "1rem",
    justifyContent: "flex-end",
    paddingTop: "2rem",
    borderTop: "1px solid #f3f4f6",
    marginTop: "2rem",
  },

  cancelButton: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.875rem 1.5rem",
    borderRadius: "8px",
    border: "2px solid #e5e7eb",
    backgroundColor: "#ffffff",
    color: "#374151",
    fontSize: "0.875rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
    fontFamily: "inherit",
    outline: "none",
  },

  submitButton: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.875rem 1.5rem",
    borderRadius: "8px",
    border: "2px solid #ff6b35",
    backgroundColor: "#ff6b35",
    color: "#ffffff",
    fontSize: "0.875rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
    fontFamily: "inherit",
    outline: "none",
  },

  submitButtonDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
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
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "1rem 1.5rem",
    backgroundColor: "#f0fdf4",
    border: "1px solid #bbf7d0",
    borderRadius: "8px",
    color: "#166534",
    fontSize: "0.875rem",
    fontWeight: "500",
    margin: "0 2.5rem 1.5rem 2.5rem",
  },

  errorMessage: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "1rem 1.5rem",
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "8px",
    color: "#dc2626",
    fontSize: "0.875rem",
    fontWeight: "500",
    margin: "0 2.5rem 1.5rem 2.5rem",
  },

  messageIcon: {
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  loadingContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "2rem",
    padding: "4rem 2rem",
  },

  loadingSpinner: {
    position: "relative",
    width: "80px",
    height: "80px",
  },

  spinnerRing: {
    position: "absolute",
    width: "100%",
    height: "100%",
    border: "8px solid #f3f4f6",
    borderTop: "8px solid #ff6b35",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },

  loadingText: {
    fontSize: "1.125rem",
    color: "#6b7280",
    fontWeight: "500",
    margin: 0,
  },
};

const responsiveStyles = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .form-input:focus {
    border-color: #ff6b35 !important;
    box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1) !important;
  }

  .form-textarea:focus {
    border-color: #ff6b35 !important;
    box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1) !important;
  }

  .custom-checkbox:checked + .checkbox-indicator {
    background-color: #ff6b35 !important;
    border-color: #ff6b35 !important;
    color: white !important;
  }

  .custom-checkbox:focus + .checkbox-indicator {
    box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1) !important;
  }

  .cancel-button:hover {
    background-color: #f9fafb !important;
    border-color: #d1d5db !important;
  }

  .submit-button:hover:not(:disabled) {
    background-color: #ea580c !important;
    border-color: #ea580c !important;
    transform: translateY(-1px) !important;
    box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3) !important;
  }

  .checkbox-container:hover {
    background-color: #f3f4f6 !important;
  }

  @media (max-width: 768px) {
    .main-content {
      padding: 1rem !important;
    }
    
    .form-container {
      margin: 0 !important;
      border-radius: 12px !important;
    }
    
    .form-grid {
      grid-template-columns: 1fr !important;
    }
    
    .action-buttons {
      flex-direction: column !important;
      gap: 0.75rem !important;
    }
    
    .title {
      font-size: 1.875rem !important;
    }
    
    .header {
      padding: 2rem 1.5rem !important;
    }
    
    .form {
      padding: 1.5rem !important;
    }
  }

  @media (max-width: 480px) {
    .header-content {
      flex-direction: column !important;
      text-align: center !important;
      gap: 1rem !important;
    }
    
    .header-icon {
      width: 60px !important;
      height: 60px !important;
    }
    
    .section-header {
      flex-direction: column !important;
      align-items: flex-start !important;
      gap: 0.75rem !important;
    }
  }
`;
export default EditRecruiterProfile;
