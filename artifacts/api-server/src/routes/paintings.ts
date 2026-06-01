import { Router, type IRouter } from "express";
import { eq, desc, avg, min, max, count, sql } from "drizzle-orm";
import multer from "multer";
import path from "path";
import fs from "fs";
import { db, paintingsTable } from "@workspace/db";
import {
  ListPaintingsResponse,
  GetFeaturedPaintingsResponse,
  GetPaintingStatsResponse,
  GetPaintingParams,
  GetPaintingResponse,
  UpdatePaintingParams,
  UpdatePaintingBody,
  UpdatePaintingResponse,
  DeletePaintingParams,
  CreatePaintingBody,
} from "@workspace/api-zod";
import { logger } from "../lib/logger";

const router: IRouter = Router();

const UPLOADS_DIR = path.resolve(process.cwd(), "uploads");
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `painting-${Date.now()}${ext}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 20 * 1024 * 1024 } });

function paintingToResponse(p: typeof paintingsTable.$inferSelect) {
  return {
    id: p.id,
    title: p.title,
    description: p.description ?? null,
    price: Number(p.price),
    imageUrl: p.imageUrl ?? null,
    featured: p.featured,
    createdAt: p.createdAt.toISOString(),
  };
}

router.get("/paintings", async (req, res): Promise<void> => {
  const rows = await db.select().from(paintingsTable).orderBy(desc(paintingsTable.createdAt));
  res.json(ListPaintingsResponse.parse(rows.map(paintingToResponse)));
});

router.get("/paintings/featured", async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(paintingsTable)
    .where(eq(paintingsTable.featured, true))
    .orderBy(desc(paintingsTable.createdAt))
    .limit(6);
  res.json(GetFeaturedPaintingsResponse.parse(rows.map(paintingToResponse)));
});

router.get("/paintings/stats", async (_req, res): Promise<void> => {
  const [stats] = await db
    .select({
      total: count(),
      minPrice: min(paintingsTable.price),
      maxPrice: max(paintingsTable.price),
      avgPrice: avg(paintingsTable.price),
    })
    .from(paintingsTable);

  res.json(
    GetPaintingStatsResponse.parse({
      total: Number(stats.total),
      minPrice: Number(stats.minPrice ?? 0),
      maxPrice: Number(stats.maxPrice ?? 0),
      avgPrice: Number(stats.avgPrice ?? 0),
    }),
  );
});

router.get("/paintings/:id", async (req, res): Promise<void> => {
  const params = GetPaintingParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [painting] = await db
    .select()
    .from(paintingsTable)
    .where(eq(paintingsTable.id, params.data.id));

  if (!painting) {
    res.status(404).json({ error: "Painting not found" });
    return;
  }

  res.json(GetPaintingResponse.parse(paintingToResponse(painting)));
});

router.patch("/paintings/:id", async (req, res): Promise<void> => {
  const params = UpdatePaintingParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const body = UpdatePaintingBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const updateData: Record<string, unknown> = {};
  if (body.data.title !== undefined) updateData.title = body.data.title;
  if (body.data.description !== undefined) updateData.description = body.data.description;
  if (body.data.price !== undefined) updateData.price = String(body.data.price);
  if (body.data.featured !== undefined) updateData.featured = body.data.featured;

  const [painting] = await db
    .update(paintingsTable)
    .set(updateData)
    .where(eq(paintingsTable.id, params.data.id))
    .returning();

  if (!painting) {
    res.status(404).json({ error: "Painting not found" });
    return;
  }

  res.json(UpdatePaintingResponse.parse(paintingToResponse(painting)));
});

router.delete("/paintings/:id", async (req, res): Promise<void> => {
  const params = DeletePaintingParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [painting] = await db
    .delete(paintingsTable)
    .where(eq(paintingsTable.id, params.data.id))
    .returning();

  if (!painting) {
    res.status(404).json({ error: "Painting not found" });
    return;
  }

  if (painting.imageUrl) {
    const filePath = path.join(UPLOADS_DIR, path.basename(painting.imageUrl));
    fs.unlink(filePath, () => {});
  }

  res.sendStatus(204);
});

export { UPLOADS_DIR };
export default router;
