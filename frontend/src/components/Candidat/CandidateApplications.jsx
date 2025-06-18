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

// Set app element and configure modal to prevent body style conflicts
Modal.setAppElement('#root');

// Custom modal styles that prevent body margin/padding issues
const customModalStyles = {
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(4px)',
        zIndex: 1050,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        margin: 0,
        padding: 0,
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
        margin: 0,
        top: 'auto',
        left: 'auto',
        right: 'auto',
        bottom: 'auto',
        transform: 'none',
    },
};

const CandidateApplications = () => {
    const [applications, setApplications] = useState([]);
    const [selectedApplicationId, setSelectedApplicationId] = useState(null);
    const [candidate, setCandidate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [recruiterStartedMap, setRecruiterStartedMap] = useState({});
    const [notifications, setNotifications] = useState({});
    const [isChatModalOpen, setIsChatModalOpen] = useState(false);
    const socketRef = useRef(null);

    // Prevent body scroll when modal opens and restore when closes
    useEffect(() => {
        if (isChatModalOpen) {
            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = '0px';
            document.body.style.margin = '0';
        } else {
            document.body.style.overflow = 'unset';
            document.body.style.paddingRight = '0px';
            document.body.style.margin = '0';
        }

        // Cleanup on unmount
        return () => {
            document.body.style.overflow = 'unset';
            document.body.style.paddingRight = '0px';
            document.body.style.margin = '0';
        };
    }, [isChatModalOpen]);

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
                
                const applicationsArray = Array.isArray(data) ? data : [];
                setApplications(applicationsArray);

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

    const styles = {
        pageBackground: {
            background: '#f4f4f4',
            minHeight: '100vh',
            paddingBottom: '2rem',
            margin: 0,
            padding: 0,
        },
        wrapper: {
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "2rem",
            fontFamily: "'Inter', 'Segoe UI', sans-serif",
        },
        // ... rest of your styles remain the same
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
            color: '#000000',
        },
        // ... include all your other styles here
    };

    const applicationsArray = Array.isArray(applications) ? applications : [];
    const totalApplications = applicationsArray.length;
    const viewedApplications = applicationsArray.filter(app => app.viewed).length;
    const activeChats = Object.values(recruiterStartedMap).filter(Boolean).length;

    return (
        <>
            <SEO title="Candidatures" />
            
            {/* Add global styles to prevent layout shifts */}
            <style jsx global>{`
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                html, body {
                    margin: 0 !important;
                    padding: 0 !important;
                    overflow-x: hidden;
                }
                
                #root {
                    margin: 0 !important;
                    padding: 0 !important;
                    min-height: 100vh;
                }
                
                /* Prevent React Modal from adding margin/padding to body */
                body.ReactModal__Body--open {
                    margin: 0 !important;
                    padding: 0 !important;
                    overflow: hidden;
                }
                
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
                    {/* Your existing JSX content remains the same */}
                    <div style={styles.header}>
                        <h1 style={styles.title}>Mes Candidatures</h1>
                        <p style={styles.subtitle}>
                            Suivez l'évolution de vos candidatures et discutez avec les recruteurs intéressés par votre profil.
                        </p>
                    </div>

                    {/* ... rest of your component JSX ... */}
                </div>
                <Footer />

                {/* Updated Modal with custom styles */}
                <Modal
                    isOpen={isChatModalOpen}
                    onRequestClose={closeChatModal}
                    style={customModalStyles}
                    shouldCloseOnOverlayClick={true}
                    shouldCloseOnEsc={true}
                    contentLabel="Chat Modal"
                >
                    <div style={{
                        background: 'linear-gradient(135deg, #1a1a1a, #2d2d2d)',
                        color: 'white',
                        padding: '2rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderBottom: '3px solid #ff6b35',
                    }}>
                        <h2 style={{
                            fontSize: '1.5rem',
                            fontWeight: '700',
                            margin: 0,
                            color: 'white',
                        }}>Conversation avec le recruteur</h2>
                        <button 
                            onClick={closeChatModal} 
                            style={{
                                background: 'rgba(255, 255, 255, 0.1)',
                                border: '1px solid rgba(255, 107, 53, 0.3)',
                                borderRadius: '8px',
                                width: '40px',
                                height: '40px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                color: 'white',
                                fontSize: '1.2rem',
                                transition: 'all 0.2s ease',
                            }}
                        >
                            <IoClose size={20} />
                        </button>
                    </div>
                    <div style={{
                        padding: '2rem',
                        maxHeight: 'calc(90vh - 100px)',
                        overflow: 'auto',
                    }}>
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
