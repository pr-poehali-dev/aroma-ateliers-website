import { useStore } from '@/store/useStore';
import Icon from '@/components/ui/icon';

export default function Footer() {
  const { setPage, setCategory } = useStore();

  return (
    <footer className="bg-graphite text-cream/70 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="mb-4">
              <div className="font-display text-2xl font-light tracking-widest text-cream uppercase">Aroma</div>
              <div className="font-display text-xs tracking-ultra text-gold uppercase -mt-1">Atelier</div>
            </div>
            <p className="text-sm leading-relaxed text-cream/50 max-w-xs">
              Ароматы ручной работы, которые создают атмосферу. Каждая свеча — это история, каждый аромат — эмоция.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a href="https://instagram.com" target="_blank" rel="noreferrer"
                className="text-cream/40 hover:text-gold transition-colors">
                <Icon name="Instagram" size={18} />
              </a>
              <a href="https://t.me" target="_blank" rel="noreferrer"
                className="text-cream/40 hover:text-gold transition-colors">
                <Icon name="Send" size={18} />
              </a>
            </div>
          </div>

          {/* Catalog */}
          <div>
            <h4 className="font-sans text-[10px] tracking-ultra uppercase text-cream/40 mb-5">Каталог</h4>
            <ul className="flex flex-col gap-3">
              {[
                { label: 'Ароматные свечи', cat: 'candles' },
                { label: 'Диффузоры', cat: 'diffusers' },
                { label: 'Авто ароматы', cat: 'car' },
                { label: 'Подарочные наборы', cat: 'gifts' },
                { label: 'Весенняя коллекция', cat: 'spring' },
              ].map(item => (
                <li key={item.cat}>
                  <button
                    onClick={() => { setPage('catalog'); setCategory(item.cat as 'candles' | 'diffusers' | 'car' | 'gifts' | 'spring'); }}
                    className="text-sm text-cream/50 hover:text-cream transition-colors hover-underline"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-sans text-[10px] tracking-ultra uppercase text-cream/40 mb-5">Информация</h4>
            <ul className="flex flex-col gap-3">
              {[
                'О бренде',
                'Условия доставки',
                'Возврат и обмен',
                'Политика конфиденциальности',
                'Оферта',
              ].map(item => (
                <li key={item}>
                  <button className="text-sm text-cream/50 hover:text-cream transition-colors hover-underline">
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h4 className="font-sans text-[10px] tracking-ultra uppercase text-cream/40 mb-5">Контакты</h4>
            <div className="flex flex-col gap-3">
              <a href="mailto:hello@aromaatelier.ru"
                className="flex items-center gap-2 text-sm text-cream/50 hover:text-cream transition-colors">
                <Icon name="Mail" size={14} />
                hello@aromaatelier.ru
              </a>
              <a href="tel:+79001234567"
                className="flex items-center gap-2 text-sm text-cream/50 hover:text-cream transition-colors">
                <Icon name="Phone" size={14} />
                +7 (900) 123-45-67
              </a>
              <div className="flex items-start gap-2 text-sm text-cream/50">
                <Icon name="MapPin" size={14} className="mt-0.5 flex-shrink-0" />
                <span>Москва, Россия<br/>Пн–Пт: 10:00–19:00</span>
              </div>
            </div>
            <div className="mt-6 p-4 border border-cream/10">
              <p className="text-xs text-cream/40 mb-1">Доставка</p>
              <p className="text-sm text-cream/60">СДЭК · Ozon Логистика</p>
              <p className="text-xs text-cream/40 mt-1">Бесплатно от 5 000 ₽</p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="py-6 border-t border-cream/10 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-cream/30">
            © 2026 Aroma Atelier. Все права защищены.
          </p>
          <button
            onClick={() => setPage('admin')}
            className="text-xs text-cream/20 hover:text-cream/40 transition-colors"
          >
            Панель управления
          </button>
        </div>
      </div>
    </footer>
  );
}
