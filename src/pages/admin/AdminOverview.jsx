import { Package, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';

export default function AdminOverview({ allProducts, orders, getStock, setTab }) {
  const totalProducts = allProducts.length;
  const totalValue    = allProducts.reduce((s, p) => s + p.price, 0);
  const avgRating     = allProducts.length
    ? (allProducts.reduce((s, p) => s + p.rating, 0) / allProducts.length).toFixed(1)
    : '—';
  const lowStock      = allProducts.filter(p => getStock(p.id) <= 3).length;

  return (
    <div>
      <div className="pt-2 mb-8">
        <h1 className="text-3xl italic font-light font-display text-charcoal-800">Welcome back 👋</h1>
        <p className="mt-1 text-sm font-body text-charcoal-700/50">Here's your store at a glance.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8 lg:grid-cols-4">
        {[
          { label: 'Total Products',  value: totalProducts,                              icon: Package,      color: 'text-blush-500',  bg: 'bg-blush-50'  },
          { label: 'Catalogue Value', value: `₦${totalValue.toLocaleString('en-NG')}`,  icon: DollarSign,   color: 'text-green-600',  bg: 'bg-green-50'  },
          { label: 'Avg Rating',      value: `${avgRating} ★`,                           icon: TrendingUp,   color: 'text-amber-500',  bg: 'bg-amber-50'  },
          { label: 'Low Stock',       value: lowStock,                                   icon: AlertCircle,  color: 'text-orange-500', bg: 'bg-orange-50' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="p-5 bg-white border border-sand-200">
            <div className={`w-10 h-10 ${bg} flex items-center justify-center mb-3`}>
              <Icon size={20} className={color} />
            </div>
            <p className="mb-1 text-xs font-body text-charcoal-700/50">{label}</p>
            <p className="text-2xl font-light font-display text-charcoal-800">{value}</p>
          </div>
        ))}
      </div>

      {/* Recent panels */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Products */}
        <div className="bg-white border border-sand-200">
          <div className="flex items-center justify-between p-5 border-b border-sand-100">
            <h2 className="text-lg font-light font-display text-charcoal-800">Recent Products</h2>
            <button onClick={() => setTab('Products')} className="text-xs font-body text-blush-500 hover:text-blush-600">View all →</button>
          </div>
          <div className="divide-y divide-sand-100">
            {allProducts.slice(0, 5).map(p => (
              <div key={p.id} className="flex items-center gap-3 p-4 transition-colors hover:bg-sand-50">
                <div className="w-10 h-12 overflow-hidden bg-sand-100 shrink-0">
                  <img src={p.images?.[0]} alt={p.name} className="object-cover w-full h-full"
                    onError={e => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1558171813-5e3d4e0c64ae?w=100&q=60'; }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate font-body text-charcoal-800">{p.name}</p>
                  <p className="text-xs capitalize font-body text-charcoal-700/50">{p.gender} · {p.category}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold font-body">{`₦${p.price.toLocaleString('en-NG')}`}</p>
                  <p className={`font-body text-xs ${getStock(p.id) <= 3 ? 'text-orange-500' : 'text-green-600'}`}>
                    Stock: {getStock(p.id)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white border border-sand-200">
          <div className="flex items-center justify-between p-5 border-b border-sand-100">
            <h2 className="text-lg font-light font-display text-charcoal-800">Recent Orders</h2>
            <button onClick={() => setTab('Orders')} className="text-xs font-body text-blush-500 hover:text-blush-600">View all →</button>
          </div>
          <div className="divide-y divide-sand-100">
            {orders.length === 0 ? (
              <p className="py-8 text-sm text-center font-body text-charcoal-700/40">No orders yet</p>
            ) : orders.slice(0, 5).map(o => (
              <div key={o.id} className="flex items-center gap-3 p-4 transition-colors hover:bg-sand-50">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate font-body text-charcoal-800">{o.customerName}</p>
                  <p className="text-xs font-body text-charcoal-700/50">{o.city}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold font-body">{`₦${Number(o.total).toLocaleString('en-NG')}`}</p>
                  <span className={`font-body text-xs px-1.5 py-0.5 ${
                    o.status === 'delivered' ? 'bg-green-100 text-green-700' :
                    o.status === 'shipped'   ? 'bg-blue-100 text-blue-700'  :
                                               'bg-amber-100 text-amber-700'
                  }`}>{o.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}