import { NextResponse } from 'next/server';
import { db } from "@/lib/db";
import { media } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  if (!filename) {
    return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
  }

  if (!request.body) {
    return NextResponse.json({ error: 'Request body is required' }, { status: 400 });
  }

  try {
    const arrayBuffer = await request.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mimeType = request.headers.get("content-type") || "application/octet-stream";
    const size = `${(buffer.length / (1024 * 1024)).toFixed(2)} MB`;

    // ─── Direct Database Storage Strategy (Neon) ──────────────────────────────
    // This allows images to be stored in the database, avoiding read-only fs issues
    // on Vercel while also bypassing the need for a separate Vercel Blob token.
    const [inserted] = await db.insert(media).values({
      name: filename,
      url: "TEMP",
      type: mimeType.startsWith("image/") ? "image" : "document",
      size: size,
      content: buffer,
      mimeType: mimeType,
    }).returning({ id: media.id });

    // Update with correct internal serving URL
    const finalUrl = `/api/media/${inserted.id}`;
    
    // Patch the URL column for the inserted record
    await db.update(media)
      .set({ url: finalUrl })
      .where(eq(media.id, inserted.id));

    return NextResponse.json({ 
      url: finalUrl, 
      name: filename, 
      id: inserted.id 
    });

  } catch (error: unknown) {
    console.error('Upload Error (Neon Storage):', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Database upload failed: ${message}` },
      { status: 500 }
    );
  }
}
