import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const badgeColors = {
  Bestseller: 'bg-amber-100 text-amber-800',
  New:        'bg-emerald-100 text-emerald-800',
  Sale:       'bg-blush-100 text-blush-600',
  Luxury:     'bg-gold-400/20 text-gold-600',
  Bridal:     'bg-pink-100 text-pink-700',
  Premium:    'bg-navy-800 text-cream-50',
};

// Returns true if the product was created within the last 20 days
function isNewProduct(product) {
  const created = product.created || product.createdAt || product.dateAdded;
  if (!created) return false;
  const uploadDate = new Date(created);
  if (isNaN(uploadDate.getTime())) return false;
  const diffMs   = Date.now() - uploadDate.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays <= 20;
}

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  // Show "New" badge only if the product was uploaded within 20 days,
  // regardless of whatever badge was manually set in the data.
  const badge = isNewProduct(product) ? 'New' : product.badge === 'New' ? null : product.badge;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const size  = product.sizes?.[0]  || 'One Size';
    const color = product.colors?.[0] || '';
    addToCart(product, size, color, 1);
  };

  return (
    <Link to={`/products/${product.id}`}
      className="relative block overflow-hidden transition-shadow duration-300 bg-white group hover:shadow-card">

      {/* Image */}
      <div className="relative overflow-hidden bg-sand-100 aspect-[3/4]">
        <img
          src={product.images?.[0]}
          alt={product.name}
          className="object-cover w-full h-full product-card-image"
          onError={e => {
            if (!e.target.src.endsWith('.svg')) {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1558171813-5e3d4e0c64ae?w=600&q=80';
            }
          }}
          loading="lazy"
        />

        {/* Badge */}
        {badge && (
          <span className={`badge font-body text-xs font-medium px-2 py-1 ${badgeColors[badge] || 'bg-charcoal-800 text-cream-50'}`}>
            {badge}
          </span>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 transition-all duration-300 bg-charcoal-900/0 group-hover:bg-charcoal-900/10" />
        <div className="absolute bottom-0 left-0 right-0 flex gap-2 p-3 transition-transform duration-300 translate-y-full group-hover:translate-y-0">
          <button onClick={handleQuickAdd}
            className="flex-1 bg-white text-charcoal-800 font-body text-xs font-medium py-2.5 hover:bg-charcoal-800 hover:text-white transition-colors duration-200 flex items-center justify-center gap-1.5">
            <ShoppingBag size={13} /> Quick Add
          </button>
          <button onClick={e => { e.preventDefault(); }}
            className="flex items-center justify-center w-10 transition-colors duration-200 bg-white text-charcoal-800 hover:bg-blush-500 hover:text-white">
            <Heart size={14} />
          </button>
        </div>

        {/* Sale % pill */}
        {product.originalPrice && (
          <span className="absolute top-3 right-3 bg-blush-500 text-white font-body text-xs px-2 py-0.5">
            -{Math.round((1 - product.price / product.originalPrice) * 100)}%
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="mb-1 text-xs tracking-widest uppercase font-body text-blush-500">{product.category}</p>
        <h3 className="mb-2 text-base font-light leading-snug transition-colors font-display text-charcoal-800 group-hover:text-blush-500">
          {product.name}
        </h3>
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-semibold font-body text-charcoal-800">
              {`₦${product.price.toLocaleString('en-NG')}`}
            </span>
            {product.originalPrice && (
              <span className="text-xs line-through font-body text-charcoal-700/40">
                {`₦${product.originalPrice.toLocaleString('en-NG')}`}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-amber-400">★</span>
            <span className="text-xs font-body text-charcoal-700/50">{product.rating}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}