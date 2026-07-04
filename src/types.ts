export type Language = 'en' | 'ar';

export interface MenuItem {
  id: string;
  category: { en: string; ar: string };
  name: { en: string; ar: string };
  description: { en: string; ar: string };
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
