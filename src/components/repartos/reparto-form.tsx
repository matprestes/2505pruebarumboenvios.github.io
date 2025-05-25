
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { es } from 'date-fns/locale';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { repartoSchema } from "@/lib/schemas";
import type { Reparto, SelectOption, EstadoReparto } from "@/types";
import { estadoRepartoValues } from "@/types";
import { cn } from "@/lib/utils";

interface RepartoFormProps {
  onSubmit: (values: z.infer<typeof repartoSchema>) => void;
  initialData?: Partial<Reparto> | null;
  onCancel: () => void;
  tiposRepartoOptions: SelectOption[];
  repartidoresOptions: SelectOption[];
  empresasOptions: SelectOption[];
  isSubmitting: boolean;
}

export function RepartoForm({
  onSubmit,
  initialData,
  onCancel,
  tiposRepartoOptions,
  repartidoresOptions,
  empresasOptions,
  isSubmitting,
}: RepartoFormProps) {
  const form = useForm<z.infer<typeof repartoSchema>>({
    resolver: zodResolver(repartoSchema),
    defaultValues: initialData ? {
      ...initialData,
      // Ensure date is formatted correctly for the form input if it exists
      fecha_programada: initialData.fecha_programada ? format(new Date(initialData.fecha_programada + 'T00:00:00'), "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
      id_repartidor: initialData.id_repartidor || null,
      id_empresa: initialData.id_empresa || null,
      id_empresa_despachante: initialData.id_empresa_despachante || null,
      tipo: initialData.tipo || "",
    } : {
      id_tipo_reparto: "",
      id_repartidor: null,
      id_empresa: null,
      id_empresa_despachante: null,
      fecha_programada: format(new Date(), "yyyy-MM-dd"),
      estado: "PENDIENTE",
      tipo: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto p-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="id_tipo_reparto"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Tipo de Reparto *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Seleccione un tipo de reparto" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    {tiposRepartoOptions.map(option => (
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
            name="fecha_programada"
            render={({ field }) => (
                <FormItem className="flex flex-col">
                <FormLabel>Fecha Programada *</FormLabel>
                <Popover>
                    <PopoverTrigger asChild>
                    <FormControl>
                        <Button
                        variant={"outline"}
                        className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                        )}
                        >
                        {field.value ? (
                            format(new Date(field.value + 'T00:00:00'), "PPP", { locale: es })
                        ) : (
                            <span>Seleccione una fecha</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                    </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={field.value ? new Date(field.value + 'T00:00:00') : undefined}
                        onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                        initialFocus
                    />
                    </PopoverContent>
                </Popover>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="id_repartidor"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Repartidor</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || undefined} defaultValue={field.value || undefined}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Seleccione un repartidor" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    <SelectItem value="null">Sin asignar</SelectItem>
                    {repartidoresOptions.map(option => (
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
            name="estado"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Estado del Reparto *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Seleccione un estado" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    {estadoRepartoValues.map(estado => (
                        <SelectItem key={estado} value={estado}>{estado}</SelectItem>
                    ))}
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="id_empresa"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Empresa (Destino/Servicio)</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || undefined} defaultValue={field.value || undefined}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Seleccione una empresa" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    <SelectItem value="null">Ninguna</SelectItem>
                    {empresasOptions.map(option => (
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
            name="id_empresa_despachante"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Empresa Despachante</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || undefined} defaultValue={field.value || undefined}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Seleccione una empresa despachante" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    <SelectItem value="null">Ninguna</SelectItem>
                    {empresasOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <FormField
          control={form.control}
          name="tipo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo (Ej: NORMAL, URGENTE)</FormLabel>
              <FormControl>
                <Input placeholder="Información adicional del tipo" {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : (initialData?.id ? "Guardar Cambios" : "Crear Reparto")}
          </Button>
        </div>
      </form>
    </Form>
  );
}

    