import { NextRequest, NextResponse } from 'next/server';
import { createAirtableRecord } from '@/lib/airtable';
import { query } from '@/lib/db';

const TABLE_ID = process.env.AIRTABLE_INVEST_FORM || '';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const {
      fullName, dateOfBirth, address, citizenship, email, phone,
      investorType,
      accreditationCriteria = [],
      entityCriteria = [],
      sourceOfFunds, sourceOfFundsOther,
      isPep, pepDetails,
      isUsCitizen, usTaxId,
      acceptedRepresentations,
    } = data;

    if (!fullName || !email || !acceptedRepresentations) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const flagged = isPep || isUsCitizen;
    const accreditationStatus = flagged ? 'Requires Review' : 'Pending';

    // Save to RDS
    await query(
      `INSERT INTO investment_requests (
        investment_request, full_name, email, phone,
        date_of_birth, address, citizenship, investor_type,
        accreditation_criteria, entity_criteria,
        source_of_funds, source_of_funds_other,
        is_pep, pep_details, is_us_citizen, us_tax_id,
        declaration_accepted, accreditation_status,
        form_source, follow_up_status, submission_date, department_notified
      ) VALUES (
        $1, $2, $3, $4,
        $5, $6, $7, $8,
        $9, $10,
        $11, $12,
        $13, $14, $15, $16,
        $17, $18,
        $19, $20, NOW(), $21
      )`,
      [
        `[SEC501a] ${fullName} - ${new Date().toISOString().split('T')[0]}`,
        fullName, email, phone || '',
        dateOfBirth || null, address || '', citizenship || '', investorType || 'individual',
        accreditationCriteria, entityCriteria,
        sourceOfFunds || '', sourceOfFundsOther || null,
        isPep || false, pepDetails || null,
        isUsCitizen || false, usTaxId || null,
        true, accreditationStatus,
        'invest-questionnaire', 'New', 'Investor Relations',
      ]
    );

    // Save to Airtable
    const airtableFields: Record<string, unknown> = {
      'Investment Request': `[SEC501a] ${fullName} - ${new Date().toISOString().split('T')[0]}`,
      'Full Name': fullName,
      'Email': email,
      'Phone': phone || '',
      'Form Source': 'Investment Web Form',
      'Follow-Up Status': 'New',
      'Submission Date': new Date().toISOString(),
      'Department Notified': 'Investment',

      // Investor info
      'Date of Birth': dateOfBirth || '',
      'Address': address || '',
      'Citizenship': citizenship || '',
      'Investor Type': investorType === 'individual' ? 'Individual' : investorType === 'joint' ? 'Joint' : 'Entity',

      // Accreditation checkboxes
      'Income Individual 200K': accreditationCriteria.includes('incomeIndividual'),
      'Income Joint 300K': accreditationCriteria.includes('incomeJoint'),
      'Net Worth 1M': accreditationCriteria.includes('netWorth'),
      'Professional Cert': accreditationCriteria.includes('professional'),
      'Company Insider': accreditationCriteria.includes('insider'),
      'Knowledgeable Employee': accreditationCriteria.includes('knowledgeable'),

      // Entity checkboxes
      'Entity Financial Institution': entityCriteria.includes('bank'),
      'Entity Benefit Plan 5M': entityCriteria.includes('benefitPlan'),
      'Entity Private Fund 5M': entityCriteria.includes('privateFund'),
      'Entity Family Office 5M': entityCriteria.includes('familyOffice'),
      'Entity Assets 5M': entityCriteria.includes('entityAssets'),
      'Entity All Accredited': entityCriteria.includes('allAccredited'),

      // AML
      'Source of Funds': sourceOfFunds ? sourceOfFunds.charAt(0).toUpperCase() + sourceOfFunds.slice(1) : '',
      'Source Other Detail': sourceOfFundsOther || '',
      'Is PEP': isPep || false,
      'PEP Details': pepDetails || '',
      'Is US Citizen': isUsCitizen || false,
      'US Tax ID': usTaxId || '',

      // Status
      'Declaration Accepted': true,
      'Accreditation Status': accreditationStatus,
    };

    await createAirtableRecord(TABLE_ID, airtableFields);

    return NextResponse.json({ success: true, accreditationStatus });
  } catch (err) {
    console.error('[Investor Onboarding API]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
