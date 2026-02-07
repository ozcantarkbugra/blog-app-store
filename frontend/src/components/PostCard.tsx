import { Card, Text, Group, Badge, Stack } from "@mantine/core";
import { Link } from "react-router-dom";
import type { Post } from "../api/types";

interface PostCardProps {
  post: Post;
}

function formatDate(s: string) {
  return new Date(s).toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Card
      component={Link}
      to={`/post/${post.slug}`}
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <Stack gap="xs">
        <Group justify="space-between" wrap="nowrap">
          <Badge variant="light" size="sm">
            {post.category.name}
          </Badge>
          <Text size="xs" c="dimmed">
            {formatDate(post.createdAt)}
          </Text>
        </Group>
        <Text fw={600} lineClamp={2}>
          {post.title}
        </Text>
        {post.excerpt && (
          <Text size="sm" c="dimmed" lineClamp={2}>
            {post.excerpt}
          </Text>
        )}
        <Text size="xs" c="dimmed">
          {post.author.name}
        </Text>
      </Stack>
    </Card>
  );
}
