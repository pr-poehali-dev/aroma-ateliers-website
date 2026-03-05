import { useState } from 'react';
import { useStore } from '@/store/useStore';
import ProductCard from '@/components/ProductCard';
import Icon from '@/components/ui/icon';

type Tab = 'orders' | 'wishlist' | 'profile';

const STATUS_MAP = {
  processing: { label: 'В обработке', color: 'text-gold' },
  shipped: { label: 'В доставке', color: 'text-blue-500' },
  delivered: { label: 'Доставлен', color: 'text-green-600' },
};

export default function ProfilePage() {
  const { orders, wishlist, products, profile, updateProfile, setPage } = useStore();
  const [tab, setTab] = useState<Tab>('orders');
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(profile);

  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  const handleSave = () => {
    updateProfile(form);
    setEditing(false);
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-milk border-b border-sand py-10 md:py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-sand rounded-full flex items-center justify-center">
              <Icon name="User" size={24} className="text-warm-gray" />
            </div>
            <div>
              <h1 className="font-serif text-2xl md:text-3xl font-light text-graphite">
                {profile.name || 'Мой профиль'}
              </h1>
              {profile.email && (
                <p className="font-sans text-sm text-warm-gray mt-0.5">{profile.email}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Tabs */}
        <div className="flex gap-6 border-b border-sand mb-10">
          {([
            { id: 'orders', label: 'Заказы', count: orders.length },
            { id: 'wishlist', label: 'Избранное', count: wishlist.length },
            { id: 'profile', label: 'Профиль', count: null },
          ] as { id: Tab; label: string; count: number | null }[]).map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`pb-4 font-sans text-xs tracking-widest uppercase flex items-center gap-2 border-b-2 transition-colors -mb-px ${
                tab === t.id
                  ? 'border-graphite text-graphite'
                  : 'border-transparent text-warm-gray hover:text-graphite'
              }`}
            >
              {t.label}
              {t.count !== null && t.count > 0 && (
                <span className="bg-sand text-warm-gray font-sans text-[9px] px-1.5 py-0.5 rounded-full">
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Orders */}
        {tab === 'orders' && (
          <div>
            {orders.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-4xl mb-4">📦</div>
                <p className="font-serif text-xl text-graphite mb-2">Заказов пока нет</p>
                <p className="font-sans text-sm text-warm-gray mb-6">Создайте первый заказ в нашем каталоге</p>
                <button onClick={() => setPage('catalog')} className="font-sans text-xs tracking-widest uppercase text-graphite border border-graphite px-6 py-3 hover:bg-graphite hover:text-cream transition-colors">
                  Перейти в каталог
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {orders.map(order => {
                  const status = STATUS_MAP[order.status];
                  return (
                    <div key={order.id} className="bg-white border border-sand p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <p className="font-sans text-xs tracking-widest uppercase text-warm-gray">Заказ</p>
                          <p className="font-serif text-lg text-graphite">{order.id}</p>
                        </div>
                        <div className="text-right">
                          <span className={`font-sans text-xs font-medium ${status.color}`}>{status.label}</span>
                          <p className="font-sans text-xs text-warm-gray mt-0.5">{formatDate(order.date)}</p>
                        </div>
                      </div>
                      <div className="flex gap-3 mb-4">
                        {order.items.map(item => (
                          <img key={item.product.id} src={item.product.image} alt={item.product.name}
                            className="w-14 h-14 object-cover bg-milk" />
                        ))}
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-sand">
                        <div>
                          <p className="font-sans text-xs text-warm-gray">
                            {order.items.reduce((s, i) => s + i.quantity, 0)} товара · {order.address}
                          </p>
                        </div>
                        <p className="font-serif text-lg text-graphite">{order.total.toLocaleString('ru-RU')} ₽</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Wishlist */}
        {tab === 'wishlist' && (
          <div>
            {wishlistProducts.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-4xl mb-4">🤍</div>
                <p className="font-serif text-xl text-graphite mb-2">В избранном пусто</p>
                <p className="font-sans text-sm text-warm-gray mb-6">Сохраняйте понравившиеся ароматы</p>
                <button onClick={() => setPage('catalog')} className="font-sans text-xs tracking-widest uppercase text-graphite border border-graphite px-6 py-3 hover:bg-graphite hover:text-cream transition-colors">
                  Перейти в каталог
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {wishlistProducts.map(product => (
                  <ProductCard key={product.id} product={product} onView={() => setPage(`product-${product.id}`)} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Profile */}
        {tab === 'profile' && (
          <div className="max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-xl text-graphite">Личные данные</h2>
              <button
                onClick={() => editing ? handleSave() : setEditing(true)}
                className="font-sans text-xs tracking-widest uppercase text-graphite border border-graphite px-4 py-2 hover:bg-graphite hover:text-cream transition-colors"
              >
                {editing ? 'Сохранить' : 'Редактировать'}
              </button>
            </div>
            <div className="bg-white border border-sand p-6 space-y-4">
              {[
                { key: 'name', label: 'Имя и фамилия', type: 'text' },
                { key: 'email', label: 'Email', type: 'email' },
                { key: 'phone', label: 'Телефон', type: 'tel' },
                { key: 'city', label: 'Город', type: 'text' },
                { key: 'address', label: 'Адрес', type: 'text' },
              ].map(field => (
                <div key={field.key}>
                  <label className="font-sans text-[10px] tracking-widest uppercase text-warm-gray block mb-1.5">
                    {field.label}
                  </label>
                  {editing ? (
                    <input
                      type={field.type}
                      value={form[field.key as keyof typeof form]}
                      onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                      className="w-full border border-sand bg-transparent font-sans text-sm text-graphite px-3 py-2.5 focus:outline-none focus:border-graphite"
                    />
                  ) : (
                    <p className="font-sans text-sm text-graphite py-2.5 border-b border-sand">
                      {profile[field.key as keyof typeof profile] || <span className="text-warm-gray">Не указано</span>}
                    </p>
                  )}
                </div>
              ))}
            </div>
            {editing && (
              <button
                onClick={() => { setEditing(false); setForm(profile); }}
                className="mt-3 font-sans text-xs text-warm-gray hover:text-graphite transition-colors"
              >
                Отменить изменения
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
}
