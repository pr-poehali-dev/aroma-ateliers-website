import { useState } from 'react';
import { useStore } from '@/store/useStore';
import Icon from '@/components/ui/icon';

const NAV_LINKS = [
  { label: 'Каталог', page: 'catalog' },
  { label: 'Свечи', page: 'catalog', category: 'candles' },
  { label: 'Диффузоры', page: 'catalog', category: 'diffusers' },
  { label: 'Весенняя коллекция', page: 'catalog', category: 'spring' },
  { label: 'Подарки', page: 'catalog', category: 'gifts' },
];

export default function Header() {
  const { currentPage, setPage, setCategory, getCartCount, setCartOpen, cartOpen, wishlist } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const cartCount = getCartCount();

  const handleNav = (page: string, category?: string) => {
    setPage(page);
    if (category) setCategory(category as 'candles' | 'diffusers' | 'car' | 'gifts' | 'spring');
    else setCategory('all');
    setMobileOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-cream/95 backdrop-blur-sm border-b border-sand">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <button
              onClick={() => handleNav('home')}
              className="flex flex-col items-start hover-underline group"
            >
              <span className="font-display text-xl md:text-2xl font-light tracking-widest text-graphite uppercase">
                Aroma
              </span>
              <span className="font-display text-xs tracking-ultra text-gold uppercase -mt-1">
                Atelier
              </span>
            </button>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map(link => (
                <button
                  key={link.label}
                  onClick={() => handleNav(link.page, link.category)}
                  className="font-sans text-xs tracking-widest uppercase text-warm-gray hover:text-graphite transition-colors hover-underline"
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Icons */}
            <div className="flex items-center gap-2 md:gap-4">
              <button
                onClick={() => setPage('profile')}
                className="p-2 text-warm-gray hover:text-graphite transition-colors"
              >
                <Icon name="User" size={18} />
              </button>
              <button
                onClick={() => setPage('wishlist')}
                className="p-2 text-warm-gray hover:text-graphite transition-colors relative"
              >
                <Icon name="Heart" size={18} />
                {wishlist.length > 0 && (
                  <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-gold rounded-full text-white text-[9px] flex items-center justify-center font-sans font-medium">
                    {wishlist.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setCartOpen(!cartOpen)}
                className="p-2 text-warm-gray hover:text-graphite transition-colors relative"
              >
                <Icon name="ShoppingBag" size={18} />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-graphite rounded-full text-cream text-[9px] flex items-center justify-center font-sans font-medium">
                    {cartCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 text-warm-gray hover:text-graphite transition-colors"
              >
                <Icon name={mobileOpen ? 'X' : 'Menu'} size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden bg-cream border-t border-sand animate-fade-in">
            <div className="px-4 py-6 flex flex-col gap-4">
              {NAV_LINKS.map(link => (
                <button
                  key={link.label}
                  onClick={() => handleNav(link.page, link.category)}
                  className="font-sans text-sm tracking-widest uppercase text-warm-gray hover:text-graphite transition-colors text-left py-1"
                >
                  {link.label}
                </button>
              ))}
              <div className="border-t border-sand pt-4 mt-2">
                <button
                  onClick={() => handleNav('admin')}
                  className="font-sans text-xs tracking-widest uppercase text-warm-gray/60"
                >
                  Панель управления
                </button>
              </div>
            </div>
          </div>
        )}
      </header>
      {/* Spacer */}
      <div className="h-16 md:h-20" />
    </>
  );
}