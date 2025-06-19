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
      padding: '0',
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
      
      {/* Header with gradient background and logo */}
      <div style={{
        background: 'linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)',
        padding: '3px',
        borderRadius: '20px 20px 0 0'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%)',
          padding: '20px',
          borderRadius: '17px 17px 0 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flex: 1 }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '12px',
              overflow: 'hidden',
              border: '2px solid #333',
              flexShrink: 0
            }}>
              <img
                src={job.logo && job.logo.startsWith("http")
                  ? job.logo
                  : "https://dummyimage.com/60x60/333/fff.png&text=" + (job.company ? job.company.charAt(0) : 'C')}
                alt={job.logo ? "Logo de l'entreprise" : "Logo par défaut"}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3 style={{
                color: '#ffffff',
                fontSize: '1.3rem',
                fontWeight: '600',
                margin: '0 0 5px 0',
                lineHeight: '1.3'
              }}>
                {job.title}
              </h3>
              <p style={{
                color: '#cccccc',
                fontSize: '1rem',
                margin: '0',
                fontWeight: '500'
              }}>
                {job.company}
              </p>
            </div>
          </div>
          
          <span style={{
            background: 'rgba(255, 107, 53, 0.1)',
            color: '#ff6b35',
            padding: '6px 15px',
            borderRadius: '20px',
            fontSize: '0.85rem',
            fontWeight: '600',
            border: '1px solid rgba(255, 107, 53, 0.3)',
            flexShrink: 0,
            marginLeft: '10px'
          }}>
            {job.type}
          </span>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '25px' }}>
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginBottom: '15px' }}>
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
          }}>
            {job.description}
          </p>
          
          {job.skills && job.skills.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
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

        {/* Wide Apply Button - salary removed */}
        <button 
          onClick={handleApplyClick}
          style={{
            background: 'linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)',
            color: '#ffffff',
            border: 'none',
            padding: '15px 25px',
            borderRadius: '25px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            width: '100%'
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
