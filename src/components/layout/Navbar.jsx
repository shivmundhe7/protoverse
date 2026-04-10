import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Moon, Sun, Leaf, Menu, X, LogOut, Globe } from 'lucide-react';

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const { currentUser, logout } = useAuth();
  const { currentLang, switchLanguage, t } = useLanguage();
  
  const [isOpen, setIsOpen] = useState(false);
  const [showLang, setShowLang] = useState(false);
  const langRef = useRef(null);

  // Close Language dropdown logically without blocking UI interactions
  useEffect(() => {
    function handleClickOutside(event) {
      if (langRef.current && !langRef.current.contains(event.target)) {
        setShowLang(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { name: t('nav.dashboard'), path: '/dashboard' },
    { name: t('nav.crop_doctor'), path: '/doctor' },
    { name: t('nav.voice'), path: '/voice' },
    { name: t('nav.market'), path: '/market' },
    { name: t('nav.map'), path: '/map' },
  ];

  return (
    <nav className="glass-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <NavLink to="/" className="flex items-center gap-3 group">
              <div className="bg-gradient-to-br from-agreen-400 to-agreen-600 p-2.5 rounded-2xl group-hover:rotate-6 transition-all duration-300 shadow-lg shadow-agreen-500/20">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                AgroBrain
              </span>
            </NavLink>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1">
            <div className="flex space-x-1 mr-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                      isActive
                        ? 'bg-agreen-500/10 text-agreen-600 dark:text-agreen-400'
                        : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </div>
            
            <div className="flex items-center space-x-4 border-l border-gray-200 dark:border-gray-700 pl-6">
              
              {/* Language Dropdown Toggle Widget */}
              <div className="relative" ref={langRef}>
                <button
                  onClick={() => setShowLang(!showLang)}
                  className="p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 rounded-full transition-colors flex items-center gap-1"
                >
                  <Globe className="h-5 w-5" />
                  <span className="text-xs font-bold uppercase">{currentLang}</span>
                </button>

                {showLang && (
                  <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden z-50">
                    <button onClick={() => { switchLanguage('en'); setShowLang(false); }} className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${currentLang === 'en' ? 'font-bold text-agreen-600' : 'text-gray-700 dark:text-gray-200'}`}>English</button>
                    <button onClick={() => { switchLanguage('hi'); setShowLang(false); }} className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${currentLang === 'hi' ? 'font-bold text-agreen-600' : 'text-gray-700 dark:text-gray-200'}`}>हिन्दी (Hindi)</button>
                    <button onClick={() => { switchLanguage('mr'); setShowLang(false); }} className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${currentLang === 'mr' ? 'font-bold text-agreen-600' : 'text-gray-700 dark:text-gray-200'}`}>मराठी (Marathi)</button>
                  </div>
                )}
              </div>

              <button
                onClick={toggleTheme}
                className="p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 rounded-full transition-colors"
                aria-label="Toggle theme"
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              
              {currentUser ? (
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    {currentUser.displayName || currentUser.email}
                  </span>
                  <button onClick={logout} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors">
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <NavLink to="/auth" className="btn-primary py-1.5 px-4 text-sm whitespace-nowrap">
                  {t('nav.login')}
                </NavLink>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden gap-2">
             <button
                onClick={() => { switchLanguage(currentLang === 'en' ? 'hi' : currentLang === 'hi' ? 'mr' : 'en') }}
                className="p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 rounded-full transition-colors flex items-center"
              >
                <span className="text-xs font-bold uppercase">{currentLang}</span>
              </button>
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 rounded-full transition-colors"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 pb-4">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium ${
                    isActive
                      ? 'bg-agreen-50 text-agreen-600 dark:bg-gray-800 dark:text-agreen-400'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-agreen-500 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
            <div className="pt-4 px-3">
              {currentUser ? (
                <button 
                  onClick={() => { logout(); setIsOpen(false); }} 
                  className="w-full flex items-center justify-center gap-2 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md font-medium"
                >
                  <LogOut className="h-5 w-5" /> {t('nav.logout')}
                </button>
              ) : (
                <NavLink to="/auth" onClick={() => setIsOpen(false)} className="w-full block text-center btn-primary">
                  {t('nav.login')}
                </NavLink>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
