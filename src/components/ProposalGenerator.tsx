'use client';
import { useState, useRef, useCallback, useEffect, memo } from 'react';
import { t } from '@/i18n/translations';

type FieldChange = (name: string, value: string) => void;

interface TextFieldProps {
  name: string;
  type?: string;
  value: string;
  label: string;
  error?: boolean;
  required?: boolean;
  placeholder?: string;
  onChange: FieldChange;
}

const TextField = memo(function TextField({
  name, type = 'text', value, label, error, required, placeholder, onChange,
}: TextFieldProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <label style={{ color: '#71717A', fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase' }}>{label}{required ? ' *' : ''}</label>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, padding: '0 18px',
        height: 54, background: '#FFFFFF06', borderRadius: 12,
        border: `1px solid ${error ? '#EF444460' : '#FFFFFF18'}`,
      }}>
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          required={required}
          style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: '#fff', fontSize: 14, fontWeight: 600, fontFamily: 'inherit' }}
          onChange={e => onChange(name, e.currentTarget.value)}
        />
      </div>
    </div>
  );
});

interface SelectFieldProps {
  name: string;
  value: string;
  label: string;
  options: { value: string; label: string }[];
  error?: boolean;
  onChange: FieldChange;
}

const SelectField = memo(function SelectField({
  name, value, label, options, error, onChange,
}: SelectFieldProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <label style={{ color: '#71717A', fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase' }}>{label}</label>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, padding: '0 18px',
        height: 54, background: '#FFFFFF06', borderRadius: 12,
        border: `1px solid ${error ? '#EF444460' : '#FFFFFF18'}`,
      }}>
        <select
          value={value}
          style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: '#fff', fontSize: 14, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer', appearance: 'none' }}
          onChange={e => onChange(name, e.currentTarget.value)}
        >
          {options.map(o => <option key={o.value} value={o.value} style={{ background: '#1a1a1a', color: '#fff' }}>{o.label}</option>)}
        </select>
        <Icon name="chevron-down" size={16} color="#A1A1AA" />
      </div>
    </div>
  );
});

const ITEMS = {
  check: <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>,
  'arrow-right': <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>,
  'arrow-left': <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>,
  'chevron-down': <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>,
  'chevron-right': <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>,
  'chevron-left': <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>,
  sparkles: <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>,
  users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></>,
  'shield-check': <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></>,
  star: <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="currentColor"/>,
  sun: <><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></>,
  lock: <><rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></>,
  'credit-card': <><rect x="1" y="4" width="22" height="16" rx="2" stroke="currentColor" strokeWidth="2"/><line x1="1" y1="10" x2="23" y2="10" stroke="currentColor" strokeWidth="2"/></>,
  'trending-down': <><polyline points="22 17 13.5 8.5 8.5 13.5 2 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><polyline points="16 17 22 17 22 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></>,
  'battery-charging': <><path d="M15 7h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2M6 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><polyline points="11 7 8 12 12 12 9 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><line x1="22" y1="11" x2="22" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></>,
  'map-pin': <><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/></>,
  calendar: <><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/><line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/></>,
  home: <><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><polyline points="9 22 9 12 15 12 15 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></>,
  'building-2': <><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" stroke="currentColor" strokeWidth="2"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" stroke="currentColor" strokeWidth="2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" stroke="currentColor" strokeWidth="2"/><path d="M10 6h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></>,
  building: <><rect x="4" y="2" width="16" height="20" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M9 6h6M9 10h6M9 14h6M9 18h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></>,
  'loader-circle': <path d="M21 12a9 9 0 1 1-6.219-8.56" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>,
  info: <><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></>,
  phone: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>,
  banknote: <><rect x="2" y="6" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="2"/><path d="M6 12h.01M18 12h.01" stroke="currentColor" strokeWidth="2"/></>,
  footprint: <><path d="M4 16c-1.1 0-2-.9-2-2 0-1.1.9-2 2-2M20 16c1.1 0 2-.9 2-2 0-1.1-.9-2-2-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M12 22V2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></>,
};

function Icon({ name, size = 24, color = 'currentColor' }: { name: keyof typeof ITEMS; size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ color, flexShrink: 0 }}>
      {ITEMS[name]}
    </svg>
  );
}

const STEPS = ['landing', 'basic', 'property', 'system', 'generating', 'confirm'] as const;
type Step = (typeof STEPS)[number];

interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  propertyType: string;
  roofType: string;
  billRange: string;
  system: string;
  paymentType: 'subscription' | 'purchase';
  terms: boolean;
}

const initialForm: FormData = {
  name: '', email: '', phone: '', address: '',
  propertyType: '', roofType: '', billRange: '',
  system: '', paymentType: 'subscription', terms: false,
};

const SYSTEMS = [
  { id: 'starter', tier: 'proposal.systems.starter.tier', title: 'proposal.systems.starter.title', price: '15', purchasePrice: '8,500', specs: ['16 panels · 6.4 kW', '~70% energy coverage', '15-year warranty'], color: '#FFFFFF' },
  { id: 'pro', tier: 'proposal.systems.pro.tier', title: 'proposal.systems.pro.title', price: '20', purchasePrice: '13,500', specs: ['24 panels · 9.6 kW', '104% coverage · sells back to grid', '20-year coverage · monitoring app', 'Battery backup ready'], color: '#A78BFA', tierColor: '#A78BFA' },
  { id: 'max', tier: 'proposal.systems.max.tier', title: 'proposal.systems.max.title', price: '25', purchasePrice: '22,500', specs: ['32 panels + 13.5 kWh battery', '100% off-grid capable', 'Backup during outages'], color: '#FBBF24', popular: true },
];

const ROOF_OPTIONS = [
  { value: '', labelKey: 'proposal.roof.placeholder' },
  { value: 'asphalt', labelKey: 'proposal.roof.asphalt' },
  { value: 'tile', labelKey: 'proposal.roof.tile' },
  { value: 'metal', labelKey: 'proposal.roof.metal' },
  { value: 'flat', labelKey: 'proposal.roof.flat' },
];

const BILL_OPTIONS = [
  { value: 'lt100', label: '<$100' },
  { value: '100-200', label: '$100-200' },
  { value: '200-300', label: '$200-300' },
  { value: '300+', label: '$300+' },
];

const PROPERTY_TYPES = [
  { value: 'single', icon: 'home' as const, labelKey: 'proposal.property.single' },
  { value: 'townhouse', icon: 'building-2' as const, labelKey: 'proposal.property.townhouse' },
  { value: 'apartment', icon: 'building' as const, labelKey: 'proposal.property.apartment' },
];

export default function ProposalGenerator({ lang }: { lang: string }) {
  const [step, setStep] = useState<Step>('landing');
  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, boolean>>>({});
  const contentRef = useRef<HTMLDivElement>(null);

  const scrollToTop = useCallback(() => {
    setTimeout(() => contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  }, []);

  const update = useCallback(<K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm(prev => (prev[key] === value ? prev : { ...prev, [key]: value }));
    setErrors(prev => (prev[key] ? { ...prev, [key]: false } : prev));
  }, []);

  const handleFieldChange = useCallback<FieldChange>((name, value) => {
    update(name as keyof FormData, value as FormData[keyof FormData]);
  }, [update]);

  function validateBasic(): boolean {
    const e: Partial<Record<keyof FormData, boolean>> = {};
    if (!form.name.trim()) e.name = true;
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = true;
    if (!form.phone.trim()) e.phone = true;
    if (!form.address.trim()) e.address = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validateProperty(): boolean {
    const e: Partial<Record<keyof FormData, boolean>> = {};
    if (!form.propertyType) e.propertyType = true;
    if (!form.roofType) e.roofType = true;
    if (!form.billRange) e.billRange = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  const systemPrice = SYSTEMS.find(s => s.id === form.system)?.price || '25';
  const systemPurchasePrice = SYSTEMS.find(s => s.id === form.system)?.purchasePrice || '22,500';
  const isPurchase = form.paymentType === 'purchase';
  const isSystemSelected = !!form.system;

  return (
    <div ref={contentRef} style={{
      minHeight: '100vh', background: 'linear-gradient(135deg, #0A0A0A 0%, #1A1208 60%, #0A0A0A 100%)',
      paddingTop: 80,
    }}>
      {/* ========== STEP: LANDING ========== */}
      {step === 'landing' && (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          minHeight: 'calc(100vh - 80px)', padding: '80px 20px 120px', gap: 24,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 12px', height: 30, background: '#FBBF2418', borderRadius: 15, border: '1px solid #FBBF2440' }}>
            <Icon name="sparkles" size={14} color="#FBBF24" />
            <span style={{ color: '#FBBF24', fontSize: 11, fontWeight: 800, letterSpacing: 1.5 }}>{t(lang, 'proposal.hero.badge')}</span>
          </div>
          <h1 style={{ color: '#fff', fontSize: 'clamp(40px,8vw,88px)', fontWeight: 800, letterSpacing: -2.5, lineHeight: 1, textAlign: 'center', margin: 0, maxWidth: 1280 }}>
            {t(lang, 'proposal.hero.title')}
          </h1>
          <p style={{ color: '#D4D4D8', fontSize: 18, textAlign: 'center', maxWidth: 740, lineHeight: 1.55, margin: 0 }}>
            {t(lang, 'proposal.hero.subtitle')}
          </p>
          <button
            onClick={() => { setStep('basic'); scrollToTop(); }}
            style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '0 32px', height: 60,
              background: 'linear-gradient(135deg, #FBBF24, #F59E0B)', borderRadius: 14,
              border: 'none', cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            <span style={{ color: '#0A0617', fontSize: 17, fontWeight: 800 }}>{t(lang, 'proposal.hero.cta')}</span>
            <Icon name="arrow-right" size={18} color="#0A0617" />
          </button>
          <div style={{ display: 'flex', gap: 32, justifyContent: 'center', alignItems: 'center' }}>
            <StatItem icon="users" color="#34D399" label={t(lang, 'proposal.hero.stat1')} />
            <div style={{ width: 1, height: 24, background: '#FFFFFF1A' }} />
            <StatItem icon="shield-check" color="#34D399" label={t(lang, 'proposal.hero.stat2')} />
            <div style={{ width: 1, height: 24, background: '#FFFFFF1A' }} />
            <StatItem icon="star" color="#FBBF24" label={t(lang, 'proposal.hero.stat3')} />
          </div>
        </div>
      )}

      {/* ========== STEP: BASIC INFO ========== */}
      {step === 'basic' && (
        <div style={{ maxWidth: 1440, margin: '0 auto', padding: '40px 80px 80px', display: 'flex', gap: 32, justifyContent: 'center' }}>
          {/* Left */}
          <div style={{ width: 520, display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ flex: 1, height: 4, borderRadius: 2, background: '#FBBF24' }} />
              <div style={{ flex: 1, height: 4, borderRadius: 2, background: '#FFFFFF14' }} />
              <div style={{ flex: 1, height: 4, borderRadius: 2, background: '#FFFFFF14' }} />
              <div style={{ flex: 1, height: 4, borderRadius: 2, background: '#FFFFFF14' }} />
            </div>
            <p style={{ color: '#FBBF24', fontSize: 11, fontWeight: 800, letterSpacing: 1.5, margin: 0 }}>{t(lang, 'proposal.step1.badge')}</p>
            <h2 style={{ color: '#fff', fontSize: 46, fontWeight: 800, letterSpacing: -1.2, lineHeight: 1.05, margin: 0, maxWidth: 520 }}>{t(lang, 'proposal.step1.title')}</h2>
            <p style={{ color: '#A1A1AA', fontSize: 15, lineHeight: 1.55, margin: 0, maxWidth: 520 }}>{t(lang, 'proposal.step1.subtitle')}</p>
            {/* Illustration placeholder */}
            <div style={{ width: '100%', height: 300, borderRadius: 20, background: 'linear-gradient(135deg, #FBBF2410, #F59E0B08)', border: '1px solid #FBBF2420', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="sun" size={80} color="#FBBF2430" />
            </div>
          </div>
          {/* Right form */}
          <GlassCard style={{ width: 680, display: 'flex', flexDirection: 'column', gap: 20, padding: 40 }}>
            <h3 style={{ color: '#fff', fontSize: 20, fontWeight: 800, margin: 0 }}>{t(lang, 'proposal.step1.formTitle')}</h3>
            <TextField name="name" label={t(lang, 'proposal.form.name')} value={form.name} error={errors.name} required onChange={handleFieldChange} placeholder={t(lang, 'proposal.form.namePlaceholder')} />
            <div style={{ display: 'flex', gap: 14 }}>
              <div style={{ flex: 1 }}>
                <TextField name="email" type="email" label={t(lang, 'proposal.form.email')} value={form.email} error={errors.email} required onChange={handleFieldChange} />
              </div>
              <div style={{ flex: 1 }}>
                <TextField name="phone" type="tel" label={t(lang, 'proposal.form.phone')} value={form.phone} error={errors.phone} required onChange={handleFieldChange} placeholder="+1 (555) 000-0000" />
              </div>
            </div>
            <TextField name="address" label={t(lang, 'proposal.form.address')} value={form.address} error={errors.address} required onChange={handleFieldChange} placeholder={t(lang, 'proposal.form.addressPlaceholder')} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 20, height: 20, borderRadius: 5, background: form.terms ? '#FBBF24' : '#FFFFFF14',
                border: `1px solid ${form.terms ? '#FBBF24' : '#FFFFFF24'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              }} onClick={() => update('terms', !form.terms)}>
                {form.terms && <Icon name="check" size={13} color="#0A0617" />}
              </div>
              <span style={{ color: '#A1A1AA', fontSize: 13, fontWeight: 500 }}>{t(lang, 'proposal.form.terms')}</span>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <button onClick={() => { setStep('landing'); scrollToTop(); }} style={btnSecondary}>
                {t(lang, 'proposal.nav.back')}
              </button>
              <button
                onClick={() => { if (validateBasic()) { setStep('property'); scrollToTop(); } }}
                style={{ ...btnPrimary, flex: 1 }}
              >
                {t(lang, 'proposal.nav.continue')}
                <Icon name="arrow-right" size={16} color="#0A0617" />
              </button>
            </div>
          </GlassCard>
        </div>
      )}

      {/* ========== STEP: PROPERTY ========== */}
      {step === 'property' && (
        <div style={{ maxWidth: 1440, margin: '0 auto', padding: '40px 80px 80px', display: 'flex', gap: 32, justifyContent: 'center' }}>
          <div style={{ width: 520, display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ flex: 1, height: 4, borderRadius: 2, background: '#FBBF24' }} />
              <div style={{ flex: 1, height: 4, borderRadius: 2, background: '#FBBF24' }} />
              <div style={{ flex: 1, height: 4, borderRadius: 2, background: '#FFFFFF14' }} />
              <div style={{ flex: 1, height: 4, borderRadius: 2, background: '#FFFFFF14' }} />
            </div>
            <p style={{ color: '#FBBF24', fontSize: 11, fontWeight: 800, letterSpacing: 1.5, margin: 0 }}>{t(lang, 'proposal.step2.badge')}</p>
            <h2 style={{ color: '#fff', fontSize: 46, fontWeight: 800, letterSpacing: -1.2, lineHeight: 1.05, margin: 0 }}>{t(lang, 'proposal.step2.title')}</h2>
            <p style={{ color: '#A1A1AA', fontSize: 15, lineHeight: 1.55, margin: 0 }}>{t(lang, 'proposal.step2.subtitle')}</p>
            <div style={{ width: '100%', height: 300, borderRadius: 20, background: 'linear-gradient(135deg, #10B98110, #34D39908)', border: '1.5px solid #FBBF2440', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="map-pin" size={80} color="#FBBF2430" />
            </div>
          </div>
          <GlassCard style={{ width: 680, display: 'flex', flexDirection: 'column', gap: 18, padding: 40 }}>
            <h3 style={{ color: '#fff', fontSize: 20, fontWeight: 800, margin: 0 }}>{t(lang, 'proposal.step2.formTitle')}</h3>

            {/* Property Type */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <label style={{ color: '#71717A', fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase' }}>{t(lang, 'proposal.property.title')}</label>
              <div style={{ display: 'flex', gap: 10 }}>
                {PROPERTY_TYPES.map(pt => {
                  const sel = form.propertyType === pt.value;
                  return (
                    <button
                      key={pt.value}
                      onClick={() => update('propertyType', pt.value)}
                      style={{
                        flex: 1, height: 80, display: 'flex', flexDirection: 'column', gap: 6,
                        alignItems: 'center', justifyContent: 'center',
                        background: sel ? '#FBBF2418' : '#FFFFFF06',
                        borderRadius: 14, border: `1.5px solid ${sel ? '#FBBF24' : '#FFFFFF14'}`,
                        cursor: 'pointer', fontFamily: 'inherit', color: '#fff',
                      }}
                    >
                      <Icon name={pt.icon} size={24} color={sel ? '#FBBF24' : '#71717A'} />
                      <span style={{ fontSize: 12, fontWeight: sel ? 700 : 600, color: sel ? '#fff' : '#A1A1AA' }}>{t(lang, pt.labelKey)}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Roof Type */}
            <SelectField
              name="roofType" label={t(lang, 'proposal.roof.title')} value={form.roofType}
              options={ROOF_OPTIONS.map(o => ({ value: o.value, label: o.value ? t(lang, o.labelKey) : t(lang, o.labelKey) }))}
              error={errors.roofType} onChange={handleFieldChange}
            />

            {/* Bill Range */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <label style={{ color: '#71717A', fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase' }}>{t(lang, 'proposal.bill.title')}</label>
              <div style={{ display: 'flex', gap: 10 }}>
                {BILL_OPTIONS.map(b => {
                  const sel = form.billRange === b.value;
                  return (
                    <button
                      key={b.value}
                      onClick={() => update('billRange', b.value)}
                      style={{
                        flex: 1, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: sel ? '#FBBF24' : '#FFFFFF06',
                        borderRadius: 10, border: sel ? 'none' : '1px solid #FFFFFF14',
                        cursor: 'pointer', fontFamily: 'inherit',
                        color: sel ? '#0A0617' : '#A1A1AA', fontSize: 13, fontWeight: sel ? 800 : 600,
                      }}
                    >
                      {b.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <button onClick={() => { setStep('basic'); scrollToTop(); }} style={btnSecondary}>
                {t(lang, 'proposal.nav.back')}
              </button>
              <button
                onClick={() => { if (validateProperty()) { setStep('system'); scrollToTop(); } }}
                style={{ ...btnPrimary, flex: 1 }}
              >
                {t(lang, 'proposal.nav.continueSystem')}
                <Icon name="arrow-right" size={16} color="#0A0617" />
              </button>
            </div>
          </GlassCard>
        </div>
      )}

      {/* ========== STEP: SYSTEM SELECTION ========== */}
      {step === 'system' && (
        <div style={{ maxWidth: 1440, margin: '0 auto', padding: '40px 80px 80px' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
            <div style={{ display: 'flex', gap: 8, width: 520 }}>
              <div style={{ flex: 1, height: 4, borderRadius: 2, background: '#FBBF24' }} />
              <div style={{ flex: 1, height: 4, borderRadius: 2, background: '#FBBF24' }} />
              <div style={{ flex: 1, height: 4, borderRadius: 2, background: '#FBBF24' }} />
              <div style={{ flex: 1, height: 4, borderRadius: 2, background: '#FFFFFF14' }} />
            </div>
            <p style={{ color: '#FBBF24', fontSize: 11, fontWeight: 800, letterSpacing: 1.5, margin: 0 }}>{t(lang, 'proposal.step3.badge')}</p>
            <h2 style={{ color: '#fff', fontSize: 42, fontWeight: 800, letterSpacing: -1.2, margin: 0 }}>{t(lang, 'proposal.step3.title')}</h2>
            <p style={{ color: '#A1A1AA', fontSize: 14, margin: 0 }}>{t(lang, 'proposal.step3.subtitle')}</p>

            {/* Payment Type Toggle */}
            <div style={{
              display: 'flex', background: '#FFFFFF08', borderRadius: 12, border: '1px solid #FFFFFF14',
              padding: 4, gap: 4,
            }}>
              <button
                onClick={() => update('paymentType', 'subscription')}
                style={{
                  padding: '10px 24px', borderRadius: 10, border: 'none', cursor: 'pointer',
                  fontFamily: 'inherit', fontSize: 14, fontWeight: 700,
                  background: form.paymentType === 'subscription' ? '#FBBF24' : 'transparent',
                  color: form.paymentType === 'subscription' ? '#0A0617' : '#A1A1AA',
                  transition: 'all 0.2s ease',
                }}
              >
                {t(lang, 'proposal.payment.monthly')}
              </button>
              <button
                onClick={() => update('paymentType', 'purchase')}
                style={{
                  padding: '10px 24px', borderRadius: 10, border: 'none', cursor: 'pointer',
                  fontFamily: 'inherit', fontSize: 14, fontWeight: 700,
                  background: form.paymentType === 'purchase' ? '#10B981' : 'transparent',
                  color: form.paymentType === 'purchase' ? '#fff' : '#A1A1AA',
                  transition: 'all 0.2s ease',
                }}
              >
                {t(lang, 'proposal.payment.purchase')}
              </button>
            </div>
          </div>

          {/* 3 cards */}
          <div style={{ display: 'flex', gap: 20, maxWidth: 1280, margin: '0 auto' }}>
            {SYSTEMS.map((sys, i) => {
              const sel = form.system === sys.id;
              const isPopular = sys.popular && !sel;
              return (
                <GlassCard key={sys.id} style={{
                  flex: 1, display: 'flex', flexDirection: 'column', gap: 14, padding: 32,
                  justifyContent: 'center', minHeight: 520,
                  ...(isPopular ? { borderColor: '#FBBF2460', boxShadow: '0 8px 30px #FBBF2415' } : {}),
                  ...(sel ? { borderColor: '#FBBF24', background: '#FBBF2412' } : {}),
                }}>
                  {sys.popular && (
                    <div style={{ height: 24, padding: '0 10px', background: '#FBBF24', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 4, alignSelf: 'flex-start' }}>
                      <span style={{ color: '#0A0617', fontSize: 10, fontWeight: 800, letterSpacing: 1.2 }}>{t(lang, 'proposal.systems.popular')}</span>
                    </div>
                  )}
                  {!sys.popular && <p style={{ color: sys.tierColor || '#A1A1AA', fontSize: 11, fontWeight: 800, letterSpacing: 1.5, margin: 0 }}>{t(lang, sys.tier)}</p>}
                  <h3 style={{ color: sys.color === '#FBBF24' ? '#FBBF24' : '#fff', fontSize: sys.popular && sel ? 28 : 24, fontWeight: 800, margin: 0 }}>{t(lang, sys.title)}</h3>
                  {form.paymentType === 'purchase' ? (
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6 }}>
                      <span style={{ color: '#10B981', fontSize: sys.popular ? 42 : 36, fontWeight: 800, letterSpacing: -1.2 }}>${sys.purchasePrice}</span>
                      <span style={{ color: sys.popular ? '#A1A1AA' : '#71717A', fontSize: 14, marginBottom: 4 }}>{t(lang, 'proposal.payment.onetime')}</span>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6 }}>
                      <span style={{ color: sys.color === '#FBBF24' ? '#FBBF24' : '#fff', fontSize: sys.popular ? 42 : 36, fontWeight: 800, letterSpacing: -1.2 }}>${sys.price}</span>
                      <span style={{ color: sys.popular ? '#A1A1AA' : '#71717A', fontSize: 14, marginBottom: 4 }}>/month</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                    {sys.specs.map((spec, si) => (
                      <div key={si} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Icon name="check" size={14} color={sys.color !== '#FFFFFF' ? sys.color : '#34D399'} />
                        <span style={{ fontSize: 13, fontWeight: sys.popular && sel ? 600 : 500, color: sys.popular && sel ? '#fff' : '#D4D4D8' }}>{spec}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => { update('system', sys.id); setStep('generating'); scrollToTop(); }}
                    style={{
                      width: '100%', height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      borderRadius: 12, cursor: 'pointer', border: 'none', fontFamily: 'inherit',
                      ...(isPopular || sel ? { background: '#FBBF24', color: '#0A0617', fontWeight: 800 } : { background: '#FFFFFF12', color: '#fff', fontWeight: 700, border: '1px solid #FFFFFF24' }),
                      fontSize: 13,
                    }}
                  >
                    {sel ? `${t(lang, 'proposal.systems.selected')}` : `${t(lang, 'proposal.systems.select')} ${t(lang, sys.title)}`}
                  </button>
                </GlassCard>
              );
            })}
          </div>
        </div>
      )}

      {/* ========== STEP: GENERATING ========== */}
      {step === 'generating' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 160px)', gap: 20, padding: 40 }}>
          <div style={{ display: 'flex', gap: 8, width: 520 }}>
            <div style={{ flex: 1, height: 4, borderRadius: 2, background: '#FBBF24' }} />
            <div style={{ flex: 1, height: 4, borderRadius: 2, background: '#FBBF24' }} />
            <div style={{ flex: 1, height: 4, borderRadius: 2, background: '#FBBF24' }} />
            <div style={{ flex: 1, height: 4, borderRadius: 2, background: '#FBBF24' }} />
          </div>
          <p style={{ color: '#FBBF24', fontSize: 11, fontWeight: 800, letterSpacing: 1.5, margin: 0 }}>{t(lang, 'proposal.generating.badge')}</p>
          <div style={{ width: 140, height: 140, borderRadius: 70, background: 'linear-gradient(135deg, #FBBF24, #F59E0B)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 80px #FBBF2430' }}>
            <Icon name="sparkles" size={60} color="#0A0617" />
          </div>
          <h2 style={{ color: '#fff', fontSize: 48, fontWeight: 800, letterSpacing: -1.4, margin: 0, textAlign: 'center' }}>{t(lang, 'proposal.generating.title')}</h2>
          <p style={{ color: '#A1A1AA', fontSize: 15, maxWidth: 560, textAlign: 'center', lineHeight: 1.55, margin: 0 }}>{t(lang, 'proposal.generating.subtitle')}</p>

          {/* Progress items */}
          <div style={{ width: 520, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { label: t(lang, 'proposal.generating.progress1'), status: 'done' },
              { label: t(lang, 'proposal.generating.progress2'), status: 'done' },
              { label: t(lang, 'proposal.generating.progress3'), status: 'active' },
              { label: t(lang, 'proposal.generating.progress4'), status: 'pending' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, opacity: item.status === 'pending' ? 0.4 : 1 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: item.status === 'done' ? '#10B98120' : item.status === 'active' ? '#FBBF2425' : '#FFFFFF06',
                  border: `1px solid ${item.status === 'done' ? '#10B98180' : item.status === 'active' ? '#FBBF24' : '#FFFFFF18'}`,
                }}>
                  {item.status === 'done' ? <Icon name="check" size={14} color="#34D399" /> : item.status === 'active' ? <Icon name="loader-circle" size={14} color="#FBBF24" /> : null}
                </div>
                <span style={{ flex: 1, color: item.status === 'active' ? '#fff' : item.status === 'done' ? '#fff' : '#A1A1AA', fontSize: 14, fontWeight: item.status === 'active' ? 700 : 500 }}>
                  {item.label}
                </span>
                <span style={{ color: item.status === 'done' ? '#34D399' : item.status === 'active' ? '#FBBF24' : '#71717A', fontSize: 12, fontWeight: 700 }}>
                  {item.status === 'done' ? t(lang, 'proposal.generating.done') : item.status === 'active' ? t(lang, 'proposal.generating.inProgress') : t(lang, 'proposal.generating.pending')}
                </span>
              </div>
            ))}
          </div>

          {/* Auto-advance after 3 seconds */}
          <ProgressTimer onDone={() => { setStep('confirm'); scrollToTop(); }} />
        </div>
      )}

      {/* ========== STEP: CONFIRM ========== */}
      {step === 'confirm' && (
        <div style={{ maxWidth: 1440, margin: '0 auto', padding: '40px 80px 80px' }}>
          <div style={{ textAlign: 'center', marginBottom: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <p style={{ color: '#FBBF24', fontSize: 11, fontWeight: 800, letterSpacing: 1.5, margin: 0 }}>{t(lang, 'proposal.confirm.badge')}</p>
            <h2 style={{ color: '#fff', fontSize: 36, fontWeight: 800, letterSpacing: -1, margin: 0 }}>{t(lang, 'proposal.confirm.title')}</h2>
          </div>

          <div style={{ display: 'flex', gap: 24, maxWidth: 1280, margin: '0 auto' }}>
            {/* Summary */}
            <GlassCard style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 18, padding: 32 }}>
              <h3 style={{ color: '#fff', fontSize: 20, fontWeight: 800, margin: 0 }}>{t(lang, 'proposal.confirm.summary')}</h3>

              {/* System item */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', background: '#FFFFFF06', borderRadius: 14, border: '1px solid #FFFFFF14' }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: '#FBBF2420', border: '1px solid #FBBF2440', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="sun" size={24} color="#FBBF24" />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ color: '#fff', fontSize: 14, fontWeight: 700, margin: 0 }}>{t(lang, SYSTEMS.find(s => s.id === form.system)?.title || 'proposal.systems.pro.title')} · {SYSTEMS.find(s => s.id === form.system)?.specs?.[0] || '9.6 kW'}</p>
                  <p style={{ color: '#71717A', fontSize: 12, margin: '2px 0 0' }}>{t(lang, 'proposal.confirm.specs')}</p>
                </div>
                <span style={{ color: '#FBBF24', fontSize: 16, fontWeight: 800 }}>{isPurchase ? `$${systemPurchasePrice}` : `$${systemPrice}/mo`}</span>
              </div>

              {/* Address */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 18px', background: '#FFFFFF03', borderRadius: 14 }}>
                <Icon name="map-pin" size={18} color="#A1A1AA" />
                <div style={{ flex: 1 }}>
                  <p style={{ color: '#71717A', fontSize: 10, fontWeight: 700, letterSpacing: 1.2, margin: 0, textTransform: 'uppercase' }}>{t(lang, 'proposal.confirm.address')}</p>
                  <p style={{ color: '#fff', fontSize: 13, fontWeight: 600, margin: '2px 0 0' }}>{form.address}</p>
                </div>
              </div>

              {/* Name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 18px', background: '#FFFFFF03', borderRadius: 14 }}>
                <Icon name="calendar" size={18} color="#A1A1AA" />
                <div style={{ flex: 1 }}>
                  <p style={{ color: '#71717A', fontSize: 10, fontWeight: 700, letterSpacing: 1.2, margin: 0, textTransform: 'uppercase' }}>{t(lang, 'proposal.confirm.customer')}</p>
                  <p style={{ color: '#fff', fontSize: 13, fontWeight: 600, margin: '2px 0 0' }}>{form.name}</p>
                </div>
              </div>
            </GlassCard>

            {/* Total sidebar */}
            <GlassCard style={{ width: 380, display: 'flex', flexDirection: 'column', gap: 16, padding: 32, justifyContent: 'center' }}>
              <p style={{ color: '#FBBF24', fontSize: 11, fontWeight: 800, letterSpacing: 1.5, margin: 0, textTransform: 'uppercase' }}>{isPurchase ? t(lang, 'proposal.confirm.totalPurchase') : t(lang, 'proposal.confirm.totalLabel')}</p>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6 }}>
                <span style={{ color: isPurchase ? '#10B981' : '#FBBF24', fontSize: isPurchase ? 52 : 64, fontWeight: 800, letterSpacing: -2 }}>${isPurchase ? systemPurchasePrice : systemPrice}</span>
                {!isPurchase && <span style={{ color: '#A1A1AA', fontSize: 16, fontWeight: 600, marginBottom: 6 }}>/month</span>}
              </div>
              {!isPurchase && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', background: '#10B98120', borderRadius: 8, border: '1px solid #10B98140' }}>
                  <Icon name="trending-down" size={14} color="#34D399" />
                  <span style={{ color: '#34D399', fontSize: 12, fontWeight: 800 }}>{t(lang, 'proposal.confirm.savings')}</span>
                </div>
              )}
              {isPurchase && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', background: '#FBBF2420', borderRadius: 8, border: '1px solid #FBBF2440' }}>
                  <Icon name="shield-check" size={14} color="#FBBF24" />
                  <span style={{ color: '#FBBF24', fontSize: 12, fontWeight: 800 }}>{t(lang, 'proposal.confirm.owned')}</span>
                </div>
              )}
              <div style={{ width: '100%', height: 1, background: '#FFFFFF14' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#A1A1AA', fontSize: 12 }}>{isPurchase ? t(lang, 'proposal.confirm.systemCost') : t(lang, 'proposal.confirm.subscription')}</span>
                <span style={{ color: '#fff', fontSize: 12, fontWeight: 700 }}>${isPurchase ? systemPurchasePrice : systemPrice}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#A1A1AA', fontSize: 12 }}>{t(lang, 'proposal.confirm.setup')}</span>
                <span style={{ color: '#34D399', fontSize: 12, fontWeight: 800 }}>{t(lang, 'proposal.confirm.free')}</span>
              </div>
              <button
                onClick={() => setStep('landing')}
                style={{ ...btnPrimary, width: '100%', height: 60, marginTop: 8 }}
              >
                {t(lang, 'proposal.confirm.cta')}
                <Icon name="arrow-right" size={16} color="#0A0617" />
              </button>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <Icon name="shield-check" size={12} color="#34D399" />
                <span style={{ color: '#71717A', fontSize: 11, fontWeight: 500 }}>{t(lang, 'proposal.confirm.guarantee')}</span>
              </div>
            </GlassCard>
          </div>

          {/* Back to start */}
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <button onClick={() => { setForm(initialForm); setStep('landing'); }} style={btnSecondary}>
              {t(lang, 'proposal.nav.startOver')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ProgressTimer({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3500);
    return () => clearTimeout(t);
  }, [onDone]);
  return null;
}

function StatItem({ icon, color, label }: { icon: keyof typeof ITEMS; color: string; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <Icon name={icon} size={14} color={color} />
      <span style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>{label}</span>
    </div>
  );
}

function GlassCard({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #FFFFFF08 0%, #FFFFFF03 100%)',
      borderRadius: 24, border: '1px solid #FFFFFF14',
      backdropFilter: 'blur(30px)', WebkitBackdropFilter: 'blur(30px)',
      ...style,
    }}>
      {children}
    </div>
  );
}

const btnPrimary: React.CSSProperties = {
  height: 54, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
  background: 'linear-gradient(135deg, #FBBF24, #F59E0B)', borderRadius: 12,
  border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 14, fontWeight: 800,
  color: '#0A0617', boxShadow: '0 6px 24px #FBBF2440',
};

const btnSecondary: React.CSSProperties = {
  height: 54, width: 120, display: 'flex', alignItems: 'center', justifyContent: 'center',
  background: '#FFFFFF08', borderRadius: 12, border: '1px solid #FFFFFF18',
  cursor: 'pointer', fontFamily: 'inherit', fontSize: 14, fontWeight: 700, color: '#fff',
};
