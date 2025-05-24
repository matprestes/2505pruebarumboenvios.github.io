
# Rumbos Envios - Vista General del Proyecto (Actualizado)

Rumbos Envios es una aplicación de panel de control diseñada para gestionar las configuraciones y operaciones centrales de un sistema de logística y envíos. Permite a los administradores definir y administrar diversas entidades clave del negocio, facilitando la configuración de tarifas y la gestión de operaciones de reparto.

## Características Principales

*   **Vista General del Panel:** Un dashboard centralizado que muestra las principales entidades de configuración y proporciona acceso rápido a sus respectivas secciones de gestión.
*   **Gestión de Tipos de Entidades de Configuración:**
    *   **Tipos de Cliente:** Crear y editar categorías de clientes (ej., Individual, Corporativo).
    *   **Tipos de Paquete:** Definir los tamaños y características de los paquetes (ej., Pequeño, Mediano, Grande), incluyendo su estado de activación.
    *   **Tipos de Servicio:** Configurar los servicios de envío ofrecidos (ej., Express, Estándar) y sus correspondientes tarifas por distancia.
    *   **Tipos de Reparto:** Establecer diferentes modalidades de operaciones de reparto y su estado de activación.
    *   **Tipos de Envío:** Definir las categorías generales para los envíos y su estado de activación.
*   **Gestión de Entidades Operativas (Próximamente):**
    *   Clientes, Empresas (y Tipos de Empresa), Repartidores (y su Capacidad), Repartos, Envíos, Paradas de Reparto.
*   **Validación en Tiempo Real:** Formularios con validación para proporcionar retroalimentación inmediata al usuario.
*   **Herramienta de Sugerencias de IA:** Asistencia inteligente para convenciones de nomenclatura, ayudando a mantener la consistencia y seguir las mejores prácticas.

## Estructura del Directorio `src`

La estructura del directorio `src` está organizada para seguir las convenciones de Next.js y facilitar la mantenibilidad:

*   **`src/app/`**: Contiene todas las rutas y páginas de la aplicación, utilizando el App Router de Next.js.
    *   `layout.tsx`: El layout principal de la aplicación.
    *   `page.tsx`: La página principal del dashboard.
    *   `globals.css`: Estilos globales y variables de tema de Tailwind/ShadCN.
    *   `tipos-cliente/page.tsx`: Página para la gestión de Tipos de Cliente.
    *   `tipos-paquete/page.tsx`: Página para la gestión de Tipos de Paquete.
    *   `tipos-servicio/page.tsx`: Página para la gestión de Tipos de Servicio.
    *   `tipos-reparto/page.tsx`: Página para la gestión de Tipos de Reparto.
    *   `tipos-envio/page.tsx`: Página para la gestión de Tipos de Envío.
    *   *(Se crearán nuevas páginas para Clientes, Empresas, Repartidores, etc. en el futuro)*

*   **`src/components/`**: Alberga todos los componentes React reutilizables.
    *   `ui/`: Componentes de la librería ShadCN UI (Button, Card, Table, etc.).
    *   `tipos-cliente/`: Componentes específicos para Tipos de Cliente.
    *   `tipos-paquete/`: Componentes para Tipos de Paquete.
    *   `tipos-servicio/`: Componentes para Tipos de Servicio.
    *   `tipos-reparto/`: Componentes para Tipos de Reparto.
    *   `tipos-envio/`: Componentes para Tipos de Envío.
    *   `data-table/`: Componentes genéricos para la funcionalidad de tablas de datos.
    *   `layout/`: Componentes estructurales como `AppShell`, `SidebarNav`, y `AppHeader`.
    *   `ai-naming-suggestion.tsx`: Componente para la funcionalidad de sugerencias de nombres por IA.
    *   `confirm-dialog.tsx`: Diálogo de confirmación reutilizable.
    *   `dashboard-card.tsx`: Tarjeta reutilizable para el panel principal.

*   **`src/lib/`**: Contiene utilidades, lógica central y configuración.
    *   `schemas.ts`: Esquemas de validación Zod para los formularios.
    *   `utils.ts`: Funciones de utilidad general.
    *   `supabase/`: Configuración del cliente Supabase.
        *   `server.ts`: Cliente Supabase para uso en el lado del servidor.

*   **`src/types/`**: Definiciones de tipos TypeScript.
    *   `index.ts`: Contiene los tipos principales de la aplicación, incluyendo los tipos generados a partir del esquema de Supabase y tipos personalizados para entidades y estados.
    *   `supabase.ts`: (Archivo generado por `supabase gen types typescript`) Tipos crudos de la base de datos.

*   **`src/ai/`**: Lógica y configuración para la funcionalidad de Inteligencia Artificial con Genkit.
    *   `genkit.ts`: Inicialización y configuración del cliente Genkit.
    *   `flows/`: Define los flujos de Genkit.
        *   `suggest-naming-conventions.ts`: Flujo para sugerir convenciones de nombres.

*   **`src/hooks/`**: Hooks personalizados de React.
    *   `use-toast.ts`: Hook para gestionar notificaciones (toasts).
    *   `use-mobile.ts`: Hook para detectar si el dispositivo es móvil.

## Páginas de Configuración y sus Componentes

A continuación, se describen las principales páginas de configuración y los componentes que utilizan:

### 1. Panel General (`/`)
*   **Descripción:** Es la página de inicio. Muestra tarjetas que enlazan a las diferentes secciones de configuración.
*   **Componentes Principales:** `DashboardCard`.

### 2. Tipos de Cliente (`/tipos-cliente`)
*   **Descripción:** Permite crear, leer, actualizar y eliminar (CRUD) los tipos de clientes.
*   **Componentes Principales:** `DataTable`, `TipoClienteForm`, `getTipoClienteColumns`, `ConfirmDialog`, `AiNamingSuggestion`.

### 3. Tipos de Paquete (`/tipos-paquete`)
*   **Descripción:** Gestión CRUD de los tipos de paquetes, incluyendo dimensiones y estado de activación.
*   **Componentes Principales:** `DataTable`, `TipoPaqueteForm`, `getTipoPaqueteColumns`, `ConfirmDialog`, `AiNamingSuggestion`.

### 4. Tipos de Servicio (`/tipos-servicio`)
*   **Descripción:** Gestión CRUD de los tipos de servicios y sus tarifas por distancia.
*   **Componentes Principales:** `DataTable`, `TipoServicioForm` (incluye subformulario para `TarifaServicio`), `getTipoServicioColumns`, `ConfirmDialog`, `AiNamingSuggestion`.

### 5. Tipos de Reparto (`/tipos-reparto`)
*   **Descripción:** Gestión CRUD de los tipos de operaciones de reparto y su estado de activación.
*   **Componentes Principales:** `DataTable`, `TipoRepartoForm`, `getTipoRepartoColumns`, `ConfirmDialog`, `AiNamingSuggestion`.

### 6. Tipos de Envío (`/tipos-envio`)
*   **Descripción:** Gestión CRUD de las categorías generales de envío y su estado de activación.
*   **Componentes Principales:** `DataTable`, `TipoEnvioForm`, `getTipoEnvioColumns`, `ConfirmDialog`, `AiNamingSuggestion`.

## Estructura de la Base de Datos (Tablas Principales)

La base de datos está diseñada para soportar las operaciones de Rumbos Envios, con las siguientes tablas clave:

*   **`tipos_cliente`**: Almacena los diferentes tipos de clientes.
    *   Columnas: `id_tipo_cliente` (PK, uuid), `nombre` (text), `descripcion` (text, nullable), `created_at` (timestamptz).
*   **`tipos_paquete`**: Define las categorías de paquetes.
    *   Columnas: `id_tipo_paquete` (PK, uuid), `nombre` (text), `descripcion` (text, nullable), `dimensiones` (text, nullable), `activo` (boolean), `created_at` (timestamptz).
*   **`tipos_servicio`**: Cataloga los diferentes servicios de envío.
    *   Columnas: `id_tipo_servicio` (PK, uuid), `nombre` (text), `descripcion` (text, nullable), `created_at` (timestamptz).
*   **`tarifas_servicio`**: Detalla las tarifas para cada tipo de servicio.
    *   Columnas: `id_tarifa_servicio` (PK, uuid), `id_tipo_servicio` (FK a `tipos_servicio`), `hasta_km` (numeric), `precio` (numeric), `created_at` (timestamptz).
*   **`tipos_reparto`**: Clasifica los diferentes tipos de operaciones de reparto.
    *   Columnas: `id_tipo_reparto` (PK, uuid), `nombre` (text), `descripcion` (text, nullable), `activo` (boolean), `created_at` (timestamptz).
*   **`tipos_envio`**: Define las categorías generales para los envíos.
    *   Columnas: `id_tipo_envio` (PK, uuid), `nombre` (text), `descripcion` (text, nullable), `activo` (boolean), `created_at` (timestamptz).
*   **`tipos_empresa`**: Clasifica los diferentes tipos de empresas.
    *   Columnas: `id` (PK, uuid), `nombre` (text), `descripcion` (text, nullable), `created_at` (timestamptz).
*   **`empresas`**: Almacena información sobre las entidades empresariales.
    *   Columnas: `id` (PK, uuid), `id_tipo_empresa` (FK a `tipos_empresa`), `razon_social` (text), `cuit` (text, unique), `email_contacto` (text), `telefono_contacto` (text), `direccion_fiscal` (text), `notas` (text), `created_at` (timestamptz).
*   **`clientes`**: Contiene la información de los clientes.
    *   Columnas: `id` (PK, uuid), `id_tipo_cliente` (FK a `tipos_cliente`), `id_empresa` (FK a `empresas`), `nombre` (text), `apellido` (text), `email` (text, unique), `telefono` (text), `direccion_completa` (text), `latitud` (numeric), `longitud` (numeric), `notas` (text), `created_at` (timestamptz).
*   **`repartidores`**: Guarda los datos de los repartidores.
    *   Columnas: `id` (PK, uuid), `nombre` (text), `apellido` (text), `dni` (text, unique), `telefono` (text), `email` (text, unique), `activo` (boolean), `created_at` (timestamptz).
*   **`capacidad`**: Define la capacidad de carga de cada repartidor.
    *   Columnas: `id` (PK, uuid), `id_repartidor` (FK a `repartidores`), `nombre_vehiculo` (text), `tipo_vehiculo` (text), `carga_max_kg` (numeric), `volumen_max_m3` (numeric), `created_at` (timestamptz).
*   **`repartos`**: Registra cada operación de reparto.
    *   Columnas: `id` (PK, uuid), `id_repartidor` (FK a `repartidores`), `id_tipo_reparto` (FK a `tipos_reparto`), `id_empresa` (FK a `empresas`), `id_empresa_despachante` (FK a `empresas`), `fecha_programada` (date), `estado` (text), `tipo` (text), `created_at` (timestamptz).
*   **`envios`**: Contiene los detalles de cada envío.
    *   Columnas: `id` (PK, uuid), `id_cliente` (FK), `id_tipo_envio` (FK), `id_tipo_paquete` (FK), `id_tipo_servicio` (FK), `id_reparto` (FK), `id_repartidor_preferido` (FK), `id_empresa_cliente` (FK), `direccion_origen` (text), `latitud_origen` (numeric), `longitud_origen` (numeric), `direccion_destino` (text), `latitud_destino` (numeric), `longitud_destino` (numeric), `client_location` (text), `peso` (numeric), `dimensiones_cm` (text), `fecha_solicitud` (date), `estado` (text), `precio_total` (numeric), `precio_calculado` (numeric), `distancia_km` (numeric), `notas` (text), `suggested_options` (jsonb), `reasoning` (text), `precio_servicio_final` (numeric), `created_at` (timestamptz).
*   **`paradas_reparto`**: Define las paradas individuales dentro de un reparto.
    *   Columnas: `id` (PK, uuid), `id_reparto` (FK), `id_envio` (FK), `orden` (integer), `direccion_parada` (text), `tipo_parada` (public.tipoparadaenum), `estado_parada` (text), `hora_estimada_llegada` (time), `hora_real_llegada` (time), `created_at` (timestamptz).

*(Nota: La tabla `tarifas_distancia_calculadora` mencionada en el prompt anterior fue integrada/reemplazada por la tabla `tarifas_servicio` asociada directamente a `tipos_servicio` según el esquema visual y la lógica de la aplicación.)*

Este documento proporciona una visión general del estado actual del proyecto Rumbos Envios.
