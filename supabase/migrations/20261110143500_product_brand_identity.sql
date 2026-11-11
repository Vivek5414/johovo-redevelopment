alter table public.products
  add column brand_identity text not null default 'johovo'
  check (brand_identity in ('johovo', 'iyalmooligai'));
