'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  CATEGORIES,
  imageUrl,
  isForSale,
  money,
  type BookWithPages,
  type Category,
  type Work,
} from '@/lib/types';

type Props = { works: Work[]; books: BookWithPages[] };

export default function FrontPage({ works, books }: Props) {
  const [tab, setTab] = useState<Category>(CATEGORIES[0]);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [readerBook, setReaderBook] = useState<BookWithPages | null>(null);

  const byCat = useMemo(() => {
    const m = new Map<string, Work[]>();
    for (const c of CATEGORIES) m.set(c, []);
    for (const w of works) m.get(w.category)?.push(w);
    return m;
  }, [works]);

  const shown = byCat.get(tab) ?? [];

  // ---- keyboard: R opens the newest book
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = document.activeElement as HTMLElement | null;
      if (el && /INPUT|TEXTAREA|SELECT/.test(el.tagName)) return;
      if ((e.key === 'r' || e.key === 'R') && !readerBook && lightbox === null && books[0]) {
        setReaderBook(books[0]);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [books, readerBook, lightbox]);

  const lead = works.find((w) => w.featured && w.category === 'Comics') ?? works[0];

  return (
    <>
      <main id="main">
        <div className="wrap">
          {lead && (
            <section className="lead">
              <div className="lead-main">
                <p className="byline">Lead story &middot; {books[0]?.title ?? 'From the studio'}</p>
                <h2>
                  {books[0]?.synopsis ? (
                    <>
                      A hundred and twenty-eight pages about{' '}
                      <em>the week after a funeral</em>.
                    </>
                  ) : (
                    'New work from the studio'
                  )}
                </h2>
                <p className="drop">{books[0]?.synopsis}</p>
                <p>
                  Read the whole book here, page by page — the reader has a spread view, a
                  thumbnail rail and keyboard controls. Nothing is paywalled and nothing is
                  cropped.
                </p>
                <div className="cta-row">
                  {books[0] && (
                    <button className="btn" onClick={() => setReaderBook(books[0])}>
                      Read {books[0].title}
                    </button>
                  )}
                  <a className="btn alt" href="#rack">
                    See all {books.length} books
                  </a>
                </div>
              </div>
              <figure className="lead-fig">
                <img src={imageUrl(lead.image_path) ?? ''} alt={lead.title} />
                <figcaption>
                  {lead.title} &mdash; {lead.medium}.{' '}
                  {isForSale(lead) ? 'The original board is available.' : lead.status + '.'}
                </figcaption>
              </figure>
            </section>
          )}

          <section className="section" id="rack">
            <div className="sec-head">
              <h2>The rack</h2>
              <span className="kicker">{books.length} self-published titles</span>
            </div>
            <div className="rack">
              {books.map((b) => (
                <article className="issue" key={b.id}>
                  <div className="cover">
                    <img src={imageUrl(b.cover_path) ?? ''} alt={`${b.title} cover`} loading="lazy" />
                    <span className="price">{money(b.price)}</span>
                    <span className={`stock${b.stock === 'Sold out' ? ' out' : ''}`}>{b.stock}</span>
                  </div>
                  <div className="body">
                    <h3>{b.title}</h3>
                    <p className="tag">{b.tagline}</p>
                    <p className="facts">
                      {b.year} &middot; {b.page_count}pp &middot; edition of {b.edition}
                    </p>
                    <button
                      className="btn"
                      onClick={() => setReaderBook(b)}
                      disabled={!b.pages.length}
                    >
                      {b.pages.length ? 'Read it →' : 'Pages coming'}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="section">
            <div className="sec-head">
              <h2>Back matter</h2>
              <span className="kicker">Paint, ink &amp; print</span>
            </div>
            <p style={{ maxWidth: '60ch', marginBottom: '1rem' }}>
              The comics pay the rent but they are not the whole job. Everything below is
              original work from the same room — click any frame to see it full size.
            </p>
            <div className="tabs" role="tablist" aria-label="Work by medium">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  role="tab"
                  aria-selected={tab === c}
                  onClick={() => setTab(c)}
                  onKeyDown={(e) => {
                    const i = CATEGORIES.indexOf(tab);
                    if (e.key === 'ArrowRight') setTab(CATEGORIES[(i + 1) % CATEGORIES.length]);
                    if (e.key === 'ArrowLeft')
                      setTab(CATEGORIES[(i - 1 + CATEGORIES.length) % CATEGORIES.length]);
                  }}
                >
                  {c}
                  <span className="count">{byCat.get(c)?.length ?? 0}</span>
                </button>
              ))}
            </div>
            <div className="gal" role="tabpanel">
              {shown.map((w, i) => (
                <button className="cut" key={w.id} onClick={() => setLightbox(i)}>
                  <span className="fr">
                    <img src={imageUrl(w.image_path) ?? ''} alt={w.title} loading="lazy" />
                  </span>
                  <h4>{w.title}</h4>
                  <p>{w.medium}</p>
                  <p className="pr">{isForSale(w) ? money(w.price) : w.status}</p>
                </button>
              ))}
              {!shown.length && (
                <p style={{ gridColumn: '1/-1', color: 'var(--muted)' }}>
                  Nothing in this section yet.
                </p>
              )}
            </div>
          </section>
        </div>
      </main>

      {lightbox !== null && shown[lightbox] && (
        <Lightbox
          items={shown}
          index={lightbox}
          onIndex={setLightbox}
          onClose={() => setLightbox(null)}
        />
      )}
      {readerBook && <Reader book={readerBook} onClose={() => setReaderBook(null)} />}
    </>
  );
}

/* --------------------------------------------------------------- lightbox */

function Lightbox({
  items,
  index,
  onIndex,
  onClose,
}: {
  items: Work[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const w = items[index];
  const step = useCallback(
    (d: number) => onIndex((index + d + items.length) % items.length),
    [index, items.length, onIndex],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose, step]);

  return (
    <div className="lb is-open" role="dialog" aria-modal="true" aria-label="Artwork viewer"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <button className="x" aria-label="Close" onClick={onClose}>X</button>
      <button className="ar p" aria-label="Previous" onClick={() => step(-1)}>&#8249;</button>
      <button className="ar n" aria-label="Next" onClick={() => step(1)}>&#8250;</button>
      <figure>
        <img src={imageUrl(w.image_path) ?? ''} alt={w.title} />
        <figcaption>
          <b>{w.title}</b>
          <span>
            {w.medium}, {w.year}
            {w.size ? ` — ${w.size}` : ''}
          </span>
        </figcaption>
      </figure>
    </div>
  );
}

/* ----------------------------------------------------------------- reader */

function Reader({ book, onClose }: { book: BookWithPages; onClose: () => void }) {
  const total = book.pages.length;
  const [page, setPage] = useState(1);
  const [spread, setSpread] = useState(false);
  const [thumbs, setThumbs] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const downX = useRef<number | null>(null);

  const go = useCallback(
    (n: number) => setPage((p) => Math.max(1, Math.min(total, typeof n === 'number' ? n : p))),
    [total],
  );
  const stepBy = useCallback(
    (d: number) => setPage((p) => Math.max(1, Math.min(total, p + d * (spread ? 2 : 1)))),
    [spread, total],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') stepBy(-1);
      if (e.key === 'ArrowRight') stepBy(1);
      if (e.key === 'Home') go(1);
      if (e.key === 'End') go(total);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose, stepBy, go, total]);

  const visible = useMemo(() => {
    if (!spread) return [page];
    if (page === 1) return [1];
    return page % 2 === 0 ? [page, page + 1].filter((n) => n <= total) : [page - 1, page];
  }, [page, spread, total]);

  const src = (n: number) => imageUrl(book.pages.find((p) => p.page_number === n)?.image_path) ?? '';

  return (
    <div className="reader is-open" role="dialog" aria-modal="true" aria-label={`${book.title} reader`}>
      <div className="rbar">
        <span className="title">{book.title}</span>
        <span className="of">
          {book.year} · {total} pages
        </span>
        <span className="sp">
          <button className="rbtn" aria-pressed={spread} onClick={() => setSpread((s) => !s)}>
            Spread
          </button>
          <button className="rbtn" aria-pressed={thumbs} onClick={() => setThumbs((t) => !t)}>
            Pages
          </button>
          <button className="rbtn icon" aria-label="Close reader" onClick={onClose}>
            &times;
          </button>
        </span>
      </div>
      <div className="rprog">
        <i style={{ width: `${(page / Math.max(1, total)) * 100}%` }} />
      </div>
      <div
        className="rstage"
        ref={stageRef}
        onPointerDown={(e) => (downX.current = e.clientX)}
        onPointerUp={(e) => {
          if (downX.current === null) return;
          const d = e.clientX - downX.current;
          downX.current = null;
          if (Math.abs(d) > 50) stepBy(d < 0 ? 1 : -1);
        }}
      >
        <div className="rpages">
          {visible.map((n) => (
            <img key={n} src={src(n)} alt={`Page ${n} of ${book.title}`} />
          ))}
        </div>
        <button
          className="rnav prev"
          aria-label="Previous page"
          disabled={page <= 1}
          onClick={() => stepBy(-1)}
        >
          <span>&#8249;</span>
        </button>
        <button
          className="rnav next"
          aria-label="Next page"
          disabled={page >= total}
          onClick={() => stepBy(1)}
        >
          <span>&#8250;</span>
        </button>
      </div>
      <div className={`rthumbs${thumbs ? ' is-open' : ''}`}>
        {thumbs &&
          book.pages.map((p) => (
            <button
              key={p.id}
              aria-current={p.page_number === page}
              aria-label={`Go to page ${p.page_number}`}
              onClick={() => go(p.page_number)}
            >
              <img src={imageUrl(p.image_path) ?? ''} alt="" loading="lazy" />
              <span>{p.page_number}</span>
            </button>
          ))}
      </div>
      <div className="rfoot">
        <input
          type="range"
          min={1}
          max={Math.max(1, total)}
          value={page}
          aria-label="Page"
          onChange={(e) => go(Number(e.target.value))}
        />
        <span className="pg">
          Page {page} / {total}
        </span>
      </div>
    </div>
  );
}
