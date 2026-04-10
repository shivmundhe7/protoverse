import React, { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import { Line } from 'react-chartjs-2';
import { TrendingUp, TrendingDown, IndianRupee, Activity, Search, AlertTriangle, ArrowUpRight, ArrowDownRight, MapPin, Info } from 'lucide-react';
import { fetchMarketPrices } from '../api/index';
import { useLanguage } from '../context/LanguageContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Market() {
  const { t } = useLanguage();
  const [selectedCrop, setSelectedCrop] = useState('Wheat');
  const [searchInput, setSearchInput] = useState('');
  const [marketData, setMarketData] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
       const formatted = searchInput.trim().charAt(0).toUpperCase() + searchInput.trim().slice(1).toLowerCase();
       setSelectedCrop(formatted);
       setSearchInput('');
    }
  };

  useEffect(() => {
    let isSubscribed = true;
    const fetchLiveStats = async () => {
      setLoading(true);
      try {
        const result = await fetchMarketPrices(selectedCrop);
        if (isSubscribed) {
          setMarketData(result.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isSubscribed) setLoading(false);
      }
    };
    fetchLiveStats();
    
    return () => { isSubscribed = false; };
  }, [selectedCrop]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      y: {
        grid: { color: 'rgba(156, 163, 175, 0.1)' },
        border: { display: false }
      },
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { maxTicksLimit: 10 }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  const data = {
    labels: marketData ? marketData.labels : [],
    datasets: [
      {
        fill: true,
        label: `${selectedCrop} Mandi Price (₹ / Q)`,
        data: marketData ? marketData.trends : [],
        borderColor: '#3a9166',
        backgroundColor: 'rgba(58, 145, 102, 0.1)',
        tension: 0.4,
      },
    ],
    metricPrice: marketData?.latestPrice || 0,
    target: marketData?.targetPrice || 0
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('market.title')}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{t('market.subtitle')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="flex flex-col" style={{ height: '480px' }}>
            <div className="flex flex-col mb-6 gap-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-xl font-semibold">{selectedCrop} Mandi Trend</h2>
                <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-64">
                  <input 
                    type="text" 
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search any crop (e.g., Mustard)" 
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm font-medium rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-agreen-500"
                  />
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <button type="submit" className="hidden">Search</button>
                </form>
              </div>
              
              <div className="flex bg-gray-50 dark:bg-gray-900/50 p-2 rounded-xl overflow-x-auto hide-scrollbar gap-2">
                 {['Wheat', 'Cotton', 'Mustard', 'Garlic', 'Potato', 'Onion', 'Apple', 'Tomato'].map(crop => (
                    <button 
                      key={crop}
                      onClick={() => setSelectedCrop(crop)}
                      className={`whitespace-nowrap px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        selectedCrop === crop 
                          ? 'bg-agreen-500 text-white shadow-md' 
                          : 'text-gray-600 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-800'
                      }`}
                    >
                       {crop}
                    </button>
                 ))}
              </div>
            </div>
            <div className="flex-1 relative">
              {loading ? (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/50 dark:bg-gray-900/50 rounded-xl">
                   <Spinner message={`Fetching live ${selectedCrop} quotes...`} />
                </div>
              ) : null}
              <Line options={options} data={data} />
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className={`text-white border-none relative overflow-hidden transition-colors ${
            !loading && marketData?.trendDirection === -1 
              ? 'bg-gradient-to-br from-amber-500 to-amber-700' 
              : 'bg-gradient-to-br from-agreen-500 to-agreen-700'
          }`}>
            <div className="relative z-10 transition-opacity">
              <div className="flex items-center gap-2 mb-2 opacity-90">
                {!loading && marketData?.trendDirection === -1 ? <TrendingDown className="w-5 h-5" /> : <TrendingUp className="w-5 h-5" />}
                <span className="font-medium text-sm text-center">Live Recommendation</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">
                {loading ? 'Analyzing...' : marketData?.latestPrice ? `₹${marketData.latestPrice} / Quintal` : 'Hold'}
              </h3>
              <p className="text-sm leading-relaxed mb-6 opacity-90">
                {loading ? 'Waiting for secure pipeline handshake with India Mandi infrastructure...' : marketData?.recommendation}
              </p>
              <button className={`w-full font-semibold py-2.5 rounded-xl transition-colors ${
                  !loading && marketData?.trendDirection === -1
                    ? 'bg-white text-amber-700 hover:bg-amber-50'
                    : 'bg-white text-agreen-700 hover:bg-agreen-50'
              }`}>
                View Detailed Report
              </button>
            </div>
            <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
          </Card>

          <Card>
             <div className="flex items-center gap-2 mb-4">
               <Info className="w-5 h-5 text-gray-400" />
               <h3 className="font-semibold">Local Mandi Update</h3>
             </div>
             <div className="space-y-3">
               <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{t('market.price')}</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                  <IndianRupee className="w-5 h-5" />{data.metricPrice}
                </div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{t('market.target')}</div>
                <div className="text-2xl font-bold text-agreen-600 dark:text-agreen-400 flex items-center">
                  <IndianRupee className="w-5 h-5" />{data.target}
                </div>
              </div>
             </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
