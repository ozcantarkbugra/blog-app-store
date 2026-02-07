# Blog App

Full stack blog: React (Mantine UI) + Express + Prisma + PostgreSQL.

## Gereksinimler

- Node.js 18+
- PostgreSQL (yerel)
- npm veya yarn

## Kurulum

### 1. Veritabanı

PostgreSQL yerelde veya Docker'da (örn. `local-postgres`) çalışıyor olabilir. Blog için **ayrı bir veritabanı** (`blog_db`) kullanılıyor.

**Docker ile aynı PostgreSQL kullanıyorsanız** (container: `local-postgres`, kullanıcı: `admin`), önce `blog_db` oluşturun:

```bash
docker exec -it local-postgres psql -U admin -d panorama3d_db -c "CREATE DATABASE blog_db;"
```

(veya pgAdmin ile `admin` ile bağlanıp `blog_db` oluşturun)

### 2. Backend

```bash
cd backend
cp .env.example .env
```

`.env` içinde `DATABASE_URL` hazır: Docker'daki PostgreSQL için `admin` / `password` ve `blog_db` kullanılıyor. Farklı bir instance kullanıyorsanız buna göre düzenleyin.

```bash
npm install
npx prisma generate
npx prisma migrate dev
npm run db:seed
npm run dev
```

Backend varsayılan olarak http://localhost:3000 üzerinde çalışır.

**Projeleri başlatmak için** iki ayrı terminal açın:

**Terminal 1 – Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 – Frontend:**
```bash
cd frontend
npm run dev
```

Alternatif: Windows PowerShell ile `backend\start-dev.ps1` ve `frontend\start-dev.ps1` scriptlerini de kullanabilirsiniz (önce her klasörde `npm install` çalıştırın).

### 3. Frontend

Yeni bir terminalde:

```bash
cd frontend
npm install
npm run dev
```

Frontend http://localhost:5173 üzerinde açılır. API istekleri Vite proxy ile `http://localhost:3000` adresine yönlendirilir (vite.config.ts).

## Proje yapısı

- `backend/` — Express API, Prisma, PostgreSQL
- `frontend/` — React, Vite, Mantine UI
- `BLOG-SYSTEM-PROMPT.md` — Bu yapıyı kuracak AI için sistem promptu
- `.cursor/rules/blog-fullstack.mdc` — Cursor kuralı

## API uç noktaları

- `GET /api/posts` — Yazı listesi (page, limit, category, author)
- `GET /api/posts/:slug` — Tek yazı
- `GET /api/categories` — Kategoriler
- `GET /api/categories/:slug/posts` — Kategorideki yazılar
- `GET /api/authors` — Yazarlar
- `GET /api/authors/:id/posts` — Yazarın yazıları
