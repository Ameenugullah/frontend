import { useState, useRef } from 'react';
import { useAdmin } from '../context/AdminContext';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, PlusCircle, LogOut, Eye, Trash2,
  TrendingUp, DollarSign, Save, X, AlertCircle,
  Edit3, RefreshCw, ChevronDown, Lock, ShoppingBag, Wifi, WifiOff,
  UploadCloud, ImagePlus, Bell,
} from 'lucide-react';

const TABS = ['Overview', 'Products', 'Add Product', 'Orders'];

const emptyForm = {
  name: '', category: 'Gowns', gender: 'women', price: '', originalPrice: '',
  description: '', colors: '', sizes: '', badge: '', featured: false,
};

// Convert a File object to a base64 data URL
function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export default function AdminDashboard() {
  const {
    isAdminLoggedIn, login, logout, loginError,
    allProducts, addProduct, deleteProduct, updateStock, getStock,
    orders, changeOrderStatus, pbConnected, refreshOrders,
    newOrderAlert, dismissAlert,
  } = useAdmin();
  const navigate = useNavigate();

  const [tab, setTab]               = useState('Overview');
  const [loginForm, setLoginForm]   = useState({ email: '', password: '' });
  const [form, setForm]             = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});
  const [saved, setSaved]           = useState(false);
  const [saving, setSaving]         = useState(false);
  const [stockEdit, setStockEdit]   = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // ── Image upload state ─────────────────────────────────────────────────────
  // imageFiles: array of { file: File, preview: string (data URL) }
  const [imageFiles, setImageFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleImagePick = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const newEntries = await Promise.all(
      files.slice(0, 5 - imageFiles.length).map(async (file) => ({
        file,
        preview: await fileToDataUrl(file),
      }))
    );
    setImageFiles(prev => [...prev, ...newEntries].slice(0, 5));
    // Reset input so same file can be re-selected if removed
    e.target.value = '';
  };

  const removeImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  // ── LOGIN ──────────────────────────────────────────────────────────────────
  if (!isAdminLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4 bg-charcoal-900">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center">
            <span className="block text-5xl leading-none font-script text-cream-50">NuraBahar</span>
            <span className="font-body text-xs tracking-[0.3em] uppercase text-blush-400 mt-1 block">Admin Portal</span>
          </div>
          <div className="p-8 border bg-white/5 border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <Lock size={20} className="text-blush-400" />
              <h2 className="text-xl font-light font-display text-cream-50">Sign In</h2>
            </div>
            {loginError && (
              <div className="flex items-center gap-2 px-4 py-3 mb-5 text-sm border bg-blush-500/20 border-blush-500/40 text-blush-300 font-body">
                <AlertCircle size={16} /> {loginError}
              </div>
            )}
            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-xs tracking-widest uppercase font-body text-white/50">Email</label>
                <input type="email" value={loginForm.email}
                  onChange={e => setLoginForm(f => ({ ...f, email: e.target.value }))}
                  onKeyDown={e => e.key === 'Enter' && login(loginForm.email, loginForm.password)}
                  className="w-full px-4 py-3 text-sm border bg-white/10 border-white/20 text-cream-50 font-body focus:outline-none focus:border-blush-400"
                  placeholder="admin@nurabahar.ng" />
              </div>
              <div>
                <label className="block mb-2 text-xs tracking-widest uppercase font-body text-white/50">Password</label>
                <input type="password" value={loginForm.password}
                  onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))}
                  onKeyDown={e => e.key === 'Enter' && login(loginForm.email, loginForm.password)}
                  className="w-full px-4 py-3 text-sm border bg-white/10 border-white/20 text-cream-50 font-body focus:outline-none focus:border-blush-400"
                  placeholder="••••••••••" />
              </div>
              <button onClick={() => login(loginForm.email, loginForm.password)}
                className="w-full py-3 font-medium text-white transition-colors duration-200 bg-blush-500 hover:bg-blush-600 font-body">
                Sign In to Dashboard
              </button>
            </div>
            <p className="mt-6 text-xs text-center font-body text-white/20">Nura Bahar · Admin Access Only</p>
          </div>
        </div>
      </div>
    );
  }

  // ── Dashboard stats ────────────────────────────────────────────────────────
  const totalProducts  = allProducts.length;
  const totalValue     = allProducts.reduce((s, p) => s + p.price, 0);
  const avgRating      = allProducts.length
    ? (allProducts.reduce((s, p) => s + p.rating, 0) / allProducts.length).toFixed(1)
    : '—';
  const lowStock       = allProducts.filter(p => getStock(p.id) <= 3).length;
  const pendingOrders  = orders.filter(o => o.status === 'pending').length;

  // ── Form validation ────────────────────────────────────────────────────────
  const validateForm = () => {
    const e = {};
    if (!form.name.trim())           e.name        = 'Required';
    if (!form.price || isNaN(Number(form.price))) e.price = 'Valid price required';
    if (!form.description.trim())    e.description = 'Required';
    if (!form.colors.trim())         e.colors      = 'At least one color required';
    if (!form.sizes.trim())          e.sizes       = 'At least one size required';
    if (imageFiles.length === 0)     e.images      = 'Upload at least one product image';
    setFormErrors(e);
    return !Object.keys(e).length;
  };

  // ── Add product handler ────────────────────────────────────────────────────
  const handleAddProduct = async () => {
    if (!validateForm()) return;
    setSaving(true);
    try {
      // imageFiles[].preview are base64 data URLs — usable as <img src> directly.
      // If PocketBase supports file upload you can swap these for FormData blobs later.
      const imageDataUrls = imageFiles.map(f => f.preview);

      await addProduct({
        name:          form.name.trim(),
        category:      form.category,
        gender:        form.gender,
        price:         Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
        description:   form.description.trim(),
        colors:        form.colors.split(',').map(s => s.trim()).filter(Boolean),
        sizes:         form.sizes.split(',').map(s => s.trim()).filter(Boolean),
        images:        imageDataUrls,
        created:       new Date().toISOString(),
        badge:         form.badge || null,
        featured:      form.featured,
        stock:         10,
      });

      setForm(emptyForm);
      setImageFiles([]);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      setTab('Products');
    } finally {
      setSaving(false);
    }
  };

  // ── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f7f5f2] flex">

      {/* ── New Order Toast ─────────────────────────────────────────────────── */}
      {newOrderAlert && (
        <div className="fixed z-50 w-full max-w-sm border shadow-xl top-4 right-4 bg-charcoal-900 border-blush-500/60">
          <div className="flex items-start gap-3 p-4">
            <div className="w-9 h-9 bg-blush-500 flex items-center justify-center shrink-0 mt-0.5">
              <Bell size={16} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold font-body text-cream-50">New Order Received! 🎉</p>
              <p className="font-body text-xs text-cream-50/70 mt-0.5">
                {newOrderAlert.customerName} — ₦{Number(newOrderAlert.total).toLocaleString('en-NG')}
              </p>
              <p className="font-body text-xs text-blush-400 mt-0.5">{newOrderAlert.city}</p>
            </div>
            <button onClick={dismissAlert} className="text-white/40 hover:text-white mt-0.5 shrink-0">
              <X size={16} />
            </button>
          </div>
          <div className="flex border-t border-white/10">
            <button onClick={() => { setTab('Orders'); dismissAlert(); }}
              className="flex-1 py-2 text-xs transition-colors font-body text-blush-400 hover:text-blush-300">
              View Orders →
            </button>
          </div>
        </div>
      )}

      {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
      <aside className="fixed top-0 left-0 z-40 flex-col hidden h-full md:flex w-60 bg-charcoal-900">
        <div className="p-6 border-b border-white/10">
          <span className="block text-3xl leading-none font-script text-cream-50">NuraBahar</span>
          <span className="font-body text-[9px] tracking-[0.25em] uppercase text-blush-400 mt-0.5 block">Admin Dashboard</span>
        </div>
        <div className={`mx-4 mt-3 px-3 py-2 flex items-center gap-2 text-xs font-body ${pbConnected ? 'bg-green-500/10 text-green-400' : 'bg-orange-500/10 text-orange-400'}`}>
          {pbConnected ? <Wifi size={12} /> : <WifiOff size={12} />}
          {pbConnected ? 'PocketBase Connected' : 'Offline Mode'}
        </div>
        <nav className="flex-1 p-4 mt-2 space-y-1">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left font-body text-sm transition-all ${tab === t ? 'bg-blush-500/20 text-blush-300 border-l-2 border-blush-400' : 'text-white/60 hover:text-white hover:bg-white/5'}`}>
              {t === 'Overview'     && <LayoutDashboard size={16} />}
              {t === 'Products'     && <Package size={16} />}
              {t === 'Add Product'  && <PlusCircle size={16} />}
              {t === 'Orders'       && <ShoppingBag size={16} />}
              {t}
              {t === 'Orders' && pendingOrders > 0 && (
                <span className="flex items-center justify-center w-5 h-5 ml-auto text-xs text-white rounded-full bg-blush-500">{pendingOrders}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="p-4 space-y-1 border-t border-white/10">
          <button onClick={() => navigate('/')}
            className="flex items-center w-full gap-3 px-4 py-3 text-sm text-white/50 hover:text-white hover:bg-white/5 font-body">
            <Eye size={16} /> View Store
          </button>
          <button onClick={() => { logout(); navigate('/'); }}
            className="flex items-center w-full gap-3 px-4 py-3 text-sm text-white/50 hover:text-white hover:bg-white/5 font-body">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* ── Mobile top bar ──────────────────────────────────────────────────── */}
      <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 md:hidden bg-charcoal-900">
        <span className="text-2xl font-script text-cream-50">NuraBahar</span>
        <div className="flex gap-1">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`font-body text-xs px-2 py-1.5 rounded relative ${tab === t ? 'bg-blush-500 text-white' : 'text-white/60'}`}>
              {t==='Overview'?'📊':t==='Products'?'📦':t==='Add Product'?'➕':'🛍️'}
            </button>
          ))}
          <button onClick={() => { logout(); navigate('/'); }} className="px-2 ml-1 text-white/50"><LogOut size={16} /></button>
        </div>
      </div>

      {/* ── Main content ────────────────────────────────────────────────────── */}
      <main className="flex-1 p-4 pt-16 md:ml-60 md:pt-0 md:p-8">

        {/* ══ OVERVIEW ══════════════════════════════════════════════════════════ */}
        {tab === 'Overview' && (
          <div>
            <div className="pt-2 mb-8">
              <h1 className="text-3xl italic font-light font-display text-charcoal-800">Welcome back 👋</h1>
              <p className="mt-1 text-sm font-body text-charcoal-700/50">Here's your store at a glance.</p>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-8 lg:grid-cols-4">
              {[
                { label: 'Total Products', value: totalProducts,                                icon: Package,      color: 'text-blush-500',   bg: 'bg-blush-50'   },
                { label: 'Catalogue Value', value: `₦${totalValue.toLocaleString('en-NG')}`,   icon: DollarSign,   color: 'text-green-600',   bg: 'bg-green-50'   },
                { label: 'Avg Rating',      value: `${avgRating} ★`,                           icon: TrendingUp,   color: 'text-amber-500',   bg: 'bg-amber-50'   },
                { label: 'Low Stock',       value: lowStock,                                   icon: AlertCircle,  color: 'text-orange-500',  bg: 'bg-orange-50'  },
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
            <div className="grid gap-6 md:grid-cols-2">
              {/* Recent Products */}
              <div className="bg-white border border-sand-200">
                <div className="flex items-center justify-between p-5 border-b border-sand-100">
                  <h2 className="text-lg font-light font-display text-charcoal-800">Recent Products</h2>
                  <button onClick={() => setTab('Products')} className="text-xs font-body text-blush-500">View all →</button>
                </div>
                <div className="divide-y divide-sand-100">
                  {allProducts.slice(0, 5).map(p => (
                    <div key={p.id} className="flex items-center gap-3 p-4 transition-colors hover:bg-sand-50">
                      <div className="w-10 h-12 overflow-hidden bg-sand-100 shrink-0">
                        <img src={p.images?.[0]} alt={p.name} className="object-cover w-full h-full"
                          onError={e=>{e.target.onerror=null;e.target.src='https://images.unsplash.com/photo-1558171813-5e3d4e0c64ae?w=100&q=60';}} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate font-body text-charcoal-800">{p.name}</p>
                        <p className="text-xs capitalize font-body text-charcoal-700/50">{p.gender} · {p.category}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-semibold font-body">{`₦${p.price.toLocaleString('en-NG')}`}</p>
                        <p className={`font-body text-xs ${getStock(p.id)<=3?'text-orange-500':'text-green-600'}`}>Stock: {getStock(p.id)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Recent Orders */}
              <div className="bg-white border border-sand-200">
                <div className="flex items-center justify-between p-5 border-b border-sand-100">
                  <h2 className="text-lg font-light font-display text-charcoal-800">Recent Orders</h2>
                  <button onClick={() => setTab('Orders')} className="text-xs font-body text-blush-500">View all →</button>
                </div>
                <div className="divide-y divide-sand-100">
                  {orders.length === 0 ? (
                    <p className="py-8 text-sm text-center font-body text-charcoal-700/40">No orders yet</p>
                  ) : orders.slice(0,5).map(o => (
                    <div key={o.id} className="flex items-center gap-3 p-4 transition-colors hover:bg-sand-50">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate font-body text-charcoal-800">{o.customerName}</p>
                        <p className="text-xs font-body text-charcoal-700/50">{o.city}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-semibold font-body">{`₦${Number(o.total).toLocaleString('en-NG')}`}</p>
                        <span className={`font-body text-xs px-1.5 py-0.5 ${o.status==='delivered'?'bg-green-100 text-green-700':o.status==='shipped'?'bg-blue-100 text-blue-700':'bg-amber-100 text-amber-700'}`}>{o.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══ PRODUCTS ══════════════════════════════════════════════════════════ */}
        {tab === 'Products' && (
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
                      {['Product','Gender','Category','Price','Stock','Rating','Actions'].map(h => (
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
                                onError={e=>{e.target.onerror=null;e.target.src='https://images.unsplash.com/photo-1558171813-5e3d4e0c64ae?w=100&q=60';}} />
                            </div>
                            <div>
                              <p className="font-body text-sm font-medium text-charcoal-800 max-w-[140px] truncate">{p.name}</p>
                              {p.badge&&<span className="font-body text-xs bg-blush-100 text-blush-600 px-1.5 py-0.5">{p.badge}</span>}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs capitalize font-body text-charcoal-700/60">{p.gender||'—'}</td>
                        <td className="px-4 py-3 text-sm font-body text-charcoal-700/70">{p.category}</td>
                        <td className="px-4 py-3">
                          <p className="text-sm font-medium font-body">{`₦${p.price.toLocaleString('en-NG')}`}</p>
                          {p.originalPrice&&<p className="text-xs line-through font-body text-charcoal-700/40">{`₦${p.originalPrice.toLocaleString('en-NG')}`}</p>}
                        </td>
                        <td className="px-4 py-3">
                          {stockEdit[p.id]!==undefined ? (
                            <div className="flex items-center gap-1">
                              <input type="number" value={stockEdit[p.id]}
                                onChange={e=>setStockEdit(s=>({...s,[p.id]:e.target.value}))}
                                className="px-2 py-1 text-xs border w-14 border-sand-300 font-body focus:outline-none"/>
                              <button onClick={()=>{updateStock(p.id,stockEdit[p.id]);setStockEdit(s=>{const n={...s};delete n[p.id];return n;})}} className="text-green-600"><Save size={13}/></button>
                              <button onClick={()=>setStockEdit(s=>{const n={...s};delete n[p.id];return n;})} className="text-charcoal-700/40"><X size={13}/></button>
                            </div>
                          ) : (
                            <button onClick={()=>setStockEdit(s=>({...s,[p.id]:getStock(p.id)}))}
                              className={`flex items-center gap-1 font-body text-sm group ${getStock(p.id)<=3?'text-orange-500':'text-green-600'}`}>
                              {getStock(p.id)}<Edit3 size={11} className="opacity-0 group-hover:opacity-100"/>
                            </button>
                          )}
                        </td>
                        <td className="px-4 py-3 text-xs font-body text-amber-500">
                          {'★'.repeat(Math.round(p.rating))} <span className="text-charcoal-700/40">{p.rating}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button onClick={()=>navigate(`/products/${p.id}`)} className="p-1.5 text-charcoal-700/40 hover:text-blush-500"><Eye size={14}/></button>
                            {deleteConfirm===p.id ? (
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-orange-500 font-body">Delete?</span>
                                <button onClick={()=>{deleteProduct(p.id);setDeleteConfirm(null);}} className="text-xs font-medium text-red-500 font-body">Yes</button>
                                <button onClick={()=>setDeleteConfirm(null)} className="text-xs font-body text-charcoal-700/40">No</button>
                              </div>
                            ) : (
                              <button onClick={()=>setDeleteConfirm(p.id)} className="p-1.5 text-charcoal-700/40 hover:text-red-500"><Trash2 size={14}/></button>
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
        )}

        {/* ══ ADD PRODUCT ═══════════════════════════════════════════════════════ */}
        {tab === 'Add Product' && (
          <div className="max-w-3xl">
            <div className="pt-2 mb-8">
              <h1 className="text-3xl italic font-light font-display text-charcoal-800">Add New Product</h1>
              <p className="mt-1 text-sm font-body text-charcoal-700/50">Upload images from your device and fill in product details.</p>
            </div>

            {saved && (
              <div className="flex items-center gap-2 px-4 py-3 mb-6 text-sm text-green-700 border border-green-200 bg-green-50 font-body">
                ✓ Product added successfully!
              </div>
            )}

            <div className="p-6 space-y-6 bg-white border border-sand-200 md:p-8">

              {/* ── Image Upload ── */}
              <div>
                <label className="block mb-3 text-xs tracking-widest uppercase font-body text-charcoal-700/60">
                  Product Images * <span className="tracking-normal normal-case text-charcoal-700/40">(up to 5 photos from your device)</span>
                </label>

                {/* Drop zone / pick button */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center gap-3 p-6 mb-4 transition-colors border-2 border-dashed cursor-pointer border-sand-300 hover:border-blush-400 bg-sand-50 hover:bg-blush-50/30">
                  <UploadCloud size={32} className="text-charcoal-700/30" />
                  <div className="text-center">
                    <p className="text-sm font-medium font-body text-charcoal-800">Click to choose photos</p>
                    <p className="font-body text-xs text-charcoal-700/50 mt-0.5">JPG, PNG, WEBP · Up to 5 images</p>
                  </div>
                  <span className="font-body text-xs bg-blush-500 text-white px-4 py-1.5 hover:bg-blush-600 transition-colors">
                    Browse Device
                  </span>
                </div>

                {/* Hidden file input — accepts multiple images */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImagePick}
                />

                {/* Preview grid */}
                {imageFiles.length > 0 && (
                  <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
                    {imageFiles.map((img, i) => (
                      <div key={i} className="relative group aspect-[3/4] bg-sand-100 overflow-hidden">
                        <img src={img.preview} alt={`preview-${i}`} className="object-cover w-full h-full" />
                        {i === 0 && (
                          <span className="absolute top-1 left-1 font-body text-[9px] bg-blush-500 text-white px-1.5 py-0.5">
                            Main
                          </span>
                        )}
                        <button
                          onClick={() => removeImage(i)}
                          className="absolute flex items-center justify-center w-5 h-5 text-white transition-opacity opacity-0 top-1 right-1 bg-black/60 group-hover:opacity-100 hover:bg-red-500">
                          <X size={11} />
                        </button>
                      </div>
                    ))}
                    {/* Add more slot */}
                    {imageFiles.length < 5 && (
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="aspect-[3/4] border-2 border-dashed border-sand-300 hover:border-blush-400 flex flex-col items-center justify-center gap-1 transition-colors bg-sand-50 hover:bg-blush-50/20">
                        <ImagePlus size={18} className="text-charcoal-700/30" />
                        <span className="text-xs font-body text-charcoal-700/40">Add more</span>
                      </button>
                    )}
                  </div>
                )}

                {formErrors.images && (
                  <p className="mt-2 text-xs font-body text-blush-500">{formErrors.images}</p>
                )}
              </div>

              {/* ── Name + Gender ── */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="block mb-2 text-xs tracking-widest uppercase font-body text-charcoal-700/60">Product Name *</label>
                  <input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} className="input-field" placeholder="e.g. Luna Dress — Sage" />
                  {formErrors.name&&<p className="mt-1 text-xs font-body text-blush-500">{formErrors.name}</p>}
                </div>
                <div>
                  <label className="block mb-2 text-xs tracking-widest uppercase font-body text-charcoal-700/60">Gender *</label>
                  <div className="relative">
                    <select value={form.gender} onChange={e=>setForm(f=>({...f,gender:e.target.value}))} className="pr-8 appearance-none input-field">
                      <option value="women">Women</option>
                      <option value="men">Men</option>
                    </select>
                    <ChevronDown size={13} className="absolute -translate-y-1/2 pointer-events-none right-3 top-1/2 text-charcoal-700/40"/>
                  </div>
                </div>
              </div>

              {/* ── Category + Badge ── */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="block mb-2 text-xs tracking-widest uppercase font-body text-charcoal-700/60">Category *</label>
                  <div className="relative">
                    <select value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))} className="pr-8 appearance-none input-field">
                      {['Boubous','Gowns','Ankara','Perfumes','Agbada','Kaftan','Babariga','Senator'].map(c=><option key={c}>{c}</option>)}
                    </select>
                    <ChevronDown size={13} className="absolute -translate-y-1/2 pointer-events-none right-3 top-1/2 text-charcoal-700/40"/>
                  </div>
                </div>
                <div>
                  <label className="block mb-2 text-xs tracking-widest uppercase font-body text-charcoal-700/60">Badge</label>
                  <div className="relative">
                    <select value={form.badge} onChange={e=>setForm(f=>({...f,badge:e.target.value}))} className="pr-8 appearance-none input-field">
                      <option value="">None</option>
                      {['New','Sale','Bestseller','Luxury','Bridal','Premium'].map(b=><option key={b}>{b}</option>)}
                    </select>
                    <ChevronDown size={13} className="absolute -translate-y-1/2 pointer-events-none right-3 top-1/2 text-charcoal-700/40"/>
                  </div>
                </div>
              </div>

              {/* ── Price ── */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="block mb-2 text-xs tracking-widest uppercase font-body text-charcoal-700/60">Price (₦) *</label>
                  <input type="number" value={form.price} onChange={e=>setForm(f=>({...f,price:e.target.value}))} className="input-field" placeholder="45000" />
                  {formErrors.price&&<p className="mt-1 text-xs font-body text-blush-500">{formErrors.price}</p>}
                </div>
                <div>
                  <label className="block mb-2 text-xs tracking-widest uppercase font-body text-charcoal-700/60">Original Price (₦) <span className="tracking-normal normal-case text-charcoal-700/40">— Optional</span></label>
                  <input type="number" value={form.originalPrice} onChange={e=>setForm(f=>({...f,originalPrice:e.target.value}))} className="input-field" placeholder="Leave blank if no sale" />
                </div>
              </div>

              {/* ── Description ── */}
              <div>
                <label className="block mb-2 text-xs tracking-widest uppercase font-body text-charcoal-700/60">Description *</label>
                <textarea value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} rows={4} className="resize-none input-field" placeholder="Describe the product..." />
                {formErrors.description&&<p className="mt-1 text-xs font-body text-blush-500">{formErrors.description}</p>}
              </div>

              {/* ── Colors + Sizes ── */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="block mb-2 text-xs tracking-widest uppercase font-body text-charcoal-700/60">
                    Colors * <span className="tracking-normal normal-case text-charcoal-700/40">(comma-separated)</span>
                  </label>
                  <input value={form.colors} onChange={e=>setForm(f=>({...f,colors:e.target.value}))} className="input-field" placeholder="Sage, Blush, Navy" />
                  {formErrors.colors&&<p className="mt-1 text-xs font-body text-blush-500">{formErrors.colors}</p>}
                </div>
                <div>
                  <label className="block mb-2 text-xs tracking-widest uppercase font-body text-charcoal-700/60">
                    Sizes * <span className="tracking-normal normal-case text-charcoal-700/40">(comma-separated)</span>
                  </label>
                  <input value={form.sizes} onChange={e=>setForm(f=>({...f,sizes:e.target.value}))} className="input-field" placeholder="S, M, L, XL" />
                  {formErrors.sizes&&<p className="mt-1 text-xs font-body text-blush-500">{formErrors.sizes}</p>}
                </div>
              </div>

              {/* ── Featured ── */}
              <div className="flex items-center">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.featured} onChange={e=>setForm(f=>({...f,featured:e.target.checked}))} className="w-4 h-4 accent-blush-500" />
                  <div>
                    <span className="text-sm font-medium font-body text-charcoal-800">Feature on Homepage</span>
                    <span className="block text-xs font-body text-charcoal-700/50">Show in featured carousel</span>
                  </div>
                </label>
              </div>

              {/* ── Actions ── */}
              <div className="flex items-center gap-4 pt-2 border-t border-sand-100">
                <button onClick={handleAddProduct} disabled={saving} className="flex items-center gap-2 btn-blush disabled:opacity-50">
                  {saving
                    ? <><span className="w-4 h-4 border-2 rounded-full border-white/30 border-t-white animate-spin"/>Saving...</>
                    : <><PlusCircle size={16}/>Add Product</>
                  }
                </button>
                <button onClick={() => { setForm(emptyForm); setImageFiles([]); }} className="btn-outline flex items-center gap-2 text-sm py-2.5">
                  <RefreshCw size={13}/>Reset
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ══ ORDERS ════════════════════════════════════════════════════════════ */}
        {tab === 'Orders' && (
          <div>
            <div className="flex items-start justify-between pt-2 mb-8">
              <div>
                <h1 className="text-3xl italic font-light font-display text-charcoal-800">Orders</h1>
                <p className="mt-1 text-sm font-body text-charcoal-700/50">{orders.length} total · {pendingOrders} pending</p>
              </div>
              <button onClick={refreshOrders}
                className="flex items-center gap-2 px-4 py-2 mt-1 text-sm transition-colors bg-white border font-body border-sand-200 hover:border-charcoal-700">
                <RefreshCw size={14} /> Refresh
              </button>
            </div>
            <div className="overflow-hidden bg-white border border-sand-200">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b bg-sand-50 border-sand-200">
                    <tr>
                      {['Customer','Items','Total','Status','Date','Update'].map(h=>(
                        <th key={h} className="px-4 py-3 text-xs tracking-widest text-left uppercase font-body text-charcoal-700/50">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sand-100">
                    {orders.length===0 ? (
                      <tr><td colSpan={6} className="text-sm text-center py-14 font-body text-charcoal-700/40">No orders yet — they will appear here when customers checkout</td></tr>
                    ) : orders.map(order=>(
                      <tr key={order.id} className="transition-colors hover:bg-sand-50">
                        <td className="px-4 py-3">
                          <p className="text-sm font-medium font-body text-charcoal-800">{order.customerName}</p>
                          <p className="text-xs font-body text-charcoal-700/50">{order.email}</p>
                          <p className="text-xs font-body text-charcoal-700/50">{order.city}</p>
                        </td>
                        <td className="px-4 py-3 text-sm font-body text-charcoal-700/70">{Array.isArray(order.items)?order.items.length:'—'} items</td>
                        <td className="px-4 py-3 text-sm font-medium font-body">{`₦${Number(order.total).toLocaleString('en-NG')}`}</td>
                        <td className="px-4 py-3">
                          <span className={`font-body text-xs px-2 py-1 font-medium ${order.status==='delivered'?'bg-green-100 text-green-700':order.status==='shipped'?'bg-blue-100 text-blue-700':order.status==='processing'?'bg-purple-100 text-purple-700':order.status==='cancelled'?'bg-red-100 text-red-600':'bg-amber-100 text-amber-700'}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs font-body text-charcoal-700/50">
                          {new Date(order.created).toLocaleDateString('en-NG',{day:'numeric',month:'short',year:'numeric'})}
                        </td>
                        <td className="px-4 py-3">
                          <select value={order.status} onChange={e=>changeOrderStatus(order.id,e.target.value)}
                            className="font-body text-xs border border-sand-200 px-2 py-1.5 focus:outline-none focus:border-blush-400 bg-white">
                            {['pending','processing','shipped','delivered','cancelled'].map(s=><option key={s} value={s}>{s}</option>)}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}