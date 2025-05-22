import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Lightbulb } from 'lucide-react';
import Navbar from '../components/Navbara';
import CareerTips from '../components/CareerTips'; 
import Footer from '../components/Footer';

function ConseilDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const tip = CareerTips.find((t) => t.id === parseInt(id));

  if (!tip) {
    return (
      <>
        <Navbar />
        <div style={{
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          backgroundColor: '#000000',
          color: '#ffffff',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 20px'
        }}>
          <div style={{
            textAlign: 'center',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '20px',
            padding: '60px 40px',
            border: '1px solid rgba(255, 165, 0, 0.2)',
            maxWidth: '500px'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'rgba(255, 107, 53, 0.1)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              border: '2px solid rgba(255, 107, 53, 0.3)'
            }}>
              <Lightbulb style={{ width: '40px', height: '40px', color: '#ff6b35' }} />
            </div>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: '#ffffff',
              marginBottom: '16px'
            }}>
              Conseil introuvable
            </h2>
            <p style={{
              color: '#cccccc',
              fontSize: '1.1rem',
              marginBottom: '30px'
            }}>
              Ce conseil n'existe pas ou a été supprimé.
            </p>
            <button
              onClick={() => navigate('/conseils')}
              style={{
                background: '#ff6b35',
                color: '#ffffff',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '25px',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#e55a2b';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#ff6b35';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              Retour aux conseils
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        backgroundColor: '#000000',
        color: '#ffffff',
        lineHeight: '1.6',
        minHeight: '100vh'
      }}>
        
        {/* Header Section */}
        <section style={{
          background: 'linear-gradient(180deg, #0a0a0a 0%, #000000 100%)',
          padding: '100px 0 60px',
          borderBottom: '1px solid rgba(255, 165, 0, 0.2)'
        }}>
          <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 20px' }}>
            
            {/* Back Button */}
            <button 
              onClick={() => navigate(-1)}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#cccccc',
                border: '1px solid rgba(255, 165, 0, 0.2)',
                padding: '12px 20px',
                borderRadius: '25px',
                fontSize: '0.95rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '40px'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255, 107, 53, 0.1)';
                e.target.style.color = '#ffffff';
                e.target.style.borderColor = '#ff6b35';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                e.target.style.color = '#cccccc';
                e.target.style.borderColor = 'rgba(255, 165, 0, 0.2)';
              }}
            >
              <ArrowLeft style={{ width: '18px', height: '18px' }} />
              Retour
            </button>

            {/* Header Content */}
            <div style={{ textAlign: 'center' }}>
              <div style={{
                background: '#ff6b35',
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 30px',
                color: '#ffffff'
              }}>
                {tip.icon}
              </div>
              
              <h1 style={{
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                fontWeight: '700',
                background: 'linear-gradient(135deg, #ffffff 0%, #ff6b35 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '20px',
                lineHeight: '1.2'
              }}>
                {tip.title}
              </h1>
              
              <p style={{
                fontSize: '1.3rem',
                color: '#cccccc',
                maxWidth: '700px',
                margin: '0 auto',
                fontWeight: '300'
              }}>
                {tip.description}
              </p>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section style={{ padding: '80px 0', backgroundColor: '#000000' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 20px' }}>
            
            {tip.subTips.map((sub, idx) => (
              <div key={idx} style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '20px',
                padding: '40px',
                marginBottom: '30px',
                border: '1px solid rgba(255, 165, 0, 0.2)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 165, 0, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(255, 107, 53, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.borderColor = 'rgba(255, 165, 0, 0.2)';
              }}>
                
                {/* Section Header */}
                <h3 style={{
                  fontSize: '1.8rem',
                  fontWeight: '600',
                  color: '#ff6b35',
                  marginBottom: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    background: '#ff6b35',
                    borderRadius: '50%'
                  }}></div>
                  {sub.subtitle}
                </h3>

                {/* Points List */}
                <div style={{
                  display: 'grid',
                  gap: '20px'
                }}>
                  {sub.points.map((point, i) => (
                    <div key={i} style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '15px',
                      padding: '20px',
                      background: 'rgba(0, 0, 0, 0.3)',
                      borderRadius: '15px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 107, 53, 0.05)';
                      e.currentTarget.style.borderColor = 'rgba(255, 107, 53, 0.2)';
                      e.currentTarget.style.transform = 'translateX(5px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(0, 0, 0, 0.3)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}>
                      
                      <div style={{
                        background: 'rgba(255, 107, 53, 0.2)',
                        borderRadius: '50%',
                        padding: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: '2px'
                      }}>
                        <CheckCircle style={{ 
                          width: '18px', 
                          height: '18px', 
                          color: '#ff6b35' 
                        }} />
                      </div>
                      
                      <p style={{
                        color: '#ffffff',
                        fontSize: '1.1rem',
                        lineHeight: '1.7',
                        margin: 0,
                        fontWeight: '400'
                      }}>
                        {point}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Call to Action Section */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.1) 0%, rgba(255, 165, 0, 0.05) 100%)',
              borderRadius: '20px',
              padding: '50px 40px',
              textAlign: 'center',
              border: '1px solid rgba(255, 107, 53, 0.3)',
              marginTop: '50px'
            }}>
              <h3 style={{
                fontSize: '1.8rem',
                fontWeight: '600',
                color: '#ffffff',
                marginBottom: '15px'
              }}>
                Prêt à appliquer ces conseils ?
              </h3>
              <p style={{
                color: '#cccccc',
                fontSize: '1.1rem',
                marginBottom: '30px',
                maxWidth: '600px',
                margin: '0 auto 30px'
              }}>
                Mettez en pratique ces stratégies pour booster votre carrière et atteindre vos objectifs professionnels.
              </p>
              
                
            </div>
          </div>
        </section>
      </div>
      
      <Footer />
    </>
  );
}

export default ConseilDetail;