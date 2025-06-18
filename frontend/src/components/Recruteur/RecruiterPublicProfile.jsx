import React, { useEffect, useState, useCallback } from "react";
import Navbar from "../Navbara";
import Footer from "../Footer";
import { useParams } from "react-router-dom";
import candidatImage from '../../assets/images/choixRole/recruiter.jpg';

// --- Custom Hook for Media Queries ---
const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [matches, query]);

  return matches;
};

// --- Your Styles (adjusted to be dynamic and handle pseudo-classes) ---
const getPageStyles = (isMobile, isTablet) => ({
  container: {
    minHeight: "100vh",
    backgroundColor: "#0a0a0a",
    padding: isTablet ? "10px 5px" : "20px 10px", // Example conditional padding
    position: "relative",
  },
  profileCard: {
    maxWidth: "1400px",
    margin: "0 auto",
    backgroundColor: "#1a1a1a",
    borderRadius: isTablet ? "15px" : "20px",
    overflow: "hidden",
    boxShadow: "0 25px 80px rgba(0,0,0,0.5)",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    border: "1px solid #333",
    ...(isTablet && { margin: "0 5px" }), // Conditional margin
  },
  headerSection: (coverImage) => ({
    height: isMobile ? "220px" : isTablet ? "250px" : "320px", // Conditional height
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative",
    display: "flex",
    alignItems: "flex-end",
    background: coverImage
      ? `linear-gradient(to right, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.85) 60%, transparent 100%), url(${coverImage})`
      : 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #ff6b35 100%)',
  }),
  headerContent: {
    padding: isMobile ? "15px" : isTablet ? "20px" : "30px",
    display: "flex",
    alignItems: "center",
    gap: isMobile ? "15px" : "20px",
    width: "100%",
  },
  profileImageContainer: {
    position: "relative",
    width: isMobile ? "90px" : "120px",
    height: isMobile ? "90px" : "120px",
    flexShrink: "0",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    objectFit: "cover",
    border: "4px solid #ff6b35",
    boxShadow: "0 0 15px rgba(255,107,53,0.4)",
  },
  statusBadge: {
    position: "absolute",
    bottom: "0",
    right: "0",
    backgroundColor: "#28a745",
    color: "#fff",
    padding: isMobile ? "3px 8px" : "5px 10px",
    borderRadius: "15px",
    fontSize: isMobile ? "0.7rem" : "0.8rem",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  headerInfo: {
    display: "flex",
    flexDirection: "column",
    flex: "1",
    minWidth: "0",
  },
  companyName: {
    fontSize: isMobile ? "1.8rem" : isTablet ? "2.2rem" : "3rem",
    color: "#ffffff",
    margin: "0 0 5px 0",
    fontWeight: "800",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  companyTitle: {
    fontSize: isMobile ? "0.9rem" : isTablet ? "1rem" : "1.1rem",
    color: "#ccc",
    margin: "0 0 10px 0",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  headerDivider: {
    width: "60px",
    height: "3px",
    backgroundColor: "#ff6b35",
    margin: "15px 0",
    borderRadius: "2px",
    ...(isMobile && { margin: "10px 0" }),
  },
  headerDomainsContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginTop: "10px",
    ...(isMobile && { gap: "8px" }),
  },
  headerDomainTag: {
    backgroundColor: "#3a3a3a",
    color: "#fff",
    padding: isMobile ? "5px 10px" : "7px 12px",
    borderRadius: "20px",
    fontSize: isMobile ? "0.75rem" : "0.85rem",
    fontWeight: "500",
  },

  // Skeleton Styles
  profileImageSkeleton: {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    backgroundColor: "#3a3a3a",
    position: "relative",
    overflow: "hidden",
  },
  statusBadgeSkeleton: {
    position: "absolute",
    bottom: "0",
    right: "0",
    width: "50px",
    height: "18px",
    backgroundColor: "#3a3a3a",
    borderRadius: "15px",
    overflow: "hidden",
    position: "relative",
  },
  companyNameSkeleton: {
    height: isMobile ? "28px" : isTablet ? "35px" : "45px",
    width: "70%",
    backgroundColor: "#3a3a3a",
    borderRadius: "5px",
    marginBottom: "5px",
    position: "relative",
    overflow: "hidden",
  },
  companyTitleSkeleton: {
    height: isMobile ? "18px" : "20px",
    width: "50%",
    backgroundColor: "#3a3a3a",
    borderRadius: "3px",
    position: "relative",
    overflow: "hidden",
  },
  headerDomainTagSkeleton: {
    backgroundColor: "#3a3a3a",
    borderRadius: "20px",
    width: "80px",
    height: isMobile ? "22px" : "28px",
    position: "relative",
    overflow: "hidden",
  },

  // Main Content Layout
  mainContent: {
    display: "flex",
    gap: isMobile ? "15px" : isTablet ? "25px" : "30px",
    padding: isMobile ? "20px 15px" : isTablet ? "30px 40px" : "40px 60px",
    ...(isTablet && { flexDirection: 'column' }), // Tablet and mobile column layout
    ...(isMobile && { flexDirection: 'column' }),
  },
  leftColumn: {
    flex: "1",
    display: "flex",
    flexDirection: "column",
    gap: isMobile ? "15px" : isTablet ? "20px" : "30px",
  },
  rightColumn: {
    flex: "2",
    display: "flex",
    flexDirection: "column",
    gap: isMobile ? "15px" : isTablet ? "20px" : "30px",
  },

  // Card Styles (General)
  card: (isHovered = false) => ({ // Add isHovered parameter
    backgroundColor: "#2a2a2a",
    borderRadius: "15px",
    padding: isMobile ? "15px" : isTablet ? "20px" : "30px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
    border: "1px solid #333",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    ...(isHovered && { // Apply hover styles conditionally
      transform: 'translateY(-5px)',
      boxShadow: '0 15px 40px rgba(0,0,0,0.4)',
    }),
  }),
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: isMobile ? "15px" : isTablet ? "20px" : "25px",
    paddingBottom: isMobile ? "10px" : "15px",
    borderBottom: "1px solid #444",
    cursor: 'pointer',
  },
  cardTitle: {
    fontSize: isMobile ? "1.2rem" : isTablet ? "1.4rem" : "1.8rem",
    color: "#ffffff",
    margin: "0",
    fontWeight: "700",
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  toggleIcon: (isRotated = false) => ({ // Add isRotated parameter for dynamic transform
    fontSize: isMobile ? "1rem" : "1.2rem",
    color: '#ff6b35',
    transition: 'transform 0.3s ease',
    transform: isRotated ? "rotate(90deg)" : "rotate(0deg)",
  }),
  cardTitleSkeleton: {
    height: isMobile ? "22px" : isTablet ? "25px" : "30px",
    width: isMobile ? "150px" : isTablet ? "180px" : "200px",
    backgroundColor: "#3a3a3a",
    borderRadius: "5px",
    position: "relative",
    overflow: "hidden",
  },
  cardContent: {
    color: "#e0e0e0",
    lineHeight: "1.7",
  },

  // Contact Information
  contactItem: {
    display: "flex",
    alignItems: isMobile ? "flex-start" : "center", // Mobile column layout
    marginBottom: "15px",
    gap: isMobile ? "5px" : "15px",
    ...(isMobile && { flexDirection: 'column' }),
  },
  contactInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  contactLabel: {
    fontSize: isMobile ? "0.85rem" : "0.95rem",
    color: "#aaa",
    fontWeight: "500",
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '5px',
  },
  contactValue: {
    fontSize: isMobile ? "0.95rem" : "1.05rem",
    color: "#fff",
    fontWeight: "400",
  },
  contactLabelSkeleton: {
    height: "18px",
    width: "80px",
    backgroundColor: "#3a3a3a",
    borderRadius: "3px",
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
    gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(120px, 1fr))",
    gap: isMobile ? "15px" : "20px",
  },
  statItem: (isHovered = false) => ({ // Add isHovered parameter
    backgroundColor: "#3a3a3a",
    borderRadius: "10px",
    padding: isMobile ? "12px" : isTablet ? "15px" : "20px",
    textAlign: "center",
    border: "1px solid #444",
    transition: "background-color 0.3s ease",
    ...(isHovered && { backgroundColor: '#4a4a4a' }),
  }),
  statNumber: {
    fontSize: isMobile ? "1.8rem" : isTablet ? "2rem" : "2.5rem",
    fontWeight: "800",
    color: "#ff6b35",
    marginBottom: "5px",
  },
  statNumberSkeleton: {
    height: isMobile ? "30px" : "40px",
    width: "60%",
    margin: "0 auto 5px auto",
    backgroundColor: "#4a4a4a",
    borderRadius: "5px",
    position: "relative",
    overflow: "hidden",
  },
  statLabel: {
    fontSize: isMobile ? "0.8rem" : isTablet ? "0.9rem" : "1rem",
    color: "#bbb",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
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
    fontSize: isMobile ? "0.95rem" : isTablet ? "1rem" : "1.05rem",
    color: "#e0e0e0",
  },
  aboutTextLineSkeleton: {
    height: "18px",
    width: "100%",
    backgroundColor: "#3a3a3a",
    borderRadius: "3px",
    marginBottom: "10px",
    position: "relative",
    overflow: "hidden",
    '&:nth-child(even)': { // Cannot use pseudo-classes in inline style directly
      // This will need to be handled by checking index in map or applying specific style if not first
    },
    '&:last-child': {
      // Same here
    },
  },

  // Job Offers Grid
  jobsGrid: {
    display: "grid",
    gridTemplateColumns: isTablet ? "1fr" : "repeat(auto-fit, minmax(300px, 1fr))", // Tablet to single column
    gap: isMobile ? "18px" : isTablet ? "20px" : "25px",
  },
  jobGridCard: (isHovered = false) => ({ // Add isHovered parameter
    backgroundColor: "#3a3a3a",
    borderRadius: "12px",
    padding: isMobile ? "18px" : isTablet ? "20px" : "25px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
    border: "1px solid #444",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    ...(isHovered && {
      transform: 'translateY(-5px) scale(1.01)',
      boxShadow: '0 12px 25px rgba(0,0,0,0.35)',
    }),
  }),
  jobGridHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: isMobile ? "flex-start" : "baseline",
    marginBottom: isMobile ? "10px" : "15px",
    ...(isMobile && { flexDirection: 'column' }),
  },
  jobGridTitle: {
    fontSize: isMobile ? "1.1rem" : isTablet ? "1.2rem" : "1.4rem",
    color: "#ff6b35",
    margin: "0",
    fontWeight: "700",
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
    fontSize: isMobile ? "0.8rem" : "0.85rem",
    color: "#aaa",
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
    marginBottom: isMobile ? "15px" : "20px",
    display: "flex",
    flexDirection: "column",
    gap: isMobile ? "6px" : "8px",
  },
  jobGridDetailItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  jobGridDetailLabel: {
    fontSize: isMobile ? "0.9rem" : "0.95rem",
    color: "#ccc",
    fontWeight: "600",
  },
  jobGridDetailValue: {
    fontSize: isMobile ? "0.9rem" : "0.95rem",
    color: "#e0e0e0",
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
    fontSize: isMobile ? "0.8rem" : isTablet ? "0.85rem" : "0.9rem",
    color: "#bbb",
    lineHeight: "1.6",
    margin: "0",
  },
  jobGridDescriptionSkeleton: {
    height: "16px",
    width: "90%",
    backgroundColor: "#4a4a4a",
    borderRadius: "3px",
    marginBottom: "8px",
    position: "relative",
    overflow: "hidden",
  },
  emptyState: {
    textAlign: "center",
    padding: isMobile ? "30px 15px" : "40px 20px",
    backgroundColor: "#3a3a3a",
    borderRadius: "10px",
    border: "1px dashed #555",
  },
  emptyText: {
    fontSize: isMobile ? "1rem" : "1.1rem",
    color: "#bbb",
    fontWeight: "500",
    margin: "0",
  },

  // Newsletter Section
  newsletterSection: {
    backgroundColor: "#1f1f1f",
    padding: isMobile ? "40px 10px" : isTablet ? "50px 15px" : "80px 20px",
    textAlign: "center",
    borderTop: "1px solid #333",
    marginTop: isMobile ? "20px" : isTablet ? "25px" : "40px",
  },
  newsletterContainer: {
    maxWidth: "800px",
    margin: "0 auto",
  },
  newsletterSubtitle: {
    fontSize: isMobile ? "1rem" : isTablet ? "1.1rem" : "1.2rem",
    color: "#ff6b35",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "1px",
    marginBottom: isMobile ? "10px" : "15px",
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
    fontSize: isMobile ? "1.5rem" : isTablet ? "2rem" : "3rem",
    color: "#ffffff",
    fontWeight: "900",
    marginBottom: isMobile ? "15px" : "20px",
    lineHeight: "1.2",
    ...(isMobile && { fontSize: '1.5rem' }),
    ...(isTablet && { fontSize: '2rem' }),
  },
  newsletterTitleSkeleton: {
    height: isMobile ? "30px" : isTablet ? "38px" : "45px",
    width: "70%",
    margin: "0 auto 20px auto",
    backgroundColor: "#2a2a2a",
    borderRadius: "6px",
    position: "relative",
    overflow: "hidden",
  },
  newsletterText: {
    fontSize: isMobile ? "0.95rem" : isTablet ? "1rem" : "1.1rem",
    color: "#cccccc",
    marginBottom: isMobile ? "20px" : "30px",
    lineHeight: "1.7",
  },
  newsletterTextSkeleton: {
    height: "20px",
    width: "80%",
    margin: "0 auto 10px auto",
    backgroundColor: "#2a2a2a",
    borderRadius: "4px",
    position: "relative",
    overflow: "hidden",
  },
  newsletterForm: {
    display: "flex",
    justifyContent: "center",
    gap: isMobile ? "10px" : "15px",
    maxWidth: "500px",
    margin: "0 auto 30px auto",
    ...(isMobile && { flexDirection: 'column', alignItems: 'center' }),
  },
  newsletterFormSkeleton: {
    height: isMobile ? "45px" : "50px",
    width: isMobile ? "90%" : "400px",
    margin: "0 auto 30px auto",
    backgroundColor: "#2a2a2a",
    borderRadius: "8px",
    position: "relative",
    overflow: "hidden",
  },
  newsletterInput: (isFocused = false) => ({ // Add isFocused parameter
    flex: "1",
    padding: isMobile ? "12px 15px" : "15px 20px",
    borderRadius: "8px",
    border: "1px solid #555",
    backgroundColor: "#3a3a3a",
    color: "#ffffff",
    fontSize: "1rem",
    outline: "none",
    width: isMobile ? "100%" : "auto", // Mobile full width
    ...(isFocused && {
      borderColor: '#ff6b35',
      boxShadow: '0 0 0 3px rgba(255,107,53,0.3)',
    }),
  }),
  newsletterPlaceholder: { // Separate style for placeholder
    color: '#888',
  },
  newsletterButton: (isHovered = false) => ({ // Add isHovered parameter
    padding: isMobile ? "12px 20px" : "15px 30px",
    backgroundColor: "#ff6b35",
    color: "#1a1a1a",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "700",
    transition: "background-color 0.3s ease, transform 0.2s ease",
    width: isMobile ? "100%" : "auto", // Mobile full width
    ...(isHovered && {
      backgroundColor: '#e05a28',
      transform: 'scale(1.02)',
    }),
  }),
  newsletterFeatures: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: isMobile ? "15px" : isTablet ? "20px" : "25px",
    marginTop: "20px",
    ...(isMobile && { flexDirection: 'column', alignItems: 'center' }),
  },
  newsletterFeature: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "#e0e0e0",
    fontSize: isMobile ? "0.9rem" : "0.95rem",
    fontWeight: "500",
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
  // We need to define @keyframes for shimmer directly in a style tag or a global CSS file
  // or use a library that handles keyframes like styled-components.
  // For pure inline, this is a limitation. You'd need to inject a style tag or use a utility
  // that can handle global CSS/keyframes. For simplicity in this example, assume it's
  // in a global stylesheet or you will inject it.
  keyframesShimmer: `
    @keyframes shimmer {
      0% { background-position: -468px 0; }
      100% { background-position: 468px 0; }
    }
  `,

  // Floating Loading Indicator
  loadingIndicator: {
    position: "fixed",
    bottom: isMobile ? "20px" : "30px",
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "rgba(255, 107, 53, 0.9)",
    color: "#000",
    padding: isMobile ? "10px 20px" : "12px 25px",
    borderRadius: "30px",
    display: "flex",
    alignItems: "center",
    gap: isMobile ? "8px" : "10px",
    boxShadow: "0 8px 25px rgba(255, 107, 53, 0.4)",
    zIndex: "1000",
    opacity: "1",
    transition: "opacity 0.3s ease",
  },
  spinner: {
    border: "3px solid rgba(0, 0, 0, 0.3)",
    borderTop: "3px solid #000",
    borderRadius: "50%",
    width: isMobile ? "18px" : "20px",
    height: isMobile ? "18px" : "20px",
    animation: "spin 1s linear infinite",
  },
  // Keyframes for spinner too.
  keyframesSpin: `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `,
  loadingText: {
    fontSize: isMobile ? "0.85rem" : "0.95rem",
    fontWeight: "600",
  },

  // Error Message
  errorMessage: {
    textAlign: "center",
    color: "#ff6b35",
    fontSize: isMobile ? "1rem" : isTablet ? "1.1rem" : "1.2rem",
    padding: isMobile ? "20px" : isTablet ? "30px" : "50px",
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
  },
});

function RecruiterPublicProfile() {
  const { recruiterId } = useParams();
  const [profile, setProfile] = useState(null);
  const [jobOffers, setJobOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showInfos, setShowInfos] = useState(true);
  const [showStats, setShowStats] = useState(true);
  const [showAbout, setShowAbout] = useState(true);
  const [showJobs, setShowJobs] = useState(true);

  // Use the custom media query hook
  const isMobile = useMediaQuery("(max-width: 480px)");
  const isTablet = useMediaQuery("(max-width: 768px)"); // Broader tablet range for combined 768px and 1024px
  // Note: For finer control, you could have more specific queries:
  // const isSmallMobile = useMediaQuery("(max-width: 360px)");
  // const isMediumScreen = useMediaQuery("(max-width: 1024px)");

  // Get dynamic styles based on screen size
  const styles = getPageStyles(isMobile, isTablet);

  // State for hover effects
  const [cardHovered, setCardHovered] = useState({});
  const [statItemHovered, setStatItemHovered] = useState({});
  const [jobGridCardHovered, setJobGridCardHovered] = useState({});
  const [newsletterButtonHovered, setNewsletterButtonHovered] = useState(false);
  const [newsletterInputFocused, setNewsletterInputFocused] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [profileRes, jobsRes] = await Promise.all([
          fetch(`${process.env.REACT_APP_API_URL}/api/recruiter-public-profile/${recruiterId}`),
          fetch(`${process.env.REACT_APP_API_URL}/api/recruiter-job-offers/${recruiterId}`),
        ]);

        if (!profileRes.ok || !jobsRes.ok) {
          throw new Error("Failed to fetch profile data.");
        }

        const profileData = await profileRes.json();
        const jobsData = await jobsRes.json();

        setProfile(profileData.data);
        setJobOffers(jobsData.data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [recruiterId]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    alert("Subscription logic goes here!"); // Replace with actual API call
  }, []);

  // --- Inject keyframes into the document head ---
  useEffect(() => {
    if (document.getElementById('responsive-keyframes')) {
      return;
    }
    const styleSheet = document.createElement("style");
    styleSheet.id = "responsive-keyframes";
    styleSheet.type = "text/css";
    styleSheet.innerText = styles.keyframesShimmer + styles.keyframesSpin;
    document.head.appendChild(styleSheet);

    return () => {
      // Clean up the style tag if component unmounts
      const oldStyleSheet = document.getElementById("responsive-keyframes");
      if (oldStyleSheet) {
        document.head.removeChild(oldStyleSheet);
      }
    };
  }, [styles.keyframesShimmer, styles.keyframesSpin]);


  // Loading Component
  const LoadingComponent = () => (
    <div style={styles.container}>
      <div style={styles.profileCard}>
        {/* Header Section Skeleton */}
        <div style={styles.headerSection(null)}> {/* Pass null or a placeholder if no image for skeleton */}
          <div style={styles.headerContent}>
            <div style={styles.profileImageContainer}>
              <div style={styles.profileImageSkeleton}>
                <div style={styles.shimmer}></div>
              </div>
              <div style={styles.statusBadgeSkeleton}>
                <div style={styles.shimmer}></div>
              </div>
            </div>
            <div style={styles.headerInfo}>
              <div style={styles.companyNameSkeleton}>
                <div style={styles.shimmer}></div>
              </div>
              <div style={styles.companyTitleSkeleton}>
                <div style={styles.shimmer}></div>
              </div>
              <div style={styles.headerDivider}></div>
              <div style={styles.headerDomainsContainer}>
                {[1, 2, 3].map((i) => (
                  <div key={i} style={styles.headerDomainTagSkeleton}>
                    <div style={styles.shimmer}></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Skeleton */}
        <div style={styles.mainContent}>
          <div style={styles.leftColumn}>
            {/* Contact Info Card Skeleton */}
            <div style={styles.card()}> {/* Pass false for hovered */}
              <div style={styles.cardHeader}>
                <div style={styles.cardTitleSkeleton}>
                  <div style={styles.shimmer}></div>
                </div>
              </div>
              <div style={styles.cardContent}>
                {[1, 2, 3].map((i) => (
                  <div key={i} style={styles.contactItem}>
                    <div style={styles.contactInfo}>
                      <div style={styles.contactLabelSkeleton}>
                        <div style={styles.shimmer}></div>
                      </div>
                      <div style={styles.contactValueSkeleton}>
                        <div style={styles.shimmer}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Statistics Card Skeleton */}
            <div style={styles.card()}>
              <div style={styles.cardHeader}>
                <div style={styles.cardTitleSkeleton}>
                  <div style={styles.shimmer}></div>
                </div>
              </div>
              <div style={styles.cardContent}>
                <div style={styles.statsGrid}>
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} style={styles.statItem()}>
                      <div style={styles.statNumberSkeleton}>
                        <div style={styles.shimmer}></div>
                      </div>
                      <div style={styles.statLabelSkeleton}>
                        <div style={styles.shimmer}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div style={styles.rightColumn}>
            {/* About Card Skeleton */}
            <div style={styles.card()}>
              <div style={styles.cardHeader}>
                <div style={styles.cardTitleSkeleton}>
                  <div style={styles.shimmer}></div>
                </div>
              </div>
              <div style={styles.cardContent}>
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    style={{
                      ...styles.aboutTextLineSkeleton,
                      width: i % 2 === 0 ? "90%" : "100%", // Simulate :nth-child(even)
                      ...(i === 4 && { width: "70%", marginBottom: "0" }), // Simulate :last-child
                    }}
                  >
                    <div style={styles.shimmer}></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Job Offers Card Skeleton */}
            <div style={styles.card()}>
              <div style={styles.cardHeader}>
                <div style={styles.cardTitleSkeleton}>
                  <div style={styles.shimmer}></div>
                </div>
              </div>
              <div style={styles.cardContent}>
                <div style={styles.jobsGrid}>
                  {[1, 2].map((i) => (
                    <div key={i} style={styles.jobGridCard()}>
                      <div style={styles.jobGridHeader}>
                        <div style={styles.jobGridTitleSkeleton}>
                          <div style={styles.shimmer}></div>
                        </div>
                        <div style={styles.jobGridDateSkeleton}>
                          <div style={styles.shimmer}></div>
                        </div>
                      </div>
                      <div style={styles.jobGridDetails}>
                        <div style={styles.jobGridDetailSkeleton}>
                          <div style={styles.shimmer}></div>
                        </div>
                        <div style={styles.jobGridDetailSkeleton}>
                          <div style={styles.shimmer}></div>
                        </div>
                      </div>
                      <div style={{ ...styles.jobGridDescriptionSkeleton, width: "100%" }}>
                        <div style={styles.shimmer}></div>
                      </div>
                      <div style={{ ...styles.jobGridDescriptionSkeleton, width: "80%" }}>
                        <div style={styles.shimmer}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section Skeleton */}
        <div style={styles.newsletterSection}>
          <div style={styles.newsletterContainer}>
            <div style={styles.newsletterSubtitleSkeleton}>
              <div style={styles.shimmer}></div>
            </div>
            <div style={styles.newsletterTitleSkeleton}>
              <div style={styles.shimmer}></div>
            </div>
            <div style={styles.newsletterTextSkeleton}>
              <div style={styles.shimmer}></div>
            </div>
            <div style={{ ...styles.newsletterTextSkeleton, width: "60%", marginBottom: "30px" }}>
              <div style={styles.shimmer}></div>
            </div>
            <div style={styles.newsletterFormSkeleton}>
              <div style={styles.shimmer}></div>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.loadingIndicator}>
        <div style={styles.spinner}></div>
        <div style={styles.loadingText}>Chargement du profil...</div>
      </div>
    </div>
  );

  if (error) return <div style={styles.errorMessage}>{error}</div>;
  if (!profile || loading) return (
    <>
      <Navbar />
      <LoadingComponent />
      <Footer />
    </>
  );

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.profileCard}>
          <div
            style={styles.headerSection(profile?.cover_image)}
          >
            <div style={styles.headerContent}>
              <div style={styles.profileImageContainer}>
                <img
                  src={
                    profile.profile_image
                      ? `${process.env.REACT_APP_API_URL}/uploads/profile_images/${profile.profile_image}`
                      : candidatImage
                  }
                  alt="Recruiter Profile"
                  style={styles.profileImage}
                />
                <div style={styles.statusBadge}>ACTIF</div>
              </div>
              <div style={styles.headerInfo}>
                <h1 style={styles.companyName}>{profile.companyName}</h1>
                <p style={styles.companyTitle}>{profile.company_title}</p>
                <div style={styles.headerDivider}></div>
                {(profile.selected_domains || []).length > 0 && (
                  <div style={styles.headerDomainsContainer}>
                    {(profile.selected_domains || []).map((domain, index) => (
                      <div key={index} style={styles.headerDomainTag}>
                        {domain}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div style={styles.mainContent}>
            <div style={styles.leftColumn}>
              {/* Contact Information Card */}
              <div
                style={styles.card(cardHovered['contact'])}
                onMouseEnter={() => setCardHovered(prev => ({ ...prev, contact: true }))}
                onMouseLeave={() => setCardHovered(prev => ({ ...prev, contact: false }))}
              >
                <div
                  style={styles.cardHeader}
                  onClick={() => setShowInfos(!showInfos)}
                >
                  <h3 style={styles.cardTitle}>
                    Informations de contact
                    <span style={styles.toggleIcon(showInfos)}>
                      ▶
                    </span>
                  </h3>
                </div>
                {showInfos && (
                  <div style={styles.cardContent}>
                    <div style={styles.contactItem}>
                      <div style={styles.contactInfo}>
                        <span style={styles.contactLabel}>Email</span>
                        <span style={styles.contactValue}>{profile.email}</span>
                      </div>
                    </div>
                    {profile.phone && (
                      <div style={styles.contactItem}>
                        <div style={styles.contactInfo}>
                          <span style={styles.contactLabel}>Téléphone</span>
                          <span style={styles.contactValue}>{profile.phone}</span>
                        </div>
                      </div>
                    )}
                    {profile.website && (
                      <div style={styles.contactItem}>
                        <div style={styles.contactInfo}>
                          <span style={styles.contactLabel}>Site Web</span>
                          <span style={styles.contactValue}>
                            <a href={profile.website} target="_blank" rel="noopener noreferrer" style={{ color: '#ff6b35', textDecoration: 'none' }}>
                              {profile.website}
                            </a>
                          </span>
                        </div>
                      </div>
                    )}
                    {profile.address && (
                      <div style={styles.contactItem}>
                        <div style={styles.contactInfo}>
                          <span style={styles.contactLabel}>Adresse</span>
                          <span style={styles.contactValue}>{profile.address}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Company Statistics Card */}
              <div
                style={styles.card(cardHovered['stats'])}
                onMouseEnter={() => setCardHovered(prev => ({ ...prev, stats: true }))}
                onMouseLeave={() => setCardHovered(prev => ({ ...prev, stats: false }))}
              >
                <div
                  style={styles.cardHeader}
                  onClick={() => setShowStats(!showStats)}
                >
                  <h3 style={styles.cardTitle}>
                    Statistiques de l'entreprise
                    <span style={styles.toggleIcon(showStats)}>
                      ▶
                    </span>
                  </h3>
                </div>
                {showStats && (
                  <div style={styles.cardContent}>
                    <div style={styles.statsGrid}>
                      <div
                        style={styles.statItem(statItemHovered['offers'])}
                        onMouseEnter={() => setStatItemHovered(prev => ({ ...prev, offers: true }))}
                        onMouseLeave={() => setStatItemHovered(prev => ({ ...prev, offers: false }))}
                      >
                        <div style={styles.statNumber}>{profile.offersCount || 0}</div>
                        <div style={styles.statLabel}>Offres</div>
                      </div>
                      <div
                        style={styles.statItem(statItemHovered['views'])}
                        onMouseEnter={() => setStatItemHovered(prev => ({ ...prev, views: true }))}
                        onMouseLeave={() => setStatItemHovered(prev => ({ ...prev, views: false }))}
                      >
                        <div style={styles.statNumber}>{profile.profileViews || 0}</div>
                        <div style={styles.statLabel}>Vues</div>
                      </div>
                      <div
                        style={styles.statItem(statItemHovered['hires'])}
                        onMouseEnter={() => setStatItemHovered(prev => ({ ...prev, hires: true }))}
                        onMouseLeave={() => setStatItemHovered(prev => ({ ...prev, hires: false }))}
                      >
                        <div style={styles.statNumber}>{profile.hiresCount || 0}</div>
                        <div style={styles.statLabel}>Recrutements</div>
                      </div>
                      <div
                        style={styles.statItem(statItemHovered['followers'])}
                        onMouseEnter={() => setStatItemHovered(prev => ({ ...prev, followers: true }))}
                        onMouseLeave={() => setStatItemHovered(prev => ({ ...prev, followers: false }))}
                      >
                        <div style={styles.statNumber}>{profile.followersCount || 0}</div>
                        <div style={styles.statLabel}>Abonnés</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div style={styles.rightColumn}>
              {/* About Company Card */}
              <div
                style={styles.card(cardHovered['about'])}
                onMouseEnter={() => setCardHovered(prev => ({ ...prev, about: true }))}
                onMouseLeave={() => setCardHovered(prev => ({ ...prev, about: false }))}
              >
                <div
                  style={styles.cardHeader}
                  onClick={() => setShowAbout(!showAbout)}
                >
                  <h3 style={styles.cardTitle}>
                    À propos de l'entreprise
                    <span style={styles.toggleIcon(showAbout)}>
                      ▶
                    </span>
                  </h3>
                </div>
                {showAbout && (
                  <div style={styles.cardContent}>
                    <p style={styles.aboutText}>
                      {profile.description || "Aucune description fournie."}
                    </p>
                  </div>
                )}
              </div>

              {/* Latest Job Offers Card */}
              <div
                style={styles.card(cardHovered['jobs'])}
                onMouseEnter={() => setCardHovered(prev => ({ ...prev, jobs: true }))}
                onMouseLeave={() => setCardHovered(prev => ({ ...prev, jobs: false }))}
              >
                <div
                  style={styles.cardHeader}
                  onClick={() => setShowJobs(!showJobs)}
                >
                  <h3 style={styles.cardTitle}>
                    Dernières offres publiées
                    <span style={styles.toggleIcon(showJobs)}>
                      ▶
                    </span>
                  </h3>
                </div>
                {showJobs && (
                  <div style={styles.cardContent}>
                    {jobOffers.length === 0 ? (
                      <div style={styles.emptyState}>
                        <p style={styles.emptyText}>Aucune offre disponible pour le moment</p>
                      </div>
                    ) : (
                      <div style={styles.jobsGrid}>
                        {jobOffers.map((job, index) => (
                          <div
                            key={job.id}
                            style={styles.jobGridCard(jobGridCardHovered[job.id])}
                            onMouseEnter={() => setJobGridCardHovered(prev => ({ ...prev, [job.id]: true }))}
                            onMouseLeave={() => setJobGridCardHovered(prev => ({ ...prev, [job.id]: false }))}
                          >
                            <div style={styles.jobGridHeader}>
                              <h4 style={styles.jobGridTitle}>{job.title}</h4>
                              <span style={styles.jobGridDate}>
                                {new Date(job.posted_at).toLocaleDateString("fr-FR")}
                              </span>
                            </div>
                            <div style={styles.jobGridDetails}>
                              <div style={styles.jobGridDetailItem}>
                                <span style={styles.jobGridDetailLabel}>Lieu :</span>
                                <span style={styles.jobGridDetailValue}>{job.location || "Non spécifié"}</span>
                              </div>
                              <div style={styles.jobGridDetailItem}>
                                <span style={styles.jobGridDetailLabel}>Type :</span>
                                <span style={styles.jobGridDetailValue}>{job.type || "Non spécifié"}</span>
                              </div>
                              <div style={styles.jobGridDetailItem}>
                                <span style={styles.jobGridDetailLabel}>Salaire :</span>
                                <span style={styles.jobGridDetailValue}>{job.salary ? `${job.salary} MAD` : "Non spécifié"}</span>
                              </div>
                            </div>
                            <p style={styles.jobGridDescription}>
                              {job.description ? job.description.slice(0, 80) + (job.description.length > 80 ? "..." : "") : "Pas de description disponible."}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Newsletter Section */}
          <div style={styles.newsletterSection}>
            <div style={styles.newsletterContainer}>
              <h4 style={styles.newsletterSubtitle}>Restez connecté</h4>
              <h2 style={styles.newsletterTitle}>Ne manquez aucune opportunité</h2>
              <p style={styles.newsletterText}>
                Recevez les dernières offres d'emploi, actualités du secteur et conseils carrière
                directement dans votre boîte mail.
              </p>

              <form
                style={styles.newsletterForm}
                onSubmit={handleSubmit}
              >
                <input
                  type="email"
                  name="email"
                  placeholder="Entrez votre adresse email"
                  style={{
                    ...styles.newsletterInput(newsletterInputFocused),
                    '::placeholder': styles.newsletterPlaceholder // Placeholder requires a different approach.
                  }}
                  onFocus={() => setNewsletterInputFocused(true)}
                  onBlur={() => setNewsletterInputFocused(false)}
                  required
                />
                <button
                  type="submit"
                  style={styles.newsletterButton(newsletterButtonHovered)}
                  onMouseEnter={() => setNewsletterButtonHovered(true)}
                  onMouseLeave={() => setNewsletterButtonHovered(false)}
                >
                  S'abonner
                </button>
              </form>

              <div style={styles.newsletterFeatures}>
                <div style={styles.newsletterFeature}>
                  <div style={styles.newsletterFeatureIcon}>✓</div>
                  <span>Offres exclusives</span>
                </div>
                <div style={styles.newsletterFeature}>
                  <div style={styles.newsletterFeatureIcon}>✓</div>
                  <span>Conseils carrière</span>
                </div>
                <div style={styles.newsletterFeature}>
                  <div style={styles.newsletterFeatureIcon}>✓</div>
                  <span>Actualités secteur</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default RecruiterPublicProfile;
