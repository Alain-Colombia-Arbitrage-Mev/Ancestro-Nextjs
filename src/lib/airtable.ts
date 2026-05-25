const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

interface AirtableRecord {
  fields: Record<string, unknown>;
}

export async function createAirtableRecord(tableId: string, fields: Record<string, unknown>): Promise<boolean> {
  if (!AIRTABLE_TOKEN || !AIRTABLE_BASE_ID) {
    throw new Error('[Airtable] Missing AIRTABLE_TOKEN or AIRTABLE_BASE_ID');
  }

  if (!tableId) {
    throw new Error('[Airtable] Missing tableId (AIRTABLE_INVEST_FORM)');
  }

  const res = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${tableId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${AIRTABLE_TOKEN}`,
      'Content-Type': 'application/json',
    },
    // typecast lets Airtable auto-create missing singleSelect options
    // (e.g. Profile Type "customer"); without it the API returns 422
    // INVALID_MULTIPLE_CHOICE_OPTIONS.
    body: JSON.stringify({ records: [{ fields }], typecast: true } as { records: AirtableRecord[]; typecast: boolean }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`[Airtable] ${res.status}: ${err}`);
  }

  return true;
}
