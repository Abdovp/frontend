import Icon from '../ui/Icon';
import { CURRENCY, getFirstOffer, WARRANTY_DAYS, type Product } from '../../lib/products';

const GUARANTEES = [
  { icon: 'wallet' as const, title: 'Ø§Ù„Ø¯ÙØ¹ Ø¹Ù†Ø¯ Ø§Ù„Ø§Ø³ØªÙ„Ø§Ù…', subtitle: 'ØªØ®Ù„Ù‘Øµ Ù…Ù„ÙŠ ØªÙˆØµÙ„Ùƒ Ø§Ù„Ø³Ù„Ø¹Ø©' },
  { icon: 'truck' as const, title: 'ØªÙˆØµÙŠÙ„ 24â€“48 Ø³Ø§Ø¹Ø©', subtitle: 'Ù„ÙƒÙ„ Ù…Ø¯Ù† Ø§Ù„Ù…ØºØ±Ø¨' },
  { icon: 'refresh' as const, title: `Ø¶Ù…Ø§Ù† ${WARRANTY_DAYS} ÙŠÙˆÙ…`, subtitle: 'ÙÙ„ÙˆØ³Ùƒ Ø±Ø§Ø¬Ø¹Ø© Ø¨Ù„Ø§ Ø£Ø³Ø¦Ù„Ø©' },
  { icon: 'whatsapp' as const, title: 'Ø¯Ø¹Ù… Ø¨Ø§Ù„Ø¯Ø§Ø±Ø¬Ø©', subtitle: 'ÙØ±ÙŠÙ‚ Ù…ØºØ±Ø¨ÙŠ Ù‚Ø¨Ù„ ÙˆØ¨Ø¹Ø¯ Ø§Ù„Ø·Ù„Ø¨' },
];

export default function CarChargerFinalCTA({ product }: { product: Product }) {
  const offer = getFirstOffer(product);

  return (
    <section className="relative overflow-hidden bg-[#111827] py-14 md:py-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="absolute -bottom-24 left-1/2 h-80 w-[520px] -translate-x-1/2 rounded-full bg-[#1663D6]/25 blur-[120px]" />
      </div>

      <div className="container-wide relative">
        <div dir="rtl" className="mb-12 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-6">
          {GUARANTEES.map((g) => (
            <div
              key={g.title}
              className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/5 p-4"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EAF2FF] text-[#1663D6]">
                <Icon name={g.icon} size={20} />
              </span>
              <div className="min-w-0">
                <p className="truncate font-heading text-sm font-extrabold text-white">{g.title}</p>
                <p className="truncate text-xs text-white/70">{g.subtitle}</p>
              </div>
            </div>
          ))}
        </div>

        <div
          dir="rtl"
          className="relative overflow-hidden rounded-[2rem] border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-[#1663D6]/20 p-8 text-center md:p-14"
        >
          <h2 className="mb-3 font-heading text-2xl font-extrabold text-white sm:text-3xl md:text-4xl">
            Ø¬Ø§Ù‡Ø² ØªØ®Ù„Ù‘Øµ Ù…Ù† Ø§Ù„Ø®ÙŠÙˆØ· Ø§Ù„Ù…Ø´Ø§Ø¨ÙƒØ© Ù†Ù‡Ø§Ø¦ÙŠØ§Ù‹ØŸ
          </h2>
          <p className="mx-auto mb-7 max-w-xl text-base text-white/80 md:text-lg">
            Ø´Ø§Ø­Ù† 120W Ø°ÙƒÙŠØŒ ÙƒØ§Ø¨Ù„Ø§Øª Ù‚Ø§Ø¨Ù„Ø© Ù„Ù„Ø³Ø­Ø¨ØŒ ÙˆØ´Ø§Ø´Ø© Ù…Ø±Ø§Ù‚Ø¨Ø© Ø±Ù‚Ù…ÙŠØ© â€” ÙƒÙ„ Ù‡Ø°Ø§ Ø¨Ù€ {offer.price} {CURRENCY} ÙÙ‚Ø· Ù…Ø¹ Ø¯ÙØ¹ Ø¹Ù†Ø¯ Ø§Ù„Ø§Ø³ØªÙ„Ø§Ù….
          </p>
          <a
            href="#cc-pricing"
            className="inline-flex items-center gap-2 rounded-2xl bg-[#1663D6] px-8 py-4 text-base font-extrabold text-white shadow-[0_15px_45px_-10px_rgba(22,99,214,0.65)] transition-all hover:scale-[1.03] hover:bg-[#124FA8] animate-cta-pulse"
          >
            <Icon name="lock" size={20} />
            Ø§Ø·Ù„Ø¨ Ø§Ù„Ø¢Ù† â€” {offer.price} {CURRENCY}
          </a>
        </div>
      </div>
    </section>
  );
}


