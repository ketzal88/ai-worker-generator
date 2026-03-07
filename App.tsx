
import React, { useState, useEffect } from 'react';
import Landing from './components/Landing';
import VideoGenerator from './components/VideoGenerator';
import EcommerceStudio from './components/EcommerceStudio';
import EcommerceVideoStudio from './components/EcommerceVideoStudio';
import BestAdsGrid from './components/BestAdsGrid';
import BestAdsGenerator from './components/BestAdsGenerator';
import { TemplateBuilder } from './components/TemplateBuilder';
import { AdTemplate } from './types';
import { KeyIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid';

const IS_DEV = false;

type AppView = 'landing' | 'image-studio' | 'video-studio' | 'ecommerce-studio' | 'ecommerce-video-studio' | 'best-ads' | 'template-builder';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [selectedTemplate, setSelectedTemplate] = useState<AdTemplate | null>(null);

  const [isGlobalProcessing, setIsGlobalProcessing] = useState(false);

  useEffect(() => {
    // Check for existing session
    const savedAuth = localStorage.getItem('worker_ad_studio_auth');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    const checkApiKey = async () => {
      // Compatibility with AI Studio internal key selection if present
      if (window.aistudio?.hasSelectedApiKey) {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasApiKey(selected);
      } else {
        setHasApiKey(true);
      }
    };
    if (isAuthenticated) checkApiKey();
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const adminEmail = (import.meta as any).env.VITE_ADMIN_EMAIL;
    const adminPass = (import.meta as any).env.VITE_ADMIN_PASSWORD;

    if (email === adminEmail && password === adminPass) {
      setIsAuthenticated(true);
      localStorage.setItem('worker_ad_studio_auth', 'true');
    } else {
      setAuthError('Credenciales incorrectas');
    }
  };

  const handleLogout = () => {
    if (isGlobalProcessing) return;
    setIsAuthenticated(false);
    localStorage.removeItem('worker_ad_studio_auth');
  };

  const handleSelectApiKey = async () => {
    if (window.aistudio?.openSelectKey) {
      await window.aistudio.openSelectKey();
      setHasApiKey(true);
    }
  };

  const handleBackToLanding = () => {
    if (isGlobalProcessing) {
      alert("Hay una generación en curso. Por favor, espera a que termine para no perder los datos.");
      return;
    }
    setCurrentView('landing');
    setSelectedTemplate(null);
  };

  if (!isAuthenticated) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-black text-white p-4 font-sans selection:bg-white selection:text-black">
        <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neutral-600 to-transparent opacity-50"></div>

          <div className="flex flex-col items-center mb-12">
            <img src="https://storage.googleapis.com/msgsndr/Zwjvo9JT2X190h2yTfhT/media/66e9d81d5823e829d1512363.svg" className="h-10 mb-6" alt="Logo" />
            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-neutral-500">Access Restricted</h2>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-neutral-600 ml-1">Identity</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black border border-neutral-800 rounded-2xl px-5 py-4 text-sm focus:border-white outline-none transition-all placeholder:text-neutral-800 font-medium"
                placeholder="email@worker.ar"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-neutral-600 ml-1">Protocol</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black border border-neutral-800 rounded-2xl px-5 py-4 text-sm focus:border-white outline-none transition-all placeholder:text-neutral-800 font-medium"
                placeholder="••••••••"
              />
            </div>

            {authError && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl"><p className="text-red-500 text-[10px] text-center font-black uppercase tracking-widest">{authError}</p></div>}

            <button
              type="submit"
              className="w-full bg-white text-black font-black py-5 rounded-2xl uppercase tracking-[0.3em] text-[10px] hover:bg-neutral-200 active:scale-[0.98] transition-all shadow-xl"
            >
              Initialize Session
            </button>
          </form>

          <p className="mt-12 text-center text-[8px] text-neutral-700 uppercase font-black tracking-widest">
            Worker Creative Lab © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    );
  }

  if (!hasApiKey) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-black text-white p-4">
        <div className="max-w-md text-center space-y-6">
          <KeyIcon className="w-12 h-12 text-white mx-auto" />
          <h2 className="text-2xl font-bold">Configuración Requerida</h2>
          <p className="text-neutral-400 text-sm leading-relaxed">Debes seleccionar una clave API válida de Google Cloud con facturación activa para usar Veo 3.1 y Gemini Pro.</p>
          <button onClick={handleSelectApiKey} className="w-full py-4 bg-white text-black font-bold rounded-lg uppercase tracking-widest text-xs">Seleccionar Clave API</button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-black text-neutral-100 font-sans">
      <header className="h-20 border-b border-neutral-800 bg-black/80 backdrop-blur-md flex items-center px-8 justify-between z-50">
        <div
          className={`flex items-center gap-6 ${isGlobalProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          onClick={handleBackToLanding}
        >
          <img src="https://storage.googleapis.com/msgsndr/Zwjvo9JT2X190h2yTfhT/media/66e9d81d5823e829d1512363.svg" className="h-8" alt="Logo" />
          <h1 className="font-medium text-[10px] tracking-[0.2em] text-neutral-500 uppercase">
            {currentView === 'best-ads' ? 'Creative & Performance Strategy' :
              currentView === 'ecommerce-video-studio' ? 'E-com Video Variations' :
                currentView === 'ecommerce-studio' ? 'E-com Variations' :
                  currentView === 'template-builder' ? 'Master Blueprint Builder' :
                    'Hub'}
          </h1>
        </div>

        <div className="flex items-center gap-6">
          {isGlobalProcessing && (
            <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full animate-pulse">
              <ExclamationTriangleIcon className="w-3 h-3 text-amber-500" />
              <span className="text-[9px] font-bold text-amber-500 uppercase tracking-widest">IA Trabajando — Navegación Bloqueada</span>
            </div>
          )}
          <button
            onClick={handleLogout}
            disabled={isGlobalProcessing}
            className={`text-[10px] font-bold text-neutral-500 uppercase hover:text-white transition-colors ${isGlobalProcessing ? 'opacity-30 cursor-not-allowed' : ''}`}
          >
            Cerrar Sesión
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-hidden relative">
        {currentView === 'landing' && (
          <Landing
            onSelectVideo={() => setCurrentView('video-studio')}
            onSelectAuto={() => setCurrentView('ecommerce-studio')}
            onSelectAutoVideo={() => setCurrentView('ecommerce-video-studio')}
            onSelectBestAds={() => setCurrentView('best-ads')}
            onSelectBuilder={() => setCurrentView('template-builder')}
          />
        )}
        {currentView === 'best-ads' && (
          selectedTemplate
            ? <BestAdsGenerator template={selectedTemplate} onBack={() => setSelectedTemplate(null)} onProcessing={setIsGlobalProcessing} />
            : <BestAdsGrid onSelect={setSelectedTemplate} onBack={handleBackToLanding} />
        )}
        {currentView === 'video-studio' && <VideoGenerator onBack={handleBackToLanding} onProcessing={setIsGlobalProcessing} />}
        {currentView === 'ecommerce-studio' && <EcommerceStudio onBack={handleBackToLanding} onProcessing={setIsGlobalProcessing} />}
        {currentView === 'ecommerce-video-studio' && <EcommerceVideoStudio onBack={handleBackToLanding} onProcessing={setIsGlobalProcessing} />}
        {currentView === 'template-builder' && <TemplateBuilder />}
      </main>
    </div>
  );
};

export default App;
