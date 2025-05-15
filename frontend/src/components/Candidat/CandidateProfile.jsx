import React, { useEffect, useState } from "react";
import "../../assets/css/CandidateProfile.css";
import Navbar from "../Navbara";
import Footer from "../Footer";
import defaultProfileImage from '../../assets/images/choixRole/recruiter.jpg';
import JobSearchAndOffers from "../JobSearchAndOffers";
import { Link } from "react-router-dom";
import { FaPen } from 'react-icons/fa';

function CandidateProfile() {
  const [candidate, setCandidate] = useState(null);
  const [cvFile, setCvFile] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [applicationCount, setApplicationCount] = useState(0);

  useEffect(() => {
    fetch("http://localhost:5000/api/candidates/profile", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch candidate data");
        return res.json();
      })
      .then(data => {
        if (typeof data.skills === 'string') {
          data.skills = JSON.parse(data.skills);
        }
        setCandidate(data);
      })
      .catch((err) => console.error("Error loading profile:", err));

    fetch("http://localhost:5000/api/getapplicationsCount", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch application count");
        return res.json();
      })
      .then(data => {
        setApplicationCount(data.statistics.application_count);
      })
      .catch((err) => console.error("Error loading application count:", err));
  }, []);

  const handleCvChange = (e) => {
    setCvFile(e.target.files[0]);
  };

  const handleCvUpload = (e) => {
    e.preventDefault();
    if (!cvFile) return;

    const formData = new FormData();
    formData.append("cv", cvFile);

    fetch("http://localhost:5000/api/upload-cv", {
      method: "POST",
      body: formData,
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to upload CV");
        alert("CV uploaded successfully");
        window.location.reload();
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to upload CV");
      });
  };

  const handleProfileImageChange = (e) => {
    setProfileImageFile(e.target.files[0]);
  };

  const handleProfileImageUpload = (e) => {
    e.preventDefault();
    if (!profileImageFile) return;

    const formData = new FormData();
    formData.append("profile_image", profileImageFile);

    fetch("http://localhost:5000/api/upload-profile-image", {
      method: "POST",
      body: formData,
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to upload profile image");
        return res.json();
      })
      .then(data => {
        setCandidate(prevState => ({
          ...prevState,
          profile_image: data.profile_image,
        }));
        alert("Profile image uploaded successfully");
        window.location.reload();
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to upload profile image");
      });
  };

  const staticExperience = "5 years in web development, focused on full-stack applications.";

  return (
    <>
      <Navbar />
      <div className="candidate-profile__page">
        <div className="candidate-profile__container">
          <div className="candidate-profile__header">
            <div className="candidate-profile__picture-container">
              {candidate && candidate.profile_image ? (
                <img
                  src={`http://localhost:5000/uploads/profile_images/${candidate.profile_image}`}
                  alt="Profile"
                  className="candidate-profile__img"
                />
              ) : (
                <img
                  src={defaultProfileImage}
                  alt="Default Profile"
                  className="candidate-profile__img"
                />
              )}
            </div>

            <div className="candidate-profile__info">
              <h2 className="candidate-profile__name">
                {candidate ? candidate.name : "Loading..."}
              </h2>
              <p className="candidate-profile__role">
                Role: Junior Developer
              </p>
              <Link to="/edit-profile" className="candidate-profile__edit-link">
                <FaPen className="candidate-profile__edit-icon" /> Edit Profile
              </Link>
            </div>
          </div>

          <form className="candidate-profile__image-form" onSubmit={handleProfileImageUpload}>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleProfileImageChange} 
              className="candidate-profile__file-input"
            />
            <button className="candidate-profile__upload-btn" type="submit">Upload Profile Image</button>
          </form>

          {candidate && typeof candidate.completion === 'number' && (
            <div className="candidate-profile__completion">
              <h4 className="candidate-profile__completion-title">Profile Completion</h4>
              <progress 
                className="candidate-profile__completion-bar" 
                value={candidate.completion} 
                max="100"
              ></progress>
              <p className="candidate-profile__completion-percent">{candidate.completion}% completed</p>
            </div>
          )}

          <div className="candidate-profile__content-container">
            <div className="candidate-profile__card candidate-profile__details-card">
              <div className="candidate-profile__details">
                <div className="candidate-profile__detail-item">
                  <strong className="candidate-profile__detail-label">Email: </strong>
                  <span className="candidate-profile__detail-value">{candidate ? candidate.email : "Loading..."}</span>
                </div>
                <div className="candidate-profile__detail-item">
                  <strong className="candidate-profile__detail-label">Phone: </strong>
                  <span className="candidate-profile__detail-value">{candidate ? candidate.phoneNumber : "Loading..."}</span>
                </div>
                <div className="candidate-profile__detail-item">
                  <strong className="candidate-profile__detail-label">Address: </strong>
                  <span className="candidate-profile__detail-value">{candidate ? candidate.address : "Loading..."}</span>
                </div>
                <div className="candidate-profile__detail-item">
                  <strong className="candidate-profile__detail-label">Date of Birth: </strong>
                  <span className="candidate-profile__detail-value">{candidate ? candidate.dateOfBirth : "Loading..."}</span>
                </div>
              </div>
            </div>

            <div className="candidate-profile__skills-section">
              <h4 className="candidate-profile__skills-title">Skills</h4>
              {candidate && candidate.skills ? (
                <div className="candidate-profile__skills-graph">
                  {candidate.skills.map((skill) => (
                    <div key={skill.name} className="candidate-profile__skill-item">
                      <span className="candidate-profile__skill-name">{skill.name}</span>
                      <progress 
                        className="candidate-profile__skill-progress" 
                        value={skill.level} 
                        max="100"
                      ></progress>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="candidate-profile__loading-text">Loading skills...</p>
              )}
            </div>
          </div>

          <div className="candidate-profile__card candidate-profile__cv-section">
            <h4 className="candidate-profile__cv-title">Upload Your CV</h4>
            {candidate && candidate.cv_filename ? (
              <div className="candidate-profile__cv-current">
                <p className="candidate-profile__cv-text">
                  Current CV: <a 
                    href={`http://localhost:5000/uploads/${candidate.cv_filename}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="candidate-profile__cv-link"
                  >
                    {candidate.cv_filename}
                  </a>
                </p>
              </div>
            ) : (
              <p className="candidate-profile__cv-text">No CV uploaded yet.</p>
            )}
            <form className="candidate-profile__cv-form" onSubmit={handleCvUpload}>
              <input 
                type="file" 
                accept=".pdf,.doc,.docx" 
                onChange={handleCvChange} 
                className="candidate-profile__file-input"
              />
              <button className="candidate-profile__upload-btn" type="submit">Upload CV</button>
            </form>
          </div>

          <div className="candidate-profile__stats-container">
           
            <div className="candidate-profile__stat-card">
              <h4 className="candidate-profile__stat-title">Applications Sent</h4>
              <p className="candidate-profile__stat-value">{applicationCount}</p>
              <Link to="/applications" className="candidate-profile__applications-link">View my applications</Link>
            </div>
          </div>

          <div className="candidate-profile__card candidate-profile__jobs-section">
            <h3 className="candidate-profile__jobs-title">Explore New Job Offers</h3>
            <JobSearchAndOffers candidateId={candidate ? 1 : null} />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default CandidateProfile;