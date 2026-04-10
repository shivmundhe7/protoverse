import React, { useEffect, useRef, useState } from 'react';
import Card from '../components/ui/Card';
import { MapPin, Navigation, Search, AlertTriangle, Route } from 'lucide-react';
import Spinner from '../components/ui/Spinner';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';

export default function MapPage() {
  const { t } = useLanguage();
  const mapRef = useRef(null);
  const [mapEngine, setMapEngine] = useState(null);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Leveraging the user's provided Geoapify integration token.
  const GEOAPIFY_KEY = '16803ef58367423e98bc50a01b52a00c';

  useEffect(() => {
    // 1. Inject Leaflet natively to preserve generic React project capabilities while replacing massive Google maps implementations
    const loadMappingEngine = () => {
      // Prevent reloading
      if (window.L) {
        getUserLocation();
        return;
      }
      
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);

      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => { getUserLocation(); };
      document.head.appendChild(script);
    };

    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const loc = { lat: position.coords.latitude, lng: position.coords.longitude };
            renderMap(loc);
          },
          () => {
            console.warn("Location permission denied. Defaulting to Central API Hub.");
            renderMap({ lat: 28.6139, lng: 77.2090 });
          }
        );
      } else {
        renderMap({ lat: 28.6139, lng: 77.2090 });
      }
    };

    const renderMap = async (location) => {
      if (!mapRef.current || !window.L) return;
      
      // Cleanup to prevent Leaflet "Map already initialized" native crashes on rapid hot-reloads
      const container = window.L.DomUtil.get(mapRef.current);
      if(container != null){
        container._leaflet_id = null;
      }

      const map = window.L.map(mapRef.current, { zoomControl: false }).setView([location.lat, location.lng], 13);
      setMapEngine(map);

      // 2. Wire the mapping tiles directly into the Geoapify API engine generating beautiful visuals without Google!
      window.L.tileLayer(`https://maps.geoapify.com/v1/tile/osm-carto/{z}/{x}/{y}.png?apiKey=${GEOAPIFY_KEY}`, {
        maxZoom: 20,
        attribution: 'Map data © OpenStreetMap & Geoapify'
      }).addTo(map);

      // Center Pin denoting User Hardware
      window.L.marker([location.lat, location.lng])
        .bindPopup('<b>Active Terminal</b>')
        .addTo(map);

      // 3. Directly ping Geoapify Places Endpoint resolving 20KM radial metrics surrounding exact user coordinates
      try {
        const url = `https://api.geoapify.com/v2/places?categories=commercial.marketplace&filter=circle:${location.lng},${location.lat},20000&apiKey=${GEOAPIFY_KEY}`;
        const response = await axios.get(url);
        const features = response.data.features;
        
        if (features && features.length > 0) {
          // Sort explicitly by closest proximity!
          const nearest = features.sort((a,b) => a.properties.distance - b.properties.distance);
          setPlaces(nearest);
          
          nearest.forEach(feature => {
            const coords = feature.geometry.coordinates; // [lng, lat]
            const name = feature.properties.name || "Local Agricultural Market";
            window.L.marker([coords[1], coords[0]])
              .bindPopup(`<b>${name}</b><br/>${feature.properties.city || feature.properties.street || ''}`)
              .addTo(map);
          });
        } else {
          setErrorMsg('No major marketplaces found natively in this strict geographic zone.');
        }
      } catch (err) {
        console.error("Geoapify Connection Refused:", err);
        setErrorMsg('Network anomaly extracting regional nodes. API Key failure or Network Block.');
      }
      setLoading(false);
    };

    loadMappingEngine();
  }, []);

  // 4. Compute filter metrics logically OUTSIDE of the complex JSX Render block
  const filteredPlaces = places.filter(place => {
    const p = place.properties;
    const name = (p.name || p.address_line1 || "Registered Farmers Mandi").toLowerCase();
    const loc = (p.city || p.street || p.county || 'Local Hub').toLowerCase();
    const q = searchQuery.toLowerCase();
    return name.includes(q) || loc.includes(q);
  });

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('map.title')}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{t('map.subtitle')}</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('map.search')}
            className="pl-10 pr-4 py-2 w-full md:w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-agreen-500"
          />
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        <div className="lg:col-span-2 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 relative bg-gray-100 dark:bg-gray-800 shadow-inner z-0">
          
          {loading && !errorMsg && (
             <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm">
                <Spinner message="Connecting active mapping radar..." />
             </div>
          )}

          {/* New Active DOM Layer Map injection. Style must strictly hold an explicit height array context */}
          <div ref={mapRef} className="w-full h-full min-h-[400px]"></div>

        </div>

        <div className="flex flex-col gap-4 overflow-y-auto pr-2 hide-scrollbar">
          {loading && !errorMsg ? (
            <Card className="animate-pulse flex gap-4 h-32 items-center justify-center text-gray-400">Pinging Database...</Card>
          ) : errorMsg ? (
            <Card className="flex flex-col gap-4 items-center justify-center p-8 text-center text-amber-600 bg-amber-50 dark:bg-amber-900/10">
               <AlertTriangle className="w-8 h-8" />
               <p>{errorMsg}</p>
            </Card>
          ) : filteredPlaces.length === 0 && searchQuery ? (
            <Card className="flex items-center justify-center h-32 text-gray-500">No markets match your search keyword.</Card>
          ) : filteredPlaces.map((place, index) => {
             const props = place.properties;
             const name = props.name || props.address_line1 || "Registered Farmers Mandi";
             const dist = props.distance ? (props.distance / 1000).toFixed(1) + ' km' : '';
             
             return (
              <Card key={props.place_id || index} className="cursor-pointer hover:border-agreen-500 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white line-clamp-1">{name}</h3>
                    <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mt-1">
                      <MapPin className="w-4 h-4" />
                      {props.city || props.street || props.county || 'Local Hub'}
                    </div>
                  </div>
                  {dist && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-agreen-50 text-agreen-700 dark:bg-agreen-900/30 dark:text-agreen-400">
                      {dist}
                    </span>
                  )}
                </div>
                <div className="mt-4 flex gap-2">
                  <button 
                    onClick={() => { mapEngine?.setView([place.geometry.coordinates[1], place.geometry.coordinates[0]], 15); }}
                    className="flex-1 btn-outline py-1.5 text-sm flex items-center justify-center gap-2"
                  >
                     <Navigation className="w-4 h-4"/> Track
                  </button>
                  <button 
                    onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${place.geometry.coordinates[1]},${place.geometry.coordinates[0]}`, '_blank')}
                    className="flex-1 btn-primary py-1.5 text-sm flex items-center justify-center gap-2"
                  >
                     <Route className="w-4 h-4"/> Route
                  </button>
                </div>
              </Card>
             );
          })}
        </div>
      </div>
    </div>
  );
}
