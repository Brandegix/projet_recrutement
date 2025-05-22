import React, { useState } from 'react';
import { FaPlus, FaMinus, FaQuestionCircle } from 'react-icons/fa';

const faqData = [
  {
    question: 'Comment postuler à une offre d\'emploi sur Casajob?',
    answer: 'Pour postuler, créez un compte sur notre site, puis recherchez les offres qui vous intéressent et cliquez sur "Postuler".',
  },
  {
    question: 'Quels types de contrats sont proposés sur Casajob?',
    answer: 'Casajob offre des contrats CDI, CDD, freelance et stage, selon les besoins des recruteurs.',
  },
  {
    question: 'Comment suivre ma candidature après avoir postulé?',
    answer: 'Vous pouvez suivre l\'état de votre candidature dans la section "Mes Candidatures" de votre tableau de bord.',
  },
  {
    question: 'Puis-je ajouter plusieurs CV à mon profil?',
    answer: 'Oui, vous pouvez télécharger plusieurs CV dans votre profil, vous permettant de postuler facilement à différentes offres.',
  },
  {
    question: 'Comment créer un compte recruteur?',
    answer: 'Pour créer un compte recruteur, cliquez sur "S\'inscrire" et sélectionnez "Recruteur". Vous pourrez ensuite publier des offres d\'emploi et gérer vos candidatures.',
  },
];

const FaqSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <section style={{
      background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)',
      padding: '80px 20px',
      minHeight: 'auto'
    }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto'
      }}>
        {/* Section Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '60px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '15px',
            marginBottom: '20px'
          }}>
            <FaQuestionCircle style={{
              color: '#ff6b35',
              fontSize: '2.5rem'
            }} />
            <h2 style={{
              color: '#ffffff',
              fontSize: '2.5rem',
              fontWeight: '700',
              margin: '0',
              background: 'linear-gradient(135deg, #ffffff 0%, #cccccc 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              FAQ
            </h2>
          </div>
          <p style={{
            color: '#aaaaaa',
            fontSize: '1.2rem',
            lineHeight: '1.6',
            maxWidth: '700px',
            margin: '0 auto'
          }}>
            Consultez notre FAQ pour en savoir plus sur l'utilisation de Casajob.
          </p>
          
          {/* Decorative line */}
          <div style={{
            width: '100px',
            height: '3px',
            background: 'linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)',
            margin: '30px auto 0',
            borderRadius: '2px'
          }} />
        </div>

        {/* FAQ Accordion */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          {faqData.map((item, index) => (
            <div
              key={index}
              style={{
                background: 'linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%)',
                border: `1px solid ${activeIndex === index ? '#ff6b35' : '#333'}`,
                borderRadius: '20px',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                position: 'relative'
              }}
            >
              {/* Gradient accent line for active item */}
              {activeIndex === index && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: 'linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)'
                }} />
              )}
              
              {/* Question Header */}
              <div
                onClick={() => toggleAccordion(index)}
                style={{
                  padding: '25px 30px',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.3s ease',
                  background: activeIndex === index 
                    ? 'rgba(255, 107, 53, 0.05)' 
                    : 'transparent'
                }}
                onMouseEnter={(e) => {
                  if (activeIndex !== index) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeIndex !== index) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <h4 style={{
                  color: activeIndex === index ? '#ff6b35' : '#ffffff',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  margin: '0',
                  transition: 'color 0.3s ease',
                  lineHeight: '1.4'
                }}>
                  {item.question}
                </h4>
                
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: activeIndex === index 
                    ? 'linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)'
                    : 'rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                  border: activeIndex === index 
                    ? 'none' 
                    : '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                  {activeIndex === index ? (
                    <FaMinus style={{
                      color: '#ffffff',
                      fontSize: '1rem'
                    }} />
                  ) : (
                    <FaPlus style={{
                      color: '#cccccc',
                      fontSize: '1rem'
                    }} />
                  )}
                </div>
              </div>
              
              {/* Answer Content */}
              <div style={{
                maxHeight: activeIndex === index ? '200px' : '0',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                background: 'rgba(0, 0, 0, 0.2)'
              }}>
                <div style={{
                  padding: '0 30px 25px 30px'
                }}>
                  <div style={{
                    width: '100%',
                    height: '1px',
                    background: 'rgba(255, 107, 53, 0.2)',
                    marginBottom: '20px'
                  }} />
                  <p style={{
                    color: '#cccccc',
                    fontSize: '1rem',
                    lineHeight: '1.6',
                    margin: '0'
                  }}>
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{
          textAlign: 'center',
          marginTop: '60px',
          padding: '40px',
          background: 'linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%)',
          borderRadius: '20px',
          border: '1px solid #333'
        }}>
          <h3 style={{
            color: '#ffffff',
            fontSize: '1.5rem',
            fontWeight: '600',
            marginBottom: '15px'
          }}>
            Vous ne trouvez pas ce que vous cherchez?
          </h3>
          <p style={{
            color: '#aaaaaa',
            fontSize: '1rem',
            marginBottom: '25px'
          }}>
            Notre équipe support est là pour vous aider
          </p>
         
        </div>
      </div>
    </section>
  );
};

export default FaqSection;