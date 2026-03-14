import { NextRequest, NextResponse } from 'next/server';
import { createAirtableRecord } from '@/lib/airtable';

const TABLE_ID = process.env.AIRTABLE_INVEST_FORM || '';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { name, email, phone, amount, message } = data;

    if (!name || !email || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Save to Airtable
    await createAirtableRecord(TABLE_ID, {
      'Investment Request': `${name} - ${amount} - ${new Date().toISOString().split('T')[0]}`,
      'Full Name': name,
      'Email': email,
      'Phone': phone || '',
      'Investment Range USD': amount,
      'Message': message || '',
      'Form Source': 'invest-page',
      'Follow Up Status': 'New',
      'Assigned To': '',
      'Submission Date': new Date().toISOString().split('T')[0],
      'Department Notified': 'Investor Relations',
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[Invest API]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
