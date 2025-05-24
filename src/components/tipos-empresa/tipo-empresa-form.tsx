
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
import { tipoEmpresaSchema } from "@/lib/schemas";
import type { TipoEmpresa, EntityType } from "@/types";
import { AiNamingSuggestion } from "@/components/ai-naming-suggestion";

interface TipoEmpresaFormProps {
  onSubmit: (values: z.infer<typeof tipoEmpresaSchema>) => void;
  initialData?: Partial<TipoEmpresa> | null;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function TipoEmpresaForm({ onSubmit, initialData, onCancel, isSubmitting }: TipoEmpresaFormProps) {
  const form = useForm<z.infer<typeof tipoEmpresaSchema>>({
    resolver: zodResolver(tipoEmpresaSchema),
    defaultValues: initialData || {
      nombre: "",
      descripcion: "",
    },
  });

  const entityType: EntityType = 'tipo_empresa';

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="nombre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del Tipo de Empresa</FormLabel>
              <div className="flex items-center gap-2">
                <FormControl>
                  <Input placeholder="Ej: Minorista, Proveedor" {...field} />
                </FormControl>
                <AiNamingSuggestion
                  entityType={entityType}
                  onSelectSuggestion={(suggestion) => form.setValue("nombre", suggestion)}
                />
              </div>
              <FormDescription>
                El nombre que identifica este tipo de empresa.
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
                  placeholder="Una breve descripción del tipo de empresa."
                  className="resize-none"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : (initialData?.id ? "Guardar Cambios" : "Crear Tipo")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
