
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { empresaSchema } from "@/lib/schemas";
import type { Empresa, SelectOption, EntityType } from "@/types";
import { AiNamingSuggestion } from "@/components/ai-naming-suggestion";

interface EmpresaFormProps {
  onSubmit: (values: z.infer<typeof empresaSchema>) => void;
  initialData?: Partial<Empresa> | null;
  onCancel: () => void;
  tiposEmpresaOptions: SelectOption[];
  isSubmitting: boolean;
}

export function EmpresaForm({
  onSubmit,
  initialData,
  onCancel,
  tiposEmpresaOptions,
  isSubmitting,
}: EmpresaFormProps) {
  const form = useForm<z.infer<typeof empresaSchema>>({
    resolver: zodResolver(empresaSchema),
    defaultValues: initialData || {
      razon_social: "",
      cuit: "",
      email_contacto: "",
      telefono_contacto: "",
      direccion_fiscal: "",
      latitud: undefined,
      longitud: undefined,
      notas: "",
      id_tipo_empresa: null,
    },
  });

  const entityType: EntityType = 'empresa';

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="razon_social"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Razón Social</FormLabel>
              <div className="flex items-center gap-2">
                <FormControl>
                  <Input placeholder="Nombre de la empresa" {...field} />
                </FormControl>
                 <AiNamingSuggestion
                  entityType={entityType}
                  onSelectSuggestion={(suggestion) => form.setValue("razon_social", suggestion)}
                />
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="id_tipo_empresa"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Empresa</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value || undefined} value={field.value || undefined}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un tipo de empresa" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {tiposEmpresaOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cuit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CUIT (Opcional)</FormLabel>
              <FormControl>
                <Input placeholder="Número de CUIT" {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email_contacto"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email de Contacto (Opcional)</FormLabel>
              <FormControl>
                <Input type="email" placeholder="contacto@empresa.com" {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="telefono_contacto"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Teléfono de Contacto (Opcional)</FormLabel>
              <FormControl>
                <Input placeholder="Número de teléfono" {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="direccion_fiscal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dirección Fiscal (Opcional)</FormLabel>
              <FormControl>
                <Input placeholder="Dirección fiscal de la empresa" {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
                control={form.control}
                name="latitud"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Latitud (Opcional)</FormLabel>
                    <FormControl>
                        <Input type="number" placeholder="Ej: -38.012795" {...field} value={field.value ?? ""} onChange={e => field.onChange(parseFloat(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="longitud"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Longitud (Opcional)</FormLabel>
                    <FormControl>
                        <Input type="number" placeholder="Ej: -57.541350" {...field} value={field.value ?? ""} onChange={e => field.onChange(parseFloat(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </div>
        <FormField
          control={form.control}
          name="notas"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notas (Opcional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Información adicional sobre la empresa."
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
            {isSubmitting ? "Guardando..." : (initialData?.id ? "Guardar Cambios" : "Crear Empresa")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
