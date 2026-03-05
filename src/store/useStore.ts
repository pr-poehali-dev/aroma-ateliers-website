import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Category = 'candles' | 'diffusers' | 'car' | 'gifts' | 'spring';

export interface Product {
  id: number;
  name: string;
  category: Category;
  price: number;
  oldPrice?: number;
  image: string;
  images: string[];
  description: string;
  notes: string[];
  details: { label: string; value: string }[];
  inStock: boolean;
  isNew?: boolean;
  isBestseller?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  status: 'processing' | 'shipped' | 'delivered';
  items: CartItem[];
  total: number;
  address: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  city: string;
  address: string;
}

interface StoreState {
  // Cart
  cart: CartItem[];
  cartOpen: boolean;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, qty: number) => void;
  clearCart: () => void;
  setCartOpen: (open: boolean) => void;
  getCartTotal: () => number;
  getCartCount: () => number;

  // Wishlist
  wishlist: number[];
  toggleWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;

  // Orders
  orders: Order[];
  addOrder: (order: Order) => void;

  // Profile
  profile: UserProfile;
  updateProfile: (profile: Partial<UserProfile>) => void;

  // UI
  currentPage: string;
  selectedCategory: Category | 'all';
  searchQuery: string;
  setPage: (page: string) => void;
  setCategory: (cat: Category | 'all') => void;
  setSearch: (q: string) => void;

  // Admin
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: number, data: Partial<Product>) => void;
  deleteProduct: (id: number) => void;

  // Edit mode
  editMode: boolean;
  toggleEditMode: () => void;
}

const BOURBON_VANILLA_IMG = 'https://cdn.poehali.dev/projects/23c853e5-11a8-499d-a01d-8924ecd92d41/bucket/7b886d5d-befe-4363-81e7-8166652c1b04.jpg';
const BACCARAT_ROUGE_IMG = 'https://cdn.poehali.dev/projects/23c853e5-11a8-499d-a01d-8924ecd92d41/bucket/51a48d3d-e1eb-4479-99af-8d4fb06f552e.JPG';
const PEONY_SUEDE_IMG = 'https://cdn.poehali.dev/projects/23c853e5-11a8-499d-a01d-8924ecd92d41/bucket/4e7106bc-9631-40b0-8b10-90349c1b9ada.jpg';
const MANDARINE_IMG = 'https://cdn.poehali.dev/projects/23c853e5-11a8-499d-a01d-8924ecd92d41/bucket/1e631638-d48e-4abd-934b-c3eab7b065a9.JPG';
const STRAWBERRY_IMG = 'https://cdn.poehali.dev/projects/23c853e5-11a8-499d-a01d-8924ecd92d41/bucket/954b36b2-4793-4330-bbf2-a1dc7c6518a1.jpg';
const CANDLE_IMG = BOURBON_VANILLA_IMG;
const DIFFUSER_IMG = BACCARAT_ROUGE_IMG;
const GIFT_IMG = PEONY_SUEDE_IMG;
const SPRING_IMG = MANDARINE_IMG;
const CAR_IMG = STRAWBERRY_IMG;

const initialProducts: Product[] = [
  {
    id: 1,
    name: 'Бергамот и белый чай',
    category: 'candles',
    price: 2800,
    image: CANDLE_IMG,
    images: [CANDLE_IMG],
    description: 'Изысканная свеча ручной работы с нотами свежего бергамота, белого чая и мягкого мускуса. Создаёт атмосферу умиротворённого утра.',
    notes: ['Бергамот', 'Белый чай', 'Жасмин', 'Мускус'],
    details: [
      { label: 'Объём', value: '250 мл' },
      { label: 'Время горения', value: 'до 50 часов' },
      { label: 'Воск', value: 'Соевый, натуральный' },
      { label: 'Фитиль', value: 'Хлопковый' },
    ],
    inStock: true,
    isBestseller: true,
  },
  {
    id: 2,
    name: 'Сандал и ваниль',
    category: 'candles',
    price: 3200,
    image: CANDLE_IMG,
    images: [CANDLE_IMG],
    description: 'Глубокий, обволакивающий аромат сандалового дерева с нотами ванили и тёплого янтаря. Для вечерних моментов уединения.',
    notes: ['Сандал', 'Ваниль', 'Янтарь', 'Пачули'],
    details: [
      { label: 'Объём', value: '350 мл' },
      { label: 'Время горения', value: 'до 70 часов' },
      { label: 'Воск', value: 'Соевый, натуральный' },
      { label: 'Фитиль', value: 'Деревянный' },
    ],
    inStock: true,
  },
  {
    id: 3,
    name: 'Лаванда Прованса',
    category: 'candles',
    price: 2400,
    image: CANDLE_IMG,
    images: [CANDLE_IMG],
    description: 'Классический аромат прованской лаванды с нотами розмарина и эвкалипта. Успокаивает и расслабляет.',
    notes: ['Лаванда', 'Розмарин', 'Эвкалипт', 'Кедр'],
    details: [
      { label: 'Объём', value: '200 мл' },
      { label: 'Время горения', value: 'до 40 часов' },
      { label: 'Воск', value: 'Соевый, натуральный' },
      { label: 'Фитиль', value: 'Хлопковый' },
    ],
    inStock: true,
    isNew: true,
  },
  {
    id: 4,
    name: 'Роза и уд',
    category: 'diffusers',
    price: 4200,
    image: DIFFUSER_IMG,
    images: [DIFFUSER_IMG],
    description: 'Роскошный диффузор с ароматом дамасской розы и редкого удового дерева. Наполняет пространство богатством и теплом.',
    notes: ['Дамасская роза', 'Уд', 'Мускус', 'Амбра'],
    details: [
      { label: 'Объём', value: '200 мл' },
      { label: 'Продолжительность', value: 'до 3 месяцев' },
      { label: 'Тростники', value: '8 штук в наборе' },
    ],
    inStock: true,
    isBestseller: true,
  },
  {
    id: 5,
    name: 'Древесный дым',
    category: 'diffusers',
    price: 3800,
    image: DIFFUSER_IMG,
    images: [DIFFUSER_IMG],
    description: 'Медитативный аромат дымного кедра, ветивера и тёплой земли. Для пространств с характером.',
    notes: ['Кедр', 'Ветивер', 'Берёза', 'Земля'],
    details: [
      { label: 'Объём', value: '150 мл' },
      { label: 'Продолжительность', value: 'до 2 месяцев' },
      { label: 'Тростники', value: '6 штук в наборе' },
    ],
    inStock: true,
  },
  {
    id: 6,
    name: 'Черная орхидея',
    category: 'diffusers',
    price: 4600,
    image: DIFFUSER_IMG,
    images: [DIFFUSER_IMG],
    description: 'Загадочный аромат чёрной орхидеи, бархатистого мускуса и тёмного шоколада. Для особых интерьеров.',
    notes: ['Чёрная орхидея', 'Тёмный шоколад', 'Мускус', 'Пачули'],
    details: [
      { label: 'Объём', value: '250 мл' },
      { label: 'Продолжительность', value: 'до 4 месяцев' },
      { label: 'Тростники', value: '10 штук в наборе' },
    ],
    inStock: true,
    isNew: true,
  },
  {
    id: 7,
    name: 'Дорожный эспрессо',
    category: 'car',
    price: 1200,
    image: CAR_IMG,
    images: [CAR_IMG],
    description: 'Энергичный аромат свежего эспрессо с нотами кардамона и кожи. Бодрит и концентрирует внимание в дороге.',
    notes: ['Эспрессо', 'Кардамон', 'Кожа', 'Кедр'],
    details: [
      { label: 'Продолжительность', value: 'до 45 дней' },
      { label: 'Крепление', value: 'На вентиляцию' },
    ],
    inStock: true,
  },
  {
    id: 8,
    name: 'Морской бриз',
    category: 'car',
    price: 1100,
    image: CAR_IMG,
    images: [CAR_IMG],
    description: 'Свежий морской аромат с нотами солёного воздуха, водорослей и белого мускуса. Дарит ощущение свободы.',
    notes: ['Морская соль', 'Водоросли', 'Бергамот', 'Мускус'],
    details: [
      { label: 'Продолжительность', value: 'до 30 дней' },
      { label: 'Крепление', value: 'На зеркало' },
    ],
    inStock: true,
    isBestseller: true,
  },
  {
    id: 9,
    name: 'Подарочный набор «Классика»',
    category: 'gifts',
    price: 6500,
    oldPrice: 7800,
    image: GIFT_IMG,
    images: [GIFT_IMG],
    description: 'Элегантный подарочный набор из двух ароматных свечей и диффузора в фирменной упаковке. Идеальный подарок.',
    notes: ['Бергамот', 'Сандал', 'Мускус'],
    details: [
      { label: 'Состав', value: '2 свечи + диффузор' },
      { label: 'Упаковка', value: 'Фирменная коробка с лентой' },
    ],
    inStock: true,
  },
  {
    id: 10,
    name: 'Набор «Весенний ритуал»',
    category: 'gifts',
    price: 5200,
    image: GIFT_IMG,
    images: [GIFT_IMG],
    description: 'Весенняя коллекция из трёх миниатюр и ароматной свечи в нежной пастельной упаковке.',
    notes: ['Пион', 'Роза', 'Ландыш', 'Зелень'],
    details: [
      { label: 'Состав', value: '3 миниатюры + свеча 100 мл' },
      { label: 'Упаковка', value: 'Подарочная коробка' },
    ],
    inStock: true,
    isNew: true,
  },
  {
    id: 11,
    name: 'Пион и роса',
    category: 'spring',
    price: 2600,
    image: SPRING_IMG,
    images: [SPRING_IMG],
    description: 'Весенний аромат цветущего пиона, утренней росы и зелёных листьев. Живой и воздушный.',
    notes: ['Пион', 'Роса', 'Зелёные листья', 'Мускус'],
    details: [
      { label: 'Объём', value: '220 мл' },
      { label: 'Время горения', value: 'до 45 часов' },
      { label: 'Воск', value: 'Соевый' },
    ],
    inStock: true,
    isNew: true,
  },
  {
    id: 12,
    name: 'Сирень и берёза',
    category: 'spring',
    price: 2400,
    image: SPRING_IMG,
    images: [SPRING_IMG],
    description: 'Нежный аромат весенней сирени с берёзовыми нотами и свежестью первых дней тепла.',
    notes: ['Сирень', 'Берёза', 'Ландыш', 'Кедр'],
    details: [
      { label: 'Объём', value: '200 мл' },
      { label: 'Время горения', value: 'до 40 часов' },
      { label: 'Воск', value: 'Соевый' },
    ],
    inStock: true,
  },
];

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Cart
      cart: [],
      cartOpen: false,
      addToCart: (product) => {
        const cart = get().cart;
        const existing = cart.find(item => item.product.id === product.id);
        if (existing) {
          set({ cart: cart.map(item =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )});
        } else {
          set({ cart: [...cart, { product, quantity: 1 }] });
        }
        set({ cartOpen: true });
      },
      removeFromCart: (productId) =>
        set({ cart: get().cart.filter(item => item.product.id !== productId) }),
      updateQuantity: (productId, qty) => {
        if (qty <= 0) {
          get().removeFromCart(productId);
          return;
        }
        set({ cart: get().cart.map(item =>
          item.product.id === productId ? { ...item, quantity: qty } : item
        )});
      },
      clearCart: () => set({ cart: [] }),
      setCartOpen: (open) => set({ cartOpen: open }),
      getCartTotal: () => get().cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
      getCartCount: () => get().cart.reduce((sum, item) => sum + item.quantity, 0),

      // Wishlist
      wishlist: [],
      toggleWishlist: (productId) => {
        const wl = get().wishlist;
        set({ wishlist: wl.includes(productId) ? wl.filter(id => id !== productId) : [...wl, productId] });
      },
      isInWishlist: (productId) => get().wishlist.includes(productId),

      // Orders
      orders: [
        {
          id: 'AA-001',
          date: '2026-02-15',
          status: 'delivered',
          items: [{ product: initialProducts[0], quantity: 1 }, { product: initialProducts[3], quantity: 1 }],
          total: 7000,
          address: 'Москва, ул. Пушкина, д. 10',
        }
      ],
      addOrder: (order) => set({ orders: [order, ...get().orders] }),

      // Profile
      profile: {
        name: '',
        email: '',
        phone: '',
        city: '',
        address: '',
      },
      updateProfile: (data) => set({ profile: { ...get().profile, ...data } }),

      // UI
      currentPage: 'home',
      selectedCategory: 'all',
      searchQuery: '',
      setPage: (page) => set({ currentPage: page }),
      setCategory: (cat) => set({ selectedCategory: cat }),
      setSearch: (q) => set({ searchQuery: q }),

      // Admin / Products
      products: initialProducts,
      addProduct: (product) => {
        const products = get().products;
        const newId = Math.max(...products.map(p => p.id)) + 1;
        set({ products: [...products, { ...product, id: newId }] });
      },
      updateProduct: (id, data) => set({
        products: get().products.map(p => p.id === id ? { ...p, ...data } : p)
      }),
      deleteProduct: (id) => set({ products: get().products.filter(p => p.id !== id) }),

      // Edit mode
      editMode: false,
      toggleEditMode: () => set({ editMode: !get().editMode }),
    }),
    {
      name: 'aroma-atelier-store',
      partialize: (state) => ({
        cart: state.cart,
        wishlist: state.wishlist,
        orders: state.orders,
        profile: state.profile,
        products: state.products,
      }),
    }
  )
);