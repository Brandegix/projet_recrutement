import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from "../components/Navbara";
import Footer from "../components/Footer";
const CandidateProfileView = () => {
  const { id: candidateId } = useParams();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
    const staticExperience = "5 ans en développement web, axé sur les applications Full-stack.";


  useEffect(() => {
    const fetchCandidateProfile = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/wecandidates/profile/${candidateId}`, {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: Candidate not found`);
        }

        const data = await response.json();
        setCandidate(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidateProfile();
  }, [candidateId]);

  if (loading) return <p style={{ fontSize: "16px", color: "gray", textAlign: "center" }}>Loading...</p>;
  if (error) return <p style={{ color: "red", fontWeight: "bold", textAlign: "center" }}>{error}</p>;
  if (!candidate) return <p style={{ color: "gray", textAlign: "center" }}>No candidate data available.</p>;



  return (
    <>
      <Navbar />
    <div className="profile-page" style={{ fontFamily: 'Arial, sans-serif', color: '#333', lineHeight: '1.6' }}>
      <div className="profile-container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
        <div className="profile-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', borderBottom: '1px solid #ddd', paddingBottom: '20px', marginBottom: '20px' }}>
          <div className="profile-picture" style={{ width: '150px', height: '150px', borderRadius: '50%', overflow: 'hidden', marginBottom: '20px' }}>
            {candidate && candidate.profile_image ? (
              <img
                src={`http://localhost:5000/uploads/profile_images/${candidate.profile_image}`}
                alt="Profil"
                className="profile-img"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <img
                src={'https://via.placeholder.com/150'}
                alt="Profil par défaut"
                className="profile-img"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            )}
          </div>
          <div className="profile-info" style={{ textAlign: 'center' }}>
            <h2 className="profile-name" style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2c3e50', marginBottom: '10px' }}>
              {candidate ? candidate.name : "Chargement..."}
            </h2>
            <p className="profile-role" style={{ fontSize: '1.1rem', color: '#7f8c8d', marginBottom: '10px' }}>
              Rôle : Développeur Junior
            </p>
          </div>
        </div>

        {/* Profile Completion */}
        {candidate && typeof candidate.completion === 'number' && (
          <div className="profile-completion" style={{ backgroundColor: '#ecf0f1', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
            <h4 style={{ color: '#2c3e50', fontSize: '1.2rem', marginBottom: '10px' }}>Complétion du profil</h4>
            <div style={{ backgroundColor: '#ddd', borderRadius: '10px', height: '10px', position: 'relative' }}>
              <div
                style={{
                  backgroundColor: '#2ecc71',
                  height: '10px',
                  borderRadius: '10px',
                  width: `${candidate.completion}%`,
                  transition: 'width 0.5s ease',
                  position: 'absolute',
                  top: 0,
                  left: 0
                }}
              >
                <span style={{ position: 'absolute', right: '5px', color: 'white', fontSize: '0.7rem' }}>
                  {candidate.completion > 5 ? `${candidate.completion}%` : ''}
                </span>
              </div>
              {candidate.completion <= 5 && (
                <span style={{ position: 'absolute', left: '0px', color: '#666', fontSize: '0.7rem' }}>
                  {`${candidate.completion}%`}
                </span>
              )}
            </div>
            <p style={{ marginTop: '10px', fontSize: '0.9rem', color: '#7f8c8d' }}>{candidate.completion}% complété</p>
          </div>
        )}

        {/* Details and Skills Section */}
        <div className="details-and-skills" style={{ display: 'flex', gap: '20px', flexDirection: 'row', alignItems: 'stretch', marginBottom: '20px', flexWrap: 'wrap' }}>
          <div className="profile-details card" style={{ flex: '1', backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: '#2c3e50', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '20px' }}>Détails du profil</h3>
            <div className="profile-detail" style={{ fontSize: '1rem', color: '#555', marginBottom: '15px' }}>
              <strong style={{ color: '#2c3e50' }}>Email: </strong>{candidate ? candidate.email : "Chargement..."}
            </div>
            <div className="profile-detail" style={{ fontSize: '1rem', color: '#555', marginBottom: '15px' }}>
              <strong style={{ color: '#2c3e50' }}>Téléphone: </strong>{candidate ? candidate.phoneNumber : "Chargement..."}
            </div>
            <div className="profile-detail" style={{ fontSize: '1rem', color: '#555', marginBottom: '15px' }}>
              <strong style={{ color: '#2c3e50' }}>Adresse: </strong>{candidate ? candidate.address : "Chargement..."}
            </div>
            <div className="profile-detail" style={{ fontSize: '1rem', color: '#555', marginBottom: '15px' }}>
              <strong style={{ color: '#2c3e50' }}>Date de naissance: </strong>{candidate ? candidate.dateOfBirth : "Chargement..."}
            </div>
          </div>

          <div className="skills-section card" style={{ flex: '1', backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: '#2c3e50', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '20px' }}>Compétences</h3>
            {candidate && candidate.skills ? (
              <div className="skills-graph" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {candidate.skills.map((skill) => {
                  const percentage = skill.level ? `${skill.level}%` : '0%';
                  return (
                    <div key={skill.name} style={{ fontSize: '1rem', color: '#555' }}>
                      <span style={{ fontWeight: 'bold', color: '#2c3e50' }}>{skill.name}: </span>
                      <div style={{ backgroundColor: '#ddd', borderRadius: '10px', height: '10px', position: 'relative', marginTop: '5px' }}>
                        <div
                          style={{
                            backgroundColor: '#fa5c01',
                            height: '10px',
                            borderRadius: '10px',
                            width: percentage,
                            transition: 'width 0.5s ease',
                            position: 'absolute',
                            top: 0,
                            left: 0
                          }}
                        >
                        <span style={{ position: 'absolute', right: '5px', color: 'white', fontSize: '0.7rem' }}>
                          { skill.level > 5 ? percentage : ''}
                        </span>
                        </div>
                        {skill.level <= 5 && (
                         <span style={{ position: 'absolute', left: '0px', color: '#666', fontSize: '0.7rem' }}>
                          {percentage}
                        </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p style={{ fontSize: '1rem', color: '#7f8c8d' }}>Chargement des compétences...</p>
            )}
          </div>
        </div>

        {/* Experience and Applications Section */}
       
      </div>
    </div>
    <Footer />
    </>
  );
};

export default CandidateProfileView;
