import { useStore, Product } from '@/store/useStore';
import Icon from '@/components/ui/icon';

interface Props {
  product: Product;
  onView?: () => void;
}

export default function ProductCard({ product, onView }: Props) {
  const { addToCart, toggleWishlist, isInWishlist, setPage } = useStore();
  const inWishlist = isInWishlist(product.id);

  const handleView = () => {
    if (onView) onView();
    else setPage(`product-${product.id}`);
  };

  return (
    <div className="product-card group relative">
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        {product.isNew && (
          <span className="bg-graphite text-cream font-sans text-[9px] tracking-ultra uppercase px-2 py-1">
            Новинка
          </span>
        )}
        {product.isBestseller && (
          <span className="bg-gold text-cream font-sans text-[9px] tracking-ultra uppercase px-2 py-1">
            Хит
          </span>
        )}
        {product.oldPrice && (
          <span className="bg-destructive text-white font-sans text-[9px] tracking-widest uppercase px-2 py-1">
            −{Math.round((1 - product.price / product.oldPrice) * 100)}%
          </span>
        )}
      </div>

      {/* Wishlist */}
      <button
        onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
        className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center bg-cream/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-cream"
      >
        <Icon
          name="Heart"
          size={15}
          className={inWishlist ? 'text-gold fill-gold' : 'text-warm-gray'}
        />
      </button>

      {/* Image */}
      <div className="overflow-hidden bg-milk aspect-[3/4] cursor-pointer" onClick={handleView}>
        <img
          src={product.image}
          alt={product.name}
          className="product-img w-full h-full object-cover"
        />
      </div>

      {/* Info */}
      <div className="pt-4 pb-2">
        <p className="font-sans text-[10px] tracking-ultra uppercase text-warm-gray mb-1">
          {getCategoryLabel(product.category)}
        </p>
        <button
          onClick={handleView}
          className="font-serif text-base text-graphite leading-tight hover-underline text-left block"
        >
          {product.name}
        </button>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <span className="font-serif text-lg text-graphite">
              {product.price.toLocaleString('ru-RU')} ₽
            </span>
            {product.oldPrice && (
              <span className="font-sans text-sm text-warm-gray line-through">
                {product.oldPrice.toLocaleString('ru-RU')} ₽
              </span>
            )}
          </div>
          <button
            onClick={() => addToCart(product)}
            className="w-8 h-8 flex items-center justify-center border border-graphite text-graphite hover:bg-graphite hover:text-cream transition-colors"
          >
            <Icon name="Plus" size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

function getCategoryLabel(cat: string) {
  const map: Record<string, string> = {
    candles: 'Ароматная свеча',
    diffusers: 'Диффузор',
    car: 'Авто аромат',
    gifts: 'Подарочный набор',
    spring: 'Весенняя коллекция',
  };
  return map[cat] || cat;
}
