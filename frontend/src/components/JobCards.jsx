import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaBriefcase, FaSearch, FaFilter, FaChevronLeft, FaChevronRight, FaEllipsisH } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const JobCard = ({ job }) => {
  const navigate = useNavigate();
  const handleApplyClick = () => {
    navigate('/login/candidat');
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%)',
      border: '1px solid #333',
      borderRadius: '20px',
      padding: '25px',
      marginBottom: '20px',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      position: 'relative',
      overflow: 'hidden'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-5px)';
      e.currentTarget.style.boxShadow = '0 20px 40px rgba(255, 107, 53, 0.1)';
      e.currentTarget.style.borderColor = '#ff6b35';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'none';
      e.currentTarget.style.borderColor = '#333';
    }}>
      
      {/* Gradient accent line */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: 'linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)'
      }} />
      
      {/* Company Logo - Now at top center */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '20px'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '12px',
          overflow: 'hidden',
          border: '2px solid #333'
        }}>
          <img
            src={job.logo && job.logo.startsWith("http")
              ? job.logo
              : "https://dummyimage.com/80x80/333/fff.png&text=" + (job.company ? job.company.charAt(0) : 'C')}
            alt={job.logo ? "Logo de l'entreprise" : "Logo par défaut"}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </div>
      </div>
      
      {/* Job Title and Company - Now centered */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h3 style={{
          color: '#ffffff',
          fontSize: '1.3rem',
          fontWeight: '600',
          margin: '0 0 8px 0',
          lineHeight: '1.3'
        }}>
          {job.title}
        </h3>
        <p style={{
          color: '#cccccc',
          fontSize: '1rem',
          margin: '0 0 15px 0',
          fontWeight: '500'
        }}>
          {job.company}
        </p>
        
        {/* Job Type Badge */}
        <span style={{
          background: 'rgba(255, 107, 53, 0.1)',
          color: '#ff6b35',
          padding: '6px 15px',
          borderRadius: '20px',
          fontSize: '0.85rem',
          fontWeight: '600',
          border: '1px solid rgba(255, 107, 53, 0.3)',
          display: 'inline-block'
        }}>
          {job.type}
        </span>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginBottom: '15px', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cccccc' }}>
            <FaMapMarkerAlt style={{ color: '#ff6b35' }} />
            <span>{job.location}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cccccc' }}>
            <FaBriefcase style={{ color: '#ff6b35' }} />
            <span>{job.experience}</span>
          </div>
        </div>
        
        <p style={{
          color: '#aaaaaa',
          fontSize: '0.95rem',
          lineHeight: '1.6',
          margin: '0 0 15px 0',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          textAlign: 'center'
        }}>
          {job.description}
        </p>
        
        {job.skills && job.skills.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '15px', justifyContent: 'center' }}>
            {job.skills.map((skill, index) => (
              <span key={index} style={{
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#ffffff',
                padding: '4px 12px',
                borderRadius: '15px',
                fontSize: '0.8rem',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Apply Button - Now full width */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button 
          onClick={handleApplyClick}
          style={{
            background: 'linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)',
            color: '#ffffff',
            border: 'none',
            padding: '15px 0',
            borderRadius: '25px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            width: '100%',
            maxWidth: '280px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 10px 20px rgba(255, 107, 53, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          Postuler
        </button>
      </div>
    </div>
  );
};

export default JobCards;
