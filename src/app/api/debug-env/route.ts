import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    R2_ACCOUNT_ID: process.env.R2_ACCOUNT_ID ? 'SET' : 'MISSING',
    R2_API_TOKEN: process.env.R2_API_TOKEN ? 'SET' : 'MISSING',
    AIRTABLE_TOKEN: process.env.AIRTABLE_TOKEN ? 'SET' : 'MISSING',
    AIRTABLE_BASE_ID: process.env.AIRTABLE_BASE_ID ? 'SET' : 'MISSING',
    AIRTABLE_INVEST_FORM: process.env.AIRTABLE_INVEST_FORM ? 'SET' : 'MISSING',
    LAMBDA_WEBHOOK_URL: process.env.LAMBDA_WEBHOOK_URL ? 'SET' : 'MISSING',
  });
}
