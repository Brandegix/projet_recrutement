import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
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

export default function CarteComponent() {
  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Default coordinates for Casablanca
  const casablancaCoords = [33.573110, -7.589843];
  
  useEffect(() => {
    const fetchRecruiters = async () => {
      try {
        // Get recruiters from API
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/recruiter-locations`);
        console.log('Fetched recruiters:', response.data);
        
        // Add a delay function to respect Nominatim rate limits
        const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
        
        // Process each recruiter one by one with a delay between requests
        const results = [];
        for (const recruiter of response.data) {
          if (!recruiter.address || recruiter.address.trim() === '') {
            continue;
          }
          
          try {
            // Geocode the address with proper formatting
            const encodedAddress = encodeURIComponent(
              recruiter.address.includes('Maroc') ? recruiter.address : `${recruiter.address}, Maroc`
            );
            
            const geocodeResponse = await axios.get(
              `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1`,
              {
                headers: {
                  'User-Agent': 'CasaJobs-Website/1.0' // Important for Nominatim
                }
              }
            );
            
            console.log(`Geocoding response for ${recruiter.id}:`, geocodeResponse.data);
            
            // Check if we got coordinates
            if (geocodeResponse.data && geocodeResponse.data.length > 0) {
              const lat = parseFloat(geocodeResponse.data[0].lat);
              const lon = parseFloat(geocodeResponse.data[0].lon);
              
              console.log(`Geocoded coordinates for ${recruiter.id}: [${lat}, ${lon}]`);
              
              results.push({
                ...recruiter,
                coordinates: [lat, lon]
              });
            }
            
            // Add a 1-second delay between requests to respect rate limits
            await delay(1000);
          } catch (err) {
            console.error(`Error geocoding address for recruiter ${recruiter.id}:`, err);
          }
        }
        
        console.log('Recruiters with coordinates:', results);
        setRecruiters(results);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching recruiters:", err);
        setError(err);
        setLoading(false);
      }
    };
    
    fetchRecruiters();
  }, []);
  
  if (loading) return <div>Loading map...</div>;
  if (error) return <div>Error loading map: {error.message}</div>;
  
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
            }}>Adresses de nos recruteurs</h2>
      
      <div style={{ 
        height: '500px', 
        width: '100%', 
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <MapContainer 
          center={casablancaCoords} 
          zoom={12} 
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
            <Popup>Casablanca</Popup>
          </Marker>
          
          {/* Markers for each recruiter */}
          {recruiters.map((recruiter, index) => (
            <Marker 
              key={recruiter.id || index}
              position={recruiter.coordinates}
              icon={recruiterIcon}
            >
              <Popup>
                <div>
                  <strong>{recruiter.companyName}</strong>
                  <p><b>Contact:</b> {recruiter.name}</p>
                  <p><b>Adresse:</b> {recruiter.address}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

    </div>
  );
}
