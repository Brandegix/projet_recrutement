import React from 'react';
import "../assets/css/ContactUs.css";
import Navbar from "./Navbara";
import Footer from "./Footer";

const contactMethods = [
  {
    title: 'Support Email',
    icon: '✉️',
    details: ['support@casajobs.ma', 'Réponse sous 24h'],
    action: 'Envoyer un email'
  },
  {
    title: 'Téléphone',
    icon: '📞',
    details: ['+212 5 22 22 22 22', 'Lun-Ven: 9h-18h'],
    action: 'Appeler maintenant'
  },
  {
    title: 'Visitez-nous',
    icon: '🏢',
    details: ['12 Avenue Hassan II', 'Casablanca, Maroc'],
    action: 'Voir sur la carte'
  }
];

const ContactUs = () => {
  return (
    <>
      <Navbar />
      <div className="contact-page">

        {/* Hero Section */}
        <section className="contact-hero">
          <div className="hero-content">
            <h1>Contactez Casajobs</h1>
            <p>Nous sommes là pour répondre à toutes vos questions sur nos services de recrutement.</p>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="contact-methods">
          <h2>Nos canaux de communication</h2>
          
          <div className="methods-grid">
            {contactMethods.map((method, index) => (
              <div className="method-card" key={index}>
                <div className="method-icon">{method.icon}</div>
                <h3>{method.title}</h3>
                <ul className="method-details">
                  {method.details.map((detail, idx) => (
                    <li key={idx}>{detail}</li>
                  ))}
                </ul>
                <button className="method-action-btn">
                  {method.action}
                </button>
              </div>
            ))}
          </div>
        </section>

     
      </div>
      <Footer />
    </>
  );
};

export default ContactUs;