import { Router, type IRouter } from "express";
import { eq, and, like, desc, asc, count, min, max } from "drizzle-orm";
import { db, giftsTable, usersTable } from "@workspace/db";
import { ListGiftsQueryParams, GetGiftParams } from "@workspace/api-zod";
import { serializeDates } from "../lib/serialize";

const router: IRouter = Router();

router.get("/gifts", async (req, res): Promise<void> => {
  const params = ListGiftsQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const { search, sortBy, sortOrder } = params.data;

  let results;
  if (search) {
    const base = db
      .select()
      .from(giftsTable)
      .where(and(eq(giftsTable.isListed, true), like(giftsTable.name, `%${search}%`)));
    results =
      sortBy === "price"
        ? await (sortOrder === "desc" ? base.orderBy(desc(giftsTable.price)) : base.orderBy(asc(giftsTable.price)))
        : await base.orderBy(desc(giftsTable.createdAt));
  } else {
    const base = db.select().from(giftsTable).where(eq(giftsTable.isListed, true));
    results =
      sortBy === "price"
        ? await (sortOrder === "desc" ? base.orderBy(desc(giftsTable.price)) : base.orderBy(asc(giftsTable.price)))
        : await base.orderBy(desc(giftsTable.createdAt));
  }

  res.json(results.map(serializeDates));
});

router.get("/gifts/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetGiftParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [gift] = await db
    .select()
    .from(giftsTable)
    .where(eq(giftsTable.id, params.data.id))
    .limit(1);

  if (!gift) {
    res.status(404).json({ error: "Gift not found" });
    return;
  }

  res.json(serializeDates(gift));
});

router.get("/market/stats", async (_req, res): Promise<void> => {
  const [totalGiftsResult] = await db.select({ count: count() }).from(giftsTable);
  const [listedGiftsResult] = await db
    .select({ count: count() })
    .from(giftsTable)
    .where(eq(giftsTable.isListed, true));
  const [totalUsersResult] = await db.select({ count: count() }).from(usersTable);
  const [priceStats] = await db
    .select({ minPrice: min(giftsTable.price), maxPrice: max(giftsTable.price) })
    .from(giftsTable)
    .where(eq(giftsTable.isListed, true));

  res.json({
    totalGifts: totalGiftsResult.count,
    totalListedGifts: listedGiftsResult.count,
    totalUsers: totalUsersResult.count,
    minPrice: priceStats.minPrice ?? null,
    maxPrice: priceStats.maxPrice ?? null,
  });
});

export default router;
