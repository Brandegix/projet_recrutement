import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const SocketListener = () => {
  const socketRef = useRef(null);
  const [newMessage, setNewMessage] = useState(null);

  useEffect(() => {
    socketRef.current = io(`${process.env.REACT_APP_API_URL}`, { transports: ["websocket"], withCredentials: true });

    // ✅ Listen for incoming messages globally
    socketRef.current.on("receive_message", (msg) => {
      console.log("🔔 Global message received:", msg);
      setNewMessage(msg);  // ✅ Store message in state

      // ✅ Show browser notification
      showNotification(msg);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  // ✅ Function to trigger notifications
  const showNotification = (msg) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Nouveau message !", {
        body: `${msg.user}: ${msg.message}`,
        icon: "/notification-icon.png",
      });
    }
  };

  return null;  // ✅ This component runs in the background, no UI needed
};

export default SocketListener;
