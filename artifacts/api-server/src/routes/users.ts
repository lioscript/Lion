import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, usersTable } from "@workspace/db";
import {
  RegisterUserBody,
  RegisterUserResponse,
  CompleteOnboardingBody,
  CompleteOnboardingResponse,
} from "@workspace/api-zod";
import { logger } from "../lib/logger";
import { serializeDates } from "../lib/serialize";

const router: IRouter = Router();

router.post("/users/register", async (req, res): Promise<void> => {
  const parsed = RegisterUserBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { telegramId, username, firstName, lastName, photoUrl } = parsed.data;
  const adminId = process.env.ADMIN_TELEGRAM_ID;

  const existing = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.telegramId, telegramId))
    .limit(1);

  if (existing.length > 0) {
    const user = existing[0];
    const isAdmin = adminId ? telegramId === adminId : user.isAdmin;
    const [updated] = await db
      .update(usersTable)
      .set({
        username: username ?? user.username,
        firstName: firstName ?? user.firstName,
        lastName: lastName ?? user.lastName,
        photoUrl: photoUrl ?? user.photoUrl,
        isAdmin,
        // Never reset onboarding flags for returning users
      })
      .where(eq(usersTable.telegramId, telegramId))
      .returning();
    res.json(RegisterUserResponse.parse(serializeDates(updated)));
    return;
  }

  const isAdmin = adminId ? telegramId === adminId : false;

  const [user] = await db
    .insert(usersTable)
    .values({
      telegramId,
      username: username ?? null,
      firstName,
      lastName: lastName ?? null,
      photoUrl: photoUrl ?? null,
      isNewUser: true,
      onboardingComplete: false,
      isAdmin,
    })
    .returning();

  logger.info({ telegramId }, "New user registered");
  res.status(201).json(RegisterUserResponse.parse(serializeDates(user)));
});

router.patch("/users/me/onboarding", async (req, res): Promise<void> => {
  const parsed = CompleteOnboardingBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { telegramId } = parsed.data;

  const [user] = await db
    .update(usersTable)
    .set({ onboardingComplete: true, isNewUser: false })
    .where(eq(usersTable.telegramId, telegramId))
    .returning();

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  res.json(CompleteOnboardingResponse.parse(serializeDates(user)));
});

router.get("/users/me", async (req, res): Promise<void> => {
  const telegramId =
    (req.headers["x-telegram-id"] as string) ||
    (req.query.telegramId as string);

  if (!telegramId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.telegramId, telegramId))
    .limit(1);

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  res.json(serializeDates(user));
});

export default router;
