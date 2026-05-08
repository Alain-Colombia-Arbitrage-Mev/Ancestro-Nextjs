import { NextRequest, NextResponse } from 'next/server';
import { createAirtableRecord } from '@/lib/airtable';
import { query } from '@/lib/db';

const PROPOSAL_TABLE = process.env.AIRTABLE_PROPOSAL_TABLE || '';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const {
      full_name, email, phone, address,
      property_type, roof_type, bill_range,
      system_selected, payment_type, price, lang,
    } = data;

    const missing: string[] = [];
    if (!full_name) missing.push('full_name');
    if (!email) missing.push('email');
    if (missing.length) {
      return NextResponse.json({ error: 'Missing required fields', missing }, { status: 400 });
    }

    const notes = [
      `Property: ${property_type || 'N/A'}`,
      `Roof: ${roof_type || 'N/A'}`,
      `Bill: ${bill_range || 'N/A'}`,
      `System: ${system_selected || 'N/A'}`,
      `Payment: ${payment_type || 'N/A'}`,
      `Price: ${price || 'N/A'}`,
      `Address: ${address || 'N/A'}`,
      phone ? `Phone: ${phone}` : '',
      `Lang: ${lang || 'es'}`,
    ].filter(Boolean).join('\n');

    const label = `[${system_selected || 'proposal'}] ${full_name} - ${new Date().toISOString().split('T')[0]}`;
    const dateStr = new Date().toISOString().split('T')[0];

    let dbOk = false;
    let airtableOk = false;
    const errors: { db?: string; airtable?: string } = {};

    try {
      const res = await query(
        `INSERT INTO proposal_requests (
          full_name, email, phone, address,
          property_type, roof_type, bill_range,
          system_selected, payment_type, price,
          lang, form_source, follow_up_status, notes
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
        RETURNING id`,
        [
          full_name, email, phone || null, address || null,
          property_type || null, roof_type || null, bill_range || null,
          system_selected || null, payment_type || null, price || null,
          lang || 'es', 'proposal-page', 'New', notes,
        ]
      );
      dbOk = !!res?.rowCount;
    } catch (e) {
      errors.db = e instanceof Error ? e.message : String(e);
      console.error('[DB Proposal]', { email, err: errors.db });
    }

    if (PROPOSAL_TABLE) {
      try {
        const fields: Record<string, unknown> = {};
        if (full_name) fields['Full Name'] = full_name;
        if (email) fields['Email'] = email;
        if (phone) fields['Phone'] = phone;
        if (address) fields['Address'] = address;
        if (property_type) fields['Property Type'] = property_type;
        if (roof_type) fields['Roof Type'] = roof_type;
        if (bill_range) fields['Bill Range'] = bill_range;
        if (system_selected) fields['System'] = system_selected;
        if (payment_type) fields['Payment Type'] = payment_type;
        if (price) fields['Price'] = price;
        if (lang) fields['Language'] = lang;
        fields['Proposal Request'] = label;
        fields['Form Source'] = 'Proposal Page';
        fields['Follow-Up Status'] = 'New';
        fields['Submission Date'] = dateStr;
        fields['Notes'] = notes;

        await createAirtableRecord(PROPOSAL_TABLE, fields);
        airtableOk = true;
      } catch (e) {
        errors.airtable = e instanceof Error ? e.message : String(e);
        console.error('[Airtable Proposal]', { email, err: errors.airtable });
      }
    }

    if (!dbOk && !airtableOk) {
      return NextResponse.json(
        { success: false, error: 'All storage backends failed', db: false, airtable: false, errors },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      db: dbOk,
      airtable: airtableOk || !PROPOSAL_TABLE,
      ...((errors.db || errors.airtable) && { errors }),
    });
  } catch (err) {
    console.error('[Proposal API] Uncaught', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
