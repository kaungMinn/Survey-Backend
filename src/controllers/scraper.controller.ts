import 'dotenv/config';
import { StatusCodes } from 'http-status-codes';
import fs from 'node:fs/promises';
import { response, type NextFunction, type Request, type Response } from 'express';
import { telegramServices } from '../services/telegram.services.js';

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

async function scrapeMessages(req: Request, res: Response, next: NextFunction) {
  try {
    const client = await telegramServices.login();

    const messages = await telegramServices.getAllMessages(client);

    return res.status(StatusCodes.ACCEPTED).json({
      success: true,
      message: "Successfully get messages",
      data: messages
    });

  } catch (error) {
    console.log("Error while scrapping messages", error);
    next(error);
  }
}

async function scrapeMessagesFromGamesMyanmar(req: Request, res: Response, next: NextFunction) {
  try {
    const client = await telegramServices.login();
    const gamesMyanmarMessages = await telegramServices.getAllMessagesFromGamesMyanmar(client);

    // Map through messages to extract clean lookup identifiers alongside your text/url data
    const mappedData = gamesMyanmarMessages.map((msg: any) => {
      const document = msg.media?.document;
      const fileName = document?.attributes?.find(
        (attr: any) => attr.className === "DocumentAttributeFilename"
      )?.fileName || null;

      const fileSize = document?.size ? document.size.toString() : null;

      return {
        messageId: msg.id,
        text: msg.message, // Caption
        fileName: fileName,
        fileSize: fileSize,
        // Composite unique key for your DB lookup
        uniqueKey: fileName && fileSize ? `${fileName}_${fileSize}` : null,
      };
    });

    return res.status(StatusCodes.ACCEPTED).json({
      success: true,
      message: "Successfully extracted messages with unique identifiers",
      data: mappedData,
    });
  } catch (error) {
    next(error);
  }
}


export const scraperController = {
  scrapeIds,
  scrapeMessages,
  scrapeMessagesFromGamesMyanmar
};