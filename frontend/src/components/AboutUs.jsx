import React from 'react';
import "../assets/css/AboutUs.css"; // Ensure you create a combined CSS file to handle both styles
import Navbar from "./Navbara";
import Footer from "./Footer";

const services = [
  {
    title: 'Recrutement Personnalisé',
    features: [
      'Analyse du besoin spécifique de l’entreprise',
      'Recherche ciblée et présélection rigoureuse',
      'Suivi post-recrutement et garantie de satisfaction'
    ]
  },
  {
    title: 'Gestion des Candidatures',
    features: [
      'Plateforme intuitive de suivi des candidatures',
      'Communication centralisée avec les postulants',
      'Filtrage intelligent des profils pertinents'
    ]
  },
  {
    title: 'Chasse de Talents',
    features: [
      'Sourcing de profils rares et qualifiés',
      'Approche directe et confidentielle',
      'Évaluation approfondie des compétences et motivations'
    ]
  },
];

const AboutUs = () => {
  return (
    <>
      <Navbar />
      <div className="combined-page">

        {/* About Us Section */}
        <section className="about-page">
          <header className="about-header">
            <h1>À propos de Casajobs</h1>
            <p>Votre passerelle vers les meilleures opportunités professionnelles.</p>
          </header>

          <section className="about-section">
            <h2>Notre Mission</h2>
            <p>
              Casajobs est une plateforme dédiée à la mise en relation des talents avec des entreprises à la recherche de profils
              qualifiés. Notre mission est de simplifier le processus de recrutement tout en offrant des solutions adaptées à
              chaque secteur d'activité.
            </p>
          </section>

          <section className="about-section">
            <h2>Nos Valeurs</h2>
            <div className="values">
              <div className="value">
                <h3>Transparence</h3>
                <p>Nous croyons en une communication claire et honnête avec nos candidats et clients, garantissant une relation basée sur la confiance.</p>
              </div>
              <div className="value">
                <h3>Innovation</h3>
                <p>Nous utilisons des outils et des technologies de pointe pour rendre chaque processus de recrutement plus rapide et plus efficace.</p>
              </div>
              <div className="value">
                <h3>Engagement</h3>
                <p>Nous nous engageons à soutenir nos candidats et clients à chaque étape, avec une attention particulière portée à leurs besoins et à leur succès.</p>
              </div>
            </div>
          </section>

          <section className="about-section">
            <h2>Pourquoi Choisir Casajobs ?</h2>
            <p>Choisir Casajobs, c’est opter pour une expertise inégalée dans le domaine du recrutement. Grâce à notre réseau de partenaires et notre équipe de recruteurs expérimentés, nous offrons une expérience de recrutement fluide, rapide et sans tracas.</p>
          </section>

          <section className="about-section testimonials">
            <h2>Ce Que Disent Nos Clients</h2>
            <div className="testimonials-container">
              <div className="testimonial">
                <p>"Casajobs a grandement facilité notre processus de recrutement. Une équipe réactive et des candidats qualifiés."</p>
                <h5>- Claire Martin, Directrice RH</h5>
              </div>
              <div className="testimonial">
                <p>"Nous avons trouvé nos meilleurs talents grâce à Casajobs. Leur service est rapide et fiable."</p>
                <h5>- John Doe, CEO</h5>
              </div>
              <div className="testimonial">
                <p>"Une plateforme simple d'utilisation qui nous a permis d'optimiser nos embauches et de gagner du temps."</p>
                <h5>- Sarah Alami, Responsable du recrutement</h5>
              </div>
            </div>
          </section>

          <section className="about-section">
                          <h2>Rencontrez notre équipe</h2>

            <div className="team">
              <div className="team-member">
                <img src="team-member1.jpg" alt="Team Member 1" />
                <h4>Marie Dupont</h4>
                <p>Directrice des Ressources Humaines</p>
              </div>
              <div className="team-member">
                <img src="team-member2.jpg" alt="Team Member 2" />
                <h4>Jean Martin</h4>
                <p>Responsable Marketing</p>
              </div>
              <div className="team-member">
                <img src="team-member3.jpg" alt="Team Member 3" />
                <h4>Ahmed Kader</h4>
                <p>Responsable Technique</p>
              </div>
            </div>
          </section>
        

        {/* Services Section */}
      
          <header className="services-hero">
            <h1>Nos Services</h1>
            <p>Casajobs.ma vous accompagne à chaque étape de votre processus de recrutement.</p>
          </header>

          <section className="services-list">
            {services.map((service, index) => (
              <div className="flip-card" key={index}>
                <div className="flip-card-inner">
                  <div className="flip-card-front">
                    <h3>{service.title}</h3>
                  </div>
                  <div className="flip-card-back">
                    <ul>
                      {service.features.map((feature, idx) => (
                        <li key={idx}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </section>

          <section className="cta-section">
            <h2>Vous souhaitez recruter ?</h2>
            <p>Contactez notre équipe pour bénéficier d’un accompagnement sur mesure.</p>
            <button className="cta-button">Contactez-nous</button>
          </section>
          </section>


      </div>
      <Footer />
    </>
  );
};

export default AboutUs;