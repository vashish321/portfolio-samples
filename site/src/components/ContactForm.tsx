'use client';

import { useState } from 'react';
import { STUDIO } from '@/lib/site';
import { isForSale, money, type BookWithPages, type Work } from '@/lib/types';

export default function ContactForm({
  works,
  books,
}: {
  works: Work[];
  books: BookWithPages[];
}) {
  const [status, setStatus] = useState<{ msg: string; ok: boolean } | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const g = (k: string) => (fd.get(k) ?? '').toString().trim();
    const name = g('name');
    const email = g('email');
    const message = g('message');
    if (!name || !email || !message) {
      setStatus({ msg: 'Please add your name, email and a short message.', ok: false });
      return;
    }
    const lines = [`Name: ${name}`, `Email: ${email}`];
    if (g('order')) lines.push(`Item: ${g('order')}`);
    const body = `${lines.join('\n')}\n\n${message}`;
    window.location.href = `mailto:${STUDIO.email}?subject=${encodeURIComponent(
      g('subject') || 'Letter from samwolff.com',
    )}&body=${encodeURIComponent(body)}`;
    setStatus({
      msg: `Opening your email app — if nothing happens, write to ${STUDIO.email} directly.`,
      ok: true,
    });
  }

  return (
    <form id="contact-form" noValidate onSubmit={onSubmit}>
      <div className="field">
        <label htmlFor="name">Your name</label>
        <input id="name" name="name" type="text" autoComplete="name" required />
      </div>
      <div className="field">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" autoComplete="email" required />
      </div>
      <div className="field">
        <label htmlFor="subject">What&rsquo;s it about?</label>
        <select id="subject" name="subject">
          <option>Ordering a book or print</option>
          <option>Buying original art</option>
          <option>Commission</option>
          <option>Anthology or publishing</option>
          <option>Festival or table</option>
          <option>Workshop</option>
          <option>Just saying hello</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="order">Item (optional)</label>
        <select id="order" name="order">
          <option value="">— nothing specific —</option>
          {books
            .filter((b) => b.stock !== 'Sold out')
            .map((b) => (
              <option key={b.id}>
                {b.title} (book, {money(b.price)})
              </option>
            ))}
          {works.filter(isForSale).map((w) => (
            <option key={w.id}>
              {w.title} — {money(w.price)}
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          name="message"
          required
          placeholder="A couple of sentences is plenty."
        />
      </div>
      <button className="btn" type="submit">
        Post it
      </button>
      <p className={`form-status${status ? (status.ok ? ' ok' : ' error') : ''}`} role="status">
        {status?.msg ?? ''}
      </p>
      <p style={{ fontSize: '.8rem', color: 'var(--muted)', marginTop: '.7rem' }}>
        Opens your own email app with everything filled in. Nothing is stored on this site.
      </p>
    </form>
  );
}
