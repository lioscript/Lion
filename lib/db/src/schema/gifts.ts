import { pgTable, text, serial, boolean, timestamp, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const giftsTable = pgTable("gifts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  giftSlug: text("gift_slug").notNull(),
  telegramLink: text("telegram_link"),
  imageUrl: text("image_url").notNull(),
  attributes: text("attributes"),
  price: doublePrecision("price").notNull(),
  isListed: boolean("is_listed").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertGiftSchema = createInsertSchema(giftsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertGift = z.infer<typeof insertGiftSchema>;
export type Gift = typeof giftsTable.$inferSelect;
