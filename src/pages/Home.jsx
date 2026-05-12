import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Star, Truck, RotateCcw, Lock, Sparkles } from 'lucide-react';
import { featuredProducts, categories } from '../data/products';
import ProductCard from '../components/ProductCard';
import Slideshow from '../components/Slideshow';
import MensCollection from '../components/MensCollection';
import PerfumeCollection from '../components/PerfumeCollection';

// All /images/... paths resolve to public/images/ in Vite.
// dist/images/ is just a build copy — never reference it directly.
const categoryData = [
  { name: 'Boubous',  image: '/images/IMG_1740.jpeg',  count: 5 },
  { name: 'Gowns',    image: '/images/IMG_1532.jpeg',  count: 4 },
  { name: 'Ankara',   image: '/images/IMG_1739.jpeg',  count: 2 },
  { name: 'Perfumes', image: '/images/IMG_1743.jpeg', count: 4 },
];

const heroSlides = [
  {
    image: '/images/IMG_1755.jpeg',
    tag: 'New Collection — 2025',
    heading: 'Dressed in\nGrace &\nTradition',
    sub: 'Handcrafted Nigerian fashion for the modern woman.',
    cta: 'Shop the Collection',
  },
  {
    image: '/images/IMG_1752.jpeg',
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

const FALLBACK_HERO = 'https://images.unsplash.com/photo-1558171813-5e3d4e0c64ae?w=1600&q=80';
const FALLBACK_CARD = 'https://images.unsplash.com/photo-1558171813-5e3d4e0c64ae?w=600&q=80';
const FALLBACK_STORY = 'https://images.unsplash.com/photo-1558171813-5e3d4e0c64ae?w=800&q=80';

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
          <img
            src={slide.image}
            alt="Hero"
            className="object-cover w-full h-full transition-opacity duration-1000"
            onError={e => { e.target.onerror = null; e.target.src = FALLBACK_HERO; }}
          />
          <div className="absolute inset-0 hero-overlay" />
        </div>
        <div className="relative z-10 flex items-center h-full">
          <div className="w-full px-6 pt-20 mx-auto max-w-7xl">
            <span className="block mb-4 tag animate-fade-in">{slide.tag}</span>
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-charcoal-800 leading-[1.05] whitespace-pre-line mb-6 animate-fade-up font-light italic">
              {slide.heading}
            </h1>
            <p className="max-w-sm mb-10 text-lg font-body text-charcoal-700/70 animate-fade-up" style={{ animationDelay: '0.15s' }}>
              {slide.sub}
            </p>
            <div className="flex flex-wrap items-center gap-4 animate-fade-up" style={{ animationDelay: '0.3s' }}>
              <Link to="/products" className="btn-primary">{slide.cta} <ArrowRight size={16} /></Link>
              <Link to="/faq" className="btn-outline">Size Guide</Link>
            </div>
          </div>
        </div>
        {/* Dots */}
        <div className="absolute z-10 flex gap-2 -translate-x-1/2 bottom-8 left-1/2">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setHeroIdx(i)}
              className={`transition-all duration-300 ${i === heroIdx ? 'w-8 h-2 bg-blush-500' : 'w-2 h-2 bg-charcoal-700/30 hover:bg-charcoal-700/50'}`}
            />
          ))}
        </div>
      </section>

      {/* ── Perks ── */}
      <section className="py-5 bg-sand-100 border-y border-sand-200">
        <div className="grid grid-cols-2 gap-5 px-6 mx-auto max-w-7xl lg:grid-cols-4">
          {perks.map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="flex items-center justify-center bg-white w-9 h-9 shadow-soft shrink-0">
                <Icon size={17} className="text-blush-500" />
              </div>
              <div>
                <p className="text-xs font-semibold font-body text-charcoal-800">{label}</p>
                <p className="hidden text-xs font-body text-charcoal-700/50 sm:block">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Slideshow ── */}
      <Slideshow />

      {/* ── Categories ── */}
      <section className="px-6 py-20 mx-auto max-w-7xl">
        <div className="flex items-end justify-between mb-12">
          <div className="animate-on-scroll">
            <span className="block mb-2 tag">Browse by</span>
            <h2 className="italic font-light section-heading">Shop by Category</h2>
          </div>
          <Link
            to="/products"
            className="items-center hidden gap-2 text-sm transition-colors sm:flex font-body text-charcoal-700 hover:text-blush-500 animate-on-scroll"
          >
            View all <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {categoryData.map((cat, i) => (
            <Link
              key={cat.name}
              to={`/products?category=${cat.name}`}
              className="group relative overflow-hidden aspect-[3/4] bg-sand-100 animate-on-scroll"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                onError={e => { e.target.onerror = null; e.target.src = FALLBACK_CARD; }}
              />
              <div className="absolute inset-0 transition-colors duration-300 bg-charcoal-900/20 group-hover:bg-charcoal-900/40" />
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 bg-gradient-to-t from-charcoal-900/80 to-transparent">
                <h3 className="text-lg italic font-light text-white font-display sm:text-xl">{cat.name}</h3>
                <p className="text-xs font-body text-white/70">{cat.count} styles</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured Women's Carousel ── */}
      <section className="py-16 bg-sand-100/60">
        <div className="px-6 mx-auto max-w-7xl">
          <div className="flex items-end justify-between mb-10">
            <div className="animate-on-scroll">
              <span className="block mb-2 tag">Women's Picks</span>
              <h2 className="italic font-light section-heading">Featured Pieces</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollCarousel(-1)}
                disabled={atStart}
                className="flex items-center justify-center transition-all duration-200 border w-9 h-9 border-charcoal-800 disabled:opacity-30 hover:bg-charcoal-800 hover:text-white"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => scrollCarousel(1)}
                disabled={atEnd}
                className="flex items-center justify-center transition-all duration-200 border w-9 h-9 border-charcoal-800 disabled:opacity-30 hover:bg-charcoal-800 hover:text-white"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div
            ref={scrollRef}
            className="flex gap-5 pb-2 overflow-x-auto no-scrollbar"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {featuredProducts.map(product => (
              <div
                key={product.id}
                className="flex-shrink-0 w-[80vw] sm:w-[calc(50%-10px)] lg:w-[calc(25%-15px)]"
                style={{ scrollSnapAlign: 'start' }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link to="/products" className="inline-flex items-center gap-2 btn-outline">
              View All Women's <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Men's Collection ── */}
      <MensCollection />

      {/* ── Perfume Collection ── */}
      <PerfumeCollection />

      {/* ── Editorial / Our Story ── */}
      <section className="px-6 py-24">
        <div className="grid items-center gap-10 mx-auto max-w-7xl md:grid-cols-2">
          <div className="relative order-2 animate-on-scroll md:order-1">
            <div className="absolute w-full h-full border -top-4 -left-4 border-blush-200 -z-10" />
            <img
              src="/images/IMG_1754.jpeg"
              alt="Our Story"
              className="w-full aspect-[4/5] object-cover"
              onError={e => { e.target.onerror = null; e.target.src = FALLBACK_STORY; }}
            />
          </div>
          <div className="order-1 animate-on-scroll md:order-2 md:pl-8">
            <span className="block mb-4 tag">Our Story</span>
            <h2 className="mb-6 text-4xl italic font-light leading-tight font-display sm:text-5xl text-charcoal-800">
              Fashion Rooted in<br />Nigerian Heritage
            </h2>
            <div className="w-12 h-px mb-6 bg-blush-500" />
            <p className="mb-5 leading-relaxed font-body text-charcoal-700/70">
              Born in Kano, Nigeria, Nura Bahar is a celebration of feminine elegance and cultural pride.
              Every piece — from our flowing boubous to our hand-printed Ankara gowns — is crafted with care and worn with joy.
            </p>
            <p className="mb-10 leading-relaxed font-body text-charcoal-700/70">
              We believe fashion is a love language. Our designs are made for the woman who carries her heritage beautifully
              and steps boldly into every room she enters.
            </p>
            <Link to="/products" className="inline-flex items-center gap-2 btn-blush">
              Shop the Collection <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-16 bg-charcoal-900 text-cream-50">
        <div className="max-w-5xl px-6 mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles size={16} className="text-gold-400" />
            <span className="tag-gold">What our customers say</span>
            <Sparkles size={16} className="text-gold-400" />
          </div>
          <h2 className="mb-12 text-3xl italic font-light font-display md:text-4xl text-cream-50">
            Loved Across Nigeria
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { quote: 'The teal satin boubou is absolutely stunning. Everyone kept asking where I got it!', name: 'Aisha M.', location: 'Kano', stars: 5 },
              { quote: "My Luna Dress fits like a dream. Quality beyond what I expected at this price.", name: 'Fatima A.', location: 'Lagos', stars: 5 },
              { quote: 'The Ankara bell-sleeve is a masterpiece. Fast delivery to Abuja too!', name: 'Zainab K.', location: 'Abuja', stars: 5 },
            ].map(t => (
              <div key={t.name} className="p-6 text-left glass animate-on-scroll">
                <div className="flex mb-3">
                  {[1,2,3,4,5].map(s => (
                    <span key={s} className={`text-sm ${s <= t.stars ? 'text-amber-400' : 'text-cream-50/20'}`}>★</span>
                  ))}
                </div>
                <p className="mb-4 text-sm italic leading-relaxed font-body text-cream-50/80">"{t.quote}"</p>
                <p className="text-xs font-medium font-body text-blush-400">{t.name} · {t.location}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section className="px-6 py-16 bg-blush-50 border-y border-blush-100">
        <div className="max-w-lg mx-auto text-center animate-on-scroll">
          <span className="block mb-3 tag">Stay in the loop</span>
          <h2 className="mb-3 text-3xl italic font-light font-display text-charcoal-800">
            Join the NuraBahar Family
          </h2>
          <p className="text-sm font-body text-charcoal-700/60 mb-7">
            Get early access to new collections, exclusive offers, and style inspiration.
          </p>
          <div className="flex gap-0">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-3 text-sm transition-colors bg-white border border-r-0 border-sand-300 font-body focus:outline-none focus:border-blush-500"
            />
            <button className="px-6 py-3 btn-blush shrink-0">Subscribe</button>
          </div>
        </div>
      </section>

    </div>
  );
}