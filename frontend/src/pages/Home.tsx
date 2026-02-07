import { useEffect, useState } from "react";
import { Title, SimpleGrid, Loader, Alert, Pagination, Stack, Group } from "@mantine/core";
import { PostCard } from "../components/PostCard";
import { CategoryList } from "../components/CategoryList";
import { getPosts, getCategories } from "../api";
import type { Post } from "../api/types";
import type { CategoryWithCount } from "../api/types";

const PAGE_SIZE = 6;

export function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getPosts({ page, limit: PAGE_SIZE })
      .then((res) => {
        setPosts(res.data);
        setTotalPages(res.meta.totalPages);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Yazılar yüklenemedi"))
      .finally(() => setLoading(false));
  }, [page]);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => {});
  }, []);

  return (
    <Stack gap="xl">
      <div>
        <Title order={1} mb="xs">
          Son Yazılar
        </Title>
        {categories.length > 0 && <CategoryList categories={categories} />}
      </div>

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
        <Alert color="gray" title="Henüz yazı yok">
          Burada henüz paylaşılmış yazı bulunmuyor.
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
