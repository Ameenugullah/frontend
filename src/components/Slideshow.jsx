import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// All paths here map to public/images/ — never reference /dist/images/
const slides = [
  {
    image: '/images/IMG_1740.jpeg',
    tag: 'New Arrivals',
    heading: 'Teal Satin\nCollection',
    sub: 'Luxurious satin with ruffle trim — made for the elegant woman.',
    cta: { label: 'Shop Boubous', href: '/products?category=Boubous' },
    accent: 'blush',
  },
  {
    image: '/images/IMG_1742.jpeg',
    tag: 'Limited Edition',
    heading: 'Coral Cape\nGown',
    sub: 'A dramatic silhouette for unforgettable occasions.',
    cta: { label: 'Shop Gowns', href: '/products?category=Gowns' },
    accent: 'gold',
  },
  {
    image: '/images/IMG_1739.jpeg',
    tag: 'Heritage Pieces',
    heading: 'Ankara\nBell-Sleeve',
    sub: 'Bold prints, modern cuts — celebrating Nigerian heritage.',
    cta: { label: 'Shop Ankara', href: '/products?category=Ankara' },
    accent: 'blush',
  },
  {
    image: '/images/IMG_1532.jpeg',
    tag: 'Bestseller',
    heading: 'Luna Dress\nCollection',
    sub: 'The dress everyone is talking about. Available in 3 colours.',
    cta: { label: 'Shop Now', href: '/products' },
    accent: 'gold',
  },
];

const FALLBACK = 'https://images.unsplash.com/photo-1558171813-5e3d4e0c64ae?w=1200&q=80';

export default function Slideshow() {
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  const goTo = useCallback((idx) => {
    if (transitioning) return;
    setTransitioning(true);
    setTimeout(() => {
      setCurrent(idx);
      setTransitioning(false);
    }, 300);
  }, [transitioning]);

  const prev = () => goTo((current - 1 + slides.length) % slides.length);
  const next = useCallback(() => goTo((current + 1) % slides.length), [current, goTo]);

  useEffect(() => {
    const t = setInterval(next, 4000);
    return () => clearInterval(t);
  }, [next]);

  const slide = slides[current];

  return (
    <section className="relative w-full overflow-hidden bg-charcoal-900" style={{ height: 'clamp(400px, 70vw, 680px)' }}>
      {/* Preload all slide images, show active one */}
      {slides.map((s, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === current && !transitioning ? 1 : 0 }}
        >
          <img
            src={s.image}
            alt={s.heading}
            className="object-cover object-top w-full h-full"
            onError={e => { e.target.onerror = null; e.target.src = FALLBACK; }}
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to right, rgba(26,26,26,0.75) 40%, rgba(26,26,26,0.2) 100%)' }}
          />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 flex items-center h-full">
        <div className="w-full px-6 mx-auto max-w-7xl sm:px-10">
          <div className={`transition-all duration-500 ${transitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
            <span className={`font-body text-xs tracking-[0.25em] uppercase mb-4 block ${slide.accent === 'gold' ? 'text-gold-400' : 'text-blush-400'}`}>
              {slide.tag}
            </span>
            <h2 className="mb-4 text-4xl italic font-light leading-tight text-white whitespace-pre-line font-display sm:text-5xl md:text-6xl">
              {slide.heading}
            </h2>
            <p className="max-w-sm mb-8 text-base font-body text-white/70 sm:text-lg">
              {slide.sub}
            </p>
            <Link
              to={slide.cta.href}
              className={`inline-flex items-center gap-2 px-7 py-3 font-body text-sm font-medium transition-all duration-200 ${slide.accent === 'gold' ? 'bg-gold-500 hover:bg-gold-600 text-white' : 'bg-blush-500 hover:bg-blush-600 text-white'}`}
            >
              {slide.cta.label}
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      {/* Arrow controls */}
      <button
        onClick={prev}
        className="absolute z-20 flex items-center justify-center w-10 h-10 text-white transition-all duration-200 -translate-y-1/2 border left-4 top-1/2 bg-white/10 hover:bg-white/25 backdrop-blur-sm border-white/20"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={next}
        className="absolute z-20 flex items-center justify-center w-10 h-10 text-white transition-all duration-200 -translate-y-1/2 border right-4 top-1/2 bg-white/10 hover:bg-white/25 backdrop-blur-sm border-white/20"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dots */}
      <div className="absolute z-20 flex items-center gap-2 -translate-x-1/2 bottom-6 left-1/2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`transition-all duration-300 rounded-full ${i === current ? 'w-8 h-2 bg-white' : 'w-2 h-2 bg-white/40 hover:bg-white/70'}`}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10 z-20">
        <div
          className="h-full transition-none bg-blush-500"
          style={{
            width: `${((current + 1) / slides.length) * 100}%`,
            transition: 'width 4s linear',
          }}
        />
      </div>
    </section>
  );
}