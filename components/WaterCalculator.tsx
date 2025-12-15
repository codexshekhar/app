import React, { useState, useEffect } from 'react';
import { CloudRain, Droplets, MapPin, Loader2, Sprout, AlertCircle, Sun, Save, CheckCircle, Crown, Wind, TrendingUp, BrainCircuit, Store, ChevronRight, Thermometer, X, Info } from 'lucide-react';
import { CropType, WaterResult, SavedField, Language, SoilType, AiUsageStats } from '../types';
import { getCoordinates, getWeatherData } from '../services/weatherService';
import { calculateWaterNeed } from '../utils/science';
import { getAgronomistAdvice, getDeepAnalysis, getMarketInsights, getNearbyResources, GeminiResponse } from '../services/geminiService';
import { BIHAR_DATA } from '../services/biharData';
import { TRANSLATIONS, CROP_NAMES_HI, SOIL_NAMES_HI, DISTRICT_NAMES_HI } from '../utils/translations';
import { PlantDoctor } from './PlantDoctor';

interface Props {
  savedFields: SavedField[];
  language: Language;
  onAiUsage?: (feature: keyof AiUsageStats) => void;
}

interface CalculationContext {
  district: string;
  block: string;
  crop: CropType;
  tMax: number;
  tMin: number;
  currentTemp: number;
  currentHumidity: number;
  soil: SoilType;
  lat: number;
  lon: number;
}

const WaterCalculator: React.FC<Props> = ({ savedFields, language, onAiUsage }) => {
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Patna');
  const [selectedBlock, setSelectedBlock] = useState<string>('');
  const [selectedCrop, setSelectedCrop] = useState<CropType>(CropType.TOMATO);
  const [selectedSoil, setSelectedSoil] = useState<SoilType>(SoilType.ALLUVIAL);
  
  // State for application status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<WaterResult | null>(null);
  const [context, setContext] = useState<CalculationContext | null>(null);
  
  // AI State - Standard
  const [aiAdvice, setAiAdvice] = useState<string>('');
  const [aiLoading, setAiLoading] = useState(false);

  // AI State - Advanced Features
  const [deepAnalysis, setDeepAnalysis] = useState<string>('');
  const [deepLoading, setDeepLoading] = useState(false);
  const [deepError, setDeepError] = useState<string | null>(null);
  
  const [marketInsights, setMarketInsights] = useState<GeminiResponse | null>(null);
  const [marketLoading, setMarketLoading] = useState(false);
  const [marketError, setMarketError] = useState<string | null>(null);

  const [nearbyResources, setNearbyResources] = useState<GeminiResponse | null>(null);
  const [resourcesLoading, setResourcesLoading] = useState(false);
  const [resourcesError, setResourcesError] = useState<string | null>(null);

  const [saved, setSaved] = useState(false);

  const t = TRANSLATIONS[language];

  useEffect(() => {
    const blocks = Object.keys(BIHAR_DATA[selectedDistrict].blocks);
    if (blocks.length > 0) {
      setSelectedBlock(blocks[0]);
    }
    setSelectedSoil(BIHAR_DATA[selectedDistrict].defaultSoil);
    
    // Reset all outputs on location change
    setResult(null);
    setContext(null);
    setAiAdvice('');
    setDeepAnalysis('');
    setDeepError(null);
    setMarketInsights(null);
    setMarketError(null);
    setNearbyResources(null);
    setResourcesError(null);
  }, [selectedDistrict]);

  useEffect(() => {
    setResult(null);
    setContext(null);
    setAiAdvice('');
    setDeepAnalysis('');
    setDeepError(null);
    setMarketInsights(null);
    setMarketError(null);
    setNearbyResources(null);
    setResourcesError(null);
  }, [selectedBlock]);

  // Effect: Refetch Standard AI advice when Context changes
  useEffect(() => {
    const fetchAdvice = async () => {
      if (context && result) {
        setAiLoading(true);
        if (onAiUsage) onAiUsage('agronomistAdvice');
        const localizedLocation = `${context.block}, ${context.district}, Bihar`;
        try {
          const advice = await getAgronomistAdvice(context.crop, localizedLocation, result, context.tMax, context.soil, language);
          setAiAdvice(advice);
        } catch (e) {
          setAiAdvice(language === 'hi' ? "सलाह लोड करने में त्रुटि।" : "Error loading advice.");
        } finally {
          setAiLoading(false);
        }
      }
    };
    fetchAdvice();
  }, [language, context, result]); 

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setContext(null);
    setAiAdvice('');
    setDeepAnalysis('');
    setDeepError(null);
    setMarketInsights(null);
    setMarketError(null);
    setNearbyResources(null);
    setResourcesError(null);
    setSaved(false);
    setLoading(true);

    try {
      const coords = await getCoordinates(selectedDistrict, selectedBlock);
      if (!coords) throw new Error(t.errorLoc);
      
      const weather = await getWeatherData(coords.lat, coords.lon);
      const currentTemp = weather.current.temperature_2m;
      const currentHumidity = weather.current.relative_humidity_2m;
      const tMax = weather.daily.temperature_2m_max[0];
      const tMin = weather.daily.temperature_2m_min[0];

      const calculation = calculateWaterNeed({
        latitude: coords.lat,
        date: new Date(),
        tMin, tMax, humidity: currentHumidity, crop: selectedCrop
      });

      setResult(calculation);
      setContext({
        district: selectedDistrict,
        block: selectedBlock,
        crop: selectedCrop,
        tMax, tMin, currentTemp, currentHumidity, soil: selectedSoil,
        lat: coords.lat, lon: coords.lon
      });

    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDeepAnalysis = async () => {
    if (!context) return;
    setDeepLoading(true);
    setDeepError(null);
    if (onAiUsage) onAiUsage('deepAnalysis');
    try {
      const analysis = await getDeepAnalysis(context.crop, `${context.block}, ${context.district}`, context.soil, language);
      setDeepAnalysis(analysis);
    } catch (e) {
      console.error(e);
      setDeepError(language === 'hi' ? "विश्लेषण लोड करने में विफल। पुनः प्रयास करें।" : "Failed to load analysis. Please retry.");
    } finally {
      setDeepLoading(false);
    }
  };

  const handleMarketInsights = async () => {
    if (!context) return;
    setMarketLoading(true);
    setMarketError(null);
    if (onAiUsage) onAiUsage('marketInsights');
    try {
      const response = await getMarketInsights(context.crop, context.district, language);
      setMarketInsights(response);
    } catch (e) {
      console.error(e);
      setMarketError(language === 'hi' ? "बाजार जानकारी लोड करने में विफल।" : "Failed to load market insights.");
    } finally {
      setMarketLoading(false);
    }
  };

  const handleNearbyResources = async () => {
    if (!context) return;
    setResourcesLoading(true);
    setResourcesError(null);
    if (onAiUsage) onAiUsage('nearbyResources');
    try {
      const response = await getNearbyResources(context.lat, context.lon, language);
      setNearbyResources(response);
    } catch (e) {
      console.error(e);
      setResourcesError(language === 'hi' ? "संसाधन लोड करने में विफल।" : "Failed to load nearby resources.");
    } finally {
      setResourcesLoading(false);
    }
  };

  const handleQuickLoad = (field: SavedField) => {
    if (BIHAR_DATA[field.district]) {
      setSelectedDistrict(field.district);
      setTimeout(() => {
        setSelectedBlock(field.block);
        setSelectedCrop(field.cropType);
      }, 100);
    }
  };

  const handleSaveField = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const getSoilName = (soil: SoilType) => language === 'hi' ? SOIL_NAMES_HI[soil] || soil : soil;
  const getCropName = (crop: CropType) => language === 'hi' ? CROP_NAMES_HI[crop] || crop : crop;
  const getDistrictName = (dist: string) => language === 'hi' ? DISTRICT_NAMES_HI[dist] || dist : dist;

  const getKathaData = (lPerM2: number) => {
    const totalLiters = Math.round(lPerM2 * 126.5);
    const buckets = Math.ceil(totalLiters / 15);
    return { totalLiters, buckets };
  };

  // Helper to render grounding chunks
  const renderGrounding = (metadata: any) => {
    if (!metadata || !metadata.groundingChunks) return null;
    return (
      <div className="mt-3 text-xs bg-slate-50 dark:bg-slate-700/50 p-2 rounded border border-slate-200 dark:border-slate-600">
        <p className="font-semibold text-slate-500 dark:text-slate-300 mb-2 flex items-center gap-1">
          <MapPin className="w-3 h-3" /> {t.sources}:
        </p>
        <div className="flex flex-wrap gap-2">
          {metadata.groundingChunks.map((chunk: any, idx: number) => {
            if (chunk.web?.uri) {
              return (
                <a key={idx} href={chunk.web.uri} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline truncate max-w-[200px] bg-white dark:bg-slate-800 px-2 py-1 rounded border border-slate-200 dark:border-slate-600 shadow-sm flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                  {chunk.web.title || "Web Link"}
                </a>
              );
            }
            if (chunk.maps?.placeId) {
               return (
                <span key={idx} className="text-amber-700 dark:text-amber-400 font-medium bg-amber-50 dark:bg-amber-900/30 px-2 py-1 rounded border border-amber-100 dark:border-amber-800 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {chunk.maps.title}
                </span>
              );
            }
            return null;
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 font-sans">
      
      {/* Header Info */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white flex items-center justify-center gap-3">
          <Droplets className="w-8 h-8 md:w-10 md:h-10 text-blue-600 fill-blue-600" />
          {t.appTitle}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2 text-base md:text-lg">{t.appSubtitle}</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* === INPUT COLUMN (4 Cols) === */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-800 p-5 md:p-6 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700">
          <h2 className="text-xl font-bold mb-6 text-slate-800 dark:text-white flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-700">
            <MapPin className="w-6 h-6 text-green-600 dark:text-green-400" /> {t.fieldData}
          </h2>

          <form onSubmit={handleCalculate} className="space-y-5">
            
            {/* Location Group */}
            <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl border border-slate-200 dark:border-slate-600">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-300 uppercase tracking-wider mb-3 block">{t.locationDetails}</span>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">{t.selectDistrict}</label>
                  <select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-green-500 outline-none bg-white dark:bg-slate-800 text-sm shadow-sm dark:text-white"
                  >
                    {Object.keys(BIHAR_DATA).sort().map((dist) => (
                      <option key={dist} value={dist}>{getDistrictName(dist)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">{t.selectBlock}</label>
                  <select
                    value={selectedBlock}
                    onChange={(e) => setSelectedBlock(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-green-500 outline-none bg-white dark:bg-slate-800 text-sm shadow-sm dark:text-white"
                  >
                    {BIHAR_DATA[selectedDistrict] && Object.keys(BIHAR_DATA[selectedDistrict].blocks).sort().map((blk) => (
                      <option key={blk} value={blk}>{blk}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Quick Select Buttons */}
            {savedFields.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {savedFields.map(field => (
                  <button
                    key={field.id}
                    type="button"
                    onClick={() => handleQuickLoad(field)}
                    className="text-xs bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1.5 rounded-full border border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-800 transition font-medium flex items-center gap-1"
                  >
                    ⚡ {field.name}
                  </button>
                ))}
              </div>
            )}

            {/* Crop Group */}
            <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl border border-slate-200 dark:border-slate-600">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-300 uppercase tracking-wider mb-3 block">{t.cropDetails}</span>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">{t.soilType}</label>
                    <div className="relative group">
                      <Info className="w-3.5 h-3.5 text-slate-400 hover:text-blue-500 cursor-pointer transition-colors" />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-2.5 bg-slate-800 text-white text-xs rounded-lg shadow-xl z-50 text-center font-medium">
                        {t.soilInfo}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                      </div>
                    </div>
                  </div>
                  <select
                    value={selectedSoil}
                    onChange={(e) => setSelectedSoil(e.target.value as SoilType)}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-amber-500 outline-none bg-white dark:bg-slate-800 text-slate-800 dark:text-white text-sm shadow-sm"
                  >
                    {Object.values(SoilType).map((soil) => (
                      <option key={soil} value={soil}>{getSoilName(soil)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">{t.cropType}</label>
                  <select
                    value={selectedCrop}
                    onChange={(e) => setSelectedCrop(e.target.value as CropType)}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-green-500 outline-none bg-white dark:bg-slate-800 text-slate-800 dark:text-white text-sm shadow-sm"
                  >
                    {Object.values(CropType).map((crop) => (
                      <option key={crop} value={crop}>{getCropName(crop)}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold text-white text-lg transition-all transform active:scale-95 flex items-center justify-center gap-2 shadow-lg
                ${loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 shadow-green-500/20'}`}
            >
              {loading ? <><Loader2 className="animate-spin" /> {t.calculating}</> : t.calculateBtn}
            </button>
          </form>
        </div>

        {/* === RESULTS COLUMN (8 Cols) === */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {!result || !context ? (
            <div className="bg-white dark:bg-slate-800 rounded-3xl h-full min-h-[500px] flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700 shadow-sm p-4">
              <div className="bg-slate-50 dark:bg-slate-700 p-6 rounded-full mb-4">
                <CloudRain className="w-16 h-16 text-slate-300 dark:text-slate-500" />
              </div>
              <p className="text-lg font-medium text-center">{t.selectPrompt}</p>
              <p className="text-sm text-slate-400 dark:text-slate-500 mt-2 max-w-xs text-center">{t.useFormPrompt}</p>
            </div>
          ) : (
            <>
              {/* TOP DASHBOARD: Water & Weather */}
              <div className="grid md:grid-cols-2 gap-6">
                
                {/* 1. Water Need Card (The Tank) */}
                <div className="bg-gradient-to-br from-blue-600 to-cyan-500 rounded-3xl p-6 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden flex flex-col justify-between min-h-[240px]">
                  
                  {/* CSS Animations for Water Effect */}
                  <style>{`
                    @keyframes wave-slide {
                        0% { transform: translateX(0); }
                        100% { transform: translateX(-50%); }
                    }
                    @keyframes bubble-float {
                        0% { transform: translateY(100px) scale(0.5); opacity: 0; }
                        50% { opacity: 0.6; }
                        100% { transform: translateY(-20px) scale(1.2); opacity: 0; }
                    }
                    @keyframes tube-shine {
                        0% { background-position: 200% 0; }
                        100% { background-position: -200% 0; }
                    }
                  `}</style>

                  {/* Glass Overlay Effect */}
                  <div className="absolute inset-0 bg-white/5 pointer-events-none"></div>

                  <div className="relative z-10 w-full">
                    <h3 className="text-blue-100 font-bold text-sm uppercase tracking-wide mb-2 flex items-center gap-2">
                      <Droplets className="w-4 h-4" /> {t.dailyWaterDemand}
                    </h3>
                    <div className="flex items-baseline gap-2 mb-4">
                       <span className="text-6xl font-extrabold tracking-tight drop-shadow-sm">{result.litersPerSqMeter}</span>
                       <span className="text-xl opacity-90 font-medium">{language === 'hi' ? 'लीटर/मी²' : 'L/m²'}</span>
                    </div>
                    
                    {/* Visual Bar - Enhanced Liquid Tube */}
                    <div className="mt-2 mb-3 relative h-10 bg-black/20 rounded-full overflow-hidden shadow-inner border border-white/10 group">
                      {/* Grid Lines */}
                      <div className="absolute inset-0 flex justify-between px-2 z-20 pointer-events-none opacity-30">
                         {[1,2,3,4,5,6,7,8,9].map(i => <div key={i} className="w-px h-full bg-white/50"></div>)}
                      </div>

                      {/* Liquid Fill */}
                      <div 
                        className="h-full relative transition-all duration-1000 ease-out flex items-center overflow-hidden"
                        style={{ 
                            width: `${Math.min((result.litersPerSqMeter / 10) * 100, 100)}%`,
                            background: 'linear-gradient(90deg, #60a5fa 0%, #3b82f6 50%, #2563eb 100%)',
                            boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)'
                        }}
                      >
                         {/* Shimmer Effect */}
                         <div className="absolute inset-0 w-full h-full" 
                              style={{ 
                                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                                  backgroundSize: '200% 100%',
                                  animation: 'tube-shine 3s infinite linear'
                              }}>
                         </div>
                         
                         {/* Leading Edge Highlight */}
                         <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/60 blur-[2px]"></div>
                      </div>
                    </div>
                    <div className="flex justify-between text-[10px] text-blue-100 font-mono uppercase tracking-wider opacity-80 pl-1 pr-1">
                        <span>0L</span>
                        <span>5L</span>
                        <span>10L+</span>
                    </div>
                  </div>

                  <div className="relative z-10 pt-4 flex justify-between items-end">
                       <div>
                         <p className="text-[10px] uppercase tracking-wider text-blue-200 mb-0.5">{t.kathaCalc}</p>
                         <p className="text-xl font-bold">{getKathaData(result.litersPerSqMeter).buckets} {t.buckets}</p>
                       </div>
                       
                       {/* ENHANCED DYNAMIC WATER DROP GAUGE */}
                       <div className="w-24 h-24 relative flex items-center justify-center">
                          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl overflow-visible">
                             <defs>
                                <linearGradient id="liquidGrad" x1="0" y1="0" x2="0" y2="1">
                                   <stop offset="0%" stopColor="#93c5fd" />
                                   <stop offset="100%" stopColor="#1d4ed8" />
                                </linearGradient>
                                <clipPath id="dropMask">
                                   <path d="M50 2 C 50 2, 88 45, 88 68 A 38 38 0 0 1 12 68 C 12 45, 50 2, 50 2 Z" />
                                </clipPath>
                             </defs>

                             {/* Glass Container Background */}
                             <path d="M50 2 C 50 2, 88 45, 88 68 A 38 38 0 0 1 12 68 C 12 45, 50 2, 50 2 Z" fill="rgba(0,0,0,0.2)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />

                             {/* Liquid Group */}
                             <g clipPath="url(#dropMask)">
                                {/* Vertical translation controls fill level */}
                                <g style={{ 
                                   transform: `translateY(${100 - Math.min((result.litersPerSqMeter / 10) * 100, 100)}%)`, 
                                   transition: 'transform 1.5s cubic-bezier(0.4, 0, 0.2, 1)' 
                                }}>
                                   {/* Wave Animation Group - Using CSS animation for the loop */}
                                   <g style={{ animation: 'wave-slide 3s linear infinite', width: '200px' }}>
                                      {/* Wave Path: Defined with 200 width but animating 50% shift to loop seamlessly */}
                                      <path 
                                        d="M 0 5 Q 25 10 50 5 T 100 5 T 150 5 T 200 5 V 150 H 0 Z" 
                                        fill="url(#liquidGrad)" 
                                      />
                                   </g>
                                   
                                   {/* Rising Bubbles - Random Positions */}
                                   <circle cx="30" cy="40" r="2" fill="white" opacity="0.3" style={{ animation: 'bubble-float 2.5s infinite ease-in' }} />
                                   <circle cx="70" cy="60" r="3" fill="white" opacity="0.2" style={{ animation: 'bubble-float 3.2s infinite ease-in 0.5s' }} />
                                   <circle cx="50" cy="80" r="1.5" fill="white" opacity="0.4" style={{ animation: 'bubble-float 2.8s infinite ease-in 1.2s' }} />
                                   <circle cx="40" cy="90" r="1" fill="white" opacity="0.3" style={{ animation: 'bubble-float 3s infinite ease-in 2s' }} />
                                   <circle cx="60" cy="50" r="2" fill="white" opacity="0.2" style={{ animation: 'bubble-float 4s infinite ease-in 1.5s' }} />
                                </g>
                             </g>
                             
                             {/* Shine / Reflection */}
                             <ellipse cx="35" cy="35" rx="5" ry="12" transform="rotate(-25 35 35)" fill="white" opacity="0.3" />
                             <path d="M50 2 C 50 2, 85 45, 85 68" fill="none" stroke="white" strokeWidth="1.5" strokeOpacity="0.4" strokeLinecap="round" transform="scale(0.9) translate(5,5)" />
                          </svg>
                       </div>
                  </div>
                  
                  {/* Decorative Background Blob */}
                  <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
                </div>

                {/* 2. Weather Context & Quick Advice */}
                <div className="flex flex-col gap-4">
                  {/* Weather Snippet */}
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wide mb-2">
                        <MapPin className="w-3.5 h-3.5" /> {context.block}, {getDistrictName(context.district)}
                      </div>
                      <div className="flex items-center gap-4">
                         <div className="text-4xl font-bold text-slate-800 dark:text-white tracking-tight">{context.currentTemp}°</div>
                         <div className="text-xs text-slate-500 dark:text-slate-400 font-medium space-y-1">
                            <div className="flex items-center gap-1.5"><Thermometer className="w-3.5 h-3.5 text-red-400" /> {t.maxTemp} {context.tMax}°</div>
                            <div className="flex items-center gap-1.5"><Wind className="w-3.5 h-3.5 text-blue-400" /> {t.humidity} {context.currentHumidity}%</div>
                         </div>
                      </div>
                    </div>
                    <div className="w-14 h-14 bg-amber-50 dark:bg-amber-900/30 rounded-full flex items-center justify-center border border-amber-100 dark:border-amber-800 shadow-sm">
                      <Sun className="w-8 h-8 text-amber-500 animate-pulse" />
                    </div>
                  </div>

                  {/* AI Quick Tip */}
                  <div className="bg-green-50 dark:bg-green-900/30 rounded-2xl p-5 border border-green-100 dark:border-green-800 flex-grow relative shadow-sm">
                    <h3 className="text-green-800 dark:text-green-400 font-bold flex items-center gap-2 text-sm mb-2 uppercase tracking-wide">
                       <Sprout className="w-4 h-4" /> {t.aiAgronomist}
                    </h3>
                    {aiLoading ? (
                      <div className="flex items-center gap-2 text-green-600 dark:text-green-300 text-sm mt-2"><Loader2 className="w-4 h-4 animate-spin" /> {t.aiLoading}</div>
                    ) : (
                      <div className="text-sm text-green-700 dark:text-green-300 leading-relaxed font-medium">
                        "{aiAdvice}"
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ACTION GRID (Smart Tools) */}
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mt-2 px-1">Smart Farming Hub</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* CARD 1: Deep Analysis */}
                <div className={`bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-300 ${deepAnalysis ? 'md:col-span-2 lg:col-span-4 border-indigo-200 dark:border-indigo-800 ring-4 ring-indigo-50 dark:ring-indigo-900/20 shadow-lg' : 'hover:shadow-lg hover:border-indigo-200 dark:hover:border-indigo-800'}`}>
                  <div 
                    className="p-4 cursor-pointer flex justify-between items-center bg-gradient-to-r from-indigo-50/50 to-white dark:from-indigo-900/10 dark:to-slate-800"
                    onClick={() => !deepAnalysis && handleDeepAnalysis()}
                  >
                     <div className="flex items-center gap-3">
                       <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm">
                         <BrainCircuit className="w-6 h-6" />
                       </div>
                       <div>
                         <h4 className="font-bold text-slate-800 dark:text-white text-sm">{t.deepAnalysis}</h4>
                         <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t.deepSubtitle}</p>
                       </div>
                     </div>
                     {!deepAnalysis && (
                       <button disabled={deepLoading} className="text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-700 p-2 rounded-full border border-indigo-100 dark:border-indigo-800 shadow-sm hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition">
                         {deepLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (deepError ? <AlertCircle className="w-4 h-4 text-red-500" /> : <ChevronRight className="w-4 h-4" />)}
                       </button>
                     )}
                  </div>
                  {deepError && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/30 border-t border-red-100 dark:border-red-800 flex items-center justify-between text-sm text-red-700 dark:text-red-300 animate-in slide-in-from-top-2">
                       <span className="flex items-center gap-2"><AlertCircle className="w-4 h-4" /> {deepError}</span>
                       <button onClick={(e) => { e.stopPropagation(); handleDeepAnalysis(); }} className="font-bold hover:underline bg-white dark:bg-slate-700 px-3 py-1 rounded-full shadow-sm">Retry</button>
                    </div>
                  )}
                  {deepAnalysis && (
                    <div className="p-6 border-t border-indigo-100 dark:border-indigo-800 bg-white dark:bg-slate-800">
                      <div className="prose prose-sm max-w-none text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                        {deepAnalysis}
                      </div>
                      <button onClick={() => setDeepAnalysis('')} className="mt-6 flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1.5 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition w-fit">
                        <X className="w-3 h-3" /> {t.close}
                      </button>
                    </div>
                  )}
                </div>

                {/* CARD 2: Market Insights (Search) */}
                <div className={`bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden transition-all ${marketInsights ? 'md:col-span-2 lg:col-span-4 border-amber-200 dark:border-amber-800 ring-4 ring-amber-50 dark:ring-amber-900/20 shadow-lg' : 'hover:shadow-lg hover:border-amber-200 dark:hover:border-amber-800'}`}>
                   <div 
                    className="p-4 cursor-pointer flex justify-between items-center bg-gradient-to-r from-amber-50/50 to-white dark:from-amber-900/10 dark:to-slate-800"
                    onClick={() => !marketInsights && handleMarketInsights()}
                   >
                     <div className="flex items-center gap-3">
                       <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-sm">
                         <TrendingUp className="w-6 h-6" />
                       </div>
                       <div>
                         <h4 className="font-bold text-slate-800 dark:text-white text-sm">{t.marketUpdates}</h4>
                         <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t.marketSubtitle}</p>
                       </div>
                     </div>
                     {!marketInsights && (
                       <button disabled={marketLoading} className="text-amber-600 dark:text-amber-400 bg-white dark:bg-slate-700 p-2 rounded-full border border-amber-100 dark:border-amber-800 shadow-sm hover:bg-amber-50 dark:hover:bg-amber-900/30 transition">
                         {marketLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (marketError ? <AlertCircle className="w-4 h-4 text-red-500" /> : <ChevronRight className="w-4 h-4" />)}
                       </button>
                     )}
                  </div>
                  {marketError && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/30 border-t border-red-100 dark:border-red-800 flex items-center justify-between text-sm text-red-700 dark:text-red-300 animate-in slide-in-from-top-2">
                       <span className="flex items-center gap-2"><AlertCircle className="w-4 h-4" /> {marketError}</span>
                       <button onClick={(e) => { e.stopPropagation(); handleMarketInsights(); }} className="font-bold hover:underline bg-white dark:bg-slate-700 px-3 py-1 rounded-full shadow-sm">Retry</button>
                    </div>
                  )}
                  {marketInsights && (
                    <div className="p-6 border-t border-amber-100 dark:border-amber-800 bg-white dark:bg-slate-800">
                       <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line mb-4 leading-relaxed">{marketInsights.text}</p>
                       {renderGrounding(marketInsights.groundingMetadata)}
                       <button onClick={() => setMarketInsights(null)} className="mt-6 flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-3 py-1.5 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/50 transition w-fit">
                         <X className="w-3 h-3" /> {t.close}
                       </button>
                    </div>
                  )}
                </div>

                {/* CARD 3: Nearby Resources (Maps) */}
                <div className={`bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden transition-all ${nearbyResources ? 'md:col-span-2 lg:col-span-4 border-emerald-200 dark:border-emerald-800 ring-4 ring-emerald-50 dark:ring-emerald-900/20 shadow-lg' : 'hover:shadow-lg hover:border-emerald-200 dark:hover:border-emerald-800'}`}>
                   <div 
                    className="p-4 cursor-pointer flex justify-between items-center bg-gradient-to-r from-emerald-50/50 to-white dark:from-emerald-900/10 dark:to-slate-800"
                    onClick={() => !nearbyResources && handleNearbyResources()}
                   >
                     <div className="flex items-center gap-3">
                       <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm">
                         <Store className="w-6 h-6" />
                       </div>
                       <div>
                         <h4 className="font-bold text-slate-800 dark:text-white text-sm">{t.nearbyResources}</h4>
                         <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t.resourcesSubtitle}</p>
                       </div>
                     </div>
                     {!nearbyResources && (
                       <button disabled={resourcesLoading} className="text-emerald-600 dark:text-emerald-400 bg-white dark:bg-slate-700 p-2 rounded-full border border-emerald-100 dark:border-emerald-800 shadow-sm hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition">
                         {resourcesLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (resourcesError ? <AlertCircle className="w-4 h-4 text-red-500" /> : <ChevronRight className="w-4 h-4" />)}
                       </button>
                     )}
                  </div>
                  {resourcesError && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/30 border-t border-red-100 dark:border-red-800 flex items-center justify-between text-sm text-red-700 dark:text-red-300 animate-in slide-in-from-top-2">
                       <span className="flex items-center gap-2"><AlertCircle className="w-4 h-4" /> {resourcesError}</span>
                       <button onClick={(e) => { e.stopPropagation(); handleNearbyResources(); }} className="font-bold hover:underline bg-white dark:bg-slate-700 px-3 py-1 rounded-full shadow-sm">Retry</button>
                    </div>
                  )}
                  {nearbyResources && (
                    <div className="p-6 border-t border-emerald-100 dark:border-emerald-800 bg-white dark:bg-slate-800">
                       <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line mb-4 leading-relaxed">{nearbyResources.text}</p>
                       {renderGrounding(nearbyResources.groundingMetadata)}
                       <button onClick={() => setNearbyResources(null)} className="mt-6 flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1.5 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition w-fit">
                         <X className="w-3 h-3" /> {t.close}
                       </button>
                    </div>
                  )}
                </div>

                {/* CARD 4: Plant Doctor (Using New Component) */}
                <PlantDoctor 
                  language={language} 
                  onAiUsage={onAiUsage} 
                  mode="card" 
                />

              </div>

              {/* Save Field Button */}
              <div className="flex justify-center mt-4 pb-4">
                 <button 
                  onClick={handleSaveField}
                  className={`px-8 py-3 rounded-full text-sm font-bold flex items-center gap-2 transition-all shadow-sm
                    ${saved ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 ring-2 ring-green-200 dark:ring-green-800' : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'}`}
                >
                  {saved ? <><CheckCircle className="w-4 h-4" /> {t.saveSuccess}</> : <><Save className="w-4 h-4" /> {t.saveField} <Crown className="w-3 h-3 text-amber-500" /></>}
                </button>
              </div>

            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default WaterCalculator;