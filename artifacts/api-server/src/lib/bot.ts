import { Telegraf } from "telegraf";
import { logger } from "./logger";

let bot: Telegraf | null = null;

export function createBot(token: string, miniAppUrl: string): Telegraf {
  bot = new Telegraf(token);

  bot.start(async (ctx) => {
    const user = ctx.from;
    const firstName = user?.first_name ?? "there";

    await ctx.replyWithPhoto(
      { url: "https://i.imgur.com/placeholder.png" },
      {
        caption: `Welcome to NFT Gift Market!\n\nDiscover, trade, and collect unique Telegram NFT gifts.\n\n💎 Buy and sell gifts using TON\n✨ Start exploring now!`,
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "🎁 Open Market",
                web_app: { url: miniAppUrl },
              },
            ],
            [
              {
                text: "📢 Join community",
                url: "https://t.me/",
              },
            ],
          ],
        },
      }
    ).catch(async () => {
      await ctx.reply(
        `Welcome to NFT Gift Market, ${firstName}!\n\nDiscover, trade, and collect unique Telegram NFT gifts.\n\n💎 Buy and sell gifts using TON\n✨ Start exploring now!`,
        {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "🎁 Open Market",
                  web_app: { url: miniAppUrl },
                },
              ],
            ],
          },
        }
      );
    });
  });

  bot.catch((err) => {
    logger.error({ err }, "Telegram bot error");
  });

  return bot;
}

export function startBot(token: string, miniAppUrl: string): void {
  const instance = createBot(token, miniAppUrl);
  instance.launch().then(() => {
    logger.info("Telegram bot started");
  }).catch((err) => {
    logger.error({ err }, "Failed to start Telegram bot");
  });

  process.once("SIGINT", () => instance.stop("SIGINT"));
  process.once("SIGTERM", () => instance.stop("SIGTERM"));
}
