"use client"

import { useEffect, useState } from "react"
import Navbar from "../Navbara"
import Footer from "../Footer"
import { useParams } from "react-router-dom"
import candidatImage from "../../assets/images/choixRole/recruiter.jpg"

function RecruiterPublicProfile() {
  const [profile, setProfile] = useState(null)
  const [jobStats, setJobStats] = useState(null)
  const [jobOffers, setJobOffers] = useState([])
  const [error, setError] = useState(null)
  const [showAbout, setShowAbout] = useState(false)
  const [showInfos, setShowInfos] = useState(false)
  const [newsletters, setNewsletters] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const { id } = useParams()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)

        const profileRes = await fetch(`${process.env.REACT_APP_API_URL}/api/recruiter/public-profile/${id}`)
        if (!profileRes.ok) throw new Error("Failed to fetch public profile")
        const profileData = await profileRes.json()

        setProfile(profileData)
        setJobStats(profileData.jobStats || null)
        setNewsletters(profileData.newsletters || [])

        const jobOffersRes = await fetch(`${process.env.REACT_APP_API_URL}/api/recruiter/${id}/last-job-offers`)
        if (jobOffersRes.ok) {
          const jobOffersData = await jobOffersRes.json()
          setJobOffers(jobOffersData)
        }

        await new Promise((resolve) => setTimeout(resolve, 1000))
      } catch (err) {
        console.error(err)
        setError("Erreur lors du chargement du profil public.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const email = e.target.email.value

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/newsletter/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          recruiter_id: id,
        }),
      })

      const result = await res.json()
      alert(result.message || "Inscription réussie !")
      e.target.reset()
    } catch (err) {
      console.error("Erreur:", err)
      alert("Erreur lors de l inscription.")
    }
  }

  const LoadingScreen = () => (
    <div style={pageStyles.loadingScreen}>
      <div style={pageStyles.loadingContainer}>
        <div style={pageStyles.loadingSpinner}>
          <div style={pageStyles.spinnerRing}></div>
          <div style={pageStyles.spinnerRing}></div>
          <div style={pageStyles.spinnerRing}></div>
        </div>
        <div style={pageStyles.loadingText}>Chargement du profil...</div>
        <div style={pageStyles.loadingSubtext}>Veuillez patienter</div>
      </div>
    </div>
  )

  if (isLoading) return <LoadingScreen />
  if (error) return <div style={pageStyles.errorMessage}>{error}</div>
  if (!profile) return <div style={pageStyles.errorMessage}>Profil non trouvé</div>

  return (
    <>
      <style>{responsiveStyles}</style>
      <Navbar />
      <div style={pageStyles.container}>
        <div style={pageStyles.profileCard} className="profile-card">
          {/* Header Section */}
          <div style={pageStyles.headerSection} className="header-section">
            <div
              style={{
                ...pageStyles.coverImageLayer,
                backgroundImage: profile?.cover_image
                  ? `url(${profile.cover_image})`
                  : "linear-gradient(135deg, #ff6b35 0%, #ff8c42 50%, #ffa366 100%)",
              }}
            />

            <div style={pageStyles.gradientOverlay}></div>
            <div style={pageStyles.premiumPattern}></div>

            <div style={pageStyles.headerContent} className="header-content">
              <div style={pageStyles.profileSection} className="profile-section">
                <div style={pageStyles.profileImageContainer} className="profile-image-container">
                  <div style={pageStyles.profileImageBorder}>
                    <img
                      src={
                        profile.profile_image
                          ? `${process.env.REACT_APP_API_URL}/uploads/profile_images/${profile.profile_image}`
                          : candidatImage
                      }
                      alt="Recruiter Profile"
                      style={pageStyles.profileImage}
                      className="profile-image"
                    />
                  </div>
                  <div style={pageStyles.statusBadge} className="status-badge">
                    <div style={pageStyles.statusDot}></div>
                    ACTIF
                  </div>
                </div>

                <div style={pageStyles.headerInfo} className="header-info">
                  <div style={pageStyles.companyBadge}>ENTREPRISE CERTIFIÉE</div>
                  <h1 style={pageStyles.companyName} className="company-name">
                    {profile.companyName}
                  </h1>
                  <p style={pageStyles.companyTitle} className="company-title">
                    {profile.company_title}
                  </p>

                  {(profile.selected_domains || []).length > 0 && (
                    <div style={pageStyles.headerDomainsContainer} className="header-domains">
                      {(profile.selected_domains || []).map((domain, index) => (
                        <div key={index} style={pageStyles.headerDomainTag}>
                          {domain}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div style={pageStyles.mainContent} className="main-content">
            <div style={pageStyles.leftColumn} className="left-column">
              {/* Contact Information */}
              <div style={pageStyles.card}>
                <div style={pageStyles.cardHeader} onClick={() => setShowInfos(!showInfos)}>
                  <h3 style={pageStyles.cardTitle}>
                    Informations de contact
                    <span
                      style={{
                        ...pageStyles.toggleIcon,
                        transform: showInfos ? "rotate(90deg)" : "rotate(0deg)",
                      }}
                    >
                      ▶
                    </span>
                  </h3>
                </div>
                {showInfos && (
                  <div style={pageStyles.cardContent}>
                    <div style={pageStyles.contactItem}>
                      <div style={pageStyles.contactInfo}>
                        <span style={pageStyles.contactLabel}>Email</span>
                        <span style={pageStyles.contactValue}>{profile.email}</span>
                      </div>
                    </div>
                    <div style={pageStyles.contactItem}>
                      <div style={pageStyles.contactInfo}>
                        <span style={pageStyles.contactLabel}>Téléphone</span>
                        <span style={pageStyles.contactValue}>{profile.phoneNumber || "Non fourni"}</span>
                      </div>
                    </div>
                    <div style={pageStyles.contactItem}>
                      <div style={pageStyles.contactInfo}>
                        <span style={pageStyles.contactLabel}>Adresse</span>
                        <span style={pageStyles.contactValue}>{profile.address || "Non spécifiée"}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Statistics */}
              {jobStats && (
                <div style={pageStyles.card}>
                  <div style={pageStyles.cardHeader}>
                    <h3 style={pageStyles.cardTitle}>Statistiques des offres</h3>
                  </div>
                  <div style={pageStyles.cardContent}>
                    <div style={pageStyles.statsGrid} className="stats-grid">
                      <div style={pageStyles.statItem}>
                        <div style={pageStyles.statNumber}>{jobStats.total}</div>
                        <div style={pageStyles.statLabel}>Total</div>
                      </div>
                      <div style={pageStyles.statItem}>
                        <div style={{ ...pageStyles.statNumber, color: "#ff6b35" }}>{jobStats.active}</div>
                        <div style={pageStyles.statLabel}>Actives</div>
                      </div>
                      <div style={pageStyles.statItem}>
                        <div style={{ ...pageStyles.statNumber, color: "#666" }}>{jobStats.expired}</div>
                        <div style={pageStyles.statLabel}>Expirées</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div style={pageStyles.rightColumn} className="right-column">
              {/* About Section */}
              <div style={pageStyles.card}>
                <div style={pageStyles.cardHeader} onClick={() => setShowAbout(!showAbout)}>
                  <h3 style={{ ...pageStyles.cardTitle, cursor: "pointer" }}>
                    À propos de l'entreprise
                    <span
                      style={{
                        ...pageStyles.toggleIcon,
                        transform: showAbout ? "rotate(90deg)" : "rotate(0deg)",
                      }}
                    >
                      ▶
                    </span>
                  </h3>
                </div>
                {showAbout && (
                  <div style={pageStyles.cardContent}>
                    <div style={pageStyles.aboutText}>{profile.description || "Aucune description fournie."}</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Job Offers Section */}
          <div style={pageStyles.card}>
            <div style={pageStyles.cardHeader}>
              <h3 style={pageStyles.cardTitle}>Dernières offres publiées</h3>
            </div>
            <div style={pageStyles.cardContent}>
              {jobOffers.length === 0 ? (
                <div style={pageStyles.emptyState}>
                  <p style={pageStyles.emptyText}>Aucune offre disponible pour le moment</p>
                </div>
              ) : (
                <div style={pageStyles.jobsGrid} className="jobs-grid">
                  {jobOffers.map((job) => (
                    <div key={job.id} style={pageStyles.jobGridCard} className="job-card">
                      <div style={pageStyles.jobGridHeader} className="job-header">
                        <h4 style={pageStyles.jobGridTitle}>{job.title}</h4>
                        <span style={pageStyles.jobGridDate}>
                          {new Date(job.posted_at).toLocaleDateString("fr-FR")}
                        </span>
                      </div>
                      <div style={pageStyles.jobGridDetails}>
                        <div style={pageStyles.jobGridDetailItem}>
                          <span style={pageStyles.jobGridDetailLabel}>Lieu :</span>
                          <span style={pageStyles.jobGridDetailValue}>{job.location || "Non spécifié"}</span>
                        </div>
                        <div style={pageStyles.jobGridDetailItem}>
                          <span style={pageStyles.jobGridDetailLabel}>Type :</span>
                          <span style={pageStyles.jobGridDetailValue}>{job.type || "Non spécifié"}</span>
                        </div>
                        <div style={pageStyles.jobGridDetailItem}>
                          <span style={pageStyles.jobGridDetailLabel}>Salaire :</span>
                          <span style={pageStyles.jobGridDetailValue}>
                            {job.salary ? `${job.salary} MAD` : "Non spécifié"}
                          </span>
                        </div>
                      </div>
                      <p style={pageStyles.jobGridDescription}>
                        {job.description
                          ? job.description.slice(0, 80) + (job.description.length > 80 ? "..." : "")
                          : "Pas de description disponible."}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Newsletter Section - Enhanced and Responsive */}
        <div style={pageStyles.newsletterSection} className="newsletter-section">
          <div style={pageStyles.newsletterContainer} className="newsletter-container">
            {/* Background Elements */}
            <div style={pageStyles.newsletterBgPattern}></div>
            <div style={pageStyles.newsletterBgCircle1}></div>
            <div style={pageStyles.newsletterBgCircle2}></div>

            {/* Main Content */}
            <div style={pageStyles.newsletterContent} className="newsletter-content">
              {/* Left Side - Text Content */}
              <div style={pageStyles.newsletterTextSection} className="newsletter-text">
                <div style={pageStyles.newsletterBadge}>
                  <span style={pageStyles.newsletterBadgeIcon}>📧</span>
                  Newsletter Exclusive
                </div>

                <h2 style={pageStyles.newsletterMainTitle} className="newsletter-title">
                  Transformez votre
                  <span style={pageStyles.newsletterHighlight}> carrière </span>
                  avec nous
                </h2>

                <div style={pageStyles.newsletterDescription} className="newsletter-description">
                  <p style={{ margin: "0 0 20px 0" }}>
                    Rejoignez plus de <strong>10,000+ professionnels</strong> qui reçoivent nos conseils exclusifs,
                    opportunités premium et insights du marché de l'emploi directement dans leur boîte mail.
                  </p>

                  {/* Additional text content area - easily customizable */}
                  <div style={pageStyles.additionalContent}>
                    <p style={{ margin: "0 0 15px 0", fontSize: "1rem", lineHeight: "1.6" }}>
                      Notre newsletter vous donne accès à des informations privilégiées sur les tendances du marché, des
                      conseils d'experts en recrutement, et des opportunités exclusives avant qu'elles ne soient
                      publiées publiquement.
                    </p>
                    <p style={{ margin: "0", fontSize: "0.95rem", color: "#aaa" }}>
                      Restez à la pointe de votre secteur avec nos analyses approfondies et nos recommandations
                      personnalisées.
                    </p>
                  </div>
                </div>

                {/* Benefits Grid */}
                <div style={pageStyles.benefitsGrid} className="benefits-grid">
                  <div style={pageStyles.benefitItem} className="benefit-item">
                    <div style={pageStyles.benefitIcon}>🎯</div>
                    <div>
                      <h4 style={pageStyles.benefitTitle}>Offres Ciblées</h4>
                      <p style={pageStyles.benefitText}>Opportunités personnalisées selon votre profil</p>
                    </div>
                  </div>

                  <div style={pageStyles.benefitItem} className="benefit-item">
                    <div style={pageStyles.benefitIcon}>⚡</div>
                    <div>
                      <h4 style={pageStyles.benefitTitle}>Accès Prioritaire</h4>
                      <p style={pageStyles.benefitText}>Soyez les premiers informés des nouvelles offres</p>
                    </div>
                  </div>

                  <div style={pageStyles.benefitItem} className="benefit-item">
                    <div style={pageStyles.benefitIcon}>📈</div>
                    <div>
                      <h4 style={pageStyles.benefitTitle}>Conseils Expert</h4>
                      <p style={pageStyles.benefitText}>Tips carrière et tendances du marché</p>
                    </div>
                  </div>

                  <div style={pageStyles.benefitItem} className="benefit-item">
                    <div style={pageStyles.benefitIcon}>🔒</div>
                    <div>
                      <h4 style={pageStyles.benefitTitle}>100% Gratuit</h4>
                      <p style={pageStyles.benefitText}>Aucun spam, désabonnement en 1 clic</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Form Card */}
              <div style={pageStyles.newsletterFormCard} className="newsletter-form-card">
                <div style={pageStyles.formCardHeader}>
                  <h3 style={pageStyles.formCardTitle}>Rejoignez-nous maintenant</h3>
                  <p style={pageStyles.formCardSubtitle}>Inscription gratuite en 30 secondes</p>

                  {/* Additional form text content */}
                  <div style={pageStyles.formAdditionalText}>
                    <p
                      style={{
                        fontSize: "0.9rem",
                        color: "#bbb",
                        margin: "15px 0 0 0",
                        lineHeight: "1.4",
                      }}
                    >
                      Recevez chaque semaine une sélection personnalisée d'opportunités et de conseils adaptés à votre
                      profil professionnel.
                    </p>
                  </div>
                </div>

                <form style={pageStyles.modernForm} onSubmit={handleSubmit}>
                  <div style={pageStyles.inputGroup}>
                    <div style={pageStyles.inputIcon}>✉️</div>
                    <input
                      type="email"
                      name="email"
                      placeholder="votre.email@exemple.com"
                      style={pageStyles.modernInput}
                      className="modern-input"
                      required
                    />
                    {/* Input helper text */}
                    <div style={pageStyles.inputHelperText}>
                      Nous respectons votre vie privée et ne partageons jamais vos données
                    </div>
                  </div>

                  <button
                    type="submit"
                    style={pageStyles.modernButton}
                    className="modern-button"
                    onMouseEnter={(e) => {
                      e.target.style.background = "linear-gradient(135deg, #e05a28 0%, #ff8c42 100%)"
                      e.target.style.transform = "translateY(-3px)"
                      e.target.style.boxShadow = "0 15px 35px rgba(255, 107, 53, 0.4)"
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)"
                      e.target.style.transform = "translateY(0)"
                      e.target.style.boxShadow = "0 8px 25px rgba(255, 107, 53, 0.3)"
                    }}
                  >
                    <span style={pageStyles.buttonText}>S'abonner gratuitement</span>
                    <span style={pageStyles.buttonIcon}>→</span>
                  </button>
                </form>

                {/* Trust Indicators */}
                <div style={pageStyles.trustIndicators}>
                  <div style={pageStyles.trustItem}>
                    <span style={pageStyles.trustIcon}>✓</span>
                    <span style={pageStyles.trustText}>Pas de spam</span>
                  </div>
                  <div style={pageStyles.trustItem}>
                    <span style={pageStyles.trustIcon}>✓</span>
                    <span style={pageStyles.trustText}>Désabonnement facile</span>
                  </div>
                  <div style={pageStyles.trustItem}>
                    <span style={pageStyles.trustIcon}>✓</span>
                    <span style={pageStyles.trustText}>Données sécurisées</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div style={pageStyles.statsSection} className="stats-section">
              <div style={pageStyles.statCard}>
                <div style={pageStyles.statNumber}>10K+</div>
                <div style={pageStyles.statLabel}>Abonnés actifs</div>
              </div>
              <div style={pageStyles.statCard}>
                <div style={pageStyles.statNumber}>95%</div>
                <div style={pageStyles.statLabel}>Taux de satisfaction</div>
              </div>
              <div style={pageStyles.statCard}>
                <div style={pageStyles.statNumber}>500+</div>
                <div style={pageStyles.statLabel}>Offres par mois</div>
              </div>
              <div style={pageStyles.statCard}>
                <div style={pageStyles.statNumber}>24h</div>
                <div style={pageStyles.statLabel}>Temps de réponse</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

const pageStyles = {
  loadingScreen: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "#0a0a0a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
  loadingContainer: {
    textAlign: "center",
    color: "#fff",
  },
  loadingSpinner: {
    position: "relative",
    width: "120px",
    height: "120px",
    margin: "0 auto 30px",
  },
  spinnerRing: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    border: "4px solid transparent",
    borderTop: "4px solid #ff6b35",
    borderRadius: "50%",
    animation: "spin 2s linear infinite",
  },
  loadingText: {
    fontSize: "1.5rem",
    fontWeight: "700",
    marginBottom: "10px",
    background: "linear-gradient(135deg, #ffffff 0%, #ff6b35 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  loadingSubtext: {
    fontSize: "1rem",
    color: "#ccc",
    fontWeight: "400",
  },
  errorMessage: {
    minHeight: "100vh",
    backgroundColor: "#0a0a0a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#ff6b35",
    fontSize: "1.5rem",
    fontWeight: "600",
  },

  container: {
    minHeight: "100vh",
    backgroundColor: "#0a0a0a",
    padding: "20px",
    boxSizing: "border-box",
  },

  profileCard: {
    maxWidth: "1400px",
    margin: "0 auto",
    backgroundColor: "#1a1a1a",
    borderRadius: "20px",
    overflow: "hidden",
    boxShadow: "0 25px 80px rgba(0,0,0,0.5)",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    border: "1px solid #333",
  },

  headerSection: {
    height: "400px",
    position: "relative",
    display: "flex",
    alignItems: "flex-end",
    overflow: "hidden",
  },

  coverImageLayer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    filter: "brightness(0.3) contrast(1.2)",
  },

  gradientOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: `linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.7) 30%, rgba(255, 107, 53, 0.15) 70%, rgba(255, 140, 66, 0.2) 100%)`,
  },

  premiumPattern: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: `radial-gradient(circle at 20% 20%, rgba(255, 107, 53, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 140, 66, 0.08) 0%, transparent 50%), radial-gradient(circle at 40% 60%, rgba(255, 163, 102, 0.05) 0%, transparent 50%)`,
  },

  headerContent: {
    width: "100%",
    padding: "40px",
    position: "relative",
    zIndex: 3,
  },

  profileSection: {
    display: "flex",
    alignItems: "center",
    gap: "40px",
    flexWrap: "wrap",
    justifyContent: "center",
  },

  profileImageContainer: {
    position: "relative",
    flexShrink: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  profileImageBorder: {
    padding: "6px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #ff6b35 0%, #ff8c42 50%, #ffa366 100%)",
    boxShadow: `0 0 0 4px rgba(255, 107, 53, 0.2), 0 20px 40px rgba(255, 107, 53, 0.3), inset 0 0 0 2px rgba(255, 255, 255, 0.1)`,
  },

  profileImage: {
    width: "160px",
    height: "160px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "3px solid #1a1a1a",
  },

  statusBadge: {
    position: "absolute",
    bottom: "10px",
    right: "10px",
    backgroundColor: "#ff6b35",
    color: "#000",
    padding: "8px 16px",
    borderRadius: "25px",
    fontSize: "0.7rem",
    fontWeight: "800",
    letterSpacing: "0.5px",
    border: "2px solid #1a1a1a",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    boxShadow: "0 4px 12px rgba(255, 107, 53, 0.4)",
  },

  statusDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: "#000",
    animation: "pulse 2s infinite",
  },

  headerInfo: {
    color: "white",
    flex: 1,
    minWidth: "300px",
    textAlign: "center",
  },

  companyBadge: {
    display: "inline-block",
    backgroundColor: "rgba(255, 107, 53, 0.15)",
    color: "#ff6b35",
    border: "1px solid #ff6b35",
    padding: "8px 16px",
    borderRadius: "20px",
    fontSize: "0.75rem",
    fontWeight: "700",
    letterSpacing: "1px",
    marginBottom: "15px",
    backdropFilter: "blur(10px)",
  },

  companyName: {
    fontSize: "clamp(2rem, 5vw, 3rem)",
    fontWeight: "900",
    margin: "0 0 10px 0",
    letterSpacing: "-0.03em",
    background: "linear-gradient(135deg, #ffffff 0%, #ff6b35 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
  },

  companyTitle: {
    fontSize: "clamp(1rem, 3vw, 1.3rem)",
    fontWeight: "400",
    margin: "0 0 25px 0",
    color: "#ccc",
  },

  headerDomainsContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    marginTop: "5px",
    justifyContent: "center",
  },

  headerDomainTag: {
    backgroundColor: "rgba(255, 107, 53, 0.15)",
    color: "#ff6b35",
    border: "1px solid #ff6b35",
    padding: "8px 16px",
    borderRadius: "20px",
    fontSize: "0.85rem",
    fontWeight: "600",
    backdropFilter: "blur(10px)",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 8px rgba(255, 107, 53, 0.2)",
  },

  mainContent: {
    display: "flex",
    gap: "40px",
    padding: "50px 40px 60px",
    alignItems: "flex-start",
    flexWrap: "wrap",
  },

  leftColumn: {
    flex: "1 1 400px",
    minWidth: "300px",
    display: "flex",
    flexDirection: "column",
    gap: "30px",
  },

  rightColumn: {
    flex: "2 1 500px",
    minWidth: "300px",
    display: "flex",
    flexDirection: "column",
    gap: "30px",
  },

  card: {
    backgroundColor: "#2a2a2a",
    border: "1px solid #404040",
    borderRadius: "16px",
    overflow: "hidden",
    transition: "all 0.3s ease",
    marginBottom: "20px",
  },

  cardHeader: {
    backgroundColor: "#000",
    padding: "25px 30px",
    borderBottom: "2px solid #ff6b35",
    cursor: "pointer",
  },

  cardTitle: {
    color: "#fff",
    fontSize: "1.3rem",
    fontWeight: "700",
    margin: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    letterSpacing: "-0.01em",
  },

  cardContent: {
    padding: "30px",
    width: "100%",
    boxSizing: "border-box",
  },

  contactItem: {
    padding: "20px 0",
    borderBottom: "1px solid #404040",
  },

  contactInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  contactLabel: {
    fontSize: "0.9rem",
    color: "#999",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },

  contactValue: {
    fontSize: "1.1rem",
    color: "#fff",
    fontWeight: "500",
    wordBreak: "break-word",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
    gap: "25px",
  },

  statItem: {
    textAlign: "center",
    padding: "25px 20px",
    backgroundColor: "#1a1a1a",
    borderRadius: "12px",
    border: "1px solid #404040",
    transition: "all 0.3s ease",
  },

  statNumber: {
    fontSize: "2.5rem",
    fontWeight: "900",
    color: "#fff",
    margin: "0 0 10px 0",
  },

  statLabel: {
    fontSize: "0.9rem",
    color: "#ccc",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },

  jobsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
    width: "100%",
  },

  jobGridCard: {
    border: "1px solid #404040",
    borderRadius: "12px",
    padding: "20px",
    transition: "all 0.3s ease",
    backgroundColor: "#1a1a1a",
  },

  jobGridHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "15px",
    gap: "15px",
    flexWrap: "wrap",
  },

  jobGridTitle: {
    fontSize: "1.1rem",
    fontWeight: "700",
    color: "#fff",
    margin: 0,
    flex: 1,
    lineHeight: "1.3",
    minWidth: "200px",
  },

  jobGridDate: {
    fontSize: "0.8rem",
    color: "#ff6b35",
    backgroundColor: "#2a2a2a",
    padding: "4px 12px",
    borderRadius: "15px",
    fontWeight: "600",
    whiteSpace: "nowrap",
    border: "1px solid #404040",
  },

  jobGridDetails: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginBottom: "15px",
  },

  jobGridDetailItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    flexWrap: "wrap",
  },

  jobGridDetailLabel: {
    fontSize: "0.9rem",
    minWidth: "60px",
    color: "white",
    fontWeight: "800",
  },

  jobGridDetailValue: {
    fontSize: "0.9rem",
    color: "#fff",
    fontWeight: "500",
    flex: 1,
    wordBreak: "break-word",
  },

  jobGridDescription: {
    fontSize: "0.9rem",
    color: "#ccc",
    lineHeight: "1.5",
    margin: 0,
  },

  toggleIcon: {
    fontSize: "1.2rem",
    transition: "transform 0.3s ease",
    color: "#ff6b35",
    marginLeft: "auto",
  },

  aboutText: {
    fontSize: "1.05rem",
    lineHeight: "1.8",
    color: "#ddd",
    padding: "10px 0",
  },

  emptyState: {
    textAlign: "center",
    padding: "40px 20px",
  },

  emptyText: {
    color: "#999",
    fontSize: "1.1rem",
    margin: 0,
  },

  // Newsletter Section - Enhanced and Responsive
  newsletterSection: {
    backgroundColor: "#0a0a0a",
    padding: "100px 40px",
    position: "relative",
    overflow: "hidden",
    borderTop: "1px solid #333",
  },

  newsletterContainer: {
    maxWidth: "1200px",
    margin: "0 auto",
    position: "relative",
    zIndex: 2,
  },

  newsletterBgPattern: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: `
      radial-gradient(circle at 20% 20%, rgba(255, 107, 53, 0.05) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(255, 140, 66, 0.03) 0%, transparent 50%),
      linear-gradient(135deg, transparent 0%, rgba(255, 107, 53, 0.02) 50%, transparent 100%)
    `,
    zIndex: 1,
  },

  newsletterBgCircle1: {
    position: "absolute",
    top: "-100px",
    right: "-100px",
    width: "300px",
    height: "300px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(255, 107, 53, 0.1) 0%, transparent 70%)",
    filter: "blur(40px)",
    zIndex: 1,
  },

  newsletterBgCircle2: {
    position: "absolute",
    bottom: "-150px",
    left: "-150px",
    width: "400px",
    height: "400px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(255, 140, 66, 0.08) 0%, transparent 70%)",
    filter: "blur(60px)",
    zIndex: 1,
  },

  newsletterContent: {
    display: "grid",
    gridTemplateColumns: "1fr 400px",
    gap: "60px",
    alignItems: "start",
    marginBottom: "80px",
  },

  newsletterTextSection: {
    color: "#fff",
  },

  newsletterBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "rgba(255, 107, 53, 0.1)",
    border: "1px solid rgba(255, 107, 53, 0.3)",
    padding: "8px 16px",
    borderRadius: "25px",
    fontSize: "0.9rem",
    fontWeight: "600",
    color: "#ff6b35",
    marginBottom: "20px",
    backdropFilter: "blur(10px)",
  },

  newsletterBadgeIcon: {
    fontSize: "1.1rem",
  },

  newsletterMainTitle: {
    fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
    fontWeight: "900",
    lineHeight: "1.1",
    marginBottom: "20px",
    color: "#fff",
  },

  newsletterHighlight: {
    background: "linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },

  newsletterDescription: {
    fontSize: "1.1rem",
    lineHeight: "1.6",
    color: "#ccc",
    marginBottom: "40px",
  },

  additionalContent: {
    marginTop: "20px",
    padding: "20px",
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    borderRadius: "12px",
    border: "1px solid rgba(255, 255, 255, 0.05)",
  },

  benefitsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "20px",
  },

  benefitItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "15px",
    padding: "20px",
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    borderRadius: "12px",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    transition: "all 0.3s ease",
  },

  benefitIcon: {
    fontSize: "1.5rem",
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 107, 53, 0.1)",
    borderRadius: "10px",
    flexShrink: 0,
  },

  benefitTitle: {
    fontSize: "1rem",
    fontWeight: "700",
    color: "#fff",
    margin: "0 0 5px 0",
  },

  benefitText: {
    fontSize: "0.9rem",
    color: "#999",
    margin: 0,
    lineHeight: "1.4",
  },

  newsletterFormCard: {
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "20px",
    padding: "40px",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
  },

  formCardHeader: {
    textAlign: "center",
    marginBottom: "30px",
  },

  formCardTitle: {
    fontSize: "1.5rem",
    fontWeight: "800",
    color: "#fff",
    margin: "0 0 8px 0",
  },

  formCardSubtitle: {
    fontSize: "0.95rem",
    color: "#999",
    margin: 0,
  },

  formAdditionalText: {
    marginTop: "15px",
  },

  modernForm: {
    marginBottom: "25px",
  },

  inputGroup: {
    position: "relative",
    marginBottom: "20px",
  },

  inputIcon: {
    position: "absolute",
    left: "15px",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "1.1rem",
    zIndex: 2,
  },

  modernInput: {
    width: "100%",
    padding: "16px 16px 16px 50px",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    border: "2px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "12px",
    color: "#fff",
    fontSize: "1rem",
    fontWeight: "500",
    outline: "none",
    transition: "all 0.3s ease",
    boxSizing: "border-box",
  },

  inputHelperText: {
    fontSize: "0.8rem",
    color: "#888",
    marginTop: "8px",
    lineHeight: "1.3",
  },

  modernButton: {
    width: "100%",
    padding: "16px 24px",
    background: "linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)",
    border: "none",
    borderRadius: "12px",
    color: "#fff",
    fontSize: "1rem",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    boxShadow: "0 8px 25px rgba(255, 107, 53, 0.3)",
    textTransform: "none",
    letterSpacing: "0.5px",
  },

  buttonText: {
    flex: 1,
  },

  buttonIcon: {
    fontSize: "1.2rem",
    transition: "transform 0.3s ease",
  },

  trustIndicators: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  trustItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "0.85rem",
    color: "#999",
  },

  trustIcon: {
    color: "#4ade80",
    fontWeight: "bold",
  },

  trustText: {
    color: "#ccc",
  },

  statsSection: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "30px",
    padding: "40px 0",
    borderTop: "1px solid rgba(255, 255, 255, 0.1)",
  },

  statCard: {
    textAlign: "center",
    padding: "20px",
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    borderRadius: "12px",
    border: "1px solid rgba(255, 255, 255, 0.05)",
  },

  statNumber: {
    fontSize: "2rem",
    fontWeight: "900",
    color: "#ff6b35",
    marginBottom: "5px",
  },

  statLabel: {
    fontSize: "0.9rem",
    color: "#999",
    fontWeight: "500",
  },
}

// Responsive CSS styles
const responsiveStyles = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Tablet Styles */
@media (max-width: 1024px) {
  .newsletter-content {
    grid-template-columns: 1fr !important;
    gap: 40px !important;
  }
  
  .benefits-grid {
    grid-template-columns: 1fr !important;
    gap: 15px !important;
  }
  
  .stats-section {
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 20px !important;
  }
  
  .main-content {
    padding: 40px 30px 50px !important;
  }
  
  .left-column, .right-column {
    flex: 1 1 100% !important;
    min-width: auto !important;
  }
}

/* Mobile Styles */
@media (max-width: 768px) {
  .profile-card {
    margin: 0 10px !important;
    border-radius: 15px !important;
  }
  
  .header-section {
    height: 300px !important;
  }
  
  .header-content {
    padding: 30px 20px !important;
  }
  
  .profile-section {
    flex-direction: column !important;
    gap: 25px !important;
    text-align: center !important;
  }
  
  .profile-image {
    width: 120px !important;
    height: 120px !important;
  }
  
  .status-badge {
    bottom: 5px !important;
    right: 5px !important;
    padding: 6px 12px !important;
    font-size: 0.6rem !important;
  }
  
  .company-name {
    font-size: 2rem !important;
  }
  
  .company-title {
    font-size: 1.1rem !important;
  }
  
  .header-domains {
    justify-content: center !important;
  }
  
  .main-content {
    padding: 30px 20px 40px !important;
    gap: 25px !important;
  }
  
  .jobs-grid {
    grid-template-columns: 1fr !important;
    gap: 15px !important;
  }
  
  .job-card {
    padding: 15px !important;
  }
  
  .job-header {
    flex-direction: column !important;
    gap: 10px !important;
    align-items: flex-start !important;
  }
  
  .stats-grid {
    grid-template-columns: repeat(3, 1fr) !important;
    gap: 15px !important;
  }
  
  /* Newsletter Mobile Styles */
  .newsletter-section {
    padding: 60px 20px !important;
  }
  
  .newsletter-container {
    max-width: 100% !important;
  }
  
  .newsletter-content {
    margin-bottom: 50px !important;
  }
  
  .newsletter-title {
    font-size: 2.2rem !important;
    line-height: 1.2 !important;
  }
  
  .newsletter-description {
    font-size: 1rem !important;
    margin-bottom: 30px !important;
  }
  
  .newsletter-form-card {
    padding: 30px 20px !important;
    border-radius: 15px !important;
  }
  
  .benefit-item {
    padding: 15px !important;
    flex-direction: row !important;
    text-align: left !important;
  }
  
  .stats-section {
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 15px !important;
    padding: 30px 0 !important;
  }
}

/* Small Mobile Styles */
@media (max-width: 480px) {
  .newsletter-section {
    padding: 40px 15px !important;
  }
  
  .newsletter-form-card {
    padding: 25px 15px !important;
  }
  
  .stats-section {
    grid-template-columns: 1fr !important;
    gap: 12px !important;
  }
  
  .newsletter-title {
    font-size: 1.8rem !important;
  }
  
  .modern-input {
    padding: 14px 14px 14px 45px !important;
    font-size: 0.95rem !important;
  }
  
  .modern-button {
    padding: 14px 20px !important;
    font-size: 0.95rem !important;
  }
  
  .benefit-icon {
    width: 35px !important;
    height: 35px !important;
    font-size: 1.3rem !important;
  }
  
  .profile-image {
    width: 100px !important;
    height: 100px !important;
  }
  
  .status-badge {
    bottom: 2px !important;
    right: 2px !important;
    padding: 4px 8px !important;
    font-size: 0.55rem !important;
  }
  
  .main-content {
    padding: 25px 15px 35px !important;
  }
  
  .stats-grid {
    grid-template-columns: 1fr !important;
    gap: 12px !important;
  }
}

/* Focus and Hover States */
.modern-input:focus {
  border-color: #ff6b35 !important;
  box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1) !important;
}

.benefit-item:hover {
  background-color: rgba(255, 255, 255, 0.05) !important;
  border-color: rgba(255, 107, 53, 0.2) !important;
}

.job-card:hover {
  border-color: rgba(255, 107, 53, 0.5) !important;
  transform: translateY(-2px) !important;
}
`

export default RecruiterPublicProfile
