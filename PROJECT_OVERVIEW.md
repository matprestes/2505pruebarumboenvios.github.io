
# Rumbos Envios - Vista General del Proyecto (Actualizado)

Rumbos Envios es una aplicación de panel de control diseñada para gestionar las configuraciones y operaciones centrales de un sistema de logística y envíos. Permite a los administradores definir y administrar diversas entidades clave del negocio, facilitando la configuración de tarifas y la gestión de operaciones de reparto.

## Características Principales

*   **Vista General del Panel:** Un dashboard centralizado que muestra las principales entidades de configuración y operativas, proporcionando acceso rápido a sus respectivas secciones de gestión y un recuento de los registros.
*   **Gestión de Tipos de Entidades de Configuración:**
    *   **Tipos de Cliente:** CRUD para categorías de clientes (ej., Individual, Corporativo).
    *   **Tipos de Paquete:** CRUD para tamaños y características de los paquetes (ej., Pequeño, Mediano), incluyendo su estado de activación.
    *   **Tipos de Servicio:** CRUD para servicios de envío (ej., Express, Estándar) y sus tarifas por distancia.
    *   **Tipos de Reparto:** CRUD para modalidades de operaciones de reparto y su estado de activación.
    *   **Tipos de Envío:** CRUD para categorías generales para los envíos y su estado de activación.
    *   **Tipos de Empresa:** CRUD para tipos de empresas (ej., Minorista, Proveedor).
*   **Gestión de Entidades Operativas (Implementación Futura/Parcial):**
    *   **Clientes:** CRUD para la información de los clientes.
    *   **Empresas:** CRUD para la información de las empresas.
    *   **Repartidores:** CRUD para la información de los repartidores.
    *   **Repartos:** CRUD para la planificación y seguimiento de repartos.
    *   **Envíos:** CRUD para la creación y gestión de envíos.
*   **Validación en Tiempo Real:** Formularios con validación para proporcionar retroalimentación inmediata.
*   **Herramienta de Sugerencias de IA:** Asistencia inteligente para convenciones de nomenclatura.
*   **Tablas Paginadas y con Búsqueda:** Todas las entidades principales se listan en tablas con paginación y capacidad de búsqueda del lado del servidor.

## Estructura del Directorio `src`

La estructura del directorio `src` está organizada para seguir las convenciones de Next.js y facilitar la mantenibilidad:

*   **`src/app/`**: Contiene todas las rutas y páginas de la aplicación, utilizando el App Router de Next.js.
    *   `layout.tsx`: El layout principal de la aplicación.
    *   `page.tsx`: La página principal del dashboard.
    *   `globals.css`: Estilos globales y variables de tema de Tailwind/ShadCN.
    *   **`tipos-cliente/`**:
        *   `page.tsx`: Página Server Component para listar Tipos de Cliente.
        *   `actions.ts`: Server Actions para CRUD de Tipos de Cliente.
    *   **`tipos-paquete/`**:
        *   `page.tsx`: Página Server Component para listar Tipos de Paquete.
        *   `actions.ts`: Server Actions para CRUD de Tipos de Paquete.
    *   **`tipos-servicio/`**:
        *   `page.tsx`: Página Server Component para listar Tipos de Servicio.
        *   `actions.ts`: Server Actions para CRUD de Tipos de Servicio y sus Tarifas.
    *   **`tipos-reparto/`**:
        *   `page.tsx`: Página Server Component para listar Tipos de Reparto.
        *   `actions.ts`: Server Actions para CRUD de Tipos de Reparto.
    *   **`tipos-envio/`**:
        *   `page.tsx`: Página Server Component para listar Tipos de Envío.
        *   `actions.ts`: Server Actions para CRUD de Tipos de Envío.
    *   **`tipos-empresa/`**:
        *   `page.tsx`: Página Server Component para listar Tipos de Empresa.
        *   `actions.ts`: Server Actions para CRUD de Tipos de Empresa.
    *   **`clientes/`**:
        *   `page.tsx`: Página Server Component para listar Clientes.
        *   `actions.ts`: Server Actions para CRUD de Clientes y obtención de datos para selects.
    *   **`empresas/`**:
        *   `page.tsx`: Página Server Component para listar Empresas.
        *   `actions.ts`: Server Actions para CRUD de Empresas y obtención de datos para selects.
    *   **`repartidores/`**:
        *   `page.tsx`: Página Server Component para listar Repartidores.
        *   `actions.ts`: Server Actions para CRUD de Repartidores y obtención de datos para selects.
    *   **`repartos/`**:
        *   `page.tsx`: Página Server Component para listar Repartos.
        *   `actions.ts`: Server Actions para CRUD de Repartos y obtención de datos para selects.
    *   **`envios/`**:
        *   `page.tsx`: Página Server Component para listar Envíos.
        *   `actions.ts`: Server Actions para CRUD de Envíos y obtención de datos para selects.

*   **`src/components/`**: Alberga todos los componentes React reutilizables.
    *   `ui/`: Componentes de la librería ShadCN UI.
    *   **`tipos-cliente/`**:
        *   `columns.tsx`: Definición de columnas para la tabla de Tipos de Cliente.
        *   `client-type-form.tsx`: Formulario para crear/editar Tipos de Cliente.
        *   `tipos-cliente-data-table.tsx`: Componente Client para la tabla y diálogos de Tipos de Cliente.
    *   **`tipos-paquete/`**:
        *   `columns.tsx`: Columnas para Tipos de Paquete.
        *   `package-type-form.tsx`: Formulario para Tipos de Paquete.
        *   `tipos-paquete-data-table.tsx`: Componente Client para la tabla y diálogos de Tipos de Paquete.
    *   **`tipos-servicio/`**:
        *   `columns.tsx`: Columnas para Tipos de Servicio.
        *   `service-type-form.tsx`: Formulario para Tipos de Servicio.
        *   `tipos-servicio-data-table.tsx`: Componente Client para la tabla y diálogos de Tipos de Servicio.
    *   **`tipos-reparto/`**:
        *   `columns.tsx`: Columnas para Tipos de Reparto.
        *   `delivery-type-form.tsx`: Formulario para Tipos de Reparto.
        *   `tipos-reparto-data-table.tsx`: Componente Client para la tabla y diálogos de Tipos de Reparto.
    *   **`tipos-envio/`**:
        *   `columns.tsx`: Columnas para Tipos de Envío.
        *   `shipment-type-form.tsx`: Formulario para Tipos de Envío.
        *   `tipos-envio-data-table.tsx`: Componente Client para la tabla y diálogos de Tipos de Envío.
    *   **`tipos-empresa/`**:
        *   `columns.tsx`: Columnas para Tipos de Empresa.
        *   `tipo-empresa-form.tsx`: Formulario para Tipos de Empresa.
        *   `tipos-empresa-data-table.tsx`: Componente Client para la tabla y diálogos de Tipos de Empresa.
    *   **`clientes/`**:
        *   `columns.tsx`: Columnas para Clientes.
        *   `cliente-form.tsx`: Formulario para Clientes.
        *   `clientes-data-table.tsx`: Componente Client para la tabla y diálogos de Clientes.
    *   **`empresas/`**:
        *   `columns.tsx`: Columnas para Empresas.
        *   `empresa-form.tsx`: Formulario para Empresas.
        *   `empresas-data-table.tsx`: Componente Client para la tabla y diálogos de Empresas.
    *   **`repartidores/`**:
        *   `columns.tsx`: Columnas para Repartidores.
        *   `repartidor-form.tsx`: Formulario para Repartidores.
        *   `repartidores-data-table.tsx`: Componente Client para la tabla y diálogos de Repartidores.
    *   **`repartos/`**:
        *   `columns.tsx`: Columnas para Repartos.
        *   `reparto-form.tsx`: Formulario para Repartos.
        *   `repartos-data-table.tsx`: Componente Client para la tabla y diálogos de Repartos.
    *   **`envios/`**:
        *   `columns.tsx`: Columnas para Envíos.
        *   `envio-form.tsx`: Formulario para Envíos.
        *   `envios-data-table.tsx`: Componente Client para la tabla y diálogos de Envíos.
    *   `data-table/`: Componentes genéricos para la funcionalidad de tablas de datos (`DataTable`, `DataTablePagination`, `DataTableRowActions`, `DataTableToolbar`).
    *   `layout/`: Componentes estructurales (`AppShell`, `SidebarNav`, `AppHeader`).
    *   `ai-naming-suggestion.tsx`: Componente para sugerencias de nombres por IA.
    *   `confirm-dialog.tsx`: Diálogo de confirmación reutilizable.
    *   `dashboard-card.tsx`: Tarjeta reutilizable para el panel principal.

*   **`src/lib/`**: Contiene utilidades, lógica central y configuración.
    *   `schemas.ts`: Esquemas de validación Zod para los formularios.
    *   `utils.ts`: Funciones de utilidad general.
    *   `supabase/server.ts`: Cliente Supabase para uso en el lado del servidor.

*   **`src/types/`**: Definiciones de tipos TypeScript.
    *   `index.ts`: Contiene los tipos principales de la aplicación, incluyendo los tipos generados a partir del esquema de Supabase y tipos personalizados.

*   **`src/ai/`**: Lógica y configuración para la funcionalidad de Inteligencia Artificial con Genkit.
    *   `genkit.ts`: Inicialización y configuración del cliente Genkit.
    *   `flows/suggest-naming-conventions.ts`: Flujo para sugerir convenciones de nombres.

*   **`src/hooks/`**: Hooks personalizados de React.
    *   `use-toast.ts`: Hook para gestionar notificaciones (toasts).
    *   `use-mobile.ts`: Hook para detectar si el dispositivo es móvil.

## Páginas y Componentes Principales

### 1. Panel General (`/`)
*   **Descripción:** Página de inicio. Muestra tarjetas que enlazan a las secciones operativas y de configuración.
*   **Componentes Principales:** `DashboardCard`.
*   **Lógica Principal:** `src/app/page.tsx` (Server Component) obtiene los conteos de las entidades desde Supabase.

### 2. Secciones de Configuración (`/tipos-*`)
Cada sección de "Tipos de..." (ej., `/tipos-cliente`, `/tipos-paquete`) sigue una estructura similar:
*   **Página (`src/app/tipos-*/page.tsx`):** Server Component que obtiene datos paginados y filtrados desde Supabase a través de `actions.ts`. Pasa los datos a `Tipos[Entidad]DataTable`.
*   **Server Actions (`src/app/tipos-*/actions.ts`):** Funciones para CRUD y obtención de datos.
*   **Componente de Tabla y Diálogos (`src/components/tipos-*/tipos-[entidad]-data-table.tsx`):** Client Component que:
    *   Renderiza la `DataTable` genérica.
    *   Maneja el estado de los diálogos para crear/editar.
    *   Maneja la confirmación para eliminar.
    *   Llama a las Server Actions.
    *   Actualiza los parámetros de la URL para paginación y búsqueda.
*   **Formulario (`src/components/tipos-*/[nombre-formulario].tsx`):** Formulario para crear/editar la entidad, con validación Zod.
*   **Columnas (`src/components/tipos-*/columns.tsx`):** Definición de columnas para la tabla.

**Entidades de Configuración:**
*   **Tipos de Cliente (`/tipos-cliente`)**
*   **Tipos de Paquete (`/tipos-paquete`)**
*   **Tipos de Servicio (`/tipos-servicio`)**
*   **Tipos de Reparto (`/tipos-reparto`)**
*   **Tipos de Envío (`/tipos-envio`)**
*   **Tipos de Empresa (`/tipos-empresa`)**

### 3. Secciones Operativas (`/clientes`, `/empresas`, etc.)
Cada sección operativa principal sigue una estructura similar:
*   **Página (`src/app/{entidad}/page.tsx`):** Server Component que obtiene datos paginados y filtrados desde Supabase a través de `actions.ts`. Pasa los datos a `[Entidad]DataTable`.
*   **Server Actions (`src/app/{entidad}/actions.ts`):** Funciones para CRUD y obtención de datos para selects.
*   **Componente de Tabla y Diálogos (`src/components/{entidad}/[entidad]-data-table.tsx`):** Client Component que:
    *   Renderiza la `DataTable` genérica.
    *   Maneja el estado de los diálogos para crear/editar.
    *   Maneja la confirmación para eliminar.
    *   Llama a las Server Actions.
    *   Actualiza los parámetros de la URL para paginación y búsqueda.
*   **Formulario (`src/components/{entidad}/[entidad]-form.tsx`):** Formulario para crear/editar la entidad, con validación Zod y Selects para FKs.
*   **Columnas (`src/components/{entidad}/columns.tsx`):** Definición de columnas para la tabla.

**Entidades Operativas:**
*   **Clientes (`/clientes`)**
*   **Empresas (`/empresas`)**
*   **Repartidores (`/repartidores`)**
*   **Repartos (`/repartos`)**
*   **Envíos (`/envios`)**

## Estructura de la Base de Datos (Tablas Principales)

*   **`tipos_cliente`**: Almacena los diferentes tipos de clientes.
    *   Columnas: `id_tipo_cliente` (PK, uuid), `nombre` (text, unique), `descripcion` (text, nullable), `created_at` (timestamptz).
*   **`tipos_paquete`**: Define las categorías de paquetes.
    *   Columnas: `id_tipo_paquete` (PK, uuid), `nombre` (text, unique), `descripcion` (text, nullable), `dimensiones` (text, nullable), `activo` (boolean), `created_at` (timestamptz).
*   **`tipos_servicio`**: Cataloga los diferentes servicios de envío.
    *   Columnas: `id_tipo_servicio` (PK, uuid), `nombre` (text, unique), `descripcion` (text, nullable), `created_at` (timestamptz).
*   **`tarifas_servicio`**: Detalla las tarifas para cada tipo de servicio.
    *   Columnas: `id_tarifa_servicio` (PK, uuid), `id_tipo_servicio` (FK a `tipos_servicio` ON DELETE CASCADE), `hasta_km` (numeric), `precio` (numeric), `created_at` (timestamptz). Restricción UNIQUE en `(id_tipo_servicio, hasta_km)`.
*   **`tipos_reparto`**: Clasifica los diferentes tipos de operaciones de reparto.
    *   Columnas: `id_tipo_reparto` (PK, uuid), `nombre` (text, unique), `descripcion` (text, nullable), `activo` (boolean), `created_at` (timestamptz).
*   **`tipos_envio`**: Define las categorías generales para los envíos.
    *   Columnas: `id_tipo_envio` (PK, uuid), `nombre` (text, unique), `descripcion` (text, nullable), `activo` (boolean), `created_at` (timestamptz).
*   **`tipos_empresa`**: Clasifica los diferentes tipos de empresas.
    *   Columnas: `id` (PK, uuid), `nombre` (text, unique), `descripcion` (text, nullable), `created_at` (timestamptz).
*   **`empresas`**: Almacena información sobre las entidades empresariales.
    *   Columnas: `id` (PK, uuid), `id_tipo_empresa` (FK a `tipos_empresa` ON DELETE SET NULL), `razon_social` (text, unique), `cuit` (text, unique, nullable), `email_contacto` (text, nullable), `telefono_contacto` (text, nullable), `direccion_fiscal` (text, nullable), `latitud` (numeric, nullable), `longitud` (numeric, nullable), `notas` (text, nullable), `created_at` (timestamptz).
*   **`clientes`**: Contiene la información de los clientes.
    *   Columnas: `id` (PK, uuid), `id_tipo_cliente` (FK a `tipos_cliente` ON DELETE SET NULL), `id_empresa` (FK a `empresas` ON DELETE SET NULL), `nombre` (text), `apellido` (text, nullable), `email` (text, unique, nullable), `telefono` (text, nullable), `direccion_completa` (text, nullable), `latitud` (numeric, nullable), `longitud` (numeric, nullable), `notas` (text, nullable), `created_at` (timestamptz).
*   **`repartidores`**: Guarda los datos de los repartidores.
    *   Columnas: `id` (PK, uuid), `nombre` (text), `apellido` (text), `dni` (text, unique, nullable), `telefono` (text, nullable), `email` (text, unique, nullable), `activo` (boolean), `created_at` (timestamptz).
*   **`capacidad`**: Define la capacidad de carga de cada repartidor.
    *   Columnas: `id` (PK, uuid), `id_repartidor` (FK a `repartidores` ON DELETE CASCADE), `nombre_vehiculo` (text, nullable), `tipo_vehiculo` (text), `carga_max_kg` (numeric, nullable), `volumen_max_m3` (numeric, nullable), `created_at` (timestamptz). Restricción UNIQUE en `(id_repartidor, tipo_vehiculo)`.
*   **`repartos`**: Registra cada operación de reparto.
    *   Columnas: `id` (PK, uuid), `id_repartidor` (FK a `repartidores` ON DELETE SET NULL), `id_tipo_reparto` (FK a `tipos_reparto` ON DELETE RESTRICT), `id_empresa` (FK a `empresas` ON DELETE SET NULL), `id_empresa_despachante` (FK a `empresas` ON DELETE SET NULL), `fecha_programada` (date), `estado` (text), `tipo` (text, nullable), `created_at` (timestamptz).
*   **`envios`**: Contiene los detalles de cada envío.
    *   Columnas: `id` (PK, uuid), `id_cliente` (FK a `clientes` ON DELETE RESTRICT), `id_tipo_envio` (FK a `tipos_envio` ON DELETE RESTRICT), `id_tipo_paquete` (FK a `tipos_paquete` ON DELETE RESTRICT), `id_tipo_servicio` (FK a `tipos_servicio` ON DELETE RESTRICT), `id_reparto` (FK a `repartos` ON DELETE SET NULL), `id_repartidor_preferido` (FK a `repartidores` ON DELETE SET NULL), `id_empresa_cliente` (FK a `empresas` ON DELETE SET NULL), `direccion_origen` (text, nullable), `latitud_origen` (numeric, nullable), `longitud_origen` (numeric, nullable), `direccion_destino` (text), `latitud_destino` (numeric, nullable), `longitud_destino` (numeric, nullable), `client_location` (text, nullable), `peso` (numeric, nullable), `dimensiones_cm` (text, nullable), `fecha_solicitud` (date), `estado` (text), `precio_total` (numeric, nullable), `precio_calculado` (numeric, nullable), `distancia_km` (numeric, nullable), `notas` (text, nullable), `suggested_options` (jsonb, nullable), `reasoning` (text, nullable), `precio_servicio_final` (numeric, nullable), `created_at` (timestamptz).
*   **`paradas_reparto`**: Define las paradas individuales dentro de un reparto.
    *   Columnas: `id` (PK, uuid), `id_reparto` (FK a `repartos` ON DELETE CASCADE), `id_envio` (FK a `envios` ON DELETE CASCADE), `orden` (integer), `direccion_parada` (text), `tipo_parada` (public.tipoparadaenum), `estado_parada` (text), `hora_estimada_llegada` (time, nullable), `hora_real_llegada` (time, nullable), `created_at` (timestamptz). Restricción UNIQUE en `(id_reparto, id_envio, tipo_parada, orden)`.

Este documento proporciona una visión general actualizada del proyecto Rumbos Envios.
