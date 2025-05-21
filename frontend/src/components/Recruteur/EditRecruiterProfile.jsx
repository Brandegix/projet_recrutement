import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbara";
import Footer from "../Footer";

function EditRecruiterProfile() {
    const [profile, setProfile] = useState({
        companyName: '',
        email: '',
        description: '',
        phoneNumber: '',
        address: '',
        name: '',
        creationDate: '',
    });

    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/api/recruiter/profile`, {
            credentials: "include",
        })
            .then((res) => res.json())
            .then((data) => setProfile(data));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile({
            ...profile,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/recruiter/update_profile`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(profile),
        });

        if (res.ok) {
            const updatedProfile = await res.json();
            setProfile(updatedProfile);
            navigate("/RecruiterProfile");
        } else {
            alert("Erreur lors de la mise à jour");
        }
    };

    return (
        <div style={{ backgroundColor: '#f4f6f8', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}> {/* Removed alignItems: 'center' here */}
            <Navbar />
            <div
                style={{
                    backgroundColor: "#fff",
                    padding: "40px",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                    maxWidth: "800px",
                    width: "90%",
                    margin: "40px auto",
                    fontFamily: "'Arial', sans-serif",
                    boxSizing: "border-box",
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center', // Keep centering for the content within the white container
                }}
            >
                <h2 style={{ color: "#ff6b00", fontSize: "28px", fontWeight: "bold", marginBottom: "30px", textAlign: 'center' }}>
                    Modifier votre profil recruteur
                </h2>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
                    <div style={{ width: '100%' }}>
                        <label htmlFor="name" style={styles.label}>Nom</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={profile.name}
                            onChange={handleChange}
                            placeholder="Votre nom"
                            style={styles.input}
                        />
                    </div>

                    <div style={{ width: '100%' }}>
                        <label htmlFor="email" style={styles.label}>Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={profile.email}
                            onChange={handleChange}
                            placeholder="Votre adresse email"
                            style={styles.input}
                        />
                    </div>

                    <div style={{ width: '100%' }}>
                        <label htmlFor="companyName" style={styles.label}>Entreprise</label>
                        <input
                            type="text"
                            id="companyName"
                            name="companyName"
                            value={profile.companyName}
                            onChange={handleChange}
                            placeholder="Nom de l'entreprise"
                            style={styles.input}
                        />
                    </div>

                    <div style={{ width: '100%' }}>
                        <label htmlFor="phoneNumber" style={styles.label}>Téléphone</label>
                        <input
                            type="tel"
                            id="phoneNumber"
                            name="phoneNumber"
                            value={profile.phoneNumber}
                            onChange={handleChange}
                            placeholder="Numéro de téléphone"
                            style={styles.input}
                        />
                    </div>

                    <div style={{ width: '100%' }}>
                        <label htmlFor="description" style={styles.label}>Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={profile.description}
                            onChange={handleChange}
                            placeholder="Description de l'entreprise"
                            rows={5}
                            style={styles.textarea}
                        />
                    </div>

                    <button type="submit" style={styles.button}>
                        Enregistrer
                    </button>
                </form>
            </div>
            <Footer />
        </div>
    );
}

const styles = {
    label: {
        display: "block",
        color: "#333",
        marginBottom: "8px",
        fontWeight: "bold",
    },
    input: {
        width: "100%",
        padding: "12px",
        borderRadius: "6px",
        border: "1px solid #ddd",
        fontSize: "16px",
        boxSizing: "border-box",
        marginBottom: "15px",
    },
    textarea: {
        width: "100%",
        padding: "12px",
        borderRadius: "6px",
        border: "1px solid #ddd",
        fontSize: "16px",
        boxSizing: "border-box",
        marginBottom: "15px",
        resize: "vertical",
        fontFamily: "'Arial', sans-serif",
    },
    button: {
        backgroundColor: "#ff6b00",
        color: "#fff",
        padding: "14px 28px",
        border: "none",
        borderRadius: "6px",
        fontSize: "18px",
        cursor: "pointer",
        transition: "background-color 0.3s ease",
        fontWeight: "bold",
        alignSelf: 'center',
    },
};

export default EditRecruiterProfile;