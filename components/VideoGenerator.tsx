
import React, { useState, useEffect } from 'react';
import { 
  FilmIcon, 
  SparklesIcon, 
  ArrowLeftIcon, 
  ArrowDownTrayIcon,
  VideoCameraIcon,
  ClockIcon,
  ComputerDesktopIcon,
  BanknotesIcon
} from '@heroicons/react/24/solid';
import { generateVideoSequence } from '../services/gemini';
import { ProgressState } from '../types';

interface VideoGeneratorProps {
  onBack: () => void;
  onProcessing?: (val: boolean) => void;
}

const VideoGenerator: React.FC<VideoGeneratorProps> = ({ onBack, onProcessing }) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('9:16');
  const [duration, setDuration] = useState<'8s' | '15s' | '25s'>('8s');
  const [progress, setProgress] = useState<ProgressState>({ status: 'idle', message: '' });
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const isWorking = progress.status === 'processing';

  useEffect(() => {
    onProcessing?.(isWorking);
  }, [isWorking, onProcessing]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!imagePreview || !prompt.trim()) return;
    setProgress({ status: 'processing', message: 'Iniciando Veo 3.1...' });
    setVideoUrl(null);
    try {
      const url = await generateVideoSequence(imagePreview, imageFile!.type, prompt, aspectRatio, duration, (msg) => setProgress(prev => ({ ...prev, message: msg })));
      setVideoUrl(url);
      setProgress({ status: 'success', message: '¡Video generado!' });
    } catch (e: any) {
      setProgress({ status: 'error', message: e.message || 'Error.' });
    }
  };

  return (
    <div className="h-full flex flex-col lg:flex-row bg-black overflow-hidden">
      <div className="w-full lg:w-1/3 border-r border-neutral-800 bg-neutral-900/50 p-8 flex flex-col">
        <button onClick={onBack} disabled={isWorking} className={`flex items-center text-neutral-500 hover:text-white mb-8 text-sm uppercase font-bold tracking-widest ${isWorking ? 'opacity-30 cursor-not-allowed' : ''}`}>
          <ArrowLeftIcon className="w-4 h-4 mr-2" /> Volver
        </button>

        <h2 className="text-2xl font-bold text-white mb-6">Video Editor</h2>
        
        <div className="space-y-8 flex-1">
          <div className="space-y-3">
            <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">1. Referencia Visual</label>
            <div onClick={() => !isWorking && document.getElementById('video-img-input')?.click()} className="aspect-video border-2 border-dashed border-neutral-800 rounded-lg flex items-center justify-center cursor-pointer bg-black/40 overflow-hidden">
              <input id="video-img-input" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              {imagePreview ? <img src={imagePreview} className="w-full h-full object-cover" alt="P" /> : <VideoCameraIcon className="w-8 h-8 text-neutral-700" />}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">2. Instrucciones</label>
            <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Cinematic orbital..." className="w-full h-32 bg-black border border-neutral-800 rounded-lg p-4 text-sm text-white focus:border-white outline-none resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Formato</label>
              <div className="flex bg-black rounded-lg p-1 border border-neutral-800">
                {(['9:16', '16:9'] as const).map(a => <button key={a} onClick={() => setAspectRatio(a)} className={`flex-1 py-2 text-[10px] font-bold rounded ${aspectRatio === a ? 'bg-neutral-800 text-white' : 'text-neutral-500'}`}>{a}</button>)}
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest text-center block">Duración</label>
              <div className="flex bg-black rounded-lg p-1 border border-neutral-800">
                {(['8s', '15s', '25s'] as const).map(d => <button key={d} onClick={() => setDuration(d)} className={`flex-1 py-2 text-[10px] font-bold rounded ${duration === d ? 'bg-neutral-800 text-white' : 'text-neutral-500'}`}>{d}</button>)}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8">
            <button onClick={handleGenerate} disabled={isWorking || !imagePreview || !prompt.trim()} className="w-full py-5 bg-white text-black font-bold uppercase text-xs hover:bg-neutral-200 flex flex-col items-center justify-center gap-1 disabled:opacity-50">
                <div className="flex items-center gap-3">
                    {isWorking ? <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div> : <SparklesIcon className="w-4 h-4" />}
                    Renderizar Video
                </div>
            </button>
            <div className="mt-2 flex items-center justify-center gap-2 text-[9px] text-neutral-500 uppercase font-bold tracking-widest">
                <BanknotesIcon className="w-3 h-3" /> Coste Est: $0.50 USD / Video
            </div>
        </div>
      </div>

      <div className="flex-1 bg-black flex items-center justify-center p-8 relative">
        <div className="w-full h-full max-w-5xl max-h-[85vh] bg-neutral-900/20 border border-neutral-800/50 rounded-2xl flex items-center justify-center relative overflow-hidden">
          {videoUrl ? <video src={videoUrl} controls autoPlay loop className="w-full h-full object-contain" /> : <div className="text-center opacity-20"><FilmIcon className="w-20 h-20 text-white mx-auto mb-6" /><p className="text-xl font-medium uppercase tracking-widest">Preview</p></div>}
        </div>
      </div>
    </div>
  );
};

export default VideoGenerator;
