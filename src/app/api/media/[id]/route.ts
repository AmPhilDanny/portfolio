import { db } from "@/lib/db";
import { media } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

/**
 * Media Binary Streaming Route
 * 
 * This route fetches raw binary data (stored as bytea in PostgreSQL) 
 * and streams it to the client with the correct MIME type and 
 * long-term caching headers.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params for Next.js 15+ compatibility
    const { id } = await params;

    // Fetch the specific media record by ID
    const result = await db.select().from(media).where(eq(media.id, id)).limit(1);

    // Validation: Ensure the record exists and has binary content
    if (result.length === 0 || !result[0].content) {
      return new NextResponse("Media Not Found", { status: 404 });
    }

    const item = result[0];
    const buffer = item.content as Buffer;

    /**
     * Build the response with binary data.
     * We use Uint8Array to wrap the Buffer for the NextResponse constructor.
     */
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        // High-performance caching: 1 year, immutable (never expires)
        "Content-Type": item.mimeType || "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Critical Binary Streaming Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

