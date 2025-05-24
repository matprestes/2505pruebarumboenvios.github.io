
import { z } from 'zod';
import { tipoParadaEnum, estadoRepartoValues, estadoEnvioValues } from '@/types'; // Using new names

// Renamed schemas to Spanish and updated fields
export const tipoClienteSchema = z.object({
  id_tipo_cliente: z.string().uuid().optional(),
  nombre: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres." }),
  descripcion: z.string().optional(),
  // created_at is handled by DB
});

export const tipoPaqueteSchema = z.object({
  id_tipo_paquete: z.string().uuid().optional(),
  nombre: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres." }),
  descripcion: z.string().optional(),
  dimensiones: z.string().optional(),
  activo: z.boolean().default(true),
  // created_at is handled by DB
});

export const tarifaServicioSchema = z.object({
  id_tarifa_servicio: z.string().uuid(), // Assuming UUIDs are generated or provided
  id_tipo_servicio: z.string().uuid(), // FK
  hasta_km: z.coerce.number().min(0, { message: "La distancia debe ser un número positivo." }),
  precio: z.coerce.number().min(0, { message: "El precio debe ser un número positivo." }),
  // fecha_vigencia_desde removed as per prompt
  // created_at is handled by DB
});

export const tipoServicioSchema = z.object({
  id_tipo_servicio: z.string().uuid().optional(),
  nombre: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres." }),
  descripcion: z.string().optional(),
  tarifas_servicio: z.array(tarifaServicioSchema).optional().default([]),
  // created_at is handled by DB
});

export const tipoRepartoSchema = z.object({
  id_tipo_reparto: z.string().uuid().optional(),
  nombre: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres." }),
  descripcion: z.string().optional(),
  activo: z.boolean().default(true),
  // created_at is handled by DB
  // 'estado' and 'tipo_reparto' (as string category) removed, now part of 'repartos' instances
});

export const tipoEnvioSchema = z.object({
  id_tipo_envio: z.string().uuid().optional(),
  nombre: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres." }),
  descripcion: z.string().optional(),
  activo: z.boolean().default(true),
  // created_at is handled by DB
  // 'estado' removed, now part of 'envios' instances
});

// Schemas for new entities (basic versions, can be expanded)
export const clienteSchema = z.object({
  id: z.string().uuid().optional(),
  id_tipo_cliente: z.string().uuid({ message: "Debe seleccionar un tipo de cliente."}),
  nombre: z.string().min(1, "El nombre es requerido."),
  apellido: z.string().optional(),
  email: z.string().email("Email inválido.").optional().or(z.literal('')),
  telefono: z.string().optional(),
  direccion_completa: z.string().optional(),
});

export const tipoEmpresaSchema = z.object({
  id: z.string().uuid().optional(),
  nombre: z.string().min(1, "El nombre es requerido."),
  descripcion: z.string().optional(),
});

export const empresaSchema = z.object({
  id: z.string().uuid().optional(),
  id_tipo_empresa: z.string().uuid({ message: "Debe seleccionar un tipo de empresa."}),
  razon_social: z.string().min(1, "La razón social es requerida."),
  cuit: z.string().optional(),
  email_contacto: z.string().email("Email inválido.").optional().or(z.literal('')),
  telefono_contacto: z.string().optional(),
  direccion_fiscal: z.string().optional(),
});

export const repartidorSchema = z.object({
  id: z.string().uuid().optional(),
  nombre: z.string().min(1, "El nombre es requerido."),
  apellido: z.string().min(1, "El apellido es requerido."),
  dni: z.string().optional(),
  telefono: z.string().optional(),
  email: z.string().email("Email inválido.").optional().or(z.literal('')),
  activo: z.boolean().default(true),
});

export const capacidadSchema = z.object({
  id: z.string().uuid().optional(),
  id_repartidor: z.string().uuid({ message: "Debe seleccionar un repartidor."}),
  tipo_vehiculo: z.string().min(1, "El tipo de vehículo es requerido."),
  carga_max_kg: z.coerce.number().positive("La carga máxima debe ser positiva.").optional().nullable(),
  volumen_max_m3: z.coerce.number().positive("El volumen máximo debe ser positivo.").optional().nullable(),
});

export const repartoSchema = z.object({
  id: z.string().uuid().optional(),
  id_repartidor: z.string().uuid().nullable().optional(),
  id_tipo_reparto: z.string().uuid({ message: "Debe seleccionar un tipo de reparto."}),
  fecha_programada: z.string().refine((date) => /^\d{4}-\d{2}-\d{2}$/.test(date), {
    message: "La fecha debe estar en formato YYYY-MM-DD.",
  }),
  estado: z.enum(estadoRepartoValues, { message: "Estado de reparto inválido." }),
  tipo: z.string().min(1, "El tipo es requerido (ej. EMPRESA, INDIVIDUAL)."), // This was text in new schema
});

export const envioSchema = z.object({
  id: z.string().uuid().optional(),
  id_cliente: z.string().uuid({ message: "Debe seleccionar un cliente."}),
  id_tipo_envio: z.string().uuid({ message: "Debe seleccionar un tipo de envío."}),
  id_tipo_paquete: z.string().uuid({ message: "Debe seleccionar un tipo de paquete."}),
  id_tipo_servicio: z.string().uuid({ message: "Debe seleccionar un tipo de servicio."}),
  origen_direccion: z.string().optional().nullable(),
  destino_direccion: z.string().min(1, "La dirección de destino es requerida."),
  client_location: z.string().optional().nullable(), // Text for geocoded info
  peso_kg: z.coerce.number().positive("El peso debe ser positivo.").optional().nullable(),
  dimensiones_cm: z.string().optional().nullable(),
  fecha_solicitud: z.string().refine((date) => /^\d{4}-\d{2}-\d{2}$/.test(date), {
    message: "La fecha debe estar en formato YYYY-MM-DD.",
  }),
  status: z.enum(estadoEnvioValues, { message: "Estado de envío inválido." }).default("PENDIENTE"),
  precio_total: z.coerce.number().optional().nullable(),
  id_reparto_asignado: z.string().uuid().nullable().optional(),
  suggested_options: z.any().optional().nullable(), // z.record(z.any()) or more specific if known
  reasoning: z.string().optional().nullable(),
});

export const paradaRepartoSchema = z.object({
  id: z.string().uuid().optional(),
  id_reparto: z.string().uuid({ message: "Debe seleccionar un reparto."}),
  id_envio: z.string().uuid({ message: "Debe seleccionar un envío."}),
  orden_parada: z.coerce.number().int("El orden debe ser un entero."),
  direccion_parada: z.string().min(1, "La dirección de la parada es requerida."),
  tipo_parada: z.enum(tipoParadaEnum, { message: "Tipo de parada inválido." }),
  estado_parada: z.string().min(1, "El estado de la parada es requerido."), // e.g., 'PENDIENTE', 'COMPLETADA'
  hora_estimada_llegada: z.string().optional().nullable(), // Validate as time if needed
  hora_real_llegada: z.string().optional().nullable(), // Validate as time if needed
});

export const tarifaDistanciaCalculadoraSchema = z.object({
  id: z.string().uuid().optional(),
  tipo_calculadora: z.string().min(1, "El tipo de calculadora es requerido."),
  distancia_hasta_km: z.coerce.number().min(0, "La distancia debe ser no negativa."),
  precio: z.coerce.number().min(0, "El precio debe ser no negativo."),
  fecha_vigencia_desde: z.string().refine((date) => /^\d{4}-\d{2}-\d{2}$/.test(date), {
    message: "La fecha debe estar en formato YYYY-MM-DD.",
  }).default(new Date().toISOString().split('T')[0]),
});

    