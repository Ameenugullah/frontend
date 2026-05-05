import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, subtotal } = useCart();
  const tax = subtotal * 0.08;
  const shipping = subtotal > 20000 ? 0 : 2500;
  const total = subtotal + tax + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-cream-50 pt-24 flex items-center justify-center">
        <div className="text-center px-6 max-w-md">
          <div className="w-20 h-20 bg-sand-100 flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={36} className="text-sand-300" />
          </div>
          <h2 className="font-display text-3xl text-charcoal-800 mb-3 font-light italic">Your cart is empty</h2>
          <p className="font-body text-charcoal-700/60 mb-8 text-sm">
            Discover our latest collection and find pieces you'll love.
          </p>
          <Link to="/products" className="btn-primary inline-flex items-center gap-2">
            Continue Shopping <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50 pt-24">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8">
          <span className="tag block mb-2">Ready to checkout?</span>
          <h1 className="section-heading font-light italic">Shopping Cart</h1>
          <p className="font-body text-sm text-charcoal-700/50 mt-1">
            {cartItems.length} item{cartItems.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map(item => (
              <div key={item.key} className="bg-white border border-sand-200 p-4 sm:p-5 flex gap-4 sm:gap-5 hover:shadow-soft transition-shadow">
                <Link to={`/products/${item.id}`} className="shrink-0">
                  <div className="w-20 h-26 sm:w-24 sm:h-32 overflow-hidden bg-sand-100">
                    <img src={item.images?.[0]} alt={item.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      onError={e => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1558171813-5e3d4e0c64ae?w=300&q=80'; }} />
                  </div>
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-body text-xs text-blush-500 tracking-widest uppercase">{item.category}</p>
                      <h3 className="font-display text-base text-charcoal-800 mt-0.5 leading-snug">
                        <Link to={`/products/${item.id}`} className="hover:text-blush-500 transition-colors">{item.name}</Link>
                      </h3>
                    </div>
                    <button onClick={() => removeFromCart(item.key)}
                      className="text-charcoal-700/30 hover:text-blush-500 transition-colors p-1 shrink-0">
                      <Trash2 size={15} />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2 mb-3">
                    {item.color && <span className="font-body text-xs text-charcoal-700/60 bg-sand-100 px-2 py-0.5">{item.color}</span>}
                    {item.size && item.size !== 'One Size' && <span className="font-body text-xs text-charcoal-700/60 bg-sand-100 px-2 py-0.5">Size: {item.size}</span>}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <button onClick={() => updateQuantity(item.key, item.quantity - 1)}
                        className="w-8 h-8 border border-sand-200 flex items-center justify-center hover:bg-sand-100 transition-colors">
                        <Minus size={13} />
                      </button>
                      <span className="w-9 h-8 border-y border-sand-200 flex items-center justify-center font-body text-sm font-medium">
                        {item.quantity}
                      </span>
                      <button onClick={() => updateQuantity(item.key, item.quantity + 1)}
                        className="w-8 h-8 border border-sand-200 flex items-center justify-center hover:bg-sand-100 transition-colors">
                        <Plus size={13} />
                      </button>
                    </div>
                    <div className="text-right">
                      <span className="font-body font-semibold text-charcoal-800 text-sm">
                        {`₦${(item.price * item.quantity).toLocaleString('en-NG')}`}
                      </span>
                      {item.quantity > 1 && (
                        <p className="font-body text-xs text-charcoal-700/40">
                          {`₦${item.price.toLocaleString('en-NG')} each`}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Promo */}
            <div className="bg-white border border-sand-200 p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <Tag size={17} className="text-blush-500 shrink-0" />
                <input type="text" placeholder="Enter promo code"
                  className="flex-1 font-body text-sm bg-transparent focus:outline-none text-charcoal-800 placeholder-sand-300" />
                <button className="btn-outline py-2 px-4 text-xs">Apply</button>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:sticky lg:top-28">
            <div className="bg-white border border-sand-200 p-6 shadow-soft">
              <h2 className="font-display text-xl text-charcoal-800 mb-6 font-light">Order Summary</h2>
              <div className="space-y-3 mb-5">
                <div className="flex justify-between font-body text-sm">
                  <span className="text-charcoal-700/60">Subtotal ({cartItems.length} item{cartItems.length > 1 ? 's' : ''})</span>
                  <span>{`₦${subtotal.toLocaleString('en-NG')}`}</span>
                </div>
                <div className="flex justify-between font-body text-sm">
                  <span className="text-charcoal-700/60">Shipping</span>
                  <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
                    {shipping === 0 ? 'Free' : `₦${shipping.toLocaleString('en-NG')}`}
                  </span>
                </div>
                {shipping === 0 && (
                  <p className="font-body text-xs text-green-600 bg-green-50 px-3 py-2">🎉 You qualify for free shipping!</p>
                )}
                {shipping > 0 && (
                  <p className="font-body text-xs text-blush-500 bg-blush-50 px-3 py-2">
                    {`Add ₦${(20000 - subtotal).toLocaleString('en-NG')} more for free delivery`}
                  </p>
                )}
                <div className="flex justify-between font-body text-sm">
                  <span className="text-charcoal-700/60">Tax (8%)</span>
                  <span>{`₦${tax.toLocaleString('en-NG')}`}</span>
                </div>
              </div>
              <div className="border-t border-sand-200 pt-4 mb-6">
                <div className="flex justify-between font-body font-semibold">
                  <span>Total</span>
                  <span>{`₦${total.toLocaleString('en-NG')}`}</span>
                </div>
              </div>
              <Link to="/checkout" className="btn-blush w-full flex items-center justify-center gap-2 py-4">
                Proceed to Checkout <ArrowRight size={17} />
              </Link>
              <Link to="/products"
                className="block text-center font-body text-sm text-charcoal-700/50 hover:text-charcoal-800 mt-4 transition-colors">
                ← Continue Shopping
              </Link>
              <div className="mt-5 pt-5 border-t border-sand-200 space-y-2">
                {['🔒 Secure SSL checkout', '💳 All major cards', '📦 Ships in 1–2 days'].map(t => (
                  <p key={t} className="font-body text-xs text-charcoal-700/50">{t}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
