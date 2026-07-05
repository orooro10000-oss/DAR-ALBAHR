import { useState, useEffect, useRef } from 'react';
import { 
  ShoppingBag, Send, Globe, Plus, Minus, Trash2, Edit2, Check, Sun, Moon, FishSymbol, Sparkles, X, Download,
  Fish, Flame, Soup, Beef, Salad, Utensils, Droplet, Coffee, CupSoda, GlassWater, UtensilsCrossed
} from 'lucide-react';
import { menuItems as initialMenuItems, translations } from './data';
import { Language, CartItem, MenuItem } from './types';
import { toPng } from 'html-to-image';
import { motion } from 'motion/react';

const getItemStyle = (id: string) => {
  if (id.includes('friture') || id.includes('fish')) return { icon: Fish, bg: 'from-blue-500 to-cyan-400', shadow: 'shadow-cyan-500/40' };
  if (id.includes('sardine')) return { icon: FishSymbol, bg: 'from-cyan-500 to-teal-400', shadow: 'shadow-teal-500/40' };
  if (id.includes('grilled')) return { icon: Flame, bg: 'from-orange-500 to-amber-400', shadow: 'shadow-orange-500/40' };
  if (id.includes('meat') || id.includes('beef')) return { icon: Beef, bg: 'from-red-500 to-orange-500', shadow: 'shadow-red-500/40' };
  if (id.includes('chicken')) return { icon: UtensilsCrossed, bg: 'from-amber-500 to-yellow-400', shadow: 'shadow-amber-500/40' };
  if (id.includes('tagine')) return { icon: Soup, bg: 'from-orange-600 to-amber-500', shadow: 'shadow-orange-600/40' };
  if (id.includes('bissara')) return { icon: Soup, bg: 'from-emerald-500 to-green-400', shadow: 'shadow-emerald-500/40' };
  if (id.includes('salad')) return { icon: Salad, bg: 'from-green-500 to-emerald-400', shadow: 'shadow-green-500/40' };
  if (id.includes('fries')) return { icon: Utensils, bg: 'from-yellow-400 to-amber-300', shadow: 'shadow-yellow-500/40' };
  if (id.includes('sauce')) return { icon: Droplet, bg: 'from-rose-500 to-pink-400', shadow: 'shadow-rose-500/40' };
  if (id.includes('rice') || id.includes('paella')) return { icon: Soup, bg: 'from-yellow-500 to-orange-400', shadow: 'shadow-yellow-500/40' };
  if (id.includes('water')) return { icon: GlassWater, bg: 'from-cyan-400 to-blue-400', shadow: 'shadow-cyan-500/40' };
  if (id.includes('soda')) return { icon: CupSoda, bg: 'from-violet-500 to-purple-400', shadow: 'shadow-violet-500/40' };
  if (id.includes('tea') || id.includes('coffee')) return { icon: Coffee, bg: 'from-amber-700 to-orange-600', shadow: 'shadow-amber-700/40' };
  return { icon: Utensils, bg: 'from-slate-500 to-gray-400', shadow: 'shadow-slate-500/40' };
};

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
    const saved = sessionStorage.getItem('dar_albahr_cart_v10');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return []; }
    }
    return [];
  });
  const [sentItems, setSentItems] = useState<CartItem[]>(() => {
    const saved = sessionStorage.getItem('dar_albahr_sent_cart_v10');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return []; }
    }
    return [];
  });
  const [tableNumber, setTableNumber] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<{ flavor: string; sugar: string }>({ flavor: 'mint', sugar: 'normal' });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [generatedInvoiceImg, setGeneratedInvoiceImg] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('dar_albahr_theme') === 'dark';
  });
  const invoiceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('dar_albahr_theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => { localStorage.setItem('dar_albahr_menu_v10', JSON.stringify(menu)); }, [menu]);
  useEffect(() => { localStorage.setItem('dar_albahr_lang', lang); }, [lang]);
  useEffect(() => { sessionStorage.setItem('dar_albahr_cart_v10', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { sessionStorage.setItem('dar_albahr_sent_cart_v10', JSON.stringify(sentItems)); }, [sentItems]);

  const t = translations[lang];
  const isRtl = lang === 'ar';

  const toggleLanguage = () => setLang(lang === 'en' ? 'ar' : 'en');

  const addToCart = (item: MenuItem, options?: { flavor?: string; sugar?: string }) => {
    setCart((prev) => {
      const cartItemId = options ? `${item.id}_${options.flavor}_${options.sugar}` : item.id;
      const existing = prev.find((c) => (c.cartItemId || c.menuItem.id) === cartItemId);
      if (existing) {
        return prev.map((c) => (c.cartItemId || c.menuItem.id) === cartItemId ? { ...c, quantity: c.quantity + 1 } : c);
      }
      return [...prev, { cartItemId, menuItem: item, quantity: 1, options }];
    });
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) =>
      prev.map((c) => {
        if ((c.cartItemId || c.menuItem.id) === cartItemId) {
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
  
  const grandTotalPrice = [...sentItems, ...cart].reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
  const grandTotalItems = [...sentItems, ...cart].reduce((sum, item) => sum + item.quantity, 0);

  const getOptionLabel = (type: string, value: string, language: string) => {
    if (type === 'flavor') {
      if (value === 'mint') return language === 'ar' ? 'بنعناع' : 'Mint';
      if (value === 'no_mint') return language === 'ar' ? 'بلا نعناع' : 'No Mint';
      if (value === 'louisa') return language === 'ar' ? 'باللويزة' : 'Louisa';
    }
    if (type === 'sugar') {
      if (value === 'extra') return language === 'ar' ? 'زايد سكر' : 'Extra Sugar';
      if (value === 'normal') return language === 'ar' ? 'سكر عادي' : 'Normal Sugar';
      if (value === 'less') return language === 'ar' ? 'ناقص سكر' : 'Less Sugar';
      if (value === 'none') return language === 'ar' ? 'مسوس' : 'No Sugar';
    }
    return '';
  };

  const handleSendOrder = () => {
    if (!tableNumber.trim()) { alert(t.tableRequired); return; }
    if (cart.length === 0) return;

    const phoneNumber = '212676025001';
    let text = sentItems.length > 0 ? `*Addition to Table: ${tableNumber} - ${t.restaurantName}*\n------------------------\n` : `*New Order - ${t.restaurantName}*\nTable: ${tableNumber}\n------------------------\n`;
    
    cart.forEach(item => {
      let itemOptions = '';
      if (item.options) {
        itemOptions = ` (${getOptionLabel('flavor', item.options.flavor || '', lang)}, ${getOptionLabel('sugar', item.options.sugar || '', lang)})`;
      }
      text += `${item.quantity}x ${item.menuItem.name[lang]}${itemOptions} - ${item.menuItem.price * item.quantity} ${t.currency}\n`;
    });
    
    if (sentItems.length > 0) {
      text += `------------------------\n*Addition Total: ${totalPrice} ${t.currency}*`;
      const grandTotal = [...sentItems, ...cart].reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
      text += `\n*Grand Total: ${grandTotal} ${t.currency}*`;
    } else {
      text += `------------------------\n*${t.total}: ${totalPrice} ${t.currency}*`;
    }

    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedText}`;
    window.open(whatsappUrl, '_blank');
    
    setSentItems(prev => [...prev, ...cart]);
    setCart([]);
    setShowInvoice(true);
  };

  const handleDownloadInvoice = async () => {
    if (!invoiceRef.current) return;
    setIsDownloading(true);
    try {
      const dataUrl = await toPng(invoiceRef.current, { 
        pixelRatio: 2,
        backgroundColor: '#ffffff'
      });
      
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File([blob], `Invoice_Dar_Al_Bahr_Table_${tableNumber || 'Order'}.png`, { type: 'image/png' });

      try {
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: lang === 'ar' ? 'فاتورة دار البحر' : 'Dar Al Bahr Invoice',
          });
          finishOrder();
          return;
        }
      } catch (shareErr) {
        console.log('Share failed or was cancelled', shareErr);
        finishOrder();
        return;
      }
      
      // Fallback
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(objectUrl);
      finishOrder();
    } catch (err) {
      console.error("Failed to download invoice", err);
      alert(lang === 'ar' ? 'عذراً، حدث خطأ أثناء تحميل الفاتورة' : 'Sorry, an error occurred while downloading the invoice');
    } finally {
      setIsDownloading(false);
    }
  };

  const finishOrder = () => {
    setCart([]);
    setSentItems([]);
    setTableNumber('');
    setShowInvoice(false);
    setGeneratedInvoiceImg(null);
    setIsCartOpen(false);
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
    <div dir={isRtl ? 'rtl' : 'ltr'} className={`min-h-screen font-sans bg-[#f8f6f0] dark:bg-slate-900 text-slate-800 dark:text-slate-100 pb-40 ${isRtl ? 'font-arabic' : ''}`}>
      {/* Header Area */}
      <header className="bg-[#133c38] text-white rounded-b-[2rem] shadow-md pb-6 px-4 pt-8">
        <div className="max-w-xl mx-auto">
          <div className="flex justify-between items-start mb-6">
            <div className="flex gap-2">
              <button 
                onClick={toggleLanguage}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors px-4 py-1.5 rounded-full text-sm font-medium border border-white/20"
              >
                <span className={lang === 'ar' ? 'font-bold' : ''}>عربي</span>
                <span className="text-white/40">|</span>
                <span className={lang === 'en' ? 'font-bold' : ''}>EN</span>
              </button>
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
      </header>

      {/* Category Filter */}
      <div className="max-w-xl mx-auto px-4 mt-6">
        <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide snap-x">
          <button
            onClick={() => setActiveCategory('all')}
            className={`shrink-0 px-6 py-2 rounded-full font-bold transition-all border snap-center ${
              activeCategory === 'all' 
                ? 'bg-[#247065] text-white border-[#247065] shadow-md' 
                : 'bg-white dark:bg-slate-800 text-teal-900 dark:text-teal-100 border-gray-200 dark:border-slate-600 shadow-sm'
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
                  : 'bg-white dark:bg-slate-800 text-teal-900 dark:text-teal-100 border-gray-200 dark:border-slate-600 shadow-sm'
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
                const itemCartItems = cart.filter(c => c.menuItem.id === item.id);
                const quantity = itemCartItems.reduce((sum, c) => sum + c.quantity, 0);
                const cartItem = itemCartItems[0];
                
                const style = getItemStyle(item.id);
                
                return (
                  <div key={item.id} className="bg-white dark:bg-slate-800 rounded-3xl p-4 shadow-sm border border-gray-100 dark:border-slate-700 flex gap-4 cursor-pointer" onClick={() => { if (!isEditing) { setSelectedMenuItem(item); setSelectedOptions({ flavor: 'mint', sugar: 'normal' }); } }}>
                    <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${style.bg} ${style.shadow} shadow-lg shrink-0 overflow-hidden flex items-center justify-center p-2 text-white relative`}>
                      <motion.div
                        animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                      >
                       <style.icon className="w-12 h-12 drop-shadow-md" strokeWidth={1.5} />
                      </motion.div>
                      <motion.div 
                        className="absolute inset-0 bg-white opacity-0"
                        animate={{ opacity: [0, 0.2, 0] }}
                        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                      />
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
                          <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 leading-tight">{item.name[lang]}</h3>
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
                            <div className="flex items-center gap-3 bg-[#f8f6f0] dark:bg-slate-900 rounded-xl p-1 border border-gray-200 dark:border-slate-600">
                              <button onClick={() => item.id === 'tea' ? setSelectedMenuItem(item) : updateQuantity(cartItem?.cartItemId || item.id, -1)} className="p-1.5 rounded-lg bg-white dark:bg-slate-800 shadow-sm text-gray-600 hover:text-red-500">
                                {quantity === 1 ? <Trash2 className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                              </button>
                              <span className="w-4 text-center font-bold text-sm">{quantity}</span>
                              <button onClick={() => item.id === 'tea' ? setSelectedMenuItem(item) : updateQuantity(cartItem?.cartItemId || item.id, 1)} className="p-1.5 rounded-lg bg-white dark:bg-slate-800 shadow-sm text-teal-700 dark:text-teal-300 hover:text-teal-900 dark:text-teal-100">
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <button 
                              onClick={() => item.id === 'tea' ? setSelectedMenuItem(item) : addToCart(item)}
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
      {(cart.length > 0 || sentItems.length > 0) && (
        <div className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none">
          <div className="max-w-xl mx-auto p-4 pointer-events-auto flex flex-col gap-2">
            {cart.length > 0 && (
              <div className="bg-white dark:bg-slate-800 rounded-3xl p-4 shadow-xl border border-gray-100 dark:border-slate-700 flex items-center gap-4">
                <label htmlFor="mainTableNumber" className="text-sm font-bold text-teal-900 dark:text-teal-100 whitespace-nowrap">
                  {t.tableNumber}:
                </label>
                <input
                  id="mainTableNumber"
                  type="text"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  className="flex-1 bg-[#f8f6f0] dark:bg-slate-900 rounded-xl px-4 py-2 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 outline-none transition-all font-bold"
                  placeholder={lang === 'ar' ? 'أدخل رقم الطاولة' : 'Table num'}
                />
              </div>
            )}
            <div className="bg-[#133c38] rounded-3xl p-4 shadow-2xl flex items-center justify-between text-white border border-teal-700/50">
              <button
                onClick={() => setIsCartOpen(true)}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl font-bold transition-all bg-white/10 hover:bg-white/20"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>{lang === 'ar' ? 'عرض الطلب' : 'View Cart'}</span>
              </button>
              
              <div className="flex items-center gap-4">
                <div className="text-right flex flex-col items-end">
                   <span className="text-xs text-teal-100/70">{t.total}</span>
                   <span className="font-bold text-lg leading-tight">{grandTotalPrice.toFixed(2)} {t.currency}</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#e65c3b] flex items-center justify-center font-bold text-lg shadow-inner">
                  {grandTotalItems}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Item Details Modal */}
      {selectedMenuItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setSelectedMenuItem(null)}>
          <div className="bg-white dark:bg-slate-800 rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
            <div className={`relative h-48 bg-gradient-to-br ${getItemStyle(selectedMenuItem.id).bg} flex items-center justify-center text-white overflow-hidden`}>
              {(() => { 
                const S = getItemStyle(selectedMenuItem.id).icon; 
                return (
                  <motion.div
                    animate={{ scale: [1, 1.15, 1], rotate: [0, 3, -3, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  >
                    <S className="w-24 h-24 drop-shadow-lg opacity-90 relative z-10" strokeWidth={1.5} />
                  </motion.div>
                );
              })()}
              <motion.div 
                className="absolute inset-0 bg-white opacity-0"
                animate={{ opacity: [0, 0.15, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              />
              <button 
                onClick={() => setSelectedMenuItem(null)}
                className="absolute top-4 right-4 p-2 bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 backdrop-blur-md rounded-full text-slate-800 dark:text-slate-100 transition-colors shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-2">{selectedMenuItem.name[lang]}</h3>
              <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">{selectedMenuItem.description[lang]}</p>
              
              <div className="flex items-center justify-between mb-6">
                <span className="text-2xl font-black text-[#e65c3b]">{selectedMenuItem.price.toFixed(2)} {t.currency}</span>
              </div>

              {selectedMenuItem.id === 'tea' && (
                <div className="space-y-4 mb-6">
                  <div>
                    <p className="font-bold text-sm text-slate-800 dark:text-slate-100 mb-2">{lang === 'ar' ? 'النكهة' : 'Flavor'}</p>
                    <div className="grid grid-cols-3 gap-2">
                      {['mint', 'no_mint', 'louisa'].map((f) => (
                        <button
                          key={f}
                          onClick={() => setSelectedOptions({ ...selectedOptions, flavor: f })}
                          className={`py-2 px-1 text-sm font-medium rounded-xl border ${selectedOptions.flavor === f ? 'bg-teal-50 border-teal-600 text-teal-800 dark:bg-teal-900/30 dark:border-teal-400 dark:text-teal-200' : 'bg-white border-gray-200 text-gray-600 dark:bg-slate-800 dark:border-slate-600 dark:text-gray-300'}`}
                        >
                          {getOptionLabel('flavor', f, lang)}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="font-bold text-sm text-slate-800 dark:text-slate-100 mb-2">{lang === 'ar' ? 'السكر' : 'Sugar'}</p>
                    <div className="grid grid-cols-4 gap-2">
                      {['extra', 'normal', 'less', 'none'].map((s) => (
                        <button
                          key={s}
                          onClick={() => setSelectedOptions({ ...selectedOptions, sugar: s })}
                          className={`py-2 px-1 text-sm font-medium rounded-xl border ${selectedOptions.sugar === s ? 'bg-teal-50 border-teal-600 text-teal-800 dark:bg-teal-900/30 dark:border-teal-400 dark:text-teal-200' : 'bg-white border-gray-200 text-gray-600 dark:bg-slate-800 dark:border-slate-600 dark:text-gray-300'}`}
                        >
                          {getOptionLabel('sugar', s, lang)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Action button inside modal */}
              {(() => {
                const cartItemId = selectedMenuItem.id === 'tea' ? `${selectedMenuItem.id}_${selectedOptions.flavor}_${selectedOptions.sugar}` : selectedMenuItem.id;
                const cartItem = cart.find(c => (c.cartItemId || c.menuItem.id) === cartItemId);
                const quantity = cartItem ? cartItem.quantity : 0;
                
                return quantity > 0 ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between bg-[#f8f6f0] dark:bg-slate-900 rounded-2xl p-2 border border-gray-200 dark:border-slate-600">
                      <button onClick={() => updateQuantity(cartItemId, -1)} className="p-4 rounded-xl bg-white dark:bg-slate-800 shadow-sm text-gray-600 hover:text-red-500 transition-colors">
                        {quantity === 1 ? <Trash2 className="w-5 h-5" /> : <Minus className="w-5 h-5" />}
                      </button>
                      <span className="text-xl font-bold">{quantity}</span>
                      <button onClick={() => updateQuantity(cartItemId, 1)} className="p-4 rounded-xl bg-[#247065] text-white shadow-sm hover:bg-[#1a554c] transition-colors">
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
                    onClick={() => addToCart(selectedMenuItem, selectedMenuItem.id === 'tea' ? selectedOptions : undefined)}
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
          <div className="bg-white dark:bg-slate-800 rounded-[2rem] w-full max-w-xl mx-auto overflow-hidden shadow-2xl animate-in slide-in-from-bottom-8 duration-300 max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
            
            <div className="p-6 border-b border-gray-100 dark:border-slate-700 flex items-center justify-between bg-white dark:bg-slate-800 shrink-0">
              <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <ShoppingBag className="w-6 h-6 text-teal-600" />
                {lang === 'ar' ? 'طلبك' : 'Your Order'}
              </h2>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="p-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:bg-slate-600 rounded-full text-slate-600 dark:text-slate-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 bg-slate-50/50 dark:bg-slate-900/50">
              {cart.length === 0 && sentItems.length === 0 ? (
                <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                  <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>{lang === 'ar' ? 'السلة فارغة' : 'Cart is empty'}</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {sentItems.length > 0 && (
                    <div>
                      <h4 className="font-bold text-sm text-slate-500 uppercase tracking-wider mb-3">
                        {lang === 'ar' ? 'طلبات سابقة' : 'Previously Ordered'}
                      </h4>
                      <div className="space-y-3 opacity-75 hover:opacity-100 transition-opacity">
                        {sentItems.map((item, idx) => {
                          const style = getItemStyle(item.menuItem.id);
                          return (
                          <div key={`sent-${idx}`} className="bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${style.bg} opacity-90 flex items-center justify-center text-white shrink-0 relative shadow-sm overflow-hidden`}>
                              <motion.div
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                              >
                                <style.icon className="w-6 h-6 drop-shadow-sm relative z-10" strokeWidth={1.5} />
                              </motion.div>
                              <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-0.5 border-2 border-white dark:border-slate-800 shadow-sm z-20">
                                <Check className="w-3 h-3 text-white" strokeWidth={3} />
                              </div>
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">{item.menuItem.name[lang]}</h4>
                              {item.options && (
                                <div className="text-[10px] text-slate-500 mt-0.5 flex flex-wrap gap-1">
                                  <span>{getOptionLabel('flavor', item.options.flavor || '', lang)}</span>
                                  <span>-</span>
                                  <span>{getOptionLabel('sugar', item.options.sugar || '', lang)}</span>
                                </div>
                              )}
                              <div className="text-slate-500 font-medium text-xs mt-0.5">
                                {item.quantity} x {item.menuItem.price.toFixed(2)} {t.currency}
                              </div>
                            </div>
                            <div className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                              {(item.menuItem.price * item.quantity).toFixed(2)} {t.currency}
                            </div>
                          </div>
                        )})}
                      </div>
                    </div>
                  )}
                  
                  {cart.length > 0 && (
                    <div>
                      {sentItems.length > 0 && (
                        <h4 className="font-bold text-sm text-slate-500 uppercase tracking-wider mb-3 mt-4">
                          {lang === 'ar' ? 'طلبات جديدة' : 'New Items'}
                        </h4>
                      )}
                      <div className="space-y-4">
                        {cart.map((item) => {
                          const style = getItemStyle(item.menuItem.id);
                          return (
                          <div key={item.cartItemId || item.menuItem.id} className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex items-center gap-4">
                            <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${style.bg} ${style.shadow} shadow-md flex items-center justify-center text-white shrink-0 relative overflow-hidden`}>
                              <motion.div
                                animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                              >
                                <style.icon className="w-8 h-8 drop-shadow-sm relative z-10" strokeWidth={1.5} />
                              </motion.div>
                              <motion.div 
                                className="absolute inset-0 bg-white opacity-0"
                                animate={{ opacity: [0, 0.2, 0] }}
                                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                              />
                            </div>
                            
                            <div className="flex-1">
                              <h4 className="font-bold text-slate-800 dark:text-slate-100">{item.menuItem.name[lang]}</h4>
                              {item.options && (
                                <div className="text-xs text-slate-500 mt-1 flex flex-wrap gap-1">
                                  <span className="bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">{getOptionLabel('flavor', item.options.flavor || '', lang)}</span>
                                  <span className="bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">{getOptionLabel('sugar', item.options.sugar || '', lang)}</span>
                                </div>
                              )}
                              <div className="text-[#e65c3b] font-bold text-sm mt-1">
                                {(item.menuItem.price * item.quantity).toFixed(2)} {t.currency}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3 bg-[#f8f6f0] dark:bg-slate-900 rounded-xl p-1 border border-gray-200 dark:border-slate-600 shrink-0">
                              <button onClick={() => updateQuantity(item.cartItemId || item.menuItem.id, -1)} className="p-1.5 rounded-lg bg-white dark:bg-slate-800 shadow-sm text-gray-600 hover:text-red-500">
                                {item.quantity === 1 ? <Trash2 className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                              </button>
                              <span className="w-6 text-center font-bold">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.cartItemId || item.menuItem.id, 1)} className="p-1.5 rounded-lg bg-white dark:bg-slate-800 shadow-sm text-teal-700 dark:text-teal-300 hover:text-teal-900 dark:text-teal-100">
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        )})}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {cart.length > 0 && (
              <div className="p-6 bg-white dark:bg-slate-800 border-t border-gray-100 dark:border-slate-700 shrink-0">
                <div className="mb-4">
                  <label htmlFor="modalTableNumber" className="block text-sm font-bold text-teal-900 dark:text-teal-100 mb-2 uppercase tracking-wider">
                    {t.tableNumber}
                  </label>
                  <input
                    id="modalTableNumber"
                    type="text"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-[#f8f6f0] dark:bg-slate-900 focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 outline-none transition-all text-lg font-bold"
                    placeholder={lang === 'ar' ? 'أدخل رقم الطاولة هنا' : 'Enter table number'}
                  />
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">{t.total}</span>
                  <span className="text-2xl font-black text-slate-800 dark:text-slate-100">{totalPrice.toFixed(2)} {t.currency}</span>
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
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm transition-opacity" onClick={() => { setShowInvoice(false); setGeneratedInvoiceImg(null); }}>
          <div className="bg-white dark:bg-slate-800 rounded-[2rem] w-full max-w-md mx-auto overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center shrink-0">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{lang === 'ar' ? 'الفاتورة' : 'Invoice'}</h2>
              <button onClick={() => { setShowInvoice(false); setGeneratedInvoiceImg(null); }} className="p-2 hover:bg-slate-100 dark:bg-slate-700 rounded-full text-slate-500 dark:text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 bg-white dark:bg-slate-800 relative">
              {generatedInvoiceImg ? (
                <div className="text-center">
                  <p className="text-sm text-teal-700 dark:text-teal-300 bg-teal-50 p-3 rounded-xl mb-4 border border-teal-100 font-medium">
                    {lang === 'ar' ? 'قم بالضغط مطولاً على الصورة لحفظها في هاتفك' : 'Long press the image to save it to your device'}
                  </p>
                  <img src={generatedInvoiceImg} alt="Invoice" className="w-full h-auto rounded-xl shadow-sm border border-gray-100 dark:border-slate-700" />
                </div>
              ) : (
                <div ref={invoiceRef} className="bg-white dark:bg-slate-800 p-8 max-w-sm mx-auto border border-gray-200 dark:border-slate-600 shadow-sm rounded-xl">
                  {/* Header */}
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#133c38] text-white mb-4 shadow-md">
                      <FishSymbol className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">دار البحر</h1>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">Dar Al Bahr</p>
                    <p className="text-xs text-slate-400 mt-1">Restaurant & Cafe</p>
                  </div>

                  {/* Order Info */}
                  <div className="border-t border-b border-gray-100 dark:border-slate-700 py-3 mb-6 text-sm flex justify-between text-slate-600 dark:text-slate-300">
                    <div>
                      <p><span className="font-bold text-slate-800 dark:text-slate-100">{lang === 'ar' ? 'التاريخ' : 'Date'}:</span> {new Date().toLocaleDateString('en-GB')}</p>
                      <p><span className="font-bold text-slate-800 dark:text-slate-100">{lang === 'ar' ? 'الوقت' : 'Time'}:</span> {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                    <div className="text-right">
                      <p><span className="font-bold text-slate-800 dark:text-slate-100">{lang === 'ar' ? 'رقم الطلب' : 'Order'}:</span> #{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}</p>
                      <p><span className="font-bold text-slate-800 dark:text-slate-100">{lang === 'ar' ? 'طاولة' : 'Table'}:</span> {tableNumber || '-'}</p>
                    </div>
                  </div>

                  {/* Items Header */}
                  <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 pb-2 border-b border-gray-100 dark:border-slate-700">
                    <span className="w-8">{lang === 'ar' ? 'كمية' : 'Qty'}</span>
                    <span className="flex-1">{lang === 'ar' ? 'الصنف' : 'Item'}</span>
                    <span className="text-right">{lang === 'ar' ? 'المجموع' : 'Total'}</span>
                  </div>

                  {/* Items */}
                  <div className="space-y-3 mb-6">
                    {[...sentItems, ...cart].map((item, idx) => (
                      <div key={idx} className="flex justify-between items-start text-sm">
                        <div className="w-8 font-bold text-slate-800 dark:text-slate-100">{item.quantity}</div>
                        <div className="flex-1 pr-4">
                          <p className="font-bold text-slate-800 dark:text-slate-100">{item.menuItem.name[lang]}</p>
                          {item.options && (
                            <p className="text-[10px] text-slate-500 mt-0.5">
                              {getOptionLabel('flavor', item.options.flavor || '', lang)} - {getOptionLabel('sugar', item.options.sugar || '', lang)}
                            </p>
                          )}
                          <p className="text-xs text-slate-500 dark:text-slate-400">{item.menuItem.price.toFixed(2)} {t.currency}</p>
                        </div>
                        <div className="font-bold text-slate-800 dark:text-slate-100 whitespace-nowrap text-right">
                          {(item.menuItem.price * item.quantity).toFixed(2)} {t.currency}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="border-t-2 border-dashed border-gray-200 dark:border-slate-600 pt-4 mb-8">
                    <div className="flex justify-between items-center mb-2 text-slate-600 dark:text-slate-300 text-sm">
                      <span>{lang === 'ar' ? 'المجموع الفرعي' : 'Subtotal'}</span>
                      <span>{[...sentItems, ...cart].reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0).toFixed(2)} {t.currency}</span>
                    </div>
                    <div className="flex justify-between items-center text-lg font-black text-slate-800 dark:text-slate-100 mt-2 pt-2 border-t border-gray-100 dark:border-slate-700">
                      <span>{t.total}</span>
                      <span className="text-2xl text-[#133c38]">{[...sentItems, ...cart].reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0).toFixed(2)} {t.currency}</span>
                    </div>
                  </div>
                  
                  {/* Footer */}
                  <div className="text-center">
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-1">
                      {lang === 'ar' ? 'شكرا لزيارتكم!' : 'Thank you for your visit!'}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {lang === 'ar' ? 'نتمنى رؤيتكم قريباً' : 'Hope to see you soon'}
                    </p>
                    <div className="mt-4 text-slate-300">
                      <Sparkles className="w-4 h-4 mx-auto" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 bg-slate-50 border-t border-gray-100 dark:border-slate-700 shrink-0">
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleDownloadInvoice}
                  disabled={isDownloading}
                  className={`w-full ${isDownloading ? 'bg-[#133c38]/70 cursor-not-allowed' : 'bg-[#133c38] hover:bg-[#0f2e2b] hover:shadow-lg'} text-white px-6 py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 shadow-md`}
                >
                  {isDownloading ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Download className="w-6 h-6" />
                  )}
                  <span>
                    {isDownloading 
                      ? (lang === 'ar' ? 'جاري التحضير...' : 'Processing...') 
                      : (lang === 'ar' ? 'تحميل الفاتورة' : 'Download Invoice')
                    }
                  </span>
                </button>
                <button
                  onClick={finishOrder}
                  disabled={isDownloading}
                  className={`w-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 px-6 py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 shadow-sm ${isDownloading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Check className="w-6 h-6" />
                  <span>{lang === 'ar' ? 'إنهاء الطلب بدون تحميل' : 'Finish Without Downloading'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
