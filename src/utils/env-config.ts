import "dotenv/config";

export interface EnvTypes extends NodeJS.ProcessEnv {
    DATABASE_URL: string;
    NODE_ENV: string;
    PRIVATE_CHANNEL_ID: string;
    PUBLIC_CHANNEL_USERNAME: string;
    PUBLIC_CHANNEL_DOWNLOAD_URL: string;
    TELEGRAM_BOT_TOKEN: string;
    TELEGRAM_API_ID: string;
    TELEGRAM_API_HASH: string;
    TELEGRAM_SESSION?: string;
    BOT_USER_NAME: string;
}

const env = process.env as EnvTypes;

// Helper function to ensure an environment variable exists
function getEnvVariable(key: keyof EnvTypes, value: string | undefined): string {
    if (!value) {
        throw new Error(`Environment error: Missing required environment variable "${key}" in .env file.`);
    }
    return value;
}

export const envConfig = {
    databaseUrl: getEnvVariable("DATABASE_URL", env.DATABASE_URL),
    nodeEnv: env.NODE_ENV || "development",
    privateChannelId: Number(getEnvVariable("PRIVATE_CHANNEL_ID", env.PRIVATE_CHANNEL_ID)),
    publicChannelUsername: getEnvVariable("PUBLIC_CHANNEL_USERNAME", env.PUBLIC_CHANNEL_USERNAME),
    publicChannelDownloadUrl: getEnvVariable("PUBLIC_CHANNEL_DOWNLOAD_URL", env.PUBLIC_CHANNEL_DOWNLOAD_URL),
    telegramBotToken: getEnvVariable("TELEGRAM_BOT_TOKEN", env.TELEGRAM_BOT_TOKEN),
    telegramApiId: Number(getEnvVariable("TELEGRAM_API_ID", env.TELEGRAM_API_ID)),
    telegramApiHash: getEnvVariable("TELEGRAM_API_HASH", env.TELEGRAM_API_HASH),
    telegramSession: getEnvVariable("TELEGRAM_SESSION", env.TELEGRAM_SESSION),
    botUserName: getEnvVariable("BOT_USER_NAME", env.BOT_USER_NAME)
};