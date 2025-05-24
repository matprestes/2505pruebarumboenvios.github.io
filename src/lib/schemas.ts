
import { z } from 'zod';
import { deliveryStatuses, deliveryCategories, shipmentStatuses } from '@/types';

export const clientTypeSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres." }),
  description: z.string().optional(),
});

export const packageTypeSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres." }),
  description: z.string().optional(),
  dimensions: z.string().optional(),
});

export const distanceRateSchema = z.object({
  id: z.string(),
  distancia_hasta_km: z.coerce.number().min(0, { message: "La distancia debe ser un número positivo." }),
  precio: z.coerce.number().min(0, { message: "El precio debe ser un número positivo." }),
  fecha_vigencia_desde: z.string().refine((date) => /^\d{4}-\d{2}-\d{2}$/.test(date), {
    message: "La fecha debe estar en formato YYYY-MM-DD.",
  }),
});

export const serviceTypeSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres." }),
  description: z.string().optional(),
  distanceRates: z.array(distanceRateSchema).optional().default([]),
});

export const deliveryTypeSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres." }),
  description: z.string().optional(),
  estado: z.enum(deliveryStatuses, {
    required_error: "El estado es requerido.",
    invalid_type_error: "Seleccione un estado válido.",
  }),
  tipo_reparto: z.enum(deliveryCategories, {
    required_error: "El tipo de reparto es requerido.",
    invalid_type_error: "Seleccione un tipo de reparto válido.",
  }),
});

export const shipmentTypeSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres." }),
  description: z.string().optional(),
  estado: z.enum(shipmentStatuses, {
    required_error: "El estado es requerido.",
    invalid_type_error: "Seleccione un estado válido.",
  }),
});
