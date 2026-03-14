'use client';

import { useState } from 'react';

interface AmlQuestionnaireProps {
  lang: string;
  onComplete: (data: AmlData) => void;
}

export interface AmlData {
  // Section 1: Investor Info
  fullName: string;
  dateOfBirth: string;
  address: string;
  citizenship: string;
  email: string;
  phone: string;
  investorType: string;

  // Section 2: Accreditation (Natural Persons)
  accreditationCriteria: string[];

  // Section 3: Accreditation (Entities)
  entityCriteria: string[];

  // Section 4: Representations
  acceptedRepresentations: boolean;

  // AML additions
  sourceOfFunds: string;
  sourceOfFundsOther?: string;
  isPep: boolean;
  pepDetails?: string;
  isUsCitizen: boolean;
  usTaxId?: string;
}

const t: Record<string, Record<string, string>> = {
  es: {
    title: 'Cuestionario de Inversionista Acreditado',
    subtitle: 'Regulación D — Ley de Valores de 1933. Este cuestionario determina si usted califica como "Inversionista Acreditado" según la Regla 501(a).',
    confidential: 'Sus respuestas son confidenciales y se usarán únicamente para determinar su elegibilidad.',

    // Section 1
    s1: 'Información del Inversionista',
    fullName: 'Nombre Legal Completo',
    dob: 'Fecha de Nacimiento',
    address: 'Dirección de Residencia Principal',
    citizenship: 'Ciudadanía / País',
    email: 'Correo Electrónico',
    phone: 'Teléfono',
    investorType: 'Tipo de Inversionista',
    individual: 'Individual',
    joint: 'Conjunto (con cónyuge)',
    entity: 'Entidad (empresa, trust, fondo)',

    // Section 2
    s2: 'Criterios de Acreditación — Personas Naturales',
    s2desc: 'Seleccione todos los criterios que apliquen:',
    incomeIndividual: 'Ingreso individual superior a USD $200,000 en los últimos 2 años, con expectativa de mantenerlo.',
    incomeJoint: 'Ingreso conjunto con cónyuge superior a USD $300,000 en los últimos 2 años, con expectativa de mantenerlo.',
    netWorth: 'Patrimonio neto (individual o conjunto) superior a USD $1,000,000, excluyendo residencia principal.',
    professional: 'Poseo licencia Serie 7, Serie 65, Serie 82, u otra certificación designada por la SEC.',
    insider: 'Soy director, ejecutivo o socio general de Ancestro Inc.',
    knowledgeable: 'Soy empleado calificado de un fondo privado según la Ley de Compañías de Inversión.',

    // Section 3
    s3: 'Criterios de Acreditación — Entidades',
    s3desc: 'Si invierte a través de una entidad, seleccione los criterios aplicables:',
    bank: 'Banco, corredor de bolsa, compañía de seguros, o compañía de inversión registrada.',
    benefitPlan: 'Plan de beneficios para empleados con activos superiores a USD $5,000,000.',
    privateFund: 'Fondo privado o asesor de inversiones con activos bajo gestión superiores a USD $5,000,000.',
    familyOffice: 'Family office con activos bajo gestión superiores a USD $5,000,000.',
    entityAssets: 'Corporación, LLC, trust o sociedad con activos totales superiores a USD $5,000,000.',
    allAccredited: 'Entidad donde todos los propietarios de capital son inversionistas acreditados individualmente.',

    // AML
    s4: 'Debida Diligencia (AML)',
    sourceOfFunds: 'Origen de los fondos a invertir',
    salary: 'Salario / Ingresos laborales',
    business: 'Ingresos de negocio propio',
    investments: 'Retorno de inversiones previas',
    inheritance: 'Herencia',
    savings: 'Ahorros personales',
    realEstate: 'Venta de bienes inmuebles',
    other: 'Otro',
    specifyOther: 'Especifique el origen',
    pepQuestion: '¿Es usted o algún familiar cercano una Persona Políticamente Expuesta (PEP)?',
    pepHint: 'Funcionarios públicos, diplomáticos, militares de alto rango, ejecutivos de empresas estatales, o familiares directos.',
    yes: 'Sí',
    no: 'No',
    pepDetails: 'Describa la relación política',
    usQuestion: '¿Es usted ciudadano o residente fiscal de los Estados Unidos?',
    usTaxId: 'SSN o ITIN',

    // Section 5
    s5: 'Declaración Jurada',
    declaration: 'Declaro que toda la información proporcionada es verdadera, correcta y completa. Entiendo que Ancestro Inc. se basa en mis respuestas para determinar mi elegibilidad bajo la Regla 506(b) de la Regulación D. Los valores a adquirir son valores restringidos y no pueden ser ofrecidos, vendidos o transferidos excepto conforme a una exención aplicable. Adquiero los valores para inversión propia, no para distribución o reventa.',
    accept: 'Acepto la declaración jurada',
    submit: 'Enviar Cuestionario',
    required: 'Campo obligatorio',
  },
  en: {
    title: 'Accredited Investor Questionnaire',
    subtitle: 'Rule 501(a) of Regulation D — Securities Act of 1933. This questionnaire determines whether you qualify as an "Accredited Investor".',
    confidential: 'Your responses are confidential and will be used solely to determine your eligibility.',

    s1: 'Investor Information',
    fullName: 'Full Legal Name',
    dob: 'Date of Birth',
    address: 'Principal Residence Address',
    citizenship: 'Citizenship / Country',
    email: 'Email Address',
    phone: 'Phone Number',
    investorType: 'Investor Type',
    individual: 'Individual',
    joint: 'Joint (with spouse)',
    entity: 'Entity (company, trust, fund)',

    s2: 'Accreditation Criteria — Natural Persons',
    s2desc: 'Check all that apply:',
    incomeIndividual: 'Individual income exceeding USD $200,000 in each of the last 2 years, with expectation of maintaining it.',
    incomeJoint: 'Joint income with spouse exceeding USD $300,000 in each of the last 2 years, with expectation of maintaining it.',
    netWorth: 'Net worth (individual or joint) exceeding USD $1,000,000, excluding primary residence.',
    professional: 'I hold a Series 7, Series 65, Series 82 license, or other SEC-designated certification.',
    insider: 'I am a director, executive officer, or general partner of Ancestro Inc.',
    knowledgeable: 'I am a knowledgeable employee of a private fund under the Investment Company Act.',

    s3: 'Accreditation Criteria — Entities',
    s3desc: 'If investing through an entity, check applicable criteria:',
    bank: 'Bank, broker-dealer, insurance company, or registered investment company.',
    benefitPlan: 'Employee benefit plan with total assets exceeding USD $5,000,000.',
    privateFund: 'Private fund or investment adviser with assets under management exceeding USD $5,000,000.',
    familyOffice: 'Family office with assets under management exceeding USD $5,000,000.',
    entityAssets: 'Corporation, LLC, trust or partnership with total assets exceeding USD $5,000,000.',
    allAccredited: 'Entity in which all equity owners are individually accredited investors.',

    s4: 'Due Diligence (AML)',
    sourceOfFunds: 'Source of funds to be invested',
    salary: 'Salary / Employment income',
    business: 'Business income',
    investments: 'Returns from prior investments',
    inheritance: 'Inheritance',
    savings: 'Personal savings',
    realEstate: 'Real estate sale',
    other: 'Other',
    specifyOther: 'Specify the source',
    pepQuestion: 'Are you or any close relative a Politically Exposed Person (PEP)?',
    pepHint: 'Public officials, diplomats, senior military officers, state enterprise executives, or direct family members.',
    yes: 'Yes',
    no: 'No',
    pepDetails: 'Describe the political relationship',
    usQuestion: 'Are you a US citizen or US tax resident?',
    usTaxId: 'SSN or ITIN',

    s5: 'Sworn Declaration',
    declaration: 'I declare that all information provided is true, correct, and complete. I understand that Ancestro Inc. relies on my responses to determine eligibility under Rule 506(b) of Regulation D. The securities to be acquired are restricted securities and may not be offered, sold, or transferred except pursuant to an applicable exemption. I am acquiring the securities for my own account for investment purposes only, not for distribution or resale.',
    accept: 'I accept the sworn declaration',
    submit: 'Submit Questionnaire',
    required: 'Required',
  },
  pt: {
    title: 'Questionário de Investidor Credenciado',
    subtitle: 'Regra 501(a) da Regulação D — Lei de Valores Mobiliários de 1933. Este questionário determina se você qualifica como "Investidor Credenciado".',
    confidential: 'Suas respostas são confidenciais e serão usadas somente para determinar sua elegibilidade.',

    s1: 'Informações do Investidor',
    fullName: 'Nome Legal Completo',
    dob: 'Data de Nascimento',
    address: 'Endereço de Residência Principal',
    citizenship: 'Cidadania / País',
    email: 'Email',
    phone: 'Telefone',
    investorType: 'Tipo de Investidor',
    individual: 'Individual',
    joint: 'Conjunto (com cônjuge)',
    entity: 'Entidade (empresa, trust, fundo)',

    s2: 'Critérios de Credenciamento — Pessoas Físicas',
    s2desc: 'Selecione todos os critérios aplicáveis:',
    incomeIndividual: 'Renda individual superior a USD $200.000 nos últimos 2 anos, com expectativa de manter.',
    incomeJoint: 'Renda conjunta com cônjuge superior a USD $300.000 nos últimos 2 anos, com expectativa de manter.',
    netWorth: 'Patrimônio líquido (individual ou conjunto) superior a USD $1.000.000, excluindo residência principal.',
    professional: 'Possuo licença Série 7, Série 65, Série 82, ou outra certificação designada pela SEC.',
    insider: 'Sou diretor, executivo ou sócio geral da Ancestro Inc.',
    knowledgeable: 'Sou funcionário qualificado de um fundo privado.',

    s3: 'Critérios de Credenciamento — Entidades',
    s3desc: 'Se investe através de uma entidade, selecione os critérios aplicáveis:',
    bank: 'Banco, corretora, seguradora ou empresa de investimento registrada.',
    benefitPlan: 'Plano de benefícios com ativos superiores a USD $5.000.000.',
    privateFund: 'Fundo privado com ativos sob gestão superiores a USD $5.000.000.',
    familyOffice: 'Family office com ativos sob gestão superiores a USD $5.000.000.',
    entityAssets: 'Corporação, LLC, trust ou sociedade com ativos superiores a USD $5.000.000.',
    allAccredited: 'Entidade onde todos os proprietários são investidores credenciados.',

    s4: 'Diligência Devida (AML)',
    sourceOfFunds: 'Origem dos fundos a investir',
    salary: 'Salário / Renda de trabalho',
    business: 'Renda de negócio próprio',
    investments: 'Retorno de investimentos anteriores',
    inheritance: 'Herança',
    savings: 'Poupança pessoal',
    realEstate: 'Venda de imóveis',
    other: 'Outro',
    specifyOther: 'Especifique a origem',
    pepQuestion: 'Você ou algum familiar próximo é uma Pessoa Politicamente Exposta (PEP)?',
    pepHint: 'Funcionários públicos, diplomatas, militares de alto escalão, executivos de empresas estatais ou familiares diretos.',
    yes: 'Sim',
    no: 'Não',
    pepDetails: 'Descreva a relação política',
    usQuestion: 'Você é cidadão ou residente fiscal dos Estados Unidos?',
    usTaxId: 'SSN ou ITIN',

    s5: 'Declaração Juramentada',
    declaration: 'Declaro que todas as informações fornecidas são verdadeiras, corretas e completas. Os valores a serem adquiridos são valores restritos e não podem ser oferecidos, vendidos ou transferidos exceto conforme uma isenção aplicável.',
    accept: 'Aceito a declaração juramentada',
    submit: 'Enviar Questionário',
    required: 'Obrigatório',
  },
};

const naturalPersonCriteria = ['incomeIndividual', 'incomeJoint', 'netWorth', 'professional', 'insider', 'knowledgeable'] as const;
const entityCriteria = ['bank', 'benefitPlan', 'privateFund', 'familyOffice', 'entityAssets', 'allAccredited'] as const;
const fundSources = ['salary', 'business', 'investments', 'inheritance', 'savings', 'realEstate', 'other'] as const;

export default function AmlQuestionnaire({ lang, onComplete }: AmlQuestionnaireProps) {
  const l = t[lang] || t.en;

  const [form, setForm] = useState<AmlData>({
    fullName: '', dateOfBirth: '', address: '', citizenship: '', email: '', phone: '',
    investorType: 'individual',
    accreditationCriteria: [],
    entityCriteria: [],
    acceptedRepresentations: false,
    sourceOfFunds: '',
    isPep: false,
    isUsCitizen: false,
  });

  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [step, setStep] = useState(1);

  function update(field: keyof AmlData, value: string | boolean | string[]) {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: false }));
  }

  function toggleCriteria(field: 'accreditationCriteria' | 'entityCriteria', value: string) {
    setForm(prev => {
      const arr = prev[field];
      return { ...prev, [field]: arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value] };
    });
  }

  function validateAndNext() {
    const errs: Record<string, boolean> = {};
    if (step === 1) {
      if (!form.fullName.trim()) errs.fullName = true;
      if (!form.dateOfBirth) errs.dateOfBirth = true;
      if (!form.address.trim()) errs.address = true;
      if (!form.citizenship.trim()) errs.citizenship = true;
      if (!form.email.trim() || !form.email.includes('@')) errs.email = true;
    }
    if (step === 2 && form.investorType !== 'entity') {
      if (form.accreditationCriteria.length === 0) errs.accreditationCriteria = true;
    }
    if (step === 2 && form.investorType === 'entity') {
      if (form.entityCriteria.length === 0) errs.entityCriteria = true;
    }
    if (step === 3) {
      if (!form.sourceOfFunds) errs.sourceOfFunds = true;
      if (form.sourceOfFunds === 'other' && !form.sourceOfFundsOther?.trim()) errs.sourceOfFundsOther = true;
      if (form.isPep && !form.pepDetails?.trim()) errs.pepDetails = true;
      if (form.isUsCitizen && !form.usTaxId?.trim()) errs.usTaxId = true;
    }
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    if (step < 4) setStep(step + 1);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.acceptedRepresentations) {
      setErrors({ acceptedRepresentations: true });
      return;
    }
    onComplete(form);
  }

  const fieldClass = (name: string) => `aq-input${errors[name] ? ' aq-input--error' : ''}`;

  return (
    <>
      <div className="aq-container">
        {/* Header */}
        <div className="aq-header">
          <p className="aq-badge">ANCESTRO INC. — Delaware C-Corporation</p>
          <h3 className="aq-title">{l.title}</h3>
          <p className="aq-subtitle">{l.subtitle}</p>
          <p className="aq-confidential">{l.confidential}</p>
        </div>

        {/* Progress */}
        <div className="aq-progress">
          {[1, 2, 3, 4].map(s => (
            <div key={s} className={`aq-progress-step${step >= s ? ' aq-progress-step--active' : ''}${step > s ? ' aq-progress-step--done' : ''}`}>
              <div className="aq-progress-num">{step > s ? '✓' : s}</div>
              <span className="aq-progress-label">
                {s === 1 ? l.s1.split(' ').slice(0, 2).join(' ') : s === 2 ? (lang === 'es' ? 'Acreditación' : 'Accreditation') : s === 3 ? 'AML' : (lang === 'es' ? 'Firma' : 'Sign')}
              </span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Investor Info */}
          {step === 1 && (
            <div className="aq-step">
              <h4 className="aq-section-title">{l.s1}</h4>
              <div className="aq-row">
                <div className="aq-field">
                  <label className="aq-label">{l.fullName} <span className="aq-req">*</span></label>
                  <input className={fieldClass('fullName')} value={form.fullName} onChange={e => update('fullName', e.target.value)} />
                </div>
                <div className="aq-field">
                  <label className="aq-label">{l.dob} <span className="aq-req">*</span></label>
                  <input className={fieldClass('dateOfBirth')} type="date" value={form.dateOfBirth} onChange={e => update('dateOfBirth', e.target.value)} />
                </div>
              </div>
              <div className="aq-field">
                <label className="aq-label">{l.address} <span className="aq-req">*</span></label>
                <input className={fieldClass('address')} value={form.address} onChange={e => update('address', e.target.value)} />
              </div>
              <div className="aq-row">
                <div className="aq-field">
                  <label className="aq-label">{l.citizenship} <span className="aq-req">*</span></label>
                  <input className={fieldClass('citizenship')} value={form.citizenship} onChange={e => update('citizenship', e.target.value)} />
                </div>
                <div className="aq-field">
                  <label className="aq-label">{l.email} <span className="aq-req">*</span></label>
                  <input className={fieldClass('email')} type="email" value={form.email} onChange={e => update('email', e.target.value)} />
                </div>
              </div>
              <div className="aq-row">
                <div className="aq-field">
                  <label className="aq-label">{l.phone}</label>
                  <input className="aq-input" value={form.phone} onChange={e => update('phone', e.target.value)} />
                </div>
                <div className="aq-field">
                  <label className="aq-label">{l.investorType}</label>
                  <div className="aq-radio-row">
                    {(['individual', 'joint', 'entity'] as const).map(type => (
                      <label key={type} className={`aq-chip${form.investorType === type ? ' aq-chip--active' : ''}`}>
                        <input type="radio" name="investorType" value={type} checked={form.investorType === type} onChange={() => update('investorType', type)} />
                        {l[type]}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <button type="button" className="aq-btn aq-btn--next" onClick={validateAndNext}>
                {lang === 'es' ? 'Siguiente' : lang === 'pt' ? 'Próximo' : 'Next'} →
              </button>
            </div>
          )}

          {/* Step 2: Accreditation */}
          {step === 2 && (
            <div className="aq-step">
              {form.investorType !== 'entity' ? (
                <>
                  <h4 className="aq-section-title">{l.s2}</h4>
                  <p className="aq-hint">{l.s2desc}</p>
                  <div className="aq-checks">
                    {naturalPersonCriteria.map(c => (
                      <label key={c} className={`aq-check${form.accreditationCriteria.includes(c) ? ' aq-check--active' : ''}`}>
                        <input type="checkbox" checked={form.accreditationCriteria.includes(c)} onChange={() => toggleCriteria('accreditationCriteria', c)} />
                        <span>{l[c]}</span>
                      </label>
                    ))}
                  </div>
                  {errors.accreditationCriteria && <p className="aq-error">{lang === 'es' ? 'Seleccione al menos un criterio' : 'Select at least one criterion'}</p>}
                </>
              ) : (
                <>
                  <h4 className="aq-section-title">{l.s3}</h4>
                  <p className="aq-hint">{l.s3desc}</p>
                  <div className="aq-checks">
                    {entityCriteria.map(c => (
                      <label key={c} className={`aq-check${form.entityCriteria.includes(c) ? ' aq-check--active' : ''}`}>
                        <input type="checkbox" checked={form.entityCriteria.includes(c)} onChange={() => toggleCriteria('entityCriteria', c)} />
                        <span>{l[c]}</span>
                      </label>
                    ))}
                  </div>
                  {errors.entityCriteria && <p className="aq-error">{lang === 'es' ? 'Seleccione al menos un criterio' : 'Select at least one criterion'}</p>}
                </>
              )}
              <div className="aq-nav">
                <button type="button" className="aq-btn aq-btn--back" onClick={() => setStep(1)}>← {lang === 'es' ? 'Anterior' : 'Back'}</button>
                <button type="button" className="aq-btn aq-btn--next" onClick={validateAndNext}>{lang === 'es' ? 'Siguiente' : 'Next'} →</button>
              </div>
            </div>
          )}

          {/* Step 3: AML / Due Diligence */}
          {step === 3 && (
            <div className="aq-step">
              <h4 className="aq-section-title">{l.s4}</h4>

              <div className="aq-field">
                <label className="aq-label">{l.sourceOfFunds} <span className="aq-req">*</span></label>
                <div className="aq-radio-row aq-radio-wrap">
                  {fundSources.map(s => (
                    <label key={s} className={`aq-chip${form.sourceOfFunds === s ? ' aq-chip--active' : ''}`}>
                      <input type="radio" name="sourceOfFunds" value={s} checked={form.sourceOfFunds === s} onChange={() => update('sourceOfFunds', s)} />
                      {l[s]}
                    </label>
                  ))}
                </div>
                {form.sourceOfFunds === 'other' && (
                  <input className={fieldClass('sourceOfFundsOther')} placeholder={l.specifyOther} value={form.sourceOfFundsOther || ''} onChange={e => update('sourceOfFundsOther', e.target.value)} style={{ marginTop: 8 }} />
                )}
              </div>

              <div className="aq-field">
                <label className="aq-label">{l.pepQuestion} <span className="aq-req">*</span></label>
                <p className="aq-hint">{l.pepHint}</p>
                <div className="aq-toggle-row">
                  <button type="button" className={`aq-toggle${form.isPep ? ' aq-toggle--warn' : ''}`} onClick={() => update('isPep', true)}>{l.yes}</button>
                  <button type="button" className={`aq-toggle${!form.isPep ? ' aq-toggle--active' : ''}`} onClick={() => update('isPep', false)}>{l.no}</button>
                </div>
                {form.isPep && (
                  <textarea className={fieldClass('pepDetails')} rows={2} placeholder={l.pepDetails} value={form.pepDetails || ''} onChange={e => update('pepDetails', e.target.value)} />
                )}
              </div>

              <div className="aq-field">
                <label className="aq-label">{l.usQuestion} <span className="aq-req">*</span></label>
                <div className="aq-toggle-row">
                  <button type="button" className={`aq-toggle${form.isUsCitizen ? ' aq-toggle--active' : ''}`} onClick={() => update('isUsCitizen', true)}>{l.yes}</button>
                  <button type="button" className={`aq-toggle${!form.isUsCitizen ? ' aq-toggle--active' : ''}`} onClick={() => update('isUsCitizen', false)}>{l.no}</button>
                </div>
                {form.isUsCitizen && (
                  <input className={fieldClass('usTaxId')} placeholder={l.usTaxId} value={form.usTaxId || ''} onChange={e => update('usTaxId', e.target.value)} />
                )}
              </div>

              <div className="aq-nav">
                <button type="button" className="aq-btn aq-btn--back" onClick={() => setStep(2)}>← {lang === 'es' ? 'Anterior' : 'Back'}</button>
                <button type="button" className="aq-btn aq-btn--next" onClick={validateAndNext}>{lang === 'es' ? 'Siguiente' : 'Next'} →</button>
              </div>
            </div>
          )}

          {/* Step 4: Declaration & Submit */}
          {step === 4 && (
            <div className="aq-step">
              <h4 className="aq-section-title">{l.s5}</h4>
              <div className="aq-declaration">
                <p className="aq-declaration-text">{l.declaration}</p>
                <label className={`aq-checkbox${errors.acceptedRepresentations ? ' aq-checkbox--error' : ''}`}>
                  <input type="checkbox" checked={form.acceptedRepresentations} onChange={e => update('acceptedRepresentations', e.target.checked)} />
                  <span>{l.accept}</span>
                </label>
              </div>
              <div className="aq-nav">
                <button type="button" className="aq-btn aq-btn--back" onClick={() => setStep(3)}>← {lang === 'es' ? 'Anterior' : 'Back'}</button>
                <button type="submit" className="aq-btn aq-btn--submit">{l.submit}</button>
              </div>
            </div>
          )}
        </form>
      </div>

      <style>{`
        .aq-container{margin-top:8px}
        .aq-header{text-align:center;margin-bottom:28px}
        .aq-badge{font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,255,255,0.35);margin:0 0 12px}
        .aq-title{font-size:22px;font-weight:700;color:#fff;margin:0 0 8px}
        .aq-subtitle{font-size:13px;color:rgba(255,255,255,0.45);line-height:1.6;margin:0 0 6px;max-width:500px;margin-left:auto;margin-right:auto}
        .aq-confidential{font-size:11px;color:rgba(248,176,59,0.5);margin:0}
        .aq-progress{display:flex;justify-content:center;gap:8px;margin-bottom:28px}
        .aq-progress-step{display:flex;align-items:center;gap:6px;opacity:0.3;transition:opacity 0.2s}
        .aq-progress-step--active{opacity:1}
        .aq-progress-num{width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;background:rgba(255,255,255,0.08);color:rgba(255,255,255,0.5)}
        .aq-progress-step--active .aq-progress-num{background:rgba(248,176,59,0.2);color:#f8b03b}
        .aq-progress-step--done .aq-progress-num{background:rgba(34,197,94,0.2);color:#22c55e}
        .aq-progress-label{font-size:11px;color:rgba(255,255,255,0.5);display:none}
        @media(min-width:600px){.aq-progress-label{display:block}}
        .aq-step{animation:aqFade 0.3s ease}
        @keyframes aqFade{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .aq-section-title{font-size:16px;font-weight:700;color:#fff;margin:0 0 16px;padding-bottom:12px;border-bottom:1px solid rgba(255,255,255,0.06)}
        .aq-hint{font-size:12px;color:rgba(255,255,255,0.35);line-height:1.5;margin:0 0 12px}
        .aq-field{display:flex;flex-direction:column;gap:6px;margin-bottom:16px}
        .aq-row{display:flex;gap:12px}
        .aq-row .aq-field{flex:1}
        .aq-label{font-size:13px;font-weight:600;color:rgba(255,255,255,0.7)}
        .aq-req{color:#f8b03b}
        .aq-input,.aq-container select,.aq-container textarea{width:100%;padding:11px 14px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:10px;color:#fff;font-size:14px;font-family:inherit;outline:none;transition:border-color 0.2s;box-sizing:border-box}
        .aq-input:focus,.aq-container textarea:focus{border-color:rgba(248,176,59,0.5)}
        .aq-input--error{border-color:#ef4444}
        .aq-input[type="date"]{color-scheme:dark}
        .aq-radio-row{display:flex;gap:8px;flex-wrap:wrap}
        .aq-radio-wrap{flex-wrap:wrap}
        .aq-chip{display:flex;align-items:center;gap:6px;padding:8px 14px;border:1px solid rgba(255,255,255,0.08);border-radius:10px;cursor:pointer;font-size:13px;color:rgba(255,255,255,0.6);transition:all 0.2s}
        .aq-chip input{display:none}
        .aq-chip:hover{border-color:rgba(255,255,255,0.2)}
        .aq-chip--active{border-color:rgba(248,176,59,0.4);background:rgba(248,176,59,0.06);color:#f8b03b}
        .aq-checks{display:flex;flex-direction:column;gap:8px;margin-bottom:12px}
        .aq-check{display:flex;align-items:flex-start;gap:10px;padding:12px 14px;border:1px solid rgba(255,255,255,0.06);border-radius:10px;cursor:pointer;font-size:13px;color:rgba(255,255,255,0.6);line-height:1.5;transition:all 0.2s}
        .aq-check input{width:16px;height:16px;accent-color:#f8b03b;margin-top:2px;flex-shrink:0}
        .aq-check:hover{border-color:rgba(255,255,255,0.15)}
        .aq-check--active{border-color:rgba(248,176,59,0.3);background:rgba(248,176,59,0.04);color:#fff}
        .aq-toggle-row{display:flex;gap:8px;margin-bottom:8px}
        .aq-toggle{padding:8px 20px;border:1px solid rgba(255,255,255,0.1);border-radius:10px;background:none;color:rgba(255,255,255,0.5);font-size:13px;font-weight:600;font-family:inherit;cursor:pointer;transition:all 0.2s}
        .aq-toggle--active{border-color:rgba(34,197,94,0.4);background:rgba(34,197,94,0.08);color:#22c55e}
        .aq-toggle--warn{border-color:rgba(234,179,8,0.4);background:rgba(234,179,8,0.08);color:#eab308}
        .aq-declaration{padding:16px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.08);border-radius:12px;margin-bottom:16px}
        .aq-declaration-text{font-size:12px;color:rgba(255,255,255,0.4);line-height:1.7;margin:0 0 14px}
        .aq-checkbox{display:flex;align-items:flex-start;gap:10px;cursor:pointer;font-size:14px;font-weight:600;color:#fff}
        .aq-checkbox input{width:18px;height:18px;accent-color:#f8b03b;margin-top:1px;flex-shrink:0}
        .aq-checkbox--error{color:#ef4444}
        .aq-error{color:#ef4444;font-size:12px;margin:4px 0 0}
        .aq-nav{display:flex;gap:12px;margin-top:20px}
        .aq-btn{padding:12px 24px;border:none;border-radius:10px;font-size:14px;font-weight:600;font-family:inherit;cursor:pointer;transition:all 0.2s}
        .aq-btn--next{flex:1;background:linear-gradient(135deg,#f8b03b,#e9a235);color:#000}
        .aq-btn--next:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(248,176,59,0.3)}
        .aq-btn--back{background:rgba(255,255,255,0.06);color:rgba(255,255,255,0.6);border:1px solid rgba(255,255,255,0.1)}
        .aq-btn--back:hover{background:rgba(255,255,255,0.1)}
        .aq-btn--submit{flex:1;background:linear-gradient(135deg,#22c55e,#16a34a);color:#fff;font-size:16px;padding:14px}
        .aq-btn--submit:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(34,197,94,0.3)}
        @media(max-width:480px){.aq-row{flex-direction:column}.aq-progress{gap:4px}.aq-title{font-size:18px}}
      `}</style>
    </>
  );
}
