import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { FaUser, FaClock, FaMicrophone } from 'react-icons/fa';
import JobOfferStatistics from "./components/JobOfferStatistics";
// ✅ Pages principales de l'application
import StageRecherche from "./StageRecherche";
import RecruteurAjout from "./components/RecruteurAjout.jsx";
// ✅ Pages d'authentification dans le dossier ./components
import LoginCandidat from "./components/LoginCandidat.jsx";
import JobCards from "./components/JobCards.jsx";
import LoginRecruteur from "./components/LoginRecruteur.jsx";
import ChoixRole from "./components/ChoixRole.jsx"; // page pour choisir candidat ou recruteur
import ChoixRole2 from "./components/ChoixRole2.jsx"; // page pour choisir candidat ou recruteur
import RegisterCandidate from "./components/RegisterCandidate.jsx"; // page d'inscription pour les candidats
import RegisterRecruiter from "./components/RegisterRecruiter.jsx"; // page d'inscription pour les recruteurs
import CandidatePagefrom from "./components/CandidatePagefrom.jsx"; // page d'inscription pour les recruteurs
import RecruteurPage from "./components/Recruteur/RecruteurPage.jsx"; 
import OffresRecruteur from "./components/OffresRecruteur.jsx";
import ConseilsPage from "./components/ConseilsPage.jsx";
import Dashboard from "./components/Dashboard.jsx";
import Dash from "./components/Dach.jsx";
import RecruiterApplications from  "./components/Recruteur/RecruiterApplications.jsx";
import CandidateProfile from "./components/Candidat/CandidateProfile.jsx";
import DashboardCharts from './components/DashboardCharts';
import DashboardHome  from './components/DashboardHome';
import DashboardHomee  from './components/DashboardHomee';
import ApplicationsByRecruiter  from './components/ApplicationsByRecruiter';
import RecruiterProfile from "./components/Recruteur/RecruiterProfile.jsx";
import Offres from "./components/Candidat/Offres.jsx";
import JobCardss from "./components/Candidat/JobCardss.jsx";
import CandidateApplications from "./components/Candidat/CandidateApplications.jsx";
import RecruiterJobOffers from "./components/Recruteur/RecruiterJobOffers.jsx";
import JobOfferForm from "./components/JobOfferForm.jsx";
import ConseilDetail from './components/ConseilDetail';
import EditRecruiterProfile from "./components/Recruteur/EditRecruiterProfile.jsx";
import EditJobOfferForm from './components/EditJobOfferForm';
import EditProfile from "./components/Candidat/EditProfile.jsx";
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard'; 
import ManageCandidates  from './components/ManageCandidates'; 
import ManageRecruiters from './components/ManageRecruiters';
import ManageJobs from './components/ManageJobs';
import EditJobOffer from './components/EditJobOffer';
import EditCandidate from './components/EditCandidate';
import EditRecruiter from './components/EditRecruiter';
import Applications from './components/Applications';
import Dashboard_admin from './components/Dashboard_admin';
import Candidatesadmin from './components/Candidatesadmin';
import AboutUs from './components/AboutUs';

import ScrollToTop from './components/ScrollToTop'; // adjust path if needed


//does this work now
import RecruiterPublicProfile from './components/Recruteur/RecruiterPublicProfile';

import RecruiterNewsletterSubscribers from './components/Recruteur/RecruiterNewsletterSubscribers';

import ContactUs from './components/ContactUs';


import JobOfferApplications from './components/Recruteur/JobOfferApplications';

import SEO from './components/SEO';


import VerifyOtp from './components/VerifyOtp';
import ResetPassword from  './components/ResetPassword';
import RequestResetCandidat from "./components/RequestResetCandidat";
import VerifyOtpCandidat from "./components/VerifyOtpCandidat";
import ResetPasswordCandidat from "./components/ResetPasswordCandidat";
import RequestResetAdmin from "./components/RequestResetAdmin";
import VerifyOtpAdmin from "./components/VerifyOtpAdmin";
import ResetPasswordAdmin from "./components/ResetPasswordAdmin";
import RequestResetRecruteur from "./components/RequestResetRecruteur"; // ✅ Import the component

import RecruiterProfiless from "./components/RecruiterProfiless.jsx"; // Import the new component

import CandidateProfileView from "./components/CandidateProfileView.jsx";
import CandidateSearchFilter from "./components/CandidateSearchFilter";
import Chat from './components/Chat';
import ApplicationChat from './components/Recruteur/ApplicationChat.jsx';
import CandidateApplicationChat from './components/Candidat/CandidateApplicationChat.jsx';
import GlobalSocket from './components/GlobalSocket.jsx';
import JobDetail from './components/JobDetail';
import CVsExamples from './components/CVsExamples';
import React, { useEffect , useState } from 'react';
import socket from './socket';
import SavedJobOffers from  './components/Candidat/SavedJobOffers';
import ChatBot from './components/Chatbot/Chatbot.jsx'
import Loading from './components/Loading';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  // Always call useEffect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission().then((permission) => {
        console.log("Notification permission:", permission);
      });
    }
  }, []);

  useEffect(() => {
    socket.connect();

    socket.on("receive_message", (msg) => {
      const currentUserId = sessionStorage.getItem('user_id');
      const currentUserType = sessionStorage.getItem('user_type');

      if (msg.user_id.toString() !== currentUserId || msg.user_type !== currentUserType) {
        showNotification(msg);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const showNotification = (msg) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("New Message!", {
        body: `${msg.user}: ${msg.message}`,
        icon: "/notification-icon.png",
      });
    }
  };

  // ✅ Render conditionally, but AFTER hooks
  if (isLoading) {
    return <Loading message="🚀 Initialisation de CasaJobs..." />;
  }
 // Runs when pathname changes
  return (
    <Router>
 <SEO 
        title="Casajobs" 
        description="Default description for my app"
      />
  <ScrollToTop />  {/* ✅ good placement */}
  <Routes>
        
      <Route path="/ContactUs" element={<ContactUs />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
<Route path="/reset-password" element={<ResetPassword />} />
<Route path="/candidate/request-reset" element={<RequestResetCandidat />} />
        <Route path="/candidate/verify-otp" element={<VerifyOtpCandidat />} />
        <Route path="/candidate/reset-password" element={<ResetPasswordCandidat />} />
        <Route path="/admin/request-reset" element={<RequestResetAdmin />} />
        <Route path="/admin/verify-otp" element={<VerifyOtpAdmin />} />
        <Route path="/admin/reset-password" element={<ResetPasswordAdmin />} />
        <Route path="/about-us" element={<AboutUs />} />

        <Route path="/recruiter/request-reset" element={<RequestResetRecruteur />} /> {/* ✅ Add this new route */}

        {/* Pages principales */}
        <Route path="/" element={<StageRecherche />} />
        <Route path="/AboutUs" element={<AboutUs />} />
        <Route path="/Offres" element={<Offres />} />
        <Route path="/conseil/:id" element={<ConseilDetail />} />
        <Route path="/ApplicationsByRecruiter" element={<ApplicationsByRecruiter />} />
        <Route path="/DashboardHome" element={<DashboardHome />} />
        <Route path="/DashboardHomee" element={<DashboardHomee />} />
        <Route path="/DashboardCharts" element={<DashboardCharts />} />
        <Route path="/RecruiterApplications" element={<RecruiterApplications />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/JobCards" element={<JobCards />} />
        <Route path="/RecruteurPage" element={<RecruteurPage />} />
        <Route path="/OffresRecruteur" element={<OffresRecruteur />} />
        <Route path="/CandidatePagefrom" element={<CandidatePagefrom />} />
        <Route path="/CandidatePagefrom" element={<CandidatePagefrom />} />
        <Route path="/RecruteurAjout" element={<RecruteurAjout />} />
        <Route path="/ConseilsPage" element={<ConseilsPage />} />
        <Route path="/dashboard/:recruiterId" element={<Dash />} />

        {/* Page Choix du rôle */}
        <Route path="/edit-profile" element={<EditProfile />} />
        {/* Page Choix du rôle */}
        <Route path="/ChoixRole" element={<ChoixRole />} />
        <Route path="/ChoixRole2" element={<ChoixRole2 />} />
        
        {/* Pages de connexion */}
        <Route path="/login/candidat" element={<LoginCandidat />} />
        <Route path="/LoginRecruteur" element={<LoginRecruteur />} />
        
        {/* Pages d'inscription */}
        <Route path="/register/candidat" element={<RegisterCandidate />} />
        <Route path="/register/recruteur" element={<RegisterRecruiter />} />
        <Route path="/CandidatePagefrom" element={<CandidatePagefrom />} />
        <Route path="/candidate-profile" element={<CandidateProfile />} />
        <Route path="/RecruiterProfile" element={<RecruiterProfile />} />
        <Route path="/JobCardss" element={<JobCardss />} />
        <Route path="/applications" element={<CandidateApplications />} />

        <Route path="/RecruiterJobOffers" element={<RecruiterJobOffers />} />
        <Route path="/JobOfferForm" element={<JobOfferForm />} />
        <Route path="/EditRecruiterProfile" element={<EditRecruiterProfile/>} />
        <Route path="/edit-offer/:offerId" element={<EditJobOfferForm />} />
        <Route path="/d512e7c9-16fa-4151-95d9-3cacdeed3d9c-4b2f-8e1a-7c6d-admin9f0e-2a3b-4c5d-6e7f-1234-567log8-90ab-cdef-0123-in4567-89ab" element={<AdminLogin />} />
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
        <Route path="/ManageCandidates" element={<ManageCandidates />} />
        <Route path="/ManageRecruiters" element={<ManageRecruiters />} />
        <Route path="/ManageJobs" element={<ManageJobs />} />
        <Route path="/edit-recruiter/:id" element={<EditRecruiter />} />
<Route path="/edit-candidate/:id" element={<EditCandidate />} />
<Route path="/edit-job/:id" element={<EditJobOffer />} />
<Route path="/applicationss" element={<Applications />} />
<Route path="/Dashboard_admin" element={<Dashboard_admin />} />
<Route path="/Candidatesadmin" element={<Candidatesadmin />} />


<Route path="/recruiter/candidate/:id" element={<CandidateProfileView />} />
<Route path="/recruiter/candidate-search" component={CandidateSearchFilter} />

<Route path="/recruiter-profile" element={<RecruiterProfiless />} />
<Route path="/chat" element={<Chat />} />
<Route path="/ApplicationChat" element={<ApplicationChat />} />
<Route path="/CandidateApplicationChat" element={<CandidateApplicationChat />} />
<Route path="/GlobalSocket" element={<GlobalSocket />} />
<Route path="/offres/:id" element={<JobDetail />} />
<Route path="/CVsExamples" element={<CVsExamples />} />
<Route path="/SavedJobOffers" element={<SavedJobOffers />} />

<Route path="/job-offer-statistics" element={<JobOfferStatistics />} />
<Route path="/recruiter/job-offers/:offerId/applications" element={<JobOfferApplications />} />

<Route path="/recruiters/:id" element={<RecruiterPublicProfile />} />

<Route path="/Subscribers" element={<RecruiterNewsletterSubscribers />} />




      </Routes>
      <ChatBot />
    </Router>
  );
}

export default App;
