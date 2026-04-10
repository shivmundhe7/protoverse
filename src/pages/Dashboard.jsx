import React, { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import { CloudRain, Droplets, Sprout, AlertTriangle, CheckCircle, Thermometer } from 'lucide-react';
import { fetchWeather, predictSoilHealth, generateAIAlert } from '../api/index';
import { useLanguage } from '../context/LanguageContext';

export default function Dashboard() {
  const { t } = useLanguage();
  const [weatherData, setWeatherData] = useState(null);
  const [soilData, setSoilData] = useState(null);
  const [alertData, setAlertData] = useState(null);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const weatherResponse = await fetchWeather('Pune'); // Defaulting to Pune for Agricultural context
        setWeatherData(weatherResponse.data);
        
        // Predict software-based soil metrics
        const soilResponse = await predictSoilHealth(weatherResponse.data, 'Pune');
        setSoilData(soilResponse.data);

        // Generate AI alert mapping
        const alertResponse = await generateAIAlert(weatherResponse.data);
        setAlertData(alertResponse.data);
      } catch (error) {
        console.error("Failed to load dashboard data");
      }
    };
    loadData();
  }, []);

  const [showAlertDetails, setShowAlertDetails] = useState(false);

  return (
    <div className="space-y-10 animate-slide-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">{t('dash.title')}</h1>
          <p className="text-xl text-gray-500 dark:text-gray-400 mt-2 font-medium">{t('dash.subtitle')}</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-agreen-500/10 rounded-2xl border border-agreen-500/20">
          <div className="w-2 h-2 rounded-full bg-agreen-500 animate-pulse"></div>
          <span className="text-sm font-bold text-agreen-700 dark:text-agreen-400 tracking-wide uppercase">Live Monitoring</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Weather Card */}
        <Card className="relative overflow-hidden group border-none shadow-2xl shadow-blue-500/5 hover:shadow-blue-500/20">
          <div className="absolute -top-6 -right-6 p-4 opacity-5 group-hover:opacity-10 transition-all duration-500 group-hover:scale-110 group-hover:-rotate-12">
            <CloudRain className="w-40 h-40 text-blue-500" />
          </div>
          <div className="flex items-center gap-4 mb-6 relative z-10">
            <div className="p-4 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl text-white shadow-lg shadow-blue-500/30">
              <CloudRain className="w-6 h-6" />
            </div>
            <h3 className="font-black text-xl text-gray-900 dark:text-white">{t('dash.weather')}</h3>
          </div>
          {weatherData ? (
            <div className="relative z-10 space-y-2">
              <div className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter">{weatherData.temp}°C</div>
              <p className="text-lg font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">{weatherData.condition}</p>
              <div className="pt-4 flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 w-fit px-3 py-1 rounded-lg">
                <Droplets className="w-4 h-4" /> Humidity: {weatherData.humidity}%
              </div>
            </div>
          ) : (
            <div className="animate-pulse space-y-4">
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-2xl w-24"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-xl w-32"></div>
            </div>
          )}
        </Card>

        {/* Soil Health Card */}
        <Card className="relative overflow-hidden group border-none shadow-2xl shadow-amber-500/5 hover:shadow-amber-500/20">
          <div className="absolute -top-6 -right-6 p-4 opacity-5 group-hover:opacity-10 transition-all duration-500 group-hover:scale-110 group-hover:-rotate-12">
            <Sprout className="w-40 h-40 text-amber-500" />
          </div>
          <div className="flex items-center gap-4 mb-6 relative z-10">
            <div className="p-4 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl text-white shadow-lg shadow-amber-500/30">
              <Sprout className="w-6 h-6" />
            </div>
            <h3 className="font-black text-xl text-gray-900 dark:text-white">{t('dash.soil')}</h3>
          </div>
          {soilData ? (
            <div className="relative z-10">
              <div className={`text-3xl font-black tracking-tight ${soilData.status === 'Optimal' ? 'text-agreen-600 dark:text-agreen-400' : 'text-amber-600 dark:text-amber-400'}`}>
                {soilData.status}
              </div>
              <div className="space-y-3 mt-6">
                <div className="flex justify-between items-center p-2 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                  <span className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nitrogen</span>
                  <span className={`text-sm font-black ${soilData.nitrogen === 'Sufficient' ? 'text-green-500' : 'text-amber-500'}`}>
                    {soilData.nitrogen}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                  <span className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">pH Level</span>
                  <span className="text-sm font-black text-gray-900 dark:text-gray-100">{soilData.ph}</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-amber-600/60 font-black uppercase tracking-widest mt-4">
                  <div className="w-1 h-1 rounded-full bg-amber-400 animate-ping"></div>
                  Software Predicted
                </div>
              </div>
            </div>
          ) : (
            <div className="animate-pulse space-y-4">
               <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-2xl w-32"></div>
               <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-2xl w-full"></div>
            </div>
          )}
        </Card>

        {/* Irrigation Card */}
        <Card className="relative overflow-hidden group border-none shadow-2xl shadow-cyan-500/5 hover:shadow-cyan-500/20">
          <div className="absolute -top-6 -right-6 p-4 opacity-5 group-hover:opacity-10 transition-all duration-500 group-hover:scale-110 group-hover:-rotate-12">
            <Droplets className="w-40 h-40 text-cyan-500" />
          </div>
          <div className="flex items-center gap-4 mb-6 relative z-10">
            <div className="p-4 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-2xl text-white shadow-lg shadow-cyan-500/30">
              <Droplets className="w-6 h-6" />
            </div>
            <h3 className="font-black text-xl text-gray-900 dark:text-white">{t('dash.irrigation')}</h3>
          </div>
          <div className="relative z-10 space-y-4">
            <div>
              <div className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Water Today</div>
              <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-wider">Based on 32°C Forecast</p>
            </div>
            <div className="pt-4">
              <button className="w-full py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-black rounded-2xl transition-all shadow-lg shadow-cyan-500/20 active:scale-95">
                Start Pump Now →
              </button>
            </div>
          </div>
        </Card>

        {/* Alerts Card */}
        <Card className={`relative overflow-hidden group border-none shadow-2xl transition-all duration-500 ${
          alertData?.isCritical 
            ? 'bg-gradient-to-br from-red-500/10 to-transparent dark:from-red-900/20 shadow-red-500/5 hover:shadow-red-500/20' 
            : 'bg-gradient-to-br from-agreen-500/10 to-transparent dark:from-agreen-900/20 shadow-agreen-500/5 hover:shadow-agreen-500/20'
        }`}>
          <div className="absolute -top-6 -right-6 p-4 opacity-5 group-hover:opacity-10 transition-all duration-500 group-hover:scale-110 group-hover:-rotate-12">
            {alertData?.isCritical ? <AlertTriangle className="w-40 h-40 text-red-500" /> : <CheckCircle className="w-40 h-40 text-agreen-500" />}
          </div>
          <div className="flex items-center gap-4 mb-6 relative z-10">
            <div className={`p-4 rounded-2xl text-white shadow-lg ${
              alertData?.isCritical 
                ? 'bg-gradient-to-br from-red-400 to-red-600 shadow-red-500/30' 
                : 'bg-gradient-to-br from-agreen-400 to-agreen-600 shadow-agreen-500/30'
            }`}>
              {alertData?.isCritical ? <AlertTriangle className="w-6 h-6" /> : <CheckCircle className="w-6 h-6" />}
            </div>
            <h3 className="font-black text-xl text-gray-900 dark:text-white">AI Insights</h3>
          </div>
          {alertData ? (
            <div className="relative z-10 space-y-4">
              <div>
                <div className={`text-lg font-black leading-tight ${alertData.isCritical ? 'text-red-600 dark:text-red-400' : 'text-agreen-600 dark:text-agreen-400'}`}>
                  {alertData.title}
                </div>
                <p className="text-sm font-bold text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
                  {alertData.description}
                </p>
              </div>
              <div className="pt-2">
                <button 
                  onClick={() => setShowAlertDetails(!showAlertDetails)}
                  className={`w-full py-2 text-sm font-black rounded-xl transition-all border-2 ${
                    alertData.isCritical 
                      ? 'border-red-500/20 text-red-600 hover:bg-red-500 hover:text-white' 
                      : 'border-agreen-500/20 text-agreen-600 hover:bg-agreen-500 hover:text-white'
                  }`}
                >
                  {showAlertDetails ? 'Hide Analysis' : 'Deep Analysis'}
                </button>
              </div>
              
              {showAlertDetails && (
                <div className={`mt-4 p-4 rounded-2xl text-sm border-2 animate-slide-up ${
                    alertData.isCritical 
                      ? 'bg-red-500/5 border-red-500/10 text-red-800 dark:text-red-200' 
                      : 'bg-agreen-500/5 border-agreen-500/10 text-agreen-800 dark:text-agreen-200'
                }`}>
                  <h4 className="font-black uppercase tracking-widest text-[10px] mb-3 opacity-60">System Context</h4>
                  <ul className="space-y-2">
                    <li className="flex justify-between font-bold">
                      <span className="opacity-60">Recorded Temp</span>
                      <span>{weatherData?.temp}°C</span>
                    </li>
                    <li className="flex justify-between font-bold">
                      <span className="opacity-60">Environment</span>
                      <span>{weatherData?.condition}</span>
                    </li>
                    <li className="flex justify-between font-bold">
                      <span className="opacity-60">Risk Level</span>
                      <span className={alertData.isCritical ? 'text-red-500' : 'text-agreen-500'}>{alertData.isCritical ? 'CRITICAL' : 'MINIMAL'}</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="animate-pulse space-y-4">
               <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-xl w-3/4"></div>
               <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-xl w-full"></div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
