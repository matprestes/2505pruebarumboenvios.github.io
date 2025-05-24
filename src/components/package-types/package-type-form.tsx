
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
import { tipoPaqueteSchema } from "@/lib/schemas";
import type { TipoPaquete, EntityType } from "@/types";
import { AiNamingSuggestion } from "@/components/ai-naming-suggestion";

interface TipoPaqueteFormProps {
  onSubmit: (values: z.infer<typeof tipoPaqueteSchema>) => void;
  initialData?: TipoPaquete | null;
  onCancel: () => void;
}

export function TipoPaqueteForm({ onSubmit, initialData, onCancel }: TipoPaqueteFormProps) {
  const form = useForm<z.infer<typeof tipoPaqueteSchema>>({
    resolver: zodResolver(tipoPaqueteSchema),
    defaultValues: initialData || {
      nombre: "",
      descripcion: "",
      dimensiones: "",
      activo: true,
    },
  });

  const entityType: EntityType = 'paquete';

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="nombre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del Tipo de Paquete</FormLabel>
              <div className="flex items-center gap-2">
                <FormControl>
                  <Input placeholder="Ej: Pequeño, Mediano, Grande" {...field} />
                </FormControl>
                <AiNamingSuggestion
                  entityType={entityType}
                  onSelectSuggestion={(suggestion) => form.setValue("nombre", suggestion)}
                />
              </div>
              <FormDescription>
                El nombre que identifica este tipo de paquete.
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
                  placeholder="Una breve descripción del tipo de paquete."
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
          name="dimensiones"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dimensiones (Opcional)</FormLabel>
              <FormControl>
                <Input placeholder="Ej: 20x20x10 cm, Max 5kg" {...field} value={field.value ?? ""}/>
              </FormControl>
              <FormDescription>
                Dimensiones o límites de peso para este tipo de paquete.
              </FormDescription>
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
                  Indica si este tipo de paquete está actualmente disponible.
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
            {initialData ? "Guardar Cambios" : "Crear Tipo de Paquete"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

    