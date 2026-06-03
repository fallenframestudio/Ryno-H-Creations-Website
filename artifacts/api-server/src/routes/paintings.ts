import { Router, type IRouter } from "express";
import { eq, desc, avg, min, max, count } from "drizzle-orm";
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
} from "@workspace/api-zod";
import { deleteFromCloudinary } from "../lib/cloudinary";

const router: IRouter = Router();

function optimizeCloudinaryUrl(url: string | null): string | null {
  if (!url) return null;
  return url.replace("/upload/", "/upload/f_auto,q_auto,w_1400/");
}

function paintingToResponse(p: typeof paintingsTable.$inferSelect) {
  return {
    id: p.id,
    title: p.title,
    description: p.description ?? null,
    price: Number(p.price),
    imageUrl: optimizeCloudinaryUrl(p.imageUrl),
    featured: p.featured,
    sold: p.sold,
    orientation: p.orientation,
    createdAt: p.createdAt.toISOString(),
  };
}

router.get("/paintings", async (_req, res): Promise<void> => {
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
  if (body.data.sold !== undefined) updateData.sold = body.data.sold;
  if (body.data.orientation !== undefined) updateData.orientation = body.data.orientation;

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

  if (painting.cloudinaryPublicId) {
    await deleteFromCloudinary(painting.cloudinaryPublicId).catch(() => {});
  }

  res.sendStatus(204);
});

export default router;
