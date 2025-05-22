import React, { useEffect, useState, useRef } from "react";
import Navbar from "../Navbara";
import Footer from "../Footer";
import { io } from "socket.io-client";
import ApplicationChat from "../Recruteur/ApplicationChat";
import GlobalSocket from "../GlobalSocket"; // ✅ Import global socket listener
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Bind modal to the root element

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

            // 🔔 Trigger notification only if chat is not open in modal
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
        wrapper: {
            maxWidth: "900px",
            margin: "2rem auto",
            padding: "2rem",
            fontFamily: "'Arial', sans-serif",
            backgroundColor: "#f9f9f9",
            minHeight: "80vh",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
        },
        title: {
            fontSize: "2.4rem",
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: "2.5rem",
            color: "#333",
        },
        grid: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
            gap: "2rem",
        },
        card: {
            backgroundColor: "#fff",
            borderRadius: "10px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            padding: "1.8rem",
            transition: "transform 0.2s ease-in-out",
            border: "1px solid #eee",
            ":hover": {
                transform: "scale(1.01)",
                boxShadow: "0 4px 10px rgba(0,0,0,0.12)",
            },
        },
        header: {
            fontSize: "1.3rem",
            fontWeight: "600",
            color: "#374151",
            marginBottom: "1rem",
        },
        info: {
            fontSize: "1rem",
            color: "#555",
            lineHeight: "1.7",
            marginBottom: "1.2rem",
        },
        infoItem: {
            marginBottom: "0.5rem",
        },
        button: {
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          padding: "0.8rem 1.2rem",
          borderRadius: "8px",
          fontSize: "1rem",
          fontWeight: "500",
          cursor: "pointer",
          transition: "background-color 0.2s ease",
          textAlign: "center",
          minWidth: "200px", /* Added a minimum width */
          position: "relative",
          height: "60px",
      },
        redDot: {
            position: "absolute",
            top: "-5px",
            right: "-5px",
            height: "12px",
            width: "12px",
            backgroundColor: "#dc3545",
            borderRadius: "50%",
        },
        emptyState: {
            textAlign: "center",
            padding: "4rem",
            color: "#777",
            fontSize: "1.2rem",
        },
        chatModal: {
          overlay: { backgroundColor: 'rgba(0, 0, 0, 0.6)', zIndex: 1050 }, /* Added zIndex to the overlay */
          content: {
              top: '50%', left: '50%', right: 'auto', bottom: 'auto',
              marginRight: '-50%', transform: 'translate(-50%, -50%)',
              padding: '20px', borderRadius: '12px', maxWidth: '600px', width: '90%',
              maxHeight: '80vh', overflow: 'auto', borderColor: '#ccc',
              zIndex: 1051, /* Added zIndex to the content */
          },
      },
        modalTitle: {
            color: '#333', fontSize: '1.6rem', fontWeight: '500', marginBottom: '1rem', textAlign: 'center',
        },
        closeButton: {
            position: 'absolute', top: '10px', right: '10px',
            background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#777',
        },
    };

    return (
        <>
            <Navbar />
            {candidate && (
                <GlobalSocket userId={candidate.id} userType="candidate" />
            )}
            <div style={styles.wrapper}>
                <h2 style={styles.title}>Mes Candidatures</h2>

                {loading ? (
                    <div style={styles.emptyState}>
                        <p>Chargement des candidatures...</p>
                    </div>
                ) : applications.length === 0 ? (
                    <div style={styles.emptyState}>
                        <p>Aucune candidature soumise pour le moment.</p>
                    </div>
                ) : (
                    <div style={styles.grid}>
                       {applications.map((application) => (
  <div key={application.id} style={styles.card}>
    <div style={styles.header}>
      {application.job_offer?.title || "Titre non disponible"}
    </div>
    <div style={styles.info}>
      <div style={styles.infoItem}>
        <strong>Entreprise:</strong>{" "}
        {application.job_offer?.company || "N/A"}
      </div>
      <div style={styles.infoItem}>
        <strong>Lieu:</strong>{" "}
        {application.job_offer?.location || "N/A"}
      </div>
      <div style={styles.infoItem}>
        <strong>Date de candidature:</strong>{" "}
        {new Date(application.application_date).toLocaleDateString()}
      </div>
    </div>

    {/* Show recruiter chat button if applicable */}
    {recruiterStartedMap[application.id] && (
      <button
        onClick={() => openChatModal(application.id)}
        style={styles.button}
      >
        Discuter avec le recruteur
        {notifications[application.id] && (
          <span style={styles.redDot}></span>
        )}
      </button>
    )}

    {/* Show "Vu ✔" if viewed, else show "Pending" */}
    {application.viewed ? (
      <span style={{ marginLeft: "10px", color: "#28a745", fontWeight: "bold", fontSize: "14px" }}>
        Vu ✔
      </span>
    ) : (
      <span style={{ marginLeft: "10px", color: "#ff9800", fontWeight: "bold", fontSize: "14px" }}>
        En attente ⏳
      </span>
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
                style={styles.chatModal}
            >
                <h2 style={styles.modalTitle}>Chat avec le recruteur</h2>
                <button onClick={closeChatModal} style={styles.closeButton}>
                    <span aria-hidden="true">&times;</span>
                </button>
                {selectedApplicationId && candidate?.id && (
                    <ApplicationChat
                        applicationId={selectedApplicationId}
                        userId={candidate.id}
                        userType="candidate"
                    />
                )}
            </Modal>
        </>
    );
};

export default CandidateApplications;