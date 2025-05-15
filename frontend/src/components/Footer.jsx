import React from 'react';
import '../assets/css/Footer.css';

const Footer = () => {
  return (
    <footer className="casajobs-footer">
      <div className="casajobs-footer-wrapper">
        <div className="casajobs-footer-section casajobs-footer-about">
          <h2>CasaJobs.ma</h2>
          <p>
            La plateforme marocaine dédiée à la recherche d'emploi et de talents. Rejoignez-nous pour trouver les meilleures opportunités ou les meilleurs profils.
          </p>
        </div>

        <div className="casajobs-footer-section casajobs-footer-links">
          <h3>Liens utiles</h3>
          <ul>
            <li><a href="/about">À propos</a></li>
            <li><a href="/offers">Offres d'emploi</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/login">Se connecter</a></li>
          </ul>
        </div>

        <div className="casajobs-footer-section casajobs-footer-contact">
          <h3>Contact</h3>
          <p>Email : contact@casajobs.ma</p>
          <p>Téléphone : +212 6 00 00 00 00</p>
          <p>Adresse : Casablanca, Maroc</p>
        </div>
      </div>

      <div className="casajobs-footer-bottom">
        <p>&copy; {new Date().getFullYear()} CasaJobs.ma - Tous droits réservés</p>
      </div>
    </footer>
  );
};

export default Footer;
