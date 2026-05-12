import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { allProducts } from '../data/products';
import ProductCard from './ProductCard';

function useScrollReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(entry => entry.target.classList.toggle('visible', entry.isIntersecting)),
      { threshold: 0.1 }
    );
    const el = ref.current;
    if (el) el.querySelectorAll('.animate-on-scroll').forEach(child => observer.observe(child));
    return () => observer.disconnect();
  }, []);

  return ref;
}

export default function PerfumeCollection() {
  const ref = useScrollReveal();
  const perfumeProducts = allProducts.filter(product => product.category === 'Perfumes');

  return (
    <section ref={ref} className="py-20 px-6 bg-cream-50">
      <div className="max-w-7xl mx-auto">

        <div className="flex flex-col gap-8 mb-12 animate-on-scroll sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="tag block mb-3 text-charcoal-700">Perfume Collection</span>
            <h2 className="font-display text-4xl sm:text-5xl text-charcoal-900 font-light italic">
              Fragrance for Every<br />Moment
            </h2>
            <div className="w-12 h-px bg-blush-500 mt-5" />
          </div>
          <Link to="/products?category=Perfumes"
            className="hidden sm:inline-flex items-center gap-2 font-body text-sm text-charcoal-700 hover:text-blush-500 transition-colors">
            Browse all perfumes <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {perfumeProducts.slice(0, 4).map((product, index) => (
            <div key={product.id} className="animate-on-scroll" style={{ transitionDelay: `${index * 80}ms` }}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        <div className="mt-10 text-center sm:hidden animate-on-scroll">
          <Link to="/products?category=Perfumes" className="btn-blush inline-flex items-center gap-2">
            View all perfumes <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
