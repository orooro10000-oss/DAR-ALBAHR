const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const regex3 = /{\/\* Floating Cart Bar \*\/}([\s\S]*?)<\/div>\n\s*<\/div>\n\s*\)\}/;

const oldFloating = `      {/* Floating Cart Bar */}
      {(cart.length > 0 || sentItems.length > 0) && (
        <div className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none">
          <div className="max-w-xl mx-auto p-4 pointer-events-auto flex flex-col gap-2">
            {cart.length > 0 && (
              <motion.div 
                className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-xl border-2 border-slate-200 dark:border-slate-700 flex items-center gap-4"
                animate={!tableNumber ? { scale: [1, 1.01, 1], boxShadow: ["0px 0px 0px rgba(20,184,166,0)", "0px 0px 15px rgba(20,184,166,0.3)", "0px 0px 0px rgba(20,184,166,0)"] } : {}} 
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <label htmlFor="mainTableNumber" className="text-sm font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                  {t.tableNumber}:
                </label>
                <input
                  id="mainTableNumber"
                  type="text"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  className="flex-1 bg-slate-50 dark:bg-slate-900 rounded-xl px-4 py-2 border-2 border-transparent focus:border-teal-600 focus:ring-4 focus:ring-teal-600/20 outline-none transition-all font-bold placeholder-teal-700/40 dark:placeholder-teal-300/40"
                  placeholder={t.newOrderPlaceholder || (lang === 'ar' ? 'أدخل رقم الطاولة هنا...' : 'Enter table number here...')}
                />
              </motion.div>
            )}
            <div className="bg-[#133c38] rounded-2xl p-4 shadow-2xl flex items-center justify-between text-white">
              <button 
                onClick={() => setIsCartOpen(true)}
                className="flex items-center gap-3 hover:bg-white/10 px-4 py-2 rounded-xl transition-colors"
              >
                <div className="relative">
                  <ShoppingBag className="w-6 h-6" />
                  <span className="absolute -top-2 -right-2 bg-[#e65c3b] text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                    {cart.reduce((sum, item) => sum + item.quantity, 0) + sentItems.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                </div>
                <div className="text-left rtl:text-right">
                  <p className="text-sm font-medium text-teal-100/70">{lang === 'ar' ? 'عرض الطلب' : lang === 'fr' ? 'Voir Commande' : lang === 'es' ? 'Ver Pedido' : 'View Cart'}</p>
                  <p className="font-bold text-lg leading-none">{([...cart, ...sentItems].reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0)).toFixed(2)} {t.currency}</p>
                </div>
              </button>
              <button 
                onClick={handleSendOrder}
                className="bg-[#247065] hover:bg-[#1a554c] text-white px-6 py-3 rounded-xl font-bold transition-colors flex items-center gap-2"
              >
                <span>{t.sendOrder}</span>
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}`;

if(regex3.test(content)) {
  content = content.replace(regex3, oldFloating);
  console.log("Reverted floating cart");
}
fs.writeFileSync('src/App.tsx', content);
