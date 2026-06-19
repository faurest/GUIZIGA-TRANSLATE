import React, { useState } from "react";
import { Keyboard, Languages, SpellCheck, Copy, ArrowRight, Library, Wand2 } from "lucide-react";

export default function TranscriptionPage() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [activeTab, setActiveTab] = useState<"tool" | "guide">("tool");

  // Transcriber logic
  const handleTranscribe = (text: string) => {
    let transcribed = text;
    // Map of specific Guiziga characters that might be typed phonetically or need special input
    // To support typing in a standard keyboard:
    // User can type b' to get ɓ, d' to get ɗ, n' to get ŋ, sl to sl, zl to zl
    const replacements: Record<string, string> = {
      "b'": "ɓ",
      "B'": "Ɓ",
      "d'": "ɗ",
      "D'": "Ɗ",
      "n'": "ŋ",
      "N'": "Ŋ",
      // the others can just be combinations of characters (sl, zl, gb, kp) which are already handled by regular keyboard
    };

    Object.entries(replacements).forEach(([key, value]) => {
      transcribed = transcribed.replace(new RegExp(key, "g"), value);
    });

    setOutputText(transcribed);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setInputText(newText);
    handleTranscribe(newText);
  };

  const insertCharacter = (char: string) => {
    const newText = inputText + char;
    setInputText(newText);
    handleTranscribe(newText);
  };

  const specialChars = ["ɓ", "ɗ", "ŋ", "sl", "zl", "ɛ", "ɔ", "gb", "kp"];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Header section */}
      <div className="bg-natural-primary text-white p-8 rounded-3xl shadow-sm relative overflow-hidden flex flex-col items-center text-center">
        <div className="relative z-10 max-w-2xl space-y-4">
          <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-mono uppercase tracking-widest inline-flex items-center gap-1.5 border border-white/30 font-bold backdrop-blur-sm">
            <Keyboard size={14} />
            Système Opérationnel AGLC
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold italic tracking-wide text-[#FDFBF7]">
            Transcription Guiziga
          </h2>
          <p className="text-white/90 text-sm md:text-base font-serif px-4">
            Utilisez les normes de l'Alphabet Général des Langues Camerounaises et de l'A.C.GUI pour transcrire le patrimoine oral Guiziga avec précision.
          </p>
        </div>
      </div>

      <div className="flex w-full overflow-x-auto no-scrollbar border-b border-natural-border pb-px gap-2">
        <button
          onClick={() => setActiveTab("tool")}
          className={`flex shrink-0 items-center gap-2 px-6 py-3 border-b-2 font-serif text-sm font-semibold transition-all cursor-pointer ${
            activeTab === "tool"
              ? "border-[#7D8471] text-[#7D8471] font-bold bg-[#FDFBF7]"
              : "border-transparent text-natural-muted hover:text-natural-text"
          }`}
        >
          <Keyboard size={16} />
          <span>Outil de Transcription</span>
        </button>
        <button
          onClick={() => setActiveTab("guide")}
          className={`flex shrink-0 items-center gap-2 px-6 py-3 border-b-2 font-serif text-sm font-semibold transition-all cursor-pointer ${
            activeTab === "guide"
              ? "border-[#7D8471] text-[#7D8471] font-bold bg-[#FDFBF7]"
              : "border-transparent text-natural-muted hover:text-natural-text"
          }`}
        >
          <Library size={16} />
          <span>Guide et Tableaux AGLC</span>
        </button>
      </div>

      {activeTab === "tool" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
          <div className="bg-white border border-natural-border rounded-3xl p-6 md:p-8 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif font-bold text-lg flex items-center gap-2">
                <SpellCheck size={18} className="text-[#7D8471]" />
                Texte Oral / Clavier Standard
              </h3>
            </div>
            <p className="text-xs text-natural-muted mb-4 font-sans max-w-sm">
              Tapez votre texte. Utilisez <strong>b'</strong> pour ɓ, <strong>d'</strong> pour ɗ, et <strong>n'</strong> pour ŋ.
            </p>
            <textarea
              className="w-full flex-1 min-h-[250px] p-4 bg-[#FDFBF7] border border-natural-border rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-[#7D8471]/30 font-serif text-natural-text placeholder:text-natural-muted transition-all"
              placeholder="Ex: Mamba kula'a viŋ..."
              value={inputText}
              onChange={handleInputChange}
            ></textarea>

            <div className="mt-4 p-4 bg-[#F2E9E1]/30 border border-natural-border rounded-2xl">
              <p className="text-xs font-bold text-[#7D8471] uppercase mb-2">Clavier Virtuel Spécial</p>
              <div className="flex flex-wrap gap-2">
                {specialChars.map(char => (
                  <button
                    key={char}
                    onClick={() => insertCharacter(char)}
                    className="w-10 h-10 flex items-center justify-center font-bold text-lg bg-white border border-natural-border rounded-lg shadow-sm hover:border-[#7D8471] hover:text-[#7D8471] transition-colors cursor-pointer"
                  >
                    {char}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white border border-natural-border rounded-3xl p-6 md:p-8 shadow-sm flex flex-col bg-[#FDFBF7]/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif font-bold text-lg flex items-center gap-2">
                <Wand2 size={18} className="text-[#7D8471]" />
                Transcription Normalisée (AGLC)
              </h3>
              <button 
                onClick={() => navigator.clipboard.writeText(outputText)}
                className="p-2 text-natural-muted hover:text-[#7D8471] transition-colors bg-white border border-natural-border rounded-lg cursor-pointer"
                title="Copier"
              >
                <Copy size={16} />
              </button>
            </div>
            <div className="w-full flex-1 min-h-[250px] p-5 bg-white border border-[#7D8471]/30 rounded-2xl font-serif text-natural-text text-lg shadow-inner overflow-auto">
              {outputText || <span className="text-natural-muted italic text-sm">La transcription apparaîtra ici...</span>}
            </div>
          </div>
        </div>
      )}

      {activeTab === "guide" && (
        <div className="bg-white border border-natural-border p-6 md:p-8 rounded-3xl shadow-sm space-y-8 animate-fade-in font-serif">
          
          <div className="space-y-4">
             <h3 className="text-2xl font-bold flex items-center gap-2 text-[#5A5A40] border-b border-natural-border pb-3">
               Tableau de Transcription Guiziga
             </h3>
             <p className="text-sm">Fondé sur l'Alphabet Général des Langues Camerounaises (AGLC) et les normes A.C.GUI.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="font-bold text-lg flex items-center gap-2">
                 Voyelles & Consonnes Simples
              </h4>
              <div className="bg-[#FDFBF7] rounded-xl border border-natural-border overflow-hidden p-1 text-sm">
                <table className="w-full text-left">
                  <thead className="bg-[#7D8471] text-white">
                    <tr>
                      <th className="p-2 font-bold !font-sans uppercase text-xs">Lettre</th>
                      <th className="p-2 font-bold !font-sans uppercase text-xs">Valeur</th>
                      <th className="p-2 font-bold !font-sans uppercase text-xs">Exemple (Sens)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-natural-border"><td className="p-2 font-bold">a, e, i, o, u</td><td className="p-2">Standard</td><td className="p-2">aɓi, ti, viŋ</td></tr>
                    <tr className="border-b border-natural-border"><td className="p-2 font-bold">ɛ</td><td className="p-2">/ɛ/ ouvert</td><td className="p-2">ɛiri (fer)</td></tr>
                    <tr className="border-b border-natural-border"><td className="p-2 font-bold">ɔ</td><td className="p-2">/ɔ/ ouvert</td><td className="p-2">ɔra (heure)</td></tr>
                    <tr><td className="p-2 font-bold">p, b, t, d, k, g...</td><td className="p-2">Standard</td><td className="p-2">put, Dar, gusoŋ</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-lg flex items-center gap-2">
                 Consonnes Spécifiques & Digraphes
              </h4>
              <div className="bg-[#FDFBF7] rounded-xl border border-natural-border overflow-hidden p-1 text-sm">
                 <table className="w-full text-left">
                  <thead className="bg-[#7D8471] text-white">
                    <tr>
                      <th className="p-2 font-bold !font-sans uppercase text-xs">Caractère</th>
                      <th className="p-2 font-bold !font-sans uppercase text-xs">Type</th>
                      <th className="p-2 font-bold !font-sans uppercase text-xs">Exemple</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-natural-border"><td className="p-2 font-bold">ɓ</td><td className="p-2">Injeté bilabial</td><td className="p-2">ɓiri</td></tr>
                    <tr className="border-b border-natural-border"><td className="p-2 font-bold">ɗ</td><td className="p-2">Injeté alvéolaire</td><td className="p-2">ɗuwa</td></tr>
                    <tr className="border-b border-natural-border"><td className="p-2 font-bold">ŋ</td><td className="p-2">Nasal vélaire</td><td className="p-2">Bumbulvuŋ</td></tr>
                    <tr className="border-b border-natural-border"><td className="p-2 font-bold">sl, zl</td><td className="p-2">Fricatif latéral</td><td className="p-2">slimiɗ, zluwun</td></tr>
                    <tr className="border-b border-natural-border"><td className="p-2 font-bold">gb, kp</td><td className="p-2">Labio-vélaire</td><td className="p-2">gbɛ, kpɔ</td></tr>
                    <tr><td className="p-2 font-bold">mb, nd, ng, nj</td><td className="p-2">Digraphes nasaux</td><td className="p-2">mburo, ngirda</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          <div className="pt-6 border-t border-natural-border">
             <h4 className="font-bold text-lg flex items-center gap-2 mb-4">Outils Recommandés</h4>
             <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm list-none p-0">
               <li className="bg-[#F2E9E1]/30 p-4 border border-natural-border rounded-xl flex items-start gap-3">
                  <Keyboard size={18} className="text-[#7D8471] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block">SIL Cameroun Keyboard</strong>
                    <span className="text-natural-secondary">Clavier virtuel AGLC (silcam.org) pour toutes les langues locales.</span>
                  </div>
               </li>
               <li className="bg-[#F2E9E1]/30 p-4 border border-natural-border rounded-xl flex items-start gap-3">
                  <Library size={18} className="text-[#7D8471] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block">Polices de caractères utiles</strong>
                    <span className="text-natural-secondary">Cam Cam SILDoulosL, Andika pour un typographie impeccable.</span>
                  </div>
               </li>
               <li className="bg-[#F2E9E1]/30 p-4 border border-natural-border rounded-xl flex items-start gap-3">
                  <Languages size={18} className="text-[#7D8471] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block">Dubun Guiziga</strong>
                    <span className="text-natural-secondary">Application mobile (Play Store) d'apprentissage.</span>
                  </div>
               </li>
             </ul>
          </div>
        </div>
      )}
    </div>
  );
}
