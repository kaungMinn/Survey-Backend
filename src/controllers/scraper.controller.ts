import 'dotenv/config';
import { TelegramClient, sessions } from 'telegram';
import { envConfig } from '../utils/env-config.js';
import { StatusCodes } from 'http-status-codes';
import fs from 'node:fs/promises';
import type { NextFunction, Request, Response } from 'express';
import { telegramServices } from '../services/telegram.services.js';

const stringSession = new sessions.StringSession(envConfig.telegramSession || "");

async function scrapeIds(req: Request, res: Response, next: NextFunction) {

  try {

    const client = await telegramServices.login();

    const urls = await telegramServices.makeDataIntoUrl(client);

    if (urls.length > 0) {
      const timestamp = Date.now();
      await fs.writeFile(`./games_${timestamp}.txt`, urls.join('\n') + '\n', 'utf-8');
      // await fs.writeFile('./games.txt', urls.join('\n') + '\n', 'utf-8');
      console.log(`Successfully wrote all URLs to ./games_${timestamp}.txt`);

      return res.status(StatusCodes.CREATED).json({
        success: true,
        message: `Successfully wrote all URLs to ./games_${timestamp}.txt`
      });
    } else {
      return res.status(StatusCodes.ACCEPTED).json({
        success: true,
        message: "Telegram public channel is empty!"
      })
    }
  } catch (error) {
    console.error("Failed to process scraper data:", error);
    return next(error); // Safely pass it to your global error handler in index.ts
  }
}


export const scraperController = { scrapeIds };