import React, { useEffect, useState, useRef } from "react";
import Navbar from "../Navbara";
import Footer from "../Footer";
import { io } from "socket.io-client";
import ApplicationChat from "../Recruteur/ApplicationChat";
import GlobalSocket from "../GlobalSocket";  // ✅ Import global socket listener
const CandidateApplications = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recruiterStartedMap, setRecruiterStartedMap] = useState({});
  const [notifications, setNotifications] = useState({});
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

    socketRef.current = io("http://localhost:5000", {
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

      // 🔔 Trigger notification only if chat is not open
      if (msg.applicationId !== selectedApplicationId) {
        setNotifications((prev) => ({
          ...prev,
          [msg.applicationId]: true,
        }));
      }
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [candidate, selectedApplicationId]);

  const handleChatToggle = (applicationId) => {
    if (selectedApplicationId === applicationId) {
      setSelectedApplicationId(null); // Close chat
    } else {
      setSelectedApplicationId(applicationId); // Open chat
      setNotifications((prev) => ({
        ...prev,
        [applicationId]: false, // clear notification
      }));
    }
  };

  const styles = {
    wrapper: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "2rem",
      fontFamily: "'Inter', sans-serif",
      backgroundColor: "#f8f9fa",
      minHeight: "80vh",
    },
    title: {
      fontSize: "2.5rem",
      fontWeight: "700",
      textAlign: "center",
      marginBottom: "2rem",
      color: "#1f2937",
      letterSpacing: "-0.5px",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
      gap: "1.8rem",
    },
    card: {
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      boxShadow: "0 6px 14px rgba(0,0,0,0.12)",
      padding: "1.8rem",
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
      cursor: "pointer",
      ":hover": {
        transform: "translateY(-4px)",
        boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
      },
    },
    header: {
      fontSize: "1.4rem",
      fontWeight: "700",
      color: "#111827",
      marginBottom: "1rem",
    },
    info: {
      fontSize: "1rem",
      color: "#4b5563",
      lineHeight: "1.8",
      marginBottom: "1rem",
    },
    button: {
      backgroundColor: "#2563eb",
      color: "#ffffff",
      border: "none",
      padding: "12px 16px",
      borderRadius: "8px",
      fontSize: "1rem",
      fontWeight: "600",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "0.3s ease",
      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
      ":hover": {
        backgroundColor: "#1d4ed8",
      },
    },
    redDot: {
      position: "absolute",
      top: "-6px",
      right: "-6px",
      height: "12px",
      width: "12px",
      backgroundColor: "#ff4757",
      borderRadius: "50%",
    },
    emptyState: {
      textAlign: "center",
      padding: "5rem",
      color: "#6b7280",
      fontSize: "1.2rem",
      fontWeight: "500",
    },
    chatSection: {
      marginTop: "1.5rem",
      borderTop: "2px solid #e5e7eb",
      paddingTop: "1.2rem",
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
                  <p>
                    <strong>Entreprise:</strong>{" "}
                    {application.job_offer?.company || "N/A"}
                  </p>
                  <p>
                    <strong>Lieu:</strong>{" "}
                    {application.job_offer?.location || "N/A"}
                  </p>
                  <p>
                    <strong>Date de candidature:</strong>{" "}
                    {new Date(
                      application.application_date
                    ).toLocaleDateString()}
                  </p>
                </div>
                {recruiterStartedMap[application.id] && (
                  <button
                    onClick={() => handleChatToggle(application.id)}
                    style={styles.button}
                  >
                    {selectedApplicationId === application.id
                      ? "Fermer le chat"
                      : "Discuter avec le recruteur"}
                    {notifications[application.id] && (
                      <span style={styles.redDot}></span>
                    )}
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
