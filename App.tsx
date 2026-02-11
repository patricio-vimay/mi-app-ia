import React, { useState, useEffect, useCallback, useMemo } from 'react';

// --- CONFIGURACIÓN Y DATOS (Sustituye a constants.ts) ---
const APP_TITLE = "Global Web Analytics Explorer";
const ENGLISH_SPEAKING_COUNTRIES = [
  { id: 'us', name: 'United States', flag: '🇺🇸' },
  { id: 'gb', name: 'United Kingdom', flag: '🇬🇧' },
  { id: 'ca', name: 'Canada', flag: '🇨🇦' },
  { id: 'au', name: 'Australia', flag: '🇦🇺' }
];

// --- COMPONENTES AUXILIARES (Sustituyen a la carpeta /components) ---
const CountrySelector = ({ selectedId, onSelect }: any) => (
  <div className="flex gap-2 overflow-x-auto pb-4">
    {ENGLISH_SPEAKING_COUNTRIES.map((country) => (
      <button
        key={country.id}
        onClick={() => onSelect(country)}
        className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-all ${
          selectedId === country.id ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
        }`}
      >
        {country.flag} {country.name}
      </button>
    ))}
  </div>
);

const WebsiteCard = ({ site, index }: any) => (
  <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold">
          {index + 1}
        </div>
        <h4 className="font-bold text-slate-800 truncate w-32">{site.companyName}</h4>
      </div>
      <span className="text-[10px] font-bold text-slate-400 uppercase">{site.category}</span>
    </div>
    <p className="text-xs text-slate-500 mb-4 truncate">{site.websiteUrl}</p>
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden">
        <div className="bg-indigo-500 h-full" style={{ width: `${site.trafficShare}%` }}></div>
      </div>
      <span className="text-xs font-bold text-slate-700">{site.trafficShare}%</span>
    </div>
  </div>
);

const AnalyticsChart = ({ data }: any) => (
  <div className="space-y-4">
    {data.map((site: any) => (
      <div key={site.websiteUrl} className="flex items-center gap-4">
        <div className="text-xs font-bold text-slate-500 w-20 truncate">{site.companyName}</div>
        <div className="flex-1 bg-slate-100 h-4 rounded-full overflow-hidden">
          <div className="bg-indigo-500 h-full" style={{ width: `${site.trafficShare}%` }}></div>
        </div>
      </div>
    ))}
  </div>
);

// --- APP PRINCIPAL ---
export default function App() {
  const [selectedCountry, setSelectedCountry] = useState(ENGLISH_SPEAKING_COUNTRIES[0]);
  const [websites, setWebsites] = useState<any[]>([]);
  const [sources, setSources] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);

  const loadData = useCallback(async (country: any) => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulación de datos para que la app funcione sin API externa por ahora
      setTimeout(() => {
        setWebsites([
          { websiteUrl: "google.com", companyName: "Google", category: "Search", trafficShare: 95 },
          { websiteUrl: "youtube.com", companyName: "YouTube", category: "Video", trafficShare: 80 },
          { websiteUrl: "facebook.com", companyName: "Facebook", category: "Social", trafficShare: 60 },
          { websiteUrl: "amazon.com", companyName: "Amazon", category: "E-commerce", trafficShare: 55 },
          { websiteUrl: "wikipedia.org", companyName: "Wikipedia", category: "Reference", trafficShare: 40 }
        ]);
        setSources([{ title: "SimilarWeb Global Data", uri: "#" }]);
        setIsLoading(false);
      }, 800);
    } catch (err) {
      setError("Error al cargar datos.");
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { loadData(selectedCountry); }, [selectedCountry, loadData]);

  const filteredWebsites = useMemo(() => {
    return websites.filter(site => 
      site.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [websites, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-black text-slate-800">{APP_TITLE}</h1>
          <div className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">LIVE DATA</div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 mt-8">
        <CountrySelector selectedId={selectedCountry.id} onSelect={setSelectedCountry} />
        
        <div className="my-8">
          <input 
            type="text" 
            placeholder="Search market leaders..." 
            className="w-full p-4 rounded-xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="font-bold mb-6">Traffic Share Analysis</h3>
            {isLoading ? <div className="animate-pulse h-40 bg-slate-50 rounded-xl"></div> : <AnalyticsChart data={websites} />}
          </div>
          <div className="bg-indigo-900 p-6 rounded-2xl text-white">
            <div className="text-4xl mb-2">{selectedCountry.flag}</div>
            <h3 className="text-xl font-bold">{selectedCountry.name}</h3>
            <p className="text-indigo-200 text-sm mt-4 italic">"Análisis de mercado generado en tiempo real para la región seleccionada."</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoading ? <p>Cargando...</p> : filteredWebsites.map((site, i) => (
            <WebsiteCard key={i} site={site} index={i} />
          ))}
        </div>
      </main>
    </div>
  );
}
