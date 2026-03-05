import { useState } from 'react';
import { useStore } from '@/store/useStore';
import Icon from '@/components/ui/icon';

type Step = 'form' | 'confirm';
type Delivery = 'cdek' | 'ozon';
type Payment = 'card' | 'bank';

export default function CheckoutPage() {
  const { cart, getCartTotal, clearCart, addOrder, setPage, profile } = useStore();
  const [step, setStep] = useState<Step>('form');
  const [delivery, setDelivery] = useState<Delivery>('cdek');
  const [payment, setPayment] = useState<Payment>('card');
  const [orderId, setOrderId] = useState('');
  const [form, setForm] = useState({
    name: profile.name || '',
    phone: profile.phone || '',
    email: profile.email || '',
    city: profile.city || '',
    address: profile.address || '',
  });

  const total = getCartTotal();
  const deliveryCost = total >= 5000 ? 0 : 350;
  const finalTotal = total + deliveryCost;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = 'AA-' + Math.floor(Math.random() * 9000 + 1000);
    setOrderId(id);
    addOrder({
      id,
      date: new Date().toISOString().split('T')[0],
      status: 'processing',
      items: cart,
      total: finalTotal,
      address: `${form.city}, ${form.address}`,
    });
    clearCart();
    setStep('confirm');
  };

  if (cart.length === 0 && step === 'form') {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🛒</div>
          <p className="font-serif text-2xl text-graphite mb-4">Корзина пуста</p>
          <button onClick={() => setPage('catalog')} className="font-sans text-xs tracking-widest uppercase text-graphite border border-graphite px-6 py-3 hover:bg-graphite hover:text-cream transition-colors">
            Перейти в каталог
          </button>
        </div>
      </div>
    );
  }

  if (step === 'confirm') {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold flex items-center justify-center mx-auto mb-6">
            <Icon name="Check" size={24} className="text-gold" />
          </div>
          <h1 className="font-serif text-3xl font-light text-graphite mb-2">Заказ оформлен</h1>
          <p className="font-sans text-sm text-warm-gray mb-6">
            Ваш заказ <strong className="text-graphite">{orderId}</strong> принят.<br />
            Мы свяжемся с вами в ближайшее время.
          </p>
          <div className="bg-milk border border-sand p-6 text-left mb-8">
            <div className="flex justify-between py-2 border-b border-sand">
              <span className="font-sans text-xs text-warm-gray">Сумма заказа</span>
              <span className="font-sans text-sm text-graphite">{finalTotal.toLocaleString('ru-RU')} ₽</span>
            </div>
            <div className="flex justify-between py-2 border-b border-sand">
              <span className="font-sans text-xs text-warm-gray">Доставка</span>
              <span className="font-sans text-sm text-graphite">{delivery === 'cdek' ? 'СДЭК' : 'Ozon Логистика'}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="font-sans text-xs text-warm-gray">Адрес</span>
              <span className="font-sans text-sm text-graphite text-right">{form.city}, {form.address}</span>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => setPage('profile')}
              className="bg-graphite text-cream font-sans text-xs tracking-widest uppercase py-4 hover:bg-graphite-light transition-colors"
            >
              История заказов
            </button>
            <button
              onClick={() => setPage('home')}
              className="border border-sand text-warm-gray font-sans text-xs tracking-widest uppercase py-4 hover:border-graphite hover:text-graphite transition-colors"
            >
              На главную
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <h1 className="font-serif text-3xl md:text-4xl font-light text-graphite mb-10">Оформление заказа</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left */}
            <div className="lg:col-span-2 space-y-8">
              {/* Personal */}
              <div className="bg-white border border-sand p-6 md:p-8">
                <h2 className="font-serif text-xl text-graphite mb-6">Личные данные</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { name: 'name', label: 'Имя и фамилия', type: 'text', required: true },
                    { name: 'phone', label: 'Телефон', type: 'tel', required: true },
                    { name: 'email', label: 'Email', type: 'email', required: true },
                  ].map(field => (
                    <div key={field.name} className={field.name === 'name' ? 'md:col-span-2' : ''}>
                      <label className="font-sans text-[10px] tracking-widest uppercase text-warm-gray block mb-2">
                        {field.label}
                      </label>
                      <input
                        type={field.type}
                        required={field.required}
                        value={form[field.name as keyof typeof form]}
                        onChange={e => setForm({ ...form, [field.name]: e.target.value })}
                        className="w-full border border-sand bg-transparent font-sans text-sm text-graphite px-4 py-3 focus:outline-none focus:border-graphite placeholder-warm-gray"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Address */}
              <div className="bg-white border border-sand p-6 md:p-8">
                <h2 className="font-serif text-xl text-graphite mb-6">Адрес доставки</h2>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="font-sans text-[10px] tracking-widest uppercase text-warm-gray block mb-2">Город</label>
                    <input
                      type="text"
                      required
                      value={form.city}
                      onChange={e => setForm({ ...form, city: e.target.value })}
                      placeholder="Москва"
                      className="w-full border border-sand bg-transparent font-sans text-sm text-graphite px-4 py-3 focus:outline-none focus:border-graphite placeholder-warm-gray"
                    />
                  </div>
                  <div>
                    <label className="font-sans text-[10px] tracking-widest uppercase text-warm-gray block mb-2">Адрес</label>
                    <input
                      type="text"
                      required
                      value={form.address}
                      onChange={e => setForm({ ...form, address: e.target.value })}
                      placeholder="ул. Пушкина, д. 1, кв. 1"
                      className="w-full border border-sand bg-transparent font-sans text-sm text-graphite px-4 py-3 focus:outline-none focus:border-graphite placeholder-warm-gray"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery */}
              <div className="bg-white border border-sand p-6 md:p-8">
                <h2 className="font-serif text-xl text-graphite mb-6">Способ доставки</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { id: 'cdek' as Delivery, label: 'СДЭК', desc: '2–5 рабочих дней', icon: 'Truck' },
                    { id: 'ozon' as Delivery, label: 'Ozon Логистика', desc: '3–7 рабочих дней', icon: 'Package' },
                  ].map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setDelivery(opt.id)}
                      className={`p-4 border text-left flex items-start gap-3 transition-colors ${
                        delivery === opt.id ? 'border-graphite bg-graphite/5' : 'border-sand hover:border-graphite/50'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5 ${
                        delivery === opt.id ? 'border-graphite bg-graphite' : 'border-sand'
                      }`} />
                      <div>
                        <div className="font-sans text-sm font-medium text-graphite">{opt.label}</div>
                        <div className="font-sans text-xs text-warm-gray mt-0.5">{opt.desc}</div>
                        {total < 5000 && <div className="font-sans text-xs text-gold mt-1">+ 350 ₽</div>}
                        {total >= 5000 && <div className="font-sans text-xs text-green-600 mt-1">Бесплатно</div>}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment */}
              <div className="bg-white border border-sand p-6 md:p-8">
                <h2 className="font-serif text-xl text-graphite mb-6">Способ оплаты</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { id: 'card' as Payment, label: 'Банковская карта онлайн', desc: 'Visa, MasterCard, МИР', icon: 'CreditCard' },
                    { id: 'bank' as Payment, label: 'Оплата при получении', desc: 'Картой курьеру', icon: 'Wallet' },
                  ].map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setPayment(opt.id)}
                      className={`p-4 border text-left flex items-start gap-3 transition-colors ${
                        payment === opt.id ? 'border-graphite bg-graphite/5' : 'border-sand hover:border-graphite/50'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5 ${
                        payment === opt.id ? 'border-graphite bg-graphite' : 'border-sand'
                      }`} />
                      <div>
                        <div className="font-sans text-sm font-medium text-graphite">{opt.label}</div>
                        <div className="font-sans text-xs text-warm-gray mt-0.5">{opt.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right — Summary */}
            <div>
              <div className="bg-milk border border-sand p-6 sticky top-24">
                <h2 className="font-serif text-xl text-graphite mb-6">Ваш заказ</h2>
                <div className="flex flex-col gap-3 mb-6">
                  {cart.map(item => (
                    <div key={item.product.id} className="flex gap-3">
                      <img src={item.product.image} alt="" className="w-12 h-12 object-cover bg-cream flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-sans text-xs text-graphite leading-tight">{item.product.name}</p>
                        <p className="font-sans text-xs text-warm-gray mt-0.5">× {item.quantity}</p>
                      </div>
                      <span className="font-sans text-xs text-graphite flex-shrink-0">
                        {(item.product.price * item.quantity).toLocaleString('ru-RU')} ₽
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-sand pt-4 space-y-2">
                  <div className="flex justify-between font-sans text-sm">
                    <span className="text-warm-gray">Товары</span>
                    <span className="text-graphite">{total.toLocaleString('ru-RU')} ₽</span>
                  </div>
                  <div className="flex justify-between font-sans text-sm">
                    <span className="text-warm-gray">Доставка</span>
                    <span className="text-graphite">{deliveryCost === 0 ? 'Бесплатно' : `${deliveryCost} ₽`}</span>
                  </div>
                  <div className="flex justify-between font-serif text-xl pt-3 border-t border-sand">
                    <span className="text-graphite">Итого</span>
                    <span className="text-graphite">{finalTotal.toLocaleString('ru-RU')} ₽</span>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full mt-6 bg-graphite text-cream font-sans text-xs tracking-widest uppercase py-4 hover:bg-graphite-light transition-colors"
                >
                  Подтвердить заказ
                </button>
                <p className="text-center font-sans text-[10px] text-warm-gray mt-3">
                  Нажимая кнопку, вы соглашаетесь с условиями оферты
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
