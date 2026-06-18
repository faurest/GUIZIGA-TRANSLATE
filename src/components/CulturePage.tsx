import React, { useState } from "react";
import { 
  Users, 
  MapPin, 
  Sparkles, 
  Flame, 
  Leaf, 
  Award, 
  Compass, 
  Volume2, 
  Music,
  Info
} from "lucide-react";

export default function CulturePage() {
  const [activeSubTab, setActiveSubTab] = useState<"people" | "traditions" | "art">("people");
  const [audioFeedback, setAudioFeedback] = useState<string | null>(null);

  const culturalExpressions = [
    { native: "Yahu !", translation: "Bonjour !", usage: "Salutation universelle matinale et journalière pour saluer avec respect." },
    { native: "Slam fika !", translation: "La paix soit avec toi !", usage: "Formule d'accueil solennelle marquant la bienveillance mutuelle." },
    { native: "Barka", translation: "Merci / Félicitations", usage: "Utilisé pour exprimer la gratitude ou bénir l'action de quelqu'un." },
    { native: "Barka liyā", translation: "Merci infiniment", usage: "Une expression d'une grande politesse après un service ou une aide précieuse." },
    { native: "Dza baka !", translation: "Sois le bienvenu !", usage: "Formule prononcée lorsqu'un visiteur franchit le seuil de la concession." },
    { native: "Fou fika?", translation: "Comment vas-tu ?", usage: "Façon affectueuse et quotidienne de demander des nouvelles à ses proches." }
  ];

  const handlePlayCulturalAudio = (text: string) => {
    setAudioFeedback(text);
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "fr-FR"; // Fallback beautiful speech synthesizer
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
    setTimeout(() => {
      setAudioFeedback(null);
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-fade-in" id="culture_page_container">
      {/* Hero Banner Section */}
      <div className="bg-gradient-to-br from-[#7D8471] to-[#5A5A40] text-white rounded-3xl p-8 md:p-10 relative overflow-hidden shadow-sm" id="culture_hero">
        <div className="relative z-10 max-w-3xl space-y-4">
          <span className="px-3.5 py-1.5 bg-white/10 text-white rounded-full text-xs font-mono uppercase tracking-widest border border-white/25 inline-flex items-center gap-1.5">
            <Compass size={12} className="text-white animate-spin-slow" />
            Exploration Culturelle & Paysage
          </span>
          <h2 className="text-3xl md:text-4xl font-serif italic tracking-wide">
            Le Peuple Guiziga & l'Extrême-Nord Cameroun
          </h2>
          <p className="text-white/90 text-sm md:text-base leading-relaxed font-serif max-w-2xl">
            Découvrez l'histoire, la sagesse ancestrale et les vibrations sonores du peuple Guiziga (Gisiga), habitant fier des plaines du Diamaré et des contreforts de l'Extrême-Nord du Cameroun.
          </p>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 blur-xl pointer-events-none translate-x-12 translate-y-12">
          <Users size={320} className="text-white" />
        </div>
      </div>

      {/* Navigation for culture details */}
      <div className="flex flex-wrap border-b border-natural-border pb-px gap-2" id="culture_tabs">
        <button
          onClick={() => setActiveSubTab("people")}
          className={`flex items-center gap-2 px-6 py-3 border-b-2 font-serif text-sm font-semibold transition-all cursor-pointer ${
            activeSubTab === "people"
              ? "border-[#7D8471] text-[#7D8471] font-bold"
              : "border-transparent text-natural-muted hover:text-natural-text"
          }`}
        >
          <Users size={16} />
          <span>Le Peuple & l'Histoire</span>
        </button>
        <button
          onClick={() => setActiveSubTab("traditions")}
          className={`flex items-center gap-2 px-6 py-3 border-b-2 font-serif text-sm font-semibold transition-all cursor-pointer ${
            activeSubTab === "traditions"
              ? "border-[#7D8471] text-[#7D8471] font-bold"
              : "border-transparent text-natural-muted hover:text-natural-text"
          }`}
        >
          <Leaf size={16} />
          <span>Traditions & Écosystème</span>
        </button>
        <button
          onClick={() => setActiveSubTab("art")}
          className={`flex items-center gap-2 px-6 py-3 border-b-2 font-serif text-sm font-semibold transition-all cursor-pointer ${
            activeSubTab === "art"
              ? "border-[#7D8471] text-[#7D8471] font-bold"
              : "border-transparent text-natural-muted hover:text-natural-text"
          }`}
        >
          <Music size={16} />
          <span>Art, Rites & Musique</span>
        </button>
      </div>

      {/* Main cultural display panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="culture_content_workspace">
        <div className="lg:col-span-8 space-y-6">
          {activeSubTab === "people" && (
            <div className="bg-white border border-natural-border p-6 md:p-8 rounded-3xl shadow-sm space-y-6 animate-fade-in">
              <div className="space-y-2">
                <h3 className="text-2xl font-serif font-bold text-natural-text">Origines et Identité du Peuple Guiziga</h3>
                <div className="flex items-center gap-2 text-xs font-mono text-[#7D8471] font-bold uppercase">
                  <MapPin size={13} />
                  <span>Plaine du Diamaré • Extrême-Nord Cameroun</span>
                </div>
              </div>

              <div className="prose text-natural-text/90 text-sm md:text-base leading-relaxed space-y-4 font-serif">
                <p>
                  Les <strong>Guiziga</strong> (également orthographiés Gisiga ou Giziga) constituent l'un des groupes ethniques majeurs de la province de l'Extrême-Nord du Cameroun, principalement localisés dans les départements du Diamaré, du Mayo-Kani et de la Bénoué.
                </p>
                <p>
                  Organisés traditionnellement autour de chefferies hautement respectées, appelées <em>"bây"</em> (le chef politique et spirituel), les Guiziga ont développé une culture de résilience et de dignité, vivant en étroite symbiose avec les plaines sahéliennes et les massifs montagneux environnementaux. Leur foyer historique rayonne autour de villes et villages emblématiques comme Moutourwa, Mindif, et Maroua.
                </p>
                <p>
                  La langue guiziga fait partie de la branche tchadique de la famille des langues afro-asiatiques. Elle se structure en plusieurs variantes locales intelligibles, marquant une identité riche et vivante malgré la présence historique de langues véhiculaires environnantes comme le Fulfulde ou le Français.
                </p>
              </div>

              {/* Cultural Quote Cards */}
              <div className="p-5 rounded-2xl bg-[#F2E9E1]/40 border border-[#D9D1C7]/55 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-natural-primary font-bold shrink-0">
                  <Award size={18} />
                </div>
                <div>
                  <p className="font-serif italic text-sm text-natural-secondary">"Mədəf gi gə diza na, a ma ti dza baka ka tana dabor."</p>
                  <p className="text-xs text-natural-muted font-bold mt-1">Celui dont le cœur est bon invite les étrangers sans hésitation. (Sagesse populaire)</p>
                </div>
              </div>
            </div>
          )}

          {activeSubTab === "traditions" && (
            <div className="bg-white border border-natural-border p-6 md:p-8 rounded-3xl shadow-sm space-y-6 animate-fade-in">
              <div className="space-y-2">
                <h3 className="text-2xl font-serif font-bold text-natural-text">L'Écosystème Agricole et Sacré</h3>
                <div className="flex items-center gap-2 text-xs font-mono text-[#7D8471] font-bold uppercase">
                  <Leaf size={13} />
                  <span>Souveraineté alimentaire • Rite du Mil</span>
                </div>
              </div>

              <div className="prose text-natural-text/90 text-sm md:text-base leading-relaxed space-y-4 font-serif">
                <p>
                  La vie quotidienne et spirituelle du peuple Guiziga est rythmée par les saisons agricoles. Le <strong>mil</strong> (sorgho) n'est pas seulement l'élément central du régime alimentaire, c'est une culture sacrée témoignant d'une communion permanente avec la terre.
                </p>
                <p>
                  Chaque année, la fête des récoltes (souvent appelée la fête du premier mil) rassemble toutes les générations. À cette occasion, la première récolte est offerte aux esprits protecteurs avant d'être consommée par la communauté. On y brasse également le <strong>"Bil-Bil"</strong>, la bière de mil traditionnelle préparée de façon artisanale par les femmes. Le Bil-Bil favorise les réconciliations, scelle les pactes sociaux et abreuve les discussions collectives sous l'arbre à palabres.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 bg-[#F2E9E1]/20 border border-natural-border rounded-xl space-y-1">
                    <span className="text-xs uppercase font-extrabold text-natural-primary">Sorgho Rouge & Blanc</span>
                    <p className="text-xs leading-relaxed text-natural-text">Base nutritive et monnaie d'échange sociale historique pour les dots et les festivités.</p>
                  </div>
                  <div className="p-4 bg-[#F2E9E1]/20 border border-natural-border rounded-xl space-y-1">
                    <span className="text-xs uppercase font-extrabold text-natural-primary">Le Bil-Bil</span>
                    <p className="text-xs leading-relaxed text-natural-text">Cette boisson fermentée rassemble les aînés et favorise la transmission orale des épopées familiales.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSubTab === "art" && (
            <div className="bg-white border border-natural-border p-6 md:p-8 rounded-3xl shadow-sm space-y-6 animate-fade-in">
              <div className="space-y-2">
                <h3 className="text-2xl font-serif font-bold text-natural-text">L'Art de la Calebasse, Danse et Rites Sonores</h3>
                <div className="flex items-center gap-2 text-xs font-mono text-[#7D8471] font-bold uppercase">
                  <Flame size={13} />
                  <span>Artisanat • Esthétique de la Calebasse Gravée</span>
                </div>
              </div>

              <div className="prose text-natural-text/90 text-sm md:text-base leading-relaxed space-y-4 font-serif">
                <p>
                  Les Guiziga excellent dans l'art de décorer les <strong>calebasses</strong>. Ces récipients naturels issus de cucurbitacées sont séchés, évidés, puis finement pyrogravés de motifs géométriques complexes. Chaque symbole gravé raconte une histoire : une alliance, la cartographie d'une rivière, ou un proverbe bilingue sur la patience et l'honneur.
                </p>
                <p>
                  La musique est indissociable des cérémonies spirituelles guiziga. La flûte traditionnelle et les tambours sacrés dirigent la danse énergique et acrobatique <strong>"Bi-Gisiga"</strong>, au cours de laquelle les mouvements imitent l'harmonie du vol des oiseaux migrateurs annonçant la saison des pluies. Cet art total continue de renforcer le lien de solidarité intergénérationnelle.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Mini-Guiziga Lexicon Playground */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-natural-border p-6 rounded-3xl shadow-sm space-y-5">
            <div className="space-y-1">
              <h4 className="font-serif font-bold text-natural-text text-lg flex items-center gap-1.5">
                <Sparkles size={16} className="text-[#7D8471]" />
                <span>Sagesses Orales</span>
              </h4>
              <p className="text-xs text-natural-muted">Tapotez un terme pour écouter et comprendre sa portée culturelle.</p>
            </div>

            <div className="space-y-3.5" id="cultural_lexicon_list">
              {culturalExpressions.map((item, index) => (
                <div 
                  key={index} 
                  className="bg-[#FDFBF7] hover:bg-[#F2E9E1]/30 border border-natural-border/50 p-3 rounded-xl transition-all space-y-1"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-neutral-800 text-sm">{item.native}</span>
                    <button 
                      onClick={() => handlePlayCulturalAudio(item.native)}
                      className={`p-1.5 rounded-lg bg-white border border-natural-dark-border text-natural-primary transition-all cursor-pointer hover:bg-natural-accent ${
                        audioFeedback === item.native ? "bg-emerald-500 border-emerald-500 text-white animate-pulse" : ""
                      }`}
                    >
                      <Volume2 size={12} />
                    </button>
                  </div>
                  <p className="text-xs font-serif italic text-natural-primary font-semibold">👉 {item.translation}</p>
                  <p className="text-[10px] text-natural-muted leading-relaxed font-serif pt-1 border-t border-natural-border/20">{item.usage}</p>
                </div>
              ))}
            </div>

            <div className="p-3.5 bg-[#7D8471]/10 rounded-2xl border border-[#7D8471]/20 text-center">
              <p className="text-[11px] text-natural-text font-serif italic font-semibold leading-relaxed">
                "Ce patrimoine est vivant ! Utilisez la section 'Contribuer' pour ajouter des termes guiziga entendus chez nos grands-parents."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
