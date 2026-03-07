
import React, { useState, useEffect } from 'react';
import { 
  UserGroupIcon, 
  LinkIcon, 
  ArrowLeftIcon, 
  SparklesIcon,
  CheckCircleIcon,
  PhotoIcon,
  ArrowDownTrayIcon,
  ChatBubbleBottomCenterTextIcon,
  MicrophoneIcon,
  BanknotesIcon
} from '@heroicons/react/24/solid';
import { analyzeProductUrl, createUGCBriefs, renderUGCVideo } from '../services/gemini';
import { ProgressState, UGCVariationResult, ProductAnalysis } from '../types';

interface UGCFactoryProps {
  onBack: () => void;
  // Fix: Added missing onProcessing prop to interface
  onProcessing?: (val: boolean) => void;
}

const UGCFactory: React.FC<UGCFactoryProps> = ({ onBack, onProcessing }) => {
  const [url, setUrl] = useState('');
  const [idea, setIdea] = useState('');
  const [productImage, setProductImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<ProductAnalysis | null>(null);
  const [variations, setVariations] = useState<UGCVariationResult[]>([]);
  const [progress, setProgress] = useState<ProgressState>({ status: 'idle', message: '' });

  // Fix: Track processing status and inform parent
  const isWorking = progress.status !== 'idle' && progress.status !== 'success' && progress.status !== 'error';

  useEffect(() => {
    onProcessing?.(isWorking);
  }, [isWorking, onProcessing]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => setProductImage(reader.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const startFactory = async () => {
    if (!url || !productImage) return;

    try {
      setProgress({ status: 'analyzing', message: 'Analizando producto para UGC...' });
      const result = await analyzeProductUrl(url);
      setAnalysis(result);

      setProgress({ status: 'generating_prompts', message: 'Generando scripts auténticos...' });
      const briefs = await createUGCBriefs(result, idea);
      
      const initialVariations: UGCVariationResult[] = briefs.map((b, i) => ({
        id: i,
        prompt: b.visual,
        voiceover: b.voiceover,
        videoUrl: null,
        status: 'pending'
      }));
      setVariations(initialVariations);

      setProgress({ 
        status: 'rendering', 
        message: 'Renderizando videos UGC con Veo 3.1...', 
        currentStep: 0, 
        totalSteps: briefs.length 
      });

      for (let i = 0; i < briefs.length; i++) {
        setVariations(prev => prev.map((v, idx) => idx === i ? { ...v, status: 'processing' } : v));
        
        try {
          const videoUrl = await renderUGCVideo(productImage, briefs[i].visual);
          setVariations(prev => prev.map((v, idx) => idx === i ? { ...v, videoUrl: videoUrl, status: 'success' } : v));
          setProgress(prev => ({ ...prev, currentStep: i + 1 }));
        } catch (err) {
          console.error("UGC rendering failed:", err);
          setVariations(prev => prev.map((v, idx) => idx === i ? { ...v, status: 'error' } : v));
        }
      }

      setProgress({ status: 'success', message: '¡UGC completado!' });
    } catch (e: any) {
      setProgress({ status: 'error', message: e.message || 'Error en el proceso.' });
    }
  };

  return (
    <div className="h-full flex flex-col bg-black overflow-hidden">
      <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
        <div className="max-w-7xl mx-auto">
          {/* Fix: Added disabled attribute during processing */}
          <button 
            onClick={onBack} 
            disabled={isWorking}
            className={`flex items-center text-neutral-500 hover:text-white mb-8 text-sm uppercase font-bold tracking-widest transition-opacity ${isWorking ? 'opacity-30 cursor-not-allowed' : ''}`}
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" /> Volver
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Input Panel */}
            <div className="lg:col-span-4 space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-white leading-tight">
                  AI <span className="text-emerald-500">UGC Factory</span>
                </h2>
                <p className="text-neutral-500 text-sm leading-relaxed">
                  Genera contenido "User Generated" auténtico. Nuestro estratega IA diseña scripts, voces y movimientos de cámara reales.
                </p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Link de Ecommerce</label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <input 
                      type="url" 
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://tienda.com/..."
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-10 pr-4 py-3 text-xs text-white focus:border-white outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Foto del Producto (UGC Source)</label>
                  <div 
                    onClick={() => !isWorking && document.getElementById('ugc-img')?.click()}
                    className="aspect-square border-2 border-dashed border-neutral-800 rounded-xl flex items-center justify-center cursor-pointer hover:border-neutral-600 transition-colors bg-neutral-900/50 overflow-hidden"
                  >
                    <input id="ugc-img" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                    {productImage ? (
                      <img src={productImage} className="w-full h-full object-cover" alt="Source" />
                    ) : (
                      <div className="text-center p-4">
                        <PhotoIcon className="w-8 h-8 text-neutral-700 mx-auto mb-2" />
                        <p className="text-[10px] text-neutral-500 uppercase tracking-wider">Subir Foto Real</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                    <ChatBubbleBottomCenterTextIcon className="w-3 h-3" />
                    Idea o Concepto (Opcional)
                  </label>
                  <textarea 
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                    placeholder="Ej: Unboxing en el living, review honesta de 3 semanas..."
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-4 text-xs text-white focus:border-white outline-none transition-all resize-none h-24 placeholder-neutral-600"
                  />
                </div>

                <div className="relative pt-2">
                  <button 
                    onClick={startFactory}
                    disabled={isWorking}
                    className="w-full py-5 bg-emerald-600 text-white font-bold uppercase tracking-[0.2em] text-xs hover:bg-emerald-500 transition-all flex flex-col items-center justify-center gap-1 disabled:opacity-50"
                  >
                    <div className="flex items-center gap-3">
                      {!isWorking ? (
                        <>
                          <SparklesIcon className="w-4 h-4" />
                          Producir Pack UGC
                        </>
                      ) : (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Generando {progress.currentStep} de 3...
                        </>
                      )}
                    </div>
                  </button>
                  <div className="mt-2 flex items-center justify-center gap-2 text-[9px] text-neutral-500 uppercase font-bold tracking-widest">
                    <BanknotesIcon className="w-3 h-3" />
                    Coste Estimado de Producción: $1.50 USD
                  </div>
                </div>
              </div>
            </div>

            {/* Video Results Grid */}
            <div className="lg:col-span-8 space-y-8">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-6">
                <div>
                  <h3 className="text-xl font-bold text-white">Scripts & Videos</h3>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-widest mt-1">Variaciones UGC: {variations.filter(v => v.status === 'success').length} / {variations.length || 0}</p>
                </div>
                {progress.status === 'rendering' && (
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest animate-pulse">Renderizando Reels...</span>
                  </div>
                )}
              </div>

              {variations.length === 0 ? (
                <div className="h-[600px] bg-neutral-900/10 border border-dashed border-neutral-800 flex flex-col items-center justify-center opacity-40 rounded-3xl text-center p-8">
                  <UserGroupIcon className="w-16 h-16 text-neutral-700 mb-6" />
                  <h4 className="text-white font-bold mb-2 uppercase tracking-widest text-sm">Laboratorio de UGC</h4>
                  <p className="text-xs font-light italic text-neutral-600 max-w-xs leading-relaxed">Carga un producto para que nuestra IA estratégica diseñe testimonios reales que convierten.</p>
                </div>
              ) : (
                <div className="space-y-12">
                  {variations.map((v) => (
                    <div key={v.id} className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-neutral-900/40 p-6 rounded-2xl border border-neutral-800 transition-all hover:border-neutral-700">
                      {/* Video Side */}
                      <div className="relative aspect-[9/16] bg-black rounded-xl overflow-hidden shadow-2xl">
                        {v.videoUrl ? (
                          <>
                            <video src={v.videoUrl} controls autoPlay loop className="w-full h-full object-cover" />
                            <div className="absolute top-4 right-4 z-20">
                              <button 
                                onClick={() => {
                                  const a = document.createElement('a');
                                  a.href = v.videoUrl!;
                                  a.download = `ugc-video-${v.id}.mp4`;
                                  a.click();
                                }}
                                className="p-3 bg-white text-black hover:bg-neutral-200 rounded-full transition-transform active:scale-90"
                              >
                                <ArrowDownTrayIcon className="w-4 h-4" />
                              </button>
                            </div>
                          </>
                        ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-black/80">
                            <div className="w-12 h-12 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
                            <p className="text-[10px] text-emerald-500 uppercase tracking-widest font-black">Renderizando Video...</p>
                          </div>
                        )}
                      </div>

                      {/* Content Side */}
                      <div className="flex flex-col gap-6 py-4">
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 text-emerald-500">
                             <SparklesIcon className="w-4 h-4" />
                             <span className="text-[10px] font-bold uppercase tracking-widest">Visual Hook</span>
                          </div>
                          <p className="text-xs text-white font-light leading-relaxed italic border-l-2 border-neutral-800 pl-4">
                            "{v.prompt}"
                          </p>
                        </div>

                        <div className="space-y-4 bg-black/40 p-6 rounded-xl border border-neutral-800">
                          <div className="flex items-center gap-2 text-white">
                             <MicrophoneIcon className="w-4 h-4" />
                             <span className="text-[10px] font-bold uppercase tracking-widest">Script (Voiceover)</span>
                          </div>
                          <p className="text-sm text-neutral-300 font-medium leading-relaxed">
                            {v.voiceover}
                          </p>
                        </div>

                        <div className="mt-auto flex items-center gap-3">
                           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                           <span className="text-[9px] text-neutral-500 uppercase tracking-widest font-bold">Optimizado para Conversión</span>
                        </div>
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

export default UGCFactory;
