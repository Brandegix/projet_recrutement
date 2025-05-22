import React, { useState, useEffect } from 'react';
import { Users, Target, Award, Star, ArrowRight, CheckCircle, TrendingUp, Shield, Clock } from 'lucide-react';
import Navbar from "./Navbara";
import Footer from "./Footer";
import SEO from "./SEO";

const services = [
  {
    title: 'Recrutement Personnalisé',
    icon: <Target className="w-6 h-6" />,
    features: [
      'Analyse du besoin spécifique de l\'entreprise',
      'Recherche ciblée et présélection rigoureuse',
      'Suivi post-recrutement et garantie de satisfaction'
    ]
  },
  {
    title: 'Gestion des Candidatures',
    icon: <Users className="w-6 h-6" />,
    features: [
      'Plateforme intuitive de suivi des candidatures',
      'Communication centralisée avec les postulants',
      'Filtrage intelligent des profils pertinents'
    ]
  },
  {
    title: 'Chasse de Talents',
    icon: <Award className="w-6 h-6" />,
    features: [
      'Sourcing de profils rares et qualifiés',
      'Approche directe et confidentielle',
      'Évaluation approfondie des compétences et motivations'
    ]
  },
];

const stats = [
  { number: '10K+', label: 'Candidats Placés', icon: <Users className="w-5 h-5" /> },
  { number: '500+', label: 'Entreprises Partenaires', icon: <Shield className="w-5 h-5" /> },
  { number: '95%', label: 'Taux de Satisfaction', icon: <Star className="w-5 h-5" /> },
  { number: '48h', label: 'Délai Moyen', icon: <Clock className="w-5 h-5" /> }
];

const teamMembers = [
  {
    name: 'Marie Dupont',
    role: 'Directrice des Ressources Humaines',
    expertise: 'Expert en stratégie RH'
  },
  {
    name: 'Jean Martin',
    role: 'Responsable Marketing',
    expertise: 'Spécialiste en acquisition de talents'
  },
  {
    name: 'Ahmed Kader',
    role: 'Responsable Technique',
    expertise: 'Innovation technologique RH'
  }
];

const AboutUs = () => {
  return (
    <>
      <Navbar />
       <SEO
        title="About Our Website - Boostez votre avenir"
        description="Trouvez des astuces pour réussir vos entretiens, améliorer votre CV et développer votre carrière."
        keywords="carrière, conseils, entretiens, CV, développement professionnel"
      /> 
      
      <div style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        backgroundColor: '#000000',
        color: '#ffffff',
        lineHeight: '1.6'
      }}>
        
        {/* Hero Section - Simplified */}
        <section style={{
          background: '#000000',
          padding: '80px 0 60px',
          textAlign: 'center'
        }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px' }}>
            <h1 style={{
              fontSize: 'clamp(2.5rem, 6vw, 4rem)',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #ffffff 0%, #ff6b35 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '24px'
            }}>
              À propos de Casajobs
            </h1>
            <p style={{
              fontSize: '1.3rem',
              color: '#cccccc',
              maxWidth: '600px',
              margin: '0 auto 50px',
              fontWeight: '300'
            }}>
              Votre passerelle vers l'excellence professionnelle. Connecter les talents aux opportunités.
            </p>
            
            {/* Simplified Stats */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '20px',
              marginTop: '50px'
            }}>
              {stats.map((stat, index) => (
                <div key={index} style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '25px 15px',
                  borderRadius: '15px',
                  border: '1px solid rgba(255, 165, 0, 0.2)',
                  textAlign: 'center',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 165, 0, 0.1)';
                  e.currentTarget.style.transform = 'translateY(-5px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}>
                  <div style={{ color: '#ff6b35', marginBottom: '8px', display: 'flex', justifyContent: 'center' }}>
                    {stat.icon}
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: '700', color: '#ffffff', marginBottom: '5px' }}>
                    {stat.number}
                  </div>
                  <div style={{ color: '#cccccc', fontSize: '0.9rem' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Section - Simplified */}
        <section style={{
          padding: '80px 0',
          backgroundColor: '#0a0a0a'
        }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px' }}>
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
              <h2 style={{
                fontSize: '2.5rem',
                fontWeight: '600',
                marginBottom: '25px',
                background: 'linear-gradient(135deg, #ffffff 0%, #ff6b35 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Notre Mission
              </h2>
              <p style={{
                fontSize: '1.2rem',
                color: '#cccccc',
                maxWidth: '700px',
                margin: '0 auto',
                lineHeight: '1.7'
              }}>
                Casajobs révolutionne l'industrie du recrutement en créant des connexions authentiques entre les talents d'exception et les entreprises visionnaires. Notre approche combine expertise humaine et technologie de pointe.
              </p>
            </div>
          </div>
        </section>

        {/* Values Section - Simplified */}
        <section style={{ 
          padding: '80px 0', 
          backgroundColor: '#000000' 
        }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px' }}>
            <h2 style={{
              textAlign: 'center',
              fontSize: '2.5rem',
              fontWeight: '600',
              marginBottom: '60px',
              background: 'linear-gradient(135deg, #ffffff 0%, #ff6b35 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Nos Valeurs
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '30px'
            }}>
              {[
                {
                  title: 'Transparence',
                  description: 'Communication claire et honnête, garantissant une relation basée sur la confiance.',
                  icon: <Shield className="w-8 h-8" />
                },
                {
                  title: 'Innovation',
                  description: 'Technologies de pointe pour un recrutement plus rapide et plus efficace.',
                  icon: <TrendingUp className="w-8 h-8" />
                },
                {
                  title: 'Engagement',
                  description: 'Accompagnement personnalisé avec une attention particulière à votre succès.',
                  icon: <CheckCircle className="w-8 h-8" />
                }
              ].map((value, index) => (
                <div key={index} style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '40px 25px',
                  borderRadius: '20px',
                  border: '1px solid rgba(255, 165, 0, 0.2)',
                  textAlign: 'center',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 165, 0, 0.1)';
                  e.currentTarget.style.transform = 'translateY(-8px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}>
                  <div style={{
                    background: '#ff6b35',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px',
                    color: '#ffffff'
                  }}>
                    {value.icon}
                  </div>
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: '600',
                    marginBottom: '15px',
                    color: '#ffffff'
                  }}>
                    {value.title}
                  </h3>
                  <p style={{
                    color: '#cccccc',
                    fontSize: '1rem',
                    lineHeight: '1.6'
                  }}>
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section - Simplified */}
        <section style={{
          padding: '80px 0',
          backgroundColor: '#0a0a0a'
        }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px' }}>
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
              <h2 style={{
                fontSize: '2.5rem',
                fontWeight: '600',
                marginBottom: '25px',
                background: 'linear-gradient(135deg, #ffffff 0%, #ff6b35 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Nos Services
              </h2>
              <p style={{
                fontSize: '1.1rem',
                color: '#cccccc',
                maxWidth: '600px',
                margin: '0 auto'
              }}>
                Solutions sur mesure pour transformer votre stratégie de recrutement
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '30px'
            }}>
              {services.map((service, index) => (
                <div key={index} style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '20px',
                  padding: '30px 25px',
                  border: '1px solid rgba(255, 165, 0, 0.2)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 165, 0, 0.1)';
                  e.currentTarget.style.transform = 'translateY(-5px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}>
                  <div style={{
                    background: '#ff6b35',
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px',
                    color: '#ffffff'
                  }}>
                    {service.icon}
                  </div>
                  
                  <h3 style={{
                    fontSize: '1.4rem',
                    fontWeight: '600',
                    marginBottom: '15px',
                    color: '#ffffff'
                  }}>
                    {service.title}
                  </h3>
                  
                  <ul style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0
                  }}>
                    {service.features.map((feature, idx) => (
                      <li key={idx} style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        marginBottom: '10px',
                        color: '#cccccc',
                        fontSize: '0.95rem'
                      }}>
                        <CheckCircle style={{
                          width: '16px',
                          height: '16px',
                          color: '#ff6b35',
                          marginRight: '10px',
                          marginTop: '2px',
                          flexShrink: 0
                        }} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section - Simplified */}
        <section style={{
          padding: '80px 0',
          backgroundColor: '#000000'
        }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px' }}>
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
              <h2 style={{
                fontSize: '2.5rem',
                fontWeight: '600',
                marginBottom: '25px',
                background: 'linear-gradient(135deg, #ffffff 0%, #ff6b35 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Notre Équipe
              </h2>
              <p style={{
                fontSize: '1.1rem',
                color: '#cccccc',
                maxWidth: '600px',
                margin: '0 auto'
              }}>
                Des professionnels passionnés, dédiés à votre réussite
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '30px'
            }}>
              {teamMembers.map((member, index) => (
                <div key={index} style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '20px',
                  padding: '30px 20px',
                  textAlign: 'center',
                  border: '1px solid rgba(255, 165, 0, 0.2)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 165, 0, 0.1)';
                  e.currentTarget.style.transform = 'translateY(-5px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: '#ff6b35',
                    margin: '0 auto 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    fontWeight: '600',
                    color: '#ffffff'
                  }}>
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <h3 style={{
                    fontSize: '1.3rem',
                    fontWeight: '600',
                    marginBottom: '8px',
                    color: '#ffffff'
                  }}>
                    {member.name}
                  </h3>
                  <p style={{
                    color: '#ff6b35',
                    fontSize: '1rem',
                    marginBottom: '8px',
                    fontWeight: '500'
                  }}>
                    {member.role}
                  </p>
                  <p style={{
                    color: '#cccccc',
                    fontSize: '0.9rem'
                  }}>
                    {member.expertise}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section - Simplified */}
        <section style={{
          padding: '80px 0',
          backgroundColor: '#0a0a0a'
        }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px' }}>
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
              <h2 style={{
                fontSize: '2.5rem',
                fontWeight: '600',
                marginBottom: '25px',
                background: 'linear-gradient(135deg, #ffffff 0%, #ff6b35 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Témoignages
              </h2>
              <p style={{
                fontSize: '1.1rem',
                color: '#cccccc',
                maxWidth: '600px',
                margin: '0 auto'
              }}>
                La confiance de nos partenaires, notre plus belle récompense
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '30px'
            }}>
              {[
                {
                  text: "Casajobs a révolutionné notre processus de recrutement. Leur équipe nous a permis de trouver les talents parfaits rapidement.",
                  author: "Claire Martin",
                  role: "Directrice RH"
                },
                {
                  text: "L'expertise et la réactivité de Casajobs sont incomparables. Ils comprennent nos besoins et livrent des résultats exceptionnels.",
                  author: "John Doe",
                  role: "CEO"
                },
                {
                  text: "Une plateforme intuitive et un service personnalisé qui ont transformé notre approche du recrutement.",
                  author: "Sarah Alami",
                  role: "Responsable Recrutement"
                }
              ].map((testimonial, index) => (
                <div key={index} style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '30px 25px',
                  borderRadius: '20px',
                  border: '1px solid rgba(255, 165, 0, 0.2)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 165, 0, 0.1)';
                  e.currentTarget.style.transform = 'translateY(-5px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}>
                  <div style={{
                    display: 'flex',
                    marginBottom: '15px'
                  }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} style={{ width: '16px', height: '16px', color: '#ff6b35', fill: '#ff6b35' }} />
                    ))}
                  </div>
                  <p style={{
                    fontSize: '1rem',
                    color: '#ffffff',
                    marginBottom: '20px',
                    lineHeight: '1.6',
                    fontStyle: 'italic'
                  }}>
                    "{testimonial.text}"
                  </p>
                  <div>
                    <div style={{ color: '#ffffff', fontWeight: '600', fontSize: '0.95rem' }}>
                      {testimonial.author}
                    </div>
                    <div style={{ color: '#cccccc', fontSize: '0.85rem' }}>
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section - Simplified */}
        <section style={{
          padding: '80px 0',
          backgroundColor: '#000000',
          textAlign: 'center'
        }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px' }}>
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: '600',
              marginBottom: '20px',
              background: 'linear-gradient(135deg, #ffffff 0%, #ff6b35 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Prêt à Commencer ?
            </h2>
            <p style={{
              fontSize: '1.2rem',
              color: '#cccccc',
              marginBottom: '40px',
              maxWidth: '600px',
              margin: '0 auto 40px'
            }}>
              Contactez notre équipe pour découvrir comment nous pouvons transformer votre stratégie de recrutement.
            </p>
            
          
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default AboutUs;