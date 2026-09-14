import { db } from "../db/index.js";
import { games } from "../db/schema.js";
import { telegramServices } from "../services/telegram.services.js";


async function runScraper() {
    console.log('🚀 Starting Telegram scraper...');

    try {
        const client = await telegramServices.login();
        const gamesMyanmarMessages = await telegramServices.getAllMessagesFromGamesMyanmar(client);

        const gamesToInsert = gamesMyanmarMessages
            .map((msg: any) => {
                const document = msg.media?.document;
                const fileName = document?.attributes?.find(
                    (attr: any) => attr.className === "DocumentAttributeFilename"
                )?.fileName || null;

                const fileSize = document?.size ? document.size.toString() : null;
                const telegramFileId = document?.id ? document.id.toString() : null;

                if (!fileName || !fileSize || !document) return null;

                return {
                    telegramFileId: telegramFileId || '',
                    telegramMessageId: msg.id,
                    fileName: fileName,
                    fileSize: fileSize,
                };
            })
            .filter(Boolean);

        if (gamesToInsert.length > 0) {
            console.log(`📥 Inserting ${gamesToInsert.length} items into PostgreSQL...`);
            await db
                .insert(games)
                .values(gamesToInsert as any)
                .onConflictDoNothing({
                    target: [games.fileName, games.fileSize]
                });
            console.log('✅ Successfully synced games to the database!');
        } else {
            console.log('⚠️ No valid game files found to insert.');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Scraper failed:', error);
        process.exit(1);
    }
}

runScraper();
