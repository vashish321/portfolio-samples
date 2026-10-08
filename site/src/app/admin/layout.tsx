import './admin.css';

export const metadata = {
  title: 'Studio dashboard — Sam Wolff',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="admin">{children}</div>;
}
