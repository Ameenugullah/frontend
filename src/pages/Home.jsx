import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Star, Truck, RotateCcw, Lock, Sparkles } from 'lucide-react';
import { featuredProducts, categories } from '../data/products';
import ProductCard from '../components/ProductCard';
import Slideshow from '../components/Slideshow';
import MensCollection from '../components/MensCollection';
import PerfumesCollection from '../components/PerfumesCollection';

const categoryData = [
  { name: 'Boubous',  image: '/images/teal-satin-boubou-1.jpg',  count: 5 },
  { name: 'Gowns',    image: '/images/luna-dress-1.jpg',          count: 4 },
  { name: 'Ankara',   image: '/images/ankara-dress-1.jpg',        count: 2 },
  { name: 'Perfumes', image: '/images/perfume-oils.svg',          count: 4 },
];

const heroSlides = [
  {
    image: '/images/teal-satin-boubou-2.jpg',
    tag: 'New Collection — 2025',
    heading: 'Dressed in\nGrace &\nTradition',
    sub: 'Handcrafted Nigerian fashion for the modern woman.',
    cta: 'Shop the Collection',
  },
  {
    image: '/images/coral-cape-dress-1.jpg',
    tag: 'Nura Bahar Nigeria',
    heading: 'Wear Your\nHeritage,\nFeel Beautiful',
    sub: 'From Kano to the world — with love.',
    cta: 'Explore Now',
  },
];

const perks = [
  { icon: Truck,     label: 'Nationwide Delivery', sub: 'Lagos, Kano, Abuja & more' },
  { icon: RotateCcw, label: 'Easy Returns',         sub: 'Within 7 days' },
  { icon: Lock,      label: 'Secure Payment',       sub: 'Paystack & bank transfer' },
  { icon: Star,      label: '4.9 / 5 Rating',       sub: 'Trusted by 3,000+ customers' },
];

function useScrollReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => e.target.classList.toggle('visible', e.isIntersecting)),
      { threshold: 0.08 }
    );
    const el = ref.current;
    if (el) el.querySelectorAll('.animate-on-scroll').forEach(c => observer.observe(c));
    return () => observer.disconnect();
  }, []);
  return ref;
}

export default function Home() {
  const [heroIdx, setHeroIdx] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd]     = useState(false);
  const revealRef = useScrollReveal();
  const scrollRef = useRef(null);
  const slide = heroSlides[heroIdx];

  useEffect(() => {
    const t = setInterval(() => setHeroIdx(i => (i + 1) % heroSlides.length), 6000);
    return () => clearInterval(t);
  }, []);

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    onScroll();
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const scrollCarousel = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.firstElementChild;
    el.scrollBy({ left: dir * ((card?.offsetWidth ?? 300) + 24), behavior: 'smooth' });
  };

  return (
    <div ref={revealRef}>

      {/* ── Hero ── */}
      <section className="relative h-screen min-h-[600px] max-h-[900px] overflow-hidden">
        <div className="absolute inset-0">
          <img src={slide.image} alt="Hero"
            className="w-full h-full object-cover transition-opacity duration-1000" />
          <div className="hero-overlay absolute inset-0" />
        </div>
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-6 pt-20 w-full">
            <span className="tag block mb-4 animate-fade-in">{slide.tag}</span>
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-charcoal-800 leading-[1.05] whitespace-pre-line mb-6 animate-fade-up font-light italic">
              {slide.heading}
            </h1>
            <p className="font-body text-lg text-charcoal-700/70 mb-10 max-w-sm animate-fade-up" style={{ animationDelay: '0.15s' }}>
              {slide.sub}
            </p>
            <div className="flex flex-wrap items-center gap-4 animate-fade-up" style={{ animationDelay: '0.3s' }}>
              <Link to="/products" className="btn-primary">{slide.cta} <ArrowRight size={16} /></Link>
              <Link to="/faq" className="btn-outline">Size Guide</Link>
            </div>
          </div>
        </div>
        {/* Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {heroSlides.map((_, i) => (
            <button key={i} onClick={() => setHeroIdx(i)}
              className={`transition-all duration-300 ${i === heroIdx ? 'w-8 h-2 bg-blush-500' : 'w-2 h-2 bg-charcoal-700/30 hover:bg-charcoal-700/50'}`} />
          ))}
        </div>
      </section>

      {/* ── Perks ── */}
      <section className="bg-sand-100 border-y border-sand-200 py-5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-5">
          {perks.map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="w-9 h-9 flex items-center justify-center bg-white shadow-soft shrink-0">
                <Icon size={17} className="text-blush-500" />
              </div>
              <div>
                <p className="font-body text-xs font-semibold text-charcoal-800">{label}</p>
                <p className="font-body text-xs text-charcoal-700/50 hidden sm:block">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Slideshow ── */}
      <Slideshow />

      {/* ── Categories ── */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div className="animate-on-scroll">
            <span className="tag block mb-2">Browse by</span>
            <h2 className="section-heading font-light italic">Shop by Category</h2>
          </div>
          <Link to="/products"
            className="hidden sm:flex items-center gap-2 font-body text-sm text-charcoal-700 hover:text-blush-500 transition-colors animate-on-scroll">
            View all <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {categoryData.map((cat, i) => (
            <Link key={cat.name} to={`/products?category=${cat.name}`}
              className="group relative overflow-hidden aspect-[3/4] bg-sand-100 animate-on-scroll"
              style={{ transitionDelay: `${i * 80}ms` }}>
              <img src={cat.image} alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
              <div className="absolute inset-0 bg-charcoal-900/20 group-hover:bg-charcoal-900/40 transition-colors duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 bg-gradient-to-t from-charcoal-900/80 to-transparent">
                <h3 className="font-display text-lg sm:text-xl text-white font-light italic">{cat.name}</h3>
                <p className="font-body text-xs text-white/70">{cat.count} styles</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured Women's Carousel ── */}
      <section className="py-16 bg-sand-100/60">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-10">
            <div className="animate-on-scroll">
              <span className="tag block mb-2">Women's Picks</span>
              <h2 className="section-heading font-light italic">Featured Pieces</h2>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => scrollCarousel(-1)} disabled={atStart}
                className="w-9 h-9 border border-charcoal-800 flex items-center justify-center disabled:opacity-30 hover:bg-charcoal-800 hover:text-white transition-all duration-200">
                <ChevronLeft size={16} />
              </button>
              <button onClick={() => scrollCarousel(1)} disabled={atEnd}
                className="w-9 h-9 border border-charcoal-800 flex items-center justify-center disabled:opacity-30 hover:bg-charcoal-800 hover:text-white transition-all duration-200">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div ref={scrollRef}
            className="flex gap-5 overflow-x-auto no-scrollbar pb-2"
            style={{ scrollSnapType: 'x mandatory' }}>
            {featuredProducts.map(product => (
              <div key={product.id}
                className="flex-shrink-0 w-[80vw] sm:w-[calc(50%-10px)] lg:w-[calc(25%-15px)]"
                style={{ scrollSnapAlign: 'start' }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/products" className="btn-outline inline-flex items-center gap-2">
              View All Women's <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Men's Collection ── */}
      <MensCollection />

      {/* ── Perfumes Collection ── */}
      <PerfumesCollection />

      {/* ── Editorial ── */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div className="relative animate-on-scroll order-2 md:order-1">
            <div className="absolute -top-4 -left-4 w-full h-full border border-blush-200 -z-10" />
            <img src="/images/luna-dress-2.jpg" alt="Our Story"
              className="w-full aspect-[4/5] object-cover" />
          </div>
          <div className="animate-on-scroll order-1 md:order-2 md:pl-8">
            <span className="tag block mb-4">Our Story</span>
            <h2 className="font-display text-4xl sm:text-5xl text-charcoal-800 mb-6 font-light italic leading-tight">
              Fashion Rooted in<br />Nigerian Heritage
            </h2>
            <div className="w-12 h-px bg-blush-500 mb-6" />
            <p className="font-body text-charcoal-700/70 leading-relaxed mb-5">
              Born in Kano, Nigeria, Nura Bahar is a celebration of feminine elegance and cultural pride.
              Every piece — from our flowing boubous to our hand-printed Ankara gowns — is crafted with care and worn with joy.
            </p>
            <p className="font-body text-charcoal-700/70 leading-relaxed mb-10">
              We believe fashion is a love language. Our designs are made for the woman who carries her heritage beautifully
              and steps boldly into every room she enters.
            </p>
            <Link to="/products" className="btn-blush inline-flex items-center gap-2">
              Shop the Collection <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-16 bg-charcoal-900 text-cream-50">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles size={16} className="text-gold-400" />
            <span className="tag-gold">What our customers say</span>
            <Sparkles size={16} className="text-gold-400" />
          </div>
          <h2 className="font-display text-3xl md:text-4xl text-cream-50 mb-12 font-light italic">
            Loved Across Nigeria
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { quote: 'The teal satin boubou is absolutely stunning. Everyone kept asking where I got it!', name: 'Aisha M.', location: 'Kano', stars: 5 },
              { quote: "My Luna Dress fits like a dream. Quality beyond what I expected at this price.", name: 'Fatima A.', location: 'Lagos', stars: 5 },
              { quote: 'The Ankara bell-sleeve is a masterpiece. Fast delivery to Abuja too!', name: 'Zainab K.', location: 'Abuja', stars: 5 },
            ].map(t => (
              <div key={t.name} className="glass p-6 text-left animate-on-scroll">
                <div className="flex mb-3">
                  {[1,2,3,4,5].map(s => (
                    <span key={s} className={`text-sm ${s <= t.stars ? 'text-amber-400' : 'text-cream-50/20'}`}>★</span>
                  ))}
                </div>
                <p className="font-body text-sm text-cream-50/80 leading-relaxed mb-4 italic">"{t.quote}"</p>
                <p className="font-body text-xs text-blush-400 font-medium">{t.name} · {t.location}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section className="py-16 px-6 bg-blush-50 border-y border-blush-100">
        <div className="max-w-lg mx-auto text-center animate-on-scroll">
          <span className="tag block mb-3">Stay in the loop</span>
          <h2 className="font-display text-3xl text-charcoal-800 font-light italic mb-3">
            Join the NuraBahar Family
          </h2>
          <p className="font-body text-sm text-charcoal-700/60 mb-7">
            Get early access to new collections, exclusive offers, and style inspiration.
          </p>
          <div className="flex gap-0">
            <input type="email" placeholder="Your email address"
              className="flex-1 border border-r-0 border-sand-300 bg-white px-4 py-3 font-body text-sm focus:outline-none focus:border-blush-500 transition-colors" />
            <button className="btn-blush px-6 py-3 shrink-0">Subscribe</button>
          </div>
        </div>
      </section>
    </div>
  );
}
