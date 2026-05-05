import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { mensProducts } from '../data/products';
import ProductCard from './ProductCard';

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

export default function MensCollection() {
  const ref = useScrollReveal();

  return (
    <section ref={ref} className="py-20 px-6 bg-navy-900">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-end justify-between mb-12 animate-on-scroll">
          <div>
            <span className="tag-gold block mb-3">Men's Collection</span>
            <h2 className="font-display text-4xl sm:text-5xl text-cream-50 font-light italic">
              Dressed for<br />Distinction
            </h2>
            <div className="w-12 h-px bg-gold-500 mt-5" />
          </div>
          <Link to="/products?gender=men"
            className="hidden sm:flex items-center gap-2 font-body text-sm text-cream-50/60 hover:text-gold-400 transition-colors">
            View all men's <ArrowRight size={16} />
          </Link>
        </div>

        {/* Grid — 1 col mobile, 2 tablet, 4 desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {mensProducts.map((product, i) => (
            <div key={product.id}
              className="animate-on-scroll"
              style={{ transitionDelay: `${i * 80}ms` }}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-10 text-center sm:hidden animate-on-scroll">
          <Link to="/products?gender=men"
            className="btn-gold inline-flex items-center gap-2">
            View All Men's <ArrowRight size={16} />
          </Link>
        </div>

        {/* Bottom accent */}
        <div className="mt-16 border-t border-white/10 pt-10 flex flex-col sm:flex-row items-center justify-between gap-6 animate-on-scroll">
          {[
            { label: 'Custom Sizing', sub: '+₦3,000 – ₦8,000' },
            { label: 'Premium Fabric', sub: 'Brocade, Guinea, George' },
            { label: 'Ceremony Ready', sub: 'Weddings, Aso-Ebi, Events' },
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
