import React from 'react';
import { Eye, User, Star } from 'lucide-react';
import candidatImage from '../assets/images/userIcon.jpg';
import { useNavigate } from 'react-router-dom';
function CVsExamples() {
  const navigate = useNavigate();

  const handleViewCV = () => {
    // navigate('/choixRole'); - Your navigation logic here
    navigate('/choixRole');   };

  const exampleCVs = [
    {
      name: 'Sara B.',
      title: 'Développeuse Web',
      summary: 'Passionnée par la création de sites web modernes et d\'applications interactives. Expertise en React, Node.js et design UX/UI.',
      image: candidatImage
    },
    {
      name: 'Yassine M.',
      title: 'Ingénieur DevOps',
      summary: 'Expérience dans le déploiement et l\'automatisation des infrastructures cloud. Spécialiste Docker, Kubernetes et CI/CD.',
      image: candidatImage
    },
    {
      name: 'Hanae R.',
      title: 'Analyste de Données',
      summary: 'Compétences en Python, SQL, visualisation de données et machine learning. Transformation des données en insights stratégiques.',
      image: candidatImage
    }
  ];

  return (
    <div style={{
      padding: '80px 0',
      backgroundColor: 'transparent',
      color: '#ffffff'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '600',
            marginBottom: '25px',
            background: 'linear-gradient(135deg, #ffffff 0%, #ff6b35 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Exemples de CVs
          </h2>
          <p style={{
            fontSize: '1.2rem',
            color: '#cccccc',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Découvrez des profils inspirants et créez le vôtre dès maintenant
          </p>
        </div>

        {/* CV Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '30px'
        }}>
          {exampleCVs.map((cv, index) => (
            <div 
              key={index}
              onClick={handleViewCV}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '20px',
                padding: '30px 25px',
                border: '1px solid rgba(255, 165, 0, 0.2)',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 165, 0, 0.1)';
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(255, 107, 53, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              
              {/* Profile Image */}
              <div style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                margin: '0 auto 20px',
                overflow: 'hidden',
                border: '3px solid #ff6b35',
                position: 'relative'
              }}>
                <img 
                  src={cv.image} 
                  alt={cv.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
                {/* Profile badge */}
                <div style={{
                  position: 'absolute',
                  bottom: '-5px',
                  right: '-5px',
                  background: '#ff6b35',
                  borderRadius: '50%',
                  width: '30px',
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '3px solid #000000'
                }}>
                  <Star style={{ width: '14px', height: '14px', color: '#ffffff', fill: '#ffffff' }} />
                </div>
              </div>

              {/* Name */}
              <h3 style={{
                fontSize: '1.4rem',
                fontWeight: '600',
                marginBottom: '8px',
                color: '#ffffff'
              }}>
                {cv.name}
              </h3>

              {/* Job Title */}
              <div style={{
                background: 'rgba(255, 107, 53, 0.2)',
                color: '#ff6b35',
                padding: '6px 15px',
                borderRadius: '20px',
                fontSize: '0.95rem',
                fontWeight: '600',
                margin: '0 auto 20px',
                display: 'inline-block'
              }}>
                {cv.title}
              </div>

              {/* Summary */}
              <p style={{
                color: '#cccccc',
                fontSize: '0.95rem',
                lineHeight: '1.6',
                marginBottom: '25px',
                minHeight: '60px'
              }}>
                {cv.summary}
              </p>

              {/* View CV Button */}
              <button
                style={{
                  background: 'linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '12px 25px',
                  borderRadius: '25px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 10px 20px rgba(255, 107, 53, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <Eye style={{ width: '16px', height: '16px' }} />
                Voir le CV
              </button>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div style={{
          textAlign: 'center',
          marginTop: '60px',
          padding: '40px 30px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 165, 0, 0.2)'
        }}>
          <h3 style={{
            fontSize: '1.8rem',
            fontWeight: '600',
            marginBottom: '15px',
            background: 'linear-gradient(135deg, #ffffff 0%, #ff6b35 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Créez votre CV professionnel
          </h3>
          <p style={{
            color: '#cccccc',
            fontSize: '1.1rem',
            marginBottom: '25px',
            maxWidth: '500px',
            margin: '0 auto 25px'
          }}>
            Rejoignez des milliers de candidats qui ont déjà créé leur profil sur Casajobs.ma
          </p>
          
        </div>
      </div>
    </div>
  );
}

export default CVsExamples;