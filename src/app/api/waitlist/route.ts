import { NextRequest, NextResponse } from 'next/server';
import { createAirtableRecord } from '@/lib/airtable';
import { query } from '@/lib/db';

const TABLE_ID = process.env.AIRTABLE_WAITLIST_FORM || '';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { name, email, phone, country } = data;

    if (!name || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Save to RDS
    await query(
      `INSERT INTO waitlist (waitlist_entry, full_name, email, phone, country_of_residence, accepted_terms, form_source, waitlist_status, date_submitted)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())`,
      [
        `${name} - ${new Date().toISOString().split('T')[0]}`,
        name, email, phone || '', country || '',
        true, 'website', 'Pending',
      ]
    );

    // Save to Airtable
    await createAirtableRecord(TABLE_ID, {
      'Waitlist Entry': `${name} - ${new Date().toISOString().split('T')[0]}`,
      'Full Name': name,
      'Email': email,
      'Phone': phone || '',
      'Country of Residence': country || '',
      'Accepted Terms': true,
      'Form Source': 'website',
      'Waitlist Status': 'Pending',
      'Date Submitted': new Date().toISOString().split('T')[0],
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[Waitlist API]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
