import { useStore } from '@/store/useStore';
import Icon from '@/components/ui/icon';

export default function CartDrawer() {
  const { cart, cartOpen, setCartOpen, removeFromCart, updateQuantity, getCartTotal, setPage } = useStore();
  const total = getCartTotal();

  if (!cartOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 cart-overlay"
        onClick={() => setCartOpen(false)}
      />
      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-cream shadow-2xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-sand">
          <div>
            <h2 className="font-serif text-xl font-light text-graphite">Корзина</h2>
            {cart.length > 0 && (
              <p className="font-sans text-xs text-warm-gray tracking-widest uppercase mt-0.5">
                {cart.length} {cart.length === 1 ? 'позиция' : cart.length < 5 ? 'позиции' : 'позиций'}
              </p>
            )}
          </div>
          <button
            onClick={() => setCartOpen(false)}
            className="p-2 text-warm-gray hover:text-graphite transition-colors"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <div className="w-16 h-16 rounded-full bg-sand flex items-center justify-center">
                <Icon name="ShoppingBag" size={24} className="text-warm-gray" />
              </div>
              <div>
                <p className="font-serif text-lg text-graphite">Корзина пуста</p>
                <p className="font-sans text-sm text-warm-gray mt-1">Добавьте аромат, который создаст вашу атмосферу</p>
              </div>
              <button
                onClick={() => { setCartOpen(false); setPage('catalog'); }}
                className="mt-2 font-sans text-xs tracking-widest uppercase text-graphite border border-graphite px-6 py-3 hover:bg-graphite hover:text-cream transition-colors"
              >
                Перейти в каталог
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {cart.map(item => (
                <div key={item.product.id} className="flex gap-4 py-4 border-b border-sand last:border-0">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover flex-shrink-0 bg-milk"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-base text-graphite leading-tight">{item.product.name}</h3>
                    <p className="font-sans text-xs text-warm-gray mt-0.5 tracking-widest uppercase">
                      {getCategoryLabel(item.product.category)}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      {/* Qty */}
                      <div className="flex items-center border border-sand">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-warm-gray hover:text-graphite transition-colors"
                        >
                          <Icon name="Minus" size={12} />
                        </button>
                        <span className="w-7 text-center font-sans text-sm text-graphite">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-warm-gray hover:text-graphite transition-colors"
                        >
                          <Icon name="Plus" size={12} />
                        </button>
                      </div>
                      {/* Price */}
                      <span className="font-serif text-base text-graphite">
                        {(item.product.price * item.quantity).toLocaleString('ru-RU')} ₽
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="self-start p-1 text-warm-gray hover:text-graphite transition-colors"
                  >
                    <Icon name="X" size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="px-6 py-5 border-t border-sand bg-milk">
            <div className="flex items-center justify-between mb-4">
              <span className="font-sans text-sm text-warm-gray tracking-widest uppercase">Итого</span>
              <span className="font-serif text-2xl text-graphite">{total.toLocaleString('ru-RU')} ₽</span>
            </div>
            <button
              onClick={() => { setCartOpen(false); setPage('checkout'); }}
              className="w-full bg-graphite text-cream font-sans text-xs tracking-widest uppercase py-4 hover:bg-graphite-light transition-colors"
            >
              Оформить заказ
            </button>
            <p className="text-center font-sans text-xs text-warm-gray mt-3">
              Бесплатная доставка от 5 000 ₽
            </p>
          </div>
        )}
      </div>
    </>
  );
}

function getCategoryLabel(cat: string) {
  const map: Record<string, string> = {
    candles: 'Свеча',
    diffusers: 'Диффузор',
    car: 'Авто аромат',
    gifts: 'Подарочный набор',
    spring: 'Весенняя коллекция',
  };
  return map[cat] || cat;
}
