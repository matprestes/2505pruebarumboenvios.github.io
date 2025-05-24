import { z } from 'zod';

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

export const serviceTypeSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres." }),
  description: z.string().optional(),
  baseRate: z.coerce.number().min(0, { message: "La tarifa base debe ser un número positivo." }),
  ratePerKm: z.coerce.number().min(0, { message: "La tarifa por km debe ser un número positivo." }).optional().or(z.literal('')),
  ratePerKg: z.coerce.number().min(0, { message: "La tarifa por kg debe ser un número positivo." }).optional().or(z.literal('')),
});
