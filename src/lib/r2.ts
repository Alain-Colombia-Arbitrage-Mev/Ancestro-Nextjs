// Reusable Cloudflare R2 upload utility
// Same pattern as upload-signature but as a shared module

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID || '';
const R2_API_TOKEN = process.env.R2_API_TOKEN || '';
const R2_BUCKET = 'acnestro';
const R2_PUBLIC_URL = 'https://assets.ancestro.ai';

export async function uploadToR2(
  buffer: Buffer,
  key: string,
  contentType: string,
): Promise<string> {
  if (!R2_ACCOUNT_ID || !R2_API_TOKEN) {
    throw new Error('R2 not configured');
  }

  const url = `https://api.cloudflare.com/client/v4/accounts/${R2_ACCOUNT_ID}/r2/buckets/${R2_BUCKET}/objects/${encodeURIComponent(key)}`;

  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${R2_API_TOKEN}`,
      'Content-Type': contentType,
    },
    body: buffer as unknown as BodyInit,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`R2 upload failed: ${res.status} ${err}`);
  }

  return `${R2_PUBLIC_URL}/${key}`;
}

export function generateProposalKey(email: string, type: 'pdf' | 'signature' | 'document'): string {
  const sanitizedEmail = email.replace(/[^a-zA-Z0-9]/g, '_');
  const timestamp = Date.now();
  return `proposals/${sanitizedEmail}/${type}_${timestamp}.${type === 'pdf' ? 'pdf' : type === 'signature' ? 'png' : 'pdf'}`;
}
