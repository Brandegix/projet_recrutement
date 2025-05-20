import React, { useState, useEffect } from "react";
import "./assets/css/style.css";
// import "./assets/css/animate.css";
import { Link } from "react-router-dom";
import CarteComponent from "./components/CarteComponent.jsx";
import FaqSection from "./components/FaqSection.jsx";
import Footer from "./components/Footer.jsx";
import axios from 'axios';
import Navbar from './components/Navbara';
import JobCards from  './components/JobCards';
import DashboardHomee  from './components/DashboardHomee';
import CVsExamples from './components/CVsExamples';
const StageRecherche = () => {
  const [offres, setOffres] = useState([]);
  const [selectedPoste, setSelectedPoste] = useState('');
const [selectedLieu, setSelectedLieu] = useState('');
const [selectedSalaire, setSelectedSalaire] = useState('');
const [selectedDomaine, setSelectedDomaine] = useState('');


useEffect(() => {
  axios.get("http://localhost:5000/api/job_offers")
    .then((res) => {
      console.log("Données reçues : ", res.data);  // Affiche les données dans la console
      setOffres(res.data); // Vérifie que tu les passes bien au state
    })
    .catch((error) => {
      console.error("Erreur lors du chargement des offres :", error);
    });
}, []);

useEffect(() => {
  window.scrollTo(0, 0);
}, []);

  // Recherche filtrée
  const handleSearch = async () => {
    const filters = {
      title: selectedPoste,
      location: selectedLieu,
      salary: selectedSalaire,
      companyName: selectedDomaine,
    };

    try {
      const res = await fetch(
        "http://localhost:5000/api/job_offers/filter",
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
    <Navbar/>

    <div className="homepage">
      {/* Navbar */}

      {/* Hero */}
      <section id="home" className="part1">
        <div className="container">
          <div className="welcome-hero-txt">
            <h2>
              <span className="description">Casajobs.ma</span><h1>  Trouvez le job qui
              vous ressemble, en un clic.</h1>
            </h2>
            <p className="parag">
              Parce qu’un bon emploi peut changer une vie, Casajobs.ma vous
              accompagne à chaque étape de votre recherche. Des outils simples,
              des offres actualisées, et une communauté engagée pour vous aider
              à trouver le job de vos rêves.
            </p>
            <button
              
            >
                       <Link to="/ContactUs" className="cte">Contactez-nous</Link>

            </button>
          </div>
        </div>
      </section>
      <JobCards/>
      <section id="cv-examples" className="cv-examples-section">
  <CVsExamples />
</section>


      {/* FAQ & Carte */}
      <FaqSection />
      <div id="contact">
        <CarteComponent />
      </div>
      <Footer />
    </div></>
  );
};

export default StageRecherche;
