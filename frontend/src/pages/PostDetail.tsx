import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Title, Text, Loader, Alert, Group, Badge, Anchor, Stack } from "@mantine/core";
import { getPostBySlug } from "../api";
import type { Post } from "../api/types";

function formatDate(s: string) {
  return new Date(s).toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function PostDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    getPostBySlug(slug)
      .then(setPost)
      .catch((e) => setError(e instanceof Error ? e.message : "Yazı yüklenemedi"))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <Group justify="center" py="xl">
        <Loader />
      </Group>
    );
  }

  if (error || !post) {
    return (
      <Alert color="red" title="Hata">
        {error ?? "Yazı bulunamadı."}
      </Alert>
    );
  }

  return (
    <Stack gap="md">
      <Group justify="space-between" wrap="wrap">
        <Anchor component={Link} to={`/category/${post.category.slug}`}>
          <Badge variant="light" size="lg">
            {post.category.name}
          </Badge>
        </Anchor>
        <Text size="sm" c="dimmed">
          {formatDate(post.createdAt)}
        </Text>
      </Group>
      <Title order={1}>{post.title}</Title>
      <Group gap="xs">
        <Text size="sm" c="dimmed">
          Yazar:
        </Text>
        <Anchor component={Link} to={`/author/${post.author.id}`} size="sm">
          {post.author.name}
        </Anchor>
      </Group>
      {post.excerpt && (
        <Text c="dimmed" fs="italic">
          {post.excerpt}
        </Text>
      )}
      <div
        style={{ lineHeight: 1.7 }}
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </Stack>
  );
}
