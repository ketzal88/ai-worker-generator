
import React, { useState, useEffect } from 'react';
import {
  RocketLaunchIcon,
  LinkIcon,
  ArrowLeftIcon,
  SparklesIcon,
  CheckCircleIcon,
  PhotoIcon,
  ArrowDownTrayIcon,
  GlobeAltIcon,
  BanknotesIcon,
  AdjustmentsHorizontalIcon,
  RectangleStackIcon,
  Square2StackIcon,
  PhotoIcon as PhotoIconSolid,
  // Fix: Added missing icon import used in the render function
  ExclamationTriangleIcon
} from '@heroicons/react/24/solid';
import { analyzeProductUrl, createCreativeBriefs, renderVariation, resizeAdCreative } from '../services/gemini';
import { ProgressState, VariationResult, ProductAnalysis } from '../types';

interface EcommerceStudioProps {
  onBack: () => void;
  onProcessing?: (val: boolean) => void;
}

const EcommerceStudio: React.FC<EcommerceStudioProps> = ({ onBack, onProcessing }) => {
  const [url, setUrl] = useState('');
  const [userInstructions, setUserInstructions] = useState('');
  const [productImage, setProductImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<ProductAnalysis | null>(null);
  const [variations, setVariations] = useState<VariationResult[]>([]);
  const [progress, setProgress] = useState<ProgressState>({ status: 'idle', message: '' });
  const [quantity, setQuantity] = useState<number>(5); // Default to 5
  const [resizingIds, setResizingIds] = useState<Set<number>>(new Set());

  const isWorking = progress.status !== 'idle' && progress.status !== 'success' && progress.status !== 'error';

  useEffect(() => {
    onProcessing?.(isWorking || resizingIds.size > 0);
  }, [isWorking, resizingIds, onProcessing]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => setProductImage(reader.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleResizeVariation = async (variationId: number, imageUrl: string) => {
    if (resizingIds.has(variationId)) return;

    setResizingIds(prev => new Set(prev).add(variationId));
    try {
      // 9:16 represents the 1080x1920 vertical format
      const resizedUrl = await resizeAdCreative(imageUrl, '9:16');
      setVariations(prev => prev.map(v =>
        v.id === variationId
          ? { ...v, adaptations: { ...v.adaptations, '9:16': resizedUrl } }
          : v
      ));
    } catch (err) {
      console.error("Error al redimensionar:", err);
    } finally {
      setResizingIds(prev => {
        const next = new Set(prev);
        next.delete(variationId);
        return next;
      });
    }
  };

  const startAutopilot = async () => {
    if (!url || !productImage) return;

    try {
      setProgress({ status: 'analyzing', message: 'Analizando inteligencia del producto...' });
      const result = await analyzeProductUrl(url);
      setAnalysis(result);

      setProgress({ status: 'generating_prompts', message: `Ideando ${quantity} escenarios visuales únicos...` });
      // We explicitly request NO TEXT in the briefs generation
      const briefs = await createCreativeBriefs(result, `STRICTLY VISUAL. NO TEXT OVERLAYS. ONLY PHOTOREALISTIC CONTEXTUAL SCENES. ${userInstructions}`, quantity);

      const initialVariations: VariationResult[] = briefs.map((b, i) => ({
        id: i,
        prompt: b,
        imageUrl: null,
        status: 'pending',
        adaptations: {}
      }));
      setVariations(initialVariations);

      setProgress({
        status: 'rendering',
        message: 'Nuestra IA renderizando variaciones fotográficas...',
        currentStep: 0,
        totalSteps: quantity
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
      setProgress({ status: 'success', message: '¡Variaciones completadas con éxito!' });
    } catch (e: any) {
      setProgress({ status: 'error', message: e.message || 'Error en el motor de generación.' });
    }
  };

  return (
    <div className="h-full flex flex-col bg-black overflow-hidden">
      <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={onBack}
            disabled={isWorking || resizingIds.size > 0}
            className={`flex items-center text-neutral-500 hover:text-white mb-10 text-xs uppercase font-black tracking-widest transition-opacity ${(isWorking || resizingIds.size > 0) ? 'opacity-30 cursor-not-allowed' : ''}`}
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" /> Volver al Hub
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* PANEL DE CONFIGURACIÓN */}
            <div className="lg:col-span-4 space-y-10">
              <div className="space-y-4">
                <h2 className="text-4xl font-black text-white tracking-tighter uppercase">
                  E-com <span className="text-emerald-500">Variations</span>
                </h2>
                <p className="text-neutral-500 text-sm leading-relaxed font-light">
                  Generación masiva de variaciones fotográficas puras. Sin texto, solo contexto y producto.
                </p>
              </div>

              <div className="space-y-8">
                {/* SELECTOR DE CANTIDAD */}
                <div className="space-y-4 p-5 bg-neutral-900/50 border border-neutral-800 rounded-2xl">
                  <label className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                    <AdjustmentsHorizontalIcon className="w-3 h-3" /> Cantidad de Variaciones
                  </label>
                  <div className="flex gap-2">
                    {[1, 3, 5, 10].map(n => (
                      <button
                        key={n}
                        onClick={() => setQuantity(n)}
                        disabled={isWorking}
                        className={`flex-1 py-4 text-xs font-black rounded-xl border transition-all ${quantity === n ? 'bg-white text-black border-white shadow-lg' : 'bg-neutral-900 border-neutral-800 text-neutral-500 hover:text-white'}`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                  <p className="text-[9px] text-neutral-600 font-bold uppercase text-center tracking-tighter">
                    Worker AI creará {quantity} escenarios distintos
                  </p>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Link del Producto (Inteligencia)</label>
                  <div className="relative">
                    <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="Amazon, Shopify, Web..."
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-12 pr-4 py-4 text-xs text-white focus:border-emerald-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Foto Producto (Base Limpia)</label>
                  <div
                    onClick={() => !isWorking && document.getElementById('auto-img-ecom')?.click()}
                    className="aspect-square border-2 border-dashed border-neutral-800 rounded-2xl flex items-center justify-center cursor-pointer hover:border-emerald-500/30 transition-all bg-neutral-900/30 overflow-hidden relative group"
                  >
                    <input id="auto-img-ecom" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                    {productImage ? (
                      <img src={productImage} className="w-full h-full object-contain" alt="Source" />
                    ) : (
                      <div className="text-center p-6">
                        <PhotoIconSolid className="w-10 h-10 text-neutral-800 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                        <p className="text-[10px] text-neutral-600 uppercase font-bold tracking-widest">Carga tu PNG</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Ajustes de Escena (Opcional)</label>
                  <textarea
                    value={userInstructions}
                    onChange={(e) => setUserInstructions(e.target.value)}
                    placeholder="Ej: En una montaña nevada al amanecer..."
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-5 text-xs text-white focus:border-emerald-500 outline-none h-28 resize-none transition-all"
                  />
                </div>

                <div className="pt-4">
                  <button
                    onClick={startAutopilot}
                    disabled={isWorking || !productImage || !url}
                    className="w-full py-6 bg-white text-black font-black uppercase tracking-[0.3em] text-[11px] hover:bg-neutral-200 transition-all flex flex-col items-center justify-center gap-1 disabled:opacity-20 shadow-2xl active:scale-95"
                  >
                    <div className="flex items-center gap-3">
                      {isWorking ? <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div> : <SparklesIcon className="w-4 h-4" />}
                      Generar Pack Visual
                    </div>
                  </button>
                  <div className="mt-4 flex items-center justify-center gap-2 text-[9px] text-neutral-600 uppercase font-black tracking-widest">
                    <BanknotesIcon className="w-3 h-3" /> Coste Est: ${(quantity * 0.05).toFixed(2)} USD
                  </div>
                </div>
              </div>

              {analysis && (
                <div className="p-6 bg-neutral-900/80 border border-neutral-800 rounded-2xl space-y-4 animate-fade-in shadow-2xl">
                  <h3 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest border-b border-neutral-800 pb-4 flex items-center gap-3">
                    <CheckCircleIcon className="w-4 h-4" /> Inteligencia Detectada
                  </h3>
                  <div className="space-y-4">
                    <p className="text-xs text-white font-black uppercase tracking-tight">{analysis.name}</p>
                    <div className="flex flex-wrap gap-2">
                      {analysis.keywords.map(k => <span key={k} className="text-[8px] px-2 py-1 bg-black border border-neutral-800 text-neutral-500 rounded font-bold uppercase">{k}</span>)}
                    </div>
                    {analysis.sources && analysis.sources.length > 0 && (
                      <div className="pt-4 border-t border-neutral-800 space-y-3">
                        <p className="text-[9px] text-neutral-500 uppercase tracking-widest font-black flex items-center gap-2">
                          <GlobeAltIcon className="w-3 h-3" /> Fuentes de Datos
                        </p>
                        <div className="space-y-1.5">
                          {analysis.sources.map((s, i) => (
                            <a key={i} href={s.uri} target="_blank" rel="noopener noreferrer" className="block text-[9px] text-neutral-600 hover:text-emerald-500 transition-colors truncate font-medium">• {s.title}</a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* PANEL DE RESULTADOS */}
            <div className="lg:col-span-8 space-y-10">
              <div className="flex items-center justify-between border-b border-neutral-900 pb-8">
                <div>
                  <h3 className="text-2xl font-black text-white tracking-tighter uppercase">Escenarios Renderizados</h3>
                  <p className="text-[10px] text-neutral-600 uppercase tracking-widest mt-1 font-bold">Variaciones fotográficas sin texto</p>
                </div>
                {progress.status === 'rendering' && <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] animate-pulse">{progress.currentStep} de {quantity} completados</span>}
              </div>

              {variations.length === 0 ? (
                <div className="aspect-video border border-dashed border-neutral-900 flex flex-col items-center justify-center opacity-20 rounded-[3rem] p-12 text-center group hover:bg-neutral-900/10 transition-all">
                  <PhotoIconSolid className="w-16 h-16 text-neutral-800 mb-6 group-hover:scale-110 transition-transform" />
                  <p className="text-xs font-black uppercase tracking-[0.4em]">Laboratorio listo para renderizar</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pb-24">
                  {variations.map((v) => (
                    <div key={v.id} className="bg-neutral-900 border border-neutral-800 rounded-[2.5rem] overflow-hidden flex flex-col group transition-all hover:border-neutral-600 shadow-2xl relative">
                      <div className="aspect-[4/5] bg-black relative flex items-center justify-center overflow-hidden">
                        {v.imageUrl ? (
                          <>
                            <img src={v.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Variation" />
                            <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-all p-8 flex flex-col justify-end gap-5">
                              <p className="text-[10px] text-white leading-relaxed mb-4 uppercase font-bold tracking-widest line-clamp-3 italic">"{v.prompt}"</p>

                              <div className="flex flex-col gap-3">
                                <button
                                  onClick={() => { const a = document.createElement('a'); a.href = v.imageUrl!; a.download = `worker-ecom-${v.id}.png`; a.click(); }}
                                  className="w-full py-4 bg-white text-black font-black text-[10px] uppercase tracking-widest rounded-xl flex items-center justify-center gap-3 hover:bg-neutral-200 shadow-lg active:scale-95 transition-all"
                                >
                                  <ArrowDownTrayIcon className="w-4 h-4" /> Descargar Master (4:5)
                                </button>

                                <button
                                  onClick={() => handleResizeVariation(v.id, v.imageUrl!)}
                                  disabled={resizingIds.has(v.id)}
                                  className="w-full py-4 bg-emerald-600 text-white font-black text-[10px] uppercase tracking-widest rounded-xl flex items-center justify-center gap-3 hover:bg-emerald-500 disabled:opacity-30 shadow-lg active:scale-95 transition-all"
                                >
                                  {resizingIds.has(v.id) ? (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                  ) : (
                                    <Square2StackIcon className="w-4 h-4" />
                                  )}
                                  Adaptar a Story (1080x1920)
                                </button>
                              </div>
                            </div>
                          </>
                        ) : v.status === 'processing' ? (
                          <div className="flex flex-col items-center gap-6">
                            <div className="w-12 h-12 border-4 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin"></div>
                            <div className="text-center">
                              <p className="text-[10px] text-emerald-500 uppercase tracking-[0.4em] font-black animate-pulse">Renderizando...</p>
                              <p className="text-[8px] text-neutral-600 uppercase tracking-widest font-bold mt-2">Nuestra IA componiendo píxeles</p>
                            </div>
                          </div>
                        ) : v.status === 'error' ? (
                          <div className="text-center p-8">
                            <ExclamationTriangleIcon className="w-10 h-10 text-red-500/30 mx-auto mb-4" />
                            <p className="text-red-500 text-[10px] font-black uppercase tracking-widest">Error de Renderizado</p>
                          </div>
                        ) : null}
                      </div>

                      {/* Story Adaptation Preview */}
                      {v.adaptations?.['9:16'] && (
                        <div className="p-6 bg-black border-t border-neutral-800 animate-slide-up">
                          <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-3 text-emerald-500">
                              <RectangleStackIcon className="w-4 h-4" />
                              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Vertical Story (9:16)</span>
                            </div>
                            <button
                              onClick={() => { const a = document.createElement('a'); a.href = v.adaptations!['9:16']; a.download = `worker-ecom-${v.id}-story.png`; a.click(); }}
                              className="text-[9px] font-black text-white uppercase bg-neutral-800 px-5 py-2 rounded-full hover:bg-neutral-700 transition-all border border-neutral-700"
                            >
                              Descargar 9:16
                            </button>
                          </div>
                          <div className="aspect-[9/16] w-32 mx-auto bg-neutral-950 rounded-[1.5rem] overflow-hidden shadow-2xl border border-neutral-800 hover:scale-105 transition-transform duration-500 cursor-zoom-in">
                            <img src={v.adaptations['9:16']} className="w-full h-full object-cover" alt="Story adaptation" />
                          </div>
                        </div>
                      )}
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

export default EcommerceStudio;
