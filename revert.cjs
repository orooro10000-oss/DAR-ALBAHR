const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// Header
const newHeaderStart = content.indexOf('<header className="relative w-full rounded-b-[2.5rem]');
const newHeaderEnd = content.indexOf('</header>') + 9;
if (newHeaderStart !== -1) {
  content = content.substring(0, newHeaderStart) + `<header className="bg-[#133c38] text-white rounded-b-[2rem] shadow-md pb-6 px-4 pt-8">
        <div className="max-w-xl mx-auto">
          <div className="flex justify-between items-start mb-6">
            <div className="flex gap-2">
              <div className="relative">
                <button 
                  onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors px-4 py-1.5 rounded-full text-sm font-medium border border-white/20"
                >
                  <Globe className="w-4 h-4" />
                  <span className="font-bold">
                    {lang === 'ar' ? 'عربي' : lang === 'en' ? 'EN' : lang === 'fr' ? 'FR' : 'ES'}
                  </span>
                  <ChevronDown className={\`w-4 h-4 transition-transform \${isLanguageMenuOpen ? 'rotate-180' : ''}\`} />
                </button>
                
                {isLanguageMenuOpen && (
                  <div className="absolute top-full left-0 mt-2 w-32 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 overflow-hidden z-50">
                    <button 
                      onClick={() => { setLang('ar'); setIsLanguageMenuOpen(false); }}
                      className={\`w-full text-left px-4 py-3 text-sm font-medium transition-colors hover:bg-slate-50 dark:hover:bg-slate-700 \${lang === 'ar' ? 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20' : 'text-slate-700 dark:text-slate-200'}\`}
                    >
                      العربية
                    </button>
                    <button 
                      onClick={() => { setLang('en'); setIsLanguageMenuOpen(false); }}
                      className={\`w-full text-left px-4 py-3 text-sm font-medium transition-colors hover:bg-slate-50 dark:hover:bg-slate-700 border-t border-gray-50 dark:border-slate-700/50 \${lang === 'en' ? 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20' : 'text-slate-700 dark:text-slate-200'}\`}
                    >
                      English
                    </button>
                    <button 
                      onClick={() => { setLang('fr'); setIsLanguageMenuOpen(false); }}
                      className={\`w-full text-left px-4 py-3 text-sm font-medium transition-colors hover:bg-slate-50 dark:hover:bg-slate-700 border-t border-gray-50 dark:border-slate-700/50 \${lang === 'fr' ? 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20' : 'text-slate-700 dark:text-slate-200'}\`}
                    >
                      Français
                    </button>
                    <button 
                      onClick={() => { setLang('es'); setIsLanguageMenuOpen(false); }}
                      className={\`w-full text-left px-4 py-3 text-sm font-medium transition-colors hover:bg-slate-50 dark:hover:bg-slate-700 border-t border-gray-50 dark:border-slate-700/50 \${lang === 'es' ? 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20' : 'text-slate-700 dark:text-slate-200'}\`}
                    >
                      Español
                    </button>
                  </div>
                )}
              </div>
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white border border-white/20 transition-colors"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
            <div className="flex items-center gap-3 text-right">
              <div>
                <h1 className="text-2xl font-black tracking-tight">{t.restaurantName}</h1>
                <p className="text-sm text-teal-100/80">{t.restaurantSubname}</p>
              </div>
              <FishSymbol className="w-10 h-10 text-white stroke-[1.5]" />
            </div>
          </div>
          
          <div className="border-t border-dashed border-teal-700/50 pt-4 flex items-center justify-center gap-2">
            <p className="text-sm text-teal-50">{t.slogan}</p>
            <Sparkles className="w-4 h-4 text-teal-200" />
          </div>
        </div>
      </header>` + content.substring(newHeaderEnd);
}

fs.writeFileSync('src/App.tsx', content);
