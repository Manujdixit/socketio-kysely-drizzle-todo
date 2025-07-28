import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/database/schemas/*.ts',
  out: 'src/database/drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
