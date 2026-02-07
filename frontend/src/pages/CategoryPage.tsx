import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Title, SimpleGrid, Loader, Alert, Pagination, Group, Stack } from "@mantine/core";
import { PostCard } from "../components/PostCard";
import { getCategoryPosts } from "../api";
import type { Post } from "../api/types";

const PAGE_SIZE = 6;

export function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [categoryName, setCategoryName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    getCategoryPosts(slug, { page, limit: PAGE_SIZE })
      .then((res) => {
        setPosts(res.data);
        setCategoryName(res.category.name);
        setTotalPages(res.meta.totalPages);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Yazılar yüklenemedi"))
      .finally(() => setLoading(false));
  }, [slug, page]);

  if (!slug) return null;

  return (
    <Stack gap="xl">
      <Title order={1}>Kategori: {categoryName || slug}</Title>

      {error && (
        <Alert color="red" title="Hata">
          {error}
        </Alert>
      )}

      {loading && (
        <Group justify="center" py="xl">
          <Loader />
        </Group>
      )}

      {!loading && !error && posts.length === 0 && (
        <Alert color="gray" title="Yazı yok">
          Bu kategoride henüz yazı bulunmuyor.
        </Alert>
      )}

      {!loading && !error && posts.length > 0 && (
        <>
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </SimpleGrid>
          {totalPages > 1 && (
            <Group justify="center" mt="md">
              <Pagination total={totalPages} value={page} onChange={setPage} />
            </Group>
          )}
        </>
      )}
    </Stack>
  );
}
