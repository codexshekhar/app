import React, { useState } from 'react';
import { User, Order, Product, AiUsageStats, ContactMessage } from '../types';
import { Shield, Users, ShoppingCart, Settings, Check, X, Search, Activity, MessageSquare, BrainCircuit, BarChart3, Mail, Phone } from 'lucide-react';

interface Props {
  users: User[]; // In real app, this would be fetched
  orders: Order[];
  products: Product[];
  aiUsage?: AiUsageStats;
  messages?: ContactMessage[];
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
}

const AdminDashboard: React.FC<Props> = ({ users: initialUsers, orders, products, onUpdateOrderStatus, aiUsage, messages = [] }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'users' | 'messages'>('overview');
  
  // Mock users for display if list is empty
  const users = initialUsers.length > 0 ? initialUsers : [
     { id: '1', name: 'Ramesh Kumar', phone: '9876543210', district: 'Patna', role: 'farmer', isLoggedIn: false },
     { id: '2', name: 'Sita Devi', phone: '9123456780', district: 'Gaya', role: 'farmer', isLoggedIn: false },
     { id: '3', name: 'Kisan Store', email: 'store@kisan.com', district: 'Patna', role: 'seller', isLoggedIn: false }
  ];

  // Helper for charts
  const getMaxUsage = () => {
    if (!aiUsage) return 100;
    return Math.max(
      aiUsage.agronomistAdvice, 
      aiUsage.deepAnalysis, 
      aiUsage.marketInsights, 
      aiUsage.nearbyResources, 
      aiUsage.plantDoctor,
      1
    );
  };

  const getBarHeight = (val: number) => {
    const max = getMaxUsage();
    return `${(val / max) * 100}%`;
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
       
       {/* Sidebar */}
       <div className="w-64 bg-slate-900 text-white p-6 hidden md:flex flex-col">
          <div className="flex items-center gap-3 mb-10">
             <div className="bg-indigo-500 p-2 rounded-lg">
                <Shield className="w-6 h-6 text-white" />
             </div>
             <span className="font-bold text-xl tracking-tight">AdminPanel</span>
          </div>
          
          <nav className="space-y-2 flex-grow">
             <button 
               onClick={() => setActiveTab('overview')}
               className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'overview' ? 'bg-indigo-600 shadow-lg shadow-indigo-500/30' : 'text-slate-400 hover:bg-white/10'}`}
             >
                <Activity className="w-5 h-5" /> Overview
             </button>
             <button 
               onClick={() => setActiveTab('orders')}
               className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'orders' ? 'bg-indigo-600 shadow-lg shadow-indigo-500/30' : 'text-slate-400 hover:bg-white/10'}`}
             >
                <ShoppingCart className="w-5 h-5" /> Orders
             </button>
             <button 
               onClick={() => setActiveTab('users')}
               className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'users' ? 'bg-indigo-600 shadow-lg shadow-indigo-500/30' : 'text-slate-400 hover:bg-white/10'}`}
             >
                <Users className="w-5 h-5" /> Users
             </button>
             <button 
               onClick={() => setActiveTab('messages')}
               className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'messages' ? 'bg-indigo-600 shadow-lg shadow-indigo-500/30' : 'text-slate-400 hover:bg-white/10'}`}
             >
                <MessageSquare className="w-5 h-5" /> Messages
                {messages.length > 0 && <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-auto">{messages.length}</span>}
             </button>
          </nav>
          
          <div className="mt-auto pt-6 border-t border-white/10">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold">A</div>
                <div>
                   <p className="text-sm font-bold">System Admin</p>
                   <p className="text-xs text-indigo-300">Super User</p>
                </div>
             </div>
          </div>
       </div>

       {/* Main Content */}
       <div className="flex-grow p-6 md:p-10 overflow-y-auto">
          
          {activeTab === 'overview' && (
             <div className="space-y-8 animate-in fade-in duration-500">
                <h2 className="text-2xl font-bold text-slate-900">System Overview</h2>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                      <p className="text-sm font-bold text-slate-400 uppercase">Total Users</p>
                      <p className="text-3xl font-extrabold text-slate-900 mt-2">{users.length}</p>
                   </div>
                   <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                      <p className="text-sm font-bold text-slate-400 uppercase">Active Orders</p>
                      <p className="text-3xl font-extrabold text-slate-900 mt-2">{orders.filter(o => o.status !== 'delivered').length}</p>
                   </div>
                   <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                      <p className="text-sm font-bold text-slate-400 uppercase">Total AI Calls</p>
                      <p className="text-3xl font-extrabold text-slate-900 mt-2 text-indigo-600">
                        {aiUsage ? (aiUsage.agronomistAdvice + aiUsage.deepAnalysis + aiUsage.marketInsights + aiUsage.nearbyResources + aiUsage.plantDoctor) : 0}
                      </p>
                   </div>
                </div>

                {/* AI ANALYTICS SECTION */}
                <div className="grid md:grid-cols-2 gap-6">
                   {/* BAR CHART */}
                   <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col">
                      <div className="flex items-center justify-between mb-6">
                         <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2"><BarChart3 className="w-5 h-5 text-indigo-600" /> AI Usage By Feature</h3>
                      </div>
                      
                      {aiUsage ? (
                        <div className="flex-grow flex items-end justify-between gap-2 h-48 pt-4 pb-2">
                           <div className="flex flex-col items-center gap-2 flex-1 h-full justify-end group">
                              <div className="font-bold text-slate-800 text-sm mb-1">{aiUsage.agronomistAdvice}</div>
                              <div className="w-full bg-green-100 rounded-t-lg relative group-hover:bg-green-200 transition-all" style={{ height: getBarHeight(aiUsage.agronomistAdvice) }}>
                                <div className="absolute inset-x-0 bottom-0 top-0 bg-green-500 opacity-20 rounded-t-lg"></div>
                              </div>
                              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">Basic</div>
                           </div>

                           <div className="flex flex-col items-center gap-2 flex-1 h-full justify-end group">
                              <div className="font-bold text-slate-800 text-sm mb-1">{aiUsage.deepAnalysis}</div>
                              <div className="w-full bg-indigo-100 rounded-t-lg relative group-hover:bg-indigo-200 transition-all" style={{ height: getBarHeight(aiUsage.deepAnalysis) }}>
                                 <div className="absolute inset-x-0 bottom-0 top-0 bg-indigo-500 opacity-20 rounded-t-lg"></div>
                              </div>
                              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">Deep</div>
                           </div>

                           <div className="flex flex-col items-center gap-2 flex-1 h-full justify-end group">
                              <div className="font-bold text-slate-800 text-sm mb-1">{aiUsage.marketInsights}</div>
                              <div className="w-full bg-amber-100 rounded-t-lg relative group-hover:bg-amber-200 transition-all" style={{ height: getBarHeight(aiUsage.marketInsights) }}>
                                 <div className="absolute inset-x-0 bottom-0 top-0 bg-amber-500 opacity-20 rounded-t-lg"></div>
                              </div>
                              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">Market</div>
                           </div>

                           <div className="flex flex-col items-center gap-2 flex-1 h-full justify-end group">
                              <div className="font-bold text-slate-800 text-sm mb-1">{aiUsage.nearbyResources}</div>
                              <div className="w-full bg-emerald-100 rounded-t-lg relative group-hover:bg-emerald-200 transition-all" style={{ height: getBarHeight(aiUsage.nearbyResources) }}>
                                 <div className="absolute inset-x-0 bottom-0 top-0 bg-emerald-500 opacity-20 rounded-t-lg"></div>
                              </div>
                              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">Resources</div>
                           </div>

                           <div className="flex flex-col items-center gap-2 flex-1 h-full justify-end group">
                              <div className="font-bold text-slate-800 text-sm mb-1">{aiUsage.plantDoctor}</div>
                              <div className="w-full bg-pink-100 rounded-t-lg relative group-hover:bg-pink-200 transition-all" style={{ height: getBarHeight(aiUsage.plantDoctor) }}>
                                 <div className="absolute inset-x-0 bottom-0 top-0 bg-pink-500 opacity-20 rounded-t-lg"></div>
                              </div>
                              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">Doctor</div>
                           </div>
                        </div>
                      ) : (
                        <div className="h-48 flex items-center justify-center text-slate-400">No data available</div>
                      )}
                   </div>

                   {/* PIE CHART VISUALIZATION (Using CSS Conic Gradient) */}
                   <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                      <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2 mb-6"><BrainCircuit className="w-5 h-5 text-indigo-600" /> Usage Distribution</h3>
                      
                      {aiUsage ? (
                        <div className="flex items-center gap-8">
                           <div className="relative w-40 h-40 rounded-full flex-shrink-0" style={{
                             background: `conic-gradient(
                               #22c55e 0% ${(aiUsage.agronomistAdvice / getMaxUsage()) * 20}%,
                               #6366f1 ${(aiUsage.agronomistAdvice / getMaxUsage()) * 20}% ${(aiUsage.agronomistAdvice / getMaxUsage()) * 20 + (aiUsage.deepAnalysis / getMaxUsage()) * 20}%,
                               #f59e0b ${(aiUsage.agronomistAdvice / getMaxUsage()) * 20 + (aiUsage.deepAnalysis / getMaxUsage()) * 20}% ${(aiUsage.agronomistAdvice / getMaxUsage()) * 20 + (aiUsage.deepAnalysis / getMaxUsage()) * 20 + (aiUsage.marketInsights / getMaxUsage()) * 20}%,
                               #10b981 ${(aiUsage.agronomistAdvice / getMaxUsage()) * 20 + (aiUsage.deepAnalysis / getMaxUsage()) * 20 + (aiUsage.marketInsights / getMaxUsage()) * 20}% ${(aiUsage.agronomistAdvice / getMaxUsage()) * 20 + (aiUsage.deepAnalysis / getMaxUsage()) * 20 + (aiUsage.marketInsights / getMaxUsage()) * 20 + (aiUsage.nearbyResources / getMaxUsage()) * 20}%,
                               #ec4899 ${(aiUsage.agronomistAdvice / getMaxUsage()) * 20 + (aiUsage.deepAnalysis / getMaxUsage()) * 20 + (aiUsage.marketInsights / getMaxUsage()) * 20 + (aiUsage.nearbyResources / getMaxUsage()) * 20}% 100%
                             )`
                           }}>
                             <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center flex-col">
                                <span className="text-2xl font-extrabold text-slate-800">{aiUsage.agronomistAdvice + aiUsage.deepAnalysis + aiUsage.marketInsights + aiUsage.nearbyResources + aiUsage.plantDoctor}</span>
                                <span className="text-[10px] uppercase font-bold text-slate-400">Total Calls</span>
                             </div>
                           </div>
                           
                           <div className="space-y-3">
                              <div className="flex items-center gap-2 text-sm font-medium">
                                <div className="w-3 h-3 rounded-full bg-green-500"></div> Agronomist Advice
                              </div>
                              <div className="flex items-center gap-2 text-sm font-medium">
                                <div className="w-3 h-3 rounded-full bg-indigo-500"></div> Deep Analysis
                              </div>
                              <div className="flex items-center gap-2 text-sm font-medium">
                                <div className="w-3 h-3 rounded-full bg-amber-500"></div> Market Insights
                              </div>
                              <div className="flex items-center gap-2 text-sm font-medium">
                                <div className="w-3 h-3 rounded-full bg-emerald-500"></div> Nearby Resources
                              </div>
                              <div className="flex items-center gap-2 text-sm font-medium">
                                <div className="w-3 h-3 rounded-full bg-pink-500"></div> Plant Doctor
                              </div>
                           </div>
                        </div>
                      ) : (
                        <div className="h-40 flex items-center justify-center text-slate-400">No data</div>
                      )}
                   </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                   <h3 className="font-bold text-lg text-slate-800 mb-4">Recent Activity</h3>
                   <div className="space-y-4">
                      {orders.slice(0, 3).map(order => (
                         <div key={order.id} className="flex items-center justify-between border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                            <div>
                               <p className="font-bold text-slate-800">New Order #{order.id}</p>
                               <p className="text-sm text-slate-500">₹{order.total} • {order.items.length} Items</p>
                            </div>
                            <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded">{order.status}</span>
                         </div>
                      ))}
                      {orders.length === 0 && <p className="text-slate-400">No recent activity.</p>}
                   </div>
                </div>
             </div>
          )}

          {activeTab === 'messages' && (
             <div className="space-y-6 animate-in fade-in duration-500">
                <h2 className="text-2xl font-bold text-slate-900">Support Inbox</h2>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                   <div className="divide-y divide-slate-100">
                      {messages.map(msg => (
                         <div key={msg.id} className="p-6 hover:bg-slate-50 transition">
                            <div className="flex justify-between items-start mb-2">
                               <h4 className="font-bold text-slate-800">{msg.name} <span className="text-slate-400 font-normal text-sm">&lt;{msg.email}&gt;</span></h4>
                               <span className="text-xs text-slate-400">{msg.date.toLocaleDateString()}</span>
                            </div>
                            <p className="text-slate-600">{msg.message}</p>
                         </div>
                      ))}
                      {messages.length === 0 && (
                         <div className="p-10 text-center text-slate-400">
                            <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-20" />
                            No messages yet.
                         </div>
                      )}
                   </div>
                </div>
             </div>
          )}

          {activeTab === 'users' && (
             <div className="space-y-6 animate-in fade-in duration-500">
                <div className="flex justify-between items-center">
                   <h2 className="text-2xl font-bold text-slate-900">User Management</h2>
                   <div className="bg-white border border-slate-200 rounded-lg flex items-center px-3 py-2">
                      <Search className="w-4 h-4 text-slate-400 mr-2" />
                      <input placeholder="Search users..." className="outline-none text-sm" />
                   </div>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                   <table className="w-full text-left">
                      <thead className="bg-slate-50 border-b border-slate-200">
                         <tr>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase">Name</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase">Role</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase">District</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                         </tr>
                      </thead>
                      <tbody>
                         {users.map((u: any) => (
                            <tr key={u.id} className="border-b border-slate-50 last:border-0">
                               <td className="p-4 font-bold text-slate-700">
                                 {u.name}
                                 <br/>
                                 <span className="text-xs font-normal text-slate-400 flex items-center gap-1">
                                   {u.email ? <><Mail className="w-3 h-3" /> {u.email}</> : <><Phone className="w-3 h-3" /> {u.phone}</>}
                                 </span>
                               </td>
                               <td className="p-4"><span className={`px-2 py-1 rounded text-xs font-bold uppercase ${u.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : u.role === 'seller' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>{u.role}</span></td>
                               <td className="p-4 text-slate-600">{u.district}</td>
                               <td className="p-4"><span className="text-green-600 text-xs font-bold">Active</span></td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             </div>
          )}

          {activeTab === 'orders' && (
             <div className="space-y-6 animate-in fade-in duration-500">
                <h2 className="text-2xl font-bold text-slate-900">Global Orders</h2>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                   <table className="w-full text-left">
                      <thead className="bg-slate-50 border-b border-slate-200">
                         <tr>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase">Order ID</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase">Customer</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase">Total</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase text-right">Action</th>
                         </tr>
                      </thead>
                      <tbody>
                         {orders.map(order => (
                            <tr key={order.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                               <td className="p-4 font-mono text-sm text-slate-600">#{order.id}</td>
                               <td className="p-4 font-bold text-slate-700">{order.userName}</td>
                               <td className="p-4 font-bold text-green-700">₹{order.total}</td>
                               <td className="p-4">
                                  <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${order.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                     {order.status}
                                  </span>
                               </td>
                               <td className="p-4 text-right">
                                  {order.status !== 'delivered' && (
                                     <button 
                                      onClick={() => onUpdateOrderStatus(order.id, 'delivered')}
                                      className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded hover:bg-indigo-100 font-bold"
                                     >
                                        Mark Delivered
                                     </button>
                                  )}
                               </td>
                            </tr>
                         ))}
                         {orders.length === 0 && (
                            <tr><td colSpan={5} className="p-8 text-center text-slate-400">No orders found.</td></tr>
                         )}
                      </tbody>
                   </table>
                </div>
             </div>
          )}

       </div>
    </div>
  );
};

export default AdminDashboard;