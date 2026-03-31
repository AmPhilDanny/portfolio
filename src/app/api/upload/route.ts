import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  if (!filename) {
    return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
  }

  if (!request.body) {
    return NextResponse.json({ error: 'Request body is required' }, { status: 400 });
  }

  // Sanitize filename
  const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
  const timestamp = Date.now();
  const uniqueName = `${timestamp}_${safeName}`;

  // ─── Strategy 1: Vercel Blob (production) ───────────────────────────────────
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { put } = await import('@vercel/blob');
      const blob = await put(uniqueName, request.body, { access: 'public' });
      return NextResponse.json({ url: blob.url, name: safeName });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Unknown error';
      console.error('Vercel Blob upload failed:', msg);
      return NextResponse.json({ error: `Storage upload failed: ${msg}` }, { status: 500 });
    }
  }

  // ─── Strategy 2: Local filesystem (dev only) ────────────────────────────────
  // Only attempt on local dev where process.cwd() is a writable project dir
  const isVercel = !!process.env.VERCEL;
  if (isVercel) {
    return NextResponse.json(
      {
        error:
          'File uploads require Vercel Blob storage in production. ' +
          'Please add BLOB_READ_WRITE_TOKEN to your Vercel environment variables, ' +
          'or use the "Paste URL" option instead.',
      },
      { status: 503 }
    );
  }

  try {
    const { writeFile, mkdir } = await import('fs/promises');
    const path = await import('path');
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });

    const bytes = await request.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(path.join(uploadDir, uniqueName), buffer);

    return NextResponse.json({ url: `/uploads/${uniqueName}`, name: safeName });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('Local upload failed:', msg);
    return NextResponse.json({ error: `Failed to save file: ${msg}` }, { status: 500 });
  }
}
