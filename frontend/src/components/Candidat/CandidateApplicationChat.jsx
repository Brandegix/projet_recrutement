import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

function CandidateApplicationChat({ applicationId, candidateId }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const socketRef = useRef(null);

  useEffect(() => {
    // ✅ Connect to WebSocket when the component mounts
    socketRef.current = io("http://localhost:5000", {
      transports: ["websocket"],
      withCredentials: true,
    });

    socketRef.current.on("connect", () => {
      console.log(`✅ Candidate WebSocket connected! (Candidate ID: ${candidateId})`);
      socketRef.current.emit("join_chat", {
        application_id: applicationId,
        user_id: candidateId,
        user_type: "candidate",
      });
    });

    // ✅ Listen for messages and differentiate sent vs. received
    socketRef.current.on("receive_message", (msg) => {
      console.log("📩 Message received:", msg);

      // ✅ Properly flag messages based on sender
      const formattedMessage = {
        ...msg,
        isSentByUser: msg.user_id === candidateId, // ✅ Sent by candidate? True or False
      };

      setMessages((prev) => [...prev, formattedMessage]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [applicationId, candidateId]);

  const sendMessage = () => {
    if (text.trim() !== "" && socketRef.current) {
      const messageData = {
        message: text,
        applicationId,
        user_id: candidateId,
        user_type: "candidate",
      };

      socketRef.current.emit("send_message", messageData);

      // ✅ Immediately add sent message for better UI response
      setMessages((prev) => [...prev, { ...messageData, isSentByUser: true }]);
      setText('');
    }
  };

  return (
    <div>
      <div>
        {messages.map((m, i) => (
          <div key={i} style={{
            maxWidth: "75%",
            padding: "12px",
            borderRadius: "20px",
            border: "1px solid #ddd",
            alignSelf: m.isSentByUser ? "flex-end" : "flex-start", // ✅ Sent messages align right
            backgroundColor: m.isSentByUser ? "#007aff" : "#e5e5ea", // ✅ Sent messages blue, received grey
            color: m.isSentByUser ? "#ffffff" : "#000000",
          }}>
            <strong>{m.isSentByUser ? "Vous (Sent)" : "Recruteur (Received)"}</strong>
            <p>{m.message}</p>
          </div>
        ))}
      </div>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default CandidateApplicationChat;
