
-- Eliminar tablas existentes si es necesario (en orden inverso de dependencias)
DROP TABLE IF EXISTS "public"."paradas_reparto";
DROP TABLE IF EXISTS "public"."envios";
DROP TABLE IF EXISTS "public"."repartos";
DROP TABLE IF EXISTS "public"."capacidad";
DROP TABLE IF EXISTS "public"."repartidores";
DROP TABLE IF EXISTS "public"."clientes";
DROP TABLE IF EXISTS "public"."empresas";
DROP TABLE IF EXISTS "public"."tipos_empresa";
DROP TABLE IF EXISTS "public"."tarifas_servicio";
DROP TABLE IF EXISTS "public"."tipos_servicio";
DROP TABLE IF EXISTS "public"."tipos_paquete";
DROP TABLE IF EXISTS "public"."tipos_reparto";
DROP TABLE IF EXISTS "public"."tipos_envio";
DROP TABLE IF EXISTS "public"."tipos_cliente";

-- Crear enum para tipo_parada
CREATE TYPE "public"."tipoparadaenum" AS ENUM (
  'RECOLECCION',
  'ENTREGA'
);

-- Crear tabla tipos_cliente
CREATE TABLE "public"."tipos_cliente" (
  "id_tipo_cliente" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "nombre" text NOT NULL,
  "descripcion" text,
  "created_at" timestamptz DEFAULT now() NOT NULL
);
ALTER TABLE "public"."tipos_cliente" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to tipos_cliente" ON "public"."tipos_cliente" FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users full access to tipos_cliente" ON "public"."tipos_cliente" FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Crear tabla tipos_paquete
CREATE TABLE "public"."tipos_paquete" (
  "id_tipo_paquete" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "nombre" text NOT NULL,
  "descripcion" text,
  "dimensiones" text,
  "activo" boolean DEFAULT true NOT NULL,
  "created_at" timestamptz DEFAULT now() NOT NULL
);
ALTER TABLE "public"."tipos_paquete" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to tipos_paquete" ON "public"."tipos_paquete" FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users full access to tipos_paquete" ON "public"."tipos_paquete" FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Crear tabla tipos_servicio
CREATE TABLE "public"."tipos_servicio" (
  "id_tipo_servicio" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "nombre" text NOT NULL,
  "descripcion" text,
  "created_at" timestamptz DEFAULT now() NOT NULL
);
ALTER TABLE "public"."tipos_servicio" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to tipos_servicio" ON "public"."tipos_servicio" FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users full access to tipos_servicio" ON "public"."tipos_servicio" FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Crear tabla tarifas_servicio
CREATE TABLE "public"."tarifas_servicio" (
  "id_tarifa_servicio" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "id_tipo_servicio" uuid NOT NULL REFERENCES "public"."tipos_servicio"("id_tipo_servicio") ON DELETE CASCADE,
  "hasta_km" numeric NOT NULL,
  "precio" numeric NOT NULL,
  "created_at" timestamptz DEFAULT now() NOT NULL
);
ALTER TABLE "public"."tarifas_servicio" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to tarifas_servicio" ON "public"."tarifas_servicio" FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users full access to tarifas_servicio" ON "public"."tarifas_servicio" FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Crear tabla tipos_reparto
CREATE TABLE "public"."tipos_reparto" (
  "id_tipo_reparto" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "nombre" text NOT NULL,
  "descripcion" text,
  "activo" boolean DEFAULT true NOT NULL,
  "created_at" timestamptz DEFAULT now() NOT NULL
);
ALTER TABLE "public"."tipos_reparto" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to tipos_reparto" ON "public"."tipos_reparto" FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users full access to tipos_reparto" ON "public"."tipos_reparto" FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Crear tabla tipos_envio
CREATE TABLE "public"."tipos_envio" (
  "id_tipo_envio" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "nombre" text NOT NULL,
  "descripcion" text,
  "activo" boolean DEFAULT true NOT NULL,
  "created_at" timestamptz DEFAULT now() NOT NULL
);
ALTER TABLE "public"."tipos_envio" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to tipos_envio" ON "public"."tipos_envio" FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users full access to tipos_envio" ON "public"."tipos_envio" FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Crear tabla tipos_empresa
CREATE TABLE "public"."tipos_empresa" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "nombre" text NOT NULL,
  "descripcion" text,
  "created_at" timestamptz DEFAULT now() NOT NULL
);
ALTER TABLE "public"."tipos_empresa" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to tipos_empresa" ON "public"."tipos_empresa" FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users full access to tipos_empresa" ON "public"."tipos_empresa" FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Crear tabla empresas
CREATE TABLE "public"."empresas" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "id_tipo_empresa" uuid REFERENCES "public"."tipos_empresa"("id") ON DELETE SET NULL,
  "razon_social" text NOT NULL,
  "cuit" text UNIQUE,
  "email_contacto" text,
  "telefono_contacto" text,
  "direccion_fiscal" text,
  "notas" text,
  "created_at" timestamptz DEFAULT now() NOT NULL
);
ALTER TABLE "public"."empresas" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to empresas" ON "public"."empresas" FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users full access to empresas" ON "public"."empresas" FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Crear tabla clientes
CREATE TABLE "public"."clientes" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "id_tipo_cliente" uuid REFERENCES "public"."tipos_cliente"("id_tipo_cliente") ON DELETE SET NULL,
  "id_empresa" uuid REFERENCES "public"."empresas"("id") ON DELETE SET NULL, -- Si un cliente puede estar asociado a una empresa
  "nombre" text NOT NULL,
  "apellido" text,
  "email" text UNIQUE,
  "telefono" text,
  "direccion_completa" text,
  "latitud" numeric,
  "longitud" numeric,
  "notas" text,
  "created_at" timestamptz DEFAULT now() NOT NULL
);
ALTER TABLE "public"."clientes" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to clientes" ON "public"."clientes" FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users full access to clientes" ON "public"."clientes" FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Crear tabla repartidores
CREATE TABLE "public"."repartidores" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "nombre" text NOT NULL,
  "apellido" text NOT NULL,
  "dni" text UNIQUE,
  "telefono" text,
  "email" text UNIQUE,
  "activo" boolean DEFAULT true NOT NULL,
  "created_at" timestamptz DEFAULT now() NOT NULL
  -- id_capacidad (FK) se elimina, la capacidad se vincula desde la tabla capacidad
);
ALTER TABLE "public"."repartidores" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to repartidores" ON "public"."repartidores" FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users full access to repartidores" ON "public"."repartidores" FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Crear tabla capacidad
CREATE TABLE "public"."capacidad" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "id_repartidor" uuid NOT NULL REFERENCES "public"."repartidores"("id") ON DELETE CASCADE,
  "nombre_vehiculo" text, -- ej. "Moto con Baul", "Auto Chico"
  "tipo_vehiculo" text NOT NULL,
  "carga_max_kg" numeric,
  "volumen_max_m3" numeric,
  "created_at" timestamptz DEFAULT now() NOT NULL
);
ALTER TABLE "public"."capacidad" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to capacidad" ON "public"."capacidad" FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users full access to capacidad" ON "public"."capacidad" FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Crear tabla repartos
CREATE TABLE "public"."repartos" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "id_repartidor" uuid REFERENCES "public"."repartidores"("id") ON DELETE SET NULL,
  "id_tipo_reparto" uuid NOT NULL REFERENCES "public"."tipos_reparto"("id_tipo_reparto") ON DELETE RESTRICT,
  "id_empresa" uuid REFERENCES "public"."empresas"("id") ON DELETE SET NULL, -- Si el reparto es para una empresa específica
  "fecha_programada" date NOT NULL,
  "estado" text NOT NULL DEFAULT 'PENDIENTE', -- e.g., PENDIENTE, ASIGNADO, EN_CURSO, COMPLETADO, CANCELADO
  "tipo" text, -- e.g. EMPRESA, INDIVIDUAL
  "created_at" timestamptz DEFAULT now() NOT NULL
);
ALTER TABLE "public"."repartos" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to repartos" ON "public"."repartos" FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users full access to repartos" ON "public"."repartos" FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Crear tabla envios
CREATE TABLE "public"."envios" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "id_cliente" uuid NOT NULL REFERENCES "public"."clientes"("id") ON DELETE RESTRICT,
  "id_tipo_envio" uuid NOT NULL REFERENCES "public"."tipos_envio"("id_tipo_envio") ON DELETE RESTRICT,
  "id_tipo_paquete" uuid NOT NULL REFERENCES "public"."tipos_paquete"("id_tipo_paquete") ON DELETE RESTRICT,
  "id_tipo_servicio" uuid NOT NULL REFERENCES "public"."tipos_servicio"("id_tipo_servicio") ON DELETE RESTRICT,
  "id_reparto" uuid REFERENCES "public"."repartos"("id") ON DELETE SET NULL,
  "direccion_origen" text,
  "latitud_origen" numeric,
  "longitud_origen" numeric,
  "direccion_destino" text NOT NULL,
  "latitud_destino" numeric,
  "longitud_destino" numeric,
  "client_location" text, -- Para búsqueda/input de dirección geocodificable
  "peso" numeric, -- Renombrado de package_weight
  "dimensiones_cm" text, -- Campo añadido para almacenar dimensiones como string
  "fecha_solicitud" date DEFAULT CURRENT_DATE NOT NULL,
  "estado" text NOT NULL DEFAULT 'PENDIENTE', -- e.g. PENDIENTE, ASIGNADO_REPARTO, EN_TRANSITO, ENTREGADO, CANCELADO
  "precio_total" numeric,
  "notas" text,
  "suggested_options" jsonb,
  "reasoning" text,
  "precio_servicio_final" numeric, -- Campo del prompt
  "created_at" timestamptz DEFAULT now() NOT NULL
);
ALTER TABLE "public"."envios" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to envios" ON "public"."envios" FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users full access to envios" ON "public"."envios" FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Crear tabla paradas_reparto
CREATE TABLE "public"."paradas_reparto" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "id_reparto" uuid NOT NULL REFERENCES "public"."repartos"("id") ON DELETE CASCADE,
  "id_envio" uuid NOT NULL REFERENCES "public"."envios"("id") ON DELETE CASCADE,
  "orden" integer NOT NULL,
  "direccion_parada" text NOT NULL,
  "tipo_parada" public.tipoparadaenum NOT NULL,
  "estado_parada" text NOT NULL DEFAULT 'PENDIENTE', -- e.g. PENDIENTE, COMPLETADA, FALLIDA
  "hora_estimada_llegada" time,
  "hora_real_llegada" time,
  "created_at" timestamptz DEFAULT now() NOT NULL
);
ALTER TABLE "public"."paradas_reparto" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to paradas_reparto" ON "public"."paradas_reparto" FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users full access to paradas_reparto" ON "public"."paradas_reparto" FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');


-- Insertar datos de ejemplo

-- Tipos de Cliente
INSERT INTO "public"."tipos_cliente" ("nombre", "descripcion") VALUES
('Individual', 'Cliente particular'),
('Corporativo', 'Cliente empresarial o PyME');

-- Tipos de Paquete
INSERT INTO "public"."tipos_paquete" ("nombre", "descripcion", "dimensiones", "activo") VALUES
('Sobre', 'Documentos y objetos planos', 'Max 30x40cm, 0.5kg', TRUE),
('Paquete Pequeño', 'Cajas pequeñas', 'Max 20x20x20cm, 2kg', TRUE),
('Paquete Mediano', 'Cajas medianas', 'Max 40x40x40cm, 10kg', TRUE),
('Paquete Grande', 'Cajas grandes', 'Max 60x60x60cm, 25kg', FALSE);

-- Tipos de Servicio
INSERT INTO "public"."tipos_servicio" ("id_tipo_servicio", "nombre", "descripcion") VALUES
('a1b2c3d4-e5f6-7777-8888-999999990001', 'Envíos Express', 'Entrega urgente en la ciudad.'),
('a1b2c3d4-e5f6-7777-8888-999999990002', 'Envíos LowCost', 'Entrega económica programada.'),
('a1b2c3d4-e5f6-7777-8888-999999990003', 'Moto Fija', 'Servicio de mensajería con moto asignada para cliente.'),
('a1b2c3d4-e5f6-7777-8888-999999990004', 'Plan Emprendedores', 'Tarifas especiales y soluciones para emprendedores.'),
('a1b2c3d4-e5f6-7777-8888-999999990005', 'Envíos Flex', 'Servicio adaptable a necesidades específicas.');

-- Tarifas de Servicio (asociadas a Tipos de Servicio)
INSERT INTO "public"."tarifas_servicio" ("id_tipo_servicio", "hasta_km", "precio") VALUES
('a1b2c3d4-e5f6-7777-8888-999999990001', 5.0, 1500.00),
('a1b2c3d4-e5f6-7777-8888-999999990001', 10.0, 2500.00),
('a1b2c3d4-e5f6-7777-8888-999999990002', 5.0, 800.00),
('a1b2c3d4-e5f6-7777-8888-999999990002', 10.0, 1200.00),
('a1b2c3d4-e5f6-7777-8888-999999990003', 50.0, 50000.00), -- Tarifa única para Moto Fija
('a1b2c3d4-e5f6-7777-8888-999999990004', 5.0, 600.00),
('a1b2c3d4-e5f6-7777-8888-999999990004', 10.0, 900.00);


-- Tipos de Reparto
INSERT INTO "public"."tipos_reparto" ("nombre", "descripcion", "activo") VALUES
('Reparto Matutino Estándar', 'Entregas programadas por la mañana.', TRUE),
('Reparto Urgente Individual', 'Entrega prioritaria para un solo cliente.', TRUE),
('Recogida Vespertina Programada', 'Recogidas programadas por la tarde.', FALSE),
('Viaje de Empresa', 'Ruta optimizada para múltiples entregas empresariales.', TRUE),
('Viaje Individual Directo', 'Envío directo de punto A a punto B.', TRUE);


-- Tipos de Envío
INSERT INTO "public"."tipos_envio" ("nombre", "descripcion", "activo") VALUES
('Estándar Nacional', 'Entrega estándar a nivel nacional.', TRUE),
('Frágil Asegurado', 'Para artículos delicados con seguro opcional.', TRUE),
('Internacional Económico', 'Opción más barata para envíos al exterior.', FALSE),
('Contra Reembolso', 'Pago en destino.', TRUE);

-- Tipos de Empresa
INSERT INTO "public"."tipos_empresa" ("nombre", "descripcion") VALUES
('Proveedor Logístico', 'Empresa que provee servicios de logística.'),
('Cliente Corporativo Grande', 'Grandes empresas que utilizan los servicios.'),
('PyME Asociada', 'Pequeñas y medianas empresas.'),
('Retail', 'Tiendas y comercios.');

-- Datos de Ejemplo para Tablas Operativas (muy básicos)
-- Empresas
INSERT INTO "public"."empresas" ("id_tipo_empresa", "razon_social", "cuit") VALUES
((SELECT "id" FROM "public"."tipos_empresa" WHERE "nombre" = 'Cliente Corporativo Grande' LIMIT 1), 'Tech Solutions SRL', '30-12345678-9'),
((SELECT "id" FROM "public"."tipos_empresa" WHERE "nombre" = 'PyME Asociada' LIMIT 1), 'Librería El Saber', '33-87654321-0');

-- Clientes
INSERT INTO "public"."clientes" ("id_tipo_cliente", "nombre", "apellido", "email", "id_empresa") VALUES
((SELECT "id_tipo_cliente" FROM "public"."tipos_cliente" WHERE "nombre" = 'Individual' LIMIT 1), 'Juan', 'Perez', 'juan.perez@example.com', NULL),
((SELECT "id_tipo_cliente" FROM "public"."tipos_cliente" WHERE "nombre" = 'Corporativo' LIMIT 1), 'Ana', 'Gomez (Contacto)', 'ana.gomez@techsolutions.com', (SELECT "id" FROM "public"."empresas" WHERE "razon_social" = 'Tech Solutions SRL' LIMIT 1));

-- Repartidores
INSERT INTO "public"."repartidores" ("nombre", "apellido", "dni", "activo") VALUES
('Carlos', 'Rodriguez', '12345678', TRUE),
('Lucia', 'Fernandez', '87654321', TRUE);

-- Capacidad
INSERT INTO "public"."capacidad" ("id_repartidor", "nombre_vehiculo", "tipo_vehiculo", "carga_max_kg") VALUES
((SELECT "id" FROM "public"."repartidores" WHERE "nombre" = 'Carlos' LIMIT 1), 'Moto Honda Wave', 'Moto', 20),
((SELECT "id" FROM "public"."repartidores" WHERE "nombre" = 'Lucia' LIMIT 1), 'Fiorino', 'Auto', 500);

-- Repartos
INSERT INTO "public"."repartos" ("id_repartidor", "id_tipo_reparto", "fecha_programada", "estado", "tipo") VALUES
((SELECT "id" FROM "public"."repartidores" WHERE "nombre" = 'Carlos' LIMIT 1), (SELECT "id_tipo_reparto" FROM "public"."tipos_reparto" WHERE "nombre" = 'Reparto Matutino Estándar' LIMIT 1), '2024-07-15', 'ASIGNADO', 'INDIVIDUAL');

-- Envíos
INSERT INTO "public"."envios" ("id_cliente", "id_tipo_envio", "id_tipo_paquete", "id_tipo_servicio", "direccion_destino", "estado", "peso") VALUES
((SELECT "id" FROM "public"."clientes" WHERE "nombre" = 'Juan' LIMIT 1), (SELECT "id_tipo_envio" FROM "public"."tipos_envio" WHERE "nombre" = 'Estándar Nacional' LIMIT 1), (SELECT "id_tipo_paquete" FROM "public"."tipos_paquete" WHERE "nombre" = 'Paquete Pequeño' LIMIT 1), (SELECT "id_tipo_servicio" FROM "public"."tipos_servicio" WHERE "nombre" = 'Envíos LowCost' LIMIT 1), 'Calle Falsa 123, Springfield', 'PENDIENTE', 1.5);

-- Paradas Reparto
INSERT INTO "public"."paradas_reparto" ("id_reparto", "id_envio", "orden", "direccion_parada", "tipo_parada", "estado_parada") VALUES
((SELECT "id" FROM "public"."repartos" LIMIT 1), (SELECT "id" FROM "public"."envios" LIMIT 1), 1, 'Calle Falsa 123, Springfield', 'ENTREGA', 'PENDIENTE');

-- Habilitar RLS para todas las tablas (ejemplo genérico, ajustar según necesidad)
-- Esto ya se hizo arriba para cada tabla individualmente, solo como recordatorio.
-- ALTER TABLE "public"."clientes" ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow public read access" ON "public"."clientes" FOR SELECT USING (true);
-- CREATE POLICY "Allow authenticated users full access" ON "public"."clientes" FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
-- Repetir para las demás tablas...

-- Nota: Los IDs UUID para datos de ejemplo en tablas operativas
-- son generados automáticamente por `DEFAULT gen_random_uuid()`.
-- Los IDs para `tipos_servicio` se especificaron para facilitar la inserción en `tarifas_servicio`.
-- Para otras FKs, se usan subconsultas para obtener los IDs correspondientes.
-- En un entorno real, los IDs serían generados por la aplicación o la BD.
-- Asegúrate de que los nombres de las constraint FK sean únicos si se generan automáticamente o especifícalos.

-- Comentarios adicionales:
-- - Se han usado nombres de columna en español según el esquema visual (ej. `id_envio` en `envios`).
-- - Los campos `activo` se han añadido a `tipos_paquete`, `tipos_reparto`, `tipos_envio`, `repartidores`.
-- - `created_at` se ha añadido a la mayoría de las tablas con `DEFAULT now()`.
-- - El campo `id_capacidad` en `repartidores` (del esquema visual) se omitió ya que la relación es 1 a N desde repartidor a capacidad (un repartidor puede tener varias capacidades, o una capacidad pertenece a un repartidor). La FK está en `capacidad`.
-- - `envios.client_location` es `text`, la geocodificación real es una lógica de aplicación.
-- - `envios.estado` y `repartos.estado` son `text`, se pueden usar enums de BD o validación en la app.
-- - `paradas_reparto.tipo_parada` usa el enum `public.tipoparadaenum`.

ALTER TABLE "public"."paradas_reparto" ALTER COLUMN "tipo_parada" TYPE public.tipoparadaenum USING "tipo_parada"::public.tipoparadaenum;
ALTER TABLE "public"."repartos" ADD COLUMN "id_empresa_despachante" uuid REFERENCES "public"."empresas"("id") ON DELETE SET NULL;
ALTER TABLE "public"."envios" ADD COLUMN "precio_calculado" numeric;
ALTER TABLE "public"."envios" ADD COLUMN "distancia_km" numeric;
ALTER TABLE "public"."envios" ADD COLUMN "id_repartidor_preferido" uuid REFERENCES "public"."repartidores"("id") ON DELETE SET NULL;
ALTER TABLE "public"."envios" ADD COLUMN "id_empresa_cliente" uuid REFERENCES "public"."empresas"("id") ON DELETE SET NULL;

COMMENT ON COLUMN "public"."envios"."client_location" IS 'Campo de texto para la dirección del cliente, potencialmente para geocodificación o búsqueda.';
COMMENT ON COLUMN "public"."envios"."peso" IS 'Peso del paquete en kilogramos.';
COMMENT ON COLUMN "public"."envios"."dimensiones_cm" IS 'Dimensiones del paquete como texto, ej: "30x20x10".';
COMMENT ON COLUMN "public"."envios"."estado" IS 'Estado actual del envío, ej: PENDIENTE, ASIGNADO_REPARTO, EN_TRANSITO, ENTREGADO, CANCELADO.';
COMMENT ON COLUMN "public"."envios"."suggested_options" IS 'Opciones de envío sugeridas por la IA (JSON).';
COMMENT ON COLUMN "public"."envios"."reasoning" IS 'Justificación de la IA para las opciones sugeridas.';
COMMENT ON COLUMN "public"."envios"."precio_servicio_final" IS 'Precio final del servicio de envío.';
COMMENT ON COLUMN "public"."envios"."id_repartidor_preferido" IS 'Repartidor preferido por el cliente para este envío, si aplica.';
COMMENT ON COLUMN "public"."envios"."id_empresa_cliente" IS 'Si el cliente es una empresa, su ID.';
COMMENT ON COLUMN "public"."repartos"."id_empresa_despachante" IS 'Empresa que despacha el reparto (si aplica, ej. un centro de distribución).';


-- Ajustes basados en el prompt que pueden no estar en la imagen pero son lógicos:
-- El prompt menciona `tarifas_distancia_calculadora` y `envios.precio_servicio_final`, `suggested_options`, `reasoning`.
-- El esquema visual es la fuente principal para la estructura de tablas.
-- `tarifas_servicio` está conectada a `tipos_servicio`, lo cual es más lógico que una tabla separada `tarifas_distancia_calculadora` si las tarifas son por tipo de servicio.
-- Mantendré `tarifas_servicio` como la tabla para las tarifas.
-- Los campos adicionales en `envios` del prompt (suggested_options, reasoning, precio_servicio_final) se han añadido.
-- El campo `client_location` se añade a envios como TEXT para la dirección geocodificable. Los campos lat/long individuales en envios (de la imagen) se mantienen también.

-- Revisar FKs y constraints. Ejemplo de constraint explícito si es necesario:
-- ALTER TABLE "public"."envios" ADD CONSTRAINT "envios_id_reparto_fkey" FOREIGN KEY ("id_reparto") REFERENCES "public"."repartos"("id_reparto") ON DELETE SET NULL;
-- (Supabase usualmente infiere bien los nombres de constraints si se usa REFERENCES directamente en la definición de columna)

-- Final check on all table relations and field types based on the image and prompt details.
-- Note: The original `supabase/seed.sql` had `client_types`, etc. These are now `tipos_cliente`.

SELECT 'Schema y datos de ejemplo para Rumbos Envios creados/actualizados.' as status;

    