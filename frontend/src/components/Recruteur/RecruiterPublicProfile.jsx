import React, { useEffect, useState, useCallback } from "react";
import Navbar from "../Navbara";
import Footer from "../Footer";
import { useParams } from "react-router-dom";
import candidatImage from '../../assets/images/choixRole/recruiter.jpg'; // Assuming this is a placeholder or default image

// --- Helper Hook for Media Queries ---
const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    const listener = () => setMatches(media.matches);

    // Initial check
    setMatches(media.matches);

    // Listen for changes
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
};

// --- Styles based on Media Queries ---
const getPageStyles = (isMobile, isTablet) => {
  // Base styles for desktop
  let styles = {
    container: {
      minHeight: "100vh",
      backgroundColor: "#0a0a0a",
      padding: "20px 10px",
      position: "relative",
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
    // Header Section
    headerSection: {
      height: "320px",
      backgroundSize: "cover",
      backgroundPosition: "center",
      position: "relative",
      display: "flex",
      alignItems: "flex-end",
    },
    headerContent: {
      width: "100%",
      padding: "50px 60px",
      display: "flex",
      alignItems: "center",
      gap: "40px",
      background: "linear-gradient(to top, rgba(0,0,0,0.95), transparent)",
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
    },
    profileImageSkeleton: {
      width: "180px",
      height: "180px",
      borderRadius: "50%",
      border: "4px solid #333",
      backgroundColor: "#2a2a2a",
      position: "relative",
      overflow: "hidden",
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
    },
    headerInfo: {
      color: "white",
      flex: 1,
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
    },
    companyNameSkeleton: {
      height: "50px",
      width: "300px",
      backgroundColor: "#2a2a2a",
      borderRadius: "8px",
      marginBottom: "12px",
      position: "relative",
      overflow: "hidden",
    },
    companyTitle: {
      fontSize: "1.5rem",
      fontWeight: "400",
      margin: "0 0 25px 0",
      color: "#ccc",
    },
    companyTitleSkeleton: {
      height: "24px",
      width: "200px",
      backgroundColor: "#2a2a2a",
      borderRadius: "6px",
      marginBottom: "25px",
      position: "relative",
      overflow: "hidden",
    },
    headerDivider: {
      width: "100px",
      height: "4px",
      background: "linear-gradient(90deg, #ff6b35, #ff8c42)",
      borderRadius: "2px",
      marginBottom: "20px",
    },
    // Header Domains
    headerDomainsContainer: {
      display: "flex",
      flexWrap: "wrap",
      gap: "12px",
      marginTop: "5px",
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
    },
    headerDomainTagSkeleton: {
      width: "80px",
      height: "36px",
      backgroundColor: "#2a2a2a",
      borderRadius: "20px",
      border: "1px solid #404040",
      position: "relative",
      overflow: "hidden",
    },

    // Main Content Layout
    mainContent: {
      display: "flex",
      gap: "30px",
      padding: "30px 60px",
      alignItems: "flex-start",
    },
    leftColumn: {
      flex: "1",
      display: "flex",
      flexDirection: "column",
      gap: "30px",
      minWidth: "300px",
    },
    rightColumn: {
      flex: "2",
      display: "flex",
      flexDirection: "column",
      gap: "30px",
    },

    // Card Styles
    card: {
      backgroundColor: "#1f1f1f",
      borderRadius: "15px",
      padding: "25px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
      border: "1px solid #2a2a2a",
      transition: "all 0.3s ease",
    },
    cardHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "20px",
      paddingBottom: "15px",
      borderBottom: "1px solid #333",
    },
    cardTitle: {
      fontSize: "1.8rem",
      color: "#fff",
      margin: "0",
      fontWeight: "700",
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    cardTitleSkeleton: {
      height: "30px",
      width: "200px",
      backgroundColor: "#2a2a2a",
      borderRadius: "8px",
      marginBottom: "20px",
      paddingBottom: "15px",
      borderBottom: "1px solid #333",
      position: "relative",
      overflow: "hidden",
    },
    toggleIcon: {
      fontSize: "1.2rem",
      color: "#ff6b35",
      transition: "transform 0.3s ease",
      marginLeft: "auto",
    },
    cardContent: {
      color: "#ccc",
      fontSize: "1rem",
      lineHeight: "1.6",
    },

    // Contact Info
    contactItem: {
      display: "flex",
      alignItems: "center",
      marginBottom: "15px",
      gap: "15px",
    },
    contactInfo: {
      display: "flex",
      flexDirection: "column",
    },
    contactLabel: {
      fontSize: "0.9rem",
      color: "#888",
      fontWeight: "500",
      marginBottom: "3px",
    },
    contactValue: {
      fontSize: "1.05rem",
      color: "#eee",
      fontWeight: "600",
    },
    contactLabelSkeleton: {
      height: "18px",
      width: "80px",
      backgroundColor: "#2a2a2a",
      borderRadius: "4px",
      marginBottom: "5px",
      position: "relative",
      overflow: "hidden",
    },
    contactValueSkeleton: {
      height: "22px",
      width: "150px",
      backgroundColor: "#2a2a2a",
      borderRadius: "4px",
      position: "relative",
      overflow: "hidden",
    },

    // Statistics
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
      gap: "20px",
      textAlign: "center",
    },
    statItem: {
      backgroundColor: "#2a2a2a",
      padding: "20px 15px",
      borderRadius: "10px",
      border: "1px solid #333",
      transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
    },
    statNumber: {
      fontSize: "2.5rem",
      fontWeight: "800",
      color: "#fff",
      marginBottom: "5px",
    },
    statNumberSkeleton: {
      height: "40px",
      width: "60px",
      backgroundColor: "#3a3a3a",
      borderRadius: "8px",
      margin: "0 auto 5px auto",
      position: "relative",
      overflow: "hidden",
    },
    statLabel: {
      fontSize: "0.9rem",
      color: "#aaa",
      fontWeight: "500",
      textTransform: "uppercase",
    },
    statLabelSkeleton: {
      height: "18px",
      width: "70px",
      backgroundColor: "#3a3a3a",
      borderRadius: "4px",
      margin: "0 auto",
      position: "relative",
      overflow: "hidden",
    },

    // About Section
    aboutText: {
      fontSize: "1rem",
      color: "#ccc",
      lineHeight: "1.7",
      whiteSpace: "pre-wrap",
    },
    aboutTextLineSkeleton: {
      height: "18px",
      backgroundColor: "#2a2a2a",
      borderRadius: "4px",
      marginBottom: "10px",
      position: "relative",
      overflow: "hidden",
    },

    // Job Offers Section
    jobsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: "25px",
      marginTop: "15px",
    },
    jobGridCard: {
      backgroundColor: "#252525",
      borderRadius: "12px",
      padding: "25px",
      border: "1px solid #333",
      boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
      display: "flex",
      flexDirection: "column",
      transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
    },
    jobGridHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: "15px",
      borderBottom: "1px solid #444",
      paddingBottom: "10px",
    },
    jobGridTitle: {
      fontSize: "1.4rem",
      fontWeight: "700",
      color: "#ff6b35",
      margin: "0",
      lineHeight: "1.3",
    },
    jobGridDate: {
      fontSize: "0.85rem",
      color: "#888",
      whiteSpace: "nowrap",
    },
    jobGridTitleSkeleton: {
      height: "28px",
      width: "70%",
      backgroundColor: "#3a3a3a",
      borderRadius: "6px",
      position: "relative",
      overflow: "hidden",
    },
    jobGridDateSkeleton: {
      height: "18px",
      width: "80px",
      backgroundColor: "#3a3a3a",
      borderRadius: "4px",
      position: "relative",
      overflow: "hidden",
    },
    jobGridDetails: {
      display: "flex",
      flexWrap: "wrap",
      gap: "10px 20px",
      marginBottom: "15px",
    },
    jobGridDetailItem: {
      display: "flex",
      alignItems: "center",
      gap: "5px",
    },
    jobGridDetailLabel: {
      fontSize: "0.9rem",
      color: "#aaa",
      fontWeight: "500",
    },
    jobGridDetailValue: {
      fontSize: "0.95rem",
      color: "#eee",
      fontWeight: "600",
    },
    jobGridDetailSkeleton: {
      height: "20px",
      width: "120px",
      backgroundColor: "#3a3a3a",
      borderRadius: "4px",
      position: "relative",
      overflow: "hidden",
    },
    jobGridDescription: {
      fontSize: "0.95rem",
      color: "#bbb",
      lineHeight: "1.6",
      marginBottom: "15px",
      flexGrow: 1, // Allow description to take available space
    },
    jobGridDescriptionSkeleton: {
      height: "18px",
      backgroundColor: "#3a3a3a",
      borderRadius: "4px",
      marginBottom: "10px",
      position: "relative",
      overflow: "hidden",
      width: "100%",
    },
    emptyState: {
      textAlign: "center",
      padding: "40px 20px",
      color: "#888",
      fontSize: "1.1rem",
      backgroundColor: "#2a2a2a",
      border: "1px dashed #444",
      borderRadius: "10px",
      marginTop: "20px",
    },
    emptyText: {
      margin: 0,
      color: "#aaa",
    },

    // Newsletter Section
    newsletterSection: {
      backgroundColor: "#1a1a1a",
      padding: "60px 20px",
      textAlign: "center",
      marginTop: "40px",
      borderTop: "1px solid #333",
      boxShadow: "inset 0 10px 30px rgba(0,0,0,0.3)",
    },
    newsletterContainer: {
      maxWidth: "800px",
      margin: "0 auto",
    },
    newsletterSubtitle: {
      fontSize: "1.1rem",
      color: "#ff6b35",
      fontWeight: "700",
      marginBottom: "10px",
      textTransform: "uppercase",
      letterSpacing: "1px",
    },
    newsletterSubtitleSkeleton: {
      height: "20px",
      width: "150px",
      backgroundColor: "#2a2a2a",
      borderRadius: "5px",
      margin: "0 auto 10px auto",
      position: "relative",
      overflow: "hidden",
    },
    newsletterTitle: {
      fontSize: "3rem",
      color: "#fff",
      fontWeight: "900",
      marginBottom: "20px",
      lineHeight: "1.2",
      letterSpacing: "-0.02em",
    },
    newsletterTitleSkeleton: {
      height: "40px",
      width: "400px",
      backgroundColor: "#2a2a2a",
      borderRadius: "8px",
      margin: "0 auto 20px auto",
      position: "relative",
      overflow: "hidden",
    },
    newsletterText: {
      fontSize: "1rem",
      color: "#ccc",
      marginBottom: "30px",
      lineHeight: "1.6",
    },
    newsletterTextSkeleton: {
      height: "18px",
      width: "600px",
      backgroundColor: "#2a2a2a",
      borderRadius: "4px",
      margin: "0 auto 15px auto",
      position: "relative",
      overflow: "hidden",
    },
    newsletterForm: {
      display: "flex",
      justifyContent: "center",
      gap: "15px",
      maxWidth: "500px",
      margin: "0 auto 30px auto",
    },
    newsletterFormSkeleton: {
      height: "50px",
      width: "500px",
      backgroundColor: "#2a2a2a",
      borderRadius: "10px",
      margin: "0 auto 30px auto",
      position: "relative",
      overflow: "hidden",
    },
    newsletterInput: {
      flex: "1",
      padding: "15px 20px",
      borderRadius: "10px",
      border: "1px solid #444",
      backgroundColor: "#2a2a2a",
      color: "#eee",
      fontSize: "1rem",
      outline: "none",
      transition: "border-color 0.3s ease, box-shadow 0.3s ease",
    },
    newsletterButton: {
      padding: "15px 30px",
      backgroundColor: "#ff6b35",
      color: "#fff",
      border: "none",
      borderRadius: "10px",
      fontSize: "1rem",
      fontWeight: "bold",
      cursor: "pointer",
      transition: "background-color 0.3s ease, transform 0.2s ease",
    },
    newsletterFeatures: {
      display: "flex",
      justifyContent: "center",
      gap: "25px",
      flexWrap: "wrap",
      marginTop: "20px",
    },
    newsletterFeature: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      color: "#ccc",
      fontSize: "0.95rem",
    },
    newsletterFeatureIcon: {
      color: "#ff6b35",
      fontSize: "1.2rem",
      fontWeight: "bold",
    },

    // Shimmer effect for skeletons
    shimmer: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(255,255,255,0.1)",
      animation: "shimmer 1.5s infinite",
      background: "linear-gradient(to right, #2a2a2a 0%, #3a3a3a 20%, #2a2a2a 40%, #2a2a2a 100%)",
      backgroundSize: "200% 100%",
    },
    "@keyframes shimmer": {
      "0%": { backgroundPosition: "-200% 0" },
      "100%": { backgroundPosition: "200% 0" },
    },

    // Error Message
    errorMessage: {
      color: "#ff4d4d",
      textAlign: "center",
      padding: "20px",
      fontSize: "1.2rem",
      backgroundColor: "#2a0000",
      border: "1px solid #8b0000",
      borderRadius: "10px",
      margin: "20px auto",
      maxWidth: "600px",
    },
  };

  // Apply tablet specific styles
  if (isTablet) {
    Object.assign(styles.container, { padding: '10px 5px' });
    Object.assign(styles.profileCard, { borderRadius: '15px', margin: '0 5px' });
    Object.assign(styles.headerSection, { height: '250px' });
    Object.assign(styles.headerContent, {
      padding: '30px 20px',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      gap: '20px',
    });
    Object.assign(styles.profileImage, { width: '120px', height: '120px' });
    Object.assign(styles.profileImageSkeleton, { width: '120px', height: '120px' });
    Object.assign(styles.statusBadge, { bottom: '10px', right: '10px', padding: '4px 8px', fontSize: '0.7rem' });
    Object.assign(styles.statusBadgeSkeleton, { bottom: '10px', right: '10px', width: '50px', height: '22px' });
    Object.assign(styles.companyName, { fontSize: '2.2rem' });
    Object.assign(styles.companyNameSkeleton, { width: '250px', height: '40px', margin: '0 auto 12px auto' });
    Object.assign(styles.companyTitle, { fontSize: '1.2rem' });
    Object.assign(styles.companyTitleSkeleton, { width: '150px', height: '20px', margin: '0 auto 25px auto' });
    Object.assign(styles.headerDivider, { margin: '0 auto 20px auto' });
    Object.assign(styles.headerDomainsContainer, { justifyContent: 'center', gap: '8px' });
    Object.assign(styles.mainContent, { flexDirection: 'column', padding: '20px 20px', gap: '20px' });
    Object.assign(styles.leftColumn, { minWidth: 'unset', width: '100%' });
    Object.assign(styles.rightColumn, { width: '100%' });
    Object.assign(styles.card, { padding: '20px' });
    Object.assign(styles.cardTitle, { fontSize: '1.6rem' });
    Object.assign(styles.cardTitleSkeleton, { width: '180px', height: '28px' });
    Object.assign(styles.statsGrid, { gridTemplateColumns: "repeat(auto-fit, minmax(80px, 1fr))", gap: "15px" });
    Object.assign(styles.statItem, { padding: '15px 10px' });
    Object.assign(styles.statNumber, { fontSize: '2rem' });
    Object.assign(styles.jobGridCard, { padding: '20px' });
    Object.assign(styles.jobGridTitle, { fontSize: '1.2rem' });
    Object.assign(styles.newsletterSection, { padding: '40px 15px' });
    Object.assign(styles.newsletterTitle, { fontSize: '2.5rem' });
    Object.assign(styles.newsletterTitleSkeleton, { width: '350px', height: '35px' });
    Object.assign(styles.newsletterTextSkeleton, { width: 'auto' });
    Object.assign(styles.newsletterForm, { flexDirection: 'column', alignItems: 'center', gap: '10px', maxWidth: '350px' });
    Object.assign(styles.newsletterInput, { width: '100%' });
    Object.assign(styles.newsletterButton, { width: '100%', padding: '12px 25px' });
  }

  // Apply mobile specific styles
  if (isMobile) {
    Object.assign(styles.headerSection, { height: '220px' });
    Object.assign(styles.headerContent, { padding: '20px 15px', gap: '15px' });
    Object.assign(styles.profileImage, { width: '100px', height: '100px' });
    Object.assign(styles.profileImageSkeleton, { width: '100px', height: '100px' });
    Object.assign(styles.statusBadge, { bottom: '8px', right: '8px', padding: '3px 6px', fontSize: '0.65rem' });
    Object.assign(styles.statusBadgeSkeleton, { bottom: '8px', right: '8px', width: '40px', height: '18px' });
    Object.assign(styles.companyName, { fontSize: '1.8rem' });
    Object.assign(styles.companyNameSkeleton, { width: '200px', height: '35px' });
    Object.assign(styles.companyTitle, { fontSize: '1rem' });
    Object.assign(styles.companyTitleSkeleton, { width: '120px', height: '18px' });
    Object.assign(styles.headerDivider, { width: '80px', height: '3px' });
    Object.assign(styles.headerDomainTag, { padding: '6px 12px', fontSize: '0.8rem' });
    Object.assign(styles.headerDomainTagSkeleton, { width: '70px', height: '32px' });
    Object.assign(styles.mainContent, { padding: '15px 15px', gap: '15px' });
    Object.assign(styles.card, { padding: '15px', borderRadius: '12px' });
    Object.assign(styles.cardHeader, { marginBottom: '15px', paddingBottom: '10px' });
    Object.assign(styles.cardTitle, { fontSize: '1.4rem' });
    Object.assign(styles.cardTitleSkeleton, { width: '150px', height: '25px' });
    Object.assign(styles.toggleIcon, { fontSize: '1rem' });
    Object.assign(styles.cardContent, { fontSize: '0.9rem' });
    Object.assign(styles.contactItem, { marginBottom: '10px', gap: '10px' });
    Object.assign(styles.contactLabel, { fontSize: '0.8rem' });
    Object.assign(styles.contactValue, { fontSize: '0.9rem' });
    Object.assign(styles.contactLabelSkeleton, { width: '70px', height: '16px' });
    Object.assign(styles.contactValueSkeleton, { width: '100px', height: '20px' });
    Object.assign(styles.statsGrid, { gap: "10px" });
    Object.assign(styles.statItem, { padding: '12px 8px' });
    Object.assign(styles.statNumber, { fontSize: '1.8rem' });
    Object.assign(styles.statNumberSkeleton, { width: '50px', height: '35px' });
    Object.assign(styles.statLabel, { fontSize: '0.8rem' });
    Object.assign(styles.statLabelSkeleton, { width: '60px', height: '16px' });
    Object.assign(styles.aboutText, { fontSize: '0.9rem' });
    Object.assign(styles.aboutTextLineSkeleton, { height: '16px' });
    Object.assign(styles.jobsGrid, { gridTemplateColumns: "1fr", gap: "15px" });
    Object.assign(styles.jobGridCard, { padding: '18px' });
    Object.assign(styles.jobGridHeader, { marginBottom: '10px', paddingBottom: '8px' });
    Object.assign(styles.jobGridTitle, { fontSize: '1.1rem' });
    Object.assign(styles.jobGridDate, { fontSize: '0.75rem' });
    Object.assign(styles.jobGridTitleSkeleton, { height: '24px' });
    Object.assign(styles.jobGridDateSkeleton, { width: '70px', height: '16px' });
    Object.assign(styles.jobGridDetails, { gap: '8px 15px', marginBottom: '10px' });
    Object.assign(styles.jobGridDetailLabel, { fontSize: '0.8rem' });
    Object.assign(styles.jobGridDetailValue, { fontSize: '0.85rem' });
    Object.assign(styles.jobGridDetailSkeleton, { width: '100px', height: '18px' });
    Object.assign(styles.jobGridDescription, { fontSize: '0.85rem' });
    Object.assign(styles.jobGridDescriptionSkeleton, { height: '16px' });
    Object.assign(styles.emptyState, { padding: '20px 10px', fontSize: '1rem', marginTop: '15px' });
    Object.assign(styles.newsletterSection, { padding: '30px 10px', marginTop: '30px' });
    Object.assign(styles.newsletterSubtitle, { fontSize: '1rem' });
    Object.assign(styles.newsletterSubtitleSkeleton, { width: '120px', height: '18px' });
    Object.assign(styles.newsletterTitle, { fontSize: '2rem' });
    Object.assign(styles.newsletterTitleSkeleton, { width: '280px', height: '30px' });
    Object.assign(styles.newsletterText, { fontSize: '0.9rem', marginBottom: '20px' });
    Object.assign(styles.newsletterTextSkeleton, { height: '16px', width: '250px' });
    Object.assign(styles.newsletterForm, { gap: '8px', maxWidth: '300px' });
    Object.assign(styles.newsletterFormSkeleton, { height: '45px', width: '300px' });
    Object.assign(styles.newsletterInput, { padding: '12px 15px', fontSize: '0.9rem' });
    Object.assign(styles.newsletterButton, { padding: '12px 20px', fontSize: '0.9rem' });
    Object.assign(styles.newsletterFeatures, { gap: '15px' });
    Object.assign(styles.newsletterFeature, { fontSize: '0.85rem' });
    Object.assign(styles.newsletterFeatureIcon, { fontSize: '1rem' });
  }

  return styles;
};

// --- RecruiterPublicProfile Component ---
function RecruiterPublicProfile() {
  const [profile, setProfile] = useState(null);
  const [jobStats, setJobStats] = useState(null);
  const [jobOffers, setJobOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAbout, setShowAbout] = useState(true); // Default to true, adjust as needed
  const [showInfos, setShowInfos] = useState(true); // Default to true, adjust as needed
  const [newsletters, setNewsletters] = useState([]);

  const { id } = useParams();

  // Use the custom media query hook
  const isMobile = useMediaQuery("(max-width: 480px)");
  const isTablet = useMediaQuery("(max-width: 768px)");

  // Get dynamic styles based on screen size
  const pageStyles = getPageStyles(isMobile, isTablet);

  // Consolidated API Calls
  useEffect(() => {
    const fetchRecruiterData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch profile and job stats
        const profileRes = await fetch(`${process.env.REACT_APP_API_URL}/api/recruiter/public-profile/${id}`);
        if (!profileRes.ok) {
          const errorData = await profileRes.json();
          throw new Error(errorData.message || "Failed to fetch public profile");
        }
        const profileData = await profileRes.json();
        setProfile(profileData);
        setJobStats(profileData.jobStats || null);
        setNewsletters(profileData.newsletters || []);

        // Fetch last 3 job offers
        const jobsRes = await fetch(`${process.env.REACT_APP_API_URL}/api/recruiter/${id}/last-job-offers`);
        if (!jobsRes.ok) {
          const errorData = await jobsRes.json();
          throw new Error(errorData.message || "Failed to fetch job offers");
        }
        const jobsData = await jobsRes.json();
        setJobOffers(jobsData);

      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message || "Erreur lors du chargement du profil ou des offres.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRecruiterData();
    }
  }, [id]);

  const handleSubmitNewsletter = useCallback(async (e) => {
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
      if (!res.ok) {
        throw new Error(result.message || 'Échec de l\'inscription à la newsletter.');
      }
      alert(result.message || 'Inscription réussie !');
      e.target.reset(); // Clear the form
    } catch (err) {
      console.error('Error subscribing to newsletter:', err);
      alert(`Erreur lors de l'inscription: ${err.message || 'Veuillez réessayer.'}`);
    }
  }, [id]); // Depend on 'id'

  // Shimmer effect keyframes (moved outside getPageStyles for better organization)
  const globalStyles = `
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  // --- Loading Skeleton Component ---
  const LoadingSkeleton = () => (
    <div style={pageStyles.container}>
      {/* Inject global keyframes */}
      <style>{globalStyles}</style>
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
                  <div key={i} style={{ ...pageStyles.aboutTextLineSkeleton, width: `${90 - i * 10}%` }}>
                    <div style={pageStyles.shimmer}></div>
                  </div>
                ))}
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
                        {[1, 2].map((j) => (
                          <div key={j} style={pageStyles.jobGridDetailSkeleton}>
                            <div style={pageStyles.shimmer}></div>
                          </div>
                        ))}
                      </div>
                      <div style={{ ...pageStyles.jobGridDescriptionSkeleton, width: "95%" }}>
                        <div style={pageStyles.shimmer}></div>
                      </div>
                      <div style={{ ...pageStyles.jobGridDescriptionSkeleton, width: "80%" }}>
                        <div style={pageStyles.shimmer}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section Skeleton */}
        <div style={pageStyles.newsletterSection}>
          <div style={pageStyles.newsletterContainer}>
            <div style={pageStyles.newsletterSubtitleSkeleton}>
              <div style={pageStyles.shimmer}></div>
            </div>
            <div style={pageStyles.newsletterTitleSkeleton}>
              <div style={pageStyles.shimmer}></div>
            </div>
            <div style={{ ...pageStyles.newsletterTextSkeleton, width: "80%" }}>
              <div style={pageStyles.shimmer}></div>
            </div>
            <div style={{ ...pageStyles.newsletterTextSkeleton, width: "70%" }}>
              <div style={pageStyles.shimmer}></div>
            </div>
            <div style={pageStyles.newsletterFormSkeleton}>
              <div style={pageStyles.shimmer}></div>
            </div>
            <div style={pageStyles.newsletterFeatures}>
              {[1, 2, 3].map((i) => (
                <div key={i} style={{ ...pageStyles.newsletterFeature, width: "120px", height: "20px", backgroundColor: "#2a2a2a", borderRadius: "5px", position: "relative", overflow: "hidden" }}>
                  <div style={pageStyles.shimmer}></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div style={pageStyles.container}>
          <div style={pageStyles.errorMessage}>{error}</div>
        </div>
        <Footer />
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <Navbar />
        <div style={pageStyles.container}>
          <div style={pageStyles.emptyState}>
            <p style={pageStyles.emptyText}>No recruiter profile found for this ID.</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Helper function to render contact item
  const renderContactItem = (icon, label, value) => (
    <div style={pageStyles.contactItem}>
      <span className="material-icons" style={{ color: "#ff6b35" }}>{icon}</span>
      <div style={pageStyles.contactInfo}>
        <span style={pageStyles.contactLabel}>{label}</span>
        <span style={pageStyles.contactValue}>{value}</span>
      </div>
    </div>
  );

  return (
    <>
      <Navbar />
      <div style={pageStyles.container}>
        {/* Inject global keyframes */}
        <style>{globalStyles}</style>
        <div style={pageStyles.profileCard}>
          {/* Header Section */}
          <div
            style={{
              ...pageStyles.headerSection,
              backgroundImage: profile.coverImage ? `url(${profile.coverImage})` : 'linear-gradient(to right, #ff6b35, #ff8c42)',
            }}
          >
            <div style={pageStyles.headerContent}>
              <div style={pageStyles.profileImageContainer}>
                <img
                  src={profile.profileImage || candidatImage}
                  alt={`${profile.companyName} Profile`}
                  style={pageStyles.profileImage}
                />
                <span style={pageStyles.statusBadge}>
                  {profile.isOpenForWork ? "Disponible" : "Occupé"}
                </span>
              </div>
              <div style={pageStyles.headerInfo}>
                <h1 style={pageStyles.companyName}>{profile.companyName}</h1>
                <p style={pageStyles.companyTitle}>{profile.tagline || "Recruteur Officiel"}</p>
                <div style={pageStyles.headerDivider}></div>
                {profile.domains && profile.domains.length > 0 && (
                  <div style={pageStyles.headerDomainsContainer}>
                    {profile.domains.map((domain, index) => (
                      <span key={index} style={pageStyles.headerDomainTag}>
                        {domain}
                      </span>
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
                <div style={pageStyles.cardHeader}>
                  <h2 style={pageStyles.cardTitle}>
                    <span className="material-icons" style={{ color: "#ff6b35" }}>contacts</span>
                    Contact Information
                  </h2>
                  <span
                    className="material-icons"
                    style={{ ...pageStyles.toggleIcon, transform: showInfos ? "rotate(180deg)" : "rotate(0deg)" }}
                    onClick={() => setShowInfos(!showInfos)}
                  >
                    expand_more
                  </span>
                </div>
                {showInfos && (
                  <div style={pageStyles.cardContent}>
                    {profile.email && renderContactItem("email", "Email", profile.email)}
                    {profile.phone && renderContactItem("phone", "Phone", profile.phone)}
                    {profile.location && renderContactItem("location_on", "Location", profile.location)}
                    {profile.website && renderContactItem("language", "Website", profile.website)}
                  </div>
                )}
              </div>

              {/* Statistics Card */}
              {jobStats && (
                <div style={pageStyles.card}>
                  <div style={pageStyles.cardHeader}>
                    <h2 style={pageStyles.cardTitle}>
                      <span className="material-icons" style={{ color: "#ff6b35" }}>bar_chart</span>
                      Statistics
                    </h2>
                  </div>
                  <div style={pageStyles.cardContent}>
                    <div style={pageStyles.statsGrid}>
                      <div style={pageStyles.statItem}>
                        <h3 style={pageStyles.statNumber}>{jobStats.totalOffers}</h3>
                        <p style={pageStyles.statLabel}>Total Offers</p>
                      </div>
                      <div style={pageStyles.statItem}>
                        <h3 style={pageStyles.statNumber}>{jobStats.activeOffers}</h3>
                        <p style={pageStyles.statLabel}>Active Offers</p>
                      </div>
                      <div style={pageStyles.statItem}>
                        <h3 style={pageStyles.statNumber}>{jobStats.candidatesApplied}</h3>
                        <p style={pageStyles.statLabel}>Applicants</p>
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
                <div style={pageStyles.cardHeader}>
                  <h2 style={pageStyles.cardTitle}>
                    <span className="material-icons" style={{ color: "#ff6b35" }}>info</span>
                    About Us
                  </h2>
                  <span
                    className="material-icons"
                    style={{ ...pageStyles.toggleIcon, transform: showAbout ? "rotate(180deg)" : "rotate(0deg)" }}
                    onClick={() => setShowAbout(!showAbout)}
                  >
                    expand_more
                  </span>
                </div>
                {showAbout && (
                  <div style={pageStyles.cardContent}>
                    <p style={pageStyles.aboutText}>{profile.description || "No description available."}</p>
                  </div>
                )}
              </div>

              {/* Job Offers Section */}
              <div style={pageStyles.card}>
                <div style={pageStyles.cardHeader}>
                  <h2 style={pageStyles.cardTitle}>
                    <span className="material-icons" style={{ color: "#ff6b35" }}>work</span>
                    Latest Job Offers
                  </h2>
                </div>
                <div style={pageStyles.cardContent}>
                  {jobOffers.length > 0 ? (
                    <div style={pageStyles.jobsGrid}>
                      {jobOffers.map((job) => (
                        <div key={job.id} style={pageStyles.jobGridCard}>
                          <div style={pageStyles.jobGridHeader}>
                            <h3 style={pageStyles.jobGridTitle}>{job.title}</h3>
                            <span style={pageStyles.jobGridDate}>
                              {new Date(job.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div style={pageStyles.jobGridDetails}>
                            <div style={pageStyles.jobGridDetailItem}>
                              <span className="material-icons" style={{ fontSize: "1rem", color: "#888" }}>location_on</span>
                              <span style={pageStyles.jobGridDetailValue}>{job.location}</span>
                            </div>
                            <div style={pageStyles.jobGridDetailItem}>
                              <span className="material-icons" style={{ fontSize: "1rem", color: "#888" }}>work_outline</span>
                              <span style={pageStyles.jobGridDetailValue}>{job.jobType}</span>
                            </div>
                            <div style={pageStyles.jobGridDetailItem}>
                              <span className="material-icons" style={{ fontSize: "1rem", color: "#888" }}>attach_money</span>
                              <span style={pageStyles.jobGridDetailValue}>{job.salaryRange || "N/A"}</span>
                            </div>
                          </div>
                          <p style={pageStyles.jobGridDescription}>
                            {job.description ? `${job.description.substring(0, 100)}...` : "No description available."}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={pageStyles.emptyState}>
                      <p style={pageStyles.emptyText}>No job offers available at the moment.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter Section */}
          {newsletters && newsletters.length > 0 && (
            <div style={pageStyles.newsletterSection}>
              <div style={pageStyles.newsletterContainer}>
                <p style={pageStyles.newsletterSubtitle}>Stay Updated</p>
                <h2 style={pageStyles.newsletterTitle}>Subscribe to Our Newsletter</h2>
                <p style={pageStyles.newsletterText}>
                  Get the latest job opportunities and company news directly in your inbox.
                </p>
                <form style={pageStyles.newsletterForm} onSubmit={handleSubmitNewsletter}>
                  <input
                    type="email"
                    name="email"
                    placeholder="Your email address"
                    required
                    style={pageStyles.newsletterInput}
                  />
                  <button type="submit" style={pageStyles.newsletterButton}>
                    Subscribe
                  </button>
                </form>
                <div style={pageStyles.newsletterFeatures}>
                  <p style={pageStyles.newsletterFeature}>
                    <span className="material-icons" style={pageStyles.newsletterFeatureIcon}>check_circle</span>
                    Weekly Updates
                  </p>
                  <p style={pageStyles.newsletterFeature}>
                    <span className="material-icons" style={pageStyles.newsletterFeatureIcon}>flash_on</span>
                    Exclusive Content
                  </p>
                  <p style={pageStyles.newsletterFeature}>
                    <span className="material-icons" style={pageStyles.newsletterFeatureIcon}>lock</span>
                    Privacy Protected
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default RecruiterPublicProfile;
