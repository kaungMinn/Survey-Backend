import axios from "axios";
import * as cheerio from "cheerio";
import { telegramServices } from "../services/telegram.services.js";

async function scrapeApkVisionPage(url: string) {
    try {

        const client = await telegramServices.login();

        const messages = await telegramServices.getAllMessages(client);

        const apkvisionInfo = messages.map((msg: any) => {
            const document = msg.media?.document;
            const fileName = document?.attributes?.find(
                (attr: any) => attr.className === "DocumentAttributeFilename"
            )?.fileName || null;

            const fileSize = document?.size ? document.size.toString() : null;
            const telegramFileId = document?.id ? document.id.toString() : null;

            if (!fileName || !fileSize || !document) return null;

            const textUrlEntity = msg.entities?.find(
                (entity: any) => entity.className === "MessageEntityTextUrl"
            );
            const sourceUrl = textUrlEntity?.url || null;

            return {
                telegramFileId: telegramFileId || '',
                telegramMessageId: msg.id,
                fileName: fileName,
                fileSize: fileSize,
                sourceUrl
            };
        }).filter(Boolean);



        // const { data: html } = await axios.get(url, {
        //     headers: {
        //         // Use a user-agent to avoid getting blocked instantly
        //         'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        //     }
        // });

        // const $ = cheerio.load(html);

        // // Inspect the target page structure to find the correct CSS selectors
        // const title = $('h1').text().trim();
        // const description = $('.b-content p')
        //     .map((_, el) => $(el).text().trim())
        //     .get()
        //     .join('\n\n'); // Joins them with double line breaks

        // const appInfo: Record<string, string> = {};

        // $('table.appinfo tr').each((_, row) => {
        //     const key = $(row).find('th').text().trim().toLowerCase().replace(/\s+/g, '_');
        //     const value = $(row).find('td').text().trim();

        //     if (key && value) {
        //         appInfo[key] = value;
        //     }
        // });

        // // Option 1: Extract all paragraphs and maintain clean internal spacing/breaks
        // const changesText = $('.b-dwn-spoiler__changes p')
        //     .map((_, el) => {
        //         // Replace <br> tags with newlines before extracting text so breaks are preserved
        //         $(el).find('br').replaceWith('\n');
        //         return $(el).text().trim();
        //     })
        //     .get()
        //     .filter(Boolean)
        //     .join('\n\n');

        // console.log({ title, description, appInfo, changesText });
        // return { title, description, appInfo };
        process.exit(0);
    } catch (error) {
        console.error(error);
        console.error('❌ Scraper failed:', error);
        process.exit(1);
    }
}

scrapeApkVisionPage('https://apkvision.org/games/role-playing/minecraft-dungeons-64159/');
