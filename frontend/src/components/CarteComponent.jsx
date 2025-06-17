import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icon for recruiters
const recruiterIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function OptimizedCarteComponent() {
  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [geocodingProgress, setGeocodingProgress] = useState({ current: 0, total: 0 });
  
  // Default coordinates for Casablanca
  const casablancaCoords = [33.573110, -7.589843];

  // Geocoding cache to avoid repeated API calls
  const geocodeCache = new Map();

  const geocodeAddress = async (address) => {
    // Check cache first
    if (geocodeCache.has(address)) {
      return geocodeCache.get(address);
    }

    try {
      const encodedAddress = encodeURIComponent(
        address.includes('Maroc') ? address : `${address}, Maroc`
      );
      
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1`,
        {
          headers: {
            'User-Agent': 'CasaJobs-Website/1.0'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data && data.length > 0) {
        const result = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
        geocodeCache.set(address, result);
        return result;
      }
      
      return null;
    } catch (error) {
      console.error(`Geocoding error for address "${address}":`, error);
      return null;
    }
  };

  const processGeocodingBatch = async (recruiters, batchSize = 3) => {
    const results = [];
    
    for (let i = 0; i < recruiters.length; i += batchSize) {
      const batch = recruiters.slice(i, i + batchSize);
      
      const batchPromises = batch
        .filter(recruiter => recruiter.address && recruiter.address.trim() !== '')
        .map(async (recruiter) => {
          const coordinates = await geocodeAddress(recruiter.address);
          setGeocodingProgress(prev => ({ ...prev, current: prev.current + 1 }));
          
          if (coordinates) {
            return { ...recruiter, coordinates };
          }
          return null;
        });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults.filter(result => result !== null));
      
      // Short delay between batches to respect rate limits
      if (i + batchSize < recruiters.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    return results;
  };

  useEffect(() => {
    const fetchRecruiters = async () => {
      try {
        setLoading(true);
        
        // Simulate API call - replace with your actual API
        const mockRecruiters = [
          { id: 1, companyName: "TechCorp", name: "Ahmed Benali", address: "Casablanca, Maroc" },
          { id: 2, companyName: "DataSoft", name: "Fatima Zahra", address: "Rabat, Maroc" },
          { id: 3, companyName: "WebAgency", name: "Youssef Alami", address: "Marrakech, Maroc" },
          { id: 4, companyName: "StartupHub", name: "Laila Benjelloun", address: "Agadir, Maroc" },
          { id: 5, companyName: "ConsultingPro", name: "Omar Tazi", address: "Tanger, Maroc" }
        ];

        // Set initial progress
        setGeocodingProgress({ 
          current: 0, 
          total: mockRecruiters.filter(r => r.address && r.address.trim() !== '').length 
        });

        console.log('Fetched recruiters:', mockRecruiters);
        
        // Process geocoding in batches
        const geocodedRecruiters = await processGeocodingBatch(mockRecruiters);
        
        console.log('Recruiters with coordinates:', geocodedRecruiters);
        setRecruiters(geocodedRecruiters);
        
      } catch (err) {
        console.error("Error fetching recruiters:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecruiters();
  }, []);

  const LoadingSpinner = () => (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 20px',
      backgroundColor: '#111111',
      borderRadius: '20px',
      border: '1px solid #333333'
    }}>
      <div style={{
        width: '50px',
        height: '50px',
        border: '3px solid #333333',
        borderTop: '3px solid #ff6b35',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        marginBottom: '20px'
      }}></div>
      <p style={{ color: '#ffffff', fontSize: '1.2rem', margin: '0 0 10px 0' }}>
        Chargement de la carte...
      </p>
      {geocodingProgress.total > 0 && (
        <p style={{ color: '#cccccc', fontSize: '0.9rem', margin: '0' }}>
          Géocodage des adresses: {geocodingProgress.current} / {geocodingProgress.total}
        </p>
      )}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
  
  if (loading) return <LoadingSpinner />;
  
  if (error) return (
    <div style={{
      padding: '60px 20px',
      backgroundColor: '#111111',
      borderRadius: '20px',
      border: '1px solid #ff6b35',
      textAlign: 'center'
    }}>
      <p style={{ color: '#ff6b35', fontSize: '1.2rem', margin: '0' }}>
        Erreur lors du chargement de la carte: {error.message}
      </p>
    </div>
  );
  
  return (
    <div className="carte-section" style={{ 
      maxWidth: '1200px', 
      margin: '40px auto', 
      padding: '0 20px'
    }}>
      <h2 style={{
        textAlign: "center",
        marginBottom: "60px",
        fontSize: 'clamp(2rem, 4vw, 3rem)',
        fontWeight: '700',
        background: 'linear-gradient(135deg, #ffffff 0%, #ff6b35 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        lineHeight: '1.2'
      }}>
        Adresses de nos recruteurs
      </h2>
      
      <div style={{ 
        height: '500px', 
        width: '100%', 
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <MapContainer 
          center={casablancaCoords} 
          zoom={6} 
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
          scrollWheelZoom={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {/* Central marker for Casablanca */}
          <Marker position={casablancaCoords}>
            <Popup>
              <div style={{ textAlign: 'center' }}>
                <strong>Casablanca</strong>
                <p>Centre économique du Maroc</p>
              </div>
            </Popup>
          </Marker>
          
          {/* Markers for each recruiter */}
          {recruiters.map((recruiter, index) => (
            <Marker 
              key={recruiter.id || index}
              position={recruiter.coordinates}
              icon={recruiterIcon}
            >
              <Popup>
                <div style={{ minWidth: '200px' }}>
                  <strong style={{ color: '#ff6b35', fontSize: '1.1rem' }}>
                    {recruiter.companyName}
                  </strong>
                  <p style={{ margin: '8px 0 4px 0', fontWeight: '500' }}>
                    <strong>Contact:</strong> {recruiter.name}
                  </p>
                  <p style={{ margin: '4px 0', color: '#666' }}>
                    <strong>Adresse:</strong> {recruiter.address}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {recruiters.length > 0 && (
        <div style={{
          marginTop: '20px',
          textAlign: 'center',
          color: '#cccccc',
          fontSize: '0.9rem'
        }}>
          {recruiters.length} recruteur{recruiters.length > 1 ? 's' : ''} localisé{recruiters.length > 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}
