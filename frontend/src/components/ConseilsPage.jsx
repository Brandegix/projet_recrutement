import React, { useState } from 'react';
import { ArrowRight, FileText, Users, TrendingUp, BookOpen, Search } from 'lucide-react';
import Navbar from '../components/Navbara';
import Footer from '../components/Footer';
import '../assets/css/ConseilsPage.css';
import { Link } from 'react-router-dom';
import SEO from './SEO';
// Mock CareerTips data - you'll replace this with your actual import
const CareerTips = [
  {
    id: 1,
    title: "Optimiser son CV pour 2024",
    description: "Découvrez les dernières tendances pour créer un CV qui sort du lot et attire l'attention des recruteurs.",
    category: "cv",
    icon: <FileText className="w-6 h-6" />,
    subTips: [
      {
        subtitle: "Structure moderne",
        points: [
          "Utilisez un design épuré et professionnel",
          "Mettez en avant vos compétences clés",
          "Adaptez votre CV à chaque offre"
        ]
      },
      {
        subtitle: "Contenu percutant", 
        points: [
          "Utilisez des mots-clés du secteur",
          "Quantifiez vos réalisations",
          "Soyez concis et précis"
        ]
      }
    ]
  },
  {
    id: 2,
    title: "Réussir son entretien d'embauche",
    description: "Les clés pour faire bonne impression et décrocher le poste de vos rêves.",
    category: "entretien",
    icon: <Users className="w-6 h-6" />,
    subTips: [
      {
        subtitle: "Préparation",
        points: [
          "Recherchez l'entreprise en détail",
          "Préparez vos réponses aux questions classiques",
          "Entraînez-vous à présenter vos expériences"
        ]
      }
    ]
  },
  {
    id: 3,
    title: "Développer sa carrière",
    description: "Stratégies pour évoluer professionnellement et atteindre vos objectifs.",
    category: "carriere",
    icon: <TrendingUp className="w-6 h-6" />,
    subTips: [
      {
        subtitle: "Planification",
        points: [
          "Définissez vos objectifs à court et long terme",
          "Identifiez les compétences à développer",
          "Créez un plan d'action concret"
        ]
      }
    ]
  },
  {
    id: 4,
    title: "Formation continue",
    description: "L'importance de rester à jour dans son domaine et comment s'y prendre.",
    category: "formation",
    icon: <BookOpen className="w-6 h-6" />,
    subTips: [
      {
        subtitle: "Veille technologique",
        points: [
          "Suivez les tendances de votre secteur",
          "Participez à des formations certifiantes",
          "Rejoignez des communautés professionnelles"
        ]
      }
    ]
  }
];

function ConseilsPage() {
  const [activeTab, setActiveTab] = useState("tous");

  // Filtrage des conseils en fonction de la catégorie sélectionnée
  const filteredTips = CareerTips.filter(
    (tip) => activeTab === "tous" || tip.category === activeTab
  );

  const categories = [
    { key: "tous", label: "Tous", icon: <Search className="w-4 h-4" /> },
    { key: "cv", label: "CV & Lettres", icon: <FileText className="w-4 h-4" /> },
    { key: "entretien", label: "Entretiens", icon: <Users className="w-4 h-4" /> },
    { key: "carriere", label: "Carrière", icon: <TrendingUp className="w-4 h-4" /> },
    { key: "formation", label: "Formation", icon: <BookOpen className="w-4 h-4" /> }
  ];

  return (
    <>
    <Navbar />
    <SEO
      title="Conseils Carrière - Boostez votre avenir"
      description="Découvrez nos astuces pratiques pour rédiger un CV efficace, réussir vos entretiens, développer votre réseau professionnel et bien plus."
      keywords="carrière, CV, entretien, réseau professionnel, formation, négociation salariale"
    />
      {/* Navbar would go here */}
      {/* <Navbar /> */}
      
      {/* SEO Component */}
      {/* <SEO
        title="Conseils Carrière - Boostez votre avenir"
        description="Découvrez nos astuces pratiques pour rédiger un CV efficace, réussir vos entretiens, développer votre réseau professionnel et bien plus."
        keywords="carrière, CV, entretien, réseau professionnel, formation, négociation salariale"
      /> */}
      
      <div style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        backgroundColor: '#000000',
        color: '#ffffff',
        lineHeight: '1.6',
        minHeight: '100vh'
      }}>
        
        {/* Header Section */}
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
              Conseils Carrière
            </h1>
            <p style={{
              fontSize: '1.3rem',
              color: '#cccccc',
              maxWidth: '600px',
              margin: '0 auto',
              fontWeight: '300'
            }}>
              Boostez votre carrière avec nos conseils personnalisés et stratégies éprouvées
            </p>
          </div>
        </section>

        {/* Tabs Section */}
        <section style={{
          padding: '40px 0',
          backgroundColor: '#0a0a0a',
          borderBottom: '1px solid rgba(255, 165, 0, 0.2)'
        }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px' }}>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '15px'
            }}>
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  style={{
                    background: activeTab === cat.key ? '#ff6b35' : 'rgba(255, 255, 255, 0.05)',
                    color: activeTab === cat.key ? '#ffffff' : '#cccccc',
                    border: activeTab === cat.key ? 'none' : '1px solid rgba(255, 165, 0, 0.2)',
                    padding: '12px 24px',
                    borderRadius: '25px',
                    fontSize: '0.95rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onClick={() => setActiveTab(cat.key)}
                  onMouseEnter={(e) => {
                    if (activeTab !== cat.key) {
                      e.target.style.background = 'rgba(255, 165, 0, 0.1)';
                      e.target.style.color = '#ffffff';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeTab !== cat.key) {
                      e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                      e.target.style.color = '#cccccc';
                    }
                  }}
                >
                  {cat.icon}
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section style={{ padding: '60px 0', backgroundColor: '#000000' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px' }}>
            {filteredTips.length > 0 ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                gap: '30px'
              }}>
                {filteredTips.map((tip) => (
                  <div key={tip.id} style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '20px',
                    padding: '30px',
                    border: '1px solid rgba(255, 165, 0, 0.2)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 165, 0, 0.1)';
                    e.currentTarget.style.transform = 'translateY(-5px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}>
                    
                    {/* Card Header */}
                    <div style={{ marginBottom: '20px' }}>
                      <div style={{
                        background: '#ff6b35',
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '15px',
                        color: '#ffffff'
                      }}>
                        {tip.icon}
                      </div>
                      <h3 style={{
                        fontSize: '1.4rem',
                        fontWeight: '600',
                        marginBottom: '10px',
                        color: '#ffffff'
                      }}>
                        {tip.title}
                      </h3>
                      <p style={{
                        color: '#cccccc',
                        fontSize: '1rem',
                        lineHeight: '1.6'
                      }}>
                        {tip.description}
                      </p>
                    </div>

                    {/* Card Body */}
                    <div style={{ marginBottom: '25px' }}>
                      {tip.subTips.map((sub, idx) => (
                        <div key={idx} style={{ marginBottom: '15px' }}>
                          <h4 style={{
                            fontSize: '1.1rem',
                            fontWeight: '500',
                            color: '#ff6b35',
                            marginBottom: '8px'
                          }}>
                            {sub.subtitle}
                          </h4>
                          <ul style={{
                            listStyle: 'none',
                            padding: 0,
                            margin: 0
                          }}>
                            {sub.points.slice(0, 2).map((point, pointIdx) => (
                              <li key={pointIdx} style={{
                                color: '#cccccc',
                                fontSize: '0.9rem',
                                marginBottom: '5px',
                                paddingLeft: '15px',
                                position: 'relative'
                              }}>
                                <span style={{
                                  position: 'absolute',
                                  left: '0',
                                  color: '#ff6b35'
                                }}>•</span>
                                {point}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>

                    {/* Card Footer */}
                    <div>
                      {/* Using div instead of Link for demo - replace with Link in actual implementation */}
                      <Link 
  to={`/conseil/${tip.id}`} 
  style={{
    background: 'transparent',
    color: '#ff6b35',
    border: '1px solid #ff6b35',
    padding: '10px 20px',
    borderRadius: '20px',
    fontSize: '0.9rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    textDecoration: 'none'
  }}
  onMouseEnter={(e) => {
    e.target.style.background = '#ff6b35';
    e.target.style.color = '#ffffff';
  }}
  onMouseLeave={(e) => {
    e.target.style.background = 'transparent';
    e.target.style.color = '#ff6b35';
  }}
>
  En savoir plus
  <ArrowRight style={{ width: '16px', height: '16px' }} />
</Link>

                      {/* 
                      Replace above div with this Link in actual implementation:
                      <Link 
                        to={`/conseil/${tip.id}`} 
                        style={{ ... same styles ... }}
                      >
                        En savoir plus
                        <ArrowRight style={{ width: '16px', height: '16px' }} />
                      </Link>
                      */}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Empty State */
              <div style={{
                textAlign: 'center',
                padding: '80px 20px',
                color: '#cccccc'
              }}>
                <div style={{
                  width: '120px',
                  height: '120px',
                  background: 'rgba(255, 165, 0, 0.1)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 30px',
                  border: '2px solid rgba(255, 165, 0, 0.2)'
                }}>
                  <Search style={{ width: '50px', height: '50px', color: '#ff6b35' }} />
                </div>
                <h3 style={{
                  fontSize: '1.8rem',
                  fontWeight: '600',
                  marginBottom: '15px',
                  color: '#ffffff'
                }}>
                  Oops ! Aucun conseil pour cette catégorie
                </h3>
                <p style={{
                  fontSize: '1.1rem',
                  color: '#cccccc',
                  maxWidth: '400px',
                  margin: '0 auto'
                }}>
                  Nous travaillons à enrichir cette section. Revenez bientôt !
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
      
      {/* Footer would go here */}
      {/* <Footer /> */}
      <Footer/>

</>
  );
}

export default ConseilsPage;