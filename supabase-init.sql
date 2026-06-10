-- supabase-init.sql
-- Run this in Supabase SQL editor to create normalized tables and example policies

-- Core tables
create table if not exists projects (
  id text primary key,
  name text,
  client text,
  location text,
  status text,
  start_date date,
  end_date date,
  budget text,
  progress int,
  notes text,
  created_at timestamptz default now()
);

create table if not exists clients (
  id text primary key,
  name text,
  phone text,
  email text,
  property text,
  type text,
  budget text,
  notes text,
  created_at timestamptz default now()
);

create table if not exists mood_items (
  id text primary key,
  label text,
  src text,
  project_id text references projects(id),
  created_at timestamptz default now()
);

create table if not exists links (
  id text primary key,
  label text,
  url text,
  cat text,
  created_at timestamptz default now()
);

create table if not exists link_cats (
  name text primary key,
  created_at timestamptz default now()
);

create table if not exists kit_data (
  key text primary key,
  project_tag text,
  doc_idx int,
  data jsonb,
  updated_at timestamptz default now()
);

-- Backwards-compat kv table used by frontend/server sync
create table if not exists kv (
  key text primary key,
  value jsonb,
  created_at timestamptz default now()
);

-- Indexes
create index if not exists idx_projects_status on projects(status);
create index if not exists idx_clients_created on clients(created_at);

-- Seed common link categories
insert into link_cats(name)
select val from (values
  ('Tile Shops'),('Plumbing & Sanitaryware'),('Paint Brands'),
  ('Hardware & Handles'),('Furniture Vendors'),('Lighting Suppliers'),
  ('Wallpaper & Fabric'),('Contractors'),('Inspiration')
) as t(val)
on conflict (name) do nothing;

-- Example: enable RLS and add permissive policies for quick testing (DEVELOPER ONLY)
alter table kv enable row level security;
create policy anon_select_kv on kv for select using (true);
create policy anon_upsert_kv on kv for all using (true) with check (true);

alter table projects enable row level security;
create policy anon_select_projects on projects for select using (true);
create policy anon_write_projects on projects for all using (true) with check (true);

alter table clients enable row level security;
create policy anon_select_clients on clients for select using (true);
create policy anon_write_clients on clients for all using (true) with check (true);

alter table mood_items enable row level security;
create policy anon_select_mood on mood_items for select using (true);
create policy anon_write_mood on mood_items for all using (true) with check (true);

alter table links enable row level security;
create policy anon_select_links on links for select using (true);
create policy anon_write_links on links for all using (true) with check (true);

alter table link_cats enable row level security;
create policy anon_select_linkcats on link_cats for select using (true);
create policy anon_write_linkcats on link_cats for all using (true) with check (true);

alter table kit_data enable row level security;
create policy anon_select_kit on kit_data for select using (true);
create policy anon_write_kit on kit_data for all using (true) with check (true);

-- CRUD examples
-- Insert a project
-- insert into projects(id,name,client,status,created_at) values ('p1','Sharma Villa','Mr Sharma','active',now());

-- Read projects
-- select * from projects where status='active' order by created_at desc;

-- Upsert kit data
-- insert into kit_data(key,project_tag,doc_idx,data) values ('doc0_p1','p1',0,'{"d-name":"Mr Sharma"}') on conflict (key) do update set data = excluded.data, updated_at = now();
