'use client';

import { useState } from 'react';
import { WolfMark } from '@/components/SiteChrome';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSending(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    setSending(false);
    if (error) setError(error.message);
    else setSent(true);
  }

  return (
    <div className="a-login">
      <div className="a-card">
        <div className="mark">
          <WolfMark color="#e4b429" size={40} />
        </div>
        <h1>Studio dashboard</h1>
        <p className="sub">Sign in to manage the catalogue.</p>

        {sent ? (
          <div className="a-alert ok">
            Check <strong>{email}</strong> for a sign-in link. It expires in an hour — open it on
            this device.
          </div>
        ) : (
          <form onSubmit={onSubmit}>
            <div className="a-field">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <button className="a-btn primary" type="submit" disabled={sending || !email.trim()}
              style={{ width: '100%', justifyContent: 'center' }}>
              {sending ? 'Sending…' : 'Email me a sign-in link'}
            </button>
            {error && <div className="a-alert err">{error}</div>}
          </form>
        )}

        <p className="a-note">
          No password to remember — the link signs you in. Only approved addresses can change
          anything.
        </p>
        <p className="a-note">
          <a href="/">← Back to the site</a>
        </p>
      </div>
    </div>
  );
}
