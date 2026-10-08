import FrontPage from '@/components/FrontPage';
import { Masthead, SiteFooter } from '@/components/SiteChrome';
import { getBooks, getWorks } from '@/lib/data';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [works, books] = await Promise.all([getWorks(), getBooks()]);
  return (
    <>
      <Masthead
        active="/"
        counts={`${books.length} books · ${works.length} works`}
      />
      <FrontPage works={works} books={books} />
      <SiteFooter />
    </>
  );
}
