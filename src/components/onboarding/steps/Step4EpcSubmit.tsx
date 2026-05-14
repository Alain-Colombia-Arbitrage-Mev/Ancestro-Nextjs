'use client';
import { t } from '@/i18n/translations';
import { Ic } from '@/components/dashboard/shared';
import type { EpcOnboardingState } from '../EpcOnboardingWizard';

interface Props {
  lang: string;
  data: EpcOnboardingState;
  update: (patch: Partial<EpcOnboardingState>) => void;
}

export function Step4EpcSubmit({ lang, data, update }: Props) {
  const certCount = (data.certs || []).filter(c => c.uploaded).length;

  const summary = [
    { icon: 'briefcase' as const, label: t(lang, 'onb.epc.submit.company'),  value: data.legalName || '—',  tone: '#F59E0B' },
    { icon: 'file-text' as const, label: t(lang, 'onb.epc.submit.ein'),      value: data.ein || '—',         tone: '#A78BFA' },
    { icon: 'map' as const,       label: t(lang, 'onb.epc.submit.address'),  value: [data.address, data.city].filter(Boolean).join(', ') || '—', tone: '#02C076' },
    { icon: 'shield-check' as const, label: t(lang, 'onb.epc.submit.certs'), value: `${certCount} ${t(lang, 'onb.epc.submit.certsValue')}${data.insuranceUploaded ? ` · ${t(lang, 'onb.epc.submit.insuranceOk')}` : ''}`, tone: '#02C076' },
    { icon: 'map' as const,       label: t(lang, 'onb.epc.submit.area'),     value: `${data.serviceCenter || '—'} · ${data.serviceRadiusKm ?? 0} km · ${(data.zipCodes || []).length} ZIP`, tone: '#FBBF24' },
  ];

  return (
    <>
      <div className="onb-callout">
        <Ic n="shield-check" s={14} c="#02C076" />
        {t(lang, 'onb.epc.submit.callout')}
      </div>

      {summary.map((s, i) => (
        <div key={i} className="onb-card">
          <div className="onb-card-icon" style={{ background: `${s.tone}18`, borderColor: `${s.tone}40` }}>
            <Ic n={s.icon} s={18} c={s.tone} />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
            <span style={{ color: '#5E6673', fontSize: 11, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase' }}>
              {s.label}
            </span>
            <span style={{ color: '#F5F3FF', fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {s.value}
            </span>
          </div>
        </div>
      ))}

      <label style={{
        display: 'flex', alignItems: 'flex-start', gap: 10, padding: 14, borderRadius: 12,
        background: data.acceptedTerms ? '#02C07614' : '#0E0E10',
        border: `1px solid ${data.acceptedTerms ? '#02C07640' : '#1A1A1A'}`,
        cursor: 'pointer',
      }}>
        <input
          type="checkbox"
          checked={!!data.acceptedTerms}
          onChange={(e) => update({ acceptedTerms: e.target.checked })}
          style={{ width: 18, height: 18, accentColor: '#02C076', marginTop: 2 }}
        />
        <span style={{ color: data.acceptedTerms ? '#02C076' : '#A1A1AA', fontSize: 12, lineHeight: 1.5 }}>
          {t(lang, 'onb.epc.submit.terms')}
        </span>
      </label>

      <div style={{
        padding: 14, borderRadius: 12,
        background: '#FBBF2412', border: '1px solid #F59E0B40',
        display: 'flex', alignItems: 'flex-start', gap: 10,
      }}>
        <Ic n="clock" s={18} c="#F59E0B" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ color: '#F59E0B', fontSize: 13, fontWeight: 800 }}>
            {t(lang, 'onb.epc.submit.reviewTitle')}
          </span>
          <span style={{ color: '#848E9C', fontSize: 12 }}>
            {t(lang, 'onb.epc.submit.reviewSub')}
          </span>
        </div>
      </div>
    </>
  );
}
