
export interface AdTemplateField {
  id: string;
  label: string;
  placeholder?: string;
  type: 'text' | 'textarea' | 'select';
  options?: string[]; // For select type
}

export interface AdTemplate {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  basePrompt: string; // The core prompt in JSON format
  fields: AdTemplateField[];
  requiredImages: number;
  aspectRatio: '1:1' | '16:9' | '9:16' | '4:3' | '3:4' | '4:5';
  category?: string;
}

export interface ProductAnalysis {
  name: string;
  brand?: string;
  logo?: string;
  description: string;
  features: string[];
  pricing?: {
    original?: string;
    promo?: string;
    currency?: string;
  };
  mainImage?: string;
  gallery?: string[];
  keywords: string[];
  environment: string;
  tone: string;
  sources?: { uri: string; title: string }[];
}

export interface VariationResult {
  id: number;
  prompt: string;
  imageUrl: string | null;
  status: 'pending' | 'processing' | 'success' | 'error';
  adaptations?: Record<string, string>; // New: Store resized versions like {'9:16': 'data:...'}
}

export interface VideoVariationResult {
  id: number;
  prompt: string;
  videoUrl: string | null;
  status: 'pending' | 'processing' | 'success' | 'error';
}


export type VideoAspectRatio = '16:9' | '9:16';
export type VideoDurationTier = '8s' | '15s' | '25s';

export interface ProgressState {
  status: 'idle' | 'analyzing' | 'generating_prompts' | 'rendering' | 'processing' | 'success' | 'error';
  message: string;
  currentStep?: number;
  totalSteps?: number;
}

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
  interface Window {
    aistudio?: AIStudio;
  }
}
