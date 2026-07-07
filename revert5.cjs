const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

content = content.replace(
  /bg: 'from-slate-700 to-slate-900', shadow: 'shadow-slate-900\/40'/g,
  "bg: 'from-blue-500 to-cyan-400', shadow: 'shadow-cyan-500/40'"
);
content = content.replace(
  /bg: 'from-sky-700 to-sky-900', shadow: 'shadow-sky-900\/40'/g,
  "bg: 'from-cyan-500 to-teal-400', shadow: 'shadow-teal-500/40'"
);
content = content.replace(
  /bg: 'from-amber-600 to-amber-800', shadow: 'shadow-amber-900\/40'/g,
  "bg: 'from-orange-500 to-amber-400', shadow: 'shadow-orange-500/40'"
);
content = content.replace(
  /bg: 'from-red-700 to-red-900', shadow: 'shadow-red-900\/40'/g,
  "bg: 'from-red-500 to-orange-500', shadow: 'shadow-red-500/40'"
);
content = content.replace(
  /bg: 'from-orange-600 to-orange-800', shadow: 'shadow-orange-900\/40'/g,
  "bg: 'from-amber-500 to-yellow-400', shadow: 'shadow-amber-500/40'"
);
content = content.replace(
  /bg: 'from-stone-600 to-stone-800', shadow: 'shadow-stone-900\/40'/g,
  "bg: 'from-orange-600 to-amber-500', shadow: 'shadow-orange-600/40'"
);
content = content.replace(
  /bg: 'from-emerald-700 to-emerald-900', shadow: 'shadow-emerald-900\/40'/g,
  "bg: 'from-emerald-500 to-green-400', shadow: 'shadow-emerald-500/40'"
);
content = content.replace(
  /bg: 'from-teal-700 to-teal-900', shadow: 'shadow-teal-900\/40'/g,
  "bg: 'from-green-500 to-emerald-400', shadow: 'shadow-green-500/40'"
);
content = content.replace(
  /bg: 'from-yellow-600 to-yellow-800', shadow: 'shadow-yellow-900\/40'/g,
  "bg: 'from-yellow-400 to-amber-300', shadow: 'shadow-yellow-500/40'"
);
content = content.replace(
  /bg: 'from-slate-600 to-slate-800', shadow: 'shadow-slate-900\/40'/g,
  "bg: 'from-teal-500 to-emerald-400', shadow: 'shadow-teal-500/40'"
);
content = content.replace(
  /bg: 'from-indigo-700 to-indigo-900', shadow: 'shadow-indigo-900\/40'/g,
  "bg: 'from-purple-500 to-fuchsia-400', shadow: 'shadow-purple-500/40'"
);
content = content.replace(
  /bg: 'from-cyan-700 to-cyan-900', shadow: 'shadow-cyan-900\/40'/g,
  "bg: 'from-blue-400 to-cyan-300', shadow: 'shadow-blue-500/40'"
);
content = content.replace(
  /bg: 'from-blue-700 to-blue-900', shadow: 'shadow-blue-900\/40'/g,
  "bg: 'from-cyan-400 to-blue-300', shadow: 'shadow-cyan-500/40'"
);

fs.writeFileSync('src/App.tsx', content);
