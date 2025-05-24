
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { shipmentTypeSchema } from "@/lib/schemas";
import type { ShipmentType, EntityType } from "@/types";
import { shipmentStatuses } from "@/types";
import { AiNamingSuggestion } from "@/components/ai-naming-suggestion";

interface ShipmentTypeFormProps {
  onSubmit: (values: z.infer<typeof shipmentTypeSchema>) => void;
  initialData?: ShipmentType | null;
  onCancel: () => void;
}

export function ShipmentTypeForm({ onSubmit, initialData, onCancel }: ShipmentTypeFormProps) {
  const form = useForm<z.infer<typeof shipmentTypeSchema>>({
    resolver: zodResolver(shipmentTypeSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      estado: "pendiente",
    },
  });

  const entityType: EntityType = 'shipment';

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del Tipo de Envío</FormLabel>
              <div className="flex items-center gap-2">
                <FormControl>
                  <Input placeholder="Ej: Envío Estándar, Envío Urgente" {...field} />
                </FormControl>
                <AiNamingSuggestion
                  entityType={entityType}
                  onSelectSuggestion={(suggestion) => form.setValue("name", suggestion)}
                />
              </div>
              <FormDescription>
                El nombre que identifica este tipo de envío.
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
                  placeholder="Una breve descripción del tipo de envío."
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
          name="estado"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un estado" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {shipmentStatuses.map((status) => (
                    <SelectItem key={status} value={status} className="capitalize">
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            {initialData ? "Guardar Cambios" : "Crear Tipo de Envío"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
