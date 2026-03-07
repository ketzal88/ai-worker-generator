
import React, { useState } from 'react';
import { 
  RocketLaunchIcon, 
  LinkIcon, 
  ArrowLeftIcon, 
  SparklesIcon,
  CheckCircleIcon,
  PhotoIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/solid';
import { analyzeProductUrl, createCreativeBriefs, renderVariation } from '../services/gemini';
import { ProgressState, VariationResult, ProductAnalysis } from '../types';

interface AutoStudioProps {
  onBack: () => void;
}

const AutoStudio: React.FC<AutoStudioProps> = ({ onBack }) => {
  const [url, setUrl] = useState('');
  const [productImage, setProductImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<ProductAnalysis | null>(null);
  const [variations, setVariations] = useState<VariationResult[]>([]);
  const [progress, setProgress] = useState<ProgressState>({ status: 'idle', message: '' });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => setProductImage(reader.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const startAutopilot = async () => {
    if (!url || !productImage) return;

    try {
      // 1. Analizar URL
      setProgress({ status: 'analyzing', message: 'Analizando link con Gemini 3 Search...' });
      const result = await analyzeProductUrl(url);
      setAnalysis(result);

      // 2. Crear Prompts
      setProgress({ status: 'generating_prompts', message: 'Diseñando 10 variaciones creativas...' });
      const briefs = await createCreativeBriefs(result);
      
      const initialVariations: VariationResult[] = briefs.map((b, i) => ({
        id: i,
        prompt: b,
        imageUrl: null,
        status: 'pending'
      }));
      setVariations(initialVariations);

      // 3. Renderizar uno por uno
      setProgress({ 
        status: 'rendering', 
        message: 'Renderizando assets publicitarios...', 
        currentStep: 0, 
        totalSteps: 10 
      });

      for (let i = 0; i < briefs.length; i++) {
        setVariations(prev => prev.map((v, idx) => idx === i ? { ...v, status: 'processing' } : v));
        
        try {
          const imgUrl = await renderVariation(productImage, briefs[i]);
          setVariations(prev => prev.map((v, idx) => idx === i ? { ...v, imageUrl: imgUrl, status: 'success' } : v));
          setProgress(prev => ({ ...prev, currentStep: i + 1 }));
        } catch (err) {
          setVariations(prev => prev.map((v, idx) => idx === i ? { ...v, status: 'error' } : v));
        }
      }

      setProgress({ status: 'success', message: '¡Variaciones completadas!' });
    } catch (e: any) {
      setProgress({ status: 'error', message: e.message || 'Error en el proceso.' });
    }
  };

  return (
    <div className="h-full flex flex-col bg-black overflow-hidden">
      <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
        <div className="max-w-6xl mx-auto">
          <button onClick={onBack} className="flex items-center text-neutral-500 hover:text-white mb-8 text-sm uppercase font-bold tracking-widest">
            <ArrowLeftIcon className="w-4 h-4 mr-2" /> Volver
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Input Panel */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                  <RocketLaunchIcon className="w-8 h-8 text-emerald-500" />
                  AI Autopilot
                </h2>
                <p className="text-neutral-500 text-sm leading-relaxed">
                  Pega el link de cualquier tienda y sube la foto base del producto. Generaremos 10 variaciones fotográficas automáticamente.
                </p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Link del Producto</label>
                  <div className="relative">
                    <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <input 
                      type="url" 
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://tienda.com/producto..."
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-12 pr-4 py-4 text-sm text-white focus:border-white outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Foto Base (Alta Calidad)</label>
                  <div 
                    onClick={() => document.getElementById('auto-img')?.click()}
                    className="aspect-square border-2 border-dashed border-neutral-800 rounded-xl flex items-center justify-center cursor-pointer hover:border-neutral-600 transition-colors bg-neutral-900/50 overflow-hidden"
                  >
                    <input id="auto-img" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                    {productImage ? (
                      <img src={productImage} className="w-full h-full object-cover" alt="Source" />
                    ) : (
                      <div className="text-center p-4">
                        <PhotoIcon className="w-8 h-8 text-neutral-700 mx-auto mb-2" />
                        <p className="text-[10px] text-neutral-500 uppercase tracking-wider">Subir PNG/JPG</p>
                      </div>
                    )}
                  </div>
                </div>

                <button 
                  onClick={startAutopilot}
                  disabled={progress.status !== 'idle' && progress.status !== 'success' && progress.status !== 'error'}
                  className="w-full py-5 bg-white text-black font-bold uppercase tracking-[0.2em] text-xs hover:bg-neutral-200 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {progress.status === 'idle' ? (
                    <>
                      <SparklesIcon className="w-4 h-4" />
                      Iniciar Autopilot
                    </>
                  ) : (
                    <>
                      <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                      Procesando...
                    </>
                  )}
                </button>
              </div>

              {analysis && (
                <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-xl space-y-4 animate-fade-in">
                  <h3 className="text-xs font-bold text-white uppercase tracking-widest border-b border-neutral-800 pb-3">Análisis de Marca</h3>
                  <div className="space-y-3">
                    <p className="text-xs text-neutral-300 font-bold">{analysis.name}</p>
                    <div className="flex flex-wrap gap-2">
                      {analysis.keywords.map(k => (
                        <span key={k} className="text-[9px] bg-black px-2 py-1 rounded border border-neutral-800 text-neutral-500 uppercase">{k}</span>
                      ))}
                    </div>
                    <p className="text-[10px] text-neutral-400 leading-relaxed italic">"{analysis.environment}" — {analysis.tone}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Variations Grid */}
            <div className="lg:col-span-2 space-y-8">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-6">
                <h3 className="text-xl font-bold text-white">Resultados <span className="text-neutral-600 font-light">({variations.length})</span></h3>
                {progress.status === 'rendering' && (
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">{progress.currentStep} / 10 completados</span>
                    <div className="w-32 h-1 bg-neutral-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 transition-all duration-500" 
                        style={{ width: `${(progress.currentStep || 0) * 10}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {variations.length === 0 ? (
                <div className="aspect-video bg-neutral-900/20 border border-dashed border-neutral-800 flex items-center justify-center opacity-30">
                  <p className="text-sm font-light italic">Los assets generados aparecerán aquí...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {variations.map((v) => (
                    <div key={v.id} className="bg-neutral-900 border border-neutral-800 overflow-hidden flex flex-col group">
                      <div className="aspect-[4/5] bg-black relative flex items-center justify-center">
                        {v.imageUrl ? (
                          <>
                            <img src={v.imageUrl} className="w-full h-full object-cover" alt={`Var ${v.id}`} />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-6">
                              <p className="text-[10px] text-white text-center font-light leading-relaxed">{v.prompt}</p>
                            </div>
                            <button 
                              onClick={() => {
                                const a = document.createElement('a');
                                a.href = v.imageUrl!;
                                a.download = `autopilot-${v.id}.png`;
                                a.click();
                              }}
                              className="absolute top-4 right-4 p-2 bg-white text-black hover:bg-neutral-200"
                            >
                              <ArrowDownTrayIcon className="w-4 h-4" />
                            </button>
                          </>
                        ) : v.status === 'processing' ? (
                          <div className="text-center space-y-3">
                            <div className="w-8 h-8 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mx-auto"></div>
                            <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Generando...</p>
                          </div>
                        ) : (
                          <div className="w-2 h-2 bg-neutral-800 rounded-full animate-pulse"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutoStudio;
