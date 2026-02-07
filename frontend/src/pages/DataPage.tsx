import { useState, useEffect } from "react";
import {
  Title,
  Button,
  Stack,
  Alert,
  Text,
  Card,
  SimpleGrid,
  ThemeIcon,
  Divider,
  Paper,
  List,
  Box,
  Group,
  FileButton,
  Textarea,
  Select,
} from "@mantine/core";
import { exportPosts, importPosts, fetchFeeds, getCategories, getAuthors } from "../api";
import type { ImportPostItem } from "../api";
import type { CategoryWithCount } from "../api/types";
import type { AuthorWithCount } from "../api/types";

const PRESET_FEEDS = [
  "https://dev.to/feed",
  "https://css-tricks.com/feed/",
  "https://blog.angular.io/feed/",
];

export function DataPage() {
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [feedUrls, setFeedUrls] = useState("");
  const [authorId, setAuthorId] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [authors, setAuthors] = useState<AuthorWithCount[]>([]);

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {});
    getAuthors().then((a) => {
      setAuthors(a);
      if (a.length > 0 && !authorId) setAuthorId(a[0].id);
    }).catch(() => {});
  }, []);
  useEffect(() => {
    if (categories.length > 0 && !categoryId) setCategoryId(categories[0].id);
  }, [categories]);

  const handleExport = () => {
    setExporting(true);
    setMessage(null);
    exportPosts()
      .then((data) => {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `blog-export-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        setMessage({ type: "success", text: `${data.posts.length} yazı indirildi.` });
      })
      .catch((e) => setMessage({ type: "error", text: e instanceof Error ? e.message : "İndirme başarısız" }))
      .finally(() => setExporting(false));
  };

  const handleImport = (file: File | null) => {
    if (!file) return;
    setImporting(true);
    setMessage(null);
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const json = JSON.parse(reader.result as string);
        const posts: ImportPostItem[] = Array.isArray(json.posts) ? json.posts : Array.isArray(json) ? json : [];
        if (posts.length === 0) {
          setMessage({ type: "error", text: "Geçerli bir 'posts' dizisi bulunamadı." });
          setImporting(false);
          return;
        }
        importPosts(posts)
          .then((res) => setMessage({ type: "success", text: `${res.imported} yazı içe aktarıldı.` }))
          .catch((e) => setMessage({ type: "error", text: e instanceof Error ? e.message : "İçe aktarma başarısız" }))
          .finally(() => setImporting(false));
      } catch {
        setMessage({ type: "error", text: "Geçersiz JSON dosyası." });
        setImporting(false);
      }
    };
    reader.readAsText(file);
  };

  const handleFetchFeeds = () => {
    const urls = feedUrls.split("\n").map((u) => u.trim()).filter(Boolean);
    if (!urls.length) {
      setMessage({ type: "error", text: "En az bir RSS/Atom feed adresi girin." });
      return;
    }
    if (!authorId || !categoryId) {
      setMessage({ type: "error", text: "Yazar ve kategori seçin." });
      return;
    }
    setFetching(true);
    setMessage(null);
    fetchFeeds({ feedUrls: urls, authorId, categoryId })
      .then((res) => {
        const parts = [];
        if (res.added) parts.push(`${res.added} yeni yazı eklendi`);
        if (res.updated) parts.push(`${res.updated} yazı güncellendi`);
        if (res.errors?.length) parts.push(`${res.errors.length} feed hatası`);
        setMessage({
          type: res.total > 0 ? "success" : "error",
          text: parts.length ? parts.join(". ") : "Hiç yazı gelmedi. Feed URL'lerini kontrol edin.",
        });
      })
      .catch((e) => setMessage({ type: "error", text: e instanceof Error ? e.message : "Site güncellenemedi" }))
      .finally(() => setFetching(false));
  };

  const fillPresetFeeds = () => setFeedUrls(PRESET_FEEDS.join("\n"));

  return (
    <Stack gap="xl">
      <Box>
        <Title order={1} mb="xs">
          Veri Yönetimi
        </Title>
        <Text size="sm" c="dimmed" maw={560}>
          Blog verisini indirin, JSON ile içe aktarın veya açık kaynak blog sitelerinden RSS ile güncel yazıları çekin.
        </Text>
      </Box>

      {message && (
        <Alert
          color={message.type === "success" ? "green" : "red"}
          onClose={() => setMessage(null)}
          withCloseButton
          title={message.type === "success" ? "İşlem başarılı" : "Hata"}
          radius="md"
        >
          {message.text}
        </Alert>
      )}

      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="md">
            <Group gap="sm">
              <ThemeIcon size="lg" radius="md" variant="light" color="blue">
                <span style={{ fontSize: "1.25rem" }}>↓</span>
              </ThemeIcon>
              <div>
                <Text fw={600} size="lg">
                  Dışa aktar (Export)
                </Text>
                <Text size="xs" c="dimmed">
                  Tüm yazıları JSON dosyası olarak indir
                </Text>
              </div>
            </Group>
            <Button fullWidth loading={exporting} onClick={handleExport} variant="light">
              Veriyi indir
            </Button>
          </Stack>
        </Card>

        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="md">
            <Group gap="sm">
              <ThemeIcon size="lg" radius="md" variant="light" color="teal">
                <span style={{ fontSize: "1.25rem" }}>↑</span>
              </ThemeIcon>
              <div>
                <Text fw={600} size="lg">
                  İçe aktar (Import)
                </Text>
                <Text size="xs" c="dimmed">
                  JSON dosyasından yazıları yükle
                </Text>
              </div>
            </Group>
            <FileButton onChange={handleImport} accept="application/json,.json">
              {(props) => (
                <Button fullWidth {...props} loading={importing} variant="light" color="teal">
                  Dosya seç ve içe aktar
                </Button>
              )}
            </FileButton>
          </Stack>
        </Card>
      </SimpleGrid>

      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Stack gap="md">
          <Group gap="sm">
            <ThemeIcon size="lg" radius="md" variant="light" color="orange">
              <span style={{ fontSize: "1.25rem" }}>🔄</span>
            </ThemeIcon>
            <div>
              <Text fw={600} size="lg">
                Siteyi güncelle (RSS / blog sitelerinden)
              </Text>
              <Text size="xs" c="dimmed">
                Açık kaynak veya herhangi bir blog sitesinin RSS/Atom feed adresini girin; güncel yazılar sitenize eklensin.
              </Text>
            </div>
          </Group>
          <Textarea
            label="Feed adresleri (her satıra bir URL)"
            placeholder="https://example.com/feed.xml"
            value={feedUrls}
            onChange={(e) => setFeedUrls(e.target.value)}
            minRows={3}
          />
          <Group gap="xs">
            <Button variant="subtle" size="xs" onClick={fillPresetFeeds}>
              Örnek feed'leri doldur
            </Button>
          </Group>
          <Select
            label="Yazar (eklenen yazılar bu yazara atanır)"
            data={authors.map((a) => ({ value: a.id, label: a.name }))}
            value={authorId}
            onChange={setAuthorId}
          />
          <Select
            label="Kategori (eklenen yazılar bu kategoriye atanır)"
            data={categories.map((c) => ({ value: c.id, label: c.name }))}
            value={categoryId}
            onChange={setCategoryId}
          />
          <Button fullWidth loading={fetching} onClick={handleFetchFeeds} color="orange" variant="light">
            Siteyi güncelle
          </Button>
        </Stack>
      </Card>

      <Divider label="Format bilgisi" labelPosition="left" />

      <Paper p="md" radius="md" withBorder variant="light">
        <Text size="sm" fw={500} mb="xs">
          Beklenen JSON yapısı
        </Text>
        <List size="sm" c="dimmed" spacing="xs">
          <List.Item>
            <Text component="span" size="sm">
              Dışa aktarma: <Code>{"{ exportedAt, posts: [...] }"}</Code>
            </Text>
          </List.Item>
          <List.Item>
            <Text component="span" size="sm">
              İçe aktarma: Dosyada <Code>posts</Code> dizisi; her öğede <Code>title</Code>, <Code>slug</Code>, <Code>content</Code>, <Code>authorId</Code>, <Code>categoryId</Code> olmalı.
            </Text>
          </List.Item>
          <List.Item>
            <Text component="span" size="sm">
              Siteyi güncelle: RSS/Atom feed URL’leri (her satıra bir adres). Aynı slug’a sahip yazılar güncellenir, yeniler eklenir.
            </Text>
          </List.Item>
        </List>
      </Paper>
    </Stack>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <Text component="code" size="xs" fw={500} c="dimmed" px={6} py={2} style={{ borderRadius: 4, backgroundColor: "var(--mantine-color-default-hover)" }} inherit>
      {children}
    </Text>
  );
}
