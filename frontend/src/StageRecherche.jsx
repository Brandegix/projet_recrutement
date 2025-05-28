import React, { useState, useEffect } from "react";
import "./assets/css/style.css";
// import "./assets/css/animate.css";
import { Link } from "react-router-dom";
import CarteComponent from "./components/CarteComponent.jsx";
import FaqSection from "./components/FaqSection.jsx";
import Footer from "./components/Footer.jsx";
import axios from 'axios';
import Navbar from './components/Navbara';
import JobCards from './components/JobCards';
import DashboardHomee from './components/DashboardHomee';
import CVsExamples from './components/CVsExamples';
import SEO from "./components/SEO";

const StageRecherche = () => {
  const [offres, setOffres] = useState([]);
  const [selectedPoste, setSelectedPoste] = useState('');
  const [selectedLieu, setSelectedLieu] = useState('');
  const [selectedSalaire, setSelectedSalaire] = useState('');
  const [selectedDomaine, setSelectedDomaine] = useState('');
  const [allPublicRecruiters, setAllPublicRecruiters] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recruitersPerPage = 3;

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/job_offers`)
      .then((res) => {
        console.log("Données reçues : ", res.data);
        setOffres(res.data);
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des offres :", error);
      });
  }, []);


  const truncate = (str, maxLength) => {
    if (!str) return "";
    return str.length > maxLength ? str.slice(0, maxLength) + "..." : str;
  };


  useEffect(() => {
    // Fetch all public recruiters when component mounts
    axios.get(`${process.env.REACT_APP_API_URL}/api/recruiters/public`)
      .then(res => {
        setAllPublicRecruiters(res.data);
      })
      .catch(err => {
        console.error("Error fetching public recruiters:", err);
      });
  }, []);

  // Get current recruiters
  const indexOfLastRecruiter = currentPage * recruitersPerPage;
  const indexOfFirstRecruiter = indexOfLastRecruiter - recruitersPerPage;
  const currentPublicRecruiters = allPublicRecruiters.slice(indexOfFirstRecruiter, indexOfLastRecruiter);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(allPublicRecruiters.length / recruitersPerPage); i++) {
    pageNumbers.push(i);
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSearch = async () => {
    const filters = {
      title: selectedPoste,
      location: selectedLieu,
      salary: selectedSalaire,
      companyName: selectedDomaine,
    };
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/job_offers/filter`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(filters),
        }
      );
      const data = await res.json();
      setOffres(data);
    } catch (err) {
      console.error("Erreur de filtrage:", err);
    }
  };

  return (
    <>
      <Navbar />
      <SEO
        title="Home Page - Boostez votre avenir"
        description="Trouvez des astuces pour réussir vos entretiens, améliorer votre CV et développer votre carrière."
        keywords="conseils carrière, réussir entretien, CV efficace, développement professionnel, formation, emploi, réseau professionnel"
      />

      <div style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        backgroundColor: '#000000',
        color: '#ffffff',
        lineHeight: '1.6'
      }}>

        {/* Hero Section with Dark Theme */}
        <section id="home" style={{
          background: 'linear-gradient(135deg, #000000 0%, #0a0a0a 100%)',
          padding: '120px 0 80px',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', width: '100%' }}>
            <div style={{ textAlign: 'center' }}>


              <h1 style={{
                fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                fontWeight: '700',
                background: 'linear-gradient(135deg, #ffffff 0%, #ff6b35 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '30px',
                lineHeight: '1.2'
              }}>
                Trouvez le job qui vous ressemble, en un clic.
              </h1>

              <p style={{
                fontSize: '1.3rem',
                color: '#cccccc',
                maxWidth: '700px',
                margin: '0 auto 50px',
                fontWeight: '300',
                lineHeight: '1.7'
              }}>
                Parce qu'un bon emploi peut changer une vie, Casajobs.ma vous accompagne à chaque étape de votre recherche. Des outils simples, des offres actualisées, et une communauté engagée pour vous aider à trouver le job de vos rêves.
              </p>

              <Link
                to="/ContactUs"
                style={{
                  background: 'linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)',
                  color: '#ffffff',
                  padding: '15px 35px',
                  borderRadius: '50px',
                  textDecoration: 'none',
                  fontWeight: '600',
                  fontSize: '1.1rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  transition: 'all 0.3s ease',
                  border: 'none',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(255, 107, 53, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Contactez-nous
              </Link>
            </div>
          </div>
        </section>

        {/* JobCards Section with Dark Background */}
        <div style={{
          backgroundColor: '#0a0a0a',
          padding: '80px 0'
        }}>
           <h2 style={{
              textAlign: "center",
              marginBottom: "60px",
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #ffffff 0%, #ff6b35 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: '1.2'
            }}>
              Offres d'emploi
            </h2>
           <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center', marginBottom: '40px' , marginTop: '40px'}}>
            <p style={{
              fontSize: '1.1rem',
              color: '#cccccc',
              fontWeight: '400'
            }}>
             <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center', marginBottom: '40px' , marginTop: '40px'}}>
            <p style={{
              fontSize: '1.1rem',
              color: '#cccccc',
              fontWeight: '400'
            }}>
            Consulter les meilleurs offres d'emploi 
            </p>
          </div>
            </p>
          </div>
          <JobCards />
        </div>

        {/* CV Examples Section with Dark Background */}
        <section id="cv-examples" style={{
          backgroundColor: '#000000',
          padding: '80px 0'
        }}>
          <CVsExamples />
        </section>


        <section style={{
          padding: "80px 20px",
          backgroundColor: "#0a0a0a",
          background: 'linear-gradient(135deg, #0a0a0a 0%, #000000 100%)'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{
              textAlign: "center",
              marginBottom: "60px",
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #ffffff 0%, #ff6b35 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: '1.2'
            }}>
              Recruteurs en ligne
            </h2>
            <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center', marginBottom: '40px' , marginTop: '40px'}}>
            <p style={{
              fontSize: '1.1rem',
              color: '#cccccc',
              fontWeight: '400'
            }}>
            Découvrez les profils de nos recruteurs et rapprochez-vous de votre emploi de rêve.
            </p>
          </div>
              <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "30px",
              justifyContent: "center",
              maxWidth: "1000px",
              margin: "0 auto"
            }}>
              {currentPublicRecruiters.length === 0 ? (
                <div style={{
                  gridColumn: "1 / -1",
                  textAlign: "center",
                  padding: "60px 20px",
                  backgroundColor: "#111111",
                  borderRadius: "20px",
                  border: "1px solid #333333"
                }}>
                  <p style={{
                    color: "#cccccc",
                    fontSize: "1.2rem",
                    margin: "0"
                  }}>
                    Aucun recruteur public disponible pour le moment.
                  </p>
                </div>
              ) : (
                currentPublicRecruiters.map((recruiter) => (
                  <div
                    key={recruiter.id}
                    style={{
                      background: 'linear-gradient(135deg, #111111 0%, #1a1a1a 100%)',
                      padding: "30px",
                      borderRadius: "20px",
                      textAlign: "center",
                      border: "1px solid #333333",
                      transition: "all 0.3s ease",
                      position: "relative",
                      overflow: "hidden"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-10px)';
                      e.currentTarget.style.boxShadow = '0 20px 40px rgba(255, 107, 53, 0.2)';
                      e.currentTarget.style.borderColor = '#ff6b35';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.borderColor = '#333333';
                    }}
                  >
                    {/* Subtle background accent */}
                    <div style={{
                      position: "absolute",
                      top: "0",
                      right: "0",
                      width: "60px",
                      height: "60px",
                      background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.1) 0%, transparent 100%)',
                      borderRadius: "0 20px 0 60px"
                    }}></div>

                    {/* Company Icon/Avatar placeholder */}
                    <div style={{
                      width: "60px",
                      height: "60px",
                      background: 'linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)',
                      borderRadius: "50%",
                      margin: "0 auto 20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.5rem",
                      fontWeight: "bold",
                      color: "#ffffff"
                    }}>
                      {recruiter.company.charAt(0).toUpperCase()}
                    </div>

                    <h3 style={{
                      margin: "0 0 15px",
                      fontSize: "1.4rem",
                      fontWeight: "600",
                      color: "#ffffff",
                      lineHeight: "1.3"
                    }}>
                      {recruiter.company}
                    </h3>

                    <p style={{
                      fontSize: "1.1rem",
                      color: "#ff6b35",
                      marginBottom: "10px",
                      fontWeight: "500"
                    }}>
                      {recruiter.name}
                    </p>


                    <p style={{
                      color: "#cccccc",
                      marginBottom: "25px",
                      fontSize: '0.95rem',
                      lineHeight: '1.6',
                      margin: '0 0 15px 0',
                      overflow: 'hidden', // Add this to prevent overflow
                      display: '-webkit-box',
                      WebkitLineClamp: 3, // Number of lines to show
                      WebkitBoxOrient: 'vertical',
                    }}>
                      {recruiter.title}
                    </p>
                    <Link
                      to={`/recruiters/${recruiter.id}`}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "12px 25px",
                        borderRadius: "50px",
                        background: 'linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)',
                        color: "#ffffff",
                        textDecoration: "none",
                        fontWeight: "600",
                        fontSize: "0.95rem",
                        transition: "all 0.3s ease",
                        border: "none",
                        cursor: "pointer"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                        e.currentTarget.style.boxShadow = '0 10px 25px rgba(255, 107, 53, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      Voir Profil
                      <span style={{ fontSize: "0.8rem" }}>→</span>
                    </Link>
                  </div>
                ))
              )}
            </div>

            {allPublicRecruiters.length > recruitersPerPage && (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'wrap',
                gap: '5px',
                marginTop: '30px'
              }}>
                {pageNumbers.map(number => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    style={{
                      padding: '0.25rem 0.5rem',
                      fontSize: '0.75rem',
                      border: '1px solid #ccc',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '4px',
                      width: '70px',
                      
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#ff8c42';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = currentPage === number ? '#ff6b35' : '#1a1a1a';
                    }}
                  >
                    {number}
                  </button>
                ))}
              </div>
              
            )}
            {/* Statement about the number of profiles per page */}
            
          </div>
        </section>

        {/* FAQ Section with Dark Background */}
        <div style={{
          backgroundColor: '#0a0a0a',
          padding: '50px 0'
        }}>
          <FaqSection />
        </div>


        {/* Contact Section with Dark Background */}
        <div id="contact" style={{
          backgroundColor: '#000000'
        }}>
          <CarteComponent />
        </div>

        <Footer />
      </div>
    </>
  );
};

export default StageRecherche;