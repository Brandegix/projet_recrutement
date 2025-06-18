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

  const { id } = useParams();

  useEffect(() => {
    // Fetch profile and job stats
    fetch(`${process.env.REACT_APP_API_URL}/api/recruiter/public-profile/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch public profile");
        return res.json();
      })
      .then(data => {
        setProfile(data);
        setJobStats(data.jobStats || null);
        setNewsletters(data.newsletters || []);
      })
      .catch((err) => {
        console.error(err);
        setError("Erreur lors du chargement du profil public.");
      });
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
  
  useEffect(() => {
    // Fetch last 3 job offers for the recruiter
    fetch(`${process.env.REACT_APP_API_URL}/api/recruiter/${id}/last-job-offers`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch job offers");
        return res.json();
      })
      .then(data => {
        setJobOffers(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [id]);

  // Loading Component
  const LoadingComponent = () => (
    <div style={pageStyles.container}>
      <div style={pageStyles.profileCard}>
        {/* Header Section Skeleton */}
        <div style={pageStyles.headerSection}>
          <div style={pageStyles.headerContent}>
            <div style={pageStyles.profileImageContainer}>
              <div style={pageStyles.profileImageSkeleton}>
                <div style={pageStyles.shimmer}></div>
              </div>
              <div style={pageStyles.statusBadgeSkeleton}>
                <div style={pageStyles.shimmer}></div>
              </div>
            </div>
            <div style={pageStyles.headerInfo}>
              <div style={pageStyles.companyNameSkeleton}>
                <div style={pageStyles.shimmer}></div>
              </div>
              <div style={pageStyles.companyTitleSkeleton}>
                <div style={pageStyles.shimmer}></div>
              </div>
              <div style={pageStyles.headerDivider}></div>
              <div style={pageStyles.headerDomainsContainer}>
                {[1, 2, 3].map((i) => (
                  <div key={i} style={pageStyles.headerDomainTagSkeleton}>
                    <div style={pageStyles.shimmer}></div>
                  </div>
                ))}
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
              <div style={pageStyles.cardHeader}>
                <div style={pageStyles.cardTitleSkeleton}>
                  <div style={pageStyles.shimmer}></div>
                </div>
              </div>
              <div style={pageStyles.cardContent}>
                {[1, 2, 3].map((i) => (
                  <div key={i} style={pageStyles.contactItem}>
                    <div style={pageStyles.contactLabelSkeleton}>
                      <div style={pageStyles.shimmer}></div>
                    </div>
                    <div style={pageStyles.contactValueSkeleton}>
                      <div style={pageStyles.shimmer}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Statistics Card */}
            <div style={pageStyles.card}>
              <div style={pageStyles.cardHeader}>
                <div style={pageStyles.cardTitleSkeleton}>
                  <div style={pageStyles.shimmer}></div>
                </div>
              </div>
              <div style={pageStyles.cardContent}>
                <div style={pageStyles.statsGrid}>
                  {[1, 2, 3].map((i) => (
                    <div key={i} style={pageStyles.statItem}>
                      <div style={pageStyles.statNumberSkeleton}>
                        <div style={pageStyles.shimmer}></div>
                      </div>
                      <div style={pageStyles.statLabelSkeleton}>
                        <div style={pageStyles.shimmer}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div style={pageStyles.rightColumn}>
            {/* About Section */}
            <div style={pageStyles.card}>
              <div style={pageStyles.cardHeader}>
                <div style={pageStyles.cardTitleSkeleton}>
                  <div style={pageStyles.shimmer}></div>
                </div>
              </div>
              <div style={pageStyles.cardContent}>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} style={pageStyles.aboutTextLineSkeleton}>
                    <div style={pageStyles.shimmer}></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Job Offers Section */}
        <div style={pageStyles.card}>
          <div style={pageStyles.cardHeader}>
            <div style={pageStyles.cardTitleSkeleton}>
              <div style={pageStyles.shimmer}></div>
            </div>
          </div>
          <div style={pageStyles.cardContent}>
            <div style={pageStyles.jobsGrid}>
              {[1, 2, 3].map((i) => (
                <div key={i} style={pageStyles.jobGridCard}>
                  <div style={pageStyles.jobGridHeader}>
                    <div style={pageStyles.jobGridTitleSkeleton}>
                      <div style={pageStyles.shimmer}></div>
                    </div>
                    <div style={pageStyles.jobGridDateSkeleton}>
                      <div style={pageStyles.shimmer}></div>
                    </div>
                  </div>
                  <div style={pageStyles.jobGridDetails}>
                    {[1, 2, 3].map((j) => (
                      <div key={j} style={pageStyles.jobGridDetailItem}>
                        <div style={pageStyles.jobGridDetailSkeleton}>
                          <div style={pageStyles.shimmer}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={pageStyles.jobGridDescriptionSkeleton}>
                    <div style={pageStyles.shimmer}></div>
                  </div>
                  <div style={{...pageStyles.jobGridDescriptionSkeleton, width: '60%'}}>
                    <div style={pageStyles.shimmer}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div style={pageStyles.newsletterSection}>
        <div style={pageStyles.newsletterContainer}>
          <div style={pageStyles.newsletterSubtitleSkeleton}>
            <div style={pageStyles.shimmer}></div>
          </div>
          <div style={pageStyles.newsletterTitleSkeleton}>
            <div style={pageStyles.shimmer}></div>
          </div>
          <div style={pageStyles.newsletterTextSkeleton}>
            <div style={pageStyles.shimmer}></div>
          </div>
          <div style={pageStyles.newsletterFormSkeleton}>
            <div style={pageStyles.shimmer}></div>
          </div>
        </div>
      </div>

      {/* Floating Loading Indicator */}
      <div style={pageStyles.loadingIndicator}>
        <div style={pageStyles.spinner}></div>
        <div style={pageStyles.loadingText}>Chargement du profil...</div>
      </div>
    </div>
  );

  if (error) return <div style={pageStyles.errorMessage}>{error}</div>;
  if (!profile) return (
    <>
      <Navbar />
      <LoadingComponent />
      <Footer />
    </>
  );

  return (
    <>
      <Navbar />
      <div style={pageStyles.container}>
        <div style={pageStyles.profileCard}>
          {/* Premium Header Section */}
          <div
            style={{
              ...pageStyles.headerSection,
              background: profile?.cover_image
        ? (() => {
            console.log("Cover image URL in header:", profile.cover_image);
            return `linear-gradient(to right, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.85) 60%, transparent 100%), url(${profile.cover_image})`;
          })()
        : 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #ff6b35 100%)',
            }}
          >
            <div style={pageStyles.headerContent}>
              <div style={pageStyles.profileImageContainer}>
                <img
                  src={
                    profile.profile_image
                      ? `${process.env.REACT_APP_API_URL}/uploads/profile_images/${profile.profile_image}`
                      : candidatImage
                  }
                  alt="Recruiter Profile"
                  style={pageStyles.profileImage}
                />
                <div style={pageStyles.statusBadge}>ACTIF</div>
              </div>
              <div style={pageStyles.headerInfo}>
                <h1 style={pageStyles.companyName}>{profile.companyName}</h1>
                <p style={pageStyles.companyTitle}>{profile.company_title}</p>
                <div style={pageStyles.headerDivider}></div>
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
                  <h3 style={pageStyles.cardTitle}>Informations de contact
                  <span style={{
                      ...pageStyles.toggleIcon,
                      transform: showInfos ? "rotate(90deg)" : "rotate(0deg)"
                    }}>
                      ▶
                    </span>
                    </h3>
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
        
         {/* Job Offers Section - Moved here and displayed as grid */}
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
     
        {/* Newsletter Subscription Section (full-width, outside main content) */}
        <div style={pageStyles.newsletterSection}>
          <div style={pageStyles.newsletterContainer}>
            <div style={pageStyles.newsletterSubtitle}>Restez connecté</div>
            <h2 style={pageStyles.newsletterTitle}>Ne manquez aucune opportunité</h2>
            <p style={pageStyles.newsletterText}>
              Recevez les dernières offres d'emploi, actualités du secteur et conseils carrière 
              directement dans votre boîte mail.
            </p>
            
            <form
              style={pageStyles.newsletterForm}
              onSubmit={handleSubmit}
            >
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
  container: {
    minHeight: "100vh",
    backgroundColor: "#0a0a0a",
    padding: "20px 10px",
    position: "relative",
    '@media (max-width: 768px)': {
      padding: '10px 5px',
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
      borderRadius: '15px',
      margin: '0 5px',
    },
  },
  
  // Header Section
  headerSection: {
    height: "320px",
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative",
    display: "flex",
    alignItems: "flex-end",
    '@media (max-width: 1024px)': {
      height: '280px',
    },
    '@media (max-width: 768px)': {
      height: '250px',
    },
    '@media (max-width: 480px)': {
      height: '220px',
    },
  },
  headerContent: {
    width: "100%",
    padding: "50px 60px",
    display: "flex",
    alignItems: "center",
    gap: "40px",
    background: "linear-gradient(to top, rgba(0,0,0,0.95), transparent)",
    '@media (max-width: 1024px)': {
      padding: '40px 40px',
      gap: '30px',
    },
    '@media (max-width: 768px)': {
      padding: '30px 20px',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      gap: '20px',
    },
    '@media (max-width: 480px)': {
      padding: '20px 15px',
      gap: '15px',
    },
  },
  profileImageContainer: {
    position: "relative",
  },
  profileImage: {
    width: "180px",
    height: "180px",
    borderRadius: "50%",
    border: "4px solid #ff6b35",
    objectFit: "cover",
    boxShadow: "0 15px 40px rgba(255,107,53,0.4)",
    '@media (max-width: 1024px)': {
      width: '150px',
      height: '150px',
    },
    '@media (max-width: 768px)': {
      width: '120px',
      height: '120px',
    },
    '@media (max-width: 480px)': {
      width: '100px',
      height: '100px',
    },
  },
  profileImageSkeleton: {
    width: "180px",
    height: "180px",
    borderRadius: "50%",
    border: "4px solid #333",
    backgroundColor: "#2a2a2a",
    position: "relative",
    overflow: "hidden",
    '@media (max-width: 1024px)': {
      width: '150px',
      height: '150px',
    },
    '@media (max-width: 768px)': {
      width: '120px',
      height: '120px',
    },
    '@media (max-width: 480px)': {
      width: '100px',
      height: '100px',
    },
  },
  statusBadge: {
    position: "absolute",
    bottom: "15px",
    right: "15px",
    backgroundColor: "#ff6b35",
    color: "#000",
    padding: "6px 14px",
    borderRadius: "20px",
    fontSize: "0.75rem",
    fontWeight: "800",
    letterSpacing: "0.5px",
    border: "2px solid #1a1a1a",
    '@media (max-width: 768px)': {
      bottom: '10px',
      right: '10px',
      padding: '4px 8px',
      fontSize: '0.7rem',
    },
    '@media (max-width: 480px)': {
      bottom: '8px',
      right: '8px',
      padding: '3px 6px',
      fontSize: '0.65rem',
    },
  },
  statusBadgeSkeleton: {
    position: "absolute",
    bottom: "15px",
    right: "15px",
    width: "60px",
    height: "26px",
    backgroundColor: "#333",
    borderRadius: "20px",
    border: "2px solid #1a1a1a",
    overflow: "hidden",
    '@media (max-width: 768px)': {
      bottom: '10px',
      right: '10px',
      width: '50px',
      height: '22px',
    },
    '@media (max-width: 480px)': {
      bottom: '8px',
      right: '8px',
      width: '40px',
      height: '18px',
    },
  },
  headerInfo: {
    color: "white",
    flex: 1,
    '@media (max-width: 768px)': {
      textAlign: 'center',
    },
  },
  companyName: {
    fontSize: "3.5rem",
    fontWeight: "900",
    margin: "0 0 12px 0",
    letterSpacing: "-0.03em",
    background: "linear-gradient(135deg, #ffffff 0%, #ff6b35 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    '@media (max-width: 1024px)': {
      fontSize: '2.8rem',
    },
    '@media (max-width: 768px)': {
      fontSize: '2.2rem',
    },
    '@media (max-width: 480px)': {
      fontSize: '1.8rem',
    },
    '@media (max-width: 360px)': {
      fontSize: '1.5rem',
    },
  },
  companyNameSkeleton: {
    height: "50px",
    width: "300px",
    backgroundColor: "#2a2a2a",
    borderRadius: "8px",
    marginBottom: "12px",
    position: "relative",
    overflow: "hidden",
    '@media (max-width: 768px)': {
      width: '250px',
      height: '40px',
      margin: '0 auto 12px auto',
    },
    '@media (max-width: 480px)': {
      width: '200px',
      height: '35px',
    },
    '@media (max-width: 360px)': {
      width: '180px',
      height: '30px',
    },
  },
  companyTitle: {
    fontSize: "1.5rem",
    fontWeight: "400",
    margin: "0 0 25px 0",
    color: "#ccc",
    '@media (max-width: 768px)': {
      fontSize: '1.2rem',
    },
    '@media (max-width: 480px)': {
      fontSize: '1rem',
    },
  },
  companyTitleSkeleton: {
    height: "24px",
    width: "200px",
    backgroundColor: "#2a2a2a",
    borderRadius: "6px",
    marginBottom: "25px",
    position: "relative",
    overflow: "hidden",
    '@media (max-width: 768px)': {
      width: '150px',
      height: '20px',
      margin: '0 auto 25px auto',
    },
    '@media (max-width: 480px)': {
      width: '120px',
      height: '18px',
    },
  },
  headerDivider: {
    width: "100px",
    height: "4px",
    background: "linear-gradient(90deg, #ff6b35, #ff8c42)",
    borderRadius: "2px",
    marginBottom: "20px",
    '@media (max-width: 768px)': {
      margin: '0 auto 20px auto',
    },
    '@media (max-width: 480px)': {
      width: '80px',
      height: '3px',
    },
  },

  // Header Domains
  headerDomainsContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    marginTop: "5px",
    '@media (max-width: 768px)': {
      justifyContent: 'center',
      gap: '8px',
    },
    '@media (max-width: 480px)': {
      gap: '6px',
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
    '@media (max-width: 480px)': {
      padding: '6px 12px',
      fontSize: '0.8rem',
    },
    '@media (max-width: 360px)': {
      padding: '4px 8px',
      fontSize: '0.75rem',
    },
  },
  headerDomainTagSkeleton: {
    width: "80px",
    height: "36px",
    backgroundColor: "#2a2a2a",
    borderRadius: "20px",
    border: "1px solid #404040",
    position: "relative",
    overflow: "hidden",
    '@media (max-width: 480px)': {
      width: '70px',
      height: '32px',
    },
    '@media (max-width: 360px)': {
      width: '60px',
      height: '28px',
    },
  },

  // Main Content Layout
  mainContent: {
    display: "flex",
    gap: "30px",
    padding: "40px 60px",
    '@media (max-width: 1024px)': {
      padding: '30px 40px',
      gap: '25px',
    },
    '@media (max-width: 768px)': {
      flexDirection: 'column',
      padding: '25px 20px',
      gap: '20px',
    },
    '@media (max-width: 480px)': {
      padding: '20px 15px',
      gap: '15px',
    },
  },
  leftColumn: {
    flex: "1",
    display: "flex",
    flexDirection: "column",
    gap: "30px",
    '@media (max-width: 768px)': {
      gap: '20px',
    },
  },
  rightColumn: {
    flex: "2",
    display: "flex",
    flexDirection: "column",
    gap: "30px",
    '@media (max-width: 768px)': {
      gap: '20px',
    },
  },

  // Card Styles (General)
  card: {
    backgroundColor: "#2a2a2a",
    borderRadius: "15px",
    padding: "30px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
    border: "1px solid #333",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 15px 40px rgba(0,0,0,0.4)',
    },
    '@media (max-width: 1024px)': {
      padding: '25px',
    },
    '@media (max-width: 768px)': {
      padding: '20px',
    },
    '@media (max-width: 480px)': {
      padding: '15px',
    },
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: "25px",
    paddingBottom: "15px",
    borderBottom: "1px solid #444",
    cursor: 'pointer',
    '@media (max-width: 768px)': {
      marginBottom: '20px',
      paddingBottom: '10px',
    },
    '@media (max-width: 480px)': {
      marginBottom: '15px',
    },
  },
  cardTitle: {
    fontSize: "1.8rem",
    color: "#ffffff",
    margin: "0",
    fontWeight: "700",
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    '@media (max-width: 1024px)': {
      fontSize: '1.6rem',
    },
    '@media (max-width: 768px)': {
      fontSize: '1.4rem',
    },
    '@media (max-width: 480px)': {
      fontSize: '1.2rem',
    },
  },
  toggleIcon: {
    fontSize: '1.2rem',
    color: '#ff6b35',
    transition: 'transform 0.3s ease',
    '@media (max-width: 480px)': {
      fontSize: '1rem',
    },
  },
  cardTitleSkeleton: {
    height: "30px",
    width: "200px",
    backgroundColor: "#3a3a3a",
    borderRadius: "5px",
    position: "relative",
    overflow: "hidden",
    '@media (max-width: 768px)': {
      height: '25px',
      width: '180px',
    },
    '@media (max-width: 480px)': {
      height: '22px',
      width: '150px',
    },
  },
  cardContent: {
    color: "#e0e0e0",
    lineHeight: "1.7",
  },

  // Contact Information
  contactItem: {
    display: "flex",
    alignItems: "center",
    marginBottom: "15px",
    gap: '15px',
    '&:last-child': {
      marginBottom: '0',
    },
    '@media (max-width: 480px)': {
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: '5px',
    },
  },
  contactInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  contactLabel: {
    fontSize: "0.95rem",
    color: "#aaa",
    fontWeight: "500",
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '5px',
    '@media (max-width: 480px)': {
      fontSize: '0.85rem',
    },
  },
  contactValue: {
    fontSize: "1.05rem",
    color: "#fff",
    fontWeight: "400",
    '@media (max-width: 480px)': {
      fontSize: '0.95rem',
    },
  },
  contactLabelSkeleton: {
    height: "18px",
    width: "80px",
    backgroundColor: "#3a3a3a",
    borderRadius: "3px",
    marginBottom: "5px",
    position: "relative",
    overflow: "hidden",
  },
  contactValueSkeleton: {
    height: "20px",
    width: "150px",
    backgroundColor: "#3a3a3a",
    borderRadius: "3px",
    position: "relative",
    overflow: "hidden",
  },

  // Statistics Grid
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
    gap: "20px",
    '@media (max-width: 480px)': {
      gridTemplateColumns: '1fr',
      gap: '15px',
    },
  },
  statItem: {
    backgroundColor: "#3a3a3a",
    borderRadius: "10px",
    padding: "20px",
    textAlign: "center",
    border: "1px solid #444",
    transition: "background-color 0.3s ease",
    '&:hover': {
      backgroundColor: '#4a4a4a',
    },
    '@media (max-width: 768px)': {
      padding: '15px',
    },
    '@media (max-width: 480px)': {
      padding: '12px',
    },
  },
  statNumber: {
    fontSize: "2.5rem",
    fontWeight: "800",
    color: "#ff6b35",
    marginBottom: "5px",
    '@media (max-width: 768px)': {
      fontSize: '2rem',
    },
    '@media (max-width: 480px)': {
      fontSize: '1.8rem',
    },
  },
  statNumberSkeleton: {
    height: "40px",
    width: "60%",
    margin: "0 auto 5px auto",
    backgroundColor: "#4a4a4a",
    borderRadius: "5px",
    position: "relative",
    overflow: "hidden",
  },
  statLabel: {
    fontSize: "1rem",
    color: "#bbb",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    '@media (max-width: 768px)': {
      fontSize: '0.9rem',
    },
    '@media (max-width: 480px)': {
      fontSize: '0.8rem',
    },
  },
  statLabelSkeleton: {
    height: "18px",
    width: "70%",
    margin: "0 auto",
    backgroundColor: "#4a4a4a",
    borderRadius: "3px",
    position: "relative",
    overflow: "hidden",
  },

  // About Section
  aboutText: {
    fontSize: "1.05rem",
    color: "#e0e0e0",
    '@media (max-width: 768px)': {
      fontSize: '1rem',
    },
    '@media (max-width: 480px)': {
      fontSize: '0.95rem',
    },
  },
  aboutTextLineSkeleton: {
    height: "18px",
    width: "100%",
    backgroundColor: "#3a3a3a",
    borderRadius: "3px",
    marginBottom: "10px",
    position: "relative",
    overflow: "hidden",
    '&:nth-child(even)': {
      width: '90%',
    },
    '&:last-child': {
      width: '70%',
      marginBottom: '0',
    },
  },

  // Job Offers Grid
  jobsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "25px",
    '@media (max-width: 1024px)': {
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '20px',
    },
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
      gap: '18px',
    },
  },
  jobGridCard: {
    backgroundColor: "#3a3a3a",
    borderRadius: "12px",
    padding: "25px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
    border: "1px solid #444",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    '&:hover': {
      transform: 'translateY(-5px) scale(1.01)',
      boxShadow: '0 12px 25px rgba(0,0,0,0.35)',
    },
    '@media (max-width: 768px)': {
      padding: '20px',
    },
    '@media (max-width: 480px)': {
      padding: '18px',
    },
  },
  jobGridHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: "15px",
    '@media (max-width: 480px)': {
      flexDirection: 'column',
      alignItems: 'flex-start',
      marginBottom: '10px',
    },
  },
  jobGridTitle: {
    fontSize: "1.4rem",
    color: "#ff6b35",
    margin: "0",
    fontWeight: "700",
    '@media (max-width: 768px)': {
      fontSize: '1.2rem',
    },
    '@media (max-width: 480px)': {
      fontSize: '1.1rem',
    },
  },
  jobGridTitleSkeleton: {
    height: "24px",
    width: "70%",
    backgroundColor: "#4a4a4a",
    borderRadius: "4px",
    position: "relative",
    overflow: "hidden",
  },
  jobGridDate: {
    fontSize: "0.85rem",
    color: "#aaa",
    '@media (max-width: 480px)': {
      fontSize: '0.8rem',
    },
  },
  jobGridDateSkeleton: {
    height: "16px",
    width: "80px",
    backgroundColor: "#4a4a4a",
    borderRadius: "3px",
    position: "relative",
    overflow: "hidden",
  },
  jobGridDetails: {
    marginBottom: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    '@media (max-width: 480px)': {
      marginBottom: '15px',
      gap: '6px',
    },
  },
  jobGridDetailItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  jobGridDetailLabel: {
    fontSize: "0.95rem",
    color: "#ccc",
    fontWeight: "600",
    '@media (max-width: 480px)': {
      fontSize: '0.9rem',
    },
  },
  jobGridDetailValue: {
    fontSize: "0.95rem",
    color: "#e0e0e0",
    '@media (max-width: 480px)': {
      fontSize: '0.9rem',
    },
  },
  jobGridDetailSkeleton: {
    height: "18px",
    width: "100%",
    backgroundColor: "#4a4a4a",
    borderRadius: "3px",
    position: "relative",
    overflow: "hidden",
  },
  jobGridDescription: {
    fontSize: "0.9rem",
    color: "#bbb",
    lineHeight: "1.6",
    margin: "0",
    '@media (max-width: 768px)': {
      fontSize: '0.85rem',
    },
    '@media (max-width: 480px)': {
      fontSize: '0.8rem',
    },
  },
  jobGridDescriptionSkeleton: {
    height: "16px",
    width: "90%",
    backgroundColor: "#4a4a4a",
    borderRadius: "3px",
    marginBottom: "8px",
    position: "relative",
    overflow: "hidden",
    '&:last-child': {
      marginBottom: '0',
    },
  },
  emptyState: {
    textAlign: "center",
    padding: "40px 20px",
    backgroundColor: "#3a3a3a",
    borderRadius: "10px",
    border: "1px dashed #555",
    '@media (max-width: 480px)': {
      padding: '30px 15px',
    },
  },
  emptyText: {
    fontSize: "1.1rem",
    color: "#bbb",
    fontWeight: "500",
    margin: "0",
    '@media (max-width: 480px)': {
      fontSize: '1rem',
    },
  },

  // Newsletter Section
  newsletterSection: {
    backgroundColor: "#1f1f1f",
    padding: "80px 20px",
    textAlign: "center",
    borderTop: "1px solid #333",
    marginTop: "40px",
    '@media (max-width: 1024px)': {
      padding: '60px 20px',
      marginTop: '30px',
    },
    '@media (max-width: 768px)': {
      padding: '50px 15px',
      marginTop: '25px',
    },
    '@media (max-width: 480px)': {
      padding: '40px 10px',
      marginTop: '20px',
    },
  },
  newsletterContainer: {
    maxWidth: "800px",
    margin: "0 auto",
  },
  newsletterSubtitle: {
    fontSize: "1.2rem",
    color: "#ff6b35",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "1px",
    marginBottom: "15px",
    '@media (max-width: 768px)': {
      fontSize: '1.1rem',
      marginBottom: '10px',
    },
    '@media (max-width: 480px)': {
      fontSize: '1rem',
    },
  },
  newsletterSubtitleSkeleton: {
    height: "20px",
    width: "150px",
    margin: "0 auto 15px auto",
    backgroundColor: "#2a2a2a",
    borderRadius: "4px",
    position: "relative",
    overflow: "hidden",
  },
  newsletterTitle: {
    fontSize: "3rem",
    color: "#ffffff",
    fontWeight: "900",
    marginBottom: "20px",
    lineHeight: "1.2",
    '@media (max-width: 1024px)': {
      fontSize: '2.5rem',
    },
    '@media (max-width: 768px)': {
      fontSize: '2rem',
    },
    '@media (max-width: 480px)': {
      fontSize: '1.8rem',
      marginBottom: '15px',
    },
    '@media (max-width: 360px)': {
      fontSize: '1.5rem',
    },
  },
  newsletterTitleSkeleton: {
    height: "45px",
    width: "70%",
    margin: "0 auto 20px auto",
    backgroundColor: "#2a2a2a",
    borderRadius: "6px",
    position: "relative",
    overflow: "hidden",
  },
  newsletterText: {
    fontSize: "1.1rem",
    color: "#cccccc",
    marginBottom: "30px",
    lineHeight: "1.7",
    '@media (max-width: 768px)': {
      fontSize: '1rem',
      marginBottom: '25px',
    },
    '@media (max-width: 480px)': {
      fontSize: '0.95rem',
      marginBottom: '20px',
    },
  },
  newsletterTextSkeleton: {
    height: "20px",
    width: "80%",
    margin: "0 auto 10px auto",
    backgroundColor: "#2a2a2a",
    borderRadius: "4px",
    position: "relative",
    overflow: "hidden",
    '&:last-child': {
      width: '60%',
      marginBottom: '30px',
    },
  },
  newsletterForm: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    maxWidth: "500px",
    margin: "0 auto 30px auto",
    '@media (max-width: 480px)': {
      flexDirection: 'column',
      alignItems: 'center',
      gap: '10px',
    },
  },
  newsletterFormSkeleton: {
    height: "50px",
    width: "400px",
    margin: "0 auto 30px auto",
    backgroundColor: "#2a2a2a",
    borderRadius: "8px",
    position: "relative",
    overflow: "hidden",
    '@media (max-width: 480px)': {
      width: '90%',
      height: '45px',
    },
  },
  newsletterInput: {
    flex: "1",
    padding: "15px 20px",
    borderRadius: "8px",
    border: "1px solid #555",
    backgroundColor: "#3a3a3a",
    color: "#ffffff",
    fontSize: "1rem",
    outline: "none",
    '&::placeholder': {
      color: '#888',
    },
    '&:focus': {
      borderColor: '#ff6b35',
      boxShadow: '0 0 0 3px rgba(255,107,53,0.3)',
    },
    '@media (max-width: 480px)': {
      width: '100%',
      padding: '12px 15px',
    },
  },
  newsletterButton: {
    padding: "15px 30px",
    backgroundColor: "#ff6b35",
    color: "#1a1a1a",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "700",
    transition: "background-color 0.3s ease, transform 0.2s ease",
    '&:hover': {
      backgroundColor: '#e05a28',
      transform: 'scale(1.02)',
    },
    '@media (max-width: 480px)': {
      width: '100%',
      padding: '12px 20px',
    },
  },
  newsletterFeatures: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: "25px",
    marginTop: "20px",
    '@media (max-width: 768px)': {
      gap: '20px',
    },
    '@media (max-width: 480px)': {
      flexDirection: 'column',
      alignItems: 'center',
      gap: '15px',
    },
  },
  newsletterFeature: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "#e0e0e0",
    fontSize: "0.95rem",
    fontWeight: "500",
    '@media (max-width: 480px)': {
      fontSize: '0.9rem',
    },
  },
  newsletterFeatureIcon: {
    backgroundColor: "#ff6b35",
    color: "#1a1a1a",
    borderRadius: "50%",
    width: "22px",
    height: "22px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "0.8rem",
    fontWeight: "800",
  },

  // Skeleton Loading Shimmer Effect
  shimmer: {
    position: "absolute",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    animation: "shimmer 2s infinite linear",
    background: "linear-gradient(to right, #3a3a3a 8%, #4a4a4a 18%, #3a3a3a 33%)",
    backgroundSize: "800px 100%",
  },
  '@keyframes shimmer': {
    '0%': {
      backgroundPosition: '-468px 0',
    },
    '100%': {
      backgroundPosition: '468px 0',
    },
  },

  // Floating Loading Indicator
  loadingIndicator: {
    position: "fixed",
    bottom: "30px",
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "rgba(255, 107, 53, 0.9)",
    color: "#000",
    padding: "12px 25px",
    borderRadius: "30px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    boxShadow: "0 8px 25px rgba(255, 107, 53, 0.4)",
    zIndex: "1000",
    opacity: "1",
    transition: "opacity 0.3s ease",
    '@media (max-width: 480px)': {
      bottom: '20px',
      padding: '10px 20px',
      gap: '8px',
    },
  },
  spinner: {
    border: "3px solid rgba(0, 0, 0, 0.3)",
    borderTop: "3px solid #000",
    borderRadius: "50%",
    width: "20px",
    height: "20px",
    animation: "spin 1s linear infinite",
    '@media (max-width: 480px)': {
      width: '18px',
      height: '18px',
    },
  },
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },
  loadingText: {
    fontSize: "0.95rem",
    fontWeight: "600",
    '@media (max-width: 480px)': {
      fontSize: '0.85rem',
    },
  },

  // Error Message
  errorMessage: {
    textAlign: "center",
    color: "#ff6b35",
    fontSize: "1.2rem",
    padding: "50px",
    backgroundColor: "#1a1a1a",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "20px",
    margin: "20px auto",
    maxWidth: "800px",
    border: "1px solid #444",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
    '@media (max-width: 768px)': {
      fontSize: '1.1rem',
      padding: '30px',
    },
    '@media (max-width: 480px)': {
      fontSize: '1rem',
      padding: '20px',
    },
  },
};

export default RecruiterPublicProfile;
