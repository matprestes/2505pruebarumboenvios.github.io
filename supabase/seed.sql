
-- Supabase Seed SQL for Rumbos Envios
-- Version: Completa con DROPs, CREATEs, INSERTs (sin RLS)

-- Eliminar tablas existentes en el orden correcto para evitar errores de FK o usar CASCADE
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
DROP TABLE IF EXISTS public.tipos_cliente CASCADE;
DROP TABLE IF EXISTS public.tipos_reparto CASCADE;
DROP TABLE IF EXISTS public.tipos_envio CASCADE;

-- Eliminar tipos ENUM si existen
DROP TYPE IF EXISTS public.tipoparadaenum;

-- Crear Tipos ENUM
CREATE TYPE public.tipoparadaenum AS ENUM ('RECOLECCION', 'ENTREGA');

-- Crear Tablas

CREATE TABLE public.tipos_cliente (
  id_tipo_cliente uuid NOT NULL DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  descripcion text NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT tipos_cliente_pkey PRIMARY KEY (id_tipo_cliente),
  CONSTRAINT tipos_cliente_nombre_key UNIQUE (nombre)
);

CREATE TABLE public.tipos_paquete (
  id_tipo_paquete uuid NOT NULL DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  descripcion text NULL,
  dimensiones text NULL,
  activo boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT tipos_paquete_pkey PRIMARY KEY (id_tipo_paquete),
  CONSTRAINT tipos_paquete_nombre_key UNIQUE (nombre)
);

CREATE TABLE public.tipos_servicio (
  id_tipo_servicio uuid NOT NULL DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  descripcion text NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT tipos_servicio_pkey PRIMARY KEY (id_tipo_servicio),
  CONSTRAINT tipos_servicio_nombre_key UNIQUE (nombre)
);

CREATE TABLE public.tarifas_servicio (
  id_tarifa_servicio uuid NOT NULL DEFAULT gen_random_uuid(),
  id_tipo_servicio uuid NOT NULL,
  hasta_km numeric NOT NULL,
  precio numeric NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT tarifas_servicio_pkey PRIMARY KEY (id_tarifa_servicio),
  CONSTRAINT tarifas_servicio_id_tipo_servicio_fkey FOREIGN KEY (id_tipo_servicio) REFERENCES public.tipos_servicio(id_tipo_servicio) ON DELETE CASCADE,
  CONSTRAINT tarifas_servicio_tipo_km_unique UNIQUE (id_tipo_servicio, hasta_km)
);

CREATE TABLE public.tipos_reparto (
  id_tipo_reparto uuid NOT NULL DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  descripcion text NULL,
  activo boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT tipos_reparto_pkey PRIMARY KEY (id_tipo_reparto),
  CONSTRAINT tipos_reparto_nombre_key UNIQUE (nombre)
);

CREATE TABLE public.tipos_envio (
  id_tipo_envio uuid NOT NULL DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  descripcion text NULL,
  activo boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT tipos_envio_pkey PRIMARY KEY (id_tipo_envio),
  CONSTRAINT tipos_envio_nombre_key UNIQUE (nombre)
);

CREATE TABLE public.tipos_empresa (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  descripcion text NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT tipos_empresa_pkey PRIMARY KEY (id),
  CONSTRAINT tipos_empresa_nombre_key UNIQUE (nombre)
);

CREATE TABLE public.empresas (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
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
  CONSTRAINT empresas_id_tipo_empresa_fkey FOREIGN KEY (id_tipo_empresa) REFERENCES public.tipos_empresa(id) ON DELETE SET NULL
);

CREATE TABLE public.clientes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
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
  CONSTRAINT clientes_id_tipo_cliente_fkey FOREIGN KEY (id_tipo_cliente) REFERENCES public.tipos_cliente(id_tipo_cliente) ON DELETE SET NULL,
  CONSTRAINT clientes_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.empresas(id) ON DELETE SET NULL
);

CREATE TABLE public.repartidores (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  apellido text NOT NULL,
  dni text NULL,
  telefono text NULL,
  email text NULL,
  activo boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT repartidores_pkey PRIMARY KEY (id),
  CONSTRAINT repartidores_dni_key UNIQUE (dni),
  CONSTRAINT repartidores_email_key UNIQUE (email)
);

CREATE TABLE public.capacidad (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  id_repartidor uuid NOT NULL,
  nombre_vehiculo text NULL,
  tipo_vehiculo text NOT NULL,
  carga_max_kg numeric NULL,
  volumen_max_m3 numeric NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT capacidad_pkey PRIMARY KEY (id),
  CONSTRAINT capacidad_id_repartidor_fkey FOREIGN KEY (id_repartidor) REFERENCES public.repartidores(id) ON DELETE CASCADE
);

CREATE TABLE public.repartos (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  id_repartidor uuid NULL,
  id_tipo_reparto uuid NOT NULL,
  id_empresa uuid NULL,
  id_empresa_despachante uuid NULL,
  fecha_programada date NOT NULL,
  estado text NOT NULL DEFAULT 'PENDIENTE',
  tipo text NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT repartos_pkey PRIMARY KEY (id),
  CONSTRAINT repartos_id_repartidor_fkey FOREIGN KEY (id_repartidor) REFERENCES public.repartidores(id) ON DELETE SET NULL,
  CONSTRAINT repartos_id_tipo_reparto_fkey FOREIGN KEY (id_tipo_reparto) REFERENCES public.tipos_reparto(id_tipo_reparto) ON DELETE RESTRICT,
  CONSTRAINT repartos_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.empresas(id) ON DELETE SET NULL,
  CONSTRAINT repartos_id_empresa_despachante_fkey FOREIGN KEY (id_empresa_despachante) REFERENCES public.empresas(id) ON DELETE SET NULL
);

CREATE TABLE public.envios (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
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
  CONSTRAINT envios_id_cliente_fkey FOREIGN KEY (id_cliente) REFERENCES public.clientes(id) ON DELETE RESTRICT,
  CONSTRAINT envios_id_tipo_envio_fkey FOREIGN KEY (id_tipo_envio) REFERENCES public.tipos_envio(id_tipo_envio) ON DELETE RESTRICT,
  CONSTRAINT envios_id_tipo_paquete_fkey FOREIGN KEY (id_tipo_paquete) REFERENCES public.tipos_paquete(id_tipo_paquete) ON DELETE RESTRICT,
  CONSTRAINT envios_id_tipo_servicio_fkey FOREIGN KEY (id_tipo_servicio) REFERENCES public.tipos_servicio(id_tipo_servicio) ON DELETE RESTRICT,
  CONSTRAINT envios_id_reparto_fkey FOREIGN KEY (id_reparto) REFERENCES public.repartos(id) ON DELETE SET NULL,
  CONSTRAINT envios_id_repartidor_preferido_fkey FOREIGN KEY (id_repartidor_preferido) REFERENCES public.repartidores(id) ON DELETE SET NULL,
  CONSTRAINT envios_id_empresa_cliente_fkey FOREIGN KEY (id_empresa_cliente) REFERENCES public.empresas(id) ON DELETE SET NULL
);

CREATE TABLE public.paradas_reparto (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  id_reparto uuid NOT NULL,
  id_envio uuid NOT NULL,
  orden integer NOT NULL,
  direccion_parada text NOT NULL,
  tipo_parada public.tipoparadaenum NOT NULL,
  estado_parada text NOT NULL DEFAULT 'PENDIENTE',
  hora_estimada_llegada time NULL,
  hora_real_llegada time NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT paradas_reparto_pkey PRIMARY KEY (id),
  CONSTRAINT paradas_reparto_id_reparto_fkey FOREIGN KEY (id_reparto) REFERENCES public.repartos(id) ON DELETE CASCADE,
  CONSTRAINT paradas_reparto_id_envio_fkey FOREIGN KEY (id_envio) REFERENCES public.envios(id) ON DELETE CASCADE
);

-- Insertar Datos de Ejemplo

-- Tipos de Cliente
INSERT INTO public.tipos_cliente (nombre, descripcion) VALUES
('Individual', 'Cliente particular'),
('Corporativo', 'Cliente empresarial')
ON CONFLICT (nombre) DO NOTHING;

-- Tipos de Paquete
INSERT INTO public.tipos_paquete (nombre, descripcion, dimensiones, activo) VALUES
('Sobre', 'Documentos y objetos planos', 'Max 30x40cm, 0.5kg', TRUE),
('Paquete Pequeño', 'Cajas pequeñas', 'Max 20x20x20cm, 2kg', TRUE),
('Paquete Mediano', 'Cajas medianas', 'Max 40x40x40cm, 10kg', TRUE),
('Paquete Grande', 'Cajas grandes', 'Max 60x60x60cm, 25kg', FALSE)
ON CONFLICT (nombre) DO NOTHING;

-- Tipos de Servicio
INSERT INTO public.tipos_servicio (nombre, descripcion) VALUES
('Envíos Express', 'Entrega urgente en la ciudad.'),
('Envíos LowCost', 'Entrega económica programada.'),
('Moto Fija', 'Servicio de mensajería con moto asignada para cliente.'),
('Plan Emprendedores', 'Tarifas especiales y soluciones para emprendedores.'),
('Envíos Flex', 'Servicio adaptable a necesidades específicas.')
ON CONFLICT (nombre) DO NOTHING;

-- Tarifas de Servicio (Ejemplos)
DO $$
DECLARE
    express_id uuid;
    lowcost_id uuid;
    motofija_id uuid;
BEGIN
    SELECT id_tipo_servicio INTO express_id FROM public.tipos_servicio WHERE nombre = 'Envíos Express' LIMIT 1;
    SELECT id_tipo_servicio INTO lowcost_id FROM public.tipos_servicio WHERE nombre = 'Envíos LowCost' LIMIT 1;
    SELECT id_tipo_servicio INTO motofija_id FROM public.tipos_servicio WHERE nombre = 'Moto Fija' LIMIT 1;

    IF express_id IS NOT NULL THEN
        INSERT INTO public.tarifas_servicio (id_tipo_servicio, hasta_km, precio) VALUES
        (express_id, 5.0, 1500.00),
        (express_id, 10.0, 2500.00)
        ON CONFLICT (id_tipo_servicio, hasta_km) DO NOTHING;
    END IF;

    IF lowcost_id IS NOT NULL THEN
        INSERT INTO public.tarifas_servicio (id_tipo_servicio, hasta_km, precio) VALUES
        (lowcost_id, 5.0, 800.00),
        (lowcost_id, 10.0, 1200.00)
        ON CONFLICT (id_tipo_servicio, hasta_km) DO NOTHING;
    END IF;
    
    IF motofija_id IS NOT NULL THEN
        INSERT INTO public.tarifas_servicio (id_tipo_servicio, hasta_km, precio) VALUES
        (motofija_id, 50.0, 50000.00)
        ON CONFLICT (id_tipo_servicio, hasta_km) DO NOTHING;
    END IF;
END $$;

-- Tipos de Reparto
INSERT INTO public.tipos_reparto (nombre, descripcion, activo) VALUES
('Reparto Matutino Estándar', 'Entregas programadas por la mañana.', TRUE),
('Reparto Urgente Individual', 'Entrega prioritaria para un solo cliente.', TRUE),
('Recogida Vespertina Programada', 'Recogidas programadas por la tarde.', FALSE),
('Viaje de Empresa', 'Ruta optimizada para múltiples entregas empresariales.', TRUE),
('Viaje Individual Directo', 'Envío directo de punto A a punto B.', TRUE)
ON CONFLICT (nombre) DO NOTHING;

-- Tipos de Envío
INSERT INTO public.tipos_envio (nombre, descripcion, activo) VALUES
('Envío Estándar Nacional', 'Entrega estándar a nivel nacional.', TRUE),
('Envío Frágil Asegurado', 'Para artículos delicados con seguro.', TRUE),
('Envío Internacional Económico', 'Opción más barata para envíos al exterior.', FALSE),
('Contra Reembolso', 'Pago en destino.', TRUE)
ON CONFLICT (nombre) DO NOTHING;

-- Tipos de Empresa
INSERT INTO public.tipos_empresa (id, nombre, descripcion) VALUES
('9c89e874-ad62-4339-9c70-36192d04efe4', 'Comercio General', 'Establecimientos comerciales y tiendas.'),
('a5b0c1d2-e3f4-5678-90ab-cdef12345678', 'Proveedor de Servicios', 'Empresas que ofrecen servicios.'),
('b1c2d3e4-f567-890a-bcde-f12345678901', 'Restaurante/Gastronomía', 'Locales de comida y bebida.')
ON CONFLICT (nombre) DO NOTHING;

-- Empresas
INSERT INTO public.empresas (id_tipo_empresa, razon_social, direccion_fiscal, latitud, longitud, telefono_contacto, cuit, email_contacto, notas) VALUES
('9c89e874-ad62-4339-9c70-36192d04efe4', 'FIBRA HUMANA MDQ', 'Olavarría 2663 piso 2 t3, B7600ELK Mar del Plata, Ciudad Autónoma de Buenos Aires, Argentina', -38.012795897989896, -57.54135036711868, NULL, NULL, NULL, 'Notas para Fibra Humana'),
('9c89e874-ad62-4339-9c70-36192d04efe4', 'Federada Farmacia', 'Alberti 3973, B7600 Mar del Plata, Provincia de Buenos Aires, Argentina', -37.9989284889773, -57.566679297818766, '+542234761247', NULL, NULL, 'Notas para Federada Farmacia'),
('9c89e874-ad62-4339-9c70-36192d04efe4', 'Social Luro Farmacia', 'Av. Pedro Luro 3499, B7600 Mar del Plata, Provincia de Buenos Aires, Argentina', -37.99333127844352, -57.55520563644476, '+542234730287', NULL, NULL, 'Notas para Social Luro'),
('9c89e874-ad62-4339-9c70-36192d04efe4', 'Riddler suplementos', 'Colon 2134 (Galería local 14 Buenos Aires casi, B7600 Mar del Plata, Argentina', -38.0051722714605, -57.5458944591921, '+542266539954', NULL, NULL, 'Notas para Riddler'),
('9c89e874-ad62-4339-9c70-36192d04efe4', 'EL CÓNDOR - Güemes', 'Martín Miguel de Güemes 2945, B7600 Mar del Plata, Provincia de Buenos Aires, Argentina', -38.01581317995121, -57.54205700513539, NULL, NULL, NULL, 'Notas para El Cóndor Güemes'),
('9c89e874-ad62-4339-9c70-36192d04efe4', 'Chuladas Store', 'Carlos Alvear 3115, B7602DCG Mar del Plata, Provincia de Buenos Aires, Argentina', -38.0170314176813, -57.542061290391906, NULL, NULL, NULL, 'Notas para Chuladas'),
('9c89e874-ad62-4339-9c70-36192d04efe4', 'NUTRISABOR (Viandas)', 'Bernardo O''Higgins 1410, B7602EQC Mar del Plata, Provincia de Buenos Aires, Argentina', -38.02886435681934, -57.554581882450215, NULL, NULL, NULL, 'Notas para Nutrisabor'),
('9c89e874-ad62-4339-9c70-36192d04efe4', 'Arya - accesorios y complementos', 'Corrientes 2569, B7600 Mar del Plata, Provincia de Buenos Aires, Argentina', -38.00709226424342, -57.54936985971063, NULL, NULL, NULL, 'Notas para Arya'),
('9c89e874-ad62-4339-9c70-36192d04efe4', 'PICADACLUB - Tablas de Picadas', 'Dorrego 1023, B7600 Mar del Plata, Provincia de Buenos Aires, Argentina', -37.98709610981299, -57.55470082110497, NULL, NULL, NULL, 'Notas para Picada Club'),
('9c89e874-ad62-4339-9c70-36192d04efe4', 'MARIELA PASHER', 'Entre Ríos 2131, B7600EDM Mar del Plata, Provincia de Buenos Aires, Argentina', -38.00443241689564, -57.545724397814496, NULL, NULL, NULL, 'Notas para Mariela Pasher'),
('9c89e874-ad62-4339-9c70-36192d04efe4', 'EL CÓNDOR - Colón', 'Neuquén 2101-2199, B7600AVK Mar del Plata, Provincia de Buenos Aires, Argentina', -37.99219436901252, -57.57136158247954, NULL, NULL, NULL, 'Notas para El Cóndor Colón')
ON CONFLICT (razon_social) DO NOTHING;

-- Ejemplo de Clientes
DO $$
DECLARE
    tipo_individual_id uuid;
    empresa_fibra_id uuid;
BEGIN
    SELECT id_tipo_cliente INTO tipo_individual_id FROM public.tipos_cliente WHERE nombre = 'Individual' LIMIT 1;
    SELECT id INTO empresa_fibra_id FROM public.empresas WHERE razon_social = 'FIBRA HUMANA MDQ' LIMIT 1;

    IF tipo_individual_id IS NOT NULL THEN
        INSERT INTO public.clientes (id_tipo_cliente, nombre, apellido, email, telefono, direccion_completa) VALUES
        (tipo_individual_id, 'Juan', 'Perez', 'juan.perez@example.com', '123456789', 'Calle Falsa 123, Springfield')
        ON CONFLICT (email) DO NOTHING;
    END IF;
    
    IF tipo_individual_id IS NOT NULL AND empresa_fibra_id IS NOT NULL THEN
        INSERT INTO public.clientes (id_tipo_cliente, id_empresa, nombre, apellido, email, telefono, direccion_completa) VALUES
        (tipo_individual_id, empresa_fibra_id, 'Maria', 'Lopez', 'maria.lopez@example.com', '987654321', 'Avenida Siempreviva 742')
        ON CONFLICT (email) DO NOTHING;
    END IF;
END $$;

-- Ejemplo de Repartidores
INSERT INTO public.repartidores (nombre, apellido, dni, email, activo) VALUES
('Carlos', 'Gomez', '30123456', 'carlos.gomez@example.com', TRUE),
('Laura', 'Nuñez', '32987654', 'laura.nunez@example.com', TRUE)
ON CONFLICT (dni) DO NOTHING;

-- Ejemplo de Capacidad
DO $$
DECLARE
    repartidor_carlos_id uuid;
BEGIN
    SELECT id INTO repartidor_carlos_id FROM public.repartidores WHERE dni = '30123456' LIMIT 1;
    IF repartidor_carlos_id IS NOT NULL THEN
        INSERT INTO public.capacidad (id_repartidor, nombre_vehiculo, tipo_vehiculo, carga_max_kg, volumen_max_m3) VALUES
        (repartidor_carlos_id, 'Moto Honda Wave', 'Moto', 15, 0.1)
        ON CONFLICT (id_repartidor, tipo_vehiculo) DO UPDATE SET nombre_vehiculo = EXCLUDED.nombre_vehiculo; -- Simple conflict handling for example
    END IF;
END $$;

-- Ejemplo de Repartos
DO $$
DECLARE
    tipo_reparto_id_val uuid;
    repartidor_id_val uuid;
    empresa_id_val uuid;
BEGIN
    SELECT id_tipo_reparto INTO tipo_reparto_id_val FROM public.tipos_reparto WHERE nombre = 'Reparto Matutino Estándar' LIMIT 1;
    SELECT id INTO repartidor_id_val FROM public.repartidores WHERE dni = '30123456' LIMIT 1;
    SELECT id INTO empresa_id_val FROM public.empresas WHERE razon_social = 'FIBRA HUMANA MDQ' LIMIT 1;

    IF tipo_reparto_id_val IS NOT NULL AND repartidor_id_val IS NOT NULL THEN
        INSERT INTO public.repartos (id_tipo_reparto, id_repartidor, id_empresa, fecha_programada, estado, tipo) VALUES
        (tipo_reparto_id_val, repartidor_id_val, empresa_id_val, CURRENT_DATE, 'PENDIENTE', 'INDIVIDUAL')
        ON CONFLICT (id) DO NOTHING;
    END IF;
END $$;

-- Ejemplo de Envíos
DO $$
DECLARE
    cliente_juan_id uuid;
    cliente_maria_id uuid;
    tipo_envio_std_id uuid;
    tipo_paquete_pq_id uuid;
    tipo_servicio_lc_id uuid;
    reparto_actual_id uuid;
BEGIN
    SELECT id INTO cliente_juan_id FROM public.clientes WHERE email = 'juan.perez@example.com' LIMIT 1;
    SELECT id INTO cliente_maria_id FROM public.clientes WHERE email = 'maria.lopez@example.com' LIMIT 1;
    SELECT id_tipo_envio INTO tipo_envio_std_id FROM public.tipos_envio WHERE nombre = 'Envío Estándar Nacional' LIMIT 1;
    SELECT id_tipo_paquete INTO tipo_paquete_pq_id FROM public.tipos_paquete WHERE nombre = 'Paquete Pequeño' LIMIT 1;
    SELECT id_tipo_servicio INTO tipo_servicio_lc_id FROM public.tipos_servicio WHERE nombre = 'Envíos LowCost' LIMIT 1;
    SELECT id INTO reparto_actual_id FROM public.repartos WHERE estado = 'PENDIENTE' LIMIT 1; -- Asigna a un reparto pendiente existente

    IF cliente_juan_id IS NOT NULL AND tipo_envio_std_id IS NOT NULL AND tipo_paquete_pq_id IS NOT NULL AND tipo_servicio_lc_id IS NOT NULL THEN
        INSERT INTO public.envios (id_cliente, id_tipo_envio, id_tipo_paquete, id_tipo_servicio, id_reparto, direccion_destino, fecha_solicitud, estado, peso, client_location, precio_servicio_final) VALUES
        (cliente_juan_id, tipo_envio_std_id, tipo_paquete_pq_id, tipo_servicio_lc_id, reparto_actual_id, 'Avenida Siempreviva 742', CURRENT_DATE, 'PENDIENTE', 1.5, 'Avenida Siempreviva 742, Springfield', 800.00)
        ON CONFLICT (id) DO NOTHING;
    END IF;

    IF cliente_maria_id IS NOT NULL AND tipo_envio_std_id IS NOT NULL AND tipo_paquete_pq_id IS NOT NULL AND tipo_servicio_lc_id IS NOT NULL THEN
        INSERT INTO public.envios (id_cliente, id_tipo_envio, id_tipo_paquete, id_tipo_servicio, direccion_destino, fecha_solicitud, estado, peso, client_location) VALUES
        (cliente_maria_id, tipo_envio_std_id, tipo_paquete_pq_id, tipo_servicio_lc_id, 'Calle Elm 1428', CURRENT_DATE + INTERVAL '1 day', 'PENDIENTE', 2.0, 'Calle Elm 1428, Springwood')
        ON CONFLICT (id) DO NOTHING;
    END IF;
END $$;

-- Ejemplo de Paradas Reparto
DO $$
DECLARE
    reparto_id_val uuid;
    envio_juan_id uuid;
BEGIN
    SELECT id INTO reparto_id_val FROM public.repartos WHERE estado = 'PENDIENTE' LIMIT 1;
    SELECT id INTO envio_juan_id FROM public.envios WHERE direccion_destino = 'Avenida Siempreviva 742' LIMIT 1;

    IF reparto_id_val IS NOT NULL AND envio_juan_id IS NOT NULL THEN
        INSERT INTO public.paradas_reparto (id_reparto, id_envio, orden, direccion_parada, tipo_parada, estado_parada) VALUES
        (reparto_id_val, envio_juan_id, 1, 'Calle Falsa 123, Springfield', 'RECOLECCION', 'PENDIENTE'),
        (reparto_id_val, envio_juan_id, 2, 'Avenida Siempreviva 742', 'ENTREGA', 'PENDIENTE')
        ON CONFLICT (id_reparto, id_envio, tipo_parada, orden) DO NOTHING; -- Example conflict target
    END IF;
END $$;

-- Nota: Las políticas RLS se han omitido según la solicitud.
-- En un entorno de producción, DEBES configurar RLS adecuadamente.
-- Ejemplo de cómo se habilitaría RLS para una tabla:
-- ALTER TABLE public.tipos_cliente ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Permitir lectura publica de tipos_cliente" ON public.tipos_cliente FOR SELECT USING (true);

-- Este script está diseñado para ser idempotente en la medida de lo posible con ON CONFLICT.
-- Las secuencias para claves primarias UUID son manejadas por gen_random_uuid().
-- Las fechas de creación son manejadas por DEFAULT now().
    