'use client';
import { t } from '@/i18n/translations';
import { Ic } from '@/components/dashboard/shared';
import type { InvestorOnboardingState } from '../InvestorOnboardingWizard';

interface Props {
  lang: string;
  data: InvestorOnboardingState;
  update: (patch: Partial<InvestorOnboardingState>) => void;
}

export function Step1InvestorProfile({ lang, data, update }: Props) {
  return (
    <>
      <div className="onb-callout">
        <Ic n="shield" s={14} c="#02C076" />
        {t(lang, 'onb.inv.profile.callout')}
      </div>

      <div className="onb-card" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div className="onb-card-icon" style={{ background: '#02C07618', borderColor: '#02C07640' }}>
            <Ic n="user" s={18} c="#02C076" />
          </div>
          <span style={{ color: '#F5F3FF', fontSize: 14, fontWeight: 700, flex: 1 }}>
            {t(lang, 'onb.inv.profile.identity')}
          </span>
        </div>
        <input
          type="text"
          className="onb-input"
          placeholder={t(lang, 'onb.inv.profile.fullName')}
          value={data.fullName || ''}
          onChange={(e) => update({ fullName: e.target.value })}
        />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <input
            type="date"
            className="onb-input"
            value={data.dob || ''}
            onChange={(e) => update({ dob: e.target.value })}
          />
          <select
            className="onb-input"
            value={data.citizenship || ''}
            onChange={(e) => update({ citizenship: e.target.value })}
          >
            <option value="">{t(lang, 'onb.inv.profile.citizenshipPick')}</option>
            <option value="US">United States</option>
            <option value="MX">México</option>
            <option value="CO">Colombia</option>
            <option value="AR">Argentina</option>
            <option value="CL">Chile</option>
            <option value="PE">Perú</option>
            <option value="ES">España</option>
            <option value="other">{t(lang, 'onb.inv.profile.other')}</option>
          </select>
        </div>
      </div>

      <div className="onb-card" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div className="onb-card-icon" style={{ background: '#F59E0B18', borderColor: '#F59E0B40' }}>
            <Ic n="map" s={18} c="#F59E0B" />
          </div>
          <span style={{ color: '#F5F3FF', fontSize: 14, fontWeight: 700, flex: 1 }}>
            {t(lang, 'onb.inv.profile.address')}
          </span>
        </div>
        <input
          type="text"
          className="onb-input"
          placeholder={t(lang, 'onb.inv.profile.addressPlaceholder')}
          value={data.address || ''}
          onChange={(e) => update({ address: e.target.value })}
        />
      </div>

      <div className="onb-card" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div className="onb-card-icon" style={{ background: '#A78BFA18', borderColor: '#A78BFA40' }}>
            <Ic n="shield-check" s={18} c="#A78BFA" />
          </div>
          <span style={{ color: '#F5F3FF', fontSize: 14, fontWeight: 700, flex: 1 }}>
            {t(lang, 'onb.inv.profile.regulatory')}
          </span>
        </div>
        <Check
          checked={!!data.isAccredited}
          onChange={(v) => update({ isAccredited: v })}
          label={t(lang, 'onb.inv.profile.accredited')}
        />
        <Check
          checked={!!data.isUsCitizen}
          onChange={(v) => update({ isUsCitizen: v })}
          label={t(lang, 'onb.inv.profile.usCitizen')}
        />
        <Check
          checked={!!data.isPep}
          onChange={(v) => update({ isPep: v })}
          label={t(lang, 'onb.inv.profile.pep')}
        />
      </div>
    </>
  );
}

function Check({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label style={{
      display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 8,
      background: checked ? '#02C07614' : 'transparent', cursor: 'pointer',
      border: `1px solid ${checked ? '#02C07640' : '#1A1A1A'}`,
    }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{ width: 16, height: 16, accentColor: '#02C076' }}
      />
      <span style={{ color: checked ? '#02C076' : '#A1A1AA', fontSize: 12, fontWeight: 500 }}>{label}</span>
    </label>
  );
}
