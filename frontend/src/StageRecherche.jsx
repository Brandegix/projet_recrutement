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
          <JobCards />
        </div>

        {/* CV Examples Section with Dark Background */}
        <section id="cv-examples" style={{
          backgroundColor: '#000000',
          padding: '80px 0'
        }}>
          <CVsExamples />
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