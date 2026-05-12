export default function AdminOrders({ orders, changeOrderStatus }) {
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  return (
    <div>
      <div className="pt-2 mb-8">
        <h1 className="text-3xl italic font-light font-display text-charcoal-800">Orders</h1>
        <p className="mt-1 text-sm font-body text-charcoal-700/50">
          {orders.length} total · {pendingOrders} pending
        </p>
      </div>

      <div className="overflow-hidden bg-white border border-sand-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-sand-50 border-sand-200">
              <tr>
                {['Customer', 'Items', 'Total', 'Status', 'Date', 'Update'].map(h => (
                  <th key={h} className="px-4 py-3 text-xs tracking-widest text-left uppercase font-body text-charcoal-700/50">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-100">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-sm text-center font-body text-charcoal-700/40">
                    No orders yet — they will appear here when customers checkout
                  </td>
                </tr>
              ) : orders.map(order => (
                <tr key={order.id} className="transition-colors hover:bg-sand-50">
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium font-body text-charcoal-800">{order.customerName}</p>
                    <p className="text-xs font-body text-charcoal-700/50">{order.email}</p>
                    <p className="text-xs font-body text-charcoal-700/50">{order.city}</p>
                  </td>
                  <td className="px-4 py-3 text-sm font-body text-charcoal-700/70">
                    {Array.isArray(order.items) ? order.items.length : '—'} items
                  </td>
                  <td className="px-4 py-3 text-sm font-medium font-body">
                    {`₦${Number(order.total).toLocaleString('en-NG')}`}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-body text-xs px-2 py-1 font-medium ${
                      order.status === 'delivered'  ? 'bg-green-100 text-green-700'   :
                      order.status === 'shipped'    ? 'bg-blue-100 text-blue-700'     :
                      order.status === 'processing' ? 'bg-purple-100 text-purple-700' :
                      order.status === 'cancelled'  ? 'bg-red-100 text-red-600'       :
                                                      'bg-amber-100 text-amber-700'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs font-body text-charcoal-700/50">
                    {new Date(order.created).toLocaleDateString('en-NG', {
                      day: 'numeric', month: 'short', year: 'numeric',
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={order.status}
                      onChange={e => changeOrderStatus(order.id, e.target.value)}
                      className="font-body text-xs border border-sand-200 px-2 py-1.5 focus:outline-none focus:border-blush-400 bg-white">
                      {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}