import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const tech = await prisma.category.upsert({
    where: { slug: "teknik" },
    update: {},
    create: { name: "Teknik", slug: "teknik" },
  });
  const life = await prisma.category.upsert({
    where: { slug: "yasam" },
    update: {},
    create: { name: "Yaşam", slug: "yasam" },
  });
  const dev = await prisma.category.upsert({
    where: { slug: "yazilim" },
    update: {},
    create: { name: "Yazılım", slug: "yazilim" },
  });

  const author1 = await prisma.author.upsert({
    where: { email: "yazar@blog.local" },
    update: {},
    create: {
      name: "Ayşe Yazar",
      email: "yazar@blog.local",
      bio: "Full stack geliştirici ve blog yazarı.",
    },
  });
  const author2 = await prisma.author.upsert({
    where: { email: "mehmet@blog.local" },
    update: {},
    create: {
      name: "Mehmet Demir",
      email: "mehmet@blog.local",
      bio: "Frontend ve React meraklısı.",
    },
  });

  const posts = [
    {
      title: "React ile Modern Web Geliştirme",
      slug: "react-ile-modern-web-gelistirme",
      excerpt: "React ve Mantine UI kullanarak hızlı ve güzel arayüzler oluşturmanın temelleri.",
      content: `
        <p>React, kullanıcı arayüzü oluşturmak için yaygın kullanılan bir kütüphanedir. Bileşen tabanlı yapısı sayesinde tekrar kullanılabilir ve bakımı kolay kod yazmanıza olanak tanır.</p>
        <p>Mantine UI ise hazır bileşenler sunarak geliştirme sürecini hızlandırır. Formlar, kartlar, navigasyon ve daha fazlası için tutarlı bir tasarım sistemi sağlar.</p>
        <p>Bu yazıda Vite ile kurulum, React Router ve Mantine entegrasyonundan bahsedeceğiz.</p>
      `,
      published: true,
      authorId: author1.id,
      categoryId: dev.id,
    },
    {
      title: "PostgreSQL ve Prisma ORM",
      slug: "postgresql-ve-prisma-orm",
      excerpt: "Node.js projelerinde PostgreSQL veritabanını Prisma ile yönetmek.",
      content: `
        <p>PostgreSQL güçlü ve açık kaynak bir ilişkisel veritabanıdır. Prisma ise TypeScript/Node.js için tip güvenli bir ORM sağlar.</p>
        <p>Schema tanımlayarak modellerinizi oluşturur, migration ile veritabanını güncellersiniz. Otomatik üretilen client ile type-safe sorgular yazarsınız.</p>
        <p>Bu yazıda schema.prisma, migrate ve seed script'lerinden bahsedeceğiz.</p>
      `,
      published: true,
      authorId: author1.id,
      categoryId: tech.id,
    },
    {
      title: "REST API Tasarımı",
      slug: "rest-api-tasarimi",
      excerpt: "Express ile RESTful API geliştirme ve pagination, filtreleme örnekleri.",
      content: `
        <p>REST, HTTP üzerinde kaynak odaklı bir API tasarım yaklaşımıdır. GET, POST, PUT, DELETE gibi metodlarla CRUD işlemleri yapılır.</p>
        <p>Sayfalama için <code>?page=1&limit=10</code>, filtreleme için <code>?category=slug</code> gibi query parametreleri kullanılabilir.</p>
        <p>Bu yazıda Express route'ları, hata yönetimi ve JSON yanıt formatlarından bahsedeceğiz.</p>
      `,
      published: true,
      authorId: author2.id,
      categoryId: tech.id,
    },
    {
      title: "Üretkenlik İpuçları",
      slug: "uretenlik-ipuclari",
      excerpt: "Günlük geliştirme rutininde zaman kazandıran alışkanlıklar.",
      content: `
        <p>Küçük commit'ler, anlamlı branch isimleri ve dokümantasyon yazmak uzun vadede büyük kazanım sağlar.</p>
        <p>Otomasyon ve kısayollar kullanarak tekrarlayan işleri azaltabilirsiniz. Test yazmak da hata oranını düşürür.</p>
      `,
      published: true,
      authorId: author2.id,
      categoryId: life.id,
    },
  ];

  for (const post of posts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {},
      create: post,
    });
  }

  console.log("Seed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
