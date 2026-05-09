import { pgTable, text, serial, timestamp, doublePrecision, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const promosTable = pgTable("promos", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  discountPercent: doublePrecision("discount_percent").notNull().default(0),
  maxUses: integer("max_uses").notNull().default(1),
  usedCount: integer("used_count").notNull().default(0),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  createdBy: text("created_by").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertPromoSchema = createInsertSchema(promosTable).omit({
  id: true,
  usedCount: true,
  createdAt: true,
});
export type InsertPromo = z.infer<typeof insertPromoSchema>;
export type Promo = typeof promosTable.$inferSelect;
