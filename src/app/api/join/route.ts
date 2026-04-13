import { NextRequest, NextResponse } from 'next/server';
import { createAirtableRecord } from '@/lib/airtable';
import { query } from '@/lib/db';

const WAITLIST_TABLE = process.env.AIRTABLE_WAITLIST_FORM || '';
const INVEST_TABLE = process.env.AIRTABLE_INVEST_FORM || '';
const CONTACT_TABLE = process.env.AIRTABLE_CONTACT_FORM || '';

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

    const label = `[${profile}] ${name} - ${new Date().toISOString().split('T')[0]}`;
    const dateStr = new Date().toISOString().split('T')[0];

    if (profile === 'investor') {
      // Save to investment_requests
      await query(
        `INSERT INTO investment_requests (
          investment_request, full_name, email, phone, investment_range_usd,
          message, form_source, follow_up_status, submitted_date, notes
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), $9)`,
        [label, name, email, phone, investment || null, message || null, 'join-page', 'New', notes]
      );

      // Sync to Airtable invest form
      await createAirtableRecord(INVEST_TABLE, {
        'Investment Request': label,
        'Full Name': name,
        'Email': email,
        'Phone': phone,
        'Investment Range (USD)': investment || '',
        'Message': message || '',
        'Form Source': 'join-page',
        'Follow-Up Status': 'New',
        'Date Submitted': dateStr,
        'Notes': notes,
      }).catch(() => {});

    } else if (profile === 'installer') {
      // Save to waitlist + mark as installer partner
      await query(
        `INSERT INTO waitlist (
          waitlist_entry, full_name, email, phone, country_of_residence,
          accepted_terms, form_source, waitlist_status, date_submitted, notes
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), $9)`,
        [label, name, email, phone, country, true, 'join-installer', 'Pending', notes]
      );

      await createAirtableRecord(WAITLIST_TABLE, {
        'Waitlist Entry': label,
        'Full Name': name,
        'Email': email,
        'Phone': phone,
        'Country of Residence': country,
        'Form Source': 'join-installer',
        'Waitlist Status': 'Pending',
        'Date Submitted': dateStr,
        'Notes': notes,
      }).catch(() => {});

    } else if (profile === 'government') {
      // Save to contacts
      await query(
        `INSERT INTO contacts (
          contact_name, reason, full_name, email, phone, message,
          form_source, follow_up_status, date_submitted
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())`,
        [label, 'Government Partnership', name, email, phone, notes, 'join-government', 'New']
      );

      await createAirtableRecord(CONTACT_TABLE, {
        'Contact Name': label,
        'Reason': 'Government Partnership',
        'Full Name': name,
        'Email': email,
        'Phone': phone,
        'Message': notes,
        'Form Source': 'join-government',
        'Follow-Up Status': 'New',
        'Date Submitted': dateStr,
      }).catch(() => {});

    } else {
      // strategic, energy, logistics, advisor → waitlist
      await query(
        `INSERT INTO waitlist (
          waitlist_entry, full_name, email, phone, country_of_residence,
          accepted_terms, form_source, waitlist_status, date_submitted, notes
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), $9)`,
        [label, name, email, phone, country, true, `join-${profile}`, 'Pending', notes]
      );

      await createAirtableRecord(WAITLIST_TABLE, {
        'Waitlist Entry': label,
        'Full Name': name,
        'Email': email,
        'Phone': phone,
        'Country of Residence': country,
        'Form Source': `join-${profile}`,
        'Waitlist Status': 'Pending',
        'Date Submitted': dateStr,
        'Notes': notes,
      }).catch(() => {});
    }

    return NextResponse.json({ success: true, profile });
  } catch (err) {
    console.error('[Join API]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
