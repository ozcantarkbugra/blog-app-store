import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Title, SimpleGrid, Loader, Alert, Pagination, Group, Stack, Text } from "@mantine/core";
import { PostCard } from "../components/PostCard";
import { getAuthorPosts } from "../api";
import type { Post } from "../api/types";

const PAGE_SIZE = 6;

export function AuthorPage() {
  const { id } = useParams<{ id: string }>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [authorName, setAuthorName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    getAuthorPosts(id, { page, limit: PAGE_SIZE })
      .then((res) => {
        setPosts(res.data);
        setAuthorName(res.author.name);
        setTotalPages(res.meta.totalPages);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Yazılar yüklenemedi"))
      .finally(() => setLoading(false));
  }, [id, page]);

  if (!id) return null;

  return (
    <Stack gap="xl">
      <div>
        <Title order={1}>Yazar: {authorName || id}</Title>
        {authorName && (
          <Text size="sm" c="dimmed" mt="xs">
            Bu yazarın tüm yazıları
          </Text>
        )}
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
        <Alert color="gray" title="Yazı yok">
          Bu yazara ait henüz yazı bulunmuyor.
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
