export type Language = 'en' | 'ar' | 'fr' | 'es';

export interface MenuItem {
  id: string;
  category: { en: string; ar: string; fr: string; es: string };
  name: { en: string; ar: string; fr: string; es: string };
  description: { en: string; ar: string; fr: string; es: string };
  price: number;
  image: string;
}

export interface CartItem {
  cartItemId?: string;
  menuItem: MenuItem;
  quantity: number;
  options?: {
    flavor?: string;
    sugar?: string;
  };
}
