import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Title, TextInput, Textarea, Select, Checkbox, Button, Stack, Alert, Loader, Group } from "@mantine/core";
import { getCategories, getAuthors, createPost } from "../api";
import type { CategoryWithCount } from "../api/types";
import type { AuthorWithCount } from "../api/types";

export function PostNew() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [authors, setAuthors] = useState<AuthorWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [authorId, setAuthorId] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [published, setPublished] = useState(true);

  useEffect(() => {
    Promise.all([getCategories(), getAuthors()])
      .then(([cats, auths]) => {
        setCategories(cats);
        setAuthors(auths);
        if (auths.length > 0 && !authorId) setAuthorId(auths[0].id);
        if (cats.length > 0 && !categoryId) setCategoryId(cats[0].id);
      })
      .catch(() => setError("Kategoriler veya yazarlar yüklenemedi"))
      .finally(() => setLoading(false));
  }, []);

  const handleSlugFromTitle = () => {
    const s = title
      .toLowerCase()
      .replace(/ğ/g, "g")
      .replace(/ü/g, "u")
      .replace(/ş/g, "s")
      .replace(/ı/g, "i")
      .replace(/ö/g, "o")
      .replace(/ç/g, "c")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    setSlug(s);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim() || !content.trim() || !authorId || !categoryId) {
      setError("Başlık, slug, içerik, yazar ve kategori zorunludur.");
      return;
    }
    setSubmitting(true);
    setError(null);
    createPost({
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim() || undefined,
      content: content.trim(),
      authorId,
      categoryId,
      published,
    })
      .then((post) => navigate(`/post/${post.slug}`))
      .catch((e) => setError(e instanceof Error ? e.message : "Kayıt başarısız"))
      .finally(() => setSubmitting(false));
  };

  if (loading) {
    return (
      <Group justify="center" py="xl">
        <Loader />
      </Group>
    );
  }

  return (
    <Stack gap="md">
      <Title order={1}>Yeni Yazı Ekle</Title>
      {error && (
        <Alert color="red" onClose={() => setError(null)} withCloseButton>
          {error}
        </Alert>
      )}
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <TextInput label="Başlık" placeholder="Yazı başlığı" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <Group gap="xs">
            <TextInput
              label="Slug (URL)"
              placeholder="yazi-url"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
              style={{ flex: 1 }}
            />
            <Button variant="light" size="sm" mt="xl" onClick={handleSlugFromTitle}>
              Başlıktan üret
            </Button>
          </Group>
          <Textarea label="Özet (isteğe bağlı)" placeholder="Kısa özet" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} minRows={2} />
          <Textarea label="İçerik" placeholder="Yazı içeriği (HTML kullanabilirsiniz)" value={content} onChange={(e) => setContent(e.target.value)} required minRows={8} />
          <Select label="Yazar" data={authors.map((a) => ({ value: a.id, label: a.name }))} value={authorId} onChange={setAuthorId} required />
          <Select label="Kategori" data={categories.map((c) => ({ value: c.id, label: c.name }))} value={categoryId} onChange={setCategoryId} required />
          <Checkbox label="Yayında" checked={published} onChange={(e) => setPublished(e.target.checked)} />
          <Group>
            <Button type="submit" loading={submitting}>
              Kaydet
            </Button>
            <Button variant="subtle" onClick={() => navigate("/")}>
              İptal
            </Button>
          </Group>
        </Stack>
      </form>
    </Stack>
  );
}
