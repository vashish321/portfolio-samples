import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sam Wolff — Comics, Paint, Ink & Print',
  description:
    "Read all three of Sam Wolff's self-published comics in full, and browse the paintings, drawings and risograph editions.",
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
