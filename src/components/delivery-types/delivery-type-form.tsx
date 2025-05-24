
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
import { Switch } from "@/components/ui/switch";
import { tipoRepartoSchema } from "@/lib/schemas";
import type { TipoReparto, EntityType } from "@/types";
import { AiNamingSuggestion } from "@/components/ai-naming-suggestion";

interface TipoRepartoFormProps {
  onSubmit: (values: z.infer<typeof tipoRepartoSchema>) => void;
  initialData?: TipoReparto | null;
  onCancel: () => void;
}

export function TipoRepartoForm({ onSubmit, initialData, onCancel }: TipoRepartoFormProps) {
  const form = useForm<z.infer<typeof tipoRepartoSchema>>({
    resolver: zodResolver(tipoRepartoSchema),
    defaultValues: initialData || {
      nombre: "",
      descripcion: "",
      activo: true,
    },
  });

  const entityType: EntityType = 'reparto';

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="nombre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del Tipo de Reparto</FormLabel>
              <div className="flex items-center gap-2">
                <FormControl>
                  <Input placeholder="Ej: Reparto Matutino, Urgencias" {...field} />
                </FormControl>
                <AiNamingSuggestion
                  entityType={entityType}
                  onSelectSuggestion={(suggestion) => form.setValue("nombre", suggestion)}
                />
              </div>
              <FormDescription>
                El nombre que identifica este tipo de reparto.
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
                  placeholder="Una breve descripción del tipo de reparto."
                  className="resize-none"
                  {...field}
                  value={field.value ?? ""}
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
                  Indica si este tipo de reparto está actualmente disponible.
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
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            {initialData ? "Guardar Cambios" : "Crear Tipo de Reparto"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

    