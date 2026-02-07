import { api } from "./client";
import type { Post, PostsResponse, CategoryWithCount, AuthorWithCount } from "./types";

export interface CreatePostInput {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  authorId: string;
  categoryId: string;
  published?: boolean;
}

export interface ImportPostItem {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  authorId: string;
  categoryId: string;
  published?: boolean;
}

export function getPosts(params?: { page?: number; limit?: number; category?: string; author?: string; all?: boolean }): Promise<PostsResponse> {
  const search = new URLSearchParams();
  if (params?.page) search.set("page", String(params.page));
  if (params?.limit) search.set("limit", String(params.limit));
  if (params?.category) search.set("category", params.category);
  if (params?.author) search.set("author", params.author);
  if (params?.all) search.set("all", "true");
  const q = search.toString();
  return api.get<PostsResponse>(`/api/posts${q ? `?${q}` : ""}`);
}

export function getPostBySlug(slug: string): Promise<Post> {
  return api.get<Post>(`/api/posts/${encodeURIComponent(slug)}`);
}

export function getCategories(): Promise<CategoryWithCount[]> {
  return api.get<CategoryWithCount[]>("/api/categories");
}

export function getCategoryPosts(slug: string, params?: { page?: number; limit?: number }): Promise<PostsResponse & { category: { id: string; name: string; slug: string } }> {
  const search = new URLSearchParams();
  if (params?.page) search.set("page", String(params.page));
  if (params?.limit) search.set("limit", String(params.limit));
  const q = search.toString();
  return api.get(`/api/categories/${encodeURIComponent(slug)}/posts${q ? `?${q}` : ""}`);
}

export function getAuthors(): Promise<AuthorWithCount[]> {
  return api.get<AuthorWithCount[]>("/api/authors");
}

export function getAuthorPosts(id: string, params?: { page?: number; limit?: number }): Promise<PostsResponse & { author: { id: string; name: string; email: string; bio: string | null; avatarUrl: string | null } }> {
  const search = new URLSearchParams();
  if (params?.page) search.set("page", String(params.page));
  if (params?.limit) search.set("limit", String(params.limit));
  const q = search.toString();
  return api.get(`/api/authors/${encodeURIComponent(id)}/posts${q ? `?${q}` : ""}`);
}

export function createPost(data: CreatePostInput): Promise<Post> {
  return api.post<Post>("/api/posts", data);
}

export function updatePost(id: string, data: Partial<CreatePostInput>): Promise<Post> {
  return api.put<Post>(`/api/posts/${id}`, data);
}

export function deletePost(id: string): Promise<void> {
  return api.delete<void>(`/api/posts/${id}`);
}

export function exportPosts(): Promise<{ exportedAt: string; posts: Post[] }> {
  return api.get<{ exportedAt: string; posts: Post[] }>("/api/posts/export");
}

export function importPosts(posts: ImportPostItem[]): Promise<{ imported: number; data: Post[] }> {
  return api.post<{ imported: number; data: Post[] }>("/api/posts/import", { posts });
}

export interface FetchFeedsResult {
  added: number;
  updated: number;
  total: number;
  errors?: string[];
}

export function fetchFeeds(params: { feedUrls: string[]; authorId: string; categoryId: string }): Promise<FetchFeedsResult> {
  return api.post<FetchFeedsResult>("/api/posts/fetch-feeds", params);
}
