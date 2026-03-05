export interface Post {
  id: number | null;
  title: string;
  content: string;
  author: string;
  author_id: string;
  slug: string;
  created_at: Date | null;
}
