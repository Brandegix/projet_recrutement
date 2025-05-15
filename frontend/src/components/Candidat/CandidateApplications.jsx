import React, { useEffect, useState, useRef } from "react";
import Navbar from "../Navbara";
import Footer from "../Footer";
import { io } from "socket.io-client";
import ApplicationChat from '../Recruteur/ApplicationChat';

const CandidateApplications = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const socketRef = useRef(null);
  const [recruiterStartedMap, setRecruiterStartedMap] = useState({});

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
      .catch((err) => console.error("❌ Error fetching candidate profile:", err))
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

        data.forEach(application => {
          fetch(`${process.env.REACT_APP_API_URL}/api/application/${application.id}/recruiter-started`, {
            method: "GET",
            credentials: "include",
          })
            .then(res => res.json())
            .then(startedData => {
              setRecruiterStartedMap(prev => ({
                ...prev,
                [application.id]: startedData.recruiter_started,
              }));
            })
            .catch(err => console.error(`❌ Error checking recruiter status for ${application.id}:`, err));
        });
      })
      .catch((err) => console.error("❌ Error loading applications:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedApplicationId || !candidate?.id) return;

    socketRef.current = io("http://localhost:5000", {
      transports: ["websocket"],
      withCredentials: true,
    });

    socketRef.current.on("connect", () => {
      console.log(`✅ WebSocket connected! (Candidate ID: ${candidate.id})`);
      socketRef.current.emit("join_chat", {
        application_id: selectedApplicationId,
        user_id: candidate.id,
        user_type: "candidate",
      });
    });

    socketRef.current.on("receive_message", (msg) => {
      if (msg.applicationId === selectedApplicationId) {
        console.log("📩 Message received:", msg);
        setApplications((prev) =>
          prev.map(app =>
            app.id === selectedApplicationId
              ? { ...app, messages: [...(app.messages || []), msg] }
              : app
          )
        );
      }
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [selectedApplicationId, candidate]);

  // ✨ INLINE STYLES
  const styles = {
    wrapper: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "2rem",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      backgroundColor: "#f9fafb",
      minHeight: "80vh",
    },
    title: {
      fontSize: "2rem",
      fontWeight: "600",
      textAlign: "center",
      marginBottom: "2rem",
      color: "#1f2937",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: "1.5rem",
    },
    card: {
      backgroundColor: "#ffffff",
      borderRadius: "1rem",
      boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
      padding: "1.5rem",
      transition: "transform 0.2s ease",
    },
    header: {
      fontSize: "1.25rem",
      fontWeight: "600",
      color: "#111827",
      marginBottom: "1rem",
    },
    info: {
      fontSize: "0.95rem",
      color: "#4b5563",
      lineHeight: "1.6",
      marginBottom: "1rem",
    },
    button: {
      backgroundColor: "#2563eb",
      color: "#ffffff",
      border: "none",
      padding: "0.6rem 1rem",
      borderRadius: "0.5rem",
      fontWeight: "500",
      cursor: "pointer",
      marginTop: "1rem",
    },
    emptyState: {
      textAlign: "center",
      padding: "4rem",
      color: "#6b7280",
      fontSize: "1.1rem",
    },
    chatSection: {
      marginTop: "1rem",
      borderTop: "1px solid #e5e7eb",
      paddingTop: "1rem",
    },
  };

  return (
    <>
      <Navbar />
      <div style={styles.wrapper}>
        <h2 style={styles.title}>Mes Candidatures</h2>

        {loading ? (
          <div style={styles.emptyState}>
            <p>Loading applications...</p>
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
                  <p><strong>Entreprise:</strong> {application.job_offer?.company || "N/A"}</p>
                  <p><strong>Lieu:</strong> {application.job_offer?.location || "N/A"}</p>
                  <p><strong>Date de candidature:</strong> {new Date(application.application_date).toLocaleDateString()}</p>
                </div>
                {recruiterStartedMap[application.id] && (
                  <button
                    onClick={() => setSelectedApplicationId(application.id)}
                    style={styles.button}
                  >
                    {selectedApplicationId === application.id ? "Fermer le chat" : "Discuter avec le recruteur"}
                  </button>
                )}
                {selectedApplicationId === application.id && candidate?.id && (
                  <div style={styles.chatSection}>
                    <ApplicationChat
                      applicationId={selectedApplicationId}
                      userId={candidate.id}
                      userType="candidate"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default CandidateApplications;
