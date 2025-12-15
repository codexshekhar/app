import React, { useState } from 'react';
import { ShoppingBag, Tag, Leaf, FlaskConical, ShieldCheck, CheckCircle, Plus } from 'lucide-react';
import { Language, ProductCategory } from '../types';
import { getStoreProducts } from '../services/storeData';
import { TRANSLATIONS } from '../utils/translations';

interface Props {
  language: Language;
  onAddToCart: (product: any) => void;
}

const FarmStore: React.FC<Props> = ({ language, onAddToCart }) => {
  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'all'>('all');
  const [toast, setToast] = useState<string | null>(null);
  
  const t = TRANSLATIONS[language];
  
  // Fetch products based on current language
  const products = getStoreProducts(language);

  const handleAdd = (product: any) => {
    onAddToCart(product);
    setToast(`${product.name} added!`);
    setTimeout(() => setToast(null), 2000);
  };

  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  const categories: { id: ProductCategory | 'all', label: string, icon: React.ReactNode }[] = [
    { id: 'all', label: 'All', icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'seeds', label: t.catSeeds, icon: <Leaf className="w-4 h-4" /> },
    { id: 'fertilizers', label: t.catFertilizers, icon: <FlaskConical className="w-4 h-4" /> },
    { id: 'chemicals', label: t.catChemicals, icon: <ShieldCheck className="w-4 h-4" /> },
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 font-sans min-h-screen">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-24 right-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-3 rounded-xl shadow-2xl z-40 flex items-center gap-2 animate-bounce text-sm font-bold">
          <CheckCircle className="w-4 h-4 text-green-400 dark:text-green-600" />
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white flex items-center justify-center gap-3">
          <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-xl text-green-700 dark:text-green-400">
             <ShoppingBag className="w-8 h-8" />
          </div>
          {t.storeTitle}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2 text-lg">{t.storeSubtitle}</p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-3 mb-10 sticky top-[80px] z-20 py-3 bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur-sm -mx-4 px-4">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all transform active:scale-95
              ${activeCategory === cat.id 
                ? 'bg-green-600 text-white shadow-lg shadow-green-500/30' 
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-green-400 hover:text-green-700 dark:hover:text-green-400'}`}
          >
            {cat.icon}
            {cat.label}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:border-green-200 dark:hover:border-green-900 transition-all duration-300 flex flex-col overflow-hidden">
            
            {/* Image Placeholder */}
            <div className={`h-48 ${product.imageColor} dark:bg-opacity-80 flex flex-col items-center justify-center relative`}>
              {product.popular && (
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-orange-600 text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                  <Tag className="w-3 h-3" /> {t.popular}
                </div>
              )}
              {product.category === 'seeds' && <Leaf className="w-16 h-16 opacity-80 group-hover:scale-110 transition-transform duration-500" />}
              {product.category === 'fertilizers' && <FlaskConical className="w-16 h-16 opacity-80 group-hover:scale-110 transition-transform duration-500" />}
              {product.category === 'chemicals' && <ShieldCheck className="w-16 h-16 opacity-80 group-hover:scale-110 transition-transform duration-500" />}
            </div>

            {/* Content */}
            <div className="p-5 flex-grow flex flex-col">
              <div className="flex justify-between items-start mb-2">
                 <h3 className="font-bold text-slate-800 dark:text-white text-lg leading-tight">{product.name}</h3>
              </div>
              
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">{product.description}</p>
              
              <div className="mt-auto flex items-end justify-between border-t border-slate-100 dark:border-slate-700 pt-4">
                <div>
                  <p className="text-xs text-slate-400 dark:text-slate-500 uppercase font-bold">{t.price}</p>
                  <p className="text-xl font-extrabold text-green-700 dark:text-green-400">₹{product.price}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{product.unit}</p>
                </div>
                <button 
                  onClick={() => handleAdd(product)}
                  className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 p-3 rounded-xl hover:bg-green-600 hover:text-white dark:hover:bg-green-500 dark:hover:text-white transition-colors shadow-sm group-hover:shadow-green-500/30 group-hover:scale-105 transform duration-200"
                  title={t.addToCart}
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FarmStore;