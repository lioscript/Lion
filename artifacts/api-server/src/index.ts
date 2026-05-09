import app from "./app";
import { logger } from "./lib/logger";
import { startBot } from "./lib/bot";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");

  const botToken = process.env.BOT_TOKEN;
  const replitDomains = process.env.REPLIT_DOMAINS;
  if (botToken && replitDomains) {
    const primaryDomain = replitDomains.split(",")[0].trim();
    const miniAppUrl = `https://${primaryDomain}/`;
    startBot(botToken, miniAppUrl);
  } else {
    logger.warn("BOT_TOKEN or REPLIT_DOMAINS not set — Telegram bot not started");
  }
});
