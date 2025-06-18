import React, { useEffect, useState } from "react";
import Navbar from "../Navbara";
import Footer from "../Footer";
import { useParams } from "react-router-dom";

// --- Helper Hook for Media Queries ---
const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    window.addEventListener("resize", listener);
    return () => window.removeEventListener("resize", listener);
  }, [matches, query]);

  return matches;
};

// --- Styles based on Media Queries ---
const getPageStyles = (isMobile, isTablet) => {
  // Base styles for desktop
  const baseStyles = {
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
    // Header Section - Simplified, no cover image
    headerSection: {
      backgroundColor: "#2a2a2a", // Darker background for header area
      padding: "50px 60px",
      display: "flex",
      alignItems: "center",
      gap: "40px",
      borderBottom: "1px solid #333",
    },
    headerContent: {
      width: "100%",
      display: "flex",
      alignItems: "center",
      gap: "40px",
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
    toggleButton: { // Renamed from toggleIcon to be more generic, assuming it's a clickable button
      fontSize: "1rem", // Reduced size as it's not an icon
      color: "#ff6b35",
      background: "none",
      border: "1px solid #ff6b35",
      borderRadius: "8px",
      padding: "8px 15px",
      cursor: "pointer",
      transition: "background-color 0.3s ease, color 0.3s ease",
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
      flexGrow: 1,
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
      borderRadius: "10px",
      border: "1px dashed #444",
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

    // Loading indicator (overlay)
    loadingIndicator: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
      color: "#fff",
      fontSize: "1.2rem",
    },
    spinner: {
      border: "4px solid rgba(255, 255, 255, 0.3)",
      borderTop: "4px solid #ff6b35",
      borderRadius: "50%",
      width: "50px",
      height: "50px",
      animation: "spin 1s linear infinite",
      marginBottom: "15px",
    },
    loadingText: {
      marginTop: "10px",
      color: "#ff6b35",
      fontWeight: "bold",
    },
    "@keyframes spin": {
      "0%": { transform: "rotate(0deg)" },
      "100%": { transform: "rotate(360deg)" },
    },

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
    Object.assign(baseStyles.container, {
      padding: '10px 5px',
    });
    Object.assign(baseStyles.profileCard, {
      borderRadius: '15px',
      margin: '0 5px',
    });
    Object.assign(baseStyles.headerSection, {
      padding: '30px 20px',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      gap: '20px',
    });
    Object.assign(baseStyles.headerContent, {
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      gap: '20px',
    });
    Object.assign(baseStyles.profileImage, {
      width: '120px',
      height: '120px',
    });
    Object.assign(baseStyles.profileImageSkeleton, {
      width: '120px',
      height: '120px',
    });
    Object.assign(baseStyles.statusBadge, {
      bottom: '10px',
      right: '10px',
      padding: '4px 8px',
      fontSize: '0.7rem',
    });
    Object.assign(baseStyles.statusBadgeSkeleton, {
      bottom: '10px',
      right: '10px',
      width: '50px',
      height: '22px',
    });
    Object.assign(baseStyles.companyName, {
      fontSize: '2.2rem',
    });
    Object.assign(baseStyles.companyNameSkeleton, {
      width: '250px',
      height: '40px',
      margin: '0 auto 12px auto',
    });
    Object.assign(baseStyles.companyTitle, {
      fontSize: '1.2rem',
    });
    Object.assign(baseStyles.companyTitleSkeleton, {
      width: '150px',
      height: '20px',
      margin: '0 auto 25px auto',
    });
    Object.assign(baseStyles.headerDivider, {
      margin: '0 auto 20px auto',
    });
    Object.assign(baseStyles.headerDomainsContainer, {
      justifyContent: 'center',
      gap: '8px',
    });
    Object.assign(baseStyles.mainContent, {
      flexDirection: 'column',
      padding: '20px 20px',
      gap: '20px',
    });
    Object.assign(baseStyles.leftColumn, {
      minWidth: 'unset',
      width: '100%',
    });
    Object.assign(baseStyles.rightColumn, {
      width: '100%',
    });
    Object.assign(baseStyles.card, {
      padding: '20px',
    });
    Object.assign(baseStyles.cardTitle, {
      fontSize: '1.6rem',
    });
    Object.assign(baseStyles.cardTitleSkeleton, {
      width: '180px',
      height: '28px',
    });
    Object.assign(baseStyles.statsGrid, {
      gridTemplateColumns: "repeat(auto-fit, minmax(80px, 1fr))",
      gap: "15px",
    });
    Object.assign(baseStyles.statItem, {
      padding: '15px 10px',
    });
    Object.assign(baseStyles.statNumber, {
      fontSize: '2rem',
    });
    Object.assign(baseStyles.jobGridCard, {
      padding: '20px',
    });
    Object.assign(baseStyles.jobGridTitle, {
      fontSize: '1.2rem',
    });
    Object.assign(baseStyles.newsletterSection, {
      padding: '40px 15px',
    });
    Object.assign(baseStyles.newsletterTitle, {
      fontSize: '2.5rem',
    });
    Object.assign(baseStyles.newsletterTitleSkeleton, {
      width: '350px',
      height: '35px',
    });
    Object.assign(baseStyles.newsletterTextSkeleton, {
      width: 'auto',
    });
    Object.assign(baseStyles.newsletterForm, {
      flexDirection: 'column',
      alignItems: 'center',
      gap: '10px',
      maxWidth: '350px',
    });
    Object.assign(baseStyles.newsletterInput, {
      width: '100%',
    });
    Object.assign(baseStyles.newsletterButton, {
      width: '100%',
      padding: '12px 25px',
    });
  }

  // Apply mobile specific styles
  if (isMobile) {
    Object.assign(baseStyles.headerSection, {
      padding: '20px 15px',
      gap: '15px',
    });
    Object.assign(baseStyles.headerContent, {
      padding: '0', // Already set in headerSection, reset for mobile specific
      gap: '15px',
    });
    Object.assign(baseStyles.profileImage, {
      width: '100px',
      height: '100px',
    });
    Object.assign(baseStyles.profileImageSkeleton, {
      width: '100px',
      height: '100px',
    });
    Object.assign(baseStyles.statusBadge, {
      bottom: '8px',
      right: '8px',
      padding: '3px 6px',
      fontSize: '0.65rem',
    });
    Object.assign(baseStyles.statusBadgeSkeleton, {
      bottom: '8px',
      right: '8px',
      width: '40px',
      height: '18px',
    });
    Object.assign(baseStyles.companyName, {
      fontSize: '1.8rem',
    });
    Object.assign(baseStyles.companyNameSkeleton, {
      width: '200px',
      height: '35px',
    });
    Object.assign(baseStyles.companyTitle, {
      fontSize: '1rem',
    });
    Object.assign(baseStyles.companyTitleSkeleton, {
      width: '120px',
      height: '18px',
    });
    Object.assign(baseStyles.headerDivider, {
      width: '80px',
      height: '3px',
    });
    Object.assign(baseStyles.headerDomainTag, {
      padding: '6px 12px',
      fontSize: '0.8rem',
    });
    Object.assign(baseStyles.headerDomainTagSkeleton, {
      width: '70px',
      height: '32px',
    });
    Object.assign(baseStyles.mainContent, {
      padding: '15px 15px',
      gap: '15px',
    });
    Object.assign(baseStyles.card, {
      padding: '15px',
      borderRadius: '12px',
    });
    Object.assign(baseStyles.cardHeader, {
      marginBottom: '15px',
      paddingBottom: '10px',
    });
    Object.assign(baseStyles.cardTitle, {
      fontSize: '1.4rem',
    });
    Object.assign(baseStyles.cardTitleSkeleton, {
      width: '150px',
      height: '25px',
    });
    Object.assign(baseStyles.toggleButton, {
      fontSize: '0.9rem',
    });
    Object.assign(baseStyles.cardContent, {
      fontSize: '0.9rem',
    });
    Object.assign(baseStyles.contactItem, {
      marginBottom: '10px',
      gap: '10px',
    });
    Object.assign(baseStyles.contactLabel, {
      fontSize: '0.8rem',
    });
    Object.assign(baseStyles.contactValue, {
      fontSize: '0.9rem',
    });
    Object.assign(baseStyles.contactLabelSkeleton, {
      width: '70px',
      height: '16px',
    });
    Object.assign(baseStyles.contactValueSkeleton, {
      width: '100px',
      height: '20px',
    });
    Object.assign(baseStyles.statsGrid, {
      gap: "10px",
    });
    Object.assign(baseStyles.statItem, {
      padding: '12px 8px',
    });
    Object.assign(baseStyles.statNumber, {
      fontSize: '1.8rem',
    });
    Object.assign(baseStyles.statNumberSkeleton, {
      width: '50px',
      height: '35px',
    });
    Object.assign(baseStyles.statLabel, {
      fontSize: '0.8rem',
    });
    Object.assign(baseStyles.statLabelSkeleton, {
      width: '60px',
      height: '16px',
    });
    Object.assign(baseStyles.aboutText, {
      fontSize: '0.9rem',
    });
    Object.assign(baseStyles.aboutTextLineSkeleton, {
      height: '16px',
    });
    Object.assign(baseStyles.jobsGrid, {
      gridTemplateColumns: "1fr",
      gap: "15px",
    });
    Object.assign(baseStyles.jobGridCard, {
      padding: '18px',
    });
    Object.assign(baseStyles.jobGridHeader, {
      marginBottom: '10px',
      paddingBottom: '8px',
    });
    Object.assign(baseStyles.jobGridTitle, {
      fontSize: '1.1rem',
    });
    Object.assign(baseStyles.jobGridDate, {
      fontSize: '0.75rem',
    });
    Object.assign(baseStyles.jobGridTitleSkeleton, {
      height: '24px',
    });
    Object.assign(baseStyles.jobGridDateSkeleton, {
      width: '70px',
      height: '16px',
    });
    Object.assign(baseStyles.jobGridDetails, {
      gap: '8px 15px',
      marginBottom: '10px',
    });
    Object.assign(baseStyles.jobGridDetailLabel, {
      fontSize: '0.8rem',
    });
    Object.assign(baseStyles.jobGridDetailValue, {
      fontSize: '0.85rem',
    });
    Object.assign(baseStyles.jobGridDetailSkeleton, {
      width: '100px',
      height: '18px',
    });
    Object.assign(baseStyles.jobGridDescription, {
      fontSize: '0.85rem',
    });
    Object.assign(baseStyles.jobGridDescriptionSkeleton, {
      height: '16px',
    });
    Object.assign(baseStyles.emptyState, {
      padding: '20px 10px',
      fontSize: '1rem',
      marginTop: '15px',
    });
    Object.assign(baseStyles.newsletterSection, {
      padding: '30px 10px',
      marginTop: '30px',
    });
    Object.assign(baseStyles.newsletterSubtitle, {
      fontSize: '1rem',
    });
    Object.assign(baseStyles.newsletterSubtitleSkeleton, {
      width: '120px',
      height: '18px',
    });
    Object.assign(baseStyles.newsletterTitle, {
      fontSize: '2rem',
    });
    Object.assign(baseStyles.newsletterTitleSkeleton, {
      width: '280px',
      height: '30px',
    });
    Object.assign(baseStyles.newsletterText, {
      fontSize: '0.9rem',
      marginBottom: '20px',
    });
    Object.assign(baseStyles.newsletterTextSkeleton, {
      height: '16px',
      width: '250px',
    });
    Object.assign(baseStyles.newsletterForm, {
      gap: '8px',
      maxWidth: '300px',
    });
    Object.assign(baseStyles.newsletterFormSkeleton, {
      height: '45px',
      width: '300px',
    });
    Object.assign(baseStyles.newsletterInput, {
      padding: '12px 15px',
      fontSize: '0.9rem',
    });
    Object.assign(baseStyles.newsletterButton, {
      padding: '12px 20px',
      fontSize: '0.9rem',
    });
    Object.assign(baseStyles.newsletterFeatures, {
      gap: '15px',
    });
    Object.assign(baseStyles.newsletterFeature, {
      fontSize: '0.85rem',
    });
  }

  return baseStyles;
};

// --- RecruiterPublicProfile Component ---
function RecruiterPublicProfile() {
  const [profile, setProfile] = useState(null);
  const [jobStats, setJobStats] = useState(null);
  const [jobOffers, setJobOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAbout, setShowAbout] = useState(true); // Default to true as there are no icons to toggle
  const [showInfos, setShowInfos] = useState(true); // Default to true as there are no icons to toggle
  const [newsletters, setNewsletters] = useState([]);

  const { id } = useParams();

  const isMobile = useMediaQuery("(max-width: 480px)");
  const isTablet = useMediaQuery("(max-width: 768px)");

  const pageStyles = getPageStyles(isMobile, isTablet);

  useEffect(() => {
    const fetchRecruiterData = async () => {
      setLoading(true);
      setError(null);
      try {
        const profileRes = await fetch(`${process.env.REACT_APP_API_URL}/api/recruiter/public-profile/${id}`);
        if (!profileRes.ok) throw new Error("Failed to fetch public profile");
        const profileData = await profileRes.json();
        setProfile(profileData);
        setJobStats(profileData.jobStats || null);
        setNewsletters(profileData.newsletters || []);

        const jobsRes = await fetch(`${process.env.REACT_APP_API_URL}/api/recruiter/${id}/last-job-offers`);
        if (!jobsRes.ok) throw new Error("Failed to fetch job offers");
        const jobsData = await jobsRes.json();
        setJobOffers(jobsData);

      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Erreur lors du chargement du profil ou des offres.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRecruiterData();
    }
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
      if (!res.ok) {
        throw new Error(result.message || 'Échec de l\'inscription à la newsletter.');
      }
      alert(result.message || 'Inscription réussie !');
    } catch (err) {
      console.error('Erreur:', err);
      alert(`Erreur lors de l'inscription: ${err.message || 'Veuillez réessayer.'}`);
    }
  };

  // Loading Component (Skeleton)
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
                      <div style={pageStyles.jobGridDescriptionSkeleton}>
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
            <div style={{ ...pageStyles.newsletterTextSkeleton, width: "70%", marginBottom: "30px" }}>
              <div style={pageStyles.shimmer}></div>
            </div>
            <div style={pageStyles.newsletterFormSkeleton}>
              <div style={pageStyles.shimmer}></div>
            </div>
            <div style={pageStyles.newsletterFeatures}>
              {[1, 2, 3].map((i) => (
                <div key={i} style={{ ...pageStyles.newsletterFeature, position: "relative", overflow: "hidden" }}>
                  <div style={{ ...pageStyles.newsletterFeatureIcon, backgroundColor: "#2a2a2a", width: "20px", height: "20px", borderRadius: "4px" }}>
                    <div style={pageStyles.shimmer}></div>
                  </div>
                  <div style={{ ...pageStyles.aboutTextLineSkeleton, width: "100px", height: "18px", marginBottom: "0" }}>
                    <div style={pageStyles.shimmer}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );

  if (loading) {
    return <LoadingComponent />;
  }

  if (error) {
    return (
      <div style={pageStyles.container}>
        <Navbar />
        <div style={pageStyles.errorMessage}>{error}</div>
        <Footer />
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={pageStyles.container}>
        <Navbar />
        <div style={pageStyles.emptyState}>
          <p style={pageStyles.emptyText}>Aucun profil de recruteur trouvé.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={pageStyles.container}>
      <Navbar />
      <div style={pageStyles.profileCard}>
        {/* Header Section */}
        <div style={pageStyles.headerSection}>
          <div style={pageStyles.headerContent}>
            <div style={pageStyles.profileImageContainer}>
              <img
                src={profile.profileImage || `https://via.placeholder.com/180/333/ff6b35?text=${profile.company_name ? profile.company_name.charAt(0) : 'R'}`}
                alt={`${profile.company_name}'s profile`}
                style={pageStyles.profileImage}
              />
              <span style={pageStyles.statusBadge}>
                {profile.active ? "Actif" : "Inactif"}
              </span>
            </div>
            <div style={pageStyles.headerInfo}>
              <h1 style={pageStyles.companyName}>{profile.company_name}</h1>
              <h2 style={pageStyles.companyTitle}>{profile.headline}</h2>
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
                <h3 style={pageStyles.cardTitle}>Contact Information</h3>
                <button
                  onClick={() => setShowInfos(!showInfos)}
                  style={pageStyles.toggleButton}
                >
                  {showInfos ? "Hide" : "Show"}
                </button>
              </div>
              {showInfos && (
                <div style={pageStyles.cardContent}>
                  {profile.contact_email && (
                    <div style={pageStyles.contactItem}>
                      <div style={pageStyles.contactInfo}>
                        <span style={pageStyles.contactLabel}>Email</span>
                        <span style={pageStyles.contactValue}>{profile.contact_email}</span>
                      </div>
                    </div>
                  )}
                  {profile.phone_number && (
                    <div style={pageStyles.contactItem}>
                      <div style={pageStyles.contactInfo}>
                        <span style={pageStyles.contactLabel}>Phone</span>
                        <span style={pageStyles.contactValue}>{profile.phone_number}</span>
                      </div>
                    </div>
                  )}
                  {profile.website && (
                    <div style={pageStyles.contactItem}>
                      <div style={pageStyles.contactInfo}>
                        <span style={pageStyles.contactLabel}>Website</span>
                        <a href={profile.website} target="_blank" rel="noopener noreferrer" style={{ ...pageStyles.contactValue, color: "#ff6b35", textDecoration: "none" }}>
                          {profile.website}
                        </a>
                      </div>
                    </div>
                  )}
                  {!profile.contact_email && !profile.phone_number && !profile.website && (
                    <p style={pageStyles.emptyText}>No contact information available.</p>
                  )}
                </div>
              )}
            </div>

            {/* Statistics Card */}
            <div style={pageStyles.card}>
              <div style={pageStyles.cardHeader}>
                <h3 style={pageStyles.cardTitle}>Statistics</h3>
              </div>
              <div style={pageStyles.cardContent}>
                {jobStats ? (
                  <div style={pageStyles.statsGrid}>
                    <div style={pageStyles.statItem}>
                      <span style={pageStyles.statNumber}>{jobStats.totalJobs}</span>
                      <span style={pageStyles.statLabel}>Total Jobs</span>
                    </div>
                    <div style={pageStyles.statItem}>
                      <span style={pageStyles.statNumber}>{jobStats.activeJobs}</span>
                      <span style={pageStyles.statLabel}>Active Jobs</span>
                    </div>
                    <div style={pageStyles.statItem}>
                      <span style={pageStyles.statNumber}>{jobStats.applicationsReceived}</span>
                      <span style={pageStyles.statLabel}>Applications</span>
                    </div>
                  </div>
                ) : (
                  <p style={pageStyles.emptyText}>No job statistics available.</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div style={pageStyles.rightColumn}>
            {/* About Section */}
            <div style={pageStyles.card}>
              <div style={pageStyles.cardHeader}>
                <h3 style={pageStyles.cardTitle}>About {profile.company_name}</h3>
                <button
                  onClick={() => setShowAbout(!showAbout)}
                  style={pageStyles.toggleButton}
                >
                  {showAbout ? "Hide" : "Show"}
                </button>
              </div>
              {showAbout && (
                <div style={pageStyles.cardContent}>
                  {profile.about ? (
                    <p style={pageStyles.aboutText}>{profile.about}</p>
                  ) : (
                    <p style={pageStyles.emptyText}>No "About" information provided.</p>
                  )}
                </div>
              )}
            </div>

            {/* Job Offers Section */}
            <div style={pageStyles.card}>
              <div style={pageStyles.cardHeader}>
                <h3 style={pageStyles.cardTitle}>Latest Job Offers</h3>
              </div>
              <div style={pageStyles.cardContent}>
                {jobOffers.length > 0 ? (
                  <div style={pageStyles.jobsGrid}>
                    {jobOffers.map((job) => (
                      <div key={job.id} style={pageStyles.jobGridCard}>
                        <div style={pageStyles.jobGridHeader}>
                          <h4 style={pageStyles.jobGridTitle}>{job.title}</h4>
                          <span style={pageStyles.jobGridDate}>
                            {new Date(job.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div style={pageStyles.jobGridDetails}>
                          {job.location && (
                            <div style={pageStyles.jobGridDetailItem}>
                              <span style={pageStyles.jobGridDetailLabel}>Location:</span>
                              <span style={pageStyles.jobGridDetailValue}>{job.location}</span>
                            </div>
                          )}
                          {job.type && (
                            <div style={pageStyles.jobGridDetailItem}>
                              <span style={pageStyles.jobGridDetailLabel}>Type:</span>
                              <span style={pageStyles.jobGridDetailValue}>{job.type}</span>
                            </div>
                          )}
                        </div>
                        <p style={pageStyles.jobGridDescription}>
                          {job.description.length > 150
                            ? `${job.description.substring(0, 150)}...`
                            : job.description}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={pageStyles.emptyState}>
                    <p style={pageStyles.emptyText}>No recent job offers available.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        {newsletters.length > 0 && (
          <div style={pageStyles.newsletterSection}>
            <div style={pageStyles.newsletterContainer}>
              <p style={pageStyles.newsletterSubtitle}>Stay Updated</p>
              <h2 style={pageStyles.newsletterTitle}>Subscribe to Our Newsletter</h2>
              <p style={pageStyles.newsletterText}>
                Get the latest updates on new job opportunities and company news directly to your inbox.
              </p>
              <form onSubmit={handleSubmit} style={pageStyles.newsletterForm}>
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
                <span style={pageStyles.newsletterFeature}>New job alerts</span>
                <span style={pageStyles.newsletterFeature}>Company news</span>
                <span style={pageStyles.newsletterFeature}>Career tips</span>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default RecruiterPublicProfile;
