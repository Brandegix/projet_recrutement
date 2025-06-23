import React, { useEffect, useState, useRef } from "react";
import Navbar from "../Navbara";
import Footer from "../Footer";
import { io } from "socket.io-client";
import ApplicationChat from "../Recruteur/ApplicationChat";
import GlobalSocket from "../GlobalSocket";
import Modal from 'react-modal';
import { FaComment, FaSpinner, FaEye, FaClock, FaBriefcase, FaMapMarkerAlt, FaCalendarAlt, FaTimes, FaComments } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import SEO from "../SEO";

Modal.setAppElement('#root');

const CandidateApplications = () => {
    const [applications, setApplications] = useState([]);
    const [selectedApplicationId, setSelectedApplicationId] = useState(null);
    const [candidate, setCandidate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [recruiterStartedMap, setRecruiterStartedMap] = useState({});
    const [notifications, setNotifications] = useState({});
    const [isChatModalOpen, setIsChatModalOpen] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const socketRef = useRef(null);

    // Track window width for responsive design
    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isMobile = windowWidth < 768;
    const isTablet = windowWidth >= 768 && windowWidth < 1024;
    const isSmallMobile = windowWidth < 480;

    useEffect(() => {
        setLoading(true);
        fetch(`${process.env.REACT_APP_API_URL}/api/candidate/profile`, {
            method: "GET",
            credentials: "include",
        })
            .then((res) => res.json())
            .then((data) => {
                console.log("👤 Candidate profile loaded:", data);
                setCandidate(data);
            })
            .catch((err) =>
                console.error("❌ Error fetching candidate profile:", err)
            )
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        setLoading(true);
        fetch(`${process.env.REACT_APP_API_URL}/api/getapplications`, {
            method: "GET",
            credentials: "include",
        })
            .then((res) => res.json())
            .then((data) => {
                console.log("📑 Applications loaded:", data);
                
                // Ensure data is an array
                const applicationsArray = Array.isArray(data) ? data : [];
                setApplications(applicationsArray);

                // Only process if we have applications
                applicationsArray.forEach((application) => {
                    fetch(
                        `${process.env.REACT_APP_API_URL}/api/application/${application.id}/recruiter-started`,
                        {
                            method: "GET",
                            credentials: "include",
                        }
                    )
                        .then((res) => res.json())
                        .then((startedData) => {
                            setRecruiterStartedMap((prev) => ({
                                ...prev,
                                [application.id]: startedData.recruiter_started,
                            }));
                        })
                        .catch((err) =>
                            console.error(
                                `❌ Error checking recruiter status for ${application.id}:`,
                                err
                            )
                        );
                });
            })
            .catch((err) => {
                console.error("❌ Error loading applications:", err);
                // Set empty array on error
                setApplications([]);
            })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (!candidate?.id) return;

        socketRef.current = io("${process.env.REACT_APP_API_URL}", {
            transports: ["websocket"],
            withCredentials: true,
        });

        socketRef.current.on("connect", () => {
            console.log(`✅ WebSocket connected! (Candidate ID: ${candidate.id})`);
        });

        socketRef.current.on("receive_message", (msg) => {
            console.log("📩 Message received:", msg);
            setApplications((prev) =>
                prev.map((app) =>
                    app.id === msg.applicationId
                        ? { ...app, messages: [...(app.messages || []), msg] }
                        : app
                )
            );

            if (msg.applicationId !== selectedApplicationId || !isChatModalOpen) {
                setNotifications((prev) => ({
                    ...prev,
                    [msg.applicationId]: true,
                }));
            }
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, [candidate, selectedApplicationId, isChatModalOpen]);

    const openChatModal = (applicationId) => {
        setSelectedApplicationId(applicationId);
        setNotifications((prev) => ({ ...prev, [applicationId]: false }));
        setIsChatModalOpen(true);
    };

    const closeChatModal = () => {
        setIsChatModalOpen(false);
        setSelectedApplicationId(null);
    };

    const getResponsiveStyles = () => ({
        pageBackground: {
            background: '#f4f4f4',
            minHeight: '100vh',
            paddingBottom: '2rem',
        },
        wrapper: {
            maxWidth: "1200px",
            margin: "0 auto",
            padding: isMobile ? "1rem" : "2rem",
            fontFamily: "'Inter', 'Segoe UI', sans-serif",
        },
        header: {
            textAlign: 'center',
            marginBottom: isMobile ? '2rem' : '3rem',
            color: 'white',
        },
        title: {
            fontSize: isSmallMobile ? "2rem" : isMobile ? "2.5rem" : "3.5rem",
            fontWeight: "900",
            marginBottom: "1rem",
            background: 'linear-gradient(45deg, #ff6b35, #ff8c42)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
        subtitle: {
            fontSize: isMobile ? "1rem" : "1.2rem",
            opacity: 0.9,
            fontWeight: '400',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6',
            color: '#000000',
            padding: isMobile ? '0 1rem' : '0',
        },
        statsBar: {
            display: 'flex',
            justifyContent: 'center',
            gap: isMobile ? '0.5rem' : '2rem',
            marginBottom: isMobile ? '2rem' : '3rem',
            flexWrap: 'wrap',
            padding: isMobile ? '0 0.5rem' : '0',
        },
        statCard: {
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 107, 53, 0.3)',
            borderRadius: '16px',
            padding: isMobile ? '1rem 0.8rem' : '1.5rem',
            textAlign: 'center',
            color: 'white',
            minWidth: isMobile ? '100px' : '150px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            flex: isMobile ? '1' : 'none',
        },
        statNumber: {
            fontSize: isMobile ? '1.5rem' : '2rem',
            fontWeight: '700',
            display: 'block',
            color: '#ff6b35',
        },
        statLabel: {
            fontSize: isMobile ? '0.75rem' : '0.9rem',
            opacity: 0.8,
            marginTop: '0.5rem',
            color: 'black',
        },
        applicationGrid: {
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(auto-fit, minmax(350px, 1fr))' : 'repeat(auto-fill, minmax(400px, 1fr))',
            gap: isMobile ? '1.5rem' : '2rem',
            marginBottom: '2rem',
        },
        applicationCard: {
            background: '#ffffff',
            borderRadius: '20px',
            padding: isMobile ? '1.5rem' : '2rem',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            border: '1px solid #f0f0f0',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative',
            overflow: 'hidden',
            cursor: 'pointer',
        },
        cardHover: !isMobile ? {
            transform: 'translateY(-5px)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
            borderColor: '#ff6b35',
        } : {},
        cardHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '1.5rem',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? '1rem' : '0',
        },
        jobTitle: {
            fontSize: isMobile ? '1.2rem' : '1.4rem',
            fontWeight: '700',
            color: '#1a1a1a',
            marginBottom: '0.5rem',
            lineHeight: '1.3',
        },
        statusBadge: {
            padding: '0.4rem 1rem',
            borderRadius: '20px',
            fontSize: isMobile ? '0.75rem' : '0.8rem',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            alignSelf: isMobile ? 'flex-start' : 'auto',
        },
        statusViewed: {
            background: 'linear-gradient(135deg, #ff6b35, #ff8c42)',
            color: 'white',
        },
        statusPending: {
            background: 'linear-gradient(135deg, #666666, #888888)',
            color: 'white',
        },
        companyInfo: {
            display: 'flex',
            flexDirection: 'column',
            gap: '0.8rem',
            marginBottom: '1.5rem',
        },
        infoRow: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.8rem',
            color: '#666666',
            fontSize: isMobile ? '0.9rem' : '0.95rem',
            flexWrap: 'wrap',
        },
        infoIcon: {
            width: '16px',
            height: '16px',
            color: '#ff6b35',
            flexShrink: 0,
        },
        cardActions: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '1.5rem',
            borderTop: '1px solid #e0e0e0',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? '1rem' : '0',
        },
        chatButton: {
            background: 'linear-gradient(135deg, #ff6b35, #ff8c42)',
            color: 'white',
            border: 'none',
            padding: '0.8rem 1.5rem',
            borderRadius: '12px',
            fontSize: '0.9rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.6rem',
            transition: 'all 0.2s ease',
            position: 'relative',
            boxShadow: '0 4px 15px rgba(255, 107, 53, 0.3)',
            width: isMobile ? '100%' : 'auto',
            minWidth: isMobile ? 'auto' : '140px',
        },
        chatButtonHover: !isMobile ? {
            transform: 'translateY(-1px)',
            boxShadow: '0 6px 20px rgba(255, 107, 53, 0.4)',
            background: 'linear-gradient(135deg, #ff5722, #ff6b35)',
        } : {},
        notificationDot: {
            position: 'absolute',
            top: '-4px',
            right: '-4px',
            width: '12px',
            height: '12px',
            backgroundColor: '#ef4444',
            borderRadius: '50%',
            border: '2px solid white',
            animation: 'pulse 2s infinite',
        },
        emptyState: {
            textAlign: 'center',
            padding: isMobile ? '3rem 1.5rem' : '4rem 2rem',
            background: '#ffffff',
            borderRadius: '20px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            color: '#666666',
        },
        emptyIcon: {
            fontSize: isMobile ? '3rem' : '4rem',
            color: '#cccccc',
            marginBottom: '1.5rem',
        },
        emptyTitle: {
            fontSize: isMobile ? '1.3rem' : '1.5rem',
            fontWeight: '600',
            color: '#1a1a1a',
            marginBottom: '0.5rem',
        },
        emptyText: {
            fontSize: isMobile ? '1rem' : '1.1rem',
            lineHeight: '1.6',
            color: '#666666',
        },
        loadingContainer: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: isMobile ? '3rem 1.5rem' : '4rem',
            background: '#ffffff',
            borderRadius: '20px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
        },
        loadingContent: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
        },
        loadingText: {
            fontSize: isMobile ? '1.1rem' : '1.2rem',
            color: '#666666',
            fontWeight: '500',
            textAlign: 'center',
        },
        spinner: {
            fontSize: isMobile ? '1.8rem' : '2rem',
            color: '#ff6b35',
            animation: 'spin 1s linear infinite',
        },
        modal: {
            overlay: {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(4px)',
                zIndex: 1050,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: isMobile ? '1rem' : '2rem',
            },
            content: {
                background: 'white',
                borderRadius: isMobile ? '16px' : '24px',
                padding: '0',
                maxWidth: '800px',
                width: isMobile ? '100%' : '95%',
                maxHeight: '90vh',
                overflow: 'hidden',
                position: 'relative',
                boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
                border: 'none',
                margin: '0',
            },
        },
        modalHeader: {
            background: 'linear-gradient(135deg, #1a1a1a, #2d2d2d)',
            color: 'white',
            padding: isMobile ? '1.5rem' : '2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '3px solid #ff6b35',
        },
        modalTitle: {
            fontSize: isMobile ? '1.2rem' : '1.5rem',
            fontWeight: '700',
            margin: 0,
            color: 'white',
        },
        closeButton: {
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 107, 53, 0.3)',
            borderRadius: '8px',
            width: isMobile ? '36px' : '40px',
            height: isMobile ? '36px' : '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'white',
            fontSize: isMobile ? '1rem' : '1.2rem',
            transition: 'all 0.2s ease',
        },
        modalBody: {
            padding: isMobile ? '1.5rem' : '2rem',
            maxHeight: 'calc(90vh - 100px)',
            overflow: 'auto',
        },
        conversationAvailable: {
            color: '#ff6b35', 
            fontSize: '0.9rem', 
            fontWeight: '500',
            textAlign: isMobile ? 'center' : 'left',
        }
    });

    const styles = getResponsiveStyles();

    // Ensure applications is always an array before calculating stats
    const applicationsArray = Array.isArray(applications) ? applications : [];
    const totalApplications = applicationsArray.length;
    const viewedApplications = applicationsArray.filter(app => app.viewed).length;
    const activeChats = Object.values(recruiterStartedMap).filter(Boolean).length;

    return (
        <>
         <SEO
        title="Candidatures"
       /> 
            <style jsx>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            `}</style>
            
            <div style={styles.pageBackground}>
                <Navbar />
                {candidate && (
                    <GlobalSocket userId={candidate.id} userType="candidate" />
                )}
                
                <div style={styles.wrapper}>
                    <div style={styles.header}>
                        <h1 style={styles.title}>Mes Candidatures</h1>
                        <p style={styles.subtitle}>
                            Suivez l'évolution de vos candidatures et discutez avec les recruteurs intéressés par votre profil.
                        </p>
                    </div>

                    {!loading && (
                        <div style={styles.statsBar}>
                            <div style={styles.statCard}>
                                <span style={styles.statNumber}>{totalApplications}</span>
                                <span style={styles.statLabel}>Total Candidatures</span>
                            </div>
                            <div style={styles.statCard}>
                                <span style={styles.statNumber}>{viewedApplications}</span>
                                <span style={styles.statLabel}>Vues</span>
                            </div>
                            <div style={styles.statCard}>
                                <span style={styles.statNumber}>{activeChats}</span>
                                <span style={styles.statLabel}>Conversations</span>
                            </div>
                        </div>
                    )}

                    {loading ? (
                        <div style={styles.loadingContainer}>
                            <div style={styles.loadingContent}>
                                <FaSpinner style={styles.spinner} />
                                <div style={styles.loadingText}>Chargement de vos candidatures...</div>
                            </div>
                        </div>
                    ) : applicationsArray.length === 0 ? (
                        <div style={styles.emptyState}>
                            <FaBriefcase style={styles.emptyIcon} />
                            <h3 style={styles.emptyTitle}>Aucune candidature pour le moment</h3>
                            <p style={styles.emptyText}>
                                Commencez à postuler aux offres qui vous intéressent pour voir vos candidatures apparaître ici.
                            </p>
                        </div>
                    ) : (
                        <div style={styles.applicationGrid}>
                            {applicationsArray.map((application) => (
                                <div 
                                    key={application.id} 
                                    style={styles.applicationCard}
                                    onMouseEnter={(e) => {
                                        if (!isMobile) {
                                            Object.assign(e.currentTarget.style, styles.cardHover);
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isMobile) {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
                                            e.currentTarget.style.borderColor = '#f0f0f0';
                                        }
                                    }}
                                >
                                    <div style={styles.cardHeader}>
                                        <div>
                                            <h3 style={styles.jobTitle}>
                                                {application.job_offer?.title || "Titre non disponible"}
                                            </h3>
                                        </div>
                                        <div style={{
                                            ...styles.statusBadge,
                                            ...(application.viewed ? styles.statusViewed : styles.statusPending)
                                        }}>
                                            {application.viewed ? <FaEye /> : <FaClock />}
                                            {application.viewed ? "Reçue" : "En attente"}
                                        </div>
                                    </div>

                                    <div style={styles.companyInfo}>
                                        <div style={styles.infoRow}>
                                            <FaBriefcase style={styles.infoIcon} />
                                            <span>{application.job_offer?.company || "N/A"}</span>
                                        </div>
                                        <div style={styles.infoRow}>
                                            <FaMapMarkerAlt style={styles.infoIcon} />
                                            <span>{application.job_offer?.location || "N/A"}</span>
                                        </div>
                                        <div style={styles.infoRow}>
                                            <FaCalendarAlt style={styles.infoIcon} />
                                            <span>
                                                Candidaté le {new Date(application.application_date).toLocaleDateString('fr-FR')}
                                            </span>
                                        </div>
                                    </div>

                                    {recruiterStartedMap[application.id] && (
                                        <div style={styles.cardActions}>
                                            <span style={styles.conversationAvailable}>
                                                💬 Conversation disponible
                                            </span>
                                            <button
                                                onClick={() => openChatModal(application.id)}
                                                style={styles.chatButton}
                                                onMouseEnter={(e) => {
                                                    if (!isMobile) {
                                                        Object.assign(e.currentTarget.style, styles.chatButtonHover);
                                                    }
                                                }}
                                                onMouseLeave={(e) => {
                                                    if (!isMobile) {
                                                        e.currentTarget.style.transform = 'translateY(0)';
                                                        e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 107, 53, 0.3)';
                                                        e.currentTarget.style.background = 'linear-gradient(135deg, #ff6b35, #ff8c42)';
                                                    }
                                                }}
                                            >
                                                <FaComments />
                                                Discuter
                                                {notifications[application.id] && (
                                                    <span style={styles.notificationDot}></span>
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <Footer />

                <Modal
                    isOpen={isChatModalOpen}
                    onRequestClose={closeChatModal}
                    style={styles.modal}
                >
                    <div style={styles.modalHeader}>
                        <h2 style={styles.modalTitle}>Conversation avec le recruteur</h2>
                        <button onClick={closeChatModal} style={styles.closeButton}>
                            
                        </button>
                    </div>
                    <div style={styles.modalBody}>
                        {selectedApplicationId && candidate?.id && (
                            <ApplicationChat
                                applicationId={selectedApplicationId}
                                userId={candidate.id}
                                userType="candidate"
                            />
                        )}
                    </div>
                </Modal>
            </div>
        </>
    );
};

export default CandidateApplications;
