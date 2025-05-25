
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import type * as z from "zod";
import React, { useState, useEffect } from "react";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { es } from 'date-fns/locale';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { repartoLoteSchema } from "@/lib/schemas";
import type { RepartoLoteFormValues, SelectOption } from "@/types";
import { cn } from "@/lib/utils";

interface RepartoLoteFormProps {
  onSubmit: (values: RepartoLoteFormValues) => void;
  onCancel: () => void;
  tiposRepartoOptions: SelectOption[];
  repartidoresOptions: SelectOption[];
  empresasOptions: SelectOption[];
  getClientesByEmpresaAction: (empresaId: string) => Promise<SelectOption[]>;
  isSubmitting: boolean;
}

export function RepartoLoteForm({
  onSubmit,
  onCancel,
  tiposRepartoOptions,
  repartidoresOptions,
  empresasOptions,
  getClientesByEmpresaAction,
  isSubmitting,
}: RepartoLoteFormProps) {
  const form = useForm<RepartoLoteFormValues>({
    resolver: zodResolver(repartoLoteSchema),
    defaultValues: {
      id_tipo_reparto: "",
      id_empresa: "",
      fecha_programada: format(new Date(), "yyyy-MM-dd"),
      id_repartidor: null,
      cliente_ids: [],
    },
  });

  const [clientesDeEmpresaOptions, setClientesDeEmpresaOptions] = useState<SelectOption[]>([]);
  const selectedEmpresaId = form.watch("id_empresa");

  useEffect(() => {
    if (selectedEmpresaId) {
      getClientesByEmpresaAction(selectedEmpresaId).then(setClientesDeEmpresaOptions);
    } else {
      setClientesDeEmpresaOptions([]);
    }
    // Reset selected clients when empresa changes
    form.setValue("cliente_ids", []);
  }, [selectedEmpresaId, getClientesByEmpresaAction, form]);

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
                        <FormControl><SelectTrigger><SelectValue placeholder="Seleccione un tipo" /></SelectTrigger></FormControl>
                        <SelectContent>{tiposRepartoOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                    </Select><FormMessage />
                    </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="fecha_programada"
                render={({ field }) => (
                    <FormItem className="flex flex-col">
                        <FormLabel>Fecha Programada *</FormLabel>
                        <Popover><PopoverTrigger asChild><FormControl>
                            <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                            {field.value ? format(new Date(field.value + 'T00:00:00'), "PPP", { locale: es }) : <span>Seleccione una fecha</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button></FormControl></PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={field.value ? new Date(field.value + 'T00:00:00') : undefined} onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")} initialFocus />
                            </PopoverContent>
                        </Popover><FormMessage />
                    </FormItem>
                )}
            />
        </div>

        <FormField
            control={form.control}
            name="id_empresa"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Empresa para Clientes *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Seleccione una empresa" /></SelectTrigger></FormControl>
                    <SelectContent>{empresasOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                </Select>
                <FormDescription>Seleccione la empresa de la cual se tomarán los clientes para el lote.</FormDescription>
                <FormMessage />
                </FormItem>
            )}
        />

        {selectedEmpresaId && clientesDeEmpresaOptions.length > 0 && (
          <FormField
            control={form.control}
            name="cliente_ids"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base">Clientes de {empresasOptions.find(e => e.value === selectedEmpresaId)?.label || 'la empresa seleccionada'}</FormLabel>
                  <FormDescription>
                    Seleccione los clientes para incluir en el lote. Si no selecciona ninguno, se incluirán todos.
                  </FormDescription>
                </div>
                <ScrollArea className="h-40 w-full rounded-md border p-2">
                  {clientesDeEmpresaOptions.map((cliente) => (
                    <FormField
                      key={cliente.value}
                      control={form.control}
                      name="cliente_ids"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={cliente.value}
                            className="flex flex-row items-start space-x-3 space-y-0 py-1"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(cliente.value)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...(field.value || []), cliente.value])
                                    : field.onChange(
                                        (field.value || []).filter(
                                          (value) => value !== cliente.value
                                        )
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              {cliente.label}
                            </FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                </ScrollArea>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {selectedEmpresaId && clientesDeEmpresaOptions.length === 0 && (
            <p className="text-sm text-muted-foreground">No hay clientes para la empresa seleccionada o aún no se han cargado.</p>
        )}


        <FormField
            control={form.control}
            name="id_repartidor"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Repartidor (Opcional)</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || undefined} defaultValue={field.value || undefined}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Asignar un repartidor (opcional)" /></SelectTrigger></FormControl>
                    <SelectContent>
                        <SelectItem value="null">Sin asignar (se asignará disponible)</SelectItem>
                        {repartidoresOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                    </SelectContent>
                </Select>
                <FormDescription>Si no se selecciona, se intentará asignar un repartidor disponible (lógica futura).</FormDescription>
                <FormMessage />
                </FormItem>
            )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting || !selectedEmpresaId}>
            {isSubmitting ? "Creando Lote..." : "Crear Repartos por Lote"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

    