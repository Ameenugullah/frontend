import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Trash2, Edit3, Save, X, PlusCircle } from 'lucide-react';

export default function AdminProducts({ allProducts, deleteProduct, updateStock, getStock, setTab }) {
  const navigate = useNavigate();
  const [stockEdit, setStockEdit]       = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  return (
    <div>
      <div className="flex items-center justify-between pt-2 mb-8">
        <div>
          <h1 className="text-3xl italic font-light font-display text-charcoal-800">All Products</h1>
          <p className="mt-1 text-sm font-body text-charcoal-700/50">{allProducts.length} items</p>
        </div>
        <button onClick={() => setTab('Add Product')} className="btn-blush flex items-center gap-2 text-sm py-2.5">
          <PlusCircle size={16} /> Add New
        </button>
      </div>

      <div className="overflow-hidden bg-white border border-sand-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-sand-50 border-sand-200">
              <tr>
                {['Product', 'Gender', 'Category', 'Price', 'Stock', 'Rating', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-xs tracking-widest text-left uppercase font-body text-charcoal-700/50">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-100">
              {allProducts.map(p => (
                <tr key={p.id} className="transition-colors hover:bg-sand-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="overflow-hidden w-9 h-11 bg-sand-100 shrink-0">
                        <img src={p.images?.[0]} alt={p.name} className="object-cover w-full h-full"
                          onError={e => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1558171813-5e3d4e0c64ae?w=100&q=60'; }} />
                      </div>
                      <div>
                        <p className="font-body text-sm font-medium text-charcoal-800 max-w-[140px] truncate">{p.name}</p>
                        {p.badge && <span className="font-body text-xs bg-blush-100 text-blush-600 px-1.5 py-0.5">{p.badge}</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs capitalize font-body text-charcoal-700/60">{p.gender || '—'}</td>
                  <td className="px-4 py-3 text-sm font-body text-charcoal-700/70">{p.category}</td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium font-body">{`₦${p.price.toLocaleString('en-NG')}`}</p>
                    {p.originalPrice && (
                      <p className="text-xs line-through font-body text-charcoal-700/40">{`₦${p.originalPrice.toLocaleString('en-NG')}`}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {stockEdit[p.id] !== undefined ? (
                      <div className="flex items-center gap-1">
                        <input type="number" value={stockEdit[p.id]}
                          onChange={e => setStockEdit(s => ({ ...s, [p.id]: e.target.value }))}
                          className="px-2 py-1 text-xs border w-14 border-sand-300 font-body focus:outline-none" />
                        <button onClick={() => {
                          updateStock(p.id, stockEdit[p.id]);
                          setStockEdit(s => { const n = { ...s }; delete n[p.id]; return n; });
                        }} className="text-green-600"><Save size={13} /></button>
                        <button onClick={() => setStockEdit(s => { const n = { ...s }; delete n[p.id]; return n; })}
                          className="text-charcoal-700/40"><X size={13} /></button>
                      </div>
                    ) : (
                      <button onClick={() => setStockEdit(s => ({ ...s, [p.id]: getStock(p.id) }))}
                        className={`flex items-center gap-1 font-body text-sm group ${getStock(p.id) <= 3 ? 'text-orange-500' : 'text-green-600'}`}>
                        {getStock(p.id)}
                        <Edit3 size={11} className="opacity-0 group-hover:opacity-100" />
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs font-body text-amber-500">
                    {'★'.repeat(Math.round(p.rating))}
                    <span className="ml-1 text-charcoal-700/40">{p.rating}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => navigate(`/products/${p.id}`)}
                        className="p-1.5 text-charcoal-700/40 hover:text-blush-500 transition-colors">
                        <Eye size={14} />
                      </button>
                      {deleteConfirm === p.id ? (
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-orange-500 font-body">Delete?</span>
                          <button onClick={() => { deleteProduct(p.id); setDeleteConfirm(null); }}
                            className="text-xs font-medium text-red-500 font-body">Yes</button>
                          <button onClick={() => setDeleteConfirm(null)}
                            className="text-xs font-body text-charcoal-700/40">No</button>
                        </div>
                      ) : (
                        <button onClick={() => setDeleteConfirm(p.id)}
                          className="p-1.5 text-charcoal-700/40 hover:text-red-500 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
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