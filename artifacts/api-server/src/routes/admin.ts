import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import multer from "multer";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { db, paintingsTable } from "@workspace/db";
import { AdminLoginBody, CreatePaintingBody } from "@workspace/api-zod";
import { logger } from "../lib/logger";
import { uploadToCloudinary, deleteFromCloudinary } from "../lib/cloudinary";

const router: IRouter = Router();

const ADMIN_USERNAME = process.env.ADMIN_USERNAME ?? "rynohcreations@gmail.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "Ryno@9577";
const JWT_SECRET = process.env.SESSION_SECRET ?? "ryno-h-creations-secret-2024";

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });

function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    jwt.verify(auth.slice(7), JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

router.post("/admin/login", async (req, res): Promise<void> => {
  const body = AdminLoginBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  if (body.data.username !== ADMIN_USERNAME || body.data.password !== ADMIN_PASSWORD) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const token = jwt.sign({ sub: "admin" }, JWT_SECRET, { expiresIn: "7d" });
  res.json({ token });
});

router.post("/admin/paintings", requireAdmin, async (req, res): Promise<void> => {
  const body = CreatePaintingBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const [painting] = await db
    .insert(paintingsTable)
    .values({
      title: body.data.title,
      description: body.data.description ?? null,
      price: String(body.data.price),
      featured: body.data.featured ?? false,
    })
    .returning();

  res.status(201).json({
    id: painting.id,
    title: painting.title,
    description: painting.description ?? null,
    price: Number(painting.price),
    imageUrl: painting.imageUrl ?? null,
    featured: painting.featured,
    createdAt: painting.createdAt.toISOString(),
  });
});

router.post(
  "/admin/paintings/:id/image",
  requireAdmin,
  upload.single("image"),
  async (req, res): Promise<void> => {
    const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const id = parseInt(rawId, 10);

    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }

    if (!req.file) {
      res.status(400).json({ error: "No image file provided" });
      return;
    }

    const [existing] = await db.select().from(paintingsTable).where(eq(paintingsTable.id, id));
    if (!existing) {
      res.status(404).json({ error: "Painting not found" });
      return;
    }

    if (existing.cloudinaryPublicId) {
      await deleteFromCloudinary(existing.cloudinaryPublicId).catch(() => {});
    }

    const { url, publicId } = await uploadToCloudinary(req.file.buffer, req.file.originalname);

    const [painting] = await db
      .update(paintingsTable)
      .set({ imageUrl: url, cloudinaryPublicId: publicId })
      .where(eq(paintingsTable.id, id))
      .returning();

    res.json({
      id: painting.id,
      title: painting.title,
      description: painting.description ?? null,
      price: Number(painting.price),
      imageUrl: painting.imageUrl ?? null,
      featured: painting.featured,
      createdAt: painting.createdAt.toISOString(),
    });
  },
);

export default router;
