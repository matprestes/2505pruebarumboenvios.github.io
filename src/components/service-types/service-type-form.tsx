
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
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
import type { ServiceType, EntityType, DistanceRate } from "@/types";
import { AiNamingSuggestion } from "@/components/ai-naming-suggestion";
import { generateId } from "@/lib/utils";
import { Trash2, PlusCircle } from "lucide-react";

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
      distanceRates: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "distanceRates",
  });

  const entityType: EntityType = 'service';

  const handleAddDistanceRate = () => {
    append({ id: generateId(), distancia_hasta_km: 0, precio: 0, fecha_vigencia_desde: new Date().toISOString().split('T')[0] });
  };

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

        <div>
          <FormLabel>Tarifas por Distancia</FormLabel>
          <FormDescription>Define los precios según la distancia y fecha de vigencia.</FormDescription>
          <div className="space-y-4 mt-2">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-end gap-2 p-3 border rounded-md">
                <FormField
                  control={form.control}
                  name={`distanceRates.${index}.distancia_hasta_km`}
                  render={({ field: itemField }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="text-xs">Hasta KM</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="KM" {...itemField} step="0.1" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`distanceRates.${index}.precio`}
                  render={({ field: itemField }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="text-xs">Precio</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0.00" {...itemField} step="0.01" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`distanceRates.${index}.fecha_vigencia_desde`}
                  render={({ field: itemField }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="text-xs">Vigencia Desde</FormLabel>
                      <FormControl>
                        <Input type="date" {...itemField} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                  className="text-destructive hover:text-destructive"
                  title="Eliminar tarifa"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddDistanceRate}
            className="mt-2"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Agregar Tarifa de Distancia
          </Button>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            {initialData?.id ? "Guardar Cambios" : "Crear Tipo de Servicio"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
