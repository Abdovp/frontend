import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { defaultLawFirmSiteConfig } from "../lib/law-firm-template";
import { submitOrder } from "../lib/api/orders";
import { saveOrderConfirmation } from "../lib/order-confirmation";
import type { ProductId } from "../lib/products";

const siteConfig = defaultLawFirmSiteConfig;
const FIRM = siteConfig.firm;
const NAV_LINKS = siteConfig.navLinks;
const STATS = siteConfig.stats;
const TRUST_ITEMS = siteConfig.trustItems;
const PRACTICE_AREAS = siteConfig.practiceAreas;
const ADVANTAGES = siteConfig.advantages;
const PROCESS_STEPS = siteConfig.processSteps;
const TEAM = siteConfig.team;
const TESTIMONIALS = siteConfig.testimonials;
const FAQS = siteConfig.faqs;
const BLOG_POSTS = siteConfig.blogPosts;
const SERVICES_LIST = siteConfig.servicesList;

/* ═══════════════════════════════════════════════════════════════════════════
   SVG ICONS
   ══════════════════════════════════════════════════════════════════════════ */

function IcoCorporate({ c }: { c?: string }) {
  return (
    <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zm-8-2V3m0 0H9m3 0h3" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 14h.01M12 14h.01M16 14h.01" />
    </svg>
  );
}

function IcoHome({ c }: { c?: string }) {
  return (
    <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}

function IcoFamily({ c }: { c?: string }) {
  return (
    <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function IcoCriminal({ c }: { c?: string }) {
  return (
    <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  );
}

function IcoLabor({ c }: { c?: string }) {
  return (
    <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function IcoGlobe({ c }: { c?: string }) {
  return (
    <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
    </svg>
  );
}

function IcoIP({ c }: { c?: string }) {
  return (
    <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  );
}

function IcoImmigration({ c }: { c?: string }) {
  return (
    <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
    </svg>
  );
}

function IcoCheck({ c }: { c?: string }) {
  return (
    <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function IcoStar({ c }: { c?: string }) {
  return (
    <svg className={c} viewBox="0 0 20 20" fill="currentColor">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

function IcoPhone({ c }: { c?: string }) {
  return (
    <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
    </svg>
  );
}

function IcoMail({ c }: { c?: string }) {
  return (
    <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  );
}

function IcoLocation({ c }: { c?: string }) {
  return (
    <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  );
}

function IcoWhatsApp({ c }: { c?: string }) {
  return (
    <svg className={c} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.122.555 4.113 1.524 5.843L.057 23.57l5.902-1.448A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.032-1.384l-.36-.214-3.724.916.947-3.624-.235-.372A9.819 9.819 0 012.182 12c0-5.425 4.393-9.818 9.818-9.818 5.426 0 9.818 4.393 9.818 9.818 0 5.426-4.392 9.818-9.818 9.818z" />
    </svg>
  );
}

function IcoMenu({ c }: { c?: string }) {
  return (
    <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function IcoClose({ c }: { c?: string }) {
  return (
    <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function IcoArrowLeft({ c }: { c?: string }) {
  return (
    <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  );
}

function IcoQuote({ c }: { c?: string }) {
  return (
    <svg className={c} viewBox="0 0 24 24" fill="currentColor">
      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
    </svg>
  );
}

function IcoChevronDown({ c }: { c?: string }) {
  return (
    <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function getAreaIcon(id: string) {
  const cls = "w-7 h-7";
  switch (id) {
    case "corporate": return <IcoCorporate c={cls} />;
    case "realestate": return <IcoHome c={cls} />;
    case "family": return <IcoFamily c={cls} />;
    case "criminal": return <IcoCriminal c={cls} />;
    case "labor": return <IcoLabor c={cls} />;
    case "arbitration": return <IcoGlobe c={cls} />;
    case "ip": return <IcoIP c={cls} />;
    case "immigration": return <IcoImmigration c={cls} />;
    default: return <IcoCorporate c={cls} />;
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   FLOATING WHATSAPP BUTTON
   ══════════════════════════════════════════════════════════════════════════ */
function WhatsAppFloat() {
  return (
    <a
      href={`https://wa.me/${FIRM.whatsapp}?text=${encodeURIComponent('مرحبا! بويا شوب سترد على جميع أسئلتك. كيف يمكنني أساعدك؟')}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 start-6 z-50 flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-2xl px-4 py-3 transition-all duration-300 hover:scale-105 group"
      aria-label="تواصل عبر واتساب"
    >
      <IcoWhatsApp c="w-6 h-6 flex-shrink-0" />
      <span className="font-semibold text-sm whitespace-nowrap hidden sm:inline">استشارة عبر واتساب</span>
    </a>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   NAVBAR
   ══════════════════════════════════════════════════════════════════════════ */
function Navbar({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) {
  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-[#0C1B33]/95 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="#hero" className="flex-shrink-0 group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#D4A017] flex items-center justify-center flex-shrink-0">
                <span className="text-[#0C1B33] font-heading font-black text-lg">{FIRM.logoInitial}</span>
              </div>
              <div className="hidden sm:block">
                <p className="text-white font-heading font-bold text-base leading-tight group-hover:text-[#D4A017] transition-colors">
                  {FIRM.nameShort}
                </p>
                <p className="text-white/40 text-xs">للمحاماة والاستشارات القانونية</p>
              </div>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-white/70 hover:text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-white/5 transition-all duration-200"
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* CTA + Mobile */}
          <div className="flex items-center gap-3">
            <a
              href="#contact"
              className="hidden sm:inline-flex items-center gap-2 bg-[#D4A017] hover:bg-[#B8860B] text-[#0C1B33] font-bold text-sm px-5 py-2.5 rounded-lg transition-all duration-200 hover:shadow-lg"
            >
              استشارة مجانية
            </a>
            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden p-2 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              aria-label="القائمة"
            >
              {open ? <IcoClose c="w-6 h-6" /> : <IcoMenu c="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="lg:hidden bg-[#0C1B33] border-t border-white/10 px-4 py-4 space-y-1">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block text-white/80 hover:text-white px-4 py-3 rounded-lg hover:bg-white/5 transition-colors font-medium"
            >
              {l.label}
            </a>
          ))}
          <div className="pt-3">
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="block text-center bg-[#D4A017] text-[#0C1B33] font-bold px-5 py-3 rounded-lg"
            >
              احجز استشارة مجانية
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   HERO
   ══════════════════════════════════════════════════════════════════════════ */
function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-20"
      style={{ background: "linear-gradient(135deg, #060f1e 0%, #0C1B33 45%, #122840 100%)" }}
    >
      {/* Geometric decorative lines */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(212,160,23,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(212,160,23,0.3) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />
      {/* Gold gradient orb */}
      <div className="absolute top-1/4 end-1/4 w-96 h-96 rounded-full bg-[#D4A017]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 start-1/4 w-64 h-64 rounded-full bg-[#13294B]/60 blur-2xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="max-w-4xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#D4A017]/15 border border-[#D4A017]/30 text-[#D4A017] text-sm font-medium px-4 py-2 rounded-full mb-8">
            <span className="w-2 h-2 rounded-full bg-[#D4A017] animate-pulse" />
            {FIRM.brandCharacter} · منذ {FIRM.established}
          </div>

          {/* Headline */}
          <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight mb-6">
            حقوقك تستحق{" "}
            <span className="text-[#D4A017] block sm:inline">أفضل دفاع</span>
          </h1>

          {/* Sub */}
          <p className="text-white/60 text-lg sm:text-xl leading-relaxed mb-10 max-w-2xl">
            نحن مكتب{" "}
            <span className="text-white font-semibold">{FIRM.nameShort}</span> — فريق من كبار المحامين
            الإماراتيين يقدم استشارات قانونية متخصصة وتمثيلاً احترافياً أمام جميع المحاكم والهيئات في
            الإمارات العربية المتحدة.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 mb-16">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 bg-[#D4A017] hover:bg-[#B8860B] text-[#0C1B33] font-black text-base px-8 py-4 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg shadow-[#D4A017]/25"
            >
              احجز استشارة مجانية
            </a>
            <a
              href={`https://wa.me/${FIRM.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white border border-white/20 font-semibold text-base px-8 py-4 rounded-xl transition-all duration-200"
            >
              <IcoWhatsApp c="w-5 h-5" />
              تواصل الآن
            </a>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {STATS.map((s) => (
              <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="font-heading text-3xl font-black text-[#D4A017] mb-1">{s.number}</div>
                <div className="text-white/50 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 start-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
        <span className="text-white/60 text-xs">اكتشف المزيد</span>
        <div className="w-5 h-8 border-2 border-white/30 rounded-full flex items-start justify-center pt-1.5">
          <div className="w-1 h-2 bg-white/60 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   AWARDS / TRUST BAR
   ══════════════════════════════════════════════════════════════════════════ */
function TrustBar() {
  return (
    <div className="bg-[#D4A017] overflow-hidden py-4">
      <div className="flex items-center gap-12 animate-none">
        <div className="flex items-center gap-12 whitespace-nowrap px-8">
          {TRUST_ITEMS.map((item, i) => (
            <div key={i} className="flex items-center gap-3 text-[#0C1B33] flex-shrink-0">
              <IcoCheck c="w-4 h-4 flex-shrink-0" />
              <span className="font-semibold text-sm">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PRACTICE AREAS
   ══════════════════════════════════════════════════════════════════════════ */
function PracticeAreas() {
  return (
    <section id="services" className="py-24 bg-[#F8F7F4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-[#D4A017] font-semibold text-sm tracking-widest uppercase mb-3">
            تخصصاتنا القانونية
          </span>
          <h2 className="font-heading text-4xl lg:text-5xl font-black text-[#0C1B33] mb-4">
            نغطي كامل احتياجاتك القانونية
          </h2>
          <p className="text-[#0C1B33]/60 text-lg max-w-2xl mx-auto">
            فريقنا المتخصص يضم محامين معتمدين في جميع فروع القانون الإماراتي، مستعدين لخدمتك في كل مرحلة.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRACTICE_AREAS.map((area) => (
            <div
              key={area.id}
              className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-[#D4A017]/20 cursor-pointer"
            >
              <div className="w-14 h-14 rounded-xl bg-[#0C1B33]/5 group-hover:bg-[#D4A017]/10 flex items-center justify-center mb-5 transition-colors duration-300 text-[#0C1B33] group-hover:text-[#D4A017]">
                {getAreaIcon(area.id)}
              </div>
              <h3 className="font-heading font-bold text-[#0C1B33] text-base mb-2 leading-snug">
                {area.title}
              </h3>
              <p className="text-[#0C1B33]/55 text-sm leading-relaxed">{area.desc}</p>
              <div className="mt-4 flex items-center gap-1 text-[#D4A017] text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span>اعرف أكثر</span>
                <IcoArrowLeft c="w-3.5 h-3.5 rotate-180" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ABOUT SECTION
   ══════════════════════════════════════════════════════════════════════════ */
function About() {
  return (
    <section id="about" className="py-24 bg-[#0C1B33]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <div>
            <span className="inline-block text-[#D4A017] font-semibold text-sm tracking-widest uppercase mb-4">
              من نحن
            </span>
            <h2 className="font-heading text-4xl lg:text-5xl font-black text-white mb-6 leading-tight">
              ٢٥ عاماً من الدفاع عن حقوقك
            </h2>
            <div className="w-16 h-1 bg-[#D4A017] rounded mb-8" />
            <p className="text-white/65 text-lg leading-loose mb-6">
              تأسس{" "}
              <span className="text-white font-semibold">{FIRM.nameShort}</span> عام {FIRM.established} برؤية
              واضحة: تقديم خدمة قانونية من الطراز الأول تجمع بين العمق المحلي والمعايير الدولية. بدأنا بفريق
              صغير من المحامين الشباب واليوم نضم أكثر من ١٥ محامياً متخصصاً يخدمون مئات العملاء من الأفراد
              والشركات والمستثمرين الدوليين.
            </p>
            <p className="text-white/65 text-lg leading-loose mb-10">
              نؤمن بأن العدالة لا تُباع ولا تُشترى، لكنها تُكسب بالكفاءة والإصرار. لهذا نبني كل قضية على
              تحليل دقيق، استراتيجية مدروسة، وتواصل صادق مع عميلنا في كل خطوة.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 bg-[#D4A017] hover:bg-[#B8860B] text-[#0C1B33] font-bold px-7 py-3.5 rounded-xl transition-colors"
              >
                تحدث معنا اليوم
              </a>
              <a
                href="#team"
                className="inline-flex items-center gap-2 border border-white/20 hover:border-[#D4A017]/50 text-white/80 hover:text-white font-semibold px-7 py-3.5 rounded-xl transition-all"
              >
                تعرف على فريقنا
              </a>
            </div>
          </div>

          {/* Visual panel */}
          <div className="relative">
            {/* Main card */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 relative z-10">
              <div className="grid grid-cols-2 gap-6 mb-8">
                {STATS.map((s) => (
                  <div key={s.label} className="text-center p-4 bg-white/5 rounded-xl">
                    <div className="font-heading text-3xl font-black text-[#D4A017] mb-1">{s.number}</div>
                    <div className="text-white/50 text-sm">{s.label}</div>
                  </div>
                ))}
              </div>
              {/* Services list */}
              <div className="space-y-3">
                <p className="text-white/40 text-xs uppercase tracking-widest mb-4">تخصصاتنا الرئيسية</p>
                {SERVICES_LIST.map((s) => (
                  <div key={s} className="flex items-center gap-3 text-white/70">
                    <IcoCheck c="w-4 h-4 text-[#D4A017] flex-shrink-0" />
                    <span className="text-sm">{s}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Decorative corner */}
            <div className="absolute -top-4 -end-4 w-32 h-32 border-2 border-[#D4A017]/30 rounded-2xl pointer-events-none" />
            <div className="absolute -bottom-4 -start-4 w-20 h-20 bg-[#D4A017]/10 rounded-xl pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   WHY CHOOSE US
   ══════════════════════════════════════════════════════════════════════════ */
function Advantages() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block text-[#D4A017] font-semibold text-sm tracking-widest uppercase mb-3">
            لماذا نحن
          </span>
          <h2 className="font-heading text-4xl lg:text-5xl font-black text-[#0C1B33] mb-4">
            ما يجعلنا الاختيار الأفضل
          </h2>
          <p className="text-[#0C1B33]/55 text-lg max-w-2xl mx-auto">
            ليس مجرد مكتب محاماة — نحن شركاء قانونيون حقيقيون يعملون على تحقيق مصلحتك في كل لحظة.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ADVANTAGES.map((adv, i) => (
            <div key={i} className="group relative bg-[#F8F7F4] hover:bg-[#0C1B33] rounded-2xl p-8 transition-all duration-300 hover:shadow-2xl">
              <div className="w-12 h-12 rounded-xl bg-[#D4A017]/15 group-hover:bg-[#D4A017] flex items-center justify-center mb-5 transition-colors duration-300">
                <IcoCheck c="w-5 h-5 text-[#D4A017] group-hover:text-[#0C1B33]" />
              </div>
              <div className="absolute top-6 end-6 font-heading text-5xl font-black text-[#0C1B33]/5 group-hover:text-white/5 pointer-events-none leading-none">
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="font-heading font-bold text-xl text-[#0C1B33] group-hover:text-white mb-3 transition-colors duration-300">
                {adv.title}
              </h3>
              <p className="text-[#0C1B33]/60 group-hover:text-white/60 text-sm leading-relaxed transition-colors duration-300">
                {adv.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PROCESS STEPS
   ══════════════════════════════════════════════════════════════════════════ */
function Process() {
  return (
    <section className="py-24 bg-[#F8F7F4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block text-[#D4A017] font-semibold text-sm tracking-widest uppercase mb-3">
            كيف نعمل
          </span>
          <h2 className="font-heading text-4xl lg:text-5xl font-black text-[#0C1B33] mb-4">
            أربع خطوات نحو حل قضيتك
          </h2>
          <p className="text-[#0C1B33]/55 text-lg max-w-2xl mx-auto">
            عملية واضحة وشفافة من اللحظة الأولى حتى الحسم النهائي لقضيتك.
          </p>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-16 inset-x-[10%] h-0.5 bg-[#D4A017]/20 z-0" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {PROCESS_STEPS.map((step, i) => (
              <div key={step.number} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#0C1B33] text-[#D4A017] font-heading font-black text-xl mb-6 shadow-lg ring-4 ring-[#F8F7F4]">
                  {step.number}
                </div>
                <h3 className="font-heading font-bold text-lg text-[#0C1B33] mb-3">{step.title}</h3>
                <p className="text-[#0C1B33]/55 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-14">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 bg-[#0C1B33] hover:bg-[#122840] text-white font-bold px-8 py-4 rounded-xl transition-colors shadow-lg"
          >
            ابدأ رحلتك القانونية الآن
          </a>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TEAM
   ══════════════════════════════════════════════════════════════════════════ */
function Team() {
  return (
    <section id="team" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block text-[#D4A017] font-semibold text-sm tracking-widest uppercase mb-3">
            فريقنا القانوني
          </span>
          <h2 className="font-heading text-4xl lg:text-5xl font-black text-[#0C1B33] mb-4">
            تعرّف على محاميك
          </h2>
          <p className="text-[#0C1B33]/55 text-lg max-w-2xl mx-auto">
            خبراء قانونيون يجمعون بين الكفاءة الأكاديمية والخبرة العملية العميقة في منظومة القضاء الإماراتي.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TEAM.map((member) => (
            <div
              key={member.name}
              className="group bg-[#F8F7F4] rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              {/* Avatar placeholder */}
              <div className="h-64 bg-gradient-to-br from-[#0C1B33] to-[#13294B] flex items-center justify-center relative overflow-hidden">
                <div className="w-28 h-28 rounded-full bg-[#D4A017]/20 border-4 border-[#D4A017]/40 flex items-center justify-center">
                  <span className="font-heading text-3xl font-black text-[#D4A017]">{member.initials}</span>
                </div>
                {/* Decorative */}
                <div className="absolute -bottom-6 -end-6 w-24 h-24 rounded-full bg-[#D4A017]/10" />
              </div>
              {/* Content */}
              <div className="p-7">
                <h3 className="font-heading font-bold text-[#0C1B33] text-xl mb-1">{member.name}</h3>
                <p className="text-[#D4A017] font-semibold text-sm mb-3">{member.role}</p>
                <div className="flex items-center gap-2 text-[#0C1B33]/50 text-sm mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4A017]" />
                  {member.specialty}
                </div>
                <div className="flex items-center gap-2 text-[#0C1B33]/50 text-sm mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0C1B33]/30" />
                  {member.exp}
                </div>
                <div className="flex items-center gap-2 text-[#0C1B33]/50 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0C1B33]/30" />
                  {member.edu}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TESTIMONIALS
   ══════════════════════════════════════════════════════════════════════════ */
function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-[#0C1B33]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block text-[#D4A017] font-semibold text-sm tracking-widest uppercase mb-3">
            آراء العملاء
          </span>
          <h2 className="font-heading text-4xl lg:text-5xl font-black text-white mb-4">
            ماذا يقول عملاؤنا؟
          </h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            أكثر من ٥٠٠٠ عميل وثقوا بنا — اقرأ بعض قصصهم.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="bg-white/5 border border-white/10 rounded-2xl p-8 relative hover:border-[#D4A017]/30 transition-colors"
            >
              {/* Quote icon */}
              <IcoQuote c="w-10 h-10 text-[#D4A017]/30 mb-6" />
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <IcoStar key={j} c="w-4 h-4 text-[#D4A017]" />
                ))}
              </div>
              <p className="text-white/75 text-base leading-loose mb-8 italic">{t.text}</p>
              <div className="flex items-center gap-3 border-t border-white/10 pt-6">
                <div className="w-10 h-10 rounded-full bg-[#D4A017]/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-[#D4A017] font-bold text-sm">{t.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{t.name}</p>
                  <p className="text-white/40 text-xs">
                    {t.role} · {t.city}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Google Rating */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-14 bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <IcoStar key={i} c="w-6 h-6 text-[#D4A017]" />
            ))}
          </div>
          <div className="text-white text-center sm:text-right">
            <span className="font-bold text-2xl">٤.٩ / ٥</span>
            <span className="text-white/50 text-sm mr-2">· بناءً على ٣٨٠+ تقييم على Google</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   FAQ
   ══════════════════════════════════════════════════════════════════════════ */
function Faq({ openIdx, setOpenIdx }: { openIdx: number | null; setOpenIdx: (n: number | null) => void }) {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block text-[#D4A017] font-semibold text-sm tracking-widest uppercase mb-3">
            الأسئلة الشائعة
          </span>
          <h2 className="font-heading text-4xl lg:text-5xl font-black text-[#0C1B33] mb-4">
            إجابات على أهم أسئلتك
          </h2>
          <p className="text-[#0C1B33]/55 text-lg">
            لم تجد إجابتك؟{" "}
            <a href="#contact" className="text-[#D4A017] hover:underline font-semibold">
              تواصل معنا مباشرة
            </a>
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className="bg-[#F8F7F4] rounded-xl border border-transparent hover:border-[#D4A017]/20 transition-all overflow-hidden"
            >
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 p-6 text-right"
              >
                <span className="font-heading font-bold text-[#0C1B33] text-base leading-snug">{faq.q}</span>
                <IcoChevronDown
                  c={`w-5 h-5 text-[#D4A017] flex-shrink-0 transition-transform duration-300 ${openIdx === i ? "rotate-180" : ""}`}
                />
              </button>
              {openIdx === i && (
                <div className="px-6 pb-6">
                  <div className="w-full h-px bg-[#0C1B33]/10 mb-5" />
                  <p className="text-[#0C1B33]/65 leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   BLOG / ARTICLES
   ══════════════════════════════════════════════════════════════════════════ */
function Blog() {
  return (
    <section className="py-24 bg-[#F8F7F4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-16">
          <div>
            <span className="inline-block text-[#D4A017] font-semibold text-sm tracking-widest uppercase mb-3">
              المدونة القانونية
            </span>
            <h2 className="font-heading text-4xl lg:text-5xl font-black text-[#0C1B33]">
              مقالات ونصائح قانونية
            </h2>
          </div>
          <a
            href="#"
            className="inline-flex items-center gap-2 text-[#D4A017] font-semibold hover:gap-3 transition-all flex-shrink-0"
          >
            جميع المقالات
            <IcoArrowLeft c="w-4 h-4 rotate-180" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post, i) => (
            <article
              key={i}
              className="group bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              {/* Image placeholder */}
              <div className="h-48 bg-gradient-to-br from-[#0C1B33] to-[#13294B] flex items-center justify-center relative overflow-hidden">
                <div className="text-white/10 font-heading text-7xl font-black absolute">
                  {i + 1}
                </div>
                <span className="relative z-10 bg-[#D4A017] text-[#0C1B33] font-bold text-xs px-3 py-1.5 rounded-full">
                  {post.category}
                </span>
              </div>
              <div className="p-7">
                <p className="text-[#0C1B33]/40 text-xs mb-3">{post.date}</p>
                <h3 className="font-heading font-bold text-[#0C1B33] text-lg leading-snug mb-3 group-hover:text-[#D4A017] transition-colors">
                  {post.title}
                </h3>
                <p className="text-[#0C1B33]/55 text-sm leading-relaxed mb-5">{post.excerpt}</p>
                <div className="flex items-center gap-1 text-[#D4A017] font-semibold text-sm">
                  اقرأ المقال
                  <IcoArrowLeft c="w-3.5 h-3.5 rotate-180 group-hover:translate-x-[-3px] transition-transform" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   CONTACT
   ══════════════════════════════════════════════════════════════════════════ */
type FormData = { name: string; phone: string; service: string; message: string };

const LAW_LEAD_PRODUCT_ID: ProductId = "garden-sprinkler";

function buildLawLeadName(service: string) {
  const serviceLabel = service?.trim() ? ` - ${service.trim()}` : "";
  return `Law Consultation${serviceLabel}`;
}

function Contact({
  formData,
  setFormData,
  submitted,
  setSubmitted,
}: {
  formData: FormData;
  setFormData: (d: FormData) => void;
  submitted: boolean;
  setSubmitted: (v: boolean) => void;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (submitting) return;

    setSubmitting(true);
    setSubmitError("");

    try {
      const leadItem = {
        id: LAW_LEAD_PRODUCT_ID,
        lineKey: `${LAW_LEAD_PRODUCT_ID}-1`,
        name: buildLawLeadName(formData.service),
        offer: 1 as const,
        quantity: 1,
        price: 0,
      };

      const eventId = `law-${Date.now()}`;

      const result = await submitOrder({
        eventId,
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        items: [leadItem],
        total: 0,
      });

      saveOrderConfirmation({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        items: [leadItem],
        total: 0,
        eventId,
        orderId: result.id,
        publicOrderId: result.public_order_id,
      });

      setSubmitted(true);
      await router.push("/thank-you");
    } catch {
      setSubmitError("تعذر إرسال الطلب حالياً. حاول مرة أخرى بعد قليل.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="contact" className="py-24 bg-[#0C1B33]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Info */}
          <div>
            <span className="inline-block text-[#D4A017] font-semibold text-sm tracking-widest uppercase mb-4">
              تواصل معنا
            </span>
            <h2 className="font-heading text-4xl lg:text-5xl font-black text-white mb-6 leading-tight">
              احجز استشارتك المجانية الآن
            </h2>
            <p className="text-white/55 text-lg leading-loose mb-10">
              لا تواجه تحديات قانونية بمفردك. فريقنا جاهز للاستماع إليك وتقديم تقييم دقيق لوضعك، بدون أي
              التزام مالي.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#D4A017]/15 flex items-center justify-center flex-shrink-0">
                  <IcoPhone c="w-5 h-5 text-[#D4A017]" />
                </div>
                <div>
                  <p className="text-white/40 text-sm mb-1">الهاتف</p>
                  <a href={`tel:${FIRM.phone}`} className="text-white font-semibold hover:text-[#D4A017] transition-colors text-lg" dir="ltr">
                    {FIRM.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#D4A017]/15 flex items-center justify-center flex-shrink-0">
                  <IcoWhatsApp c="w-5 h-5 text-[#D4A017]" />
                </div>
                <div>
                  <p className="text-white/40 text-sm mb-1">واتساب</p>
                  <a
                    href={`https://wa.me/${FIRM.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white font-semibold hover:text-[#D4A017] transition-colors text-lg"
                  >
                    متاح على مدار الساعة
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#D4A017]/15 flex items-center justify-center flex-shrink-0">
                  <IcoMail c="w-5 h-5 text-[#D4A017]" />
                </div>
                <div>
                  <p className="text-white/40 text-sm mb-1">البريد الإلكتروني</p>
                  <a href={`mailto:${FIRM.email}`} className="text-white font-semibold hover:text-[#D4A017] transition-colors">
                    {FIRM.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#D4A017]/15 flex items-center justify-center flex-shrink-0">
                  <IcoLocation c="w-5 h-5 text-[#D4A017]" />
                </div>
                <div>
                  <p className="text-white/40 text-sm mb-1">العنوان</p>
                  <p className="text-white font-semibold">{FIRM.address}</p>
                </div>
              </div>
            </div>

            {/* Working hours */}
            <div className="mt-10 bg-white/5 border border-white/10 rounded-xl p-6">
              <p className="text-[#D4A017] font-semibold text-sm uppercase tracking-wider mb-4">ساعات العمل</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-white/70">
                  <span>الأحد — الخميس</span>
                  <span dir="ltr">9:00 ص — 6:00 م</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>السبت</span>
                  <span dir="ltr">10:00 ص — 2:00 م</span>
                </div>
                <div className="flex justify-between text-white/40">
                  <span>الجمعة</span>
                  <span>مغلق (واتساب متاح)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl p-8 lg:p-10">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
                  <IcoCheck c="w-10 h-10 text-green-600" />
                </div>
                <h3 className="font-heading font-black text-2xl text-[#0C1B33] mb-3">
                  تم استلام طلبك!
                </h3>
                <p className="text-[#0C1B33]/60 leading-relaxed">
                  سيتواصل معك أحد مساعدينا القانونيين خلال ساعة واحدة لتأكيد موعد استشارتك المجانية.
                </p>
              </div>
            ) : (
              <>
                <h3 className="font-heading font-black text-2xl text-[#0C1B33] mb-2">
                  احجز استشارتك المجانية
                </h3>
                <p className="text-[#0C1B33]/50 text-sm mb-8">
                  يُرجى ملء النموذج وسنتواصل معك خلال ساعة واحدة
                </p>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-[#0C1B33]/70 text-sm font-semibold mb-2">الاسم الكامل *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="محمد أحمد الكعبي"
                      className="w-full bg-[#F8F7F4] border border-[#0C1B33]/10 focus:border-[#D4A017] focus:ring-2 focus:ring-[#D4A017]/20 rounded-xl px-4 py-3.5 text-[#0C1B33] placeholder-[#0C1B33]/30 outline-none transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[#0C1B33]/70 text-sm font-semibold mb-2">رقم الهاتف *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="+971 50 XXX XXXX"
                      dir="ltr"
                      className="w-full bg-[#F8F7F4] border border-[#0C1B33]/10 focus:border-[#D4A017] focus:ring-2 focus:ring-[#D4A017]/20 rounded-xl px-4 py-3.5 text-[#0C1B33] placeholder-[#0C1B33]/30 outline-none transition-all text-sm text-right"
                    />
                  </div>
                  <div>
                    <label className="block text-[#0C1B33]/70 text-sm font-semibold mb-2">نوع القضية / الخدمة</label>
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="w-full bg-[#F8F7F4] border border-[#0C1B33]/10 focus:border-[#D4A017] focus:ring-2 focus:ring-[#D4A017]/20 rounded-xl px-4 py-3.5 text-[#0C1B33] outline-none transition-all text-sm appearance-none"
                    >
                      <option value="">اختر التخصص القانوني...</option>
                      {SERVICES_LIST.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                      <option value="other">أخرى</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[#0C1B33]/70 text-sm font-semibold mb-2">وصف مختصر لموضوعك</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      placeholder="اشرح موضوعك القانوني باختصار وسنساعدك في تحديد الخطوات التالية..."
                      className="w-full bg-[#F8F7F4] border border-[#0C1B33]/10 focus:border-[#D4A017] focus:ring-2 focus:ring-[#D4A017]/20 rounded-xl px-4 py-3.5 text-[#0C1B33] placeholder-[#0C1B33]/30 outline-none transition-all text-sm resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#D4A017] hover:bg-[#B8860B] text-[#0C1B33] font-black text-base py-4 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-[#D4A017]/25 hover:scale-[1.01] disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {submitting ? "جاري الإرسال..." : "احجز استشارتك المجانية الآن"}
                  </button>
                  {submitError && <p className="text-red-300 text-sm text-center">{submitError}</p>}
                  <p className="text-[#0C1B33]/35 text-xs text-center">
                    بإرسال هذا النموذج توافق على سياسة الخصوصية. معلوماتك سرية تماماً.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   FOOTER
   ══════════════════════════════════════════════════════════════════════════ */
function Footer() {
  return (
    <footer className="bg-[#060f1e] text-white">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-lg bg-[#D4A017] flex items-center justify-center flex-shrink-0">
                <span className="text-[#0C1B33] font-heading font-black text-lg">{FIRM.logoInitial}</span>
              </div>
              <div>
                <p className="text-white font-heading font-bold">{FIRM.nameShort}</p>
                <p className="text-white/30 text-xs">منذ {FIRM.established}</p>
              </div>
            </div>
            <p className="text-white/45 text-sm leading-relaxed mb-6">
              مكتب محاماة وطني رائد في الإمارات، نقدم خدمات قانونية متميزة للأفراد والشركات والمستثمرين
              الدوليين.
            </p>
            {/* Social */}
            <div className="flex gap-3">
              {["ف", "ت", "إ", "ي"].map((s, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-lg bg-white/5 hover:bg-[#D4A017] hover:text-[#0C1B33] flex items-center justify-center text-white/50 font-bold text-sm transition-all"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-heading font-bold text-white mb-5 text-base">خدماتنا القانونية</h4>
            <ul className="space-y-3">
              {SERVICES_LIST.map((s) => (
                <li key={s}>
                  <a href="#services" className="text-white/45 hover:text-[#D4A017] text-sm transition-colors flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-[#D4A017]/40 flex-shrink-0" />
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-bold text-white mb-5 text-base">روابط سريعة</h4>
            <ul className="space-y-3">
              {[
                { label: "الرئيسية", href: "#hero" },
                { label: "من نحن", href: "#about" },
                { label: "فريقنا القانوني", href: "#team" },
                { label: "آراء العملاء", href: "#testimonials" },
                { label: "المدونة القانونية", href: "#" },
                { label: "سياسة الخصوصية", href: "#" },
                { label: "تواصل معنا", href: "#contact" },
              ].map((l) => (
                <li key={l.href + l.label}>
                  <a href={l.href} className="text-white/45 hover:text-[#D4A017] text-sm transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-bold text-white mb-5 text-base">تواصل معنا</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <IcoLocation c="w-4 h-4 text-[#D4A017] mt-0.5 flex-shrink-0" />
                <p className="text-white/45 text-sm">{FIRM.address}</p>
              </div>
              <div className="flex items-center gap-3">
                <IcoPhone c="w-4 h-4 text-[#D4A017] flex-shrink-0" />
                <a href={`tel:${FIRM.phone}`} className="text-white/45 hover:text-[#D4A017] text-sm transition-colors" dir="ltr">
                  {FIRM.phone}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <IcoMail c="w-4 h-4 text-[#D4A017] flex-shrink-0" />
                <a href={`mailto:${FIRM.email}`} className="text-white/45 hover:text-[#D4A017] text-sm transition-colors">
                  {FIRM.email}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <IcoWhatsApp c="w-4 h-4 text-[#D4A017] flex-shrink-0" />
                <a
                  href={`https://wa.me/${FIRM.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/45 hover:text-[#D4A017] text-sm transition-colors"
                >
                  واتساب — متاح ٢٤/٧
                </a>
              </div>
            </div>
            {/* CTA */}
            <a
              href="#contact"
              className="mt-6 block text-center bg-[#D4A017] hover:bg-[#B8860B] text-[#0C1B33] font-bold text-sm px-5 py-3 rounded-xl transition-colors"
            >
              احجز استشارة مجانية
            </a>
          </div>
        </div>
      </div>

      {/* Gold divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#D4A017]/30 to-transparent" />

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-white/30 text-xs">
        <p>
          © {new Date().getFullYear()} {FIRM.name}. جميع الحقوق محفوظة.
        </p>
        <p>
          مرخص من وزارة العدل الإماراتية · رقم الترخيص: XXXX-YYYY
        </p>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE
   ══════════════════════════════════════════════════════════════════════════ */
export default function LawFirmTemplate() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    service: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  return (
    <>
      <Head>
        <title>{FIRM.name} | أفضل مكتب محاماة في دبي والإمارات</title>
        <meta
          name="description"
          content={`${FIRM.name} — مكتب محاماة واستشارات قانونية رائد في الإمارات العربية المتحدة منذ ${FIRM.established}. خبرة في قانون الشركات، العقارات، الأسرة، والتحكيم الدولي. استشارة أولى مجانية.`}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={`${FIRM.name} | أفضل مكتب محاماة في دبي`} />
        <meta property="og:description" content="خبرة قانونية إماراتية عميقة. استشارة أولى مجانية. نحمي حقوقك ونصنع العدالة." />
        <meta name="robots" content="index, follow" />
      </Head>

      <WhatsAppFloat />
      <Navbar open={menuOpen} setOpen={setMenuOpen} />

      <main dir="rtl">
        <Hero />
        <TrustBar />
        <PracticeAreas />
        <About />
        <Advantages />
        <Process />
        <Team />
        <Testimonials />
        <Faq openIdx={openFaq} setOpenIdx={setOpenFaq} />
        <Blog />
        <Contact
          formData={formData}
          setFormData={setFormData}
          submitted={submitted}
          setSubmitted={setSubmitted}
        />
      </main>

      <Footer />
    </>
  );
}
