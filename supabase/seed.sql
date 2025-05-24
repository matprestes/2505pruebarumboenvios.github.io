
-- Rumbos Envios - Supabase Seed SQL

-- Eliminar tablas existentes si es necesario para la idempotencia del script
DROP TABLE IF EXISTS public.distance_rates CASCADE;
DROP TABLE IF EXISTS public.service_types CASCADE;
DROP TABLE IF EXISTS public.package_types CASCADE;
DROP TABLE IF EXISTS public.client_types CASCADE;
DROP TABLE IF EXISTS public.delivery_types CASCADE;
DROP TABLE IF EXISTS public.shipment_types CASCADE;

-- Creación de Tablas

-- Tabla: Tipos de Cliente
CREATE TABLE public.client_types (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
COMMENT ON TABLE public.client_types IS 'Almacena los diferentes tipos de clientes (ej. Individual, Corporativo).';

-- Tabla: Tipos de Paquete
CREATE TABLE public.package_types (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    dimensions TEXT, -- Ejemplo: "Max 30x40cm, 0.5kg"
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
COMMENT ON TABLE public.package_types IS 'Define los tamaños y categorías de paquetes (ej. Pequeño, Mediano, Grande).';

-- Tabla: Tipos de Servicio
CREATE TABLE public.service_types (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
COMMENT ON TABLE public.service_types IS 'Establece los servicios de envío ofrecidos (ej. Express, Estándar).';

-- Tabla: Tarifas por Distancia
CREATE TABLE public.distance_rates (
    id TEXT PRIMARY KEY,
    service_type_id TEXT NOT NULL REFERENCES public.service_types(id) ON DELETE CASCADE,
    distancia_hasta_km NUMERIC(10, 2) NOT NULL CHECK (distancia_hasta_km >= 0),
    precio NUMERIC(10, 2) NOT NULL CHECK (precio >= 0),
    fecha_vigencia_desde DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
COMMENT ON TABLE public.distance_rates IS 'Configuración de tarifas basadas en distancia para cada tipo de servicio.';

-- Tabla: Tipos de Reparto
CREATE TABLE public.delivery_types (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    estado TEXT NOT NULL CHECK (estado IN ('asignado', 'completo', 'pendiente', 'encurso')),
    tipo_reparto TEXT NOT NULL CHECK (tipo_reparto IN ('viaje de empresa', 'viaje individual')),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
COMMENT ON TABLE public.delivery_types IS 'Define los diferentes tipos de reparto y sus estados (ej. Reparto Matutino, Urgencias).';

-- Tabla: Tipos de Envío
CREATE TABLE public.shipment_types (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    estado TEXT NOT NULL CHECK (estado IN ('en transito', 'entregado', 'asignado', 'pendiente')),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
COMMENT ON TABLE public.shipment_types IS 'Configura los tipos de envío y sus estados de seguimiento (ej. Envío Estándar, Envío Frágil).';

-- Inserción de Datos Iniciales (Seed Data)

-- Datos para client_types
INSERT INTO public.client_types (id, name, description) VALUES
('client-type-seed-1', 'Individual', 'Cliente particular'),
('client-type-seed-2', 'Corporativo', 'Cliente empresarial');

-- Datos para package_types
INSERT INTO public.package_types (id, name, description, dimensions) VALUES
('package-type-seed-1', 'Sobre', 'Documentos y objetos planos', 'Max 30x40cm, 0.5kg'),
('package-type-seed-2', 'Paquete Pequeño', 'Cajas pequeñas', 'Max 20x20x20cm, 2kg'),
('package-type-seed-3', 'Paquete Mediano', 'Cajas medianas', 'Max 40x40x40cm, 10kg');

-- Datos para service_types y distance_rates
INSERT INTO public.service_types (id, name, description) VALUES
('service-type-seed-1', 'Envíos Express', 'Entrega urgente en la ciudad.');
INSERT INTO public.distance_rates (id, service_type_id, distancia_hasta_km, precio, fecha_vigencia_desde) VALUES
('dr-seed-1-1', 'service-type-seed-1', 2.0, 1100.00, '2024-07-01'),
('dr-seed-1-2', 'service-type-seed-1', 4.0, 1650.00, '2024-07-01'),
('dr-seed-1-3', 'service-type-seed-1', 6.0, 4200.00, '2025-05-23'),
('dr-seed-1-4', 'service-type-seed-1', 8.0, 5800.00, '2025-05-23');

INSERT INTO public.service_types (id, name, description) VALUES
('service-type-seed-2', 'Envíos LowCost', 'Entrega económica programada.');
INSERT INTO public.distance_rates (id, service_type_id, distancia_hasta_km, precio, fecha_vigencia_desde) VALUES
('dr-seed-2-1', 'service-type-seed-2', 3.0, 550.00, '2024-06-01'),
('dr-seed-2-2', 'service-type-seed-2', 5.0, 770.00, '2024-06-01'),
('dr-seed-2-3', 'service-type-seed-2', 10.0, 1000.00, '2024-01-01');

INSERT INTO public.service_types (id, name, description) VALUES
('service-type-seed-3', 'Moto Fija', 'Servicio de mensajería con moto asignada para cliente.');
INSERT INTO public.distance_rates (id, service_type_id, distancia_hasta_km, precio, fecha_vigencia_desde) VALUES
('dr-seed-3-1', 'service-type-seed-3', 50.0, 50000.00, '2024-01-01');

INSERT INTO public.service_types (id, name, description) VALUES
('service-type-seed-4', 'Plan Emprendedores', 'Tarifas especiales y soluciones para emprendedores.');
INSERT INTO public.distance_rates (id, service_type_id, distancia_hasta_km, precio, fecha_vigencia_desde) VALUES
('dr-seed-4-1', 'service-type-seed-4', 5.0, 600.00, '2024-05-01'),
('dr-seed-4-2', 'service-type-seed-4', 10.0, 900.00, '2024-05-01');

INSERT INTO public.service_types (id, name, description) VALUES
('service-type-seed-5', 'Envíos Flex', 'Servicio adaptable a necesidades específicas.');
-- No hay tarifas iniciales para Envíos Flex

-- Datos para delivery_types
INSERT INTO public.delivery_types (id, name, description, estado, tipo_reparto) VALUES
('delivery-type-seed-1', 'Reparto Matutino Estándar', 'Entregas programadas por la mañana.', 'pendiente', 'viaje de empresa'),
('delivery-type-seed-2', 'Reparto Urgente Individual', 'Entrega prioritaria para un solo cliente.', 'asignado', 'viaje individual'),
('delivery-type-seed-3', 'Recogida Vespertina', 'Recogidas por la tarde.', 'encurso', 'viaje de empresa');

-- Datos para shipment_types
INSERT INTO public.shipment_types (id, name, description, estado) VALUES
('shipment-type-seed-1', 'Envío Estándar Nacional', 'Entrega estándar a nivel nacional.', 'pendiente'),
('shipment-type-seed-2', 'Envío Frágil Asegurado', 'Para artículos delicados con seguro.', 'asignado'),
('shipment-type-seed-3', 'Envío Internacional Económico', 'Opción más barata para envíos al exterior.', 'en transito');


-- Configuración de Row Level Security (RLS)
-- Habilitar RLS para todas las tablas
ALTER TABLE public.client_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.package_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.distance_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipment_types ENABLE ROW LEVEL SECURITY;

-- Políticas de acceso público para lectura (SELECT) - Ajustar según necesidad
CREATE POLICY "Permitir lectura pública a client_types" ON public.client_types FOR SELECT USING (true);
CREATE POLICY "Permitir lectura pública a package_types" ON public.package_types FOR SELECT USING (true);
CREATE POLICY "Permitir lectura pública a service_types" ON public.service_types FOR SELECT USING (true);
CREATE POLICY "Permitir lectura pública a distance_rates" ON public.distance_rates FOR SELECT USING (true);
CREATE POLICY "Permitir lectura pública a delivery_types" ON public.delivery_types FOR SELECT USING (true);
CREATE POLICY "Permitir lectura pública a shipment_types" ON public.shipment_types FOR SELECT USING (true);

-- Políticas para usuarios autenticados (CRUD completo) - EJEMPLO, REFINAR PARA PRODUCCIÓN
CREATE POLICY "Permitir acceso completo a usuarios autenticados en client_types"
ON public.client_types FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Permitir acceso completo a usuarios autenticados en package_types"
ON public.package_types FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Permitir acceso completo a usuarios autenticados en service_types"
ON public.service_types FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Permitir acceso completo a usuarios autenticados en distance_rates"
ON public.distance_rates FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Permitir acceso completo a usuarios autenticados en delivery_types"
ON public.delivery_types FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Permitir acceso completo a usuarios autenticados en shipment_types"
ON public.shipment_types FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

