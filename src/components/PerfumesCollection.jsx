import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { products } from '../data/products';
import ProductCard from './ProductCard';

const perfumeProducts = products.filter(p => p.category === 'Perfumes');

function useScrollReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => e.target.classList.toggle('visible', e.isIntersecting)),
      { threshold: 0.1 }
    );
    const el = ref.current;
    if (el) el.querySelectorAll('.animate-on-scroll').forEach(child => observer.observe(child));
    return () => observer.disconnect();
  }, []);
  return ref;
}

export default function PerfumesCollection() {
  const ref = useScrollReveal();

  return (
    <section ref={ref} className="py-20 px-6 bg-[#1a0e07]">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-end justify-between mb-12 animate-on-scroll">
          <div>
            <span className="tag-gold block mb-3">Fragrance Collection</span>
            <h2 className="font-display text-4xl sm:text-5xl text-cream-50 font-light italic">
              Scented in<br />Elegance
            </h2>
            <div className="w-12 h-px bg-gold-500 mt-5" />
          </div>
          <Link to="/products?category=Perfumes"
            className="hidden sm:flex items-center gap-2 font-body text-sm text-cream-50/60 hover:text-gold-400 transition-colors">
            View all fragrances <ArrowRight size={16} />
          </Link>
        </div>

        {/* Grid — 1 col mobile, 2 tablet, 4 desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {perfumeProducts.map((product, i) => (
            <div key={product.id}
              className="animate-on-scroll"
              style={{ transitionDelay: `${i * 80}ms` }}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-10 text-center sm:hidden animate-on-scroll">
          <Link to="/products?category=Perfumes"
            className="btn-gold inline-flex items-center gap-2">
            View All Fragrances <ArrowRight size={16} />
          </Link>
        </div>

        {/* Bottom accent */}
        <div className="mt-16 border-t border-white/10 pt-10 flex flex-col sm:flex-row items-center justify-between gap-6 animate-on-scroll">
          {[
            { label: 'Alcohol-Free Oils', sub: 'Long-lasting & skin-safe' },
            { label: 'Nigerian Oud Blends', sub: 'Crafted with local ingredients' },
            { label: 'Gift-Ready Packaging', sub: 'Perfect for special occasions' },
          ].map(item => (
            <div key={item.label} className="text-center">
              <p className="font-display text-lg text-cream-50 font-light italic">{item.label}</p>
              <p className="font-body text-xs text-cream-50/50 mt-1">{item.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
