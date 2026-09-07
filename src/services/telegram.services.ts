import { sessions, TelegramClient } from "telegram";
import { envConfig } from "../utils/env-config.js";

async function login() {
    const stringSession = new sessions.StringSession(envConfig.telegramSession || "");

    const client = new TelegramClient(stringSession, envConfig.telegramApiId, envConfig.telegramApiHash, {
        connectionRetries: 5,
    });

    await client.connect();

    console.log('Logged in successfully. Starting TypeScript sequential scraper...');

    if (!envConfig.telegramSession) {
        console.log("\n👉 COPY THIS SESSION STRING AND ADD IT TO YOUR .env AS TELEGRAM_SESSION:");
        console.log(client.session.save());
        console.log("\n");
    }

    return client;
}


async function getAllMessages(client: TelegramClient) {
    const messages = await client.getMessages(envConfig.publicChannelUsername, {
        reverse: true
    });

    return messages as any;
}

async function getAPKDatas(client: TelegramClient) {
    const messages = await getAllMessages(client);

    let apkDatas = [];

    for (const message of messages) {
        if (!message.media || !message.media.document) continue;
        const doc = message.media.document;

        const isApkMime = doc.mimeType === 'application/vnd.android.package-archive';

        const fileName = doc.attributes?.find((attr: any) => attr.className === 'DocumentAttributeFilename')?.fileName || '';
        const isApkExtension = fileName.toLowerCase().endsWith('.apk');

        if (isApkMime || isApkExtension) {
            apkDatas.push(message);
        }

    }

    return apkDatas;

}

async function makeDataIntoUrl(client: TelegramClient) {
    const apkDatas = await getAPKDatas(client);
    const urls: string[] = [];
    if (apkDatas.length <= 0) return urls;

    for (const [index, apk] of apkDatas.entries()) {
        console.log(`Processing APK index ${index} (Total found: ${apkDatas.length})`);

        const url = `${envConfig.publicChannelDownloadUrl}${apk.id}`;
        urls.push(url);
    }

    return urls;
}

export const telegramServices = { login, getAllMessages, getAPKDatas, makeDataIntoUrl };