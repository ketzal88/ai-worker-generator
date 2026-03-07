
import React, { useState } from 'react';
import { UNIFIED_TEMPLATES, CATEGORIES } from '../data/unifiedTemplates';
import { AdTemplate } from '../types';
import { ArrowLeftIcon, SparklesIcon } from '@heroicons/react/24/solid';

interface BestAdsGridProps {
  onSelect: (template: AdTemplate) => void;
  onBack: () => void;
}

const BestAdsGrid: React.FC<BestAdsGridProps> = ({ onSelect, onBack }) => {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredTemplates = activeCategory === 'All'
    ? UNIFIED_TEMPLATES
    : UNIFIED_TEMPLATES.filter(t => t.category === activeCategory);

  return (
    <div className="p-8 max-w-[1600px] mx-auto overflow-y-auto custom-scrollbar h-full bg-black">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-blue-500 mb-2">
            <SparklesIcon className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Unified Creative Library</span>
          </div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase">
            {activeCategory === 'All' ? 'Librería de' : activeCategory} <span className="text-blue-600">Templates</span>
          </h2>
          <div className="flex flex-wrap gap-2 mt-6">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeCategory === cat
                  ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]'
                  : 'bg-neutral-900 text-neutral-500 border border-neutral-800 hover:border-neutral-600'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={onBack}
          className="flex items-center text-neutral-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest border border-neutral-800 px-6 py-3 rounded-full bg-neutral-900/50"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Hub Principal
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-24">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            onClick={() => onSelect(template)}
            className="group relative bg-neutral-900 rounded-[2.5rem] overflow-hidden cursor-pointer transition-all duration-300 border border-neutral-800 hover:border-blue-500 hover:shadow-[0_0_30px_rgba(37,99,235,0.1)] flex flex-col h-full"
          >
            <div className="aspect-[3/4] w-full overflow-hidden bg-neutral-950 relative">
              <img
                src={template.thumbnailUrl}
                alt={template.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-[8px] font-bold text-white uppercase tracking-widest border border-white/10">
                  {template.category}
                </span>
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col bg-neutral-900">
              <div className="mb-4">
                <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-1 block">
                  {template.category === 'Performance Meta' ? 'Meta Optimized' : 'Studio Creative'}
                </span>
                <h3 className="text-lg font-black text-white leading-tight uppercase tracking-tighter">{template.title}</h3>
              </div>
              <p className="text-[11px] text-neutral-500 mb-6 font-medium leading-relaxed line-clamp-2">{template.description}</p>

              <div className="mt-auto flex items-center justify-between pt-4 border-t border-neutral-800">
                <span className="text-[9px] uppercase tracking-widest text-neutral-600 font-bold">Ratio: {template.aspectRatio}</span>
                <span className="text-[9px] uppercase tracking-widest text-blue-500 font-black flex items-center gap-1">
                  <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                  Ready to render
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BestAdsGrid;
