import { useState, useMemo } from 'react';
import { useStore, Category } from '@/store/useStore';
import ProductCard from '@/components/ProductCard';
import Icon from '@/components/ui/icon';

const CATEGORIES: { label: string; slug: Category | 'all' }[] = [
  { label: 'Все', slug: 'all' },
  { label: 'Свечи', slug: 'candles' },
  { label: 'Диффузоры', slug: 'diffusers' },
  { label: 'Авто ароматы', slug: 'car' },
  { label: 'Подарки', slug: 'gifts' },
  { label: 'Весна', slug: 'spring' },
];

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'new';

export default function CatalogPage() {
  const { products, selectedCategory, setCategory, setPage } = useStore();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOption>('default');

  const filtered = useMemo(() => {
    let list = [...products];
    if (selectedCategory !== 'all') {
      list = list.filter(p => p.category === selectedCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.notes.some(n => n.toLowerCase().includes(q))
      );
    }
    switch (sort) {
      case 'price-asc': return list.sort((a, b) => a.price - b.price);
      case 'price-desc': return list.sort((a, b) => b.price - a.price);
      case 'new': return list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      default: return list;
    }
  }, [products, selectedCategory, search, sort]);

  const catTitle = CATEGORIES.find(c => c.slug === selectedCategory)?.label || 'Каталог';

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-milk border-b border-sand py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-sans text-[10px] tracking-ultra uppercase text-warm-gray mb-3">
            {selectedCategory === 'all' ? 'Весь ассортимент' : 'Категория'}
          </p>
          <h1 className="font-serif text-3xl md:text-5xl font-light text-graphite">
            {catTitle}
          </h1>
          <p className="font-sans text-sm text-warm-gray mt-2">
            {filtered.length} {getCountLabel(filtered.length)}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between mb-10">
          {/* Category tabs */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat.slug}
                onClick={() => setCategory(cat.slug)}
                className={`font-sans text-[10px] tracking-widest uppercase px-4 py-2 border transition-colors ${
                  selectedCategory === cat.slug
                    ? 'bg-graphite text-cream border-graphite'
                    : 'border-sand text-warm-gray hover:border-graphite hover:text-graphite'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search + Sort */}
          <div className="flex gap-3">
            <div className="relative">
              <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-gray" />
              <input
                type="text"
                placeholder="Поиск по аромату..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 border border-sand bg-transparent font-sans text-sm text-graphite placeholder-warm-gray focus:outline-none focus:border-graphite w-48 md:w-64"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Icon name="X" size={12} className="text-warm-gray" />
                </button>
              )}
            </div>
            <select
              value={sort}
              onChange={e => setSort(e.target.value as SortOption)}
              className="border border-sand bg-cream font-sans text-xs text-warm-gray px-3 py-2 focus:outline-none focus:border-graphite cursor-pointer"
            >
              <option value="default">По умолчанию</option>
              <option value="price-asc">Сначала дешевле</option>
              <option value="price-desc">Сначала дороже</option>
              <option value="new">Новинки</option>
            </select>
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <div className="text-4xl">🕯️</div>
            <p className="font-serif text-xl text-graphite">Ничего не найдено</p>
            <p className="font-sans text-sm text-warm-gray">Попробуйте изменить фильтры или поисковый запрос</p>
            <button
              onClick={() => { setSearch(''); setCategory('all'); }}
              className="mt-2 font-sans text-xs tracking-widest uppercase text-graphite border border-graphite px-6 py-3 hover:bg-graphite hover:text-cream transition-colors"
            >
              Сбросить фильтры
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filtered.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onView={() => setPage(`product-${product.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function getCountLabel(n: number) {
  if (n % 10 === 1 && n % 100 !== 11) return 'позиция';
  if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100)) return 'позиции';
  return 'позиций';
}
