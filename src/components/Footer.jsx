import { Link } from 'react-router-dom';
import { Instagram, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-charcoal-900 text-cream-50">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="lg:col-span-1">
            <span className="font-script text-4xl text-cream-50 block leading-none mb-1">NuraBahar</span>
            <span className="font-body text-[9px] tracking-[0.3em] uppercase text-blush-400 block mb-4">Nigeria</span>
            <p className="font-body text-sm text-cream-50/50 leading-relaxed mb-5">
              Premium Nigerian fashion for men and women. Crafted with pride in Kano, worn across the world.
            </p>
            <div className="flex gap-3">
              <a href="https://instagram.com/nura_bahar.ng" target="_blank" rel="noreferrer"
                className="w-9 h-9 border border-white/20 flex items-center justify-center text-cream-50/50 hover:text-blush-400 hover:border-blush-400 transition-colors">
                <Instagram size={16} />
              </a>
              <a href="mailto:hello@nurabahar.ng"
                className="w-9 h-9 border border-white/20 flex items-center justify-center text-cream-50/50 hover:text-blush-400 hover:border-blush-400 transition-colors">
                <Mail size={16} />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-body text-xs tracking-[0.2em] uppercase text-cream-50/50 mb-5">Shop</h4>
            <ul className="space-y-3">
              {[
                { to: '/products', label: "Women's Collection" },
                { to: '/products?gender=men', label: "Men's Collection" },
                { to: '/products?category=Boubous', label: 'Boubous' },
                { to: '/products?category=Gowns', label: 'Gowns' },
                { to: '/products?category=Ankara', label: 'Ankara' },
                { to: '/products?category=Perfumes', label: 'Perfumes' },
              ].map(({ to, label }) => (
                <li key={label}>
                  <Link to={to} className="font-body text-sm text-cream-50/60 hover:text-cream-50 transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-body text-xs tracking-[0.2em] uppercase text-cream-50/50 mb-5">Information</h4>
            <ul className="space-y-3">
              {[
                { to: '/faq', label: 'FAQ & Size Guide' },
                { to: '/faq', label: 'Shipping Policy' },
                { to: '/faq', label: 'Returns & Exchanges' },
                { to: '/login', label: 'My Account' },
                { to: '/admin', label: 'Admin Dashboard' },
              ].map(({ to, label }) => (
                <li key={label}>
                  <Link to={to} className="font-body text-sm text-cream-50/60 hover:text-cream-50 transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-body text-xs tracking-[0.2em] uppercase text-cream-50/50 mb-5">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={15} className="text-blush-400 shrink-0 mt-0.5" />
                <span className="font-body text-sm text-cream-50/60">Kano, Nigeria</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={15} className="text-blush-400 shrink-0 mt-0.5" />
                <span className="font-body text-sm text-cream-50/60">+234 800 000 0000</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={15} className="text-blush-400 shrink-0 mt-0.5" />
                <span className="font-body text-sm text-cream-50/60">hello@nurabahar.ng</span>
              </li>
              <li className="flex items-start gap-3">
                <Instagram size={15} className="text-blush-400 shrink-0 mt-0.5" />
                <span className="font-body text-sm text-cream-50/60">@nura_bahar.ng</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-body text-xs text-cream-50/30">© 2025 Nura Bahar Nigeria. All rights reserved.</p>
          <p className="font-body text-xs text-cream-50/30">Made with love in Kano, Nigeria 🇳🇬</p>
        </div>
      </div>
    </footer>
  );
}
