import { Router, type IRouter } from "express";
import { eq, and, like, desc, asc, count, min, max } from "drizzle-orm";
import { db, giftsTable } from "@workspace/db";
import {
  ListGiftsQueryParams,
  GetGiftParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/gifts", async (req, res): Promise<void> => {
  const params = ListGiftsQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const { search, sortBy, sortOrder } = params.data;

  let query = db
    .select()
    .from(giftsTable)
    .where(
      search
        ? and(eq(giftsTable.isListed, true), like(giftsTable.name, `%${search}%`))
        : eq(giftsTable.isListed, true)
    );

  let results;
  if (sortBy === "price") {
    results = await (sortOrder === "desc"
      ? query.orderBy(desc(giftsTable.price))
      : query.orderBy(asc(giftsTable.price)));
  } else {
    results = await query.orderBy(desc(giftsTable.createdAt));
  }

  res.json(results);
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

  res.json(gift);
});

router.get("/market/stats", async (_req, res): Promise<void> => {
  const totalGiftsResult = await db.select({ count: count() }).from(giftsTable);
  const listedGiftsResult = await db
    .select({ count: count() })
    .from(giftsTable)
    .where(eq(giftsTable.isListed, true));

  const { usersTable: usersT } = await import("@workspace/db");
  const totalUsersResult = await db.select({ count: count() }).from(usersT);

  const priceStats = await db
    .select({ minPrice: min(giftsTable.price), maxPrice: max(giftsTable.price) })
    .from(giftsTable)
    .where(eq(giftsTable.isListed, true));

  res.json({
    totalGifts: totalGiftsResult[0].count,
    totalListedGifts: listedGiftsResult[0].count,
    totalUsers: totalUsersResult[0].count,
    minPrice: priceStats[0].minPrice ?? null,
    maxPrice: priceStats[0].maxPrice ?? null,
  });
});

export default router;
