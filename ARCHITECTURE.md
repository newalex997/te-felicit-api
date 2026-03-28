# amaloc-partner-crm-api — Architecture & Patterns Reference

> This document describes the patterns, conventions, and libraries used in this project.
> It is intended as a reference for reimplementing the same patterns in other NestJS projects.

---

## Table of Contents

1. [Project Structure](#1-project-structure)
2. [Tech Stack](#2-tech-stack)
3. [Architecture Overview](#3-architecture-overview)
4. [NestJS Patterns](#4-nestjs-patterns)
5. [Database Patterns (TypeORM)](#5-database-patterns-typeorm)
6. [API Patterns](#6-api-patterns)
7. [Authentication & Authorization](#7-authentication--authorization)
8. [Configuration](#8-configuration)
9. [Internationalization (i18n)](#9-internationalization-i18n)
10. [Naming Conventions](#10-naming-conventions)
11. [Common Utilities & Shared Modules](#11-common-utilities--shared-modules)
12. [External HTTP Integration](#12-external-http-integration)
13. [Testing Setup](#13-testing-setup)

---

## 1. Project Structure

```
src/
├── main.ts                          # Bootstrap entry point
├── common/                          # Cross-cutting concerns
│   ├── agents/                      # HTTPS agent utilities
│   ├── config/
│   │   ├── api/                     # App config (module, service, schema)
│   │   └── database/                # DB config (module, service, data-source)
│   ├── constants.ts                 # Global regex patterns, relation options
│   ├── decorators/                  # Custom decorators (auth, roles, match, swagger)
│   ├── dto/                         # Shared DTOs (paginated response, auth response)
│   ├── guards/                      # Auth + Roles guards
│   ├── interceptors/                # Logging interceptor
│   ├── typings/                     # TS types, enums, Express augmentation
│   └── utils/                       # findWithCountMapping helper
├── i18n/                            # Translation files (en/fr/ro)
│   ├── en/
│   ├── fr/
│   └── ro/
├── migrations/                      # TypeORM migration files
├── modules/                         # Feature modules
│   ├── app.module.ts
│   ├── auth/
│   ├── client/
│   ├── crm/
│   ├── dictionary/
│   ├── driver/
│   ├── invoicing/
│   ├── order/
│   └── user/
├── providers/                       # Infrastructure providers (DI wiring)
│   ├── database/
│   ├── i18n/
│   ├── jwt/
│   ├── logging/
│   └── rate-limit/
├── seeds/                           # Data seeding scripts (ts-node)
└── services/
    └── mobile-api/                  # External HTTP client wrapper
```

Each feature module under `modules/` follows the same internal layout:

```
modules/<name>/
├── <name>.module.ts
├── <name>.controller.ts
├── <name>.service.ts
├── entities/
│   └── <name>.entity.ts
└── dto/
    ├── create-<name>.dto.ts
    ├── update-<name>.dto.ts
    └── get-<name>-params.dto.ts
```

---

## 2. Tech Stack

### Runtime Dependencies

| Package | Version | Purpose |
|---|---|---|
| `@nestjs/common` / `core` | ^11 | NestJS framework |
| `@nestjs/platform-express` | ^11 | HTTP adapter (Express) |
| `@nestjs/typeorm` | ^11 | TypeORM integration |
| `typeorm` | ^0.3 | ORM |
| `mysql2` | ^3 | MySQL driver |
| `@nestjs/jwt` | ^11 | JWT signing/verification |
| `@nestjs/config` | ^4 | Environment config with namespace support |
| `@nestjs/swagger` | ^11 | OpenAPI documentation |
| `@nestjs/throttler` | ^6 | Rate limiting |
| `@nestjs/axios` | ^4 | HTTP client (wraps axios with RxJS) |
| `nestjs-i18n` | ^10 | Internationalization |
| `class-validator` | ^0.14 | DTO validation decorators |
| `class-transformer` | ^0.5 | Serialization/deserialization |
| `bcryptjs` | ^2 | Password hashing |
| `helmet` | ^8 | HTTP security headers |
| `joi` | ^17 | Env var schema validation at startup |
| `rxjs` | ^7 | Reactive streams (HTTP client, NestJS internals) |

### Dev Dependencies

| Package | Purpose |
|---|---|
| `@nestjs/testing` | NestJS test utilities |
| `jest` + `ts-jest` | Unit testing |
| `supertest` | E2E HTTP testing |
| `@swc/core` | Fast TypeScript compilation |
| `typescript` ^5.7 | Language |
| `prettier` + `eslint` | Linting/formatting |
| `tsconfig-paths` | Path alias resolution |

---

## 3. Architecture Overview

### Layered Architecture

```
HTTP Request
    ↓
Controller      (@Controller, @Get/@Post/@Put/@Delete)
    ↓
Service         (@Injectable — business logic)
    ↓
Repository      (TypeORM Repository<Entity> via @InjectRepository)
    ↓
MySQL Database
```

### CQRS-lite: Split Service Pattern (used in complex modules)

For complex modules (e.g., `order`), the single service is split into multiple focused services coordinated by a thin facade:

```
Controller
    └── <Name>Service (facade — pure delegation, no logic)
          ├── <Name>QueryService       (reads: getAll, getById, …)
          ├── <Name>CommandService     (mutations: create, update, delete)
          └── <Name><SubDomain>Service (cross-cutting sub-concern)
```

```typescript
// order.service.ts — pure delegation
@Injectable()
export class OrderService {
  constructor(
    private orderQuery: OrderQueryService,
    private orderActivity: OrderActivityService,
    private orderCommand: OrderCommandService,
  ) {}

  getAll(query: GetOrdersParamsDto) { return this.orderQuery.getAll(query); }
  saveOrder(dto: AddOrderActivityDto) { return this.orderCommand.saveOrder(dto); }
}
```

---

## 4. NestJS Patterns

### Bootstrap (`main.ts`)

```typescript
const app = await NestFactory.create(AppModule);

app.useGlobalFilters(new I18nValidationExceptionFilter({ detailedErrors: false }));
app.useGlobalPipes(new I18nValidationPipe({ whitelist: true, transform: true }));
app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

app.setGlobalPrefix("api");
app.enableVersioning({ type: VersioningType.URI, defaultVersion: "1" }); // /api/v1/...

app.use(helmet());
app.enableCors({ origin: new RegExp(configService.corsWhitelist) });

// Swagger at /swagger
SwaggerModule.setup("swagger", app, SwaggerModule.createDocument(app, swaggerConfig));

await app.listen(port);
```

Key decisions:
- `I18nValidationPipe` replaces the standard `ValidationPipe` — all validation errors are translated
- `ClassSerializerInterceptor` is global — `@Exclude()` on entity fields is honored automatically
- URI versioning with `defaultVersion: "1"` means no explicit `@Version()` needed on most controllers
- Helmet applied globally for security headers

### Global Guards in AppModule

Both `AuthGuard` and `RolesGuard` are registered globally. Every route requires auth by default — public routes opt out with `@SkipAuth()`.

```typescript
@Module({
  imports: [/* feature modules */, RateLimitModule, I18nModule, /* infrastructure */],
  providers: [
    LoggingProvider,       // APP_INTERCEPTOR
    RateLimitProvider,     // APP_GUARD (throttler)
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
```

### Provider Alias Pattern

Infrastructure cross-cutting concerns are exported as provider constant objects for clean `AppModule` registration:

```typescript
// src/providers/logging/logging.provider.ts
export const LoggingProvider = {
  provide: APP_INTERCEPTOR,
  useClass: LoggingInterceptor,
};

// src/providers/rate-limit/rate-limit.provider.ts
export const RateLimitProvider = {
  provide: APP_GUARD,
  useClass: ThrottlerGuard,
};
```

### Custom Decorators

All custom decorators use `SetMetadata`:

```typescript
// Auth decorators
export const SkipAuth = () => SetMetadata(SKIP_AUTH_KEY, true);
export const CrmAuth = () => SetMetadata(CRM_AUTH_KEY, true);

// RBAC
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
```

Guards read the metadata via `Reflector.getAllAndOverride()`.

### Logging Interceptor

`LoggingInterceptor` logs method, path, user agent, IP, and response time. It skips `/metrics` and `/health` paths. Registered globally as `APP_INTERCEPTOR`.

### Request-Scoped User Access

Services that need the current authenticated user inject the Express `Request` object using `REQUEST`:

```typescript
@Injectable({ scope: Scope.REQUEST })
export class SomeService {
  constructor(@Inject(REQUEST) private request: Request) {}

  doSomething() {
    const userId = this.request.user?.id;
  }
}
```

---

## 5. Database Patterns (TypeORM)

### Entity Definition

```typescript
@Entity("orders")
export class OrderEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  // FK column excluded from API response, resolved object exposed instead
  @Exclude()
  @ApiHideProperty()
  @Column({ name: "benneSizeId", type: "nvarchar" })
  benneSizeId: string;

  // Virtual field — populated by service layer, not a DB column
  benneSize: DictionaryItemDto;

  // AfterLoad lifecycle to derive computed properties
  @AfterLoad()
  setNameFromUUID() {
    this.name = this.id?.split("-")[0].toUpperCase();
  }

  @CreateDateColumn({ name: "createdAt", type: "datetime" })
  createdAt: Date;

  // Soft delete
  @Exclude()
  @DeleteDateColumn({ name: "deletedAt", type: "datetime" })
  deletedAt: Date;
}
```

### Standard Relation Options

Defined in `src/common/constants.ts` and reused across all entity relation decorators:

```typescript
// Parent owns cascade; child rows deleted when parent is deleted
export const RELATIONAL_PARENT_OPTIONS: RelationOptions = {
  cascade: true,
  onDelete: "CASCADE",
};

// Child side of a cascade; orphan rows deleted automatically
export const RELATIONAL_CHILDREN_OPTIONS: RelationOptions = {
  orphanedRowAction: "delete",
  onDelete: "CASCADE",
};

// Loose coupling; FK set to NULL when referenced entity is deleted
export const RELATIONAL_INDEPENDENT_CHILDREN_OPTIONS: RelationOptions = {
  onDelete: "SET NULL",
};
```

Usage:

```typescript
@OneToMany(() => WorksiteEntity, (w) => w.client, RELATIONAL_PARENT_OPTIONS)
worksites: WorksiteEntity[];
```

### Two-Step Pagination (avoids JOIN row multiplication)

```typescript
// Step 1: paginate IDs only
const idsQb = this.orders
  .createQueryBuilder("order")
  .select("order.id")
  .orderBy("order.createdAt", "DESC")
  .skip(offset)
  .take(limit);

this.applyFilters(idsQb, query);
const ids = (await idsQb.getMany()).map((o) => o.id);

// Step 2: hydrate full data for those IDs (no LIMIT on JOIN query)
const items = await this.orders
  .createQueryBuilder("order")
  .leftJoinAndSelect("order.activities", "activity")
  .where("order.id IN (:...ids)", { ids })
  .getMany();
```

### Transactions

Used for multi-step write operations:

```typescript
return this.invoices.manager.transaction(async (manager) => {
  const invoice = manager.create(OrderInvoiceEntity, { ... });
  const saved = await manager.save(invoice);
  await manager.update(OrderEntity, { id: In(orderIds) }, { invoice: { id: saved.id } });
  return saved;
});
```

### Migrations

- 22 explicit TypeORM migrations in `src/migrations/`
- Naming: `<timestamp>-<kebab-description>.ts`
- Auto-run on startup via `migrationsRun: true` in TypeORM config
- Separate `data-source.ts` file for CLI usage

```json
"typeorm": "typeorm-ts-node-commonjs -d src/common/config/database/data-source.ts",
"migration:run": "typeorm migration:run -d dist/common/config/database/data-source.js",
"migration:generate": "typeorm migration:generate -n src/migrations/%npm_config_name%"
```

### Repository Field Naming Convention

Repository injections use the plural entity name:

```typescript
constructor(
  @InjectRepository(OrderEntity)
  private readonly orders: Repository<OrderEntity>,
  @InjectRepository(OrderActivityEntity)
  private readonly orderActivities: Repository<OrderActivityEntity>,
) {}
```

---

## 6. API Patterns

### REST Only — no GraphQL

All routes under `/api/v1/` via global prefix + URI versioning.

### DTO Validation with i18n

`class-validator` decorators use `i18nValidationMessage()` for translated error messages:

```typescript
export class CreateOrderDto {
  @IsString()
  benneSizeId: string;

  @Matches(REG_EXP.PHONE_NUMBER, {
    message: i18nValidationMessage("validation.INVALID_PHONE"),
  })
  phoneNumber: string;

  @Min(0.01, { message: i18nValidationMessage("validation.BUDGET_MIN_VALUE", { min: 0.01 }) })
  @Transform(({ value }) => Number(value))
  @IsNumber({ maxDecimalPlaces: 2 })
  amount: number;

  @MinDate(() => new Date(), { message: i18nValidationMessage("validation.MIN_DATE") })
  @Transform(({ value }) => new Date(value))
  startingAt: Date;
}
```

### Query Param DTOs — Type Coercion

Query params arrive as strings; use `@Type()` to coerce:

```typescript
export class GetOrdersParamsDto {
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  activeOnly?: boolean;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  from?: Date;
}
```

### Serialization — Exclude Sensitive Fields

`ClassSerializerInterceptor` is global. Mark entity fields with `@Exclude()` to prevent them from appearing in responses:

```typescript
@Exclude()
@Column({ name: "password" })
password: string;

@Exclude()
@Column({ name: "benneSizeId" })    // raw FK — exposed via resolved DTO instead
benneSizeId: string;
```

### Pagination Response Shape

All list endpoints return `{ items: T[], count: number }` via `findWithCountMapping`:

```typescript
// src/common/utils/find-with-count-mapping.ts
export function findWithCountMapping<T, TExtra>(
  items: T[],
  count: number,
  extra?: TExtra,
): PaginatedResponseDto<T> & TExtra {
  return { items, count, ...(extra ?? {}) };
}
```

Some endpoints extend the response with extra totals (e.g., `totalAmountVatIncluded`).

### Swagger

- `@ApiPaginatedResponse(EntityDto)` — custom composite decorator for typed paginated responses
- `@ApiCreatedResponse`, `@ApiOkResponse`, `@ApiHideProperty` used throughout
- Swagger mounted at `/swagger`

### Error Handling

Business logic errors throw standard NestJS HTTP exceptions from services, using i18n for messages:

```typescript
throw new UnauthorizedException(this.i18n.t("exceptions.auth.invalidCredentials"));
throw new BadRequestException(this.i18n.t("exceptions.user.emailAlreadyRegistered"));
throw new HttpException(this.i18n.t("exceptions.order.referenceOrderIdRequired"), 400);
```

No custom global exception filter beyond `I18nValidationExceptionFilter` (handles class-validator errors).

---

## 7. Authentication & Authorization

### Two Authentication Modes

**1. JWT Bearer Token** (standard user auth — most routes):

```typescript
// AuthGuard extracts, verifies, and attaches JWT payload to request
const payload = await this.jwtService.verifyAsync(token, { secret: this.config.jwtSecret });
request["user"] = payload; // { id: string, role: Role }
```

**2. CRM API Token** (machine-to-machine, static token):

```typescript
@CrmAuth()            // sets CRM_AUTH_KEY metadata
@Controller("crm")
export class CrmController { ... }

// AuthGuard short-circuits for CRM routes:
if (isCrmAuth) {
  if (token !== this.config.crmApiToken) throw new UnauthorizedException(...);
  return true;
}
```

### Token Strategy

| Token | Storage | Expiry | Invalidation |
|---|---|---|---|
| Access token | JWT (stateless) | 1 day | Expiry only |
| Refresh token | JWT stored in DB (`users.refreshToken`) | 30 days | Set to `null` on logout |

### Public Routes

```typescript
@SkipAuth()           // bypasses AuthGuard
@Post("sign-up")
signup(@Body() dto: SignupDto) { ... }
```

### Role-Based Authorization

```typescript
export enum Role { Contractor = "Contractor", Customer = "Customer", Admin = "Admin" }

@Roles(Role.Admin)
@Get("admin-only")
adminEndpoint() { ... }
```

`RolesGuard` reads `user.role` from the JWT payload (set by `AuthGuard`).

### Express Request Augmentation

```typescript
// src/common/typings/custom.d.ts
declare global {
  namespace Express {
    export interface Request {
      user: { id: string; role: Role; };
    }
  }
}
```

---

## 8. Configuration

### Namespace Config with `registerAs`

```typescript
// src/common/config/api/configuration.ts
export default registerAs("api", () => ({
  env: process.env.NODE_ENV,
  port: process.env.API_PORT,
  jwtSecret: process.env.JWT_SECRET,
  corsWhitelist: process.env.CORS_WHITELIST,
  crmApiToken: process.env.CRM_API_TOKEN,
  mobileApiUrl: process.env.MOBILE_API_URL,
}));
```

### Typed Config Service Wrapper

```typescript
@Injectable()
export class ApiConfigService {
  constructor(private readonly configService: ConfigService) {}

  get jwtSecret(): string {
    return this.configService.get("api.jwtSecret") as string;
  }
  get corsWhitelist(): RegExp {
    return new RegExp(this.configService.get("api.corsWhitelist"));
  }
  get jwtSignOptions(): JwtModuleOptions {
    return { secret: this.jwtSecret, signOptions: { expiresIn: "1d" } };
  }
}
```

### Joi Validation at Startup

```typescript
ConfigModule.forRoot({
  validationSchema: Joi.object({
    API_PORT: Joi.number().port().required(),
    NODE_ENV: Joi.string().valid("development", "production").required(),
    JWT_SECRET: Joi.string().required(),
    DB_HOST: Joi.string().required(),
    DB_PORT: Joi.number().port().required(),
    CORS_WHITELIST: Joi.string().required(),
    CRM_API_TOKEN: Joi.string().required(),
    MOBILE_API_URL: Joi.string().uri().required(),
    DB_PASSWORD: Joi.string().allow(""),
  }),
  load: [apiConfiguration, databaseConfiguration],
})
```

---

## 9. Internationalization (i18n)

Uses `nestjs-i18n`. Languages: `en`, `fr`, `ro`.

### Module Setup

```typescript
I18nModule.forRootAsync({
  resolvers: [
    { use: QueryResolver, options: ["lang"] },  // ?lang=fr
    new HeaderResolver(["x-lang"]),              // x-lang: fr
    AcceptLanguageResolver,                      // Accept-Language header
  ],
  fallbackLanguage: "en",
  loaderOptions: { path: path.join(__dirname, "../../i18n/"), watch: true },
})
```

### Translation File Structure

```
i18n/
└── en/
    ├── validation.json    # class-validator messages
    └── exceptions.json    # HTTP error messages
```

```json
// i18n/en/exceptions.json
{
  "auth": {
    "invalidCredentials": "Invalid email or password",
    "tokenExpired": "Session expired, please sign in again"
  }
}
```

### Usage in Services

```typescript
constructor(private readonly i18n: I18nService) {}

throw new BadRequestException(this.i18n.t("exceptions.user.emailAlreadyRegistered"));
```

### Usage in DTOs

```typescript
@IsString({ message: i18nValidationMessage("validation.IS_STRING") })
name: string;
```

---

## 10. Naming Conventions

### File Names

| Type | Pattern | Example |
|---|---|---|
| Entity | `<name>.entity.ts` | `order-activity.entity.ts` |
| Service | `<name>.service.ts` | `order-query.service.ts` |
| Controller | `<name>.controller.ts` | `order.controller.ts` |
| Module | `<name>.module.ts` | `order.module.ts` |
| DTO | `<action>-<subject>.dto.ts` | `create-order.dto.ts`, `get-orders-params.dto.ts` |
| Guard | `<name>.guard.ts` | `auth.guard.ts` |
| Decorator | `<name>.decorator.ts` | `roles.decorator.ts` |
| Interceptor | `<name>.interceptor.ts` | `logging.interceptor.ts` |
| Config factory | `configuration.ts` | `configuration.ts` |
| Config service | `configuration.service.ts` | `configuration.service.ts` |
| Migration | `<timestamp>-<kebab-description>.ts` | `1712000000000-add-soft-delete.ts` |

### Class Names

| Type | Pattern | Example |
|---|---|---|
| Entity | `<PascalName>Entity` | `OrderActivityEntity` |
| Service | `<PascalName>Service` | `OrderQueryService` |
| DTO | `<PascalAction><PascalSubject>Dto` | `CreateOrderDto`, `GetOrdersParamsDto` |
| Guard | `<PascalName>Guard` | `AuthGuard`, `RolesGuard` |
| Module | `<PascalName>Module` | `OrderModule` |
| Config service | `<PascalName>ConfigService` | `ApiConfigService` |
| Enum | `PascalCase` | `Role`, `DictionaryType` |

### Method Names

| Concern | Pattern | Example |
|---|---|---|
| List query | `getAll` | `getAll(query)` |
| Single query | `getOne` / `get<Name>ById` | `getOrderById(id)` |
| Create | `create` | `create(dto)` |
| Update | `update` | `update(id, dto)` |
| Delete | `delete` | `delete(id)` |
| Private helpers | descriptive camelCase | `applyOrderFilters`, `enrichOrderWithDictionaries` |

---

## 11. Common Utilities & Shared Modules

### `src/common/constants.ts`

```typescript
export const FIFTEEN_MB = 15 * 1024 * 1024;

export const REG_EXP = {
  ADRESS: /^[a-zA-Z0-9\s,'\-\.]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
  PHONE_NUMBER: /^\+?[1-9]\d{1,14}$/,
  CURRENCY: /^\d+(\.\d{1,2})?$/,
  // ...
};

export const RELATIONAL_PARENT_OPTIONS: RelationOptions = { cascade: true, onDelete: "CASCADE" };
export const RELATIONAL_CHILDREN_OPTIONS: RelationOptions = { orphanedRowAction: "delete", onDelete: "CASCADE" };
export const RELATIONAL_INDEPENDENT_CHILDREN_OPTIONS: RelationOptions = { onDelete: "SET NULL" };
```

### `src/common/utils/find-with-count-mapping.ts`

Generic typed utility for paginated responses:

```typescript
export function findWithCountMapping<T, TExtra>(
  items: T[],
  count: number,
  extra?: TExtra,
): PaginatedResponseDto<T> & TExtra {
  return { items, count, ...(extra ?? {}) };
}
```

### `src/common/dto/paginated-response.dto.ts`

```typescript
export class PaginatedResponseDto<TData> {
  @ApiProperty()
  count: number;

  items: TData[];
}
```

### `src/common/decorators/api-paginated-response.decorator.ts`

Composite Swagger decorator for typed paginated responses with optional extra properties:

```typescript
export const ApiPaginatedResponse = <TModel extends Type<any>>(model: TModel, options?) =>
  applyDecorators(
    ApiExtraModels(PaginatedResponseDto, model),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginatedResponseDto) },
          {
            properties: {
              items: { type: "array", items: { $ref: getSchemaPath(model) } },
              ...options?.extraProperties,
            },
          },
        ],
      },
    }),
  );
```

### `src/common/typings/`

- `custom.d.ts` — Express `Request` augmentation (`request.user`)
- `dictionary.ts` — `DictionaryType` enum (keys for the dictionary service)
- `service-error.ts` — `ServiceError` class with `statusCode`, `message`, `error`

### In-Memory Dictionary Service

Static lookup data is served from an in-memory service rather than the DB. It uses `I18nContext.current()` to return locale-appropriate labels:

```typescript
export class DictionaryService {
  getMappedOptions(type: DictionaryType): Record<string, DictionaryItemDto> {
    const locale = I18nContext.current()?.lang || "fr";
    const items = mappedOptions[locale][type];
    return items.reduce((acc, item) => ({ ...acc, [item.id]: item }), {});
  }
}
```

Services cache the dictionary at instance level to avoid repeated reconstruction within a request:

```typescript
private dictionaryCache: DictionaryOptions | null = null;

private getDictionaryOptions() {
  if (!this.dictionaryCache) {
    this.dictionaryCache = {
      benneSize: this.dictionaryService.getMappedOptions(DictionaryType.BENNE_SIZE),
    };
  }
  return this.dictionaryCache;
}
```

---

## 12. External HTTP Integration

`MobileApiProviderService` wraps `@nestjs/axios`'s `HttpService`. It auto-injects the bearer token on all outgoing requests via an Axios request interceptor:

```typescript
@Injectable()
export class MobileApiProviderService {
  constructor(
    private readonly httpService: HttpService,
    private readonly apiConfigService: ApiConfigService,
  ) {
    this.httpService.axiosRef.interceptors.request.use((config) => {
      if (config?.headers?.Authorization) return config;
      config.headers.Authorization = `Bearer ${this.apiConfigService.crmApiToken}`;
      return config;
    });
  }
}
```

RxJS Observables from `HttpService` are consumed as Promises using `lastValueFrom`:

```typescript
return lastValueFrom(
  this.mobileApiService.post(`/crm/create-user`, payload).pipe(
    map(async (response) => { /* handle response */ }),
    catchError(() => { throw new HttpException(this.i18n.t("exceptions.mobileApi.error"), 500); }),
  ),
);
```

---

## 13. Testing Setup

```json
// jest config in package.json
{
  "jest": {
    "moduleFileExtensions": ["js", "json", "ts"],
    "rootDir": "src",
    "testRegex": ".*\\.spec\\.ts$",
    "transform": { "^.+\\.(t|j)s$": "ts-jest" },
    "coverageDirectory": "../coverage",
    "testEnvironment": "node"
  }
}
```

Available test tooling:
- `@nestjs/testing` — `Test.createTestingModule()` for unit tests with DI
- `supertest` — E2E HTTP request testing
- `ts-jest` — TypeScript transformation
- `@swc/core` — optional fast compilation alternative

E2E tests go in `test/` at project root; unit tests co-located as `*.spec.ts` alongside source files.
