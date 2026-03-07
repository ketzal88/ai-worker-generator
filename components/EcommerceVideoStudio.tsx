
import React, { useState, useEffect, useRef } from 'react';
import { 
  VideoCameraIcon, 
  ArrowLeftIcon, 
  SparklesIcon,
  PhotoIcon,
  ArrowDownTrayIcon,
  BanknotesIcon,
  VideoCameraSlashIcon,
  CursorArrowRaysIcon,
  MagnifyingGlassPlusIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ForwardIcon,
  StopIcon,
  ShieldCheckIcon,
  ViewfinderCircleIcon,
  BoltIcon
} from '@heroicons/react/24/solid';
import { renderVideoVariation } from '../services/gemini';
import { ProgressState, VideoVariationResult } from '../types';

interface MovementType {
  id: string;
  name: string;
  description: string;
  prompt: string;
  icon: React.ElementType;
}

const MOVEMENTS: MovementType[] = [
  { 
    id: 'cinematic-orbit', 
    name: 'ÓRBITA CINEMÁTICA', 
    description: 'Movimiento circular suave.', 
    prompt: 'Smooth cinematic orbital movement around the main product. High-end studio lighting, elegant atmosphere.',
    icon: ViewfinderCircleIcon
  },
  { 
    id: 'dolly-zoom', 
    name: 'DOLLY IN / ZOOM', 
    description: 'Acercamiento al detalle.', 
    prompt: 'Slow dolly-in towards the product details. Focus on textures and high-quality craftsmanship.',
    icon: MagnifyingGlassPlusIcon
  },
  { 
    id: 'pan-lateral', 
    name: 'PANEO LATERAL', 
    description: 'Escaneo de izquierda a derecha.', 
    prompt: 'Horizontal cinematic pan across the scene. The camera reveals the product in a professional environment.',
    icon: CursorArrowRaysIcon
  },
  { 
    id: 'dynamic-reveal', 
    name: 'REVELACIÓN DINÁMICA', 
    description: 'Movimiento de abajo hacia arriba.', 
    prompt: 'Dynamic vertical reveal. The camera starts low and rises to show the full product with atmospheric lighting.',
    icon: BoltIcon
  }
];

interface EcommerceVideoStudioProps {
  onBack: () => void;
  onProcessing?: (val: boolean) => void;
}

const EcommerceVideoStudio: React.FC<EcommerceVideoStudioProps> = ({ onBack, onProcessing }) => {
  const [productImage, setProductImage] = useState<string | null>(null);
  const [selectedMovement, setSelectedMovement] = useState<MovementType>(MOVEMENTS[0]);
  const [editablePrompt, setEditablePrompt] = useState(MOVEMENTS[0].prompt);
  const [variations, setVariations] = useState<VideoVariationResult[]>([]);
  const [progress, setProgress] = useState<ProgressState>({ status: 'idle', message: '' });
  const [quantity, setQuantity] = useState<number>(3);
  const [isWaitingForNext, setIsWaitingForNext] = useState(false);
  
  const continueResolver = useRef<((val: boolean) => void) | null>(null);

  const isWorking = progress.status !== 'idle' && progress.status !== 'success' && progress.status !== 'error';

  useEffect(() => {
    onProcessing?.(isWorking || isWaitingForNext);
  }, [isWorking, isWaitingForNext, onProcessing]);

  const handleSelectMovement = (mov: MovementType) => {
    setSelectedMovement(mov);
    setEditablePrompt(mov.prompt);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => setProductImage(reader.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const startAutopilot = async () => {
    if (!productImage || !editablePrompt) return;
    
    if (window.aistudio && !(await window.aistudio.hasSelectedApiKey())) {
      await window.aistudio.openSelectKey();
    }

    try {
      setProgress({ status: 'rendering', message: 'Iniciando producción cinematográfica...', currentStep: 0, totalSteps: quantity });
      
      const newVariations: VideoVariationResult[] = Array.from({ length: quantity }).map((_, i) => ({
        id: i,
        prompt: editablePrompt,
        videoUrl: null,
        status: 'pending'
      }));
      setVariations(newVariations);

      for (let i = 0; i < quantity; i++) {
        setVariations(prev => prev.map((v, idx) => idx === i ? { ...v, status: 'processing' } : v));
        
        try {
          const videoUrl = await renderVideoVariation(productImage, editablePrompt, '9:16');
          setVariations(prev => prev.map((v, idx) => idx === i ? { ...v, videoUrl: videoUrl, status: 'success' } : v));
          setProgress(prev => ({ ...prev, currentStep: i + 1 }));

          if (i < quantity - 1) {
            setIsWaitingForNext(true);
            const userChoice = await new Promise<boolean>((resolve) => {
              continueResolver.current = resolve;
            });
            setIsWaitingForNext(false);
            
            if (!userChoice) {
              setProgress({ status: 'success', message: 'Producción finalizada.' });
              break;
            }
          }
        } catch (err: any) {
          console.error("Render error:", err);
          setVariations(prev => prev.map((v, idx) => idx === i ? { ...v, status: 'error' } : v));
          
          if (err.message?.includes('BLOQUEO') || err.message?.includes('RAI') || err.message?.includes('policy')) {
             setProgress({ status: 'error', message: err.message });
             break;
          }
        }
      }
      
      if (progress.status === 'rendering' || progress.status === 'idle') {
        setProgress(prev => ({ ...prev, status: 'success', message: '¡Videos completados!' }));
      }
    } catch (e: any) {
      setProgress({ status: 'error', message: 'Error en el motor de video.' });
    }
  };

  const handleContinue = (val: boolean) => {
    if (continueResolver.current) {
      continueResolver.current(val);
      continueResolver.current = null;
    }
  };

  return (
    <div className="h-full flex flex-col bg-black overflow-hidden">
      <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
        <div className="max-w-[1600px] mx-auto">
          <button onClick={onBack} disabled={isWorking || isWaitingForNext} className={`flex items-center text-neutral-500 hover:text-white mb-10 text-xs uppercase font-bold tracking-[0.2em] ${(isWorking || isWaitingForNext) ? 'opacity-30 cursor-not-allowed' : ''}`}>
            <ArrowLeftIcon className="w-4 h-4 mr-2" /> Volver al Inicio
          </button>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-16">
            <div className="xl:col-span-4 space-y-10">
              <div className="space-y-4">
                <h2 className="text-4xl font-bold text-white tracking-tighter uppercase">E-com <span className="text-emerald-500">Video Studio</span></h2>
                <p className="text-neutral-500 text-sm leading-relaxed max-w-sm font-light uppercase tracking-tighter">Crea spots publicitarios cinemáticos para tus productos automáticamente.</p>
              </div>

              {progress.status === 'error' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl flex gap-4 items-start shadow-xl">
                    <ExclamationTriangleIcon className="w-6 h-6 text-red-500 shrink-0" />
                    <p className="text-[10px] text-red-400 font-bold uppercase tracking-tight leading-relaxed">{progress.message}</p>
                  </div>
                </div>
              )}

              <div className="space-y-8">
                <div className="space-y-4 p-5 bg-neutral-900/50 border border-neutral-800 rounded-2xl">
                  <label className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Variaciones por Pack</label>
                  <div className="flex gap-2">
                    {[1, 3, 5].map(n => (
                      <button key={n} onClick={() => setQuantity(n)} disabled={isWorking || isWaitingForNext} className={`flex-1 py-4 text-xs font-black rounded-xl border transition-all ${quantity === n ? 'bg-white text-black border-white shadow-xl scale-105' : 'bg-neutral-900 border-neutral-800 text-neutral-500 hover:text-white'}`}>{n}</button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Imagen de Producto</label>
                  <div onClick={() => !isWorking && !isWaitingForNext && document.getElementById('auto-video-img')?.click()} className="aspect-video border border-dashed border-neutral-800 rounded-xl flex items-center justify-center cursor-pointer bg-neutral-900/30 overflow-hidden hover:bg-neutral-900/50 transition-all group">
                    <input id="auto-video-img" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                    {productImage ? <img src={productImage} className="w-full h-full object-contain" alt="P" /> : <div className="text-center"><PhotoIcon className="w-10 h-10 text-neutral-800 mx-auto mb-3" /><p className="text-[10px] text-neutral-600 uppercase font-bold tracking-widest">Carga la foto principal</p></div>}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-2">
                    <SparklesIcon className="w-3 h-3 text-emerald-500" /> Movimientos de Cámara
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {MOVEMENTS.map((mov) => {
                        const Icon = mov.icon;
                        const isSelected = selectedMovement.id === mov.id;
                        return (
                          <button key={mov.id} onClick={() => handleSelectMovement(mov)} disabled={isWorking || isWaitingForNext} className={`p-4 text-left border transition-all flex flex-col gap-3 rounded-xl ${isSelected ? 'bg-white text-black border-white shadow-lg' : 'bg-neutral-900 border-neutral-800'}`}>
                            <Icon className={`w-5 h-5 ${isSelected ? 'text-black' : 'text-neutral-500'}`} />
                            <h4 className={`text-[10px] font-black uppercase tracking-widest ${isSelected ? 'text-black' : 'text-white'}`}>{mov.name}</h4>
                          </button>
                        );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest text-center block">Prompt de Video</label>
                  <textarea value={editablePrompt} onChange={(e) => setEditablePrompt(e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-5 text-xs text-white h-32 resize-none focus:border-white outline-none" />
                </div>

                <button onClick={startAutopilot} disabled={isWorking || isWaitingForNext || !productImage} className="w-full py-6 bg-white text-black font-black uppercase text-xs hover:bg-neutral-200 flex flex-col items-center justify-center gap-1 shadow-2xl active:scale-95 transition-all">
                    <div className="flex items-center gap-3">
                        {isWorking ? <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div> : <SparklesIcon className="w-4 h-4" />}
                        Renderizar Pack
                    </div>
                </button>
              </div>
            </div>

            <div className="xl:col-span-8 space-y-8">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-8">
                <h3 className="text-2xl font-black text-white tracking-tight uppercase">Producción <span className="text-neutral-600 font-light ml-2 text-sm tracking-widest">Story 9:16</span></h3>
              </div>

              {isWaitingForNext && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-8 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-6 animate-slide-up shadow-2xl">
                  <div className="flex items-center gap-4">
                    <CheckCircleIcon className="w-10 h-10 text-emerald-500" />
                    <div>
                      <h4 className="text-lg font-black text-white uppercase tracking-tighter">Video Completado</h4>
                      <p className="text-xs text-emerald-500/80 font-black uppercase tracking-widest">¿Renderizar la siguiente variación?</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button onClick={() => handleContinue(false)} className="px-8 py-4 bg-neutral-800 text-white font-black text-[10px] uppercase rounded-xl">Finalizar Aquí</button>
                    <button onClick={() => handleContinue(true)} className="px-10 py-4 bg-white text-black font-black text-[10px] uppercase rounded-xl shadow-lg">Continuar con el Siguiente</button>
                  </div>
                </div>
              )}

              {variations.length === 0 ? (
                <div className="h-[70vh] bg-neutral-900/10 border border-dashed border-neutral-800 flex flex-col items-center justify-center opacity-30 rounded-[2rem] p-12 text-center group transition-all">
                    <VideoCameraSlashIcon className="w-20 h-20 text-neutral-800 mb-6" />
                    <p className="text-[10px] uppercase tracking-[0.4em] font-black">Esperando carga de producto</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-12 pb-20">
                  {variations.map((v) => (
                    v.videoUrl || v.status === 'processing' || v.status === 'error' ? (
                      <div key={v.id} className={`bg-neutral-900 border rounded-[2.5rem] overflow-hidden flex flex-col relative shadow-2xl max-w-2xl mx-auto w-full ${v.status === 'processing' ? 'border-emerald-500/50 scale-[0.98]' : 'border-neutral-800 hover:border-neutral-600'}`}>
                        <div className="w-full relative flex items-center justify-center bg-black aspect-[9/16]">
                          {v.videoUrl ? (
                            <>
                              <video src={v.videoUrl} controls autoPlay loop className="w-full h-full object-cover" />
                              <div className="absolute top-8 right-8 z-20">
                                  <button onClick={() => { const a = document.createElement('a'); a.href = v.videoUrl!; a.download = `worker-v-${v.id}.mp4`; a.click(); }} className="p-5 bg-white text-black rounded-full shadow-2xl hover:scale-110 active:scale-90 transition-all"><ArrowDownTrayIcon className="w-6 h-6" /></button>
                              </div>
                            </>
                          ) : v.status === 'error' ? (
                            <div className="text-center p-12 space-y-4">
                                <ExclamationTriangleIcon className="w-16 h-16 text-red-500/30 mx-auto" />
                                <div className="space-y-2">
                                  <p className="text-red-500 text-[10px] font-black uppercase tracking-widest">Error de Producción</p>
                                  <p className="text-neutral-500 text-[9px] uppercase font-bold tracking-tighter max-w-xs mx-auto leading-relaxed italic">El filtro de seguridad bloqueó el video.</p>
                                </div>
                            </div>
                          ) : (
                            <div className="text-center space-y-6">
                              <div className="w-16 h-16 border-4 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin mx-auto"></div>
                              <p className="text-xs text-emerald-500 uppercase tracking-[0.4em] font-black animate-pulse">Renderizando Variación {v.id + 1}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : null
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

export default EcommerceVideoStudio;
