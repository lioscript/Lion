import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, giftsTable, usersTable } from "@workspace/db";
import {
  PreviewGiftBody,
  PreviewGiftResponse,
  CreateGiftBody,
  UpdateGiftParams,
  UpdateGiftBody,
  DeleteGiftParams,
} from "@workspace/api-zod";
import { logger } from "../lib/logger";
import { serializeDates } from "../lib/serialize";

const router: IRouter = Router();

async function checkAdmin(req: import("express").Request): Promise<boolean> {
  const telegramId = req.headers["x-telegram-id"] as string | undefined;
  if (!telegramId) return false;
  const adminId = process.env.ADMIN_TELEGRAM_ID;
  if (adminId && telegramId === adminId) return true;
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.telegramId, telegramId))
    .limit(1);
  return user?.isAdmin ?? false;
}

router.post("/admin/gifts/preview", async (req, res): Promise<void> => {
  if (!(await checkAdmin(req))) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  const parsed = PreviewGiftBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { link } = parsed.data;
  const match = link.match(/https?:\/\/t\.me\/nft\/([^/?#]+)/);
  if (!match) {
    res.status(400).json({ error: "Invalid Telegram gift link. Expected: https://t.me/nft/GiftName-12345" });
    return;
  }

  const giftSlug = match[1];
  const namePart = giftSlug.replace(/-\d+$/, "");
  const name = namePart.replace(/([A-Z])/g, " $1").trim();
  const imageUrl = `https://nft.fragment.com/gift/${giftSlug.toLowerCase()}.webp`;

  const preview = {
    name,
    giftSlug,
    telegramLink: link,
    imageUrl,
    attributes: JSON.stringify({ slug: giftSlug, source: "telegram" }),
  };

  logger.info({ giftSlug }, "Admin previewed gift");
  res.json(PreviewGiftResponse.parse(preview));
});

router.get("/admin/gifts", async (req, res): Promise<void> => {
  if (!(await checkAdmin(req))) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  const gifts = await db.select().from(giftsTable).orderBy(giftsTable.createdAt);
  res.json(gifts.map(serializeDates));
});

router.post("/admin/gifts", async (req, res): Promise<void> => {
  if (!(await checkAdmin(req))) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  const parsed = CreateGiftBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [gift] = await db
    .insert(giftsTable)
    .values({
      name: parsed.data.name,
      giftSlug: parsed.data.giftSlug,
      telegramLink: parsed.data.telegramLink ?? null,
      imageUrl: parsed.data.imageUrl,
      attributes: parsed.data.attributes ?? null,
      price: parsed.data.price,
      isListed: parsed.data.isListed ?? true,
    })
    .returning();

  logger.info({ giftId: gift.id, name: gift.name }, "Admin created gift");
  res.status(201).json(serializeDates(gift));
});

router.patch("/admin/gifts/:id", async (req, res): Promise<void> => {
  if (!(await checkAdmin(req))) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const idParams = UpdateGiftParams.safeParse({ id: parseInt(rawId, 10) });
  if (!idParams.success) {
    res.status(400).json({ error: idParams.error.message });
    return;
  }

  const parsed = UpdateGiftBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const updateData: Record<string, unknown> = {};
  if (parsed.data.price !== undefined) updateData.price = parsed.data.price;
  if (parsed.data.isListed !== undefined) updateData.isListed = parsed.data.isListed;
  if (parsed.data.name != null) updateData.name = parsed.data.name;

  const [gift] = await db
    .update(giftsTable)
    .set(updateData)
    .where(eq(giftsTable.id, idParams.data.id))
    .returning();

  if (!gift) {
    res.status(404).json({ error: "Gift not found" });
    return;
  }

  res.json(serializeDates(gift));
});

router.delete("/admin/gifts/:id", async (req, res): Promise<void> => {
  if (!(await checkAdmin(req))) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = DeleteGiftParams.safeParse({ id: parseInt(rawId, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [deleted] = await db
    .delete(giftsTable)
    .where(eq(giftsTable.id, params.data.id))
    .returning();

  if (!deleted) {
    res.status(404).json({ error: "Gift not found" });
    return;
  }

  logger.info({ giftId: params.data.id }, "Admin deleted gift");
  res.sendStatus(204);
});

export default router;
