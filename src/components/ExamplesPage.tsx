import React, { useState } from "react";
import { 
  BookOpen, 
  Search, 
  MessagesSquare, 
  Info,
  BookText
} from "lucide-react";
import { TranslationEntry } from "../types";

interface ExamplesPageProps {
  sourceLang: string;
  dictionary: TranslationEntry[];
}

export default function ExamplesPage({ sourceLang, dictionary }: ExamplesPageProps) {
  const [selectedWordId, setSelectedWordId] = useState("");
  
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

  const categoriesSet = ["Tous", "Salutations", "Agriculture", "Accueil"];
  
  const selectedEntry = dictionary.find(e => e.id === selectedWordId);

  return (
    <div className="space-y-8 animate-fade-in" id="examples_page_main">
      {/* Local Dictionary Explorer Box */}
      <div className="bg-white border border-natural-border p-6 rounded-3xl shadow-sm space-y-6" id="context_explorer">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-natural-primary font-bold text-sm">
            <BookText size={16} />
            <span className="font-serif italic font-semibold">Explorateur du Lexique</span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-natural-text">
            Explorez vos expressions enregistrées
          </h2>
          <p className="text-natural-muted text-xs md:text-sm">
            Sélectionnez une expression que vous avez ajoutée dans l'outil 'Contribuer & Éditer' pour revoir ses usages et sa signification personnalisée.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4" id="explorer_controls">
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
        </div>

        {/* Selected Word Details Panel */}
        {selectedEntry && (
          <div className="bg-[#FDFBF7] border border-natural-border p-6 rounded-2xl space-y-6" id="word_details_view">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-2xl font-serif font-extrabold text-[#5A5A40]">{selectedEntry.nativeText}</h3>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-natural-accent/50 text-[#7D8471] border border-natural-border/30">
                  {selectedEntry.category}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wide px-2 py-0.5 rounded-full bg-natural-primary/10 text-natural-primary">
                  {selectedEntry.type === "oral" ? "Oral" : "Écrit"}
                </span>
              </div>
              <p className="text-lg font-serif italic text-natural-primary font-semibold">
                👉 {selectedEntry.frenchTranslation}
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-natural-primary uppercase tracking-widest font-mono flex items-center gap-1.5">
                <Info size={14} />
                Description Personnalisée
              </span>
              <p className="text-natural-text text-sm font-serif leading-relaxed whitespace-pre-wrap bg-white p-4 rounded-xl border border-natural-border/80">
                {selectedEntry.description}
              </p>
            </div>
            <p className="text-[11px] text-natural-muted font-mono pt-4 border-t border-natural-border/50">
              Ajouté le : {new Date(selectedEntry.createdAt).toLocaleDateString()}
            </p>
          </div>
        )}
        
        {!selectedEntry && dictionary.length === 0 && (
          <div className="bg-[#FDFBF7] p-8 rounded-2xl text-center space-y-3.5 border border-natural-border">
             <BookOpen size={30} className="mx-auto text-natural-muted" />
             <p className="text-sm font-serif italic font-bold text-natural-text">Votre lexique est vide</p>
             <p className="text-xs text-natural-muted">Commencez à inscrire vos mots d'abord pour les voir apparaître ici.</p>
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
