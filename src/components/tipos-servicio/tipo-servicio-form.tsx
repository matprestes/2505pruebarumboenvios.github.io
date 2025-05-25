
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
import { tipoServicioSchema } from "@/lib/schemas";
import type { TipoServicio, EntityType, TarifaServicio } from "@/types";
import { AiNamingSuggestion } from "@/components/ai-naming-suggestion";
import { generateId } from "@/lib/utils";
import { Trash2, PlusCircle } from "lucide-react";

interface TipoServicioFormProps {
  onSubmit: (values: z.infer<typeof tipoServicioSchema>) => void;
  initialData?: TipoServicio | null;
  onCancel: () => void;
  isSubmitting: boolean; // Add isSubmitting prop
}

export function TipoServicioForm({ onSubmit, initialData, onCancel, isSubmitting }: TipoServicioFormProps) {
  const form = useForm<z.infer<typeof tipoServicioSchema>>({
    resolver: zodResolver(tipoServicioSchema),
    defaultValues: initialData ?
      {
        ...initialData,
        tarifas_servicio: initialData.tarifas_servicio?.map(t => ({...t, id_tipo_servicio: initialData.id_tipo_servicio})) || [], // Ensure id_tipo_servicio is set for existing rates
      }
      : {
        nombre: "",
        descripcion: "",
        tarifas_servicio: [],
      },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "tarifas_servicio",
  });

  const entityType: EntityType = 'tipo_servicio';

  const handleAddTarifaServicio = () => {
    // For new types, id_tipo_servicio will be undefined until saved.
    // For existing, use the initialData.id_tipo_servicio.
    // The action.ts will handle setting the correct id_tipo_servicio upon insertion.
    const newTarifa = {
        id_tarifa_servicio: generateId(), // Temporary client-side ID for react-hook-form key
        hasta_km: 0,
        precio: 0,
        // id_tipo_servicio is implicitly linked when saving
    };
    append(newTarifa as any); // Cast as any to satisfy the schema for new, non-yet-linked rates
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="nombre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del Tipo de Servicio</FormLabel>
               <div className="flex items-center gap-2">
                <FormControl>
                  <Input placeholder="Ej: Express, Estándar, Económico" {...field} />
                </FormControl>
                <AiNamingSuggestion
                  entityType={entityType}
                  onSelectSuggestion={(suggestion) => form.setValue("nombre", suggestion)}
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
          name="descripcion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción (Opcional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Una breve descripción del tipo de servicio."
                  className="resize-none"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <FormLabel>Tarifas por Distancia</FormLabel>
          <FormDescription>Define los precios según la distancia.</FormDescription>
          <div className="space-y-4 mt-2">
            {fields.map((fieldItem, index) => (
              <div key={fieldItem.id} className="flex items-end gap-2 p-3 border rounded-md">
                <FormField
                  control={form.control}
                  name={`tarifas_servicio.${index}.hasta_km`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="text-xs">Hasta KM</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="KM" {...field} step="0.1" onChange={e => field.onChange(parseFloat(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`tarifas_servicio.${index}.precio`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="text-xs">Precio</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0.00" {...field} step="0.01" onChange={e => field.onChange(parseFloat(e.target.value))} />
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
                  disabled={isSubmitting}
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
            onClick={handleAddTarifaServicio}
            className="mt-2"
            disabled={isSubmitting}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Agregar Tarifa
          </Button>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : (initialData?.id_tipo_servicio ? "Guardar Cambios" : "Crear Tipo de Servicio")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
