import Link from 'next/link';
import { STUDIO } from '@/lib/site';

export function WolfMark({ color = '#14110D', size = 34 }: { color?: string; size?: number }) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      aria-hidden="true"
      fill="none"
      stroke={color}
      strokeWidth="2.6"
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      <path d="M12 10 L18 26 M52 10 L46 26" />
      <path d="M12 10 L20 20 L26 14 M52 10 L44 20 L38 14" />
      <path d="M18 24 C18 18 24 13 32 13 C40 13 46 18 46 24 C46 32 44 36 40 40 L36 50 L32 54 L28 50 L24 40 C20 36 18 32 18 24 Z" />
      <path d="M26 28 h4 M34 28 h4" />
      <path d="M32 40 v6" />
    </svg>
  );
}

const NAV: [string, string][] = [
  ['/', 'Front'],
  ['/about', 'The Desk'],
  ['/contact', 'Letters'],
];

export function Masthead({ active, counts }: { active: string; counts?: string }) {
  return (
    <>
      <div className="strapline">
        <div className="wrap">
          <span>No. 14 &middot; Spring 2026</span>
          <span>Printed in Toronto</span>
          <span>{counts ?? 'Comics · Paint · Ink · Print'}</span>
        </div>
      </div>
      <div className="masthead">
        <Link href="/">
          <span className="mark">
            <WolfMark />
          </span>
          <span className="name">Sam Wolff</span>
        </Link>
        <p className="sub">Comics &middot; Paint &middot; Ink &middot; Print</p>
      </div>
      <nav className="navbar" aria-label="Primary">
        <div className="wrap">
          {NAV.map(([href, label]) => (
            <Link key={href} href={href} aria-current={href === active ? 'page' : undefined}>
              {label}
            </Link>
          ))}
          <span className="grow">Press R to read the latest issue</span>
        </div>
      </nav>
    </>
  );
}

export function SiteFooter() {
  return (
    <footer className="site">
      <div className="wrap" style={{ display: 'block' }}>
        <a className="big" href={`mailto:${STUDIO.email}`}>
          Write to the desk &rarr;
        </a>
      </div>
      <div className="wrap">
        <span>&copy; 2026 Sam Wolff &middot; Toronto</span>
        <span>
          <Link href="/">Front</Link> &middot; <Link href="/about">The Desk</Link> &middot;{' '}
          <Link href="/contact">Letters</Link>
        </span>
        <a href={`mailto:${STUDIO.email}`}>{STUDIO.email}</a>
      </div>
    </footer>
  );
}
