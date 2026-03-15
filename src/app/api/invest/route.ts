import { NextRequest, NextResponse } from 'next/server';
import { createAirtableRecord } from '@/lib/airtable';
import { query } from '@/lib/db';

const TABLE_ID = process.env.AIRTABLE_INVEST_FORM || '';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { name, email, phone, amount, message } = data;

    if (!name || !email || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Save to RDS
    await query(
      `INSERT INTO investment_requests (investment_request, full_name, email, phone, investment_range_usd, message, form_source, follow_up_status, assigned_to, submission_date, department_notified)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), $10)`,
      [
        `${name} - ${amount} - ${new Date().toISOString().split('T')[0]}`,
        name, email, phone || '', amount, message || '',
        'invest-page', 'New', '', 'Investor Relations',
      ]
    );

    // Save to Airtable
    await createAirtableRecord(TABLE_ID, {
      'Investment Request': `${name} - ${amount} - ${new Date().toISOString().split('T')[0]}`,
      'Full Name': name,
      'Email': email,
      'Phone': phone || '',
      'Investment Range (USD)': amount,
      'Message': message || '',
      'Form Source': 'Investment Web Form',
      'Follow-Up Status': 'New',
      'Submission Date': new Date().toISOString(),
      'Department Notified': 'Investment',
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[Invest API]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
