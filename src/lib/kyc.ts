export type KycStatus = 'not_started' | 'pending' | 'verified' | 'rejected';

export interface KycProfile {
  fullName: string;
  email: string;
  phone: string;
  investorType: string;
  citizenship: string;
  sourceOfFunds: string;
  sourceOfFundsOther: string;
  isPep: boolean;
  pepDetails: string;
  isUsCitizen: boolean;
  usTaxId: string;
}

export interface KycResult {
  status: KycStatus;
  profile: KycProfile | null;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// Normalize backend status values to our expected KycStatus type
export function normalizeKycStatus(status: string | undefined | null): KycStatus {
  if (!status) return 'not_started';
  const s = status.toLowerCase().trim();
  if (s === 'verified' || s === 'completed' || s === 'approved') return 'verified';
  if (s === 'pending' || s === 'in_progress' || s === 'reviewneeded') return 'pending';
  if (s === 'rejected' || s === 'declined' || s === 'failed') return 'rejected';
  if (s === 'not_started') return 'not_started';
  return 'not_started';
}

export async function fetchKycStatus(token: string): Promise<KycResult | null> {
  try {
    const res = await fetch(`${API_URL}/api/kyc/status`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null; // null = fetch failed, don't overwrite cached status
    const data = await res.json();
    return {
      status: normalizeKycStatus(data.status),
      profile: data.profile || null,
    };
  } catch {
    return null; // null = network error, don't overwrite cached status
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
