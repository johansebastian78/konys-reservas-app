-- =========================================================
-- KONYS PIZZA - Script de base de datos para Supabase
-- Copia todo y pégalo en Supabase > SQL Editor > Run
-- =========================================================

-- 1. Tabla mesas
create table mesas (
  id bigint generated always as identity primary key,
  nombre text not null,
  zona text not null default 'salon',          -- 'terraza' o 'salon'
  capacidad int not null,
  activa boolean not null default true,
  foto_url text,
  creado_en timestamptz default now()
);

-- 2. Tabla horarios
create table horarios (
  id bigint generated always as identity primary key,
  dia_semana text not null,                    -- lunes, martes, miercoles...
  jornada text not null,                       -- 'almuerzo' o 'noche'
  hora_inicio text not null,                   -- '12:30'
  hora_fin text not null,                      -- '14:30'
  duracion_slot int not null default 60,       -- minutos
  activo boolean not null default true
);

-- 3. Tabla reservas
create table reservas (
  id bigint generated always as identity primary key,
  mesa_id bigint references mesas(id) on delete cascade,
  cliente_nombre text not null,
  cliente_contacto text,
  num_personas int not null,
  fecha date not null,
  hora_inicio text not null,
  hora_fin text not null,
  estado text not null default 'confirmada',   -- confirmada, cancelada, completada
  creado_en timestamptz default now()
);

-- 4. Tabla platos
create table platos (
  id bigint generated always as identity primary key,
  nombre text not null,
  categoria text not null,                     -- pizzas, entradas, postres, bebidas
  descripcion text,
  precio int not null,
  disponible boolean not null default true
);

-- =========================================================
-- Seguridad (Row Level Security)
-- Para el proyecto académico se permite leer y escribir con la anon key.
-- En producción se debería restringir la escritura.
-- =========================================================
alter table mesas enable row level security;
alter table horarios enable row level security;
alter table reservas enable row level security;
alter table platos enable row level security;

create policy "acceso publico" on mesas for all using (true) with check (true);
create policy "acceso publico" on horarios for all using (true) with check (true);
create policy "acceso publico" on reservas for all using (true) with check (true);
create policy "acceso publico" on platos for all using (true) with check (true);

-- =========================================================
-- Datos de prueba
-- =========================================================
insert into mesas (nombre, zona, capacidad, activa) values
('Mesa 1', 'terraza', 2, true),
('Mesa 2', 'terraza', 4, true),
('Mesa 3', 'salon', 6, true),
('Mesa 4', 'salon', 4, false),
('Mesa 5', 'salon', 8, true);

-- Dos jornadas todos los días
insert into horarios (dia_semana, jornada, hora_inicio, hora_fin, duracion_slot)
select d, 'almuerzo', '12:30', '14:30', 60
from unnest(array['lunes','martes','miercoles','jueves','viernes','sabado','domingo']) as d;

insert into horarios (dia_semana, jornada, hora_inicio, hora_fin, duracion_slot)
select d, 'noche', '17:00', '23:00', 60
from unnest(array['lunes','martes','miercoles','jueves','viernes','sabado','domingo']) as d;

insert into platos (nombre, categoria, descripcion, precio) values
('Pizza Konys Especial', 'pizzas', 'Jamón, pepperoni, champiñones, pimentón y queso doble', 42000),
('Pizza Hawaiana', 'pizzas', 'Jamón, piña y queso mozzarella', 36000),
('Pizza Pepperoni', 'pizzas', 'Pepperoni y queso mozzarella', 38000),
('Pizza Vegetariana', 'pizzas', 'Champiñones, pimentón, cebolla, aceitunas y maíz', 35000),
('Pan de ajo', 'entradas', 'Pan artesanal con mantequilla de ajo y queso', 12000),
('Alitas BBQ', 'entradas', 'Seis alitas en salsa BBQ', 18000),
('Brownie con helado', 'postres', 'Brownie caliente con bola de helado de vainilla', 14000),
('Limonada de coco', 'bebidas', 'Vaso de 16 onzas', 9000),
('Gaseosa', 'bebidas', 'Personal 400 ml', 5000);
