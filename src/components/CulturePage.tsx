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
  Info,
  BookOpen,
  BookText
} from "lucide-react";

export default function CulturePage() {
  const [activeSubTab, setActiveSubTab] = useState<"history" | "geography" | "traditions" | "renaissance" | "linguistics">("history");
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
            Exploration Historique & Culturelle
          </span>
          <h2 className="text-3xl md:text-4xl font-serif italic tracking-wide font-bold">
            Le Peuple Guiziga & l'Extrême-Nord Cameroun
          </h2>
          <p className="text-white/90 text-sm md:text-base leading-relaxed font-serif max-w-2xl">
            Plongez dans l'histoire, la trajectoire migratoire et la résilience du peuple Guiziga (Gisiga). Des terres du Soudan antique jusqu'aux plaines du Diamaré.
          </p>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 blur-xl pointer-events-none translate-x-12 translate-y-12">
          <Users size={320} className="text-white" />
        </div>
      </div>

      {/* Navigation for culture details */}
      <div className="flex flex-wrap border-b border-natural-border pb-px gap-2" id="culture_tabs">
        <button
          onClick={() => setActiveSubTab("history")}
          className={`flex items-center gap-2 px-6 py-3 border-b-2 font-serif text-sm font-semibold transition-all cursor-pointer ${
            activeSubTab === "history"
              ? "border-[#7D8471] text-[#7D8471] font-bold bg-[#FDFBF7]"
              : "border-transparent text-natural-muted hover:text-natural-text"
          }`}
        >
          <BookOpen size={16} />
          <span>Origines & Histoire</span>
        </button>
        <button
          onClick={() => setActiveSubTab("geography")}
          className={`flex items-center gap-2 px-6 py-3 border-b-2 font-serif text-sm font-semibold transition-all cursor-pointer ${
            activeSubTab === "geography"
              ? "border-[#7D8471] text-[#7D8471] font-bold bg-[#FDFBF7]"
              : "border-transparent text-natural-muted hover:text-natural-text"
          }`}
        >
          <MapPin size={16} />
          <span>Géographie & Démographie</span>
        </button>
        <button
          onClick={() => setActiveSubTab("traditions")}
          className={`flex items-center gap-2 px-6 py-3 border-b-2 font-serif text-sm font-semibold transition-all cursor-pointer ${
            activeSubTab === "traditions"
              ? "border-[#7D8471] text-[#7D8471] font-bold bg-[#FDFBF7]"
              : "border-transparent text-natural-muted hover:text-natural-text"
          }`}
        >
          <Leaf size={16} />
          <span>Rites & Identité</span>
        </button>
        <button
          onClick={() => setActiveSubTab("renaissance")}
          className={`flex items-center gap-2 px-6 py-3 border-b-2 font-serif text-sm font-semibold transition-all cursor-pointer ${
            activeSubTab === "renaissance"
              ? "border-[#7D8471] text-[#7D8471] font-bold bg-[#FDFBF7]"
              : "border-transparent text-natural-muted hover:text-natural-text"
          }`}
        >
          <Flame size={16} />
          <span>Renaissance Culturelle</span>
        </button>
        <button
          onClick={() => setActiveSubTab("linguistics")}
          className={`flex items-center gap-2 px-6 py-3 border-b-2 font-serif text-sm font-semibold transition-all cursor-pointer ${
            activeSubTab === "linguistics"
              ? "border-[#7D8471] text-[#7D8471] font-bold bg-[#FDFBF7]"
              : "border-transparent text-natural-muted hover:text-natural-text"
          }`}
        >
          <BookText size={16} />
          <span>Langue & Textes</span>
        </button>
      </div>

      {/* Main cultural display panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="culture_content_workspace">
        <div className="lg:col-span-8 space-y-6">
          {activeSubTab === "history" && (
            <div className="bg-white border border-natural-border p-6 md:p-8 rounded-3xl shadow-sm space-y-6 animate-fade-in">
              <div className="space-y-2 border-b border-natural-border pb-4">
                <h3 className="text-2xl font-serif font-bold text-natural-text">Origines et Berceau Ancestral</h3>
                <div className="flex items-center gap-2 text-xs font-mono text-[#7D8471] font-bold uppercase">
                  <Compass size={13} />
                  <span>Soudan antique • Vallée du Mayo-Kebí</span>
                </div>
              </div>

              <div className="prose text-natural-text/90 text-sm md:text-base leading-relaxed space-y-5 font-serif">
                <p>
                  Le peuple <strong>Guiziga</strong> (aussi appelé Guisiga ou Guissiga) constitue l'une des plus grandes communautés autochtones de la région de l'Extrême-Nord du Cameroun. Historiquement, ce peuple s'est constitué dès le <strong>13ᵉ siècle</strong> dans les encablures de Marva.
                </p>
                <p>
                  Leur origine remonte au <strong>Soudan antique</strong> (considéré comme la Nubie). Partis de ce berceau originel, ils ont suivi un itinéraire migratoire complexe qui les a conduits dans la plaine du Diamaré. Durant leur progression, certains ont séjourné dans des contrées comme le Baguirmi et Goudour, tandis que d'autres ont traversé la vallée du Mayo-Kebí (Léré) et Bindir avant de s'installer dans leurs sites actuels.
                </p>
                
                <div className="p-5 border-l-4 border-[#7D8471] bg-[#FDFBF7] rounded-r-2xl my-6">
                  <h4 className="font-bold text-natural-text mb-2 text-sm uppercase tracking-widest font-mono">D'où vient le nom "Guiziga" ?</h4>
                  <p className="text-sm italic">
                    Le nom "Guiziga" est un sobriquet attribué à un talentueux chasseur en quête de gibier. Son habileté, sa générosité et sa notoriété ont fait qu'il devint notable et prit ses quartiers à <strong>Kakata</strong> (l'actuel Kakataré). L'administrateur Jacques Fourneau a conclu : <strong className="text-[#5A5A40]">"Guiziga signifie : celui qui ne mange pas n'importe quelle nourriture"</strong>.
                  </p>
                </div>

                <h4 className="text-xl font-bold font-serif pt-4">Relations & Conflits Historiques</h4>
                <p>
                  Constitué en communauté vivant de la chasse, la pêche et l'élevage, le peuple Guiziga a d'abord accueilli des émigrants comme les <strong>Mofu</strong> (installés dans les montagnes-îles) et les <strong>pasteurs Peuls</strong> (en transhumance au 18ᵉ siècle). L'intégration de cette communauté est marquée par une dynamique de résistance face à l'expansion des lamidats peuls au 19ᵉ siècle, conduisant parfois au jihad et reléguant les Guiziga au second plan de leur terre matricielle.
                </p>
              </div>
            </div>
          )}

          {activeSubTab === "geography" && (
            <div className="bg-white border border-natural-border p-6 md:p-8 rounded-3xl shadow-sm space-y-6 animate-fade-in">
              <div className="space-y-2 border-b border-natural-border pb-4">
                <h3 className="text-2xl font-serif font-bold text-natural-text">Géographie, Groupements & Démographie</h3>
                <div className="flex items-center gap-2 text-xs font-mono text-[#7D8471] font-bold uppercase">
                  <MapPin size={13} />
                  <span>Diamaré • Mayo-Kani • Moutourwa</span>
                </div>
              </div>

              <div className="prose text-natural-text/90 text-sm md:text-base leading-relaxed space-y-4 font-serif">
                <p>
                  Les Guiziga sont rangés parmi les <em>païens de plaine</em> et qualifiés de <strong>semi-montagnards</strong>. Leur territoire traditionnel s'étend des savanes boisées de Moutourwa au sud, jusqu'aux vastes plaines du Diamaré et de Maroua.
                </p>

                <h4 className="text-lg font-bold font-serif text-[#5A5A40] mt-4">Les 4 Groupements Principaux</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 mb-4">
                  <div className="p-4 bg-[#F2E9E1]/30 border border-natural-border rounded-xl space-y-1">
                    <span className="text-xs uppercase font-extrabold text-[#7D8471]">Les Guiziga Bi-marva</span>
                    <p className="text-xs leading-relaxed text-natural-text">Ils occupaient jadis Marva (Maroua) dans l'administration traditionnelle, et se répartissent aujourd'hui dans la ville et ses environs.</p>
                  </div>
                  <div className="p-4 bg-[#F2E9E1]/30 border border-natural-border rounded-xl space-y-1">
                    <span className="text-xs uppercase font-extrabold text-[#7D8471]">Le groupe de Moutourwa</span>
                    <p className="text-xs leading-relaxed text-natural-text">Ce groupe est beaucoup plus homogène et numériquement le plus important (au sud-ouest de Maroua).</p>
                  </div>
                  <div className="p-4 bg-[#F2E9E1]/30 border border-natural-border rounded-xl space-y-1">
                    <span className="text-xs uppercase font-extrabold text-[#7D8471]">Le groupe de Midjivin</span>
                    <p className="text-xs leading-relaxed text-natural-text">Très proches géographiquement et linguistiquement du groupe de Moutourwa, ils y sont souvent sociologiquement associés.</p>
                  </div>
                  <div className="p-4 bg-[#F2E9E1]/30 border border-natural-border rounded-xl space-y-1">
                    <span className="text-xs uppercase font-extrabold text-[#7D8471]">Le groupement Loulou</span>
                    <p className="text-xs leading-relaxed text-natural-text">Ce quatrième pôle forme avec Marva, Moutourwa et Midjivin l'ossature culturelle Guiziga d'aujourd'hui.</p>
                  </div>
                </div>

                <h4 className="text-lg font-bold font-serif text-[#5A5A40] pt-4">Démographie et Migration</h4>
                <p>
                  Forte de <strong>400 000 âmes</strong> (estimée à seulement 80 000 dans les années 1970), la communauté Guiziga se loge majoritairement dans les départements du Diamaré et Mayo-Kani (Région Extrême-Nord). On note toutefois un puissant flux migratoire en direction des régions du Nord, de l'Adamaoua, du Centre, et du Littoral.
                </p>
                <div className="bg-[#FDFBF7] p-3 text-xs italic border border-natural-border rounded-lg">
                  Entre 1976 et 1984, on recensait déjà 7 627 migrants guiziga dans la seule vallée de la Bénoué, faisant d'eux la première communauté ethnique en termes de présence migratoire dans cette zone.
                </div>
              </div>
            </div>
          )}

          {activeSubTab === "traditions" && (
            <div className="bg-white border border-natural-border p-6 md:p-8 rounded-3xl shadow-sm space-y-6 animate-fade-in">
              <div className="space-y-2 border-b border-natural-border pb-4">
                <h3 className="text-2xl font-serif font-bold text-natural-text">Identité Kirdi, Croyances et Rites</h3>
                <div className="flex items-center gap-2 text-xs font-mono text-[#7D8471] font-bold uppercase">
                  <Leaf size={13} />
                  <span>Langues Tchadiques • Cérémonie Nggua</span>
                </div>
              </div>

              <div className="prose text-natural-text/90 text-sm md:text-base leading-relaxed space-y-4 font-serif">
                <p>
                  Le peuple Guiziga appartient à l'ensemble culturel des peuples <strong>"Kirdi"</strong> (populations non musulmanes luttant pour l'indépendance de leurs institutions religieuses ancestrales face aux chefferies centralisées islamiques). 
                  Leur intégration au sein de ce grand ensemble s'est forgée par l'assimilation de plusieurs clans autonomes (Bi Mviza, Giziga Gadam, Giziga Lara).
                </p>

                <h4 className="text-lg font-bold font-serif pt-2 text-[#5A5A40]">Langues & Linguistique</h4>
                <p>
                  Ils parlent des idiomes rattachés au grand groupe des <strong>langues tchadiques</strong> : le Guiziga du Nord (également dit dogba, gisiga, marva) et le Guiziga du Sud (qui concentre le plus grand nombre de locuteurs).
                </p>

                <h4 className="text-lg font-bold font-serif pt-4 border-t border-natural-border text-[#5A5A40]">Traditions Fondamentales</h4>
                <ul className="space-y-3 list-none pl-0">
                  <li className="flex gap-3">
                    <span className="text-[#7D8471] mt-0.5"><Sparkles size={16}/></span>
                    <div>
                      <strong className="block text-natural-text">Initiation et Circoncision</strong>
                      <span className="text-sm">Généralement effectuée entre 9 et 12 ans, la circoncision est accompagnée de stricts rites d'initiation et marque le passage symbolique et spirituel à l'âge adulte.</span>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[#7D8471] mt-0.5"><Award size={16}/></span>
                    <div>
                      <strong className="block text-natural-text">La Cérémonie Nggua</strong>
                      <span className="text-sm">Se tenant tous les mois de septembre, ce rituel majeur de rassemblement vise à offrir remerciements et louanges aux ancêtres à la fin des moissons du sorgho.</span>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[#7D8471] mt-0.5"><Flame size={16}/></span>
                    <div>
                      <strong className="block text-natural-text">Le Culte de la Pluie</strong>
                      <span className="text-sm">Parce qu'ils sont agriculteurs de l'espace sahélien, les anciens perpétuent des rituels sacrés décisifs pour réguler et appeler la pluie fertilisante.</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeSubTab === "renaissance" && (
            <div className="bg-white border border-natural-border p-6 md:p-8 rounded-3xl shadow-sm space-y-6 animate-fade-in">
              <div className="space-y-2 border-b border-natural-border pb-4">
                <h3 className="text-2xl font-serif font-bold text-natural-text">Renaissance Contemporaine Actuelle</h3>
                <div className="flex items-center gap-2 text-xs font-mono text-[#7D8471] font-bold uppercase">
                  <Users size={13} />
                  <span>Cohésion Sociale • Festival Culturel</span>
                </div>
              </div>

              <div className="prose text-natural-text/90 text-sm md:text-base leading-relaxed space-y-4 font-serif">
                <p>
                  Dans l'ère moderne, le peuple guiziga observe une reviviscence puissante de ses symboles fondateurs afin de ne pas se dissoudre dans les vastes bassins urbains.
                </p>

                <div className="p-5 mt-4 bg-[#7D8471] text-white rounded-2xl shadow-sm flex flex-col sm:flex-row gap-5 items-center">
                  <div className="p-4 bg-white/20 rounded-full shrink-0">
                    <Music size={32} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1 font-serif">Le Festival des Arts et de la Culture Guiziga</h4>
                    <p className="text-sm opacity-90">
                      Tenu traditionnellement <strong>du 13 au 16 avril à Maroua</strong>, c'est l'événement phare de la communauté. Il vise le renforcement de la cohésion sociale, promeut le vivre-ensemble et mobilise les élites dans une dynamique d'association fraternelle.
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-6 border-t border-natural-border flex gap-4 items-start">
                  <BookOpen size={24} className="text-[#5A5A40] shrink-0 mt-1" />
                  <div>
                    <strong className="block text-[#5A5A40]">Renaissance culturelle Guiziga (Livre)</strong>
                    <p className="text-sm text-natural-secondary mt-1">
                      L'ouvrage <em>"Renaissance culturelle Guiziga : État des lieux, enjeux et perspectives"</em> (l'Harmattan) offre aujourd'hui une référence anthropologique cruciale, permettant à la nouvelle génération numérique de comprendre l'histoire de la communauté et de se reconnecter à son héritage.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSubTab === "linguistics" && (
            <div className="bg-white border border-natural-border p-6 md:p-8 rounded-3xl shadow-sm space-y-6 animate-fade-in">
              <div className="space-y-2 border-b border-natural-border pb-4">
                <h3 className="text-2xl font-serif font-bold text-natural-text">État des Traductions et Langue Guiziga</h3>
                <div className="flex items-center gap-2 text-xs font-mono text-[#7D8471] font-bold uppercase">
                  <BookText size={13} />
                  <span>Grammaire • Alphabet • Traductions</span>
                </div>
              </div>

              <div className="prose text-natural-text/90 text-sm md:text-base leading-relaxed space-y-5 font-serif">
                <p>
                  Bien que riche sur le plan dialectal, la langue Guiziga dispose de peu de ressources digitalisées. Voici l'état de la documentation répertoriée.
                </p>

                <h4 className="text-lg font-bold font-serif text-[#5A5A40]">Alphabet et Écriture</h4>
                <p>
                  L'alphabet guiziga a été normalisé notamment par l'A.C.GUI. Il comprend des caractères spéciaux uniques pour marquer ses phonèmes tchadiques bien particuliers : <strong>ɓ, ɗ, ŋ, sl, zl, gb, kp, mb, ng, nj, vb</strong>. (Exemple : <em>Bumbulvuŋ</em> = Dieu, <em>slimiɗ</em> = nom).
                </p>

                <h4 className="text-lg font-bold font-serif text-[#5A5A40] mt-4">La Bible : Ressource de Traduction Principale</h4>
                <div className="p-5 border-l-4 border-[#7D8471] bg-[#FDFBF7] rounded-r-2xl">
                  <p className="italic text-sm">
                    <strong>Fait majeur (2025) :</strong> Lors du 10ᵉ Festival des arts et culture Guiziga, a eu lieu la culmination d'érudition linguistique avec la <strong>dédicace de la Bible complète en langue guiziga</strong>. C'est la source la plus importante de textes traduits disponibles en texte, audio et vidéo (Scripture Earth, YouVersion, LBT).
                  </p>
                </div>

                <h4 className="text-lg font-bold font-serif text-[#5A5A40] pt-4">Ressources Académiques</h4>
                <ul className="space-y-2 list-disc pl-5">
                  <li><strong>Studien zur Sprache der Gisiga</strong> (Johannes Lukas) et <strong>A Grammar of Giziga</strong> (Erin Shay) en constituent l'ossature académique.</li>
                  <li>Des études sociolinguistiques sur la pluralisation nominale (P.V. Dairou, 2025) et le contact avec le français.</li>
                </ul>

                <h4 className="text-lg font-bold font-serif text-rose-700/80 pt-4 border-t border-natural-border mt-4">Limites Actuelles</h4>
                <p className="text-sm">
                  <strong>Il n'existe PAS à ce jour :</strong> de textes de traduction littéraire non-biblique disponibles, ni de dictionnaires guiziga-français en libre accès, et aucune intelligence artificielle ne supporte la langue (pas de Google Traduction possible). Pour la pérennité, la communauté s'organise notamment autour de <strong>Dubun Guiziga</strong> (application d'apprentissage) et des archives de l'Association Culturelle Guiziga (A.C.GUI).
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
                <span>Expressions Courantes</span>
              </h4>
              <p className="text-xs text-natural-muted">Tapotez un terme pour écouter la diction orale.</p>
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
                        audioFeedback === item.native ? "bg-[#7D8471] border-[#7D8471] text-white animate-pulse" : ""
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
                Ce patrimoine est la fondation de votre identité. N'oubliez pas d'enrichir votre lexique personnel interactif !
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
