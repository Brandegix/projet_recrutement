import React, { useEffect, useState } from "react";
import Navbar from "../Navbara";
import Footer from "../Footer";
import SEO from "../SEO";
function RecruiterNewsletterSubscribers() {
  const [subscribers, setSubscribers] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/newsletter/my-subscribers`, {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => setSubscribers(data))
      .catch(err => console.error("Erreur lors du chargement:", err));
  }, []);

  return (
    <div style={{ 
      backgroundColor: "#0a0a0a", 
      minHeight: "100vh", 
      display: "flex", 
      flexDirection: "column" 
    }}>
      <Navbar />

      <SEO
        title="Abonnés"
       /> 
      <div style={{
        flex: "1",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
      }}>
        <div style={{
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          boxShadow: "0 20px 60px rgba(255, 107, 0, 0.1), 0 8px 25px rgba(0, 0, 0, 0.15)",
          maxWidth: "900px",
          width: "100%",
          overflow: "hidden",
          border: "1px solid rgba(255, 107, 0, 0.1)",
        }}>
          {/* Header Section */}
          <div style={{
            background: "linear-gradient(135deg, #ff6b00 0%, #ff8533 100%)",
            padding: "40px",
            position: "relative",
          }}>
            <div style={{
              position: "absolute",
              top: "0",
              right: "0",
              width: "100px",
              height: "100px",
              background: "rgba(255, 255, 255, 0.1)",
              borderRadius: "50%",
              transform: "translate(30px, -30px)",
            }}></div>
            <div style={{
              position: "absolute",
              bottom: "0",
              left: "0",
              width: "60px",
              height: "60px",
              background: "rgba(255, 255, 255, 0.1)",
              borderRadius: "50%",
              transform: "translate(-20px, 20px)",
            }}></div>
            
            <h1 style={{ 
              color: "#ffffff", 
              fontSize: "32px", 
              fontWeight: "700", 
              margin: "0",
              textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              position: "relative",
              zIndex: "1",
            }}>
              Abonnés à la newsletter
            </h1>
            <p style={{
              color: "rgba(255, 255, 255, 0.9)",
              fontSize: "16px",
              margin: "8px 0 0 0",
              position: "relative",
              zIndex: "1",
            }}>
              Gérez vos abonnés et suivez votre audience
            </p>
          </div>

          {/* Content Section */}
          <div style={{ padding: "40px" }}>
            {subscribers.length === 0 ? (
              <div style={{
                textAlign: "center",
                padding: "60px 20px",
              }}>
                <div style={{
                  width: "80px",
                  height: "80px",
                  backgroundColor: "rgba(255, 107, 0, 0.1)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 24px auto",
                }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="#ff6b00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 style={{
                  color: "#333333",
                  fontSize: "20px",
                  fontWeight: "600",
                  margin: "0 0 12px 0",
                }}>
                  Aucun abonné pour le moment
                </h3>
                <p style={{
                  color: "#666666",
                  fontSize: "16px",
                  margin: "0",
                  maxWidth: "400px",
                  margin: "0 auto",
                  lineHeight: "1.5",
                }}>
                  Commencez à promouvoir votre newsletter pour attirer vos premiers abonnés.
                </p>
              </div>
            ) : (
              <>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "32px",
                  padding: "0 8px",
                }}>
                  <div>
                    <h3 style={{
                      color: "#333333",
                      fontSize: "20px",
                      fontWeight: "600",
                      margin: "0 0 4px 0",
                    }}>
                      Liste des abonnés
                    </h3>
                    <p style={{
                      color: "#666666",
                      fontSize: "14px",
                      margin: "0",
                    }}>
                      {subscribers.length} abonné{subscribers.length > 1 ? 's' : ''} au total
                    </p>
                  </div>
                  <div style={{
                    backgroundColor: "#ff6b00",
                    color: "#ffffff",
                    padding: "8px 16px",
                    borderRadius: "20px",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}>
                    {subscribers.length}
                  </div>
                </div>

                <div style={{
                  backgroundColor: "#fafafa",
                  borderRadius: "12px",
                  overflow: "hidden",
                  border: "1px solid #e5e5e5",
                }}>
                  {subscribers.map((s, index) => (
                    <div key={s.id} style={{
                      padding: "20px 24px",
                      borderBottom: index < subscribers.length - 1 ? "1px solid #e5e5e5" : "none",
                      backgroundColor: "#ffffff",
                      margin: "0",
                      transition: "all 0.2s ease",
                      cursor: "default",
                      position: "relative",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "#fff8f4";
                      e.target.style.borderLeft = "4px solid #ff6b00";
                      e.target.style.paddingLeft = "20px";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "#ffffff";
                      e.target.style.borderLeft = "none";
                      e.target.style.paddingLeft = "24px";
                    }}>
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}>
                        <div style={{
                          width: "12px",
                          height: "12px",
                          backgroundColor: "#ff6b00",
                          borderRadius: "50%",
                          flexShrink: "0",
                        }}></div>
                        <span style={{
                          color: "#333333",
                          fontSize: "16px",
                          fontWeight: "500",
                          letterSpacing: "0.01em",
                        }}>
                          {s.email}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default RecruiterNewsletterSubscribers;