'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchKycStatus, markKycPending, type KycStatus, type KycProfile } from '@/lib/kyc';
import MetaMapButton from '@/components/kyc/MetaMapButton';


interface InvestPageProps {
  lang: string;
}

/* ── Data ── */

const INVESTMENT = {
  valuationCap: '$25M',
};

const deepDivePanels = [
  {
    id: 'why-we-win',
    title: 'Why Ancestro Is Inevitable',
    content:
      'We are building infrastructure first. Revenue follows infrastructure. The platform model is capital-light and infinitely replicable.',
    items: [
      { label: 'Platform Model', desc: 'Asset-light vs. asset-heavy competitors' },
      { label: 'First Mover', desc: 'First in emerging renewable markets across 18 countries' },
      { label: 'Multi-Vertical', desc: 'Solar, batteries, charging, vehicles, lifestyle' },
      { label: 'Network Effects', desc: 'Each new participant strengthens the whole ecosystem' },
    ],
  },
  {
    id: 'ancestro-world',
    title: 'Beyond Energy: The Ancestro World',
    content:
      'A modern tribe built on energy independence, personal sovereignty, health, purpose, and awakening. Those who enter Ancestro do not leave unchanged.',
    items: [
      { label: 'Social Platform', desc: 'Internal community for members' },
      { label: 'Ancestral Health', desc: 'Education and wellness protocols' },
      { label: 'Eco-Resorts', desc: 'Access to sustainable retreats' },
      { label: 'Rituals & Gatherings', desc: 'Global community experiences' },
    ],
  },
  {
    id: 'ancestro-coin',
    title: 'Ancestro Coin (ANC) & Carbon Strategy',
    content:
      'A digital asset backed by verified carbon credits \u2014 designed for ecosystem infrastructure, not speculation. Currently available at 33% presale discount.',
    items: [
      { label: 'Carbon Monetization', desc: 'Tokenize verified credits into liquid assets' },
      { label: 'Ecosystem Incentives', desc: 'Reward conservation and participation' },
      { label: 'Stakeholder Alignment', desc: 'Shared value for all participants' },
    ],
  },
  {
    id: 'philanthropy',
    title: 'Profit With Purpose',
    content:
      'Minimum 5% of net profits committed to regenerative initiatives. Impact is not an afterthought \u2014 it is embedded into the operating model.',
    items: [
      { label: 'Free Solar', desc: 'Off-grid installations for underserved communities' },
      { label: 'Amazon Reforestation', desc: 'Native species and rainforest preservation' },
      { label: 'Ocean Cleanup', desc: 'Plastic removal partnerships' },
    ],
  },
];

const funds = [
  { pct: 30, label: 'Platform Technology & Ops' },
  { pct: 25, label: 'Market Entry' },
  { pct: 20, label: 'Legal & Regulatory' },
  { pct: 15, label: 'Pre-Sales & Partners' },
  { pct: 10, label: 'Infrastructure' },
];

const terms = [
  { key: 'Entity', val: 'Delaware C-Corp', gold: false },
  { key: 'Instrument', val: 'SAFE agreement', gold: false },
  { key: 'Valuation Cap', val: INVESTMENT.valuationCap, gold: true },
  { key: 'Transfer', val: 'Wire to U.S. account', gold: false },
  { key: 'Profile', val: 'Early-stage, high-asymmetry', gold: false },
];

const investmentTiers = [
  { value: '2,000-5,000', label: '$2,000 \u2013 $5,000' },
  { value: '5,000-20,000', label: '$5,000 \u2013 $20,000' },
  { value: '20,000-50,000', label: '$20,000 \u2013 $50,000' },
  { value: '50,000+', label: '$50,000+' },
];

/* ── Access Gate ── */
const ACCESS_HASH = 'fcfa5880';

function simpleHash(str: string): string {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  }
  return (h >>> 0).toString(16).slice(0, 8);
}

function AccessGate({ onUnlock }: { onUnlock: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [shaking, setShaking] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (simpleHash(password) === ACCESS_HASH) {
      if (typeof window !== 'undefined') sessionStorage.setItem('invest_access', '1');
      onUnlock();
    } else {
      setError(true);
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
    }
  }

  return (
    <>
      <div className="access-gate">
        <div className="access-gate-inner">
          <div className="access-gate-logo">
            <img src={`${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/logo.svg`} alt="Ancestro" width={160} height={32} />
          </div>
          <div className="access-gate-lock">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <h1 className="access-gate-title">Investor Access</h1>
          <p className="access-gate-subtitle">This page contains confidential investment information. Enter the access code to continue.</p>
          <form onSubmit={handleSubmit} className={`access-gate-form${shaking ? ' shake' : ''}`}>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false); }}
              placeholder="Enter access code"
              className={`access-gate-input${error ? ' error' : ''}`}
              autoFocus
            />
            {error && <p className="access-gate-error">Invalid access code</p>}
            <button type="submit" className="access-gate-btn">
              <span>Unlock</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </form>
          <p className="access-gate-contact">Need access? Contact <a href="mailto:invest@ancestro.com">invest@ancestro.com</a></p>
        </div>
      </div>
      <style>{`
        .access-gate{position:fixed;inset:0;z-index:9999;background:#000;display:flex;align-items:center;justify-content:center;padding:20px}
        .access-gate-inner{max-width:420px;width:100%;display:flex;flex-direction:column;align-items:center;gap:24px;text-align:center}
        .access-gate-logo img{height:32px;width:auto;opacity:0.7}
        .access-gate-lock{color:var(--color-primary);opacity:0.8}
        .access-gate-title{font-size:28px;font-weight:700;color:#fff;margin:0}
        .access-gate-subtitle{font-size:15px;color:rgba(255,255,255,0.5);line-height:1.6;margin:0;max-width:340px}
        .access-gate-form{display:flex;flex-direction:column;gap:12px;width:100%}
        .access-gate-input{width:100%;padding:14px 18px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);border-radius:12px;color:#fff;font-size:16px;font-family:var(--font-family);text-align:center;outline:none;transition:border-color 0.2s}
        .access-gate-input:focus{border-color:rgba(248,176,59,0.5)}
        .access-gate-input.error{border-color:#ef4444}
        .access-gate-error{color:#ef4444;font-size:13px;margin:0}
        .access-gate-btn{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;padding:14px;background:var(--color-primary);color:#000;font-size:16px;font-weight:600;font-family:var(--font-family);border:none;border-radius:12px;cursor:pointer;transition:all 0.2s}
        .access-gate-btn:hover{background:#e9a235;transform:translateY(-1px)}
        .access-gate-contact{font-size:13px;color:rgba(255,255,255,0.35);margin:0}
        .access-gate-contact a{color:var(--color-primary);text-decoration:none}
        .shake{animation:shakeAnim 0.5s ease}
        @keyframes shakeAnim{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-8px)}40%,80%{transform:translateX(8px)}}
      `}</style>
    </>
  );
}

/* ── LocalStorage helpers ── */
const FORM_STORAGE_KEY = 'ancestro:investForm';
const FORM_STEP_KEY = 'ancestro:investFormStep';
const KYC_STATUS_KEY = 'ancestro:kycStatus';
const VISITOR_ID_KEY = 'ancestro:visitorId';

/** Get or create a persistent visitor ID (UUID v4) for anonymous users */
function getVisitorId(): string {
  try {
    const existing = localStorage.getItem(VISITOR_ID_KEY);
    if (existing) return existing;
    const id = crypto.randomUUID();
    localStorage.setItem(VISITOR_ID_KEY, id);
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

function saveFormToStorage(data: Record<string, unknown>, step: number) {
  try {
    localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(data));
    localStorage.setItem(FORM_STEP_KEY, String(step));
  } catch { /* storage full or unavailable */ }
}

function loadFormFromStorage() {
  try {
    const raw = localStorage.getItem(FORM_STORAGE_KEY);
    const step = localStorage.getItem(FORM_STEP_KEY);
    return { data: raw ? JSON.parse(raw) : null, step: step ? parseInt(step, 10) : 1 };
  } catch { return { data: null, step: 1 }; }
}

function clearFormStorage() {
  try {
    localStorage.removeItem(FORM_STORAGE_KEY);
    localStorage.removeItem(FORM_STEP_KEY);
  } catch { /* ignore */ }
}

function saveKycStatusToStorage(status: KycStatus) {
  try { localStorage.setItem(KYC_STATUS_KEY, status); } catch { /* ignore */ }
}

function loadKycStatusFromStorage(): KycStatus | null {
  try {
    const s = localStorage.getItem(KYC_STATUS_KEY);
    if (s === 'verified' || s === 'pending' || s === 'rejected' || s === 'not_started') return s;
    return null;
  } catch { return null; }
}

/* ── Component ── */

export default function InvestPage({ lang }: InvestPageProps) {
  /* access gate */
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('invest_access') === '1') {
      setUnlocked(true);
    }
  }, []);

  /* KYC state — restore from localStorage first, then fetch from server */
  const [kycStatus, setKycStatus] = useState<KycStatus>('not_started');
  const kycPollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Persist KYC status whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined' && kycStatus !== 'not_started') {
      saveKycStatusToStorage(kycStatus);
    }
  }, [kycStatus]);

  // Fetch KYC status on mount — restore cached status first, then verify with server
  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Restore cached KYC status immediately (covers page close & reopen)
    const cached = loadKycStatusFromStorage();
    if (cached) setKycStatus(cached);

    // Detect return from MetaMap redirect (user started KYC, page reloaded)
    // onFinished event doesn't fire after a full page redirect, so we check the flag
    // kycStarted flag takes priority over any cached status
    const kycStarted = localStorage.getItem('ancestro:kycStarted');
    if (kycStarted) {
      localStorage.removeItem('ancestro:kycStarted');
      const token = localStorage.getItem('ancestro:token');
      if (!token) {
        // Anonymous user returning from MetaMap → trust completion
        setKycStatus('verified');
        saveKycStatusToStorage('verified');
      } else {
        // Logged-in user returning → set pending and poll
        setKycStatus('pending');
        saveKycStatusToStorage('pending');
      }
      // Force CTA section visible so the form is rendered before scrolling
      setCtaVisible(true);
      setTimeout(() => {
        const el = document.getElementById('invest');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
      return;
    }

    const token = localStorage.getItem('ancestro:token');
    if (token) {
      // Always verify with server — server is source of truth
      fetchKycStatus(token).then(result => {
        if (result !== null) {
          const previousStatus = cached || 'not_started';
          // Only update if server responded successfully
          setKycStatus(result.status);
          saveKycStatusToStorage(result.status);

          // Pre-fill form with profile data when KYC is verified
          if (result.status === 'verified' && result.profile) {
            prefillFormFromProfile(result.profile);
          }
          // Auto-scroll to investment form if:
          // - URL has #invest hash, OR
          // - Server status advanced (user completed MetaMap but flag wasn't detected)
          const statusAdvanced = previousStatus === 'not_started' && (result.status === 'verified' || result.status === 'pending');
          if (window.location.hash === '#invest' || statusAdvanced) {
            setCtaVisible(true);
            setTimeout(() => {
              const el = document.getElementById('invest');
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 300);
          }
        }
        // If null (fetch failed), keep cached status
      });
    }
  }, []);

  // Poll KYC status when pending + user is logged in (every 5s, max 60 attempts = 5 min)
  useEffect(() => {
    if (kycStatus !== 'pending') {
      if (kycPollRef.current) { clearInterval(kycPollRef.current); kycPollRef.current = null; }
      return;
    }
    const token = typeof window !== 'undefined' ? localStorage.getItem('ancestro:token') : null;
    if (!token) return; // Anonymous users don't poll — MetaMap onFinished sets verified directly
    let attempts = 0;
    kycPollRef.current = setInterval(async () => {
      attempts++;
      if (attempts > 60) {
        if (kycPollRef.current) clearInterval(kycPollRef.current);
        return;
      }
      const result = await fetchKycStatus(token);
      if (result !== null && result.status !== 'pending') {
        setKycStatus(result.status);
        if (result.status === 'verified' && result.profile) {
          prefillFormFromProfile(result.profile);
          // Auto-scroll to investment form when KYC is approved
          setCtaVisible(true);
          setTimeout(() => {
            const el = document.getElementById('invest');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 200);
        }
        if (kycPollRef.current) clearInterval(kycPollRef.current);
      }
    }, 5000);
    return () => { if (kycPollRef.current) clearInterval(kycPollRef.current); };
  }, [kycStatus]);

  /* accordion state */
  const [openPanels, setOpenPanels] = useState<Record<string, boolean>>({});

  /* funds animation */
  const fundsRef = useRef<HTMLDivElement>(null);
  const [fundsVisible, setFundsVisible] = useState(false);

  /* final CTA animation */
  const finalCtaRef = useRef<HTMLElement>(null);
  const [ctaVisible, setCtaVisible] = useState(false);

  /* form state — restore from localStorage */
  const defaultFormData = {
    // Basic invest fields
    name: '', email: '', phone: '', amount: '', message: '',
    // AML / SEC 501(a) fields
    dateOfBirth: '', address: '', citizenship: '', investorType: 'individual',
    accreditationCriteria: [] as string[], entityCriteria: [] as string[],
    // Section-level accreditation (Yes/No per category)
    investsWithSpouse: false,
    hasIncomeIndividual: false, hasIncomeJoint: false,
    hasNetWorth: false, hasProfessionalCert: false,
    hasInsiderStatus: false, hasKnowledgeableEmployee: false,
    sourceOfFunds: '', sourceOfFundsOther: '',
    isPep: false, pepDetails: '',
    isUsCitizen: false, usTaxId: '',
    declarationAccepted: false,
    // Signature
    signatureType: 'type' as 'draw' | 'type',
    signatureData: '',
  };
  const [formStep, setFormStep] = useState(1);
  const [formData, setFormData] = useState(defaultFormData);
  const formInitRef = useRef(false);

  // Restore form data from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined' || formInitRef.current) return;
    formInitRef.current = true;
    const { data, step } = loadFormFromStorage();
    if (data) {
      setFormData(prev => ({ ...prev, ...data }));
      setFormStep(step);
    }
  }, []);

  // Save form data to localStorage on every change (after initial load)
  useEffect(() => {
    if (!formInitRef.current) return;
    saveFormToStorage(formData, formStep);
  }, [formData, formStep]);

  // Pre-fill form with profile data from KYC (only fills empty fields)
  const prefillFormFromProfile = useCallback((profile: KycProfile) => {
    setFormData(prev => ({
      ...prev,
      name: prev.name || profile.fullName || '',
      email: prev.email || profile.email || '',
      phone: prev.phone || profile.phone || '',
      citizenship: prev.citizenship || profile.citizenship || '',
      investorType: prev.investorType || profile.investorType || 'individual',
      sourceOfFunds: prev.sourceOfFunds || profile.sourceOfFunds || '',
      sourceOfFundsOther: prev.sourceOfFundsOther || profile.sourceOfFundsOther || '',
      isPep: prev.isPep || profile.isPep || false,
      pepDetails: prev.pepDetails || profile.pepDetails || '',
      isUsCitizen: prev.isUsCitizen || profile.isUsCitizen || false,
      usTaxId: prev.usTaxId || profile.usTaxId || '',
    }));
  }, []);

  const signatureCanvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const [formErrors, setFormErrors] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  /* intersection observers */
  useEffect(() => {
    if (!unlocked) return;
    const fundsEl = fundsRef.current;
    if (fundsEl) {
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              setFundsVisible(true);
              obs.unobserve(e.target);
            }
          });
        },
        { threshold: 0.3 }
      );
      obs.observe(fundsEl);
      return () => obs.disconnect();
    }
  }, [unlocked]);

  useEffect(() => {
    if (!unlocked) return;
    const ctaEl = finalCtaRef.current;
    if (ctaEl) {
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              setCtaVisible(true);
              obs.unobserve(e.target);
            }
          });
        },
        { threshold: 0.2 }
      );
      obs.observe(ctaEl);
      return () => obs.disconnect();
    }
  }, [unlocked]);

  const togglePanel = useCallback((id: string) => {
    setOpenPanels((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  // Signature canvas init (must be before early return to keep hook order stable)
  const initCanvas = useCallback(() => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);
    ctx.strokeStyle = '#f8b03b';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const accreditationSections = [
    { field: 'hasIncomeIndividual' as const,
      title: lang === 'es' ? 'A. Prueba de Ingresos (Individual)' : 'A. Income Test (Individual)',
      question: lang === 'es'
        ? '¿Tu ingreso individual superó los USD $200,000 anuales en los últimos 2 años fiscales?'
        : 'Did your individual income exceed USD $200,000/year in each of the last 2 fiscal years?' },
    { field: 'hasIncomeJoint' as const,
      title: lang === 'es' ? 'A. Prueba de Ingresos (Conjunto)' : 'A. Income Test (Joint)',
      question: lang === 'es'
        ? '¿Tu ingreso conjunto con tu cónyuge superó los USD $300,000 anuales en los últimos 2 años fiscales?'
        : 'Did your joint income with your spouse exceed USD $300,000/year in each of the last 2 fiscal years?' },
    { field: 'hasNetWorth' as const,
      title: lang === 'es' ? 'B. Patrimonio Neto' : 'B. Net Worth',
      question: lang === 'es'
        ? '¿Tu patrimonio neto (individual o conjunto) supera USD $1,000,000, excluyendo tu residencia principal?'
        : 'Does your net worth (individual or joint) exceed USD $1,000,000, excluding your primary residence?' },
    { field: 'hasProfessionalCert' as const,
      title: lang === 'es' ? 'C. Certificaciones Profesionales' : 'C. Professional Certifications',
      question: lang === 'es'
        ? '¿Posees una licencia vigente Serie 7, Serie 65, Serie 82, u otra certificación financiera reconocida por la SEC?'
        : 'Do you hold a current Series 7, Series 65, Series 82 license, or other SEC-recognized financial certification?' },
    { field: 'hasInsiderStatus' as const,
      title: lang === 'es' ? 'D. Estado de Insider / Ejecutivo' : 'D. Insider / Executive Status',
      question: lang === 'es'
        ? '¿Eres director, CEO, ejecutivo o socio general de alguna compañía?'
        : 'Are you a director, CEO, executive officer, or general partner of any company?' },
    { field: 'hasKnowledgeableEmployee' as const,
      title: lang === 'es' ? 'E. Empleado Calificado' : 'E. Knowledgeable Employee',
      question: lang === 'es'
        ? '¿Eres empleado calificado de un fondo privado de inversión?'
        : 'Are you a knowledgeable employee of a private investment fund?' },
  ];
  const entityCriteriaOptions = [
    { key: 'bank', label: lang === 'es' ? 'Banco, corredor, aseguradora o compañía de inversión registrada' : 'Bank, broker-dealer, insurance company, or registered investment company' },
    { key: 'benefitPlan', label: lang === 'es' ? 'Plan de beneficios con activos > USD $5M' : 'Employee benefit plan with assets > USD $5M' },
    { key: 'privateFund', label: lang === 'es' ? 'Fondo privado con AUM > USD $5M' : 'Private fund with AUM > USD $5M' },
    { key: 'familyOffice', label: lang === 'es' ? 'Family office con AUM > USD $5M' : 'Family office with AUM > USD $5M' },
    { key: 'entityAssets', label: lang === 'es' ? 'Entidad con activos totales > USD $5M' : 'Entity with total assets > USD $5M' },
    { key: 'allAccredited', label: lang === 'es' ? 'Todos los propietarios son inversionistas acreditados' : 'All equity owners are accredited investors' },
  ];
  const fundSourceOptions = [
    { key: 'salary', label: lang === 'es' ? 'Salario / Ingresos laborales' : 'Salary / Employment income' },
    { key: 'business', label: lang === 'es' ? 'Ingresos de negocio propio' : 'Business income' },
    { key: 'investments', label: lang === 'es' ? 'Retorno de inversiones' : 'Returns from investments' },
    { key: 'inheritance', label: lang === 'es' ? 'Herencia' : 'Inheritance' },
    { key: 'savings', label: lang === 'es' ? 'Ahorros personales' : 'Personal savings' },
    { key: 'realEstate', label: lang === 'es' ? 'Venta de bienes inmuebles' : 'Real estate sale' },
    { key: 'other', label: lang === 'es' ? 'Otro' : 'Other' },
  ];

  const toggleArrayItem = (field: 'accreditationCriteria' | 'entityCriteria', value: string) => {
    setFormData(prev => {
      const arr = prev[field];
      return { ...prev, [field]: arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value] };
    });
  };

  const validateFormStep = (): boolean => {
    const errors: Record<string, boolean> = {};
    if (formStep === 1) {
      if (!formData.name.trim()) errors.name = true;
      if (!formData.email.trim() || !formData.email.includes('@')) errors.email = true;
      if (!formData.amount) errors.amount = true;
      if (!formData.dateOfBirth) errors.dateOfBirth = true;
      if (!formData.address.trim()) errors.address = true;
      if (!formData.citizenship.trim()) errors.citizenship = true;
    }
    if (formStep === 2) {
      // Natural persons: no mandatory selection, all questions are informational
      if (formData.investorType === 'entity' && formData.entityCriteria.length === 0) errors.entityCriteria = true;
    }
    if (formStep === 3) {
      if (!formData.sourceOfFunds) errors.sourceOfFunds = true;
      if (formData.sourceOfFunds === 'other' && !formData.sourceOfFundsOther.trim()) errors.sourceOfFundsOther = true;
      if (formData.isPep && !formData.pepDetails.trim()) errors.pepDetails = true;
      if (formData.isUsCitizen && !formData.usTaxId.trim()) errors.usTaxId = true;
    }
    if (formStep === 4) {
      if (!formData.declarationAccepted) errors.declarationAccepted = true;
      if (!formData.signatureData.trim()) errors.signatureData = true;
    }
    setFormErrors(errors);
    // Scroll to first field with error
    if (Object.keys(errors).length > 0) {
      setTimeout(() => {
        const firstErrorEl = document.querySelector('.has-error, .form-declaration-check--error, .sig-draw-wrap--error, .form-error-msg');
        if (firstErrorEl) firstErrorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 50);
    }
    return Object.keys(errors).length === 0;
  };

  const handleFormNext = () => {
    if (validateFormStep()) setFormStep(s => s + 1);
  };

  // Signature canvas helpers
  const getCanvasPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    isDrawingRef.current = true;
    const ctx = signatureCanvasRef.current?.getContext('2d');
    if (!ctx) return;
    const pos = getCanvasPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawingRef.current) return;
    const ctx = signatureCanvasRef.current?.getContext('2d');
    if (!ctx) return;
    const pos = getCanvasPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const endDraw = () => {
    isDrawingRef.current = false;
  };

  const clearCanvas = () => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setFormData(d => ({ ...d, signatureData: '' }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // For drawn signatures, get data from canvas before validation
    let finalSignatureData = formData.signatureData;
    if (formData.signatureType === 'draw') {
      const canvas = signatureCanvasRef.current;
      finalSignatureData = canvas ? canvas.toDataURL('image/png') : '';
      // Update formData so validateFormStep can check it
      if (finalSignatureData) setFormData(d => ({ ...d, signatureData: finalSignatureData }));
    }
    if (!validateFormStep()) return;

    setSubmitting(true);
    try {
      // If drawn signature, upload to R2 first
      let signatureUrl = finalSignatureData;
      if (formData.signatureType === 'draw' && finalSignatureData.startsWith('data:')) {
        const uploadRes = await fetch('/api/upload-signature', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ signatureBase64: finalSignatureData, email: formData.email }),
        });
        if (uploadRes.ok) {
          const { url } = await uploadRes.json();
          signatureUrl = url;
        } else {
          const errBody = await uploadRes.text().catch(() => '');
          console.error('Signature upload failed:', uploadRes.status, errBody);
        }
      }

      const res = await fetch('/api/invest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, signatureData: signatureUrl, visitorId: typeof window !== 'undefined' ? getVisitorId() : undefined }),
      });
      if (!res.ok) throw new Error('Server error');
      clearFormStorage();
      setSubmitted(true);
    } catch {
      setSubmitting(false);
      alert(lang === 'es' ? 'Error al enviar el formulario. Tu información ha sido guardada. Intenta nuevamente.' : 'Error submitting form. Your information has been saved. Please try again.');
    }
  };

  /* Access gate disabled in AML branch — page always renders */

  return (
    <>
      {/* ═══════════ HERO ═══════════ */}
      <section className="invest-hero" id="hero">
        <div className="hero-bg">
          <div className="hero-gradient"></div>
          <div className="hero-grid-lines"></div>
        </div>

        <div className="hero-inner">
          <div className="hero-accent-line"></div>

          <div className="hero-badge">
            <span className="hero-badge-dot"></span>
            <span>Delaware C-Corp</span>
            <span className="badge-sep"></span>
            <span>SAFE Agreement</span>
            <span className="badge-sep"></span>
            <span>SEC Compliant</span>
          </div>

          <h1 className="hero-title">
            Invest in the <span className="hero-title-gold">infrastructure</span>
            <br />
            of energy independence
          </h1>

          <p className="hero-subtitle">
            Ancestro is building the operating system for renewable energy adoption across 18 emerging markets.
            Capital-light. Platform-first. Inevitable.
          </p>

          <div className="hero-stats">
            <div className="stat">
              <span className="stat-value">{INVESTMENT.valuationCap}</span>
              <span className="stat-label">Valuation Cap</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat">
              <span className="stat-value">18</span>
              <span className="stat-label">Target Markets</span>
            </div>
          </div>

          <div className="hero-ctas">
            <a href="#contact" className="cta-primary">
              <span>Invest Now</span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
            <a href="#deep-dive" className="cta-secondary">
              <span>Read the Thesis</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          <div className="hero-proof">
            <span className="hero-proof-text">
              Joined by investors from <strong>12 countries</strong>
            </span>
          </div>
        </div>
      </section>

      {/* ═══════════ THESIS ═══════════ */}
      <section className="invest-thesis" id="thesis">
        <div className="thesis-container">
          <span className="thesis-label">THE THESIS</span>
          <h2 className="thesis-heading">Two converging crises. One platform.</h2>

          <div className="thesis-grid">
            <div className="thesis-problem">
              <div className="thesis-card">
                <span className="card-tag">The Problem</span>
                <p className="card-text">
                  Energy adoption across LATAM is constrained by fragmented supply chains, zero coordination between
                  stakeholders, and no scalable platforms. Meanwhile, modern lifestyles drive chronic disease and
                  environmental collapse.
                </p>
                <div className="card-stats">
                  <div className="card-stat">
                    <span className="card-stat-val">650M</span>
                    <span className="card-stat-lbl">Underserved</span>
                  </div>
                  <div className="card-stat">
                    <span className="card-stat-val">$47B</span>
                    <span className="card-stat-lbl">Energy market</span>
                  </div>
                  <div className="card-stat">
                    <span className="card-stat-val">&lt;3%</span>
                    <span className="card-stat-lbl">Solar adoption</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="thesis-arrow">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </div>

            <div className="thesis-solution">
              <div className="thesis-card thesis-card--gold">
                <span className="card-tag card-tag--gold">The Solution</span>
                <p className="card-text">
                  Ancestro is a platform &mdash; not a contractor &mdash; connecting customers, installers,
                  distributors, and investors through a fintech layer. Capital-light, infinitely replicable, with
                  compounding network effects.
                </p>
                <div className="card-features">
                  <span>Copy-paste market entry</span>
                  <span>Multi-vertical expansion</span>
                  <span>First mover in 18 countries</span>
                  <span>Mission-driven brand moat</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ INVEST NUMBERS ═══════════ */}
      <section className="invest-numbers" id="buy-stock">
        <div className="numbers-container">
          <span className="numbers-label">INVESTMENT DETAILS</span>
          <h2 className="numbers-heading">The Opportunity</h2>

          <div className="numbers-grid">
            {/* Left: Terms */}
            <div className="terms-block">
              <div className="block-title-row">
                <h3 className="block-title">Deal Terms</h3>
                <span className="verified-badge">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  Verified
                </span>
              </div>
              <div className="terms-list">
                {terms.map((term) => (
                  <div className="term-row" key={term.key}>
                    <span className="term-key">{term.key}</span>
                    <span className={`term-val${term.gold ? ' term-val--gold' : ''}`}>{term.val}</span>
                  </div>
                ))}
              </div>

              <div className="participation-row">
                <div className="part-option">
                  <span className="part-type">Passive</span>
                  <span className="part-desc">Capital allocation, quarterly updates, dashboard access</span>
                </div>
                <div className="part-option part-option--active">
                  <span className="part-badge">Recommended</span>
                  <span className="part-type">Active</span>
                  <span className="part-desc">Strategic partnership, advisory, network, co-development</span>
                </div>
              </div>
            </div>

            {/* Right: Funds */}
            <div className="funds-block">
              <h3 className="block-title">Use of Funds</h3>
              <div className="funds-bars" ref={fundsRef}>
                {funds.map((f, i) => (
                  <div className="fund-row" key={f.label}>
                    <div className="fund-info">
                      <span className="fund-pct">{f.pct}%</span>
                      <span className="fund-name">{f.label}</span>
                    </div>
                    <div className="fund-track">
                      <div
                        className="fund-fill"
                        style={{
                          width: fundsVisible ? `${f.pct}%` : '0%',
                          transitionDelay: fundsVisible ? `${i * 100}ms` : '0ms',
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="numbers-cta">
            <a href="#contact" className="num-cta-primary">
              Request Access to Invest
            </a>
            <a href="https://calendly.com/tarzan-ancestro/30min" target="_blank" rel="noopener noreferrer" className="num-cta-secondary">
              Schedule a Call
            </a>
          </div>
          <p className="numbers-contact">
            Questions? <a href="mailto:invest@ancestro.com">invest@ancestro.com</a>
          </p>
        </div>
      </section>

      {/* ═══════════ FINAL CTA ═══════════ */}
      <section className="final-cta" id="contact" ref={finalCtaRef}>
        <div className="final-cta__glow"></div>
        <div className="final-cta__inner">
          <div className="final-cta__statements">
            {['The platform is built.', 'The markets are opening.', 'The network is forming.'].map((line, i) => (
              <p
                key={i}
                className={`final-cta__line ${ctaVisible ? 'is-visible' : ''}`}
                style={{ transitionDelay: ctaVisible ? `${i * 180}ms` : '0ms' }}
              >
                {line}
              </p>
            ))}
          </div>

          <div
            className={`final-cta__divider ${ctaVisible ? 'is-visible' : ''}`}
            style={{ transitionDelay: ctaVisible ? `${3 * 180}ms` : '0ms' }}
          ></div>

          <p
            className={`final-cta__declaration ${ctaVisible ? 'is-visible' : ''}`}
            style={{ transitionDelay: ctaVisible ? `${3 * 180}ms` : '0ms' }}
          >
            We are not waiting for the future.
            <br />
            <span className="final-cta__declaration-gold">We are building it.</span>
          </p>

          {/* Contact Form */}
          <div
            className={`invest-form-wrap ${ctaVisible ? 'is-visible' : ''}`}
            style={{ transitionDelay: ctaVisible ? `${4 * 180}ms` : '0ms' }}
          >
            <div id="invest" className="invest-form-card">
              <div className="invest-form-header">
                <h3 className="invest-form-title">{lang === 'es' ? 'Solicitud de Inversión' : 'Investment Application'}</h3>
                <p className="invest-form-subtitle">{lang === 'es' ? 'Completa el formulario para iniciar tu proceso de inversión.' : 'Complete the form to begin your investment process.'}</p>
              </div>

              {/* KYC Verification Gate */}
              <div className="kyc-gate">
                {kycStatus === 'not_started' && (
                  <div className="kyc-gate-step">
                    <div className="kyc-gate-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(248,176,59,0.8)" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    </div>
                    <p className="kyc-gate-text">{lang === 'es' ? 'Paso 1: Verifica tu identidad con MetaMap' : 'Step 1: Verify your identity with MetaMap'}</p>
                    <MetaMapButton
                      userId={typeof window !== 'undefined' ? localStorage.getItem('ancestro:userId') || getVisitorId() : 'anonymous'}
                      userEmail={typeof window !== 'undefined' ? localStorage.getItem('ancestro:email') || '' : ''}
                      onStarted={() => {
                        localStorage.setItem('ancestro:kycStarted', '1');
                      }}
                      onFinished={() => {
                        localStorage.removeItem('ancestro:kycStarted');
                        const token = typeof window !== 'undefined' ? localStorage.getItem('ancestro:token') : null;
                        if (token) {
                          setKycStatus('pending');
                          markKycPending(token);
                        } else {
                          setKycStatus('verified');
                        }
                      }}
                    />
                  </div>
                )}
                {kycStatus === 'pending' && (
                  <div className="kyc-gate-step kyc-gate-step--pending">
                    <div className="kyc-gate-icon kyc-gate-icon--pending">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#eab308" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    </div>
                    <p className="kyc-gate-text">{lang === 'es' ? 'Verificación en proceso. Te notificaremos cuando esté aprobada.' : 'Verification in progress. We\'ll notify you when approved.'}</p>
                    <button type="button" className="kyc-gate-refresh" onClick={() => {
                      const token = typeof window !== 'undefined' ? localStorage.getItem('ancestro:token') : null;
                      if (token) {
                        fetchKycStatus(token).then(result => {
                          if (result !== null) {
                            setKycStatus(result.status);
                            if (result.status === 'verified' && result.profile) {
                              prefillFormFromProfile(result.profile);
                            }
                          }
                        });
                      }
                    }}>{lang === 'es' ? 'Verificar estado' : 'Check status'}</button>
                  </div>
                )}
                {kycStatus === 'rejected' && (
                  <div className="kyc-gate-step kyc-gate-step--rejected">
                    <div className="kyc-gate-icon kyc-gate-icon--rejected">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                    </div>
                    <p className="kyc-gate-text">{lang === 'es' ? 'Verificación rechazada. Intenta nuevamente o contacta soporte.' : 'Verification rejected. Try again or contact support.'}</p>
                    <MetaMapButton
                      userId={typeof window !== 'undefined' ? localStorage.getItem('ancestro:userId') || getVisitorId() : 'anonymous'}
                      userEmail={typeof window !== 'undefined' ? localStorage.getItem('ancestro:email') || '' : ''}
                      onStarted={() => {
                        localStorage.setItem('ancestro:kycStarted', '1');
                      }}
                      onFinished={() => {
                        localStorage.removeItem('ancestro:kycStarted');
                        const token = typeof window !== 'undefined' ? localStorage.getItem('ancestro:token') : null;
                        if (token) {
                          setKycStatus('pending');
                          markKycPending(token);
                        } else {
                          setKycStatus('verified');
                        }
                      }}
                    />
                  </div>
                )}
                {kycStatus === 'verified' && (
                  <div className="kyc-gate-step kyc-gate-step--verified">
                    <div className="kyc-gate-icon kyc-gate-icon--verified">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    </div>
                    <p className="kyc-gate-text">{lang === 'es' ? 'Identidad verificada. Completa el formulario de inversión.' : 'Identity verified. Complete the investment form below.'}</p>
                  </div>
                )}
              </div>

              {/* Investment Form — only when KYC verified */}
              {kycStatus === 'verified' && !submitted ? (
                <form className="invest-form" onSubmit={handleFormSubmit} noValidate>
                  {/* Progress bar */}
                  <div className="form-progress">
                    {[1, 2, 3, 4].map(s => (
                      <div key={s} className={`form-progress-step${formStep >= s ? ' active' : ''}${formStep > s ? ' done' : ''}`}>
                        <div className="form-progress-num">{formStep > s ? '\u2713' : s}</div>
                        <span className="form-progress-label">
                          {s === 1 ? (lang === 'es' ? 'Info' : 'Info') : s === 2 ? (lang === 'es' ? 'Acreditaci\u00f3n' : 'Accreditation') : s === 3 ? 'AML' : (lang === 'es' ? 'Firma' : 'Sign')}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Step 1: Basic Info + Investment */}
                  {formStep === 1 && (
                    <div className="form-step-anim">
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">{lang === 'es' ? 'Nombre Completo' : 'Full Name'} *</label>
                          <input type="text" autoComplete="name" placeholder="John Doe" className={`form-input ${formErrors.name ? 'has-error' : ''}`} value={formData.name} onChange={e => { setFormData(d => ({ ...d, name: e.target.value })); setFormErrors(err => ({ ...err, name: false })); }} />
                          {formErrors.name && <p className="form-error-msg">{lang === 'es' ? 'El nombre es obligatorio' : 'Name is required'}</p>}
                        </div>
                        <div className="form-group">
                          <label className="form-label">Email *</label>
                          <input type="email" autoComplete="email" placeholder="john@company.com" className={`form-input ${formErrors.email ? 'has-error' : ''}`} value={formData.email} onChange={e => { setFormData(d => ({ ...d, email: e.target.value })); setFormErrors(err => ({ ...err, email: false })); }} />
                          {formErrors.email && <p className="form-error-msg">{lang === 'es' ? 'Ingresa un email valido' : 'Enter a valid email'}</p>}
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">{lang === 'es' ? 'Tel\u00e9fono' : 'Phone'} <span className="form-optional">({lang === 'es' ? 'opcional' : 'optional'})</span></label>
                          <input type="tel" autoComplete="tel" placeholder="+1 (555) 000-0000" className="form-input" value={formData.phone} onChange={e => setFormData(d => ({ ...d, phone: e.target.value }))} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">{lang === 'es' ? 'Fecha de Nacimiento' : 'Date of Birth'} *</label>
                          <input type="date" className={`form-input ${formErrors.dateOfBirth ? 'has-error' : ''}`} value={formData.dateOfBirth} onChange={e => { setFormData(d => ({ ...d, dateOfBirth: e.target.value })); setFormErrors(err => ({ ...err, dateOfBirth: false })); }} style={{ colorScheme: 'dark' }} />
                          {formErrors.dateOfBirth && <p className="form-error-msg">{lang === 'es' ? 'La fecha de nacimiento es obligatoria' : 'Date of birth is required'}</p>}
                        </div>
                      </div>
                      <div className="form-group form-group--full">
                        <label className="form-label">{lang === 'es' ? 'Direcci\u00f3n de Residencia' : 'Residence Address'} *</label>
                        <input type="text" autoComplete="street-address" placeholder={lang === 'es' ? 'Calle, Ciudad, Pa\u00eds' : 'Street, City, Country'} className={`form-input ${formErrors.address ? 'has-error' : ''}`} value={formData.address} onChange={e => { setFormData(d => ({ ...d, address: e.target.value })); setFormErrors(err => ({ ...err, address: false })); }} />
                        {formErrors.address && <p className="form-error-msg">{lang === 'es' ? 'La direccion es obligatoria' : 'Address is required'}</p>}
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">{lang === 'es' ? 'Ciudadan\u00eda / Pa\u00eds' : 'Citizenship / Country'} *</label>
                          <input type="text" placeholder={lang === 'es' ? 'Ej: Colombia' : 'e.g. United States'} className={`form-input ${formErrors.citizenship ? 'has-error' : ''}`} value={formData.citizenship} onChange={e => { setFormData(d => ({ ...d, citizenship: e.target.value })); setFormErrors(err => ({ ...err, citizenship: false })); }} />
                          {formErrors.citizenship && <p className="form-error-msg">{lang === 'es' ? 'La ciudadania es obligatoria' : 'Citizenship is required'}</p>}
                        </div>
                        <div className="form-group">
                          <label className="form-label">{lang === 'es' ? 'Rango de Inversi\u00f3n' : 'Investment Range'} *</label>
                          <select className={`form-input form-select ${formErrors.amount ? 'has-error' : ''}`} value={formData.amount} onChange={e => { setFormData(d => ({ ...d, amount: e.target.value })); setFormErrors(err => ({ ...err, amount: false })); }}>
                            <option value="" disabled>{lang === 'es' ? 'Seleccionar rango' : 'Select range'}</option>
                            {investmentTiers.map(tier => (<option key={tier.value} value={tier.value}>{tier.label}</option>))}
                          </select>
                          {formErrors.amount && <p className="form-error-msg">{lang === 'es' ? 'Selecciona un rango de inversion' : 'Select an investment range'}</p>}
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">{lang === 'es' ? 'Tipo de Inversionista' : 'Investor Type'}</label>
                          <div className="form-chip-row">
                            {(['individual', 'joint', 'entity'] as const).map(type => (
                              <button key={type} type="button" className={`form-chip${formData.investorType === type ? ' form-chip--active' : ''}`} onClick={() => setFormData(d => ({ ...d, investorType: type }))}>
                                {type === 'individual' ? (lang === 'es' ? 'Individual' : 'Individual') : type === 'joint' ? (lang === 'es' ? 'Conjunto' : 'Joint') : (lang === 'es' ? 'Entidad' : 'Entity')}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="form-group">
                          <label className="form-label">{lang === 'es' ? 'Mensaje' : 'Message'} <span className="form-optional">({lang === 'es' ? 'opcional' : 'optional'})</span></label>
                          <textarea rows={2} placeholder={lang === 'es' ? 'Cu\u00e9ntanos sobre tu inter\u00e9s en Ancestro...' : 'Tell us about your interest in Ancestro...'} className="form-input form-textarea" value={formData.message} onChange={e => setFormData(d => ({ ...d, message: e.target.value }))} />
                        </div>
                      </div>
                      <button type="button" className="form-submit" onClick={handleFormNext}>
                        <span className="form-submit-text">{lang === 'es' ? 'Siguiente' : 'Next'}</span>
                        <svg className="form-submit-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                      </button>
                    </div>
                  )}

                  {/* Step 2: Accreditation Criteria */}
                  {formStep === 2 && (
                    <div className="form-step-anim">
                      <h4 className="form-section-title">
                        {formData.investorType !== 'entity'
                          ? (lang === 'es' ? 'Criterios de Acreditaci\u00f3n' : 'Accreditation Criteria')
                          : (lang === 'es' ? 'Criterios de Acreditaci\u00f3n \u2014 Entidades' : 'Accreditation Criteria \u2014 Entities')}
                      </h4>

                      {formData.investorType !== 'entity' ? (
                        <div className="accreditation-sections">
                          {/* Spouse/Joint investing question */}
                          <div className={`accred-card${formData.investsWithSpouse ? ' accred-card--yes' : ''}`}>
                            <div className="accred-card-title">{lang === 'es' ? 'Inversión Conjunta' : 'Joint Investment'}</div>
                            <p className="accred-card-question">{lang === 'es'
                              ? '¿Estás invirtiendo conjuntamente con tu cónyuge o pareja equivalente?'
                              : 'Are you investing jointly with a spouse or spousal equivalent?'}</p>
                            <div className="accred-card-toggle">
                              <button type="button" className={`accred-toggle-btn${formData.investsWithSpouse === false ? ' accred-toggle-btn--active-no' : ''}`}
                                onClick={() => setFormData(d => ({ ...d, investsWithSpouse: false }))}>
                                No
                              </button>
                              <button type="button" className={`accred-toggle-btn${formData.investsWithSpouse === true ? ' accred-toggle-btn--active-yes' : ''}`}
                                onClick={() => setFormData(d => ({ ...d, investsWithSpouse: true }))}>
                                {lang === 'es' ? 'S\u00ed' : 'Yes'}
                              </button>
                            </div>
                          </div>

                          {accreditationSections.map(s => (
                            <div key={s.field} className={`accred-card${formData[s.field] ? ' accred-card--yes' : ''}`}>
                              <div className="accred-card-title">{s.title}</div>
                              <p className="accred-card-question">{s.question}</p>
                              <div className="accred-card-toggle">
                                <button type="button" className={`accred-toggle-btn${formData[s.field] === false ? ' accred-toggle-btn--active-no' : ''}`}
                                  onClick={() => setFormData(d => ({ ...d, [s.field]: false }))}>
                                  No
                                </button>
                                <button type="button" className={`accred-toggle-btn${formData[s.field] === true ? ' accred-toggle-btn--active-yes' : ''}`}
                                  onClick={() => setFormData(d => ({ ...d, [s.field]: true }))}>
                                  {lang === 'es' ? 'S\u00ed' : 'Yes'}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <>
                          <p className="form-hint">{lang === 'es' ? 'Seleccione todos los criterios que apliquen:' : 'Check all that apply:'}</p>
                          <div className="form-checks">
                            {entityCriteriaOptions.map(c => {
                              const checked = formData.entityCriteria.includes(c.key);
                              return (
                                <label key={c.key} className={`form-check-item${checked ? ' form-check-item--active' : ''}`}>
                                  <input type="checkbox" checked={checked} onChange={() => toggleArrayItem('entityCriteria', c.key)} />
                                  <span>{c.label}</span>
                                </label>
                              );
                            })}
                          </div>
                          {formErrors.entityCriteria && (
                            <p className="form-error-msg">{lang === 'es' ? 'Seleccione al menos un criterio' : 'Select at least one criterion'}</p>
                          )}
                        </>
                      )}

                      <div className="form-nav-row">
                        <button type="button" className="form-btn-back" onClick={() => setFormStep(1)}>&larr; {lang === 'es' ? 'Anterior' : 'Back'}</button>
                        <button type="button" className="form-submit" onClick={handleFormNext}>
                          <span className="form-submit-text">{lang === 'es' ? 'Siguiente' : 'Next'}</span>
                          <svg className="form-submit-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 3: AML Due Diligence */}
                  {formStep === 3 && (
                    <div className="form-step-anim">
                      <h4 className="form-section-title">{lang === 'es' ? 'Debida Diligencia (AML)' : 'Due Diligence (AML)'}</h4>
                      <div className="form-group">
                        <label className="form-label">{lang === 'es' ? 'Origen de los fondos a invertir' : 'Source of funds to be invested'} *</label>
                        <div className="form-chip-row form-chip-wrap">
                          {fundSourceOptions.map(s => (
                            <button key={s.key} type="button" className={`form-chip${formData.sourceOfFunds === s.key ? ' form-chip--active' : ''}${formErrors.sourceOfFunds ? ' form-chip--error' : ''}`} onClick={() => { setFormData(d => ({ ...d, sourceOfFunds: s.key })); setFormErrors(err => ({ ...err, sourceOfFunds: false })); }}>
                              {s.label}
                            </button>
                          ))}
                        </div>
                        {formErrors.sourceOfFunds && <p className="form-error-msg">{lang === 'es' ? 'Selecciona el origen de los fondos' : 'Select the source of funds'}</p>}
                        {formData.sourceOfFunds === 'other' && (
                          <input type="text" placeholder={lang === 'es' ? 'Especifique el origen' : 'Specify the source'} className={`form-input ${formErrors.sourceOfFundsOther ? 'has-error' : ''}`} value={formData.sourceOfFundsOther} onChange={e => { setFormData(d => ({ ...d, sourceOfFundsOther: e.target.value })); setFormErrors(err => ({ ...err, sourceOfFundsOther: false })); }} style={{ marginTop: 8 }} />
                        )}
                      </div>
                      <div className="form-group">
                        <label className="form-label">{lang === 'es' ? '\u00bfEs usted o alg\u00fan familiar cercano una Persona Pol\u00edticamente Expuesta (PEP)?' : 'Are you or any close relative a Politically Exposed Person (PEP)?'} *</label>
                        <p className="form-hint">{lang === 'es' ? 'Funcionarios p\u00fablicos, diplom\u00e1ticos, militares de alto rango, ejecutivos de empresas estatales.' : 'Public officials, diplomats, senior military officers, state enterprise executives.'}</p>
                        <div className="form-toggle-row">
                          <button type="button" className={`form-toggle${formData.isPep ? ' form-toggle--warn' : ''}`} onClick={() => setFormData(d => ({ ...d, isPep: true }))}>{lang === 'es' ? 'S\u00ed' : 'Yes'}</button>
                          <button type="button" className={`form-toggle${!formData.isPep ? ' form-toggle--active' : ''}`} onClick={() => setFormData(d => ({ ...d, isPep: false }))}>{lang === 'es' ? 'No' : 'No'}</button>
                        </div>
                        {formData.isPep && (<>
                          <textarea rows={2} placeholder={lang === 'es' ? 'Describa la relaci\u00f3n pol\u00edtica' : 'Describe the political relationship'} className={`form-input form-textarea ${formErrors.pepDetails ? 'has-error' : ''}`} value={formData.pepDetails} onChange={e => { setFormData(d => ({ ...d, pepDetails: e.target.value })); setFormErrors(err => ({ ...err, pepDetails: false })); }} />
                          {formErrors.pepDetails && <p className="form-error-msg">{lang === 'es' ? 'Describe la relacion politica' : 'Describe the political relationship'}</p>}
                        </>)}
                      </div>
                      <div className="form-group">
                        <label className="form-label">{lang === 'es' ? '\u00bfEs ciudadano o residente fiscal de EE.UU.?' : 'Are you a US citizen or tax resident?'} *</label>
                        <div className="form-toggle-row">
                          <button type="button" className={`form-toggle${formData.isUsCitizen ? ' form-toggle--active' : ''}`} onClick={() => setFormData(d => ({ ...d, isUsCitizen: true }))}>{lang === 'es' ? 'S\u00ed' : 'Yes'}</button>
                          <button type="button" className={`form-toggle${!formData.isUsCitizen ? ' form-toggle--active' : ''}`} onClick={() => setFormData(d => ({ ...d, isUsCitizen: false }))}>{lang === 'es' ? 'No' : 'No'}</button>
                        </div>
                        {formData.isUsCitizen && (<>
                          <input type="text" placeholder="SSN / ITIN" className={`form-input ${formErrors.usTaxId ? 'has-error' : ''}`} value={formData.usTaxId} onChange={e => { setFormData(d => ({ ...d, usTaxId: e.target.value })); setFormErrors(err => ({ ...err, usTaxId: false })); }} />
                          {formErrors.usTaxId && <p className="form-error-msg">{lang === 'es' ? 'El SSN/ITIN es obligatorio para ciudadanos de EE.UU.' : 'SSN/ITIN is required for US citizens'}</p>}
                        </>)}
                      </div>
                      <div className="form-nav-row">
                        <button type="button" className="form-btn-back" onClick={() => setFormStep(2)}>&larr; {lang === 'es' ? 'Anterior' : 'Back'}</button>
                        <button type="button" className="form-submit" onClick={handleFormNext}>
                          <span className="form-submit-text">{lang === 'es' ? 'Siguiente' : 'Next'}</span>
                          <svg className="form-submit-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Declaration, Signature & Submit */}
                  {formStep === 4 && (
                    <div className="form-step-anim">
                      <h4 className="form-section-title">{lang === 'es' ? 'Declaración Jurada y Firma' : 'Sworn Declaration & Signature'}</h4>
                      <div className="form-declaration">
                        <p className="form-declaration-text">
                          {lang === 'es'
                            ? 'Declaro que toda la información proporcionada es verdadera, correcta y completa. Entiendo que Ancestro Inc. se basa en mis respuestas para determinar mi elegibilidad bajo la Regla 506(b) de la Regulación D. Los valores a adquirir son valores restringidos y no pueden ser ofrecidos, vendidos o transferidos excepto conforme a una exención aplicable. Adquiero los valores para inversión propia, no para distribución o reventa.'
                            : 'I declare that all information provided is true, correct, and complete. I understand that Ancestro Inc. relies on my responses to determine eligibility under Rule 506(b) of Regulation D. The securities to be acquired are restricted securities and may not be offered, sold, or transferred except pursuant to an applicable exemption. I am acquiring the securities for my own account for investment purposes only, not for distribution or resale.'}
                        </p>
                        <label className={`form-declaration-check${formErrors.declarationAccepted ? ' form-declaration-check--error' : ''}`}>
                          <input type="checkbox" checked={formData.declarationAccepted} onChange={e => { setFormData(d => ({ ...d, declarationAccepted: e.target.checked })); setFormErrors(err => ({ ...err, declarationAccepted: false })); }} />
                          <span>{lang === 'es' ? 'Acepto la declaración jurada' : 'I accept the sworn declaration'}</span>
                        </label>
                      </div>

                      {/* Signature */}
                      <div className="sig-section">
                        <label className="form-label">{lang === 'es' ? 'Firma' : 'Signature'} *</label>
                        <div className="sig-tabs">
                          <button type="button" className={`sig-tab${formData.signatureType === 'type' ? ' sig-tab--active' : ''}`} onClick={() => { setFormData(d => ({ ...d, signatureType: 'type', signatureData: '' })); clearCanvas(); }}>
                            {lang === 'es' ? 'Escribir' : 'Type'}
                          </button>
                          <button type="button" className={`sig-tab${formData.signatureType === 'draw' ? ' sig-tab--active' : ''}`} onClick={() => { setFormData(d => ({ ...d, signatureType: 'draw', signatureData: '' })); setTimeout(initCanvas, 50); }}>
                            {lang === 'es' ? 'Dibujar' : 'Draw'}
                          </button>
                        </div>

                        {formData.signatureType === 'type' ? (
                          <div className="sig-type-wrap">
                            <input
                              type="text"
                              placeholder={lang === 'es' ? 'Escriba su nombre completo' : 'Type your full name'}
                              className={`form-input sig-type-input${formErrors.signatureData ? ' has-error' : ''}`}
                              value={formData.signatureData}
                              onChange={e => { setFormData(d => ({ ...d, signatureData: e.target.value })); setFormErrors(err => ({ ...err, signatureData: false })); }}
                            />
                            {formData.signatureData && (
                              <div className="sig-preview">
                                <span className="sig-preview-text">{formData.signatureData}</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className={`sig-draw-wrap${formErrors.signatureData ? ' sig-draw-wrap--error' : ''}`}>
                            <canvas
                              ref={signatureCanvasRef}
                              className="sig-canvas"
                              onMouseDown={startDraw}
                              onMouseMove={draw}
                              onMouseUp={endDraw}
                              onMouseLeave={endDraw}
                              onTouchStart={startDraw}
                              onTouchMove={draw}
                              onTouchEnd={endDraw}
                            />
                            <button type="button" className="sig-clear" onClick={clearCanvas}>
                              {lang === 'es' ? 'Limpiar' : 'Clear'}
                            </button>
                          </div>
                        )}
                        {formErrors.signatureData && <p className="form-error-msg">{lang === 'es' ? 'La firma es obligatoria' : 'Signature is required'}</p>}
                      </div>

                      <div className="form-nav-row">
                        <button type="button" className="form-btn-back" onClick={() => setFormStep(3)}>&larr; {lang === 'es' ? 'Anterior' : 'Back'}</button>
                        <button type="submit" className="form-submit form-submit--final" disabled={submitting}>
                          <span className="form-submit-text">{submitting ? (lang === 'es' ? 'Enviando...' : 'Sending...') : (lang === 'es' ? 'Firmar y Enviar' : 'Sign & Submit')}</span>
                          <svg className="form-submit-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              ) : (
                <div className="form-success is-active">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <p>{lang === 'es' ? '\u00a1Gracias! Nos comunicaremos pronto.' : 'Thank you! We\'ll be in touch soon.'}</p>
                </div>
              )}

              <div className="form-footer">
                <span className="form-footer-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  100% Confidential
                </span>
                <span className="form-footer-sep"></span>
                <span className="form-footer-item">{INVESTMENT.valuationCap} valuation cap</span>
                <span className="form-footer-sep"></span>
                <span className="form-footer-item">SAFE Agreement</span>
              </div>
            </div>

            <div className="form-alt-actions">
              <span className="form-alt-text">Prefer a direct conversation?</span>
              <a
                href="https://calendly.com/tarzan-ancestro/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="form-alt-link"
              >
                Schedule a Private Call
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
              <span className="form-alt-sep">&middot;</span>
              <a href="mailto:invest@ancestro.com" className="form-alt-link">
                invest@ancestro.com
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ ACCORDION / DEEP DIVE ═══════════ */}
      <section className="accordion-section" id="deep-dive">
        <div className="accordion-container">
          <span className="accordion-label">DEEP DIVE</span>
          <h2 className="accordion-heading">Explore the Details</h2>

          <div className="accordion-panels">
            {deepDivePanels.map((panel, i) => (
              <div key={panel.id} className={`panel ${openPanels[panel.id] ? 'panel--open' : ''}`}>
                <button
                  className="panel-trigger"
                  onClick={() => togglePanel(panel.id)}
                  aria-expanded={!!openPanels[panel.id]}
                  aria-controls={`panel-content-${panel.id}`}
                  type="button"
                >
                  <span className="panel-number">{String(i + 1).padStart(2, '0')}</span>
                  <span className="panel-title">{panel.title}</span>
                  <svg
                    className="panel-chevron"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                {openPanels[panel.id] && (
                  <div className="panel-content" id={`panel-content-${panel.id}`}>
                    <p className="panel-text">{panel.content}</p>
                    {panel.items && panel.items.length > 0 && (
                      <ul className="panel-list">
                        {panel.items.map((item) => (
                          <li key={item.label}>
                            <strong>{item.label}</strong>
                            <span>{item.desc}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        /* ═══════════════════════════════════════════ */
        /* INVEST HERO                                */
        /* ═══════════════════════════════════════════ */
        .invest-hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 120px 24px 96px;
          overflow: hidden;
          background: var(--color-black);
        }

        .hero-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        .hero-gradient {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          max-width: 1200px;
          height: 70%;
          background: radial-gradient(
            ellipse 60% 50% at 50% 0%,
            rgba(248, 176, 59, 0.06) 0%,
            transparent 100%
          );
          pointer-events: none;
        }

        .hero-grid-lines {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
          background-size: 80px 80px;
          mask-image: radial-gradient(ellipse 60% 50% at 50% 30%, black 10%, transparent 70%);
          -webkit-mask-image: radial-gradient(ellipse 60% 50% at 50% 30%, black 10%, transparent 70%);
          pointer-events: none;
        }

        .hero-accent-line {
          width: 48px;
          height: 1px;
          background: var(--color-primary);
          margin: 0 auto 40px;
          opacity: 0;
          animation: accentReveal 0.6s ease 0.3s forwards;
          position: relative;
        }

        .hero-accent-line::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: var(--color-primary);
          filter: blur(4px);
          opacity: 0.5;
        }

        .hero-inner {
          position: relative;
          z-index: 1;
          max-width: 800px;
          width: 100%;
          text-align: center;
          opacity: 0;
          transform: translateY(8px);
          animation: fadeUp 0.2s ease forwards;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 7px 20px;
          border: 1px solid var(--color-white-10, rgba(255, 255, 255, 0.1));
          border-radius: 100px;
          font-size: 11px;
          font-weight: 500;
          color: var(--color-gray, rgba(255, 255, 255, 0.55));
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 40px;
        }

        .hero-badge-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #4ade80;
          box-shadow: 0 0 8px rgba(74, 222, 128, 0.5);
          animation: heroPulse 2s ease-in-out infinite;
          flex-shrink: 0;
        }

        .badge-sep {
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: var(--color-gray, rgba(255, 255, 255, 0.35));
          flex-shrink: 0;
        }

        .hero-title-gold {
          color: var(--color-primary);
        }

        .hero-title {
          font-size: clamp(36px, 5.5vw, 64px);
          font-weight: 600;
          line-height: 1.08;
          letter-spacing: -0.025em;
          color: var(--color-white);
          margin: 0 0 24px;
        }

        .hero-subtitle {
          font-size: clamp(16px, 1.8vw, 19px);
          line-height: 1.65;
          color: var(--color-gray, rgba(255, 255, 255, 0.55));
          margin: 0 auto 48px;
          max-width: 600px;
          font-weight: 400;
        }

        .hero-stats {
          display: inline-flex;
          align-items: center;
          gap: 32px;
          margin-bottom: 48px;
          padding: 24px 40px;
          border: 1px solid var(--color-white-10, rgba(255, 255, 255, 0.1));
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.02);
        }

        .stat {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .stat-value {
          font-size: clamp(24px, 3vw, 32px);
          font-weight: 600;
          color: var(--color-white);
          letter-spacing: -0.01em;
          font-variant-numeric: tabular-nums;
        }

        .stat-label {
          font-size: 12px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--color-gray, rgba(255, 255, 255, 0.45));
        }

        .stat-divider {
          width: 1px;
          height: 40px;
          background: var(--color-white-10, rgba(255, 255, 255, 0.1));
        }

        .hero-ctas {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .cta-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 16px 40px;
          background: var(--color-primary);
          color: var(--color-black);
          font-size: 15px;
          font-weight: 700;
          letter-spacing: -0.005em;
          border-radius: 12px;
          text-decoration: none;
          box-shadow: 0 0 0 1px rgba(248, 176, 59, 0.3), 0 4px 16px rgba(248, 176, 59, 0.15);
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .cta-primary:hover {
          background: #f9bc55;
          box-shadow: 0 0 0 1px rgba(248, 176, 59, 0.5), 0 8px 32px rgba(248, 176, 59, 0.25);
          transform: translateY(-2px);
        }

        .cta-primary:active {
          transform: translateY(0);
        }

        .cta-secondary {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 14px 28px;
          color: var(--color-gray, rgba(255, 255, 255, 0.6));
          font-size: 15px;
          font-weight: 500;
          text-decoration: none;
          border: 1px solid var(--color-white-10, rgba(255, 255, 255, 0.1));
          border-radius: 10px;
          background: transparent;
          transition: color 0.15s ease, border-color 0.15s ease, background 0.15s ease;
        }

        .cta-secondary:hover {
          color: var(--color-white);
          border-color: var(--color-white-20, rgba(255, 255, 255, 0.2));
          background: rgba(255, 255, 255, 0.04);
        }

        .cta-secondary:hover svg {
          transform: translateX(3px);
        }

        .cta-secondary svg {
          transition: transform 0.15s ease;
        }

        .hero-proof {
          margin-top: 48px;
          text-align: center;
        }

        .hero-proof-text {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.35);
        }

        .hero-proof-text strong {
          color: rgba(255, 255, 255, 0.6);
          font-weight: 600;
        }

        @keyframes fadeUp {
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes accentReveal {
          0% { opacity: 0; width: 0; }
          100% { opacity: 1; width: 48px; }
        }

        @keyframes heroPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        @media (max-width: 768px) {
          .invest-hero { padding: 100px 20px 72px; min-height: auto; }
          .hero-accent-line { margin-bottom: 32px; }
          .hero-badge { margin-bottom: 32px; }
          .hero-subtitle { margin-bottom: 36px; }
          .hero-stats { gap: 24px; padding: 20px 28px; margin-bottom: 40px; }
          .hero-ctas { flex-direction: column; width: 100%; }
          .cta-primary, .cta-secondary { width: 100%; justify-content: center; }
        }

        @media (max-width: 480px) {
          .invest-hero { padding: 90px 16px 56px; }
          .hero-badge { font-size: 11px; padding: 6px 14px; gap: 6px; margin-bottom: 24px; }
          .hero-stats { flex-direction: column; gap: 0; padding: 16px 20px; width: 100%; max-width: 320px; }
          .stat { padding: 10px 0; align-items: center; }
          .stat-divider { width: 80%; height: 1px; align-self: center; }
          .stat-value { font-size: 22px; }
          .stat-label { font-size: 11px; }
          .hero-proof { gap: 6px; }
          .hero-proof-text { font-size: 11px; }
        }

        /* ═══════════════════════════════════════════ */
        /* INVEST THESIS                              */
        /* ═══════════════════════════════════════════ */
        .invest-thesis {
          padding: 64px 24px;
        }

        .thesis-container {
          max-width: 1100px;
          margin: 0 auto;
        }

        .thesis-label {
          display: block;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--color-primary);
          margin-bottom: 12px;
        }

        .thesis-heading {
          font-size: 2rem;
          font-weight: 600;
          color: var(--color-white);
          letter-spacing: -0.02em;
          margin: 0 0 40px;
        }

        .thesis-grid {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: 0;
          align-items: stretch;
        }

        .thesis-arrow {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 20px;
          color: var(--color-primary);
          opacity: 0.4;
        }

        .thesis-card {
          height: 100%;
          padding: 28px;
          border: 1px solid var(--color-white-10);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.02);
        }

        .thesis-card--gold {
          border-color: rgba(248, 176, 59, 0.15);
          background: rgba(248, 176, 59, 0.03);
        }

        .card-tag {
          display: inline-block;
          font-size: 0.6875rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--color-gray);
          margin-bottom: 12px;
        }

        .card-tag--gold {
          color: var(--color-primary);
        }

        .card-text {
          font-size: 0.9375rem;
          line-height: 1.7;
          color: rgba(255, 255, 255, 0.7);
          margin: 0;
        }

        .card-features {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 16px;
        }

        .card-features span {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--color-primary);
          padding: 4px 12px;
          border: 1px solid rgba(248, 176, 59, 0.2);
          border-radius: 100px;
          background: rgba(248, 176, 59, 0.06);
          white-space: nowrap;
        }

        .card-stats {
          display: flex;
          gap: 20px;
          margin-top: 20px;
          padding-top: 16px;
          border-top: 1px solid var(--color-white-10);
        }

        .card-stat {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .card-stat-val {
          font-size: 1.125rem;
          font-weight: 700;
          color: var(--color-white);
          font-variant-numeric: tabular-nums;
          letter-spacing: -0.02em;
        }

        .card-stat-lbl {
          font-size: 0.6875rem;
          font-weight: 500;
          color: var(--color-gray);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        @media (max-width: 768px) {
          .invest-thesis { padding: 40px 20px; }
          .thesis-heading { font-size: 1.5rem; }
          .thesis-grid { grid-template-columns: 1fr; gap: 16px; }
          .thesis-arrow { transform: rotate(90deg); padding: 4px 0; }
        }

        @media (max-width: 480px) {
          .invest-thesis { padding: 32px 16px; }
          .thesis-heading { font-size: 1.25rem; }
          .thesis-card { padding: 20px 16px; }
          .card-features span { white-space: normal; text-align: center; }
          .card-stats { flex-wrap: wrap; gap: 12px; }
          .card-stat { min-width: 0; }
          .card-stat-val { font-size: 1rem; }
          .card-stat-lbl { font-size: 0.625rem; }
        }

        /* ═══════════════════════════════════════════ */
        /* ACCORDION SECTION                          */
        /* ═══════════════════════════════════════════ */
        .accordion-section {
          padding: 64px 24px;
          position: relative;
        }

        .accordion-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--color-white-10), transparent);
        }

        .accordion-container {
          max-width: 900px;
          margin: 0 auto;
        }

        .accordion-label {
          display: block;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--color-primary);
          margin-bottom: 12px;
        }

        .accordion-heading {
          font-size: 2rem;
          font-weight: 600;
          color: var(--color-white);
          letter-spacing: -0.02em;
          margin: 0 0 40px;
        }

        .accordion-panels {
          display: flex;
          flex-direction: column;
        }

        .panel {
          border-top: 1px solid var(--color-white-10);
        }

        .panel:last-child {
          border-bottom: 1px solid var(--color-white-10);
        }

        .panel-trigger {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px 0;
          cursor: pointer;
          user-select: none;
          transition: color 0.2s ease;
          background: none;
          border: none;
          width: 100%;
          text-align: left;
          font-family: inherit;
        }

        .panel-number {
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--color-primary);
          font-variant-numeric: tabular-nums;
          min-width: 24px;
          opacity: 0.6;
        }

        .panel--open .panel-number {
          opacity: 1;
        }

        .panel-title {
          flex: 1;
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--color-white);
          letter-spacing: -0.01em;
        }

        .panel-chevron {
          width: 18px;
          height: 18px;
          color: var(--color-gray);
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), color 0.2s ease;
          flex-shrink: 0;
        }

        .panel--open .panel-chevron {
          transform: rotate(180deg);
          color: var(--color-primary);
        }

        .panel-trigger:hover .panel-title {
          color: var(--color-primary);
        }

        .panel-content {
          padding: 0 0 24px 40px;
          animation: slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .panel-text {
          font-size: 0.9375rem;
          line-height: 1.7;
          color: var(--color-gray);
          margin: 0;
          max-width: 640px;
        }

        .panel-list {
          list-style: none;
          padding: 0;
          margin: 20px 0 0;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .panel-list li {
          display: flex;
          flex-direction: column;
          gap: 2px;
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--color-white-10);
          border-radius: 8px;
        }

        .panel-list li strong {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--color-white);
        }

        .panel-list li span {
          font-size: 0.8125rem;
          color: var(--color-gray);
          line-height: 1.5;
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 640px) {
          .accordion-section { padding: 40px 20px; }
          .accordion-heading { font-size: 1.5rem; margin-bottom: 28px; }
          .panel-trigger { padding: 16px 0; }
          .panel-title { font-size: 1rem; }
          .panel-content { padding: 0 0 20px 0; }
          .panel-list { grid-template-columns: 1fr; }
        }

        /* ═══════════════════════════════════════════ */
        /* INVEST NUMBERS                             */
        /* ═══════════════════════════════════════════ */
        .invest-numbers {
          padding: 64px 24px;
          position: relative;
        }

        .invest-numbers::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--color-white-10), transparent);
        }

        .numbers-container {
          max-width: 1100px;
          margin: 0 auto;
        }

        .numbers-label {
          display: block;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--color-primary);
          margin-bottom: 12px;
        }

        .numbers-heading {
          font-size: 2rem;
          font-weight: 600;
          color: var(--color-white);
          letter-spacing: -0.02em;
          margin: 0 0 40px;
        }

        .numbers-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
          margin-bottom: 48px;
        }

        .block-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .block-title {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--color-gray);
          margin: 0;
        }

        .verified-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 3px 10px;
          border-radius: 100px;
          border: 1px solid rgba(74, 222, 128, 0.25);
          background: rgba(74, 222, 128, 0.06);
          color: #4ade80;
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .terms-list {
          display: flex;
          flex-direction: column;
        }

        .term-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          padding: 10px 0;
          border-bottom: 1px solid var(--color-white-10);
        }

        .term-row:last-child {
          border-bottom: none;
        }

        .term-key {
          font-size: 0.8125rem;
          color: var(--color-gray);
        }

        .term-val {
          font-size: 0.9375rem;
          font-weight: 600;
          color: var(--color-white);
          font-variant-numeric: tabular-nums;
        }

        .term-val--gold {
          color: var(--color-primary);
        }

        .participation-row {
          display: flex;
          gap: 12px;
          margin-top: 20px;
        }

        .part-option {
          flex: 1;
          padding: 14px;
          border: 1px solid var(--color-white-10);
          border-radius: 10px;
          position: relative;
        }

        .part-option--active {
          border-color: rgba(248, 176, 59, 0.3);
          background: rgba(248, 176, 59, 0.04);
        }

        .part-badge {
          position: absolute;
          top: -8px;
          right: 12px;
          font-size: 9px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--color-primary);
          background: var(--color-black);
          padding: 2px 8px;
          border: 1px solid rgba(248, 176, 59, 0.3);
          border-radius: 100px;
        }

        .part-type {
          display: block;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--color-white);
          margin-bottom: 4px;
        }

        .part-desc {
          font-size: 0.75rem;
          color: var(--color-gray);
          line-height: 1.5;
        }

        .funds-bars {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .fund-row {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .fund-info {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
        }

        .fund-pct {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--color-white);
          font-variant-numeric: tabular-nums;
          min-width: 36px;
        }

        .fund-name {
          font-size: 0.8125rem;
          color: var(--color-gray);
        }

        .fund-track {
          height: 8px;
          background: rgba(255, 255, 255, 0.06);
          border-radius: 4px;
          overflow: hidden;
        }

        .fund-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--color-primary), rgba(248, 176, 59, 0.7));
          border-radius: 4px;
          transition: width 0.8s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .numbers-cta {
          display: flex;
          justify-content: center;
          gap: 16px;
          margin-bottom: 16px;
        }

        .num-cta-primary {
          display: inline-flex;
          align-items: center;
          padding: 14px 40px;
          background: var(--color-primary);
          color: var(--color-black);
          font-size: 0.9375rem;
          font-weight: 700;
          border-radius: 12px;
          text-decoration: none;
          transition: background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
        }

        .num-cta-primary:hover {
          background: #ffbe4d;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(248, 176, 59, 0.25);
        }

        .num-cta-secondary {
          display: inline-flex;
          align-items: center;
          padding: 14px 32px;
          background: rgba(255, 255, 255, 0.04);
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.9375rem;
          font-weight: 600;
          border: 1px solid var(--color-white-20);
          border-radius: 12px;
          text-decoration: none;
          backdrop-filter: blur(8px);
          transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
        }

        .num-cta-secondary:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.3);
          transform: translateY(-1px);
        }

        .numbers-contact {
          text-align: center;
          font-size: 0.8125rem;
          color: rgba(255, 255, 255, 0.35);
          margin: 0;
        }

        .numbers-contact a {
          color: rgba(255, 255, 255, 0.5);
          text-decoration: none;
          border-bottom: 1px solid rgba(255, 255, 255, 0.15);
          transition: color 0.2s ease, border-color 0.2s ease;
        }

        .numbers-contact a:hover {
          color: var(--color-primary);
          border-color: var(--color-primary);
        }

        @media (max-width: 768px) {
          .invest-numbers { padding: 40px 20px; }
          .numbers-heading { font-size: 1.5rem; }
          .numbers-grid { grid-template-columns: 1fr; gap: 40px; }
          .participation-row { flex-direction: column; }
          .numbers-cta { flex-direction: column; align-items: center; }
          .num-cta-primary, .num-cta-secondary { width: 100%; max-width: 340px; justify-content: center; }
        }

        @media (max-width: 480px) {
          .invest-numbers { padding: 32px 16px; }
          .numbers-heading { font-size: 1.25rem; }
          .term-row { flex-direction: column; gap: 4px; padding: 10px 0; }
          .term-key { font-size: 0.75rem; }
          .fund-name { font-size: 0.75rem; word-break: break-word; }
          .fund-pct { font-size: 0.8125rem; min-width: 30px; }
          .numbers-contact { font-size: 0.8125rem; }
          .num-cta-primary, .num-cta-secondary { font-size: 14px; padding: 14px 20px; }
        }

        /* ═══════════════════════════════════════════ */
        /* FINAL CTA                                  */
        /* ═══════════════════════════════════════════ */
        .final-cta {
          position: relative;
          overflow: hidden;
          padding: 80px 24px 56px;
          text-align: center;
        }

        .final-cta__glow {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          max-width: 1200px;
          height: 520px;
          background: radial-gradient(
            ellipse 80% 55% at 50% 0%,
            rgba(248, 176, 59, 0.08) 0%,
            transparent 100%
          );
          pointer-events: none;
        }

        .final-cta__inner {
          position: relative;
          z-index: 1;
          max-width: 800px;
          margin: 0 auto;
        }

        .final-cta__statements {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-bottom: 32px;
        }

        .final-cta__line {
          font-size: 1.5rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.72);
          letter-spacing: -0.01em;
          line-height: 1.4;
          margin: 0;
          opacity: 0;
          transform: translateY(18px);
          transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
                      transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .final-cta__line.is-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .final-cta__divider {
          width: 40px;
          height: 2px;
          background: var(--color-primary);
          margin: 0 auto 32px;
          opacity: 0;
          transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .final-cta__divider.is-visible {
          opacity: 1;
        }

        .final-cta__declaration-gold {
          color: var(--color-primary);
        }

        .final-cta__declaration {
          font-size: 2rem;
          font-weight: 700;
          color: var(--color-white);
          line-height: 1.3;
          letter-spacing: -0.025em;
          margin: 0 0 48px;
          opacity: 0;
          transform: translateY(18px);
          transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
                      transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .final-cta__declaration.is-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .invest-form-wrap {
          text-align: left;
          opacity: 0;
          transform: translateY(18px);
          transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
                      transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .invest-form-wrap.is-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .invest-form-card {
          background: linear-gradient(
            165deg,
            rgba(255, 255, 255, 0.06) 0%,
            rgba(255, 255, 255, 0.02) 100%
          );
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 16px 64px rgba(0, 0, 0, 0.3),
                      inset 0 1px 0 rgba(255, 255, 255, 0.08);
        }

        .invest-form-header {
          margin-bottom: 32px;
          text-align: center;
        }

        .invest-form-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--color-white);
          margin: 0 0 8px;
          letter-spacing: -0.02em;
        }

        .invest-form-subtitle {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.45);
          margin: 0;
        }

        .invest-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
          position: relative;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-group--full {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-label {
          font-size: 0.8rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.6);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .form-optional {
          font-weight: 400;
          text-transform: none;
          letter-spacing: 0;
          color: rgba(255, 255, 255, 0.3);
        }

        .form-input {
          width: 100%;
          padding: 13px 16px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: var(--color-white);
          font-size: 0.9375rem;
          font-family: inherit;
          outline: none;
          transition: border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
          box-sizing: border-box;
        }

        .form-input::placeholder {
          color: rgba(255, 255, 255, 0.2);
        }

        .form-input:focus {
          border-color: rgba(248, 176, 59, 0.5);
          background: rgba(255, 255, 255, 0.06);
          box-shadow: 0 0 0 3px rgba(248, 176, 59, 0.08);
        }

        .form-input.has-error {
          border-color: rgba(248, 113, 113, 0.6);
          animation: fieldShake 0.4s ease;
        }

        .form-chip--error {
          border-color: rgba(248, 113, 113, 0.4) !important;
        }

        @keyframes fieldShake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          50% { transform: translateX(4px); }
          75% { transform: translateX(-4px); }
        }

        .form-select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.4)' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
          padding-right: 40px;
          cursor: pointer;
        }

        .form-select option {
          background: #1a1a1a;
          color: #fff;
        }

        .form-textarea {
          resize: vertical;
          min-height: 80px;
        }

        .form-submit {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 16px 32px;
          background: var(--color-primary);
          color: var(--color-black);
          font-size: 1rem;
          font-weight: 700;
          font-family: inherit;
          letter-spacing: -0.01em;
          border: none;
          border-radius: 14px;
          cursor: pointer;
          transition: background 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease;
          margin-top: 4px;
        }

        .form-submit:hover {
          background: #ffbe4d;
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(248, 176, 59, 0.3);
        }

        .form-submit:active {
          transform: translateY(0);
        }

        .form-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .form-submit-arrow {
          transition: transform 0.3s ease;
        }

        .form-submit:hover .form-submit-arrow {
          transform: translateX(4px);
        }

        .form-success {
          display: none;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 32px 20px;
          text-align: center;
        }

        .form-success.is-active {
          display: flex;
        }

        .form-success p {
          font-size: 1.05rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.8);
          margin: 0;
        }

        .form-footer {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          padding-top: 24px;
          margin-top: 8px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
        }

        .form-footer-item {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 0.8rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.4);
          white-space: nowrap;
        }

        .form-footer-item svg {
          color: #4ade80;
        }

        .form-footer-sep {
          width: 1px;
          height: 14px;
          background: rgba(255, 255, 255, 0.08);
        }

        .form-alt-actions {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-top: 24px;
          flex-wrap: wrap;
        }

        .form-alt-text {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.35);
        }

        .form-alt-link {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 0.85rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.6);
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .form-alt-link:hover {
          color: var(--color-primary);
        }

        .form-alt-sep {
          color: rgba(255, 255, 255, 0.2);
          font-size: 0.85rem;
        }

        /* KYC Gate */
        .kyc-gate{margin-bottom:20px}
        .kyc-gate-step{display:flex;flex-direction:column;align-items:center;gap:12px;padding:20px;border:1px solid rgba(255,255,255,0.06);border-radius:12px;background:rgba(255,255,255,0.02);text-align:center}
        .kyc-gate-step--pending{border-color:rgba(234,179,8,0.2);background:rgba(234,179,8,0.03)}
        .kyc-gate-step--rejected{border-color:rgba(239,68,68,0.2);background:rgba(239,68,68,0.03)}
        .kyc-gate-step--verified{border-color:rgba(34,197,94,0.2);background:rgba(34,197,94,0.03)}
        .kyc-gate-icon{width:48px;height:48px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:rgba(248,176,59,0.1)}
        .kyc-gate-icon--pending{background:rgba(234,179,8,0.1)}
        .kyc-gate-icon--rejected{background:rgba(239,68,68,0.1)}
        .kyc-gate-icon--verified{background:rgba(34,197,94,0.1)}
        .kyc-gate-text{font-size:14px;color:rgba(255,255,255,0.6);line-height:1.5;margin:0}
        .kyc-gate-refresh{padding:8px 20px;border:1px solid rgba(234,179,8,0.3);border-radius:10px;background:rgba(234,179,8,0.06);color:#eab308;font-size:13px;font-weight:600;font-family:inherit;cursor:pointer;transition:all 0.2s}
        .kyc-gate-refresh:hover{background:rgba(234,179,8,0.12);border-color:rgba(234,179,8,0.5)}
        .metamap-btn-container{display:flex;justify-content:center}

        /* Multi-step form additions */
        .form-progress{display:flex;justify-content:center;gap:8px;margin-bottom:20px}
        .form-progress-step{display:flex;align-items:center;gap:6px;opacity:0.3;transition:opacity 0.2s}
        .form-progress-step.active{opacity:1}
        .form-progress-num{width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;background:rgba(255,255,255,0.08);color:rgba(255,255,255,0.5)}
        .form-progress-step.active .form-progress-num{background:rgba(248,176,59,0.2);color:#f8b03b}
        .form-progress-step.done .form-progress-num{background:rgba(34,197,94,0.2);color:#22c55e}
        .form-progress-label{font-size:11px;color:rgba(255,255,255,0.5);display:none}
        @media(min-width:600px){.form-progress-label{display:block}}
        .form-step-anim{animation:formStepFade 0.3s ease}
        @keyframes formStepFade{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .form-section-title{font-size:15px;font-weight:700;color:#fff;margin:0 0 12px;padding-bottom:10px;border-bottom:1px solid rgba(255,255,255,0.06)}
        .form-hint{font-size:12px;color:rgba(255,255,255,0.35);line-height:1.5;margin:0 0 12px}
        .form-chip-row{display:flex;gap:8px;flex-wrap:wrap}
        .form-chip-wrap{flex-wrap:wrap}
        .form-chip{display:inline-flex;align-items:center;padding:8px 14px;border:1px solid rgba(255,255,255,0.08);border-radius:10px;cursor:pointer;font-size:12px;color:rgba(255,255,255,0.6);background:none;font-family:inherit;transition:all 0.2s}
        .form-chip:hover{border-color:rgba(255,255,255,0.2)}
        .form-chip--active{border-color:rgba(248,176,59,0.4);background:rgba(248,176,59,0.06);color:#f8b03b}
        .form-checks{display:flex;flex-direction:column;gap:8px;margin-bottom:12px}
        .form-check-section{font-size:13px;font-weight:700;color:rgba(248,176,59,0.9);padding:10px 0 4px;margin-top:8px;border-bottom:1px solid rgba(248,176,59,0.15)}
        .form-check-section:first-child{margin-top:0}
        .accreditation-sections{display:flex;flex-direction:column;gap:12px}
        .accred-card{padding:16px;border:1px solid rgba(255,255,255,0.08);border-radius:12px;background:rgba(255,255,255,0.02);transition:all 0.2s}
        .accred-card--yes{border-color:rgba(34,197,94,0.3);background:rgba(34,197,94,0.04)}
        .accred-card-title{font-size:13px;font-weight:700;color:rgba(248,176,59,0.9);margin-bottom:8px}
        .accred-card-question{font-size:13px;color:rgba(255,255,255,0.7);line-height:1.5;margin:0 0 12px}
        .accred-card-toggle{display:flex;gap:8px}
        .accred-toggle-btn{flex:1;padding:8px 16px;border:1px solid rgba(255,255,255,0.12);border-radius:8px;background:rgba(255,255,255,0.03);color:rgba(255,255,255,0.5);font-size:13px;font-weight:600;font-family:inherit;cursor:pointer;transition:all 0.2s}
        .accred-toggle-btn:hover{border-color:rgba(255,255,255,0.25)}
        .accred-toggle-btn--active-yes{border-color:rgba(34,197,94,0.5);background:rgba(34,197,94,0.15);color:#22c55e}
        .accred-toggle-btn--active-no{border-color:rgba(255,255,255,0.2);background:rgba(255,255,255,0.06);color:rgba(255,255,255,0.7)}
        .form-check-item{display:flex;align-items:flex-start;gap:10px;padding:10px 12px;border:1px solid rgba(255,255,255,0.06);border-radius:10px;cursor:pointer;font-size:12px;color:rgba(255,255,255,0.6);line-height:1.5;transition:all 0.2s}
        .form-check-item input{width:16px;height:16px;accent-color:#f8b03b;margin-top:1px;flex-shrink:0}
        .form-check-item:hover{border-color:rgba(255,255,255,0.15)}
        .form-check-item--active{border-color:rgba(248,176,59,0.3);background:rgba(248,176,59,0.04);color:#fff}
        .form-toggle-row{display:flex;gap:8px;margin-bottom:8px}
        .form-toggle{padding:8px 20px;border:1px solid rgba(255,255,255,0.1);border-radius:10px;background:none;color:rgba(255,255,255,0.5);font-size:13px;font-weight:600;font-family:inherit;cursor:pointer;transition:all 0.2s}
        .form-toggle--active{border-color:rgba(34,197,94,0.4);background:rgba(34,197,94,0.08);color:#22c55e}
        .form-toggle--warn{border-color:rgba(234,179,8,0.4);background:rgba(234,179,8,0.08);color:#eab308}
        .form-declaration{padding:16px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.08);border-radius:12px;margin-bottom:16px}
        .form-declaration-text{font-size:12px;color:rgba(255,255,255,0.4);line-height:1.7;margin:0 0 14px}
        .form-declaration-check{display:flex;align-items:flex-start;gap:10px;cursor:pointer;font-size:14px;font-weight:600;color:#fff}
        .form-declaration-check input{width:18px;height:18px;accent-color:#f8b03b;margin-top:1px;flex-shrink:0}
        .form-declaration-check--error{color:#ef4444}
        .form-error-msg{color:#ef4444;font-size:12px;margin:4px 0 0}
        .form-nav-row{display:flex;gap:12px;margin-top:16px}
        .form-btn-back{padding:12px 24px;border:1px solid rgba(255,255,255,0.1);border-radius:10px;background:rgba(255,255,255,0.06);color:rgba(255,255,255,0.6);font-size:14px;font-weight:600;font-family:inherit;cursor:pointer;transition:all 0.2s}
        .form-btn-back:hover{background:rgba(255,255,255,0.1)}
        .form-submit--final{background:linear-gradient(135deg,#22c55e,#16a34a)}
        .form-submit--final:hover{background:linear-gradient(135deg,#16a34a,#15803d);box-shadow:0 6px 20px rgba(34,197,94,0.3)}

        /* Signature */
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');
        .sig-section{margin-bottom:16px}
        .sig-tabs{display:flex;gap:4px;margin:8px 0 12px}
        .sig-tab{padding:8px 18px;border:1px solid rgba(255,255,255,0.1);border-radius:8px;background:none;color:rgba(255,255,255,0.5);font-size:13px;font-weight:600;font-family:inherit;cursor:pointer;transition:all 0.2s}
        .sig-tab--active{border-color:rgba(248,176,59,0.4);background:rgba(248,176,59,0.08);color:#f8b03b}
        .sig-type-wrap{display:flex;flex-direction:column;gap:12px}
        .sig-type-input{font-size:16px}
        .sig-preview{padding:16px 20px;border:1px solid rgba(255,255,255,0.06);border-radius:10px;background:rgba(255,255,255,0.02);text-align:center;min-height:60px;display:flex;align-items:center;justify-content:center}
        .sig-preview-text{font-family:'Dancing Script','Segoe Script','Brush Script MT',cursive;font-size:32px;color:#f8b03b;user-select:none}
        .sig-draw-wrap{position:relative;border:1px solid rgba(255,255,255,0.1);border-radius:10px;overflow:hidden;background:rgba(255,255,255,0.02)}
        .sig-draw-wrap--error{border-color:#ef4444}
        .sig-canvas{width:100%;height:150px;cursor:crosshair;touch-action:none;display:block}
        .sig-clear{position:absolute;top:8px;right:8px;padding:4px 12px;border:1px solid rgba(255,255,255,0.15);border-radius:6px;background:rgba(0,0,0,0.4);color:rgba(255,255,255,0.5);font-size:11px;font-family:inherit;cursor:pointer;transition:all 0.2s}
        .sig-clear:hover{background:rgba(239,68,68,0.15);border-color:rgba(239,68,68,0.3);color:#ef4444}

        @media (max-width: 640px) {
          .final-cta { padding: 56px 20px 40px; }
          .final-cta__line { font-size: 1.25rem; }
          .final-cta__declaration { font-size: 1.55rem; margin-bottom: 44px; }
          .invest-form-card { padding: 28px 20px; border-radius: 16px; }
          .form-row { grid-template-columns: 1fr; gap: 16px; }
          .form-footer { flex-direction: column; gap: 8px; }
          .form-footer-sep { display: none; }
          .form-alt-actions { flex-direction: column; gap: 8px; }
        }

        @media (max-width: 420px) {
          .final-cta { padding: 44px 14px 32px; }
          .final-cta__line { font-size: 1.0625rem; }
          .final-cta__declaration { font-size: 1.3rem; margin-bottom: 36px; }
          .invest-form-card { padding: 22px 14px; }
          .form-submit { padding: 14px 20px; font-size: 0.9375rem; }
          .form-footer-item { white-space: normal; font-size: 0.75rem; }
        }
      `}</style>
    </>
  );
}
