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
import { packageTypeSchema } from "@/lib/schemas";
import type { PackageType, EntityType } from "@/types";
import { AiNamingSuggestion } from "@/components/ai-naming-suggestion";

interface PackageTypeFormProps {
  onSubmit: (values: z.infer<typeof packageTypeSchema>) => void;
  initialData?: PackageType | null;
  onCancel: () => void;
}

export function PackageTypeForm({ onSubmit, initialData, onCancel }: PackageTypeFormProps) {
  const form = useForm<z.infer<typeof packageTypeSchema>>({
    resolver: zodResolver(packageTypeSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      dimensions: "",
    },
  });

  const entityType: EntityType = 'package';

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del Tipo de Paquete</FormLabel>
              <div className="flex items-center gap-2">
                <FormControl>
                  <Input placeholder="Ej: Pequeño, Mediano, Grande" {...field} />
                </FormControl>
                <AiNamingSuggestion
                  entityType={entityType}
                  onSelectSuggestion={(suggestion) => form.setValue("name", suggestion)}
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción (Opcional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Una breve descripción del tipo de paquete."
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
          name="dimensions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dimensiones (Opcional)</FormLabel>
              <FormControl>
                <Input placeholder="Ej: 20x20x10 cm, Max 5kg" {...field} />
              </FormControl>
              <FormDescription>
                Dimensiones o límites de peso para este tipo de paquete.
              </FormDescription>
              <FormMessage />
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
