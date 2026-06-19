export interface UsageExample {
  id: string;
  nativeSentence: string;
  frenchSentence: string;
  contextDescription: string;
}

export interface TranslationEntry {
  id: string;
  nativeText: string;
  frenchTranslation: string;
  description: string;
  type: 'written' | 'oral';
  category: string;
  createdAt: string;
  audioUrl?: string; // Optional recorded audio URL (or Base64 data)
  examples?: UsageExample[];
}

export type TabType = 'translate' | 'insert' | 'examples' | 'culture' | 'apk' | 'transcription';

export interface TranslationRequest {
  text: string;
  sourceLang: string;
  type: 'written' | 'oral';
}

export interface TranslationResponse {
  translation: string;
  phonetics?: string; // Guidance on pronunciation
  explanation: string; // Linguistic context or breakdown of terms
}

export interface ContextGenerationRequest {
  text: string;
  translation: string;
  sourceLang: string;
}

export interface ContextGenerationResponse {
  description: string;
  examples: UsageExample[];
}
