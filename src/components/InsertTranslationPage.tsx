import React, { useState, useRef } from "react";
import { 
  Plus, 
  Trash, 
  Keyboard, 
  Mic, 
  Sparkles, 
  AudioLines, 
  FolderHeart, 
  BookText, 
  FileAudio,
  Volume2,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertCircle,
  Edit3,
  Play,
  Check,
  X
} from "lucide-react";
import { TranslationEntry } from "../types";

interface InsertPageProps {
  sourceLang: string;
  dictionary: TranslationEntry[];
  onAddEntry: (entry: TranslationEntry) => void;
  onDeleteEntry: (id: string) => void;
  onUpdateEntry?: (entry: TranslationEntry) => void;
}

export default function InsertTranslationPage({
  sourceLang,
  dictionary,
  onAddEntry,
  onDeleteEntry,
  onUpdateEntry
}: InsertPageProps) {
  // Form states
  const [nativeText, setNativeText] = useState("");
  const [frenchTranslation, setFrenchTranslation] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"written" | "oral">("written");
  const [category, setCategory] = useState("Salutations");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState(false);

  // Editing state
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);

  // Audio simulation and validation states
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [simulatedAudioRegistered, setSimulatedAudioRegistered] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isAudioListeningOccurred, setIsAudioListeningOccurred] = useState(false);
  const [isAudioValidated, setIsAudioValidated] = useState(false);
  
  const recordingTimerRef = useRef<any>(null);

  // Search local lexicon entries
  const [searchTerm, setSearchTerm] = useState("");

  const categories = [
    "Salutations",
    "Vie quotidienne",
    "Nourriture",
    "Famille",
    "Sagesse & Proverbes",
    "Traditions",
    "Agriculture",
    "Commerce",
    "Autre"
  ];

  const handleStartSimulateRecording = () => {
    setIsRecordingAudio(true);
    setRecordingDuration(0);
    setIsAudioValidated(false);
    setIsAudioListeningOccurred(false);
    recordingTimerRef.current = setInterval(() => {
      setRecordingDuration(prev => prev + 1);
    }, 1000);
  };

  const handleStopSimulateRecording = () => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
    }
    setIsRecordingAudio(false);
    setSimulatedAudioRegistered(true);
    setType("oral");
  };

  // Playback recorded sample for validation
  const handleListenRecordedSample = () => {
    setIsAudioListeningOccurred(true);
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      // Speak the entered native word to let them hear their "voice sample"
      const utterance = new SpeechSynthesisUtterance(nativeText || "Échantillon");
      utterance.lang = "fr-FR";
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Confirm and validate recorded audio before saving
  const handleValidateRecordedSample = () => {
    if (!isAudioListeningOccurred) {
      setFormError("Veuillez d'abord écouter votre enregistrement audio avant de pouvoir le valider.");
      return;
    }
    setIsAudioValidated(true);
    setFormError("");
  };

  const speakPresetNative = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "fr-FR";
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  };

  // Pull linguistic summary from AI based on word pair
  const handleAiDescriptionFill = async () => {
    if (!nativeText.trim() || !frenchTranslation.trim()) {
      setFormError("Veuillez d'abord remplir le mot d'origine et sa traduction pour que l'IA puisse générer la description.");
      return;
    }
    setIsAiLoading(true);
    setFormError("");

    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: nativeText,
          sourceLang,
          type: "written"
        })
      });

      if (!response.ok) throw new Error("Impossible d'interroger Gemini.");
      const data = await response.json();
      setDescription(data.explanation || "Une expression linguistique typique de la région.");
    } catch (err: any) {
      console.error(err);
      setDescription(`Sagesse populaire guiziga liée à l'expression "${nativeText}". S'utilise couramment pour traduire la notion de "${frenchTranslation}" dans les communications intergénérationnelles au Nord Cameroun.`);
      setFormError("Explication standard générée (Gemini hors-ligne ou clé absente). ");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleEditClick = (item: TranslationEntry) => {
    setEditingEntryId(item.id);
    setNativeText(item.nativeText);
    setFrenchTranslation(item.frenchTranslation);
    setDescription(item.description);
    setCategory(item.category);
    setType(item.type);
    setFormError("");
    setFormSuccess(false);

    if (item.audioUrl) {
      setSimulatedAudioRegistered(true);
      setIsAudioValidated(true); // Existent entry begins validated
      setIsAudioListeningOccurred(true);
    } else {
      setSimulatedAudioRegistered(false);
      setIsAudioValidated(false);
      setIsAudioListeningOccurred(false);
    }

    // Scroll smoothly to form card
    const formCard = document.getElementById("insertion_form_card");
    if (formCard) {
      formCard.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleCancelEdit = () => {
    setEditingEntryId(null);
    setNativeText("");
    setFrenchTranslation("");
    setDescription("");
    setType("written");
    setSimulatedAudioRegistered(false);
    setIsAudioValidated(false);
    setIsAudioListeningOccurred(false);
    setFormError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nativeText.trim() || !frenchTranslation.trim() || !description.trim()) {
      setFormError("Veuillez remplir tous les champs obligatoires (Expression, Traduction, Description).");
      return;
    }

    // Audio Validation constraint
    if (type === "oral" && simulatedAudioRegistered && !isAudioValidated) {
      setFormError("Pour enregistrer l'audio comme translation, il faudrait d'abord l'écouter et le valider ensuite.");
      return;
    }

    setFormError("");

    if (editingEntryId) {
      // Find original entry
      const original = dictionary.find(x => x.id === editingEntryId);
      const updated: TranslationEntry = {
        id: editingEntryId,
        nativeText: nativeText.trim(),
        frenchTranslation: frenchTranslation.trim(),
        description: description.trim(),
        type,
        category,
        createdAt: original ? original.createdAt : new Date().toISOString(),
        audioUrl: simulatedAudioRegistered ? (original?.audioUrl || `simulated-voice-note-${crypto.randomUUID()}`) : undefined
      };
      
      if (onUpdateEntry) {
        onUpdateEntry(updated);
      }
      setFormSuccess(true);
      setEditingEntryId(null);
    } else {
      const newEntry: TranslationEntry = {
        id: crypto.randomUUID(),
        nativeText: nativeText.trim(),
        frenchTranslation: frenchTranslation.trim(),
        description: description.trim(),
        type,
        category,
        createdAt: new Date().toISOString(),
        audioUrl: simulatedAudioRegistered ? `simulated-voice-note-${crypto.randomUUID()}` : undefined
      };

      onAddEntry(newEntry);
      setFormSuccess(true);
    }

    // Reset Form fields
    setNativeText("");
    setFrenchTranslation("");
    setDescription("");
    setType("written");
    setSimulatedAudioRegistered(false);
    setIsAudioValidated(false);
    setIsAudioListeningOccurred(false);
    setRecordingDuration(0);

    setTimeout(() => {
      setFormSuccess(false);
    }, 4000);
  };

  // Filter dictionary based on search
  const filteredDict = dictionary.filter(entry => 
    entry.nativeText.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.frenchTranslation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in" id="insert_page_container">
      {/* Intro section */}
      <div className="bg-[#7D8471] text-white rounded-3xl p-8 relative overflow-hidden shadow-sm">
        <div className="relative z-10 max-w-2xl space-y-3.5">
          <span className="px-3.5 py-1.5 bg-white/10 text-white rounded-full text-xs font-mono border border-white/25">
            Lexique Régional Durable • Extrême-Nord Cameroun
          </span>
          <h2 className="text-3xl font-serif italic tracking-wide">
            Enrichissez le Glossaire Guiziga & Nord-Cameroun
          </h2>
          <p className="text-white/85 text-xs md:text-sm leading-relaxed font-serif">
            Conservez ici les proverbes, mots sacrés ou expressions quotidiennes. Saisissez une explication d'usage ou générez-la avec l'IA. Pour l'audio, écoutez et validez votre note vocale avant d'enregistrer.
          </p>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 blur-xl pointer-events-none translate-x-12 translate-y-12">
          <FolderHeart size={300} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Insertion / Modification Form Card */}
        <div className="lg:col-span-5 bg-white border border-natural-border p-6 rounded-3xl shadow-sm space-y-6" id="insertion_form_card">
          <div className="flex items-center justify-between pb-4 border-b border-natural-border">
            <div className="flex items-center gap-2">
              <BookText className="text-natural-primary" size={20} />
              <span className="font-serif font-bold text-natural-text text-base">
                {editingEntryId ? "Modifier la définition" : "Nouvelle définition"}
              </span>
            </div>
            {editingEntryId && (
              <button 
                onClick={handleCancelEdit}
                className="text-xs text-rose-500 hover:text-rose-700 font-bold uppercase flex items-center gap-1 cursor-pointer"
              >
                <X size={12} />
                <span>Annuler</span>
              </button>
            )}
          </div>

          {editingEntryId && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-xl text-xs flex items-center gap-2">
              <Sparkles size={14} className="text-amber-600 animate-spin-slow" />
              <span>Vous modifiez actuellement une entrée existante.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" id="lexicon_form">
            {/* Input Expression */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-[#A69D91] block">
                Expression originale en {sourceLang} <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={nativeText}
                onChange={(e) => setNativeText(e.target.value)}
                placeholder="Ex: Yahu, Slam fika, Barka liyā..."
                className="w-full px-4 py-3 border border-natural-dark-border rounded-xl focus:ring-2 focus:ring-natural-primary outline-none transition-all text-natural-text placeholder:text-[#D9D1C7]/70 font-serif font-medium text-sm bg-white"
                required
              />
            </div>

            {/* Input French Translation */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-[#A69D91] block">
                Traduction en Français <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={frenchTranslation}
                onChange={(e) => setFrenchTranslation(e.target.value)}
                placeholder="Ex: Bonjour, Merci beaucoup..."
                className="w-full px-4 py-3 border border-natural-dark-border rounded-xl focus:ring-2 focus:ring-natural-primary outline-none transition-all text-natural-text placeholder:text-[#D9D1C7]/70 font-serif font-medium text-sm bg-white"
                required
              />
            </div>

            {/* Input Description with AI fill helper */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] uppercase tracking-widest font-bold text-[#A69D91] block">
                  Description & Usages <span className="text-rose-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleAiDescriptionFill}
                  disabled={isAiLoading || !nativeText.trim() || !frenchTranslation.trim()}
                  className="text-[11px] font-bold text-natural-primary hover:text-[#5A5A40] disabled:text-[#A69D91] flex items-center gap-1.5 bg-[#F2E9E1] px-3 py-1.5 rounded-lg transition-colors border border-natural-dark-border cursor-pointer"
                  title="Demander à Gemini d'expliquer ce mot bilingue"
                >
                  {isAiLoading ? (
                    <RefreshCw size={11} className="animate-spin" />
                  ) : (
                    <Sparkles size={11} />
                  )}
                  <span>Rédiger avec l'IA</span>
                </button>
              </div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Expliquez ici le sens de ce terme : quand l'utilise-t-on ? S'agit-il d'une formule polie, intime, traditionnelle ?"
                className="w-full px-4 py-3 border border-natural-dark-border rounded-xl focus:ring-2 focus:ring-natural-primary outline-none transition-all text-natural-text placeholder:text-[#D9D1C7]/70 text-sm min-h-[110px] resize-none leading-relaxed bg-white font-serif"
                required
              />
            </div>

            {/* Meta tags: Category + Type */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-bold text-[#A69D91] block">
                  Catégorie
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2.5 border border-natural-dark-border rounded-xl focus:ring-2 focus:ring-natural-primary bg-white text-xs uppercase font-bold tracking-wider text-natural-text outline-none cursor-pointer"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-bold text-[#A69D91] block">
                  Support
                </label>
                <div className="flex bg-[#EAE5DD]/60 border border-natural-border p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setType("written")}
                    className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      type === "written" 
                        ? "bg-natural-primary text-white shadow-sm" 
                        : "text-natural-text hover:text-natural-primary"
                    }`}
                  >
                    <Keyboard size={12} className="inline mr-1" />Écrit
                  </button>
                  <button
                    type="button"
                    onClick={() => setType("oral")}
                    className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      type === "oral" 
                        ? "bg-natural-primary text-white shadow-sm" 
                        : "text-natural-text hover:text-natural-primary"
                    }`}
                  >
                    <Mic size={12} className="inline mr-1" />Oral
                  </button>
                </div>
              </div>
            </div>

            {/* Simulated Oral Recording option with custom listen and validate steps */}
            <div className="bg-[#F2E9E1]/30 p-4 border border-natural-dark-border rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-natural-text flex items-center gap-1.5">
                  <FileAudio size={14} className="text-natural-primary" />
                  Prononciation Vocale de Référence
                </span>
                {simulatedAudioRegistered && (
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded border ${
                    isAudioValidated 
                      ? "text-emerald-700 bg-emerald-50 border-emerald-100" 
                      : "text-amber-700 bg-amber-50 border-amber-100"
                  }`}>
                    {isAudioValidated ? "Validé ✓" : "À écouter/valider"}
                  </span>
                )}
              </div>

              {isRecordingAudio ? (
                <div className="flex items-center justify-between bg-white border border-rose-105 p-3 rounded-xl">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping"></span>
                    <span className="text-xs font-mono text-rose-500 font-bold">
                      Enregistrement... 00:{recordingDuration.toString().padStart(2, "0")}s
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleStopSimulateRecording}
                    className="bg-rose-600 hover:bg-rose-700 text-white rounded-lg px-3 py-1 text-xs font-semibold uppercase cursor-pointer"
                  >
                    Terminer
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[11px] text-[#A69D91] leading-relaxed">
                      Associez une prononciation audio amicale de référence.
                    </p>
                    <button
                      type="button"
                      onClick={handleStartSimulateRecording}
                      className="flex items-center gap-1 bg-white border border-natural-dark-border hover:bg-[#F2E9E1] text-natural-text px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer shadow-sm transition-colors shrink-0"
                    >
                      <Mic size={12} className="text-natural-primary" />
                      <span>{simulatedAudioRegistered ? "Ré-enregistrer" : "Capturer"}</span>
                    </button>
                  </div>

                  {/* Play and Validation sub-section BEFORE saving */}
                  {simulatedAudioRegistered && (
                    <div className="bg-[#EAE5DD]/45 p-3 rounded-xl border border-natural-border space-y-2.5">
                      <p className="text-[10px] font-serif inline-block text-natural-secondary font-bold">
                        Étape de validation requise :
                      </p>
                      
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        {/* Play button to listen */}
                        <button
                          type="button"
                          onClick={handleListenRecordedSample}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-white hover:bg-natural-accent border border-natural-dark-border rounded-lg text-xs font-bold font-serif italic text-natural-primary cursor-pointer transition-colors"
                        >
                          <Play size={12} />
                          <span>1. Écouter l'audio</span>
                        </button>

                        {/* Validate button */}
                        <button
                          type="button"
                          onClick={handleValidateRecordedSample}
                          disabled={!isAudioListeningOccurred}
                          className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wide cursor-pointer border transition-colors ${
                            isAudioValidated
                              ? "bg-emerald-600 border-emerald-705 text-white"
                              : isAudioListeningOccurred
                                ? "bg-[#7D8471] hover:bg-[#5A5A40] text-white border-transparent"
                                : "bg-neutral-100 text-neutral-400 border-neutral-200 cursor-not-allowed"
                          }`}
                        >
                          <Check size={12} />
                          <span>2. Valider l'échantillon</span>
                        </button>
                      </div>

                      {isAudioListeningOccurred && !isAudioValidated && (
                        <div className="text-[10px] text-amber-700 font-bold flex items-center gap-1">
                          <AlertCircle size={10} />
                          <span>Veuillez valider le son en cliquant sur le bouton 2.</span>
                        </div>
                      )}
                      
                      {isAudioValidated && (
                        <div className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle2 size={10} />
                          <span>Échantillon validé avec succès !</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Form messaging */}
            {formError && (
              <div className="bg-[#F2E9E1]/60 border border-natural-dark-border text-natural-text p-3.5 rounded-2xl text-xs flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0 text-rose-600" />
                <span className="font-medium">{formError}</span>
              </div>
            )}

            {formSuccess && (
              <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-3.5 rounded-2xl text-xs flex items-center gap-2">
                <CheckCircle2 size={16} className="shrink-0 text-emerald-500" />
                <span>Modifications enregistrées de manière durable dans le dictionnaire de l'Extrême-Nord !</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#7D8471] hover:bg-[#5A5A40] text-white py-3.5 rounded-2xl font-serif italic text-sm tracking-wide font-bold transition-all shadow-md shadow-natural-primary/10 flex items-center justify-center gap-2 cursor-pointer"
              id="lexicon_submit_btn"
            >
              <Plus size={16} />
              <span>{editingEntryId ? "Enregistrer les modifications" : "Enregistrer dans mon lexique"}</span>
            </button>
          </form>
        </div>

        {/* Dictionary Display List Panel with Edit button */}
        <div className="lg:col-span-7 bg-white border border-natural-border p-6 rounded-3xl shadow-sm flex flex-col space-y-6" id="dictionary_display_card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-natural-border">
            <div className="space-y-0.5">
              <h3 className="font-serif font-bold text-natural-text text-xl flex items-center gap-2">
                <span>Glossaire local</span>
                <span className="text-xs bg-natural-accent text-natural-secondary font-serif italic border border-natural-dark-border px-2.5 py-0.5 rounded-full">
                  {dictionary.length} entrées
                </span>
              </h3>
              <p className="text-xs text-[#A69D91]">Recherchez, gérez et éditez vos termes du dictionnaire.</p>
            </div>
            
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher un terme..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-60 pl-9 pr-4 py-2 text-xs border border-[#A69D91] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7D8471] bg-white text-natural-text placeholder:text-[#A69D91]/60 font-serif"
              />
              <Search size={14} className="absolute left-3 top-2.5 text-[#A69D91]" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto max-h-[580px] space-y-4 pr-1" id="glossary_list">
            {filteredDict.length === 0 ? (
              <div className="py-24 text-center text-natural-muted space-y-2">
                <FolderHeart size={44} className="mx-auto text-natural-dark-border" />
                <p className="text-sm font-serif italic text-natural-text">Aucune entrée trouvée</p>
                <p className="text-xs max-w-sm mx-auto text-natural-muted">Saisissez un mot à gauche pour commencer votre encyclopédie locale !</p>
              </div>
            ) : (
              filteredDict.map((item) => (
                <div 
                  key={item.id}
                  className={`bg-white border hover:bg-[#F2E9E1]/10 rounded-2xl p-5 transition-all space-y-3 relative group ${
                    editingEntryId === item.id ? "border-amber-450 bg-amber-50/20" : "border-natural-border"
                  }`}
                  id={`glossary_item_${item.id}`}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-lg font-serif font-extrabold text-[#5A5A40]">{item.nativeText}</h4>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-natural-accent/50 text-[#7D8471] border border-natural-border/30">
                          {item.category}
                        </span>
                        <span className="text-[10px] uppercase font-bold tracking-wide px-2 py-0.5 rounded-full bg-natural-primary/10 text-natural-primary">
                          {item.type === "oral" ? "Oral" : "Écrit"}
                        </span>
                        {editingEntryId === item.id && (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 rounded">
                            Édition active
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-serif italic text-[#7D8471] font-semibold flex items-center gap-1">
                        👉 {item.frenchTranslation}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      {/* Play Sound Button */}
                      {item.audioUrl && (
                        <div 
                          className="p-1.5 bg-white border border-natural-dark-border text-natural-primary rounded-lg hover:bg-natural-accent cursor-pointer"
                          title="Jouer l'enregistrement audio"
                          onClick={() => speakPresetNative(item.nativeText)}
                        >
                          <Volume2 size={13} />
                        </div>
                      )}

                      {/* Edit Button */}
                      <button
                        onClick={() => handleEditClick(item)}
                        className="p-1.5 bg-white border border-natural-dark-border text-natural-primary rounded-lg hover:bg-natural-accent transition-all cursor-pointer"
                        title="Modifier / Améliorer la définition"
                      >
                        <Edit3 size={13} />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => onDeleteEntry(item.id)}
                        className="p-1.5 bg-white border border-natural-dark-border text-rose-500 rounded-lg hover:bg-rose-50 hover:border-rose-100 transition-all cursor-pointer"
                        title="Supprimer du lexique"
                      >
                        <Trash size={13} />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-natural-text bg-[#FDFBF7] p-3 rounded-xl border border-natural-border/60 leading-relaxed whitespace-pre-wrap font-serif">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-[#A69D91] font-mono">
                    <span>Créé / Modifié le {new Date(item.createdAt).toLocaleDateString()}</span>
                    {item.audioUrl && (
                      <span className="flex items-center gap-1 text-natural-primary">
                        <AudioLines size={10} /> Note Vocale Incluse
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
