import React, { useState, useEffect } from "react";
import { 
  Languages, 
  PlusCircle, 
  BookOpenCheck, 
  HelpCircle,
  Sparkles,
  Info,
  ChevronRight,
  BookMarked,
  Compass,
  Smartphone,
  Keyboard
} from "lucide-react";
import { TranslationEntry, TabType } from "./types";
import TranslationPage from "./components/TranslationPage";
import InsertTranslationPage from "./components/InsertTranslationPage";
import ExamplesPage from "./components/ExamplesPage";
import CulturePage from "./components/CulturePage";
import ApkPage from "./components/ApkPage";
import TranscriptionPage from "./components/TranscriptionPage";
import { useAuth } from "./AuthContext";

const DEFAULT_SOURCE_LANG_KEY = "maternelle_source_lang_v2";

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>("translate");
  const [sourceLang, setSourceLang] = useState<string>(() => {
    return localStorage.getItem(DEFAULT_SOURCE_LANG_KEY) || "Guiziga";
  });
  const [isSimulatedMobileActive, setIsSimulatedMobileActive] = useState<boolean>(false);
  const [dictionary, setDictionary] = useState<TranslationEntry[]>([]);
  const { user, getToken, signIn } = useAuth();

  // Fetch entries from Cloud SQL via API
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const res = await fetch('/api/entries');
        if (res.ok) {
          const data = await res.json();
          setDictionary(data);
        }
      } catch (err) {
        console.error("Failed to fetch dictionary entries from database:", err);
      }
    };
    fetchEntries();
  }, []);

  // Persist source language selection
  useEffect(() => {
    localStorage.setItem(DEFAULT_SOURCE_LANG_KEY, sourceLang);
  }, [sourceLang]);

  const handleAddEntry = async (entry: TranslationEntry) => {
    setDictionary(prev => [entry, ...prev]);
    if (!user) {
      await signIn();
    }
    const token = await getToken();
    if (token) {
      await fetch('/api/entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(entry)
      });
    }
  };

  const handleDeleteEntry = (id: string) => {
    // Note: Backend delete endpoint could be added, just updating local state for now
    setDictionary(prev => prev.filter(item => item.id !== id));
  };

  const handleUpdateEntry = async (updatedEntry: TranslationEntry) => {
    setDictionary(prev => prev.map(item => item.id === updatedEntry.id ? updatedEntry : item));
    if (!user) {
      await signIn();
    }
    const token = await getToken();
    if (token) {
      await fetch('/api/entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedEntry)
      });
    }
  };

  // Allows instant saving of output from translation view directly into Insertion card
  const handleSaveToDictionaryFromTranslator = (entryData: Omit<TranslationEntry, "id" | "createdAt">) => {
    const entry: TranslationEntry = {
      ...entryData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    };
    handleAddEntry(entry);
  };

  return (
    <div className="min-h-screen bg-natural-bg text-natural-text flex flex-col font-sans" id="app_root">
      {/* Top Professional Header */}
      <header className="sticky top-0 bg-natural-bg/90 backdrop-blur-md border-b border-natural-border z-50 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#7D8471] flex items-center justify-center text-white shadow-md shadow-[#7D8471]/10">
              <Languages size={22} />
            </div>
            <div>
              <h1 className="text-xl font-serif font-bold tracking-tight text-natural-text flex items-center gap-2">
                <span>GUIZIGA translate</span>
                <span className="text-[10px] uppercase tracking-wider font-sans px-2.5 py-0.5 rounded-full text-white bg-[#7D8471] font-bold border border-white/20">Extrême-Nord</span>
              </h1>
              <p className="text-xs text-natural-muted font-medium font-serif italic font-sans">Traducteur expert & Préservation linguistique de l'Extrême-Nord Cameroun (APK disponible)</p>
            </div>
          </div>

          {/* Tab Navigation */}
          <nav className="flex flex-wrap items-center bg-[#EAE5DD]/60 p-1.5 rounded-2xl border border-natural-border gap-1" id="main_tabs">
            <button
              onClick={() => setActiveTab("translate")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "translate"
                  ? "bg-natural-primary text-white shadow-sm"
                  : "text-natural-text hover:text-natural-primary"
              }`}
              id="tab_btn_translate"
            >
              <Languages size={15} />
              <span>Traduire</span>
            </button>
            <button
              onClick={() => setActiveTab("insert")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "insert"
                  ? "bg-natural-primary text-white shadow-sm"
                  : "text-natural-text hover:text-natural-primary"
              }`}
              id="tab_btn_insert"
            >
              <PlusCircle size={15} />
              <span>Contribuer & Éditer</span>
            </button>
            <button
              onClick={() => setActiveTab("examples")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "examples"
                  ? "bg-natural-primary text-white shadow-sm"
                  : "text-natural-text hover:text-natural-primary"
              }`}
              id="tab_btn_examples"
            >
              <BookOpenCheck size={15} />
              <span>Explorateur</span>
            </button>
            <button
              onClick={() => setActiveTab("culture")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "culture"
                  ? "bg-natural-primary text-white shadow-sm"
                  : "text-natural-text hover:text-natural-primary"
              }`}
              id="tab_btn_culture"
            >
              <Compass size={15} />
              <span>Peuple & Culture</span>
            </button>
            <button
              onClick={() => setActiveTab("apk")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "apk"
                  ? "bg-[#7D8471] text-white shadow-sm font-bold"
                  : "text-natural-text hover:text-natural-primary"
              }`}
              id="tab_btn_apk"
            >
              <Smartphone size={15} />
              <span>📱 Version APK</span>
            </button>
            <button
              onClick={() => setActiveTab("transcription")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "transcription"
                  ? "bg-[#7D8471] text-white shadow-sm font-bold"
                  : "text-natural-text hover:text-natural-primary"
              }`}
              id="tab_btn_transcription"
            >
              <Keyboard size={15} />
              <span>Clavier AGLC</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main View Container */}
      <main className="flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex justify-center" id="view_stage">
        {isSimulatedMobileActive ? (
          /* High-Fidelity Responsive Smartphone Shell Wrapper */
          <div className="w-full max-w-[400px] border-[12px] border-[#4A4E40] rounded-[50px] bg-natural-bg shadow-2xl relative overflow-hidden flex flex-col my-4 min-h-[750px] border-double select-none transition-all hover:shadow-[#7D8471]/10">
            {/* Phone Speaker & Notch */}
            <div className="absolute top-0 inset-x-0 h-6 bg-[#4A4E40] flex justify-between items-center px-6 text-[10px] text-white font-mono z-20">
              <span className="font-bold">08:12</span>
              {/* Notch */}
              <div className="w-24 h-3.5 bg-[#4A4E40] rounded-b-lg flex items-center justify-center">
                <span className="w-8 h-1 bg-neutral-600 rounded-full"></span>
              </div>
              <div className="flex items-center gap-1.5 font-bold">
                <span className="text-[9px] text-[#B5C299]">4G+ GzG</span>
                <span className="w-4 h-2 border border-white/50 rounded-xs flex items-center p-0.5 justify-start">
                  <span className="w-2.5 h-full bg-white rounded-2xs"></span>
                </span>
              </div>
            </div>

            {/* Interactive content inside smartphone preview (100% responsive layout container) */}
            <div className="flex-1 overflow-y-auto max-h-[720px] p-4 pt-8 space-y-4 bg-natural-bg">
              <div className="p-2 border border-dashed border-[#7D8471]/40 rounded-xl bg-[#7D8471]/5 text-center text-[10px] font-mono text-[#5A5A40] flex items-center justify-center gap-1.5 shadow-2xs">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span>Mode Native responsive actif</span>
                <button 
                  onClick={() => setIsSimulatedMobileActive(false)} 
                  className="bg-white px-1.5 py-0.5 rounded text-[8px] font-bold text-[#7D8471] hover:bg-neutral-100 border border-[#7D8471]/20 cursor-pointer"
                >
                  Fermer
                </button>
              </div>

              {/* Dynamic Pages */}
              {activeTab === "translate" && (
                <TranslationPage 
                  sourceLang={sourceLang} 
                  setSourceLang={setSourceLang}
                  onSaveToDictionary={handleSaveToDictionaryFromTranslator}
                  dictionary={dictionary}
                />
              )}

              {activeTab === "insert" && (
                <InsertTranslationPage 
                  sourceLang={sourceLang}
                  dictionary={dictionary}
                  onAddEntry={handleAddEntry}
                  onDeleteEntry={handleDeleteEntry}
                  onUpdateEntry={handleUpdateEntry}
                />
              )}

              {activeTab === "examples" && (
                <ExamplesPage 
                  sourceLang={sourceLang}
                  dictionary={dictionary}
                />
              )}

              {activeTab === "culture" && (
                <CulturePage />
              )}

              {activeTab === "apk" && (
                <ApkPage 
                  onSimulateMobileWidthToggle={() => setIsSimulatedMobileActive(prev => !prev)}
                  isSimulatedMobileActive={isSimulatedMobileActive}
                />
              )}

              {activeTab === "transcription" && (
                <TranscriptionPage />
              )}
            </div>

            {/* Smartphone Bottom Navigation Bar Bar */}
            <div className="h-4 bg-[#4A4E40] flex items-center justify-center">
              <div className="w-24 h-1 bg-white/60 rounded-full"></div>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-7xl">
            {activeTab === "translate" && (
              <TranslationPage 
                sourceLang={sourceLang} 
                setSourceLang={setSourceLang}
                onSaveToDictionary={handleSaveToDictionaryFromTranslator}
                dictionary={dictionary}
              />
            )}

            {activeTab === "insert" && (
              <InsertTranslationPage 
                sourceLang={sourceLang}
                dictionary={dictionary}
                onAddEntry={handleAddEntry}
                onDeleteEntry={handleDeleteEntry}
                onUpdateEntry={handleUpdateEntry}
              />
            )}

            {activeTab === "examples" && (
              <ExamplesPage 
                sourceLang={sourceLang}
                dictionary={dictionary}
              />
            )}

            {activeTab === "culture" && (
              <CulturePage />
            )}

            {activeTab === "apk" && (
              <ApkPage 
                onSimulateMobileWidthToggle={() => setIsSimulatedMobileActive(prev => !prev)}
                isSimulatedMobileActive={isSimulatedMobileActive}
              />
            )}

            {activeTab === "transcription" && (
              <TranscriptionPage />
            )}
          </div>
        )}
      </main>

      {/* Modern, Simple, Non-intrusive Footer */}
      <footer className="bg-[#F6F3EC] border-t border-natural-border py-8 text-center text-xs text-natural-muted space-y-2">
        <div className="flex items-center justify-center gap-4 text-natural-text font-medium">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
            Langue active: {sourceLang}
          </span>
          <span className="text-natural-border">|</span>
          <span className="flex items-center gap-1">
            <BookMarked size={13} className="text-natural-primary" />
            Mots enregistrés: {dictionary.length}
          </span>
        </div>
        <p className="text-[11px] font-serif italic text-natural-muted">"La langue est le chemin de l'esprit." — Sagesse de l'Extrême-Nord Cameroun</p>
      </footer>
    </div>
  );
}
