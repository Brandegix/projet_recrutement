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

        <div style={styles.mainContent} className="main-contents">
          <div style={styles.formContainer} className="form-container">
            {/* Header Section */}
            <div style={styles.header}>
              <div style={styles.headerIcon}>
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
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

            <div style={styles.form} className="profile-form">
              {/* Success Message */}
              {successMessage && (
                <div style={styles.successMessage} className="success-message">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
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
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
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
              <form onSubmit={handleSubmit}>
                {/* Personal Information Section */}
                <div style={styles.section}>
                  <h3 style={styles.sectionTitle}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="#ff6b35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 14C7.58172 14 4 17.5817 4 22H20C20 17.5817 16.4183 14 12 14Z" stroke="#ff6b35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Informations personnelles
                  </h3>

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
                      {errors.name && <span style={styles.fieldError}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        {errors.name}
                      </span>}
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
                      {errors.email && <span style={styles.fieldError}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        {errors.email}
                      </span>}
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
                    {errors.phoneNumber && <span style={styles.fieldError}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {errors.phoneNumber}
                    </span>}
                  </div>
                </div>

                {/* Company Information Section */}
                <div style={styles.section}>
                  <h3 style={styles.sectionTitle}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7Z" stroke="#ff6b35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M7 9H17" stroke="#ff6b35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M7 13H17" stroke="#ff6b35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M7 17H17" stroke="#ff6b35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Informations de l'entreprise
                  </h3>

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
                    {errors.companyName && <span style={styles.fieldError}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {errors.companyName}
                    </span>}
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
                      maxLength={500}
                    />
                    <div style={styles.charCount}>{(profile.description || "").length}/500 caractères</div>
                  </div>
                </div>

                {/* Privacy Settings Section */}
                <div style={styles.section}>
                  <h3 style={styles.sectionTitle}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 11C12.5523 11 13 10.5523 13 10C13 9.44772 12.5523 9 12 9C11.4477 9 11 9.44772 11 10C11 10.5523 11.4477 11 12 11Z" stroke="#ff6b35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21ZM12 21V19C10.8954 19 10 18.1046 10 17C10 15.8954 10.8954 15 12 15C13.1046 15 14 15.8954 14 17C14 18.1046 14.8954 19 16 19V21" stroke="#ff6b35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Paramètres de confidentialité
                  </h3>

                  <div style={styles.checkboxGroup} className="checkbox-group">
                    <div style={styles.checkboxContainer}>
                      <input
                        type="checkbox"
                        id="public_profile"
                        name="public_profile"
                        checked={profile.public_profile}
                        onChange={handleChange}
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
                    style={styles.submitButtons}
                    className="cancel-buttons"
                  >
                    Annuler
                  </button>

                  <button
                    type="submit"
                    disabled={isSaving}
                    style={{
                      ...styles.submitButtons,
                      ...(isSaving ? styles.submitButtonDisabled : {}),
                    }}
                    className="submit-buttons"
                  >
                    {isSaving ? (
                      <>
                        <div style={styles.buttonSpinner}></div>
                        Enregistrement...
                      </>
                    ) : (
                      <>
                      
                        Enregistrer
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}

const styles = {
  container: {
    backgroundColor: "#f8fafc",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    fontFamily: "'Inter', sans-serif", // Added a modern font
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
    borderRadius: "18px", // Slightly larger border-radius
    boxShadow: "0 12px 30px rgba(0, 0, 0, 0.08)", // Softer, more spread out shadow
    maxWidth: "850px", // Slightly wider form
    width: "100%",
    overflow: "hidden",
    border: "1px solid #e2e8f0",
  },

  header: {
    background: "linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)",
    padding: "45px 40px", // Increased padding
    textAlign: "center",
    color: "white",
  },

  headerIcon: {
    marginBottom: "18px", // Increased margin
    display: "flex",
    justifyContent: "center",
  },

  title: {
    fontSize: "clamp(2rem, 4vw, 2.8rem)", // Larger title with better clamping
    fontWeight: "800",
    margin: "0 0 10px 0", // Increased margin
    letterSpacing: "-0.03em", // Tighter letter spacing
  },

  subtitle: {
    fontSize: "1.15rem", // Slightly larger subtitle
    margin: 0,
    opacity: 0.95, // Slightly less transparent
    fontWeight: "400",
    lineHeight: "1.5",
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
    fontSize: "1.4rem", // Larger section titles
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: "28px", // Increased margin
    display: "flex",
    alignItems: "center",
    gap: "10px", // Increased gap for icon
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "30px", // Increased gap
    marginBottom: "24px",
  },

  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  label: {
    fontSize: "0.98rem", // Slightly larger label font size
    fontWeight: "600",
    color: "#374151",
    marginBottom: "4px",
  },

  input: {
    padding: "15px 18px", // Increased padding
    borderRadius: "10px", // Slightly larger border-radius
    border: "2px solid #e2e8f0",
    fontSize: "1rem",
    transition: "all 0.3s ease", // Smoother transition
    backgroundColor: "#ffffff",
    outline: "none",
    fontFamily: "inherit",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)", // Subtle input shadow
  },

  inputError: {
    borderColor: "#ef4444",
    backgroundColor: "#fef2f2",
    boxShadow: "0 0 0 3px rgba(239, 68, 68, 0.1)", // Error focus ring
  },

  textarea: {
    padding: "15px 18px", // Increased padding
    borderRadius: "10px", // Slightly larger border-radius
    border: "2px solid #e2e8f0",
    fontSize: "1rem",
    transition: "all 0.3s ease",
    backgroundColor: "#ffffff",
    outline: "none",
    fontFamily: "inherit",
    resize: "vertical",
    minHeight: "140px", // Slightly taller textarea
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  },

  charCount: {
    fontSize: "0.85rem",
    color: "#6b7280",
    textAlign: "right",
    marginTop: "6px", // Increased margin
  },

  fieldError: {
    fontSize: "0.88rem", // Slightly larger error text
    color: "#ef4444",
    marginTop: "6px", // Increased margin
    display: "flex",
    alignItems: "center",
    gap: "6px", // Increased gap for icon
    fontWeight: "500",
  },

  checkboxGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "20px", // Increased gap
  },

  checkboxContainer: {
    display: "flex",
    alignItems: "flex-start",
    gap: "15px", // Increased gap
    padding: "18px", // Increased padding
    backgroundColor: "#f8fafc",
    borderRadius: "10px", // Larger border-radius
    border: "1px solid #e2e8f0",
    transition: "all 0.2s ease",
  },

  checkbox: {
    width: "20px", // Slightly larger checkbox
    height: "20px",
    marginTop: "2px",
    accentColor: "#ff6b35",
    cursor: "pointer",
  },

  checkboxLabel: {
    display: "flex",
    flexDirection: "column",
    gap: "5px", // Increased gap
    cursor: "pointer",
    flex: 1,
  },

  checkboxText: {
    fontSize: "1.05rem", // Slightly larger text
    fontWeight: "600",
    color: "#1e293b",
  },

  checkboxDescription: {
    fontSize: "0.92rem", // Slightly larger description
    color: "#6b7280",
    lineHeight: "1.4",
  },

  actionButtons: {
    display: "flex",
    gap: "20px", // Increased gap
    justifyContent: "flex-end",
    paddingTop: "35px", // Increased padding
    borderTop: "1px solid #e2e8f0",
    marginTop: "40px",
  },

  cancelButtons: {
     padding: "13px 26px", // Increased padding
    borderRadius: "10px", // Larger border-radius
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
    boxShadow: "0 6px 16px rgba(255, 107, 53, 0.3)", // More prominent shadow
    "&:hover": {
      backgroundColor: "#f0f4f8", // More distinct hover
      borderColor: "#94a3b8",
      color: "#1e293b",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    }
  },

  submitButtons: {
    padding: "13px 26px", // Increased padding
    borderRadius: "10px", // Larger border-radius
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
    boxShadow: "0 6px 16px rgba(255, 107, 53, 0.3)", // More prominent shadow
  },

  submitButtonDisabled: {
    opacity: 0.6, // More opaque when disabled
    cursor: "not-allowed",
    transform: "none",
    boxShadow: "none",
  },

  buttonSpinner: {
    width: "18px", // Slightly larger spinner
    height: "18px",
    border: "2px solid transparent",
    borderTop: "2px solid currentColor",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },

  successMessage: {
    padding: "18px", // Increased padding
    backgroundColor: "#f0fdf4",
    border: "1px solid #bbf7d0",
    borderRadius: "10px", // Larger border-radius
    color: "#16a34a", // Darker green
    fontSize: "1rem", // Slightly larger font
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    gap: "10px", // Increased gap
    marginBottom: "28px", // Increased margin
    boxShadow: "0 2px 8px rgba(0,128,0,0.08)",
  },

  errorMessage: {
    padding: "18px", // Increased padding
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "10px", // Larger border-radius
    color: "#dc2626",
    fontSize: "1rem",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "28px",
    boxShadow: "0 2px 8px rgba(255,0,0,0.08)",
  },

  loadingContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "80px 20px", // More vertical padding
  },

  loadingSpinner: {
    position: "relative",
    width: "70px", // Larger spinner
    height: "70px",
    marginBottom: "25px", // Increased margin
  },

  spinnerRing: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    border: "4px solid transparent", // Thicker border
    borderTop: "4px solid #ff6b35",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },

  loadingText: {
    fontSize: "1.2rem", // Larger text
    color: "#475569", // Darker grey
    fontWeight: "500",
  },
};

const responsiveStyles = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

.form-container {
    animation: fadeIn 0.6s ease-out;
}

.success-message,
.error-message {
    animation: fadeIn 0.4s ease-out;
}

/* Base styles for focus and hover states */
.form-input:focus,
.form-textarea:focus {
    border-color: #ff6b35 !important;
    box-shadow: 0 0 0 4px rgba(255, 107, 53, 0.15) !important; /* Stronger, more vibrant focus ring */
}

.cancel-button:hover {
    background-color: #f0f4f8 !important;
    border-color: #94a3b8 !important;
    color: #1e293b !important;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
}

.submit-button:hover:not(:disabled) {
    transform: translateY(-3px) !important; /* More pronounced lift */
    box-shadow: 0 8px 24px rgba(255, 107, 53, 0.45) !important; /* More pronounced shadow */
}

.submit-button:active:not(:disabled) {
    transform: translateY(0) !important;
    box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3) !important;
}

.checkbox-container:hover {
    background-color: #eef2f6 !important; /* Lighter hover */
    border-color: #cbd5e1 !important;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05); /* Subtle shadow on hover */
}


/* Tablet Styles (max-width: 1024px) */
@media (max-width: 1024px) {
    .main-contents {
        padding: 0px !important;
    }
    
    .form-container {
        max-width: 90% !important; /* Slightly more constrained on tablets */
        border-radius: 16px !important;
    }
    
    .form-grid {
        grid-template-columns: 1fr !important; /* Stack columns */
        gap: 25px !important;
    }

    ${Object.keys(styles).map(key => {
        if (typeof styles[key] === 'object' && styles[key]['&:hover']) {
            return `.${key}:hover { ${Object.entries(styles[key]['&:hover']).map(([prop, val]) => `${prop}: ${val}`).join('; ')} }`;
        }
        return '';
    }).join('')}
}

/* Mobile Styles (max-width: 768px) */
@media (max-width: 768px) {
    .main-content {
        padding: 25px 10px !important;
    }
    
    .form-container {
        border-radius: 12px !important;
        margin: 0 !important;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.07) !important; /* Slightly less shadow on mobile */
    }
    
    .header {
        padding: 35px 25px !important;
    }

    .title {
        font-size: 2rem !important; /* Adjust title size for mobile */
    }
    
    .subtitle {
        font-size: 1rem !important;
    }

    .profile-form {
        padding: 30px 25px !important;
    }
    
    .sectionTitle {
        font-size: 1.25rem !important;
        margin-bottom: 20px !important;
    }

    .input,
    .textarea {
        padding: 14px 16px !important;
        font-size: 0.95rem !important;
        border-radius: 8px !important;
    }
    
    .action-buttons {
        flex-direction: column-reverse !important;
        gap: 15px !important;
        padding-top: 25px !important;
    }
    
    .cancel-buttons,
    .submit-buttons {
        width: 100% !important;
        justify-content: center !important;
        padding: 15px 20px !important;
        font-size: 0.95rem !important;
        border-radius: 8px !important;
    }
    
    .checkbox-group {
        gap: 15px !important;
    }
    
    .checkbox-container {
        padding: 15px !important;
        border-radius: 8px !important;
        gap: 10px !important;
    }
    
    .checkbox-text {
        font-size: 0.95rem !important;
    }
    .checkbox-description {
        font-size: 0.85rem !important;
    }

    .success-message,
    .error-message {
        padding: 15px !important;
        font-size: 0.9rem !important;
        margin-bottom: 20px !important;
    }
}

/* Small Mobile Styles (max-width: 480px) */
@media (max-width: 480px) {
    .main-content {
        padding: 15px 5px !important;
    }
    
    .profile-form {
        padding: 20px 15px !important;
    }
    
    .title {
        font-size: 1.8rem !important;
    }
    
    .header {
        padding: 30px 20px !important;
    }

    .section {
        margin-bottom: 25px !important;
        padding-bottom: 15px !important;
    }

    .sectionTitle {
        font-size: 1.15rem !important;
    }

    .input-group {
        gap: 6px !important;
    }
    
    .label {
        font-size: 0.9rem !important;
    }

    .fieldError {
        font-size: 0.8rem !important;
        gap: 4px !important;
    }

    .loadingContainer {
        padding: 40px 10px !important;
    }

    .loadingSpinner {
        width: 50px !important;
        height: 50px !important;
    }

    .spinnerRing {
        border-width: 3px !important;
    }

    .loadingText {
        font-size: 1rem !important;
    }
}
`;

export default EditRecruiterProfile;
