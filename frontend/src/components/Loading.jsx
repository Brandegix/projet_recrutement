const Loading = ({ message = "⏳ Chargement..." }) => {
  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'linear-gradient(135deg, #0a0a0a, #1a1a1a)',
    backdropFilter: 'blur(6px)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  };

  const spinnerStyle = {
    width: '60px',
    height: '60px',
    border: '6px solid #333',
    borderTop: '6px solid #ff6b35',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '20px',
  };

  const textStyle = {
    fontSize: '1.2rem',
    color: '#f8f9fa',
    fontWeight: 500,
    letterSpacing: '0.5px',
    textAlign: 'center',
  };

  return (
    <>
      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
      <div style={overlayStyle}>
        <div style={spinnerStyle}></div>
        <p style={textStyle}>{message}</p>
      </div>
    </>
  );
};

export default Loading;
