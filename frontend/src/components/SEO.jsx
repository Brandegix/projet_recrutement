// SEO.jsx
import { Helmet } from 'react-helmet';

function SEO({ 
  title = "Mon Site - Plateforme de Carrière", 
  description = "Découvrez nos ressources pour réussir votre carrière : conseils, formations, outils et plus encore.",
  keywords = "carrière, conseils, formation, emploi, CV, entretien, réseau professionnel"
}) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
    </Helmet>
  );
}

export default SEO;
