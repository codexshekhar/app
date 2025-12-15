import React, { useState, useEffect } from 'react';
import { Cloud, CloudRain, Sun, Wind, Droplets, MapPin, Calendar, ArrowRight, CloudLightning, Loader2 } from 'lucide-react';
import { Language, DailyForecast } from '../types';
import { getCoordinates, getWeatherData, processForecast } from '../services/weatherService';
import { TRANSLATIONS, DISTRICT_NAMES_HI } from '../utils/translations';
import { BIHAR_DATA } from '../services/biharData';

interface Props {
  language: Language;
}

const WeatherForecast: React.FC<Props> = ({ language }) => {
  const [district, setDistrict] = useState('Patna');
  const [block, setBlock] = useState('');
  const [forecast, setForecast] = useState<DailyForecast[]>([]);
  const [loading, setLoading] = useState(true);
  
  const t = TRANSLATIONS[language];
  const getDistrictName = (dist: string) => language === 'hi' ? DISTRICT_NAMES_HI[dist] || dist : dist;

  // Initialize block
  useEffect(() => {
    const blocks = Object.keys(BIHAR_DATA[district].blocks);
    if (blocks.length > 0) setBlock(blocks[0]);
  }, [district]);

  // Fetch forecast
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const coords = await getCoordinates(district, block);
        if (coords) {
          const rawData = await getWeatherData(coords.lat, coords.lon);
          const processed = processForecast(rawData);
          setForecast(processed);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    if (block) fetchData();
  }, [district, block]);

  // Helper to pick icon based on WMO code
  const getWeatherIcon = (code: number, size = "w-6 h-6") => {
    if (code >= 95) return <CloudLightning className={`${size} text-purple-500`} />;
    if (code >= 61) return <CloudRain className={`${size} text-blue-500`} />;
    if (code >= 51) return <CloudRain className={`${size} text-blue-400`} />;
    if (code >= 3) return <Cloud className={`${size} text-slate-500 dark:text-slate-400`} />;
    return <Sun className={`${size} text-amber-500`} />;
  };

  const getDayLabel = (dateStr: string, index: number) => {
    if (index === 0) return t.today;
    if (index === 1) return t.tom;
    const d = new Date(dateStr);
    return d.toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-US', { weekday: 'short' });
  };

  const getDayDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-US', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 font-sans min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
             <div className="bg-sky-100 dark:bg-sky-900/30 p-2 rounded-xl text-sky-600 dark:text-sky-400">
               <CloudRain className="w-8 h-8" />
             </div>
             {t.weatherTitle}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">{t.weatherSubtitle}</p>
        </div>

        {/* Location Selectors */}
        <div className="flex gap-2 bg-white dark:bg-slate-800 p-1 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <select 
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="bg-transparent text-sm font-bold text-slate-700 dark:text-slate-300 outline-none px-3 py-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg dark:bg-slate-800"
            >
              {Object.keys(BIHAR_DATA).sort().map(d => <option key={d} value={d}>{getDistrictName(d)}</option>)}
            </select>
            <div className="w-[1px] bg-slate-200 dark:bg-slate-600 my-1"></div>
            <select 
              value={block}
              onChange={(e) => setBlock(e.target.value)}
              className="bg-transparent text-sm font-bold text-slate-700 dark:text-slate-300 outline-none px-3 py-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg dark:bg-slate-800"
            >
              {BIHAR_DATA[district]?.blocks && Object.keys(BIHAR_DATA[district].blocks).sort().map(b => <option key={b} value={b}>{b}</option>)}
            </select>
        </div>
      </div>

      {loading ? (
        <div className="h-96 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
          <Loader2 className="w-10 h-10 animate-spin mb-4 text-sky-500" />
          <p>Analyzing Satellite Data...</p>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Hero Card: Today */}
          {forecast.length > 0 && (
            <div className="bg-gradient-to-br from-sky-500 to-blue-600 dark:from-sky-900 dark:to-blue-900 rounded-3xl p-6 md:p-8 text-white shadow-xl shadow-sky-500/20 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
               
               <div className="relative z-10 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
                  <div>
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-2 text-sky-100 font-medium">
                      <MapPin className="w-4 h-4" /> {block}, {getDistrictName(district)}
                    </div>
                    <div className="text-7xl font-bold tracking-tighter mb-2">
                      {forecast[0].maxTemp}°
                    </div>
                    <p className="text-xl text-sky-50 font-medium flex items-center justify-center md:justify-start gap-2">
                       {getWeatherIcon(forecast[0].weatherCode, "w-6 h-6 text-white")} 
                       {forecast[0].rainProb > 40 ? (language === 'hi' ? 'बारिश की संभावना' : 'Rain Likely') : (language === 'hi' ? 'मौसम साफ' : 'Clear Sky')}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 md:gap-8 mt-8 md:mt-0 bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
                    <div className="flex flex-col items-center">
                       <Droplets className="w-6 h-6 text-sky-200 mb-1" />
                       <span className="text-xs uppercase tracking-wider text-sky-200 font-bold">{t.rainChance}</span>
                       <span className="text-xl font-bold">{forecast[0].rainProb}%</span>
                    </div>
                    <div className="flex flex-col items-center">
                       <Wind className="w-6 h-6 text-sky-200 mb-1" />
                       <span className="text-xs uppercase tracking-wider text-sky-200 font-bold">{t.windSpeed}</span>
                       <span className="text-xl font-bold">{forecast[0].windSpeed} km/h</span>
                    </div>
                  </div>
               </div>
            </div>
          )}

          {/* 7-Day Grid */}
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-slate-500 dark:text-slate-400" /> {t.forecast}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {forecast.map((day, idx) => (
                <div 
                  key={idx} 
                  className={`relative p-4 rounded-2xl flex flex-col items-center justify-center gap-2 border transition-all hover:-translate-y-1
                    ${idx === 0 
                      ? 'bg-sky-50 dark:bg-sky-900/20 border-sky-200 dark:border-sky-800 ring-2 ring-sky-100 dark:ring-sky-900/30' 
                      : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:shadow-lg hover:border-slate-200 dark:hover:border-slate-600'}`}
                >
                  <span className={`text-xs font-bold uppercase ${idx===0 ? 'text-sky-700 dark:text-sky-400' : 'text-slate-400 dark:text-slate-500'}`}>
                    {getDayLabel(day.date, idx)}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">
                    {getDayDate(day.date)}
                  </span>
                  
                  <div className="my-2 transform scale-125">
                    {getWeatherIcon(day.weatherCode)}
                  </div>
                  
                  <div className="text-lg font-bold text-slate-800 dark:text-white">
                    {Math.round(day.maxTemp)}°
                  </div>
                  <div className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                    {Math.round(day.minTemp)}°
                  </div>

                  {/* Rain Indicator if high */}
                  {day.rainProb > 30 && (
                    <div className="absolute top-2 right-2 flex items-center gap-0.5 text-[10px] font-bold text-blue-600 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/50 px-1.5 py-0.5 rounded-full">
                      <Droplets className="w-2.5 h-2.5" /> {day.rainProb}%
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Smart Alert (Simulated Startup Value) */}
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-xl p-4 flex items-start gap-4">
             <div className="bg-amber-100 dark:bg-amber-900/50 p-2 rounded-full mt-1">
               <Sun className="w-5 h-5 text-amber-600 dark:text-amber-400" />
             </div>
             <div>
               <h4 className="font-bold text-amber-900 dark:text-amber-300 text-sm">EcoFlow Intelligence</h4>
               <p className="text-amber-800 dark:text-amber-400 text-sm mt-1">
                 {language === 'hi' 
                   ? 'अगले 3 दिनों में बारिश की संभावना कम है। सिंचाई के लिए यह अच्छा समय है।'
                   : 'Low probability of rain in the next 3 days. Good window for irrigation and fertilizer application.'}
               </p>
             </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default WeatherForecast;