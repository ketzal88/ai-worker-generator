
import React, { useState, useRef, useEffect } from 'react';
import { AdTemplate, ProductAnalysis, VariationResult } from '../types';
import { generateAdCreative, analyzeProductUrl, editAdCreative, resizeAdCreative } from '../services/gemini';
import {
  PhotoIcon,
  ArrowLeftIcon,
  SparklesIcon,
  ArrowDownTrayIcon,
  GlobeAltIcon,
  ExclamationTriangleIcon,
  BanknotesIcon,
  PencilSquareIcon,
  Square2StackIcon,
  TagIcon,
  AdjustmentsVerticalIcon,
  BoltIcon,
  EyeIcon,
  InformationCircleIcon,
  LinkIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/solid';

interface BestAdsGeneratorProps {
  template: AdTemplate;
  onBack: () => void;
  onProcessing?: (val: boolean) => void;
}

const BestAdsGenerator: React.FC<BestAdsGeneratorProps> = ({ template, onBack, onProcessing }) => {
  const [productUrl, setProductUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ProductAnalysis | null>(null);
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [selectedFiles, setSelectedFiles] = useState<(File | string)[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [results, setResults] = useState<VariationResult[]>([]);
  const [mainResult, setMainResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Global Options
  const [originalPrice, setOriginalPrice] = useState('');
  const [promoPrice, setPromoPrice] = useState('');
  const [extraInstructions, setExtraInstructions] = useState('');

  // Editor State
  const [isEditing, setIsEditing] = useState(false);
  const [editPrompt, setEditPrompt] = useState('');
  const [adaptations, setAdaptations] = useState<Record<string, string>>({});
  const [isResizing, setIsResizing] = useState(false);

  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    onProcessing?.(isLoading || isResizing || isAnalyzing);
  }, [isLoading, isResizing, isAnalyzing, onProcessing]);

  const handleAnalyzeUrl = async () => {
    if (!productUrl) return;
    setIsAnalyzing(true);
    setError(null);
    try {
      const result = await analyzeProductUrl(productUrl);
      setAnalysis(result);

      // Smart Mapping to Fields
      const newValues = { ...fieldValues };
      template.fields.forEach(field => {
        const id = field.id.toLowerCase();
        const label = field.label.toLowerCase();

        // Match product name to headline/title fields
        if ((id.includes('headline') || id.includes('title') || label.includes('titular') || label.includes('nombre')) && !newValues[field.id]) {
          newValues[field.id] = result.name;
        }

        // Match features to b1, b2, f1, f2, etc.
        const featureMatch = id.match(/[bf](\d+)/) || label.match(/beneficio (\d+)/) || label.match(/feature (\d+)/);
        if (featureMatch) {
          const index = parseInt(featureMatch[1]) - 1;
          if (result.features[index] && !newValues[field.id]) {
            newValues[field.id] = result.features[index];
          }
        }
      });
      setFieldValues(newValues);

      // Map Prices
      if (result.pricing) {
        if (result.pricing.original && !originalPrice) setOriginalPrice(result.pricing.original.toString());
        if (result.pricing.promo && !promoPrice) setPromoPrice(result.pricing.promo.toString());
      }

      // Suggest Extra Instructions based on Environment and Tone
      if (result.environment && !extraInstructions) {
        setExtraInstructions(`${result.environment}${result.tone ? `. Tono: ${result.tone}` : ''}`);
      }

    } catch (err: any) {
      console.error("Analysis failed:", err);
      setError(err.message || "No se pudo analizar la URL.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerate = async () => {
    const validFiles = selectedFiles.filter(Boolean);
    if (validFiles.length < template.requiredImages) {
      return setError(`Faltan imágenes. El diseño requiere ${template.requiredImages} fotos.`);
    }
    setIsLoading(true);
    setError(null);
    setResults([]);
    setMainResult(null);
    setAdaptations({});

    try {
      const tempResults: VariationResult[] = [];
      const extraOptions = {
        originalPrice: originalPrice || undefined,
        promoPrice: promoPrice || undefined,
        extraInstructions: extraInstructions || undefined
      };

      for (let i = 0; i < quantity; i++) {
        const imageUrl = await generateAdCreative(template, fieldValues, validFiles, undefined, extraOptions);
        const res: VariationResult = { id: i, imageUrl, prompt: template.basePrompt, status: 'success' };
        tempResults.push(res);
        if (i === 0) setMainResult(imageUrl);
      }
      setResults(tempResults);
    } catch (err: any) {
      const errMsg = err?.message || String(err);
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const applyEdit = async () => {
    if (!mainResult || !editPrompt) return;
    setIsLoading(true);
    try {
      const edited = await editAdCreative(mainResult, editPrompt);
      setMainResult(edited);
      setIsEditing(false);
      setEditPrompt('');
    } catch (err) { setError("Error en edición"); }
    finally { setIsLoading(false); }
  };

  const generateResizes = async () => {
    if (!mainResult) return;
    setIsResizing(true);
    const ratios = ['9:16', '1:1', '4:5'];
    const newAdapts: Record<string, string> = {};
    try {
      for (const r of ratios) {
        const url = await resizeAdCreative(mainResult, r);
        newAdapts[r] = url;
      }
      setAdaptations(newAdapts);
    } catch (err) { setError("Error redimensionando"); }
    finally { setIsResizing(false); }
  };

  const downloadAll = () => {
    if (mainResult) {
      const link = document.createElement('a');
      link.href = mainResult;
      link.download = `best-ad-main.png`;
      link.click();
    }
    Object.entries(adaptations).forEach(([ratio, url], idx) => {
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = url as string;
        link.download = `best-ad-${ratio.replace(':', '-')}.png`;
        link.click();
      }, (idx + 1) * 250);
    });
  };

  return (
    <div className="flex flex-col h-full lg:flex-row bg-black overflow-hidden">
      {/* PANEL IZQUIERDO: CONFIGURACIÓN */}
      <div className="w-full lg:w-1/3 border-r border-neutral-900 p-8 overflow-y-auto custom-scrollbar bg-neutral-950">
        <button onClick={onBack} disabled={isLoading || isAnalyzing} className="mb-10 text-[10px] font-black uppercase tracking-widest text-neutral-500 hover:text-white flex items-center gap-2">
          <ArrowLeftIcon className="w-4 h-4" /> Volver a la Librería
        </button>

        <div className="mb-10">
          <div className="flex items-center gap-2 text-blue-500 mb-2">
            <BoltIcon className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Estructura Ganadora</span>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase mb-2">{template.title}</h2>
          <p className="text-xs text-neutral-500 font-light leading-relaxed mb-6">{template.description}</p>

          <div className="p-3 bg-blue-600/10 border border-blue-600/20 rounded-xl flex items-start gap-3">
            <InformationCircleIcon className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-[10px] text-blue-400 font-medium leading-relaxed uppercase tracking-tight">Carga tu producto y rellena los campos. Nuestra IA replicará el layout de la derecha.</p>
          </div>
        </div>

        <div className="space-y-10">
          {/* LINK DEL PRODUCTO */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest">0. Inteligencia de Producto (Link)</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                <input
                  type="url"
                  value={productUrl}
                  onChange={(e) => setProductUrl(e.target.value)}
                  placeholder="Link de Amazon, Shopify, Web..."
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-12 pr-4 py-4 text-xs text-white focus:border-blue-500 outline-none"
                />
              </div>
              <button
                onClick={handleAnalyzeUrl}
                disabled={isAnalyzing || !productUrl}
                className="bg-neutral-800 hover:bg-neutral-700 text-white px-6 rounded-xl transition-all disabled:opacity-30"
              >
                {isAnalyzing ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <MagnifyingGlassIcon className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* ASSETS ENCONTRADOS */}
          {analysis && (analysis.mainImage || (analysis.gallery && analysis.gallery.length > 0)) && (
            <div className="space-y-4 p-5 bg-blue-500/5 rounded-2xl border border-blue-500/10">
              <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-2">
                <SparklesIcon className="w-4 h-4" /> Assets Detectados
              </label>
              <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                {[analysis.logo, analysis.mainImage, ...(analysis.gallery || [])].filter(Boolean).map((img, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      const newFiles = [...selectedFiles];
                      let targetIdx = newFiles.findIndex(f => !f);
                      if (targetIdx === -1 && newFiles.length < template.requiredImages) {
                        newFiles.push(img as string);
                      } else {
                        if (targetIdx === -1) targetIdx = 0;
                        newFiles[targetIdx] = img as string;
                      }
                      setSelectedFiles(newFiles);
                    }}
                    className="relative shrink-0 w-20 h-20 rounded-xl overflow-hidden border border-neutral-800 bg-neutral-900 group cursor-pointer hover:border-blue-500 transition-all"
                  >
                    <img src={img as string} className="w-full h-full object-contain p-1" />
                    {img === analysis.logo && (
                      <div className="absolute top-0 left-0 bg-blue-600 text-[8px] font-black px-1.5 py-0.5 rounded-br-lg uppercase tracking-tighter">Logo</div>
                    )}
                    <div className="absolute inset-0 bg-blue-600/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                      <CheckCircleIcon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-tighter">Click para usar como imagen base</p>
            </div>
          )}

          {/* ASSETS */}
          <div className="space-y-4">
            <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest">
              1. {template.requiredImages > 1 ? `Subir ${template.requiredImages} Fotos Base` : 'Imagen del Producto'}
            </label>
            <div className={`grid gap-4 ${template.requiredImages > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
              {Array.from({ length: template.requiredImages }).map((_, idx) => (
                <div
                  key={idx}
                  onClick={() => !isLoading && !isAnalyzing && fileInputRefs.current[idx]?.click()}
                  className={`${template.requiredImages > 1 ? 'aspect-square' : 'aspect-video'} border-2 border-dashed border-neutral-800 rounded-2xl flex items-center justify-center cursor-pointer hover:border-blue-500/30 transition-all bg-neutral-900/50 overflow-hidden relative group`}
                >
                  <input
                    type="file"
                    ref={el => fileInputRefs.current[idx] = el}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const newFiles = [...selectedFiles];
                        newFiles[idx] = e.target.files[0];
                        setSelectedFiles(newFiles);
                      }
                    }}
                  />
                  {selectedFiles[idx] ? (
                    <img
                      src={typeof selectedFiles[idx] === 'string' ? selectedFiles[idx] as string : URL.createObjectURL(selectedFiles[idx] as File)}
                      className="w-full h-full object-cover"
                      alt={`P-${idx}`}
                    />
                  ) : (
                    <div className="text-center">
                      <PhotoIcon className="w-8 h-8 text-neutral-700 mx-auto mb-2" />
                      <p className="text-[8px] text-neutral-600 uppercase font-bold tracking-widest text-center px-4">
                        {template.requiredImages > 1 ? `Foto ${idx + 1}` : 'Sube la foto base'}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* TEMPLATE FIELDS */}
          <div className="space-y-6 pt-6 border-t border-neutral-900">
            <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest">2. Contenido del Anuncio</label>
            {template.fields.map((field) => (
              <div key={field.id} className="space-y-2">
                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">{field.label}</label>
                <input
                  type="text"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-4 text-xs text-white focus:border-blue-500 outline-none"
                  placeholder={field.placeholder}
                  value={fieldValues[field.id] || ''}
                  onChange={(e) => setFieldValues({ ...fieldValues, [field.id]: e.target.value })}
                />
              </div>
            ))}
          </div>

          {/* PRICE & EXTRAS */}
          <div className="space-y-6 pt-6 border-t border-neutral-900">
            <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-2">
              <TagIcon className="w-3 h-3" /> 3. Oferta y Precios (Opcional)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-[9px] font-bold text-neutral-600 uppercase tracking-widest">Precio Original</label>
                <input
                  type="text"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  placeholder="Ej: €49.00"
                  className="w-full bg-neutral-900/50 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white focus:border-blue-500 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-bold text-neutral-600 uppercase tracking-widest">Precio Promo</label>
                <input
                  type="text"
                  value={promoPrice}
                  onChange={(e) => setPromoPrice(e.target.value)}
                  placeholder="Ej: €39.90"
                  className="w-full bg-neutral-900/50 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="space-y-2 pt-4">
              <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-2">
                <AdjustmentsVerticalIcon className="w-3 h-3" /> Instrucciones Extra
              </label>
              <textarea
                value={extraInstructions}
                onChange={(e) => setExtraInstructions(e.target.value)}
                placeholder="Ej: Fondo de mármol blanco, iluminación de estudio suave..."
                className="w-full bg-neutral-900/50 border border-neutral-800 rounded-xl p-4 text-xs text-white focus:border-blue-500 outline-none h-24 resize-none"
              />
            </div>
          </div>

          <div className="pt-8 pb-20">
            <button
              onClick={handleGenerate}
              disabled={isLoading || selectedFiles.length === 0 || isAnalyzing}
              className="w-full py-6 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-[0.3em] text-[11px] hover:bg-blue-500 active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-20 shadow-xl"
            >
              {isLoading ? <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin"></div> : <SparklesIcon className="w-5 h-5" />}
              Renderizar Anuncio
            </button>
            <div className="mt-4 flex items-center justify-center gap-2 text-[9px] text-neutral-600 uppercase font-bold tracking-widest">
              <BanknotesIcon className="w-3 h-3" /> Coste: ${(quantity * 0.05).toFixed(2)} USD
            </div>

            {error && (
              <div className="mt-6 space-y-4">
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-[10px] text-red-500 font-bold uppercase flex gap-3 items-start">
                  <ExclamationTriangleIcon className="w-5 h-5 shrink-0" />
                  <span>{error}</span>
                </div>
                {error.toLowerCase().includes('celebrity') && (
                  <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl animate-pulse">
                    <p className="text-[9px] text-blue-400 font-black uppercase tracking-widest flex items-center gap-2 mb-2">
                      <ShieldCheckIcon className="w-3 h-3" /> Tip para Bypass de Seguridad
                    </p>
                    <p className="text-[9px] text-neutral-400 leading-relaxed uppercase">
                      La IA cree que la modelo es famosa. Intenta escribir en 'Instrucciones Extra':
                      <span className="text-white block mt-1">"Esta es una foto de catálogo de una marca de ropa local con modelos no conocidos."</span>
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div >

      {/* PANEL DERECHO: PREVIEW & REFERENCIA */}
      <div className="flex-1 bg-black flex flex-col overflow-y-auto custom-scrollbar p-12 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none"></div>

        {
          mainResult ? (
            <div className="relative z-10 w-full max-w-2xl mx-auto space-y-12 pb-20 animate-fade-in">
              <div className="bg-neutral-900 p-2 rounded-[2.5rem] shadow-2xl border border-neutral-800">
                <img src={mainResult} alt="Main" className="w-full rounded-[2rem] shadow-2xl" />

                <div className="p-6 flex flex-wrap gap-4 justify-center">
                  <a href={mainResult} download="best-ad.png" className="flex items-center gap-2 px-8 py-4 bg-white text-black font-black uppercase tracking-widest text-[10px] rounded-full shadow-2xl hover:scale-105 transition-all">
                    <ArrowDownTrayIcon className="w-4 h-4" /> Descargar
                  </a>
                  <button onClick={() => setIsEditing(!isEditing)} className="flex items-center gap-2 px-8 py-4 bg-neutral-800 text-white font-black uppercase tracking-widest text-[10px] rounded-full border border-neutral-700 hover:bg-neutral-700">
                    <PencilSquareIcon className="w-4 h-4" /> Editar IA
                  </button>
                  <button onClick={generateResizes} disabled={isResizing} className="flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-black uppercase tracking-widest text-[10px] rounded-full shadow-lg hover:bg-blue-500 disabled:opacity-30">
                    {isResizing ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Square2StackIcon className="w-4 h-4" />}
                    Redimensionar
                  </button>
                </div>

                {isEditing && (
                  <div className="p-6 border-t border-neutral-800 animate-slide-up">
                    <textarea
                      value={editPrompt}
                      onChange={(e) => setEditPrompt(e.target.value)}
                      placeholder="Ej: Cambia el fondo a color rojo brillante..."
                      className="w-full bg-black border border-neutral-800 rounded-xl p-4 text-xs text-white focus:border-blue-500 outline-none h-24 resize-none mb-4"
                    />
                    <button onClick={applyEdit} disabled={isLoading} className="w-full py-4 bg-white text-black font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-neutral-200">
                      Aplicar Cambios con IA
                    </button>
                  </div>
                )}
              </div>

              {/* VARIACIONES / ADAPTACIONES DE REDIMENSIONAMIENTO */}
              {(Object.keys(adaptations).length > 0 || isResizing) && (
                <div className="border-t border-neutral-900 pt-10 space-y-8">
                  <div className="flex justify-between items-end">
                    <div>
                      <h3 className="text-sm font-black text-white uppercase tracking-[0.3em] flex items-center gap-2 mb-1">
                        <Square2StackIcon className="w-4 h-4 text-blue-500" /> Variaciones RRSS
                      </h3>
                      <p className="text-[10px] text-neutral-500 uppercase tracking-widest">Formatos adaptados automáticamente</p>
                    </div>
                    {Object.keys(adaptations).length > 0 && (
                      <button onClick={downloadAll} className="text-blue-500 hover:text-white text-[10px] font-black uppercase tracking-widest border-b border-blue-500 pb-0.5 transition-colors">
                        Descargar Todo el Pack
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {['1:1', '9:16'].map(ratio => {
                      const url = adaptations[ratio];
                      return (
                        <div key={ratio} className="bg-neutral-900/50 p-6 rounded-[2rem] border border-neutral-800 flex flex-col items-center">
                          <span className="text-[10px] font-black text-neutral-500 mb-4 uppercase tracking-[0.2em]">{ratio === '1:1' ? 'SQUARE (1:1)' : 'STORY / REEL (9:16)'}</span>
                          <div className={`w-full bg-black mb-6 rounded-2xl overflow-hidden relative shadow-xl ${ratio === '1:1' ? 'aspect-square' : 'aspect-[9/16]'}`}>
                            {url ? (
                              <img src={url} className="w-full h-full object-cover" alt={`Resize ${ratio}`} />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                                {isResizing ? (
                                  <div className="w-8 h-8 border-2 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
                                ) : (
                                  <EyeIcon className="w-8 h-8 text-neutral-800" />
                                )}
                                <p className="text-[9px] text-neutral-700 uppercase font-bold tracking-widest">Esperando Redimensión</p>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="relative z-10 w-full flex flex-col items-center">
              <div className="mb-8 flex flex-col items-center w-full max-w-2xl">
                <div className="flex items-center gap-3 text-blue-500 mb-8 bg-blue-500/10 px-6 py-2 rounded-full border border-blue-500/20">
                  <EyeIcon className="w-4 h-4" />
                  <span className="text-[11px] font-black uppercase tracking-[0.5em]">Referencia de Layout Objetiva</span>
                </div>

                <div className="bg-neutral-900 p-2 rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.5)] border border-neutral-800 w-full overflow-hidden min-h-[500px] flex items-center justify-center">
                  <img
                    src={template.thumbnailUrl}
                    alt="Reference Layout"
                    className="w-full h-auto rounded-[2.5rem] transition-all duration-700"
                    onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/1000?text=Imagen+Referencia')}
                  />
                </div>

                <div className="mt-10 text-center space-y-4 max-w-md">
                  <div className="flex items-center justify-center gap-4">
                    <div className="h-px w-8 bg-neutral-800"></div>
                    <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-[0.6em]">Laboratorio de Performance</p>
                    <div className="h-px w-8 bg-neutral-800"></div>
                  </div>
                  <p className="text-[11px] text-neutral-600 font-medium leading-relaxed italic">
                    Esta es la estructura que nuestra IA replicará al procesar tu producto. Úsala de guía para rellenar los campos.
                  </p>
                </div>
              </div>

              {isLoading && (
                <div className="flex flex-col items-center gap-6 animate-pulse mt-12">
                  <div className="w-14 h-14 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
                  <div className="text-center">
                    <p className="text-[11px] font-black text-blue-500 uppercase tracking-widest mb-1">Generando Asset Maestro...</p>
                    <p className="text-[9px] text-neutral-600 uppercase tracking-widest">Nuestra IA está componiendo tu anuncio</p>
                  </div>
                </div>
              )}
            </div>
          )
        }
      </div>
    </div>
  );
};

export default BestAdsGenerator;
