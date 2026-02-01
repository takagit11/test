create extension if not exists "pgcrypto";

create table if not exists shops (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists reservations (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references shops(id) on delete cascade,
  start_at timestamptz not null,
  name text not null,
  contact text not null,
  created_at timestamptz not null default now(),
  unique (shop_id, start_at)
);

create index if not exists reservations_shop_date_idx on reservations (shop_id, start_at);
