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

    const missing: string[] = [];
    if (!profile) missing.push('profile');
    if (!name) missing.push('name');
    if (!email) missing.push('email');
    if (!phone) missing.push('phone');
    if (!country) missing.push('country');
    if (missing.length) {
      console.warn('[Join API] Missing fields:', missing, { profile, hasEmail: !!email });
      return NextResponse.json({ error: 'Missing required fields', missing }, { status: 400 });
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

    let dbOk = false;
    let airtableOk = false;

    // ==========================================
    // INVESTOR
    // ==========================================
    if (profile === 'investor') {
      try {
        await query(
          `INSERT INTO investment_requests (
            investment_request, full_name, email, phone, investment_range_usd,
            message, form_source, follow_up_status, submission_date,
            department_notified, notes, accreditation_status
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,NOW(),$9,$10,$11)`,
          [label, name, email, phone, investment || null, message || null,
           'join-page', 'New', 'Investment', notes, 'pending']
        );
        dbOk = true;
      } catch (e) { console.error("[DB Invest]", { email, name, err: e instanceof Error ? e.message : e }); }

      try {
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
        });
        airtableOk = true;
      } catch (e) { console.error("[Airtable Invest]", { email, table: INVEST_TABLE, err: e instanceof Error ? e.message : e }); }

    // ==========================================
    // GOVERNMENT
    // ==========================================
    } else if (profile === 'government') {
      try {
        await query(
          `INSERT INTO contacts (
            contact_name, contact_reason, full_name, email, phone,
            message, form_source, follow_up_status, notes, date_submitted
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,NOW())`,
          [label, 'Information', name, email, phone,
           message || '', 'join-government', 'New', notes]
        );
        dbOk = true;
      } catch (e) { console.error("[DB Contact]", { email, err: e instanceof Error ? e.message : e }); }

      try {
        await createAirtableRecord(CONTACT_TABLE, {
          'Contact Name': label,
          'Contact Reason': 'Information',
          'Full Name': name,
          'Email': email,
          'Phone': phone,
          'Message': message || notes,
          'Form Source': 'Website',
          'Follow-Up Status': 'New',
          'Notes': notes,
        });
        airtableOk = true;
      } catch (e) { console.error("[Airtable Contact]", { email, table: CONTACT_TABLE, err: e instanceof Error ? e.message : e }); }

    // ==========================================
    // ALL OTHERS (strategic, installer, energy, logistics, advisor)
    // ==========================================
    } else {
      try {
        await query(
          `INSERT INTO waitlist (
            waitlist_entry, full_name, email, phone, country_of_residence,
            accepted_terms, form_source, waitlist_status, date_submitted,
            notes, company, city, profile_type, investment_range, experience
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,NOW(),$9,$10,$11,$12,$13,$14)`,
          [label, name, email, phone, country, true, `join-${profile}`, 'Pending',
           notes, company || null, city || null, profile, investment || null, experience || null]
        );
        dbOk = true;
      } catch (e) { console.error("[DB Waitlist]", { email, profile, err: e instanceof Error ? e.message : e }); }

      try {
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
        });
        airtableOk = true;
      } catch (e) { console.error("[Airtable Waitlist]", { email, profile, table: WAITLIST_TABLE, err: e instanceof Error ? e.message : e }); }
    }

    if (!dbOk && !airtableOk) {
      console.error('[Join API] BOTH sinks failed', { profile, email });
      return NextResponse.json(
        { success: false, error: 'All storage backends failed', db: false, airtable: false },
        { status: 502 }
      );
    }

    if (!dbOk || !airtableOk) {
      console.warn('[Join API] Partial success', { profile, email, db: dbOk, airtable: airtableOk });
    }

    return NextResponse.json({ success: true, profile, db: dbOk, airtable: airtableOk });
  } catch (err) {
    console.error('[Join API]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
