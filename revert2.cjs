const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const regex2 = /<div className="max-w-xl mx-auto px-4 mt-2 sticky top-4 z-40 backdrop-blur-xl bg-slate-50\/80 dark:bg-slate-900\/80 rounded-3xl pb-2">([\s\S]*?)<\/div>\n      <\/div>/;

const oldCat = `<div className="max-w-xl mx-auto px-4 mt-6">
        <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide snap-x">
          <button
            onClick={() => setActiveCategory('all')}
            className={\`shrink-0 px-6 py-2 rounded-full font-bold transition-all border snap-center \${
              activeCategory === 'all' 
                 ? 'bg-[#e65c3b] border-[#e65c3b] text-white shadow-md shadow-orange-500/20' 
                 : 'bg-white dark:bg-slate-800 text-teal-900 dark:text-teal-100 border-gray-200 dark:border-slate-600 shadow-sm'
            }\`}
          >
            {t.all}
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={\`shrink-0 px-6 py-2 rounded-full font-bold transition-all border snap-center \${
                activeCategory === cat 
                   ? 'bg-[#e65c3b] border-[#e65c3b] text-white shadow-md shadow-orange-500/20' 
                   : 'bg-white dark:bg-slate-800 text-teal-900 dark:text-teal-100 border-gray-200 dark:border-slate-600 shadow-sm'
              }\`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>`;

if(regex2.test(content)) {
  content = content.replace(regex2, oldCat);
  console.log("Reverted categories");
}

fs.writeFileSync('src/App.tsx', content);
