import React, { useState, useEffect, useRef } from 'react';
import { FaArrowRight, FaPaperPlane, FaSpinner } from 'react-icons/fa';
import { io } from 'socket.io-client';

function CandidateApplicationChat({ applicationId, candidateId }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Fetch existing messages
  useEffect(() => {
    setLoading(true);
    fetch(`${process.env.REACT_APP_API_URL}/api/application/${applicationId}/messages`, {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        console.log("📨 Messages loaded:", data);
        setMessages(data);
      })
      .catch(err => {
        console.error("❌ Error loading messages:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [applicationId]);

  // Set up socket connection
  useEffect(() => {
    // Only connect if we have both ids
    if (!applicationId || !candidateId) return;

    socketRef.current = io(process.env.REACT_APP_API_URL, {
      transports: ['websocket'],
      withCredentials: true
    });

    socketRef.current.on('connect', () => {
      console.log(`✅ Chat socket connected (Application ID: ${applicationId})`);
    });

    socketRef.current.on('receive_message', (msg) => {
      // Only add messages for this application
      if (msg.applicationId === applicationId) {
        console.log("📩 New message received:", msg);
        setMessages((prevMsgs) => [...prevMsgs, msg]);
      }
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [applicationId, candidateId]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e) => {
    e?.preventDefault();
    
    if (!text.trim()) return;
    
    setSending(true);
    
    const message = {
      application_id: applicationId,
      user_id: candidateId,
      user_type: 'candidate',
      message: text,
      timestamp: new Date().toISOString()
    };

    fetch(`${process.env.REACT_APP_API_URL}/api/application/${applicationId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(message)
    })
      .then(res => res.json())
      .then(data => {
        console.log("✅ Message sent:", data);
        setText('');
        // Server will emit the message via socket, so no need to add it here
      })
      .catch(err => {
        console.error("❌ Error sending message:", err);
        alert("Impossible d'envoyer votre message. Veuillez réessayer.");
      })
      .finally(() => {
        setSending(false);
      });
  };

  // Styles for chat component
  const styles = {
    chatContainer: {
      display: 'flex',
      flexDirection: 'column',
      height: '500px',
      backgroundColor: '#fafafa',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    },
    messagesContainer: {
      flex: 1,
      overflowY: 'auto',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      backgroundColor: '#fff',
    },
    messageRow: {
      display: 'flex',
      marginBottom: '10px',
    },
    messageRowCandidate: {
      justifyContent: 'flex-end',
    },
    messageRowRecruiter: {
      justifyContent: 'flex-start',
    },
    messageBubble: {
      padding: '12px 16px',
      borderRadius: '18px',
      maxWidth: '80%',
      wordBreak: 'break-word',
    },
    candidateMessage: {
      backgroundColor: '#ff6b35',
      color: 'white',
      borderBottomRightRadius: '4px',
    },
    recruiterMessage: {
      backgroundColor: '#f0f0f0',
      color: '#333',
      borderBottomLeftRadius: '4px',
    },
    messageTime: {
      fontSize: '0.7rem',
      opacity: 0.7,
      marginTop: '4px',
      textAlign: 'right',
    },
    messageForm: {
      display: 'flex',
      padding: '15px',
      borderTop: '1px solid #eee',
      backgroundColor: '#f9f9f9',
    },
    messageInput: {
      flex: 1,
      padding: '12px 15px',
      borderRadius: '24px',
      border: '1px solid #ddd',
      fontSize: '14px',
      outline: 'none',
      backgroundColor: '#fff',
      boxShadow: '0 2px 5px rgba(0,0,0,0.05) inset',
    },
    sendButton: {
      backgroundColor: '#ff6b35',
      border: 'none',
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      marginLeft: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      cursor: 'pointer',
      boxShadow: '0 2px 10px rgba(255,107,53,0.3)',
    },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      color: '#888',
    },
    userInfo: {
      fontSize: '0.75rem',
      marginBottom: '4px',
      fontWeight: 'bold',
    },
    candidateInfo: {
      color: '#ff6b35',
      textAlign: 'right',
    },
    recruiterInfo: {
      color: '#555',
    },
    noMessages: {
      textAlign: 'center',
      padding: '30px',
      color: '#888',
      fontSize: '0.9rem',
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={styles.chatContainer}>
      {loading ? (
        <div style={styles.loadingContainer}>
          <FaSpinner style={{ animation: 'spin 1s linear infinite' }} />
          <span style={{ marginLeft: '10px' }}>Chargement des messages...</span>
        </div>
      ) : (
        <>
          <div style={styles.messagesContainer}>
            {messages.length === 0 ? (
              <div style={styles.noMessages}>
                <p>Aucun message pour le moment.</p>
                <p>Commencez la conversation avec le recruteur!</p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  style={{
                    ...styles.messageRow,
                    ...(msg.user_type === 'candidate' 
                        ? styles.messageRowCandidate 
                        : styles.messageRowRecruiter)
                  }}
                >
                  <div>
                    <div style={{
                      ...styles.userInfo,
                      ...(msg.user_type === 'candidate' 
                          ? styles.candidateInfo 
                          : styles.recruiterInfo)
                    }}>
                      {msg.user_type === 'candidate' ? 'Vous' : 'Recruteur'}
                    </div>
                    <div style={{
                      ...styles.messageBubble,
                      ...(msg.user_type === 'candidate' 
                          ? styles.candidateMessage 
                          : styles.recruiterMessage)
                    }}>
                      {msg.message}
                      <div style={styles.messageTime}>
                        {formatTime(msg.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={sendMessage} style={styles.messageForm}>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Tapez votre message..."
              style={styles.messageInput}
              disabled={sending}
            />
            <button 
              type="submit"
              style={styles.sendButton}
              disabled={sending || !text.trim()}
            >
              {sending ? (
                <FaSpinner style={{ animation: 'spin 1s linear infinite' }} />
              ) : (
                <FaPaperPlane />
              )}
            </button>
          </form>
        </>
      )}
    </div>
  );
}

export default CandidateApplicationChat;
