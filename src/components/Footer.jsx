'use client';

import React from 'react';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer style={{ backgroundColor: '#5B4636', color: '#D1C7BB' }}>
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">

        {/*
          Layout logic:
          Mobile  (< sm): 2-col grid — Brand top full-width, Links + Support side by side, Contact full-width below
          Desktop (lg+) : 4-col grid — all 4 columns equal
        */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8 lg:gap-10 mb-8 sm:mb-10">

          {/* ── Brand ── full width on mobile, 1 col on desktop */}
          <div className="col-span-2 lg:col-span-1">
            <h4 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3" style={{ color: '#D6A84A' }}>
              Green Valley Naturals
            </h4>
            <p className="text-xs leading-relaxed mb-4 max-w-xs" style={{ color: '#BFB5A8' }}>
              Your trusted source for 100% organic and farm-fresh groceries, straight from farmers to your doorstep.
            </p>
            <div className="flex gap-2">
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <button
                  key={i}
                  className="p-1.5 sm:p-2 rounded-lg hover:opacity-75 transition-opacity"
                  style={{ backgroundColor: '#7A5F49' }}
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* ── Quick Links ── */}
          <div className="col-span-1">
            <h5
              className="text-[10px] sm:text-xs font-bold mb-3 uppercase tracking-widest"
              style={{ color: '#D6A84A' }}
            >
              Quick Links
            </h5>
            <ul className="space-y-1.5">
              {['About Us', 'Shop All', 'Contact'].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-xs sm:text-sm hover:text-[#D6A84A] transition-colors duration-200"
                    style={{ color: '#BFB5A8' }}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Support ── */}
          <div className="col-span-1">
            <h5
              className="text-[10px] sm:text-xs font-bold mb-3 uppercase tracking-widest"
              style={{ color: '#D6A84A' }}
            >
              Support
            </h5>
            <ul className="space-y-1.5">
              {['My Account', 'Track Order', 'Delivery Info', 'Returns & Refunds', 'FAQs', 'Terms & Conditions'].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-xs sm:text-sm hover:text-[#D6A84A] transition-colors duration-200"
                    style={{ color: '#BFB5A8' }}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contact ──
               On mobile: spans both columns so it sits full-width below the two link columns.
               On lg: normal single column.
          */}
          <div className="col-span-2 lg:col-span-1">
            <h5
              className="text-[10px] sm:text-xs font-bold mb-3 uppercase tracking-widest"
              style={{ color: '#D6A84A' }}
            >
              Get in Touch
            </h5>
            <ul className="space-y-2.5">
              <li className="flex items-center gap-2.5">
                <Phone className="w-3.5 h-3.5 shrink-0" style={{ color: '#D6A84A' }} />
                <span className="text-xs sm:text-sm" style={{ color: '#BFB5A8' }}>+91 98765 43210</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: '#D6A84A' }} />
                <span className="text-xs sm:text-sm" style={{ color: '#BFB5A8' }}>hello@greenvalleynaturals.com</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: '#D6A84A' }} />
                <span className="text-xs sm:text-sm" style={{ color: '#BFB5A8' }}>
                  123 Organic Lane, Green Valley, Mumbai 400001
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* ── Bottom bar ── */}
        <div className="pt-5 sm:pt-6" style={{ borderTop: '1px solid #7A5F49' }}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
            <p className="text-[10px] sm:text-xs text-center sm:text-left" style={{ color: '#9A8878' }}>
              © 2026 Green Valley Naturals. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center sm:justify-end gap-x-4 gap-y-1 text-[10px] sm:text-xs">
              {['Privacy & Data Policy', 'Terms of Service', 'Refund & Cancellation'].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="hover:text-[#D6A84A] transition-colors duration-200 whitespace-nowrap"
                  style={{ color: '#9A8878' }}
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;