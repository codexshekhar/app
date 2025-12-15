import React, { useEffect, useState } from 'react';
import { User, Order, SavedField, Language } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { User as UserIcon, MapPin, Package, Clock, CheckCircle, Leaf, Droplets, Zap, Mail, Phone } from 'lucide-react';
import { getUserUsage } from '../services/geminiService';

interface Props {
  user: User;
  orders: Order[];
  savedFields: SavedField[];
  language: Language;
}

const UserDashboard: React.FC<Props> = ({ user, orders, savedFields, language }) => {
  const t = TRANSLATIONS[language];
  const myOrders = orders.filter(o => o.userId === user.id);
  const [usage, setUsage] = useState({ count: 0, limit: 50 });

  useEffect(() => {
    // Fetch usage on mount
    const data = getUserUsage();
    setUsage(data);
  }, []);

  const usagePercent = Math.min((usage.count / usage.limit) * 100, 100);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 font-sans">
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-8 flex items-center gap-3">
        <UserIcon className="w-8 h-8 text-green-600 dark:text-green-400" /> {t.navProfile}
      </h1>

      <div className="grid md:grid-cols-3 gap-8">
        
        {/* Profile Card */}
        <div className="space-y-6 h-fit">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
             <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4 overflow-hidden border-4 border-green-50 dark:border-slate-700">
                   {user.profileImage ? (
                     <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                   ) : (
                     <UserIcon className="w-10 h-10 text-green-700 dark:text-green-400" />
                   )}
                </div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">{user.name}</h2>
                <div className="flex flex-col gap-1 items-center mt-1">
                  {user.phone && <p className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5 text-sm"><Phone className="w-3 h-3" /> +91 {user.phone}</p>}
                  {user.email && <p className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5 text-sm"><Mail className="w-3 h-3" /> {user.email}</p>}
                </div>
                
                <div className="mt-6 w-full pt-6 border-t border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400 justify-center">
                    <MapPin className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                    <span>{user.district}, Bihar</span>
                  </div>
                </div>
             </div>
          </div>

          {/* AI Quota Card */}
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/30 dark:to-blue-900/30 rounded-3xl p-6 border border-indigo-100 dark:border-indigo-800">
             <h3 className="font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-2 mb-4">
               <Zap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> Daily AI Quota
             </h3>
             <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                   <span className="text-slate-600 dark:text-slate-400">Used Today</span>
                   <span className={`font-bold ${usage.count >= usage.limit ? 'text-red-500 dark:text-red-400' : 'text-indigo-600 dark:text-indigo-400'}`}>
                     {usage.count} / {usage.limit}
                   </span>
                </div>
                <div className="w-full bg-white dark:bg-slate-800 h-2.5 rounded-full overflow-hidden border border-indigo-100 dark:border-indigo-900">
                   <div 
                      className={`h-full rounded-full transition-all duration-500 ${usage.count >= usage.limit ? 'bg-red-500' : 'bg-indigo-500'}`}
                      style={{ width: `${usagePercent}%` }}
                   ></div>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 pt-2">
                   {usage.count >= usage.limit 
                     ? "Daily limit reached. Using Offline Mode." 
                     : "Premium AI features active."}
                </p>
             </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="md:col-span-2 space-y-8">
          
          {/* Saved Fields */}
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <Leaf className="w-5 h-5 text-green-600 dark:text-green-400" /> {language === 'hi' ? 'सहेजे गए खेत' : 'Saved Fields'}
            </h3>
            {savedFields.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {savedFields.map(field => (
                  <div key={field.id} className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-slate-800 dark:text-white">{field.name}</h4>
                      <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold px-2 py-1 rounded-full">{field.cropType}</span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{field.block}, {field.district}</p>
                    <button className="w-full py-2 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-bold rounded-lg text-sm hover:bg-green-100 dark:hover:bg-green-900/50 transition flex items-center justify-center gap-2">
                       <Droplets className="w-4 h-4" /> {language === 'hi' ? 'गणना करें' : 'Calculate'}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 text-center text-slate-500 dark:text-slate-400">
                No saved fields yet.
              </div>
            )}
          </div>

          {/* Orders */}
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" /> {language === 'hi' ? 'मेरे ऑर्डर' : 'My Orders'}
            </h3>
            {myOrders.length > 0 ? (
               <div className="space-y-4">
                 {myOrders.map(order => (
                   <div key={order.id} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
                      <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-700 pb-4 mb-4">
                         <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">Order #{order.id}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{order.date.toLocaleDateString()}</p>
                         </div>
                         <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                           order.status === 'delivered' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                         }`}>
                           {order.status}
                         </div>
                      </div>
                      <div className="space-y-2 mb-4">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                             <span className="text-slate-700 dark:text-slate-300">{item.product.name} <span className="text-slate-400">x{item.quantity}</span></span>
                             <span className="font-medium text-slate-900 dark:text-white">₹{item.product.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between items-center pt-2">
                         <span className="text-sm font-bold text-slate-500 dark:text-slate-400">Total Amount</span>
                         <span className="text-xl font-extrabold text-slate-900 dark:text-white">₹{order.total}</span>
                      </div>
                   </div>
                 ))}
               </div>
            ) : (
              <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 text-center text-slate-500 dark:text-slate-400">
                No orders yet.
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default UserDashboard;