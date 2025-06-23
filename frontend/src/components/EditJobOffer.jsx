import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbara";
import Footer from "../components/Footer";

const EditJobOffer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState({ title: "", company: "", location: "", salary: "", description: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/job_offers/${id}`);
        if (res.ok) {
          const data = await res.json();
          setJob(data);
        } else {
          setGeneralError("Erreur lors du chargement de l'offre.");
        }
      } catch (err) {
        console.error("Erreur lors du chargement de l'offre:", err);
        setGeneralError("Erreur de connexion. Veuillez réessayer.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleUpdate = async () => {
    setIsSaving(true);
    setGeneralError("");
    setSuccessMessage("");
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/job_offers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(job),
      });
      if (res.ok) {
        setSuccessMessage("Offre mise à jour avec succès !");
        setTimeout(() => navigate("/ManageJobs"), 1500); // Navigate after a short delay
      } else {
        const errorData = await res.json();
        setGeneralError(errorData.message || "Erreur lors de la modification de l'offre.");
      }
    } catch (err) {
      console.error("Erreur lors de la modification:", err);
      setGeneralError("Erreur de connexion. Veuillez réessayer.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{
        backgroundColor: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
        color: '#1a202c'
      }}>
        <Navbar />
        <main style={{
          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '80px 20px'
        }}>
          <div style={{
            position: 'relative', width: '70px', height: '70px', marginBottom: '25px',
          }}>
            <div style={{
              position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
              border: '4px solid transparent', borderTop: '4px solid #ff6b35', borderRadius: '50%',
              animation: 'spin 1s linear infinite' /* Note: pure inline CSS cannot define @keyframes */
            }}></div>
          </div>
          <div style={{ fontSize: '1.2rem', color: '#475569', fontWeight: '500' }}>
            Chargement de l'offre...
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
      color: '#1a202c'
    }}>
      <Navbar />
      <main style={{
        flex: 1, padding: '40px 20px', display: 'flex', justifyContent: 'center', alignItems: 'flex-start'
      }}>
        <div style={{
          backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
          maxWidth: '600px', width: '100%', overflow: 'hidden', border: '1px solid #e2e8f0',
          animation: 'fadeIn 0.5s ease-out' /* Note: pure inline CSS cannot define @keyframes */
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #ff8c42 0%, #ff6b35 100%)', padding: '30px 25px',
            textAlign: 'center', color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <h1 style={{
              fontSize: '2.2rem', fontWeight: '700', margin: 0, letterSpacing: '-0.02em'
            }}>
              Modifier Offre d'Emploi
            </h1>
          </div>

          <form style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {successMessage && (
              <div style={{
                backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a',
                padding: '12px 16px', borderRadius: '8px', fontSize: '0.95rem',
                display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 2px 8px rgba(0,128,0,0.08)'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
                  <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="currentColor"/>
                </svg>
                {successMessage}
              </div>
            )}
            {generalError && (
              <div style={{
                backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626',
                padding: '12px 16px', borderRadius: '8px', fontSize: '0.95rem',
                display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 2px 8px rgba(255,0,0,0.08)'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
                  <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="currentColor"/>
                </svg>
                {generalError}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label htmlFor="title" style={{ fontSize: '0.95rem', fontWeight: '600', color: '#374151' }}>Titre du Poste</label>
              <input
                type="text"
                id="title"
                value={job.title}
                onChange={(e) => setJob({...job, title: e.target.value})}
                placeholder="Ex: Développeur Full Stack"
                style={{
                  padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1',
                  fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s',
                  boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)'
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label htmlFor="company" style={{ fontSize: '0.95rem', fontWeight: '600', color: '#374151' }}>Entreprise</label>
              <input
                type="text"
                id="company"
                value={job.company}
                onChange={(e) => setJob({...job, company: e.target.value})}
                placeholder="Ex: Ma Super Entreprise"
                style={{
                  padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1',
                  fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s',
                  boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)'
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label htmlFor="location" style={{ fontSize: '0.95rem', fontWeight: '600', color: '#374151' }}>Localisation</label>
              <input
                type="text"
                id="location"
                value={job.location}
                onChange={(e) => setJob({...job, location: e.target.value})}
                placeholder="Ex: Paris, France (télétravail accepté)"
                style={{
                  padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1',
                  fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s',
                  boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)'
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label htmlFor="salary" style={{ fontSize: '0.95rem', fontWeight: '600', color: '#374151' }}>Salaire (Optionnel)</label>
              <input
                type="number"
                id="salary"
                value={job.salary || ''}
                onChange={(e) => setJob({...job, salary: e.target.value})}
                placeholder="Ex: 45000"
                style={{
                  padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1',
                  fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s',
                  boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)'
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label htmlFor="description" style={{ fontSize: '0.95rem', fontWeight: '600', color: '#374151' }}>Description du Poste</label>
              <textarea
                id="description"
                value={job.description || ''}
                onChange={(e) => setJob({...job, description: e.target.value})}
                placeholder="Décrivez les responsabilités, les compétences requises, les avantages..."
                rows="6"
                style={{
                  padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1',
                  fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s',
                  boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)', resize: 'vertical', minHeight: '120px'
                }}
              ></textarea>
            </div>


            <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end', paddingTop: '15px' }}>
              <button
                type="button"
                onClick={() => navigate("/ManageJobs")}
                style={{
                  padding: '10px 20px', borderRadius: '8px', border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff', color: '#475569', fontSize: '0.95rem', fontWeight: '600',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor"/>
                </svg>
                Annuler
              </button>
              <button
                type="button"
                onClick={handleUpdate}
                disabled={isSaving}
                style={{
                  padding: '10px 20px', borderRadius: '8px', border: 'none',
                  background: isSaving ? 'linear-gradient(135deg, #ff8c42 0%, #ff6b35 100%)' : 'linear-gradient(135deg, #ff8c42 0%, #ff6b35 100%)',
                  color: '#ffffff', fontSize: '0.95rem', fontWeight: '600', cursor: isSaving ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 10px rgba(255, 107, 53, 0.3)', opacity: isSaving ? 0.7 : 1
                }}
              >
                {isSaving ? (
                  <>
                    <div style={{
                      width: '16px', height: '16px', border: '2px solid transparent',
                      borderTop: '2px solid currentColor', borderRadius: '50%', animation: 'spin 1s linear infinite'
                    }}></div>
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17 3H7C5.9 3 5 3.9 5 5V19C5 20.1 5.9 21 7 21H17C18.1 21 19 20.1 19 19V5C19 3.9 18.1 3 17 3ZM17 19H7V5H17V19ZM16 10H8V8H16V10Z" fill="currentColor"/>
                    </svg>
                    Enregistrer
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EditJobOffer;
