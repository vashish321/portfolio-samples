import { createClient } from '@/lib/supabase/server';
import type { Book, BookPage, BookWithPages, Work } from './types';

export const revalidate = 0;

export async function getWorks(): Promise<Work[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('works')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('year', { ascending: false });
  if (error) {
    console.error('getWorks', error.message);
    return [];
  }
  return (data ?? []) as Work[];
}

export async function getBooks(): Promise<BookWithPages[]> {
  const supabase = await createClient();
  const [{ data: books, error: be }, { data: pages, error: pe }] = await Promise.all([
    supabase.from('books').select('*').order('sort_order', { ascending: true }),
    supabase.from('book_pages').select('*').order('page_number', { ascending: true }),
  ]);
  if (be || pe) {
    console.error('getBooks', be?.message, pe?.message);
    return [];
  }
  const byBook = new Map<string, BookPage[]>();
  for (const p of (pages ?? []) as BookPage[]) {
    const list = byBook.get(p.book_id) ?? [];
    list.push(p);
    byBook.set(p.book_id, list);
  }
  return ((books ?? []) as Book[]).map((b) => ({ ...b, pages: byBook.get(b.id) ?? [] }));
}
