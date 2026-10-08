import { Masthead, SiteFooter } from '@/components/SiteChrome';
import { getWorks } from '@/lib/data';
import { DISCIPLINES, EXHIBITIONS, STUDIO } from '@/lib/site';
import { imageUrl } from '@/lib/types';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'The Desk — Sam Wolff',
  description: 'How the pages get made: method, materials and the studio above the bakery.',
};

export default async function About() {
  const works = await getWorks();
  const aside = works.find((w) => w.slug === 'quiet-man') ?? works.find((w) => w.category === 'Drawings');

  return (
    <>
      <Masthead active="/about" />
      <main id="main">
        <div className="wrap page-body">
          <p className="kicker">The desk</p>
          <h1>Where the pages come from</h1>
          <div className="two">
            <div>
              <div className="cols">
                <p>
                  I trained as an illustrator, spent six years art-directing other people&rsquo;s
                  books at a small press, and came back to my own drawing table in {STUDIO.since}.
                  The studio is a third-floor room above a bakery on Dundas Street West. It smells
                  of bread and turpentine and I have stopped noticing.
                </p>
                <p>
                  A page starts as a bad thumbnail on the back of a receipt. If it will not go away
                  after a week, it gets pencilled. Pencils are tight because inking is fast, and
                  inking is fast because a line drawn slowly looks it.
                </p>
                <p>
                  Lettering comes last, always. If you letter first the drawing arranges itself
                  politely around the words. If you letter last, the words have to fit the room the
                  drawing left them — and they get shorter, and better.
                </p>
                <p>
                  The paintings run on a different clock: oil and cold wax, thin layers over six to
                  ten weeks, scraped back at least twice. Scraping is not failure. It is how a
                  surface acquires a memory.
                </p>
                <p>
                  The risograph editions started as an accident and became a habit. Two or three
                  colours, misregistered by a millimetre, printed at a co-operative press by people
                  cheerfully unbothered by perfection. Every pull is slightly different, which is
                  the entire point.
                </p>
                <p>
                  Three books so far. All under three hundred copies, all signed, all still selling
                  slowly to exactly the right people.
                </p>
              </div>
            </div>
            <aside>
              <div className="boxout">
                {aside && <img src={imageUrl(aside.image_path) ?? ''} alt={aside.title} />}
                <h3>The facts</h3>
                <dl className="dl">
                  <dt>Based</dt>
                  <dd>{STUDIO.city}</dd>
                  <dt>Working since</dt>
                  <dd>{STUDIO.since}</dd>
                  <dt>Studio</dt>
                  <dd>{STUDIO.studio}</dd>
                  <dt>Visits</dt>
                  <dd>{STUDIO.hours}</dd>
                  <dt>Commissions</dt>
                  <dd>Two slots a year</dd>
                </dl>
              </div>
              <h3 style={{ fontSize: '1.6rem', margin: '1.6rem 0 .5rem' }}>What I make</h3>
              <ul className="rows">
                {DISCIPLINES.map(([t, d]) => (
                  <li key={t}>
                    <span className="y">&mdash;</span>
                    <span>
                      <b>{t}</b>
                      <small>{d}</small>
                    </span>
                  </li>
                ))}
              </ul>
              <h3 style={{ fontSize: '1.6rem', margin: '1.6rem 0 .5rem' }}>Exhibitions</h3>
              <ul className="rows">
                {EXHIBITIONS.map(([y, t, v, k]) => (
                  <li key={`${y}-${t}`}>
                    <span className="y">{y}</span>
                    <span>
                      <b>{t}</b>
                      <small>
                        {v} &middot; {k}
                      </small>
                    </span>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
