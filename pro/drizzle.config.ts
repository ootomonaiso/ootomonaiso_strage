import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  driver: "supabase",
  dbCredentials: {
    accountId: process.env.SUPABASE_ACCOUNT_ID!,
    databaseId: process.env.SUPABASE_DATABASE_ID!,
    token: process.env.SUPABASE_TOKEN!,
  },
});
