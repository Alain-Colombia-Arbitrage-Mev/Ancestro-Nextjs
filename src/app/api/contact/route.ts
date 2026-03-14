import { NextRequest, NextResponse } from 'next/server';
import { createAirtableRecord } from '@/lib/airtable';
import { query } from '@/lib/db';

const TABLE_ID = process.env.AIRTABLE_CONTACT_FORM || '';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { name, email, phone, contactType, message } = data;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const department = contactType === 'charger' ? 'Engineering' : 'Sales';

    // Save to RDS
    await query(
      `INSERT INTO contacts (contact_name, contact_reason, full_name, email, phone, message, form_source, follow_up_status, assigned_department)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        `${name} - ${new Date().toISOString().split('T')[0]}`,
        contactType || 'general',
        name, email, phone || '', message,
        'website', 'New', department,
      ]
    );

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
      'Assigned Department': department,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[Contact API]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
