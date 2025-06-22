"use client"

import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import Navbar from "../Navbara"
import Footer from "../Footer"
import ApplicationChat from "./ApplicationChat"
import SEO from "../SEO"

const RecruiterJobOffers = () => {
  const [offers, setOffers] = useState([])
  const [applications, setApplications] = useState([])
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [successMessage, setSuccessMessage] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const navigate = useNavigate()
  const [selectedApplicationId, setSelectedApplicationId] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    setIsLoading(true)

    // Fetch recruiter profile
    fetch(`${process.env.REACT_APP_API_URL}/api/recruiter/profile`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((userData) => setUser(userData))
      .catch((err) => console.error("Error fetching recruiter profile:", err))

    // Fetch job offers
    fetch(`${process.env.REACT_APP_API_URL}/api/recruiter/job_offers`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch job offers")
        return response.json()
      })
      .then((data) => setOffers(data))
      .catch((error) => setError("Impossible de charger les offres d'emploi."))
      .finally(() => setIsLoading(false))

    // Fetch applications
    fetch(`${process.env.REACT_APP_API_URL}/api/recruiter/applications`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => setApplications(data))
      .catch((error) => console.error("Error fetching applications:", error))
  }, [])

  const handleCreateJobOffer = () => navigate("/JobOfferForm")

  const handleDeleteOffer = (offerId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette offre ?")) {
      fetch(`${process.env.REACT_APP_API_URL}/api/recruiter/job_offers/${offerId}`, {
        method: "DELETE",
        credentials: "include",
      })
        .then((response) => {
          if (!response.ok) throw new Error("Erreur lors de la suppression")
          setOffers((prev) => prev.filter((o) => o.id !== offerId))
          setSuccessMessage("Offre supprimée avec succès !")
          setTimeout(() => setSuccessMessage(null), 3000)
        })
        .catch((error) => alert("Erreur lors de la suppression."))
    }
  }

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

  const filteredOffers = offers.filter((offer) => offer.title.toLowerCase().includes(searchTerm.toLowerCase()))

  const getApplicationsForOffer = (offerId) => applications.filter((app) => app.job_offer_id === offerId)

  return (
    <>
      <style>{responsiveStyles}</style>
      <Navbar />
      <SEO title="Mes Offres" />

      <div style={styles.container} className="dashboard-container">
        {/* Header Section */}
        <div style={styles.header} className="dashboard-header">
          <div style={styles.headerContent}>
            <div style={styles.titleSection}>
              <h1 style={styles.title} className="dashboard-title">
                Gestion des Offres
              </h1>
              <p style={styles.subtitle}>Gérez vos offres d'emploi et suivez les candidatures</p>
            </div>

            <button
              style={styles.createButton}
              className="create-button"
              onClick={handleCreateJobOffer}
              onMouseEnter={(e) => {
                e.target.style.background = "linear-gradient(135deg, #e65100 0%, #ff8f00 100%)"
                e.target.style.transform = "translateY(-2px)"
                e.target.style.boxShadow = "0 8px 25px rgba(255, 143, 0, 0.3)"
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "linear-gradient(135deg, #ff8f00 0%, #ffb74d 100%)"
                e.target.style.transform = "translateY(0)"
                e.target.style.boxShadow = "0 4px 15px rgba(255, 143, 0, 0.2)"
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 5V19M5 12H19"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="button-text">Ajouter une offre</span>
            </button>
          </div>
        </div>

        {/* Search Section */}
        <div style={styles.searchSection} className="search-section">
          <div style={styles.searchContainer}>
            <div style={styles.searchInputContainer}>
              <svg
                style={styles.searchIcon}
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z"
                  stroke="#9ca3af"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <input
                type="text"
                placeholder="Rechercher par titre d'offre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchInput}
                className="search-input"
              />
            </div>

            {/* Stats */}
            <div style={styles.statsContainer} className="stats-container">
              <div style={styles.statItem}>
                <span style={styles.statNumber}>{offers.length}</span>
                <span style={styles.statLabel}>Offres totales</span>
              </div>
              <div style={styles.statItem}>
                <span style={styles.statNumber}>{applications.length}</span>
                <span style={styles.statLabel}>Candidatures</span>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
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

        {error && (
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
            {error}
          </div>
        )}

        {/* Content */}
        <div style={styles.content} className="dashboard-content">
          {isLoading ? (
            <div style={styles.loadingContainer}>
              <div style={styles.loadingSpinner}>
                <div style={styles.spinnerRing}></div>
                <div style={styles.spinnerRing}></div>
                <div style={styles.spinnerRing}></div>
              </div>
              <p style={styles.loadingText}>Chargement de vos offres...</p>
            </div>
          ) : filteredOffers.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z"
                    stroke="#d1d5db"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16 21V5C16 4.46957 15.7893 3.96086 15.4142 3.58579C15.0391 3.21071 14.5304 3 14 3H10C9.46957 3 8.96086 3.21071 8.58579 3.58579C8.21071 3.96086 8 4.46957 8 5V21"
                    stroke="#d1d5db"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 style={styles.emptyTitle}>{searchTerm ? "Aucune offre trouvée" : "Aucune offre d'emploi"}</h3>
              <p style={styles.emptyDescription}>
                {searchTerm
                  ? "Essayez de modifier votre recherche"
                  : "Commencez par créer votre première offre d'emploi"}
              </p>
              {!searchTerm && (
                <button style={styles.emptyButton} onClick={handleCreateJobOffer}>
                  Créer une offre
                </button>
              )}
            </div>
          ) : (
            <div style={styles.offersGrid} className="offers-grid">
              {filteredOffers.map((offer) => {
                const offerApplications = getApplicationsForOffer(offer.id)
                const recentApplication = offerApplications[offerApplications.length - 1]

                return (
                  <div key={offer.id} style={styles.offerCard} className="offer-card">
                    {/* Card Header */}
                    <div style={styles.cardHeader}>
                      <h3 style={styles.offerTitle}>{offer.title}</h3>
                      <div style={styles.applicationsCount}>
                        {offerApplications.length} candidature{offerApplications.length !== 1 ? "s" : ""}
                      </div>
                    </div>

                    {/* Card Content */}
                    <div style={styles.cardContent}>
                      <div style={styles.offerDetails}>
                        <div style={styles.detailItem}>
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M19 21V5C19 4.46957 18.7893 3.96086 18.4142 3.58579C18.0391 3.21071 17.5304 3 17 3H7C6.46957 3 5.96086 3.21071 5.58579 3.58579C5.21071 3.96086 5 4.46957 5 5V21L12 17L19 21Z"
                              stroke="#6b7280"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <span>{offer.company}</span>
                        </div>

                        <div style={styles.detailItem}>
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M21 10C21 17 12 23 12 23S3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.3639 3.63604C20.0518 5.32387 21 7.61305 21 10Z"
                              stroke="#6b7280"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z"
                              stroke="#6b7280"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <span>{offer.location}</span>
                        </div>

                        <div style={styles.detailItem}>
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M20 6L9 17L4 12"
                              stroke="#6b7280"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <span>{offer.type || "Non spécifié"}</span>
                        </div>
                      </div>

                      <p style={styles.offerDescription}>
                        {offer.description.length > 120
                          ? `${offer.description.substring(0, 120)}...`
                          : offer.description}
                      </p>

                      {/* Recent Applications */}
                      <div style={styles.applicationsSection}>
                        <div style={styles.applicationsSectionHeader}>
                          <h4 style={styles.applicationsTitle}>Candidatures récentes</h4>
                          {offerApplications.length > 0 && (
                            <Link to={`/recruiter/job-offers/${offer.id}/applications`} style={styles.viewAllLink}>
                              Voir toutes
                            </Link>
                          )}
                        </div>

                        {offerApplications.length === 0 ? (
                          <p style={styles.noApplications}>Aucune candidature pour le moment</p>
                        ) : (
                          <div style={styles.recentApplication}>
                            <div style={styles.applicantInfo}>
                              <div style={styles.applicantAvatar}>
                                {recentApplication.candidate?.name?.charAt(0) || "C"}
                              </div>
                              <div>
                                <div style={styles.applicantName}>
                                  {recentApplication.candidate?.name || "Candidat"}
                                </div>
                                <div style={styles.applicationDate}>
                                  {formatDate(recentApplication.application_date)}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div style={styles.cardActions}>
                      <Link to={`/edit-offer/${offer.id}`} style={styles.editButton} className="edit-button">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M18.5 2.50023C18.8978 2.1024 19.4374 1.87891 20 1.87891C20.5626 1.87891 21.1022 2.1024 21.5 2.50023C21.8978 2.89805 22.1213 3.43762 22.1213 4.00023C22.1213 4.56284 21.8978 5.1024 21.5 5.50023L12 15.0002L8 16.0002L9 12.0002L18.5 2.50023Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        Modifier
                      </Link>

                      <button
                        style={styles.deleteButton}
                        className="delete-button"
                        onClick={() => handleDeleteOffer(offer.id)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M3 6H5H21"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        Supprimer
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Chat Section */}
        {selectedApplicationId && user?.id && (
          <div style={styles.chatSection} className="chat-section">
            <div style={styles.chatHeader}>
              <h3 style={styles.chatTitle}>Discussion avec le candidat</h3>
              <button onClick={() => setSelectedApplicationId(null)} style={styles.closeChatButton}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            <ApplicationChat userId={user.id} userType={"recruiter"} applicationId={selectedApplicationId} />
          </div>
        )}
      </div>

      <Footer />
    </>
  )
}

const styles = {
  container: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    backgroundColor: "#f8fafc",
    minHeight: "100vh",
    padding: "0",
  },

  header: {
    background: "linear-gradient(135deg, #ff8f00 0%, #ffb74d 100%)",
    padding: "60px 20px",
    color: "white",
  },

  headerContent: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "30px",
  },

  titleSection: {
    flex: 1,
  },

  title: {
    fontSize: "clamp(2rem, 4vw, 3rem)",
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

  createButton: {
    background: "linear-gradient(135deg, #ff8f00 0%, #ffb74d 100%)",
    color: "white",
    border: "2px solid rgba(255, 255, 255, 0.2)",
    padding: "14px 24px",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "600",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    boxShadow: "0 4px 15px rgba(255, 143, 0, 0.2)",
    backdropFilter: "blur(10px)",
    whiteSpace: "nowrap",
  },

  searchSection: {
    padding: "40px 20px",
    backgroundColor: "white",
    borderBottom: "1px solid #e2e8f0",
  },

  searchContainer: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    gap: "30px",
    alignItems: "center",
  },

  searchInputContainer: {
    position: "relative",
    flex: 1,
    maxWidth: "500px",
  },

  searchIcon: {
    position: "absolute",
    left: "16px",
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 2,
  },

  searchInput: {
    width: "100%",
    padding: "14px 16px 14px 48px",
    borderRadius: "12px",
    border: "2px solid #e2e8f0",
    fontSize: "1rem",
    transition: "all 0.2s ease",
    backgroundColor: "#f8fafc",
    outline: "none",
    boxSizing: "border-box",
  },

  statsContainer: {
    display: "flex",
    gap: "30px",
  },

  statItem: {
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },

  statNumber: {
    fontSize: "2rem",
    fontWeight: "800",
    color: "#ff8f00",
  },

  statLabel: {
    fontSize: "0.9rem",
    color: "#6b7280",
    fontWeight: "500",
  },

  content: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "40px 20px",
  },

  successMessage: {
    maxWidth: "1200px",
    margin: "0 auto 20px auto",
    padding: "16px 20px",
    backgroundColor: "#f0fdf4",
    border: "1px solid #bbf7d0",
    borderRadius: "12px",
    color: "#166534",
    fontSize: "0.95rem",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  errorMessage: {
    maxWidth: "1200px",
    margin: "0 auto 20px auto",
    padding: "16px 20px",
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "12px",
    color: "#dc2626",
    fontSize: "0.95rem",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "80px 20px",
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
    borderTop: "3px solid #ff8f00",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },

  loadingText: {
    fontSize: "1.1rem",
    color: "#6b7280",
    fontWeight: "500",
  },

  emptyState: {
    textAlign: "center",
    padding: "80px 20px",
  },

  emptyIcon: {
    marginBottom: "24px",
    display: "flex",
    justifyContent: "center",
  },

  emptyTitle: {
    fontSize: "1.5rem",
    fontWeight: "700",
    color: "#374151",
    marginBottom: "8px",
  },

  emptyDescription: {
    fontSize: "1rem",
    color: "#6b7280",
    marginBottom: "24px",
  },

  emptyButton: {
    background: "linear-gradient(135deg, #ff8f00 0%, #ffb74d 100%)",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "600",
    transition: "all 0.2s ease",
  },

  offersGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))",
    gap: "24px",
  },

  offerCard: {
    backgroundColor: "white",
    borderRadius: "16px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
    border: "1px solid #e2e8f0",
    overflow: "hidden",
    transition: "all 0.2s ease",
    display: "flex",
    flexDirection: "column",
  },

  cardHeader: {
    padding: "24px 24px 16px 24px",
    borderBottom: "1px solid #f1f5f9",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "16px",
  },

  offerTitle: {
    fontSize: "1.3rem",
    fontWeight: "700",
    color: "#1e293b",
    margin: 0,
    lineHeight: "1.3",
    flex: 1,
  },

  applicationsCount: {
    backgroundColor: "#ff8f00",
    color: "white",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "0.8rem",
    fontWeight: "600",
    whiteSpace: "nowrap",
  },

  cardContent: {
    padding: "0 24px 16px 24px",
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },

  offerDetails: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  detailItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "0.9rem",
    color: "#6b7280",
  },

  offerDescription: {
    fontSize: "0.95rem",
    color: "#4b5563",
    lineHeight: "1.5",
    margin: 0,
  },

  applicationsSection: {
    marginTop: "auto",
    paddingTop: "16px",
    borderTop: "1px solid #f1f5f9",
  },

  applicationsSectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },

  applicationsTitle: {
    fontSize: "0.95rem",
    fontWeight: "600",
    color: "#374151",
    margin: 0,
  },

  viewAllLink: {
    color: "#ff8f00",
    textDecoration: "none",
    fontSize: "0.85rem",
    fontWeight: "500",
    transition: "color 0.2s ease",
  },

  noApplications: {
    fontSize: "0.85rem",
    color: "#9ca3af",
    fontStyle: "italic",
    margin: 0,
  },

  recentApplication: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  applicantInfo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  applicantAvatar: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    backgroundColor: "#ff8f00",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.8rem",
    fontWeight: "600",
  },

  applicantName: {
    fontSize: "0.9rem",
    fontWeight: "500",
    color: "#374151",
  },

  applicationDate: {
    fontSize: "0.8rem",
    color: "#9ca3af",
  },

  cardActions: {
    padding: "16px 24px 24px 24px",
    display: "flex",
    gap: "12px",
    borderTop: "1px solid #f1f5f9",
  },

  editButton: {
    flex: 1,
    padding: "10px 16px",
    backgroundColor: "#f8fafc",
    color: "#475569",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: "500",
    textDecoration: "none",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
  },

  deleteButton: {
    flex: 1,
    padding: "10px 16px",
    backgroundColor: "#fef2f2",
    color: "#dc2626",
    border: "1px solid #fecaca",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: "500",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
  },

  chatSection: {
    maxWidth: "1200px",
    margin: "40px auto 0 auto",
    backgroundColor: "white",
    borderRadius: "16px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
    border: "1px solid #e2e8f0",
    overflow: "hidden",
  },

  chatHeader: {
    padding: "20px 24px",
    borderBottom: "1px solid #e2e8f0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  chatTitle: {
    fontSize: "1.2rem",
    fontWeight: "600",
    color: "#1e293b",
    margin: 0,
  },

  closeChatButton: {
    padding: "8px",
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    cursor: "pointer",
    color: "#6b7280",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}

const responsiveStyles = `
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

/* Tablet Styles */
@media (max-width: 1024px) {
    .dashboard-header .headerContent {
        flex-direction: column !important;
        gap: 20px !important;
        text-align: center !important;
    }
    
    .search-section .searchContainer {
        flex-direction: column !important;
        gap: 20px !important;
        align-items: stretch !important;
    }
    
    .stats-container {
        justify-content: center !important;
        gap: 40px !important;
    }
    
    .offers-grid {
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)) !important;
        gap: 20px !important;
    }
}

/* Mobile Styles */
@media (max-width: 768px) {
    .dashboard-title {
        font-size: 2rem !important;
    }
    
    .create-button .button-text {
        display: none !important;
    }
    
    .create-button {
        padding: 12px !important;
        border-radius: 50% !important;
        width: 48px !important;
        height: 48px !important;
        justify-content: center !important;
    }
    
    .search-input {
        font-size: 16px !important; /* Prevents zoom on iOS */
    }
    
    .offers-grid {
        grid-template-columns: 1fr !important;
        gap: 16px !important;
    }
    
    .offer-card {
        margin: 0 !important;
    }
    
    .cardHeader {
        padding: 20px 20px 12px 20px !important;
        flex-direction: column !important;
        align-items: flex-start !important;
        gap: 12px !important;
    }
    
    .cardContent {
        padding: 0 20px 12px 20px !important;
    }
    
    .cardActions {
        padding: 12px 20px 20px 20px !important;
        flex-direction: column !important;
        gap: 8px !important;
    }
    
    .edit-button,
    .delete-button {
        flex: none !important;
        width: 100% !important;
    }
    
    .stats-container {
        gap: 30px !important;
    }
    
    .chat-section {
        margin: 20px 10px 0 10px !important;
        border-radius: 12px !important;
    }
}

/* Small Mobile Styles */
@media (max-width: 480px) {
    .dashboard-container {
        padding: 0 !important;
    }
    
    .dashboard-header {
        padding: 40px 15px !important;
    }
    
    .search-section {
        padding: 30px 15px !important;
    }
    
    .dashboard-content {
        padding: 30px 15px !important;
    }
    
    .dashboard-title {
        font-size: 1.8rem !important;
    }
    
    .offers-grid {
        gap: 12px !important;
    }
    
    .offer-card {
        border-radius: 12px !important;
    }
    
    .stats-container {
        gap: 20px !important;
    }
    
    .statNumber {
        font-size: 1.5rem !important;
    }
    
    .statLabel {
        font-size: 0.8rem !important;
    }
}

/* Hover Effects */
.offer-card:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1) !important;
}

.edit-button:hover {
    background-color: #e2e8f0 !important;
    color: #334155 !important;
}

.delete-button:hover {
    background-color: #fee2e2 !important;
    color: #b91c1c !important;
}

.search-input:focus {
    border-color: #ff8f00 !important;
    box-shadow: 0 0 0 3px rgba(255, 143, 0, 0.1) !important;
    background-color: white !important;
}

.view-all-link:hover {
    color: #e65100 !important;
}

.close-chat-button:hover {
    background-color: #e2e8f0 !important;
    color: #475569 !important;
}

/* Loading Animation */
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

.offer-card {
    animation: fadeIn 0.3s ease-out !important;
}

.success-message,
.error-message {
    animation: fadeIn 0.3s ease-out !important;
}
`

export default RecruiterJobOffers
