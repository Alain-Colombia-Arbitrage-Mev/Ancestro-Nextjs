import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const { profile, name, email, phone, company, country, city, investment, experience, message, lang } = data;

    if (!profile || !name || !email || !phone || !country) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // TODO: Save to database (DynamoDB, RDS, etc.)
    // TODO: Send notification email via SES
    // TODO: Add to CRM pipeline

    // For now, log the registration
    console.log('[JOIN]', JSON.stringify({ profile, name, email, phone, company, country, city, investment, lang, timestamp: new Date().toISOString() }));

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
