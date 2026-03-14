export type KycStatus = 'not_started' | 'pending' | 'verified' | 'rejected';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function fetchKycStatus(token: string): Promise<KycStatus> {
  try {
    const res = await fetch(`${API_URL}/api/kyc/status`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return 'not_started';
    const data = await res.json();
    return data.status || 'not_started';
  } catch {
    return 'not_started';
  }
}

export async function markKycPending(token: string): Promise<void> {
  try {
    await fetch(`${API_URL}/api/kyc/pending`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    // silent fail
  }
}
