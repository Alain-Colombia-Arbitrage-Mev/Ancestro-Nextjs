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

    // ==========================================
    // INVESTOR → investment_requests + Airtable Invest
    // ==========================================
    if (profile === 'investor') {
      // RDS - form_source can be any string
      await query(
        `INSERT INTO investment_requests (
          investment_request, full_name, email, phone, investment_range_usd,
          message, form_source, follow_up_status, submission_date,
          department_notified, notes, accreditation_status
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,NOW(),$9,$10,$11)`,
        [label, name, email, phone, investment || null, message || null,
         'join-page', 'New', 'Investment', notes, 'pending']
      );

      // Airtable - Form Source must be existing option: "Investment Web Form"
      await createAirtableRecord(INVEST_TABLE, {
        'Investment Request': label,
        'Full Name': name,
        'Email': email,
        'Phone': phone,
        'Investment Range (USD)': investment || '',
        'Message': message || '',
        'Form Source': 'Investment Web Form',
        'Follow-Up Status': 'New',
        'Submission Date': dateStr,
        'Department Notified': 'Investment',
        'Notes': notes,
        'Accreditation Status': 'Pending',
      }).catch((err) => console.error('[Airtable Invest]', err));

    // ==========================================
    // GOVERNMENT → contacts + Airtable Contact
    // ==========================================
    } else if (profile === 'government') {
      await query(
        `INSERT INTO contacts (
          contact_name, contact_reason, full_name, email, phone,
          message, form_source, follow_up_status, notes, date_submitted
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,NOW())`,
        [label, 'Government Partnership', name, email, phone,
         message || '', 'join-government', 'New', notes]
      );

      // Airtable - Form Source must be: "Website"
      await createAirtableRecord(CONTACT_TABLE, {
        'Contact Name': label,
        'Contact Reason': 'Government Partnership',
        'Full Name': name,
        'Email': email,
        'Phone': phone,
        'Message': message || notes,
        'Form Source': 'Website',
        'Follow-Up Status': 'New',
        'Notes': notes,
      }).catch((err) => console.error('[Airtable Contact]', err));

    // ==========================================
    // ALL OTHERS → waitlist + Airtable Waitlist
    // ==========================================
    } else {
      await query(
        `INSERT INTO waitlist (
          waitlist_entry, full_name, email, phone, country_of_residence,
          accepted_terms, form_source, waitlist_status, date_submitted,
          notes, company, city, profile_type, investment_range, experience
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,NOW(),$9,$10,$11,$12,$13,$14)`,
        [label, name, email, phone, country, true, `join-${profile}`, 'Pending',
         notes, company || null, city || null, profile, investment || null, experience || null]
      );

      // Airtable - Form Source must be: "Website"
      await createAirtableRecord(WAITLIST_TABLE, {
        'Waitlist Entry': label,
        'Full Name': name,
        'Email': email,
        'Phone': phone,
        'Country of Residence': country,
        'Form Source': 'Website',
        'Waitlist Status': 'Pending',
        'Date Submitted': dateStr,
        'Notes': notes,
      }).catch((err) => console.error('[Airtable Waitlist]', err));
    }

    return NextResponse.json({ success: true, profile });
  } catch (err) {
    console.error('[Join API]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
