import { Router } from "express";
import { prisma } from "../lib/prisma.js";

export const categoriesRouter = Router();

categoriesRouter.get("/", async (_req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { posts: true } } },
    });
    res.json(categories);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

categoriesRouter.get("/:slug/posts", async (req, res) => {
  try {
    const slug = req.params.slug;
    const page = Math.max(1, parseInt(String(req.query.page), 10) || 1);
    const limit = Math.min(20, Math.max(1, parseInt(String(req.query.limit), 10) || 10));
    const skip = (page - 1) * limit;

    const category = await prisma.category.findUnique({ where: { slug } });
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where: { categoryId: category.id, published: true },
        include: { author: true, category: true },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.post.count({ where: { categoryId: category.id, published: true } }),
    ]);

    res.json({
      data: posts,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
      category: { id: category.id, name: category.name, slug: category.slug },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to fetch category posts" });
  }
});
