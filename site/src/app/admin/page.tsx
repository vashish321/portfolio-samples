import Dashboard from '@/components/admin/Dashboard';
import { WolfMark } from '@/components/SiteChrome';
import { createClient } from '@/lib/supabase/server';
import type { Work } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: isAdmin } = await supabase.rpc('is_admin');

  if (!isAdmin) {
    return (
      <div className="a-login">
        <div className="a-card">
          <div className="mark">
            <WolfMark color="#e4b429" size={40} />
          </div>
          <h1>Not on the list</h1>
          <p className="sub">
            You&rsquo;re signed in as <strong>{user?.email}</strong>, but that address
            isn&rsquo;t approved to edit the catalogue.
          </p>
          <div className="a-alert err">
            Ask the site owner to add <strong>{user?.email}</strong> to the admin allowlist.
          </div>
          <p className="a-note">
            <a href="/">← Back to the site</a>
          </p>
        </div>
      </div>
    );
  }

  const { data } = await supabase
    .from('works')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('year', { ascending: false });

  return <Dashboard initialWorks={(data ?? []) as Work[]} email={user?.email ?? ''} />;
}
