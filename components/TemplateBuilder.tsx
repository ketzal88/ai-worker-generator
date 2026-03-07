import React, { useState } from 'react';
import { generateTemplateBlueprint } from '../services/gemini';
import { Upload, Copy, Sparkles, Check, ChevronRight } from 'lucide-react';

export const TemplateBuilder: React.FC = () => {
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [blueprint, setBlueprint] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
            setBlueprint('');
        }
    };

    const handleGenerate = async () => {
        if (!image) return;
        setLoading(true);
        try {
            const result = await generateTemplateBlueprint(image);
            setBlueprint(result);
        } catch (error) {
            console.error("Error generating blueprint:", error);
            alert("Error al generar el blueprint. Intenta con otra imagen.");
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(blueprint);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-6xl mx-auto p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="mb-10 text-center">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4">
                    Template Mastery Builder
                </h1>
                <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                    Sube un anuncio ganador y deja que la IA cree el blueprint JSON de alta fidelidad automáticamente.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* Left Col: Upload & Preview */}
                <div className="space-y-6">
                    <div className={`relative border-2 border-dashed rounded-3xl p-8 transition-all duration-500 overflow-hidden
            ${!image ? 'border-slate-700 bg-slate-900/40' : 'border-indigo-500/50 bg-indigo-500/5'}`}>

                        {preview ? (
                            <div className="relative group">
                                <img src={preview} alt="Referencia" className="w-full h-auto rounded-2xl shadow-2xl" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                                    <label className="cursor-pointer bg-white/10 hover:bg-white/20 backdrop-blur-md px-6 py-3 rounded-full text-white font-medium border border-white/20 transition-all">
                                        Cambiar Imagen
                                        <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                                    </label>
                                </div>
                            </div>
                        ) : (
                            <label className="flex flex-col items-center justify-center py-20 cursor-pointer group">
                                <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 ring-4 ring-indigo-500/5">
                                    <Upload className="w-10 h-10 text-indigo-400" />
                                </div>
                                <span className="text-xl font-medium text-slate-200 mb-2">Sube una Imagen de Referencia</span>
                                <span className="text-sm text-slate-500">PNG, JPG o WebP de alta calidad</span>
                                <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                            </label>
                        )}
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={!image || loading}
                        className={`w-full py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300
              ${!image || loading
                                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-[0_0_30px_rgba(79,70,229,0.4)] hover:-translate-y-1'}`}
                    >
                        {loading ? (
                            <>
                                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Analizando Estructura...</span>
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-6 h-6" />
                                <span>Generar Blueprint JSON</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Right Col: JSON Result */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <ChevronRight className="w-5 h-5 text-indigo-400" />
                            Resultado del Cerebro
                        </h3>
                        {blueprint && (
                            <button
                                onClick={copyToClipboard}
                                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-sm transition-all border border-white/10"
                            >
                                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                                <span>{copied ? 'Copiado' : 'Copiar'}</span>
                            </button>
                        )}
                    </div>

                    <div className="relative group min-h-[500px]">
                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
                        <textarea
                            readOnly
                            value={blueprint}
                            placeholder="El código JSON aparecerá aquí después de procesar la imagen..."
                            className="relative w-full h-[500px] bg-slate-950/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 font-mono text-sm leading-relaxed text-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
                        />
                    </div>

                    {blueprint && (
                        <div className="p-6 bg-blue-500/5 rounded-2xl border border-blue-500/10 text-blue-300/80 text-sm leading-relaxed">
                            <p className="font-bold text-blue-400 mb-2 font-mono">NEXT STEPS:</p>
                            1. Revisa los <code className="text-white hover:text-blue-400 cursor-help transition-colors">{"{{tags}}"}</code> generados automáticamente. <br />
                            2. Pega este JSON en la propiedad <code className="text-white">basePrompt</code> de tu nuevo template en <code className="text-white">unifiedTemplates.ts</code>.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
