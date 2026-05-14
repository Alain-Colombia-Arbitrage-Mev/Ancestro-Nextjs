'use client';
import { t } from '@/i18n/translations';
import { Ic } from '@/components/dashboard/shared';
import type { InvestorOnboardingState } from '../InvestorOnboardingWizard';

interface Props {
  lang: string;
  data: InvestorOnboardingState;
  update: (patch: Partial<InvestorOnboardingState>) => void;
}

const DOC_TYPES = [
  { id: 'passport',         labelKey: 'onb.inv.kyc.passport' },
  { id: 'driver-license',   labelKey: 'onb.inv.kyc.driver' },
  { id: 'national-id',      labelKey: 'onb.inv.kyc.id' },
] as const;

export function Step3InvestorKyc({ lang, data, update }: Props) {
  return (
    <>
      <div className="onb-callout">
        <Ic n="shield-check" s={14} c="#02C076" />
        {t(lang, 'onb.inv.kyc.callout')}
      </div>

      {/* Doc type */}
      <div className="onb-card" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div className="onb-card-icon" style={{ background: '#F59E0B18', borderColor: '#F59E0B40' }}>
            <Ic n="file-text" s={18} c="#F59E0B" />
          </div>
          <span style={{ color: '#F5F3FF', fontSize: 14, fontWeight: 700, flex: 1 }}>
            {t(lang, 'onb.inv.kyc.docTypeLabel')}
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {DOC_TYPES.map((d) => {
            const active = data.kycDocType === d.id;
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => update({ kycDocType: d.id })}
                className="onb-btn-ghost"
                style={{
                  height: 40, fontSize: 12, padding: '0 8px',
                  background: active ? '#F59E0B20' : 'transparent',
                  border: `1px solid ${active ? '#F59E0B' : '#1A1A1A'}`,
                  color: active ? '#F59E0B' : '#A1A1AA',
                  fontWeight: 700,
                }}
              >
                {t(lang, d.labelKey)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Doc upload */}
      <div className={`onb-card ${data.kycDocUploaded ? 'is-active' : ''}`} style={{ flexDirection: 'column', alignItems: 'stretch', gap: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, width: '100%' }}>
          <div className="onb-card-icon" style={{ background: '#A78BFA18', borderColor: '#A78BFA40' }}>
            <Ic n="upload" s={18} c="#A78BFA" />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ color: '#F5F3FF', fontSize: 14, fontWeight: 700 }}>
              {t(lang, 'onb.inv.kyc.docUploadTitle')}
            </span>
            <span style={{ color: '#5E6673', fontSize: 11 }}>
              {t(lang, 'onb.inv.kyc.docUploadSub')}
            </span>
          </div>
          <button
            type="button"
            className="onb-btn-ghost"
            onClick={() => update({ kycDocUploaded: !data.kycDocUploaded })}
            style={{ height: 32, padding: '0 12px', fontSize: 11, fontWeight: 700 }}
          >
            {data.kycDocUploaded ? <><Ic n="check" s={12} c="#02C076" /> {t(lang, 'onb.inv.kyc.uploaded')}</> : t(lang, 'onb.inv.kyc.upload')}
          </button>
        </div>
      </div>

      {/* Selfie */}
      <div className={`onb-card ${data.kycSelfieUploaded ? 'is-active' : ''}`} style={{ flexDirection: 'column', alignItems: 'stretch', gap: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, width: '100%' }}>
          <div className="onb-card-icon" style={{ background: '#02C07618', borderColor: '#02C07640' }}>
            <Ic n="user" s={18} c="#02C076" />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ color: '#F5F3FF', fontSize: 14, fontWeight: 700 }}>
              {t(lang, 'onb.inv.kyc.selfieTitle')}
            </span>
            <span style={{ color: '#5E6673', fontSize: 11 }}>
              {t(lang, 'onb.inv.kyc.selfieSub')}
            </span>
          </div>
          <button
            type="button"
            className="onb-btn-ghost"
            onClick={() => update({ kycSelfieUploaded: !data.kycSelfieUploaded })}
            style={{ height: 32, padding: '0 12px', fontSize: 11, fontWeight: 700 }}
          >
            {data.kycSelfieUploaded ? <><Ic n="check" s={12} c="#02C076" /> {t(lang, 'onb.inv.kyc.captured')}</> : t(lang, 'onb.inv.kyc.capture')}
          </button>
        </div>
      </div>

      {/* Terms */}
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
          {t(lang, 'onb.inv.kyc.terms')}
        </span>
      </label>
    </>
  );
}
