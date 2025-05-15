import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

function ApplicationChat({ applicationId, userId, userType }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const socketRef = useRef(null);
  const chatEndRef = useRef(null);

  // ✅ Request notification permission when component mounts
  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission().then((permission) => {
        console.log("🔔 Notification permission:", permission);
      });
    }
  }, []);

  useEffect(() => {
    socketRef.current = io("http://localhost:5000", {
      transports: ["websocket"],
      withCredentials: true,
    });

    // ✅ Join the chat room
    socketRef.current.on("connect", () => {
      console.log("Connected to server");

      socketRef.current.emit("join_chat", {
        application_id: applicationId,
      });

      // Request initial messages
      socketRef.current.emit("fetch_messages", {
        application_id: applicationId
      });
    });

    // ✅ Listen for incoming messages
    socketRef.current.on("receive_message", (msg) => {
      const formattedMessage = {
        ...msg,
        isSentByUser: msg.user_id === userId && msg.user_type === userType,
      };
      setMessages((prev) => [...prev, formattedMessage]);

      // ✅ Trigger notification if the message was received (not sent by the user)
      if (!formattedMessage.isSentByUser) {
        showNotification(msg);
      }
    });

    // ✅ Fetch messages from the server
    socketRef.current.on("fetch_messages_response", (messagesData) => {
      const formattedMessages = messagesData.map((msg) => ({
        ...msg,
        isSentByUser: msg.user_id === userId && msg.user_type === userType,
      }));
      setMessages(formattedMessages);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [applicationId, userId, userType]);

  // ✅ Scroll to the bottom when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ✅ Send message function
  const sendMessage = () => {
    if (text.trim() !== "" && socketRef.current) {
      const messageData = {
        message: text,
        applicationId,
        user_id: userId,
        user_type: userType,
      };

      // Emit send_message event to server
      socketRef.current.emit("send_message", messageData);
      console.log("Message sent", messageData);

      setText('');
    }
  };

  // ✅ Function to trigger notifications
  const showNotification = (msg) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("New Message Received!", {
        body: `${msg.user}: ${msg.message}`,
        icon: "/notification-icon.png", // Ensure an icon path exists
      });
    }
  };

  return (
    <div style={styles.chatContainer}>
      <div style={styles.messagesContainer}>
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              ...styles.messageBubble,
              alignSelf: m.isSentByUser ? 'flex-end' : 'flex-start',
              backgroundColor: m.isSentByUser ? '#0084ff' : '#e4e6eb',
              color: m.isSentByUser ? 'white' : 'black',
            }}
          >
            <div style={styles.sender}>{m.user}</div>
            <div>{m.message}</div>
          </div>
        ))}
        <div ref={chatEndRef}></div>
      </div>
      <div style={styles.inputContainer}>
        <input
          style={styles.input}
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={e => {
            if (e.key === 'Enter') sendMessage();
          }}
        />
        <button style={styles.sendButton} onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

const styles = {
  chatContainer: {
    width: '100%',
    maxWidth: '500px',
    height: '500px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid #ccc',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    fontFamily: 'Arial, sans-serif'
  },
  messagesContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: '10px',
    overflowY: 'auto',
    backgroundColor: '#f0f2f5'
  },
  messageBubble: {
    maxWidth: '70%',
    padding: '10px 12px',
    margin: '6px 0',
    borderRadius: '16px',
    wordWrap: 'break-word',
    fontSize: '14px',
  },
  sender: {
    fontSize: '11px',
    marginBottom: '4px',
    opacity: 0.7
  },
  inputContainer: {
    display: 'flex',
    borderTop: '1px solid #ddd',
    padding: '10px',
    backgroundColor: '#fff'
  },
  input: {
    flex: 1,
    padding: '10px',
    borderRadius: '20px',
    border: '1px solid #ccc',
    marginRight: '10px',
    outline: 'none',
    fontSize: '14px'
  },
  sendButton: {
    padding: '8px 16px',
    backgroundColor: '#0084ff',
    color: 'white',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '14px'
  }
};

export default ApplicationChat;
