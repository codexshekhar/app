import { Product, Language, ProductCategory } from '../types';

interface MultilingualProductData {
  id: string;
  category: ProductCategory;
  price: number;
  unit: string;
  imageColor: string;
  popular?: boolean;
  en: { name: string; description: string };
  hi: { name: string; description: string };
}

const RAW_PRODUCTS: MultilingualProductData[] = [
  // SEEDS
  {
    id: 's1',
    category: 'seeds',
    price: 1850,
    unit: '4 kg Pack',
    imageColor: 'bg-yellow-100 text-yellow-600',
    popular: true,
    en: { 
      name: 'Pioneer P3355 Corn Seeds', 
      description: 'High yield hybrid maize suitable for Rabi/Kharif season in Bihar.' 
    },
    hi: { 
      name: 'पायनियर P3355 मक्का बीज', 
      description: 'बिहार में रबी/खरीफ मौसम के लिए उपयुक्त उच्च उपज वाला हाइब्रिड मक्का।' 
    }
  },
  {
    id: 's2',
    category: 'seeds',
    price: 1200,
    unit: '40 kg Bag',
    imageColor: 'bg-amber-100 text-amber-700',
    en: {
      name: 'Shriram Super 303 Wheat',
      description: 'Premium wheat variety, resistant to rust, good for late sowing.'
    },
    hi: {
      name: 'श्रीराम सुपर 303 गेहूं',
      description: 'प्रीमियम गेहूं की किस्म, रतुआ रोग प्रतिरोधी, देर से बुवाई के लिए अच्छा।'
    }
  },
  {
    id: 's3',
    category: 'seeds',
    price: 450,
    unit: '10g Packet',
    imageColor: 'bg-red-100 text-red-600',
    en: {
      name: 'Syngenta Saho Tomato',
      description: 'High quality hybrid tomato seeds, disease resistant.'
    },
    hi: {
      name: 'सिंजेंटा साहो टमाटर',
      description: 'उच्च गुणवत्ता वाले हाइब्रिड टमाटर के बीज, रोग प्रतिरोधी।'
    }
  },
  
  // FERTILIZERS
  {
    id: 'f1',
    category: 'fertilizers',
    price: 266,
    unit: '45 kg Bag',
    imageColor: 'bg-blue-100 text-blue-600',
    popular: true,
    en: {
      name: 'Neem Coated Urea (IFFCO)',
      description: 'Government subsidized Neem coated urea for nitrogen supply.'
    },
    hi: {
      name: 'नीम लेपित यूरिया (IFFCO)',
      description: 'नाइट्रोजन आपूर्ति के लिए सरकारी सब्सिडी वाला नीम लेपित यूरिया।'
    }
  },
  {
    id: 'f2',
    category: 'fertilizers',
    price: 1350,
    unit: '50 kg Bag',
    imageColor: 'bg-slate-200 text-slate-700',
    en: {
      name: 'DAP (Di-Ammonium Phosphate)',
      description: 'Essential phosphorus and nitrogen fertilizer for root development.'
    },
    hi: {
      name: 'DAP (डाय-अमोनियम फॉस्फेट)',
      description: 'जड़ विकास के लिए आवश्यक फास्फोरस और नाइट्रोजन खाद।'
    }
  },
  {
    id: 'f3',
    category: 'fertilizers',
    price: 1700,
    unit: '50 kg Bag',
    imageColor: 'bg-pink-100 text-pink-600',
    en: {
      name: 'MOP (Muriate of Potash)',
      description: 'Potash fertilizer to improve crop quality and disease resistance.'
    },
    hi: {
      name: 'MOP (म्यूरेट ऑफ पोटाश)',
      description: 'फसल की गुणवत्ता और रोग प्रतिरोधक क्षमता में सुधार के लिए पोटाश खाद।'
    }
  },

  // CHEMICALS
  {
    id: 'c1',
    category: 'chemicals',
    price: 1800,
    unit: '60ml',
    imageColor: 'bg-emerald-100 text-emerald-700',
    en: {
      name: 'Coragen (Insecticide)',
      description: 'Broad spectrum insecticide for stem borer in paddy and maize.'
    },
    hi: {
      name: 'कोराजेन (कीटनाशक)',
      description: 'धान और मक्का में तना छेदक के लिए व्यापक स्पेक्ट्रम कीटनाशक।'
    }
  },
  {
    id: 'c2',
    category: 'chemicals',
    price: 450,
    unit: '1 Liter',
    imageColor: 'bg-purple-100 text-purple-700',
    en: {
      name: 'Roundup (Herbicide)',
      description: 'Systemic herbicide for weed control in non-cropped areas.'
    },
    hi: {
      name: 'राउंडअप (खरपतवार नाशक)',
      description: 'गैर-फसल वाले क्षेत्रों में खरपतवार नियंत्रण के लिए प्रणालीगत शाकनाशी।'
    }
  }
];

export const getStoreProducts = (language: Language): Product[] => {
  return RAW_PRODUCTS.map(p => ({
    id: p.id,
    category: p.category,
    price: p.price,
    unit: p.unit,
    imageColor: p.imageColor,
    popular: p.popular,
    name: p[language].name,
    description: p[language].description
  }));
};