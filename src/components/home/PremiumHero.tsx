'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles, Phone, MapPin, ShieldCheck, Clock4, Award } from 'lucide-react';

const headlineLines = [
  ['Enterprise-grade', 'IT'],
  ['for', 'every', 'business.'],
];

export default function PremiumHero() {
  return (
    <section className="relative isolate overflow-hidden bg-aurora">
      {/* Animated aurora layer */}
      <div className="absolute inset-0 animate-aurora opacity-90 pointer-events-none" />
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid pointer-events-none" />
      {/* Floating orbs */}
      <div className="absolute -top-24 -left-24 w-[28rem] h-[28rem] rounded-full bg-blue-500/30 blur-3xl animate-orb pointer-events-none" />
      <div className="absolute -bottom-32 right-0 w-[32rem] h-[32rem] rounded-full bg-purple-500/25 blur-3xl animate-orb pointer-events-none" style={{ animationDelay: '-7s' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pt-28 sm:pb-32 lg:pt-36 lg:pb-40">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="eyebrow-chip"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Trusted on the South Coast since 2010</span>
        </motion.div>

        {/* Headline */}
        <h1 className="mt-7 text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold text-white leading-[0.98] tracking-tight max-w-5xl">
          {headlineLines.map((line, li) => (
            <span key={li} className="block">
              {line.map((word, wi) => (
                <motion.span
                  key={`${li}-${wi}`}
                  initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 0.7, delay: 0.15 + (li * line.length + wi) * 0.07, ease: [0.22, 1, 0.36, 1] }}
                  className={`inline-block mr-3 ${li === 1 && word === 'business.' ? 'text-gradient-premium' : ''}`}
                >
                  {word}
                </motion.span>
              ))}
            </span>
          ))}
        </h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.85 }}
          className="mt-7 max-w-2xl text-lg sm:text-xl text-slate-300/90 leading-relaxed"
        >
          Repairs, hardware, networks, CCTV and managed support — engineered with the rigour of a billion-rand enterprise, delivered with the warmth of a Ramsgate local.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.0 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <Link href="/services" className="btn-premium group">
            Explore services
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link href="/business/quote" className="btn-ghost-premium">
            Request business quote
          </Link>
        </motion.div>

        {/* Quick info row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-slate-300/80"
        >
          <a href="tel:0825569875" className="inline-flex items-center gap-2 hover:text-white transition-colors">
            <Phone className="w-4 h-4 text-blue-400" /> 082 556 9875
          </a>
          <span className="inline-flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-400" /> 202 Marine Drive, Ramsgate
          </span>
          <span className="inline-flex items-center gap-2">
            <Clock4 className="w-4 h-4 text-blue-400" /> Mon–Fri 08:00–17:00
          </span>
        </motion.div>

        {/* Trust strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.35 }}
          className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-3"
        >
          {[
            { k: '15+', v: 'Years on the Coast' },
            { k: '5,900+', v: 'Active SKUs in stock' },
            { k: '4.9★', v: 'Google rating' },
            { k: '12-mo', v: 'Hardware warranty' },
          ].map((s, i) => (
            <div key={i} className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md px-5 py-4">
              <div className="text-2xl sm:text-3xl font-extrabold text-white">{s.k}</div>
              <div className="text-xs uppercase tracking-wider text-slate-300/80 mt-0.5">{s.v}</div>
            </div>
          ))}
        </motion.div>

        {/* Compliance row */}
        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-400">
          <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> POPIA compliant</span>
          <span className="inline-flex items-center gap-1.5"><Award className="w-3.5 h-3.5 text-emerald-400" /> Authorised reseller — HP, Dell, Lenovo, Apple</span>
          <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> SARS-registered VAT vendor</span>
        </div>
      </div>

      {/* Bottom fade to next section */}
      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-b from-transparent to-white dark:to-gray-900 pointer-events-none" />
    </section>
  );
}
