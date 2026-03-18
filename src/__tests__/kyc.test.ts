import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchKycStatus, normalizeKycStatus, markKycPending } from '@/lib/kyc';
import type { KycResult } from '@/lib/kyc';

// ─── normalizeKycStatus ───

describe('normalizeKycStatus', () => {
  it('maps "verified" to verified', () => {
    expect(normalizeKycStatus('verified')).toBe('verified');
  });

  it('maps "completed" to verified', () => {
    expect(normalizeKycStatus('completed')).toBe('verified');
  });

  it('maps "approved" to verified', () => {
    expect(normalizeKycStatus('approved')).toBe('verified');
  });

  it('maps "Verified" (capitalized) to verified', () => {
    expect(normalizeKycStatus('Verified')).toBe('verified');
  });

  it('maps "COMPLETED" (uppercase) to verified', () => {
    expect(normalizeKycStatus('COMPLETED')).toBe('verified');
  });

  it('maps "pending" to pending', () => {
    expect(normalizeKycStatus('pending')).toBe('pending');
  });

  it('maps "in_progress" to pending', () => {
    expect(normalizeKycStatus('in_progress')).toBe('pending');
  });

  it('maps "reviewNeeded" to pending', () => {
    expect(normalizeKycStatus('reviewNeeded')).toBe('pending');
  });

  it('maps "rejected" to rejected', () => {
    expect(normalizeKycStatus('rejected')).toBe('rejected');
  });

  it('maps "declined" to rejected', () => {
    expect(normalizeKycStatus('declined')).toBe('rejected');
  });

  it('maps "failed" to rejected', () => {
    expect(normalizeKycStatus('failed')).toBe('rejected');
  });

  it('maps "not_started" to not_started', () => {
    expect(normalizeKycStatus('not_started')).toBe('not_started');
  });

  it('returns not_started for null', () => {
    expect(normalizeKycStatus(null)).toBe('not_started');
  });

  it('returns not_started for undefined', () => {
    expect(normalizeKycStatus(undefined)).toBe('not_started');
  });

  it('returns not_started for empty string', () => {
    expect(normalizeKycStatus('')).toBe('not_started');
  });

  it('returns not_started for unknown status', () => {
    expect(normalizeKycStatus('some_random_status')).toBe('not_started');
  });

  it('handles whitespace around status', () => {
    expect(normalizeKycStatus('  verified  ')).toBe('verified');
  });
});

// ─── fetchKycStatus ───

describe('fetchKycStatus', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('returns KycResult with status and profile on success', async () => {
    const mockProfile = {
      fullName: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      investorType: 'individual',
      citizenship: 'US',
      sourceOfFunds: 'salary',
      sourceOfFundsOther: '',
      isPep: false,
      pepDetails: '',
      isUsCitizen: true,
      usTaxId: '123-45-6789',
    };

    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ status: 'verified', profile: mockProfile }),
    });

    const result = await fetchKycStatus('test-token');
    expect(result).not.toBeNull();
    expect(result!.status).toBe('verified');
    expect(result!.profile).toEqual(mockProfile);
  });

  it('returns KycResult with null profile when no profile in response', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ status: 'verified' }),
    });

    const result = await fetchKycStatus('test-token');
    expect(result).not.toBeNull();
    expect(result!.status).toBe('verified');
    expect(result!.profile).toBeNull();
  });

  it('returns null on non-ok response (does not overwrite cache)', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false,
      status: 401,
    });

    const result = await fetchKycStatus('bad-token');
    expect(result).toBeNull();
  });

  it('returns null on network error (does not overwrite cache)', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Network error'));

    const result = await fetchKycStatus('test-token');
    expect(result).toBeNull();
  });

  it('normalizes backend "completed" to "verified"', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ status: 'completed' }),
    });

    const result = await fetchKycStatus('test-token');
    expect(result!.status).toBe('verified');
  });

  it('normalizes backend "approved" to "verified"', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ status: 'approved' }),
    });

    const result = await fetchKycStatus('test-token');
    expect(result!.status).toBe('verified');
  });

  it('sends correct Authorization header', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ status: 'not_started' }),
    });

    await fetchKycStatus('my-secret-token');

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/kyc/status'),
      { headers: { Authorization: 'Bearer my-secret-token' } }
    );
  });

  it('handles missing status field in response', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({}), // no status field
    });

    const result = await fetchKycStatus('test-token');
    expect(result!.status).toBe('not_started');
  });

  it('handles 500 server error gracefully', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false,
      status: 500,
    });

    const result = await fetchKycStatus('test-token');
    expect(result).toBeNull();
  });
});

// ─── markKycPending ───

describe('markKycPending', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('sends POST to /api/kyc/pending', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({ ok: true });

    await markKycPending('test-token');

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/kyc/pending'),
      { method: 'POST', headers: { Authorization: 'Bearer test-token' } }
    );
  });

  it('does not throw on network error', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Network error'));

    // Should not throw
    await expect(markKycPending('test-token')).resolves.toBeUndefined();
  });
});

// ─── Pre-fill logic ───

describe('Profile pre-fill logic', () => {
  it('profile data maps correctly to form fields', () => {
    const profile = {
      fullName: 'Maria Garcia',
      email: 'maria@test.com',
      phone: '+573001234567',
      investorType: 'individual',
      citizenship: 'Colombia',
      sourceOfFunds: 'business',
      sourceOfFundsOther: '',
      isPep: true,
      pepDetails: 'Government advisor',
      isUsCitizen: false,
      usTaxId: '',
    };

    // Simulate the prefill logic: only fill empty fields
    const existingFormData = {
      name: '', email: '', phone: '', amount: '', message: '',
      dateOfBirth: '', address: '', citizenship: '', investorType: 'individual',
      accreditationCriteria: [], entityCriteria: [],
      sourceOfFunds: '', sourceOfFundsOther: '',
      isPep: false, pepDetails: '',
      isUsCitizen: false, usTaxId: '',
      declarationAccepted: false,
      signatureType: 'type' as const, signatureData: '',
    };

    const prefilled = {
      ...existingFormData,
      name: existingFormData.name || profile.fullName,
      email: existingFormData.email || profile.email,
      phone: existingFormData.phone || profile.phone,
      citizenship: existingFormData.citizenship || profile.citizenship,
      investorType: existingFormData.investorType || profile.investorType,
      sourceOfFunds: existingFormData.sourceOfFunds || profile.sourceOfFunds,
      sourceOfFundsOther: existingFormData.sourceOfFundsOther || profile.sourceOfFundsOther,
      isPep: existingFormData.isPep || profile.isPep,
      pepDetails: existingFormData.pepDetails || profile.pepDetails,
      isUsCitizen: existingFormData.isUsCitizen || profile.isUsCitizen,
      usTaxId: existingFormData.usTaxId || profile.usTaxId,
    };

    expect(prefilled.name).toBe('Maria Garcia');
    expect(prefilled.email).toBe('maria@test.com');
    expect(prefilled.phone).toBe('+573001234567');
    expect(prefilled.citizenship).toBe('Colombia');
    expect(prefilled.sourceOfFunds).toBe('business');
    expect(prefilled.isPep).toBe(true);
    expect(prefilled.pepDetails).toBe('Government advisor');
    expect(prefilled.isUsCitizen).toBe(false);
  });

  it('does not overwrite user-entered data', () => {
    const profile = {
      fullName: 'Maria Garcia',
      email: 'maria@test.com',
      phone: '+573001234567',
      investorType: 'entity',
      citizenship: 'Colombia',
      sourceOfFunds: 'business',
      sourceOfFundsOther: '',
      isPep: false,
      pepDetails: '',
      isUsCitizen: false,
      usTaxId: '',
    };

    // User already entered some data
    const existingFormData = {
      name: 'Juan Perez',
      email: 'juan@custom.com',
      phone: '',  // empty — should be filled
      citizenship: 'Mexico',  // different — should NOT be overwritten
      investorType: 'individual',
      sourceOfFunds: 'salary',
    };

    const prefilled = {
      name: existingFormData.name || profile.fullName,
      email: existingFormData.email || profile.email,
      phone: existingFormData.phone || profile.phone,
      citizenship: existingFormData.citizenship || profile.citizenship,
      investorType: existingFormData.investorType || profile.investorType,
      sourceOfFunds: existingFormData.sourceOfFunds || profile.sourceOfFunds,
    };

    expect(prefilled.name).toBe('Juan Perez');  // kept user data
    expect(prefilled.email).toBe('juan@custom.com');  // kept user data
    expect(prefilled.phone).toBe('+573001234567');  // filled from profile (was empty)
    expect(prefilled.citizenship).toBe('Mexico');  // kept user data
    expect(prefilled.investorType).toBe('individual');  // kept user data
    expect(prefilled.sourceOfFunds).toBe('salary');  // kept user data
  });

  it('handles empty profile gracefully', () => {
    const profile = {
      fullName: '',
      email: '',
      phone: '',
      investorType: '',
      citizenship: '',
      sourceOfFunds: '',
      sourceOfFundsOther: '',
      isPep: false,
      pepDetails: '',
      isUsCitizen: false,
      usTaxId: '',
    };

    const existingFormData = {
      name: '', email: '', phone: '',
      citizenship: '', investorType: 'individual',
      sourceOfFunds: '',
    };

    const prefilled = {
      name: existingFormData.name || profile.fullName || '',
      email: existingFormData.email || profile.email || '',
      phone: existingFormData.phone || profile.phone || '',
      citizenship: existingFormData.citizenship || profile.citizenship || '',
      investorType: existingFormData.investorType || profile.investorType || 'individual',
      sourceOfFunds: existingFormData.sourceOfFunds || profile.sourceOfFunds || '',
    };

    expect(prefilled.name).toBe('');
    expect(prefilled.investorType).toBe('individual');  // keeps default
  });
});
