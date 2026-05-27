# Hub de Inovação — INOVATEC-JP

Build a single-page landing site for individuals/teams to pre-register interest in the Edital Inova Soluções Públicas, plus an authenticated admin panel to manage submissions.

## Stack
- TanStack Start + React + TypeScript + Tailwind v4 + shadcn/ui
- Lovable Cloud (Supabase Auth + DB + Storage) — enabled on first build step
- Design tokens defined in `src/styles.css` (oklch conversions of the brand palette: navy `#0D2557`, blue `#1A4BA0`, red `#CC2229`, green `#2A9D4B`, yellow `#F5A623`, light gray `#F5F7FA`). Inter font via Google Fonts.

## Routes
- `/` — landing page (all 7 sections)
- `/admin/login` — admin sign-in (email + password)
- `/_authenticated/admin` — dashboard (protected via `_authenticated` layout)

## Landing page sections
Single route `src/routes/index.tsx` composing section components under `src/components/landing/`:
1. **Hero + Form** — navy bg, copy on left, white registration card on right. Sticky header with nav anchors.
2. **Edital info** — 4 info cards (2x2) + 4 colored axis cards + prominent red "Baixar Edital (PDF)" download button (links to PDF in Storage public bucket).
3. **Timeline** — 7 numbered steps, horizontal on desktop / vertical on mobile.
4. **Why the Hub was born** — 2 columns: text + dark stats block.
5. **About INOVATEC-JP** — navy bg, 3 pillars, red CTA to inovatecjp.com.
6. **FAQ** — shadcn Accordion with 6 Q&A.
7. **Footer** — navy bg, 3 columns + bottom bar.

SEO meta in route `head()`. Smooth-scroll via anchor IDs.

### Registration form
- React Hook Form + Zod validation. CPF and WhatsApp masks via simple input formatters.
- Fields per spec. Submits via `createServerFn` (`submitRegistration`) that inserts into `registrations` using `supabaseAdmin` (public form — no auth required). Returns success/error; toast via Sonner.
- Duplicate email handled gracefully.

## Backend

### Lovable Cloud — enable first.

### Migration
```sql
create type tipo_inscricao_enum as enum ('individual','equipe');
create type registration_status as enum ('novo','em_analise','contatado','aprovado','recusado');

create table public.registrations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  nome_completo text not null,
  cpf text not null,
  email text not null unique,
  whatsapp text not null,
  tipo_inscricao tipo_inscricao_enum not null,
  eixo_tematico text not null,
  estagio_ideia text not null,
  status registration_status not null default 'novo',
  notas_admin text
);

grant select, insert, update, delete on public.registrations to authenticated;
grant all on public.registrations to service_role;
alter table public.registrations enable row level security;

-- Admin role
create type app_role as enum ('admin','user');
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path=public as $$
  select exists(select 1 from public.user_roles where user_id=_user_id and role=_role)
$$;

-- Policies: only admins can read/update registrations via authenticated role
create policy "admins read registrations" on public.registrations for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admins update registrations" on public.registrations for update to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admins read roles" on public.user_roles for select to authenticated using (auth.uid() = user_id);

-- Trigger to update updated_at
create or replace function public.touch_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;
create trigger registrations_touch before update on public.registrations
  for each row execute function public.touch_updated_at();
```

Public form INSERTs go through a server function using `supabaseAdmin` (no client INSERT policy needed).

### Storage
Bucket `edital-docs` (public). PDF uploaded by user → I'll copy `EDITAL Nº ____2026.pdf` to `public/edital-2026.pdf` and link directly (simpler than Storage; static assets work fine for a public download).

### Admin user
After enabling Cloud, I'll instruct the user to sign up via `/admin/login`, then I'll insert their `user_roles` row via SQL (need their email). Alternatively a default admin is created via SQL using a pre-set email.

## Admin panel
- `src/routes/_authenticated.tsx` — layout: checks `supabase.auth.getUser()` + `has_role` server fn; redirects to `/admin/login` otherwise.
- `src/routes/admin.login.tsx` — sign-in form.
- `src/routes/_authenticated/admin.tsx` — dashboard:
  - Top: 5 summary cards (total, novos, em_analise, contatados, aprovados)
  - Filters: search (name/email), status, eixo, tipo, date range
  - Table with all columns; inline status select; WhatsApp link `https://wa.me/55<digits>`; row click opens detail Sheet
  - Detail Sheet: all fields + status select + notas textarea + save
  - "Exportar CSV" button (client-side CSV generation)
  - Sidebar with navy bg, logout button

All admin data via `createServerFn` + `requireSupabaseAuth`, scoped via `has_role` check inside handlers.

## Files to create/modify
- `src/styles.css` — add brand tokens + Inter font
- `src/routes/index.tsx` — landing
- `src/components/landing/*.tsx` — Hero, EditalInfo, Timeline, Origin, About, FAQ, Footer, RegistrationForm, Header
- `src/routes/_authenticated.tsx`, `src/routes/_authenticated/admin.tsx`, `src/routes/admin.login.tsx`
- `src/lib/registrations.functions.ts` — `submitRegistration`, `listRegistrations`, `updateRegistration`, `checkAdmin`
- `src/lib/cpf-mask.ts`, `src/lib/phone-mask.ts`
- Migration for tables + roles
- `public/edital-2026.pdf` — copied from upload

## Open question
Admin login: should I (a) create a default admin with a known email/password you'll change later, or (b) wait for you to sign up at `/admin/login` then promote your account? Either works — (a) is faster.