import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ShoppingBag, Heart, Truck, RotateCcw, Shield, Plus, Minus, Star } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { useCart } from '../context/CartContext';

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map(s => (
        <Star key={s} size={14}
          fill={s <= Math.round(rating) ? '#fbbf24' : 'none'}
          className={s <= Math.round(rating) ? 'text-amber-400' : 'text-sand-300'} />
      ))}
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const { allProducts } = useAdmin();
  const product = allProducts.find(p => String(p.id) === id);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [imgIdx, setImgIdx]             = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [qty, setQty]                   = useState(1);
  const [added, setAdded]               = useState(false);
  const [sizeError, setSizeError]       = useState(false);
  const [colorError, setColorError]     = useState(false);

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen pt-24 bg-cream-50">
        <div className="px-6 text-center">
          <h2 className="mb-4 text-3xl font-light font-display text-charcoal-800">Product not found</h2>
          <Link to="/products" className="btn-primary">Back to Shop</Link>
        </div>
      </div>
    );
  }

  const images = product.images?.length ? product.images : ['https://images.unsplash.com/photo-1558171813-5e3d4e0c64ae?w=800&q=80'];

  const handleAddToCart = () => {
    if (!selectedSize && product.sizes?.length > 1) { setSizeError(true); return; }
    if (!selectedColor && product.colors?.length > 1) { setColorError(true); return; }
    addToCart(product, selectedSize || product.sizes?.[0] || 'One Size', selectedColor || product.colors?.[0] || '', qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const related = allProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="min-h-screen pt-24 bg-cream-50">
      <div className="px-6 py-10 mx-auto max-w-7xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-8 text-xs font-body text-charcoal-700/50">
          <Link to="/" className="transition-colors hover:text-charcoal-800">Home</Link>
          <span>/</span>
          <Link to="/products" className="transition-colors hover:text-charcoal-800">Shop</Link>
          <span>/</span>
          <span className="text-charcoal-800">{product.name}</span>
        </nav>

        <div className="grid gap-12 mb-20 lg:grid-cols-2">
          {/* Images */}
          <div>
            <div className="relative overflow-hidden bg-sand-100 aspect-[4/5] mb-3">
              <img src={images[imgIdx]} alt={product.name}
                className="object-cover w-full h-full"
                onError={e=>{e.target.onerror=null;e.target.src='https://images.unsplash.com/photo-1558171813-5e3d4e0c64ae?w=800&q=80';}} />
              {product.badge && (
                <span className="px-2 py-1 text-xs text-white badge bg-blush-500 font-body">{product.badge}</span>
              )}
              {images.length > 1 && (
                <>
                  <button onClick={() => setImgIdx(i => Math.max(0, i - 1))}
                    className="absolute flex items-center justify-center transition-all -translate-y-1/2 left-3 top-1/2 w-9 h-9 bg-white/80 hover:bg-white shadow-soft">
                    <ChevronLeft size={18} />
                  </button>
                  <button onClick={() => setImgIdx(i => Math.min(images.length - 1, i + 1))}
                    className="absolute flex items-center justify-center transition-all -translate-y-1/2 right-3 top-1/2 w-9 h-9 bg-white/80 hover:bg-white shadow-soft">
                    <ChevronRight size={18} />
                  </button>
                </>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setImgIdx(i)}
                    className={`w-16 h-20 overflow-hidden border-2 transition-all ${imgIdx === i ? 'border-charcoal-800' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                    <img src={img} alt="" className="object-cover w-full h-full" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <p className="mb-2 tag">{product.category}</p>
            <h1 className="mb-4 text-3xl italic font-light leading-tight font-display sm:text-4xl text-charcoal-800">{product.name}</h1>
            <div className="flex items-center gap-4 mb-5">
              <StarRating rating={product.rating} />
              <span className="text-xs font-body text-charcoal-700/50">{product.reviews} reviews</span>
            </div>
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-light font-display text-charcoal-800">
                {`₦${product.price.toLocaleString('en-NG')}`}
              </span>
              {product.originalPrice && (
                <span className="text-lg line-through font-body text-charcoal-700/40">
                  {`₦${product.originalPrice.toLocaleString('en-NG')}`}
                </span>
              )}
            </div>
            <p className="mb-8 text-sm leading-relaxed font-body text-charcoal-700/70">{product.description}</p>

            {/* Colors */}
            {product.colors?.length > 0 && product.colors[0] !== 'One Size' && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs tracking-widest uppercase font-body text-charcoal-700/70">Colour</p>
                  {selectedColor && <p className="text-xs font-body text-charcoal-800">{selectedColor}</p>}
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map(color => (
                    <button key={color} onClick={() => { setSelectedColor(color); setColorError(false); }}
                      className={`font-body text-xs px-4 py-2 border transition-all duration-150 ${selectedColor === color ? 'border-charcoal-800 bg-charcoal-800 text-cream-50' : 'border-sand-200 hover:border-charcoal-700 text-charcoal-800'} ${colorError ? 'border-blush-500' : ''}`}>
                      {color}
                    </button>
                  ))}
                </div>
                {colorError && <p className="mt-2 text-xs font-body text-blush-500">Please select a colour</p>}
              </div>
            )}

            {/* Sizes */}
            {product.sizes?.length > 0 && product.sizes[0] !== 'One Size' && (
              <div className="mb-6">
                <p className="mb-3 text-xs tracking-widest uppercase font-body text-charcoal-700/70">Size</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(size => (
                    <button key={size} onClick={() => { setSelectedSize(size); setSizeError(false); }}
                      className={`font-body text-xs w-12 h-10 border transition-all duration-150 ${selectedSize === size ? 'border-charcoal-800 bg-charcoal-800 text-cream-50' : 'border-sand-200 hover:border-charcoal-700 text-charcoal-800'} ${sizeError ? 'border-blush-500' : ''}`}>
                      {size}
                    </button>
                  ))}
                </div>
                {sizeError && <p className="mt-2 text-xs font-body text-blush-500">Please select a size</p>}
              </div>
            )}

            {/* Quantity + Add */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-sand-200">
                <button onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="flex items-center justify-center w-10 h-12 transition-colors hover:bg-sand-100">
                  <Minus size={14} />
                </button>
                <span className="flex items-center justify-center w-12 h-12 text-sm font-medium font-body border-x border-sand-200">{qty}</span>
                <button onClick={() => setQty(q => q + 1)}
                  className="flex items-center justify-center w-10 h-12 transition-colors hover:bg-sand-100">
                  <Plus size={14} />
                </button>
              </div>
              <button onClick={handleAddToCart}
                className={`flex-1 py-3.5 font-body font-medium text-sm flex items-center justify-center gap-2 transition-all duration-300 ${added ? 'bg-green-600 text-white' : 'bg-blush-500 hover:bg-blush-600 text-white'}`}>
                <ShoppingBag size={17} />
                {added ? '✓ Added to Cart!' : `Add to Cart — ₦${(product.price * qty).toLocaleString('en-NG')}`}
              </button>
              <button className="flex items-center justify-center w-12 h-12 transition-all border border-sand-200 text-charcoal-700/50 hover:text-blush-500 hover:border-blush-500">
                <Heart size={18} />
              </button>
            </div>

            {/* Delivery info */}
            <div className="border divide-y border-sand-200 divide-sand-200">
              {[
                { icon: Truck, label: 'Free delivery within Kano', sub: 'Nationwide from ₦2,500' },
                { icon: RotateCcw, label: '7-day returns', sub: 'Via WhatsApp or Instagram DM' },
                { icon: Shield, label: 'Authentic & handcrafted', sub: 'Made with premium Nigerian fabrics' },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex items-center gap-4 px-4 py-3">
                  <Icon size={17} className="text-blush-500 shrink-0" />
                  <div>
                    <p className="text-xs font-medium font-body text-charcoal-800">{label}</p>
                    <p className="text-xs font-body text-charcoal-700/50">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl italic font-light font-display text-charcoal-800">You may also like</h2>
              <Link to="/products" className="text-sm transition-colors font-body text-blush-500 hover:text-blush-600">View all →</Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 md:gap-5">
              {related.map(p => (
                <Link key={p.id} to={`/products/${p.id}`} className="block transition-shadow bg-white group hover:shadow-card">
                  <div className="aspect-[3/4] overflow-hidden bg-sand-100">
                    <img src={p.images?.[0]} alt={p.name}
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                      onError={e=>{e.target.onerror=null;e.target.src='https://images.unsplash.com/photo-1558171813-5e3d4e0c64ae?w=400&q=60';}} />
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-light leading-snug font-display text-charcoal-800">{p.name}</p>
                    <p className="mt-1 text-xs font-semibold font-body text-charcoal-800">{`₦${p.price.toLocaleString('en-NG')}`}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
