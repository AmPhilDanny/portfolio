/**
 * Database Configuration
 * 
 * This file initializes the Drizzle ORM and establishes a connection to the Neon 
 * Serverless PostgreSQL database using the HTTP driver. It exports the 'db' object 
 * which is used throughout the application to perform type-safe SQL queries.
 */

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// Ensure the connection URL is present in the environment variables
// This is critical for connecting to the Neon database instance
if (!process.env.DATABASE_URL) {
  console.warn("DATABASE_URL is not defined in environment variables.");
}

// SQL connection client focused on serverless HTTP execution
const sql = neon(process.env.DATABASE_URL || "");

// Combined export of the Drizzle database instance and the relational schema
export const db = drizzle(sql, { schema });

