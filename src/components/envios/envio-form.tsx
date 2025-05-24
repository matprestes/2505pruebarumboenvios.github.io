
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { es } from 'date-fns/locale';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { envioSchema } from "@/lib/schemas";
import type { Envio, SelectOption, EstadoEnvio } from "@/types";
import { estadoEnvioValues } from "@/types";
import { cn } from "@/lib/utils";

interface EnvioFormProps {
  onSubmit: (values: z.infer<typeof envioSchema>) => void;
  initialData?: Partial<Envio> | null;
  onCancel: () => void;
  clientesOptions: SelectOption[];
  tiposEnvioOptions: SelectOption[];
  tiposPaqueteOptions: SelectOption[];
  tiposServicioOptions: SelectOption[];
  repartosOptions: SelectOption[];
  repartidoresOptions: SelectOption[];
  empresasClienteOptions: SelectOption[];
  isSubmitting: boolean;
}

export function EnvioForm({
  onSubmit,
  initialData,
  onCancel,
  clientesOptions,
  tiposEnvioOptions,
  tiposPaqueteOptions,
  tiposServicioOptions,
  repartosOptions,
  repartidoresOptions,
  empresasClienteOptions,
  isSubmitting,
}: EnvioFormProps) {
  const form = useForm<z.infer<typeof envioSchema>>({
    resolver: zodResolver(envioSchema),
    defaultValues: initialData ? {
      ...initialData,
      fecha_solicitud: initialData.fecha_solicitud ? format(new Date(initialData.fecha_solicitud + 'T00:00:00'), "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
      peso: initialData.peso ?? undefined,
      precio_total: initialData.precio_total ?? undefined,
      precio_calculado: initialData.precio_calculado ?? undefined,
      distancia_km: initialData.distancia_km ?? undefined,
      precio_servicio_final: initialData.precio_servicio_final ?? undefined,
      suggested_options: initialData.suggested_options ? JSON.stringify(initialData.suggested_options, null, 2) : "",
    } : {
      id_cliente: "",
      id_tipo_envio: "",
      id_tipo_paquete: "",
      id_tipo_servicio: "",
      direccion_destino: "",
      fecha_solicitud: format(new Date(), "yyyy-MM-dd"),
      estado: "PENDIENTE",
      id_reparto: null,
      id_repartidor_preferido: null,
      id_empresa_cliente: null,
      direccion_origen: "",
      latitud_origen: undefined,
      longitud_origen: undefined,
      latitud_destino: undefined,
      longitud_destino: undefined,
      client_location: "",
      peso: undefined,
      dimensiones_cm: "",
      precio_total: undefined,
      precio_calculado: undefined,
      distancia_km: undefined,
      notas: "",
      suggested_options: "",
      reasoning: "",
      precio_servicio_final: undefined,
    },
  });

  const handleSubmit = (values: z.infer<typeof envioSchema>) => {
    const processedValues = {
        ...values,
        suggested_options: values.suggested_options ? JSON.parse(values.suggested_options as string) : null,
    };
    onSubmit(processedValues);
  };


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 max-h-[70vh] overflow-y-auto p-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="id_cliente"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cliente</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Seleccione un cliente" /></SelectTrigger></FormControl>
                  <SelectContent>{clientesOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                </Select><FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="id_tipo_envio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Envío</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Seleccione un tipo de envío" /></SelectTrigger></FormControl>
                  <SelectContent>{tiposEnvioOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                </Select><FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="id_tipo_paquete"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Paquete</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Seleccione un tipo de paquete" /></SelectTrigger></FormControl>
                  <SelectContent>{tiposPaqueteOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                </Select><FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="id_tipo_servicio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Servicio</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Seleccione un tipo de servicio" /></SelectTrigger></FormControl>
                  <SelectContent>{tiposServicioOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                </Select><FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
            control={form.control}
            name="client_location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ubicación del Cliente (para geocodificación)</FormLabel>
                <FormControl><Input placeholder="Ej: Av. Corrientes 1234, CABA" {...field} value={field.value ?? ""} /></FormControl>
                <FormDescription>Ingrese la dirección completa. La latitud/longitud se completarán si la geocodificación está implementada.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <FormField
            control={form.control}
            name="direccion_origen"
            render={({ field }) => ( <FormItem><FormLabel>Dirección Origen (Opcional)</FormLabel><FormControl><Input placeholder="Dirección de origen" {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem> )}
          />
           <FormField
            control={form.control}
            name="direccion_destino"
            render={({ field }) => ( <FormItem><FormLabel>Dirección Destino</FormLabel><FormControl><Input placeholder="Dirección de destino" {...field} /></FormControl><FormMessage /></FormItem> )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField control={form.control} name="peso" render={({ field }) => ( <FormItem><FormLabel>Peso (kg) (Opcional)</FormLabel><FormControl><Input type="number" placeholder="0.0" {...field} value={field.value ?? ""} onChange={e => field.onChange(parseFloat(e.target.value))} /></FormControl><FormMessage /></FormItem> )} />
            <FormField control={form.control} name="dimensiones_cm" render={({ field }) => ( <FormItem><FormLabel>Dimensiones (cm) (Opcional)</FormLabel><FormControl><Input placeholder="Ej: 20x30x10" {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem> )} />
            <FormField
                control={form.control}
                name="fecha_solicitud"
                render={({ field }) => (
                    <FormItem className="flex flex-col"><FormLabel>Fecha de Solicitud</FormLabel>
                    <Popover><PopoverTrigger asChild><FormControl>
                        <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal",!field.value && "text-muted-foreground")}>
                        {field.value ? format(new Date(field.value + 'T00:00:00'), "PPP", { locale: es }) : <span>Seleccione una fecha</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button></FormControl></PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={field.value ? new Date(field.value + 'T00:00:00') : undefined} onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")} initialFocus />
                        </PopoverContent></Popover><FormMessage />
                    </FormItem>
                )}
            />
        </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField control={form.control} name="estado" render={({ field }) => (
                <FormItem><FormLabel>Estado</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Seleccione un estado" /></SelectTrigger></FormControl>
                    <SelectContent>{estadoEnvioValues.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="id_reparto" render={({ field }) => (
                <FormItem><FormLabel>Reparto Asignado (Opcional)</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || undefined} defaultValue={field.value || undefined}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Seleccione un reparto" /></SelectTrigger></FormControl>
                    <SelectContent><SelectItem value="null">Sin asignar</SelectItem>{repartosOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                </Select><FormMessage /></FormItem>
            )} />
        </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField control={form.control} name="id_repartidor_preferido" render={({ field }) => (
                <FormItem><FormLabel>Repartidor Preferido (Opcional)</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || undefined} defaultValue={field.value || undefined}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Seleccione un repartidor" /></SelectTrigger></FormControl>
                    <SelectContent><SelectItem value="null">Ninguno</SelectItem>{repartidoresOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                </Select><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="id_empresa_cliente" render={({ field }) => (
                <FormItem><FormLabel>Empresa del Cliente (Opcional)</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || undefined} defaultValue={field.value || undefined}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Seleccione una empresa" /></SelectTrigger></FormControl>
                    <SelectContent><SelectItem value="null">Ninguna</SelectItem>{empresasClienteOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                </Select><FormMessage /></FormItem>
            )} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FormField control={form.control} name="precio_calculado" render={({ field }) => ( <FormItem><FormLabel>Precio Calculado (Opc.)</FormLabel><FormControl><Input type="number" placeholder="0.00" {...field} value={field.value ?? ""} onChange={e => field.onChange(parseFloat(e.target.value))} /></FormControl><FormMessage /></FormItem> )}/>
            <FormField control={form.control} name="distancia_km" render={({ field }) => ( <FormItem><FormLabel>Distancia KM (Opc.)</FormLabel><FormControl><Input type="number" placeholder="0.0" {...field} value={field.value ?? ""} onChange={e => field.onChange(parseFloat(e.target.value))} /></FormControl><FormMessage /></FormItem> )}/>
            <FormField control={form.control} name="precio_servicio_final" render={({ field }) => ( <FormItem><FormLabel>Precio Final (Opc.)</FormLabel><FormControl><Input type="number" placeholder="0.00" {...field} value={field.value ?? ""} onChange={e => field.onChange(parseFloat(e.target.value))} /></FormControl><FormMessage /></FormItem> )}/>
            <FormField control={form.control} name="precio_total" render={({ field }) => ( <FormItem><FormLabel>Precio Total (Opc.)</FormLabel><FormControl><Input type="number" placeholder="0.00" {...field} value={field.value ?? ""} onChange={e => field.onChange(parseFloat(e.target.value))} /></FormControl><FormMessage /></FormItem> )}/>
        </div>
        <FormField control={form.control} name="notas" render={({ field }) => ( <FormItem><FormLabel>Notas (Opcional)</FormLabel><FormControl><Textarea placeholder="Notas adicionales sobre el envío" {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem> )}/>
        <FormField control={form.control} name="suggested_options" render={({ field }) => ( <FormItem><FormLabel>Opciones Sugeridas (JSON) (Opcional)</FormLabel><FormControl><Textarea placeholder='{ "opcion1": "valor1" }' {...field} value={field.value ? String(field.value) : ""} className="font-mono min-h-[80px]" /></FormControl><FormMessage /></FormItem> )}/>
        <FormField control={form.control} name="reasoning" render={({ field }) => ( <FormItem><FormLabel>Razonamiento IA (Opcional)</FormLabel><FormControl><Textarea placeholder="Explicación de la IA..." {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem> )}/>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>Cancelar</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : (initialData?.id ? "Guardar Cambios" : "Crear Envío")}
          </Button>
        </div>
      </form>
    </Form>
  );
}

    