import { useStore } from '@/store/useStore';
import ProductCard from '@/components/ProductCard';
import Icon from '@/components/ui/icon';

const HERO_IMG = 'https://cdn.poehali.dev/projects/23c853e5-11a8-499d-a01d-8924ecd92d41/files/8d6eadcc-ab19-4f3e-a56e-154f9cd0a291.jpg';
const GIFT_IMG = 'https://cdn.poehali.dev/projects/23c853e5-11a8-499d-a01d-8924ecd92d41/files/40aec317-12e1-49b7-9639-9edaafa01cd4.jpg';
const SPRING_IMG = 'https://cdn.poehali.dev/projects/23c853e5-11a8-499d-a01d-8924ecd92d41/files/4ab82c3e-982e-4d43-825b-ef0c41fcd209.jpg';

const CATEGORIES = [
  { label: 'Ароматные\nСвечи', slug: 'candles', emoji: '🕯️' },
  { label: 'Диффузоры\nДля дома', slug: 'diffusers', emoji: '✨' },
  { label: 'Авто\nАроматы', slug: 'car', emoji: '🚗' },
  { label: 'Подарочные\nНаборы', slug: 'gifts', emoji: '🎁' },
  { label: 'Весенняя\nКоллекция', slug: 'spring', emoji: '🌸' },
];

export default function HomePage() {
  const { setPage, setCategory, products } = useStore();
  const featured = products.filter(p => p.isBestseller || p.isNew).slice(0, 4);
  const springProducts = products.filter(p => p.category === 'spring').slice(0, 3);

  const goCategory = (slug: string) => {
    setPage('catalog');
    setCategory(slug as 'candles' | 'diffusers' | 'car' | 'gifts' | 'spring');
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[85vh] md:min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={HERO_IMG}
            alt="Aroma Atelier"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-graphite/40" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-xl">
            <p className="font-sans text-[10px] tracking-ultra uppercase text-cream/70 mb-6 animate-fade-up">
              Коллекция 2026
            </p>
            <h1 className="font-display text-5xl md:text-7xl font-light text-cream leading-none mb-6 animate-fade-up-delay-1">
              Aroma<br />
              <em className="italic font-light">Atelier</em>
            </h1>
            <p className="font-sans text-base md:text-lg text-cream/70 leading-relaxed max-w-sm mb-10 animate-fade-up-delay-2">
              Домашние ароматы, которые создают атмосферу
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-up-delay-3">
              <button
                onClick={() => setPage('catalog')}
                className="bg-cream text-graphite font-sans text-xs tracking-widest uppercase px-8 py-4 hover:bg-sand transition-colors"
              >
                Исследовать коллекцию
              </button>
              <button
                onClick={() => goCategory('spring')}
                className="border border-cream/50 text-cream font-sans text-xs tracking-widest uppercase px-8 py-4 hover:border-cream hover:bg-cream/10 transition-colors"
              >
                Весенняя коллекция
              </button>
            </div>
          </div>
        </div>
        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-up-delay-3">
          <span className="font-sans text-[9px] tracking-ultra uppercase text-cream/40">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-cream/40 to-transparent" />
        </div>
      </section>

      {/* About */}
      <section className="py-20 md:py-32 bg-milk">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
            <div>
              <p className="font-sans text-[10px] tracking-ultra uppercase text-warm-gray mb-4">О нас</p>
              <h2 className="font-serif text-3xl md:text-5xl font-light text-graphite leading-tight mb-6">
                Искусство <em className="italic">создавать</em><br />атмосферу
              </h2>
              <div className="gold-line mb-6" />
              <p className="font-sans text-sm text-warm-gray leading-relaxed mb-4">
                Aroma Atelier — это небольшая мастерская ароматов, где каждая свеча и каждый диффузор создаётся вручную из натуральных ингредиентов. Мы верим, что аромат — это самый короткий путь к нужному настроению.
              </p>
              <p className="font-sans text-sm text-warm-gray leading-relaxed">
                Наши мастера работают с лучшими эфирными маслами и натуральным соевым воском, чтобы каждый продукт дарил не просто запах — а целую историю.
              </p>
              <div className="flex gap-8 mt-10">
                {[
                  { num: '50+', label: 'Ароматов' },
                  { num: '100%', label: 'Натуральный воск' },
                  { num: '5000+', label: 'Довольных клиентов' },
                ].map(stat => (
                  <div key={stat.label}>
                    <div className="font-serif text-2xl md:text-3xl text-graphite">{stat.num}</div>
                    <div className="font-sans text-[10px] tracking-widest uppercase text-warm-gray mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="aspect-[3/4] bg-sand overflow-hidden">
                <img src={SPRING_IMG} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="aspect-[3/4] bg-sand overflow-hidden mt-8">
                <img src={GIFT_IMG} alt="" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="font-sans text-[10px] tracking-ultra uppercase text-warm-gray mb-3">Ассортимент</p>
            <h2 className="font-serif text-3xl md:text-4xl font-light text-graphite">Коллекции</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => goCategory(cat.slug)}
                className="group relative overflow-hidden bg-milk hover:bg-sand transition-colors p-6 md:p-8 text-center"
              >
                <div className="text-3xl mb-4">{cat.emoji}</div>
                <div className="font-serif text-sm md:text-base text-graphite leading-tight whitespace-pre-line">
                  {cat.label}
                </div>
                <div className="mt-3 flex items-center justify-center gap-1 text-warm-gray group-hover:text-gold transition-colors">
                  <span className="font-sans text-[9px] tracking-widest uppercase">Смотреть</span>
                  <Icon name="ArrowRight" size={10} />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="py-20 md:py-28 bg-milk">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="font-sans text-[10px] tracking-ultra uppercase text-warm-gray mb-3">Избранное</p>
              <h2 className="font-serif text-3xl md:text-4xl font-light text-graphite">Хиты и новинки</h2>
            </div>
            <button
              onClick={() => setPage('catalog')}
              className="hidden md:flex items-center gap-2 font-sans text-xs tracking-widest uppercase text-warm-gray hover:text-graphite transition-colors hover-underline"
            >
              Весь каталог <Icon name="ArrowRight" size={14} />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {featured.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onView={() => setPage(`product-${product.id}`)}
              />
            ))}
          </div>
          <div className="text-center mt-10 md:hidden">
            <button
              onClick={() => setPage('catalog')}
              className="font-sans text-xs tracking-widest uppercase text-graphite border border-graphite px-8 py-3 hover:bg-graphite hover:text-cream transition-colors"
            >
              Весь каталог
            </button>
          </div>
        </div>
      </section>

      {/* Spring Highlight */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            <div className="relative overflow-hidden">
              <img src={SPRING_IMG} alt="Весенняя коллекция" className="w-full h-full min-h-[400px] object-cover" />
              <div className="absolute inset-0 bg-graphite/20" />
            </div>
            <div className="bg-graphite text-cream flex flex-col justify-center p-10 md:p-16">
              <p className="font-sans text-[10px] tracking-ultra uppercase text-gold mb-4">Новая коллекция</p>
              <h2 className="font-serif text-3xl md:text-5xl font-light leading-tight mb-6">
                Весна<br /><em className="italic">2026</em>
              </h2>
              <p className="font-sans text-sm text-cream/60 leading-relaxed mb-8">
                Пион, сирень, утренняя роса — ароматы пробуждения. Коллекция вдохновлена первыми тёплыми днями и цветением садов Прованса.
              </p>
              <button
                onClick={() => goCategory('spring')}
                className="self-start border border-gold text-gold font-sans text-xs tracking-widest uppercase px-8 py-4 hover:bg-gold hover:text-cream transition-colors"
              >
                Открыть коллекцию
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Spring Products */}
      <section className="py-20 bg-milk">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="font-serif text-2xl md:text-3xl font-light text-graphite">Весенняя коллекция</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
            {springProducts.map(product => (
              <ProductCard key={product.id} product={product} onView={() => setPage(`product-${product.id}`)} />
            ))}
          </div>
        </div>
      </section>

      {/* Gift Highlight */}
      <section className="py-20 md:py-28 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            <div className="bg-sand flex flex-col justify-center p-10 md:p-16 order-2 md:order-1">
              <p className="font-sans text-[10px] tracking-ultra uppercase text-warm-gray mb-4">Подарки</p>
              <h2 className="font-serif text-3xl md:text-5xl font-light text-graphite leading-tight mb-6">
                Идеальный<br /><em className="italic">подарок</em>
              </h2>
              <p className="font-sans text-sm text-warm-gray leading-relaxed mb-8">
                Готовые подарочные наборы в фирменной упаковке с лентой. Доставим напрямую получателю с вашей открыткой.
              </p>
              <button
                onClick={() => goCategory('gifts')}
                className="self-start bg-graphite text-cream font-sans text-xs tracking-widest uppercase px-8 py-4 hover:bg-graphite-light transition-colors"
              >
                Выбрать подарок
              </button>
            </div>
            <div className="relative overflow-hidden order-1 md:order-2">
              <img src={GIFT_IMG} alt="Подарочные наборы" className="w-full h-full min-h-[400px] object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Delivery Banner */}
      <section className="py-12 bg-graphite">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { icon: 'Truck', title: 'Быстрая доставка', text: 'СДЭК и Ozon Логистика по всей России' },
              { icon: 'Package', title: 'Бережная упаковка', text: 'Каждый заказ упакован в фирменную коробку' },
              { icon: 'RotateCcw', title: 'Возврат 14 дней', text: 'Если что-то не понравилось — вернём деньги' },
            ].map(item => (
              <div key={item.title} className="flex flex-col items-center gap-3">
                <Icon name={item.icon as 'Truck'} size={20} className="text-gold" />
                <div>
                  <div className="font-serif text-base text-cream">{item.title}</div>
                  <div className="font-sans text-xs text-cream/50 mt-1">{item.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
