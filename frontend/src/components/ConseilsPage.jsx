import React, { useState } from 'react';
import '../assets/css/ConseilsPage.css';
import Navbar from '../components/Navbara';
import CareerTips from '../components/CareerTips';  // Assure-toi que l'import est correct
import { Link } from 'react-router-dom';
import Footer from '../components/Footer'; // chemin correct selon ton arborescence

function ConseilsPage() {
  const [activeTab, setActiveTab] = useState("tous");

  // Filtrage des conseils en fonction de la catégorie sélectionnée
  const filteredTips = CareerTips.filter(
    (tip) => activeTab === "tous" || tip.category === activeTab
  );

  return (
    <>
      <Navbar />
      <div className="tips-container">
        <div className="tips-header">
          <h1>Conseils Carrière</h1>
          <p>Boostez votre carrière avec nos conseils personnalisés</p>
        </div>

        <div className="tips-tabs">
          {["tous", "cv", "entretien", "carriere", "formation"].map((cat) => (
            <button
              key={cat}
              className={activeTab === cat ? "tab-btn active-tab" : "tab-btn"}
              onClick={() => setActiveTab(cat)}
            >
              {cat === "tous" && "Tous"}
              {cat === "cv" && "CV et Lettres"}
              {cat === "entretien" && "Entretiens"}
              {cat === "carriere" && "Carrière"}
              {cat === "formation" && "Formation"}
            </button>
          ))}
        </div>

        {filteredTips.length > 0 ? (
          <div className="tips-content">
            {filteredTips.map((tip) => (
              <div key={tip.id} className="tip-card">
                <div className="tip-icon-container">{tip.icon}</div>
                <div className="tip-card-header">
                  <h3>{tip.title}</h3>
                  {/* Résumé du texte */}
                  <p>{tip.description.split("\n")[0]}</p> {/* Affichage d'un résumé */}
                </div>
                <div className="tip-card-body">
                  {tip.subTips.map((sub, idx) => (
                    <div key={idx}>
                      <div className="tip-title">{sub.subtitle}</div>
                      <ul>
                        {sub.points.map((point, pointIdx) => (
                          <li key={pointIdx}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <div className="tip-card-footer">
                  <Link to={`/conseil/${tip.id}`} className="read-more-btn">
                    En savoir plus
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <img
              src="https://www.svgrepo.com/show/521108/empty-box.svg"
              alt="Aucun conseil disponible"
            />
            <h3>Oops ! Aucun conseil pour cette catégorie</h3>
            <p>Nous travaillons à enrichir cette section. Revenez bientôt !</p>
          </div>
        )}
      </div>
      <Footer/>

    </>
  );
}

export default ConseilsPage;