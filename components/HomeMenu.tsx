import React from 'react';
import { User, Language } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { CloudSun, ShoppingBag, Calculator, Stethoscope, User as UserIcon, HelpCircle, ChevronRight, FileText, Crown, Store, Camera } from 'lucide-react';

// We import ViewState type locally if not exported, or assume it matches App.tsx
type ViewState = 'landing' | 'calculator' | 'store' | 'weather' | 'about' | 'contact' | 'careers' | 'admin-dashboard' | 'seller-dashboard' | 'user-profile' | 'home' | 'plant-doctor';

interface Props {
  user: User;
  language: Language;
  onNavigate: (view: ViewState) => void;
}

export const HomeMenu: React.FC<Props> = ({ user, language, onNavigate }) => {
  const t = TRANSLATIONS[language];
  
  const menuItems = [
    {
      id: 'calculator',
      title: t.navHome,
      desc: t.calcDesc,
      icon: <Calculator className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
      bg: "bg-blue-50 dark:bg-blue-900/30",
      view: 'calculator' as ViewState
    },
    {
      id: 'weather',
      title: t.navWeather,
      desc: t.weatherDesc,
      icon: <CloudSun className="w-6 h-6 text-sky-600 dark:text-sky-400" />,
      bg: "bg-sky-50 dark:bg-sky-900/30",
      view: 'weather' as ViewState
    },
    {
      id: 'store',
      title: t.navStore,
      desc: t.storeDesc,
      icon: <ShoppingBag className="w-6 h-6 text-green-600 dark:text-green-400" />,
      bg: "bg-green-50 dark:bg-green-900/30",
      view: 'store' as ViewState
    },
    {
      id: 'doctor',
      title: t.plantDoctor,
      desc: t.docDesc,
      icon: <Stethoscope className="w-6 h-6 text-pink-600 dark:text-pink-400" />,
      bg: "bg-pink-50 dark:bg-pink-900/30",
      view: 'plant-doctor' as ViewState,
      actionIcon: <div className="bg-pink-100 dark:bg-pink-900/50 p-2 rounded-full"><Camera className="w-4 h-4 text-pink-600 dark:text-pink-400" /></div>
    }
  ];

  return (
    <div className="max-w-md mx-auto p-4 md:p-6 font-sans min-h-[80vh]">
      
      {/* Welcome Header */}
      <div className="flex items-center gap-3 mb-8 pt-2 px-1">
        <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-white dark:border-slate-600 shadow-sm flex items-center justify-center overflow-hidden">
           <UserIcon className="w-6 h-6 text-slate-400 dark:text-slate-300" />
        </div>
        <div>
           <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">{t.welcome}</p>
           <h1 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">{user.name}</h1>
        </div>
      </div>

      {/* Vertical List Menu */}
      <div className="space-y-4 mb-8">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.view)}
            className="w-full flex items-center gap-4 p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
          >
             <div className={`w-14 h-14 rounded-2xl ${item.bg} flex items-center justify-center flex-shrink-0`}>
                {item.icon}
             </div>
             
             <div className="text-left flex-grow">
                <h3 className="font-bold text-slate-800 dark:text-white text-lg">{item.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{item.desc}</p>
             </div>
             
             {item.actionIcon ? item.actionIcon : (
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 dark:bg-slate-700 text-slate-300 dark:text-slate-500">
                    <ChevronRight className="w-5 h-5" />
                </div>
             )}
          </button>
        ))}
      </div>

      {/* Save Field Button (New) */}
      <div className="mb-8">
         <button 
           onClick={() => onNavigate('calculator')}
           className="w-full bg-[#f8f9fa] dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-full py-4 px-6 flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-transform hover:border-slate-200 dark:hover:border-slate-600"
         >
            <FileText className="w-5 h-5 text-slate-500 dark:text-slate-400" />
            <span className="font-bold text-slate-600 dark:text-slate-300 text-sm">{t.saveField}</span>
            <Crown className="w-4 h-4 text-amber-400 fill-amber-400 ml-1" />
         </button>
      </div>

      {/* Profile / Support Grid */}
      <div className="grid grid-cols-2 gap-4">
         <button 
           onClick={() => onNavigate('user-profile')}
           className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center gap-2 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
         >
             <UserIcon className="w-6 h-6 text-slate-400 dark:text-slate-500" />
             <span className="text-xs font-bold uppercase tracking-wider">{t.navProfile}</span>
         </button>
         <button 
           onClick={() => onNavigate('contact')}
           className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center gap-2 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
         >
             <HelpCircle className="w-6 h-6 text-slate-400 dark:text-slate-500" />
             <span className="text-xs font-bold uppercase tracking-wider">{t.contactUs}</span>
         </button>
      </div>

    </div>
  );
};