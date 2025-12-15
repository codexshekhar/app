import React, { useState } from 'react';
import { Stethoscope, Camera, Upload, Loader2, AlertCircle, X, ChevronRight, ScanLine } from 'lucide-react';
import { Language, AiUsageStats } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { analyzePlantHealth } from '../services/geminiService';

interface Props {
  language: Language;
  onAiUsage?: (feature: keyof AiUsageStats) => void;
  onClose?: () => void;
  mode?: 'card' | 'page'; // 'card' for inside calculator, 'page' for standalone view
}

export const PlantDoctor: React.FC<Props> = ({ language, onAiUsage, onClose, mode = 'card' }) => {
  const [plantImage, setPlantImage] = useState<string | null>(null);
  const [doctorAnalysis, setDoctorAnalysis] = useState<string>('');
  const [doctorLoading, setDoctorLoading] = useState(false);
  const [doctorError, setDoctorError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(mode === 'page');

  const t = TRANSLATIONS[language];

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Convert to Base64
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      setPlantImage(base64String);
      setDoctorAnalysis('');
      setDoctorError(null);
      setDoctorLoading(true);
      setIsExpanded(true); // Auto expand if in card mode

      if (onAiUsage) onAiUsage('plantDoctor');

      try {
        // Strip the data:image/jpeg;base64, part for Gemini
        const rawBase64 = base64String.split(',')[1];
        const diagnosis = await analyzePlantHealth(rawBase64, language);
        setDoctorAnalysis(diagnosis);
      } catch (err) {
        setDoctorError(language === 'hi' ? "विश्लेषण विफल रहा। कृपया पुनः प्रयास करें।" : "Analysis failed. Please try again.");
      } finally {
        setDoctorLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleReset = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setPlantImage(null);
    setDoctorAnalysis('');
    if (mode === 'card') setIsExpanded(false);
  };

  // 1. CARD MODE (Widget inside Calculator)
  if (mode === 'card') {
    return (
      <div className={`bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-300 ${isExpanded ? 'md:col-span-2 lg:col-span-4 border-pink-200 dark:border-pink-800 ring-4 ring-pink-50 dark:ring-pink-900/20 shadow-lg' : 'hover:shadow-lg hover:border-pink-200 dark:hover:border-pink-800'}`}>
         {/* Card Header */}
         <div className="p-4 flex justify-between items-center bg-gradient-to-r from-pink-50/50 to-white dark:from-pink-900/10 dark:to-slate-800 relative">
           <div className="flex items-center gap-3">
             <div className="w-12 h-12 rounded-xl bg-pink-100 dark:bg-pink-900/40 flex items-center justify-center text-pink-600 dark:text-pink-400 shadow-sm relative overflow-hidden">
               <Stethoscope className="w-6 h-6 relative z-10" />
               {/* Pulse Animation */}
               <div className="absolute inset-0 bg-pink-400 opacity-20 animate-ping rounded-full scale-50"></div>
             </div>
             <div>
               <h4 className="font-bold text-slate-800 dark:text-white text-sm">{t.plantDoctor}</h4>
               <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t.doctorSubtitle}</p>
             </div>
           </div>
           
           <label className="cursor-pointer">
              <input 
                type="file" 
                accept="image/*" 
                capture="environment" 
                className="hidden" 
                onChange={handleImageUpload}
              />
              <div className="text-pink-600 dark:text-pink-400 bg-white dark:bg-slate-700 p-2 rounded-full border border-pink-100 dark:border-pink-800 shadow-sm hover:bg-pink-50 dark:hover:bg-pink-900/30 transition flex items-center gap-2">
                 <Camera className="w-4 h-4" />
              </div>
           </label>
        </div>

        {doctorError && (
          <div className="p-4 bg-red-50 dark:bg-red-900/30 border-t border-red-100 dark:border-red-800 flex items-center justify-between text-sm text-red-700 dark:text-red-300 animate-in slide-in-from-top-2">
             <span className="flex items-center gap-2"><AlertCircle className="w-4 h-4" /> {doctorError}</span>
          </div>
        )}

        {isExpanded && (
          <div className="p-6 border-t border-pink-100 dark:border-pink-800 bg-white dark:bg-slate-800">
             {plantImage && (
                <div className="mb-6 flex flex-col items-center">
                  <div className="relative w-full max-w-sm aspect-video bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden shadow-inner mb-4">
                    <img src={plantImage} alt="Plant Analysis" className="w-full h-full object-cover" />
                    {doctorLoading && (
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center text-white">
                        <Loader2 className="w-8 h-8 animate-spin mb-2" />
                        <span className="text-xs font-bold tracking-widest uppercase">{t.analyzingImage}</span>
                      </div>
                    )}
                  </div>
                </div>
             )}

             {doctorAnalysis && !doctorLoading && (
               <div className="animate-in fade-in slide-in-from-bottom-2">
                  <div className="bg-pink-50 dark:bg-pink-900/20 rounded-xl p-4 border border-pink-100 dark:border-pink-800 mb-4">
                     <h5 className="font-bold text-pink-900 dark:text-pink-300 mb-2 flex items-center gap-2"><Stethoscope className="w-4 h-4" /> {t.diagnosis}</h5>
                     <div className="prose prose-sm max-w-none text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                        {doctorAnalysis}
                     </div>
                  </div>
               </div>
             )}

             {/* Close Button if content exists */}
             {(plantImage || doctorAnalysis) && (
                 <button onClick={handleReset} className="mt-2 flex items-center gap-1 text-xs font-bold text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-900/30 px-3 py-1.5 rounded-lg hover:bg-pink-100 dark:hover:bg-pink-900/50 transition w-fit">
                   <X className="w-3 h-3" /> {t.close}
                 </button>
             )}
          </div>
        )}
      </div>
    );
  }

  // 2. PAGE MODE (Standalone Full Screen)
  return (
    <div className="max-w-xl mx-auto p-4 md:p-6 min-h-screen font-sans">
      <div className="text-center mb-8">
         <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 rounded-full mb-4 shadow-sm">
            <ScanLine className="w-8 h-8" />
         </div>
         <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">{t.plantDoctor}</h1>
         <p className="text-slate-500 dark:text-slate-400 mt-2">{t.doctorPrompt}</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden">
        {/* Image Area */}
        <div className="relative aspect-square sm:aspect-video bg-slate-100 dark:bg-slate-900 w-full flex flex-col items-center justify-center border-b border-slate-100 dark:border-slate-700">
          {plantImage ? (
            <img src={plantImage} alt="Analysis" className="w-full h-full object-cover" />
          ) : (
            <div className="text-slate-400 dark:text-slate-600 flex flex-col items-center">
              <Camera className="w-12 h-12 mb-2 opacity-50" />
              <span className="text-sm font-medium">No photo selected</span>
            </div>
          )}
          
          {doctorLoading && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center text-white z-10">
              <Loader2 className="w-10 h-10 animate-spin mb-3" />
              <span className="font-bold tracking-wider">{t.analyzingImage}</span>
            </div>
          )}

          {/* Action Button Overlay */}
          {!doctorLoading && (
            <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4 px-4">
              <label className="cursor-pointer bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-full font-bold shadow-lg flex items-center gap-2 transition-transform hover:scale-105 active:scale-95">
                <Camera className="w-5 h-5" />
                {plantImage ? (language === 'hi' ? 'दूसरी फोटो लें' : 'Retake Photo') : (t.uploadImage)}
                <input 
                  type="file" 
                  accept="image/*" 
                  capture="environment" 
                  className="hidden" 
                  onChange={handleImageUpload}
                />
              </label>
            </div>
          )}
        </div>

        {/* Results Area */}
        <div className="p-6">
          {doctorError && (
             <div className="p-4 bg-red-50 dark:bg-red-900/30 rounded-xl border border-red-100 dark:border-red-800 text-red-700 dark:text-red-300 flex items-center gap-3 text-sm font-medium">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {doctorError}
             </div>
          )}

          {doctorAnalysis ? (
             <div className="animate-in slide-in-from-bottom-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center text-green-600 dark:text-green-400">
                    <Stethoscope className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-lg text-slate-800 dark:text-white">{t.diagnosis}</h3>
                </div>
                <div className="prose prose-slate prose-sm max-w-none bg-slate-50 dark:bg-slate-700/50 p-5 rounded-2xl border border-slate-200 dark:border-slate-600">
                  <div className="whitespace-pre-line leading-relaxed text-slate-700 dark:text-slate-300">
                    {doctorAnalysis}
                  </div>
                </div>
                <button 
                  onClick={handleReset} 
                  className="w-full mt-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                >
                  {language === 'hi' ? 'नई जाँच शुरू करें' : 'Start New Check'}
                </button>
             </div>
          ) : (
             !plantImage && (
               <div className="text-center text-slate-500 dark:text-slate-400 py-6">
                 <p className="text-sm leading-relaxed max-w-xs mx-auto">
                   {language === 'hi' 
                     ? 'अपने पौधे की पत्तियों या तने की साफ फोटो लें। हमारा AI बीमारी की पहचान करेगा।' 
                     : 'Take a clear photo of the affected leaf or stem. Our AI will identify the disease.'}
                 </p>
               </div>
             )
          )}
        </div>
      </div>
    </div>
  );
};