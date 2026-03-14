const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

interface AirtableRecord {
  fields: Record<string, unknown>;
}

export async function createAirtableRecord(tableId: string, fields: Record<string, unknown>): Promise<boolean> {
  if (!AIRTABLE_TOKEN || !AIRTABLE_BASE_ID) {
    console.warn('[Airtable] Missing token or base ID, skipping');
    return false;
  }

  try {
    const res = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${tableId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${AIRTABLE_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ records: [{ fields }] } as { records: AirtableRecord[] }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('[Airtable] Error:', res.status, err);
      return false;
    }

    return true;
  } catch (err) {
    console.error('[Airtable] Request failed:', err);
    return false;
  }
}
