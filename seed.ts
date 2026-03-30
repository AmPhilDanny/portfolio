import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './src/lib/schema';
import * as dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

dotenv.config({ path: '.env.local' });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql, { schema });

async function seed() {
  console.log('Seeding database...');

  try {
    // 1. Create Admin User
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@admin.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const existingUsers = await db.select().from(schema.users).where(eq(schema.users.email, adminEmail));
    
    if (existingUsers.length === 0) {
      await db.insert(schema.users).values({
        email: adminEmail,
        password: hashedPassword,
      });
      console.log('Admin user created.');
    } else {
      console.log('Admin user already exists.');
    }

    // 2. Initial Hero Section
    const existingHeroes = await db.select().from(schema.heroes);
    if (existingHeroes.length === 0) {
      await db.insert(schema.heroes).values({
        name: 'Philip Ekaba',
        title: 'Full Stack Developer',
        description: 'Building modern web applications with React, Next.js, and Node.js.',
      });
      console.log('Initial hero section created.');
    }

    // 3. Initial About Section
    const existingAbouts = await db.select().from(schema.abouts);
    if (existingAbouts.length === 0) {
      await db.insert(schema.abouts).values({
        description: 'I am a passionate developer with experience in building scalable web applications.',
        stats: [
          { label: 'Years Experience', value: '2+' },
          { label: 'Projects Completed', value: '10+' },
        ],
      });
      console.log('Initial about section created.');
    }

    console.log('Seeding completed successfully.');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
