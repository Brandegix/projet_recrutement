import React from "react";
import JobCardss from "./JobCardss";
import "../../assets/css/Offres.css";
import { Link } from "react-router-dom";
import Footer from '../../components/Footer';
import Navbar from "../Navbara";
import SEO from "../SEO";
function Offres() {
  return ( <>
      <Navbar />
      <SEO
        title="Offres d'emploi"
       /> 
    <div className="offres-page">
      

      <main className="offres-content">
        <h1 className="offres-title">Offres disponibles</h1>
        <JobCardss />
      </main>
    </div><Footer/></>
  );
}

export default Offres;
