import { NextResponse } from 'next/server';
import { db } from "@/lib/db";
import { media } from "@/lib/schema";
import { eq } from "drizzle-orm";

/**
 * Binary Upload Route (Octo-Storage)
 * 
 * This handler accepts raw binary data from a POST request, 
 * extracts the filename and MIME type, and stores the content 
 * directly in the 'media' table as a PostgreSQL Buffer (bytea).
 * 
 * It then generates and returns a stable internal serving URL.
 */
export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  // Input Validation
  if (!filename) {
    return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
  }

  if (!request.body) {
    return NextResponse.json({ error: 'Request body is required' }, { status: 400 });
  }

  try {
    /**
     * Read the raw request stream into an ArrayBuffer and then a Node.js Buffer.
     */
    const arrayBuffer = await request.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mimeType = request.headers.get("content-type") || "application/octet-stream";
    const size = `${(buffer.length / (1024 * 1024)).toFixed(2)} MB`;

    /**
     * ─── DIRECT DATABASE STORAGE STRATEGY (Octo-Storage) ───
     */
    const result = await db.insert(media).values({
      name: filename,
      url: "TEMP", 
      type: mimeType.startsWith("image/") ? "image" : "document",
      size: size,
      content: buffer,
      mimeType: mimeType,
    }).returning({ id: media.id });

    if (!result || result.length === 0) {
      throw new Error("Failed to insert media record into database");
    }

    const inserted = result[0];

    // Build the stable internal serving URL using the record ID
    const finalUrl = `/api/media/${inserted.id}`;
    
    // Update the record with its own stable URL for consistent referencing
    await db.update(media)
      .set({ url: finalUrl })
      .where(eq(media.id, inserted.id));

    return NextResponse.json({ 
      url: finalUrl, 
      name: filename, 
      id: inserted.id 
    });

  } catch (error: any) {
    console.error('Critical Upload Error:', error);
    return NextResponse.json(
      { error: `Upload failed: ${error.message || 'Unknown error'}` },
      { status: 500 }
    );
  }
}

