import React, { useState } from 'react';
import { ArrowRight, Droplets, CloudSun, ShoppingBag, Languages, CheckCircle2, ChevronDown, ChevronUp, Star, MapPin, BrainCircuit, Sprout, Moon, Sun } from 'lucide-react';
import { EcoFlowLogo } from './Logo';
import { Language } from '../types';
import { TRANSLATIONS } from '../utils/translations';

interface Props {
  onGetStarted: () => void;
  language: Language;
  toggleLanguage: () => void;
  darkMode?: boolean;
  toggleDarkMode?: () => void;
}

const LandingPage: React.FC<Props> = ({ onGetStarted, language, toggleLanguage, darkMode, toggleDarkMode }) => {
  const t = TRANSLATIONS[language];
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-50 selection:bg-green-100 selection:text-green-900 transition-colors duration-300">
      
      {/* Navbar */}
      <nav className="fixed w-full bg-white/90 dark:bg-slate-950/90 backdrop-blur-md z-50 border-b border-slate-100 dark:border-slate-800 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
             <EcoFlowLogo className="w-9 h-9" />
             <span className="font-extrabold text-2xl tracking-tight text-slate-900 dark:text-white hidden sm:block">EcoFlow</span>
          </div>
          <div className="flex items-center gap-4">
             {toggleDarkMode && (
               <button 
                 onClick={toggleDarkMode}
                 className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
               >
                 {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
               </button>
             )}
             <button 
                onClick={toggleLanguage}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-green-700 dark:hover:text-green-400"
              >
                <Languages className="w-4 h-4" />
                {language === 'en' ? 'हिंदी' : 'English'}
              </button>
              <button 
                onClick={onGetStarted}
                className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-2 rounded-full text-sm font-bold hover:bg-green-600 dark:hover:bg-green-400 transition-all hidden md:block"
              >
                {t.getStarted}
              </button>
          </div>
        </div>
      </nav>

      {/* 1. HERO SECTION */}
      <section className="pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-green-50 via-blue-50 to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 overflow-hidden relative">
        {/* Background blobs */}
        <div className="absolute top-20 right-0 w-96 h-96 bg-green-200/20 dark:bg-green-500/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-200/20 dark:bg-blue-500/10 rounded-full blur-3xl -z-10"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-green-200 dark:border-slate-700 text-green-700 dark:text-green-400 text-xs font-bold uppercase tracking-wide mb-8 shadow-sm animate-fade-in-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            {t.heroBadge}
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-8 leading-[1.1]">
            {t.heroTitle}
          </h1>
          
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            {t.heroSubtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={onGetStarted}
              className="w-full sm:w-auto bg-green-600 text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-green-700 hover:scale-105 transition-all duration-300 shadow-xl shadow-green-500/20 flex items-center justify-center gap-2"
            >
              {t.getStarted}
              <ArrowRight className="w-5 h-5" />
            </button>
             <button 
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto bg-white dark:bg-slate-800 text-slate-700 dark:text-white border border-slate-200 dark:border-slate-700 px-8 py-4 rounded-full text-lg font-bold hover:border-slate-400 dark:hover:border-slate-500 transition-all flex items-center justify-center gap-2"
            >
              {t.learnMore}
            </button>
          </div>

          <div className="mt-16 flex justify-center">
             <style>{`
               @keyframes float {
                 0%, 100% { transform: translateY(0); }
                 50% { transform: translateY(-8px); }
               }
               .animate-float {
                 animation: float 5s ease-in-out infinite;
               }
             `}</style>
             <div className="animate-float group relative inline-flex flex-wrap items-center justify-center gap-x-8 gap-y-4 rounded-full border border-blue-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl px-10 py-5 text-sm font-bold text-slate-600 dark:text-slate-300 shadow-xl shadow-blue-500/5 transition-all hover:border-blue-300 hover:bg-white dark:hover:bg-slate-800 hover:shadow-blue-500/10">
                <span className="flex items-center gap-2.5">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50 ring-2 ring-white dark:ring-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                  </div>
                  Free for Farmers
                </span>
                
                <div className="hidden h-5 w-px bg-slate-200 dark:bg-slate-700 sm:block"></div>

                <span className="flex items-center gap-2.5">
                   <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50 ring-2 ring-white dark:ring-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                  </div>
                  Works Offline
                </span>

                <div className="hidden h-5 w-px bg-slate-200 dark:bg-slate-700 sm:block"></div>

                <span className="flex items-center gap-2.5">
                   <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50 ring-2 ring-white dark:ring-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                  </div>
                  Hindi Support
                </span>
             </div>
          </div>
        </div>
      </section>

      {/* 2. IMPACT STATS */}
      <section className="py-12 bg-slate-900 dark:bg-black text-white border-y border-slate-800">
         <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800">
            <div className="p-4">
               <div className="text-4xl lg:text-5xl font-extrabold text-blue-400 mb-2">{t.stat1Val}</div>
               <div className="text-slate-400 font-medium uppercase tracking-widest text-sm">{t.stat1Label}</div>
            </div>
            <div className="p-4">
               <div className="text-4xl lg:text-5xl font-extrabold text-green-400 mb-2">{t.stat2Val}</div>
               <div className="text-slate-400 font-medium uppercase tracking-widest text-sm">{t.stat2Label}</div>
            </div>
            <div className="p-4">
               <div className="text-4xl lg:text-5xl font-extrabold text-purple-400 mb-2">{t.stat3Val}</div>
               <div className="text-slate-400 font-medium uppercase tracking-widest text-sm">{t.stat3Label}</div>
            </div>
         </div>
      </section>

      {/* 3. HOW IT WORKS (Steps) */}
      <section id="how-it-works" className="py-24 px-6 bg-white dark:bg-slate-950">
         <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
               <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6">{t.stepsTitle}</h2>
               <div className="w-24 h-1.5 bg-green-500 mx-auto rounded-full"></div>
            </div>

            <div className="grid md:grid-cols-3 gap-12 relative">
               {/* Connecting Line (Desktop) */}
               <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-slate-200 dark:bg-slate-800 -z-10"></div>

               {/* Step 1 */}
               <div className="flex flex-col items-center text-center group">
                  <div className="w-24 h-24 bg-white dark:bg-slate-800 border-4 border-slate-100 dark:border-slate-700 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 mb-8 shadow-lg group-hover:border-green-500 group-hover:scale-110 transition-all duration-300 relative z-10">
                     <MapPin className="w-10 h-10" />
                     <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full flex items-center justify-center font-bold border-4 border-white dark:border-slate-800">1</div>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">{t.step1Title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed px-4">{t.step1Desc}</p>
               </div>

               {/* Step 2 */}
               <div className="flex flex-col items-center text-center group">
                  <div className="w-24 h-24 bg-white dark:bg-slate-800 border-4 border-slate-100 dark:border-slate-700 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 mb-8 shadow-lg group-hover:border-blue-500 group-hover:scale-110 transition-all duration-300 relative z-10">
                     <BrainCircuit className="w-10 h-10" />
                     <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full flex items-center justify-center font-bold border-4 border-white dark:border-slate-800">2</div>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">{t.step2Title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed px-4">{t.step2Desc}</p>
               </div>

               {/* Step 3 */}
               <div className="flex flex-col items-center text-center group">
                  <div className="w-24 h-24 bg-white dark:bg-slate-800 border-4 border-slate-100 dark:border-slate-700 rounded-full flex items-center justify-center text-amber-500 mb-8 shadow-lg group-hover:border-amber-400 group-hover:scale-110 transition-all duration-300 relative z-10">
                     <Sprout className="w-10 h-10" />
                     <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full flex items-center justify-center font-bold border-4 border-white dark:border-slate-800">3</div>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">{t.step3Title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed px-4">{t.step3Desc}</p>
               </div>
            </div>
         </div>
      </section>

      {/* 4. FEATURES GRID */}
      <section className="py-24 px-6 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Feature 1 */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-slate-100 dark:border-slate-700 group">
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 group-hover:rotate-6 transition-transform">
                <Droplets className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{t.feat1Title}</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{t.feat1Desc}</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-slate-100 dark:border-slate-700 group">
              <div className="w-14 h-14 bg-sky-100 dark:bg-sky-900/30 rounded-2xl flex items-center justify-center text-sky-600 dark:text-sky-400 mb-6 group-hover:rotate-6 transition-transform">
                <CloudSun className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{t.feat2Title}</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{t.feat2Desc}</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-slate-100 dark:border-slate-700 group">
              <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center text-green-600 dark:text-green-400 mb-6 group-hover:rotate-6 transition-transform">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{t.feat3Title}</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{t.feat3Desc}</p>
            </div>

          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS */}
      <section className="py-24 px-6 bg-white dark:bg-slate-950 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-16 text-center">{t.testTitle}</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Review 1 */}
            <div className="bg-slate-50 dark:bg-slate-800 p-8 rounded-3xl relative">
              <div className="flex gap-1 text-amber-400 mb-4">
                 {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-current" />)}
              </div>
              <p className="text-lg text-slate-700 dark:text-slate-300 italic mb-6 leading-relaxed">"{t.test1Quote}"</p>
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-green-200 dark:bg-green-900 rounded-full flex items-center justify-center font-bold text-green-700 dark:text-green-300 text-lg">R</div>
                 <div>
                    <div className="font-bold text-slate-900 dark:text-white">{t.test1Author}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1"><MapPin className="w-3 h-3" /> {t.test1Loc}</div>
                 </div>
              </div>
            </div>

            {/* Review 2 */}
            <div className="bg-slate-50 dark:bg-slate-800 p-8 rounded-3xl relative">
              <div className="flex gap-1 text-amber-400 mb-4">
                 {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-current" />)}
              </div>
              <p className="text-lg text-slate-700 dark:text-slate-300 italic mb-6 leading-relaxed">"{t.test2Quote}"</p>
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-purple-200 dark:bg-purple-900 rounded-full flex items-center justify-center font-bold text-purple-700 dark:text-purple-300 text-lg">S</div>
                 <div>
                    <div className="font-bold text-slate-900 dark:text-white">{t.test2Author}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1"><MapPin className="w-3 h-3" /> {t.test2Loc}</div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ */}
      <section className="py-20 px-6 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-10 text-center">{t.faqTitle}</h2>
          <div className="space-y-4">
             {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                   <button 
                      onClick={() => toggleFaq(i)}
                      className="w-full flex items-center justify-between p-6 text-left font-bold text-slate-800 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                   >
                      {i === 1 ? t.faq1Q : i === 2 ? t.faq2Q : t.faq3Q}
                      {openFaq === i ? <ChevronUp className="w-5 h-5 text-green-600" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                   </button>
                   {openFaq === i && (
                      <div className="px-6 pb-6 text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-700 pt-4">
                         {i === 1 ? t.faq1A : i === 2 ? t.faq2A : t.faq3A}
                      </div>
                   )}
                </div>
             ))}
          </div>
        </div>
      </section>

      {/* 7. CTA & FOOTER */}
      <section className="py-24 px-6 bg-slate-900 dark:bg-slate-950 text-white text-center rounded-t-[3rem] mt-[-2rem] relative z-10 border-t border-slate-800">
         <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-extrabold mb-6 tracking-tight">{t.ctaTitle}</h2>
            <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">{t.ctaDesc}</p>
            <button 
               onClick={onGetStarted}
               className="bg-green-500 text-white px-10 py-5 rounded-full text-xl font-bold hover:bg-green-400 hover:scale-105 transition-all shadow-lg shadow-green-500/30"
            >
               {t.ctaBtn}
            </button>
         </div>

         <div className="mt-24 pt-10 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6 opacity-60">
            <div className="flex items-center gap-2">
               <EcoFlowLogo className="w-6 h-6 text-slate-500" />
               <span className="font-bold">EcoFlow</span>
            </div>
            <p className="text-sm">© 2024 Science Fair Project. All rights reserved.</p>
            <div className="flex gap-4">
               <span className="text-xs font-bold tracking-widest uppercase">Privacy</span>
               <span className="text-xs font-bold tracking-widest uppercase">Terms</span>
            </div>
         </div>
      </section>

    </div>
  );
};

export default LandingPage;