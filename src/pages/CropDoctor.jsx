import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import { Upload, X, CheckCircle, AlertTriangle, RefreshCw, Image as ImageIcon } from 'lucide-react';
import { analyzeCropImage, translateText } from '../api/index';
import { useLanguage } from '../context/LanguageContext';

export default function CropDoctor() {
  const { t, currentLang } = useLanguage();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setResult(null); // reset prev result
    }
  };

  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const analyzeImage = () => {
    if (!selectedFile) return;
    setAnalyzing(true);
    setResult(null);
    
    // Create a canvas to resize/compress the image
    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Compress to JPEG with 0.7 quality
        const base64Image = canvas.toDataURL('image/jpeg', 0.7);
        
        try {
          console.log("Calling Plant.id API with compressed image...");
          const response = await analyzeCropImage(base64Image);
          const resData = response.data;
          
          const isPlant = resData.is_plant !== false;
          const plantProb = resData.is_plant_probability;
          
          if (!isPlant || (plantProb !== undefined && plantProb < 0.5)) {
            const disease = await translateText('Not a Plant', currentLang);
            const advice = await translateText('The AI could not confidently identify a plant in this image. Please upload a clear picture of a crop or leaf for diagnosis.', currentLang);
            setResult({ disease, confidence: 0, advice, isCritical: false });
            return;
          }

          const diseaseSuggestion = resData.health_assessment?.diseases?.[0];
          const isHealthy = resData.health_assessment?.is_healthy?.probability > 0.5;
          
          if (isHealthy && !diseaseSuggestion) {
            const disease = await translateText('Healthy Crop', currentLang);
            const advice = await translateText('Your crop appears healthy! Keep up the good work.', currentLang);
            setResult({
              disease,
              confidence: (resData.health_assessment.is_healthy.probability * 100).toFixed(1),
              advice,
              isCritical: false,
            });
          } else if (diseaseSuggestion) {
            const name = diseaseSuggestion.name || 'Unknown Condition';
            let treatment = 'Please consult a local agricultural expert.';
            
            if (diseaseSuggestion.disease_details?.treatment) {
              const t = diseaseSuggestion.disease_details.treatment;
              treatment = Object.values(t).flat().join('. ');
            }
            
            const translatedDisease = await translateText(name, currentLang);
            const translatedAdvice = await translateText(treatment, currentLang);

            setResult({
              disease: translatedDisease,
              confidence: (diseaseSuggestion.probability * 100).toFixed(1),
              advice: translatedAdvice,
              isCritical: diseaseSuggestion.probability > 0.4,
            });
          } else {
             const disease = await translateText('Unable to Identify', currentLang);
             const advice = await translateText('We could not confidently diagnose this crop.', currentLang);
             setResult({ disease, confidence: 0, advice, isCritical: false });
          }
        } catch (error) {
           console.error("Analysis Error:", error);
           const disease = await translateText('Network Error', currentLang);
           const advice = await translateText('The service is currently unavailable. Please check your connection.', currentLang);
           setResult({ disease, confidence: 0, advice, isCritical: true });
        } finally {
          setAnalyzing(false);
        }
      };
    };
    reader.onerror = () => {
      setAnalyzing(false);
      alert("Failed to read file.");
    }
  };

  return (
    <div className="space-y-10 max-w-5xl mx-auto py-10 px-4 animate-slide-up">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-black text-gray-900 dark:text-white tracking-tight">{t('doc.title')}</h1>
        <p className="text-xl text-gray-500 dark:text-gray-400 font-medium max-w-2xl mx-auto">{t('doc.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Upload Section */}
        <Card className="flex flex-col p-10 relative overflow-hidden group border-none shadow-2xl shadow-agreen-500/5 hover:shadow-agreen-500/20">
          <div className="absolute -top-6 -right-6 p-4 opacity-5 group-hover:opacity-10 transition-all duration-500 group-hover:scale-110 group-hover:-rotate-12">
            <Upload className="w-40 h-40 text-agreen-500" />
          </div>
          
          <h2 className="text-2xl font-black mb-8 text-gray-900 dark:text-white flex items-center gap-3">
             <div className="p-3 bg-agreen-500/10 rounded-xl">
               <Upload className="w-6 h-6 text-agreen-600" />
             </div>
             Upload Image
          </h2>
          
          <div 
            className={`flex-1 border-4 border-dashed rounded-[2rem] flex flex-col items-center justify-center p-12 transition-all duration-500 ${
              previewUrl 
                ? 'border-agreen-500 bg-agreen-500/5 shadow-inner' 
                : 'border-gray-200 dark:border-gray-700 hover:border-agreen-500/50 hover:bg-agreen-500/5'
            }`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {previewUrl ? (
              <div className="space-y-6 text-center w-full animate-float">
                <div className="relative inline-block">
                  <img src={previewUrl} alt="Crop Preview" className="max-h-64 mx-auto rounded-[2rem] shadow-2xl object-cover ring-8 ring-white dark:ring-gray-800" />
                  <button 
                    onClick={() => { setPreviewUrl(null); setSelectedFile(null); setResult(null); }}
                    className="absolute -top-4 -right-4 p-3 bg-red-500 text-white rounded-2xl shadow-xl hover:bg-red-600 transition-all hover:scale-110 active:scale-95"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              <label className="cursor-pointer flex flex-col items-center w-full text-center group">
                <div className="p-8 bg-gray-50 dark:bg-gray-800/50 rounded-full mb-6 group-hover:scale-110 transition-transform duration-500">
                  <Upload className="h-16 w-16 text-agreen-400 group-hover:text-agreen-500 transition-colors" />
                </div>
                <p className="text-lg font-bold text-gray-500 dark:text-gray-400">
                  {t('doc.upload_inst')}
                </p>
                <p className="text-sm font-black text-agreen-500/40 dark:text-agreen-500/20 mt-4 uppercase tracking-widest">
                  PNG, JPG, JPEG up to 10MB
                </p>
                <input type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
              </label>
            )}
          </div>

          <button 
            className="btn-primary w-full mt-10 py-5 text-xl"
            disabled={!selectedFile || analyzing}
            onClick={analyzeImage}
          >
            {analyzing ? (
              <div className="flex items-center justify-center gap-3">
                <RefreshCw className="w-6 h-6 animate-spin" />
                Analyzing...
              </div>
            ) : 'Diagnose Crop'}
          </button>
        </Card>

        {/* Results Section */}
        <Card className="flex flex-col p-10 relative overflow-hidden group border-none shadow-2xl shadow-blue-500/5 hover:shadow-blue-500/20">
          <div className="absolute -top-6 -right-6 p-4 opacity-5 group-hover:opacity-10 transition-all duration-500 group-hover:scale-110 group-hover:-rotate-12">
            <CheckCircle className="w-40 h-40 text-blue-500" />
          </div>
          
          <h2 className="text-2xl font-black mb-8 text-gray-900 dark:text-white flex items-center gap-3">
             <div className="p-3 bg-blue-500/10 rounded-xl">
               <CheckCircle className="w-6 h-6 text-blue-600" />
             </div>
             Analysis Result
          </h2>
          
          <div className="flex-1 flex flex-col justify-center min-h-[400px]">
            {analyzing ? (
              <div className="space-y-8 text-center animate-pulse">
                <Spinner />
                <p className="text-xl font-bold text-gray-500 animate-pulse uppercase tracking-widest">AI is identifying patterns...</p>
              </div>
            ) : result ? (
              <div className="space-y-10 animate-slide-up">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-8 h-8 text-agreen-500" />
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white">
                      {t('doc.diagnosis')}
                    </h3>
                  </div>
                  <div className="bg-gradient-to-br from-agreen-400 to-agreen-600 text-white py-2 px-5 rounded-2xl text-lg font-black shadow-lg shadow-agreen-500/25">
                    {result.confidence}% Match
                  </div>
                </div>
                
                <div className="p-8 rounded-[2rem] bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 shadow-xl border border-gray-100 dark:border-gray-700 flex items-start gap-6">
                  <div className={`p-5 rounded-3xl shadow-lg ${
                    result.isCritical 
                      ? 'bg-gradient-to-br from-red-400 to-red-600 text-white shadow-red-500/30' 
                      : 'bg-gradient-to-br from-agreen-400 to-agreen-600 text-white shadow-agreen-500/30'
                  }`}>
                    {result.isCritical ? <AlertTriangle className="w-8 h-8" /> : <CheckCircle className="w-8 h-8" />}
                  </div>
                  <div>
                    <h3 className="font-black text-2xl mb-2 leading-tight">{result.disease}</h3>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-agreen-500 animate-pulse"></div>
                      <p className="text-sm font-black text-gray-400 uppercase tracking-widest">
                        Diagnosis Confidence: <span className="text-agreen-600 dark:text-agreen-400">{result.confidence}%</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-black text-gray-900 dark:text-gray-100 uppercase tracking-widest text-sm opacity-60">Recommended Treatment</h4>
                  <div className="bg-white dark:bg-gray-800 p-8 rounded-[2rem] border-2 border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300 shadow-2xl shadow-gray-200/50 dark:shadow-none text-lg leading-relaxed font-medium">
                    {result.advice}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-6 flex flex-col items-center">
                <div className="p-10 bg-gray-50 dark:bg-gray-800/50 rounded-full border-4 border-dashed border-gray-200 dark:border-gray-700">
                  <ImageIcon className="w-20 h-20 text-gray-200 dark:text-gray-700" />
                </div>
                <p className="text-xl font-bold text-gray-400 max-w-xs leading-relaxed">Upload an image to see the diagnostic results here.</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
