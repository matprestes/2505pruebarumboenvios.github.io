"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { serviceTypeSchema } from "@/lib/schemas";
import type { ServiceType, EntityType } from "@/types";
import { AiNamingSuggestion } from "@/components/ai-naming-suggestion";

interface ServiceTypeFormProps {
  onSubmit: (values: z.infer<typeof serviceTypeSchema>) => void;
  initialData?: ServiceType | null;
  onCancel: () => void;
}

export function ServiceTypeForm({ onSubmit, initialData, onCancel }: ServiceTypeFormProps) {
  const form = useForm<z.infer<typeof serviceTypeSchema>>({
    resolver: zodResolver(serviceTypeSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      baseRate: 0,
      ratePerKm: undefined,
      ratePerKg: undefined,
    },
  });

  const entityType: EntityType = 'service';

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del Tipo de Servicio</FormLabel>
               <div className="flex items-center gap-2">
                <FormControl>
                  <Input placeholder="Ej: Express, Estándar, Económico" {...field} />
                </FormControl>
                <AiNamingSuggestion
                  entityType={entityType}
                  onSelectSuggestion={(suggestion) => form.setValue("name", suggestion)}
                />
              </div>
              <FormDescription>
                El nombre que identifica este tipo de servicio.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción (Opcional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Una breve descripción del tipo de servicio."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="baseRate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tarifa Base</FormLabel>
              <FormControl>
                <Input type="number" placeholder="0.00" {...field} step="0.01" />
              </FormControl>
              <FormDescription>
                La tarifa mínima para este servicio.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="ratePerKm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tarifa por Km (Opcional)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0.00" {...field} step="0.01" />
                </FormControl>
                <FormDescription>
                  Costo adicional por kilómetro recorrido.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ratePerKg"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tarifa por Kg (Opcional)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0.00" {...field} step="0.01" />
                </FormControl>
                <FormDescription>
                  Costo adicional por kilogramo de peso.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            {initialData ? "Guardar Cambios" : "Crear Tipo de Servicio"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
