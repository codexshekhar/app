import React, { useState, useEffect } from 'react';
import WaterCalculator from './components/WaterCalculator';
import FarmStore from './components/FarmStore';
import WeatherForecast from './components/WeatherForecast';
import LandingPage from './components/LandingPage';
import AuthModal from './components/AuthModal';
import CartDrawer from './components/CartDrawer';
import AdminDashboard from './components/AdminDashboard';
import SellerDashboard from './components/SellerDashboard';
import UserDashboard from './components/UserDashboard';
import { StaticPage } from './components/StaticPages';
import { SavedField, CropType, Language, User, CartItem, Product, Order, AiUsageStats, ContactMessage } from './types';
import { Languages, Calculator, ShoppingBag, CloudSun, User as UserIcon, LogOut, Menu, LayoutDashboard, Home, Moon, Sun } from 'lucide-react';
import { TRANSLATIONS } from './utils/translations';
import { EcoFlowLogo } from './components/Logo';
import { getStoreProducts } from './services/storeData';
import { HomeMenu } from './components/HomeMenu';
import { PlantDoctor } from './components/PlantDoctor';
import AiChatbot from './components/AiChatbot';

// Updated ViewState to include new pages
type ViewState = 'landing' | 'calculator' | 'store' | 'weather' | 'about' | 'contact' | 'careers' | 'admin-dashboard' | 'seller-dashboard' | 'user-profile' | 'home' | 'plant-doctor';

const App: React.FC = () => {
  // --- STATE ---
  const [language, setLanguage] = useState<Language>('en');
  const [currentView, setCurrentView] = useState<ViewState>('landing');
  const [darkMode, setDarkMode] = useState(false);
  
  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingView, setPendingView] = useState<ViewState | null>(null);

  // Data State (Lifted up for sharing between panels)
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  // Initialize with default products but allow adding more
  const [products, setProducts] = useState<Product[]>([]);

  // Admin & Analytics State
  const [aiUsage, setAiUsage] = useState<AiUsageStats>({
    agronomistAdvice: 120, // Initial Mock Data
    deepAnalysis: 45,
    marketInsights: 80,
    nearbyResources: 30,
    plantDoctor: 25 // Added new feature metric
  });
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([
    { id: 'm1', name: 'Rohan Singh', email: 'rohan@gmail.com', message: 'I need help with maize irrigation schedules.', date: new Date('2024-03-10'), read: true }
  ]);

  // Initialize products once language is set or on mount
  React.useEffect(() => {
    if (products.length === 0) {
      setProducts(getStoreProducts('en')); // Default to English base data
    }
  }, []);

  // Dark Mode Logic
  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Mock Saved Fields
  const [savedFields] = useState<SavedField[]>([
    { id: '1', name: 'Banka Maize Field', district: 'Banka', block: 'Katoriya', cropType: CropType.CORN },
    { id: '2', name: 'Patna Wheat Farm', district: 'Patna', block: 'Bihta', cropType: CropType.WHEAT }
  ]);

  const t = TRANSLATIONS[language];

  // --- ACTIONS ---
  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'hi' : 'en');
  };

  const handleNavigation = (view: ViewState) => {
    // Restrict authenticated views
    if ((view === 'calculator' || view === 'weather' || view === 'home' || view === 'plant-doctor') && !user) {
      setPendingView(view);
      setShowAuthModal(true);
      return;
    }
    
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    
    // Redirect based on role
    if (newUser.role === 'admin') {
      setCurrentView('admin-dashboard');
    } else if (newUser.role === 'seller') {
      setCurrentView('seller-dashboard');
    } else {
      // Farmer/User - Redirect to Home Menu
      if (pendingView) {
        setCurrentView(pendingView);
        setPendingView(null);
      } else {
        setCurrentView('home'); 
      }
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('landing');
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === id) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const handleCheckout = () => {
     // Create order
     const newOrder: Order = {
       id: Math.random().toString(36).substr(2, 6).toUpperCase(),
       userId: user?.id || 'guest',
       userName: user?.name || 'Guest',
       items: [...cart],
       total: cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0),
       date: new Date(),
       status: 'pending',
       address: user ? `${user.district}, Bihar` : 'Bihar'
     };
     setOrders(prev => [newOrder, ...prev]);
     setCart([]);
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Analytics Handlers
  const trackAiUsage = (feature: keyof AiUsageStats) => {
    setAiUsage(prev => ({
      ...prev,
      [feature]: prev[feature] + 1
    }));
  };

  const handleContactSubmit = (msg: Omit<ContactMessage, 'id' | 'date' | 'read'>) => {
    const newMessage: ContactMessage = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date(),
      read: false,
      ...msg
    };
    setContactMessages(prev => [newMessage, ...prev]);
  };

  // --- RENDER LOGIC ---

  // If on landing page, render only the Landing Page component
  if (currentView === 'landing') {
    return (
      <>
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
          onLogin={handleLogin}
          language={language}
        />
        <LandingPage 
          onGetStarted={() => handleNavigation('home')} 
          language={language} 
          toggleLanguage={toggleLanguage} 
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />
      </>
    );
  }

  // Main App Shell
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans text-slate-900 dark:text-slate-50 transition-colors duration-300">
      
      {/* GLOBAL CHATBOT (Visible on all pages when logged in, or always if desired) */}
      {user && <AiChatbot language={language} />}

      {/* MODALS */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        onLogin={handleLogin}
        language={language}
      />

      <CartDrawer 
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        cart={cart}
        user={user}
        language={language}
        updateQuantity={updateQuantity}
        clearCart={handleCheckout} // When checkout happens in drawer, it calls this
        openLogin={() => setShowAuthModal(true)}
      />

      {/* Navigation Bar */}
      {/* Conditionally hide standard nav for Admin Dashboard to give it full screen feel, or keep it consistent */}
      <nav className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 shadow-sm transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
          
          {/* Brand */}
          <div className="flex items-center justify-between w-full md:w-auto">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavigation(user ? 'home' : 'landing')}>
              <div className="bg-white dark:bg-slate-800 p-1 rounded-xl shadow-lg shadow-green-500/10 border border-slate-100 dark:border-slate-700">
                <EcoFlowLogo className="w-10 h-10" />
              </div>
              <div>
                 <span className="font-bold text-xl tracking-tight text-slate-800 dark:text-white block leading-tight">EcoFlow</span>
                 <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">Bihar Edition</span>
              </div>
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center gap-2 md:hidden">
              <button 
                onClick={toggleDarkMode}
                className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-300"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button onClick={() => setShowCart(true)} className="relative p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-300">
                 <ShoppingBag className="w-5 h-5" />
                 {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{cartCount}</span>}
              </button>
              <button 
                onClick={() => user ? handleLogout() : setShowAuthModal(true)} 
                className={`p-2 rounded-lg ${user ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
              >
                <UserIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Desktop Controls */}
          <div className="hidden md:flex items-center gap-4">
            
            {/* View Toggles - Only show main nav for farmers/guests */}
            {(!user || user.role === 'farmer') && (
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-full border border-slate-200 dark:border-slate-700">
                {user && (
                   <button
                    onClick={() => handleNavigation('home')}
                    className={`px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 transition-all
                      ${currentView === 'home' ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
                  >
                    <Home className="w-4 h-4" /> Home
                  </button>
                )}
                <button
                  onClick={() => handleNavigation('calculator')}
                  className={`px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 transition-all
                    ${currentView === 'calculator' ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
                >
                  <Calculator className="w-4 h-4" /> {t.navHome}
                </button>
                <button
                  onClick={() => handleNavigation('weather')}
                  className={`px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 transition-all
                    ${currentView === 'weather' ? 'bg-white dark:bg-slate-700 text-sky-700 dark:text-sky-300 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
                >
                  <CloudSun className="w-4 h-4" /> {t.navWeather}
                </button>
                <button
                  onClick={() => handleNavigation('store')}
                  className={`px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 transition-all
                    ${currentView === 'store' ? 'bg-white dark:bg-slate-700 text-green-700 dark:text-green-300 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
                >
                  <ShoppingBag className="w-4 h-4" /> {t.navStore}
                </button>
              </div>
            )}
            
            {/* Admin/Seller Nav Links */}
            {user && user.role === 'admin' && (
               <button onClick={() => setCurrentView('admin-dashboard')} className={`text-sm font-bold ${currentView === 'admin-dashboard' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'}`}>Admin Panel</button>
            )}
            {user && user.role === 'seller' && (
               <button onClick={() => setCurrentView('seller-dashboard')} className={`text-sm font-bold ${currentView === 'seller-dashboard' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`}>Seller Panel</button>
            )}

            <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-700"></div>

            {/* User & Cart */}
            <div className="flex items-center gap-3">
               {/* Dark Mode Toggle */}
               <button 
                 onClick={toggleDarkMode}
                 className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 transition"
               >
                 {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
               </button>

               {(!user || user.role === 'farmer') && (
                 <button 
                   onClick={() => setShowCart(true)} 
                   className="relative group p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
                 >
                    <ShoppingBag className="w-5 h-5 text-slate-600 dark:text-slate-300 group-hover:text-green-600 dark:group-hover:text-green-400" />
                    {cartCount > 0 && <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">{cartCount}</span>}
                 </button>
               )}

               {user ? (
                 <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-700">
                    <button 
                      onClick={() => {
                        if (user.role === 'admin') setCurrentView('admin-dashboard');
                        else if (user.role === 'seller') setCurrentView('seller-dashboard');
                        else setCurrentView('user-profile');
                      }}
                      className="text-right hidden lg:block hover:opacity-80"
                    >
                       <p className="text-xs text-slate-400 font-bold uppercase">{user.role}</p>
                       <p className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-none">{user.name}</p>
                    </button>
                    <button onClick={handleLogout} className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 rounded-lg text-slate-600 dark:text-slate-400 transition" title={t.logout}>
                       <LogOut className="w-4 h-4" />
                    </button>
                 </div>
               ) : (
                 <button 
                  onClick={() => setShowAuthModal(true)}
                  className="bg-slate-900 dark:bg-slate-700 text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-slate-800 dark:hover:bg-slate-600 transition shadow-sm flex items-center gap-2"
                 >
                   <UserIcon className="w-4 h-4" /> {t.navLogin}
                 </button>
               )}
            </div>

            {/* Language Toggle */}
            <button 
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-green-500 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:text-green-700 dark:hover:text-green-400"
            >
              <Languages className="w-4 h-4" />
              {language === 'en' ? 'EN' : 'HI'}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow pt-8 pb-12">
        {currentView === 'home' && user && (
          <HomeMenu user={user} language={language} onNavigate={handleNavigation} />
        )}
        {currentView === 'plant-doctor' && (
          <PlantDoctor language={language} onAiUsage={trackAiUsage} mode="page" />
        )}
        {currentView === 'calculator' && (
          <WaterCalculator 
            savedFields={savedFields}
            language={language}
            onAiUsage={trackAiUsage}
          />
        )}
        {currentView === 'weather' && (
          <WeatherForecast language={language} />
        )}
        {currentView === 'store' && (
          <FarmStore language={language} onAddToCart={addToCart} />
        )}
        {(currentView === 'about' || currentView === 'contact' || currentView === 'careers') && (
          <StaticPage 
            view={currentView} 
            language={language} 
            onContactSubmit={handleContactSubmit}
          />
        )}
        
        {/* NEW VIEWS */}
        {currentView === 'admin-dashboard' && user?.role === 'admin' && (
           <AdminDashboard 
             users={[user]} 
             orders={orders} 
             products={products}
             aiUsage={aiUsage}
             messages={contactMessages}
             onUpdateOrderStatus={(id, status) => setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))}
           />
        )}
        {currentView === 'seller-dashboard' && user?.role === 'seller' && (
           <SellerDashboard 
             user={user}
             products={products}
             orders={orders}
             onAddProduct={(p) => setProducts([...products, p])}
             onDeleteProduct={(id) => setProducts(products.filter(p => p.id !== id))}
           />
        )}
        {currentView === 'user-profile' && user && (
           <UserDashboard 
             user={user}
             orders={orders}
             savedFields={savedFields}
             language={language}
           />
        )}
      </main>

      {/* Footer (Hide on admin/seller dashboards for cleaner UI) */}
      {currentView !== 'admin-dashboard' && currentView !== 'seller-dashboard' && (
        <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pt-16 pb-8 text-center transition-colors duration-300">
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex justify-center items-center gap-2 mb-8">
               <EcoFlowLogo className="w-8 h-8 opacity-80" />
               <span className="font-extrabold text-xl tracking-tight text-slate-800 dark:text-white">EcoFlow</span>
            </div>

            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-10 text-sm font-semibold text-slate-600 dark:text-slate-400">
              <button onClick={() => handleNavigation('about')} className="hover:text-green-600 dark:hover:text-green-400 transition">{t.aboutUs}</button>
              <button onClick={() => handleNavigation('contact')} className="hover:text-green-600 dark:hover:text-green-400 transition">{t.contactUs}</button>
              <button onClick={() => handleNavigation('careers')} className="hover:text-green-600 dark:hover:text-green-400 transition">{t.careers}</button>
              <button onClick={() => handleNavigation('landing')} className="hover:text-green-600 dark:hover:text-green-400 transition">Home</button>
            </div>

            <div className="w-full h-px bg-slate-100 dark:bg-slate-800 mb-8"></div>

            <p className="text-base font-semibold text-slate-800 dark:text-slate-200">EcoFlow Science Fair Project</p>
            <p className="text-slate-500 dark:text-slate-500 text-sm mt-1">{t.footerSpecial}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-slate-400 dark:text-slate-600 uppercase tracking-widest font-medium">
              <span>Hargreaves Equation</span>
              <span>Gemini AI</span>
              <span>Open-Meteo</span>
              <span>Kisan Kendra</span>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;