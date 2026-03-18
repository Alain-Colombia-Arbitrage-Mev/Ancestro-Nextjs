import { NextRequest, NextResponse } from 'next/server';
import { createAirtableRecord } from '@/lib/airtable';

const TABLE_ID = process.env.AIRTABLE_INVEST_FORM || '';
const LAMBDA_WEBHOOK_URL = process.env.LAMBDA_WEBHOOK_URL || 'https://4518za7znc.execute-api.us-east-1.amazonaws.com/prod/kyc/webhook';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const {
      name, email, phone, amount, message,
      dateOfBirth, address, citizenship, investorType,
      accreditationCriteria, entityCriteria,
      sourceOfFunds, sourceOfFundsOther,
      isPep, pepDetails,
      isUsCitizen, usTaxId,
      declarationAccepted,
      signatureType, signatureData,
      visitorId,
    } = data;

    if (!name || !email || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Accreditation status logic
    const accreditationStatus = (isPep || isUsCitizen) ? 'Requires Review' : 'Pending';

    // Save to Lambda (RDS) and Airtable in parallel
    const [lambdaResult, airtableResult] = await Promise.allSettled([
      // Send to Lambda webhook → saves to RDS
      fetch(LAMBDA_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: 'invest-form', ...data }),
      }).then(async (res) => {
        if (!res.ok) {
          const body = await res.text();
          throw new Error(`Lambda ${res.status}: ${body}`);
        }
        return res.json();
      }),

      // Save to Airtable
      createAirtableRecord(TABLE_ID, {
        'Investment Request': `${name} - ${amount} - ${new Date().toISOString().split('T')[0]}`,
        'Full Name': name,
        'Email': email,
        ...(phone && { 'Phone': phone }),
        'Investment Range (USD)': amount,
        ...(message && { 'Message': message }),
        // Investor Info — only include non-empty values (Airtable rejects empty dates/strings for typed fields)
        ...(dateOfBirth && { 'Date of Birth': dateOfBirth }),
        ...(address && { 'Address': address }),
        ...(citizenship && { 'Citizenship': citizenship }),
        'Investor Type': investorType ? investorType.charAt(0).toUpperCase() + investorType.slice(1) : 'Individual',
        // Accreditation
        ...(accreditationCriteria?.includes('incomeIndividual') && { 'Income Individual 200K': true }),
        ...(accreditationCriteria?.includes('incomeJoint') && { 'Income Joint 300K': true }),
        ...(accreditationCriteria?.includes('netWorth') && { 'Net Worth 1M': true }),
        ...(accreditationCriteria?.includes('professional') && { 'Professional Cert': true }),
        ...(accreditationCriteria?.includes('insider') && { 'Company Insider': true }),
        ...(accreditationCriteria?.includes('knowledgeable') && { 'Knowledgeable Employee': true }),
        // Entity Accreditation
        ...(entityCriteria?.includes('bank') && { 'Entity Financial Institution': true }),
        ...(entityCriteria?.includes('benefitPlan') && { 'Entity Benefit Plan 5M': true }),
        ...(entityCriteria?.includes('privateFund') && { 'Entity Private Fund 5M': true }),
        ...(entityCriteria?.includes('familyOffice') && { 'Entity Family Office 5M': true }),
        ...(entityCriteria?.includes('entityAssets') && { 'Entity Assets 5M': true }),
        ...(entityCriteria?.includes('allAccredited') && { 'Entity All Accredited': true }),
        // AML
        ...(sourceOfFunds && { 'Source of Funds': ({ salary: 'Salary', business: 'Business', investments: 'Investments', inheritance: 'Inheritance', savings: 'Savings', realEstate: 'Real Estate', other: 'Other' } as Record<string, string>)[sourceOfFunds as string] || sourceOfFunds }),
        ...(sourceOfFundsOther && { 'Source Other Detail': sourceOfFundsOther }),
        'Is PEP': isPep || false,
        ...(pepDetails && { 'PEP Details': pepDetails }),
        'Is US Citizen': isUsCitizen || false,
        ...(usTaxId && { 'US Tax ID': usTaxId }),
        // Signature & Status
        ...(signatureType && { 'Signature Type': signatureType === 'draw' ? 'Draw' : 'Type' }),
        ...(signatureData && !signatureData.startsWith('data:') && { 'Signature Text': signatureData }),
        'Declaration Accepted': declarationAccepted || false,
        'Accreditation Status': accreditationStatus,
        'Form Source': 'Investment Web Form',
        'Follow-Up Status': 'New',
        'Submission Date': new Date().toISOString(),
        'Department Notified': 'Investment',
      }),
    ]);

    // Log results for debugging
    console.log('[Invest API] Lambda:', lambdaResult.status, lambdaResult.status === 'rejected' ? lambdaResult.reason?.message : 'OK');
    console.log('[Invest API] Airtable:', airtableResult.status, airtableResult.status === 'rejected' ? airtableResult.reason?.message : 'OK');

    if (lambdaResult.status === 'rejected') {
      console.error('[Invest API] Lambda failed:', lambdaResult.reason);
    }
    if (airtableResult.status === 'rejected') {
      console.error('[Invest API] Airtable failed:', airtableResult.reason);
    }

    // Fail only if both destinations failed
    if (lambdaResult.status === 'rejected' && airtableResult.status === 'rejected') {
      return NextResponse.json({ error: 'Failed to save investment request' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[Invest API]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
