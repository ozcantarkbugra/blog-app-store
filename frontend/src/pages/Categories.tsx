import { useEffect, useState } from "react";
import { Title, Loader, Alert, Group } from "@mantine/core";
import { CategoryList } from "../components/CategoryList";
import { getCategories } from "../api";
import type { CategoryWithCount } from "../api/types";

export function Categories() {
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch((e) => setError(e instanceof Error ? e.message : "Kategoriler yüklenemedi"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Group justify="center" py="xl">
        <Loader />
      </Group>
    );
  }

  if (error) {
    return (
      <Alert color="red" title="Hata">
        {error}
      </Alert>
    );
  }

  return (
    <>
      <Title order={1} mb="md">
        Kategoriler
      </Title>
      <CategoryList categories={categories} />
    </>
  );
}
