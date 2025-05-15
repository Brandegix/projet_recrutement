import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

function Chat({ selectedApplicationId }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const socketRef = useRef(null);

  useEffect(() => {
    if (!selectedApplicationId) {
      console.warn("Skipping WebSocket connection: No application selected.");
      return; // Prevent running when application ID is null
    }
  
    // Initialize WebSocket only if it doesn't exist
    if (!socketRef.current) {
      socketRef.current = io("http://localhost:5000", { transports: ["websocket"] });
  
      socketRef.current.on("connect", () => {
        console.log("✅ Connected to WebSocket server");
        socketRef.current.emit("join_chat", { application_id: selectedApplicationId });
      });
  
      socketRef.current.on("receive_message", (msg) => {
        if (msg.applicationId === selectedApplicationId) {
          setMessages((prev) => [...prev, msg]);
        }
      });
    }
  
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null; // Reset reference
      }
    };
  }, [selectedApplicationId]);
  

    socketRef.current.on("connect", () => {
      console.log("Connected to server");
    });

 
  const sendMessage = () => {
    if (text.trim() !== "") {
      const messageData = {
        user: "User",
        message: text,
        applicationId: selectedApplicationId,  // Include the applicationId
      };
      console.log("Emitting send_message:", messageData);
      socketRef.current.emit('send_message', messageData);
      setText('');
    }
  };

  return (
    <div>
      <div>
        {messages.map((m, i) => (
          <div key={i}><strong>{m.user}:</strong> {m.message}</div>
        ))}
      </div>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default Chat;
