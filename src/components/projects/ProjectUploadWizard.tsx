'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { t } from '@/i18n/translations';
import { Ic } from '@/components/dashboard/shared';
import { UserMenu } from '@/components/dashboard/UserMenu';
import './project-upload.css';

/* ============================ TYPES ============================ */

type ProjectPath = 'new' | 'licensed';
type ProjectType = 'solar' | 'hydroelectric' | 'wind' | 'hybrid';
type CustomerCategory = 'residential' | 'commercial' | 'industrial';
type FinancingModel = 'cash' | 'lease' | 'ppa';
type PaymentMethod = 'card' | 'bank' | 'crypto';

interface DocStatus { id: string; required: boolean; uploaded?: boolean; }

export interface ProjectUploadState {
  path?: ProjectPath;
  type?: ProjectType;
  referenceId?: string;
  customerId?: string;
  customerCategory?: CustomerCategory;
  description?: string;

  capacityKw?: number;
  address?: string;
  city?: string;
  startsAt?: string;
  endsAt?: string;

  panelMake?: string;
  panelModel?: string;
  panelCount?: number;
  inverterMake?: string;
  inverterModel?: string;
  hasBattery?: boolean;
  batteryKwh?: number;
  expectedAnnualKwh?: number;

  totalCostUsd?: number;
  financingModel?: FinancingModel;
  fundingAskUsd?: number;

  docs?: Record<string, DocStatus>;
  sitePhotos?: number;

  paymentMethod?: PaymentMethod;
  paymentEmail?: string;
  paymentName?: string;
  paymentCardLast4?: string;
  paymentCompleted?: boolean;

  acceptedTerms?: boolean;
}

interface Props { lang: string }

/* ============================ STEP CONFIG ============================ */

const STEPS = [
  { id: 'basics',   labelKey: 'proj.step.basics' },
  { id: 'capacity', labelKey: 'proj.step.capacity' },
  { id: 'specs',    labelKey: 'proj.step.specs' },
  { id: 'docs',     labelKey: 'proj.step.docs' },
  { id: 'service',  labelKey: 'proj.step.service' },
  { id: 'review',   labelKey: 'proj.step.review' },
] as const;

type StepId = typeof STEPS[number]['id'];

const TYPES: { id: ProjectType; titleKey: string; subKey: string; icon: 'sun' | 'zap' | 'trending-up' | 'briefcase' }[] = [
  { id: 'solar',         titleKey: 'proj.type.solar',         subKey: 'proj.type.solar.sub',         icon: 'sun' },
  { id: 'hydroelectric', titleKey: 'proj.type.hydroelectric', subKey: 'proj.type.hydroelectric.sub', icon: 'zap' },
  { id: 'wind',          titleKey: 'proj.type.wind',          subKey: 'proj.type.wind.sub',          icon: 'trending-up' },
  { id: 'hybrid',        titleKey: 'proj.type.hybrid',        subKey: 'proj.type.hybrid.sub',        icon: 'briefcase' },
];

const DOCS_NEW = [
  { id: 'sld',         required: true,  titleKey: 'proj.doc.sld',         subKey: 'proj.doc.sld.sub' },
  { id: 'nabcep',      required: true,  titleKey: 'proj.doc.nabcep',      subKey: 'proj.doc.nabcep.sub' },
  { id: 'customerLoi', required: true,  titleKey: 'proj.doc.customerLoi', subKey: 'proj.doc.customerLoi.sub' },
  { id: 'eng',         required: true,  titleKey: 'proj.doc.eng',         subKey: 'proj.doc.eng.sub' },
  { id: 'insurance',   required: false, titleKey: 'proj.doc.insurance',   subKey: 'proj.doc.insurance.sub' },
] as const;
const DOCS_LICENSED = [
  { id: 'sld',          required: true, titleKey: 'proj.doc.sld',          subKey: 'proj.doc.sld.sub' },
  { id: 'nabcep',       required: true, titleKey: 'proj.doc.nabcep',       subKey: 'proj.doc.nabcep.sub' },
  { id: 'permit',       required: true, titleKey: 'proj.doc.permit',       subKey: 'proj.doc.permit.sub' },
  { id: 'interconnect', required: true, titleKey: 'proj.doc.interconnect', subKey: 'proj.doc.interconnect.sub' },
  { id: 'insurance',    required: true, titleKey: 'proj.doc.insurance',    subKey: 'proj.doc.insurance.sub' },
] as const;

const PRESET_AMOUNTS = [10_000, 25_000, 50_000, 100_000];
const STORAGE_KEY = 'ancestro_project_upload';
const SERVICE_FEE_USD = 2_500;

/* ============================ WIZARD ============================ */

export default function ProjectUploadWizard({ lang }: Props) {
  const router = useRouter();
  const [step, setStep] = useState<StepId>('basics');
  const [data, setData] = useState<ProjectUploadState>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
      if (raw) {
        const p = JSON.parse(raw);
        if (p?.data) setData(p.data);
        if (p?.step) setStep(p.step);
      }
    } catch {}
  }, []);
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ step, data })); } catch {}
  }, [step, data]);

  const update = (patch: Partial<ProjectUploadState>) => setData(d => ({ ...d, ...patch }));
  const toggleDoc = (id: string, required: boolean) => {
    const cur = data.docs || {};
    update({ docs: { ...cur, [id]: { id, required, uploaded: !cur[id]?.uploaded } } });
  };

  const activeDocs = data.path === 'licensed' ? DOCS_LICENSED : DOCS_NEW;
  const requiredDocsUploaded = activeDocs.filter(d => d.required).every(d => data.docs?.[d.id]?.uploaded);

  const canProceed: Record<StepId, boolean> = {
    basics:   !!data.path && !!data.type && !!data.referenceId,
    capacity: typeof data.capacityKw === 'number' && data.capacityKw > 0 && !!data.address,
    specs:    !!data.panelMake && !!data.panelModel && typeof data.panelCount === 'number' && (data.panelCount ?? 0) > 0
              && typeof data.totalCostUsd === 'number' && (data.totalCostUsd ?? 0) > 0
              && !!data.financingModel,
    docs:     requiredDocsUploaded,
    service:  data.paymentCompleted === true,
    review:   !!data.acceptedTerms,
  };

  const stepIndex = STEPS.findIndex(s => s.id === step);

  const next = async () => {
    if (stepIndex < STEPS.length - 1) {
      setStep(STEPS[stepIndex + 1].id);
      return;
    }
    setSubmitting(true);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      }).catch(() => {});
      localStorage.removeItem(STORAGE_KEY);
      router.push(`/${lang}/dashboard`);
    } finally {
      setSubmitting(false);
    }
  };
  const back = () => {
    if (stepIndex === 0) router.push(`/${lang}/dashboard`);
    else setStep(STEPS[stepIndex - 1].id);
  };

  return (
    <div className="proj-shell">
      <header className="proj-header">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#A1A1A6', fontSize: 12 }}>
            <button type="button" onClick={() => router.push(`/${lang}/dashboard`)} style={{ background: 'transparent', border: 'none', color: '#A1A1A6', cursor: 'pointer', padding: 0, fontFamily: 'inherit', fontSize: 12 }}>
              {t(lang, 'proj.breadcrumb.projects')}
            </button>
            <Ic n="chevron-right" s={12} c="#6B6B71" />
            <span style={{ color: '#F59E0B', fontWeight: 600 }}>
              {t(lang, 'proj.breadcrumb.new')}
            </span>
          </div>
          <h1 style={{ color: '#EDEDEE', fontSize: 28, fontWeight: 600, margin: 0, letterSpacing: -0.2 }}>
            {t(lang, 'proj.title')}
          </h1>
          <span style={{ color: '#A1A1A6', fontSize: 13 }}>{t(lang, 'proj.subtitle')}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button type="button" className="proj-ghost-btn">
            <Ic n="download" s={12} /> {t(lang, 'proj.saveDraft')}
          </button>
          <UserMenu lang={lang} />
        </div>
      </header>

      <div className="proj-stepper">
        {STEPS.map((s, i) => {
          const state = i < stepIndex ? 'completed' : i === stepIndex ? 'active' : 'pending';
          return (
            <button key={s.id} type="button"
              className={`proj-step ${state}`}
              onClick={() => i <= stepIndex && setStep(s.id)}
              disabled={i > stepIndex}>
              <span className="proj-step-num">
                {state === 'completed' ? <Ic n="check" s={12} c="#0A0617" /> : i + 1}
              </span>
              <span>{t(lang, s.labelKey)}</span>
            </button>
          );
        })}
      </div>

      <div className="proj-body">
        {step === 'basics'   && <StepBasics   lang={lang} data={data} update={update} />}
        {step === 'capacity' && <StepCapacity lang={lang} data={data} update={update} />}
        {step === 'specs'    && <StepSpecsFinance lang={lang} data={data} update={update} />}
        {step === 'docs'     && <StepDocs lang={lang} data={data} update={update} toggleDoc={toggleDoc} docs={activeDocs} />}
        {step === 'service'  && <StepService lang={lang} data={data} update={update} />}
        {step === 'review'   && <StepReview lang={lang} data={data} update={update} />}
      </div>

      <footer className="proj-footer">
        <button type="button" className="proj-ghost-btn" onClick={back}>
          ← {t(lang, 'onb.back')}
        </button>
        <button type="button"
          className={`proj-primary-btn${step === 'review' ? ' proj-success-btn' : ''}`}
          onClick={next}
          disabled={!canProceed[step] || submitting}>
          {step === 'review'
            ? (submitting ? t(lang, 'onb.submitting') : <>{t(lang, 'proj.submitForReview')} <Ic n="check" s={14} /></>)
            : <>{t(lang, 'onb.continueTo')} {t(lang, STEPS[stepIndex + 1].labelKey).toLowerCase()} <Ic n="arrow-right" s={14} /></>}
        </button>
      </footer>
    </div>
  );
}

/* ============================ STEP 1 — BASICS (+ path) ============================ */

function StepBasics({ lang, data, update }: { lang: string; data: ProjectUploadState; update: (p: Partial<ProjectUploadState>) => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Section title={t(lang, 'proj.path.title')}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <PathCard
            active={data.path === 'new'}
            onClick={() => update({ path: 'new' })}
            badge={t(lang, 'proj.path.new.badge')}
            badgeTone="#A78BFA"
            title={t(lang, 'proj.path.new')}
            sub={t(lang, 'proj.path.new.sub')}
            bullets={[t(lang, 'proj.path.new.b1'), t(lang, 'proj.path.new.b2'), t(lang, 'proj.path.new.b3')]}
          />
          <PathCard
            active={data.path === 'licensed'}
            onClick={() => update({ path: 'licensed' })}
            badge={t(lang, 'proj.path.licensed.badge')}
            badgeTone="#2BB673"
            title={t(lang, 'proj.path.licensed')}
            sub={t(lang, 'proj.path.licensed.sub')}
            bullets={[t(lang, 'proj.path.licensed.b1'), t(lang, 'proj.path.licensed.b2'), t(lang, 'proj.path.licensed.b3')]}
          />
        </div>
      </Section>

      <Section title={t(lang, 'proj.type.title')}>
        <div className="proj-type-grid">
          {TYPES.map(tp => {
            const active = data.type === tp.id;
            return (
              <button key={tp.id} type="button"
                className={`proj-type-card ${active ? 'is-active' : ''}`}
                onClick={() => update({ type: tp.id })}>
                <div className="proj-type-icon">
                  <Ic n={tp.icon} s={22} c={active ? '#F59E0B' : '#A1A1A6'} />
                </div>
                <span style={{ color: '#EDEDEE', fontSize: 13, fontWeight: 600 }}>{t(lang, tp.titleKey)}</span>
                <span style={{ color: '#A1A1A6', fontSize: 11, textAlign: 'center' }}>{t(lang, tp.subKey)}</span>
              </button>
            );
          })}
        </div>
      </Section>

      <Section title={t(lang, 'proj.basics.title')}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <Field label={t(lang, 'proj.basics.reference')}>
            <input type="text" className="proj-input" placeholder="ANC-2026-0421"
              value={data.referenceId || ''} onChange={(e) => update({ referenceId: e.target.value })} />
          </Field>
          <Field label={t(lang, 'proj.basics.customer')}>
            <input type="text" className="proj-input" placeholder={t(lang, 'proj.basics.customerPh')}
              value={data.customerId || ''} onChange={(e) => update({ customerId: e.target.value })} />
          </Field>
          <Field label={t(lang, 'proj.basics.category')}>
            <select className="proj-input"
              value={data.customerCategory || ''}
              onChange={(e) => update({ customerCategory: e.target.value as CustomerCategory })}>
              <option value="">{t(lang, 'proj.basics.categoryPh')}</option>
              <option value="residential">{t(lang, 'proj.basics.residential')}</option>
              <option value="commercial">{t(lang, 'proj.basics.commercial')}</option>
              <option value="industrial">{t(lang, 'proj.basics.industrial')}</option>
            </select>
          </Field>
          <div />
        </div>
        <Field label={t(lang, 'proj.basics.description')}>
          <textarea className="proj-input" rows={4} placeholder={t(lang, 'proj.basics.descriptionPh')}
            value={data.description || ''} onChange={(e) => update({ description: e.target.value })}
            style={{ height: 'auto', padding: 12, resize: 'vertical' }} />
        </Field>
      </Section>
    </div>
  );
}

/* ============================ STEP 2 — CAPACITY ============================ */

function StepCapacity({ lang, data, update }: { lang: string; data: ProjectUploadState; update: (p: Partial<ProjectUploadState>) => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Section title={t(lang, 'proj.capacity.title')}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <Field label={t(lang, 'proj.capacity.kw')}>
            <input type="number" className="proj-input" placeholder="9.6" step={0.1}
              value={data.capacityKw ?? ''}
              onChange={(e) => update({ capacityKw: e.target.value ? Number(e.target.value) : undefined })} />
          </Field>
          <Field label={t(lang, 'proj.capacity.city')}>
            <input type="text" className="proj-input" placeholder={t(lang, 'proj.capacity.cityPh')}
              value={data.city || ''} onChange={(e) => update({ city: e.target.value })} />
          </Field>
        </div>
        <Field label={t(lang, 'proj.capacity.address')}>
          <input type="text" className="proj-input" placeholder={t(lang, 'proj.capacity.addressPh')}
            value={data.address || ''} onChange={(e) => update({ address: e.target.value })} />
        </Field>
      </Section>
      <Section title={t(lang, 'proj.timeline.title')}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <Field label={t(lang, 'proj.timeline.startsAt')}>
            <input type="date" className="proj-input"
              value={data.startsAt || ''} onChange={(e) => update({ startsAt: e.target.value })} />
          </Field>
          <Field label={t(lang, 'proj.timeline.endsAt')}>
            <input type="date" className="proj-input"
              value={data.endsAt || ''} onChange={(e) => update({ endsAt: e.target.value })} />
          </Field>
        </div>
      </Section>
    </div>
  );
}

/* ============================ STEP 3 — SPECS & FINANCE ============================ */

function StepSpecsFinance({ lang, data, update }: { lang: string; data: ProjectUploadState; update: (p: Partial<ProjectUploadState>) => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Section title={t(lang, 'proj.specs.title')}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 80px', gap: 10 }}>
          <Field label={t(lang, 'proj.specs.panelMake')}>
            <input type="text" className="proj-input" placeholder="Jinko, LONGi, Q Cells…"
              value={data.panelMake || ''} onChange={(e) => update({ panelMake: e.target.value })} />
          </Field>
          <Field label={t(lang, 'proj.specs.panelModel')}>
            <input type="text" className="proj-input" placeholder="Tiger Neo 580 W"
              value={data.panelModel || ''} onChange={(e) => update({ panelModel: e.target.value })} />
          </Field>
          <Field label={t(lang, 'proj.specs.panelCount')}>
            <input type="number" className="proj-input" placeholder="24"
              value={data.panelCount ?? ''}
              onChange={(e) => update({ panelCount: e.target.value ? Number(e.target.value) : undefined })} />
          </Field>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <Field label={t(lang, 'proj.specs.inverterMake')}>
            <input type="text" className="proj-input" placeholder="Enphase, SolarEdge, Fronius…"
              value={data.inverterMake || ''} onChange={(e) => update({ inverterMake: e.target.value })} />
          </Field>
          <Field label={t(lang, 'proj.specs.inverterModel')}>
            <input type="text" className="proj-input" placeholder="IQ8H-208"
              value={data.inverterModel || ''} onChange={(e) => update({ inverterModel: e.target.value })} />
          </Field>
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', color: '#EDEDEE', fontSize: 13 }}>
          <input type="checkbox" checked={!!data.hasBattery}
            onChange={(e) => update({ hasBattery: e.target.checked })}
            style={{ accentColor: '#F59E0B', width: 16, height: 16 }} />
          {t(lang, 'proj.specs.includesBattery')}
        </label>
        {data.hasBattery && (
          <Field label={t(lang, 'proj.specs.batteryKwh')}>
            <input type="number" className="proj-input" placeholder="13.5" step={0.1}
              value={data.batteryKwh ?? ''}
              onChange={(e) => update({ batteryKwh: e.target.value ? Number(e.target.value) : undefined })} />
          </Field>
        )}
        <Field label={t(lang, 'proj.specs.expectedKwh')}>
          <input type="number" className="proj-input" placeholder="14500"
            value={data.expectedAnnualKwh ?? ''}
            onChange={(e) => update({ expectedAnnualKwh: e.target.value ? Number(e.target.value) : undefined })} />
        </Field>
      </Section>

      <Section title={t(lang, 'proj.finance.title')}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <Field label={t(lang, 'proj.finance.totalCost')}>
            <input type="number" className="proj-input" placeholder="24500"
              value={data.totalCostUsd ?? ''}
              onChange={(e) => update({ totalCostUsd: e.target.value ? Number(e.target.value) : undefined })} />
          </Field>
          <Field label={t(lang, 'proj.finance.model')}>
            <select className="proj-input"
              value={data.financingModel || ''}
              onChange={(e) => update({ financingModel: e.target.value as FinancingModel })}>
              <option value="">{t(lang, 'proj.finance.modelPh')}</option>
              <option value="cash">{t(lang, 'proj.finance.modelCash')}</option>
              <option value="lease">{t(lang, 'proj.finance.modelLease')}</option>
              <option value="ppa">{t(lang, 'proj.finance.modelPpa')}</option>
            </select>
          </Field>
        </div>
        <Field label={t(lang, 'proj.finance.fundingAsk')}>
          <input type="number" className="proj-input" placeholder="50000"
            value={data.fundingAskUsd ?? ''}
            onChange={(e) => update({ fundingAskUsd: e.target.value ? Number(e.target.value) : undefined })} />
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
            {PRESET_AMOUNTS.map(amt => (
              <button key={amt} type="button" className="proj-ghost-btn"
                onClick={() => update({ fundingAskUsd: amt })}
                style={{
                  height: 26, padding: '0 10px', fontSize: 11,
                  borderColor: data.fundingAskUsd === amt ? '#F59E0B' : '#1F1F23',
                  color: data.fundingAskUsd === amt ? '#F59E0B' : '#A1A1A6',
                  background: data.fundingAskUsd === amt ? '#F59E0B14' : 'transparent',
                }}>
                ${amt.toLocaleString('en-US')}
              </button>
            ))}
          </div>
          <span style={{ color: '#6B6B71', fontSize: 11, marginTop: 4, display: 'block' }}>
            {t(lang, 'proj.finance.fundingHint')}
          </span>
        </Field>
      </Section>
    </div>
  );
}

/* ============================ STEP 4 — DOCUMENTS ============================ */

function StepDocs({
  lang, data, update, toggleDoc, docs,
}: {
  lang: string;
  data: ProjectUploadState;
  update: (p: Partial<ProjectUploadState>) => void;
  toggleDoc: (id: string, required: boolean) => void;
  docs: ReadonlyArray<{ id: string; required: boolean; titleKey: string; subKey: string }>;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="onb-callout" style={{ alignSelf: 'flex-start' }}>
        <Ic n="shield-check" s={14} c="#2BB673" />
        {data.path === 'licensed' ? t(lang, 'proj.docs.calloutLicensed') : t(lang, 'proj.docs.calloutNew')}
      </div>

      <Section title={t(lang, 'proj.docs.requiredTitle')}>
        {docs.map((doc) => {
          const up = data.docs?.[doc.id]?.uploaded === true;
          return (
            <div key={doc.id} className={`proj-doc-row ${up ? 'is-uploaded' : ''}`}>
              <div className="proj-doc-icon">
                <Ic n={up ? 'check' : 'file-text'} s={16} c={up ? '#2BB673' : '#A1A1A6'} />
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: '#EDEDEE', fontSize: 13, fontWeight: 600 }}>{t(lang, doc.titleKey)}</span>
                  {doc.required && <span style={{ color: '#E5484D', fontSize: 10, fontWeight: 700, letterSpacing: 0.4 }}>{t(lang, 'proj.docs.required').toUpperCase()}</span>}
                </div>
                <span style={{ color: '#A1A1A6', fontSize: 11 }}>{t(lang, doc.subKey)}</span>
              </div>
              <button type="button" className="proj-ghost-btn" onClick={() => toggleDoc(doc.id, doc.required)} style={{ height: 30, padding: '0 12px', fontSize: 11 }}>
                {up ? <><Ic n="check" s={12} c="#2BB673" /> {t(lang, 'proj.docs.uploaded')}</> : t(lang, 'proj.docs.upload')}
              </button>
            </div>
          );
        })}
      </Section>

      <Section title={t(lang, 'proj.docs.sitePhotosTitle')}>
        <div className="proj-photos-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <button key={i} type="button" className="proj-photo-slot"
              onClick={() => update({ sitePhotos: Math.max((data.sitePhotos || 0), i + 1) })}>
              {(data.sitePhotos || 0) > i ? (
                <>
                  <Ic n="check" s={14} c="#2BB673" />
                  <span style={{ color: '#2BB673', fontSize: 10, fontWeight: 600 }}>{t(lang, 'proj.docs.photoUploaded')}</span>
                </>
              ) : (
                <>
                  <Ic n="plus" s={14} c="#6B6B71" />
                  <span style={{ color: '#6B6B71', fontSize: 10 }}>{t(lang, 'proj.docs.addPhoto')}</span>
                </>
              )}
            </button>
          ))}
        </div>
      </Section>
    </div>
  );
}

/* ============================ STEP 5 — SERVICE & PAYMENT ============================ */

function StepService({ lang, data, update }: { lang: string; data: ProjectUploadState; update: (p: Partial<ProjectUploadState>) => void }) {
  const [processing, setProcessing] = useState(false);

  const breakdown = [
    { label: t(lang, 'proj.service.line.engineering'), amount: 700 },
    { label: t(lang, 'proj.service.line.supervision'), amount: 600 },
    { label: t(lang, 'proj.service.line.listing'),     amount: 400 },
    { label: t(lang, 'proj.service.line.emailBlast'),  amount: 400 },
    { label: t(lang, 'proj.service.line.pitch'),       amount: 400 },
  ];

  const payNow = () => {
    if (!data.paymentMethod) return;
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      update({ paymentCompleted: true });
    }, 700);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Hero pitch */}
      <div style={{
        position: 'relative', padding: 24,
        background: '#101013', border: '1px solid #1F1F23', borderRadius: 8, overflow: 'hidden',
      }}>
        <span aria-hidden style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: '#F59E0B' }} />
        <span style={{ color: '#F59E0B', fontSize: 11, fontWeight: 600, letterSpacing: 0.6, textTransform: 'uppercase' }}>
          {t(lang, 'proj.service.kicker')}
        </span>
        <h2 style={{ color: '#EDEDEE', fontSize: 24, fontWeight: 600, letterSpacing: -0.2, margin: '6px 0 8px' }}>
          {t(lang, 'proj.service.title')}
        </h2>
        <p style={{ color: '#A1A1A6', fontSize: 14, lineHeight: 1.55, margin: 0, maxWidth: 720 }}>
          {t(lang, 'proj.service.subtitle')}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 16 }}>
          {[
            { v: '$84M', l: t(lang, 'proj.service.stat.deployed') },
            { v: '412',  l: t(lang, 'proj.service.stat.projects') },
            { v: '94%',  l: t(lang, 'proj.service.stat.renew') },
          ].map((s, i) => (
            <div key={i} style={{
              padding: 12, background: '#0A0A0B', border: '1px solid #1F1F23', borderRadius: 6,
              display: 'flex', flexDirection: 'column', gap: 2,
            }}>
              <span style={{ color: '#EDEDEE', fontSize: 20, fontWeight: 600, letterSpacing: -0.2, fontVariantNumeric: 'tabular-nums' }}>{s.v}</span>
              <span style={{ color: '#A1A1A6', fontSize: 11 }}>{s.l}</span>
            </div>
          ))}
        </div>
      </div>

      <Section title={t(lang, 'proj.service.included')}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {[
            { ic: 'shield-check' as const, t: t(lang, 'proj.service.inc1.t'), s: t(lang, 'proj.service.inc1.s') },
            { ic: 'hardhat'      as const, t: t(lang, 'proj.service.inc2.t'), s: t(lang, 'proj.service.inc2.s') },
            { ic: 'bar-chart'    as const, t: t(lang, 'proj.service.inc3.t'), s: t(lang, 'proj.service.inc3.s') },
            { ic: 'bell'         as const, t: t(lang, 'proj.service.inc4.t'), s: t(lang, 'proj.service.inc4.s'), highlight: true },
            { ic: 'briefcase'    as const, t: t(lang, 'proj.service.inc5.t'), s: t(lang, 'proj.service.inc5.s') },
            { ic: 'chart-line'   as const, t: t(lang, 'proj.service.inc6.t'), s: t(lang, 'proj.service.inc6.s') },
          ].map((c, i) => (
            <div key={i} style={{
              position: 'relative', display: 'flex', gap: 12, padding: 14,
              background: '#0A0A0B',
              border: `1px solid ${c.highlight ? '#F59E0B66' : '#1F1F23'}`,
              borderRadius: 8, overflow: 'hidden',
            }}>
              {c.highlight && (
                <span aria-hidden style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: '#F59E0B' }} />
              )}
              <div style={{ width: 32, height: 32, borderRadius: 6, background: '#F59E0B14', border: '1px solid #F59E0B33', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Ic n={c.ic} s={16} c="#F59E0B" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                  <span style={{ color: '#EDEDEE', fontSize: 13, fontWeight: 600 }}>{c.t}</span>
                  {c.highlight && (
                    <span style={{
                      padding: '1px 6px', borderRadius: 4,
                      background: '#F59E0B', color: '#0A0617',
                      fontSize: 9, fontWeight: 700, letterSpacing: 0.4,
                    }}>{t(lang, 'proj.service.outboundBadge')}</span>
                  )}
                </div>
                <span style={{ color: '#A1A1A6', fontSize: 12, lineHeight: 1.45 }}>{c.s}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title={t(lang, 'proj.service.compare')}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1, background: '#1F1F23', borderRadius: 8, overflow: 'hidden' }}>
          <CompareCell head>{t(lang, 'proj.service.cmp.metric')}</CompareCell>
          <CompareCell head>{t(lang, 'proj.service.cmp.without')}</CompareCell>
          <CompareCell head highlight>{t(lang, 'proj.service.cmp.with')}</CompareCell>

          <CompareCell>{t(lang, 'proj.service.cmp.time')}</CompareCell>
          <CompareCell muted>6 {t(lang, 'proj.service.cmp.weeks')}</CompareCell>
          <CompareCell highlight>11 {t(lang, 'proj.service.cmp.days')}</CompareCell>

          <CompareCell>{t(lang, 'proj.service.cmp.winRate')}</CompareCell>
          <CompareCell muted>8%</CompareCell>
          <CompareCell highlight>34%</CompareCell>

          <CompareCell>{t(lang, 'proj.service.cmp.capital')}</CompareCell>
          <CompareCell muted>{t(lang, 'proj.service.cmp.no')}</CompareCell>
          <CompareCell highlight>{t(lang, 'proj.service.cmp.yes')}</CompareCell>

          <CompareCell>{t(lang, 'proj.service.cmp.listing')}</CompareCell>
          <CompareCell muted>{t(lang, 'proj.service.cmp.no')}</CompareCell>
          <CompareCell highlight>{t(lang, 'proj.service.cmp.yes')}</CompareCell>

          <CompareCell>{t(lang, 'proj.service.cmp.outbound')}</CompareCell>
          <CompareCell muted>{t(lang, 'proj.service.cmp.outboundNo')}</CompareCell>
          <CompareCell highlight>{t(lang, 'proj.service.cmp.outboundYes')}</CompareCell>

          <CompareCell>{t(lang, 'proj.service.cmp.support')}</CompareCell>
          <CompareCell muted>{t(lang, 'proj.service.cmp.alone')}</CompareCell>
          <CompareCell highlight>{t(lang, 'proj.service.cmp.team')}</CompareCell>
        </div>
      </Section>

      <Section title={t(lang, 'proj.service.payment')}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {/* Breakdown */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ color: '#A1A1A6', fontSize: 11, fontWeight: 600, letterSpacing: 0.6, textTransform: 'uppercase' }}>
              {t(lang, 'proj.service.breakdown')}
            </span>
            {breakdown.map((b, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #16161A' }}>
                <span style={{ color: '#EDEDEE', fontSize: 12 }}>{b.label}</span>
                <span style={{ color: '#A1A1A6', fontSize: 12, fontVariantNumeric: 'tabular-nums' }}>${b.amount.toLocaleString('en-US')}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: 10, borderTop: '1px solid #1F1F23' }}>
              <span style={{ color: '#A1A1A6', fontSize: 11, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase' }}>
                {t(lang, 'proj.service.total')}
              </span>
              <span style={{ color: '#F59E0B', fontSize: 22, fontWeight: 600, letterSpacing: -0.2, fontVariantNumeric: 'tabular-nums' }}>
                ${SERVICE_FEE_USD.toLocaleString('en-US')}
              </span>
            </div>
            <div style={{
              marginTop: 8, padding: 10, borderRadius: 6,
              background: '#2BB67310', border: '1px solid #2BB67333',
              display: 'flex', alignItems: 'flex-start', gap: 8,
            }}>
              <Ic n="shield-check" s={14} c="#2BB673" />
              <span style={{ color: '#2BB673', fontSize: 11, lineHeight: 1.45 }}>
                <b>{t(lang, 'proj.service.refundTitle')}</b> {t(lang, 'proj.service.refundSub')}
              </span>
            </div>
          </div>

          {/* Payment form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span style={{ color: '#A1A1A6', fontSize: 11, fontWeight: 600, letterSpacing: 0.6, textTransform: 'uppercase' }}>
              {t(lang, 'proj.service.method')}
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
              {(['card', 'bank', 'crypto'] as PaymentMethod[]).map(m => {
                const active = data.paymentMethod === m;
                const label = m === 'card' ? t(lang, 'proj.service.card') : m === 'bank' ? t(lang, 'proj.service.bank') : t(lang, 'proj.service.crypto');
                const icon = m === 'card' ? 'credit-card' : m === 'bank' ? 'briefcase' : 'zap';
                return (
                  <button key={m} type="button" className="proj-ghost-btn"
                    onClick={() => update({ paymentMethod: m, paymentCompleted: false })}
                    style={{
                      height: 36, padding: '0 8px', flexDirection: 'column', gap: 2, fontSize: 11,
                      borderColor: active ? '#F59E0B' : '#1F1F23',
                      background: active ? '#F59E0B14' : 'transparent',
                      color: active ? '#F59E0B' : '#A1A1A6',
                    }}>
                    <Ic n={icon as 'credit-card' | 'briefcase' | 'zap'} s={14} /> {label}
                  </button>
                );
              })}
            </div>

            {data.paymentMethod === 'card' && (
              <>
                <input type="text" className="proj-input" placeholder={t(lang, 'proj.service.cardName')}
                  value={data.paymentName || ''} onChange={(e) => update({ paymentName: e.target.value })} />
                <input type="text" className="proj-input" placeholder="4242 4242 4242 4242"
                  inputMode="numeric" maxLength={19}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, '');
                    if (digits.length >= 4) update({ paymentCardLast4: digits.slice(-4) });
                  }} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                  <input type="text" className="proj-input" placeholder="MM / YY" />
                  <input type="text" className="proj-input" placeholder="CVC" maxLength={4} />
                </div>
              </>
            )}
            {data.paymentMethod === 'bank' && (
              <div style={{ padding: 12, background: '#0A0A0B', border: '1px solid #1F1F23', borderRadius: 8, color: '#A1A1A6', fontSize: 12, lineHeight: 1.55 }}>
                {t(lang, 'proj.service.bankNote')}
                <input type="email" className="proj-input" placeholder={t(lang, 'proj.service.bankEmail')}
                  value={data.paymentEmail || ''} onChange={(e) => update({ paymentEmail: e.target.value })}
                  style={{ marginTop: 8 }} />
              </div>
            )}
            {data.paymentMethod === 'crypto' && (
              <div style={{ padding: 12, background: '#0A0A0B', border: '1px solid #1F1F23', borderRadius: 8, color: '#A1A1A6', fontSize: 12, lineHeight: 1.55 }}>
                {t(lang, 'proj.service.cryptoNote')}
              </div>
            )}

            <button type="button" className="proj-primary-btn"
              disabled={!data.paymentMethod || data.paymentCompleted || processing}
              onClick={payNow}
              style={{ marginTop: 4, justifyContent: 'center', height: 44 }}>
              {data.paymentCompleted
                ? <><Ic n="check" s={14} /> {t(lang, 'proj.service.paid')}</>
                : processing
                  ? t(lang, 'proj.service.processing')
                  : <>{t(lang, 'proj.service.payButton')} · ${SERVICE_FEE_USD.toLocaleString('en-US')} <Ic n="arrow-right" s={14} /></>}
            </button>
            <span style={{ color: '#6B6B71', fontSize: 10, textAlign: 'center' }}>
              {t(lang, 'proj.service.secured')}
            </span>
          </div>
        </div>
      </Section>
    </div>
  );
}

/* ============================ STEP 6 — REVIEW ============================ */

function StepReview({ lang, data, update }: { lang: string; data: ProjectUploadState; update: (p: Partial<ProjectUploadState>) => void }) {
  const activeDocs = data.path === 'licensed' ? DOCS_LICENSED : DOCS_NEW;
  const uploadedCount = activeDocs.filter(d => data.docs?.[d.id]?.uploaded).length;
  const summary: Array<{ ic: 'check' | 'sun' | 'zap' | 'map' | 'briefcase' | 'percent' | 'file-text' | 'credit-card'; l: string; v: string }> = [
    { ic: 'check',       l: t(lang, 'proj.review.path'),     v: data.path === 'licensed' ? t(lang, 'proj.path.licensed') : t(lang, 'proj.path.new') },
    { ic: 'sun',         l: t(lang, 'proj.review.type'),     v: data.type ? t(lang, `proj.type.${data.type}`) : '—' },
    { ic: 'zap',         l: t(lang, 'proj.review.capacity'), v: data.capacityKw ? `${data.capacityKw} kW` : '—' },
    { ic: 'map',         l: t(lang, 'proj.review.address'),  v: [data.address, data.city].filter(Boolean).join(', ') || '—' },
    { ic: 'briefcase',   l: t(lang, 'proj.review.cost'),     v: data.totalCostUsd ? `$${data.totalCostUsd.toLocaleString('en-US')}` : '—' },
    { ic: 'percent',     l: t(lang, 'proj.review.ask'),      v: data.fundingAskUsd ? `$${data.fundingAskUsd.toLocaleString('en-US')}` : '—' },
    { ic: 'file-text',   l: t(lang, 'proj.review.docs'),     v: `${uploadedCount} / ${activeDocs.length}` },
    { ic: 'credit-card', l: t(lang, 'proj.review.payment'),  v: data.paymentCompleted ? `$${SERVICE_FEE_USD.toLocaleString('en-US')} ✓` : '—' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="onb-callout" style={{ alignSelf: 'flex-start' }}>
        <Ic n="shield-check" s={14} c="#2BB673" />
        {t(lang, 'proj.review.callout')}
      </div>

      <Section title={t(lang, 'proj.review.summary')}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
          {summary.map((s, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: 12,
              background: '#0A0A0B', border: '1px solid #1F1F23', borderRadius: 8,
            }}>
              <div style={{ width: 32, height: 32, borderRadius: 6, background: '#16161A', border: '1px solid #1F1F23', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Ic n={s.ic} s={14} c="#F59E0B" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
                <span style={{ color: '#A1A1A6', fontSize: 10, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase' }}>{s.l}</span>
                <span style={{ color: '#EDEDEE', fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.v}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title={t(lang, 'proj.review.timeline')}>
        <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { d: '48h',  t: t(lang, 'proj.review.tl.review') },
            { d: '5d',   t: t(lang, 'proj.review.tl.list') },
            { d: '7d',   t: t(lang, 'proj.review.tl.emailBlast') },
            { d: '14d',  t: t(lang, 'proj.review.tl.pitch') },
            { d: '+30d', t: t(lang, 'proj.review.tl.match') },
          ].map((step, i) => (
            <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{
                width: 56, padding: '4px 0', textAlign: 'center', borderRadius: 6,
                background: '#F59E0B14', border: '1px solid #F59E0B33',
                color: '#F59E0B', fontSize: 11, fontWeight: 700, letterSpacing: 0.4,
              }}>{step.d}</span>
              <span style={{ color: '#EDEDEE', fontSize: 13 }}>{step.t}</span>
            </li>
          ))}
        </ol>
      </Section>

      <label style={{
        display: 'flex', alignItems: 'flex-start', gap: 10, padding: 14, borderRadius: 8,
        background: data.acceptedTerms ? '#2BB67310' : '#0A0A0B',
        border: `1px solid ${data.acceptedTerms ? '#2BB67333' : '#1F1F23'}`,
        cursor: 'pointer',
      }}>
        <input type="checkbox" checked={!!data.acceptedTerms}
          onChange={(e) => update({ acceptedTerms: e.target.checked })}
          style={{ width: 16, height: 16, accentColor: '#2BB673', marginTop: 2 }} />
        <span style={{ color: data.acceptedTerms ? '#2BB673' : '#A1A1A6', fontSize: 12, lineHeight: 1.5 }}>
          {t(lang, 'proj.review.terms')}
        </span>
      </label>
    </div>
  );
}

/* ============================ HELPERS ============================ */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="proj-section">
      <span className="proj-section-title">{title}</span>
      {children}
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="proj-field">
      <span className="proj-field-label">{label}</span>
      {children}
    </label>
  );
}

function PathCard({ active, onClick, badge, badgeTone, title, sub, bullets }: {
  active: boolean; onClick: () => void;
  badge: string; badgeTone: string;
  title: string; sub: string; bullets: string[];
}) {
  return (
    <button type="button" onClick={onClick}
      className="proj-type-card"
      style={{
        alignItems: 'flex-start', textAlign: 'left', padding: 16, gap: 8,
        borderColor: active ? '#F59E0B' : '#1F1F23',
        background: active ? '#F59E0B0A' : '#101013',
      }}>
      <span style={{
        display: 'inline-block', padding: '2px 8px', borderRadius: 4,
        background: `${badgeTone}14`, border: `1px solid ${badgeTone}33`,
        color: badgeTone, fontSize: 10, fontWeight: 700, letterSpacing: 0.6,
      }}>{badge}</span>
      <span style={{ color: '#EDEDEE', fontSize: 16, fontWeight: 600 }}>{title}</span>
      <span style={{ color: '#A1A1A6', fontSize: 12, lineHeight: 1.45 }}>{sub}</span>
      <ul style={{ margin: '4px 0 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {bullets.map((b, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#A1A1A6', fontSize: 12 }}>
            <Ic n="check" s={12} c={active ? '#F59E0B' : '#6B6B71'} /> {b}
          </li>
        ))}
      </ul>
    </button>
  );
}

function CompareCell({ children, head, muted, highlight }: {
  children: React.ReactNode; head?: boolean; muted?: boolean; highlight?: boolean;
}) {
  return (
    <div style={{
      padding: '10px 12px',
      background: head ? '#16161A' : '#101013',
      color: head ? '#A1A1A6' : muted ? '#6B6B71' : highlight ? '#F59E0B' : '#EDEDEE',
      fontSize: head ? 11 : 13,
      fontWeight: head ? 600 : highlight ? 600 : 500,
      letterSpacing: head ? 0.5 : 0,
      textTransform: head ? 'uppercase' : 'none',
    }}>
      {children}
    </div>
  );
}
