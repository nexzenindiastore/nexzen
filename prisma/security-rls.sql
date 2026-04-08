alter table if exists public."Category" enable row level security;
alter table if exists public."Product" enable row level security;
alter table if exists public."ProductDependency" enable row level security;
alter table if exists public."InventoryMovement" enable row level security;
alter table if exists public."User" enable row level security;
alter table if exists public."UserIdentity" enable row level security;
alter table if exists public."UserSession" enable row level security;
alter table if exists public."Order" enable row level security;
alter table if exists public."OrderItem" enable row level security;
alter table if exists public.admins enable row level security;
alter table if exists public.admin_sessions enable row level security;
alter table if exists public.coupons enable row level security;

drop policy if exists "public_category_read" on public."Category";
create policy "public_category_read"
on public."Category"
for select
to anon, authenticated
using (true);

drop policy if exists "public_product_read" on public."Product";
create policy "public_product_read"
on public."Product"
for select
to anon, authenticated
using ("status" = 'ACTIVE' and "inStock" = true);

drop policy if exists "user_read_own_profile" on public."User";
create policy "user_read_own_profile"
on public."User"
for select
to authenticated
using ("authUserId" = auth.uid()::text);

drop policy if exists "user_update_own_profile" on public."User";
create policy "user_update_own_profile"
on public."User"
for update
to authenticated
using ("authUserId" = auth.uid()::text)
with check ("authUserId" = auth.uid()::text);

drop policy if exists "user_read_own_orders" on public."Order";
create policy "user_read_own_orders"
on public."Order"
for select
to authenticated
using (
  exists (
    select 1
    from public."User" u
    where u.id = "Order"."userId"
      and u."authUserId" = auth.uid()::text
  )
);

drop policy if exists "user_insert_own_orders" on public."Order";
create policy "user_insert_own_orders"
on public."Order"
for insert
to authenticated
with check (
  exists (
    select 1
    from public."User" u
    where u.id = "Order"."userId"
      and u."authUserId" = auth.uid()::text
  )
);

drop policy if exists "user_update_own_orders" on public."Order";
create policy "user_update_own_orders"
on public."Order"
for update
to authenticated
using (
  exists (
    select 1
    from public."User" u
    where u.id = "Order"."userId"
      and u."authUserId" = auth.uid()::text
  )
)
with check (
  exists (
    select 1
    from public."User" u
    where u.id = "Order"."userId"
      and u."authUserId" = auth.uid()::text
  )
);

drop policy if exists "user_read_own_order_items" on public."OrderItem";
create policy "user_read_own_order_items"
on public."OrderItem"
for select
to authenticated
using (
  exists (
    select 1
    from public."Order" o
    join public."User" u on u.id = o."userId"
    where o.id = "OrderItem"."orderId"
      and u."authUserId" = auth.uid()::text
  )
);
