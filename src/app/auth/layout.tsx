import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Sparkles, Truck, Headphones } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your Unlimited IT Solutions account.',
  robots: { index: false, follow: false },
};

const perks = [
  { icon: ShieldCheck, title: 'Track every order', desc: 'Real-time status from workshop to your door.' },
  { icon: Truck, title: 'Saved addresses', desc: 'Skip the typing. Check out in under a minute.' },
  { icon: Headphones, title: 'Priority support', desc: 'Direct line to the technician handling your job.' },
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[calc(100vh-4rem)] grid lg:grid-cols-2">
      {/* Marketing pane */}
      <div className="relative hidden lg:flex isolate overflow-hidden bg-aurora text-white p-12 xl:p-16 flex-col justify-between">
        <div className="absolute inset-0 animate-aurora opacity-90 pointer-events-none" />
        <div className="absolute inset-0 bg-grid pointer-events-none" />
        <div className="absolute -top-32 -left-32 w-[28rem] h-[28rem] rounded-full bg-blue-500/30 blur-3xl animate-orb pointer-events-none" />
        <div className="absolute -bottom-40 -right-32 w-[26rem] h-[26rem] rounded-full bg-purple-500/25 blur-3xl animate-orb pointer-events-none" style={{ animationDelay: '-7s' }} />

        <Link href="/" className="relative inline-flex items-center gap-2.5 group w-fit">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo.svg" alt="Unlimited IT Solutions" className="h-9 w-auto" />
          <div className="leading-none">
            <span className="block text-lg font-extrabold tracking-tight">
              Unlimited<span className="text-primary-400">.</span>
            </span>
            <span className="block text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-slate-400 mt-0.5">
              IT Solutions
            </span>
          </div>
        </Link>

        <div className="relative max-w-md">
          <span className="eyebrow-chip mb-5">
            <Sparkles className="w-3.5 h-3.5" /> Member benefits
          </span>
          <h2 className="text-3xl xl:text-4xl font-bold tracking-tight leading-tight mb-3">
            Built for people who actually use their tech.
          </h2>
          <p className="text-slate-300 leading-relaxed mb-8">
            Sign in to track jobs, manage saved hardware, and get help straight from the workshop.
          </p>
          <ul className="space-y-4">
            {perks.map((perk) => (
              <li key={perk.title} className="flex items-start gap-3">
                <span className="w-9 h-9 rounded-lg bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center flex-shrink-0">
                  <perk.icon className="w-4 h-4 text-blue-300" />
                </span>
                <div>
                  <div className="text-sm font-semibold text-white">{perk.title}</div>
                  <div className="text-xs text-slate-400">{perk.desc}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative text-xs text-slate-500">
          © {new Date().getFullYear()} Unlimited IT Solutions · Ramsgate, KZN
        </div>
      </div>

      {/* Form pane */}
      <div className="flex items-center justify-center bg-gradient-to-b from-white via-slate-50 to-white px-4 sm:px-6 py-12">
        {children}
      </div>
    </div>
  );
}

