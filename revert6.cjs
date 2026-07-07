const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// Replace general background
content = content.replace(/bg-slate-50 dark:bg-slate-900/g, 'bg-[#f8f6f0] dark:bg-slate-900');

// Modal cart background
content = content.replace(/bg-slate-50\/50 dark:bg-slate-900\/50/g, 'bg-teal-50 dark:bg-slate-900/50');
content = content.replace(/bg-slate-50 dark:bg-slate-900/g, 'bg-teal-50 dark:bg-slate-900');

// Category headers
content = content.replace(/text-slate-800 dark:text-slate-100 flex items-center/g, 'text-teal-950 flex items-center');

// Price tag
content = content.replace(/bg-slate-100 dark:bg-slate-700 rounded-full px-3 py-1/g, 'border border-[#e65c3b] border-dashed rounded-full px-3 py-1 bg-red-50/50');

// Price text
content = content.replace(/className="text-lg font-black text-slate-900 dark:text-white leading-none"/g, 'className="text-lg font-black text-[#e65c3b] leading-none"');
content = content.replace(/className="font-bold text-sm w-16 border-b border-gray-300 dark:border-slate-600 bg-transparent outline-none focus:border-slate-500 text-slate-900 dark:text-white"/g, 'className="font-bold text-sm w-16 border-b border-gray-300 outline-none focus:border-teal-600 text-[#e65c3b]"');
content = content.replace(/className="text-xs text-slate-900 dark:text-white font-bold border-b border-gray-300 dark:border-slate-600"/g, 'className="text-xs text-[#e65c3b] font-bold border-b border-gray-300"');

// Focus states
content = content.replace(/focus:border-slate-500/g, 'focus:border-teal-600');
content = content.replace(/focus:ring-slate-500\/30/g, 'focus:ring-teal-600/30');
content = content.replace(/focus:ring-slate-500\/20/g, 'focus:ring-teal-600/20');

// Options selection inside modal
content = content.replace(/bg-slate-100 border-slate-900 dark:border-slate-400 text-slate-900/g, 'bg-teal-50 border-teal-600 text-teal-800');
content = content.replace(/dark:bg-slate-700\/50 dark:border-slate-300 dark:text-slate-100/g, 'dark:bg-teal-900/30 dark:border-teal-400 dark:text-teal-200');
content = content.replace(/dark:bg-slate-700\/50 dark:border-slate-300 dark:text-slate-400/g, 'dark:bg-teal-900/30 dark:border-teal-400 dark:text-teal-200');

// Cart item modifiers
content = content.replace(/text-slate-700 dark:text-slate-300 hover:text-slate-800 dark:text-slate-200/g, 'text-teal-700 dark:text-teal-300 hover:text-slate-800 dark:text-slate-200');

// Add to cart button
content = content.replace(/bg-slate-900 dark:bg-slate-700 text-white py-4 rounded-2xl font-bold text-lg shadow-sm hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors/g, 'bg-[#247065] text-white py-4 rounded-2xl font-bold text-lg shadow-sm hover:bg-[#1a554c] transition-colors');
content = content.replace(/bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-700 text-white/g, 'bg-[#247065] hover:bg-[#1a554c] text-white');
content = content.replace(/bg-slate-900 dark:bg-slate-700/g, 'bg-[#247065]');

// Modal text
content = content.replace(/text-slate-900 dark:text-white font-bold text-sm mt-1/g, 'text-[#e65c3b] font-bold text-sm mt-1');
content = content.replace(/text-slate-900 dark:text-white font-black/g, 'text-[#e65c3b] font-black');

// Success toast
content = content.replace(/border-slate-200 dark:border-slate-700/g, 'border-teal-500/20');
content = content.replace(/bg-slate-900 dark:bg-white text-white dark:text-slate-900/g, 'bg-[#e65c3b]');

// Replace Download Invoice button
content = content.replace(/bg-slate-900 border-b border-slate-800\/70/g, 'bg-[#247065] border-b border-[#1a554c]');
content = content.replace(/bg-slate-900 border-b border-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700/g, 'bg-[#247065] border-b border-[#1a554c] hover:bg-[#1a554c]');
content = content.replace(/bg-slate-900 border-b border-slate-800/g, 'bg-[#247065] border-b border-[#1a554c]');

// Invoice header fish icon background
content = content.replace(/bg-slate-900 border-b border-slate-800 text-white/g, 'bg-[#247065] border-b border-[#1a554c] text-white');

fs.writeFileSync('src/App.tsx', content);
