import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, giftsTable, usersTable, promosTable } from "@workspace/db";
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

interface GiftAttrs {
  number?: number;
  bgColor?: string;
  model?: { name: string; rarity?: number };
  symbol?: { name: string; rarity?: number };
  backdrop?: { name: string; rarity?: number };
}

function slugToName(slug: string): string {
  const namePart = slug.replace(/-\d+$/, "");
  return namePart.replace(/([A-Z])/g, " $1").trim();
}

function slugToNumber(slug: string): number | null {
  const m = slug.match(/-(\d+)$/);
  return m ? parseInt(m[1], 10) : null;
}

function parseAttributes(html: string): GiftAttrs {
  const attrs: GiftAttrs = {};

  const rowPattern = /<tr[^>]*>[\s\S]*?<\/tr>/gi;
  const rows = html.match(rowPattern) ?? [];

  for (const row of rows) {
    const cells = row.match(/<td[^>]*>([\s\S]*?)<\/td>/gi) ?? [];
    if (cells.length < 2) continue;
    const stripHtml = (s: string) => s.replace(/<[^>]+>/g, "").trim();
    const label = stripHtml(cells[0] ?? "").toLowerCase();
    const value = stripHtml(cells[1]);
    const rarityMatch = value.match(/(\d+(?:\.\d+)?)\s*%/);
    const rarity = rarityMatch ? parseFloat(rarityMatch[1]) : undefined;
    const name = value.replace(/\s*\d+(?:\.\d+)?\s*%.*/, "").trim();

    if (label.includes("model")) attrs.model = { name, rarity };
    else if (label.includes("backdrop")) attrs.backdrop = { name, rarity };
    else if (label.includes("symbol")) attrs.symbol = { name, rarity };
  }

  const bgMatch = html.match(/background(?:-color)?:\s*(#[0-9a-fA-F]{3,8}|rgba?\([^)]+\))/i);
  if (bgMatch) attrs.bgColor = bgMatch[1];

  return attrs;
}

const BACKDROP_COLORS: Record<string, string> = {
  persimmon: "#E8A06C",
  "coral red": "#D05850",
  coral: "#D05850",
  emerald: "#3A8E5C",
  sapphire: "#3A5E9E",
  golden: "#C89820",
  gold: "#C89820",
  ruby: "#9E2835",
  amethyst: "#7848A8",
  "sky blue": "#3890C0",
  sky: "#3890C0",
  azure: "#3878B8",
  storm: "#4A6878",
  night: "#2A3050",
  silver: "#8898A8",
  mint: "#48A878",
  lavender: "#8870C0",
  rose: "#C85878",
  crimson: "#B82838",
  indigo: "#3840A0",
  violet: "#6840A0",
  green: "#3A8050",
  blue: "#2858A0",
  red: "#A82828",
  orange: "#D07028",
  yellow: "#C8A820",
  pink: "#D84878",
  purple: "#7838A8",
  brown: "#886040",
  teal: "#308080",
  cyan: "#3898B0",
  lime: "#68A028",
  forest: "#2A6830",
  ocean: "#286888",
  desert: "#C89060",
  sunset: "#D06830",
  tropical: "#28A868",
};

function backdropToColor(backdropName?: string): string {
  if (!backdropName) return "#1a1a2a";
  const key = backdropName.toLowerCase();
  for (const [k, v] of Object.entries(BACKDROP_COLORS)) {
    if (key.includes(k)) return v;
  }
  let hash = 0;
  for (let i = 0; i < key.length; i++) hash = ((hash << 5) - hash + key.charCodeAt(i)) | 0;
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 50%, 45%)`;
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
  const match = link.match(/https?:\/\/t\.me\/nft\/([^/?#\s]+)/i);
  if (!match) {
    res.status(400).json({ error: "Invalid Telegram gift link. Expected: https://t.me/nft/GiftName-12345" });
    return;
  }

  const giftSlug = match[1];
  const giftNumber = slugToNumber(giftSlug);
  const name = slugToName(giftSlug);
  const slugLower = giftSlug.toLowerCase();

  let imageUrl = `https://nft.fragment.com/gift/${slugLower}.webp`;
  let attrs: GiftAttrs = {};

  try {
    const response = await fetch(`https://t.me/nft/${giftSlug}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
        "Accept": "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(6000),
    });

    if (response.ok) {
      const html = await response.text();

      const ogImg =
        html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)?.[1] ??
        html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i)?.[1];
      if (ogImg) imageUrl = ogImg;

      attrs = parseAttributes(html);
    }
  } catch (err) {
    logger.warn({ giftSlug, err }, "Failed to scrape t.me page, using CDN fallback");
  }

  const bgColor = attrs.bgColor ?? backdropToColor(attrs.backdrop?.name);

  const preview = {
    name,
    giftSlug,
    giftNumber: giftNumber ?? undefined,
    telegramLink: link,
    imageUrl,
    bgColor,
    attributes: JSON.stringify({ ...attrs, number: giftNumber }),
  };

  logger.info({ giftSlug, giftNumber }, "Admin previewed gift");
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

// ── Promo CRUD (admin) ──────────────────────────────────────────────────────

router.get("/admin/promos", async (req, res): Promise<void> => {
  if (!(await checkAdmin(req))) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  const promos = await db.select().from(promosTable).orderBy(promosTable.createdAt);
  res.json(promos.map(serializeDates));
});

router.post("/admin/promos", async (req, res): Promise<void> => {
  if (!(await checkAdmin(req))) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  const { code, discountPercent, maxUses, expiresAt } = req.body ?? {};
  if (!code || typeof discountPercent !== "number") {
    res.status(400).json({ error: "code and discountPercent are required" });
    return;
  }

  const telegramId = req.headers["x-telegram-id"] as string;

  try {
    const [promo] = await db
      .insert(promosTable)
      .values({
        code: String(code).toUpperCase().trim(),
        discountPercent,
        maxUses: maxUses ?? 1,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        createdBy: telegramId,
      })
      .returning();

    logger.info({ code: promo.code }, "Admin created promo");
    res.status(201).json(serializeDates(promo));
  } catch (err: any) {
    if (err?.code === "23505") {
      res.status(400).json({ error: "Promo code already exists" });
    } else {
      res.status(500).json({ error: "Failed to create promo" });
    }
  }
});

router.delete("/admin/promos/:id", async (req, res): Promise<void> => {
  if (!(await checkAdmin(req))) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const [deleted] = await db.delete(promosTable).where(eq(promosTable.id, id)).returning();
  if (!deleted) {
    res.status(404).json({ error: "Promo not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
