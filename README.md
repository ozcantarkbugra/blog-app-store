# Blog App

Full stack blog uygulaması: **React (Mantine UI)** + **Express** + **Prisma** + **PostgreSQL**. Yazı listeleme, kategoriler, yazarlar, manuel yazı ekleme, veri dışa/içe aktarma ve RSS feed’lerinden site güncelleme özellikleriyle çalışır.

## İçindekiler

- [Özellikler](#özellikler)
- [Teknolojiler](#teknolojiler)
- [Gereksinimler](#gereksinimler)
- [Kurulum](#kurulum)
- [Çalıştırma](#çalıştırma)
- [Proje yapısı](#proje-yapısı)
- [API dokümantasyonu (Swagger)](#api-dokümantasyonu-swagger)
- [API uç noktaları](#api-uç-noktaları)
- [Lisans](#lisans)

## Özellikler

- **Okuma:** Ana sayfada yazı listesi, sayfalama, kategori/yazar filtreleri; yazı detay (slug); kategoriler ve yazarlar sayfaları.
- **Yazı ekleme:** Form ile yeni yazı (başlık, slug, özet, içerik, yazar, kategori).
- **Veri yönetimi (Veri sayfası):**
  - **Dışa aktar (Export):** Tüm blog verisini JSON dosyası olarak indirir.
  - **İçe aktar (Import):** Yerel bir JSON dosyasındaki `posts` dizisini içe aktarır.
  - **Siteyi güncelle:** RSS/Atom feed URL’leri ile açık kaynak veya herhangi bir blog sitesinden güncel yazıları çeker; yeni kayıt ekler veya aynı slug’ı günceller.
- **Tema:** Açık/koyu tema değiştirme (navbar’daki buton); tercih tarayıcıda saklanır.
- **Arayüz:** Mantine UI, Plus Jakarta Sans font, responsive layout.

## Teknolojiler

| Katman      | Teknoloji                          |
|------------|-------------------------------------|
| Backend    | Node.js, Express, TypeScript, Prisma |
| Veritabanı | PostgreSQL                         |
| API        | REST (JSON)                        |
| Frontend   | React 18, Vite, TypeScript         |
| UI         | Mantine (core + hooks)             |
| Routing    | React Router v6                    |

## Gereksinimler

- **Node.js** 18+
- **PostgreSQL** (yerel veya Docker)
- **npm** veya yarn

## Kurulum

### 1. Veritabanı

Blog için ayrı bir veritabanı (`blog_db`) kullanılır.

**Docker (örn. `local-postgres`):**
- Kullanıcı: `admin`
- Şifre: `password`
- Varsayılan veritabanı: `panorama3d_db` (bağlanmak için; blog verisi `blog_db` içinde tutulur)

`blog_db` oluşturmak için:

```bash
docker exec -it local-postgres psql -U admin -d panorama3d_db -c "CREATE DATABASE blog_db;"
```

Veya pgAdmin ile `admin` kullanıcısıyla bağlanıp `blog_db` oluşturun.

### 2. Backend

```bash
cd backend
cp .env.example .env
```

`.env` içinde `DATABASE_URL` değerini kendi PostgreSQL bilginize göre düzenleyin. Docker ile `admin` / `password` kullanıyorsanız örnek:

```
DATABASE_URL="postgresql://admin:password@localhost:5432/blog_db"
```

```bash
npm install
npm run db:generate
npm run db:migrate
npm run db:seed
```

- `db:generate` — Prisma Client üretir.
- `db:migrate` — Veritabanı şemasını uygular.
- `db:seed` — Örnek kategoriler, yazarlar ve yazıları ekler.

### 3. Frontend

```bash
cd frontend
npm install
```

## Çalıştırma

İki ayrı terminalde:

**Terminal 1 – Backend (varsayılan port 3000):**

```bash
cd backend
npm run dev
```

**Terminal 2 – Frontend (varsayılan port 5173):**

```bash
cd frontend
npm run dev
```

Tarayıcıda **http://localhost:5173** adresini açın. API istekleri Vite proxy ile `http://localhost:3000` adresine gider.

**Alternatif (Windows PowerShell):** `backend\start-dev.ps1` ve `frontend\start-dev.ps1` (önce ilgili klasörde `npm install` yapın).

## Proje yapısı

```
blog-app/
├── backend/           # Express API
│   ├── prisma/        # Şema, migration, seed
│   └── src/           # Route'lar, lib
├── frontend/          # React + Vite + Mantine
│   └── src/           # Sayfalar, bileşenler, api, theme
├── .cursor/rules/     # Cursor kuralı (blog-fullstack.mdc)
├── .gitignore
├── BLOG-SYSTEM-PROMPT.md   # Bu yapıyı kuracak AI için sistem promptu
└── README.md
```

## API dokümantasyonu (Swagger)

Backend çalışırken tarayıcıda şu adresi açın:

- **http://localhost:3000/api-docs**

Tüm REST uç noktaları, parametreler ve örnek yanıtlar Swagger UI üzerinden görüntülenebilir ve test edilebilir.

## API uç noktaları

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api/health` | Sağlık kontrolü |
| GET | `/api/posts` | Yazı listesi (`?page`, `limit`, `category`, `author`, `all`) |
| GET | `/api/posts/export` | Tüm yazıları JSON olarak döndürür |
| POST | `/api/posts/import` | JSON ile toplu yazı içe aktarır |
| POST | `/api/posts/fetch-feeds` | RSS/Atom feed’lerinden yazı çeker |
| GET | `/api/posts/:slug` | Tek yazı (slug ile) |
| POST | `/api/posts` | Yeni yazı oluşturur |
| PUT | `/api/posts/:id` | Yazı günceller |
| DELETE | `/api/posts/:id` | Yazı siler |
| GET | `/api/categories` | Kategoriler listesi |
| GET | `/api/categories/:slug/posts` | Kategorideki yazılar |
| GET | `/api/authors` | Yazarlar listesi |
| GET | `/api/authors/:id/posts` | Yazarın yazıları |

## Lisans

Bu proje eğitim/kişisel kullanım içindir.
