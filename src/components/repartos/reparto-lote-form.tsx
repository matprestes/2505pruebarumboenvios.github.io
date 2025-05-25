
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray, Controller } from "react-hook-form";
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
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Search } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { es } from 'date-fns/locale';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { repartoLoteSchema } from "@/lib/schemas";
import type { RepartoLoteFormValues, SelectOption, ClienteServicioConfig, Cliente } from "@/types";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface RepartoLoteFormProps {
  onSubmit: (values: RepartoLoteFormValues) => void;
  onCancel: () => void;
  tiposRepartoOptions: SelectOption[];
  repartidoresOptions: SelectOption[];
  empresasOptions: SelectOption[];
  tiposEnvioOptions: SelectOption[];
  tiposPaqueteOptions: SelectOption[];
  tiposServicioOptions: SelectOption[];
  getClientesByEmpresaAction: (empresaId: string) => Promise<Pick<Cliente, 'id' | 'nombre' | 'apellido' | 'direccion_completa'>[]>;
  isSubmitting: boolean;
}

export function RepartoLoteForm({
  onSubmit,
  onCancel,
  tiposRepartoOptions,
  repartidoresOptions,
  empresasOptions,
  tiposEnvioOptions,
  tiposPaqueteOptions,
  tiposServicioOptions,
  getClientesByEmpresaAction,
  isSubmitting,
}: RepartoLoteFormProps) {
  const { toast } = useToast();
  const form = useForm<RepartoLoteFormValues>({
    resolver: zodResolver(repartoLoteSchema),
    defaultValues: {
      id_tipo_reparto: "",
      id_empresa: "",
      id_empresa_despachante: null,
      fecha_programada: format(new Date(), "yyyy-MM-dd"),
      id_repartidor: null,
      clientes_config: [],
      id_tipo_envio_default: "",
      id_tipo_paquete_default: "",
    },
  });

  const { fields, replace } = useFieldArray({
    control: form.control,
    name: "clientes_config",
  });

  const [clienteSearchTerm, setClienteSearchTerm] = useState("");
  const [loadingClientes, setLoadingClientes] = useState(false);

  const selectedEmpresaId = form.watch("id_empresa");

  useEffect(() => {
    if (selectedEmpresaId) {
      setLoadingClientes(true);
      getClientesByEmpresaAction(selectedEmpresaId)
        .then(clientes => {
          const initialConfig: ClienteServicioConfig[] = clientes.map(c => ({
            cliente_id: c.id,
            nombre_completo: `${c.nombre || ''} ${c.apellido || ''}`.trim(),
            direccion_completa: c.direccion_completa,
            seleccionado: false,
            id_tipo_servicio: null,
            precio_servicio_final: null,
          }));
          replace(initialConfig);
        })
        .catch(err => {
          toast({ title: "Error", description: "No se pudieron cargar los clientes de la empresa.", variant: "destructive" });
          console.error("Error fetching clients for company:", err);
          replace([]);
        })
        .finally(() => setLoadingClientes(false));
    } else {
      replace([]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEmpresaId, getClientesByEmpresaAction, replace]);

  const filteredClientesConfig = React.useMemo(() => {
    const currentConfigs = form.getValues("clientes_config");
    if (!clienteSearchTerm) {
      return currentConfigs;
    }
    return currentConfigs.filter(c =>
      c.nombre_completo.toLowerCase().includes(clienteSearchTerm.toLowerCase())
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clienteSearchTerm, fields, form.watch("clientes_config")]); 

  const handleSelectAllFilteredClientes = (checked: boolean) => {
    const currentConfigs = form.getValues("clientes_config");
    const updatedConfigs = currentConfigs.map(config => {
       if (filteredClientesConfig.some(fc => fc.cliente_id === config.cliente_id)) {
         return { ...config, seleccionado: checked };
       }
       return config;
    });
    replace(updatedConfigs);
 };

  const allFilteredSelected = filteredClientesConfig.length > 0 && filteredClientesConfig.every(c => c.seleccionado);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[80vh] overflow-y-auto p-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField control={form.control} name="id_tipo_reparto" render={({ field }) => (
              <FormItem><FormLabel>Tipo de Reparto *</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Seleccione tipo de reparto" /></SelectTrigger></FormControl><SelectContent>{tiposRepartoOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
          )}/>
          <FormField control={form.control} name="fecha_programada" render={({ field }) => (
              <FormItem className="flex flex-col"><FormLabel>Fecha Programada *</FormLabel><Popover><PopoverTrigger asChild><FormControl>
                  <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                  {field.value ? format(new Date(field.value + 'T00:00:00'), "PPP", { locale: es }) : <span>Seleccione fecha</span>}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value ? new Date(field.value + 'T00:00:00') : undefined} onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")} initialFocus /></PopoverContent>
              </Popover><FormMessage /></FormItem>
          )}/>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={form.control} name="id_empresa" render={({ field }) => (
                <FormItem><FormLabel>Empresa de los Clientes *</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Seleccione empresa" /></SelectTrigger></FormControl><SelectContent>{empresasOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent></Select><FormDescription>Empresa a la que pertenecen los clientes para este lote.</FormDescription><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="id_empresa_despachante" render={({ field }) => (
                <FormItem><FormLabel>Empresa Despachante (Origen)</FormLabel><Select onValueChange={field.onChange} value={field.value || undefined} defaultValue={field.value || undefined}><FormControl><SelectTrigger><SelectValue placeholder="Seleccione empresa (opcional)" /></SelectTrigger></FormControl><SelectContent><SelectItem value="null">Ninguna / Origen propio</SelectItem>{empresasOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent></Select><FormDescription>Empresa desde donde se recolectarán los paquetes.</FormDescription><FormMessage /></FormItem>
            )}/>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={form.control} name="id_tipo_envio_default" render={({ field }) => (
                <FormItem><FormLabel>Tipo de Envío por Defecto *</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Seleccione tipo de envío" /></SelectTrigger></FormControl><SelectContent>{tiposEnvioOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="id_tipo_paquete_default" render={({ field }) => (
                <FormItem><FormLabel>Tipo de Paquete por Defecto *</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Seleccione tipo de paquete" /></SelectTrigger></FormControl><SelectContent>{tiposPaqueteOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
            )}/>
        </div>

        {selectedEmpresaId && (
          <div>
            <FormLabel className="text-base">Clientes y Configuración de Servicio</FormLabel>
            <FormDescription>Seleccione clientes y configure el servicio para cada uno.</FormDescription>
            <div className="my-2 flex items-center gap-2">
              <div className="relative flex-grow">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Buscar cliente..." className="pl-8" value={clienteSearchTerm} onChange={(e) => setClienteSearchTerm(e.target.value)} />
              </div>
              {filteredClientesConfig.length > 0 && (
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="selectAllClientesLote"
                        checked={allFilteredSelected}
                        onCheckedChange={(checked) => handleSelectAllFilteredClientes(Boolean(checked))}
                        disabled={loadingClientes}
                    />
                    <label htmlFor="selectAllClientesLote" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Sel. todos ({filteredClientesConfig.filter(c => c.seleccionado).length}/{filteredClientesConfig.length})
                    </label>
                </div>
              )}
            </div>
            {loadingClientes && <p className="text-sm text-muted-foreground">Cargando clientes...</p>}
            {!loadingClientes && fields.length === 0 && selectedEmpresaId && (
                <p className="text-sm text-muted-foreground py-2">No hay clientes para la empresa seleccionada.</p>
            )}

            <ScrollArea className={cn("h-64 w-full rounded-md border p-2 mt-2", filteredClientesConfig.length === 0 && "hidden")}>
              {fields.map((fieldItem, index) => {
                const clientOriginalIndex = form.getValues("clientes_config").findIndex(c => c.cliente_id === fieldItem.cliente_id);
                 if (!filteredClientesConfig.find(fc => fc.cliente_id === fieldItem.cliente_id)) return null;

                return (
                <div key={fieldItem.id} className="mb-3 rounded-md border p-3 space-y-3">
                  <FormField control={form.control} name={`clientes_config.${clientOriginalIndex}.seleccionado`} render={({ field: checkboxField }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0"><FormControl>
                          <Checkbox checked={checkboxField.value} onCheckedChange={checkboxField.onChange}/>
                      </FormControl><FormLabel className="text-sm font-normal">{fieldItem.nombre_completo} <br/><span className="text-xs text-muted-foreground">{fieldItem.direccion_completa || 'Sin dirección'}</span></FormLabel></FormItem>
                  )}/>
                  {form.watch(`clientes_config.${clientOriginalIndex}.seleccionado`) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-8">
                      <FormField control={form.control} name={`clientes_config.${clientOriginalIndex}.id_tipo_servicio`} render={({ field: selectField }) => (
                          <FormItem><FormLabel className="text-xs">Tipo Servicio *</FormLabel><Select onValueChange={selectField.onChange} value={selectField.value || ""} defaultValue={selectField.value || ""}><FormControl><SelectTrigger><SelectValue placeholder="Servicio" /></SelectTrigger></FormControl><SelectContent>{tiposServicioOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                      )}/>
                      <FormField control={form.control} name={`clientes_config.${clientOriginalIndex}.precio_servicio_final`} render={({ field: inputField }) => (
                          <FormItem><FormLabel className="text-xs">Precio Final *</FormLabel><FormControl><Input type="number" placeholder="0.00" {...inputField} value={inputField.value ?? ""} onChange={e => inputField.onChange(parseFloat(e.target.value))} /></FormControl><FormMessage /></FormItem>
                      )}/>
                    </div>
                  )}
                </div>
              )})}
            </ScrollArea>
             <FormMessage>{form.formState.errors.clientes_config?.message || form.formState.errors.clientes_config?.root?.message}</FormMessage>
          </div>
        )}

        <FormField control={form.control} name="id_repartidor" render={({ field }) => (
            <FormItem><FormLabel>Repartidor Asignado (Opcional)</FormLabel><Select onValueChange={field.onChange} value={field.value || undefined} defaultValue={field.value || undefined}><FormControl><SelectTrigger><SelectValue placeholder="Seleccionar repartidor" /></SelectTrigger></FormControl><SelectContent><SelectItem value="null">Sin asignar</SelectItem>{repartidoresOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent></Select><FormDescription>Si no se selecciona, el reparto quedará pendiente de asignación.</FormDescription><FormMessage /></FormItem>
        )}/>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>Cancelar</Button>
          <Button type="submit" disabled={isSubmitting || !selectedEmpresaId || loadingClientes || filteredClientesConfig.filter(c => c.seleccionado).length === 0}>
            {isSubmitting ? "Creando Lote..." : "Crear Repartos por Lote"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
    