# Cambios necesarios en Airtable y RDS

## Resumen

Los formularios de **Contact** y **Waitlist** no cambiaron — ya guardan correctamente en ambos.

El formulario de **Invest** cambió significativamente: ahora incluye el cuestionario SEC 501(a) + AML (KYC se maneja via MetaMap/Lambda separado). Los datos del cuestionario deben guardarse en Airtable y RDS.

**No necesitas crear endpoints nuevos en API Gateway.** Los API routes de Next.js (`/api/contact`, `/api/waitlist`, `/api/invest`) se despliegan con Amplify. Solo la Lambda de KYC webhook usa API Gateway.

---

## 1. Tablas que NO cambian

### Contact (`contacts` en RDS / `tbl20K3JJzcUKhHOW` en Airtable)
Sin cambios. Los campos actuales son suficientes.

### Waitlist (`waitlist` en RDS / `tblitYHGM7hwtDMhV` en Airtable)
Sin cambios. También se usa para Join.

---

## 2. Investment Requests — Cambios necesarios

### 2.1 RDS: Alterar tabla `investment_requests`

Ejecutar en PostgreSQL:

```sql
-- Añadir campos del cuestionario SEC 501(a) + AML
ALTER TABLE investment_requests
  -- Investor Info (Sección 1)
  ADD COLUMN IF NOT EXISTS date_of_birth DATE,
  ADD COLUMN IF NOT EXISTS address TEXT,
  ADD COLUMN IF NOT EXISTS citizenship VARCHAR(100),
  ADD COLUMN IF NOT EXISTS investor_type VARCHAR(20), -- individual / joint / entity

  -- Accreditation Criteria (Sección 2)
  ADD COLUMN IF NOT EXISTS accreditation_criteria TEXT[], -- array de criterios seleccionados
  ADD COLUMN IF NOT EXISTS entity_criteria TEXT[],       -- array de criterios de entidad

  -- AML Due Diligence (Sección 3)
  ADD COLUMN IF NOT EXISTS source_of_funds VARCHAR(50),
  ADD COLUMN IF NOT EXISTS source_of_funds_other TEXT,
  ADD COLUMN IF NOT EXISTS is_pep BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS pep_details TEXT,
  ADD COLUMN IF NOT EXISTS is_us_citizen BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS us_tax_id VARCHAR(50),

  -- Declaration (Sección 4)
  ADD COLUMN IF NOT EXISTS declaration_accepted BOOLEAN DEFAULT FALSE,

  -- Review
  ADD COLUMN IF NOT EXISTS accreditation_status VARCHAR(20) DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS reviewed_by TEXT,
  ADD COLUMN IF NOT EXISTS review_date TIMESTAMP,
  ADD COLUMN IF NOT EXISTS review_notes TEXT;
```

### 2.2 Airtable: Editar tabla Investment Requests (`tblyFmTnqH1SLrgmD`)

Agregar estos campos a la tabla existente:

| Campo nuevo | Tipo Airtable | Opciones |
|-------------|---------------|----------|
| Date of Birth | Date | |
| Address | Long text | |
| Citizenship | Single line text | |
| Investor Type | Single select | `Individual`, `Joint`, `Entity` |
| Income Individual 200K | Checkbox | |
| Income Joint 300K | Checkbox | |
| Net Worth 1M | Checkbox | |
| Professional Cert | Checkbox | |
| Company Insider | Checkbox | |
| Knowledgeable Employee | Checkbox | |
| Entity Financial Institution | Checkbox | |
| Entity Benefit Plan 5M | Checkbox | |
| Entity Private Fund 5M | Checkbox | |
| Entity Family Office 5M | Checkbox | |
| Entity Assets 5M | Checkbox | |
| Entity All Accredited | Checkbox | |
| Source of Funds | Single select | `Salary`, `Business`, `Investments`, `Inheritance`, `Savings`, `Real Estate`, `Other` |
| Source Other Detail | Single line text | |
| Is PEP | Checkbox | |
| PEP Details | Long text | |
| Is US Citizen | Checkbox | |
| US Tax ID | Single line text | |
| Declaration Accepted | Checkbox | |
| Accreditation Status | Single select | `Pending`, `Accredited`, `Not Accredited`, `Requires Review` |
| Reviewed By | Single line text | |
| Review Date | Date | |
| Review Notes | Long text | |

**Los campos existentes no se tocan:** Investment Request, Full Name, Email, Phone, Investment Range USD, Message, Form Source, Follow Up Status, Assigned To, Submission Date, Department Notified, Notes.

---

## 3. Cambio en el endpoint `/api/invest`

El endpoint actual guarda los campos básicos (name, email, phone, amount, message). Necesita actualizarse para incluir los datos del cuestionario SEC 501(a) + AML.

### Datos que el frontend envía ahora:

```typescript
// Campos básicos del formulario de inversión (ya existentes)
{
  name: string,
  email: string,
  phone: string,
  amount: string,      // investment range
  message: string,
}

// Campos del cuestionario AML (nuevos, enviados via /api/kyc/aml por la Lambda)
{
  fullName: string,
  dateOfBirth: string,
  address: string,
  citizenship: string,
  investorType: 'individual' | 'joint' | 'entity',
  accreditationCriteria: string[],   // ['incomeIndividual', 'netWorth', ...]
  entityCriteria: string[],          // ['bank', 'privateFund', ...]
  sourceOfFunds: string,
  sourceOfFundsOther?: string,
  isPep: boolean,
  pepDetails?: string,
  isUsCitizen: boolean,
  usTaxId?: string,
  acceptedRepresentations: boolean,
}
```

### Flujo actual de datos:

```
1. Usuario llena cuestionario SEC 501(a) + AML
   └── InvestorOnboarding → AmlQuestionnaire → onComplete(data)
       └── handleAmlComplete() → POST /api/kyc/aml (Lambda)
           └── Guarda en investor_profiles (RDS via Lambda)

2. Usuario llena formulario de inversión (name, email, amount)
   └── InvestPage → handleFormSubmit() → POST /api/invest (Next.js API)
       └── Guarda en investment_requests (RDS) + Airtable
```

**El cuestionario y el formulario son 2 envíos separados.** El cuestionario va a la Lambda KYC (investor_profiles), el formulario va al API route de Next.js (investment_requests + Airtable).

### Opción recomendada: Guardar el cuestionario también en Airtable

Modificar `handleAmlComplete` en `InvestorOnboarding.tsx` para que además de llamar a la Lambda, guarde en Airtable via un nuevo endpoint `/api/investor-onboarding`.

---

## 4. Nuevo endpoint: POST /api/investor-onboarding

Este endpoint recibe los datos del cuestionario SEC 501(a) y los guarda en:
- **Airtable**: tabla Investment Requests (campos nuevos)
- **RDS**: tabla investment_requests (campos nuevos)

### Archivo: `src/app/api/investor-onboarding/route.ts`

```typescript
// Este endpoint guarda el cuestionario completo en Airtable y RDS
// Se llama desde InvestorOnboarding.tsx cuando el usuario completa el AML
POST /api/investor-onboarding
Body: { fullName, dateOfBirth, address, citizenship, email, investorType,
        accreditationCriteria, entityCriteria, sourceOfFunds, isPep, isUsCitizen, ... }
```

---

## 5. Checklist de implementación

### En Airtable (manual en dashboard):
- [ ] Abrir tabla `Investment Requests` (`tblyFmTnqH1SLrgmD`)
- [ ] Agregar los 17 campos nuevos listados en sección 2.2
- [ ] Crear vista "Requires Review" filtrada por `Accreditation Status = Requires Review`
- [ ] Crear vista "PEP/US Citizens" filtrada por `Is PEP = true OR Is US Citizen = true`

### En RDS (ejecutar SQL):
- [ ] Ejecutar el ALTER TABLE de sección 2.1 en tu PostgreSQL

### En el código (ya implementado o por implementar):
- [ ] Crear endpoint `/api/investor-onboarding` (guarda cuestionario en Airtable + RDS)
- [ ] Modificar `InvestorOnboarding.tsx` para llamar al nuevo endpoint
- [ ] El endpoint `/api/invest` existente sigue igual (guarda el formulario básico)

### En Amplify (env vars):
- [ ] Verificar que `AIRTABLE_TOKEN`, `AIRTABLE_BASE_ID`, `AIRTABLE_INVEST_FORM` estén configurados
- [ ] Verificar que `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` estén configurados

---

## 6. Resumen visual

```
┌─────────────────────────────────────────────────┐
│              Página /invest                      │
├─────────────────────────────────────────────────┤
│                                                  │
│  1. Access Gate (contraseña)                     │
│           ▼                                      │
│  2. Pitch Deck (visible)                         │
│           ▼                                      │
│  3. Investor Onboarding                          │
│     ├── KYC (MetaMap) → Lambda webhook → RDS     │
│     └── AML Questionnaire (SEC 501a)             │
│              │                                   │
│              ├── POST /api/investor-onboarding    │
│              │     ├── → Airtable (Investment     │
│              │     │     Requests, campos nuevos) │
│              │     └── → RDS (investment_requests │
│              │           campos nuevos)           │
│              │                                   │
│              └── POST Lambda /kyc/aml             │
│                    └── → RDS (investor_profiles)  │
│           ▼                                      │
│  4. Formulario de Inversión (name, email, amount)│
│     └── POST /api/invest                         │
│           ├── → Airtable (campos básicos)        │
│           └── → RDS (investment_requests básico) │
│                                                  │
└─────────────────────────────────────────────────┘
```
