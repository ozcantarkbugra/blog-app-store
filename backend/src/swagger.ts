export const openApiSpec = {
  openapi: "3.0.0",
  info: { title: "Blog API", version: "1.0.0", description: "REST API for the blog app." },
  servers: [{ url: "http://localhost:3000", description: "Yerel sunucu" }],
  paths: {
    "/api/health": {
      get: {
        summary: "Sağlık kontrolü",
        responses: { 200: { description: "OK", content: { "application/json": { schema: { type: "object", properties: { ok: { type: "boolean" }, message: { type: "string" } } } } } },
      },
    },
    "/api/posts": {
      get: {
        summary: "Yazı listesi",
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
          { name: "category", in: "query", description: "Kategori slug", schema: { type: "string" } },
          { name: "author", in: "query", description: "Yazar id", schema: { type: "string" } },
          { name: "all", in: "query", description: "Yayında olmayanlar dahil", schema: { type: "string", enum: ["true", "false"] } },
        ],
        responses: { 200: { description: "data + meta (page, limit, total, totalPages)" } },
      },
      post: {
        summary: "Yeni yazı oluştur",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["title", "slug", "content", "authorId", "categoryId"],
                properties: {
                  title: { type: "string" },
                  slug: { type: "string" },
                  excerpt: { type: "string" },
                  content: { type: "string" },
                  coverImage: { type: "string" },
                  authorId: { type: "string" },
                  categoryId: { type: "string" },
                  published: { type: "boolean", default: true },
                },
              },
            },
          },
        },
        responses: { 201: { description: "Oluşturulan yazı" }, 400: { description: "Eksik alan" }, 500: { description: "Hata" } },
      },
    },
    "/api/posts/export": {
      get: {
        summary: "Tüm yazıları JSON olarak döndürür (indirme)",
        responses: { 200: { description: "exportedAt + posts dizisi" } },
      },
    },
    "/api/posts/import": {
      post: {
        summary: "JSON ile toplu yazı içe aktar",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["posts"],
                properties: {
                  posts: {
                    type: "array",
                    items: {
                      type: "object",
                      required: ["title", "slug", "content", "authorId", "categoryId"],
                      properties: { title: { type: "string" }, slug: { type: "string" }, excerpt: { type: "string" }, content: { type: "string" }, authorId: { type: "string" }, categoryId: { type: "string" }, published: { type: "boolean" } },
                    },
                  },
                },
              },
            },
          },
        },
        responses: { 200: { description: "imported + data" }, 400: { description: "Geçersiz body" } },
      },
    },
    "/api/posts/fetch-feeds": {
      post: {
        summary: "RSS/Atom feed'lerinden yazı çeker",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["feedUrls", "authorId", "categoryId"],
                properties: {
                  feedUrls: { type: "array", items: { type: "string" }, description: "RSS/Atom feed URL'leri" },
                  authorId: { type: "string" },
                  categoryId: { type: "string" },
                },
              },
            },
          },
        },
        responses: { 200: { description: "added, updated, total, errors?" }, 400: { description: "Eksik parametre veya geçersiz id" } },
      },
    },
    "/api/posts/{slug}": {
      get: {
        summary: "Tek yazı (slug ile)",
        parameters: [{ name: "slug", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Yazı nesnesi" }, 404: { description: "Bulunamadı" } },
      },
    },
    "/api/posts/{id}": {
      put: {
        summary: "Yazı güncelle",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: { content: { "application/json": { schema: { type: "object", properties: { title: { type: "string" }, slug: { type: "string" }, excerpt: { type: "string" }, content: { type: "string" }, authorId: { type: "string" }, categoryId: { type: "string" }, published: { type: "boolean" } } } } } } },
        responses: { 200: { description: "Güncellenen yazı" }, 500: { description: "Hata" } },
      },
      delete: {
        summary: "Yazı sil",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 204: { description: "Silindi" }, 500: { description: "Hata" } },
      },
    },
    "/api/categories": {
      get: {
        summary: "Kategoriler listesi",
        responses: { 200: { description: "Kategori dizisi (_count.posts ile)" } },
      },
    },
    "/api/categories/{slug}/posts": {
      get: {
        summary: "Kategorideki yazılar",
        parameters: [
          { name: "slug", in: "path", required: true, schema: { type: "string" } },
          { name: "page", in: "query", schema: { type: "integer" } },
          { name: "limit", in: "query", schema: { type: "integer" } },
        ],
        responses: { 200: { description: "data, meta, category" }, 404: { description: "Kategori bulunamadı" } },
      },
    },
    "/api/authors": {
      get: {
        summary: "Yazarlar listesi",
        responses: { 200: { description: "Yazar dizisi (_count.posts ile)" } },
      },
    },
    "/api/authors/{id}/posts": {
      get: {
        summary: "Yazarın yazıları",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
          { name: "page", in: "query", schema: { type: "integer" } },
          { name: "limit", in: "query", schema: { type: "integer" } },
        ],
        responses: { 200: { description: "data, meta, author" }, 404: { description: "Yazar bulunamadı" } },
      },
    },
  },
};
