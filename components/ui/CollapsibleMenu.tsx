import { useState, type ReactNode } from 'react';
import Icon from './Icon';

interface CollapsibleMenuProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export default function CollapsibleMenu({
  title,
  children,
  defaultOpen = false,
  className = '',
}: CollapsibleMenuProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={`border-b border-ink/[0.06] last:border-b-0 ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between py-3.5 text-start md:pointer-events-none"
        aria-expanded={open}
      >
        <span className="font-heading font-bold text-ink md:text-inherit">{title}</span>
        <Icon
          name="chevron-down"
          size={18}
          className={`text-ink/40 shrink-0 transition-transform duration-200 md:hidden ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div
        className={`grid transition-all duration-200 md:grid-rows-[1fr] md:opacity-100 ${
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 md:opacity-100'
        }`}
      >
        <div className="overflow-hidden pb-3 md:pb-0 md:overflow-visible">{children}</div>
      </div>
    </div>
  );
}

interface CollapsibleMenuDarkProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function CollapsibleMenuDark({ title, children, defaultOpen = false }: CollapsibleMenuDarkProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-white/10 md:border-0 pb-1 md:pb-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between py-3.5 text-start md:pointer-events-none md:py-0"
        aria-expanded={open}
      >
        <span className="font-heading font-bold text-white">{title}</span>
        <Icon
          name="chevron-down"
          size={18}
          className={`text-white/50 shrink-0 transition-transform duration-200 md:hidden ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div
        className={`grid transition-all duration-200 md:grid-rows-[1fr] md:opacity-100 ${
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 md:opacity-100'
        }`}
      >
        <div className="overflow-hidden pb-4 md:overflow-visible md:pb-0 md:mt-4">{children}</div>
      </div>
    </div>
  );
}
