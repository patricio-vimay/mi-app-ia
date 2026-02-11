
import React, { useState, useEffect, useCallback, useMemo } from 'react';

const App: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<CountryInfo>(ENGLISH_SPEAKING_COUNTRIES[0]);
  const [websites, setWebsites] = useState<WebsiteData[]>([]);
  const [sources, setSources] = useState<GroundingSource[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);

  const loadData = useCallback(async (country: CountryInfo) => {
    setIsLoading(true);
    setError(null);
    setSearchQuery('');
    try {
      const result = await fetchTopWebsites(country.name);
      setWebsites(result.data);
      setSources(result.sources);
    } catch (err) {
      setError("Failed to retrieve current data. Please try again in a few moments.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData(selectedCountry);
  }, [selectedCountry, loadData]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCountryChange = (country: CountryInfo) => {
    if (country.id === selectedCountry.id) return;
    setSelectedCountry(country);
  };

  const filteredWebsites = useMemo(() => {
    return websites.filter(site => 
      site.websiteUrl.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [websites, searchQuery]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen pb-20 relative">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <i className="fa-solid fa-chart-line text-white text-xl"></i>
              </div>
              <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                {APP_TITLE}
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full text-[10px] font-bold text-slate-500 uppercase">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Grounded 100+ Live Search
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Country Picker Section */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Select Region</h2>
          </div>
          <CountrySelector 
            selectedId={selectedCountry.id} 
            onSelect={handleCountryChange} 
          />
        </section>

        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <i className="fa-solid fa-triangle-exclamation text-red-500 text-4xl mb-4"></i>
            <h3 className="text-lg font-bold text-red-800 mb-2">Something went wrong</h3>
            <p className="text-red-600 mb-6">{error}</p>
            <button 
              onClick={() => loadData(selectedCountry)}
              className="px-6 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            {/* Dashboard Overview */}
            <section className="mb-12">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Stats Card */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">Top 10 Traffic Share</h3>
                      <p className="text-sm text-slate-500">Competitive overview for {selectedCountry.name}</p>
                    </div>
                    {isLoading && <i className="fa-solid fa-circle-notch fa-spin text-indigo-600 text-xl"></i>}
                  </div>
                  
                  {isLoading ? (
                    <div className="h-[300px] flex items-center justify-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                        <p className="text-sm text-slate-400 font-medium">Gathering market intelligence...</p>
                      </div>
                    </div>
                  ) : websites.length > 0 ? (
                    <AnalyticsChart data={websites.slice(0, 10)} />
                  ) : (
                    <div className="h-[300px] flex items-center justify-center text-slate-400 italic">
                      Waiting for data...
                    </div>
                  )}
                </div>

                {/* Country Insights Card */}
                <div className="bg-indigo-900 rounded-2xl p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-200">
                  <div className="relative z-10 h-full flex flex-col">
                    <div className="text-5xl mb-4">{selectedCountry.flag}</div>
                    <h3 className="text-2xl font-black mb-2">{selectedCountry.name}</h3>
                    <p className="text-indigo-100 text-sm leading-relaxed mb-8">
                      Displaying the top 100 most visited digital properties. This comprehensive view captures the unique online behaviors and industry leaders in {selectedCountry.name}.
                    </p>
                    
                    <div className="mt-auto space-y-4">
                      <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/10">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-200 mb-1">Market Scope</p>
                        <p className="text-lg font-bold">100 Companies</p>
                      </div>
                      <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/10">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-200 mb-1">Search Integrity</p>
                        <div className="flex items-center gap-2">
                          <i className="fa-solid fa-shield-check text-green-400"></i>
                          <p className="text-lg font-bold">Verified Data</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500 rounded-full blur-3xl opacity-20"></div>
                </div>
              </div>
            </section>

            {/* List Section */}
            <section id="results-list">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">The Top 100 Leaderboard</h3>
                  <p className="text-sm text-slate-500 font-medium">Browse and search through the top digital entities</p>
                </div>
                
                <div className="relative">
                  <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                  <input 
                    type="text" 
                    placeholder="Search company, URL or category..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl w-full md:w-80 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
                  />
                </div>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="bg-white rounded-xl p-4 border border-slate-100 animate-pulse h-[200px]">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded bg-slate-100"></div>
                          <div className="h-4 w-24 bg-slate-100 rounded"></div>
                        </div>
                        <div className="h-4 w-12 bg-slate-100 rounded"></div>
                      </div>
                      <div className="h-3 w-full bg-slate-100 rounded mb-2"></div>
                      <div className="h-3 w-5/6 bg-slate-100 rounded mb-6"></div>
                      <div className="flex gap-2 mt-auto">
                        <div className="h-8 flex-1 bg-slate-100 rounded-lg"></div>
                        <div className="h-8 flex-1 bg-slate-100 rounded-lg"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredWebsites.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredWebsites.map((site, index) => (
                    <WebsiteCard key={`${site.websiteUrl}-${index}`} site={site} index={index} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-20 text-center border border-dashed border-slate-200">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fa-solid fa-magnifying-glass text-slate-400 text-xl"></i>
                  </div>
                  <h4 className="text-lg font-bold text-slate-800 mb-1">No results found</h4>
                  <p className="text-slate-500">Try adjusting your search terms for "{searchQuery}"</p>
                </div>
              )}
            </section>

            {/* Sources */}
            {!isLoading && sources.length > 0 && (
              <section className="mt-16 pb-10">
                <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Verification Sources</h4>
                  <div className="flex flex-wrap gap-4">
                    {sources.map((source, i) => (
                      <a 
                        key={i} 
                        href={source.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-indigo-500 hover:text-indigo-700 font-medium underline transition-colors"
                      >
                        {source.title}
                      </a>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </>
        )}
      </main>

      {/* Floating Back to Top Button */}
      {showScrollTop && (
        <button 
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-indigo-700 transition-all z-40 transform hover:scale-110 active:scale-95 animate-bounce"
        >
          <i className="fa-solid fa-arrow-up"></i>
        </button>
      )}

      {/* Footer Branding */}
      <footer className="mt-auto py-10 text-center">
        <p className="text-sm text-slate-400 font-medium">
          © 2024 Global Web Analytics Explorer • Deep Insight for 100+ Sites • Powered by Gemini Search
        </p>
      </footer>
    </div>
  );
};

export default App;
