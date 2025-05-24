
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
import { Switch } from "@/components/ui/switch"; // Added
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // No longer needed for 'estado'
import { tipoEnvioSchema } from "@/lib/schemas"; // Renamed
import type { TipoEnvio, EntityType } from "@/types"; // Renamed
// import { shipmentStatuses } from "@/types"; // No longer needed here
import { AiNamingSuggestion } from "@/components/ai-naming-suggestion";

interface TipoEnvioFormProps { // Renamed
  onSubmit: (values: z.infer<typeof tipoEnvioSchema>) => void; // Renamed
  initialData?: TipoEnvio | null; // Renamed
  onCancel: () => void;
}

export function TipoEnvioForm({ onSubmit, initialData, onCancel }: TipoEnvioFormProps) { // Renamed
  const form = useForm<z.infer<typeof tipoEnvioSchema>>({ // Renamed
    resolver: zodResolver(tipoEnvioSchema), // Renamed
    defaultValues: initialData || {
      nombre: "",
      descripcion: "",
      activo: true,
      // 'estado' removed
    },
  });

  const entityType: EntityType = 'envio'; // Use 'envio' for AI Naming

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="nombre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del Tipo de Envío</FormLabel>
              <div className="flex items-center gap-2">
                <FormControl>
                  <Input placeholder="Ej: Envío Estándar, Envío Urgente" {...field} />
                </FormControl>
                <AiNamingSuggestion
                  entityType={entityType}
                  onSelectSuggestion={(suggestion) => form.setValue("nombre", suggestion)}
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
          name="descripcion"
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
          name="activo"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Activo</FormLabel>
                <FormDescription>
                  Indica si este tipo de envío está actualmente disponible.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        {/* 'estado' field removed */}
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

    