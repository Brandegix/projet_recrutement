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
          {/* Background decorative elements */}
          <div style={styles.backgroundDecor} className="bg-decor"></div>
          
          <div style={styles.formContainer} className="form-container">
            {/* Header Section */}
            <div style={styles.header}>
              <div style={styles.headerPattern}></div>
              <div style={styles.headerContent}>
                <div style={styles.headerIcon}>
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
                      fill="white"
                    />
                    <path d="M12 14C7.58172 14 4 17.5817 4 22H20C20 17.5817 16.4183 14 12 14Z" fill="white" />
                  </svg>
                </div>
                <h1 style={styles.title} className="title">
                  Modifier votre profil
                </h1>
                <p style={styles.subtitle}>Mettez à jour vos informations professionnelles</p>
              </div>
            </div>

            {/* Success Message */}
            {successMessage && (
              <div style={styles.successMessage} className="success-message">
                <div style={styles.messageIcon}>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
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
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
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
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3 style={styles.sectionTitle}>Informations personnelles</h3>
                </div>

                <div style={styles.formGrid} className="form-grid">
                  <div style={styles.inputGroup} className="input-group">
                    <label htmlFor="name" style={styles.label}>
                      Nom complet *
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
                      <div style={styles.inputBorder}></div>
                    </div>
                    {errors.name && <span style={styles.fieldError}>{errors.name}</span>}
                  </div>

                  <div style={styles.inputGroup} className="input-group">
                    <label htmlFor="email" style={styles.label}>
                      Adresse email *
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
                      <div style={styles.inputBorder}></div>
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
                    <div style={styles.inputBorder}></div>
                  </div>
                  {errors.phoneNumber && <span style={styles.fieldError}>{errors.phoneNumber}</span>}
                </div>
              </div>

              {/* Company Information Section */}
              <div style={styles.section}>
                <div style={styles.sectionHeader}>
                  <div style={styles.sectionIcon}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 21H21" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M5 21V7L13 2L21 7V21" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M9 9V21" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M17 9V21" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3 style={styles.sectionTitle}>Informations de l'entreprise</h3>
                </div>

                <div style={styles.inputGroup} className="input-group">
                  <label htmlFor="companyName" style={styles.label}>
                    Nom de l'entreprise *
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
                    <div style={styles.inputBorder}></div>
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
                    <div style={styles.inputBorder}></div>
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
                    />
                    <div style={styles.inputBorder}></div>
                  </div>
                  <div style={styles.charCount}>{(profile.description || "").length}/500 caractères</div>
                </div>
              </div>

              {/* Privacy Settings Section */}
              <div style={styles.section}>
                <div style={styles.sectionHeader}>
                  <div style={styles.sectionIcon}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3 style={styles.sectionTitle}>Paramètres de confidentialité</h3>
                </div>

                <div style={styles.checkboxGroup} className="checkbox-group">
                  <div style={styles.checkboxContainer}>
                    <div style={styles.customCheckbox}>
                      <input
                        type="checkbox"
                        id="public_profile"
                        name="public_profile"
                        checked={profile.public_profile}
                        onChange={handleChange}
                        style={styles.hiddenCheckbox}
                      />
                      <div style={styles.checkboxVisual}>
                        {profile.public_profile && (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
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
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
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
  );
}

const styles = {
  container: {
    backgroundColor: "#0a0a0a",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    position: "relative",
  },

  mainContent: {
    flex: 1,
    padding: "60px 20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    position: "relative",
  },

  backgroundDecor: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "300px",
    background: "linear-gradient(135deg, rgba(255, 107, 53, 0.1) 0%, rgba(255, 140, 66, 0.05) 100%)",
    zIndex: 0,
  },

  formContainer: {
    backgroundColor: "#ffffff",
    borderRadius: "24px",
    boxShadow: "0 25px 50px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 107, 53, 0.1)",
    maxWidth: "900px",
    width: "100%",
    overflow: "hidden",
    position: "relative",
    zIndex: 1,
    border: "1px solid rgba(255, 107, 53, 0.1)",
  },

  header: {
    background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
    padding: "50px 40px",
    textAlign: "center",
    color: "white",
    position: "relative",
    overflow: "hidden",
  },

  headerPattern: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(circle at 20% 50%, rgba(255, 107, 53, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 140, 66, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 80%, rgba(255, 107, 53, 0.05) 0%, transparent 50%)
    `,
  },

  headerContent: {
    position: "relative",
    zIndex: 1,
  },

  headerIcon: {
    marginBottom: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "80px",
    height: "80px",
    background: "linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%)",
    borderRadius: "20px",
    margin: "0 auto 20px",
    boxShadow: "0 10px 30px rgba(255, 107, 53, 0.3)",
  },

  title: {
    fontSize: "clamp(2rem, 5vw, 3rem)",
    fontWeight: "800",
    margin: "0 0 12px 0",
    letterSpacing: "-0.02em",
    background: "linear-gradient(135deg, #ffffff 0%, #f1f1f1 100%)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  subtitle: {
    fontSize: "1.2rem",
    margin: 0,
    opacity: 0.8,
    fontWeight: "400",
    color: "#e5e5e5",
  },

  form: {
    padding: "50px 40px",
    background: "linear-gradient(to bottom, #ffffff 0%, #fafafa 100%)",
  },

  section: {
    marginBottom: "50px",
    paddingBottom: "40px",
    borderBottom: "2px solid #f5f5f5",
    position: "relative",
  },

  sectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "32px",
  },

  sectionIcon: {
    width: "48px",
    height: "48px",
    backgroundColor: "#fff5f0",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "2px solid #ffe5d6",
  },

  sectionTitle: {
    fontSize: "1.5rem",
    fontWeight: "700",
    color: "#1a1a1a",
    margin: 0,
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "32px",
    marginBottom: "32px",
  },

  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  label: {
    fontSize: "1rem",
    fontWeight: "600",
    color: "#2d2d2d",
    marginBottom: "8px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  inputWrapper: {
    position: "relative",
  },

  textareaWrapper: {
    position: "relative",
  },

  input: {
    padding: "18px 20px",
    borderRadius: "12px",
    border: "2px solid #e5e5e5",
    fontSize: "1rem",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    backgroundColor: "#ffffff",
    outline: "none",
    fontFamily: "inherit",
    width: "100%",
    boxSizing: "border-box",
  },

  inputBorder: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "2px",
    background: "linear-gradient(90deg, #FF6B35 0%, #FF8C42 100%)",
    transform: "scaleX(0)",
    transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    borderRadius: "0 0 12px 12px",
  },

  inputError: {
    borderColor: "#ef4444",
    backgroundColor: "#fef2f2",
  },

  textarea: {
    padding: "18px 20px",
    borderRadius: "12px",
    border: "2px solid #e5e5e5",
    fontSize: "1rem",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    backgroundColor: "#ffffff",
    outline: "none",
    fontFamily: "inherit",
    resize: "vertical",
    minHeight: "140px",
    width: "100%",
    boxSizing: "border-box",
  },

  charCount: {
    fontSize: "0.9rem",
    color: "#6b7280",
    textAlign: "right",
    marginTop: "8px",
    fontWeight: "500",
  },

  fieldError: {
    fontSize: "0.9rem",
    color: "#ef4444",
    marginTop: "6px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontWeight: "500",
  },

  checkboxGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  checkboxContainer: {
    display: "flex",
    alignItems: "flex-start",
    gap: "16px",
    padding: "24px",
    backgroundColor: "#fafafa",
    borderRadius: "16px",
    border: "2px solid #f0f0f0",
    transition: "all 0.3s ease",
    cursor: "pointer",
  },

  customCheckbox: {
    position: "relative",
    marginTop: "2px",
  },

  hiddenCheckbox: {
    position: "absolute",
    opacity: 0,
    cursor: "pointer",
    height: 0,
    width: 0,
  },

  checkboxVisual: {
    width: "24px",
    height: "24px",
    backgroundColor: "#ffffff",
    border: "2px solid #e5e5e5",
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease",
  },

  checkboxLabel: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    cursor: "pointer",
    flex: 1,
  },

  checkboxText: {
    fontSize: "1.1rem",
    fontWeight: "600",
    color: "#1a1a1a",
  },

  checkboxDescription: {
    fontSize: "0.95rem",
    color: "#6b7280",
    lineHeight: "1.5",
  },

  actionButtons: {
    display: "flex",
    gap: "20px",
    justifyContent: "flex-end",
    paddingTop: "40px",
    borderTop: "2px solid #f5f5f5",
    marginTop: "50px",
  },

  cancelButton: {
    padding: "16px 32px",
    borderRadius: "12px",
    border: "2px solid #e5e5e5",
    backgroundColor: "#ffffff",
    color: "#6b7280",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    display: "flex",
    alignItems: "center",
    gap: "10px",
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
};

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
`;

export default EditRecruiterProfile;
