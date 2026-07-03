import { useState, useEffect } from 'react';
import { ShoppingBag, Send, Globe, Plus, Minus, Trash2, Edit2, Check, Sun, Moon, FishSymbol, Sparkles } from 'lucide-react';
import { menuItems as initialMenuItems, translations } from './data';
import { Language, CartItem, MenuItem } from './types';

export default function App() {
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem('dar_albahr_lang') as Language) || 'ar';
  });
  const [menu, setMenu] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('dar_albahr_menu_v7');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return initialMenuItems; }
    }
    return initialMenuItems;
  });
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('dar_albahr_cart_v7');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return []; }
    }
    return [];
  });
  const [tableNumber, setTableNumber] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  useEffect(() => { localStorage.setItem('dar_albahr_menu_v7', JSON.stringify(menu)); }, [menu]);
  useEffect(() => { localStorage.setItem('dar_albahr_lang', lang); }, [lang]);
  useEffect(() => { localStorage.setItem('dar_albahr_cart_v7', JSON.stringify(cart)); }, [cart]);

  const t = translations[lang];
  const isRtl = lang === 'ar';

  const toggleLanguage = () => setLang(lang === 'en' ? 'ar' : 'en');

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.menuItem.id === item.id);
      if (existing) {
        return prev.map((c) => c.menuItem.id === item.id ? { ...c, quantity: c.quantity + 1 } : c);
      }
      return [...prev, { menuItem: item, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev.map((c) => {
        if (c.menuItem.id === id) {
          const newQty = c.quantity + delta;
          return { ...c, quantity: Math.max(0, newQty) };
        }
        return c;
      }).filter((c) => c.quantity > 0)
    );
  };

  const updateMenuField = (id: string, field: 'price' | 'name' | 'description', value: string | number) => {
    setMenu(prev => prev.map(item => {
      if (item.id === id) {
        if (field === 'price') return { ...item, price: Number(value) };
        else if (field === 'name') return { ...item, name: { ...item.name, [lang]: String(value) } };
        else if (field === 'description') return { ...item, description: { ...item.description, [lang]: String(value) } };
      }
      return item;
    }));
    
    setCart(prev => prev.map(c => {
      if (c.menuItem.id === id) {
        if (field === 'price') return { ...c, menuItem: { ...c.menuItem, price: Number(value) } };
        else if (field === 'name') return { ...c, menuItem: { ...c.menuItem, name: { ...c.menuItem.name, [lang]: String(value) } } };
        else if (field === 'description') return { ...c, menuItem: { ...c.menuItem, description: { ...c.menuItem.description, [lang]: String(value) } } };
      }
      return c;
    }));
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSendOrder = () => {
    if (!tableNumber.trim()) { alert(t.tableRequired); return; }
    if (cart.length === 0) return;

    const phoneNumber = '212676025001';
    let text = `*New Order - ${t.restaurantName}*\nTable: ${tableNumber}\n------------------------\n`;
    cart.forEach(item => {
      text += `${item.quantity}x ${item.menuItem.name[lang]} - ${item.menuItem.price * item.quantity} ${t.currency}\n`;
    });
    text += `------------------------\n*${t.total}: ${totalPrice} ${t.currency}*`;

    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedText}`;
    window.open(whatsappUrl, '_blank');
  };

  // Group items by category
  const categories = menu.reduce((acc, item) => {
    const cat = item.category ? item.category[lang] : (lang === 'ar' ? 'أخرى' : 'Others');
    if (!acc.includes(cat)) acc.push(cat);
    return acc;
  }, [] as string[]);

  const filteredMenu = activeCategory === 'all' 
    ? menu 
    : menu.filter(item => (item.category ? item.category[lang] : (lang === 'ar' ? 'أخرى' : 'Others')) === activeCategory);

  const groupedMenu = filteredMenu.reduce((acc, item) => {
    const cat = item.category ? item.category[lang] : (lang === 'ar' ? 'أخرى' : 'Others');
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className={`min-h-screen font-sans bg-[#f8f6f0] text-slate-800 pb-40 ${isRtl ? 'font-arabic' : ''}`}>
      {/* Header Area */}
      <header className="bg-[#133c38] text-white rounded-b-[2rem] shadow-md pb-6 px-4 pt-8">
        <div className="max-w-xl mx-auto">
          <div className="flex justify-between items-start mb-6">
            <button 
              onClick={toggleLanguage}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors px-4 py-1.5 rounded-full text-sm font-medium border border-white/20"
            >
              <span className={lang === 'ar' ? 'font-bold' : ''}>عربي</span>
              <span className="text-white/40">|</span>
              <span className={lang === 'en' ? 'font-bold' : ''}>EN</span>
            </button>
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
      </header>

      {/* Category Filter */}
      <div className="max-w-xl mx-auto px-4 mt-6">
        <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide snap-x">
          <button
            onClick={() => setActiveCategory('all')}
            className={`shrink-0 px-6 py-2 rounded-full font-bold transition-all border snap-center ${
              activeCategory === 'all' 
                ? 'bg-[#247065] text-white border-[#247065] shadow-md' 
                : 'bg-white text-teal-900 border-gray-200 shadow-sm'
            }`}
          >
            {t.all}
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 px-6 py-2 rounded-full font-bold transition-all border snap-center ${
                activeCategory === cat 
                  ? 'bg-[#247065] text-white border-[#247065] shadow-md' 
                  : 'bg-white text-teal-900 border-gray-200 shadow-sm'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-xl mx-auto px-4 mt-8 space-y-8">
        {Object.entries(groupedMenu).map(([categoryName, items]) => (
          <div key={categoryName} className="mb-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px flex-1 bg-gray-300"></div>
              <h2 className="text-xl font-bold text-teal-950 flex items-center gap-2">
                {categoryName}
              </h2>
            </div>
            
            <div className="grid gap-4">
              {(items as MenuItem[]).map((item) => {
                const cartItem = cart.find(c => c.menuItem.id === item.id);
                const quantity = cartItem ? cartItem.quantity : 0;
                
                return (
                  <div key={item.id} className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex gap-4">
                    <div className="w-24 h-24 rounded-2xl bg-[#f0e6d2] shrink-0 overflow-hidden flex items-center justify-center p-2">
                       {item.image ? (
                          <img src={item.image} alt={item.name[lang]} className="w-full h-full object-cover rounded-xl" />
                       ) : (
                          <FishSymbol className="w-8 h-8 text-[#d4c5a9]" />
                       )}
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        {isEditing ? (
                          <input 
                            type="text" 
                            value={item.name[lang]} 
                            onChange={(e) => updateMenuField(item.id, 'name', e.target.value)}
                            className="font-bold text-lg w-full border-b border-gray-300 outline-none focus:border-teal-600 mb-1"
                          />
                        ) : (
                          <h3 className="font-bold text-lg text-slate-800 leading-tight">{item.name[lang]}</h3>
                        )}
                        
                        {isEditing ? (
                          <textarea
                            value={item.description[lang]}
                            onChange={(e) => updateMenuField(item.id, 'description', e.target.value)}
                            className="text-xs text-gray-500 w-full border-b border-gray-300 outline-none resize-none mt-1"
                            rows={2}
                          />
                        ) : (
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.description[lang]}</p>
                        )}
                      </div>
                      
                      <div className="flex justify-between items-end mt-2">
                        {isEditing ? (
                          <div className="flex items-center gap-1">
                            <input 
                              type="number" 
                              value={item.price} 
                              onChange={(e) => updateMenuField(item.id, 'price', e.target.value)}
                              className="font-bold text-sm w-16 border-b border-gray-300 outline-none focus:border-teal-600 text-[#e65c3b]"
                            />
                            <span className="text-xs text-[#e65c3b] font-bold border-b border-gray-300">{t.currency}</span>
                          </div>
                        ) : (
                          <span className="text-sm font-bold text-[#e65c3b] border border-[#e65c3b] border-dashed rounded-full px-3 py-1 bg-red-50/50">
                            {item.price.toFixed(2)} {t.currency}
                          </span>
                        )}
                        
                        {!isEditing && (
                          quantity > 0 ? (
                            <div className="flex items-center gap-3 bg-[#f8f6f0] rounded-xl p-1 border border-gray-200">
                              <button onClick={() => updateQuantity(item.id, -1)} className="p-1.5 rounded-lg bg-white shadow-sm text-gray-600 hover:text-red-500">
                                {quantity === 1 ? <Trash2 className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                              </button>
                              <span className="w-4 text-center font-bold text-sm">{quantity}</span>
                              <button onClick={() => updateQuantity(item.id, 1)} className="p-1.5 rounded-lg bg-white shadow-sm text-teal-700 hover:text-teal-900">
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <button 
                              onClick={() => addToCart(item)}
                              className="bg-[#247065] text-white px-5 py-2 rounded-xl font-bold text-sm shadow-sm hover:bg-[#1a554c] transition-colors"
                            >
                              {t.addToCart}
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {cart.length > 0 && (
          <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <label htmlFor="tableNumber" className="block text-sm font-bold text-teal-900 mb-3 uppercase tracking-wider">
              {t.tableNumber}
            </label>
            <input
              id="tableNumber"
              type="text"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-[#f8f6f0] focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 outline-none transition-all text-lg font-bold"
              placeholder={lang === 'ar' ? 'أدخل رقم الطاولة هنا (مثال: 5)' : 'Enter table number (e.g., 5)'}
            />
          </section>
        )}
      </main>

      {/* Floating Cart Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
        <div className="max-w-xl mx-auto p-4 pointer-events-auto">
          <div className="bg-[#133c38] rounded-3xl p-4 shadow-2xl flex items-center justify-between text-white border border-teal-700/50">
            <button
              onClick={handleSendOrder}
              disabled={cart.length === 0}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold transition-all ${
                cart.length > 0 
                  ? 'bg-white/10 hover:bg-white/20' 
                  : 'opacity-50 cursor-not-allowed bg-white/5'
              }`}
            >
              <Send className="w-5 h-5" />
              <span>{t.sendOrder}</span>
            </button>
            
            <div className="flex items-center gap-4">
              <div className="text-right flex flex-col items-end">
                 <span className="text-xs text-teal-100/70">{t.total}</span>
                 <span className="font-bold text-lg leading-tight">{totalPrice.toFixed(2)} {t.currency}</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#e65c3b] flex items-center justify-center font-bold text-lg shadow-inner">
                {totalItems}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
