import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { FaUser, FaClock, FaMicrophone } from 'react-icons/fa';
import { useState, useEffect, Suspense, lazy } from 'react';
import React from 'react';
import socket from './socket';
import Loading from './components/Loading'; // ✅ Import Loading component
import SEO from './components/SEO';
import ScrollToTop from './components/ScrollToTop'; // adjust path if needed
import GlobalSocket from './components/GlobalSocket.jsx';

// ✅ Lazy load navbar and chatbot
const Navbar = lazy(() => import('./components/Navbar')); // Add navbar lazy loading
const ChatBot = lazy(() => import('./components/Chatbot/Chatbot.jsx'))

// ✅ Lazy load components for better performance
const JobOfferStatistics = lazy(() => import("./components/JobOfferStatistics"));
const StageRecherche = lazy(() => import("./StageRecherche"));
const RecruteurAjout = lazy(() => import("./components/RecruteurAjout.jsx"));
const LoginCandidat = lazy(() => import("./components/LoginCandidat.jsx"));
const JobCards = lazy(() => import("./components/JobCards.jsx"));
const LoginRecruteur = lazy(() => import("./components/LoginRecruteur.jsx"));
const ChoixRole = lazy(() => import("./components/ChoixRole.jsx"));
const ChoixRole2 = lazy(() => import("./components/ChoixRole2.jsx"));
const RegisterCandidate = lazy(() => import("./components/RegisterCandidate.jsx"));
const RegisterRecruiter = lazy(() => import("./components/RegisterRecruiter.jsx"));
const CandidatePagefrom = lazy(() => import("./components/CandidatePagefrom.jsx"));
const RecruteurPage = lazy(() => import("./components/Recruteur/RecruteurPage.jsx"));
const OffresRecruteur = lazy(() => import("./components/OffresRecruteur.jsx"));
const ConseilsPage = lazy(() => import("./components/ConseilsPage.jsx"));
const Dashboard = lazy(() => import("./components/Dashboard.jsx"));
const Dash = lazy(() => import("./components/Dach.jsx"));
const RecruiterApplications = lazy(() => import("./components/Recruteur/RecruiterApplications.jsx"));
const CandidateProfile = lazy(() => import("./components/Candidat/CandidateProfile.jsx"));
const DashboardCharts = lazy(() => import('./components/DashboardCharts'));
const DashboardHome = lazy(() => import('./components/DashboardHome'));
const DashboardHomee = lazy(() => import('./components/DashboardHomee'));
const ApplicationsByRecruiter = lazy(() => import('./components/ApplicationsByRecruiter'));
const RecruiterProfile = lazy(() => import("./components/Recruteur/RecruiterProfile.jsx"));
const Offres = lazy(() => import("./components/Candidat/Offres.jsx"));
const JobCardss = lazy(() => import("./components/Candidat/JobCardss.jsx"));
const CandidateApplications = lazy(() => import("./components/Candidat/CandidateApplications.jsx"));
const RecruiterJobOffers = lazy(() => import("./components/Recruteur/RecruiterJobOffers.jsx"));
const JobOfferForm = lazy(() => import("./components/JobOfferForm.jsx"));
const ConseilDetail = lazy(() => import('./components/ConseilDetail'));
const EditRecruiterProfile = lazy(() => import("./components/Recruteur/EditRecruiterProfile.jsx"));
const EditJobOfferForm = lazy(() => import('./components/EditJobOfferForm'));
const EditProfile = lazy(() => import("./components/Candidat/EditProfile.jsx"));
const AdminLogin = lazy(() => import('./components/AdminLogin'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const ManageCandidates = lazy(() => import('./components/ManageCandidates'));
const ManageRecruiters = lazy(() => import('./components/ManageRecruiters'));
const ManageJobs = lazy(() => import('./components/ManageJobs'));
const EditJobOffer = lazy(() => import('./components/EditJobOffer'));
const EditCandidate = lazy(() => import('./components/EditCandidate'));
const EditRecruiter = lazy(() => import('./components/EditRecruiter'));
const Applications = lazy(() => import('./components/Applications'));
const Dashboard_admin = lazy(() => import('./components/Dashboard_admin'));
const Candidatesadmin = lazy(() => import('./components/Candidatesadmin'));
const AboutUs = lazy(() => import('./components/AboutUs'));
const RecruiterPublicProfile = lazy(() => import('./components/Recruteur/RecruiterPublicProfile'));
const RecruiterNewsletterSubscribers = lazy(() => import('./components/Recruteur/RecruiterNewsletterSubscribers'));
const ContactUs = lazy(() => import('./components/ContactUs'));
const JobOfferApplications = lazy(() => import('./components/Recruteur/JobOfferApplications'));
const VerifyOtp = lazy(() => import('./components/VerifyOtp'));
const ResetPassword = lazy(() => import('./components/ResetPassword'));
const RequestResetCandidat = lazy(() => import("./components/RequestResetCandidat"));
const VerifyOtpCandidat = lazy(() => import("./components/VerifyOtpCandidat"));
const ResetPasswordCandidat = lazy(() => import("./components/ResetPasswordCandidat"));
const RequestResetAdmin = lazy(() => import("./components/RequestResetAdmin"));
const VerifyOtpAdmin = lazy(() => import("./components/VerifyOtpAdmin"));
const ResetPasswordAdmin = lazy(() => import("./components/ResetPasswordAdmin"));
const RequestResetRecruteur = lazy(() => import("./components/RequestResetRecruteur"));
const RecruiterProfiless = lazy(() => import("./components/RecruiterProfiless.jsx"));
const CandidateProfileView = lazy(() => import("./components/CandidateProfileView.jsx"));
const CandidateSearchFilter = lazy(() => import("./components/CandidateSearchFilter"));
const Chat = lazy(() => import('./components/Chat'));
const ApplicationChat = lazy(() => import('./components/Recruteur/ApplicationChat.jsx'));
const CandidateApplicationChat = lazy(() => import('./components/Candidat/CandidateApplicationChat.jsx'));
const JobDetail = lazy(() => import('./components/JobDetail'));
const CVsExamples = lazy(() => import('./components/CVsExamples'));
const SavedJobOffers = lazy(() => import('./components/Candidat/SavedJobOffers'));

// Create a wrapper to monitor location changes and handle loading
const AppRoutes = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 400); // Delay for smoother UX
    return () => clearTimeout(timeout);
  }, [location.pathname]);

  return (
    <>
      {loading && <Loading />}
      <SEO 
        title="Casajobs" 
        description="Default description for my app"
      />
      <ScrollToTop />  {/* ✅ good placement */}
      <Suspense fallback={<Loading message="Chargement de la navigation..." />}>
        <Navbar />
      </Suspense>
      <Suspense fallback={<Loading message="Chargement de la page..." />}>
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
      </Suspense>
      <Suspense fallback={<div style={{position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000}}><Loading message="Chargement du chat..." /></div>}>
        <ChatBot />
      </Suspense>
    </>
  );
};

function App() {
  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission().then((permission) => {
        console.log("Notification permission:", permission);
      });
    }
  }, []);
  
  useEffect(() => {
    socket.connect(); // 🔌 Connect globally

    socket.on("receive_message", (msg) => {
      // ✅ Only show notification if the message is not sent by the current user
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

  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
