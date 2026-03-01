'use client';

import React, { useState } from 'react';
import { AlertCircle, TrendingUp, Zap, Lock, Truck, CreditCard, RotateCcw, Check } from 'lucide-react';

const benefits = [
  { title: 'Direct from Farmers', description: 'Fair prices, transparent sourcing' },
  { title: 'No Preservatives', description: 'Pure, natural ingredients only' },
  { title: 'Quality Tested', description: 'Lab-verified for safety and purity' },
  { title: 'Transparent Practices', description: 'Complete traceability and accountability' },
];

const stats = [
  { number: 'Farm to Home', label: 'Direct Sourcing', subText: 'Fresh & Transparent' },
  { number: '100% Natural', label: 'No Adulteration', subText: 'Lab Tested' },
  { number: 'Ethically Sourced', label: 'Farmer Support', subText: 'Fair Trade' },
  { number: 'Quality Promise', label: 'Every Order', subText: 'Every Time' },
];

const trustPoints = [
  { icon: Lock, label: 'Secure Payments', description: 'SSL encrypted transactions' },
  { icon: Truck, label: 'Fast Shipping', description: 'Delivery in 2-3 days' },
  { icon: CreditCard, label: 'Free Returns', description: '7-day money-back guarantee' },
  { icon: RotateCcw, label: 'Easy Exchanges', description: 'Hassle-free process' },
];

const certifications = [
  {
    image: 'https://images.seeklogo.com/logo-png/30/1/fssai-logo-png_seeklogo-304263.png',
    alt: 'FSSAI',
    badge: 'FSSAI',
    title: 'Food Safety Authority',
    meta: 'License No: XXXXXXXXXXXXXX',
    desc: 'Govt. certified food safety standards',
    accent: '#2F6B3F',
  },
  {
    image: '/images/de48d09d-2697-4be8-9fc4-6ae2383064ec.jpg',
    alt: 'Naturally Sourced',
    badge: 'NATURAL',
    title: 'Naturally Sourced',
    meta: 'Direct from Farmers',
    desc: 'Fresh & carefully selected',
    accent: '#2F6B3F',
  },
  {
    image: '/images/hygeine.jpg',
    alt: 'Hygienic Processing',
    badge: 'HYGIENE',
    title: 'Hygienic Processing',
    meta: 'Clean Handling Standards',
    desc: 'Packed with care',
    accent: '#2F6B3F',
  },
  {
    image: '/images/vecteezy_made-in-india-stamp-logo-icon-symbol-design-seal-national_24208335.jpg',
    alt: 'Made in India',
    badge: 'INDIA',
    title: 'Made in India',
    meta: 'Locally Manufactured',
    desc: 'Supporting domestic agriculture',
    accent: '#2F6B3F',
  },
];

export function BenefitsSection() {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 6000);
  };

  return (
    <>
      {/* ── Stats ── */}
      <section className="py-12 sm:py-16" style={{ backgroundColor: '#FFFFFF', borderTop: '1px solid #E6E1D8' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold mb-2" style={{ color: '#2F6B3F' }}>
                  {stat.number}
                </div>
                <div className="text-sm sm:text-base font-medium mb-1" style={{ color: '#3A3A3A' }}>
                  {stat.label}
                </div>
                <div className="text-xs sm:text-sm" style={{ color: '#999' }}>
                  {stat.subText}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Certifications — FIXED ── */}
      <section
        className="py-14 sm:py-20"
        style={{
          backgroundColor: '#F8F6F2',
          borderTop: '1px solid #E6E1D8',
          borderBottom: '1px solid #E6E1D8',
        }}
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-12">
          {/* Header */}
          <div className="text-center mb-10 sm:mb-14">
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: '#2F6B3F' }}>
              Verified & Trusted
            </p>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-3" style={{ color: '#5B4636' }}>
              Certified &amp; Compliant
            </h3>
            <p className="text-sm sm:text-base max-w-md mx-auto" style={{ color: '#888' }}>
              Every product meets government standards — verified by independent labs.
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {certifications.map((cert, i) => (
              <div
                key={i}
                className="group rounded-2xl overflow-hidden flex flex-col"
                style={{ backgroundColor: '#FFFFFF', border: '1px solid #E6E1D8' }}
              >
                {/* Full-bleed image area — fixed height, object-contain so logos aren't cropped */}
                <div
                  className="relative w-full flex items-center justify-center overflow-hidden"
                  style={{ height: '160px', backgroundColor: '#FFFFFF' }}
                >
                  <img
                    src={cert.image}
                    alt={cert.alt}
                    className="w-full h-full object-contain p-5"
                    onError={(e) => {
                      e.target.src =
                        'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80';
                    }}
                  />

                </div>

                {/* Text */}
                <div className="p-3 sm:p-5 flex flex-col gap-1 flex-1 text-center">
                  <h4 className="font-semibold text-xs sm:text-sm leading-snug" style={{ color: '#3A3A3A' }}>
                    {cert.title}
                  </h4>
                  <p className="text-[10px] sm:text-xs font-medium" style={{ color: cert.accent }}>
                    {cert.meta}
                  </p>
                  <p className="text-[10px] sm:text-xs mt-0.5" style={{ color: '#999' }}>
                    {cert.desc}
                  </p>
                </div>

              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust & Compliance ── */}
      <section className="py-12 sm:py-16 lg:py-20" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="mx-auto px-9 sm:px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: '#2F6B3F' }}>
                Trust & Compliance
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold leading-tight mb-6" style={{ color: '#5B4636' }}>
                Government Certified.<br />
                <span style={{ color: '#2F6B3F' }}>100% Transparent.</span>
              </h2>
              <p className="text-base sm:text-lg leading-relaxed mb-4" style={{ color: '#666' }}>
                Licensed by the Food Safety and Standards Authority of India (FSSAI), we follow strict food safety practices at every stage. From sourcing to packaging, we ensure clean handling and quality you can trust.
              </p>
              <p className="text-base leading-relaxed mb-8" style={{ color: '#666' }}>
                Our commitment isn't just about meeting standards — it's about exceeding them.
              </p>
              <div className="pt-4" style={{ borderTop: '1px solid #E6E1D8' }}>
                <p className="text-sm font-semibold mb-3" style={{ color: '#3A3A3A' }}>Certifications Include:</p>
                <ul className="space-y-2">
                  {['FSSAI Licensed Food Authority', '100% Pure & Unadulterated', 'Lab Tested Quality Standards'].map((item) => (
                    <li key={item} className="text-sm flex gap-2" style={{ color: '#666' }}>
                      <span style={{ color: '#2F6B3F', fontWeight: '600' }}>•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="p-4 sm:p-6 rounded-lg transition-all duration-200 hover:shadow-md"
                  style={{ backgroundColor: '#F8F6F2', border: '1px solid #E6E1D8' }}
                >
                  <div className="flex gap-4">
                    <div
                      className="shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mt-0.5"
                      style={{ backgroundColor: '#FFFFFF', border: '2px solid #2F6B3F' }}
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: '#2F6B3F' }} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm sm:text-base font-semibold mb-1" style={{ color: '#3A3A3A' }}>{benefit.title}</h4>
                      <p className="text-xs sm:text-sm leading-relaxed" style={{ color: '#999' }}>{benefit.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Farm to Table ── */}
      <section className="py-12 sm:py-16 lg:py-20" style={{ backgroundColor: '#F8F6F2' }}>
        <div className="mx-auto px-8 sm:px-6 lg:px-12">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="rounded-2xl overflow-hidden shadow-sm" style={{ border: '1px solid #E6E1D8' }}>
                <img
                  src="https://imgs.etvbharat.com/etvbharat/prod-images/30-01-2026/1200-675-25929679-thumbnail-16x9-agriculture111-aspera.jpg"
                  alt="Direct from organic farms"
                  className="w-full h-48 sm:h-72 md:h-96 object-cover"
                />
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-4 lg:mb-6" style={{ color: '#5B4636' }}>
                Direct from Farm
              </h3>
              <p className="text-sm sm:text-base lg:text-lg leading-relaxed mb-6 lg:mb-8" style={{ color: '#666' }}>
                Growing a community of trusted farmers. Direct sourcing, transparent pricing, and incredible freshness in every package.
              </p>
              <div className="space-y-4">
                {[
                  { icon: Zap, title: 'Harvested Fresh', sub: 'Daily pickings at peak freshness' },
                  { icon: AlertCircle, title: 'Zero Chemicals', sub: 'Completely pesticide-free farming' },
                  { icon: TrendingUp, title: 'Fair Price', sub: 'Transparent pricing benefits everyone' },
                ].map(({ icon: Icon, title, sub }) => (
                  <div key={title} className="flex gap-3">
                    <Icon className="w-5 h-5 shrink-0 mt-0.5" style={{ color: '#2F6B3F' }} strokeWidth={2} />
                    <div>
                      <div className="text-sm lg:text-base font-semibold" style={{ color: '#3A3A3A' }}>{title}</div>
                      <div className="text-xs lg:text-sm" style={{ color: '#666' }}>{sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust Strip ── */}
      <section style={{ backgroundColor: '#FFFFFF', borderTop: '1px solid #E6E1D8', borderBottom: '1px solid #E6E1D8' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8 sm:py-10 lg:py-12 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {trustPoints.map((point, index) => {
              const IconComponent = point.icon;
              return (
                <div key={index} className="text-center">
                  <IconComponent className="w-6 h-6 lg:w-7 lg:h-7 mx-auto mb-2 lg:mb-3" style={{ color: '#2F6B3F' }} strokeWidth={1.5} />
                  <div className="text-sm lg:text-base font-semibold" style={{ color: '#3A3A3A' }}>{point.label}</div>
                  <div className="text-xs lg:text-sm mt-1" style={{ color: '#999' }}>{point.description}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section className="py-8 sm:py-16 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#2F6B3F' }}>
        <div className="mx-auto">
          <div className="grid lg:grid-cols-2 gap-4 lg:gap-3 items-end px-4 sm:px-6">
            <div>
              <h3 className="text-2xl sm:text-4xl font-bold mb-2 sm:mb-3 leading-tight" style={{ color: '#FFFFFF' }}>
                Join Our Community
              </h3>
              <p className="text-sm sm:text-lg mb-1.5" style={{ color: '#E8E8E8' }}>
                Get organic tips, exclusive offers, and new product updates
              </p>
              <p className="text-xs sm:text-sm" style={{ color: '#D0D0D0' }}>No spam. Unsubscribe anytime.</p>
            </div>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 lg:max-w-xl">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 sm:px-5 py-2.5 sm:py-4 rounded-lg text-xs sm:text-sm outline-none"
                style={{ backgroundColor: '#FFFFFF', color: '#3A3A3A', border: 'none' }}
                required
              />
              <button
                type="submit"
                className="px-5 sm:px-8 py-2.5 sm:py-4 rounded-lg font-semibold text-xs sm:text-sm whitespace-nowrap transition-all hover:opacity-85 active:scale-95 flex items-center justify-center gap-2"
                style={{
                  backgroundColor: subscribed ? '#059669' : '#D6A84A',
                  color: '#FFFFFF',
                  boxShadow: subscribed ? '0 4px 12px rgba(5,150,105,0.3)' : '0 1px 2px rgba(0,0,0,0.1)',
                }}
              >
                {subscribed ? <><Check size={18} /> Subscribed</> : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

export default BenefitsSection;