'use client';
import { t } from '@/i18n/translations';
import { Ic } from '@/components/dashboard/shared';
import type { EpcOnboardingState } from '../EpcOnboardingWizard';

interface Props {
  lang: string;
  data: EpcOnboardingState;
  update: (patch: Partial<EpcOnboardingState>) => void;
}

export function Step1EpcCompany({ lang, data, update }: Props) {
  return (
    <>
      <div className="onb-callout">
        <Ic n="shield-check" s={14} c="#02C076" />
        {t(lang, 'onb.epc.company.callout')}
      </div>

      {/* Legal entity */}
      <div className="onb-card" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div className="onb-card-icon" style={{ background: '#F59E0B18', borderColor: '#F59E0B40' }}>
            <Ic n="briefcase" s={18} c="#F59E0B" />
          </div>
          <span style={{ color: '#F5F3FF', fontSize: 14, fontWeight: 700, flex: 1 }}>
            {t(lang, 'onb.epc.company.legalEntity')}
          </span>
        </div>
        <input
          type="text"
          className="onb-input"
          placeholder={t(lang, 'onb.epc.company.legalNamePh')}
          value={data.legalName || ''}
          onChange={(e) => update({ legalName: e.target.value })}
        />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <input
            type="text"
            className="onb-input"
            placeholder={t(lang, 'onb.epc.company.einPh')}
            value={data.ein || ''}
            onChange={(e) => update({ ein: e.target.value })}
          />
          <input
            type="number"
            className="onb-input"
            placeholder={t(lang, 'onb.epc.company.yearsPh')}
            min={0}
            value={data.yearsOperating ?? ''}
            onChange={(e) => update({ yearsOperating: e.target.value ? Number(e.target.value) : undefined })}
          />
        </div>
      </div>

      {/* License */}
      <div className="onb-card" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div className="onb-card-icon" style={{ background: '#02C07618', borderColor: '#02C07640' }}>
            <Ic n="file-text" s={18} c="#02C076" />
          </div>
          <span style={{ color: '#F5F3FF', fontSize: 14, fontWeight: 700, flex: 1 }}>
            {t(lang, 'onb.epc.company.license')}
          </span>
        </div>
        <input
          type="text"
          className="onb-input"
          placeholder={t(lang, 'onb.epc.company.licensePh')}
          value={data.licenseNumber || ''}
          onChange={(e) => update({ licenseNumber: e.target.value })}
        />
      </div>

      {/* Address */}
      <div className="onb-card" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div className="onb-card-icon" style={{ background: '#A78BFA18', borderColor: '#A78BFA40' }}>
            <Ic n="map" s={18} c="#A78BFA" />
          </div>
          <span style={{ color: '#F5F3FF', fontSize: 14, fontWeight: 700, flex: 1 }}>
            {t(lang, 'onb.epc.company.address')}
          </span>
        </div>
        <input
          type="text"
          className="onb-input"
          placeholder={t(lang, 'onb.epc.company.addressPh')}
          value={data.address || ''}
          onChange={(e) => update({ address: e.target.value })}
        />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <input
            type="text"
            className="onb-input"
            placeholder={t(lang, 'onb.epc.company.cityPh')}
            value={data.city || ''}
            onChange={(e) => update({ city: e.target.value })}
          />
          <select
            className="onb-input"
            value={data.country || ''}
            onChange={(e) => update({ country: e.target.value })}
          >
            <option value="">{t(lang, 'onb.epc.company.countryPh')}</option>
            <option value="US">United States</option>
            <option value="MX">México</option>
            <option value="CO">Colombia</option>
            <option value="AR">Argentina</option>
            <option value="CL">Chile</option>
            <option value="PE">Perú</option>
            <option value="ES">España</option>
          </select>
        </div>
      </div>
    </>
  );
}
