import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { ThemeProvider } from './context/ThemeContext';

// Pages
import Dashboard from './pages/Dashboard';
import Landing from './pages/Landing';
import CropDoctor from './pages/CropDoctor';
import VoiceAssistant from './pages/VoiceAssistant';
import Market from './pages/Market';
import MapPage from './pages/MapPage';
import Auth from './pages/Auth';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Landing />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="doctor" element={<CropDoctor />} />
              <Route path="voice" element={<VoiceAssistant />} />
              <Route path="market" element={<Market />} />
              <Route path="map" element={<MapPage />} />
              <Route path="auth" element={<Auth />} />
            </Route>
          </Routes>
        </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
