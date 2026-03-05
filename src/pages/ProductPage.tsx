import { useStore, Product } from '@/store/useStore';
import ProductCard from '@/components/ProductCard';
import Icon from '@/components/ui/icon';
import EditableText from '@/components/EditableText';
import EditableImage from '@/components/EditableImage';

interface Props {
  productId: number;
}

export default function ProductPage({ productId }: Props) {
  const { products, addToCart, toggleWishlist, isInWishlist, setPage, updateProduct } = useStore();
  const product = products.find(p => p.id === productId);
  const related = products.filter(p => p.id !== productId && p.category === product?.category).slice(0, 4);
  const inWishlist = product ? isInWishlist(product.id) : false;

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="font-serif text-2xl text-graphite mb-4">Товар не найден</p>
          <button onClick={() => setPage('catalog')} className="font-sans text-xs tracking-widest uppercase text-graphite border border-graphite px-6 py-3 hover:bg-graphite hover:text-cream transition-colors">
            Вернуться в каталог
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center gap-2 font-sans text-xs text-warm-gray">
          <button onClick={() => setPage('home')} className="hover:text-graphite transition-colors">Главная</button>
          <span>/</span>
          <button onClick={() => setPage('catalog')} className="hover:text-graphite transition-colors">Каталог</button>
          <span>/</span>
          <span className="text-graphite">{product.name}</span>
        </div>
      </div>

      {/* Product */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20">
          {/* Images */}
          <div>
            <EditableImage
              src={product.image}
              alt={product.name}
              onChange={(url) => updateProduct(product.id, { image: url, images: [url] })}
              className="aspect-square bg-milk overflow-hidden"
              imgClassName="w-full h-full object-cover"
            />
            
          </div>

          {/* Info */}
          <div className="flex flex-col">
            {/* Badges */}
            <div className="flex gap-2 mb-4">
              {product.isNew && (
                <span className="bg-graphite text-cream font-sans text-[9px] tracking-ultra uppercase px-2 py-1">Новинка</span>
              )}
              {product.isBestseller && (
                <span className="bg-gold text-cream font-sans text-[9px] tracking-ultra uppercase px-2 py-1">Хит продаж</span>
              )}
            </div>

            <p className="font-sans text-[10px] tracking-ultra uppercase text-warm-gray mb-2">
              {getCategoryLabel(product.category)}
            </p>
            <EditableText
              as="h1"
              value={product.name}
              onChange={(val) => updateProduct(product.id, { name: val })}
              className="font-serif text-3xl md:text-4xl font-light text-graphite leading-tight mb-4"
            />

            <div className="flex items-center gap-3 mb-6">
              <span className="font-serif text-3xl text-graphite">{product.price.toLocaleString('ru-RU')} ₽</span>
              {product.oldPrice && (
                <span className="font-sans text-lg text-warm-gray line-through">
                  {product.oldPrice.toLocaleString('ru-RU')} ₽
                </span>
              )}
            </div>

            <div className="gold-line mb-6" />

            <EditableText
              as="p"
              value={product.description}
              onChange={(val) => updateProduct(product.id, { description: val })}
              multiline
              className="font-sans text-sm text-warm-gray leading-relaxed mb-8"
            />

            {/* Notes */}
            <div className="mb-6">
              <h3 className="font-sans text-[10px] tracking-ultra uppercase text-graphite mb-3">Ноты аромата</h3>
              <div className="flex flex-wrap gap-2">
                {product.notes.map(note => (
                  <span key={note} className="bg-milk border border-sand font-sans text-xs text-warm-gray px-3 py-1.5">
                    {note}
                  </span>
                ))}
              </div>
            </div>

            {/* Details */}
            <div className="mb-8">
              <h3 className="font-sans text-[10px] tracking-ultra uppercase text-graphite mb-3">Характеристики</h3>
              <div className="border border-sand">
                {product.details.map((d, i) => (
                  <div key={i} className={`flex justify-between py-3 px-4 font-sans text-sm ${i < product.details.length - 1 ? 'border-b border-sand' : ''}`}>
                    <span className="text-warm-gray">{d.label}</span>
                    <span className="text-graphite font-medium">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="flex gap-3 mt-auto">
              <button
                onClick={() => addToCart(product)}
                disabled={!product.inStock}
                className="flex-1 bg-graphite text-cream font-sans text-xs tracking-widest uppercase py-4 hover:bg-graphite-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {product.inStock ? 'Добавить в корзину' : 'Нет в наличии'}
              </button>
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`w-14 h-14 border flex items-center justify-center transition-colors ${
                  inWishlist ? 'border-gold bg-gold/10 text-gold' : 'border-sand text-warm-gray hover:border-graphite hover:text-graphite'
                }`}
              >
                <Icon name="Heart" size={18} className={inWishlist ? 'fill-gold' : ''} />
              </button>
            </div>

            {/* Delivery */}
            <div className="mt-6 p-4 bg-milk border border-sand">
              <div className="flex items-center gap-2 text-warm-gray mb-2">
                <Icon name="Truck" size={14} />
                <span className="font-sans text-xs">Доставка СДЭК или Ozon Логистика</span>
              </div>
              <div className="flex items-center gap-2 text-warm-gray">
                <Icon name="Package" size={14} />
                <span className="font-sans text-xs">Бесплатно при заказе от 5 000 ₽</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-20 pt-12 border-t border-sand">
            <h2 className="font-serif text-2xl md:text-3xl font-light text-graphite mb-8">Вам также понравится</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {related.map(p => (
                <ProductCard key={p.id} product={p} onView={() => setPage(`product-${p.id}`)} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function getCategoryLabel(cat: string) {
  const map: Record<string, string> = {
    candles: 'Ароматная свеча',
    diffusers: 'Диффузор для дома',
    car: 'Авто аромат',
    gifts: 'Подарочный набор',
    spring: 'Весенняя коллекция',
  };
  return map[cat] || cat;
}