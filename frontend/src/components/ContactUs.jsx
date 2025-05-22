import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Clock, MessageSquare, User, Building } from 'lucide-react';
import Navbar from "./Navbara";
import Footer from "./Footer";
import SEO from "./SEO";

const contactMethods = [
  {
    title: 'Support Email',
    icon: <Mail className="w-8 h-8" />,
    details: ['support@casajobs.ma', 'Réponse sous 24h'],
    action: 'Envoyer un email',
    color: '#ff6b35'
  },
  {
    title: 'Téléphone',
    icon: <Phone className="w-8 h-8" />,
    details: ['+212 5 22 22 22 22', 'Lun-Ven: 9h-18h'],
    action: 'Appeler maintenant',
    color: '#ff6b35'
  },
  {
    title: 'Visitez-nous',
    icon: <MapPin className="w-8 h-8" />,
    details: ['12 Avenue Hassan II', 'Casablanca, Maroc'],
    action: 'Voir sur la carte',
    color: '#ff6b35'
  }
];

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
  };

  return (
    <>
      <Navbar />
      <SEO
        title="Contact Us - Boostez votre avenir"
        description="Trouvez des astuces pour réussir vos entretiens, améliorer votre CV et développer votre carrière."
        keywords="conseils carrière, réussir entretien, CV efficace, développement professionnel, formation, emploi, réseau professionnel"
      />
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)',
      color: '#ffffff',
      lineHeight: '1.6',
      minHeight: '100vh'
    }}>

      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)',
        padding: '120px 20px 80px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background decoration */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)'
        }} />
        
        <div style={{ 
          maxWidth: '800px', 
          margin: '0 auto',
          position: 'relative',
          zIndex: 2
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '15px',
            marginBottom: '20px'
          }}>
            <MessageSquare style={{
              color: '#ff6b35',
              fontSize: '2.5rem',
              width: '48px',
              height: '48px'
            }} />
            <h1 style={{
              fontSize: 'clamp(2.5rem, 6vw, 4rem)',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #ffffff 0%, #ff6b35 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: '0'
            }}>
              Contactez Casajobs
            </h1>
          </div>
          
          <p style={{
            fontSize: '1.3rem',
            color: '#aaaaaa',
            maxWidth: '600px',
            margin: '0 auto 30px',
            fontWeight: '300',
            lineHeight: '1.6'
          }}>
            Nous sommes là pour répondre à toutes vos questions sur nos services de recrutement.
          </p>
          
          {/* Decorative line */}
          <div style={{
            width: '100px',
            height: '3px',
            background: 'linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)',
            margin: '0 auto',
            borderRadius: '2px'
          }} />
        </div>
      </section>

      {/* Contact Methods Section */}
      <section style={{
        padding: '80px 20px',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%)'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: '600',
              marginBottom: '15px',
              background: 'linear-gradient(135deg, #ffffff 0%, #ff6b35 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Nos canaux de communication
            </h2>
            <p style={{
              fontSize: '1.1rem',
              color: '#aaaaaa',
              maxWidth: '600px',
              margin: '0 auto 20px'
            }}>
              Choisissez le moyen de contact qui vous convient le mieux
            </p>
            <div style={{
              width: '80px',
              height: '3px',
              background: 'linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)',
              margin: '0 auto',
              borderRadius: '2px'
            }} />
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '30px'
          }}>
            {contactMethods.map((method, index) => (
              <div key={index} style={{
                background: 'linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%)',
                border: '1px solid #333',
                borderRadius: '20px',
                padding: '40px 30px',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(255, 107, 53, 0.1)';
                e.currentTarget.style.borderColor = '#ff6b35';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = '#333';
              }}>
                
                {/* Top accent line */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: 'linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)'
                }} />
                
                <div style={{
                  background: 'linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)',
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 25px',
                  color: '#ffffff'
                }}>
                  {method.icon}
                </div>
                
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  marginBottom: '20px',
                  color: '#ffffff'
                }}>
                  {method.title}
                </h3>
                
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: '0 0 25px 0'
                }}>
                  {method.details.map((detail, idx) => (
                    <li key={idx} style={{
                      color: '#aaaaaa',
                      fontSize: '1rem',
                      marginBottom: '8px',
                      lineHeight: '1.5'
                    }}>
                      {detail}
                    </li>
                  ))}
                </ul>
                
                <button style={{
                  background: 'linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '12px 25px',
                  borderRadius: '25px',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  width: '100%',
                  height: '60px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 10px 20px rgba(255, 107, 53, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}>
                  {method.action}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

   

      {/* Additional Info Section */}
      <section style={{
        padding: '80px 20px',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%)'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%)',
              border: '1px solid #333',
              borderRadius: '20px',
              padding: '30px',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: 'linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)'
              }} />
              
              <Clock style={{
                color: '#ff6b35',
                width: '48px',
                height: '48px',
                marginBottom: '20px'
              }} />
              <h3 style={{
                color: '#ffffff',
                fontSize: '1.3rem',
                fontWeight: '600',
                marginBottom: '15px'
              }}>
                Horaires d'ouverture
              </h3>
              <p style={{
                color: '#aaaaaa',
                lineHeight: '1.6'
              }}>
                Lundi - Vendredi: 9h00 - 18h00<br />
                Samedi: 9h00 - 13h00<br />
                Dimanche: Fermé
              </p>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%)',
              border: '1px solid #333',
              borderRadius: '20px',
              padding: '30px',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: 'linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)'
              }} />
              
              <Building style={{
                color: '#ff6b35',
                width: '48px',
                height: '48px',
                marginBottom: '20px'
              }} />
              <h3 style={{
                color: '#ffffff',
                fontSize: '1.3rem',
                fontWeight: '600',
                marginBottom: '15px'
              }}>
                Nos bureaux
              </h3>
              <p style={{
                color: '#aaaaaa',
                lineHeight: '1.6'
              }}>
                12 Avenue Hassan II<br />
                Casablanca 20000<br />
                Maroc
              </p>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%)',
              border: '1px solid #333',
              borderRadius: '20px',
              padding: '30px',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: 'linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)'
              }} />
              
              <MessageSquare style={{
                color: '#ff6b35',
                width: '48px',
                height: '48px',
                marginBottom: '20px'
              }} />
              <h3 style={{
                color: '#ffffff',
                fontSize: '1.3rem',
                fontWeight: '600',
                marginBottom: '15px'
              }}>
                Temps de réponse
              </h3>
              <p style={{
                color: '#aaaaaa',
                lineHeight: '1.6'
              }}>
                Email: Sous 24h<br />
                Téléphone: Immédiat<br />
                Formulaire: Sous 2h
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
    <Footer />
    </>
  );
};

export default ContactUs;