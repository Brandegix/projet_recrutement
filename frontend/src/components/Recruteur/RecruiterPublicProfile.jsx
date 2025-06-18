import React, { useEffect, useState } from "react";
import Navbar from "../Navbara";
import Footer from "../Footer";
import { useParams } from "react-router-dom";
import candidatImage from '../../assets/images/choixRole/recruiter.jpg';

function RecruiterPublicProfile() {
  const [profile, setProfile] = useState(null);
  const [jobStats, setJobStats] = useState(null);
  const [jobOffers, setJobOffers] = useState([]);
  const [error, setError] = useState(null);
  const [showAbout, setShowAbout] = useState(false);
  const [showInfos, setShowInfos] = useState(false);
  const [newsletters, setNewsletters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch profile and job stats
        const profileRes = await fetch(`${process.env.REACT_APP_API_URL}/api/recruiter/public-profile/${id}`);
        if (!profileRes.ok) throw new Error("Failed to fetch public profile");
        const profileData = await profileRes.json();
        
        setProfile(profileData);
        setJobStats(profileData.jobStats || null);
        setNewsletters(profileData.newsletters || []);

        // Fetch job offers
        const jobOffersRes = await fetch(`${process.env.REACT_APP_API_URL}/api/recruiter/${id}/last-job-offers`);
        if (jobOffersRes.ok) {
          const jobOffersData = await jobOffersRes.json();
          setJobOffers(jobOffersData);
        }

        // Simulate minimum loading time for better UX
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (err) {
        console.error(err);
        setError("Erreur lors du chargement du profil public.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
  
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/newsletter/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          recruiter_id: id,
        }),
      });
  
      const result = await res.json();
      alert(result.message || 'Inscription réussie !');
    } catch (err) {
      console.error('Erreur:', err);
      alert('Erreur lors de l inscription.');
    }
  };

  // Loading Component
  const LoadingScreen = () => (
    <div style={pageStyles.loadingScreen}>
      <div style={pageStyles.loadingContainer}>
        <div style={pageStyles.loadingSpinner}>
          <div style={pageStyles.spinnerRing}></div>
          <div style={pageStyles.spinnerRing}></div>
          <div style={pageStyles.spinnerRing}></div>
        </div>
        <div style={pageStyles.loadingText}>Chargement du profil...</div>
        <div style={pageStyles.loadingSubtext}>Chargement du profil...</div>
      </div>
    </div>
  );

  if (isLoading) return <LoadingScreen />;
  if (error) return <div style={pageStyles.errorMessage}>{error}</div>;
  if (!profile) return <div style={pageStyles.errorMessage}>Profil non trouvé</div>;

  return (
    <>
      <Navbar />
      <div style={pageStyles.container}>
        <div style={pageStyles.profileCard}>
          {/* Premium Header Section with New Cover Style */}
          <div style={pageStyles.headerSection}>
            {/* Cover Image Background */}
            <div 
              style={{
                ...pageStyles.coverImageLayer,
                backgroundImage: profile?.cover_image 
                  ? `url(${profile.cover_image})`
                  : 'linear-gradient(135deg, #ff6b35 0%, #ff8c42 50%, #ffa366 100%)'
              }}
            />
            
            {/* Gradient Overlays */}
            <div style={pageStyles.gradientOverlay}></div>
            <div style={pageStyles.premiumPattern}></div>
            
            {/* Header Content */}
            <div style={pageStyles.headerContent}>
              <div style={pageStyles.profileSection}>
                <div style={pageStyles.profileImageContainer}>
                  <div style={pageStyles.profileImageBorder}>
                    <img
                      src={
                        profile.profile_image
                          ? `${process.env.REACT_APP_API_URL}/uploads/profile_images/${profile.profile_image}`
                          : candidatImage
                      }
                      alt="Recruiter Profile"
                      style={pageStyles.profileImage}
                    />
                  </div>
                  <div style={pageStyles.statusBadge}>
                    <div style={pageStyles.statusDot}></div>
                    ACTIF
                  </div>
                </div>
                
                <div style={pageStyles.headerInfo}>
                  <div style={pageStyles.companyBadge}>ENTREPRISE CERTIFIÉE</div>
                  <h1 style={pageStyles.companyName}>{profile.companyName}</h1>
                  <p style={pageStyles.companyTitle}>{profile.company_title}</p>
                  
                  {/* Domains displayed in header */}
                  {(profile.selected_domains || []).length > 0 && (
                    <div style={pageStyles.headerDomainsContainer}>
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

          {/* Main Content Layout */}
          <div style={pageStyles.mainContent}>
            {/* Left Column */}
            <div style={pageStyles.leftColumn}>
              {/* Contact Information Card */}
              <div style={pageStyles.card}>
                <div 
                  style={pageStyles.cardHeader}
                  onClick={() => setShowInfos(!showInfos)}
                >
                  <h3 style={pageStyles.cardTitle}>
                    Informations de contact
                    <span style={{
                      ...pageStyles.toggleIcon,
                      transform: showInfos ? "rotate(90deg)" : "rotate(0deg)"
                    }}>
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

              {/* Statistics Card */}
              {jobStats && (
                <div style={pageStyles.card}>
                  <div style={pageStyles.cardHeader}>
                    <h3 style={pageStyles.cardTitle}>Statistiques des offres</h3>
                  </div>
                  <div style={pageStyles.cardContent}>
                    <div style={pageStyles.statsGrid}>
                      <div style={pageStyles.statItem}>
                        <div style={pageStyles.statNumber}>{jobStats.total}</div>
                        <div style={pageStyles.statLabel}>Total</div>
                      </div>
                      <div style={pageStyles.statItem}>
                        <div style={{...pageStyles.statNumber, color: '#ff6b35'}}>{jobStats.active}</div>
                        <div style={pageStyles.statLabel}>Actives</div>
                      </div>
                      <div style={pageStyles.statItem}>
                        <div style={{...pageStyles.statNumber, color: '#666'}}>{jobStats.expired}</div>
                        <div style={pageStyles.statLabel}>Expirées</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div style={pageStyles.rightColumn}>
              {/* About Section */}
              <div style={pageStyles.card}>
                <div 
                  style={pageStyles.cardHeader}
                  onClick={() => setShowAbout(!showAbout)}
                >
                  <h3 style={{...pageStyles.cardTitle, cursor: 'pointer'}}>
                    À propos de l'entreprise
                    <span style={{
                      ...pageStyles.toggleIcon,
                      transform: showAbout ? "rotate(90deg)" : "rotate(0deg)"
                    }}>
                      ▶
                    </span>
                  </h3>
                </div>
                {showAbout && (
                  <div style={pageStyles.cardContent}>
                    <div style={pageStyles.aboutText}>
                      {profile.description || "Aucune description fournie."}
                    </div>
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
                <div style={pageStyles.jobsGrid}>
                  {jobOffers.map((job) => (
                    <div key={job.id} style={pageStyles.jobGridCard}>
                      <div style={pageStyles.jobGridHeader}>
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
                          <span style={pageStyles.jobGridDetailValue}>{job.salary ? `${job.salary} MAD` : "Non spécifié"}</span>
                        </div>
                      </div>
                      <p style={pageStyles.jobGridDescription}>
                        {job.description ? job.description.slice(0, 80) + (job.description.length > 80 ? "..." : "") : "Pas de description disponible."}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
     
        {/* Newsletter Subscription Section */}
        <div style={pageStyles.newsletterSection}>
          <div style={pageStyles.newsletterContainer}>
            <div style={pageStyles.newsletterSubtitle}>Restez connecté</div>
            <h2 style={pageStyles.newsletterTitle}>Ne manquez aucune opportunité</h2>
            <p style={pageStyles.newsletterText}>
              Recevez les dernières offres d'emploi, actualités du secteur et conseils carrière 
              directement dans votre boîte mail.
            </p>
            
            <form style={pageStyles.newsletterForm} onSubmit={handleSubmit}>
              <input
                type="email"
                name="email"
                placeholder="Entrez votre adresse email"
                style={pageStyles.newsletterInput}
                required
              />
              <button 
                type="submit" 
                style={pageStyles.newsletterButton}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#e05a28';
                  e.target.style.transform = 'scale(1.02)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#ff6b35';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                S'abonner
              </button>
            </form>
            
            <div style={pageStyles.newsletterFeatures}>
              <div style={pageStyles.newsletterFeature}>
                <div style={pageStyles.newsletterFeatureIcon}>✓</div>
                <span>Offres exclusives</span>
              </div>
              <div style={pageStyles.newsletterFeature}>
                <div style={pageStyles.newsletterFeatureIcon}>✓</div>
                <span>Conseils carrière</span>
              </div>
              <div style={pageStyles.newsletterFeature}>
                <div style={pageStyles.newsletterFeatureIcon}>✓</div>
                <span>Actualités secteur</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

const pageStyles = {
  // Loading Screen Styles
  loadingScreen: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#0a0a0a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  loadingContainer: {
    textAlign: 'center',
    color: '#fff',
  },
  loadingSpinner: {
    position: 'relative',
    width: '120px',
    height: '120px',
    margin: '0 auto 30px',
  },
  spinnerRing: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    border: '4px solid transparent',
    borderTop: '4px solid #ff6b35',
    borderRadius: '50%',
    animation: 'spin 2s linear infinite',
    '&:nth-child(2)': {
      animationDelay: '0.5s',
      borderTopColor: '#ff8c42',
    },
    '&:nth-child(3)': {
      animationDelay: '1s',
      borderTopColor: '#ffa366',
    },
  },
  loadingText: {
    fontSize: '1.5rem',
    fontWeight: '700',
    marginBottom: '10px',
    background: 'linear-gradient(135deg, #ffffff 0%, #ff6b35 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  loadingSubtext: {
    fontSize: '1rem',
    color: '#ccc',
    fontWeight: '400',
  },

  container: {
    minHeight: "100vh",
    backgroundColor: "#0a0a0a",
    padding: "20px 0",
    '@media (max-width: 768px)': {
      padding: "10px 0",
    },
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
    '@media (max-width: 768px)': {
      margin: "0 10px",
      borderRadius: "15px",
    },
  },
  
  // Premium Header Section with New Styling
  headerSection: {
    height: "400px",
    position: "relative",
    display: "flex",
    alignItems: "flex-end",
    overflow: "hidden",
    '@media (max-width: 768px)': {
      height: "auto",
      minHeight: "300px",
      alignItems: "stretch",
    },
  },
  
  // Cover Image Layer
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
  
  // Gradient Overlay
  gradientOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: `
      linear-gradient(
        135deg,
        rgba(0, 0, 0, 0.9) 0%,
        rgba(0, 0, 0, 0.7) 30%,
        rgba(255, 107, 53, 0.15) 70%,
        rgba(255, 140, 66, 0.2) 100%
      )
    `,
  },
  
  // Premium Pattern Overlay
  premiumPattern: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: `
      radial-gradient(circle at 20% 20%, rgba(255, 107, 53, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(255, 140, 66, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 40% 60%, rgba(255, 163, 102, 0.05) 0%, transparent 50%)
    `,
  },

  headerContent: {
    width: "100%",
    padding: "40px 60px 50px",
    position: "relative",
    zIndex: 3,
    '@media (max-width: 768px)': {
      padding: "30px 20px",
    },
  },
  
  profileSection: {
    display: "flex",
    alignItems: "center",
    gap: "40px",
    '@media (max-width: 768px)': {
      flexDirection: "column",
      textAlign: "center",
      gap: "25px",
    },
  },
  
  profileImageContainer: {
    position: "relative",
    '@media (max-width: 768px)': {
      alignSelf: "center",
    },
  },
  
  profileImageBorder: {
    padding: "6px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #ff6b35 0%, #ff8c42 50%, #ffa366 100%)",
    boxShadow: `
      0 0 0 4px rgba(255, 107, 53, 0.2),
      0 20px 40px rgba(255, 107, 53, 0.3),
      inset 0 0 0 2px rgba(255, 255, 255, 0.1)
    `,
  },
  
  profileImage: {
    width: "160px",
    height: "160px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "3px solid #1a1a1a",
    '@media (max-width: 768px)': {
      width: "120px",
      height: "120px",
    },
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
    '@media (max-width: 768px)': {
      bottom: "5px",
      right: "5px",
      padding: "6px 12px",
      fontSize: "0.6rem",
    },
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
    '@media (max-width: 768px)': {
      textAlign: "center",
    },
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
    '@media (max-width: 768px)': {
      fontSize: "0.7rem",
      padding: "6px 12px",
    },
  },
  
  companyName: {
    fontSize: "3rem",
    fontWeight: "900",
    margin: "0 0 10px 0",
    letterSpacing: "-0.03em",
    background: "linear-gradient(135deg, #ffffff 0%, #ff6b35 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
    '@media (max-width: 768px)': {
      fontSize: "2rem",
    },
  },
  
  companyTitle: {
    fontSize: "1.3rem",
    fontWeight: "400",
    margin: "0 0 25px 0",
    color: "#ccc",
    '@media (max-width: 768px)': {
      fontSize: "1.1rem",
      marginBottom: "20px",
    },
  },

  // Header Domains
  headerDomainsContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    marginTop: "5px",
    '@media (max-width: 768px)': {
      justifyContent: "center",
      gap: "8px",
    },
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
    '@media (max-width: 768px)': {
      fontSize: "0.75rem",
      padding: "6px 12px",
    },
  },

  // Main Content Layout
  mainContent: {
    display: "flex",
    gap: "40px",
    padding: "50px 60px 60px",
    alignItems: "flex-start",
    '@media (max-width: 1024px)': {
      gap: "30px",
      padding: "40px 30px 50px",
    },
    '@media (max-width: 768px)': {
      flexDirection: "column",
      gap: "20px",
      padding: "30px 20px",
    },
  },
  leftColumn: {
    flex: "0 0 420px",
    display: "flex",
    flexDirection: "column",
    gap: "30px",
    '@media (max-width: 1024px)': {
      flex: "0 0 350px",
    },
    '@media (max-width: 768px)': {
      flex: "1",
      gap: "20px",
    },
  },
  rightColumn: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "30px",
    '@media (max-width: 768px)': {
      gap: "20px",
    },
  },

  // Card Styles
  card: {
    backgroundColor: "#2a2a2a",
    border: "1px solid #404040",
    borderRadius: "16px",
    overflow: "hidden",
    transition: "all 0.3s ease",
    marginLeft: '20px',
    marginRight: '20px',
    marginBottom: '20px',
    '@media (max-width: 768px)': {
      marginLeft: '10px',
      marginRight: '10px',
      marginBottom: '15px',
      borderRadius: "12px",
    },
  },
  cardHeader: {
    backgroundColor: "#000",
    padding: "25px 30px",
    borderBottom: "2px solid #ff6b35",
    cursor: "pointer",
    '@media (max-width: 768px)': {
      padding: "20px 20px",
    },
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
    '@media (max-width: 768px)': {
      fontSize: "1.1rem",
    },
  },
  cardContent: {
    padding: "30px",
    width: '100%',
    boxSizing: 'border-box',
    '@media (max-width: 768px)': {
      padding: "20px",
    },
  },

  // Contact Section
  contactItem: {
    padding: "20px 0",
    borderBottom: "1px solid #404040",
    '@media (max-width: 768px)': {
      padding: "15px 0",
    },
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
    '@media (max-width: 768px)': {
      fontSize: "1rem",
    },
  },

  // Statistics Section
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "25px",
    '@media (max-width: 768px)': {
      gap: "15px",
    },
  },
  statItem: {
    textAlign: "center",
    padding: "25px 20px",
    backgroundColor: "#1a1a1a",
    borderRadius: "12px",
    border: "1px solid #404040",
    transition: "all 0.3s ease",
    '@media (max-width: 768px)': {
      padding: "20px 15px",
    },
  },
  statNumber: {
    fontSize: "2.5rem",
    fontWeight: "900",
    color: "#fff",
    margin: "0 0 10px 0",
    '@media (max-width: 768px)': {
      fontSize: "2rem",
      margin: "0 0 8px 0",
    },
  },
  statLabel: {
    fontSize: "0.9rem",
    color: "#ccc",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "1px",
    '@media (max-width: 768px)': {
      fontSize: "0.8rem",
    },
  },

  // Job Offers Grid Section
  jobsGrid: {
    display: "grid",
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
    width: '100%',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
      gap: '15px',
    },
  },
  jobGridCard: {
    border: "1px solid #404040",
    borderRadius: "12px",
    padding: "20px",
    transition: "all 0.3s ease",
    backgroundColor: "#1a1a1a" },
      jobGridHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "15px",
    gap: "15px",
  },
  jobGridTitle: {
    fontSize: "1.1rem",
    fontWeight: "700",
    color: "#fff",
    margin: 0,
    flex: 1,
    lineHeight: "1.3",
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
    alignItems: "center",
    gap: "10px",
  },
  jobGridDetailLabel: {
    fontSize: "0.9rem",
    minWidth: "20px",
    color :"white",
    fontWeight: "800",
  },
  jobGridDetailValue: {
    fontSize: "0.9rem",
    color: "#fff",
    fontWeight: "500",
  },
  jobGridDescription: {
    fontSize: "0.9rem",
    color: "#ccc",
    lineHeight: "1.5",
    margin: 0,
  },

  // About Section
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

  // Newsletter List Section
  newsletterCard: {
    backgroundColor: "#2a2a2a",
    border: "1px solid #404040",
    borderRadius: "16px",
    overflow: "hidden",
    transition: "all 0.3s ease",
    margin: "0 60px 40px 60px", // Space before subscription section
  },
  
  newsletterCardHeader: {
    backgroundColor: "#000",
    padding: "25px 30px",
    borderBottom: "2px solid #ff6b35",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  
  newsletterCardTitle: {
    color: "#fff",
    fontSize: "1.3rem",
    fontWeight: "700",
    margin: 0,
    letterSpacing: "-0.01em",
  },
  
  newsletterCount: {
    backgroundColor: "#ff6b35",
    color: "#000",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "0.85rem",
    fontWeight: "800",
  },
  
  newsletterCardContent: {
    padding: "30px",
  },
  
  newslettersList: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
    gap: "25px",
    marginBottom: "20px",
  },
  
  newsletterItem: {
    backgroundColor: "#1a1a1a",
    padding: "30px",
    borderRadius: "16px",
    border: "1px solid #404040",
    transition: "all 0.3s ease",
    position: "relative",
    overflow: "hidden",
    cursor: "pointer",
  },
  
  newsletterItemHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "15px",
    gap: "15px",
  },
  
  newsletterItemTitle: {
    color: "#fff",
    fontSize: "1.25rem",
    fontWeight: "700",
    margin: "0",
    lineHeight: "1.3",
    flex: 1,
  },
  
  newsletterItemDate: {
    color: "#ff6b35",
    fontSize: "0.85rem",
    fontWeight: "600",
    backgroundColor: "#2a2a2a",
    padding: "6px 12px",
    borderRadius: "20px",
    border: "1px solid #404040",
    whiteSpace: "nowrap",
  },
  
  newsletterItemContent: {
    color: "#ccc",
    fontSize: "1rem",
    lineHeight: "1.6",
    margin: "0",
  },
  
  newsletterItemBadge: {
    position: "absolute",
    top: "20px",
    right: "20px",
    backgroundColor: "#ff6b35",
    color: "#000",
    fontSize: "0.7rem",
    fontWeight: "800",
    padding: "4px 10px",
    borderRadius: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },

  // Newsletter Subscription Section
  newsletterSection: {
    backgroundColor: "#000",
    padding: "80px 60px",
    textAlign: "center",
    position: "relative",
    borderTop: "2px solid #ff6b35",
    background: "linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)",
  },
  
  newsletterContainer: {
    maxWidth: "800px",
    margin: "0 auto",
  },
  
  newsletterTitle: {
    color: "#fff",
    fontSize: "2.5rem",
    fontWeight: "900",
    marginBottom: "15px",
    letterSpacing: "-0.02em",
    background: "linear-gradient(135deg, #ffffff 0%, #ff6b35 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  
  newsletterSubtitle: {
    color: "#ff6b35",
    fontSize: "1.1rem",
    fontWeight: "600",
    marginBottom: "10px",
    textTransform: "uppercase",
    letterSpacing: "2px",
  },
  
  newsletterText: {
    color: "#ccc",
    fontSize: "1.2rem",
    marginBottom: "40px",
    lineHeight: "1.6",
    maxWidth: "600px",
    margin: "0 auto 40px auto",
  },
  
  newsletterForm: {
    display: "flex",
    maxWidth: "500px",
    margin: "0 auto",
    gap: "0",
    borderRadius: "50px",
    border: "2px solid #404040",
    overflow: "hidden",
    backgroundColor: "#1a1a1a",
    transition: "all 0.3s ease",
  },
  
  newsletterInput: {
    flex: 1,
    padding: "18px 25px",
    border: "none",
    backgroundColor: "transparent",
    color: "#fff",
    fontSize: "1rem",
    fontWeight: "500",
    outline: "none",
  },
  
  newsletterButton: {
  all: "unset", // ✨ Reset all inherited styles
  display: "inline-block",
  padding: "12px 24px",
  backgroundColor: "#ff6b35",
  color: "#fff",
  fontWeight: "700",
  fontSize: "1rem",
  fontFamily: "inherit",
  borderRadius: "8px",
  cursor: "pointer",
  transition: "transform 0.2s ease, background-color 0.3s ease",
  textTransform: "uppercase",
  letterSpacing: "1px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  border: "none",
},
  
  newsletterFeatures: {
    display: "flex",
    justifyContent: "center",
    gap: "40px",
    marginTop: "50px",
    flexWrap: "wrap",
  },
  
  newsletterFeature: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "#ccc",
    fontSize: "0.95rem",
    fontWeight: "500",
  },
  
  newsletterFeatureIcon: {
    width: "20px",
    height: "20px",
    backgroundColor: "#ff6b35",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    fontWeight: "800",
    color: "#000",
  },

  // Empty State
  emptyState: {
    textAlign: "center",
    padding: "50px 20px",
  },
  emptyText: {
    color: "#999",
    fontSize: "1.1rem",
    margin: 0,
  },

  // Loading and Error States
  loadingMessage: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "60vh",
    fontSize: "1.3rem",
    color: "#fff",
    fontWeight: "500",
    backgroundColor: "#0a0a0a",
  },
 
  errorMessage: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "60vh",
    fontSize: "1.3rem",
    color: "#ff6b35",
    fontWeight: "500",
    backgroundColor: "#0a0a0a",
  },
};

export default RecruiterPublicProfile;
