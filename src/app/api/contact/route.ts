import { NextRequest, NextResponse } from 'next/server';
import { createAirtableRecord } from '@/lib/airtable';

const TABLE_ID = process.env.AIRTABLE_CONTACT_FORM || '';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { name, email, phone, contactType, message } = data;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Save to Airtable
    await createAirtableRecord(TABLE_ID, {
      'Contact Name': `${name} - ${new Date().toISOString().split('T')[0]}`,
      'Contact Reason': contactType || 'General',
      'Full Name': name,
      'Email': email,
      'Phone': phone || '',
      'Message': message,
      'Form Source': 'website',
      'Follow Up Status': 'New',
      'Assigned Department': contactType === 'charger' ? 'Engineering' : 'Sales',
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[Contact API]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
