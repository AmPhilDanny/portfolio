import { db } from "@/lib/db";
import { media } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  try {
    const { id } = await params;
    const result = await db.select().from(media).where(eq(media.id, id)).limit(1);

    if (result.length === 0 || !result[0].content) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const item = result[0];
    const buffer = item.content as Buffer;

    return new NextResponse(new Uint8Array(buffer), {
      headers: {

        "Content-Type": item.mimeType || "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error serving media:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
