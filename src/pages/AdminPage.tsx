import { useState } from 'react';
import { useStore, Product, Category } from '@/store/useStore';
import Icon from '@/components/ui/icon';

type AdminTab = 'products' | 'add';

const CATEGORIES: { label: string; slug: Category }[] = [
  { label: 'Ароматные свечи', slug: 'candles' },
  { label: 'Диффузоры', slug: 'diffusers' },
  { label: 'Авто ароматы', slug: 'car' },
  { label: 'Подарочные наборы', slug: 'gifts' },
  { label: 'Весенняя коллекция', slug: 'spring' },
];

const EMPTY_FORM = {
  name: '',
  category: 'candles' as Category,
  price: '',
  oldPrice: '',
  description: '',
  notes: '',
  image: '',
  inStock: true,
  isNew: false,
  isBestseller: false,
};

export default function AdminPage() {
  const { products, addProduct, updateProduct, deleteProduct, setPage } = useStore();
  const [tab, setTab] = useState<AdminTab>('products');
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const startEdit = (p: Product) => {
    setForm({
      name: p.name,
      category: p.category,
      price: String(p.price),
      oldPrice: p.oldPrice ? String(p.oldPrice) : '',
      description: p.description,
      notes: p.notes.join(', '),
      image: p.image,
      inStock: p.inStock,
      isNew: p.isNew || false,
      isBestseller: p.isBestseller || false,
    });
    setEditId(p.id);
    setTab('add');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name: form.name,
      category: form.category,
      price: Number(form.price),
      oldPrice: form.oldPrice ? Number(form.oldPrice) : undefined,
      description: form.description,
      notes: form.notes.split(',').map(n => n.trim()).filter(Boolean),
      image: form.image || 'https://cdn.poehali.dev/projects/23c853e5-11a8-499d-a01d-8924ecd92d41/files/6fbfb9f0-2f24-468e-8ea2-829c56a38fe9.jpg',
      images: [form.image || 'https://cdn.poehali.dev/projects/23c853e5-11a8-499d-a01d-8924ecd92d41/files/6fbfb9f0-2f24-468e-8ea2-829c56a38fe9.jpg'],
      details: [],
      inStock: form.inStock,
      isNew: form.isNew,
      isBestseller: form.isBestseller,
    };
    if (editId) {
      updateProduct(editId, data);
    } else {
      addProduct(data);
    }
    setForm(EMPTY_FORM);
    setEditId(null);
    setTab('products');
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleDelete = (id: number) => {
    deleteProduct(id);
    setDeleteConfirm(null);
  };

  const getCatLabel = (slug: string) => CATEGORIES.find(c => c.slug === slug)?.label || slug;

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-graphite border-b border-graphite-light py-8 md:py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div>
            <p className="font-sans text-[10px] tracking-ultra uppercase text-cream/40 mb-1">Панель управления</p>
            <h1 className="font-display text-2xl font-light tracking-widest text-cream uppercase">
              Aroma <span className="text-gold">Atelier</span>
            </h1>
          </div>
          <button
            onClick={() => setPage('home')}
            className="flex items-center gap-2 font-sans text-xs tracking-widest uppercase text-cream/50 hover:text-cream transition-colors"
          >
            <Icon name="ArrowLeft" size={14} />
            На сайт
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        {/* Saved notice */}
        {saved && (
          <div className="mb-6 flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 font-sans text-sm animate-fade-in">
            <Icon name="Check" size={16} />
            Товар сохранён
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Товаров', value: products.length },
            { label: 'В наличии', value: products.filter(p => p.inStock).length },
            { label: 'Новинок', value: products.filter(p => p.isNew).length },
            { label: 'Хитов', value: products.filter(p => p.isBestseller).length },
          ].map(stat => (
            <div key={stat.label} className="bg-milk border border-sand p-5">
              <div className="font-serif text-3xl text-graphite">{stat.value}</div>
              <div className="font-sans text-xs text-warm-gray tracking-widest uppercase mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 border-b border-sand">
          {[
            { id: 'products' as AdminTab, label: 'Товары' },
            { id: 'add' as AdminTab, label: editId ? 'Редактировать' : 'Добавить товар' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => { setTab(t.id); if (t.id === 'add' && !editId) setForm(EMPTY_FORM); }}
              className={`pb-4 px-2 font-sans text-xs tracking-widest uppercase border-b-2 transition-colors -mb-px ${
                tab === t.id ? 'border-graphite text-graphite' : 'border-transparent text-warm-gray hover:text-graphite'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Products List */}
        {tab === 'products' && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="relative flex-1 max-w-xs">
                <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-gray" />
                <input
                  type="text"
                  placeholder="Найти товар..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-9 pr-4 py-2.5 w-full border border-sand bg-transparent font-sans text-sm text-graphite placeholder-warm-gray focus:outline-none focus:border-graphite"
                />
              </div>
              <button
                onClick={() => { setTab('add'); setForm(EMPTY_FORM); setEditId(null); }}
                className="flex items-center gap-2 bg-graphite text-cream font-sans text-xs tracking-widest uppercase px-5 py-2.5 hover:bg-graphite-light transition-colors"
              >
                <Icon name="Plus" size={14} />
                Добавить
              </button>
            </div>

            <div className="bg-white border border-sand overflow-hidden">
              <table className="w-full">
                <thead className="bg-milk border-b border-sand">
                  <tr>
                    <th className="font-sans text-[10px] tracking-widest uppercase text-warm-gray text-left px-4 py-3">Товар</th>
                    <th className="font-sans text-[10px] tracking-widest uppercase text-warm-gray text-left px-4 py-3 hidden md:table-cell">Категория</th>
                    <th className="font-sans text-[10px] tracking-widest uppercase text-warm-gray text-left px-4 py-3">Цена</th>
                    <th className="font-sans text-[10px] tracking-widest uppercase text-warm-gray text-left px-4 py-3 hidden md:table-cell">Статус</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p, i) => (
                    <tr key={p.id} className={`border-b border-sand last:border-0 hover:bg-milk/50 transition-colors ${i % 2 === 0 ? '' : 'bg-cream/30'}`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={p.image} alt="" className="w-10 h-10 object-cover bg-sand flex-shrink-0" />
                          <div>
                            <p className="font-sans text-sm text-graphite font-medium leading-tight">{p.name}</p>
                            {(p.isNew || p.isBestseller) && (
                              <div className="flex gap-1 mt-0.5">
                                {p.isNew && <span className="font-sans text-[8px] tracking-widest uppercase bg-graphite text-cream px-1.5 py-0.5">NEW</span>}
                                {p.isBestseller && <span className="font-sans text-[8px] tracking-widest uppercase bg-gold text-cream px-1.5 py-0.5">HIT</span>}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="font-sans text-xs text-warm-gray">{getCatLabel(p.category)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-sans text-sm text-graphite">{p.price.toLocaleString('ru-RU')} ₽</span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className={`font-sans text-xs ${p.inStock ? 'text-green-600' : 'text-red-500'}`}>
                          {p.inStock ? '● В наличии' : '○ Нет'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 justify-end">
                          <button onClick={() => startEdit(p)} className="p-1.5 text-warm-gray hover:text-graphite transition-colors">
                            <Icon name="Pencil" size={14} />
                          </button>
                          {deleteConfirm === p.id ? (
                            <div className="flex items-center gap-1">
                              <button onClick={() => handleDelete(p.id)} className="font-sans text-[10px] text-red-500 hover:text-red-700 border border-red-200 px-2 py-1">Удалить</button>
                              <button onClick={() => setDeleteConfirm(null)} className="font-sans text-[10px] text-warm-gray border border-sand px-2 py-1">Отмена</button>
                            </div>
                          ) : (
                            <button onClick={() => setDeleteConfirm(p.id)} className="p-1.5 text-warm-gray hover:text-red-500 transition-colors">
                              <Icon name="Trash2" size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="text-center py-12">
                  <p className="font-sans text-sm text-warm-gray">Товары не найдены</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Add / Edit Form */}
        {tab === 'add' && (
          <form onSubmit={handleSubmit} className="max-w-2xl">
            <div className="grid grid-cols-1 gap-6">
              {/* Name */}
              <div>
                <label className="font-sans text-[10px] tracking-widest uppercase text-warm-gray block mb-2">Название товара *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Бергамот и белый чай"
                  className="w-full border border-sand bg-transparent font-sans text-sm text-graphite px-4 py-3 focus:outline-none focus:border-graphite placeholder-warm-gray"
                />
              </div>

              {/* Category + Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-sans text-[10px] tracking-widest uppercase text-warm-gray block mb-2">Категория *</label>
                  <select
                    required
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value as Category })}
                    className="w-full border border-sand bg-cream font-sans text-sm text-graphite px-4 py-3 focus:outline-none focus:border-graphite"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.slug} value={c.slug}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-sans text-[10px] tracking-widest uppercase text-warm-gray block mb-2">Цена (₽) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={form.price}
                    onChange={e => setForm({ ...form, price: e.target.value })}
                    placeholder="2800"
                    className="w-full border border-sand bg-transparent font-sans text-sm text-graphite px-4 py-3 focus:outline-none focus:border-graphite placeholder-warm-gray"
                  />
                </div>
              </div>

              {/* Old price */}
              <div>
                <label className="font-sans text-[10px] tracking-widest uppercase text-warm-gray block mb-2">Старая цена (₽) — для скидки</label>
                <input
                  type="number"
                  value={form.oldPrice}
                  onChange={e => setForm({ ...form, oldPrice: e.target.value })}
                  placeholder="3500"
                  className="w-full border border-sand bg-transparent font-sans text-sm text-graphite px-4 py-3 focus:outline-none focus:border-graphite placeholder-warm-gray"
                />
              </div>

              {/* Description */}
              <div>
                <label className="font-sans text-[10px] tracking-widest uppercase text-warm-gray block mb-2">Описание *</label>
                <textarea
                  required
                  rows={4}
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Изысканная свеча ручной работы..."
                  className="w-full border border-sand bg-transparent font-sans text-sm text-graphite px-4 py-3 focus:outline-none focus:border-graphite placeholder-warm-gray resize-none"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="font-sans text-[10px] tracking-widest uppercase text-warm-gray block mb-2">Ноты аромата (через запятую)</label>
                <input
                  type="text"
                  value={form.notes}
                  onChange={e => setForm({ ...form, notes: e.target.value })}
                  placeholder="Бергамот, Белый чай, Мускус"
                  className="w-full border border-sand bg-transparent font-sans text-sm text-graphite px-4 py-3 focus:outline-none focus:border-graphite placeholder-warm-gray"
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="font-sans text-[10px] tracking-widest uppercase text-warm-gray block mb-2">Ссылка на фото</label>
                <input
                  type="url"
                  value={form.image}
                  onChange={e => setForm({ ...form, image: e.target.value })}
                  placeholder="https://..."
                  className="w-full border border-sand bg-transparent font-sans text-sm text-graphite px-4 py-3 focus:outline-none focus:border-graphite placeholder-warm-gray"
                />
                {form.image && (
                  <img src={form.image} alt="" className="mt-2 w-24 h-24 object-cover border border-sand" />
                )}
              </div>

              {/* Flags */}
              <div className="flex flex-wrap gap-4">
                {[
                  { key: 'inStock', label: 'В наличии' },
                  { key: 'isNew', label: 'Новинка' },
                  { key: 'isBestseller', label: 'Хит продаж' },
                ].map(flag => (
                  <label key={flag.key} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form[flag.key as keyof typeof form] as boolean}
                      onChange={e => setForm({ ...form, [flag.key]: e.target.checked })}
                      className="w-4 h-4 accent-graphite"
                    />
                    <span className="font-sans text-sm text-graphite">{flag.label}</span>
                  </label>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-graphite text-cream font-sans text-xs tracking-widest uppercase py-4 hover:bg-graphite-light transition-colors"
                >
                  {editId ? 'Сохранить изменения' : 'Добавить товар'}
                </button>
                <button
                  type="button"
                  onClick={() => { setTab('products'); setEditId(null); setForm(EMPTY_FORM); }}
                  className="border border-sand text-warm-gray font-sans text-xs tracking-widest uppercase px-6 py-4 hover:border-graphite hover:text-graphite transition-colors"
                >
                  Отмена
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
