# Airtable — Tablas y campos

Base ID: `appdEXDVwhqL4Qb7D`

## Tablas existentes (sin cambios)

### Contact Form (`tbl20K3JJzcUKhHOW`)
Contact Name, Contact Reason, Full Name, Email, Phone, Message, Form Source, Follow Up Status, Assigned Department, Last Communication Date, Next Follow Up Date, Notes

### Waitlist (`tblitYHGM7hwtDMhV`)
Waitlist Entry, Full Name, Email, Phone, Country of Residence, Accepted Terms, Form Source, Waitlist Status, Assigned Department, Date Submitted, Notes

## Tabla a editar: Investment Requests (`tblyFmTnqH1SLrgmD`)

### Campos existentes (no tocar)
Investment Request, Full Name, Email, Phone, Investment Range USD, Message, Form Source, Follow Up Status, Assigned To, Submission Date, Department Notified, Notes

### Campos nuevos a agregar

**Información del inversionista:**

| Campo | Tipo | Opciones |
|-------|------|----------|
| Date of Birth | Date | |
| Address | Long text | |
| Citizenship | Single line text | |
| Investor Type | Single select | `Individual`, `Joint`, `Entity` |

**Criterios de acreditación SEC 501(a):**

| Campo | Tipo |
|-------|------|
| Income Individual 200K | Checkbox |
| Income Joint 300K | Checkbox |
| Net Worth 1M | Checkbox |
| Professional Cert | Checkbox |
| Company Insider | Checkbox |
| Knowledgeable Employee | Checkbox |
| Entity Financial Institution | Checkbox |
| Entity Benefit Plan 5M | Checkbox |
| Entity Private Fund 5M | Checkbox |
| Entity Family Office 5M | Checkbox |
| Entity Assets 5M | Checkbox |
| Entity All Accredited | Checkbox |

**AML / Due Diligence:**

| Campo | Tipo | Opciones |
|-------|------|----------|
| Source of Funds | Single select | `Salary`, `Business`, `Investments`, `Inheritance`, `Savings`, `Real Estate`, `Other` |
| Source Other Detail | Single line text | |
| Is PEP | Checkbox | |
| PEP Details | Long text | |
| Is US Citizen | Checkbox | |
| US Tax ID | Single line text | |

**Estado:**

| Campo | Tipo | Opciones |
|-------|------|----------|
| Declaration Accepted | Checkbox | |
| Accreditation Status | Single select | `Pending`, `Accredited`, `Not Accredited`, `Requires Review` |
| Reviewed By | Single line text | |
| Review Date | Date | |
| Review Notes | Long text | |

### Vistas sugeridas

- **Pipeline** (Kanban): Agrupado por `Accreditation Status`
- **Flagged** (Grid): Filtro `Is PEP = true OR Is US Citizen = true`
- **Completed** (Grid): Filtro `Accreditation Status = Accredited`
