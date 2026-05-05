import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { categories, mensCategories } from '../data/products';
import ProductCard from '../components/ProductCard';
import { useAdmin } from '../context/AdminContext';

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
];

const MAX_PRICE = 200000;

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'All');
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState([0, MAX_PRICE]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const searchQuery = searchParams.get('search') || '';
  const genderParam = searchParams.get('gender') || '';
  const { allProducts } = useAdmin();

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setActiveCategory(cat);
    else setActiveCategory('All');
  }, [searchParams]);

  const cats = genderParam === 'men' ? mensCategories : categories;

  const filtered = useMemo(() => {
    if (!allProducts?.length) return [];
    let list = [...allProducts];
    if (genderParam) list = list.filter(p => p.gender === genderParam);
    if (activeCategory !== 'All') list = list.filter(p => p.category === activeCategory);
    if (searchQuery) list = list.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    list = list.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    switch (sortBy) {
      case 'price-asc':  list.sort((a, b) => a.price - b.price); break;
      case 'price-desc': list.sort((a, b) => b.price - a.price); break;
      case 'rating':     list.sort((a, b) => b.rating - a.rating); break;
    }
    return list;
  }, [activeCategory, sortBy, priceRange, searchQuery, allProducts, genderParam]);

  const pageTitle = searchQuery
    ? `Results for "${searchQuery}"`
    : genderParam === 'men'
    ? "Men's Collection"
    : genderParam === 'women'
    ? "Women's Collection"
    : activeCategory === 'All' ? 'All Products' : activeCategory;

  const clearAll = () => {
    setActiveCategory('All');
    setSearchParams({});
    setPriceRange([0, MAX_PRICE]);
  };

  return (
    <div className="min-h-screen bg-cream-50 pt-24">
      {/* Header */}
      <div className="bg-sand-100 border-b border-sand-200 py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <span className="tag block mb-2">Discover your style</span>
          <h1 className="section-heading font-light italic">{pageTitle}</h1>
          <p className="font-body text-sm text-charcoal-700/60 mt-2">{filtered.length} pieces</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Filters bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {cats.map(cat => (
              <button key={cat}
                onClick={() => { setActiveCategory(cat); setSearchParams({ ...(genderParam ? { gender: genderParam } : {}), ...(cat !== 'All' ? { category: cat } : {}) }); }}
                className={`font-body text-sm px-4 py-2 transition-all duration-200 ${activeCategory === cat ? 'bg-charcoal-800 text-cream-50' : 'bg-white border border-sand-200 text-charcoal-700 hover:border-charcoal-700'}`}>
                {cat}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <button onClick={() => setFiltersOpen(o => !o)}
              className="flex items-center gap-2 font-body text-sm border border-sand-200 bg-white px-4 py-2 hover:border-charcoal-700 transition-colors">
              <SlidersHorizontal size={15} /> Filters
            </button>
            <div className="relative">
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                className="font-body text-sm border border-sand-200 bg-white px-4 py-2 pr-8 appearance-none cursor-pointer focus:outline-none hover:border-charcoal-700 transition-colors">
                {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-charcoal-700/60" />
            </div>
          </div>
        </div>

        {/* Price filter */}
        {filtersOpen && (
          <div className="bg-white border border-sand-200 p-6 mb-8 shadow-soft animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-body font-medium text-charcoal-800">Price Range</h3>
              <button onClick={() => setFiltersOpen(false)}><X size={18} className="text-charcoal-700/50" /></button>
            </div>
            <label className="font-body text-xs tracking-widest uppercase text-charcoal-700/60 mb-3 block">
              {`₦${priceRange[0].toLocaleString('en-NG')} — ₦${priceRange[1].toLocaleString('en-NG')}`}
            </label>
            <input type="range" min={0} max={MAX_PRICE} step={1000} value={priceRange[1]}
              onChange={e => setPriceRange([0, Number(e.target.value)])}
              className="w-full accent-blush-500" />
            <div className="flex justify-between font-body text-xs text-charcoal-700/50 mt-1">
              <span>₦0</span><span>{`₦${MAX_PRICE.toLocaleString('en-NG')}`}</span>
            </div>
          </div>
        )}

        {/* Active chips */}
        {(activeCategory !== 'All' || searchQuery || genderParam) && (
          <div className="flex flex-wrap gap-2 mb-6">
            {genderParam && (
              <span className="flex items-center gap-1.5 bg-blush-100 text-blush-600 font-body text-xs px-3 py-1.5 capitalize">
                {genderParam}
                <button onClick={() => setSearchParams({})}><X size={11} /></button>
              </span>
            )}
            {activeCategory !== 'All' && (
              <span className="flex items-center gap-1.5 bg-blush-100 text-blush-600 font-body text-xs px-3 py-1.5">
                {activeCategory}
                <button onClick={() => { setActiveCategory('All'); setSearchParams(genderParam ? { gender: genderParam } : {}); }}><X size={11} /></button>
              </span>
            )}
            {searchQuery && (
              <span className="flex items-center gap-1.5 bg-blush-100 text-blush-600 font-body text-xs px-3 py-1.5">
                "{searchQuery}"
                <button onClick={() => setSearchParams({})}><X size={11} /></button>
              </span>
            )}
          </div>
        )}

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-display text-2xl text-charcoal-700/40 mb-4">No products found</p>
            <p className="font-body text-sm text-charcoal-700/30 mb-6">Try adjusting your filters</p>
            <button onClick={clearAll} className="btn-outline">Clear All Filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
