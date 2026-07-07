const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

content = content.replace(
  /className="bg-white\/80 dark:bg-slate-800\/80 backdrop-blur-md rounded-3xl p-3\.5 shadow-\[0_8px_30px_rgb\(0,0,0,0\.04\)\] dark:shadow-\[0_8px_30px_rgb\(0,0,0,0\.2\)\] border border-white\/50 dark:border-slate-700\/50 flex gap-4 cursor-pointer hover:-translate-y-1 hover:shadow-\[0_8px_30px_rgb\(0,0,0,0\.08\)\] transition-all duration-300"/g,
  'className="bg-white dark:bg-slate-800 rounded-3xl p-4 shadow-sm border border-gray-100 dark:border-slate-700 flex gap-4 cursor-pointer"'
);

content = content.replace(
  /className={`w-\[5\.5rem\] h-\[5\.5rem\] rounded-2xl bg-gradient-to-br/g,
  'className={`w-24 h-24 rounded-2xl bg-gradient-to-br'
);

content = content.replace(
  /<style.icon className="w-10 h-10 drop-shadow-md"/g,
  '<style.icon className="w-12 h-12 drop-shadow-md"'
);

fs.writeFileSync('src/App.tsx', content);
