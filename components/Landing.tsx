
import React from 'react';
import { PhotoIcon, FilmIcon, SparklesIcon, RocketLaunchIcon, VideoCameraIcon, UserGroupIcon, BanknotesIcon, StarIcon } from '@heroicons/react/24/solid';

interface LandingProps {
  onSelectAuto: () => void;
  onSelectAutoVideo: () => void;
  onSelectBestAds: () => void;
  onSelectBuilder: () => void;
}

const CostBadge = ({ cost }: { cost: string }) => (
  <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-2.5 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-full">
    <BanknotesIcon className="w-3 h-3 text-emerald-400" />
    <span className="text-[9px] font-bold text-neutral-300 uppercase tracking-wider">Est. {cost}</span>
  </div>
);

const Landing: React.FC<LandingProps> = ({ onSelectAuto, onSelectAutoVideo, onSelectBestAds, onSelectBuilder }) => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-6 bg-black relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-white/5 blur-[120px] rounded-full pointer-events-none opacity-20"></div>

      <div className="relative z-10 text-center mb-16 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-900 border border-neutral-800 rounded-full mb-6">
          <SparklesIcon className="w-3 h-3 text-emerald-500" />
          <span className="text-[10px] text-neutral-400 font-mono uppercase tracking-widest">Next-Gen Creative Engine</span>
        </div>
        <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tighter">
          Produce Assets de <br /> Clase Mundial
        </h1>
        <p className="text-neutral-400 text-lg font-light leading-relaxed">
          Bienvenido al hub creativo de Worker. Utiliza inteligencia artificial generativa <br />
          para transformar conceptos en realidades visuales.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-[1200px] relative z-10 px-4">

        {/* UNIFIED CREATIVE LIBRARY CARD */}
        <div
          onClick={onSelectBestAds}
          className="group relative bg-blue-600/5 border border-blue-500/20 p-1 rounded-none cursor-pointer transition-all duration-500 hover:border-blue-500/60 hover:bg-blue-600/10 shadow-[0_0_30px_rgba(37,99,235,0.05)]"
        >
          <div className="absolute -top-3 left-6 z-30 px-3 py-1 bg-blue-600 text-[8px] font-black uppercase tracking-[0.2em] text-white">Top Performance</div>
          <CostBadge cost="$0.05" />
          <div className="aspect-[16/9] bg-black overflow-hidden relative">
            <img src="data/hands-holding-shopping-bag-smartphone-showcasing-digital-shopping-cart-against-colorful-background.jpg" className="w-full h-full object-cover opacity-30 group-hover:scale-105 group-hover:opacity-50 transition-all duration-700" alt="Creative Library" />
            <div className="absolute bottom-6 left-6">
              <div className="w-10 h-10 bg-blue-600 flex items-center justify-center mb-4 shadow-[0_0_25px_rgba(37,99,235,0.5)]"><SparklesIcon className="w-6 h-6 text-white" /></div>
              <h3 className="text-xs font-black text-white tracking-widest uppercase">Creative & Performance</h3>
            </div>
          </div>
          <div className="p-6">
            <p className="text-blue-500/70 text-[10px] leading-relaxed font-bold uppercase tracking-tighter italic">
              40+ Estructuras Ganadoras. Meta Ads & Creative Studio.
            </p>
          </div>
        </div>

        {/* ECOMMERCE VARIATIONS CARD */}
        <div
          onClick={onSelectAuto}
          className="group relative bg-neutral-900/50 border border-emerald-900/30 p-1 rounded-none cursor-pointer transition-all duration-500 hover:border-emerald-500/50 hover:bg-neutral-900"
        >
          <CostBadge cost="$0.50" />
          <div className="aspect-[16/9] bg-black overflow-hidden relative">
            <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80" className="w-full h-full object-cover opacity-40 group-hover:scale-105 group-hover:opacity-60 transition-all duration-700 grayscale" alt="Ecom Images" />
            <div className="absolute bottom-6 left-6">
              <div className="w-10 h-10 bg-emerald-500 flex items-center justify-center mb-4 shadow-xl"><RocketLaunchIcon className="w-6 h-6 text-black" /></div>
              <h3 className="text-xs font-bold text-white tracking-widest uppercase">E-com Variations</h3>
            </div>
          </div>
          <div className="p-6"><p className="text-neutral-500 text-[10px] leading-relaxed font-light uppercase tracking-tighter">10 variaciones de fotos por link.</p></div>
        </div>

        {/* ECOMMERCE VIDEO VARIATIONS CARD */}
        <div
          onClick={onSelectAutoVideo}
          className="group relative bg-neutral-900/50 border border-emerald-900/30 p-1 rounded-none cursor-pointer transition-all duration-500 hover:border-emerald-500/50 hover:bg-neutral-900"
        >
          <CostBadge cost="$2.00" />
          <div className="aspect-[16/9] bg-black overflow-hidden relative">
            <img
              src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&q=80"
              className="w-full h-full object-cover opacity-40 group-hover:scale-105 group-hover:opacity-60 transition-all duration-700 grayscale"
              alt="Ecom Videos Production"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1492691523567-6170f0275df1?w=800&q=80";
              }}
            />
            <div className="absolute bottom-6 left-6">
              <div className="w-10 h-10 bg-emerald-400 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(52,211,153,0.4)]"><VideoCameraIcon className="w-6 h-6 text-black" /></div>
              <h3 className="text-xs font-bold text-white tracking-widest uppercase">E-com Videos</h3>
            </div>
          </div>
          <div className="p-6"><p className="text-neutral-500 text-[10px] leading-relaxed font-light uppercase tracking-tighter">Spots cinemáticos con Veo 3.1.</p></div>
        </div>

      </div>

      <div className="mt-20 flex flex-col items-center gap-4">
        <button
          onClick={onSelectBuilder}
          className="group flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all duration-300"
        >
          <SparklesIcon className="w-4 h-4 text-indigo-400 group-hover:rotate-12 transition-transform" />
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">New Template Builder</span>
        </button>
        <div className="text-neutral-600 text-[10px] uppercase tracking-[0.3em] font-bold flex items-center gap-4">
          <span>Worker Ad Studio</span>
          <div className="w-1 h-1 bg-neutral-800 rounded-full"></div>
          <span>Version 3.5 — Master Blueprint Release</span>
        </div>
      </div>
    </div>
  );
};

export default Landing;
