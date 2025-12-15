import React, { useState } from 'react';
import { User, Product, Order, ProductCategory } from '../types';
import { Store, Plus, Package, Trash2, Tag, DollarSign, TrendingUp } from 'lucide-react';

interface Props {
  user: User;
  products: Product[];
  orders: Order[];
  onAddProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
}

const SellerDashboard: React.FC<Props> = ({ user, products, orders, onAddProduct, onDeleteProduct }) => {
  // Simple form state
  const [isAdding, setIsAdding] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<ProductCategory>('seeds');

  // Filter products for this view (In a real app, we'd filter by sellerId)
  // For demo, we show all or a subset
  const myProducts = products; 
  
  // Calculate revenue (mock logic: assuming all orders are relevant)
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct: Product = {
      id: `p${Date.now()}`,
      sellerId: user.id,
      name: newProdName,
      price: Number(newProdPrice),
      category: newProdCategory,
      unit: '1 Unit',
      description: 'Seller added product',
      imageColor: 'bg-slate-100 text-slate-600'
    };
    onAddProduct(newProduct);
    setIsAdding(false);
    setNewProdName('');
    setNewProdPrice('');
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 font-sans">
      <div className="flex justify-between items-end mb-8">
        <div>
           <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
             <Store className="w-8 h-8 text-blue-600" /> Seller Dashboard
           </h1>
           <p className="text-slate-500 mt-2">Manage your inventory and view sales.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition flex items-center gap-2 shadow-lg shadow-blue-500/20"
        >
          {isAdding ? 'Cancel' : <><Plus className="w-5 h-5" /> Add Product</>}
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
         <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4">
               <div className="bg-green-100 p-3 rounded-full text-green-600"><DollarSign className="w-6 h-6" /></div>
               <div>
                  <p className="text-sm font-bold text-slate-400 uppercase">Total Revenue</p>
                  <p className="text-2xl font-extrabold text-slate-900">₹{totalRevenue}</p>
               </div>
            </div>
         </div>
         <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4">
               <div className="bg-blue-100 p-3 rounded-full text-blue-600"><Package className="w-6 h-6" /></div>
               <div>
                  <p className="text-sm font-bold text-slate-400 uppercase">Total Products</p>
                  <p className="text-2xl font-extrabold text-slate-900">{myProducts.length}</p>
               </div>
            </div>
         </div>
         <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4">
               <div className="bg-purple-100 p-3 rounded-full text-purple-600"><TrendingUp className="w-6 h-6" /></div>
               <div>
                  <p className="text-sm font-bold text-slate-400 uppercase">Total Orders</p>
                  <p className="text-2xl font-extrabold text-slate-900">{orders.length}</p>
               </div>
            </div>
         </div>
      </div>

      {/* Add Product Form */}
      {isAdding && (
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mb-8 animate-in slide-in-from-top-4">
           <h3 className="font-bold text-lg text-slate-800 mb-4">Add New Item</h3>
           <form onSubmit={handleAdd} className="grid md:grid-cols-4 gap-4 items-end">
              <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Name</label>
                 <input 
                   required
                   value={newProdName}
                   onChange={(e) => setNewProdName(e.target.value)}
                   className="w-full p-2 border border-slate-300 rounded-lg" 
                   placeholder="Product Name" 
                 />
              </div>
              <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Category</label>
                 <select 
                   value={newProdCategory}
                   onChange={(e) => setNewProdCategory(e.target.value as ProductCategory)}
                   className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                 >
                   <option value="seeds">Seeds</option>
                   <option value="fertilizers">Fertilizers</option>
                   <option value="chemicals">Chemicals</option>
                   <option value="tools">Tools</option>
                 </select>
              </div>
              <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Price (₹)</label>
                 <input 
                   required
                   type="number"
                   value={newProdPrice}
                   onChange={(e) => setNewProdPrice(e.target.value)}
                   className="w-full p-2 border border-slate-300 rounded-lg" 
                   placeholder="0.00" 
                 />
              </div>
              <button type="submit" className="bg-green-600 text-white p-2.5 rounded-lg font-bold hover:bg-green-700">
                Save Product
              </button>
           </form>
        </div>
      )}

      {/* Inventory List */}
      <h3 className="font-bold text-xl text-slate-800 mb-4">Current Inventory</h3>
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
         <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
               <tr>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase">Product</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase">Category</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase">Price</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {myProducts.map(p => (
                 <tr key={p.id} className="hover:bg-slate-50">
                    <td className="p-4 font-bold text-slate-800">{p.name}</td>
                    <td className="p-4">
                       <span className="bg-slate-100 px-2 py-1 rounded text-xs font-bold uppercase text-slate-600">{p.category}</span>
                    </td>
                    <td className="p-4 text-slate-600">₹{p.price}</td>
                    <td className="p-4 text-right">
                       <button 
                        onClick={() => onDeleteProduct(p.id)}
                        className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition"
                       >
                          <Trash2 className="w-4 h-4" />
                       </button>
                    </td>
                 </tr>
               ))}
               {myProducts.length === 0 && (
                 <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-400">No products found. Add one to start selling.</td>
                 </tr>
               )}
            </tbody>
         </table>
      </div>
    </div>
  );
};

export default SellerDashboard;