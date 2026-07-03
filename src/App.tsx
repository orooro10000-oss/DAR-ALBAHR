import { useState, useEffect, useRef } from 'react';
import { ShoppingBag, Send, Globe, Plus, Minus, Trash2, Edit2, Check, Sun, Moon, FishSymbol, Sparkles, X, Download } from 'lucide-react';
import { menuItems as initialMenuItems, translations } from './data';
import { Language, CartItem, MenuItem } from './types';
import html2canvas from 'html2canvas';

export default function App() {
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem('dar_albahr_lang') as Language) || 'ar';
  });
  const [menu, setMenu] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('dar_albahr_menu_v10');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return initialMenuItems; }
    }
    return initialMenuItems;
  });
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('dar_albahr_cart_v10');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return []; }
    }
    return [];
  });
  const [tableNumber, setTableNumber] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const invoiceRef = useRef<HTMLDivElement>(null);

  useEffect(() => { localStorage.setItem('dar_albahr_menu_v10', JSON.stringify(menu)); }, [menu]);
  useEffect(() => { localStorage.setItem('dar_albahr_lang', lang); }, [lang]);
  useEffect(() => { localStorage.setItem('dar_albahr_cart_v10', JSON.stringify(cart)); }, [cart]);

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
    setShowInvoice(true);
  };

  const handleDownloadInvoice = async () => {
    if (!invoiceRef.current) return;
    try {
      const canvas = await html2canvas(invoiceRef.current, { 
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `Invoice_Dar_Al_Bahr_Table_${tableNumber || 'Order'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Failed to download invoice", err);
    }
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
                  <div key={item.id} className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex gap-4 cursor-pointer" onClick={() => !isEditing && setSelectedMenuItem(item)}>
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
                      
                      <div className="flex justify-between items-end mt-2" onClick={(e) => e.stopPropagation()}>
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

      </main>

      {/* Floating Cart Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none">
        <div className="max-w-xl mx-auto p-4 pointer-events-auto">
          <div className="bg-[#133c38] rounded-3xl p-4 shadow-2xl flex items-center justify-between text-white border border-teal-700/50">
            <button
              onClick={() => setIsCartOpen(true)}
              disabled={cart.length === 0}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold transition-all ${
                cart.length > 0 
                  ? 'bg-white/10 hover:bg-white/20' 
                  : 'opacity-50 cursor-not-allowed bg-white/5'
              }`}
            >
              <ShoppingBag className="w-5 h-5" />
              <span>{lang === 'ar' ? 'عرض الطلب' : 'View Cart'}</span>
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

      {/* Item Details Modal */}
      {selectedMenuItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setSelectedMenuItem(null)}>
          <div className="bg-white rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
            <div className="relative h-64 bg-[#f0e6d2]">
              {selectedMenuItem.image ? (
                <img src={selectedMenuItem.image} alt={selectedMenuItem.name[lang]} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FishSymbol className="w-16 h-16 text-[#d4c5a9]" />
                </div>
              )}
              <button 
                onClick={() => setSelectedMenuItem(null)}
                className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-white backdrop-blur-md rounded-full text-slate-800 transition-colors shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <h3 className="text-2xl font-black text-slate-800 mb-2">{selectedMenuItem.name[lang]}</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">{selectedMenuItem.description[lang]}</p>
              
              <div className="flex items-center justify-between mb-8">
                <span className="text-2xl font-black text-[#e65c3b]">{selectedMenuItem.price.toFixed(2)} {t.currency}</span>
              </div>

              {/* Action button inside modal */}
              {(() => {
                const cartItem = cart.find(c => c.menuItem.id === selectedMenuItem.id);
                const quantity = cartItem ? cartItem.quantity : 0;
                
                return quantity > 0 ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between bg-[#f8f6f0] rounded-2xl p-2 border border-gray-200">
                      <button onClick={() => updateQuantity(selectedMenuItem.id, -1)} className="p-4 rounded-xl bg-white shadow-sm text-gray-600 hover:text-red-500 transition-colors">
                        {quantity === 1 ? <Trash2 className="w-5 h-5" /> : <Minus className="w-5 h-5" />}
                      </button>
                      <span className="text-xl font-bold">{quantity}</span>
                      <button onClick={() => updateQuantity(selectedMenuItem.id, 1)} className="p-4 rounded-xl bg-[#247065] text-white shadow-sm hover:bg-[#1a554c] transition-colors">
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                    <button 
                      onClick={() => setSelectedMenuItem(null)}
                      className="w-full bg-slate-800 text-white py-4 rounded-2xl font-bold text-lg shadow-sm hover:bg-slate-700 transition-colors"
                    >
                      {lang === 'ar' ? 'تأكيد' : 'Confirm'}
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => addToCart(selectedMenuItem)}
                    className="w-full bg-[#247065] text-white py-4 rounded-2xl font-bold text-lg shadow-sm hover:bg-[#1a554c] transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    {t.addToCart}
                  </button>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Cart Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsCartOpen(false)}>
          <div className="bg-white rounded-[2rem] w-full max-w-xl mx-auto overflow-hidden shadow-2xl animate-in slide-in-from-bottom-8 duration-300 max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
            
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
              <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                <ShoppingBag className="w-6 h-6 text-teal-600" />
                {lang === 'ar' ? 'طلبك' : 'Your Order'}
              </h2>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 bg-slate-50/50">
              {cart.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>{lang === 'ar' ? 'السلة فارغة' : 'Cart is empty'}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.menuItem.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                      {item.menuItem.image ? (
                        <img src={item.menuItem.image} alt={item.menuItem.name[lang]} className="w-16 h-16 rounded-xl object-cover" />
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center">
                          <FishSymbol className="w-8 h-8 text-slate-300" />
                        </div>
                      )}
                      
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-800">{item.menuItem.name[lang]}</h4>
                        <div className="text-[#e65c3b] font-bold text-sm mt-1">
                          {(item.menuItem.price * item.quantity).toFixed(2)} {t.currency}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 bg-[#f8f6f0] rounded-xl p-1 border border-gray-200 shrink-0">
                        <button onClick={() => updateQuantity(item.menuItem.id, -1)} className="p-1.5 rounded-lg bg-white shadow-sm text-gray-600 hover:text-red-500">
                          {item.quantity === 1 ? <Trash2 className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                        </button>
                        <span className="w-6 text-center font-bold">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.menuItem.id, 1)} className="p-1.5 rounded-lg bg-white shadow-sm text-teal-700 hover:text-teal-900">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  <div className="mt-8 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <label htmlFor="modalTableNumber" className="block text-sm font-bold text-teal-900 mb-3 uppercase tracking-wider">
                      {t.tableNumber}
                    </label>
                    <input
                      id="modalTableNumber"
                      type="text"
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#f8f6f0] focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 outline-none transition-all text-lg font-bold"
                      placeholder={lang === 'ar' ? 'أدخل رقم الطاولة هنا (مثال: 5)' : 'Enter table number (e.g., 5)'}
                    />
                  </div>
                </div>
              )}
            </div>
            
            {cart.length > 0 && (
              <div className="p-6 bg-white border-t border-gray-100 shrink-0">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-slate-500 font-medium">{t.total}</span>
                  <span className="text-2xl font-black text-slate-800">{totalPrice.toFixed(2)} {t.currency}</span>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    handleSendOrder();
                  }}
                  className="w-full bg-[#247065] hover:bg-[#1a554c] text-white px-6 py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 shadow-md hover:shadow-xl hover:-translate-y-0.5"
                >
                  <Send className="w-6 h-6" />
                  <span>{t.sendOrder}</span>
                </button>
              </div>
            )}
            
          </div>
        </div>
      )}
      {/* Invoice Modal */}
      {showInvoice && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm transition-opacity" onClick={() => setShowInvoice(false)}>
          <div className="bg-white rounded-[2rem] w-full max-w-md mx-auto overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-100 flex justify-between items-center shrink-0">
              <h2 className="text-xl font-bold text-slate-800">{lang === 'ar' ? 'الفاتورة' : 'Invoice'}</h2>
              <button onClick={() => setShowInvoice(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 bg-white" ref={invoiceRef}>
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#133c38] text-white mb-3">
                  <FishSymbol className="w-8 h-8" />
                </div>
                <h1 className="text-2xl font-black text-slate-800">دار البحر</h1>
                <p className="text-sm text-slate-500">Dar Al Bahr</p>
                <div className="mt-2 text-sm font-bold text-slate-600 bg-slate-100 inline-block px-3 py-1 rounded-full">
                  {lang === 'ar' ? 'طاولة رقم' : 'Table'}: {tableNumber}
                </div>
              </div>

              <div className="border-t border-dashed border-gray-300 pt-4 mb-4">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start mb-3 text-sm">
                    <div className="flex-1 pr-4">
                      <span className="font-bold text-slate-800">{item.quantity}x</span> {item.menuItem.name[lang]}
                    </div>
                    <div className="font-bold text-slate-800 whitespace-nowrap">
                      {(item.menuItem.price * item.quantity).toFixed(2)} {t.currency}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-dashed border-gray-300 pt-4 flex justify-between items-center">
                <span className="text-lg font-bold text-slate-800">{t.total}</span>
                <span className="text-2xl font-black text-[#e65c3b]">{totalPrice.toFixed(2)} {t.currency}</span>
              </div>
              
              <div className="mt-8 text-center text-xs text-slate-400">
                {lang === 'ar' ? 'شكرا لزيارتكم!' : 'Thank you for your visit!'}
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-gray-100 shrink-0">
              <button
                onClick={handleDownloadInvoice}
                className="w-full bg-[#133c38] hover:bg-[#0f2e2b] text-white px-6 py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 shadow-md hover:shadow-lg"
              >
                <Download className="w-6 h-6" />
                <span>{lang === 'ar' ? 'تحميل الفاتورة' : 'Download Invoice'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
