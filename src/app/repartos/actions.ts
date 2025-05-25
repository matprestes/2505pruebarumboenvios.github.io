
"use server";

import { createClient } from "@/lib/supabase/server";
import { repartoSchema, repartoLoteSchema } from "@/lib/schemas";
import type { Reparto, SelectOption, Cliente, RepartoLoteFormValues, Empresa } from "@/types";
import { Database } from "@/types";

import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function getTiposRepartoForSelectAction(): Promise<SelectOption[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("tipos_reparto")
    .select("id_tipo_reparto, nombre")
    .eq("activo", true)
    .order("nombre");

  if (error) {
    console.error(
      "Error fetching tipos_reparto for select. Message:", error.message,
      "Code:", error.code,
      "Details:", error.details,
      "Hint:", error.hint,
      "Full error:", JSON.stringify(error, null, 2)
    );
    return [];
  }
  return data.map((tr) => ({ value: tr.id_tipo_reparto, label: tr.nombre }));
}

export async function getClientesByEmpresaAction(id_empresa: string): Promise<Pick<Cliente, 'id' | 'nombre' | 'apellido' | 'direccion_completa'>[]> {
    const supabase = createClient();
    const { data, error } = await supabase
        .from("clientes")
        .select("id, nombre, apellido, direccion_completa")
        .eq("id_empresa", id_empresa)
        .order("apellido")
        .order("nombre");

    if (error) {
        console.error(
            "Error fetching clientes by empresa. Message:", error.message,
            "Code:", error.code,
            "Details:", error.details,
            "Hint:", error.hint,
            "Full error:", JSON.stringify(error, null, 2)
        );
        return [];
    }
    return data || [];
}


export async function getRepartosAction({
  page = 1,
  pageSize = 10,
  query,
}: {
  page?: number;
  pageSize?: number;
  query?: string;
}): Promise<{ data: Reparto[]; count: number }> {
  const supabase = createClient();
  const offset = (page - 1) * pageSize;

  let supabaseQuery = supabase
    .from("repartos")
    .select(`
      id,
      fecha_programada,
      estado,
      tipo,
      created_at,
      tipos_reparto (nombre),
      repartidores (nombre, apellido),
      empresas!repartos_id_empresa_fkey (razon_social),
      empresa_despachante:empresas!repartos_id_empresa_despachante_fkey (razon_social)
    `, { count: "exact" })
    .range(offset, offset + pageSize - 1)
    .order("fecha_programada", { ascending: false })
    .order("created_at", { ascending: false });

  if (query) {
    const orConditions = [
      `estado.ilike.%${query}%`,
      `tipo.ilike.%${query}%`,
      `tipos_reparto.nombre.ilike.%${query}%`,
      `repartidores.nombre.ilike.%${query}%`,
      `repartidores.apellido.ilike.%${query}%`,
      `empresas!repartos_id_empresa_fkey.razon_social.ilike.%${query}%`,
      `empresas!repartos_id_empresa_despachante_fkey.razon_social.ilike.%${query}%`
    ].join(',');
    supabaseQuery = supabaseQuery.or(orConditions);
  }

  const { data, error, count } = await supabaseQuery;

  if (error) {
    console.error(
      "Error fetching repartos. Message:", error.message,
      "Code:", error.code,
      "Details:", error.details,
      "Hint:", error.hint,
      "Full error:", JSON.stringify(error, null, 2)
    );
    return { data: [], count: 0 };
  }
  return { data: data as Reparto[], count: count ?? 0 };
}

export async function getRepartoByIdAction(id: string): Promise<Reparto | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("repartos")
    .select(`
      *,
      tipos_reparto (*),
      repartidores (*),
      empresas!repartos_id_empresa_fkey (*),
      empresa_despachante:empresas!repartos_id_empresa_despachante_fkey (*)
    `)
    .eq("id", id)
    .single();
  if (error) {
    console.error(
      "Error fetching reparto by ID. Message:", error.message,
      "Code:", error.code,
      "Details:", error.details,
      "Hint:", error.hint,
      "Full error:", JSON.stringify(error, null, 2)
    );
    return null;
  }
  return data as Reparto;
}

export async function addRepartoAction(
  values: z.infer<typeof repartoSchema>
): Promise<{ success: boolean; message: string; reparto?: Reparto }> {
  const supabase = createClient();
  const validatedFields = repartoSchema.safeParse(values);

  if (!validatedFields.success) {
    return { success: false, message: "Error de validación." };
  }

  const { error, data } = await supabase
    .from("repartos")
    .insert(validatedFields.data)
    .select()
    .single();

  if (error) {
    console.error(
      "Error adding reparto. Message:", error.message,
      "Code:", error.code,
      "Details:", error.details,
      "Hint:", error.hint,
      "Full error:", JSON.stringify(error, null, 2)
    );
    return { success: false, message: `Error al crear reparto: ${error.message}` };
  }
  revalidatePath("/repartos");
  return { success: true, message: "Reparto creado exitosamente.", reparto: data as Reparto };
}

export async function updateRepartoAction(
  id: string,
  values: z.infer<typeof repartoSchema>
): Promise<{ success: boolean; message: string; reparto?: Reparto }> {
  const supabase = createClient();
  const validatedFields = repartoSchema.safeParse(values);

  if (!validatedFields.success) {
    return { success: false, message: "Error de validación." };
  }

  const { created_at, ...updateData } = validatedFields.data;

  const { error, data } = await supabase
    .from("repartos")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(
      "Error updating reparto. Message:", error.message,
      "Code:", error.code,
      "Details:", error.details,
      "Hint:", error.hint,
      "Full error:", JSON.stringify(error, null, 2)
    );
    return { success: false, message: `Error al actualizar reparto: ${error.message}` };
  }
  revalidatePath("/repartos");
  revalidatePath(`/repartos/${id}`);
  return { success: true, message: "Reparto actualizado exitosamente.", reparto: data as Reparto };
}

export async function deleteRepartoAction(id: string): Promise<{ success: boolean; message: string }> {
  const supabase = createClient();
  const { error } = await supabase.from("repartos").delete().eq("id", id);

  if (error) {
    console.error(
      "Error deleting reparto. Message:", error.message,
      "Code:", error.code,
      "Details:", error.details,
      "Hint:", error.hint,
      "Full error:", JSON.stringify(error, null, 2)
    );
    return { success: false, message: `Error al eliminar reparto: ${error.message}` };
  }
  revalidatePath("/repartos");
  return { success: true, message: "Reparto eliminado exitosamente." };
}

export async function addRepartosLoteAction(
  values: RepartoLoteFormValues
): Promise<{ success: boolean; message: string; repartosCreados?: number, enviosCreados?: number, paradasCreadas?: number }> {
  const supabase = createClient();
  const validatedFields = repartoLoteSchema.safeParse(values);

  if (!validatedFields.success) {
    console.error("Validation errors in batch repartos:", validatedFields.error.flatten().fieldErrors);
    return { success: false, message: "Error de validación en los datos del lote." };
  }

  const {
    id_tipo_reparto,
    id_empresa, // Empresa de los clientes
    id_empresa_despachante, // Empresa origen/recolección
    fecha_programada,
    id_repartidor,
    clientes_config,
    id_tipo_envio_default,
    id_tipo_paquete_default,
  } = validatedFields.data;

  // Paso 1: Crear el Reparto principal (el lote)
  const repartoInsertData: Database['public']['Tables']['repartos']['Insert'] = {
    id_tipo_reparto,
    id_repartidor: id_repartidor || null,
    id_empresa,
    id_empresa_despachante: id_empresa_despachante || null,
    fecha_programada,
    estado: id_repartidor ? 'ASIGNADO' : 'PENDIENTE',
    tipo: 'LOTE',
  };

  const { data: newReparto, error: repartoError } = await supabase
    .from("repartos")
    .insert(repartoInsertData)
    .select()
    .single();

  if (repartoError || !newReparto) {
    console.error("Error creating main batch reparto. Message:", repartoError?.message, "Full error:", JSON.stringify(repartoError, null, 2));
    return { success: false, message: `Error al crear el reparto principal del lote: ${repartoError?.message}` };
  }

  let enviosCreados = 0;
  let paradasCreadas = 0;
  let direccionDespachante: string | null = null;

  if (id_empresa_despachante) {
    const { data: empresaDespachanteData, error: empresaDespachanteError } = await supabase
      .from('empresas')
      .select('direccion_fiscal')
      .eq('id', id_empresa_despachante)
      .single();
    if (empresaDespachanteError) {
      console.warn("Could not fetch dispatching company address. Message:", empresaDespachanteError.message);
    } else {
      direccionDespachante = empresaDespachanteData?.direccion_fiscal || null;
    }
  }

  // Paso 2: Iterar sobre clientes_config
  for (const config of clientes_config) {
    if (config.seleccionado && config.id_tipo_servicio && config.precio_servicio_final && config.direccion_completa) {
      // Paso 2a: Crear el Envio
      const envioInsertData: Database['public']['Tables']['envios']['Insert'] = {
        id_cliente: config.cliente_id,
        id_reparto: newReparto.id,
        id_tipo_envio: id_tipo_envio_default,
        id_tipo_paquete: id_tipo_paquete_default,
        id_tipo_servicio: config.id_tipo_servicio,
        direccion_destino: config.direccion_completa,
        fecha_solicitud: fecha_programada,
        estado: 'ASIGNADO_REPARTO',
        precio_servicio_final: config.precio_servicio_final,
        // Otros campos de envio como peso, dimensiones_cm podrían tomarse de tipos_paquete o ser null. Por ahora, null.
      };

      const { data: newEnvio, error: envioError } = await supabase
        .from("envios")
        .insert(envioInsertData)
        .select("id")
        .single();

      if (envioError || !newEnvio) {
        console.error(`Error creating envio for client ${config.cliente_id}. Message:`, envioError?.message, "Full error:", JSON.stringify(envioError, null, 2));
        continue; // Skip to next client if envio creation fails
      }
      enviosCreados++;

      let ordenParada = 1;
      // Paso 2b: Crear ParadaReparto para RECOLECCION (si aplica)
      if (direccionDespachante) {
        const paradaRecoleccionData: Database['public']['Tables']['paradas_reparto']['Insert'] = {
          id_reparto: newReparto.id,
          id_envio: newEnvio.id,
          orden: ordenParada++,
          direccion_parada: direccionDespachante,
          tipo_parada: 'RECOLECCION',
          estado_parada: 'PENDIENTE',
        };
        const { error: paradaRecError } = await supabase.from("paradas_reparto").insert(paradaRecoleccionData);
        if (paradaRecError) console.error(`Error creating RECOLECCION parada for envio ${newEnvio.id}. Message:`, paradaRecError.message, "Full error:", JSON.stringify(paradaRecError, null, 2));
        else paradasCreadas++;
      }

      // Paso 2c: Crear ParadaReparto para ENTREGA
      const paradaEntregaData: Database['public']['Tables']['paradas_reparto']['Insert'] = {
        id_reparto: newReparto.id,
        id_envio: newEnvio.id,
        orden: ordenParada,
        direccion_parada: config.direccion_completa,
        tipo_parada: 'ENTREGA',
        estado_parada: 'PENDIENTE',
      };
      const { error: paradaEntError } = await supabase.from("paradas_reparto").insert(paradaEntregaData);
      if (paradaEntError) console.error(`Error creating ENTREGA parada for envio ${newEnvio.id}. Message:`, paradaEntError.message, "Full error:", JSON.stringify(paradaEntError, null, 2));
      else paradasCreadas++;
    }
  }

  revalidatePath("/repartos");
  return {
    success: true,
    message: `Reparto por lote creado. Repartos: 1. Envíos: ${enviosCreados}. Paradas: ${paradasCreadas}.`,
    repartosCreados: 1,
    enviosCreados,
    paradasCreadas,
  };
}


export async function getRepartidoresForSelectAction(): Promise<SelectOption[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("repartidores")
    .select("id, nombre, apellido")
    .eq("activo", true)
    .order("apellido")
    .order("nombre");

  if (error) {
    console.error(
        "Error fetching repartidores for select. Message:", error.message,
        "Code:", error.code,
        "Details:", error.details,
        "Hint:", error.hint,
        "Full error:", JSON.stringify(error, null, 2)
    );
    return [];
  }
  return data.map((r) => ({ value: r.id, label: `${r.apellido}, ${r.nombre}` }));
}


export async function getEmpresasForSelectAction(): Promise<SelectOption[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("empresas")
    .select("id, razon_social")
    .order("razon_social");

  if (error) {
     console.error(
        "Error fetching empresas for select. Message:", error.message,
        "Code:", error.code,
        "Details:", error.details,
        "Hint:", error.hint,
        "Full error:", JSON.stringify(error, null, 2)
    );
    return [];
  }
  return data.map((e) => ({ value: e.id, label: e.razon_social }));
}

    