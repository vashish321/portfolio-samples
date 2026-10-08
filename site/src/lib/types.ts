export type Category = 'Comics' | 'Paintings' | 'Drawings' | 'Prints';

export const CATEGORIES: Category[] = ['Paintings', 'Drawings', 'Prints', 'Comics'];

export const STATUSES = [
  'Available',
  'Low stock',
  'Sold',
  'Sold out',
  'Private collection',
] as const;

export type Status = (typeof STATUSES)[number];

export type Work = {
  id: string;
  slug: string;
  title: string;
  year: number;
  medium: string;
  size: string;
  category: Category;
  series: string | null;
  price: number | null;
  status: Status;
  note: string;
  image_path: string | null;
  featured: boolean;
  sort_order: number;
};

export type Book = {
  id: string;
  slug: string;
  title: string;
  year: number | null;
  page_count: number;
  edition: number | null;
  price: number | null;
  stock: string;
  tagline: string;
  synopsis: string;
  cover_path: string | null;
  sort_order: number;
};

export type BookPage = {
  id: string;
  book_id: string;
  page_number: number;
  image_path: string;
};

export type BookWithPages = Book & { pages: BookPage[] };

export const SOLD_STATUSES: string[] = ['Sold', 'Sold out', 'Private collection'];

export function isForSale(w: Pick<Work, 'status' | 'price'>) {
  return !!w.price && (w.status === 'Available' || w.status === 'Low stock');
}

export function money(n: number | null | undefined) {
  if (n === null || n === undefined) return '';
  return '$' + Number(n).toLocaleString('en-CA', { maximumFractionDigits: 0 });
}

/** Public URL for a file in the `artwork` storage bucket. */
export function imageUrl(path: string | null | undefined) {
  if (!path) return null;
  if (path.startsWith('http') || path.startsWith('/')) return path;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return null;
  return `${base}/storage/v1/object/public/artwork/${path}`;
}
