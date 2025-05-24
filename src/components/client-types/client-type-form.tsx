
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
import { tipoClienteSchema } from "@/lib/schemas"; // Renamed
import type { TipoCliente, EntityType } from "@/types"; // Renamed
import { AiNamingSuggestion } from "@/components/ai-naming-suggestion";

interface TipoClienteFormProps { // Renamed
  onSubmit: (values: z.infer<typeof tipoClienteSchema>) => void; // Renamed
  initialData?: TipoCliente | null; // Renamed
  onCancel: () => void;
}

export function TipoClienteForm({ onSubmit, initialData, onCancel }: TipoClienteFormProps) { // Renamed
  const form = useForm<z.infer<typeof tipoClienteSchema>>({ // Renamed
    resolver: zodResolver(tipoClienteSchema), // Renamed
    defaultValues: initialData || {
      nombre: "",
      descripcion: "",
    },
  });

  const entityType: EntityType = 'cliente'; // Use 'cliente' for AI suggestions

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="nombre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del Tipo de Cliente</FormLabel>
              <div className="flex items-center gap-2">
                <FormControl>
                  <Input placeholder="Ej: Individual, Corporativo" {...field} />
                </FormControl>
                <AiNamingSuggestion
                  entityType={entityType}
                  onSelectSuggestion={(suggestion) => form.setValue("nombre", suggestion)}
                />
              </div>
              <FormDescription>
                El nombre que identifica este tipo de cliente.
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
                  placeholder="Una breve descripción del tipo de cliente."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            {initialData ? "Guardar Cambios" : "Crear Tipo de Cliente"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

    