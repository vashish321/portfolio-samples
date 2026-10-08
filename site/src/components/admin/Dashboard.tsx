'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { WolfMark } from '@/components/SiteChrome';
import { createClient } from '@/lib/supabase/client';
import {
  CATEGORIES,
  SOLD_STATUSES,
  STATUSES,
  imageUrl,
  money,
  type Category,
  type Status,
  type Work,
} from '@/lib/types';

type Draft = {
  id?: string;
  slug: string;
  title: string;
  year: number;
  medium: string;
  size: string;
  category: Category;
  series: string;
  price: string;
  status: Status;
  note: string;
  image_path: string | null;
  featured: boolean;
  sort_order: number;
};

const blank = (): Draft => ({
  slug: '',
  title: '',
  year: new Date().getFullYear(),
  medium: '',
  size: '',
  category: 'Paintings',
  series: '',
  price: '',
  status: 'Available',
  note: '',
  image_path: null,
  featured: false,
  sort_order: 0,
});

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 60);
}

export default function Dashboard({
  initialWorks,
  email,
}: {
  initialWorks: Work[];
  email: string;
}) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [works, setWorks] = useState<Work[]>(initialWorks);
  const [filter, setFilter] = useState<string>('All');
  const [q, setQ] = useState('');
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ text: string; err?: boolean } | null>(null);

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return works.filter((w) => {
      if (filter !== 'All' && w.category !== filter) return false;
      if (!needle) return true;
      return `${w.title} ${w.medium} ${w.series ?? ''}`.toLowerCase().includes(needle);
    });
  }, [works, filter, q]);

  const refresh = useCallback(async () => {
    const { data } = await supabase
      .from('works')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('year', { ascending: false });
    setWorks((data ?? []) as Work[]);
    router.refresh();
  }, [supabase, router]);

  function edit(w: Work) {
    setMsg(null);
    setDraft({
      id: w.id,
      slug: w.slug,
      title: w.title,
      year: w.year,
      medium: w.medium,
      size: w.size,
      category: w.category,
      series: w.series ?? '',
      price: w.price === null ? '' : String(w.price),
      status: w.status,
      note: w.note,
      image_path: w.image_path,
      featured: w.featured,
      sort_order: w.sort_order,
    });
  }

  async function save() {
    if (!draft) return;
    const title = draft.title.trim();
    if (!title) {
      setMsg({ text: 'A title is required.', err: true });
      return;
    }
    setSaving(true);
    setMsg(null);
    const row = {
      slug: (draft.slug.trim() || slugify(title)) as string,
      title,
      year: Number(draft.year) || new Date().getFullYear(),
      medium: draft.medium.trim(),
      size: draft.size.trim(),
      category: draft.category,
      series: draft.series.trim() || null,
      price: draft.price.trim() === '' ? null : Number(draft.price),
      status: draft.status,
      note: draft.note.trim(),
      image_path: draft.image_path,
      featured: draft.featured,
      sort_order: Number(draft.sort_order) || 0,
    };
    const res = draft.id
      ? await supabase.from('works').update(row).eq('id', draft.id)
      : await supabase.from('works').insert(row);
    setSaving(false);
    if (res.error) {
      setMsg({ text: res.error.message, err: true });
      return;
    }
    setDraft(null);
    await refresh();
  }

  async function remove(w: Work) {
    if (!window.confirm(`Delete “${w.title}”? This cannot be undone.`)) return;
    const { error } = await supabase.from('works').delete().eq('id', w.id);
    if (error) {
      setMsg({ text: error.message, err: true });
      return;
    }
    if (w.image_path) await supabase.storage.from('artwork').remove([w.image_path]);
    await refresh();
  }

  async function signOut() {
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <>
      <div className="a-bar">
        <span className="brand">
          <WolfMark color="#e4b429" size={26} />
          <span>
            <b>Sam Wolff</b>
            <i>Studio dashboard</i>
          </span>
        </span>
        <span className="sp">
          <span className="who">{email}</span>
          <a className="a-btn sm" href="/" target="_blank" rel="noreferrer">
            View site ↗
          </a>
          <button className="a-btn sm" onClick={signOut}>
            Sign out
          </button>
        </span>
      </div>

      <div className="a-wrap">
        <div className="a-head">
          <div>
            <h1>Works</h1>
            <p>
              {works.length} in the catalogue ·{' '}
              {works.filter((w) => !SOLD_STATUSES.includes(w.status)).length} available
            </p>
          </div>
          <div className="sp">
            <button
              className="a-btn primary"
              onClick={() => {
                setMsg(null);
                setDraft({ ...blank(), sort_order: works.length });
              }}
            >
              + New work
            </button>
          </div>
        </div>

        <div className="a-filters">
          {['All', ...CATEGORIES].map((c) => (
            <button
              key={c}
              className="a-chip"
              aria-pressed={filter === c}
              onClick={() => setFilter(c)}
            >
              {c}
              {c !== 'All' && ` ${works.filter((w) => w.category === c).length}`}
            </button>
          ))}
          <input
            type="search"
            placeholder="Search titles, media…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <span className="n">
            {shown.length} of {works.length}
          </span>
        </div>

        {msg && !draft && (
          <div className={`a-alert ${msg.err ? 'err' : 'ok'}`} style={{ marginBottom: '1rem' }}>
            {msg.text}
          </div>
        )}

        {shown.length ? (
          <table className="a-table">
            <thead>
              <tr>
                <th style={{ width: 62 }}>Image</th>
                <th>Work</th>
                <th className="hide-sm">Category</th>
                <th className="hide-sm">Year</th>
                <th>Status</th>
                <th className="hide-sm">Price</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {shown.map((w) => (
                <tr key={w.id}>
                  <td>
                    {w.image_path ? (
                      <img src={imageUrl(w.image_path) ?? ''} alt="" />
                    ) : (
                      <div
                        style={{
                          width: 46,
                          height: 56,
                          borderRadius: 4,
                          border: '1px dashed var(--a-line)',
                        }}
                      />
                    )}
                  </td>
                  <td>
                    <div className="t">{w.title}</div>
                    <div className="m">{w.medium}</div>
                  </td>
                  <td className="hide-sm">{w.category}</td>
                  <td className="hide-sm">{w.year}</td>
                  <td>
                    <span
                      className={`a-pill ${
                        SOLD_STATUSES.includes(w.status)
                          ? 'gone'
                          : w.status === 'Low stock'
                            ? 'low'
                            : 'ok'
                      }`}
                    >
                      {w.status}
                    </span>
                  </td>
                  <td className="hide-sm">{money(w.price)}</td>
                  <td>
                    <div className="acts">
                      <button className="a-btn sm" onClick={() => edit(w)}>
                        Edit
                      </button>
                      <button className="a-btn sm danger" onClick={() => remove(w)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="a-empty">
            Nothing here yet. Use <strong>+ New work</strong> to add the first piece.
          </div>
        )}
      </div>

      {draft && (
        <>
          <div className="a-scrim" onClick={() => !saving && setDraft(null)} />
          <div className="a-sheet" role="dialog" aria-modal="true" aria-label="Edit work">
            <header>
              <h2>{draft.id ? 'Edit work' : 'New work'}</h2>
              <button className="a-btn sm" onClick={() => setDraft(null)} disabled={saving}>
                Close
              </button>
            </header>
            <div className="body">
              <ImageDrop
                path={draft.image_path}
                slug={draft.slug || slugify(draft.title) || 'work'}
                onUploaded={(p) => setDraft({ ...draft, image_path: p })}
              />

              <div className="a-field" style={{ marginTop: '1rem' }}>
                <label htmlFor="f-title">Title</label>
                <input
                  id="f-title"
                  value={draft.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    setDraft((d) =>
                      d
                        ? { ...d, title, slug: d.id ? d.slug : slugify(title) }
                        : d,
                    );
                  }}
                />
              </div>

              <div className="a-row">
                <div className="a-field">
                  <label htmlFor="f-cat">Category</label>
                  <select
                    id="f-cat"
                    value={draft.category}
                    onChange={(e) =>
                      setDraft({ ...draft, category: e.target.value as Category })
                    }
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="a-field">
                  <label htmlFor="f-year">Year</label>
                  <input
                    id="f-year"
                    type="number"
                    value={draft.year}
                    onChange={(e) => setDraft({ ...draft, year: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="a-field">
                <label htmlFor="f-medium">Medium</label>
                <input
                  id="f-medium"
                  placeholder="Oil and cold wax on linen"
                  value={draft.medium}
                  onChange={(e) => setDraft({ ...draft, medium: e.target.value })}
                />
              </div>

              <div className="a-row">
                <div className="a-field">
                  <label htmlFor="f-size">Dimensions</label>
                  <input
                    id="f-size"
                    placeholder="150 × 110 cm"
                    value={draft.size}
                    onChange={(e) => setDraft({ ...draft, size: e.target.value })}
                  />
                </div>
                <div className="a-field">
                  <label htmlFor="f-series">Series (optional)</label>
                  <input
                    id="f-series"
                    placeholder="weather-systems"
                    value={draft.series}
                    onChange={(e) => setDraft({ ...draft, series: e.target.value })}
                  />
                </div>
              </div>

              <div className="a-row3">
                <div className="a-field">
                  <label htmlFor="f-status">Status</label>
                  <select
                    id="f-status"
                    value={draft.status}
                    onChange={(e) => setDraft({ ...draft, status: e.target.value as Status })}
                  >
                    {STATUSES.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="a-field">
                  <label htmlFor="f-price">Price (CAD)</label>
                  <input
                    id="f-price"
                    type="number"
                    placeholder="6800"
                    value={draft.price}
                    onChange={(e) => setDraft({ ...draft, price: e.target.value })}
                  />
                </div>
                <div className="a-field">
                  <label htmlFor="f-order">Sort order</label>
                  <input
                    id="f-order"
                    type="number"
                    value={draft.sort_order}
                    onChange={(e) => setDraft({ ...draft, sort_order: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="a-field">
                <label htmlFor="f-note">Studio note (optional)</label>
                <textarea
                  id="f-note"
                  placeholder="Six weeks of thin layers, scraped back twice…"
                  value={draft.note}
                  onChange={(e) => setDraft({ ...draft, note: e.target.value })}
                />
              </div>

              <div className="a-field">
                <label htmlFor="f-slug">URL slug</label>
                <input
                  id="f-slug"
                  value={draft.slug}
                  onChange={(e) => setDraft({ ...draft, slug: slugify(e.target.value) })}
                />
                <p className="hint">Must be unique. Auto-filled from the title.</p>
              </div>

              <label className="a-check">
                <input
                  type="checkbox"
                  checked={draft.featured}
                  onChange={(e) => setDraft({ ...draft, featured: e.target.checked })}
                />
                Feature this work on the front page
              </label>
            </div>

            <div className="a-foot">
              <button className="a-btn primary" onClick={save} disabled={saving}>
                {saving ? 'Saving…' : draft.id ? 'Save changes' : 'Create work'}
              </button>
              <button className="a-btn" onClick={() => setDraft(null)} disabled={saving}>
                Cancel
              </button>
              {msg && <span className={`msg${msg.err ? ' err' : ''}`}>{msg.text}</span>}
            </div>
          </div>
        </>
      )}
    </>
  );
}

/* ------------------------------------------------------------ image drop */

function ImageDrop({
  path,
  slug,
  onUploaded,
}: {
  path: string | null;
  slug: string;
  onUploaded: (path: string | null) => void;
}) {
  const supabase = useMemo(() => createClient(), []);
  const inputRef = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const upload = useCallback(
    async (file: File) => {
      setErr(null);
      if (!file.type.startsWith('image/')) {
        setErr('That is not an image file.');
        return;
      }
      if (file.size > 25 * 1024 * 1024) {
        setErr('Images must be under 25 MB.');
        return;
      }
      setBusy(true);
      const ext = (file.name.split('.').pop() || 'png').toLowerCase();
      const key = `works/${slug || 'work'}-${Date.now()}.${ext}`;
      const { error } = await supabase.storage
        .from('artwork')
        .upload(key, file, { cacheControl: '31536000', upsert: false });
      setBusy(false);
      if (error) {
        setErr(error.message);
        return;
      }
      onUploaded(key);
    },
    [slug, supabase, onUploaded],
  );

  const url = imageUrl(path);

  return (
    <div>
      <div
        className={`a-drop${over ? ' over' : ''}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          const f = e.dataTransfer.files?.[0];
          if (f) void upload(f);
        }}
      >
        {url && <img src={url} alt="Current artwork" />}
        <p>
          {busy
            ? 'Uploading…'
            : url
              ? 'Drop a new image, or click to replace'
              : 'Drop an image here, or click to choose'}
        </p>
        {busy && (
          <div className="pct">
            <i style={{ width: '60%' }} />
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void upload(f);
            e.target.value = '';
          }}
        />
      </div>
      {err && <div className="a-alert err">{err}</div>}
      {url && (
        <button
          className="a-btn sm"
          style={{ marginTop: '.5rem' }}
          onClick={() => onUploaded(null)}
        >
          Remove image
        </button>
      )}
    </div>
  );
}
