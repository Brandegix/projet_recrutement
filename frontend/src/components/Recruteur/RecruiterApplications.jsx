import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import '../../assets/css/RecruiterApplications.css';

const RecruiterApplications = () => {
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState(null);

  useEffect(() => {
    // Initialize socket connection
    const socketInstance = io(`${process.env.REACT_APP_API_URL}`);
    setSocket(socketInstance);

    // Listen for incoming messages
    socketInstance.on('receive_message', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    // Fetch applications
    const fetchApplications = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/recruiter/applications`);
        const data = await response.json();
        setApplications(data.applications);
      } catch (err) {
        setError('Erreur lors du chargement des candidatures.');
        console.error(err);
      }
    };
    
    fetchApplications();

    return () => {
      if (socketInstance) socketInstance.disconnect();
    };
  }, []);

  const joinChat = async (applicationId) => {
    const application = applications.find((app) => app.id === applicationId);
    if (application) {
      // Emit the 'join_chat' event with application_id to join the room
      socket.emit('join_chat', { application_id: application.id });

      setRoom(application.id); // Set the room for later use
    }
  };

  const sendMessage = () => {
    if (message.trim()) {
      // Emit 'send_message' to the room
      socket.emit('send_message', { message, room });
      setMessage(""); // Clear message input
    }
  };

  return (
    <div className="applications-container">
      <h2>Candidatures reçues</h2>
      {applications.length === 0 ? (
        <p className="no-applications">Aucune candidature trouvée.</p>
      ) : (
        <div className="applications-grid">
          {applications.map((app) => (
            <div key={app.id} className="application-card">
              <div className="card-header">
                <h3>{app.candidate.name}</h3>
                <span className="application-date">{app.application_date}</span>
              </div>
              <p><strong>Email:</strong> {app.candidate.email}</p>
              <p><strong>Téléphone:</strong> {app.candidate.phoneNumber}</p>
              <div className="job-details">
                <h4>{app.job_offer.title}</h4>
                <p>{app.job_offer.description}</p>
                <p><strong>Société:</strong> {app.job_offer.company}</p>
                <p><strong>Lieu:</strong> {app.job_offer.location}</p>
              </div>
              <button onClick={() => joinChat(app.id)}>Join Chat</button>
            </div>
          ))}
        </div>
      )}

      {room && (
        <div className="chat-room">
          <h3>Chat Room</h3>
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index}>
                <strong>{msg.user}: </strong>{msg.message}
              </div>
            ))}
          </div>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Envoyer un message"
          />
          <button onClick={sendMessage}>Envoyer</button>
        </div>
      )}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default RecruiterApplications;
