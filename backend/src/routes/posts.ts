import { Router } from "express";
import Parser from "rss-parser";
import { prisma } from "../lib/prisma.js";

const parser = new Parser();

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80) || "post";
}

function makeSlugUnique(base: string, id: string): string {
  const hash = id ? String(Math.abs(id.split("").reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0))).slice(0, 8) : "";
  return hash ? `${base}-${hash}` : base;
}

export const postsRouter = Router();

postsRouter.get("/", async (req, res) => {
  try {
    const page = Math.max(1, parseInt(String(req.query.page), 10) || 1);
    const limit = Math.min(20, Math.max(1, parseInt(String(req.query.limit), 10) || 10));
    const skip = (page - 1) * limit;
    const categorySlug = String(req.query.category ?? "").trim();
    const authorId = String(req.query.author ?? "").trim();

    const all = String(req.query.all).toLowerCase() === "true";
    const where: { published?: boolean; category?: { slug: string }; authorId?: string } = all ? {} : { published: true };
    if (categorySlug) where.category = { slug: categorySlug };
    if (authorId) where.authorId = authorId;

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: { author: true, category: true },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.post.count({ where }),
    ]);

    res.json({
      data: posts,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

// Export: tum yazilari JSON olarak indir
postsRouter.get("/export", async (_req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: { author: true, category: true },
      orderBy: { createdAt: "desc" },
    });
    res.setHeader("Content-Disposition", 'attachment; filename="blog-export.json"');
    res.json({ exportedAt: new Date().toISOString(), posts });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Export failed" });
  }
});

// Import: JSON ile toplu yazi ekleme
postsRouter.post("/import", async (req, res) => {
  try {
    const body = req.body as { posts?: Array<{ title: string; slug: string; excerpt?: string; content: string; authorId: string; categoryId: string; published?: boolean }> };
    const items = body?.posts ?? [];
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Body must include a 'posts' array with at least one item" });
    }
    const created = [];
    for (const p of items) {
      if (!p.title || !p.slug || !p.content || !p.authorId || !p.categoryId) continue;
      const post = await prisma.post.upsert({
        where: { slug: p.slug },
        update: { title: p.title, excerpt: p.excerpt ?? null, content: p.content, authorId: p.authorId, categoryId: p.categoryId, published: p.published ?? true },
        create: { title: p.title, slug: p.slug, excerpt: p.excerpt ?? null, content: p.content, authorId: p.authorId, categoryId: p.categoryId, published: p.published ?? true },
      });
      created.push(post);
    }
    res.json({ imported: created.length, data: created });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Import failed" });
  }
});

// Feed'lerden yazi cek (RSS/Atom - acik kaynak blog siteleri)
postsRouter.post("/fetch-feeds", async (req, res) => {
  try {
    const body = req.body as { feedUrls?: string[]; authorId: string; categoryId: string };
    const urls = Array.isArray(body?.feedUrls) ? body.feedUrls.filter((u) => typeof u === "string" && u.trim()) : [];
    const authorId = body?.authorId?.trim();
    const categoryId = body?.categoryId?.trim();
    if (!urls.length || !authorId || !categoryId) {
      return res.status(400).json({ error: "feedUrls (dizi), authorId ve categoryId zorunludur" });
    }
    const author = await prisma.author.findUnique({ where: { id: authorId } });
    const category = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!author || !category) {
      return res.status(400).json({ error: "Geçersiz authorId veya categoryId" });
    }
    let added = 0;
    let updated = 0;
    const errors: string[] = [];
    for (const feedUrl of urls) {
      try {
        const feed = await parser.parseURL(feedUrl);
        for (const item of feed.items) {
          const title = (item.title || "Başlıksız").trim();
          const content = item.contentSnippet || item.content || item.link || "";
          const excerpt = content.slice(0, 300).trim();
          const baseSlug = slugify(title);
          const slug = makeSlugUnique(baseSlug, item.guid || item.link || title);
          const existing = await prisma.post.findUnique({ where: { slug } });
          if (existing) {
            await prisma.post.update({
              where: { slug },
              data: { title, excerpt, content: content.slice(0, 50000), updatedAt: new Date() },
            });
            updated += 1;
          } else {
            await prisma.post.create({
              data: { title, slug, excerpt, content: content.slice(0, 50000), authorId, categoryId, published: true },
            });
            added += 1;
          }
        }
      } catch (err) {
        errors.push(`${feedUrl}: ${err instanceof Error ? err.message : "Bilinmeyen hata"}`);
      }
    }
    res.json({ added, updated, total: added + updated, errors: errors.length ? errors : undefined });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Feed'lerden veri çekilemedi" });
  }
});

// Tek yazi: slug ile (export/import'tan sonra tanimlanmali)
postsRouter.get("/:slug", async (req, res) => {
  try {
    const slug = req.params.slug;
    const post = await prisma.post.findFirst({
      where: { slug, published: true },
      include: { author: true, category: true },
    });
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.json(post);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to fetch post" });
  }
});

// Yeni yazi ekle
postsRouter.post("/", async (req, res) => {
  try {
    const body = req.body as { title: string; slug: string; excerpt?: string; content: string; coverImage?: string; authorId: string; categoryId: string; published?: boolean };
    if (!body.title || !body.slug || !body.content || !body.authorId || !body.categoryId) {
      return res.status(400).json({ error: "title, slug, content, authorId, categoryId are required" });
    }
    const post = await prisma.post.create({
      data: {
        title: body.title,
        slug: body.slug,
        excerpt: body.excerpt ?? null,
        content: body.content,
        coverImage: body.coverImage ?? null,
        published: body.published ?? true,
        authorId: body.authorId,
        categoryId: body.categoryId,
      },
      include: { author: true, category: true },
    });
    res.status(201).json(post);
  } catch (e: unknown) {
    const msg = e && typeof e === "object" && "code" in e && (e as { code: string }).code === "P2002" ? "Bu slug zaten kullaniliyor" : "Failed to create post";
    console.error(e);
    res.status(500).json({ error: msg });
  }
});

// Yazi guncelle
postsRouter.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body as { title?: string; slug?: string; excerpt?: string; content?: string; coverImage?: string; authorId?: string; categoryId?: string; published?: boolean };
    const post = await prisma.post.update({
      where: { id },
      data: {
        ...(body.title != null && { title: body.title }),
        ...(body.slug != null && { slug: body.slug }),
        ...(body.excerpt != null && { excerpt: body.excerpt }),
        ...(body.content != null && { content: body.content }),
        ...(body.coverImage != null && { coverImage: body.coverImage }),
        ...(body.authorId != null && { authorId: body.authorId }),
        ...(body.categoryId != null && { categoryId: body.categoryId }),
        ...(body.published != null && { published: body.published }),
      },
      include: { author: true, category: true },
    });
    res.json(post);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to update post" });
  }
});

// Yazi sil
postsRouter.delete("/:id", async (req, res) => {
  try {
    await prisma.post.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to delete post" });
  }
});
