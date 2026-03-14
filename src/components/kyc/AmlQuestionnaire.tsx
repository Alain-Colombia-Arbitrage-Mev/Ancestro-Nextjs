'use client';

import { useState } from 'react';

interface AmlQuestionnaireProps {
  lang: string;
  onComplete: (data: AmlData) => void;
}

export interface AmlData {
  sourceOfFunds: string;
  sourceOfFundsOther?: string;
  estimatedNetWorth: string;
  annualIncome: string;
  isPep: boolean;
  pepDetails?: string;
  isUsCitizen: boolean;
  usTaxId?: string;
  countryOfTaxResidence: string;
  occupation: string;
  employer?: string;
  investmentPurpose: string;
  acceptedDeclaration: boolean;
}

const t: Record<string, Record<string, string>> = {
  es: {
    title: 'Cuestionario Anti-Lavado de Dinero (AML)',
    subtitle: 'Regulaciones internacionales requieren esta informacion para prevenir el lavado de dinero y financiamiento del terrorismo.',
    sourceOfFunds: 'Origen de los fondos a invertir',
    salary: 'Salario / Ingresos laborales',
    business: 'Ingresos de negocio propio',
    investments: 'Retorno de inversiones previas',
    inheritance: 'Herencia',
    savings: 'Ahorros personales',
    realEstate: 'Venta de bienes inmuebles',
    other: 'Otro',
    specifyOther: 'Especifique el origen',
    netWorth: 'Patrimonio neto estimado (USD)',
    under50k: 'Menos de $50,000',
    '50k100k': '$50,000 - $100,000',
    '100k500k': '$100,000 - $500,000',
    '500k1m': '$500,000 - $1,000,000',
    over1m: 'Mas de $1,000,000',
    annualIncome: 'Ingreso anual estimado (USD)',
    under25k: 'Menos de $25,000',
    '25k50k': '$25,000 - $50,000',
    '50k100kInc': '$50,000 - $100,000',
    '100k250k': '$100,000 - $250,000',
    over250k: 'Mas de $250,000',
    pepQuestion: 'Es usted o algun familiar cercano una Persona Expuesta Politicamente (PEP)?',
    pepDesc: 'Incluye funcionarios publicos, diplomaticos, oficiales militares de alto rango, ejecutivos de empresas estatales, o familiares directos de estos.',
    pepYes: 'Si',
    pepNo: 'No',
    pepDetails: 'Describa la relacion politica',
    usQuestion: 'Es usted ciudadano o residente fiscal de los Estados Unidos?',
    usYes: 'Si',
    usNo: 'No',
    usTaxId: 'Numero de identificacion fiscal (SSN/ITIN)',
    taxCountry: 'Pais de residencia fiscal',
    occupation: 'Ocupacion o profesion',
    employer: 'Empresa o empleador (opcional)',
    investPurpose: 'Proposito de la inversion',
    growth: 'Crecimiento de capital a largo plazo',
    income: 'Generacion de ingresos',
    diversification: 'Diversificacion de portafolio',
    impact: 'Inversion de impacto / ESG',
    declaration: 'Declaro que la informacion proporcionada es veraz y que los fondos a invertir provienen de fuentes licitas. Entiendo que proporcionar informacion falsa puede resultar en el rechazo de mi solicitud y/o reporte a las autoridades competentes.',
    acceptDeclaration: 'Acepto la declaracion jurada',
    submit: 'Enviar Cuestionario',
    required: 'Campo obligatorio',
  },
  en: {
    title: 'Anti-Money Laundering (AML) Questionnaire',
    subtitle: 'International regulations require this information to prevent money laundering and terrorism financing.',
    sourceOfFunds: 'Source of funds to be invested',
    salary: 'Salary / Employment income',
    business: 'Business income',
    investments: 'Returns from prior investments',
    inheritance: 'Inheritance',
    savings: 'Personal savings',
    realEstate: 'Real estate sale',
    other: 'Other',
    specifyOther: 'Specify the source',
    netWorth: 'Estimated net worth (USD)',
    under50k: 'Under $50,000',
    '50k100k': '$50,000 - $100,000',
    '100k500k': '$100,000 - $500,000',
    '500k1m': '$500,000 - $1,000,000',
    over1m: 'Over $1,000,000',
    annualIncome: 'Estimated annual income (USD)',
    under25k: 'Under $25,000',
    '25k50k': '$25,000 - $50,000',
    '50k100kInc': '$50,000 - $100,000',
    '100k250k': '$100,000 - $250,000',
    over250k: 'Over $250,000',
    pepQuestion: 'Are you or any close relative a Politically Exposed Person (PEP)?',
    pepDesc: 'Includes public officials, diplomats, senior military officers, state-owned enterprise executives, or their direct family members.',
    pepYes: 'Yes',
    pepNo: 'No',
    pepDetails: 'Describe the political relationship',
    usQuestion: 'Are you a US citizen or US tax resident?',
    usYes: 'Yes',
    usNo: 'No',
    usTaxId: 'Tax identification number (SSN/ITIN)',
    taxCountry: 'Country of tax residence',
    occupation: 'Occupation or profession',
    employer: 'Company or employer (optional)',
    investPurpose: 'Purpose of investment',
    growth: 'Long-term capital growth',
    income: 'Income generation',
    diversification: 'Portfolio diversification',
    impact: 'Impact investing / ESG',
    declaration: 'I declare that the information provided is truthful and that the funds to be invested come from lawful sources. I understand that providing false information may result in rejection of my application and/or reporting to competent authorities.',
    acceptDeclaration: 'I accept the sworn declaration',
    submit: 'Submit Questionnaire',
    required: 'Required field',
  },
  pt: {
    title: 'Questionario Anti-Lavagem de Dinheiro (AML)',
    subtitle: 'Regulamentacoes internacionais exigem estas informacoes para prevenir lavagem de dinheiro e financiamento do terrorismo.',
    sourceOfFunds: 'Origem dos fundos a investir',
    salary: 'Salario / Renda de trabalho',
    business: 'Renda de negocio proprio',
    investments: 'Retorno de investimentos anteriores',
    inheritance: 'Heranca',
    savings: 'Poupanca pessoal',
    realEstate: 'Venda de imoveis',
    other: 'Outro',
    specifyOther: 'Especifique a origem',
    netWorth: 'Patrimonio liquido estimado (USD)',
    under50k: 'Menos de $50.000',
    '50k100k': '$50.000 - $100.000',
    '100k500k': '$100.000 - $500.000',
    '500k1m': '$500.000 - $1.000.000',
    over1m: 'Mais de $1.000.000',
    annualIncome: 'Renda anual estimada (USD)',
    under25k: 'Menos de $25.000',
    '25k50k': '$25.000 - $50.000',
    '50k100kInc': '$50.000 - $100.000',
    '100k250k': '$100.000 - $250.000',
    over250k: 'Mais de $250.000',
    pepQuestion: 'Voce ou algum familiar proximo e uma Pessoa Politicamente Exposta (PEP)?',
    pepDesc: 'Inclui funcionarios publicos, diplomatas, oficiais militares de alto escalao, executivos de empresas estatais ou seus familiares diretos.',
    pepYes: 'Sim',
    pepNo: 'Nao',
    pepDetails: 'Descreva a relacao politica',
    usQuestion: 'Voce e cidadao ou residente fiscal dos Estados Unidos?',
    usYes: 'Sim',
    usNo: 'Nao',
    usTaxId: 'Numero de identificacao fiscal (SSN/ITIN)',
    taxCountry: 'Pais de residencia fiscal',
    occupation: 'Ocupacao ou profissao',
    employer: 'Empresa ou empregador (opcional)',
    investPurpose: 'Proposito do investimento',
    growth: 'Crescimento de capital a longo prazo',
    income: 'Geracao de renda',
    diversification: 'Diversificacao de portfolio',
    impact: 'Investimento de impacto / ESG',
    declaration: 'Declaro que as informacoes fornecidas sao verdadeiras e que os fundos a investir provem de fontes licitas. Entendo que fornecer informacoes falsas pode resultar na rejeicao da minha solicitacao e/ou relatorio as autoridades competentes.',
    acceptDeclaration: 'Aceito a declaracao juramentada',
    submit: 'Enviar Questionario',
    required: 'Campo obrigatorio',
  },
};

const fundSources = ['salary', 'business', 'investments', 'inheritance', 'savings', 'realEstate', 'other'] as const;
const netWorthRanges = ['under50k', '50k100k', '100k500k', '500k1m', 'over1m'] as const;
const incomeRanges = ['under25k', '25k50k', '50k100kInc', '100k250k', 'over250k'] as const;
const purposes = ['growth', 'income', 'diversification', 'impact'] as const;

const latamCountries = [
  'Colombia', 'Mexico', 'Brazil', 'Argentina', 'Chile', 'Peru', 'Panama',
  'Costa Rica', 'Ecuador', 'Uruguay', 'Guatemala', 'El Salvador', 'Honduras',
  'Nicaragua', 'Dominican Republic', 'Bolivia', 'Paraguay', 'Venezuela',
  'United States', 'Spain', 'Other',
];

export default function AmlQuestionnaire({ lang, onComplete }: AmlQuestionnaireProps) {
  const l = t[lang] || t.en;

  const [form, setForm] = useState<AmlData>({
    sourceOfFunds: '',
    estimatedNetWorth: '',
    annualIncome: '',
    isPep: false,
    isUsCitizen: false,
    countryOfTaxResidence: '',
    occupation: '',
    investmentPurpose: '',
    acceptedDeclaration: false,
  });

  const [errors, setErrors] = useState<Record<string, boolean>>({});

  function update(field: keyof AmlData, value: string | boolean) {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: false }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, boolean> = {};
    if (!form.sourceOfFunds) errs.sourceOfFunds = true;
    if (form.sourceOfFunds === 'other' && !form.sourceOfFundsOther?.trim()) errs.sourceOfFundsOther = true;
    if (!form.estimatedNetWorth) errs.estimatedNetWorth = true;
    if (!form.annualIncome) errs.annualIncome = true;
    if (form.isPep && !form.pepDetails?.trim()) errs.pepDetails = true;
    if (form.isUsCitizen && !form.usTaxId?.trim()) errs.usTaxId = true;
    if (!form.countryOfTaxResidence) errs.countryOfTaxResidence = true;
    if (!form.occupation.trim()) errs.occupation = true;
    if (!form.investmentPurpose) errs.investmentPurpose = true;
    if (!form.acceptedDeclaration) errs.acceptedDeclaration = true;
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    onComplete(form);
  }

  const fieldClass = (name: string) => `aml-input${errors[name] ? ' aml-input--error' : ''}`;

  return (
    <>
      <form className="aml-form" onSubmit={handleSubmit}>
        {/* Source of Funds */}
        <div className="aml-group">
          <label className="aml-label">{l.sourceOfFunds} <span className="aml-req">*</span></label>
          <div className="aml-radio-grid">
            {fundSources.map(s => (
              <label key={s} className={`aml-radio${form.sourceOfFunds === s ? ' aml-radio--active' : ''}`}>
                <input type="radio" name="sourceOfFunds" value={s} checked={form.sourceOfFunds === s} onChange={() => update('sourceOfFunds', s)} />
                <span>{l[s]}</span>
              </label>
            ))}
          </div>
          {form.sourceOfFunds === 'other' && (
            <input className={fieldClass('sourceOfFundsOther')} type="text" placeholder={l.specifyOther} value={form.sourceOfFundsOther || ''} onChange={e => update('sourceOfFundsOther', e.target.value)} />
          )}
        </div>

        {/* Net Worth */}
        <div className="aml-group">
          <label className="aml-label">{l.netWorth} <span className="aml-req">*</span></label>
          <select className={fieldClass('estimatedNetWorth')} value={form.estimatedNetWorth} onChange={e => update('estimatedNetWorth', e.target.value)}>
            <option value="">--</option>
            {netWorthRanges.map(r => <option key={r} value={r}>{l[r]}</option>)}
          </select>
        </div>

        {/* Annual Income */}
        <div className="aml-group">
          <label className="aml-label">{l.annualIncome} <span className="aml-req">*</span></label>
          <select className={fieldClass('annualIncome')} value={form.annualIncome} onChange={e => update('annualIncome', e.target.value)}>
            <option value="">--</option>
            {incomeRanges.map(r => <option key={r} value={r}>{l[r]}</option>)}
          </select>
        </div>

        {/* PEP */}
        <div className="aml-group">
          <label className="aml-label">{l.pepQuestion} <span className="aml-req">*</span></label>
          <p className="aml-hint">{l.pepDesc}</p>
          <div className="aml-toggle-row">
            <button type="button" className={`aml-toggle${form.isPep ? ' aml-toggle--active aml-toggle--warn' : ''}`} onClick={() => update('isPep', true)}>{l.pepYes}</button>
            <button type="button" className={`aml-toggle${!form.isPep ? ' aml-toggle--active' : ''}`} onClick={() => update('isPep', false)}>{l.pepNo}</button>
          </div>
          {form.isPep && (
            <textarea className={fieldClass('pepDetails')} rows={3} placeholder={l.pepDetails} value={form.pepDetails || ''} onChange={e => update('pepDetails', e.target.value)} />
          )}
        </div>

        {/* US Citizen */}
        <div className="aml-group">
          <label className="aml-label">{l.usQuestion} <span className="aml-req">*</span></label>
          <div className="aml-toggle-row">
            <button type="button" className={`aml-toggle${form.isUsCitizen ? ' aml-toggle--active' : ''}`} onClick={() => update('isUsCitizen', true)}>{l.usYes}</button>
            <button type="button" className={`aml-toggle${!form.isUsCitizen ? ' aml-toggle--active' : ''}`} onClick={() => update('isUsCitizen', false)}>{l.usNo}</button>
          </div>
          {form.isUsCitizen && (
            <input className={fieldClass('usTaxId')} type="text" placeholder={l.usTaxId} value={form.usTaxId || ''} onChange={e => update('usTaxId', e.target.value)} />
          )}
        </div>

        {/* Tax Country */}
        <div className="aml-group">
          <label className="aml-label">{l.taxCountry} <span className="aml-req">*</span></label>
          <select className={fieldClass('countryOfTaxResidence')} value={form.countryOfTaxResidence} onChange={e => update('countryOfTaxResidence', e.target.value)}>
            <option value="">--</option>
            {latamCountries.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Occupation */}
        <div className="aml-row">
          <div className="aml-group" style={{ flex: 1 }}>
            <label className="aml-label">{l.occupation} <span className="aml-req">*</span></label>
            <input className={fieldClass('occupation')} type="text" value={form.occupation} onChange={e => update('occupation', e.target.value)} />
          </div>
          <div className="aml-group" style={{ flex: 1 }}>
            <label className="aml-label">{l.employer}</label>
            <input className="aml-input" type="text" value={form.employer || ''} onChange={e => update('employer', e.target.value)} />
          </div>
        </div>

        {/* Investment Purpose */}
        <div className="aml-group">
          <label className="aml-label">{l.investPurpose} <span className="aml-req">*</span></label>
          <div className="aml-radio-grid">
            {purposes.map(p => (
              <label key={p} className={`aml-radio${form.investmentPurpose === p ? ' aml-radio--active' : ''}`}>
                <input type="radio" name="investmentPurpose" value={p} checked={form.investmentPurpose === p} onChange={() => update('investmentPurpose', p)} />
                <span>{l[p]}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Declaration */}
        <div className="aml-declaration">
          <p className="aml-declaration-text">{l.declaration}</p>
          <label className={`aml-checkbox${errors.acceptedDeclaration ? ' aml-checkbox--error' : ''}`}>
            <input type="checkbox" checked={form.acceptedDeclaration} onChange={e => update('acceptedDeclaration', e.target.checked)} />
            <span>{l.acceptDeclaration}</span>
          </label>
        </div>

        <button type="submit" className="aml-submit">{l.submit}</button>
      </form>

      <style>{`
        .aml-form{display:flex;flex-direction:column;gap:24px}
        .aml-group{display:flex;flex-direction:column;gap:8px}
        .aml-row{display:flex;gap:16px}
        .aml-label{font-size:14px;font-weight:600;color:rgba(255,255,255,0.8)}
        .aml-req{color:#f8b03b}
        .aml-hint{font-size:12px;color:rgba(255,255,255,0.35);line-height:1.5;margin:0}
        .aml-input,.aml-form select,.aml-form textarea{width:100%;padding:12px 16px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:10px;color:#fff;font-size:14px;font-family:inherit;outline:none;transition:border-color 0.2s;box-sizing:border-box}
        .aml-input:focus,.aml-form select:focus,.aml-form textarea:focus{border-color:rgba(248,176,59,0.5)}
        .aml-input--error,.aml-form select.aml-input--error{border-color:#ef4444}
        .aml-form select{cursor:pointer;appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.4)' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 14px center}
        .aml-form select option{background:#1a1a1a;color:#fff}
        .aml-radio-grid{display:flex;flex-wrap:wrap;gap:8px}
        .aml-radio{display:flex;align-items:center;gap:8px;padding:10px 16px;border:1px solid rgba(255,255,255,0.08);border-radius:10px;cursor:pointer;font-size:13px;color:rgba(255,255,255,0.6);transition:all 0.2s}
        .aml-radio input{display:none}
        .aml-radio:hover{border-color:rgba(255,255,255,0.2)}
        .aml-radio--active{border-color:rgba(248,176,59,0.4);background:rgba(248,176,59,0.06);color:#f8b03b}
        .aml-toggle-row{display:flex;gap:8px}
        .aml-toggle{padding:10px 24px;border:1px solid rgba(255,255,255,0.1);border-radius:10px;background:none;color:rgba(255,255,255,0.5);font-size:14px;font-weight:600;font-family:inherit;cursor:pointer;transition:all 0.2s}
        .aml-toggle--active{border-color:rgba(34,197,94,0.4);background:rgba(34,197,94,0.08);color:#22c55e}
        .aml-toggle--warn{border-color:rgba(234,179,8,0.4);background:rgba(234,179,8,0.08);color:#eab308}
        .aml-declaration{padding:20px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.08);border-radius:12px}
        .aml-declaration-text{font-size:13px;color:rgba(255,255,255,0.4);line-height:1.7;margin:0 0 16px}
        .aml-checkbox{display:flex;align-items:flex-start;gap:10px;cursor:pointer;font-size:14px;font-weight:600;color:#fff}
        .aml-checkbox input{width:18px;height:18px;accent-color:#f8b03b;margin-top:2px;flex-shrink:0}
        .aml-checkbox--error{color:#ef4444}
        .aml-submit{width:100%;padding:16px;background:linear-gradient(135deg,#f8b03b,#e9a235);color:#000;font-size:16px;font-weight:700;font-family:inherit;border:none;border-radius:12px;cursor:pointer;transition:all 0.2s}
        .aml-submit:hover{transform:translateY(-2px);box-shadow:0 8px 30px rgba(248,176,59,0.3)}
        @media(max-width:480px){.aml-row{flex-direction:column}.aml-radio-grid{flex-direction:column}.aml-radio{width:100%}}
      `}</style>
    </>
  );
}
