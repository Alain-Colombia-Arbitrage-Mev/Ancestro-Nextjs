# Endpoints necesarios en NestJS (EC2)

## Arquitectura final

```
Frontend (Amplify)
    │
    ├── POST /api/contact           ──┐
    ├── POST /api/waitlist           ──┤
    ├── POST /api/join               ──┤──► NestJS (EC2) ──► RDS + Airtable
    ├── POST /api/invest             ──┤
    ├── POST /api/investor-onboarding ─┤
    ├── GET  /api/kyc/status         ──┘
    │
MetaMap webhook
    └── POST /kyc/webhook ──► API Gateway ──► Lambda ──► RDS
```

**Next.js API routes**: Se eliminan del frontend. Todo va al NestJS.
**Lambda**: Solo para el webhook de MetaMap (ya documentado).

---

## Módulos a crear en NestJS

```
src/
├── forms/
│   ├── forms.module.ts
│   ├── forms.controller.ts
│   ├── forms.service.ts
│   └── dto/
│       ├── contact.dto.ts
│       ├── waitlist.dto.ts
│       ├── join.dto.ts
│       └── invest.dto.ts
│
├── investor-onboarding/
│   ├── investor-onboarding.module.ts
│   ├── investor-onboarding.controller.ts
│   ├── investor-onboarding.service.ts
│   └── dto/
│       └── investor-onboarding.dto.ts
│
├── kyc/
│   ├── kyc.module.ts
│   ├── kyc.controller.ts
│   └── kyc.service.ts
│
└── common/
    └── airtable.service.ts
```

---

## 1. Servicio común: Airtable

### `src/common/airtable.service.ts`

```typescript
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AirtableService {
  private readonly logger = new Logger(AirtableService.name);
  private readonly token = process.env.AIRTABLE_TOKEN;
  private readonly baseId = process.env.AIRTABLE_BASE_ID;

  async createRecord(tableId: string, fields: Record<string, unknown>): Promise<boolean> {
    if (!this.token || !this.baseId) {
      this.logger.warn('Airtable not configured, skipping');
      return false;
    }

    try {
      const res = await fetch(`https://api.airtable.com/v0/${this.baseId}/${tableId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ records: [{ fields }] }),
      });

      if (!res.ok) {
        const err = await res.text();
        this.logger.error(`Airtable error: ${res.status} ${err}`);
        return false;
      }
      return true;
    } catch (err) {
      this.logger.error('Airtable request failed', err);
      return false;
    }
  }
}
```

### `src/common/common.module.ts`

```typescript
import { Global, Module } from '@nestjs/common';
import { AirtableService } from './airtable.service';

@Global()
@Module({
  providers: [AirtableService],
  exports: [AirtableService],
})
export class CommonModule {}
```

Registrar en `app.module.ts`:
```typescript
imports: [CommonModule, ...]
```

---

## 2. Módulo Forms (contact, waitlist, join)

### `src/forms/dto/contact.dto.ts`

```typescript
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ContactDto {
  @IsString() @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString() @IsOptional()
  phone?: string;

  @IsString() @IsOptional()
  contactType?: string;

  @IsString() @IsNotEmpty()
  message: string;
}
```

### `src/forms/dto/waitlist.dto.ts`

```typescript
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class WaitlistDto {
  @IsString() @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString() @IsOptional()
  phone?: string;

  @IsString() @IsOptional()
  country?: string;
}
```

### `src/forms/dto/join.dto.ts`

```typescript
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class JoinDto {
  @IsString() @IsNotEmpty()
  profile: string;

  @IsString() @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString() @IsNotEmpty()
  phone: string;

  @IsString() @IsNotEmpty()
  country: string;

  @IsString() @IsOptional()
  company?: string;

  @IsString() @IsOptional()
  city?: string;

  @IsString() @IsOptional()
  investment?: string;

  @IsString() @IsOptional()
  experience?: string;

  @IsString() @IsOptional()
  message?: string;

  @IsString() @IsOptional()
  lang?: string;
}
```

### `src/forms/dto/invest.dto.ts`

```typescript
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class InvestDto {
  @IsString() @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString() @IsOptional()
  phone?: string;

  @IsString() @IsNotEmpty()
  amount: string;

  @IsString() @IsOptional()
  message?: string;
}
```

### `src/forms/forms.service.ts`

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AirtableService } from '../common/airtable.service';
import { ContactDto } from './dto/contact.dto';
import { WaitlistDto } from './dto/waitlist.dto';
import { JoinDto } from './dto/join.dto';
import { InvestDto } from './dto/invest.dto';

@Injectable()
export class FormsService {
  private readonly logger = new Logger(FormsService.name);

  constructor(
    private readonly airtable: AirtableService,
    @InjectRepository(/* ver nota abajo */)
  ) {}

  // ── CONTACT ────────────────────────────────────────────────────────

  async submitContact(dto: ContactDto) {
    const department = dto.contactType === 'charger' ? 'Engineering' : 'Sales';
    const label = `${dto.name} - ${this.today()}`;

    // RDS
    await this.rawQuery(
      `INSERT INTO contacts (contact_name, contact_reason, full_name, email, phone, message, form_source, follow_up_status, assigned_department)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [label, dto.contactType || 'general', dto.name, dto.email, dto.phone || '', dto.message, 'website', 'New', department],
    );

    // Airtable
    await this.airtable.createRecord(process.env.AIRTABLE_CONTACT_FORM, {
      'Contact Name': label,
      'Contact Reason': dto.contactType || 'General',
      'Full Name': dto.name,
      'Email': dto.email,
      'Phone': dto.phone || '',
      'Message': dto.message,
      'Form Source': 'website',
      'Follow Up Status': 'New',
      'Assigned Department': department,
    });

    this.logger.log(`Contact submitted: ${dto.email}`);
    return { success: true };
  }

  // ── WAITLIST ───────────────────────────────────────────────────────

  async submitWaitlist(dto: WaitlistDto) {
    const label = `${dto.name} - ${this.today()}`;

    // RDS
    await this.rawQuery(
      `INSERT INTO waitlist (waitlist_entry, full_name, email, phone, country_of_residence, accepted_terms, form_source, waitlist_status, date_submitted)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())`,
      [label, dto.name, dto.email, dto.phone || '', dto.country || '', true, 'website', 'Pending'],
    );

    // Airtable
    await this.airtable.createRecord(process.env.AIRTABLE_WAITLIST_FORM, {
      'Waitlist Entry': label,
      'Full Name': dto.name,
      'Email': dto.email,
      'Phone': dto.phone || '',
      'Country of Residence': dto.country || '',
      'Accepted Terms': true,
      'Form Source': 'website',
      'Waitlist Status': 'Pending',
      'Date Submitted': this.today(),
    });

    this.logger.log(`Waitlist submitted: ${dto.email}`);
    return { success: true };
  }

  // ── JOIN ───────────────────────────────────────────────────────────

  async submitJoin(dto: JoinDto) {
    const label = `[${dto.profile}] ${dto.name} - ${this.today()}`;
    const notes = [
      `Profile: ${dto.profile}`,
      dto.company ? `Company: ${dto.company}` : '',
      dto.city ? `City: ${dto.city}` : '',
      dto.investment ? `Investment: ${dto.investment}` : '',
      dto.experience ? `Experience: ${dto.experience}` : '',
      dto.message ? `Message: ${dto.message}` : '',
      `Lang: ${dto.lang || 'es'}`,
    ].filter(Boolean).join('\n');

    // RDS
    await this.rawQuery(
      `INSERT INTO waitlist (waitlist_entry, full_name, email, phone, country_of_residence, accepted_terms, form_source, waitlist_status, date_submitted, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), $9)`,
      [label, dto.name, dto.email, dto.phone, dto.country, true, 'join-page', 'Pending', notes],
    );

    // Airtable
    await this.airtable.createRecord(process.env.AIRTABLE_WAITLIST_FORM, {
      'Waitlist Entry': label,
      'Full Name': dto.name,
      'Email': dto.email,
      'Phone': dto.phone,
      'Country of Residence': dto.country,
      'Form Source': 'join-page',
      'Waitlist Status': 'Pending',
      'Date Submitted': this.today(),
      'Notes': notes,
    });

    this.logger.log(`Join submitted: ${dto.email} [${dto.profile}]`);
    return { success: true };
  }

  // ── INVEST (formulario básico) ─────────────────────────────────────

  async submitInvest(dto: InvestDto) {
    const label = `${dto.name} - ${dto.amount} - ${this.today()}`;

    // RDS
    await this.rawQuery(
      `INSERT INTO investment_requests (investment_request, full_name, email, phone, investment_range_usd, message, form_source, follow_up_status, submission_date, department_notified)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), $9)`,
      [label, dto.name, dto.email, dto.phone || '', dto.amount, dto.message || '', 'invest-page', 'New', 'Investor Relations'],
    );

    // Airtable
    await this.airtable.createRecord(process.env.AIRTABLE_INVEST_FORM, {
      'Investment Request': label,
      'Full Name': dto.name,
      'Email': dto.email,
      'Phone': dto.phone || '',
      'Investment Range USD': dto.amount,
      'Message': dto.message || '',
      'Form Source': 'invest-page',
      'Follow Up Status': 'New',
      'Submission Date': this.today(),
      'Department Notified': 'Investor Relations',
    });

    this.logger.log(`Invest submitted: ${dto.email} ${dto.amount}`);
    return { success: true };
  }

  // ── Helpers ────────────────────────────────────────────────────────

  private today(): string {
    return new Date().toISOString().split('T')[0];
  }

  /**
   * NOTA: Reemplaza esto con tu método de acceso a DB.
   * Si usas TypeORM: this.dataSource.query(sql, params)
   * Si usas raw pg: this.pool.query(sql, params)
   */
  private async rawQuery(sql: string, params: unknown[]): Promise<void> {
    // Opción A: TypeORM DataSource
    // await this.dataSource.query(sql, params);

    // Opción B: Inyectar DataSource en el constructor
    // constructor(@InjectDataSource() private dataSource: DataSource) {}

    // Por ahora placeholder — adapta a tu setup:
    this.logger.log(`DB query: ${sql.substring(0, 60)}...`);
  }
}
```

**IMPORTANTE**: Reemplaza `rawQuery` con tu método de acceso a DB. Si usas TypeORM:

```typescript
import { DataSource } from 'typeorm';

constructor(
  private readonly airtable: AirtableService,
  private readonly dataSource: DataSource,
) {}

private async rawQuery(sql: string, params: unknown[]): Promise<void> {
  await this.dataSource.query(sql, params);
}
```

### `src/forms/forms.controller.ts`

```typescript
import { Body, Controller, Post } from '@nestjs/common';
import { FormsService } from './forms.service';
import { ContactDto } from './dto/contact.dto';
import { WaitlistDto } from './dto/waitlist.dto';
import { JoinDto } from './dto/join.dto';
import { InvestDto } from './dto/invest.dto';

@Controller('api')
export class FormsController {
  constructor(private readonly formsService: FormsService) {}

  @Post('contact')
  async contact(@Body() dto: ContactDto) {
    return this.formsService.submitContact(dto);
  }

  @Post('waitlist')
  async waitlist(@Body() dto: WaitlistDto) {
    return this.formsService.submitWaitlist(dto);
  }

  @Post('join')
  async join(@Body() dto: JoinDto) {
    return this.formsService.submitJoin(dto);
  }

  @Post('invest')
  async invest(@Body() dto: InvestDto) {
    return this.formsService.submitInvest(dto);
  }
}
```

### `src/forms/forms.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { FormsController } from './forms.controller';
import { FormsService } from './forms.service';

@Module({
  controllers: [FormsController],
  providers: [FormsService],
})
export class FormsModule {}
```

---

## 3. Módulo Investor Onboarding (SEC 501a + AML)

### `src/investor-onboarding/dto/investor-onboarding.dto.ts`

```typescript
import {
  IsArray, IsBoolean, IsEmail, IsNotEmpty, IsOptional,
  IsString, MaxLength, ValidateIf,
} from 'class-validator';

export class InvestorOnboardingDto {
  // Section 1: Investor Info
  @IsString() @IsNotEmpty()
  fullName: string;

  @IsString() @IsOptional()
  dateOfBirth?: string;

  @IsString() @IsOptional()
  address?: string;

  @IsString() @IsOptional()
  citizenship?: string;

  @IsEmail()
  email: string;

  @IsString() @IsOptional()
  phone?: string;

  @IsString() @IsNotEmpty()
  investorType: string; // individual / joint / entity

  // Section 2: Accreditation
  @IsArray()
  accreditationCriteria: string[];

  @IsArray()
  entityCriteria: string[];

  // Section 3: AML
  @IsString() @IsNotEmpty()
  sourceOfFunds: string;

  @IsString() @IsOptional()
  sourceOfFundsOther?: string;

  @IsBoolean()
  isPep: boolean;

  @ValidateIf(o => o.isPep)
  @IsString() @MaxLength(1000)
  pepDetails?: string;

  @IsBoolean()
  isUsCitizen: boolean;

  @ValidateIf(o => o.isUsCitizen)
  @IsString() @MaxLength(20)
  usTaxId?: string;

  // Section 4: Declaration
  @IsBoolean()
  acceptedRepresentations: boolean;
}
```

### `src/investor-onboarding/investor-onboarding.service.ts`

```typescript
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AirtableService } from '../common/airtable.service';
import { InvestorOnboardingDto } from './dto/investor-onboarding.dto';

@Injectable()
export class InvestorOnboardingService {
  private readonly logger = new Logger(InvestorOnboardingService.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly airtable: AirtableService,
  ) {}

  async submit(dto: InvestorOnboardingDto) {
    if (!dto.acceptedRepresentations) {
      throw new BadRequestException('Declaration must be accepted');
    }

    const flagged = dto.isPep || dto.isUsCitizen;
    const status = flagged ? 'Requires Review' : 'Pending';
    const label = `[SEC501a] ${dto.fullName} - ${this.today()}`;

    // ── Save to RDS ──────────────────────────────────────────────
    await this.dataSource.query(
      `INSERT INTO investment_requests (
        investment_request, full_name, email, phone,
        date_of_birth, address, citizenship, investor_type,
        accreditation_criteria, entity_criteria,
        source_of_funds, source_of_funds_other,
        is_pep, pep_details, is_us_citizen, us_tax_id,
        declaration_accepted, accreditation_status,
        form_source, follow_up_status, submission_date, department_notified
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,NOW(),$21
      )`,
      [
        label, dto.fullName, dto.email, dto.phone || '',
        dto.dateOfBirth || null, dto.address || '', dto.citizenship || '',
        dto.investorType,
        dto.accreditationCriteria, dto.entityCriteria,
        dto.sourceOfFunds, dto.sourceOfFundsOther || null,
        dto.isPep, dto.pepDetails || null,
        dto.isUsCitizen, dto.usTaxId || null,
        true, status,
        'invest-questionnaire', 'New', 'Investor Relations',
      ],
    );

    // ── Save to Airtable ─────────────────────────────────────────
    await this.airtable.createRecord(process.env.AIRTABLE_INVEST_FORM, {
      'Investment Request': label,
      'Full Name': dto.fullName,
      'Email': dto.email,
      'Phone': dto.phone || '',
      'Form Source': 'invest-questionnaire',
      'Follow Up Status': 'New',
      'Submission Date': this.today(),
      'Department Notified': 'Investor Relations',
      'Date of Birth': dto.dateOfBirth || '',
      'Address': dto.address || '',
      'Citizenship': dto.citizenship || '',
      'Investor Type': dto.investorType === 'individual' ? 'Individual'
        : dto.investorType === 'joint' ? 'Joint' : 'Entity',
      'Income Individual 200K': dto.accreditationCriteria.includes('incomeIndividual'),
      'Income Joint 300K': dto.accreditationCriteria.includes('incomeJoint'),
      'Net Worth 1M': dto.accreditationCriteria.includes('netWorth'),
      'Professional Cert': dto.accreditationCriteria.includes('professional'),
      'Company Insider': dto.accreditationCriteria.includes('insider'),
      'Knowledgeable Employee': dto.accreditationCriteria.includes('knowledgeable'),
      'Entity Financial Institution': dto.entityCriteria.includes('bank'),
      'Entity Benefit Plan 5M': dto.entityCriteria.includes('benefitPlan'),
      'Entity Private Fund 5M': dto.entityCriteria.includes('privateFund'),
      'Entity Family Office 5M': dto.entityCriteria.includes('familyOffice'),
      'Entity Assets 5M': dto.entityCriteria.includes('entityAssets'),
      'Entity All Accredited': dto.entityCriteria.includes('allAccredited'),
      'Source of Funds': dto.sourceOfFunds,
      'Source Other Detail': dto.sourceOfFundsOther || '',
      'Is PEP': dto.isPep,
      'PEP Details': dto.pepDetails || '',
      'Is US Citizen': dto.isUsCitizen,
      'US Tax ID': dto.usTaxId || '',
      'Declaration Accepted': true,
      'Accreditation Status': status,
    });

    if (flagged) {
      this.logger.warn(`FLAGGED: ${dto.email} pep=${dto.isPep} us=${dto.isUsCitizen}`);
    }

    this.logger.log(`Investor onboarding: ${dto.email} status=${status}`);
    return { success: true, accreditationStatus: status };
  }

  private today(): string {
    return new Date().toISOString().split('T')[0];
  }
}
```

### `src/investor-onboarding/investor-onboarding.controller.ts`

```typescript
import { Body, Controller, Post } from '@nestjs/common';
import { InvestorOnboardingService } from './investor-onboarding.service';
import { InvestorOnboardingDto } from './dto/investor-onboarding.dto';

@Controller('api')
export class InvestorOnboardingController {
  constructor(private readonly service: InvestorOnboardingService) {}

  @Post('investor-onboarding')
  async submit(@Body() dto: InvestorOnboardingDto) {
    return this.service.submit(dto);
  }
}
```

### `src/investor-onboarding/investor-onboarding.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { InvestorOnboardingController } from './investor-onboarding.controller';
import { InvestorOnboardingService } from './investor-onboarding.service';

@Module({
  controllers: [InvestorOnboardingController],
  providers: [InvestorOnboardingService],
})
export class InvestorOnboardingModule {}
```

---

## 4. Módulo KYC (status endpoint)

La Lambda maneja el webhook. NestJS solo necesita el endpoint de status.

### `src/kyc/kyc.controller.ts`

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { KycService } from './kyc.service';

@Controller('api/kyc')
export class KycController {
  constructor(private readonly kycService: KycService) {}

  @Get('status')
  @UseGuards(JwtAuthGuard)
  async getStatus(@CurrentUser() user: { userId: string }) {
    return this.kycService.getStatus(user.userId);
  }
}
```

### `src/kyc/kyc.service.ts`

```typescript
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class KycService {
  constructor(private readonly dataSource: DataSource) {}

  async getStatus(userId: string) {
    const result = await this.dataSource.query(
      `SELECT kyc_status, aml_status, kyc_verification_id, kyc_completed_at, aml_completed_at
       FROM investor_profiles WHERE user_id = $1`,
      [userId],
    );

    if (!result.length) {
      return { status: 'not_started', amlStatus: 'not_started' };
    }

    const p = result[0];
    return {
      status: p.kyc_status,
      amlStatus: p.aml_status,
      verificationId: p.kyc_verification_id,
      kycCompletedAt: p.kyc_completed_at,
      amlCompletedAt: p.aml_completed_at,
    };
  }
}
```

---

## 5. Registrar módulos en app.module.ts

```typescript
import { CommonModule } from './common/common.module';
import { FormsModule } from './forms/forms.module';
import { InvestorOnboardingModule } from './investor-onboarding/investor-onboarding.module';
import { KycModule } from './kyc/kyc.module';

@Module({
  imports: [
    CommonModule,
    FormsModule,
    InvestorOnboardingModule,
    KycModule,
    // ... otros módulos existentes
  ],
})
export class AppModule {}
```

---

## 6. Variables de entorno para NestJS (.env)

```bash
# Airtable
AIRTABLE_TOKEN=patbNgz4RHFjrrr2s.xxxxx
AIRTABLE_BASE_ID=appdEXDVwhqL4Qb7D
AIRTABLE_CONTACT_FORM=tbl20K3JJzcUKhHOW
AIRTABLE_WAITLIST_FORM=tblitYHGM7hwtDMhV
AIRTABLE_INVEST_FORM=tblyFmTnqH1SLrgmD
```

Las variables de DB (DB_HOST, etc.) ya deberían estar configuradas en tu NestJS.

---

## 7. CORS en NestJS

Asegúrate de que `main.ts` permita requests desde Amplify:

```typescript
app.enableCors({
  origin: ['https://ancestro.ai', 'http://localhost:3007'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});
```

---

## 8. Endpoints finales en NestJS

| Método | Ruta | Auth | Guarda en |
|--------|------|------|-----------|
| POST | `/api/contact` | No | RDS `contacts` + Airtable |
| POST | `/api/waitlist` | No | RDS `waitlist` + Airtable |
| POST | `/api/join` | No | RDS `waitlist` + Airtable |
| POST | `/api/invest` | No | RDS `investment_requests` + Airtable |
| POST | `/api/investor-onboarding` | No | RDS `investment_requests` (full) + Airtable |
| GET | `/api/kyc/status` | JWT | Lee de RDS `investor_profiles` |

---

## 9. Migraciones SQL pendientes

Ejecutar en RDS:

1. `migration.sql` — campos KYC/AML en `investor_profiles` + tabla `kyc_events`
2. `migration-invest-questionnaire.sql` — campos SEC 501(a) en `investment_requests`

---

## 10. Cambios en el frontend (Next.js)

Los formularios actualmente llaman a `/api/contact`, `/api/waitlist`, etc. (Next.js API routes).
Deben cambiarse para llamar a `NEXT_PUBLIC_API_URL + '/api/contact'` (NestJS).

Una vez que los endpoints de NestJS estén listos, se eliminan los API routes de Next.js
(`src/app/api/contact/`, `src/app/api/waitlist/`, `src/app/api/invest/`, etc.)
y el frontend apunta directamente al backend.

---

## 11. Checklist

### NestJS (EC2):
- [ ] Crear `src/common/airtable.service.ts` + module
- [ ] Crear `src/forms/` module (controller + service + DTOs)
- [ ] Crear `src/investor-onboarding/` module
- [ ] Crear `src/kyc/` module (solo GET status)
- [ ] Registrar módulos en `app.module.ts`
- [ ] Agregar variables de Airtable al `.env`
- [ ] Configurar CORS para Amplify
- [ ] Deploy a EC2

### RDS:
- [ ] Ejecutar `migration.sql`
- [ ] Ejecutar `migration-invest-questionnaire.sql`

### Airtable:
- [ ] Agregar 17 campos nuevos a tabla `Investment Requests`

### Frontend (después de NestJS listo):
- [ ] Cambiar formularios para llamar a NestJS en vez de `/api/`
- [ ] Eliminar `src/app/api/contact/`, `waitlist/`, `invest/`, `join/`, `investor-onboarding/`
