import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  if (!filename) {
    return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
  }

  if (!request.body) {
    return NextResponse.json({ error: 'Body is required' }, { status: 400 });
  }

  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error("BLOB_READ_WRITE_TOKEN is not defined");
      return NextResponse.json({ error: 'Storage token is missing. Please configure Vercel Blob.' }, { status: 500 });
    }

    const blob = await put(filename, request.body, {
      access: 'public',
    });

    return NextResponse.json(blob);
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
