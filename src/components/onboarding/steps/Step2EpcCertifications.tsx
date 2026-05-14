'use client';
import { t } from '@/i18n/translations';
import { Ic } from '@/components/dashboard/shared';
import type { EpcCert, EpcOnboardingState } from '../EpcOnboardingWizard';

interface Props {
  lang: string;
  data: EpcOnboardingState;
  update: (patch: Partial<EpcOnboardingState>) => void;
}

interface CertDef {
  id: string;
  type: EpcCert['type'];
  titleKey: string;
  subKey: string;
  tone: string;
  required?: boolean;
}

const CERTS: CertDef[] = [
  { id: 'nabcep',       type: 'nabcep',       titleKey: 'onb.epc.certs.nabcep',       subKey: 'onb.epc.certs.nabcepSub',       tone: '#02C076', required: true },
  { id: 'osha10',       type: 'osha10',       titleKey: 'onb.epc.certs.osha10',       subKey: 'onb.epc.certs.osha10Sub',       tone: '#F59E0B' },
  { id: 'osha30',       type: 'osha30',       titleKey: 'onb.epc.certs.osha30',       subKey: 'onb.epc.certs.osha30Sub',       tone: '#FBBF24' },
  { id: 'electrical',   type: 'electrical',   titleKey: 'onb.epc.certs.electrical',   subKey: 'onb.epc.certs.electricalSub',   tone: '#A78BFA' },
  { id: 'manufacturer', type: 'manufacturer', titleKey: 'onb.epc.certs.manufacturer', subKey: 'onb.epc.certs.manufacturerSub', tone: '#6C5CE7' },
];

export function Step2EpcCertifications({ lang, data, update }: Props) {
  const toggle = (def: CertDef) => {
    const existing = (data.certs || []).find(c => c.id === def.id);
    if (existing) {
      update({ certs: (data.certs || []).map(c => c.id === def.id ? { ...c, uploaded: !c.uploaded } : c) });
    } else {
      update({ certs: [...(data.certs || []), { id: def.id, type: def.type, uploaded: true }] });
    }
  };
  const isUploaded = (id: string) => (data.certs || []).find(c => c.id === id)?.uploaded === true;

  return (
    <>
      <div className="onb-callout">
        <Ic n="shield-check" s={14} c="#02C076" />
        {t(lang, 'onb.epc.certs.callout')}
      </div>

      {CERTS.map((def) => {
        const up = isUploaded(def.id);
        return (
          <div key={def.id} className={`onb-card ${up ? 'is-active' : ''}`}>
            <div className="onb-card-icon" style={{ background: `${def.tone}18`, borderColor: `${def.tone}40` }}>
              <Ic n="file-text" s={18} c={def.tone} />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: '#F5F3FF', fontSize: 14, fontWeight: 700 }}>
                  {t(lang, def.titleKey)}
                </span>
                {def.required && (
                  <span style={{ color: '#F87171', fontSize: 10, fontWeight: 800, letterSpacing: 0.5 }}>
                    {t(lang, 'onb.epc.certs.required').toUpperCase()}
                  </span>
                )}
              </div>
              <span style={{ color: '#5E6673', fontSize: 11 }}>
                {t(lang, def.subKey)}
              </span>
            </div>
            <button
              type="button"
              className="onb-btn-ghost"
              onClick={() => toggle(def)}
              style={{ height: 32, padding: '0 12px', fontSize: 11, fontWeight: 700 }}
            >
              {up
                ? <><Ic n="check" s={12} c="#02C076" /> {t(lang, 'onb.epc.certs.uploaded')}</>
                : t(lang, 'onb.epc.certs.upload')}
            </button>
          </div>
        );
      })}

      {/* Insurance — also required */}
      <div className={`onb-card ${data.insuranceUploaded ? 'is-active' : ''}`}>
        <div className="onb-card-icon" style={{ background: '#F59E0B18', borderColor: '#F59E0B40' }}>
          <Ic n="shield" s={18} c="#F59E0B" />
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: '#F5F3FF', fontSize: 14, fontWeight: 700 }}>
              {t(lang, 'onb.epc.certs.insurance')}
            </span>
            <span style={{ color: '#F87171', fontSize: 10, fontWeight: 800 }}>
              {t(lang, 'onb.epc.certs.required').toUpperCase()}
            </span>
          </div>
          <span style={{ color: '#5E6673', fontSize: 11 }}>
            {t(lang, 'onb.epc.certs.insuranceSub')}
          </span>
        </div>
        <button
          type="button"
          className="onb-btn-ghost"
          onClick={() => update({ insuranceUploaded: !data.insuranceUploaded })}
          style={{ height: 32, padding: '0 12px', fontSize: 11, fontWeight: 700 }}
        >
          {data.insuranceUploaded
            ? <><Ic n="check" s={12} c="#02C076" /> {t(lang, 'onb.epc.certs.uploaded')}</>
            : t(lang, 'onb.epc.certs.upload')}
        </button>
      </div>
    </>
  );
}
