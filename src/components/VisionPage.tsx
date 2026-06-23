import React from "react";
import { Heart, Globe2, Sparkles, BookOpen, Fingerprint } from "lucide-react";

export default function VisionPage() {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-12 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Hero Section */}
      <section className="text-center space-y-6 pt-8 pb-12 border-b border-[#EAE5DD]">
        <div className="inline-flex items-center justify-center p-3 bg-[#F2E9E1] rounded-2xl mb-4 shadow-sm text-natural-primary">
          <Globe2 size={32} />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#2F2F20] tracking-tight font-serif">
          L'Âme Guiziga à l'Ère Numérique
        </h1>
        <p className="text-lg md:text-xl text-[#5A5A40] max-w-2xl mx-auto leading-relaxed">
          Chaque langue qui s'éteint est une bibliothèque qui brûle. Nous refusons de laisser le silence s'installer. Découvrez notre manifeste pour la transmission de la culture Guiziga par la technologie.
        </p>
      </section>

      {/* Manifeste Articles */}
      <section className="grid grid-cols-1 md:grid-cols-1 gap-12">
        
        {/* Article 1: Connexion Tech & Culture */}
        <article className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-[#EAE5DD] flex flex-col md:flex-row gap-8 items-center">
          <div className="md:w-1/3 flex items-center justify-center">
            <div className="w-32 h-32 bg-[#F6F0EA] rounded-full flex items-center justify-center relative">
              <div className="absolute inset-0 bg-[#EAE5DD] animate-ping opacity-20 rounded-full"></div>
              <Sparkles size={48} className="text-[#8B7355]" />
            </div>
          </div>
          <div className="md:w-2/3 space-y-4">
            <h2 className="text-2xl font-bold text-[#3A3A2C] font-serif border-b pb-2 border-[#EAE5DD]/50">
              Un Pont Entre Ancestralité et Innovation
            </h2>
            <p className="text-[#5A5A40] leading-relaxed text-lg">
              Longtemps, la technologie a semblé être l'apanage des cultures dominantes, un outil d'homogénéisation. Nous inversons ce paradigme. Cette solution transforme l'intelligence artificielle et l'ingénierie logicielle en gardiens de notre identité. Le Guiziga ne survit plus : <strong className="text-[#2F2F20]">il s'adapte, il s'étend, il s'impose sur les écrans du XXIe siècle.</strong>
            </p>
          </div>
        </article>

        {/* Article 2: Impact sur la population */}
        <article className="bg-[#4A4E40] rounded-3xl p-8 md:p-12 shadow-md flex flex-col md:flex-row-reverse gap-8 items-center text-white">
          <div className="md:w-1/3 flex items-center justify-center">
            <div className="w-32 h-32 bg-[#5A5E50] rounded-full flex items-center justify-center relative">
              <Heart size={48} className="text-[#EAE5DD]" />
            </div>
          </div>
          <div className="md:w-2/3 space-y-4">
            <h2 className="text-2xl font-bold text-white font-serif border-b pb-2 border-white/20">
              Cicatriser les Ruptures Générationnelles
            </h2>
            <p className="text-gray-200 leading-relaxed text-lg">
              Pour le jeune né en diaspora qui cherche ses racines, pour le parent désirant transmettre son héritage, ou pour le curieux fasciné par notre richesse : la barrière de l'apprentissage est brisée. Cette plateforme est un foyer de reconnexion émotionnelle. Elle rend l'apprentissage du Guiziga <strong className="text-white">intuitif, accessible et profondément humain</strong>.
            </p>
          </div>
        </article>

        {/* Article 3: Promotion et solution évolutive */}
        <article className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-[#EAE5DD] flex flex-col md:flex-row gap-8 items-center">
          <div className="md:w-1/3 flex items-center justify-center">
            <div className="w-32 h-32 bg-[#F6F0EA] rounded-full flex items-center justify-center relative">
              <Fingerprint size={48} className="text-[#8B7355]" />
            </div>
          </div>
          <div className="md:w-2/3 space-y-4">
            <h2 className="text-2xl font-bold text-[#3A3A2C] font-serif border-b pb-2 border-[#EAE5DD]/50">
              Une Voix Immortelle, Une Culture Évolutive
            </h2>
            <p className="text-[#5A5A40] leading-relaxed text-lg">
              Notre culture n'est pas un vestige figé dans le passé ; elle est vivante, vibrante et respire à travers chacun de nous. Conçue comme un écosystème collaboratif et évolutif, cette plateforme grandit avec sa communauté. Chaque mot inséré, chaque audio enregistré est un acte de souveraineté culturelle qui cimente la présence du Guiziga sur la carte du monde.
            </p>
          </div>
        </article>

      </section>

      {/* Footer CTA-like Message */}
      <div className="text-center mt-12 bg-[#F2E9E1] p-8 rounded-2xl border border-[#EAE5DD]">
        <BookOpen className="mx-auto mb-4 text-[#8B7355]" size={32} />
        <p className="text-xl font-serif text-[#3A3A2C] italic">
          "Celui qui perd sa langue perd la boussole de son histoire."
        </p>
        <p className="text-[#5A5A40] mt-4 font-medium uppercase tracking-widest text-sm">
          Ensemble, faisons résonner le Guiziga.
        </p>
      </div>

    </div>
  );
}
