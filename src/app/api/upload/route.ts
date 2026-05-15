import { NextResponse } from 'next/server';
import { getDb } from "@/lib/db";
import { Binary } from 'mongodb';

/**
 * Binary Upload Route (Octo-Storage)
 * Note: Vercel has a 4.5MB limit for Serverless Function bodies.
 * Next.js App Router body limits are configured in next.config.ts
 */
export const maxDuration = 60; // Increase timeout for large uploads

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

    const db = await getDb();
    const id = crypto.randomUUID();
    const finalUrl = `/api/media/${id}`;

    await db.collection<any>("media").insertOne({
      _id: id,
      name: filename,
      url: finalUrl,
      type: mimeType.startsWith("image/") ? "image" : "document",
      size: size,
      content: new Binary(buffer),
      mimeType: mimeType,
      createdAt: new Date()
    });

    return NextResponse.json({ 
      url: finalUrl, 
      name: filename, 
      id: id 
    });

  } catch (error: any) {
    console.error('Critical Upload Error:', {
      message: error.message,
      stack: error.stack,
      filename: filename
    });
    return NextResponse.json(
      { error: `Upload failed: ${error.message || 'Unknown error'}` },
      { status: 500 }
    );
  }
}
