import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

/**
 * Media Binary Streaming Route
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDb();
    
    const item = await db.collection("media").findOne({ _id: id });

    if (!item || !item.content) {
      return new NextResponse("Media Not Found", { status: 404 });
    }

    // item.content is already a Buffer/Binary in MongoDB native driver
    const buffer = item.content.buffer ? Buffer.from(item.content.buffer) : Buffer.from(item.content);

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": item.mimeType || "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Critical Binary Streaming Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
