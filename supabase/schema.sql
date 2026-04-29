create extension if not exists "pgcrypto";

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  brand text not null,
  product_name text not null,
  category text not null,
  subcategory text,
  price_pln numeric(10,2),
  size_ml numeric(10,2),
  skin_types text[] not null default '{}',
  skin_concerns text[] not null default '{}',
  key_ingredients text[] not null default '{}',
  avoid_if text,
  fragrance_free boolean,
  pregnancy_safe boolean,
  barrier_friendly boolean,
  comedogenic_risk text,
  recommended_step text not null,
  usage_time text,
  usage_frequency text,
  short_reason text,
  source_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_active_step_idx on public.products (is_active, recommended_step);
create index if not exists products_skin_concerns_idx on public.products using gin (skin_concerns);
create index if not exists products_skin_types_idx on public.products using gin (skin_types);

alter table public.products enable row level security;

drop policy if exists "Public can read active products" on public.products;
create policy "Public can read active products"
on public.products
for select
to anon, authenticated
using (is_active = true);

create table if not exists public.survey_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  answers jsonb not null,
  skin_profile jsonb not null,
  recommendation jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.survey_results enable row level security;

drop policy if exists "Users can insert own survey results" on public.survey_results;
create policy "Users can insert own survey results"
on public.survey_results
for insert
to authenticated
with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);

drop policy if exists "Users can read own survey results" on public.survey_results;
create policy "Users can read own survey results"
on public.survey_results
for select
to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = user_id);
