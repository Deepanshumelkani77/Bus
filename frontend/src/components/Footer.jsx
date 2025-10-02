import React from 'react'
import { Bus, Mail, Phone, MapPin, Facebook, Instagram, Twitter, ArrowRight } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="w-full bg-[#0F172A] text-slate-300 border-t border-slate-800">
      {/* Gradient top accent */}
      <div className="h-1 w-full " />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <span className="inline-flex w-11 h-11 items-center justify-center rounded-xl bg-slate-900 text-white shadow ring-1 ring-white/10">
                {/* Same logo SVG used in Navbar */}
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4 16c0 .88.39 1.67 1 2.22V20a1 1 0 001 1h1a1 1 0 001-1v-1h8v1a1 1 0 001 1h1a1 1 0 001-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z"/>
                </svg>
              </span>
              <div className="flex flex-col">
                <span className="text-lg font-extrabold text-white">BusTrac</span>
                <span className="text-xs text-slate-400">Smart Transportation</span>
              </div>
            </div>
            <p className="text-slate-400 text-sm mt-4 leading-relaxed">
              Real-time bus tracking, traffic-aware ETAs, and a modern experience for your daily commute.
            </p>

            {/* Socials */}
            <div className="mt-5 flex items-center gap-3">
              <a href="#" className="inline-flex p-2 rounded-lg bg-white/5 ring-1 ring-white/10 hover:bg-white/10 transition-transform duration-200 hover:scale-105" aria-label="Facebook">
                <Facebook className="w-4 h-4 text-white" />
              </a>
              <a href="#" className="inline-flex p-2 rounded-lg bg-white/5 ring-1 ring-white/10 hover:bg-white/10 transition-transform duration-200 hover:scale-105" aria-label="Instagram">
                <Instagram className="w-4 h-4 text-white" />
              </a>
              <a href="#" className="inline-flex p-2 rounded-lg bg-white/5 ring-1 ring-white/10 hover:bg-white/10 transition-transform duration-200 hover:scale-105" aria-label="Twitter">
                <Twitter className="w-4 h-4 text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base font-bold text-white">Quick Links</h4>
            <ul className="mt-4 space-y-2 text-sm">
              {[
                { href: '/smart-search', label: 'Find Bus' },
                { href: '/track', label: 'Track Bus' },
                { href: '/routes', label: 'Routes' },
                { href: '/login', label: 'Sign In' },
              ].map((l) => (
                <li key={l.href}>
                  <a className="relative inline-block hover:text-white group" href={l.href}>
                    <span>{l.label}</span>
                    <span className="block h-0.5 w-0 bg-gradient-to-r from-sky-500 to-teal-500 transition-all duration-300 group-hover:w-full"></span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-base font-bold text-white">Company</h4>
            <ul className="mt-4 space-y-2 text-sm">
              {[
                { href: '#', label: 'About' },
                { href: '#', label: 'Careers' },
                { href: '#', label: 'Contact' },
                { href: '#', label: 'Help Center' },
              ].map((l) => (
                <li key={l.label}>
                  <a className="relative inline-block hover:text-white group" href={l.href}>
                    <span>{l.label}</span>
                    <span className="block h-0.5 w-0 bg-gradient-to-r from-sky-500 to-teal-500 transition-all duration-300 group-hover:w-full"></span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-base font-bold text-white">Stay updated</h4>
            <p className="text-sm text-slate-400 mt-2">Get product updates and city rollouts right in your inbox.</p>
            <form className="mt-4" onSubmit={(e) => e.preventDefault()}>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <label htmlFor="email" className="sr-only">Email</label>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="w-full rounded-xl bg-white/10 text-white placeholder:text-slate-400 border border-white/10 focus:outline-none focus:ring-2 focus:ring-sky-500 px-3 py-2"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-600 to-teal-600 text-white font-semibold px-3.5 py-2 hover:from-sky-500 hover:to-teal-500"
                >
                  Subscribe <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Contact */}
            <ul className="mt-5 space-y-3 text-sm">
              <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-slate-300" /> support@bustrac.app</li>
              <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-slate-300" /> +91 00000 00000</li>
              <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-slate-300" /> Bengaluru, India</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 text-sm text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span> {new Date().getFullYear()} BusTrac. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
            <a href="#" className="hover:text-white">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
