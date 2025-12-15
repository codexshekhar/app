import React, { useState } from 'react';
import { User, Language, UserRole } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { X, Lock, Phone, User as UserIcon, MapPin, Loader2, Mail, ArrowRight, KeyRound } from 'lucide-react';
import { BIHAR_DATA } from '../services/biharData';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
  language: Language;
}

// Google Logo Component
const GoogleIcon = () => (
  <svg viewBox="0 0 48 48" width="20px" height="20px" className="mr-2">
    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
  </svg>
);

const AuthModal: React.FC<Props> = ({ isOpen, onClose, onLogin, language }) => {
  const [authMethod, setAuthMethod] = useState<'email' | 'mobile'>('email');
  const [step, setStep] = useState<'input' | 'verify'>('input');
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  
  // Form State
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [district, setDistrict] = useState('Patna');
  const [role, setRole] = useState<UserRole>('farmer');

  const t = TRANSLATIONS[language];

  if (!isOpen) return null;

  // --- HANDLERS ---

  const handleGoogleLogin = () => {
    setLoading(true);
    // Simulate Google Login Delay
    setTimeout(() => {
      setLoading(false);
      onLogin({
        id: `g_${Math.random().toString(36).substr(2, 9)}`,
        name: "EcoFlow User",
        email: "user@gmail.com",
        district: district, // Default for demo
        role: role,
        isLoggedIn: true,
        profileImage: "https://lh3.googleusercontent.com/a/default-user"
      });
      onClose();
    }, 1500);
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMethod === 'mobile' && phone.length < 10) return;
    if (authMethod === 'email' && !email.includes('@')) return;

    setLoading(true);
    // Simulate API
    setTimeout(() => {
      setLoading(false);
      setStep('verify');
    }, 1200);
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API verification (Mock OTP: 1234 or Any Password for demo)
    setTimeout(() => {
      setLoading(false);
      const generatedId = Math.random().toString(36).substr(2, 9);
      
      const userData: User = {
        id: generatedId,
        name: isRegister ? name : (role === 'admin' ? 'System Admin' : role === 'seller' ? 'Kisan Store Owner' : 'Farmer User'),
        district,
        role: role,
        isLoggedIn: true
      };

      if (authMethod === 'mobile') userData.phone = phone;
      if (authMethod === 'email') userData.email = email;

      onLogin(userData);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative border border-slate-200 dark:border-slate-800">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-800 dark:to-black p-6 text-center text-white relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white bg-white/10 p-1 rounded-full transition">
            <X className="w-5 h-5" />
          </button>
          <div className="mx-auto bg-white/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-3 backdrop-blur-md border border-white/10 shadow-inner">
            <Lock className="w-7 h-7 text-green-400" />
          </div>
          <h2 className="text-xl font-bold">{isRegister ? t.registerTitle : t.authTitle}</h2>
          <p className="text-xs text-slate-400 mt-1">Access EcoFlow's scientific farming tools</p>
        </div>

        {/* Body */}
        <div className="p-6 md:p-8">
          
          {/* Role Selection (Top Level) */}
          <div className="bg-slate-50 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 flex mb-6">
             {(['farmer', 'seller', 'admin'] as UserRole[]).map((r) => (
               <button 
                key={r}
                type="button" 
                onClick={() => setRole(r)}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all capitalize ${role === r ? 'bg-white dark:bg-slate-700 text-green-600 dark:text-green-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
               >
                 {r}
               </button>
             ))}
          </div>

          {/* Social Login */}
          <button 
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white py-3 rounded-xl font-bold shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition active:scale-[0.98]"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin text-slate-400" /> : <><GoogleIcon /> Continue with Google</>}
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-slate-900 px-2 text-slate-400 font-bold tracking-wider">Or login with</span>
            </div>
          </div>

          {/* Method Tabs */}
          <div className="flex border-b border-slate-100 dark:border-slate-800 mb-6">
            <button 
              onClick={() => { setAuthMethod('email'); setStep('input'); }}
              className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-colors flex items-center justify-center gap-2 ${authMethod === 'email' ? 'border-green-500 text-green-600 dark:text-green-400' : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
            >
              <Mail className="w-4 h-4" /> Email
            </button>
            <button 
              onClick={() => { setAuthMethod('mobile'); setStep('input'); }}
              className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-colors flex items-center justify-center gap-2 ${authMethod === 'mobile' ? 'border-green-500 text-green-600 dark:text-green-400' : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
            >
              <Phone className="w-4 h-4" /> Mobile
            </button>
          </div>

          {step === 'input' ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              
              {isRegister && (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">{t.enterName}</label>
                    <div className="relative">
                       <UserIcon className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                       <input 
                        type="text" 
                        required 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-green-500 outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-all"
                        placeholder="e.g. Rahul Kumar"
                       />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">{t.selectDistrict}</label>
                    <div className="relative">
                       <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                       <select 
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-green-500 outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-all appearance-none"
                       >
                         {Object.keys(BIHAR_DATA).sort().map(d => <option key={d} value={d}>{d}</option>)}
                       </select>
                    </div>
                  </div>
                </>
              )}
              
              {authMethod === 'mobile' ? (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">{t.enterPhone}</label>
                  <div className="relative">
                     <span className="absolute left-3 top-3.5 text-slate-400 font-bold">+91</span>
                     <input 
                      type="tel" 
                      required 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-green-500 outline-none font-bold text-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-all"
                      placeholder="98765 43210"
                      maxLength={10}
                     />
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Email Address</label>
                  <div className="relative">
                     <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                     <input 
                      type="email" 
                      required 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-green-500 outline-none font-medium bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-all"
                      placeholder="farmer@example.com"
                     />
                  </div>
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-green-600 text-white py-3.5 rounded-xl font-bold text-lg hover:bg-green-700 transition flex items-center justify-center gap-2 shadow-lg shadow-green-500/30"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Continue <ArrowRight className="w-5 h-5" /></>}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-6">
              <div className="text-center">
                 <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3">
                    {authMethod === 'mobile' ? <Phone className="w-8 h-8 text-slate-400" /> : <Mail className="w-8 h-8 text-slate-400" />}
                 </div>
                 <p className="text-slate-500 dark:text-slate-400 mb-1">Verify your {authMethod}</p>
                 <p className="font-bold text-slate-900 dark:text-white text-lg">{authMethod === 'mobile' ? `+91 ${phone}` : email}</p>
                 <button type="button" onClick={() => setStep('input')} className="text-xs text-green-600 dark:text-green-400 font-bold hover:underline mt-2">Change</button>
              </div>

              {authMethod === 'mobile' ? (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase text-center block">{t.otpPlaceholder}</label>
                  <input 
                    type="text" 
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full px-4 py-4 text-center text-3xl tracking-[0.5em] border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-green-500 outline-none font-bold bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-all"
                    placeholder="••••"
                    maxLength={4}
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Enter Password</label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-green-500 outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                  <p className="text-[10px] text-right text-slate-400">Use any password for demo</p>
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-green-600 text-white py-3.5 rounded-xl font-bold text-lg hover:bg-green-700 transition flex items-center justify-center gap-2 shadow-lg shadow-green-500/30"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (authMethod === 'mobile' ? t.verifyOtp : 'Login')}
              </button>
            </form>
          )}

          {step === 'input' && (
            <div className="mt-6 text-center pt-6 border-t border-slate-100 dark:border-slate-800">
              <button 
                onClick={() => setIsRegister(!isRegister)}
                className="text-green-700 dark:text-green-400 font-bold hover:underline text-sm"
              >
                {isRegister ? t.loginSwitch : t.registerSwitch}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;