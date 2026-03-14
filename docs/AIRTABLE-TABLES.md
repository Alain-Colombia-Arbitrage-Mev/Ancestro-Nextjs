# Airtable Tables — Ancestro

Base ID: `appdEXDVwhqL4Qb7D`

---

## Tabla 1: Contact Form (`tbl20K3JJzcUKhHOW`)

Recibe datos de `/contact`.

| Campo | Tipo Airtable | Descripción |
|-------|---------------|-------------|
| Contact Name | Single line text | Identificador del registro |
| Contact Reason | Single select | `Order Product`, `Request Quote`, `More Info`, `Chargers/Infrastructure`, `General` |
| Full Name | Single line text | Nombre completo |
| Email | Email | Correo electrónico |
| Phone | Phone number | Teléfono con código país |
| Message | Long text | Mensaje del usuario |
| Form Source | Single select | `website`, `mobile`, `referral` |
| Follow Up Status | Single select | `New`, `Contacted`, `In Progress`, `Closed` |
| Assigned Department | Single select | `Sales`, `Support`, `Engineering`, `Management` |
| Last Communication Date | Date | Última comunicación |
| Next Follow Up Date | Date | Próximo seguimiento |
| Notes | Long text | Notas internas del equipo |

---

## Tabla 2: Waitlist (`tblitYHGM7hwtDMhV`)

Recibe datos de `/waitlist`.

| Campo | Tipo Airtable | Descripción |
|-------|---------------|-------------|
| Waitlist Entry | Single line text | Identificador |
| Full Name | Single line text | Nombre completo |
| Email | Email | Correo electrónico |
| Phone | Phone number | Teléfono |
| Country of Residence | Single select | `Colombia`, `Mexico`, `Brazil`, `Argentina`, `Chile`, `Peru`, `Panama`, `Costa Rica`, `Ecuador`, `Uruguay`, `Guatemala`, `El Salvador`, `Honduras`, `Nicaragua`, `Dominican Republic`, `Bolivia`, `Paraguay`, `Venezuela`, `United States`, `Spain`, `Other` |
| Accepted Terms | Checkbox | Aceptó términos |
| Form Source | Single select | `website`, `mobile`, `referral` |
| Waitlist Status | Single select | `Pending`, `Approved`, `Invited`, `Active`, `Declined` |
| Assigned Department | Single select | `Sales`, `Onboarding`, `Management` |
| Date Submitted | Date | Fecha de envío |
| Notes | Long text | Notas internas |

---

## Tabla 3: Investment Requests (`tblyFmTnqH1SLrgmD`)

Recibe datos de `/invest` (formulario de solicitud de inversión).

| Campo | Tipo Airtable | Descripción |
|-------|---------------|-------------|
| Investment Request | Single line text | Identificador |
| Full Name | Single line text | Nombre completo |
| Email | Email | Correo electrónico |
| Phone | Phone number | Teléfono |
| Investment Range USD | Single select | `$2,000-$5,000`, `$5,000-$20,000`, `$20,000-$50,000`, `$50,000+` |
| Message | Long text | Mensaje del inversionista |
| Form Source | Single select | `website`, `invest-page` |
| Follow Up Status | Single select | `New`, `Contacted`, `Negotiating`, `Committed`, `Closed` |
| Assigned To | Single line text | Persona asignada |
| Submission Date | Date | Fecha de envío |
| Department Notified | Single select | `Investor Relations`, `Legal`, `Management` |
| Notes | Long text | Notas internas |

---

## Tabla 4: Investor Onboarding (NUEVA — crear manualmente)

Almacena el cuestionario SEC 501(a) + AML de cada inversionista.

**Nombre de la tabla**: `Investor Onboarding`

### Sección 1: Información del Inversionista

| Campo | Tipo Airtable | Descripción |
|-------|---------------|-------------|
| Record ID | Autonumber | ID automático |
| Full Legal Name | Single line text | Nombre legal completo |
| Date of Birth | Date | Fecha de nacimiento |
| Address | Long text | Dirección de residencia principal |
| Citizenship | Single line text | Ciudadanía / país |
| Email | Email | Correo electrónico |
| Phone | Phone number | Teléfono |
| Investor Type | Single select | `Individual`, `Joint`, `Entity` |

### Sección 2: Criterios de Acreditación

| Campo | Tipo Airtable | Descripción |
|-------|---------------|-------------|
| Income Individual 200K | Checkbox | Ingreso individual > $200K últimos 2 años |
| Income Joint 300K | Checkbox | Ingreso conjunto > $300K últimos 2 años |
| Net Worth 1M | Checkbox | Patrimonio neto > $1M (excl. residencia) |
| Professional Cert | Checkbox | Licencia Serie 7/65/82 u otra SEC |
| Company Insider | Checkbox | Director/ejecutivo/socio de Ancestro |
| Knowledgeable Employee | Checkbox | Empleado calificado de fondo privado |
| Entity - Financial Institution | Checkbox | Banco, broker, aseguradora registrada |
| Entity - Benefit Plan 5M | Checkbox | Plan de beneficios > $5M |
| Entity - Private Fund 5M | Checkbox | Fondo privado o asesor > $5M AUM |
| Entity - Family Office 5M | Checkbox | Family office > $5M AUM |
| Entity - Assets 5M | Checkbox | Corp/LLC/trust > $5M activos |
| Entity - All Accredited | Checkbox | Todos los propietarios son acreditados |

### Sección 3: Debida Diligencia (AML)

| Campo | Tipo Airtable | Descripción |
|-------|---------------|-------------|
| Source of Funds | Single select | `Salary`, `Business`, `Investments`, `Inheritance`, `Savings`, `Real Estate`, `Other` |
| Source Other Detail | Single line text | Si seleccionó "Other" |
| Is PEP | Checkbox | Persona Políticamente Expuesta |
| PEP Details | Long text | Detalles de la relación política |
| Is US Citizen | Checkbox | Ciudadano o residente fiscal USA |
| US Tax ID | Single line text | SSN / ITIN |

### Sección 4: Estado y Revisión

| Campo | Tipo Airtable | Descripción |
|-------|---------------|-------------|
| KYC Status | Single select | `Not Started`, `Pending`, `Verified`, `Rejected` |
| KYC Verification ID | Single line text | ID de verificación MetaMap |
| KYC Completed Date | Date | Fecha de verificación KYC |
| AML Status | Single select | `Not Started`, `Pending Review`, `Approved`, `Flagged`, `Rejected` |
| AML Completed Date | Date | Fecha de envío AML |
| Declaration Accepted | Checkbox | Aceptó declaración jurada |
| Accreditation Status | Single select | `Pending`, `Accredited`, `Not Accredited`, `Requires Review` |
| Reviewed By | Single line text | Nombre del revisor |
| Review Date | Date | Fecha de revisión |
| Review Notes | Long text | Notas del equipo de compliance |
| Submission Date | Created time | Fecha de creación automática |

---

## Cómo crear la tabla en Airtable

1. Abre tu base: `https://airtable.com/appdEXDVwhqL4Qb7D`
2. Click **+ Add a table** → nombre: `Investor Onboarding`
3. Agrega cada campo con el tipo especificado arriba
4. Para campos **Single select**, agrega las opciones listadas
5. Para campos **Checkbox**, solo créalos como checkbox
6. Guarda el **Table ID** (click en la tabla → Help → API docs → busca el ID `tblXXXXX`)
7. Agrega el Table ID a `.env.local`:
   ```
   AIRTABLE_INVESTOR_ONBOARDING=tblXXXXXXXXXXXXX
   ```

---

## Vistas sugeridas

### Vista 1: "Pipeline" (Kanban)
- Agrupado por: `Accreditation Status`
- Columnas: Pending → Accredited → Not Accredited → Requires Review

### Vista 2: "Flagged for Review" (Grid filtrada)
- Filtro: `AML Status` = `Flagged` OR `Is PEP` = checked OR `Is US Citizen` = checked
- Ordenado por: Submission Date (más reciente primero)

### Vista 3: "Completed" (Grid filtrada)
- Filtro: `KYC Status` = `Verified` AND `AML Status` = `Approved`
- Ordenado por: Submission Date
