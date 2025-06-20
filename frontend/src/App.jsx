import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { FaUser, FaClock, FaMicrophone } from 'react-icons/fa';
import { useState, useEffect } from 'react'; // Removed Suspense, lazy
import React from 'react';
import socket from './socket';
import Loading from './components/Loading'; // Import Loading component
import SEO from './components/SEO';
import ScrollToTop from './components/ScrollToTop'; // adjust path if needed
import GlobalSocket from './components/GlobalSocket.jsx';
import ChatBot from './components/Chatbot/Chatbot.jsx'
import AdminSidebar  from "./components/AdminSidebar";
// Direct imports (no lazy loading)
import JobOfferStatistics from "./components/JobOfferStatistics";
import StageRecherche from "./StageRecherche";
import RecruteurAjout from "./components/RecruteurAjout.jsx";
import LoginCandidat from "./components/LoginCandidat.jsx";
import JobCards from "./components/JobCards.jsx";
import LoginRecruteur from "./components/LoginRecruteur.jsx";
import ChoixRole from "./components/ChoixRole.jsx";
import ChoixRole2 from "./components/ChoixRole2.jsx";
import RegisterCandidate from "./components/RegisterCandidate.jsx";
import RegisterRecruiter from "./components/RegisterRecruiter.jsx";
import CandidatePagefrom from "./components/CandidatePagefrom.jsx";
import RecruteurPage from "./components/Recruteur/RecruteurPage.jsx";
import OffresRecruteur from "./components/OffresRecruteur.jsx";
import ConseilsPage from "./components/ConseilsPage.jsx";
import Dashboard from "./components/Dashboard.jsx";
import Dash from "./components/Dach.jsx";
import RecruiterApplications from "./components/Recruteur/RecruiterApplications.jsx";
import CandidateProfile from "./components/Candidat/CandidateProfile.jsx";
import DashboardCharts from './components/DashboardCharts';
import DashboardHome from './components/DashboardHome';
import DashboardHomee from './components/DashboardHomee';
import ApplicationsByRecruiter from './components/ApplicationsByRecruiter';
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
import ManageCandidates from './components/ManageCandidates';
import ManageRecruiters from './components/ManageRecruiters';
import ManageJobs from './components/ManageJobs';
import EditJobOffer from './components/EditJobOffer';
import EditCandidate from './components/EditCandidate';
import EditRecruiter from './components/EditRecruiter';
import Applications from './components/Applications';
import Dashboard_admin from './components/Dashboard_admin';
import Candidatesadmin from './components/Candidatesadmin';
import AboutUs from './components/AboutUs';
import RecruiterPublicProfile from './components/Recruteur/RecruiterPublicProfile';
import RecruiterNewsletterSubscribers from './components/Recruteur/RecruiterNewsletterSubscribers';
import ContactUs from './components/ContactUs';
import JobOfferApplications from './components/Recruteur/JobOfferApplications';
import VerifyOtp from './components/VerifyOtp';
import ResetPassword from './components/ResetPassword';
import RequestResetCandidat from "./components/RequestResetCandidat";
import VerifyOtpCandidat from "./components/VerifyOtpCandidat";
import ResetPasswordCandidat from "./components/ResetPasswordCandidat";
import RequestResetAdmin from "./components/RequestResetAdmin";
import VerifyOtpAdmin from "./components/VerifyOtpAdmin";
import ResetPasswordAdmin from "./components/ResetPasswordAdmin";
import RequestResetRecruteur from "./components/RequestResetRecruteur";
import RecruiterProfiless from "./components/RecruiterProfiless.jsx";
import CandidateProfileView from "./components/CandidateProfileView.jsx";
import CandidateSearchFilter from "./components/CandidateSearchFilter";
import Chat from './components/Chat';
import ApplicationChat from './components/Recruteur/ApplicationChat.jsx';
import CandidateApplicationChat from './components/Candidat/CandidateApplicationChat.jsx';
import JobDetail from './components/JobDetail';
import CVsExamples from './components/CVsExamples';
import SavedJobOffers from './components/Candidat/SavedJobOffers';

const AppRoutes = () => {
    const location = useLocation();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);

        // Simple timeout-based approach with resource checks
        const handlePageLoad = async () => {
            try {
                // Wait for React to finish rendering
                await new Promise(resolve => {
                    requestAnimationFrame(() => {
                        requestAnimationFrame(resolve);
                    });
                });

                // Check for critical images only (not all images)
                const criticalImages = document.querySelectorAll('img[data-critical], .hero img, .logo img');
                const imagePromises = Array.from(criticalImages).map(img => {
                    if (img.complete) return Promise.resolve();
                    return new Promise(resolve => {
                        const timeout = setTimeout(() => resolve(), 2000); // 2s timeout per image
                        img.onload = () => {
                            clearTimeout(timeout);
                            resolve();
                        };
                        img.onerror = () => {
                            clearTimeout(timeout);
                            resolve(); // Continue even if image fails
                        };
                    });
                });

                // Wait for critical images with overall timeout
                await Promise.race([
                    Promise.all(imagePromises),
                    new Promise(resolve => setTimeout(resolve, 3000)) // Max 3s wait
                ]);

                // Small delay for smooth transition
                setTimeout(() => {
                    setLoading(false);
                }, 200);

            } catch (error) {
                console.error('Loading error:', error);
                // Always stop loading even if there's an error
                setTimeout(() => {
                    setLoading(false);
                }, 500);
            }
        };

        handlePageLoad();
    }, [location.pathname]);

    // Fallback: Force stop loading after maximum time
    useEffect(() => {
        if (!loading) return;

        const maxLoadingTime = setTimeout(() => {
            console.warn('Force stopping loading after 5 seconds');
            setLoading(false);
        }, 5000); // Maximum 5 seconds loading

        return () => clearTimeout(maxLoadingTime);
    }, [loading]);

    return (
        <>
            {loading && <Loading />}
            <SEO
                title="Casajobs"
                description="Default description for my app"
            />
            <ScrollToTop /> {/* Good placement */}
            {/* Removed <Suspense> component here */}
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
                <Route path="/recruiter/request-reset" element={<RequestResetRecruteur />} />

                {/* Main Pages */}
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
                <Route path="/AdminSidebar " element={<AdminSidebar  />} />
                {/* Role Choice Page */}
                <Route path="/edit-profile" element={<EditProfile />} />
                {/* Role Choice Page */}
                <Route path="/ChoixRole" element={<ChoixRole />} />
                <Route path="/ChoixRole2" element={<ChoixRole2 />} />

                {/* Login Pages */}
                <Route path="/login/candidat" element={<LoginCandidat />} />
                <Route path="/LoginRecruteur" element={<LoginRecruteur />} />

                {/* Registration Pages */}
                <Route path="/register/candidat" element={<RegisterCandidate />} />
                <Route path="/register/recruteur" element={<RegisterRecruiter />} />
                <Route path="/CandidatePagefrom" element={<CandidatePagefrom />} />
                <Route path="/candidate-profile" element={<CandidateProfile />} />
                <Route path="/RecruiterProfile" element={<RecruiterProfile />} />
                <Route path="/JobCardss" element={<JobCardss />} />
                <Route path="/applications" element={<CandidateApplications />} />

                <Route path="/RecruiterJobOffers" element={<RecruiterJobOffers />} />
                <Route path="/JobOfferForm" element={<JobOfferForm />} />
                <Route path="/EditRecruiterProfile" element={<EditRecruiterProfile />} />
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
