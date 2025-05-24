
# Rumbos Envios - Vista General del Proyecto

Rumbos Envios es una aplicación de panel de control diseñada para gestionar las configuraciones y operaciones centrales de un sistema de logística y envíos. Permite a los administradores definir y administrar diversas entidades clave del negocio, como tipos de clientes, paquetes, servicios, y más, facilitando la configuración de tarifas y la gestión de operaciones de reparto.

## Características Principales

*   **Vista General del Panel:** Un dashboard centralizado que muestra las principales entidades de configuración y proporciona acceso rápido a sus respectivas secciones de gestión.
*   **Gestión de Tipos de Entidades:**
    *   **Tipos de Cliente:** Crear y editar categorías de clientes (ej., Individual, Corporativo).
    *   **Tipos de Paquete:** Definir los tamaños y características de los paquetes (ej., Pequeño, Mediano, Grande).
    *   **Tipos de Servicio:** Configurar los servicios de envío ofrecidos (ej., Express, Estándar) y sus correspondientes tarifas por distancia.
    *   **Tipos de Reparto:** Establecer diferentes modalidades de operaciones de reparto.
    *   **Tipos de Envío:** Definir las categorías generales para los envíos.
*   **Validación en Tiempo Real:** Formularios con validación para proporcionar retroalimentación inmediata al usuario.
*   **Herramienta de Sugerencias de IA:** Asistencia inteligente para convenciones de nomenclatura, ayudando a mantener la consistencia y seguir las mejores prácticas.

## Estructura del Directorio `src`

La estructura del directorio `src` está organizada para seguir las convenciones de Next.js y facilitar la mantenibilidad:

*   **`src/app/`**: Contiene todas las rutas y páginas de la aplicación, utilizando el App Router de Next.js.
    *   `layout.tsx`: El layout principal de la aplicación.
    *   `page.tsx`: La página principal del dashboard.
    *   `client-types/page.tsx`: Página para la gestión de Tipos de Cliente.
    *   `package-types/page.tsx`: Página para la gestión de Tipos de Paquete.
    *   `service-types/page.tsx`: Página para la gestión de Tipos de Servicio.
    *   `delivery-types/page.tsx`: Página para la gestión de Tipos de Reparto.
    *   `shipment-types/page.tsx`: Página para la gestión de Tipos de Envío.
    *   `globals.css`: Estilos globales y variables de tema de Tailwind/ShadCN.

*   **`src/components/`**: Alberga todos los componentes React reutilizables.
    *   `ui/`: Componentes de la librería ShadCN UI (Button, Card, Table, etc.).
    *   `client-types/`: Componentes específicos para la gestión de Tipos de Cliente (formulario, columnas de tabla).
    *   `package-types/`: Componentes específicos para Tipos de Paquete.
    *   `service-types/`: Componentes específicos para Tipos de Servicio.
    *   `delivery-types/`: Componentes específicos para Tipos de Reparto.
    *   `shipment-types/`: Componentes específicos para Tipos de Envío.
    *   `data-table/`: Componentes genéricos para la funcionalidad de tablas de datos (paginación, barra de herramientas, acciones de fila).
    *   `layout/`: Componentes estructurales como `AppShell`, `SidebarNav`, y `AppHeader`.
    *   `ai-naming-suggestion.tsx`: Componente para la funcionalidad de sugerencias de nombres por IA.
    *   `confirm-dialog.tsx`: Diálogo de confirmación reutilizable.
    *   `dashboard-card.tsx`: Tarjeta reutilizable para el panel principal.

*   **`src/lib/`**: Contiene utilidades, lógica central y configuración.
    *   `schemas.ts`: Esquemas de validación Zod para los formularios.
    *   `utils.ts`: Funciones de utilidad general (ej., `cn` para clases, `generateId`).
    *   `supabase/`: Configuración del cliente Supabase.
        *   `server.ts`: Cliente Supabase para uso en el lado del servidor (Server Components).

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

## Páginas de la Aplicación y sus Componentes

A continuación, se describen las principales páginas de configuración y los componentes que utilizan:

### 1. Panel General (`/`)
*   **Descripción:** Es la página de inicio después de acceder. Muestra tarjetas que enlazan a las diferentes secciones de configuración del sistema.
*   **Componentes Principales:**
    *   `DashboardCard`: Para cada entidad configurable (Tipos de Cliente, Tipos de Paquete, etc.).

### 2. Tipos de Cliente (`/client-types`)
*   **Descripción:** Permite crear, leer, actualizar y eliminar (CRUD) los diferentes tipos de clientes (ej. Individual, Corporativo).
*   **Componentes Principales:**
    *   `DataTable`: Para mostrar y gestionar la lista de tipos de cliente.
    *   `TipoClienteForm`: Formulario para crear y editar tipos de cliente.
    *   `getTipoClienteColumns`: Define las columnas para la tabla de tipos de cliente.
    *   `ConfirmDialog`: Para confirmar la eliminación de un tipo de cliente.
    *   `AiNamingSuggestion`: Integrado en el formulario para sugerir nombres.

### 3. Tipos de Paquete (`/package-types`)
*   **Descripción:** Gestión CRUD de los tipos de paquetes (ej. Sobre, Paquete Pequeño, Paquete Mediano), incluyendo dimensiones y estado de activación.
*   **Componentes Principales:**
    *   `DataTable`
    *   `TipoPaqueteForm`
    *   `getTipoPaqueteColumns`
    *   `ConfirmDialog`
    *   `AiNamingSuggestion`

### 4. Tipos de Servicio (`/service-types`)
*   **Descripción:** Gestión CRUD de los tipos de servicios ofrecidos (ej. Express, LowCost) y sus correspondientes tarifas basadas en la distancia.
*   **Componentes Principales:**
    *   `DataTable`
    *   `TipoServicioForm` (incluye un subformulario para `TarifaServicio`)
    *   `getTipoServicioColumns`
    *   `ConfirmDialog`
    *   `AiNamingSuggestion`

### 5. Tipos de Reparto (`/delivery-types`)
*   **Descripción:** Gestión CRUD de los diferentes tipos de operaciones de reparto (ej. Reparto Matutino, Recogida Vespertina) y su estado de activación.
*   **Componentes Principales:**
    *   `DataTable`
    *   `TipoRepartoForm`
    *   `getTipoRepartoColumns`
    *   `ConfirmDialog`
    *   `AiNamingSuggestion`

### 6. Tipos de Envío (`/shipment-types`)
*   **Descripción:** Gestión CRUD de las categorías generales de envío (ej. Estándar Nacional, Frágil Asegurado) y su estado de activación.
*   **Componentes Principales:**
    *   `DataTable`
    *   `TipoEnvioForm`
    *   `getTipoEnvioColumns`
    *   `ConfirmDialog`
    *   `AiNamingSuggestion`

## Estructura de la Base de Datos (Tablas Principales)

La base de datos está diseñada para soportar las operaciones de Rumbos Envios, con las siguientes tablas clave:

*   **`tipos_cliente`**:
    *   **Descripción:** Almacena los diferentes tipos de clientes que pueden existir en el sistema.
    *   **Columnas Principales:** `id_tipo_cliente` (PK, uuid), `nombre` (text), `descripcion` (text, nullable), `created_at` (timestamptz).

*   **`tipos_paquete`**:
    *   **Descripción:** Define las categorías de paquetes basadas en tamaño, peso, etc.
    *   **Columnas Principales:** `id_tipo_paquete` (PK, uuid), `nombre` (text), `descripcion` (text, nullable), `dimensiones` (text, nullable), `activo` (boolean), `created_at` (timestamptz).

*   **`tipos_servicio`**:
    *   **Descripción:** Cataloga los diferentes servicios de envío que ofrece la empresa.
    *   **Columnas Principales:** `id_tipo_servicio` (PK, uuid), `nombre` (text), `descripcion` (text, nullable), `created_at` (timestamptz).

*   **`tarifas_servicio`**:
    *   **Descripción:** Detalla las tarifas para cada tipo de servicio, generalmente basadas en la distancia.
    *   **Columnas Principales:** `id_tarifa_servicio` (PK, uuid), `id_tipo_servicio` (FK a `tipos_servicio`, uuid), `hasta_km` (numeric), `precio` (numeric), `created_at` (timestamptz).

*   **`tipos_reparto`**:
    *   **Descripción:** Clasifica los diferentes tipos de operaciones de reparto.
    *   **Columnas Principales:** `id_tipo_reparto` (PK, uuid), `nombre` (text), `descripcion` (text, nullable), `activo` (boolean), `created_at` (timestamptz).

*   **`tipos_envio`**:
    *   **Descripción:** Define las categorías generales para los envíos.
    *   **Columnas Principales:** `id_tipo_envio` (PK, uuid), `nombre` (text), `descripcion` (text, nullable), `activo` (boolean), `created_at` (timestamptz).

*   **`clientes`**:
    *   **Descripción:** Contiene la información de los clientes individuales o entidades que utilizan los servicios.
    *   **Columnas Principales:** `id` (PK, uuid), `id_tipo_cliente` (FK a `tipos_cliente`), `nombre`, `apellido`, `email`, `telefono`, `direccion_completa`, `created_at`.

*   **`tipos_empresa`**:
    *   **Descripción:** Clasifica los diferentes tipos de empresas (ej., Proveedor, Cliente Corporativo Grande, etc.).
    *   **Columnas Principales:** `id` (PK, uuid), `nombre`, `descripcion`, `created_at`.

*   **`empresas`**:
    *   **Descripción:** Almacena información sobre las entidades empresariales relacionadas con la operación.
    *   **Columnas Principales:** `id` (PK, uuid), `id_tipo_empresa` (FK a `tipos_empresa`), `razon_social`, `cuit`, `email_contacto`, `telefono_contacto`, `direccion_fiscal`, `created_at`.

*   **`repartidores`**:
    *   **Descripción:** Guarda los datos personales y de contacto de los repartidores.
    *   **Columnas Principales:** `id` (PK, uuid), `nombre`, `apellido`, `dni`, `telefono`, `email`, `activo`, `created_at`.

*   **`capacidad`**:
    *   **Descripción:** Define la capacidad de carga (peso, volumen) y tipo de vehículo de cada repartidor.
    *   **Columnas Principales:** `id` (PK, uuid), `id_repartidor` (FK a `repartidores`), `tipo_vehiculo`, `carga_max_kg`, `volumen_max_m3`, `created_at`.

*   **`repartos`**:
    *   **Descripción:** Registra cada operación de reparto, asignada o por asignar, con su estado y fecha.
    *   **Columnas Principales:** `id` (PK, uuid), `id_repartidor` (FK a `repartidores`), `id_tipo_reparto` (FK a `tipos_reparto`), `fecha_programada`, `estado`, `tipo` (ej. 'EMPRESA', 'INDIVIDUAL'), `created_at`.

*   **`envios`**:
    *   **Descripción:** Contiene los detalles de cada envío individual, incluyendo origen, destino, cliente, tipo, estado, etc.
    *   **Columnas Principales:** `id` (PK, uuid), `id_cliente` (FK), `id_tipo_envio` (FK), `id_tipo_paquete` (FK), `id_tipo_servicio` (FK), `origen_direccion`, `destino_direccion`, `client_location` (text, para geoinfo), `peso_kg`, `dimensiones_cm`, `fecha_solicitud`, `status` (estado del envío), `precio_total`, `id_reparto_asignado` (FK), `created_at`.

*   **`paradas_reparto`**:
    *   **Descripción:** Define las paradas individuales (recolección o entrega) dentro de un reparto.
    *   **Columnas Principales:** `id` (PK, uuid), `id_reparto` (FK), `id_envio` (FK), `orden_parada`, `direccion_parada`, `tipo_parada` (enum: 'RECOLECCION', 'ENTREGA'), `estado_parada`, `hora_estimada_llegada`, `hora_real_llegada`, `created_at`.

*(Nota: La tabla `tarifas_distancia_calculadora` mencionada en el esquema original como una tabla separada para tarifas genéricas no fue implementada directamente en las páginas CRUD actuales; en su lugar, las tarifas específicas por servicio se gestionan como `tarifas_servicio` asociadas a `tipos_servicio`)*.

Este documento proporciona una visión general del estado actual del proyecto Rumbos Envios.
