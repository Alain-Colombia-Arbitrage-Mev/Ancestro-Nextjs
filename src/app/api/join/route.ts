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
    const errors: { db?: string; airtable?: string } = {};

    // ==========================================
    // INVESTOR
    // ==========================================
    if (profile === 'investor') {
      try {
        const res = await query(
          `INSERT INTO investment_requests (
            investment_request, full_name, email, phone, investment_range_usd,
            message, form_source, follow_up_status, submission_date,
            department_notified, notes, accreditation_status,
            country, city, company, experience
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,NOW(),$9,$10,$11,$12,$13,$14,$15)
          RETURNING id`,
          [label, name, email, phone, investment || null, message || null,
           'join-page', 'New', 'Investment', notes, 'pending',
           country || null, city || null, company || null, experience || null]
        );
        dbOk = !!res?.rowCount;
      } catch (e) {
        errors.db = e instanceof Error ? e.message : String(e);
        console.error('[DB Invest]', { email, name, err: errors.db });
      }

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
          'Country': country || '',
          'City': city || '',
          'Company': company || '',
          'Experience': experience || '',
        });
        airtableOk = true;
      } catch (e) {
        errors.airtable = e instanceof Error ? e.message : String(e);
        console.error('[Airtable Invest]', { email, table: INVEST_TABLE, err: errors.airtable });
      }

    // ==========================================
    // GOVERNMENT
    // ==========================================
    } else if (profile === 'government') {
      try {
        const res = await query(
          `INSERT INTO contacts (
            contact_name, contact_reason, full_name, email, phone,
            message, form_source, follow_up_status, notes, date_submitted,
            country, city, company, experience, investment_range, profile_type
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,NOW(),$10,$11,$12,$13,$14,$15)
          RETURNING id`,
          [label, 'Information', name, email, phone,
           message || '', 'join-government', 'New', notes,
           country || null, city || null, company || null, experience || null,
           investment || null, profile]
        );
        dbOk = !!res?.rowCount;
      } catch (e) {
        errors.db = e instanceof Error ? e.message : String(e);
        console.error('[DB Contact]', { email, err: errors.db });
      }

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
          'Country': country || '',
          'City': city || '',
          'Company': company || '',
          'Experience': experience || '',
          'Profile Type': profile,
        });
        airtableOk = true;
      } catch (e) {
        errors.airtable = e instanceof Error ? e.message : String(e);
        console.error('[Airtable Contact]', { email, table: CONTACT_TABLE, err: errors.airtable });
      }

    // ==========================================
    // ALL OTHERS (strategic, installer, energy, logistics, advisor, host, supplier)
    // ==========================================
    } else {
      try {
        const res = await query(
          `INSERT INTO waitlist (
            waitlist_entry, full_name, email, phone, country_of_residence,
            accepted_terms, form_source, waitlist_status, date_submitted,
            notes, company, city, profile_type, investment_range, experience
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,NOW(),$9,$10,$11,$12,$13,$14)
          RETURNING id`,
          [label, name, email, phone, country, true, `join-${profile}`, 'Pending',
           notes, company || null, city || null, profile, investment || null, experience || null]
        );
        dbOk = !!res?.rowCount;
      } catch (e) {
        errors.db = e instanceof Error ? e.message : String(e);
        console.error('[DB Waitlist]', { email, profile, err: errors.db });
      }

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
          'Company': company || '',
          'City': city || '',
          'Profile Type': profile,
          'Investment Range': investment || '',
          'Experience': experience || '',
        });
        airtableOk = true;
      } catch (e) {
        errors.airtable = e instanceof Error ? e.message : String(e);
        console.error('[Airtable Waitlist]', { email, profile, table: WAITLIST_TABLE, err: errors.airtable });
      }
    }

    if (!dbOk && !airtableOk) {
      console.error('[Join API] BOTH sinks failed', { profile, email, errors });
      return NextResponse.json(
        { success: false, error: 'All storage backends failed', db: false, airtable: false, errors },
        { status: 502 }
      );
    }

    if (!dbOk || !airtableOk) {
      console.warn('[Join API] Partial success', { profile, email, db: dbOk, airtable: airtableOk, errors });
    }

    return NextResponse.json({ success: true, profile, db: dbOk, airtable: airtableOk });
  } catch (err) {
    console.error('[Join API] Uncaught', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
