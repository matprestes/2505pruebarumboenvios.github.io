
import { z } from 'zod';
import { tipoParadaEnum, estadoRepartoValues, estadoEnvioValues } from '@/types';

// Schemas for configuration entities

export const tipoClienteSchema = z.object({
  id_tipo_cliente: z.string().uuid().optional(),
  nombre: z.string().min(1, { message: "El nombre es requerido." }),
  descripcion: z.string().optional().nullable(),
  created_at: z.string().datetime().optional(),
});

export const tipoPaqueteSchema = z.object({
  id_tipo_paquete: z.string().uuid().optional(),
  nombre: z.string().min(1, { message: "El nombre es requerido." }),
  descripcion: z.string().optional().nullable(),
  dimensiones: z.string().optional().nullable(),
  activo: z.boolean().default(true).optional(),
  created_at: z.string().datetime().optional(),
});

export const tarifaServicioSchema = z.object({
  id_tarifa_servicio: z.string().uuid().optional(),
  id_tipo_servicio: z.string().uuid({ message: "El ID del tipo de servicio es requerido." }),
  hasta_km: z.coerce.number().min(0, { message: "La distancia debe ser un número positivo." }),
  precio: z.coerce.number().min(0, { message: "El precio debe ser un número positivo." }),
  created_at: z.string().datetime().optional(),
});

export const tipoServicioSchema = z.object({
  id_tipo_servicio: z.string().uuid().optional(),
  nombre: z.string().min(1, { message: "El nombre es requerido." }),
  descripcion: z.string().optional().nullable(),
  tarifas_servicio: z.array(tarifaServicioSchema.omit({ id_tipo_servicio: true, id_tarifa_servicio: true, created_at: true })).optional().default([]),
  created_at: z.string().datetime().optional(),
});

export const tipoRepartoSchema = z.object({
  id_tipo_reparto: z.string().uuid().optional(),
  nombre: z.string().min(1, { message: "El nombre es requerido." }),
  descripcion: z.string().optional().nullable(),
  activo: z.boolean().default(true).optional(),
  created_at: z.string().datetime().optional(),
});

export const tipoEnvioSchema = z.object({
  id_tipo_envio: z.string().uuid().optional(),
  nombre: z.string().min(1, { message: "El nombre es requerido." }),
  descripcion: z.string().optional().nullable(),
  activo: z.boolean().default(true).optional(),
  created_at: z.string().datetime().optional(),
});

export const tipoEmpresaSchema = z.object({
  id: z.string().uuid().optional(),
  nombre: z.string().min(1, "El nombre es requerido."),
  descripcion: z.string().optional().nullable(),
  created_at: z.string().datetime().optional(),
});


// Schemas for operational entities

export const clienteSchema = z.object({
  id: z.string().uuid().optional(),
  id_tipo_cliente: z.string().uuid({ message: "Debe seleccionar un tipo de cliente."}).nullable(),
  id_empresa: z.string().uuid().optional().nullable(),
  nombre: z.string().min(1, "El nombre es requerido."),
  apellido: z.string().optional().nullable(),
  email: z.string().email({ message: "Email inválido."}).optional().nullable().or(z.literal('')),
  telefono: z.string().optional().nullable(),
  direccion_completa: z.string().optional().nullable(),
  latitud: z.coerce.number().optional().nullable(),
  longitud: z.coerce.number().optional().nullable(),
  notas: z.string().optional().nullable(),
  created_at: z.string().datetime().optional(),
});

export const empresaSchema = z.object({
  id: z.string().uuid().optional(),
  id_tipo_empresa: z.string().uuid({ message: "Debe seleccionar un tipo de empresa."}).nullable(),
  razon_social: z.string().min(1, "La razón social es requerida."),
  cuit: z.string().optional().nullable(),
  email_contacto: z.string().email({ message: "Email inválido."}).optional().nullable().or(z.literal('')),
  telefono_contacto: z.string().optional().nullable(),
  direccion_fiscal: z.string().optional().nullable(),
  latitud: z.coerce.number().optional().nullable(),
  longitud: z.coerce.number().optional().nullable(),
  notas: z.string().optional().nullable(),
  created_at: z.string().datetime().optional(),
});

export const repartidorSchema = z.object({
  id: z.string().uuid().optional(),
  nombre: z.string().min(1, "El nombre es requerido."),
  apellido: z.string().min(1, "El apellido es requerido."),
  dni: z.string().optional().nullable(),
  telefono: z.string().optional().nullable(),
  email: z.string().email({ message: "Email inválido."}).optional().nullable().or(z.literal('')),
  activo: z.boolean().default(true).optional(),
  created_at: z.string().datetime().optional(),
});

export const capacidadSchema = z.object({
  id: z.string().uuid().optional(),
  id_repartidor: z.string().uuid({ message: "Debe seleccionar un repartidor."}),
  nombre_vehiculo: z.string().optional().nullable(),
  tipo_vehiculo: z.string().min(1, "El tipo de vehículo es requerido."),
  carga_max_kg: z.coerce.number().positive("La carga máxima debe ser positiva.").optional().nullable(),
  volumen_max_m3: z.coerce.number().positive("El volumen máximo debe ser positivo.").optional().nullable(),
  created_at: z.string().datetime().optional(),
});

export const repartoSchema = z.object({
  id: z.string().uuid().optional(),
  id_repartidor: z.string().uuid({ message: "Debe seleccionar un repartidor."}).nullable().optional(),
  id_tipo_reparto: z.string().uuid({ message: "Debe seleccionar un tipo de reparto."}),
  id_empresa: z.string().uuid({ message: "Debe seleccionar una empresa (destino/servicio)."}).nullable().optional(),
  id_empresa_despachante: z.string().uuid({ message: "Debe seleccionar una empresa despachante."}).nullable().optional(),
  fecha_programada: z.string().refine((date) => /^\d{4}-\d{2}-\d{2}$/.test(date), {
    message: "La fecha debe estar en formato YYYY-MM-DD.",
  }),
  estado: z.enum(estadoRepartoValues, { errorMap: () => ({ message: "Estado de reparto inválido." }) }).default("PENDIENTE"),
  tipo: z.string().optional().nullable(),
  created_at: z.string().datetime().optional(),
});

export const envioSchema = z.object({
  id: z.string().uuid().optional(),
  id_cliente: z.string().uuid({ message: "Debe seleccionar un cliente."}),
  id_tipo_envio: z.string().uuid({ message: "Debe seleccionar un tipo de envío."}),
  id_tipo_paquete: z.string().uuid({ message: "Debe seleccionar un tipo de paquete."}),
  id_tipo_servicio: z.string().uuid({ message: "Debe seleccionar un tipo de servicio."}),
  id_reparto: z.string().uuid().optional().nullable(),
  id_repartidor_preferido: z.string().uuid().optional().nullable(),
  id_empresa_cliente: z.string().uuid().optional().nullable(),
  direccion_origen: z.string().optional().nullable(),
  latitud_origen: z.coerce.number().optional().nullable(),
  longitud_origen: z.coerce.number().optional().nullable(),
  direccion_destino: z.string().min(1, "La dirección de destino es requerida."),
  latitud_destino: z.coerce.number().optional().nullable(),
  longitud_destino: z.coerce.number().optional().nullable(),
  client_location: z.string().optional().nullable(),
  peso: z.coerce.number().positive("El peso debe ser positivo.").optional().nullable(),
  dimensiones_cm: z.string().optional().nullable(),
  fecha_solicitud: z.string().refine((date) => /^\d{4}-\d{2}-\d{2}$/.test(date), {
    message: "La fecha debe estar en formato YYYY-MM-DD.",
  }).default(new Date().toISOString().split('T')[0]),
  estado: z.enum(estadoEnvioValues, { errorMap: () => ({ message: "Estado de envío inválido." }) }).default("PENDIENTE"),
  precio_total: z.coerce.number().optional().nullable(),
  precio_calculado: z.coerce.number().optional().nullable(),
  distancia_km: z.coerce.number().optional().nullable(),
  notas: z.string().optional().nullable(),
  suggested_options: z.any().optional().nullable(), 
  reasoning: z.string().optional().nullable(),
  precio_servicio_final: z.coerce.number().optional().nullable(),
  created_at: z.string().datetime().optional(),
});

export const paradaRepartoSchema = z.object({
  id: z.string().uuid().optional(),
  id_reparto: z.string().uuid({ message: "Debe seleccionar un reparto."}),
  id_envio: z.string().uuid({ message: "Debe seleccionar un envío."}),
  orden: z.coerce.number().int("El orden debe ser un entero.").min(1, "El orden debe ser al menos 1."),
  direccion_parada: z.string().min(1, "La dirección de la parada es requerida."),
  tipo_parada: z.enum(tipoParadaEnum, { errorMap: () => ({ message: "Tipo de parada inválido." }) }),
  estado_parada: z.string().min(1, "El estado de la parada es requerido.").default('PENDIENTE'),
  hora_estimada_llegada: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Formato HH:MM").optional().nullable(),
  hora_real_llegada: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Formato HH:MM").optional().nullable(),
  created_at: z.string().datetime().optional(),
});

export const clienteServicioConfigSchema = z.object({
  cliente_id: z.string().uuid(),
  nombre_completo: z.string(),
  direccion_completa: z.string().nullable(),
  seleccionado: z.boolean(),
  id_tipo_servicio: z.string().uuid({ message: "Debe seleccionar un tipo de servicio para el cliente." }).nullable(),
  precio_servicio_final: z.coerce.number().positive({ message: "El precio debe ser positivo."}).nullable(),
}).refine(data => {
    if (data.seleccionado) {
      return data.id_tipo_servicio !== null && data.precio_servicio_final !== null;
    }
    return true;
  }, {
    message: "Si el cliente está seleccionado, el tipo de servicio y el precio final son requeridos.",
    // Apply the error to a common path or a specific one if desired
    path: ["id_tipo_servicio"], 
  });

export const repartoLoteSchema = z.object({
  id_tipo_reparto: z.string().uuid({ message: "Debe seleccionar un tipo de reparto."}),
  id_empresa: z.string().uuid({ message: "Debe seleccionar una empresa para los clientes."}),
  id_empresa_despachante: z.string().uuid({ message: "Debe seleccionar una empresa despachante."}).nullable().optional(),
  fecha_programada: z.string().refine((date) => /^\d{4}-\d{2}-\d{2}$/.test(date), {
    message: "La fecha debe estar en formato YYYY-MM-DD.",
  }),
  id_repartidor: z.string().uuid().nullable().optional(),
  clientes_config: z.array(clienteServicioConfigSchema).min(1, "Debe configurar al menos un cliente para el lote.").refine(
    (configs) => configs.some(c => c.seleccionado), 
    { message: "Debe seleccionar al menos un cliente para el lote."}
  ),
  id_tipo_envio_default: z.string().uuid({ message: "Debe seleccionar un tipo de envío por defecto." }),
  id_tipo_paquete_default: z.string().uuid({ message: "Debe seleccionar un tipo de paquete por defecto." }),
});

    