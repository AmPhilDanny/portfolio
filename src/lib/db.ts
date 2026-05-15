/**
 * Database Configuration
 * 
 * This file initializes the MongoDB native driver and establishes a connection 
 * to the MongoDB Atlas cluster. It exports the 'db' object which is used 
 * throughout the application to perform database operations.
 */

import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || "";

// Create a singleton MongoDB client
let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

if (uri) {
  if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    let globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>;
    };

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri);
      globalWithMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalWithMongo._mongoClientPromise;
  } else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(uri);
    clientPromise = client.connect();
  }
}

/**
 * Helper function to get the database instance
 */
export async function getDb() {
  if (!clientPromise) {
    throw new Error("MONGODB_URI is not defined in environment variables or connection failed to initialize.");
  }
  const connectedClient = await clientPromise;
  return connectedClient.db();
}

// Export the client promise for NextAuth or other integrations
export default clientPromise;
