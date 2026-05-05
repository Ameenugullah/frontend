import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  { q: 'What sizes do you offer?', a: 'We offer XS to XXXL for most items. Each product page has a detailed size guide. For custom sizing, add ₦3,000–₦8,000 depending on the piece.' },
  { q: 'How long does delivery take?', a: 'Kano: 1–2 business days. Lagos, Abuja, Port Harcourt: 2–4 days. Other states: 3–6 days. International: 7–14 days.' },
  { q: 'What payment methods do you accept?', a: 'We accept Paystack (all Nigerian debit/credit cards), bank transfer (GTBank, Access, Zenith, UBA, First Bank), and cash on delivery within Kano.' },
  { q: 'Can I return or exchange an item?', a: 'Yes — within 7 days of delivery for unworn, unaltered items with tags. Contact us via WhatsApp or Instagram DM to initiate a return.' },
  { q: 'Do you do custom orders?', a: 'Absolutely. We accept custom orders for special occasions. WhatsApp or DM us with your requirements. Allow 7–14 days for custom pieces.' },
  { q: 'Do you ship internationally?', a: 'Yes, we ship worldwide. International shipping costs vary by destination. Contact us before ordering for a shipping quote.' },
  { q: 'How do I track my order?', a: 'After dispatch you\'ll receive a tracking number via WhatsApp and email. You can track in real-time on our courier\'s website.' },
  { q: 'Are your fabrics authentic?', a: 'Yes. We source premium-quality fabrics: authentic Nigerian adire, hand-woven ankara, imported satin, french lace, and more.' },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-sand-200 last:border-0">
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-5 text-left group">
        <span className={`font-display text-base sm:text-lg font-light transition-colors ${open ? 'text-blush-500' : 'text-charcoal-800 group-hover:text-blush-500'}`}>{q}</span>
        <ChevronDown size={18}
          className={`text-charcoal-700/50 shrink-0 ml-4 transition-transform duration-300 ${open ? 'rotate-180 text-blush-500' : ''}`} />
      </button>
      {open && (
        <p className="font-body text-sm text-charcoal-700/70 leading-relaxed pb-5 animate-fade-in">{a}</p>
      )}
    </div>
  );
}

export default function FAQ() {
  return (
    <div className="min-h-screen bg-cream-50 pt-24">
      <div className="bg-sand-100 border-b border-sand-200 py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <span className="tag block mb-2">Got questions?</span>
          <h1 className="section-heading font-light italic">FAQ & Size Guide</h1>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="bg-white border border-sand-200 shadow-soft px-6 sm:px-8">
          {faqs.map(item => <FAQItem key={item.q} {...item} />)}
        </div>
        <div className="mt-10 bg-blush-50 border border-blush-100 p-6 text-center">
          <p className="font-display text-xl text-charcoal-800 font-light italic mb-2">Still have questions?</p>
          <p className="font-body text-sm text-charcoal-700/60 mb-4">Contact us on Instagram or WhatsApp</p>
          <a href="https://instagram.com/nura_bahar.ng" target="_blank" rel="noreferrer"
            className="btn-blush text-sm py-2.5 px-6 inline-flex">@nura_bahar.ng</a>
        </div>
      </div>
    </div>
  );
}
