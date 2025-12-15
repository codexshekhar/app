import React, { useState } from 'react';
import { CartItem, User, Language } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { getStoreProducts } from '../services/storeData';
import { X, ShoppingBag, Plus, Minus, Trash2, MapPin, CreditCard, CheckCircle, Truck, ArrowLeft, Loader2, ArrowRight } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  user: User | null;
  language: Language;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  openLogin: () => void;
}

const CartDrawer: React.FC<Props> = ({ isOpen, onClose, cart, user, language, updateQuantity, clearCart, openLogin }) => {
  const [view, setView] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi'>('cod');
  
  // Checkout Form
  const [address, setAddress] = useState('');

  const t = TRANSLATIONS[language];
  const products = getStoreProducts(language);

  const getLocalizedProduct = (item: CartItem) => {
    const localized = products.find(p => p.id === item.product.id);
    return localized || item.product; // Fallback to item data if not found
  };

  const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  // Reset view when opening
  React.useEffect(() => {
    if (isOpen && view === 'success') setView('cart');
  }, [isOpen]);

  const handleCheckout = () => {
    if (!user) {
      onClose();
      openLogin();
      return;
    }
    setView('checkout');
    // Pre-fill address mostly
    if (user.district) setAddress(`${user.name}'s Farm, ${user.district}, Bihar`);
  };

  const handlePlaceOrder = () => {
    setLoading(true);
    // Simulate API
    setTimeout(() => {
      setLoading(false);
      clearCart();
      setView('success');
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      
      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* HEADER */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800">
          <div className="flex items-center gap-3">
             {view === 'checkout' && (
               <button onClick={() => setView('cart')} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full">
                 <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
               </button>
             )}
             <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
               <ShoppingBag className="w-5 h-5 text-green-600 dark:text-green-400" />
               {view === 'cart' ? t.cartTitle : view === 'checkout' ? t.checkoutTitle : t.orderSuccess}
             </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-500 dark:text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-grow overflow-y-auto p-5">
          
          {/* VIEW: CART */}
          {view === 'cart' && (
            <>
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 space-y-4">
                  <ShoppingBag className="w-16 h-16 opacity-20" />
                  <p>{t.cartEmpty}</p>
                  <button onClick={onClose} className="text-green-600 dark:text-green-400 font-bold hover:underline">{t.backToStore}</button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => {
                    const product = getLocalizedProduct(item);
                    return (
                      <div key={product.id} className="flex gap-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-3 rounded-xl shadow-sm">
                        <div className={`w-20 h-20 rounded-lg flex-shrink-0 flex items-center justify-center ${product.imageColor}`}>
                          <ShoppingBag className="w-8 h-8 opacity-50" />
                        </div>
                        <div className="flex-grow">
                          <h4 className="font-bold text-slate-800 dark:text-white line-clamp-1">{product.name}</h4>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{product.unit} • ₹{product.price}</p>
                          
                          <div className="flex items-center justify-between mt-3">
                             <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
                               <button onClick={() => updateQuantity(product.id, -1)} className="p-1 hover:bg-white dark:hover:bg-slate-600 rounded-md transition shadow-sm disabled:opacity-50 text-slate-600 dark:text-slate-300">
                                 <Minus className="w-3 h-3" />
                               </button>
                               <span className="text-xs font-bold w-4 text-center text-slate-800 dark:text-white">{item.quantity}</span>
                               <button onClick={() => updateQuantity(product.id, 1)} className="p-1 hover:bg-white dark:hover:bg-slate-600 rounded-md transition shadow-sm text-slate-600 dark:text-slate-300">
                                 <Plus className="w-3 h-3" />
                               </button>
                             </div>
                             <p className="font-bold text-slate-900 dark:text-white">₹{product.price * item.quantity}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* VIEW: CHECKOUT */}
          {view === 'checkout' && user && (
            <div className="space-y-6">
              {/* Address */}
              <div className="space-y-3">
                 <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase flex items-center gap-1">
                   <MapPin className="w-3 h-3" /> {t.shippingAddress}
                 </label>
                 <textarea 
                   value={address}
                   onChange={(e) => setAddress(e.target.value)}
                   className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-green-500 outline-none text-sm min-h-[80px] bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                   placeholder="Enter full delivery address..."
                 />
              </div>

              {/* Payment */}
              <div className="space-y-3">
                 <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase flex items-center gap-1">
                   <CreditCard className="w-3 h-3" /> {t.paymentMethod}
                 </label>
                 
                 <div 
                   onClick={() => setPaymentMethod('cod')}
                   className={`p-4 rounded-xl border-2 cursor-pointer flex items-center gap-3 transition-all ${paymentMethod === 'cod' ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}
                 >
                   <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cod' ? 'border-green-600' : 'border-slate-300 dark:border-slate-600'}`}>
                      {paymentMethod === 'cod' && <div className="w-2.5 h-2.5 bg-green-600 rounded-full" />}
                   </div>
                   <div>
                     <p className="font-bold text-slate-800 dark:text-white text-sm">{t.cod}</p>
                     <p className="text-xs text-slate-500 dark:text-slate-400">Pay cash upon delivery</p>
                   </div>
                 </div>

                 <div 
                   onClick={() => setPaymentMethod('upi')}
                   className={`p-4 rounded-xl border-2 cursor-pointer flex items-center gap-3 transition-all ${paymentMethod === 'upi' ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}
                 >
                   <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'upi' ? 'border-green-600' : 'border-slate-300 dark:border-slate-600'}`}>
                      {paymentMethod === 'upi' && <div className="w-2.5 h-2.5 bg-green-600 rounded-full" />}
                   </div>
                   <div>
                     <p className="font-bold text-slate-800 dark:text-white text-sm">{t.upi}</p>
                     <p className="text-xs text-slate-500 dark:text-slate-400">GPay, PhonePe, Paytm</p>
                   </div>
                 </div>
              </div>

              {/* Order Summary */}
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl space-y-2 text-sm">
                 <div className="flex justify-between text-slate-500 dark:text-slate-400">
                   <span>Subtotal</span>
                   <span>₹{total}</span>
                 </div>
                 <div className="flex justify-between text-slate-500 dark:text-slate-400">
                   <span>Delivery</span>
                   <span className="text-green-600 dark:text-green-400 font-bold">FREE</span>
                 </div>
                 <div className="border-t border-slate-200 dark:border-slate-700 pt-2 flex justify-between font-bold text-lg text-slate-900 dark:text-white">
                   <span>{t.total}</span>
                   <span>₹{total}</span>
                 </div>
              </div>
            </div>
          )}

          {/* VIEW: SUCCESS */}
          {view === 'success' && (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 animate-in zoom-in duration-300">
               <div className="w-24 h-24 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center text-green-600 dark:text-green-400">
                 <CheckCircle className="w-12 h-12" />
               </div>
               <div>
                 <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{t.orderSuccess}</h3>
                 <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto">{t.orderSuccessMsg}</p>
               </div>
               <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl flex items-center gap-3 text-left w-full">
                  <div className="bg-white dark:bg-slate-700 p-2 rounded-lg shadow-sm">
                    <Truck className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Estimated Delivery</p>
                    <p className="font-bold text-slate-800 dark:text-white">2-3 Days</p>
                  </div>
               </div>
               <button onClick={onClose} className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-slate-200 transition">
                 {t.close}
               </button>
            </div>
          )}

        </div>

        {/* FOOTER ACTIONS */}
        {view !== 'success' && cart.length > 0 && (
          <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
            {view === 'cart' ? (
              <div className="flex items-center gap-4">
                <div className="flex-grow">
                   <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase">{t.total}</p>
                   <p className="text-2xl font-extrabold text-slate-900 dark:text-white">₹{total}</p>
                </div>
                <button onClick={handleCheckout} className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 transition flex items-center gap-2 shadow-lg shadow-green-500/20">
                  {t.checkout} <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button 
                onClick={handlePlaceOrder} 
                disabled={loading || !address}
                className="w-full bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-700 transition flex items-center justify-center gap-2 shadow-lg shadow-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : t.placeOrder}
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default CartDrawer;