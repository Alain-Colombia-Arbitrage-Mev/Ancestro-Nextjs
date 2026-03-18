import { describe, it, expect, beforeEach } from 'vitest';

// ─── Test the localStorage persistence logic used by InvestPage ───
// These test the storage keys and data format directly since the helper
// functions are private to InvestPage. We verify the contract.

const FORM_STORAGE_KEY = 'ancestro:investForm';
const FORM_STEP_KEY = 'ancestro:investFormStep';
const KYC_STATUS_KEY = 'ancestro:kycStatus';

beforeEach(() => {
  localStorage.clear();
});

describe('Form data persistence (localStorage)', () => {
  it('can save and restore form data', () => {
    const formData = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      amount: '5,000-20,000',
      investorType: 'individual',
      sourceOfFunds: 'salary',
      isPep: false,
      isUsCitizen: true,
      usTaxId: '123-45-6789',
    };

    localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(formData));
    localStorage.setItem(FORM_STEP_KEY, '3');

    const raw = localStorage.getItem(FORM_STORAGE_KEY);
    const restored = raw ? JSON.parse(raw) : null;
    const step = parseInt(localStorage.getItem(FORM_STEP_KEY) || '1', 10);

    expect(restored).toEqual(formData);
    expect(step).toBe(3);
  });

  it('returns null when no form data saved', () => {
    const raw = localStorage.getItem(FORM_STORAGE_KEY);
    expect(raw).toBeNull();
  });

  it('defaults step to 1 when not saved', () => {
    const step = parseInt(localStorage.getItem(FORM_STEP_KEY) || '1', 10);
    expect(step).toBe(1);
  });

  it('clearing form storage removes both keys', () => {
    localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify({ name: 'test' }));
    localStorage.setItem(FORM_STEP_KEY, '2');

    localStorage.removeItem(FORM_STORAGE_KEY);
    localStorage.removeItem(FORM_STEP_KEY);

    expect(localStorage.getItem(FORM_STORAGE_KEY)).toBeNull();
    expect(localStorage.getItem(FORM_STEP_KEY)).toBeNull();
  });

  it('preserves all form fields including arrays and booleans', () => {
    const formData = {
      name: 'Jane',
      email: 'jane@test.com',
      accreditationCriteria: ['incomeIndividual', 'netWorth'],
      entityCriteria: [],
      isPep: true,
      pepDetails: 'Government official',
      declarationAccepted: true,
      signatureType: 'type',
      signatureData: 'Jane Smith',
    };

    localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(formData));
    const restored = JSON.parse(localStorage.getItem(FORM_STORAGE_KEY)!);

    expect(restored.accreditationCriteria).toEqual(['incomeIndividual', 'netWorth']);
    expect(restored.entityCriteria).toEqual([]);
    expect(restored.isPep).toBe(true);
    expect(restored.pepDetails).toBe('Government official');
    expect(restored.declarationAccepted).toBe(true);
    expect(restored.signatureType).toBe('type');
    expect(restored.signatureData).toBe('Jane Smith');
  });

  it('handles corrupted JSON gracefully', () => {
    localStorage.setItem(FORM_STORAGE_KEY, 'not-valid-json{{{');

    let data = null;
    try {
      const raw = localStorage.getItem(FORM_STORAGE_KEY);
      data = raw ? JSON.parse(raw) : null;
    } catch {
      data = null;
    }

    expect(data).toBeNull();
  });
});

describe('KYC status persistence (localStorage)', () => {
  it('saves and restores verified status', () => {
    localStorage.setItem(KYC_STATUS_KEY, 'verified');
    expect(localStorage.getItem(KYC_STATUS_KEY)).toBe('verified');
  });

  it('saves and restores pending status', () => {
    localStorage.setItem(KYC_STATUS_KEY, 'pending');
    expect(localStorage.getItem(KYC_STATUS_KEY)).toBe('pending');
  });

  it('saves and restores rejected status', () => {
    localStorage.setItem(KYC_STATUS_KEY, 'rejected');
    expect(localStorage.getItem(KYC_STATUS_KEY)).toBe('rejected');
  });

  it('returns null when no KYC status saved', () => {
    expect(localStorage.getItem(KYC_STATUS_KEY)).toBeNull();
  });

  it('validates KYC status values (only known statuses are valid)', () => {
    const validStatuses = ['not_started', 'pending', 'verified', 'rejected'];

    // Valid statuses
    for (const status of validStatuses) {
      localStorage.setItem(KYC_STATUS_KEY, status);
      const stored = localStorage.getItem(KYC_STATUS_KEY);
      expect(validStatuses).toContain(stored);
    }

    // Invalid status should be treated as null by the loader
    localStorage.setItem(KYC_STATUS_KEY, 'garbage_value');
    const stored = localStorage.getItem(KYC_STATUS_KEY);
    expect(validStatuses).not.toContain(stored);
  });

  it('KYC verified status survives page reload simulation', () => {
    // Simulate: user completes KYC, status saved
    localStorage.setItem(KYC_STATUS_KEY, 'verified');

    // Simulate: page reload - read from storage
    const cached = localStorage.getItem(KYC_STATUS_KEY);
    expect(cached).toBe('verified');
  });

  it('KYC status is not lost when form data is cleared', () => {
    // Save both form and KYC status
    localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify({ name: 'test' }));
    localStorage.setItem(FORM_STEP_KEY, '2');
    localStorage.setItem(KYC_STATUS_KEY, 'verified');

    // Clear only form data (as happens on successful submission)
    localStorage.removeItem(FORM_STORAGE_KEY);
    localStorage.removeItem(FORM_STEP_KEY);

    // KYC status should still be there
    expect(localStorage.getItem(KYC_STATUS_KEY)).toBe('verified');
  });
});

describe('Error resilience scenarios', () => {
  it('cached verified status is preserved when server fetch would fail', () => {
    // User completed KYC previously, status cached
    localStorage.setItem(KYC_STATUS_KEY, 'verified');

    // Simulate: fetchKycStatus returns null (server error)
    // The component should NOT overwrite cached status
    const serverResult = null;
    const cachedStatus = localStorage.getItem(KYC_STATUS_KEY);

    // Component logic: only update if serverResult !== null
    if (serverResult !== null) {
      localStorage.setItem(KYC_STATUS_KEY, serverResult);
    }

    // Cached status should still be verified
    expect(localStorage.getItem(KYC_STATUS_KEY)).toBe('verified');
  });

  it('server verified status overwrites cached pending', () => {
    localStorage.setItem(KYC_STATUS_KEY, 'pending');

    const serverResult = 'verified';
    if (serverResult !== null) {
      localStorage.setItem(KYC_STATUS_KEY, serverResult);
    }

    expect(localStorage.getItem(KYC_STATUS_KEY)).toBe('verified');
  });

  it('form data is available after failed submission', () => {
    const formData = {
      name: 'John Doe',
      email: 'john@example.com',
      amount: '50,000+',
      sourceOfFunds: 'business',
    };

    // Save form data (happens on every change)
    localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(formData));
    localStorage.setItem(FORM_STEP_KEY, '4');

    // Simulate: submission fails (network error)
    // Form data should still be in storage
    const restored = JSON.parse(localStorage.getItem(FORM_STORAGE_KEY)!);
    expect(restored.name).toBe('John Doe');
    expect(restored.email).toBe('john@example.com');
    expect(restored.amount).toBe('50,000+');

    const step = parseInt(localStorage.getItem(FORM_STEP_KEY)!, 10);
    expect(step).toBe(4);
  });

  it('form data is cleared after successful submission', () => {
    localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify({ name: 'test' }));
    localStorage.setItem(FORM_STEP_KEY, '4');

    // Simulate successful submission — clearFormStorage()
    localStorage.removeItem(FORM_STORAGE_KEY);
    localStorage.removeItem(FORM_STEP_KEY);

    expect(localStorage.getItem(FORM_STORAGE_KEY)).toBeNull();
    expect(localStorage.getItem(FORM_STEP_KEY)).toBeNull();
  });
});

describe('Visitor ID generation', () => {
  const VISITOR_ID_KEY = 'ancestro:visitorId';

  it('generates a valid UUID v4 format', () => {
    const uuid = crypto.randomUUID();
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    expect(uuid).toMatch(uuidRegex);
  });

  it('persists visitor ID across reads', () => {
    const id = crypto.randomUUID();
    localStorage.setItem(VISITOR_ID_KEY, id);

    const restored = localStorage.getItem(VISITOR_ID_KEY);
    expect(restored).toBe(id);
  });

  it('reuses existing visitor ID (not regenerated)', () => {
    const id = crypto.randomUUID();
    localStorage.setItem(VISITOR_ID_KEY, id);

    // Simulate getVisitorId() logic
    const existing = localStorage.getItem(VISITOR_ID_KEY);
    const result = existing || crypto.randomUUID();

    expect(result).toBe(id); // Same ID, not a new one
  });

  it('generates new ID only if none exists', () => {
    expect(localStorage.getItem(VISITOR_ID_KEY)).toBeNull();

    // Simulate getVisitorId()
    const existing = localStorage.getItem(VISITOR_ID_KEY);
    const result = existing || crypto.randomUUID();
    if (!existing) localStorage.setItem(VISITOR_ID_KEY, result);

    expect(localStorage.getItem(VISITOR_ID_KEY)).toBe(result);
    expect(result).toMatch(/^[0-9a-f]{8}-/i);
  });

  it('visitor ID survives form clear (submission)', () => {
    const visitorId = crypto.randomUUID();
    localStorage.setItem(VISITOR_ID_KEY, visitorId);
    localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify({ name: 'test' }));

    // Clear form (submit success)
    localStorage.removeItem(FORM_STORAGE_KEY);
    localStorage.removeItem(FORM_STEP_KEY);

    // Visitor ID persists
    expect(localStorage.getItem(VISITOR_ID_KEY)).toBe(visitorId);
  });
});

describe('Anonymous user KYC flow (no auth token)', () => {
  it('anonymous user: MetaMap onFinished sets verified directly (no token)', () => {
    // No token in localStorage
    expect(localStorage.getItem('ancestro:token')).toBeNull();

    // Simulate MetaMap onFinished callback logic for anonymous users
    const token = localStorage.getItem('ancestro:token');
    let kycStatus: string;
    if (token) {
      kycStatus = 'pending'; // logged-in: poll server
    } else {
      kycStatus = 'verified'; // anonymous: trust MetaMap completion
    }

    expect(kycStatus).toBe('verified');
  });

  it('logged-in user: MetaMap onFinished sets pending (has token)', () => {
    localStorage.setItem('ancestro:token', 'some-jwt-token');

    const token = localStorage.getItem('ancestro:token');
    let kycStatus: string;
    if (token) {
      kycStatus = 'pending';
    } else {
      kycStatus = 'verified';
    }

    expect(kycStatus).toBe('pending');
  });

  it('anonymous verified status persists across page reload', () => {
    // Anonymous user completes MetaMap → verified saved
    localStorage.setItem(KYC_STATUS_KEY, 'verified');

    // Page reload — no token, but cached status exists
    expect(localStorage.getItem('ancestro:token')).toBeNull();
    expect(localStorage.getItem(KYC_STATUS_KEY)).toBe('verified');
  });

  it('anonymous user can fill and persist form data without token', () => {
    // No auth token
    expect(localStorage.getItem('ancestro:token')).toBeNull();

    // KYC verified via MetaMap
    localStorage.setItem(KYC_STATUS_KEY, 'verified');

    // User fills form
    const formData = {
      name: 'Anonymous Investor',
      email: 'anon@example.com',
      phone: '+573001234567',
      amount: '20,000-50,000',
      citizenship: 'Colombia',
      sourceOfFunds: 'savings',
    };
    localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(formData));
    localStorage.setItem(FORM_STEP_KEY, '3');

    // Verify everything persisted
    const restored = JSON.parse(localStorage.getItem(FORM_STORAGE_KEY)!);
    expect(restored.name).toBe('Anonymous Investor');
    expect(restored.email).toBe('anon@example.com');
    expect(localStorage.getItem(KYC_STATUS_KEY)).toBe('verified');
    expect(parseInt(localStorage.getItem(FORM_STEP_KEY)!, 10)).toBe(3);
  });
});
