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
    const socketRef = useRef(null);

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
                setApplications(data);

                data.forEach((application) => {
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
            .catch((err) => console.error("❌ Error loading applications:", err))
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

    const styles = {
        pageBackground: {
            background: '#f4f4f4',
            minHeight: '100vh',
            paddingBottom: '2rem',
        },
        wrapper: {
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "2rem",
            fontFamily: "'Inter', 'Segoe UI', sans-serif",
        },
        header: {
            textAlign: 'center',
            marginBottom: '3rem',
            color: 'white',
        },
        title: {
            fontSize: "3.5rem",
            fontWeight: "900",
            marginBottom: "1rem",
            background: 'linear-gradient(45deg, #ff6b35, #ff8c42)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
        subtitle: {
            fontSize: "1.2rem",
            opacity: 0.9,
            fontWeight: '400',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6',
            color: '#000000',  // or simply 'black'
        
        
        },
        statsBar: {
            display: 'flex',
            justifyContent: 'center',
            gap: '2rem',
            marginBottom: '3rem',
            flexWrap: 'wrap',
        },
        statCard: {
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 107, 53, 0.3)',
            borderRadius: '16px',
            padding: '1.5rem',
            textAlign: 'center',
            color: 'white',
            minWidth: '150px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        },
        statNumber: {
            fontSize: '2rem',
            fontWeight: '700',
            display: 'block',
            color: '#ff6b35',
        },
        statLabel: {
            fontSize: '0.9rem',
            opacity: 0.8,
            marginTop: '0.5rem',
            color: 'black',
        },
        applicationGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
            gap: '2rem',
            marginBottom: '2rem',
        },
        applicationCard: {
            background: '#ffffff',
            borderRadius: '20px',
            padding: '2rem',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
            border: '1px solid #f0f0f0',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative',
            overflow: 'hidden',
            cursor: 'pointer',
        },
        cardHover: {
            transform: 'translateY(-5px)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
            borderColor: '#ff6b35',
        },
        cardHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '1.5rem',
        },
        jobTitle: {
            fontSize: '1.4rem',
            fontWeight: '700',
            color: '#1a1a1a',
            marginBottom: '0.5rem',
            lineHeight: '1.3',
        },
        statusBadge: {
            padding: '0.4rem 1rem',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
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
            fontSize: '0.95rem',
        },
        infoIcon: {
            width: '16px',
            height: '16px',
            color: '#ff6b35',
        },
        cardActions: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '1.5rem',
            borderTop: '1px solid #e0e0e0',
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
            gap: '0.6rem',
            transition: 'all 0.2s ease',
            position: 'relative',
            boxShadow: '0 4px 15px rgba(255, 107, 53, 0.3)',
        },
        chatButtonHover: {
            transform: 'translateY(-1px)',
            boxShadow: '0 6px 20px rgba(255, 107, 53, 0.4)',
            background: 'linear-gradient(135deg, #ff5722, #ff6b35)',
        },
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
            padding: '4rem 2rem',
            background: '#ffffff',
            borderRadius: '20px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
            color: '#666666',
        },
        emptyIcon: {
            fontSize: '4rem',
            color: '#cccccc',
            marginBottom: '1.5rem',
        },
        emptyTitle: {
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#1a1a1a',
            marginBottom: '0.5rem',
        },
        emptyText: {
            fontSize: '1.1rem',
            lineHeight: '1.6',
            color: '#666666',
        },
        loadingContainer: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '4rem',
            background: '#ffffff',
            borderRadius: '20px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
        },
        loadingContent: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
        },
        loadingText: {
            fontSize: '1.2rem',
            color: '#666666',
            fontWeight: '500',
        },
        spinner: {
            fontSize: '2rem',
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
            },
            content: {
                background: 'white',
                borderRadius: '24px',
                padding: '0',
                maxWidth: '800px',
                width: '95%',
                maxHeight: '90vh',
                overflow: 'hidden',
                position: 'relative',
                boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
                border: 'none',
            },
        },
        modalHeader: {
            background: 'linear-gradient(135deg, #1a1a1a, #2d2d2d)',
            color: 'white',
            padding: '2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '3px solid #ff6b35',
        },
        modalTitle: {
            fontSize: '1.5rem',
            fontWeight: '700',
            margin: 0,
            color: 'white',
        },
        closeButton: {
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 107, 53, 0.3)',
            borderRadius: '8px',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'black',
            fontSize: '1.2rem',
            transition: 'all 0.2s ease',
        },
        modalBody: {
            padding: '2rem',
            maxHeight: 'calc(90vh - 100px)',
            overflow: 'auto',
        },
    };

    const totalApplications = applications.length;
    const viewedApplications = applications.filter(app => app.viewed).length;
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
                    ) : applications.length === 0 ? (
                        <div style={styles.emptyState}>
                            <FaBriefcase style={styles.emptyIcon} />
                            <h3 style={styles.emptyTitle}>Aucune candidature pour le moment</h3>
                            <p style={styles.emptyText}>
                                Commencez à postuler aux offres qui vous intéressent pour voir vos candidatures apparaître ici.
                            </p>
                        </div>
                    ) : (
                        <div style={styles.applicationGrid}>
                            {applications.map((application) => (
                                <div 
                                    key={application.id} 
                                    style={styles.applicationCard}
                                    onMouseEnter={(e) => {
                                        Object.assign(e.currentTarget.style, styles.cardHover);
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
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
                                            <span style={{ color: '#ff6b35', fontSize: '0.9rem', fontWeight: '500' }}>
                                                💬 Conversation disponible
                                            </span>
                                            <button
                                                onClick={() => openChatModal(application.id)}
                                                style={styles.chatButton}
                                                onMouseEnter={(e) => {
                                                    Object.assign(e.currentTarget.style, styles.chatButtonHover);
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.transform = 'translateY(0)';
                                                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 107, 53, 0.3)';
                                                    e.currentTarget.style.background = 'linear-gradient(135deg, #ff6b35, #ff8c42)';
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
                        <IoClose size={20} />
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