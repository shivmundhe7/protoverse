import React from 'react';
import { NavLink } from 'react-router-dom';
import { Leaf, ArrowRight, Activity, ShieldCheck, TrendingUp, Mic } from 'lucide-react';
import Card from '../components/ui/Card';
import { useLanguage } from '../context/LanguageContext';

export default function Landing() {
  const { t } = useLanguage();

  return (
    <div className="space-y-32 pb-24">
      
      {/* Hero Section */}
      <section className="relative pt-16 pb-24 md:pt-32 md:pb-48 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-to-br from-agreen-500/20 to-cyan-500/20 dark:from-agreen-500/10 dark:to-cyan-500/10 rounded-full blur-[120px] -z-10 pointer-events-none animate-pulse-slow"></div>
        <div className="text-center max-w-5xl mx-auto px-4 space-y-10 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 text-agreen-700 dark:text-agreen-300 font-bold text-sm mb-6 shadow-xl shadow-agreen-500/5">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-agreen-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-agreen-500"></span>
            </span>
            AgroBrain v2.0 is Live
          </div>
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-[1.1]">
            {t('landing.title_1')} <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-agreen-600 via-agreen-500 to-cyan-500">{t('landing.title_2')}</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed mt-8 font-medium">
            {t('landing.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-10">
            <NavLink to="/dashboard" className="w-full sm:w-auto btn-primary text-xl px-12 py-5 flex items-center justify-center gap-3 group">
              {t('landing.btn_start')} <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
            </NavLink>
            <NavLink to="/doctor" className="w-full sm:w-auto btn-outline text-xl px-12 py-5 flex items-center justify-center gap-3 bg-white/30 backdrop-blur-xl">
              {t('landing.btn_learn')} <Activity className="w-6 h-6 animate-pulse" />
            </NavLink>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-agreen-500/5 -skew-y-3 -z-10"></div>
        <div className="max-w-7xl mx-auto px-4 py-20 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="space-y-2 p-8 rounded-3xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-md border border-white/50 dark:border-gray-700/50 shadow-xl">
            <div className="text-5xl font-black text-gray-900 dark:text-white">99%</div>
            <div className="text-agreen-600 dark:text-agreen-400 font-bold uppercase tracking-widest text-sm">Uptime SLA</div>
          </div>
          <div className="space-y-2 p-8 rounded-3xl bg-agreen-500 text-white shadow-2xl shadow-agreen-500/30 scale-110 relative z-10">
            <div className="text-5xl font-black">94%+</div>
            <div className="text-agreen-100 font-bold uppercase tracking-widest text-sm">Diagnosis Accuracy</div>
          </div>
          <div className="space-y-2 p-8 rounded-3xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-md border border-white/50 dark:border-gray-700/50 shadow-xl">
            <div className="text-5xl font-black text-gray-900 dark:text-white">10M+</div>
            <div className="text-agreen-600 dark:text-agreen-400 font-bold uppercase tracking-widest text-sm">Acres Monitored</div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="text-center mb-24 space-y-4">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white">Core Ecosystem</h2>
          <p className="text-xl text-gray-500 dark:text-gray-400 font-medium max-w-2xl mx-auto">Everything you need to optimize yield and maximize profit with precision AI.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <Card className="p-10">
            <div className="p-4 bg-gradient-to-br from-agreen-400 to-agreen-600 w-fit rounded-2xl mb-8 shadow-lg shadow-agreen-500/30">
              <ShieldCheck className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-black mb-4">{t('landing.feat1_title')}</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg font-medium">
              {t('landing.feat1_desc')}
            </p>
          </Card>

          <Card className="p-10">
            <div className="p-4 bg-gradient-to-br from-blue-400 to-blue-600 w-fit rounded-2xl mb-8 shadow-lg shadow-blue-500/30">
              <TrendingUp className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-black mb-4">{t('landing.feat2_title')}</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg font-medium">
              {t('landing.feat2_desc')}
            </p>
          </Card>

          <Card className="p-10">
            <div className="p-4 bg-gradient-to-br from-cyan-400 to-cyan-600 w-fit rounded-2xl mb-8 shadow-lg shadow-cyan-500/30">
              <Mic className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-black mb-4">{t('landing.feat3_title')}</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg font-medium">
               {t('landing.feat3_desc')}
            </p>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-br from-gray-900 via-agreen-900 to-agreen-800 dark:from-black dark:via-gray-900 dark:to-agreen-950 rounded-[3rem] p-12 md:p-24 text-white relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-white/5">
          <div className="relative z-10 text-center max-w-3xl mx-auto space-y-10">
            <div className="w-24 h-24 bg-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center mx-auto animate-float">
              <Leaf className="w-12 h-12 text-agreen-400" />
            </div>
            <h2 className="text-5xl md:text-6xl font-black leading-tight">Ready to transform <br/> your farm?</h2>
            <p className="text-agreen-100/70 text-xl leading-relaxed font-medium">
              Join thousands of modern farmers leveraging AI to predict patterns, cure diseases, and dominate the market.
            </p>
            <div className="pt-6">
              <NavLink to="/auth" className="inline-block bg-white text-gray-900 hover:bg-agreen-50 font-black py-6 px-14 rounded-3xl text-xl shadow-2xl transition-all hover:scale-105 active:scale-95">
                Create Free Account
              </NavLink>
            </div>
          </div>
          {/* Abstract BG Pattern */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-agreen-500/20 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[600px] h-[600px] bg-cyan-500/20 rounded-full blur-[100px] pointer-events-none"></div>
        </div>
      </section>
      
    </div>
  );
}
