import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

export default {
  schema: './src/lib/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.POSTGRES_URL! + (process.env.POSTGRES_URL?.includes('localhost') ? '' : '?sslmode=require'),
  },
} satisfies Config;
