import React, { useState, useEffect, useRef } from 'react';
import Card from '../components/ui/Card';
import { Mic, MicOff, Activity, Volume2, Send, Wifi, WifiOff } from 'lucide-react';
import Spinner from '../components/ui/Spinner';
import { chatWithAgroBrain, queryOfflineDatabase } from '../api/index';
import { useLanguage } from '../context/LanguageContext';

export default function VoiceAssistant() {
  const { t, currentLang } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [inputNode, setInputNode] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  // Map application language to speech recognition and synthesis language codes
  const getLanguageCode = (lang) => {
    switch(lang) {
      case 'hi': return 'hi-IN';
      case 'mr': return 'mr-IN';
      default: return 'en-US';
    }
  };

  const [isSupported, setIsSupported] = useState(true);

  // Fallback check for speech recognition
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognitionRef = useRef(null);
  const transcriptRef = useRef('');

  useEffect(() => {
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = getLanguageCode(currentLang);

    rec.onstart = () => {
      setIsListening(true);
    };

    rec.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      
      const currentText = finalTranscript || interimTranscript;
      setTranscript(currentText);
      transcriptRef.current = currentText;
    };

    rec.onend = () => {
      setIsListening(false);
      const finalValue = transcriptRef.current;
      if (finalValue.trim()) {
        handleCommand(finalValue);
      }
    };

    rec.onerror = (event) => {
      console.error("Speech Recognition Error:", event.error);
      setIsListening(false);
      if (event.error === 'not-allowed') {
        alert("Microphone access denied. Please enable it in your browser settings.");
      }
    };

    recognitionRef.current = rec;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [SpeechRecognition, currentLang]);

  const toggleListening = () => {
    if (!isSupported) {
      alert("Your browser does not support speech recognition. Please try Chrome or Edge.");
      return;
    }

    // Warm up speech synthesis on user interaction
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance('');
      window.speechSynthesis.speak(utterance);
    }

    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setTranscript('');
      transcriptRef.current = '';
      setResponse('');
      try {
        recognitionRef.current?.start();
      } catch (err) {
        console.error("Failed to start recognition:", err);
        // If it's already started, we just catch the error
      }
    }
  };

  const handleCommand = async (text) => {
    if (!text || !text.trim()) return;
    
    setLoading(true);
    setResponse(t('voice.thinking'));
    
    let reply;
    if (isOffline) {
       reply = await queryOfflineDatabase(text, currentLang);
    } else {
       reply = await chatWithAgroBrain(text, currentLang);
    }
    
    setResponse(reply);
    setLoading(false);
    
    // Automatically speak the response
    handleSpeak(reply);
  };

  const handleSend = () => {
    if (inputNode.trim()) {
      // Warm up speech synthesis on user interaction
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance('');
        window.speechSynthesis.speak(utterance);
      }
      handleCommand(inputNode);
      setInputNode('');
    }
  };

  const handleSpeak = (text) => {
    if (!text) return;
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      const langCode = getLanguageCode(currentLang);
      utterance.lang = langCode;
      
      // Select a voice that matches the language
      const voices = window.speechSynthesis.getVoices();
      const voice = voices.find(v => v.lang === langCode || v.lang.startsWith(langCode.split('-')[0]));
      if (voice) {
        utterance.voice = voice;
      }

      utterance.pitch = 1.0;
      utterance.rate = 1.0;
      
      // Some browsers have issues with long text, but for our brief responses it's fine
      window.speechSynthesis.speak(utterance);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto space-y-10 py-12 px-4 animate-slide-up">
      <div className="text-center space-y-4">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-agreen-500 blur-2xl opacity-20 animate-pulse"></div>
          <div className="relative mx-auto w-20 h-20 bg-gradient-to-br from-agreen-400 to-agreen-600 rounded-3xl flex items-center justify-center shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
            <Mic className="w-10 h-10 text-white animate-float" />
          </div>
        </div>
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            {t('voice.title')}
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400 mt-4 leading-relaxed">
            {t('voice.subtitle')}
          </p>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <button 
           onClick={() => setIsOffline(!isOffline)}
           className={`group flex items-center gap-3 px-6 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 shadow-sm border ${
             isOffline 
               ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800' 
               : 'bg-agreen-50 text-agreen-700 border-agreen-200 dark:bg-agreen-900/20 dark:text-agreen-400 dark:border-agreen-800'
           }`}
        >
          {isOffline ? <WifiOff className="w-5 h-5 group-hover:rotate-12 transition-transform" /> : <Wifi className="w-5 h-5 group-hover:rotate-12 transition-transform" />} 
          {isOffline ? t('voice.offline_mode') : t('voice.online_mode')}
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        <Card className="flex flex-col items-center py-20 relative overflow-hidden group">
          {isListening && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-72 h-72 bg-agreen-500/20 rounded-full animate-ping"></div>
              <div className="absolute w-48 h-48 bg-agreen-400/10 rounded-full animate-pulse"></div>
            </div>
          )}
          
          <button
          onClick={toggleListening}
          className={`relative z-10 w-32 h-32 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 group-hover:scale-105 ${
            !isSupported
              ? 'bg-gray-400 cursor-not-allowed'
              : isListening 
                ? 'bg-gradient-to-br from-red-500 to-red-600 ring-8 ring-red-500/20' 
                : 'bg-gradient-to-br from-agreen-500 to-agreen-600 ring-8 ring-agreen-500/10'
          }`}
          disabled={!isSupported}
        >
          {isListening ? (
            <MicOff className="w-14 h-14 text-white" />
          ) : (
            <Mic className="w-14 h-14 text-white" />
          )}
        </button>

        <p className={`mt-10 font-bold text-lg tracking-wide transition-all duration-300 ${!isSupported ? 'text-gray-400' : isListening ? 'text-red-500 animate-pulse' : 'text-gray-500 dark:text-gray-400'}`}>
          {!isSupported 
            ? "Speech Not Supported" 
            : isListening ? t('voice.listening') : t('voice.tap_to_speak')}
        </p>
          
          <div className="mt-8 flex gap-2">
            {[1, 2, 3].map((i) => (
              <div 
                key={i}
                className={`w-1.5 h-6 rounded-full bg-agreen-500/30 transition-all duration-500 ${isListening ? 'animate-bounce' : ''}`}
                style={{ animationDelay: `${i * 0.1}s` }}
              ></div>
            ))}
          </div>
        </Card>

        <div className="space-y-6 h-full flex flex-col">
          <div className="flex-1 space-y-4 overflow-y-auto max-h-[400px] p-2 custom-scrollbar">
            {transcript && (
              <div className="flex items-start gap-4 justify-end animate-slide-up">
                <div className="bg-agreen-600 text-white p-4 rounded-3xl rounded-tr-none shadow-lg max-w-[85%]">
                  <p className="text-sm font-medium opacity-70 mb-1">You</p>
                  <p className="font-medium">{transcript}</p>
                </div>
              </div>
            )}
            
            {response && (
              <div className="flex items-start gap-4 animate-slide-up">
                <div className="bg-white dark:bg-gray-800 p-5 rounded-3xl rounded-tl-none border border-gray-100 dark:border-gray-700 shadow-xl relative group w-full">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-agreen-500/10 p-1.5 rounded-lg">
                      <Activity className="w-4 h-4 text-agreen-600" />
                    </div>
                    <p className="text-sm font-bold text-agreen-600">AgroBrain</p>
                  </div>
                  {loading ? (
                    <div className="flex items-center gap-3 py-2">
                      <Spinner />
                      <span className="text-gray-400 animate-pulse">{t('voice.thinking')}</span>
                    </div>
                  ) : (
                    <div className="relative">
                      <p className="text-gray-800 dark:text-gray-200 leading-relaxed pr-8">{response}</p>
                      <button 
                        onClick={() => handleSpeak(response)}
                        className="absolute -top-1 -right-1 p-2 bg-agreen-50 dark:bg-agreen-900/30 text-agreen-600 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                        title="Read Aloud"
                      >
                        <Volume2 className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="relative group">
            <input
               value={inputNode}
               onChange={(e) => setInputNode(e.target.value)}
               onKeyPress={(e) => e.key === 'Enter' && handleSend()}
               placeholder={t('voice.placeholder')}
               className="w-full px-6 py-4 bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-2xl focus:outline-none focus:border-agreen-500/50 focus:ring-4 focus:ring-agreen-500/10 transition-all shadow-lg text-lg"
            />
            <button 
              onClick={handleSend}
              disabled={loading || !inputNode}
              className="absolute right-2 top-2 bottom-2 bg-agreen-500 hover:bg-agreen-600 disabled:bg-gray-300 text-white px-5 rounded-xl transition-all flex items-center justify-center group"
            >
               <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
