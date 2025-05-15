import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbara';
import CareerTips from '../components/CareerTips'; 
import '../assets/css/CareerTips.css';
import Footer from '../components/Footer'; // chemin correct selon ton arborescence
function ConseilDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const tip = CareerTips.find((t) => t.id === parseInt(id));

  if (!tip) {
    return (
      <>
        <Navbar />
        <div className="detail-container">
          <h2>Conseil introuvable</h2>
          <p>Ce conseil n'existe pas ou a été supprimé.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="conseil-detail-container"> {/* Changement de classe ici */}
        <button onClick={() => navigate(-1)} className="back-btn">
          ← Retour
        </button>
        <h1>{tip.title}</h1>
        <p>{tip.description}</p>

        {tip.subTips.map((sub, idx) => (
          <div key={idx} className="sub-tip-section"> {/* Ajout de classe ici */}
            <h3>{sub.subtitle}</h3>
            <ul>
              {sub.points.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <Footer/>

    </>
  );
}

export default ConseilDetail;
