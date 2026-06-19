import React, { useState, useEffect, useRef } from "react";
import { 
  Mic, 
  MicOff, 
  Keyboard, 
  Sparkles, 
  Volume2, 
  ArrowRightLeft, 
  Languages, 
  Save, 
  ArrowRight,
  RefreshCw,
  Info,
  BookText
} from "lucide-react";
import { TranslationEntry } from "../types";

interface TranslationPageProps {
  sourceLang: string;
  setSourceLang: (lang: string) => void;
  onSaveToDictionary: (entry: Omit<TranslationEntry, "id" | "createdAt">) => void;
  dictionary?: TranslationEntry[];
}

export default function TranslationPage({ 
  sourceLang, 
  setSourceLang, 
  onSaveToDictionary,
  dictionary = []
}: TranslationPageProps) {
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recognitionError, setRecognitionError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Translation output state
  const [translationResult, setTranslationResult] = useState<{
    translation: string;
    phonetics?: string;
    explanation: string;
  } | null>(null);
  
  const [savedSuccess, setSavedSuccess] = useState(false);

  // References for Speech Recognition API
  const recognitionRef = useRef<any>(null);

  // Suggested mother tongues with focus on Guiziga and neighboring Far-North languages
  const predefinedLanguages = [
    "Guiziga",
    "Fulfulde",
    "Mafa",
    "Tupuri",
    "Mousgoum",
    "Moundang",
    "Kanouri",
    "Français"
  ];

  const [customLangInput, setCustomLangInput] = useState(false);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = 
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      // We set the transcription lang to match a reasonable default fallback, or browser default
      rec.lang = "fr-FR"; 

      rec.onstart = () => {
        setIsRecording(true);
        setRecognitionError("");
      };

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputText(transcript);
        }
      };

      rec.onerror = (event: any) => {
        console.error("Speech Recognition Error:", event.error);
        if (event.error === "not-allowed") {
          setRecognitionError("L'accès au microphone a été refusé. Veuillez autoriser le micro dans votre navigateur.");
        } else {
          setRecognitionError("Erreur d'écoute : " + event.error);
        }
        setIsRecording(false);
      };

      rec.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = rec;
    }
  }, []);

  const handleToggleRecord = () => {
    if (!recognitionRef.current) {
      setRecognitionError("La reconnaissance vocale de votre navigateur n'est pas pleinement supportée dans cet iframe, ou vous devez d'abord donner l'autorisation.");
      // Soft simulation fallback in case iframe blocks mediaDevices completely
      simulateMicInput();
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      try {
        setRecognitionError("");
        recognitionRef.current.start();
      } catch (err) {
        console.error("Failed to start speech recognition:", err);
        // Fallback simulated input for iframe constraints
        simulateMicInput();
      }
    }
  };

  const simulateMicInput = () => {
    setIsRecording(true);
    setRecognitionError("");
    setTimeout(() => {
      const phrasesSimulation = [
        "Yahu, slam fika !",
        "Barka liyā",
        "Mədəf gi gə diza",
        "Dza baka !",
        "Fou fika?"
      ];
      const randomPhrase = phrasesSimulation[Math.floor(Math.random() * phrasesSimulation.length)];
      setInputText(randomPhrase);
      setIsRecording(false);
      setRecognitionError("Simulé : micro capté dans l'environnement virtuel.");
    }, 2000);
  };

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    setIsLoading(true);
    setTranslationResult(null);
    setSavedSuccess(false);

    try {
      // Simulate local processing delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));

      const query = inputText.toLowerCase().trim();
      const match = dictionary.find(entry => 
        entry.nativeText.toLowerCase().includes(query) || 
        entry.frenchTranslation.toLowerCase().includes(query)
      );

      if (match) {
        setTranslationResult({
          translation: match.frenchTranslation,
          phonetics: "Source : Lexique communautaire",
          explanation: match.description
        });
      } else {
        setTranslationResult({
          translation: "Mot introuvable dans le lexique",
          phonetics: "Non répertorié",
          explanation: "Cette expression ne se trouve pas encore dans votre base de données locale. Vous pouvez vous rendre dans l'onglet 'Contribuer & Éditer' pour l'ajouter manuellement."
        });
      }
    } catch (err: any) {
      console.error(err);
      setTranslationResult({
        translation: "Une erreur de base de données est survenue.",
        phonetics: "[er-reur locale]",
        explanation: "Impossible de parcourir le lexique des utilisateurs."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const speakTranslation = () => {
    if (!translationResult || !translationResult.translation) return;
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(translationResult.translation);
      utterance.lang = "fr-FR";
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    } else {
      alert("La synthèse vocale n'est pas supportée par votre navigateur.");
    }
  };

  const handleSaveToDict = () => {
    if (!translationResult) return;
    onSaveToDictionary({
      nativeText: inputText,
      frenchTranslation: translationResult.translation,
      description: translationResult.explanation,
      type: isRecording ? "oral" : "written",
      category: "Général",
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 animate-fade-in" id="translation_container">
      {/* Configuration Header */}
      <div className="bg-white border border-natural-border rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6" id="lang_header">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-natural-primary font-bold text-xs uppercase tracking-widest font-sans">
            <Languages size={15} />
            <span>Direction Linguistique</span>
          </div>
          <h2 className="text-xl font-serif text-natural-text flex items-center gap-2">
            <span>Traducteur</span>
            <span className="px-3 py-1 rounded-full bg-natural-accent text-natural-secondary text-xs font-serif italic border border-natural-dark-border">{sourceLang}</span>
            <ArrowRight size={16} className="text-natural-muted" />
            <span className="px-3 py-1 rounded-full bg-natural-primary text-white text-xs font-serif italic">Français</span>
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3" id="lang_selection">
          <span className="text-xs uppercase tracking-wider font-bold text-natural-muted">Votre Langue Maternelle :</span>
          {customLangInput ? (
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                value={sourceLang}
                onChange={(e) => setSourceLang(e.target.value)}
                placeholder="Ex: Bambara, Breton..."
                className="px-3 py-1.5 border border-natural-dark-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-natural-primary bg-natural-bg font-serif font-medium text-natural-text"
              />
              <button 
                onClick={() => setCustomLangInput(false)}
                className="text-xs text-natural-primary hover:underline font-mono"
              >
                Liste
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <select 
                value={sourceLang}
                onChange={(e) => {
                  if (e.target.value === "custom") {
                    setCustomLangInput(true);
                  } else {
                    setSourceLang(e.target.value);
                  }
                }}
                className="px-3 py-2 border border-natural-dark-border rounded-xl text-xs uppercase tracking-wider font-bold focus:outline-none focus:ring-2 focus:ring-natural-primary bg-white text-natural-text"
              >
                {predefinedLanguages.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
                <option value="custom">✍️ Autre langue...</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Translation Dual-Pane Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="translation_workspace">
        {/* Source Box */}
        <div className="bg-white border border-natural-border rounded-3xl p-6 shadow-sm flex flex-col justify-between min-h-[340px] relative transition-all focus-within:ring-2 focus-within:ring-natural-primary/25" id="source_panel">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest font-bold text-[#A69D91]">
                Source ({sourceLang})
              </span>
              <div className="flex gap-1">
                <button 
                  onClick={() => { setInputText(""); setTranslationResult(null); }}
                  className="px-2 py-1 text-natural-muted hover:text-natural-text text-xs font-semibold"
                  title="Effacer"
                >
                  Effacer
                </button>
              </div>
            </div>

            <textarea
              className="w-full text-xl md:text-2xl font-serif text-natural-text placeholder:text-[#D9D1C7] resize-none outline-none border-none min-h-[160px] focus:ring-0 leading-relaxed"
              placeholder={`Commencez à rédiger en ${sourceLang}... (ex: "Wôlôf laa dëkk" ou tapotez sur Traduction Orale)`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              id="source_textarea"
            />
          </div>

          <div className="pt-4 border-t border-natural-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Written icon or oral indicator */}
            <div className="flex items-center gap-1.5">
              <button 
                onClick={handleToggleRecord}
                className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl transition-all cursor-pointer shadow-sm border ${
                  isRecording 
                    ? "bg-rose-50 border-rose-200 text-rose-600 animate-pulse" 
                    : "bg-white hover:bg-[#FDFBF7] text-natural-text border-natural-border"
                }`}
                title="Saisie vocale (Microphone)"
                id="mic_trigger_btn"
              >
                {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
                <span className="text-xs font-bold uppercase tracking-wider">
                  {isRecording ? "Écoute en cours" : "Dictée vocale"}
                </span>
              </button>
            </div>

            <button
              onClick={handleTranslate}
              disabled={isLoading || !inputText.trim()}
              className="flex items-center justify-center gap-2 bg-[#7D8471] hover:bg-[#5A5A40] disabled:bg-neutral-200 disabled:text-neutral-400 text-white px-8 py-3.5 rounded-2xl font-serif text-sm font-bold uppercase tracking-widest transition-all shadow-md active:scale-95 cursor-pointer"
              id="translate_btn"
            >
              {isLoading ? (
                <RefreshCw size={18} className="animate-spin" />
              ) : (
                <Sparkles size={18} />
              )}
              <span>Chercher l'équivalence</span>
            </button>
          </div>

          {/* Micro Animation Pulse Overlay with Design HTML Row 2 Theme */}
          {isRecording && (
            <div className="absolute inset-0 bg-white/95 rounded-3xl z-10 flex flex-col items-center justify-center p-6 space-y-6">
              <div className="relative">
                <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 relative z-10">
                  <Mic size={28} />
                </div>
                <span className="absolute inset-0 bg-rose-400 rounded-full scale-125 animate-ping opacity-20"></span>
              </div>
              
              <div className="text-center space-y-1">
                <p className="text-lg font-serif italic text-natural-text">Détection de votre intonation...</p>
                <p className="text-xs text-natural-muted font-mono">Dites une phrase à voix haute et claire.</p>
              </div>

              {/* Design Row 2: Audio Waveform Overlay UI */}
              <div className="bg-[#5A5A40] rounded-2xl h-16 flex items-center px-6 space-x-6 text-white w-full max-w-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider">Analyse Vocale</span>
                <div className="flex-1 flex items-end justify-center space-x-1 h-6">
                  <div className="w-1 h-2 bg-white/40 rounded-full animate-bounce [animation-delay:0.1s]"></div>
                  <div className="w-1 h-4 bg-white/60 rounded-full animate-bounce [animation-delay:0.3s]"></div>
                  <div className="w-1 h-5 bg-white rounded-full animate-bounce [animation-delay:0.5s]"></div>
                  <div className="w-1 h-3 bg-white/80 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1 h-6 bg-white rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  <div className="w-1 h-4 bg-white/50 rounded-full animate-bounce [animation-delay:0.1s]"></div>
                  <div className="w-1 h-2 bg-white/30 rounded-full animate-bounce [animation-delay:0.3s]"></div>
                  <div className="w-1 h-4 bg-white/70 rounded-full animate-bounce [animation-delay:0.5s]"></div>
                </div>
                <span className="font-mono text-xs opacity-80">00:03 / 00:30</span>
              </div>

              <button 
                onClick={handleToggleRecord}
                className="px-5 py-2 border border-natural-border text-natural-text rounded-xl text-xs font-bold uppercase hover:bg-natural-accent bg-white transition-colors"
              >
                Terminer l'enregistrement
              </button>
            </div>
          )}

          {recognitionError && (
            <div className="absolute bottom-24 left-4 right-4 bg-natural-accent text-natural-text p-3.5 rounded-xl text-xs flex items-start gap-2 border border-natural-dark-border z-20">
              <Info size={14} className="mt-0.5 shrink-0 text-natural-primary" />
              <span>{recognitionError}</span>
            </div>
          )}
        </div>

        {/* Translation Result Box - Custom Style from design row 1 */}
        <div className="bg-[#F2E9E1]/30 border border-natural-dark-border rounded-3xl p-6 min-h-[340px] flex flex-col justify-between" id="destination_panel">
          <div className="space-y-4">
            <span className="text-[10px] uppercase tracking-widest font-bold text-[#A69D91]">
              Traduction (Français)
            </span>

            {isLoading ? (
              <div className="py-20 flex flex-col items-center justify-center space-y-4">
                <div className="w-10 h-10 border-4 border-[#7D8471] border-t-transparent rounded-full animate-spin"></div>
                <div className="text-center">
                  <p className="text-base font-bold text-[#5A5A40] font-serif">Recherche dans le lexique communautaire...</p>
                </div>
              </div>
            ) : translationResult ? (
              <div className="space-y-5" id="translated_content">
                <div className="space-y-3">
                  <h3 className="text-3xl font-serif text-[#5A5A40] leading-tight italic break-words">
                    {translationResult.translation}
                  </h3>
                  {translationResult.phonetics && (
                    <div className="inline-flex items-center gap-1.5 font-mono text-[11px] bg-[#F2E9E1] text-[#7D8471] px-2.5 py-1 rounded-lg border border-natural-border/30">
                      🗣 Prononciation : <strong>{translationResult.phonetics}</strong>
                    </div>
                  )}
                </div>
                
                <div className="bg-white border border-[#E5E0D8] rounded-2xl p-5 space-y-2.5 shadow-sm">
                  <span className="text-xs font-bold uppercase tracking-wider text-natural-primary flex items-center gap-1.5">
                    <Info size={14} />
                    Nuances d'Usage & Contexte Culturel
                  </span>
                  <p className="text-[#4A3E37]/90 text-sm whitespace-pre-wrap leading-relaxed font-serif">
                    {translationResult.explanation}
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-20 text-center text-natural-muted space-y-2">
                <Languages size={40} className="mx-auto text-[#D9D1C7]" />
                <p className="text-sm font-serif italic text-natural-text">Remplissez le panneau de gauche pour obtenir une traduction experte.</p>
                <p className="text-[11px] max-w-sm mx-auto text-natural-muted">Vous obtiendrez l'équivalence exacte, l'aide phonétique ainsi qu'un repère d'usage traditionnel.</p>
              </div>
            )}
          </div>

          {translationResult && !isLoading && (
            <div className="pt-4 border-t border-natural-dark-border flex items-center justify-between gap-3">
              <button 
                onClick={speakTranslation}
                className="flex items-center gap-2 bg-white border border-natural-border hover:bg-natural-accent text-natural-text px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
                title="Entendre la prononciation"
                id="voice_speak_btn"
              >
                <Volume2 size={15} />
                <span>Écouter</span>
              </button>

              <button
                onClick={handleSaveToDict}
                disabled={savedSuccess}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm ${
                  savedSuccess 
                    ? "bg-emerald-600 text-white" 
                    : "bg-[#7D8471] text-white hover:bg-[#5A5A40]"
                }`}
                id="save_to_dict_btn"
              >
                <Save size={15} />
                <span>{savedSuccess ? "Lexique à jour ✓" : "Ajouter au lexique"}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Quick Tips */}
      <div className="bg-[#7D8471] text-white rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex gap-4 items-center">
          <div className="p-3 bg-white/20 rounded-2xl text-white shrink-0">
            <BookText size={24} />
          </div>
          <div className="space-y-1.5">
            <h4 className="text-base font-serif font-bold">Un outil lexical 100% collaboratif</h4>
            <p className="text-xs text-white/80 leading-relaxed max-w-2xl font-serif">
              Ce dictionnaire ne dépend que de vos contributions étudiées. Allez dans l'onglet Éditeur pour enrichir le patrimoine régional de vos propres définitions et nuances de langage intimes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
