import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './assets/css/style.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import '/assets/css/liste_offre_css/bootstrap.min.css';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
