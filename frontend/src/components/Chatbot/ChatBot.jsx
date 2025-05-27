import React, { useState, useRef, useEffect } from 'react';

function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Bonjour! Comment puis-je vous aider 👋', isGreeting: true },
    { sender: 'bot', text: 'Vous pouvez me poser des questions sur:' },
    { sender: 'bot', text: '• Comment postuler à une offre d\'emploi' },
    { sender: 'bot', text: '• Les types de contrats disponibles' },
    { sender: 'bot', text: '• Suivre vos candidatures' },
    { sender: 'bot', text: '• Gestion de vos CV' },
    { sender: 'bot', text: '• Création d\'un compte recruteur' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Improved keyword mapping system

// Define topics with their related keywords
const topics = {
  postuler: {
    keywords: ["postuler", "candidature", "offre d'emploi", "emploi", "comment postuler", "application", "job"],
    response: "Pour postuler, créez un compte sur notre site, puis recherchez les offres qui vous intéressent et cliquez sur \"Postuler\"."
  },
  contrats: {
    keywords: ["contrat", "cdi", "cdd", "freelance", "stage", "types de contrat", "contrats disponibles"],
    response: "Casajob offre des contrats CDI, CDD, freelance et stage, selon les besoins des recruteurs."
  },
  suivi: {
    keywords: ["suivre", "suivi", "état", "candidature", "tableau de bord", "statut", "mes candidatures"],
    response: "Vous pouvez suivre l'état de votre candidature dans la section \"Mes Candidatures\" de votre tableau de bord."
  },
  cv: {
    keywords: ["cv", "curriculum", "profil", "télécharger", "ajouter", "plusieurs cv", "gestion"],
    response: "Oui, vous pouvez télécharger plusieurs CV dans votre profil, vous permettant de postuler facilement à différentes offres."
  },
  recruteur: {
    keywords: ["recruteur", "entreprise", "publier", "compte recruteur", "création", "s'inscrire", "inscription"],
    response: "Pour créer un compte recruteur, cliquez sur \"S'inscrire\" et sélectionnez \"Recruteur\". Vous pourrez ensuite publier des offres d'emploi et gérer vos candidatures."
  }
};

  // Improved matching function with scoring
  const findMatchingResponse = (input) => {
    const normalizedInput = input.toLowerCase().trim();
    
    // For numeric input 1-5, map directly to topics
    if (normalizedInput === "1") return topics.postuler.response;
    if (normalizedInput === "2") return topics.contrats.response;
    if (normalizedInput === "3") return topics.suivi.response;
    if (normalizedInput === "4") return topics.cv.response;
    if (normalizedInput === "5") return topics.recruteur.response;
    
    // Score-based matching
    let bestMatch = null;
    let highestScore = 0;
    
    // Check each topic
    Object.entries(topics).forEach(([topicName, topicData]) => {
      let topicScore = 0;
      
      // Check each keyword in this topic
      topicData.keywords.forEach(keyword => {
        if (normalizedInput.includes(keyword)) {
          // Award points based on keyword length (longer = more specific = more points)
          const points = Math.max(1, keyword.length / 3);
          topicScore += points;
          
          // Bonus for exact match
          if (normalizedInput === keyword) {
            topicScore += 5;
          }
          
          // Bonus for keyword at the beginning
          if (normalizedInput.startsWith(keyword)) {
            topicScore += 2;
          }
        }
      });
      
      // If this topic scores higher than previous best, make it the new best match
      if (topicScore > highestScore) {
        highestScore = topicScore;
        bestMatch = topicData.response;
      }
    });
    
    // Return the best match if found, or a support message if nothing matched
    return bestMatch || <span>Pour une assistance plus approfondie, veuillez contacter notre support à <a 
    href="mailto:support@casajobs.ma" 
    style={{
      fontWeight: 'bold',
      color: '#E67E22',
      textDecoration: 'underline'
    }}
  >
    support@casajobs.ma
  </a></span>;
  };

  const handleSend = () => {
    if (!input.trim()) return;
    
    // Add user message
    setMessages([...messages, { sender: 'user', text: input }]);
    
    // Find response using keywords
    setTimeout(() => {
      const botResponse = findMatchingResponse(input);
      setMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);
    }, 500);
    
    setInput('');
  };

  // Toggle chat visibility
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // Styles as objects
  const styles = {
    chatButton: {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        backgroundColor: '#E67E22',
        color: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        zIndex: 9999, 
        border: 'none',
        fontSize: '24px'
      },
      chatContainer: {
        width: '350px',
        borderRadius: '10px 10px 0 0', 
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        position: 'fixed',
        bottom: '0', 
        right: '20px',
        backgroundColor: 'white',
        zIndex: 9999,
        display: isOpen ? 'block' : 'none',
        maxHeight: '80vh' 
      },
    chatHeader: {
      backgroundColor: '#E67E22',
      color: 'white',
      padding: '10px 15px',
      display: 'flex',
      position: 'relative',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    messagesContainer: {
      height: '300px',
      overflowY: 'auto',
      padding: '10px'
    },
    messageBase: {
      margin: '5px 0',
      padding: '8px 12px',
      borderRadius: '18px',
      maxWidth: '70%',
      wordBreak: 'break-word'
    },
    messageUser: {
      backgroundColor: '#E67E22',
      color: 'white',
      marginLeft: 'auto'
    },
    messageBot: {
      backgroundColor: '#f1f1f1',
      marginRight: 'auto'
    },
    messageGreeting: {
      backgroundColor: '#f1f1f1',
      margin: '10px auto', 
      padding: '12px 20px',
      borderRadius: '18px',
      maxWidth: '90%',
      wordBreak: 'break-word',
      fontWeight: 'bold',
      fontFamily: 'Arial, sans-serif', 
      fontSize: '16px',
      textAlign: 'center' 
    },
    chatInput: {
      display: 'flex',
      padding: '10px',
      borderTop: '1px solid #eee'
    },
    input: {
      flex: 1,
      padding: '8px',
      border: '1px solid #ddd',
      borderRadius: '20px',
      marginRight: '10px'
    },
    button: {
      backgroundColor: '#E67E22',
      color: 'white',
      border: 'none',
      padding: '8px 15px',
      borderRadius: '20px',
      cursor: 'pointer'
    },
    closeButton: {
      background: 'none',
      border: 'none',
      color: 'white',
      fontSize: '18px',
      cursor: 'pointer',
      position: 'absolute',
      left: '250px', 
      top: '50%',
      transform: 'translateY(-50%)',
      padding: '5px'
    }
  };

  return (
    <>
      {!isOpen && (
        <button 
          onClick={toggleChat} 
          style={styles.chatButton}
          aria-label="Open chat"
        >
          💬
        </button>
      )}
      
      <div style={styles.chatContainer}>
        <div style={styles.chatHeader}>
          <h3 style={{ margin: 0, color: '#1D1616'}}>Assistant CasaJobs</h3>
          <button 
            onClick={toggleChat} 
            style={
              styles.closeButton
            }
            aria-label="Close chat"
          >
            ✕ 
          </button>
        </div>
        
        <div style={styles.messagesContainer}>
          {messages.map((message, index) => (
            <div 
              key={index} 
              style={
                message.isGreeting
                  ? styles.messageGreeting
                  : {
                      ...styles.messageBase,
                      ...(message.sender === 'user' ? styles.messageUser : styles.messageBot)
                    }
              }
            >
              {message.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        <div style={styles.chatInput}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Tapez votre question..."
            style={styles.input}
          />
          <button onClick={handleSend} style={styles.button}>
            Envoyer
          </button>
        </div>
      </div>
    </>
  );
}

export default ChatBot;