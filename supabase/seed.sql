-- Supabase Seed SQL for Rumbos Envios

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

-- Tarifas de Servicio (Ejemplos, asociar a los ID de tipos_servicio creados)
-- Nota: Estos INSERTs asumen que los tipos_servicio ya existen.
-- Deberías obtener los UUIDs generados para los tipos_servicio y usarlos aquí.
-- Por simplicidad, este script no lo hace dinámicamente, pero en un escenario real, lo harías.
-- Insertaremos algunas tarifas genéricas si los tipos de servicio no tienen tarifas.
DO $$
DECLARE
    express_id uuid;
    lowcost_id uuid;
    motofija_id uuid;
BEGIN
    SELECT id_tipo_servicio INTO express_id FROM public.tipos_servicio WHERE nombre = 'Envíos Express';
    SELECT id_tipo_servicio INTO lowcost_id FROM public.tipos_servicio WHERE nombre = 'Envíos LowCost';
    SELECT id_tipo_servicio INTO motofija_id FROM public.tipos_servicio WHERE nombre = 'Moto Fija';

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

-- Empresas (Añadiendo latitud y longitud)
INSERT INTO public.empresas (id_tipo_empresa, razon_social, direccion_fiscal, latitud, longitud, telefono_contacto, cuit, email_contacto, notas) VALUES
('9c89e874-ad62-4339-9c70-36192d04efe4', 'FIBRA HUMANA MDQ', 'Olavarría 2663 piso 2 t3, B7600ELK Mar del Plata, Ciudad Autónoma de Buenos Aires, Argentina', -38.012795897989896, -57.54135036711868, NULL, NULL, NULL, 'Notas para Fibra Humana'),
('9c89e874-ad62-4339-9c70-36192d04efe4', 'Federada Farmacia', 'Alberti 3973, B7600 Mar del Plata, Provincia de Buenos Aires, Argentina', -37.9989284889773, -57.566679297818766, '+542234761247', NULL, NULL, 'Notas para Federada Farmacia'),
('9c89e874-ad62-4339-9c70-36192d04efe4', 'Social Luro Farmacia', 'Av. Pedro Luro 3499, B7600 Mar del Plata, Provincia de Buenos Aires, Argentina', -37.99333127844352, -57.55520563644476, '+542234730287', NULL, NULL, 'Notas para Social Luro'),
('9c89e874-ad62-4339-9c70-36192d04efe4', 'Riddler suplementos', 'Colon 2134 (Galería local 14 Buenos Aires casi, B7600 Mar del Plata, Argentina', -38.0051722714605, -57.5458944591921, '+542266539954', NULL, NULL, 'Notas para Riddler'),
('9c89e874-ad62-4339-9c70-36192d04efe4', 'EL CÓNDOR', 'Martín Miguel de Güemes 2945, B7600 Mar del Plata, Provincia de Buenos Aires, Argentina', -38.01581317995121, -57.54205700513539, NULL, NULL, NULL, 'Notas para El Cóndor Güemes'),
('9c89e874-ad62-4339-9c70-36192d04efe4', 'Chuladas Store', 'Carlos Alvear 3115, B7602DCG Mar del Plata, Provincia de Buenos Aires, Argentina', -38.0170314176813, -57.542061290391906, NULL, NULL, NULL, 'Notas para Chuladas'),
('9c89e874-ad62-4339-9c70-36192d04efe4', 'NUTRISABOR (Viandas)', 'Bernardo O''Higgins 1410, B7602EQC Mar del Plata, Provincia de Buenos Aires, Argentina', -38.02886435681934, -57.554581882450215, NULL, NULL, NULL, 'Notas para Nutrisabor'),
('9c89e874-ad62-4339-9c70-36192d04efe4', 'Arya - accesorios y complementos', 'Corrientes 2569, B7600 Mar del Plata, Provincia de Buenos Aires, Argentina', -38.00709226424342, -57.54936985971063, NULL, NULL, NULL, 'Notas para Arya'),
('9c89e874-ad62-4339-9c70-36192d04efe4', 'PICADACLUB - Tablas de Picadas', 'Dorrego 1023, B7600 Mar del Plata, Provincia de Buenos Aires, Argentina', -37.98709610981299, -57.55470082110497, NULL, NULL, NULL, 'Notas para Picada Club'),
('9c89e874-ad62-4339-9c70-36192d04efe4', 'MARIELA PASHER', 'Entre Ríos 2131, B7600EDM Mar del Plata, Provincia de Buenos Aires, Argentina', -38.00443241689564, -57.545724397814496, NULL, NULL, NULL, 'Notas para Mariela Pasher'),
('9c89e874-ad62-4339-9c70-36192d04efe4', 'EL CÓNDOR Avenida Colón & Neuquén', 'Neuquén 2101-2199, B7600AVK Mar del Plata, Provincia de Buenos Aires, Argentina', -37.99219436901252, -57.57136158247954, NULL, NULL, NULL, 'Notas para El Cóndor Colón')
ON CONFLICT (razon_social) DO NOTHING;


-- Ejemplo de Cliente (Asumiendo que 'Individual' y 'Corporativo' tipos_cliente ya existen)
DO $$
DECLARE
    tipo_individual_id uuid;
BEGIN
    SELECT id_tipo_cliente INTO tipo_individual_id FROM public.tipos_cliente WHERE nombre = 'Individual' LIMIT 1;
    IF tipo_individual_id IS NOT NULL THEN
        INSERT INTO public.clientes (id_tipo_cliente, nombre, apellido, email, telefono, direccion_completa) VALUES
        (tipo_individual_id, 'Juan', 'Perez', 'juan.perez@example.com', '123456789', 'Calle Falsa 123, Springfield')
        ON CONFLICT (email) DO NOTHING;
    END IF;
END $$;

-- Ejemplo de Repartidor
INSERT INTO public.repartidores (nombre, apellido, dni, activo) VALUES
('Carlos', 'Gomez', '30123456', TRUE)
ON CONFLICT (dni) DO NOTHING;

-- Ejemplo de Reparto (Asumiendo que 'Reparto Matutino Estándar' tipo_reparto y el repartidor 'Carlos Gomez' ya existen)
DO $$
DECLARE
    tipo_reparto_id_val uuid;
    repartidor_id_val uuid;
BEGIN
    SELECT id_tipo_reparto INTO tipo_reparto_id_val FROM public.tipos_reparto WHERE nombre = 'Reparto Matutino Estándar' LIMIT 1;
    SELECT id INTO repartidor_id_val FROM public.repartidores WHERE nombre = 'Carlos' AND apellido = 'Gomez' LIMIT 1;

    IF tipo_reparto_id_val IS NOT NULL AND repartidor_id_val IS NOT NULL THEN
        INSERT INTO public.repartos (id_tipo_reparto, id_repartidor, fecha_programada, estado, tipo) VALUES
        (tipo_reparto_id_val, repartidor_id_val, CURRENT_DATE, 'PENDIENTE', 'INDIVIDUAL')
        ON CONFLICT (id) DO NOTHING; -- Asume que ID es único y no tenemos otra restricción de unicidad aquí.
    END IF;
END $$;


-- Ejemplo de Envio (Asumiendo que las FKs existen)
DO $$
DECLARE
    cliente_id_val uuid;
    tipo_envio_id_val uuid;
    tipo_paquete_id_val uuid;
    tipo_servicio_id_val uuid;
BEGIN
    SELECT id INTO cliente_id_val FROM public.clientes WHERE email = 'juan.perez@example.com' LIMIT 1;
    SELECT id_tipo_envio INTO tipo_envio_id_val FROM public.tipos_envio WHERE nombre = 'Envío Estándar Nacional' LIMIT 1;
    SELECT id_tipo_paquete INTO tipo_paquete_id_val FROM public.tipos_paquete WHERE nombre = 'Paquete Pequeño' LIMIT 1;
    SELECT id_tipo_servicio INTO tipo_servicio_id_val FROM public.tipos_servicio WHERE nombre = 'Envíos LowCost' LIMIT 1;

    IF cliente_id_val IS NOT NULL AND tipo_envio_id_val IS NOT NULL AND tipo_paquete_id_val IS NOT NULL AND tipo_servicio_id_val IS NOT NULL THEN
        INSERT INTO public.envios (id_cliente, id_tipo_envio, id_tipo_paquete, id_tipo_servicio, direccion_destino, fecha_solicitud, estado, peso) VALUES
        (cliente_id_val, tipo_envio_id_val, tipo_paquete_id_val, tipo_servicio_id_val, 'Avenida Siempreviva 742', CURRENT_DATE, 'PENDIENTE', 1.5)
        ON CONFLICT (id) DO NOTHING;
    END IF;
END $$;

-- Habilitar RLS para las tablas
ALTER TABLE public.tipos_cliente ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tipos_paquete ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tipos_servicio ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tarifas_servicio ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tipos_reparto ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tipos_envio ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.empresas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tipos_empresa ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.repartidores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.capacidad ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.repartos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.envios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paradas_reparto ENABLE ROW LEVEL SECURITY;

-- Políticas RLS (ejemplos básicos, ajustar según necesidades)
-- Permitir lectura pública para tablas de configuración
CREATE POLICY "Permitir lectura publica de tipos_cliente" ON public.tipos_cliente FOR SELECT USING (true);
CREATE POLICY "Permitir lectura publica de tipos_paquete" ON public.tipos_paquete FOR SELECT USING (true);
CREATE POLICY "Permitir lectura publica de tipos_servicio" ON public.tipos_servicio FOR SELECT USING (true);
CREATE POLICY "Permitir lectura publica de tarifas_servicio" ON public.tarifas_servicio FOR SELECT USING (true);
CREATE POLICY "Permitir lectura publica de tipos_reparto" ON public.tipos_reparto FOR SELECT USING (true);
CREATE POLICY "Permitir lectura publica de tipos_envio" ON public.tipos_envio FOR SELECT USING (true);
CREATE POLICY "Permitir lectura publica de tipos_empresa" ON public.tipos_empresa FOR SELECT USING (true);

-- Permitir acceso completo a usuarios autenticados para tablas operativas
-- Esto es un ejemplo, necesitarás roles más granulares en producción
CREATE POLICY "Permitir acceso completo a clientes para usuarios autenticados" ON public.clientes FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Permitir acceso completo a empresas para usuarios autenticados" ON public.empresas FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Permitir acceso completo a repartidores para usuarios autenticados" ON public.repartidores FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Permitir acceso completo a capacidad para usuarios autenticados" ON public.capacidad FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Permitir acceso completo a repartos para usuarios autenticados" ON public.repartos FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Permitir acceso completo a envios para usuarios autenticados" ON public.envios FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Permitir acceso completo a paradas_reparto para usuarios autenticados" ON public.paradas_reparto FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
