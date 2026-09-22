export type Category = {
  id: string;
  slug: string;
  image: string;
  title: string;
  children: Category[];
  parent_slug: Category | null;
  is_featured: boolean;
};
