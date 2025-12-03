import 'dotenv/config';
import { defineConfig, env, PrismaConfig } from 'prisma/config';

type Env = {
  DATABASE_URL: string;
  SHADOW_DATABASE_URL?: string;
};

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: env<Env>('DATABASE_URL'),
    shadowDatabaseUrl: env<Env>('SHADOW_DATABASE_URL'),
    // Required for migrations on remote DBs (Supabase/Neon).
    // Optional for local Postgres. Not used by Prisma Client.
  },
}) satisfies PrismaConfig;
