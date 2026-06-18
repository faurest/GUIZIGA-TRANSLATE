import React, { useState, useEffect } from "react";
import { 
  Smartphone, 
  CheckCircle2, 
  Info, 
  Sliders, 
  Cpu,
  Monitor,
  Tablet,
  Package,
  PlusSquare
} from "lucide-react";

export default function ApkPage() {
  const [deviceSelected, setDeviceSelected] = useState<"mobile" | "tablet" | "desktop">("mobile");
  // Manage PWA install prompt
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if running as standalone (already installed)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setIsInstallable(false);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallPWA = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstallable(false);
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  return (
    <div className="space-y-8 animate-fade-in" id="apk_page_workspace">
      {/* Visual Header Banner */}
      <div className="bg-gradient-to-br from-[#5A5A40] to-[#3E4032] text-white rounded-3xl p-8 md:p-10 relative overflow-hidden shadow-sm" id="apk_hero">
        <div className="relative z-10 max-w-3xl space-y-4">
          <span className="px-3.5 py-1.5 bg-white/10 text-white rounded-full text-xs font-mono uppercase tracking-widest border border-white/25 inline-flex items-center gap-1.5">
            <Smartphone size={12} className="text-white shrink-0" />
            Compilateur Mobile & PWA
          </span>
          <h2 className="text-3xl md:text-4xl font-serif italic tracking-wide">
            GUIZIGA translate — Version Mobile Native (PWA)
          </h2>
          <p className="text-white/90 text-sm md:text-base leading-relaxed font-serif max-w-2xl">
            Profitez de l'expérience native complète directement sur votre smartphone Android sans passer par Google Play. Notre architecture universelle s'installe en un clic.
          </p>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 blur-xl pointer-events-none translate-x-12 translate-y-12">
          <Smartphone size={320} className="text-white" />
        </div>
      </div>

      {/* Grid: APK Downloader / Config and Live Device Simulator */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8" id="apk_main_grid">
        
        {/* Left Side: APK Installer & Compilation Console */}
        <div className="xl:col-span-7 space-y-6">
          <div className="bg-white border border-natural-border p-6 md:p-8 rounded-3xl shadow-sm space-y-6">
            <div className="space-y-1">
              <h3 className="text-2xl font-serif font-bold text-natural-text">Installation Directe Officielle</h3>
              <p className="text-xs text-natural-muted font-serif">Note importante : Le simulateur de build APK était une maquette. La VRAIE installation se fait via PWA (Progressive Web App).</p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-amber-800 space-y-2 text-xs leading-relaxed font-serif">
              <div className="flex items-center gap-2 font-bold">
                <Info size={15} className="text-amber-600" />
                <span>Pourquoi l'analyse du package échouait-elle ?</span>
              </div>
              <p>
                Vous avez précédemment cliqué sur un téléchargement expérimental d'interface qui créait un "faux" fichier pour le design. Sur Android ou Windows, un ficher non certifié retourne une erreur ("Erreur d'analyse du package"). L'entreprise vous propose donc la méthode d'installation universelle PWA certifiée.
              </p>
            </div>

            {/* PWA Direct Installation */}
            <div className="bg-[#FDFBF7] rounded-3xl p-6 border border-natural-border flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-[#7D8471] rounded-2xl flex items-center justify-center text-white shadow-lg">
                <Smartphone size={32} />
              </div>
              
              <div className="space-y-2">
                <h4 className="font-bold font-serif text-lg text-natural-text">Installez l'Application Native</h4>
                <p className="text-xs text-natural-secondary max-w-md mx-auto">
                  Ajoutez GUIZIGA translate sur votre écran d'accueil. L'application fonctionnera comme une APK certifiée : accès hors ligne, pas de barre d'URL, et icône dédiée.
                </p>
              </div>

              {isInstalled ? (
                <div className="px-6 py-3 bg-emerald-100 text-emerald-800 rounded-2xl font-bold flex items-center gap-2">
                  <CheckCircle2 size={18} />
                  <span>Application déjà installée !</span>
                </div>
              ) : isInstallable ? (
                <button
                  onClick={handleInstallPWA}
                  className="bg-[#7D8471] hover:bg-[#5A5A40] text-white px-8 py-3.5 rounded-2xl font-bold font-serif shadow-md transition-all flex items-center gap-2"
                >
                  <PlusSquare size={18} />
                  <span>Installer GUIZIGA translate</span>
                </button>
              ) : (
                <div className="px-6 py-4 bg-zinc-100 text-zinc-600 rounded-2xl text-xs font-medium space-y-2 w-full text-left">
                  <p>Installation automatique indisponible. Si vous êtes sur mobile :</p>
                  <ol className="list-decimal list-inside pl-2 space-y-1 text-zinc-500">
                    <li>Ouvrez le menu de votre navigateur (Chrome/Safari)</li>
                    <li>Cherchez <strong>"Ajouter à l'écran d'accueil"</strong> ou <strong>"Installer l'application"</strong></li>
                    <li>Validez !</li>
                  </ol>
                </div>
              )}
            </div>
          </div>

          {/* Core Technical Strengths cards (Explain Native/Responsive capabilities) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border border-natural-border p-5 rounded-2xl space-y-2">
              <span className="p-2 bg-emerald-50 text-emerald-700 rounded-xl inline-block">
                <CheckCircle2 size={18} />
              </span>
              <h4 className="font-serif font-bold text-natural-text text-sm">Design 100% Responsif</h4>
              <p className="text-xs text-natural-muted leading-relaxed font-serif">
                Interface fluide conçue à Maroua pour fonctionner sur n’importe quel appareil de 4 à 32 pouces, avec grilles d’adaptation fluides sans perte visuelle.
              </p>
            </div>

            <div className="bg-white border border-natural-border p-5 rounded-2xl space-y-2">
              <span className="p-2 bg-indigo-50 text-indigo-700 rounded-xl inline-block">
                <Package size={18} />
              </span>
              <h4 className="font-serif font-bold text-natural-text text-sm">PWA & Hors Ligne</h4>
              <p className="text-xs text-natural-muted leading-relaxed font-serif">
                Grâce aux Service Workers, vos données et le dictionnaire sont stockés en cache et accessibles même sans connexion en brousse de l'Extrême-Nord.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Showcase Device Simulator responsive preview */}
        <div className="xl:col-span-5 space-y-6">
          <div className="bg-white border border-natural-border p-6 rounded-3xl shadow-sm space-y-6">
            <div className="space-y-1">
              <h3 className="text-lg font-serif font-bold text-natural-text flex items-center gap-1.5">
                <Sliders size={16} className="text-[#7D8471]" />
                <span>Simulateur d'Écran Actif</span>
              </h3>
              <p className="text-xs text-natural-muted font-serif">Validez l'adaptation de l'interface sur différents types de supports.</p>
            </div>

            {/* Hardware selectors */}
            <div className="flex bg-[#EAE5DD]/60 border border-natural-border p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setDeviceSelected("mobile")}
                className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  deviceSelected === "mobile" 
                    ? "bg-[#7D8471] text-white shadow-sm" 
                    : "text-natural-text hover:text-natural-primary"
                }`}
              >
                <Smartphone size={11} />Smartphone
              </button>
              <button
                type="button"
                onClick={() => setDeviceSelected("tablet")}
                className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  deviceSelected === "tablet" 
                    ? "bg-[#7D8471] text-white shadow-sm" 
                    : "text-natural-text hover:text-natural-primary"
                }`}
              >
                <Tablet size={11} />Tablette
              </button>
              <button
                type="button"
                onClick={() => setDeviceSelected("desktop")}
                className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  deviceSelected === "desktop" 
                    ? "bg-[#7D8471] text-white shadow-sm" 
                    : "text-natural-text hover:text-natural-primary"
                }`}
              >
                <Monitor size={11} />Ordinateur
              </button>
            </div>

            {/* Display Simulator Frame containing live design layout simulation */}
            <div className="flex justify-center items-center py-6 bg-[#FDFBF7] rounded-2xl border border-natural-border overflow-hidden">
              <div 
                className={`transition-all duration-300 border-4 border-neutral-800 bg-white shadow-lg overflow-hidden relative ${
                  deviceSelected === "mobile" 
                    ? "w-[240px] h-[360px] rounded-[32px]" 
                    : deviceSelected === "tablet"
                      ? "w-[360px] h-[270px] rounded-2xl"
                      : "w-full max-w-[440px] h-[240px] rounded-xl"
                }`}
              >
                {/* Simulated Screen Content */}
                <div className="h-full flex flex-col font-serif">
                  {/* Status Bar */}
                  <div className="bg-neutral-800 text-[10px] text-zinc-400 px-3.5 py-1 flex justify-between items-center font-mono select-none">
                    <span>GUIZIGA translate</span>
                    <span>12:00</span>
                  </div>

                  {/* Body preview */}
                  <div className="p-3.5 flex-1 flex flex-col justify-between space-y-4 text-xs select-none bg-stone-50 overflow-y-auto">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 bg-emerald-600 rounded-full"></span>
                        <span className="font-bold text-[10px] text-[#5A5A40]">Actif (Extrême-Nord)</span>
                      </div>
                      <h4 className="font-extrabold text-[#7D8471] text-sm">Yahu, slam fika !</h4>
                      <p className="italic text-natural-muted">👉 Bonjour, la paix soit avec toi !</p>
                    </div>

                    <div className="p-2 bg-white/70 border border-natural-border rounded-lg text-[10px] text-natural-text leading-relaxed">
                      "Salutation respectueuse traditionnelle guiziga pour s'enquérir poliment de la paix dans la maison."
                    </div>

                    <div className="bg-[#7D8471]/10 border border-[#7D8471]/20 p-2 rounded-xl text-center font-bold text-[#7D8471] text-[9px] hover:bg-[#7D8471]/20 transition-colors pointer-events-none">
                      Note Vocale de Référence Incluse
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#F2E9E1]/20 border border-natural-border rounded-2xl text-xs space-y-2 font-serif text-natural-secondary leading-relaxed">
              <div className="flex items-center gap-1.5 font-bold">
                <Info size={13} className="text-natural-primary shrink-0" />
                <span>Méthode PWA (Web App)</span>
              </div>
              <p>
                La page de téléchargement <strong>APK</strong> précédente n'était qu'une maquette UI. Le standard moderne (PWA) convertit instantanément JavaScript en application installable via les mécanismes natifs du navigateur Chrome ou Safari, supprimant les risques de "problème lors de l'analyse du package".
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
