// Accueil.js
import { useNavigate } from 'react-router-dom';
import '../assets/css/CVsExamples.css'; // Add your styles here
import candidatImage from '../assets/images/userIcon.jpg';

function CVsExamples() {
  const navigate = useNavigate();

  const handleViewCV = () => {
    navigate('/choixRole'); // Redirect to choixRole page
  };

  const exampleCVs = [
    {
      name: 'Sara B.',
      title: 'Développeuse Web',
      summary: 'Passionnée par la création de sites web modernes...',
      image: candidatImage
    },
    {
      name: 'Yassine M.',
      title: 'Ingénieur DevOps',
      summary: 'Expérience dans le déploiement et l’automatisation...',
      image: candidatImage
    },
    {
      name: 'Hanae R.',
      title: 'Analyste de Données',
      summary: 'Compétences en Python, SQL, visualisation de données...',
      image: candidatImage
    }
  ];

  return (
    <div className="cv-section">
      <h2>Exemples de CVs</h2>
      <div className="cv-list">
        {exampleCVs.map((cv, index) => (
          <div className="cv-card" key={index} onClick={handleViewCV}>
            <img src={cv.image} alt="cv" />
            <h3>{cv.name}</h3>
            <p><strong>{cv.title}</strong></p>
            <p>{cv.summary}</p>
            <button>Voir le CV</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CVsExamples;
