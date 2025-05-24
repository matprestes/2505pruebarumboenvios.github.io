
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
import { tipoServicioSchema } from "@/lib/schemas"; // Renamed
import type { TipoServicio, EntityType, TarifaServicio } from "@/types"; // Renamed
import { AiNamingSuggestion } from "@/components/ai-naming-suggestion";
import { generateId } from "@/lib/utils";
import { Trash2, PlusCircle } from "lucide-react";

interface TipoServicioFormProps { // Renamed
  onSubmit: (values: z.infer<typeof tipoServicioSchema>) => void; // Renamed
  initialData?: TipoServicio | null; // Renamed
  onCancel: () => void;
}

export function TipoServicioForm({ onSubmit, initialData, onCancel }: TipoServicioFormProps) { // Renamed
  const form = useForm<z.infer<typeof tipoServicioSchema>>({ // Renamed
    resolver: zodResolver(tipoServicioSchema), // Renamed
    defaultValues: initialData || {
      nombre: "",
      descripcion: "",
      tarifas_servicio: [], // Renamed
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "tarifas_servicio", // Renamed
  });

  const entityType: EntityType = 'servicio'; // Renamed for AI

  const handleAddTarifaServicio = () => { // Renamed
    // When adding, id_tipo_servicio is not known yet if it's a new TipoServicio.
    // It will be assigned when the main form is submitted.
    // For existing TipoServicio, it should be initialData.id_tipo_servicio.
    const newTarifa: Partial<TarifaServicio> = { 
        id_tarifa_servicio: generateId(), 
        // id_tipo_servicio will be filled on submit or if initialData.id_tipo_servicio exists
        hasta_km: 0, 
        precio: 0,
        created_at: new Date().toISOString() // Handled by DB in real scenario
    };
    if (initialData?.id_tipo_servicio) {
        newTarifa.id_tipo_servicio = initialData.id_tipo_servicio;
    }
    append(newTarifa as TarifaServicio); // Cast as TarifaServicio for useFieldArray
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
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-end gap-2 p-3 border rounded-md">
                <FormField
                  control={form.control}
                  name={`tarifas_servicio.${index}.hasta_km`} // Renamed
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
                  name={`tarifas_servicio.${index}.precio`} // Renamed
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
                {/* fecha_vigencia_desde removed */}
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
            onClick={handleAddTarifaServicio} // Renamed
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
            {initialData?.id_tipo_servicio ? "Guardar Cambios" : "Crear Tipo de Servicio"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

    