export interface Author {
  id: string;
  name: string;
  email: string;
  bio: string | null;
  avatarUrl: string | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  published: boolean;
  authorId: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  author: Author;
  category: Category;
}

export interface PostsResponse {
  data: Post[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

export interface CategoryWithCount extends Category {
  _count: { posts: number };
}

export interface AuthorWithCount extends Author {
  _count: { posts: number };
}
