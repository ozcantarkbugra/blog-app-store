import "dotenv/config";
import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { postsRouter } from "./routes/posts.js";
import { categoriesRouter } from "./routes/categories.js";
import { authorsRouter } from "./routes/authors.js";
import { openApiSpec } from "./swagger.js";

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, message: "Blog API" });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiSpec));

app.use("/api/posts", postsRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/authors", authorsRouter);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Swagger UI: http://localhost:${PORT}/api-docs`);
});
