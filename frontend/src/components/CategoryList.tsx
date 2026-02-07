import { Group, Badge, Anchor } from "@mantine/core";
import { Link } from "react-router-dom";
import type { CategoryWithCount } from "../api/types";

interface CategoryListProps {
  categories: CategoryWithCount[];
}

export function CategoryList({ categories }: CategoryListProps) {
  return (
    <Group gap="xs">
      {categories.map((c) => (
        <Anchor key={c.id} component={Link} to={`/category/${c.slug}`}>
          <Badge variant="outline" size="lg">
            {c.name} ({c._count.posts})
          </Badge>
        </Anchor>
      ))}
    </Group>
  );
}
