
create type public.tipo_inscricao_enum as enum ('individual','equipe');
create type public.registration_status as enum ('novo','em_analise','contatado','aprovado','recusado');
create type public.app_role as enum ('admin','user');

create table public.registrations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  nome_completo text not null,
  cpf text not null,
  email text not null unique,
  whatsapp text not null,
  tipo_inscricao public.tipo_inscricao_enum not null,
  eixo_tematico text not null,
  estagio_ideia text not null,
  status public.registration_status not null default 'novo',
  notas_admin text
);

grant select, insert, update, delete on public.registrations to authenticated;
grant all on public.registrations to service_role;
alter table public.registrations enable row level security;

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  unique (user_id, role)
);

grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles where user_id = _user_id and role = _role
  )
$$;

create policy "admins can read registrations"
  on public.registrations for select
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create policy "admins can update registrations"
  on public.registrations for update
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create policy "users read their own roles"
  on public.user_roles for select
  to authenticated
  using (auth.uid() = user_id);

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

create trigger registrations_touch_updated_at
  before update on public.registrations
  for each row execute function public.touch_updated_at();
