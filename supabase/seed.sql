
-- Rumbos Envios - Supabase Seed SQL (Nuevo Esquema)
-- Eliminar tablas existentes en orden inverso de dependencia para evitar errores FK
DROP TABLE IF EXISTS public.paradas_reparto CASCADE;
DROP TABLE IF EXISTS public.envios CASCADE;
DROP TABLE IF EXISTS public.repartos CASCADE;
DROP TABLE IF EXISTS public.capacidad CASCADE;
DROP TABLE IF EXISTS public.repartidores CASCADE;
DROP TABLE IF EXISTS public.tarifas_servicio CASCADE;
DROP TABLE IF EXISTS public.tipos_servicio CASCADE;
DROP TABLE IF EXISTS public.tipos_paquete CASCADE;
DROP TABLE IF EXISTS public.tipos_envio CASCADE;
DROP TABLE IF EXISTS public.tipos_reparto CASCADE;
DROP TABLE IF EXISTS public.clientes CASCADE;
DROP TABLE IF EXISTS public.tipos_cliente CASCADE;
DROP TABLE IF EXISTS public.empresas CASCADE;
DROP TABLE IF EXISTS public.tipos_empresa CASCADE;
DROP TABLE IF EXISTS public.tarifas_distancia_calculadora CASCADE;

-- Eliminar tipos ENUM si existen
DROP TYPE IF EXISTS public.tipoparadaenum;

-- Crear tipos ENUM
CREATE TYPE public.tipoparadaenum AS ENUM ('RECOLECCION', 'ENTREGA');

-- Crear Tablas

-- Tipos de Cliente
CREATE TABLE public.tipos_cliente (
    id_tipo_cliente uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre character varying NOT NULL,
    descripcion text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.tipos_cliente ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir lectura pública para tipos_cliente" ON public.tipos_cliente FOR SELECT USING (true);
CREATE POLICY "Permitir todas las operaciones a usuarios autenticados en tipos_cliente" ON public.tipos_cliente FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Tipos de Paquete
CREATE TABLE public.tipos_paquete (
    id_tipo_paquete uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre character varying NOT NULL,
    descripcion text,
    dimensiones text,
    activo boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.tipos_paquete ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir lectura pública para tipos_paquete" ON public.tipos_paquete FOR SELECT USING (true);
CREATE POLICY "Permitir todas las operaciones a usuarios autenticados en tipos_paquete" ON public.tipos_paquete FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Tipos de Servicio
CREATE TABLE public.tipos_servicio (
    id_tipo_servicio uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre character varying NOT NULL,
    descripcion text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.tipos_servicio ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir lectura pública para tipos_servicio" ON public.tipos_servicio FOR SELECT USING (true);
CREATE POLICY "Permitir todas las operaciones a usuarios autenticados en tipos_servicio" ON public.tipos_servicio FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Tarifas de Servicio (asociadas a Tipos de Servicio)
CREATE TABLE public.tarifas_servicio (
    id_tarifa_servicio uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    id_tipo_servicio uuid NOT NULL REFERENCES public.tipos_servicio(id_tipo_servicio) ON DELETE CASCADE,
    hasta_km numeric NOT NULL,
    precio numeric NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.tarifas_servicio ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir lectura pública para tarifas_servicio" ON public.tarifas_servicio FOR SELECT USING (true);
CREATE POLICY "Permitir todas las operaciones a usuarios autenticados en tarifas_servicio" ON public.tarifas_servicio FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Tipos de Reparto
CREATE TABLE public.tipos_reparto (
    id_tipo_reparto uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre character varying NOT NULL,
    descripcion text,
    activo boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.tipos_reparto ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir lectura pública para tipos_reparto" ON public.tipos_reparto FOR SELECT USING (true);
CREATE POLICY "Permitir todas las operaciones a usuarios autenticados en tipos_reparto" ON public.tipos_reparto FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Tipos de Envío
CREATE TABLE public.tipos_envio (
    id_tipo_envio uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre character varying NOT NULL,
    descripcion text,
    activo boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.tipos_envio ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir lectura pública para tipos_envio" ON public.tipos_envio FOR SELECT USING (true);
CREATE POLICY "Permitir todas las operaciones a usuarios autenticados en tipos_envio" ON public.tipos_envio FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Clientes
CREATE TABLE public.clientes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    id_tipo_cliente uuid NOT NULL REFERENCES public.tipos_cliente(id_tipo_cliente),
    nombre character varying NOT NULL,
    apellido character varying,
    email character varying,
    telefono character varying,
    direccion_completa text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir todas las operaciones a usuarios autenticados en clientes" ON public.clientes FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Tipos de Empresa
CREATE TABLE public.tipos_empresa (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre character varying NOT NULL,
    descripcion text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.tipos_empresa ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir todas las operaciones a usuarios autenticados en tipos_empresa" ON public.tipos_empresa FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Empresas
CREATE TABLE public.empresas (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    id_tipo_empresa uuid NOT NULL REFERENCES public.tipos_empresa(id),
    razon_social character varying NOT NULL,
    cuit character varying,
    email_contacto character varying,
    telefono_contacto character varying,
    direccion_fiscal text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.empresas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir todas las operaciones a usuarios autenticados en empresas" ON public.empresas FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Repartidores
CREATE TABLE public.repartidores (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre character varying NOT NULL,
    apellido character varying NOT NULL,
    dni character varying,
    telefono character varying,
    email character varying,
    activo boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.repartidores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir todas las operaciones a usuarios autenticados en repartidores" ON public.repartidores FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Capacidad (de Repartidores)
CREATE TABLE public.capacidad (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    id_repartidor uuid NOT NULL REFERENCES public.repartidores(id) ON DELETE CASCADE,
    tipo_vehiculo character varying NOT NULL, -- Ej: Moto, Auto, Bicicleta
    carga_max_kg numeric,
    volumen_max_m3 numeric,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.capacidad ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir todas las operaciones a usuarios autenticados en capacidad" ON public.capacidad FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Repartos
CREATE TABLE public.repartos (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    id_repartidor uuid REFERENCES public.repartidores(id) ON DELETE SET NULL,
    id_tipo_reparto uuid NOT NULL REFERENCES public.tipos_reparto(id_tipo_reparto),
    fecha_programada date NOT NULL,
    estado character varying NOT NULL, -- Ej: PENDIENTE, ASIGNADO, EN_CURSO, COMPLETADO
    tipo character varying NOT NULL, -- Ej: EMPRESA, INDIVIDUAL (Refiriéndose a la naturaleza del viaje en sí)
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.repartos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir todas las operaciones a usuarios autenticados en repartos" ON public.repartos FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Envíos
CREATE TABLE public.envios (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    id_cliente uuid NOT NULL REFERENCES public.clientes(id),
    id_tipo_envio uuid NOT NULL REFERENCES public.tipos_envio(id_tipo_envio),
    id_tipo_paquete uuid NOT NULL REFERENCES public.tipos_paquete(id_tipo_paquete),
    id_tipo_servicio uuid NOT NULL REFERENCES public.tipos_servicio(id_tipo_servicio),
    origen_direccion text,
    destino_direccion text NOT NULL,
    client_location text, -- Para coordenadas o info geocodificada
    peso_kg numeric,
    dimensiones_cm text,
    fecha_solicitud date DEFAULT CURRENT_DATE NOT NULL,
    status text DEFAULT 'PENDIENTE'::text NOT NULL, -- Ej: PENDIENTE, ASIGNADO_REPARTO, EN_TRANSITO, ENTREGADO
    precio_total numeric,
    id_reparto_asignado uuid REFERENCES public.repartos(id) ON DELETE SET NULL,
    suggested_options json,
    reasoning text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.envios ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir todas las operaciones a usuarios autenticados en envios" ON public.envios FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Paradas de Reparto
CREATE TABLE public.paradas_reparto (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    id_reparto uuid NOT NULL REFERENCES public.repartos(id) ON DELETE CASCADE,
    id_envio uuid NOT NULL REFERENCES public.envios(id) ON DELETE CASCADE,
    orden_parada integer NOT NULL,
    direccion_parada text NOT NULL,
    tipo_parada public.tipoparadaenum NOT NULL,
    estado_parada text NOT NULL, -- Ej: PENDIENTE, COMPLETADA, FALLIDA
    hora_estimada_llegada time without time zone,
    hora_real_llegada time without time zone,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.paradas_reparto ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir todas las operaciones a usuarios autenticados en paradas_reparto" ON public.paradas_reparto FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Tarifas Distancia Calculadora (esta parece ser una tabla más general de tarifas)
CREATE TABLE public.tarifas_distancia_calculadora (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tipo_calculadora character varying NOT NULL, -- Ej: express, lowcost, personalizado_cliente_x
    distancia_hasta_km numeric NOT NULL,
    precio numeric NOT NULL,
    fecha_vigencia_desde date DEFAULT CURRENT_DATE NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.tarifas_distancia_calculadora ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir lectura pública para tarifas_distancia_calculadora" ON public.tarifas_distancia_calculadora FOR SELECT USING (true);
CREATE POLICY "Permitir todas las operaciones a usuarios autenticados en tarifas_distancia_calculadora" ON public.tarifas_distancia_calculadora FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');


-- Insertar Datos de Ejemplo

-- Tipos de Cliente
INSERT INTO public.tipos_cliente (nombre, descripcion) VALUES
('Individual', 'Cliente particular'),
('Corporativo', 'Cliente empresarial');

-- Tipos de Paquete
INSERT INTO public.tipos_paquete (nombre, descripcion, dimensiones, activo) VALUES
('Sobre', 'Documentos y objetos planos', 'Max 30x40cm, 0.5kg', true),
('Paquete Pequeño', 'Cajas pequeñas', 'Max 20x20x20cm, 2kg', true),
('Paquete Mediano', 'Cajas medianas', 'Max 40x40x40cm, 10kg', true),
('Paquete Grande', 'Cajas grandes', 'Max 60x60x60cm, 20kg', false);

-- Tipos de Servicio y sus Tarifas
DO $$
DECLARE
    id_express uuid;
    id_lowcost uuid;
    id_moto_fija uuid;
    id_emprendedores uuid;
    id_flex uuid;
BEGIN
    INSERT INTO public.tipos_servicio (nombre, descripcion) VALUES ('Envíos Express', 'Entrega urgente en la ciudad.') RETURNING id_tipo_servicio INTO id_express;
    INSERT INTO public.tipos_servicio (nombre, descripcion) VALUES ('Envíos LowCost', 'Entrega económica programada.') RETURNING id_tipo_servicio INTO id_lowcost;
    INSERT INTO public.tipos_servicio (nombre, descripcion) VALUES ('Moto Fija', 'Servicio de mensajería con moto asignada para cliente.') RETURNING id_tipo_servicio INTO id_moto_fija;
    INSERT INTO public.tipos_servicio (nombre, descripcion) VALUES ('Plan Emprendedores', 'Tarifas especiales y soluciones para emprendedores.') RETURNING id_tipo_servicio INTO id_emprendedores;
    INSERT INTO public.tipos_servicio (nombre, descripcion) VALUES ('Envíos Flex', 'Servicio adaptable a necesidades específicas.') RETURNING id_tipo_servicio INTO id_flex;

    -- Tarifas para Envíos Express
    INSERT INTO public.tarifas_servicio (id_tipo_servicio, hasta_km, precio) VALUES
    (id_express, 2.0, 1100.00),
    (id_express, 4.0, 1650.00),
    (id_express, 6.0, 4200.00),
    (id_express, 8.0, 5800.00);

    -- Tarifas para Envíos LowCost
    INSERT INTO public.tarifas_servicio (id_tipo_servicio, hasta_km, precio) VALUES
    (id_lowcost, 3.0, 550.00),
    (id_lowcost, 5.0, 770.00),
    (id_lowcost, 10.0, 1000.00);
    
    -- Tarifa para Moto Fija (ejemplo de tarifa única)
    INSERT INTO public.tarifas_servicio (id_tipo_servicio, hasta_km, precio) VALUES
    (id_moto_fija, 50.0, 50000.00);

    -- Tarifas para Plan Emprendedores
    INSERT INTO public.tarifas_servicio (id_tipo_servicio, hasta_km, precio) VALUES
    (id_emprendedores, 5.0, 600.00),
    (id_emprendedores, 10.0, 900.00);
END $$;

-- Tipos de Reparto
INSERT INTO public.tipos_reparto (nombre, descripcion, activo) VALUES
('Reparto Matutino Estándar', 'Entregas programadas por la mañana.', true),
('Reparto Urgente Individual', 'Entrega prioritaria para un solo cliente.', true),
('Recogida Vespertina', 'Recogidas por la tarde.', true),
('Logística Inversa', 'Devoluciones y cambios.', false);

-- Tipos de Envío
INSERT INTO public.tipos_envio (nombre, descripcion, activo) VALUES
('Estándar Nacional', 'Entrega estándar a nivel nacional.', true),
('Frágil Asegurado', 'Para artículos delicados con seguro.', true),
('Internacional Económico', 'Opción más barata para envíos al exterior.', false),
('Contra Reembolso', 'Pago en destino.', true);

-- Tipos de Empresa
INSERT INTO public.tipos_empresa (nombre, descripcion) VALUES
('Pequeña Empresa', 'Menos de 50 empleados'),
('Mediana Empresa', 'Entre 50 y 250 empleados'),
('Gran Empresa', 'Más de 250 empleados'),
('E-commerce', 'Tienda online');

-- Clientes de Ejemplo
DO $$
DECLARE
    id_tipo_individual uuid;
    id_tipo_corporativo uuid;
BEGIN
    SELECT id_tipo_cliente INTO id_tipo_individual FROM public.tipos_cliente WHERE nombre = 'Individual';
    SELECT id_tipo_cliente INTO id_tipo_corporativo FROM public.tipos_cliente WHERE nombre = 'Corporativo';

    INSERT INTO public.clientes (id_tipo_cliente, nombre, apellido, email, telefono, direccion_completa) VALUES
    (id_tipo_individual, 'Juan', 'Perez', 'juan.perez@example.com', '1122334455', 'Calle Falsa 123, Springfield'),
    (id_tipo_corporativo, 'Empresa ABC', NULL, 'contacto@empresaabc.com', '0800-123-4567', 'Av. Siempreviva 742, Springfield');
END $$;

-- Repartidores de Ejemplo
INSERT INTO public.repartidores (nombre, apellido, dni, telefono, email, activo) VALUES
('Carlos', 'Gomez', '30123456', '1198765432', 'carlos.gomez@example.com', true),
('Ana', 'Lopez', '32765432', '1112345678', 'ana.lopez@example.com', true);

-- Tarifas Distancia Calculadora (Ejemplo)
INSERT INTO public.tarifas_distancia_calculadora (tipo_calculadora, distancia_hasta_km, precio, fecha_vigencia_desde) VALUES
('general_express', 5, 1500, '2024-01-01'),
('general_express', 10, 2500, '2024-01-01'),
('general_lowcost', 5, 800, '2024-01-01'),
('general_lowcost', 10, 1200, '2024-01-01');

-- Más datos de ejemplo para otras tablas (básico)
DO $$
DECLARE
    id_cliente_juan uuid;
    id_tipo_envio_estandar uuid;
    id_tipo_paquete_pequeno uuid;
    id_tipo_servicio_express uuid;
    id_repartidor_carlos uuid;
    id_tipo_reparto_matutino uuid;
    id_reparto_1 uuid;
BEGIN
    SELECT id INTO id_cliente_juan FROM public.clientes WHERE nombre = 'Juan';
    SELECT id_tipo_envio INTO id_tipo_envio_estandar FROM public.tipos_envio WHERE nombre = 'Estándar Nacional';
    SELECT id_tipo_paquete INTO id_tipo_paquete_pequeno FROM public.tipos_paquete WHERE nombre = 'Paquete Pequeño';
    SELECT id_tipo_servicio INTO id_tipo_servicio_express FROM public.tipos_servicio WHERE nombre = 'Envíos Express';
    SELECT id INTO id_repartidor_carlos FROM public.repartidores WHERE nombre = 'Carlos';
    SELECT id_tipo_reparto INTO id_tipo_reparto_matutino FROM public.tipos_reparto WHERE nombre = 'Reparto Matutino Estándar';

    IF id_cliente_juan IS NOT NULL AND id_tipo_envio_estandar IS NOT NULL AND id_tipo_paquete_pequeno IS NOT NULL AND id_tipo_servicio_express IS NOT NULL THEN
        INSERT INTO public.envios (id_cliente, id_tipo_envio, id_tipo_paquete, id_tipo_servicio, destino_direccion, status, peso_kg) VALUES
        (id_cliente_juan, id_tipo_envio_estandar, id_tipo_paquete_pequeno, id_tipo_servicio_express, 'Calle Verdadera 456, Shelbyville', 'PENDIENTE', 1.5);
    END IF;

    IF id_repartidor_carlos IS NOT NULL AND id_tipo_reparto_matutino IS NOT NULL THEN
        INSERT INTO public.repartos (id_repartidor, id_tipo_reparto, fecha_programada, estado, tipo) VALUES
        (id_repartidor_carlos, id_tipo_reparto_matutino, CURRENT_DATE + interval '1 day', 'PENDIENTE', 'EMPRESA') RETURNING id INTO id_reparto_1;
        
        IF id_reparto_1 IS NOT NULL THEN
          INSERT INTO public.capacidad (id_repartidor, tipo_vehiculo, carga_max_kg) VALUES
          (id_repartidor_carlos, 'Moto', 20);
        END IF;
    END IF;
END $$;

-- Asegurar que las secuencias para serial/bigserial se actualicen si se usan IDs específicos en INSERT
-- No es necesario con UUIDs generados por gen_random_uuid()

SELECT pg_catalog.set_config('search_path', 'public', false);

    