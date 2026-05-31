import type { SVGProps } from 'react';

export type IconName =
  | 'shield'
  | 'truck'
  | 'wallet'
  | 'refresh'
  | 'check'
  | 'check-circle'
  | 'star'
  | 'phone'
  | 'chat'
  | 'cart'
  | 'menu'
  | 'close'
  | 'arrow-left'
  | 'arrow-right'
  | 'chevron-down'
  | 'plus'
  | 'minus'
  | 'spark'
  | 'flame'
  | 'lock'
  | 'badge'
  | 'fan'
  | 'pin'
  | 'mail'
  | 'whatsapp'
  | 'quote'
  | 'clock'
  | 'leaf';

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
}

const paths: Record<IconName, JSX.Element> = {
  shield: (
    <>
      <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  truck: (
    <>
      <path d="M3 7h11v8H3zM14 10h4l3 3v2h-7z" />
      <circle cx="7" cy="18" r="1.6" />
      <circle cx="17" cy="18" r="1.6" />
    </>
  ),
  wallet: (
    <>
      <path d="M3 7.5A1.5 1.5 0 014.5 6H18a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <path d="M16 12.5h4" />
      <circle cx="16.5" cy="12.5" r="0.6" fill="currentColor" stroke="none" />
    </>
  ),
  refresh: (
    <>
      <path d="M20 11a8 8 0 10-1.6 5" />
      <path d="M20 5v6h-6" />
    </>
  ),
  check: <path d="M5 12l4.5 4.5L19 7" />,
  'check-circle': (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 12.5l2.5 2.5 4.5-5" />
    </>
  ),
  star: (
    <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 17l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z" />
  ),
  phone: (
    <path d="M5 4h3l1.5 4-2 1.5a12 12 0 005 5l1.5-2 4 1.5v3a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" />
  ),
  chat: (
    <path d="M4 5h16v10H9l-4 4v-4H4z" />
  ),
  cart: (
    <>
      <path d="M3 4h2l2.2 11.2a1.5 1.5 0 001.5 1.3h8.3a1.5 1.5 0 001.5-1.2L21 8H6" />
      <circle cx="9.5" cy="20" r="1.4" />
      <circle cx="17.5" cy="20" r="1.4" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  'arrow-left': <path d="M19 12H5M11 6l-6 6 6 6" />,
  'arrow-right': <path d="M5 12h14M13 6l6 6-6 6" />,
  'chevron-down': <path d="M6 9l6 6 6-6" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  spark: (
    <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />
  ),
  flame: (
    <path d="M12 3c3 3 5 6 5 9a5 5 0 01-10 0c0-1.5.7-2.8 1.7-3.8C8.5 9 9 10 9 11c1-1.5 1.5-4 3-8z" />
  ),
  lock: (
    <>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 018 0v3" />
    </>
  ),
  badge: (
    <>
      <circle cx="12" cy="9" r="5" />
      <path d="M8.5 13.5L7 21l5-2.5L17 21l-1.5-7.5" />
    </>
  ),
  fan: (
    <>
      <circle cx="12" cy="12" r="2" />
      <path d="M12 10c0-4 1-6 3-6s2 4-1 6M14 12c4 0 6 1 6 3s-4 2-6-1M12 14c0 4-1 6-3 6s-2-4 1-6M10 12c-4 0-6-1-6-3s4-2 6 1" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s7-5.5 7-11a7 7 0 10-14 0c0 5.5 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M4 7l8 6 8-6" />
    </>
  ),
  whatsapp: (
    <path d="M5 19l1.2-3.6A7 7 0 1112 19a7 7 0 01-3.6-1L5 19zm5-9c0 3 3 5 4.5 5 .8 0 1.5-.5 1.5-1l-1.5-1-1 .7c-1-.4-1.8-1.2-2.2-2.2l.7-1L11 9c0-.5-.7-1-1.2-1S9 8.8 9 9.5z" />
  ),
  quote: (
    <path d="M9 7H5v6h4v-2H7V9h2zm10 0h-4v6h4v-2h-2V9h2z" />
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  leaf: (
    <path d="M5 19c0-8 6-14 14-14 0 8-6 14-14 14zm0 0c4-4 8-6 12-7" />
  ),
};

const FILLED: IconName[] = ['star', 'flame', 'spark', 'quote'];

export default function Icon({ name, size = 24, ...props }: IconProps) {
  const filled = FILLED.includes(name);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke={filled ? 'none' : 'currentColor'}
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}

export function Stars({ value = 5, size = 16 }: { value?: number; size?: number }) {
  return (
    <span className="star-row" aria-label={`${value} من 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Icon key={i} name="star" size={size} className={i < Math.round(value) ? 'text-accent' : 'text-ink/20'} />
      ))}
    </span>
  );
}
