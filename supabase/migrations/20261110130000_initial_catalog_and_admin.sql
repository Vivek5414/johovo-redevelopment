create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
grant usage on schema private to authenticated;

create table public.admin_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  is_active boolean not null default false,
  created_at timestamptz not null default pg_catalog.now(),
  updated_at timestamptz not null default pg_catalog.now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  description text,
  status text not null default 'active' check (status in ('active', 'archived')),
  display_order integer not null default 0 check (display_order >= 0),
  created_at timestamptz not null default pg_catalog.now(),
  updated_at timestamptz not null default pg_catalog.now(),
  unique (slug)
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories (id) on delete restrict,
  name text not null,
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  sku text unique,
  short_description text,
  description text,
  status text not null default 'draft'
    check (status in ('draft', 'published', 'archived')),
  published_at timestamptz,
  display_order integer not null default 0 check (display_order >= 0),
  created_by uuid references public.admin_profiles (id) on delete set null,
  updated_by uuid references public.admin_profiles (id) on delete set null,
  created_at timestamptz not null default pg_catalog.now(),
  updated_at timestamptz not null default pg_catalog.now(),
  check (status <> 'published' or published_at is not null)
);

create table public.product_media (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  media_type text not null check (media_type in ('image', 'video')),
  source text not null check (source in ('upload', 'youtube', 'instagram')),
  storage_bucket text,
  storage_path text,
  external_url text,
  thumbnail_bucket text,
  thumbnail_path text,
  title text,
  description text,
  alt_text text,
  display_order integer not null default 0 check (display_order >= 0),
  is_primary boolean not null default false,
  created_by uuid references public.admin_profiles (id) on delete set null,
  created_at timestamptz not null default pg_catalog.now(),
  updated_at timestamptz not null default pg_catalog.now(),
  check (
    (source = 'upload'
      and storage_bucket is not null
      and storage_bucket in ('product-media-drafts', 'product-media-approved')
      and storage_path is not null
      and external_url is null)
    or
    (source in ('youtube', 'instagram')
      and media_type = 'video'
      and storage_bucket is null
      and storage_path is null
      and external_url is not null
      and external_url ~ '^https://')
  ),
  check (
    (thumbnail_bucket is null and thumbnail_path is null)
    or
    (thumbnail_bucket is not null
      and thumbnail_bucket in ('product-media-drafts', 'product-media-approved')
      and thumbnail_path is not null)
  ),
  check (media_type <> 'image' or source = 'upload'),
  check (not is_primary or media_type = 'image')
);

create unique index product_media_one_primary_per_product
  on public.product_media (product_id)
  where is_primary;

create table public.product_purchase_links (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  marketplace text not null check (marketplace in ('amazon', 'flipkart')),
  url text not null check (url ~ '^https://'),
  label text,
  is_active boolean not null default true,
  display_order integer not null default 0 check (display_order >= 0),
  created_at timestamptz not null default pg_catalog.now(),
  updated_at timestamptz not null default pg_catalog.now()
);

create function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := pg_catalog.now();
  return new;
end;
$$;

create function private.is_active_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admin_profiles
    where id = (select auth.uid())
      and is_active
  );
$$;

revoke all on function private.set_updated_at() from public, anon, authenticated;
revoke all on function private.is_active_admin() from public, anon;
grant execute on function private.is_active_admin() to authenticated;

create trigger admin_profiles_set_updated_at
  before update on public.admin_profiles
  for each row execute function private.set_updated_at();
create trigger categories_set_updated_at
  before update on public.categories
  for each row execute function private.set_updated_at();
create trigger products_set_updated_at
  before update on public.products
  for each row execute function private.set_updated_at();
create trigger product_media_set_updated_at
  before update on public.product_media
  for each row execute function private.set_updated_at();
create trigger product_purchase_links_set_updated_at
  before update on public.product_purchase_links
  for each row execute function private.set_updated_at();

alter table public.admin_profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_media enable row level security;
alter table public.product_purchase_links enable row level security;

create policy "Admins can read their own active profile"
  on public.admin_profiles for select to authenticated
  using (id = (select auth.uid()) and is_active);

create policy "Public can read active categories"
  on public.categories for select to anon, authenticated
  using (status = 'active');
create policy "Active admins can manage categories"
  on public.categories for all to authenticated
  using ((select private.is_active_admin()))
  with check ((select private.is_active_admin()));

create policy "Public can read published products in active categories"
  on public.products for select to anon, authenticated
  using (
    status = 'published'
    and exists (
      select 1 from public.categories
      where categories.id = products.category_id
        and categories.status = 'active'
    )
  );
create policy "Active admins can manage products"
  on public.products for all to authenticated
  using ((select private.is_active_admin()))
  with check ((select private.is_active_admin()));

create policy "Public can read media for published products"
  on public.product_media for select to anon, authenticated
  using (
    exists (
      select 1
      from public.products
      join public.categories on categories.id = products.category_id
      where products.id = product_media.product_id
        and products.status = 'published'
        and categories.status = 'active'
        and (
          product_media.source <> 'upload'
          or product_media.storage_bucket = 'product-media-approved'
        )
    )
  );
create policy "Active admins can manage product media"
  on public.product_media for all to authenticated
  using ((select private.is_active_admin()))
  with check ((select private.is_active_admin()));

create policy "Public can read purchase links for published products"
  on public.product_purchase_links for select to anon, authenticated
  using (
    is_active
    and exists (
      select 1
      from public.products
      join public.categories on categories.id = products.category_id
      where products.id = product_purchase_links.product_id
        and products.status = 'published'
        and categories.status = 'active'
    )
  );
create policy "Active admins can manage product purchase links"
  on public.product_purchase_links for all to authenticated
  using ((select private.is_active_admin()))
  with check ((select private.is_active_admin()));

grant select on public.categories, public.products,
  public.product_media, public.product_purchase_links to anon, authenticated;
grant insert, update, delete on public.categories,
  public.products, public.product_media, public.product_purchase_links to authenticated;
grant select on public.admin_profiles to authenticated;

insert into storage.buckets (id, name, public)
values
  ('product-media-drafts', 'product-media-drafts', false),
  ('product-media-approved', 'product-media-approved', false)
on conflict (id) do nothing;

create policy "Active admins manage their draft product media"
  on storage.objects for all to authenticated
  using (
    bucket_id = 'product-media-drafts'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and (select private.is_active_admin())
  )
  with check (
    bucket_id = 'product-media-drafts'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and (select private.is_active_admin())
  );

create policy "Active admins manage approved product media"
  on storage.objects for all to authenticated
  using (
    bucket_id = 'product-media-approved'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and (select private.is_active_admin())
  )
  with check (
    bucket_id = 'product-media-public'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and (select private.is_active_admin())
  );

create policy "Public can read approved product media"
  on storage.objects for select to anon, authenticated
  using (
    bucket_id = 'product-media-approved'
    and exists (
      select 1
      from public.product_media
      join public.products on products.id = product_media.product_id
      join public.categories on categories.id = products.category_id
      where product_media.source = 'upload'
        and product_media.storage_bucket = storage.objects.bucket_id
        and product_media.storage_path = storage.objects.name
        and products.status = 'published'
        and categories.status = 'active'
    )
  );
