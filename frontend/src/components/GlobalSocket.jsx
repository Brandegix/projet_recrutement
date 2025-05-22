import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

const GlobalSocket = ({ userId, userType }) => {
  const socketRef = useRef(null);
  const [notifications, setNotifications] = useState({});

  useEffect(() => {
    socketRef.current = io(`${process.env.REACT_APP_API_URL}`, {
      transports: ["websocket"],
      withCredentials: true,
    });

    // ✅ Listen for incoming messages globally
    socketRef.current.on("receive_message", (msg) => {
      console.log("🔔 New message received:", msg);

      // ✅ Only notify if the message is **not** from the same user
      if (msg.user_id !== userId && msg.user_type !== userType) {
        setNotifications((prev) => ({
          ...prev,
          [msg.applicationId]: true,  // ✅ Store notification per application
        }));
      }
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [userId, userType]);

  return (
    notifications &&
    Object.keys(notifications).length > 0 && (
      <div style={styles.notificationBanner}>
        📩 You have a new message! Click to view.
      </div>
    )
  );
};

const styles = {
  notificationBanner: {
    position: "fixed",
    bottom: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "red",
    color: "white",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    zIndex: 9999,
  },
};

export default GlobalSocket;
