import ContactForm from '@/components/ContactForm';
import { Masthead, SiteFooter } from '@/components/SiteChrome';
import { getBooks, getWorks } from '@/lib/data';
import { FAQ, STUDIO } from '@/lib/site';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Letters — Sam Wolff',
  description: 'Order a book, commission a cover, or invite Sam Wolff to a festival.',
};

export default async function Contact() {
  const [works, books] = await Promise.all([getWorks(), getBooks()]);

  return (
    <>
      <Masthead active="/contact" />
      <main id="main">
        <div className="wrap page-body">
          <p className="kicker">Letters</p>
          <h1>Write to the desk</h1>
          <p style={{ maxWidth: '56ch' }}>
            Orders, commissions, festival invitations and corrections all arrive at the same
            address. Replies usually inside two working days.
          </p>
          <div className="two">
            <ContactForm works={works} books={books} />
            <aside>
              <div className="boxout" style={{ marginBottom: '1.4rem' }}>
                <h3>Where to find me</h3>
                <dl className="dl">
                  <dt>Email</dt>
                  <dd>
                    <a href={`mailto:${STUDIO.email}`}>{STUDIO.email}</a>
                  </dd>
                  <dt>Studio</dt>
                  <dd>{STUDIO.studio}</dd>
                  <dt>Visits</dt>
                  <dd>{STUDIO.hours}</dd>
                  <dt>Fairs</dt>
                  <dd>TCAF &middot; Harbour Print Fair</dd>
                  <dt>Shipping</dt>
                  <dd>Worldwide, flat-packed, at cost</dd>
                </dl>
              </div>
              <h3 style={{ fontSize: '1.6rem', marginBottom: '.7rem' }}>Before you write</h3>
              {FAQ.map(([q, a]) => (
                <div className="letters" key={q}>
                  <p>{a}</p>
                  <cite>— {q}</cite>
                </div>
              ))}
            </aside>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
