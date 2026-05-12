import { useState } from 'react';
import { PlusCircle, RefreshCw, Upload, ChevronDown, X } from 'lucide-react';

const emptyForm = {
  name: '', category: 'Gowns', gender: 'women', price: '', originalPrice: '',
  description: '', colors: '', sizes: '',
  images: [], imageFiles: [], badge: '', featured: false,
};

export default function AdminAddProduct({ addProduct, pbConnected, onSuccess }) {
  const [form, setForm]           = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});
  const [saved, setSaved]         = useState(false);
  const [saving, setSaving]       = useState(false);
  const [dragOver, setDragOver]   = useState(false);

  const handleImageFiles = (files) => {
    const selected = Array.from(files).slice(0, 3);
    const previews = selected.map(f => URL.createObjectURL(f));
    setForm(f => ({ ...f, images: previews, imageFiles: selected }));
    setFormErrors(e => ({ ...e, image0: '' }));
  };

  const removeImage = (idx) => {
    // Revoke the object URL to free memory
    URL.revokeObjectURL(form.images[idx]);
    setForm(f => ({
      ...f,
      images: f.images.filter((_, i) => i !== idx),
      imageFiles: (f.imageFiles || []).filter((_, i) => i !== idx),
    }));
  };

  const validateForm = () => {
    const e = {};
    if (!form.name.trim())        e.name        = 'Product name is required';
    if (!form.price || isNaN(Number(form.price))) e.price = 'Valid price required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.colors.trim())      e.colors      = 'At least one color required';
    if (!form.sizes.trim())       e.sizes       = 'At least one size required';
    if (!form.images?.length)     e.image0      = 'At least one image is required';
    setFormErrors(e);
    return !Object.keys(e).length;
  };

  const handleAddProduct = async () => {
    if (!validateForm()) return;
    setSaving(true);
    try {
      await addProduct({
        name:          form.name.trim(),
        category:      form.category,
        gender:        form.gender,
        price:         Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
        description:   form.description.trim(),
        colors:        form.colors.split(',').map(s => s.trim()).filter(Boolean),
        sizes:         form.sizes.split(',').map(s => s.trim()).filter(Boolean),
        images:        form.images,
        imageFiles:    form.imageFiles,
        badge:         form.badge || null,
        featured:      form.featured,
        stock:         10,
      });
      setForm(emptyForm);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      onSuccess();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="pt-2 mb-8">
        <h1 className="text-3xl italic font-light font-display text-charcoal-800">Add New Product</h1>
        <p className="mt-1 text-sm font-body text-charcoal-700/50">Fill in the details to add a new item to the store.</p>
      </div>

      {saved && (
        <div className="flex items-center gap-2 px-4 py-3 mb-6 text-sm text-green-700 border border-green-200 bg-green-50 font-body animate-fade-in">
          ✓ Product added successfully!
        </div>
      )}

      <div className="p-6 space-y-6 bg-white border border-sand-200 md:p-8">

        {/* Name + Gender */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="block mb-2 text-xs tracking-widest uppercase font-body text-charcoal-700/60">Product Name *</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="input-field" placeholder="e.g. Luna Dress — Sage" />
            {formErrors.name && <p className="mt-1 text-xs font-body text-blush-500">{formErrors.name}</p>}
          </div>
          <div>
            <label className="block mb-2 text-xs tracking-widest uppercase font-body text-charcoal-700/60">Gender *</label>
            <div className="relative">
              <select value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))}
                className="pr-8 appearance-none input-field">
                <option value="women">Women</option>
                <option value="men">Men</option>
              </select>
              <ChevronDown size={13} className="absolute -translate-y-1/2 pointer-events-none right-3 top-1/2 text-charcoal-700/40" />
            </div>
          </div>
        </div>

        {/* Category + Badge */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="block mb-2 text-xs tracking-widest uppercase font-body text-charcoal-700/60">Category *</label>
            <div className="relative">
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="pr-8 appearance-none input-field">
                {['Boubous', 'Gowns', 'Ankara', 'Perfumes', 'Agbada', 'Kaftan', 'Babariga', 'Senator'].map(c => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              <ChevronDown size={13} className="absolute -translate-y-1/2 pointer-events-none right-3 top-1/2 text-charcoal-700/40" />
            </div>
          </div>
          <div>
            <label className="block mb-2 text-xs tracking-widest uppercase font-body text-charcoal-700/60">
              Badge <span className="tracking-normal normal-case text-charcoal-700/40">(optional)</span>
            </label>
            <div className="relative">
              <select value={form.badge} onChange={e => setForm(f => ({ ...f, badge: e.target.value }))}
                className="pr-8 appearance-none input-field">
                <option value="">None</option>
                {['New', 'Sale', 'Bestseller', 'Luxury', 'Bridal', 'Premium'].map(b => (
                  <option key={b}>{b}</option>
                ))}
              </select>
              <ChevronDown size={13} className="absolute -translate-y-1/2 pointer-events-none right-3 top-1/2 text-charcoal-700/40" />
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="block mb-2 text-xs tracking-widest uppercase font-body text-charcoal-700/60">Price (₦) *</label>
            <input type="number" value={form.price}
              onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
              className="input-field" placeholder="45000" />
            {formErrors.price && <p className="mt-1 text-xs font-body text-blush-500">{formErrors.price}</p>}
          </div>
          <div>
            <label className="block mb-2 text-xs tracking-widest uppercase font-body text-charcoal-700/60">
              Original Price (₦) <span className="tracking-normal normal-case text-charcoal-700/40">— if on sale</span>
            </label>
            <input type="number" value={form.originalPrice}
              onChange={e => setForm(f => ({ ...f, originalPrice: e.target.value }))}
              className="input-field" placeholder="Leave blank if no sale" />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block mb-2 text-xs tracking-widest uppercase font-body text-charcoal-700/60">Description *</label>
          <textarea value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            rows={4} className="resize-none input-field"
            placeholder="Describe the product — fabric, fit, occasions..." />
          {formErrors.description && <p className="mt-1 text-xs font-body text-blush-500">{formErrors.description}</p>}
        </div>

        {/* Colors + Sizes */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="block mb-2 text-xs tracking-widest uppercase font-body text-charcoal-700/60">
              Colors * <span className="tracking-normal normal-case text-charcoal-700/40">(comma-separated)</span>
            </label>
            <input value={form.colors}
              onChange={e => setForm(f => ({ ...f, colors: e.target.value }))}
              className="input-field" placeholder="Sage, Blush, Navy" />
            {formErrors.colors && <p className="mt-1 text-xs font-body text-blush-500">{formErrors.colors}</p>}
          </div>
          <div>
            <label className="block mb-2 text-xs tracking-widest uppercase font-body text-charcoal-700/60">
              Sizes * <span className="tracking-normal normal-case text-charcoal-700/40">(comma-separated)</span>
            </label>
            <input value={form.sizes}
              onChange={e => setForm(f => ({ ...f, sizes: e.target.value }))}
              className="input-field" placeholder="S, M, L, XL" />
            {formErrors.sizes && <p className="mt-1 text-xs font-body text-blush-500">{formErrors.sizes}</p>}
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block mb-2 text-xs tracking-widest uppercase font-body text-charcoal-700/60">
            Product Images * <span className="tracking-normal normal-case text-charcoal-700/40">
              (up to 3 photos{pbConnected ? '' : ' — stored locally in offline mode'})
            </span>
          </label>

          <label
            className={`flex flex-col items-center justify-center w-full border-2 border-dashed cursor-pointer transition-all duration-200 py-10 px-4 ${
              dragOver ? 'border-blush-500 bg-blush-50' : 'border-sand-300 hover:border-blush-400 bg-sand-50 hover:bg-blush-50'
            }`}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); handleImageFiles(e.dataTransfer.files); }}>
            <input type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden"
              onChange={e => handleImageFiles(e.target.files)} />
            <Upload size={32} className={`mb-3 ${dragOver ? 'text-blush-500' : 'text-sand-300'}`} />
            <p className="mb-1 text-sm font-medium font-body text-charcoal-700/70">Click to upload or drag & drop</p>
            <p className="text-xs font-body text-charcoal-700/40">JPG, PNG, WEBP — max 3 images</p>
          </label>

          {form.images?.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-4">
              {form.images.map((src, i) => (
                <div key={i} className="relative group">
                  <img src={src} alt={`Preview ${i + 1}`}
                    className="object-cover w-24 border h-28 border-sand-200 bg-sand-100" />
                  <button type="button" onClick={() => removeImage(i)}
                    className="absolute flex items-center justify-center w-6 h-6 text-sm font-bold text-white transition-colors rounded-full shadow -top-2 -right-2 bg-blush-500 hover:bg-blush-600">
                    <X size={12} />
                  </button>
                  <span className="absolute bottom-1 left-1 bg-black/50 text-white font-body text-xs px-1.5 py-0.5">
                    {i === 0 ? 'Main' : `#${i + 1}`}
                  </span>
                </div>
              ))}
              {form.images.length < 3 && (
                <label className="flex flex-col items-center justify-center w-24 transition-colors border-2 border-dashed cursor-pointer h-28 border-sand-300 hover:border-blush-400 bg-sand-50 hover:bg-blush-50">
                  <input type="file" accept="image/*" multiple className="hidden"
                    onChange={e => {
                      const newFiles = Array.from(e.target.files);
                      const combined = [...(form.imageFiles || []), ...newFiles].slice(0, 3);
                      const previews = combined.map(f => f instanceof File ? URL.createObjectURL(f) : f);
                      setForm(f => ({ ...f, images: previews, imageFiles: combined }));
                    }} />
                  <span className="mb-1 text-2xl text-sand-300">+</span>
                  <span className="text-xs font-body text-charcoal-700/40">Add more</span>
                </label>
              )}
            </div>
          )}

          {formErrors.image0 && <p className="mt-2 text-xs font-body text-blush-500">{formErrors.image0}</p>}

          {!pbConnected && form.images?.length > 0 && (
            <div className="p-3 mt-2 border bg-amber-50 border-amber-200">
              <p className="text-xs font-body text-amber-700">
                ⚠️ <strong>Offline Mode:</strong> Images won't persist after refresh. Connect PocketBase for permanent storage.
              </p>
            </div>
          )}
        </div>

        {/* Featured */}
        <div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.featured}
              onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))}
              className="w-4 h-4 accent-blush-500" />
            <div>
              <span className="block text-sm font-medium font-body text-charcoal-800">Feature on Homepage</span>
              <span className="text-xs font-body text-charcoal-700/50">Show in the featured carousel</span>
            </div>
          </label>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-4 pt-2 border-t border-sand-100">
          <button onClick={handleAddProduct} disabled={saving}
            className="flex items-center gap-2 btn-blush disabled:opacity-50">
            {saving
              ? <><span className="w-4 h-4 border-2 rounded-full border-white/30 border-t-white animate-spin" /> Saving...</>
              : <><PlusCircle size={16} /> Add Product to Store</>
            }
          </button>
          <button onClick={() => setForm(emptyForm)}
            className="btn-outline flex items-center gap-2 text-sm py-2.5">
            <RefreshCw size={13} /> Reset
          </button>
        </div>
      </div>
    </div>
  );
}