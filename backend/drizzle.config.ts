import { defineConfig } from "drizzle-kit";

import dotenv from "dotenv";
dotenv.config();

export default defineConfig({
  schema: "./src/database/schemas/*.ts",
  out: "src/database/drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
