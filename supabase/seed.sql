
-- Supabase Seed SQL for Rumbos Envios

-- Drop tables in reverse order of dependency or use CASCADE
DROP TABLE IF EXISTS public.paradas_reparto CASCADE;
DROP TABLE IF EXISTS public.envios CASCADE;
DROP TABLE IF EXISTS public.repartos CASCADE;
DROP TABLE IF EXISTS public.capacidad CASCADE;
DROP TABLE IF EXISTS public.repartidores CASCADE;
DROP TABLE IF EXISTS public.clientes CASCADE;
DROP TABLE IF EXISTS public.empresas CASCADE;
DROP TABLE IF EXISTS public.tipos_empresa CASCADE;
DROP TABLE IF EXISTS public.tarifas_servicio CASCADE;
DROP TABLE IF EXISTS public.tipos_servicio CASCADE;
DROP TABLE IF EXISTS public.tipos_paquete CASCADE;
DROP TABLE IF EXISTS public.tipos_reparto CASCADE;
DROP TABLE IF EXISTS public.tipos_envio CASCADE;
DROP TABLE IF EXISTS public.tipos_cliente CASCADE;

-- Drop enums if they exist
DROP TYPE IF EXISTS public.tipoparadaenum;

-- Create ENUM types
CREATE TYPE public.tipoparadaenum AS ENUM (
  'RECOLECCION',
  'ENTREGA'
);

-- Create Tables
CREATE TABLE public.tipos_cliente (
  id_tipo_cliente uuid NOT NULL DEFAULT gen_random_uuid (),
  nombre text NOT NULL,
  descripcion text NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT tipos_cliente_pkey PRIMARY KEY (id_tipo_cliente),
  CONSTRAINT tipos_cliente_nombre_key UNIQUE (nombre)
);

CREATE TABLE public.tipos_paquete (
  id_tipo_paquete uuid NOT NULL DEFAULT gen_random_uuid (),
  nombre text NOT NULL,
  descripcion text NULL,
  dimensiones text NULL,
  activo boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT tipos_paquete_pkey PRIMARY KEY (id_tipo_paquete),
  CONSTRAINT tipos_paquete_nombre_key UNIQUE (nombre)
);

CREATE TABLE public.tipos_servicio (
  id_tipo_servicio uuid NOT NULL DEFAULT gen_random_uuid (),
  nombre text NOT NULL,
  descripcion text NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT tipos_servicio_pkey PRIMARY KEY (id_tipo_servicio),
  CONSTRAINT tipos_servicio_nombre_key UNIQUE (nombre)
);

CREATE TABLE public.tipos_reparto (
  id_tipo_reparto uuid NOT NULL DEFAULT gen_random_uuid (),
  nombre text NOT NULL,
  descripcion text NULL,
  activo boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT tipos_reparto_pkey PRIMARY KEY (id_tipo_reparto),
  CONSTRAINT tipos_reparto_nombre_key UNIQUE (nombre)
);

CREATE TABLE public.tipos_envio (
  id_tipo_envio uuid NOT NULL DEFAULT gen_random_uuid (),
  nombre text NOT NULL,
  descripcion text NULL,
  activo boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT tipos_envio_pkey PRIMARY KEY (id_tipo_envio),
  CONSTRAINT tipos_envio_nombre_key UNIQUE (nombre)
);

CREATE TABLE public.tipos_empresa (
  id uuid NOT NULL DEFAULT gen_random_uuid (),
  nombre text NOT NULL,
  descripcion text NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT tipos_empresa_pkey PRIMARY KEY (id),
  CONSTRAINT tipos_empresa_nombre_key UNIQUE (nombre)
);

CREATE TABLE public.empresas (
  id uuid NOT NULL DEFAULT gen_random_uuid (),
  id_tipo_empresa uuid NULL,
  razon_social text NOT NULL,
  cuit text NULL,
  email_contacto text NULL,
  telefono_contacto text NULL,
  direccion_fiscal text NULL,
  latitud numeric NULL,
  longitud numeric NULL,
  notas text NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT empresas_pkey PRIMARY KEY (id),
  CONSTRAINT empresas_cuit_key UNIQUE (cuit),
  CONSTRAINT empresas_razon_social_key UNIQUE (razon_social),
  CONSTRAINT empresas_id_tipo_empresa_fkey FOREIGN KEY (id_tipo_empresa) REFERENCES tipos_empresa (id) ON DELETE SET NULL
);

CREATE TABLE public.tarifas_servicio (
  id_tarifa_servicio uuid NOT NULL DEFAULT gen_random_uuid (),
  id_tipo_servicio uuid NOT NULL,
  hasta_km numeric NOT NULL,
  precio numeric NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT tarifas_servicio_pkey PRIMARY KEY (id_tarifa_servicio),
  CONSTRAINT tarifas_servicio_id_tipo_servicio_fkey FOREIGN KEY (id_tipo_servicio) REFERENCES tipos_servicio (id_tipo_servicio) ON DELETE CASCADE,
  CONSTRAINT tarifas_servicio_tipo_km_key UNIQUE (id_tipo_servicio, hasta_km)
);

CREATE TABLE public.clientes (
  id uuid NOT NULL DEFAULT gen_random_uuid (),
  id_tipo_cliente uuid NULL,
  id_empresa uuid NULL,
  nombre text NOT NULL,
  apellido text NULL,
  email text NULL,
  telefono text NULL,
  direccion_completa text NULL,
  latitud numeric NULL,
  longitud numeric NULL,
  notas text NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT clientes_pkey PRIMARY KEY (id),
  CONSTRAINT clientes_email_key UNIQUE (email),
  CONSTRAINT clientes_id_tipo_cliente_fkey FOREIGN KEY (id_tipo_cliente) REFERENCES tipos_cliente (id_tipo_cliente) ON DELETE SET NULL,
  CONSTRAINT clientes_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES empresas (id) ON DELETE SET NULL
);

CREATE TABLE public.repartidores (
  id uuid NOT NULL DEFAULT gen_random_uuid (),
  nombre text NOT NULL,
  apellido text NOT NULL,
  dni text NULL,
  telefono text NULL,
  email text NULL,
  activo boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT repartidores_pkey PRIMARY KEY (id),
  CONSTRAINT repartidores_dni_key UNIQUE (dni)
);

CREATE TABLE public.capacidad (
  id uuid NOT NULL DEFAULT gen_random_uuid (),
  id_repartidor uuid NOT NULL,
  nombre_vehiculo text NULL,
  tipo_vehiculo text NOT NULL,
  carga_max_kg numeric NULL,
  volumen_max_m3 numeric NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT capacidad_pkey PRIMARY KEY (id),
  CONSTRAINT capacidad_id_repartidor_fkey FOREIGN KEY (id_repartidor) REFERENCES repartidores (id) ON DELETE CASCADE,
  CONSTRAINT capacidad_repartidor_tipo_vehiculo_key UNIQUE (id_repartidor, tipo_vehiculo)
);

CREATE TABLE public.repartos (
  id uuid NOT NULL DEFAULT gen_random_uuid (),
  id_repartidor uuid NULL,
  id_tipo_reparto uuid NOT NULL,
  id_empresa uuid NULL,
  id_empresa_despachante uuid NULL,
  fecha_programada date NOT NULL DEFAULT CURRENT_DATE,
  estado text NOT NULL DEFAULT 'PENDIENTE',
  tipo text NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT repartos_pkey PRIMARY KEY (id),
  CONSTRAINT repartos_id_repartidor_fkey FOREIGN KEY (id_repartidor) REFERENCES repartidores (id) ON DELETE SET NULL,
  CONSTRAINT repartos_id_tipo_reparto_fkey FOREIGN KEY (id_tipo_reparto) REFERENCES tipos_reparto (id_tipo_reparto) ON DELETE RESTRICT,
  CONSTRAINT repartos_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES empresas (id) ON DELETE SET NULL,
  CONSTRAINT repartos_id_empresa_despachante_fkey FOREIGN KEY (id_empresa_despachante) REFERENCES empresas (id) ON DELETE SET NULL
);

CREATE TABLE public.envios (
  id uuid NOT NULL DEFAULT gen_random_uuid (),
  id_cliente uuid NOT NULL,
  id_tipo_envio uuid NOT NULL,
  id_tipo_paquete uuid NOT NULL,
  id_tipo_servicio uuid NOT NULL,
  id_reparto uuid NULL,
  id_repartidor_preferido uuid NULL,
  id_empresa_cliente uuid NULL,
  direccion_origen text NULL,
  latitud_origen numeric NULL,
  longitud_origen numeric NULL,
  direccion_destino text NOT NULL,
  latitud_destino numeric NULL,
  longitud_destino numeric NULL,
  client_location text NULL,
  peso numeric NULL,
  dimensiones_cm text NULL,
  fecha_solicitud date NOT NULL DEFAULT CURRENT_DATE,
  estado text NOT NULL DEFAULT 'PENDIENTE',
  precio_total numeric NULL,
  precio_calculado numeric NULL,
  distancia_km numeric NULL,
  notas text NULL,
  suggested_options jsonb NULL,
  reasoning text NULL,
  precio_servicio_final numeric NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT envios_pkey PRIMARY KEY (id),
  CONSTRAINT envios_id_cliente_fkey FOREIGN KEY (id_cliente) REFERENCES clientes (id) ON DELETE RESTRICT,
  CONSTRAINT envios_id_tipo_envio_fkey FOREIGN KEY (id_tipo_envio) REFERENCES tipos_envio (id_tipo_envio) ON DELETE RESTRICT,
  CONSTRAINT envios_id_tipo_paquete_fkey FOREIGN KEY (id_tipo_paquete) REFERENCES tipos_paquete (id_tipo_paquete) ON DELETE RESTRICT,
  CONSTRAINT envios_id_tipo_servicio_fkey FOREIGN KEY (id_tipo_servicio) REFERENCES tipos_servicio (id_tipo_servicio) ON DELETE RESTRICT,
  CONSTRAINT envios_id_reparto_fkey FOREIGN KEY (id_reparto) REFERENCES repartos (id) ON DELETE SET NULL,
  CONSTRAINT envios_id_repartidor_preferido_fkey FOREIGN KEY (id_repartidor_preferido) REFERENCES repartidores (id) ON DELETE SET NULL,
  CONSTRAINT envios_id_empresa_cliente_fkey FOREIGN KEY (id_empresa_cliente) REFERENCES empresas (id) ON DELETE SET NULL
);

CREATE TABLE public.paradas_reparto (
  id uuid NOT NULL DEFAULT gen_random_uuid (),
  id_reparto uuid NOT NULL,
  id_envio uuid NOT NULL,
  orden integer NOT NULL,
  direccion_parada text NOT NULL,
  tipo_parada public.tipoparadaenum NOT NULL,
  estado_parada text NOT NULL DEFAULT 'PENDIENTE',
  hora_estimada_llegada time without time zone NULL,
  hora_real_llegada time without time zone NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT paradas_reparto_pkey PRIMARY KEY (id),
  CONSTRAINT paradas_reparto_id_reparto_fkey FOREIGN KEY (id_reparto) REFERENCES repartos (id) ON DELETE CASCADE,
  CONSTRAINT paradas_reparto_id_envio_fkey FOREIGN KEY (id_envio) REFERENCES envios (id) ON DELETE CASCADE,
  CONSTRAINT paradas_reparto_unicidad_key UNIQUE (id_reparto, id_envio, tipo_parada, orden)
);

-- Insert Data
DO $$
DECLARE
    tipo_individual_id uuid;
    tipo_corporativo_id uuid;
    
    paquete_sobre_id uuid;
    paquete_pequeno_id uuid;
    paquete_mediano_id uuid;
    
    servicio_express_id uuid;
    servicio_lowcost_id uuid;
    servicio_motofija_id uuid;
    servicio_emprendedores_id uuid;
    servicio_flex_id uuid;

    reparto_matutino_id uuid;
    reparto_urgente_id uuid;
    
    envio_estandar_id uuid;
    envio_fragil_id uuid;

    tipo_empresa_comercio_id uuid := '9c89e874-ad62-4339-9c70-36192d04efe4';
    tipo_empresa_servicios_id uuid := 'a5b0c1d2-e3f4-5678-90ab-cdef12345678';
    tipo_empresa_gastro_id uuid := 'b1c2d3e4-f567-890a-bcde-f12345678901';

    empresa_fibra_id uuid;
    empresa_farmacia_id uuid;
    
    cliente_juan_id uuid;
    repartidor_carlos_id uuid;
    
    reparto_principal_id uuid;
    envio_principal_id uuid;
BEGIN
    -- Tipos de Cliente
    INSERT INTO public.tipos_cliente (nombre, descripcion) VALUES
    ('Individual', 'Cliente particular'),
    ('Corporativo', 'Cliente empresarial')
    ON CONFLICT ON CONSTRAINT tipos_cliente_nombre_key DO NOTHING
    RETURNING id_tipo_cliente INTO tipo_individual_id, tipo_corporativo_id; -- Assuming these return in order or handle separately

    SELECT id_tipo_cliente INTO tipo_individual_id FROM public.tipos_cliente WHERE nombre = 'Individual';
    SELECT id_tipo_cliente INTO tipo_corporativo_id FROM public.tipos_cliente WHERE nombre = 'Corporativo';

    -- Tipos de Paquete
    INSERT INTO public.tipos_paquete (nombre, descripcion, dimensiones, activo) VALUES
    ('Sobre', 'Documentos y objetos planos', 'Max 30x40cm, 0.5kg', TRUE),
    ('Paquete Pequeño', 'Cajas pequeñas', 'Max 20x20x20cm, 2kg', TRUE),
    ('Paquete Mediano', 'Cajas medianas', 'Max 40x40x40cm, 10kg', TRUE),
    ('Paquete Grande', 'Cajas grandes', 'Max 60x60x60cm, 25kg', FALSE)
    ON CONFLICT ON CONSTRAINT tipos_paquete_nombre_key DO NOTHING;

    SELECT id_tipo_paquete INTO paquete_pequeno_id FROM public.tipos_paquete WHERE nombre = 'Paquete Pequeño';

    -- Tipos de Servicio
    INSERT INTO public.tipos_servicio (nombre, descripcion) VALUES
    ('Envíos Express', 'Entrega urgente en la ciudad.'),
    ('Envíos LowCost', 'Entrega económica programada.'),
    ('Moto Fija', 'Servicio de mensajería con moto asignada para cliente.'),
    ('Plan Emprendedores', 'Tarifas especiales y soluciones para emprendedores.'),
    ('Envíos Flex', 'Servicio adaptable a necesidades específicas.')
    ON CONFLICT ON CONSTRAINT tipos_servicio_nombre_key DO NOTHING;

    SELECT id_tipo_servicio INTO servicio_express_id FROM public.tipos_servicio WHERE nombre = 'Envíos Express';
    SELECT id_tipo_servicio INTO servicio_lowcost_id FROM public.tipos_servicio WHERE nombre = 'Envíos LowCost';
    SELECT id_tipo_servicio INTO servicio_motofija_id FROM public.tipos_servicio WHERE nombre = 'Moto Fija';

    -- Tarifas de Servicio
    IF servicio_express_id IS NOT NULL THEN
        INSERT INTO public.tarifas_servicio (id_tipo_servicio, hasta_km, precio) VALUES
        (servicio_express_id, 5.0, 1500.00),
        (servicio_express_id, 10.0, 2500.00)
        ON CONFLICT ON CONSTRAINT tarifas_servicio_tipo_km_key DO NOTHING;
    END IF;
    IF servicio_lowcost_id IS NOT NULL THEN
        INSERT INTO public.tarifas_servicio (id_tipo_servicio, hasta_km, precio) VALUES
        (servicio_lowcost_id, 5.0, 800.00),
        (servicio_lowcost_id, 10.0, 1200.00)
        ON CONFLICT ON CONSTRAINT tarifas_servicio_tipo_km_key DO NOTHING;
    END IF;
    IF servicio_motofija_id IS NOT NULL THEN
        INSERT INTO public.tarifas_servicio (id_tipo_servicio, hasta_km, precio) VALUES
        (servicio_motofija_id, 50.0, 50000.00)
        ON CONFLICT ON CONSTRAINT tarifas_servicio_tipo_km_key DO NOTHING;
    END IF;

    -- Tipos de Reparto
    INSERT INTO public.tipos_reparto (nombre, descripcion, activo) VALUES
    ('Reparto Matutino Estándar', 'Entregas programadas por la mañana.', TRUE),
    ('Reparto Urgente Individual', 'Entrega prioritaria para un solo cliente.', TRUE),
    ('Recogida Vespertina Programada', 'Recogidas programadas por la tarde.', FALSE),
    ('Viaje de Empresa', 'Ruta optimizada para múltiples entregas empresariales.', TRUE),
    ('Viaje Individual Directo', 'Envío directo de punto A a punto B.', TRUE)
    ON CONFLICT ON CONSTRAINT tipos_reparto_nombre_key DO NOTHING;

    SELECT id_tipo_reparto INTO reparto_matutino_id FROM public.tipos_reparto WHERE nombre = 'Reparto Matutino Estándar';

    -- Tipos de Envío
    INSERT INTO public.tipos_envio (nombre, descripcion, activo) VALUES
    ('Envío Estándar Nacional', 'Entrega estándar a nivel nacional.', TRUE),
    ('Envío Frágil Asegurado', 'Para artículos delicados con seguro.', TRUE),
    ('Envío Internacional Económico', 'Opción más barata para envíos al exterior.', FALSE),
    ('Contra Reembolso', 'Pago en destino.', TRUE)
    ON CONFLICT ON CONSTRAINT tipos_envio_nombre_key DO NOTHING;

    SELECT id_tipo_envio INTO envio_estandar_id FROM public.tipos_envio WHERE nombre = 'Envío Estándar Nacional';

    -- Tipos de Empresa
    INSERT INTO public.tipos_empresa (id, nombre, descripcion) VALUES
    (tipo_empresa_comercio_id, 'Comercio General', 'Establecimientos comerciales y tiendas.'),
    (tipo_empresa_servicios_id, 'Proveedor de Servicios', 'Empresas que ofrecen servicios.'),
    (tipo_empresa_gastro_id, 'Restaurante/Gastronomía', 'Locales de comida y bebida.')
    ON CONFLICT ON CONSTRAINT tipos_empresa_nombre_key DO NOTHING;

    -- Empresas
    INSERT INTO public.empresas (id_tipo_empresa, razon_social, direccion_fiscal, latitud, longitud, telefono_contacto, cuit, email_contacto, notas) VALUES
    (tipo_empresa_comercio_id, 'FIBRA HUMANA MDQ', 'Olavarría 2663 piso 2 t3, B7600ELK Mar del Plata, Ciudad Autónoma de Buenos Aires, Argentina', -38.012795897989896, -57.54135036711868, NULL, '30-11111111-1', 'fibrahumana@example.com', 'Notas para Fibra Humana'),
    (tipo_empresa_comercio_id, 'Federada Farmacia', 'Alberti 3973, B7600 Mar del Plata, Provincia de Buenos Aires, Argentina', -37.9989284889773, -57.566679297818766, '+542234761247', '30-22222222-2', 'federada@example.com', 'Notas para Federada Farmacia'),
    (tipo_empresa_comercio_id, 'Social Luro Farmacia', 'Av. Pedro Luro 3499, B7600 Mar del Plata, Provincia de Buenos Aires, Argentina', -37.99333127844352, -57.55520563644476, '+542234730287', '30-33333333-3', 'socialluro@example.com', 'Notas para Social Luro'),
    (tipo_empresa_comercio_id, 'Riddler suplementos', 'Colon 2134 (Galería local 14 Buenos Aires casi, B7600 Mar del Plata, Argentina', -38.0051722714605, -57.5458944591921, '+542266539954', '30-44444444-4', 'riddler@example.com', 'Notas para Riddler'),
    (tipo_empresa_comercio_id, 'EL CÓNDOR', 'Martín Miguel de Güemes 2945, B7600 Mar del Plata, Provincia de Buenos Aires, Argentina', -38.01581317995121, -57.54205700513539, NULL, '30-55555555-5', 'condorguemes@example.com', 'Notas para El Cóndor Güemes')
    ON CONFLICT ON CONSTRAINT empresas_razon_social_key DO NOTHING;
    -- Agrega más empresas si es necesario con ON CONFLICT ON CONSTRAINT empresas_cuit_key o empresas_razon_social_key
    
    SELECT id INTO empresa_fibra_id FROM public.empresas WHERE razon_social = 'FIBRA HUMANA MDQ';

    -- Clientes
    IF tipo_individual_id IS NOT NULL THEN
        INSERT INTO public.clientes (id_tipo_cliente, nombre, apellido, email, telefono, direccion_completa, id_empresa) VALUES
        (tipo_individual_id, 'Juan', 'Perez', 'juan.perez@example.com', '123456789', 'Calle Falsa 123, Springfield', NULL),
        (tipo_corporativo_id, 'Ana', 'Garcia', 'ana.garcia@empresa.com', '987654321', 'Avenida Siempre Viva 742', empresa_fibra_id)
        ON CONFLICT ON CONSTRAINT clientes_email_key DO NOTHING
        RETURNING id INTO cliente_juan_id;
    END IF;

    -- Repartidores
    INSERT INTO public.repartidores (nombre, apellido, dni, activo) VALUES
    ('Carlos', 'Gomez', '30123456', TRUE),
    ('Laura', 'Martinez', '31987654', TRUE)
    ON CONFLICT ON CONSTRAINT repartidores_dni_key DO NOTHING
    RETURNING id INTO repartidor_carlos_id;

    -- Capacidad
    IF repartidor_carlos_id IS NOT NULL THEN
        INSERT INTO public.capacidad (id_repartidor, nombre_vehiculo, tipo_vehiculo, carga_max_kg, volumen_max_m3) VALUES
        (repartidor_carlos_id, 'Moto Honda Wave', 'Moto', 15, 0.1)
        ON CONFLICT ON CONSTRAINT capacidad_repartidor_tipo_vehiculo_key DO UPDATE SET nombre_vehiculo = EXCLUDED.nombre_vehiculo;
    END IF;

    -- Repartos
    IF reparto_matutino_id IS NOT NULL AND repartidor_carlos_id IS NOT NULL AND empresa_fibra_id IS NOT NULL THEN
        INSERT INTO public.repartos (id_tipo_reparto, id_repartidor, fecha_programada, estado, tipo, id_empresa, id_empresa_despachante) VALUES
        (reparto_matutino_id, repartidor_carlos_id, CURRENT_DATE, 'PENDIENTE', 'INDIVIDUAL', empresa_fibra_id, empresa_fibra_id)
        ON CONFLICT ON CONSTRAINT repartos_pkey DO NOTHING -- Assuming ID is the conflict target if it's auto-generated and might clash if script re-run without full reset.
        RETURNING id INTO reparto_principal_id;
    END IF;

    -- Envíos
    IF cliente_juan_id IS NOT NULL AND envio_estandar_id IS NOT NULL AND paquete_pequeno_id IS NOT NULL AND servicio_lowcost_id IS NOT NULL AND reparto_principal_id IS NOT NULL THEN
        INSERT INTO public.envios (id_cliente, id_tipo_envio, id_tipo_paquete, id_tipo_servicio, id_reparto, direccion_destino, fecha_solicitud, estado, peso, precio_servicio_final) VALUES
        (cliente_juan_id, envio_estandar_id, paquete_pequeno_id, servicio_lowcost_id, reparto_principal_id, 'Avenida Siempreviva 742, Springfield', CURRENT_DATE, 'PENDIENTE', 1.5, 800.00)
        ON CONFLICT ON CONSTRAINT envios_pkey DO NOTHING
        RETURNING id INTO envio_principal_id;
    END IF;
    
    -- Paradas Reparto
    IF reparto_principal_id IS NOT NULL AND envio_principal_id IS NOT NULL THEN
        INSERT INTO public.paradas_reparto (id_reparto, id_envio, orden, direccion_parada, tipo_parada, estado_parada, hora_estimada_llegada) VALUES
        (reparto_principal_id, envio_principal_id, 1, 'Origen: Calle Falsa 123', 'RECOLECCION', 'PENDIENTE', '09:00:00'),
        (reparto_principal_id, envio_principal_id, 2, 'Destino: Avenida Siempreviva 742', 'ENTREGA', 'PENDIENTE', '11:00:00')
        ON CONFLICT ON CONSTRAINT paradas_reparto_unicidad_key DO NOTHING;
    END IF;

END $$;
