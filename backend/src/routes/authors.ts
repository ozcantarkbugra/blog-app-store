import { Router } from "express";
import { prisma } from "../lib/prisma.js";

export const authorsRouter = Router();

authorsRouter.get("/", async (_req, res) => {
  try {
    const authors = await prisma.author.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { posts: true } } },
    });
    res.json(authors);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to fetch authors" });
  }
});

authorsRouter.get("/:id/posts", async (req, res) => {
  try {
    const id = req.params.id;
    const page = Math.max(1, parseInt(String(req.query.page), 10) || 1);
    const limit = Math.min(20, Math.max(1, parseInt(String(req.query.limit), 10) || 10));
    const skip = (page - 1) * limit;

    const author = await prisma.author.findUnique({ where: { id } });
    if (!author) {
      return res.status(404).json({ error: "Author not found" });
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where: { authorId: id, published: true },
        include: { author: true, category: true },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.post.count({ where: { authorId: id, published: true } }),
    ]);

    res.json({
      data: posts,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
      author: {
        id: author.id,
        name: author.name,
        email: author.email,
        bio: author.bio,
        avatarUrl: author.avatarUrl,
      },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to fetch author posts" });
  }
});
