import { Router, type IRouter } from "express";
import { eq, and, gt, or, isNull } from "drizzle-orm";
import { db, promosTable } from "@workspace/db";
import { logger } from "../lib/logger";
import { serializeDates } from "../lib/serialize";

const router: IRouter = Router();

router.post("/promos/apply", async (req, res): Promise<void> => {
  const telegramId = req.headers["x-telegram-id"] as string | undefined;
  if (!telegramId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const { code } = req.body ?? {};
  if (!code || typeof code !== "string") {
    res.status(400).json({ error: "code is required" });
    return;
  }

  const [promo] = await db
    .select()
    .from(promosTable)
    .where(eq(promosTable.code, code.toUpperCase().trim()))
    .limit(1);

  if (!promo) {
    res.status(400).json({ valid: false, discountPercent: 0, message: "Promo code not found" });
    return;
  }

  if (promo.usedCount >= promo.maxUses) {
    res.status(400).json({ valid: false, discountPercent: 0, message: "Promo code has reached its usage limit" });
    return;
  }

  if (promo.expiresAt && new Date(promo.expiresAt) < new Date()) {
    res.status(400).json({ valid: false, discountPercent: 0, message: "Promo code has expired" });
    return;
  }

  await db
    .update(promosTable)
    .set({ usedCount: promo.usedCount + 1 })
    .where(eq(promosTable.id, promo.id));

  logger.info({ code: promo.code, telegramId }, "Promo code applied");
  res.json({
    valid: true,
    discountPercent: promo.discountPercent,
    message: `${promo.discountPercent}% discount applied!`,
  });
});

export default router;
