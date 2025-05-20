import React, { useState } from 'react';
import '../assets/css/FaqSection.css'; // on importe le CSS stylé

const faqData = [
  {
    question: 'Comment postuler à une offre d\'emploi sur Casajob?',
    answer: 'Pour postuler, créez un compte sur notre site, puis recherchez les offres qui vous intéressent et cliquez sur "Postuler".',
  },
  {
    question: 'Quels types de contrats sont proposés sur Casajob?',
    answer: 'Casajob offre des contrats CDI, CDD, freelance et stage, selon les besoins des recruteurs.',
  },
  {
    question: 'Comment suivre ma candidature après avoir postulé?',
    answer: 'Vous pouvez suivre l\'état de votre candidature dans la section "Mes Candidatures" de votre tableau de bord.',
  },
  {
    question: 'Puis-je ajouter plusieurs CV à mon profil?',
    answer: 'Oui, vous pouvez télécharger plusieurs CV dans votre profil, vous permettant de postuler facilement à différentes offres.',
  },
  {
    question: 'Comment créer un compte recruteur?',
    answer: 'Pour créer un compte recruteur, cliquez sur "S\'inscrire" et sélectionnez "Recruteur". Vous pourrez ensuite publier des offres d\'emploi et gérer vos candidatures.',
  },
];

const FaqSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <section id="faq" className="parallax-section">
      <div className="container">
        <div className="row text-center">
          <div className="section-title">
            <h2>Consultez notre FAQ pour en savoir plus sur l'utilisation de Casajob.</h2>
          </div>
        </div>

        <div className="accordion">
          {faqData.map((item, index) => (
            <div
              key={index}
              className={`accordion-item ${activeIndex === index ? 'active' : ''}`}
            >
              <div
                className="accordion-title"
                onClick={() => toggleAccordion(index)}
              >
                <h4>{item.question}</h4>
                <span>{activeIndex === index ? '-' : '+'}</span>
              </div>
              <div className="accordion-content">
                <p>{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
