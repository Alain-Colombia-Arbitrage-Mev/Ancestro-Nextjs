import { NextRequest, NextResponse } from 'next/server';
import { createAirtableRecord } from '@/lib/airtable';
import { query } from '@/lib/db';

const TABLE_ID = process.env.AIRTABLE_WAITLIST_FORM || '';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { profile, name, email, phone, company, country, city, investment, experience, message, lang } = data;

    if (!profile || !name || !email || !phone || !country) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const notes = [
      `Profile: ${profile}`,
      company ? `Company: ${company}` : '',
      city ? `City: ${city}` : '',
      investment ? `Investment: ${investment}` : '',
      experience ? `Experience: ${experience}` : '',
      message ? `Message: ${message}` : '',
      `Lang: ${lang || 'es'}`,
    ].filter(Boolean).join('\n');

    // Save to RDS
    await query(
      `INSERT INTO waitlist (waitlist_entry, full_name, email, phone, country_of_residence, accepted_terms, form_source, waitlist_status, date_submitted, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), $9)`,
      [
        `[${profile}] ${name} - ${new Date().toISOString().split('T')[0]}`,
        name, email, phone, country,
        true, 'join-page', 'Pending', notes,
      ]
    );

    // Save to Airtable
    await createAirtableRecord(TABLE_ID, {
      'Waitlist Entry': `[${profile}] ${name} - ${new Date().toISOString().split('T')[0]}`,
      'Full Name': name,
      'Email': email,
      'Phone': phone,
      'Country of Residence': country,
      'Form Source': 'join-page',
      'Waitlist Status': 'Pending',
      'Date Submitted': new Date().toISOString().split('T')[0],
      'Notes': notes,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[Join API]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
