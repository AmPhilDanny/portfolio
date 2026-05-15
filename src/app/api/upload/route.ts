import { NextResponse } from 'next/server';
import { getDb } from "@/lib/db";
import { Binary } from 'mongodb';

/**
 * Chunked Upload Route (Octo-Storage)
 * Bypasses Vercel's 4.5MB payload limit by accepting the file in smaller chunks.
 */
export const maxDuration = 60; // Increase timeout for large uploads

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const formData = await request.formData();
    const chunk = formData.get('chunk') as Blob | null;
    const chunkIndex = parseInt(formData.get('chunkIndex') as string);
    const totalChunks = parseInt(formData.get('totalChunks') as string);
    const fileId = formData.get('fileId') as string;
    const filename = formData.get('filename') as string;
    const mimeType = formData.get('mimeType') as string;

    if (!chunk || !fileId || isNaN(chunkIndex) || isNaN(totalChunks) || !filename) {
      return NextResponse.json({ error: 'Missing required chunk fields' }, { status: 400 });
    }

    const db = await getDb();
    const arrayBuffer = await chunk.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Save chunk to temporary collection
    await db.collection("media_chunks").insertOne({
      fileId,
      chunkIndex,
      data: new Binary(buffer),
      createdAt: new Date()
    });

    // Check if all chunks have been received
    const chunksCount = await db.collection("media_chunks").countDocuments({ fileId });

    if (chunksCount === totalChunks) {
      // Assemble all chunks in order
      const allChunks = await db.collection("media_chunks")
        .find({ fileId })
        .sort({ chunkIndex: 1 })
        .toArray();

      const totalBuffer = Buffer.concat(allChunks.map(c => c.data.buffer));
      const size = `${(totalBuffer.length / (1024 * 1024)).toFixed(2)} MB`;
      const id = crypto.randomUUID();
      const finalUrl = `/api/media/${id}`;

      // Ensure we don't exceed MongoDB 16MB BSON limit (roughly, keeping a small margin)
      if (totalBuffer.length > 15.5 * 1024 * 1024) {
        await db.collection("media_chunks").deleteMany({ fileId });
        return NextResponse.json({ error: 'File exceeds 15MB limit' }, { status: 413 });
      }

      await db.collection<any>("media").insertOne({
        _id: id,
        name: filename,
        url: finalUrl,
        type: mimeType.startsWith("image/") ? "image" : mimeType.startsWith("video/") ? "video" : "document",
        size: size,
        content: new Binary(totalBuffer),
        mimeType: mimeType,
        createdAt: new Date()
      });

      // Cleanup chunks
      await db.collection("media_chunks").deleteMany({ fileId });

      return NextResponse.json({ 
        url: finalUrl, 
        name: filename, 
        id: id,
        completed: true 
      });
    }

    return NextResponse.json({ 
      message: `Chunk ${chunkIndex + 1}/${totalChunks} processed`,
      completed: false
    });

  } catch (error: any) {
    console.error('Critical Upload Error:', {
      message: error.message,
      stack: error.stack
    });
    return NextResponse.json(
      { error: `Upload failed: ${error.message || 'Unknown error'}` },
      { status: 500 }
    );
  }
}
