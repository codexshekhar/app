import React, { useState } from 'react';
import { ContactMessage, Language } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { EcoFlowLogo } from './Logo';
import { Mail, Phone, MapPin, Briefcase, ArrowRight, User, CheckCircle, Code, Cpu } from 'lucide-react';

interface Props {
  view: 'about' | 'contact' | 'careers';
  language: Language;
  onContactSubmit?: (msg: Omit<ContactMessage, 'id' | 'date' | 'read'>) => void;
}

export const StaticPage: React.FC<Props> = ({ view, language, onContactSubmit }) => {
  const t = TRANSLATIONS[language];
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onContactSubmit) {
      onContactSubmit({ name, email, message });
      setSubmitted(true);
      setName('');
      setEmail('');
      setMessage('');
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  if (view === 'about') {
    return (
      <div className="max-w-4xl mx-auto p-6 font-sans">
        <div className="text-center mb-16">
          <div className="inline-block p-4 bg-green-50 rounded-full mb-6">
            <EcoFlowLogo className="w-16 h-16" />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-6">{t.aboutUs}</h1>
          <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">{t.missionText}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
           <div className="bg-slate-100 rounded-3xl h-64 md:h-80 w-full overflow-hidden relative shadow-inner">
             <div className="absolute inset-0 bg-gradient-to-tr from-green-400 to-blue-500 opacity-20"></div>
             <div className="absolute inset-0 flex items-center justify-center">
               <User className="w-32 h-32 text-slate-300" />
             </div>
           </div>
           <div>
             <h2 className="text-2xl font-bold mb-4">{t.missionTitle}</h2>
             <p className="text-slate-600 mb-4 leading-relaxed">
               Founded in 2024, EcoFlow is dedicated to solving the water crisis in Bihar using cutting-edge technology. We believe that precise data can change the life of a farmer.
             </p>
             <p className="text-slate-600 leading-relaxed">
               Our team of agronomists and software engineers work day and night to bring you accurate weather forecasts and scientific irrigation schedules.
             </p>
           </div>
        </div>

        {/* FOUNDERS SECTION */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <span className="bg-slate-100 px-4 py-1.5 rounded-full text-slate-500 text-xs font-bold uppercase tracking-widest">Leadership</span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-4">Meet the Founders</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            
            {/* Shashank Shekhar */}
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 hover:-translate-y-2 transition-all duration-300 group text-center relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 to-green-500"></div>
               <div className="w-24 h-24 bg-blue-50 rounded-2xl mx-auto mb-6 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform shadow-sm">
                  <Code className="w-10 h-10" />
               </div>
               <h3 className="text-2xl font-bold text-slate-900 mb-1">Shashank Shekhar</h3>
               <p className="text-green-600 font-bold text-xs uppercase tracking-widest mb-4">Founder</p>
               <p className="text-slate-500 leading-relaxed text-sm">
                 Computer Science Student. Passionate about leveraging code and AI to solve grassroots agricultural problems in Bihar.
               </p>
            </div>

            {/* Saurabh Kumar */}
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 hover:-translate-y-2 transition-all duration-300 group text-center relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-purple-500 to-pink-500"></div>
               <div className="w-24 h-24 bg-purple-50 rounded-2xl mx-auto mb-6 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform shadow-sm">
                  <Cpu className="w-10 h-10" />
               </div>
               <h3 className="text-2xl font-bold text-slate-900 mb-1">Saurabh Kumar</h3>
               <p className="text-purple-600 font-bold text-xs uppercase tracking-widest mb-4">Co-Founder</p>
               <p className="text-slate-500 leading-relaxed text-sm">
                 Electronics & Communication (ECE) Student. Expert in hardware integration and sensor technology for smart farming solutions.
               </p>
            </div>

          </div>
        </div>
      </div>
    );
  }

  if (view === 'contact') {
    return (
      <div className="max-w-4xl mx-auto p-6 font-sans">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">{t.contactTitle}</h1>
          <p className="text-slate-600">{t.contactText}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
           <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 relative">
              {submitted ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/95 rounded-3xl animate-in fade-in">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Message Sent!</h3>
                  <p className="text-slate-500">We'll get back to you shortly.</p>
                </div>
              ) : null}
              <form onSubmit={handleSubmit} className="space-y-4">
                 <div>
                   <label className="block text-sm font-bold text-slate-700 mb-1">{t.name}</label>
                   <input required value={name} onChange={(e) => setName(e.target.value)} type="text" className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none" placeholder="Your Name" />
                 </div>
                 <div>
                   <label className="block text-sm font-bold text-slate-700 mb-1">{t.email}</label>
                   <input required value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none" placeholder="email@example.com" />
                 </div>
                 <div>
                   <label className="block text-sm font-bold text-slate-700 mb-1">{t.message}</label>
                   <textarea required value={message} onChange={(e) => setMessage(e.target.value)} className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none h-32" placeholder="How can we help?" />
                 </div>
                 <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition">
                   {t.sendMsg}
                 </button>
              </form>
           </div>

           <div className="space-y-6">
              <div className="bg-blue-50 p-6 rounded-2xl flex items-start gap-4">
                 <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                   <MapPin className="w-6 h-6" />
                 </div>
                 <div>
                   <h3 className="font-bold text-slate-900 mb-1">{t.address}</h3>
                   <p className="text-slate-600 text-sm">{t.addressText}</p>
                 </div>
              </div>
              <div className="bg-green-50 p-6 rounded-2xl flex items-start gap-4">
                 <div className="bg-green-100 p-3 rounded-full text-green-600">
                   <Phone className="w-6 h-6" />
                 </div>
                 <div>
                   <h3 className="font-bold text-slate-900 mb-1">Phone</h3>
                   <p className="text-slate-600 text-sm">+91 98765 43210</p>
                 </div>
              </div>
              <div className="bg-amber-50 p-6 rounded-2xl flex items-start gap-4">
                 <div className="bg-amber-100 p-3 rounded-full text-amber-600">
                   <Mail className="w-6 h-6" />
                 </div>
                 <div>
                   <h3 className="font-bold text-slate-900 mb-1">Email</h3>
                   <p className="text-slate-600 text-sm">support@ecoflow.in</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    );
  }

  if (view === 'careers') {
    return (
      <div className="max-w-4xl mx-auto p-6 font-sans">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-6">{t.careersTitle}</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">{t.careersText}</p>
        </div>

        <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
           <Briefcase className="w-6 h-6 text-green-600" /> {t.openPositions}
        </h2>

        <div className="space-y-4">
           {['Agronomist (Senior)', 'Field Sales Manager', 'React Developer', 'Customer Support Executive'].map((job, i) => (
             <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-lg transition flex items-center justify-between group">
                <div>
                   <h3 className="font-bold text-lg text-slate-900 group-hover:text-green-600 transition-colors">{job}</h3>
                   <p className="text-slate-500 text-sm">Patna, Bihar • Full-time</p>
                </div>
                <button className="px-5 py-2 rounded-full border border-slate-300 text-slate-600 font-bold text-sm group-hover:bg-green-600 group-hover:text-white group-hover:border-green-600 transition">
                  {t.applyNow}
                </button>
             </div>
           ))}
        </div>
      </div>
    );
  }

  return null;
};