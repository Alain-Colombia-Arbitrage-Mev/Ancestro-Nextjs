// Signature upload to Cloudflare R2
import { NextRequest, NextResponse } from 'next/server';

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID || '';
const R2_API_TOKEN = process.env.R2_API_TOKEN || '';
const R2_BUCKET = 'acnestro';
const R2_PUBLIC_URL = 'https://assets.ancestro.ai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { signatureBase64, email } = body;

    console.log(`[Upload Signature] email=${email}, base64Length=${signatureBase64?.length || 0}`);

    if (!signatureBase64 || !email) {
      console.error('[Upload Signature] Missing fields:', { hasBase64: !!signatureBase64, hasEmail: !!email });
      return NextResponse.json({ error: 'Missing signature or email' }, { status: 400 });
    }

    if (!R2_ACCOUNT_ID || !R2_API_TOKEN) {
      console.error('[Upload Signature] R2 not configured');
      return NextResponse.json({ error: 'R2 not configured' }, { status: 500 });
    }

    // Strip data URL prefix
    const base64Data = signatureBase64.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedEmail = email.replace(/[^a-zA-Z0-9]/g, '_');
    const key = `signatures/${sanitizedEmail}_${timestamp}.png`;

    // Upload to R2 via Cloudflare API
    const url = `https://api.cloudflare.com/client/v4/accounts/${R2_ACCOUNT_ID}/r2/buckets/${R2_BUCKET}/objects/${encodeURIComponent(key)}`;

    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${R2_API_TOKEN}`,
        'Content-Type': 'image/png',
      },
      body: buffer,
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('[Upload Signature] R2 error:', res.status, err);
      return NextResponse.json({ error: 'Failed to upload signature' }, { status: 500 });
    }

    const publicUrl = `${R2_PUBLIC_URL}/${key}`;
    return NextResponse.json({ url: publicUrl });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[Upload Signature] Unhandled error:', message);
    return NextResponse.json({ error: `Internal server error: ${message}` }, { status: 500 });
  }
}
