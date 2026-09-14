import { defineConfig } from 'drizzle-kit';
import { envConfig } from './src/utils/env-config'

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: { url: envConfig.databaseUrl },
});


