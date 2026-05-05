import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, CheckCircle, ArrowLeft, ChevronDown } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { createOrder } from '../lib/api';

function Field({ label, id, error, required, children }) {
  return (
    <div>
      <label htmlFor={id} className="block mb-2 text-xs tracking-widest uppercase font-body text-charcoal-700/60">
        {label}{required && <span className="ml-1 text-blush-500">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs font-body text-blush-500">{error}</p>}
    </div>
  );
}

export default function Checkout() {
  const { cartItems, subtotal, clearCart } = useCart();
  const [step, setStep]       = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm]       = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', state: '', zip: '', country: 'NG',
  });
  const [errors, setErrors] = useState({});

  const shipping = subtotal > 20000 ? 0 : 2500;
  const total    = subtotal + shipping;

  const set = field => e => {
    setForm(f => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors(err => ({ ...err, [field]: '' }));
  };

  const validate1 = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = 'Required';
    if (!form.lastName.trim())  e.lastName  = 'Required';
    if (!form.email.trim())     e.email     = 'Required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!form.phone.trim())     e.phone     = 'Required';
    if (!form.address.trim())   e.address   = 'Required';
    if (!form.city.trim())      e.city      = 'Required';
    if (!form.state.trim())     e.state     = 'Required';
    setErrors(e);
    return !Object.keys(e).length;
  };

  // ── Paystack payment handler ───────────────────────────────────────────────
  const handlePayment = async e => {
    e.preventDefault();
    if (!validate1()) return;
    setLoading(true);

    try {
      const PaystackPop = (await import('@paystack/inline-js')).default;

      const handler = PaystackPop.setup({
        key:      import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
        email:    form.email,
        amount:   total * 100,   // kobo
        currency: 'NGN',
        ref:      `NB-${Date.now()}`,
        metadata: {
          custom_fields: [
            { display_name: 'Full Name', variable_name: 'name',    value: `${form.firstName} ${form.lastName}` },
            { display_name: 'Phone',     variable_name: 'phone',   value: form.phone },
            { display_name: 'Address',   variable_name: 'address', value: `${form.address}, ${form.city}, ${form.state}` },
          ],
        },

        onSuccess: async (transaction) => {
          try {
            await createOrder({
              customerName:  `${form.firstName} ${form.lastName}`,
              email:         form.email,
              phone:         form.phone,
              address:       form.address,
              city:          form.city,
              state:         form.state,
              items:         cartItems,
              subtotal,
              shipping,
              total,
              paymentRef:    transaction.reference,
              paymentStatus: 'paid',
            });
          } catch (err) {
            console.warn('Order save failed:', err.message);
          }
          setLoading(false);
          clearCart();
          setStep(3);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        },

        onCancel: () => {
          setLoading(false);
        },
      });

      handler.openIframe();

    } catch (err) {
      console.error('Paystack load error:', err);
      setLoading(false);
    }
  };

  // ── Empty cart ─────────────────────────────────────────────────────────────
  if (!cartItems.length && step !== 3) {
    return (
      <div className="flex items-center justify-center min-h-screen pt-24 bg-cream-50">
        <div className="px-6 text-center">
          <h2 className="mb-4 text-3xl font-light font-display text-charcoal-800">Your cart is empty</h2>
          <Link to="/products" className="btn-primary">Shop Now</Link>
        </div>
      </div>
    );
  }

  // ── Success screen ─────────────────────────────────────────────────────────
  if (step === 3) {
    return (
      <div className="flex items-center justify-center min-h-screen px-6 pt-24 bg-cream-50">
        <div className="max-w-md text-center animate-fade-up">
          <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 border border-green-200 bg-green-50">
            <CheckCircle size={44} className="text-green-600" />
          </div>
          <h1 className="mb-4 text-4xl italic font-light font-display text-charcoal-800">Order Confirmed! 🎉</h1>
          <p className="mb-3 leading-relaxed font-body text-charcoal-700/70">
            Thank you, <strong>{form.firstName}</strong>! A confirmation has been sent to <strong>{form.email}</strong>.
          </p>
          <div className="p-4 mb-8 text-left bg-white border border-sand-200">
            <p className="mb-1 text-sm font-medium font-body text-charcoal-800">
              Order #NB{Math.floor(Math.random() * 90000) + 10000}
            </p>
            <p className="text-xs font-body text-charcoal-700/50">Estimated delivery: 2–5 business days</p>
            <p className="mt-1 text-xs font-body text-charcoal-700/50">{`Total: ₦${total.toLocaleString('en-NG')}`}</p>
          </div>
          <div className="flex items-center justify-center gap-4">
            <Link to="/products" className="btn-blush">Continue Shopping</Link>
            <Link to="/"         className="btn-outline">Back to Home</Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Main checkout ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen pt-20 bg-cream-50">
      <div className="px-6 py-10 mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8">
          <Link to="/cart" className="flex items-center gap-2 mb-4 text-sm font-body text-charcoal-700/60 hover:text-charcoal-800">
            <ArrowLeft size={15} /> Back to cart
          </Link>
          <h1 className="italic font-light section-heading">Checkout</h1>

          {/* Step indicator */}
          <div className="flex items-center gap-4 mt-4">
            {[{ n: 1, label: 'Information' }, { n: 2, label: 'Payment' }].map(({ n, label }) => (
              <div key={n} className="flex items-center gap-2">
                <div className={`w-7 h-7 flex items-center justify-center font-body text-xs font-medium border-2 transition-all
                  ${step >= n ? 'bg-charcoal-800 border-charcoal-800 text-white' : 'border-sand-300 text-sand-300'}`}>
                  {n}
                </div>
                <span className={`font-body text-sm ${step >= n ? 'text-charcoal-800' : 'text-charcoal-700/40'}`}>{label}</span>
                {n < 2 && <div className={`w-8 h-px ${step > n ? 'bg-charcoal-800' : 'bg-sand-200'}`} />}
              </div>
            ))}
          </div>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-3">

          {/* ── Left: forms ── */}
          <div className="lg:col-span-2">

            {/* STEP 1 — Shipping Information */}
            {step === 1 && (
              <div className="p-6 bg-white border border-sand-200 sm:p-8 shadow-soft animate-fade-in">
                <h2 className="mb-6 text-xl font-light font-display text-charcoal-800">Contact & Shipping</h2>

                <div className="grid gap-5 mb-5 sm:grid-cols-2">
                  <Field label="First Name" id="firstName" error={errors.firstName} required>
                    <input id="firstName" value={form.firstName} onChange={set('firstName')}
                      className="input-field" placeholder="Fatima" />
                  </Field>
                  <Field label="Last Name" id="lastName" error={errors.lastName} required>
                    <input id="lastName" value={form.lastName} onChange={set('lastName')}
                      className="input-field" placeholder="Abdullahi" />
                  </Field>
                </div>

                <div className="grid gap-5 mb-5 sm:grid-cols-2">
                  <Field label="Email" id="email" error={errors.email} required>
                    <input id="email" type="email" value={form.email} onChange={set('email')}
                      className="input-field" placeholder="fatima@email.com" />
                  </Field>
                  <Field label="Phone" id="phone" error={errors.phone} required>
                    <input id="phone" value={form.phone} onChange={set('phone')}
                      className="input-field" placeholder="+234 800 000 0000" />
                  </Field>
                </div>

                <div className="mb-5">
                  <Field label="Address" id="address" error={errors.address} required>
                    <input id="address" value={form.address} onChange={set('address')}
                      className="input-field" placeholder="123 Murtala Mohammed Way" />
                  </Field>
                </div>

                <div className="grid gap-5 mb-5 sm:grid-cols-3">
                  <Field label="City" id="city" error={errors.city} required>
                    <input id="city" value={form.city} onChange={set('city')}
                      className="input-field" placeholder="Kano" />
                  </Field>
                  <Field label="State" id="state" error={errors.state} required>
                    <input id="state" value={form.state} onChange={set('state')}
                      className="input-field" placeholder="Kano State" />
                  </Field>
                  <Field label="Postal Code" id="zip">
                    <input id="zip" value={form.zip} onChange={set('zip')}
                      className="input-field" placeholder="700001" />
                  </Field>
                </div>

                <div className="mb-8">
                  <Field label="Country" id="country">
                    <div className="relative">
                      <select id="country" value={form.country} onChange={set('country')}
                        className="pr-8 appearance-none input-field">
                        <option value="NG">Nigeria</option>
                        <option value="GH">Ghana</option>
                        <option value="KE">Kenya</option>
                        <option value="ZA">South Africa</option>
                        <option value="GB">United Kingdom</option>
                        <option value="US">United States</option>
                      </select>
                      <ChevronDown size={15} className="absolute -translate-y-1/2 pointer-events-none right-3 top-1/2 text-charcoal-700/50" />
                    </div>
                  </Field>
                </div>

                <button
                  onClick={() => { if (validate1()) setStep(2); else window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="flex items-center justify-center w-full gap-2 py-4 text-base btn-blush">
                  Continue to Payment <ArrowLeft size={17} className="rotate-180" />
                </button>
              </div>
            )}

            {/* STEP 2 — Pay via Paystack */}
            {step === 2 && (
              <form onSubmit={handlePayment}
                className="p-6 bg-white border border-sand-200 sm:p-8 shadow-soft animate-fade-in">

                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-light font-display text-charcoal-800">Review & Pay</h2>
                  <div className="flex items-center gap-1.5 text-charcoal-700/50">
                    <Lock size={13} /><span className="text-xs font-body">SSL Secured</span>
                  </div>
                </div>

                {/* Shipping summary */}
                <div className="p-4 mb-6 space-y-1 border bg-sand-50 border-sand-200">
                  <p className="mb-2 text-xs tracking-widest uppercase font-body text-charcoal-700/50">Delivering to</p>
                  <p className="text-sm font-medium font-body text-charcoal-800">{form.firstName} {form.lastName}</p>
                  <p className="text-xs font-body text-charcoal-700/60">{form.address}</p>
                  <p className="text-xs font-body text-charcoal-700/60">{form.city}, {form.state}</p>
                  <p className="text-xs font-body text-charcoal-700/60">{form.phone} · {form.email}</p>
                  <button type="button" onClick={() => setStep(1)}
                    className="block mt-1 text-xs font-body text-blush-500 hover:underline">Edit details →</button>
                </div>

                {/* Paystack badge */}
                <div className="flex items-center gap-3 p-3 mb-6 border bg-sand-50 border-sand-200">
                  <img src="https://website-v3-assets.s3.amazonaws.com/assets/img/hero/Paystack-mark-white-twitter.png"
                    alt="Paystack" className="h-6 w-6 object-contain bg-[#00C3F7] p-0.5"
                    onError={e => { e.target.style.display = 'none'; }} />
                  <div>
                    <p className="text-xs font-semibold font-body text-charcoal-800">Secured by Paystack</p>
                    <p className="text-xs font-body text-charcoal-700/50">Card · Bank Transfer · USSD · Mobile Money</p>
                  </div>
                </div>

                <p className="mb-6 text-sm leading-relaxed font-body text-charcoal-700/60">
                  Clicking <strong className="text-charcoal-800">Pay Now</strong> will open the Paystack secure
                  payment page where you can pay with your card, bank transfer, USSD, or mobile money.
                </p>

                <button type="submit" disabled={loading}
                  className={`w-full py-4 font-body font-medium text-base flex items-center justify-center gap-3 transition-all
                    ${loading ? 'bg-charcoal-700/40 text-white cursor-not-allowed' : 'bg-blush-500 hover:bg-blush-600 text-white'}`}>
                  {loading
                    ? <><span className="w-5 h-5 border-2 rounded-full border-white/30 border-t-white animate-spin" />Processing...</>
                    : <><Lock size={17} />{`Pay ₦${total.toLocaleString('en-NG')} securely`}</>
                  }
                </button>

                <button type="button" onClick={() => setStep(1)}
                  className="w-full mt-3 text-sm transition-colors font-body text-charcoal-700/50 hover:text-charcoal-800">
                  ← Back to Information
                </button>
              </form>
            )}
          </div>

          {/* ── Right: Order summary ── */}
          <div className="lg:sticky lg:top-28">
            <div className="p-5 bg-white border border-sand-200 shadow-soft">
              <h3 className="mb-4 text-lg font-light font-display text-charcoal-800">Your Order</h3>

              <div className="mb-4 space-y-3 overflow-y-auto max-h-56">
                {cartItems.map(item => (
                  <div key={item.key} className="flex gap-3">
                    <div className="relative shrink-0">
                      <div className="overflow-hidden w-14 h-18 bg-sand-100">
                        <img src={item.images?.[0]} alt={item.name} className="object-cover w-full h-full"
                          onError={e => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1558171813-5e3d4e0c64ae?w=200&q=60'; }} />
                      </div>
                      <span className="absolute -top-1.5 -right-1.5 bg-charcoal-800 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium font-body text-charcoal-800 line-clamp-2">{item.name}</p>
                      <p className="font-body text-xs text-charcoal-700/50 mt-0.5">
                        {item.color}{item.size !== 'One Size' ? ` / ${item.size}` : ''}
                      </p>
                      <p className="mt-1 text-xs font-semibold font-body">
                        {`₦${(item.price * item.quantity).toLocaleString('en-NG')}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 mb-3 space-y-2 border-t border-sand-200">
                <div className="flex justify-between text-sm font-body">
                  <span className="text-charcoal-700/60">Subtotal</span>
                  <span>{`₦${subtotal.toLocaleString('en-NG')}`}</span>
                </div>
                <div className="flex justify-between text-sm font-body">
                  <span className="text-charcoal-700/60">Shipping</span>
                  <span className={shipping === 0 ? 'text-green-600' : ''}>
                    {shipping === 0 ? 'Free' : `₦${shipping.toLocaleString('en-NG')}`}
                  </span>
                </div>
                {shipping === 0 && (
                  <p className="text-xs text-green-600 font-body">🎉 You qualify for free shipping!</p>
                )}
              </div>

              <div className="pt-3 border-t border-sand-200">
                <div className="flex justify-between font-semibold font-body">
                  <span>Total</span>
                  <span className="text-blush-500">{`₦${total.toLocaleString('en-NG')}`}</span>
                </div>
              </div>

              <p className="mt-4 text-xs text-center font-body text-charcoal-700/40">
                🔒 All payments secured by Paystack
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}