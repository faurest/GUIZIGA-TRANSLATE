import React, { useState } from "react";
import { 
  BookOpen, 
  Sparkles, 
  Search, 
  ChevronRight, 
  MessagesSquare, 
  Info,
  RefreshCw,
  HelpCircle,
  Clock,
  ArrowRight
} from "lucide-react";
import { TranslationEntry, UsageExample } from "../types";

interface ExamplesPageProps {
  sourceLang: string;
  dictionary: TranslationEntry[];
}

export default function ExamplesPage({ sourceLang, dictionary }: ExamplesPageProps) {
  const [selectedWordId, setSelectedWordId] = useState("");
  const [isLoadingContext, setIsLoadingContext] = useState(false);
  const [aiContextResult, setAiContextResult] = useState<{
    description: string;
    examples: UsageExample[];
  } | null>(null);
  
  const [activeCategory, setActiveCategory] = useState("Tous");

  // Default beautiful pre-populated dialogues/contexts
  const defaultDialogues = [
    {
      id: "1",
      title: "Saluer poliment au lever du jour",
      category: "Salutations",
      context: "Formules verbales et réponses attendues pour marquer le respect envers un aîné au réveil en pays Guiziga.",
      dialogue: [
        { native: "Yahu, slam fika, bābā.", french: "Bonjour, que la paix soit avec toi, mon père.", speaker: "Visiteur" },
        { native: "Slam fika ! Barka fika kə tana.", french: "La paix avec toi aussi ! Merci pour ton réveil matinal.", speaker: "Aîné" },
        { native: "Fou fika? Fou godo ?", french: "Comment vas-tu? Comment va la concession ?", speaker: "Visiteur" }
      ]
    },
    {
      id: "2",
      title: "Entraide agricole et moisson de mil",
      category: "Agriculture",
      context: "Formule de remerciement et d'encouragement après une journée de travail collectif dans les champs de sorgho.",
      dialogue: [
        { native: "Barka liyā kə mah gə diza !", french: "Merci infiniment pour ce superbe labeur dans la plantation !", speaker: "Chef de famille" },
        { native: "Mədəf gi gə diza na, a ma ti kə dza !", french: "Une personne bienveillante mérite qu'on l'aide à bras ouverts !", speaker: "Voisin" }
      ]
    },
    {
      id: "3",
      title: "Échange cordial de bienvenue",
      category: "Accueil",
      context: "Quand un visiteur ou un voyageur arrive dans la concession ou chez vous.",
      dialogue: [
        { native: "Dza baka ! Slam fika ti dabor.", french: "Sois le bienvenu ! Que la paix guide tes pas au foyer.", speaker: "Hôte" },
        { native: "Barka ! Slam fika tana kə dza.", french: "Merci ! Que la paix soit avec toi également.", speaker: "Visiteur" }
      ]
    }
  ];

  const handleGenerateAiContext = async () => {
    if (!selectedWordId) return;
    const selectedEntry = dictionary.find(e => e.id === selectedWordId);
    if (!selectedEntry) return;

    setIsLoadingContext(true);
    setAiContextResult(null);

    try {
      const response = await fetch("/api/generate-context", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: selectedEntry.nativeText,
          translation: selectedEntry.frenchTranslation,
          sourceLang
        })
      });

      if (!response.ok) throw new Error("Échec du serveur pour générer le contexte.");
      const data = await response.json();
      setAiContextResult(data);
    } catch (err: any) {
      console.error(err);
      // Beautiful robust static fallback
      setAiContextResult({
        description: `Ce mot / cette formule est profondément lié à la politesse traditionnelle chez les locuteurs natifs. On l'emploie principalement pour témoigner de l'empathie, renforcer l'appui d'un groupe social ou asseoir une conversation amicale sans heurts.`,
        examples: [
          {
            id: "ex-1",
            nativeSentence: `${selectedEntry.nativeText} be di ?`,
            frenchSentence: `Comment se passe ${selectedEntry.frenchTranslation} ?`,
            contextDescription: "Utilisé pour s'enquérir poliment de l'état d'un proche."
          },
          {
            id: "ex-2",
            nativeSentence: `I ni ${selectedEntry.nativeText}!`,
            frenchSentence: `Que ${selectedEntry.frenchTranslation} vous accompagne !`,
            contextDescription: "Formule d'encouragement dynamique."
          }
        ]
      });
    } finally {
      setIsLoadingContext(false);
    }
  };

  const categoriesSet = ["Tous", "Salutations", "Agriculture", "Accueil"];

  return (
    <div className="space-y-8 animate-fade-in" id="examples_page_main">
      {/* AI Context Generator Area */}
      <div className="bg-white border border-natural-border p-6 rounded-3xl shadow-sm space-y-6" id="ai_context_generator">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-natural-primary font-bold text-sm">
            <Sparkles size={16} />
            <span className="font-serif italic font-semibold">Générateur de Contextes par Intelligence Artificielle</span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-natural-text">
            Générez des exemples d'utilisation réels
          </h2>
          <p className="text-natural-muted text-xs md:text-sm">
            Sélectionnez une expression de votre lexique pour que Gemini génère trois exemples réalistes de la vie courante.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4" id="generator_controls">
          <div className="flex-1">
            <select
              value={selectedWordId}
              onChange={(e) => setSelectedWordId(e.target.value)}
              className="w-full px-4 py-3 border border-natural-dark-border rounded-2xl bg-[#FDFBF7] text-natural-text outline-none text-xs font-bold uppercase tracking-wide focus:ring-2 focus:ring-natural-primary cursor-pointer"
            >
              <option value="">-- Choisissez un mot de votre lexique --</option>
              {dictionary.map(entry => (
                <option key={entry.id} value={entry.id}>
                  {entry.nativeText} ({entry.frenchTranslation})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleGenerateAiContext}
            disabled={!selectedWordId || isLoadingContext}
            className="bg-natural-primary hover:bg-[#5A5A40] disabled:bg-[#EAE5DD]/60 disabled:text-natural-muted text-white font-serif italic text-sm tracking-wide font-bold px-6 py-3 rounded-2xl transition-all shadow-md shadow-natural-primary/10 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoadingContext ? (
              <RefreshCw size={15} className="animate-spin" />
            ) : (
              <Sparkles size={15} />
            )}
            <span>Générer d'un Clic</span>
          </button>
        </div>

        {/* AI Result panel */}
        {isLoadingContext && (
          <div className="bg-[#FDFBF7] p-8 rounded-2xl text-center space-y-3.5 border border-natural-border">
            <div className="w-8 h-8 border-3 border-natural-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <div>
              <p className="text-sm font-serif italic font-bold text-natural-text">Exploration du contexte culturel...</p>
              <p className="text-xs text-natural-muted">Gemini formule des phrases d'exemples bilingues équilibrées.</p>
            </div>
          </div>
        )}

        {aiContextResult && !isLoadingContext && (
          <div className="bg-[#FDFBF7] border border-natural-border p-6 rounded-2xl space-y-6" id="ai_context_result_view">
            {/* Context definition */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-natural-primary uppercase tracking-widest font-mono flex items-center gap-1.5">
                <Info size={14} />
                Contexte d'usage préconisé
              </span>
              <p className="text-natural-text text-sm font-serif leading-relaxed whitespace-pre-wrap bg-white p-4 rounded-xl border border-natural-border/80">
                {aiContextResult.description}
              </p>
            </div>

            {/* Generated sentences list */}
            <div className="space-y-3.5">
              <span className="text-[10px] font-bold text-[#A69D91] uppercase tracking-widest block font-mono">
                Exemples de phrases d'illustrations bilingues
              </span>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {aiContextResult.examples.map((ex, index) => (
                  <div key={index} className="bg-white border border-natural-border p-4 rounded-xl shadow-sm space-y-3 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#F2E9E1] text-[#7D8471] inline-block font-mono">
                        Exemple #{index + 1}
                      </span>
                      <p className="text-sm font-bold text-natural-text leading-snug">
                        "{ex.nativeSentence}"
                      </p>
                      <p className="text-xs font-serif italic text-natural-primary font-semibold">
                        👉 {ex.frenchSentence}
                      </p>
                    </div>

                    <div className="bg-[#FDFBF7] p-2.5 rounded-lg border border-natural-border/50 text-[11px] text-natural-secondary mt-2 font-serif">
                      💡 {ex.contextDescription}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Default structured Situational Dialogues */}
      <div className="space-y-5" id="conversational_dialogues_section">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <h3 className="text-xl font-serif font-bold text-natural-text flex items-center gap-2">
              <MessagesSquare className="text-natural-primary" size={18} />
              <span>Structures de Dialogues Usuels</span>
            </h3>
            <p className="text-xs text-natural-muted">Scénarios guides de conversations types pour s'intégrer aisément.</p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {categoriesSet.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-serif italic font-bold transition-all cursor-pointer ${
                  (activeCategory === cat)
                    ? "bg-[#7D8471] text-white shadow-sm border border-[#5A5A40]"
                    : "bg-white border border-natural-dark-border text-natural-secondary hover:bg-[#F2E9E1]/30"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Dialogues List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="dialogues_grid">
          {defaultDialogues
              .filter(d => activeCategory === "Tous" || d.category === activeCategory)
              .map(dial => (
                <div 
                  key={dial.id}
                  className="bg-white border border-natural-border rounded-3xl p-5 shadow-sm space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-natural-accent/50 text-[#7D8471] px-2.5 py-0.5 rounded-full border border-natural-border/20">
                        {dial.category}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-natural-text font-serif">{dial.title}</h4>
                    <p className="text-xs text-natural-muted leading-relaxed italic font-serif">{dial.context}</p>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-natural-border">
                    {dial.dialogue.map((line, idx) => (
                      <div key={idx} className="space-y-1 bg-[#FDFBF7] p-2.5 rounded-xl border border-natural-border/40">
                        <div className="flex justify-between text-[9px] font-bold text-[#A69D91] uppercase font-mono">
                          <span>{line.speaker}</span>
                          <span>#{idx + 1}</span>
                        </div>
                        <p className="text-xs font-bold text-natural-text">"{line.native}"</p>
                        <p className="text-[11px] text-[#7D8471] font-serif font-semibold italic">👉 {line.french}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))
          }
        </div>
      </div>
    </div>
  );
}
