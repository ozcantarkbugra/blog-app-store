# Blog Sitesi – Sistem Promptu

Bu doküman, **React (Mantine UI) + Node.js (Express) + PostgreSQL** ile tam donanımlı bir blog sitesi yapısını kurmak için AI’ya verilebilecek sistem promptudur. Projeyi sıfırdan kurmak veya benzer bir yapıyı oluşturmak istediğinizde bu metni kullanabilirsiniz.

---

## Projenin amacı

- **Frontend**: React 18, Vite, TypeScript, Mantine UI, React Router v6. Veriler REST API’den çekilir.
- **Backend**: Node.js, Express, TypeScript, Prisma ORM. Veritabanı: PostgreSQL (yerel).
- **Auth**: Yok. Sadece public API ve public sayfalar.

---

## Backend yapısı

- **Klasör**: `backend/`
- **Bağımlılıklar**: express, cors, dotenv, @prisma/client; dev: prisma, tsx, typescript, @types/node, @types/express, @types/cors
- **Prisma**: `backend/prisma/schema.prisma` — PostgreSQL provider
- **Modeller**:
  - **Author**: id, name, email, bio?, avatarUrl?
  - **Category**: id, name, slug (unique)
  - **Post**: id, title, slug (unique), excerpt?, content, coverImage?, published, authorId, categoryId, createdAt, updatedAt. İlişkiler: Post → Author (many-to-one), Post → Category (many-to-one)
- **Sunucu**: `backend/src/index.ts` — Express app, CORS, JSON body parser; route’lar `/api/posts`, `/api/categories`, `/api/authors` altında mount edilir.
- **REST uç noktaları**:
  - `GET /api/posts` — liste; query: `page`, `limit`, `category` (slug), `author` (id)
  - `GET /api/posts/:slug` — tek yazı (slug ile)
  - `GET /api/categories` — tüm kategoriler (post sayısı ile)
  - `GET /api/categories/:slug/posts` — o kategorideki yazılar; query: `page`, `limit`
  - `GET /api/authors` — tüm yazarlar
  - `GET /api/authors/:id/posts` — o yazarın yazıları; query: `page`, `limit`
- **Ortam**: `backend/.env` — `DATABASE_URL="postgresql://user:password@localhost:5432/blog_db"`, isteğe bağlı `PORT=3000`
- **Seed**: `backend/prisma/seed.ts` — örnek kategoriler, yazarlar ve yazılar (Prisma `seed` script ile çalıştırılır)

---

## Frontend yapısı

- **Klasör**: `frontend/`
- **Bağımlılıklar**: react, react-dom, react-router-dom, @mantine/core, @mantine/hooks; dev: vite, @vitejs/plugin-react, typescript, @types/react, @types/react-dom
- **Giriş**: `frontend/src/main.tsx` — React, MantineProvider, BrowserRouter
- **Route’lar**: `frontend/src/App.tsx` — `/` (ana sayfa), `/post/:slug`, `/category/:slug`, `/author/:id`, `/categories`
- **API client**: `frontend/src/api/` — base URL (`VITE_API_URL` veya boş; proxy ile `/api`), `getPosts`, `getPostBySlug`, `getCategories`, `getCategoryPosts`, `getAuthors`, `getAuthorPosts`
- **Sayfalar**: Home (yazı listesi, sayfalama, kategori listesi), PostDetail (slug ile tek yazı, HTML içerik), CategoryPage, AuthorPage, Categories (kategori listesi)
- **Bileşenler**: Layout (AppShell, header, linkler), PostCard, CategoryList
- **Ortam**: `frontend/.env` — `VITE_API_URL=http://localhost:3000` (veya Vite proxy kullanılıyorsa boş bırakılabilir)

---

## PostgreSQL ve kurulum

1. Yerelde PostgreSQL çalışır olsun; `blog_db` veritabanı oluşturulur (`createdb blog_db` veya pgAdmin).
2. `backend/.env` içinde `DATABASE_URL` bu veritabanına işaret etsin.
3. Backend: `cd backend && npm install && npx prisma generate && npx prisma migrate dev && npm run db:seed`
4. Frontend: `cd frontend && npm install`
5. Çalıştırma: Backend `npm run dev` (port 3000), Frontend `npm run dev` (port 5173). Frontend’de API istekleri `VITE_API_URL` ile veya Vite proxy ile backend’e gider.

---

## İstenen davranış

- TypeScript strict mod; anlamlı değişken ve dosya isimleri.
- API hatalarında uygun HTTP status ve JSON hata mesajı; frontend’de loading ve error state’leri mutlaka gösterilsin.
- Arayüz responsive olsun; Mantine Container, Grid/SimpleGrid, breakpoint’ler kullanılsın.
- Yeni özellik eklenirken: backend’de schema/route, frontend’de api fonksiyonu + sayfa/bileşen birlikte güncellensin.

---

Bu prompt’u okuyan AI, yukarıdaki yapıya uygun bir blog projesini sıfırdan kurabilir veya mevcut projeyi bu spesifikasyona göre güncelleyebilir.
