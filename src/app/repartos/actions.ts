
"use server";

import { createClient } from "@/lib/supabase/server";
import { repartoSchema, repartoLoteSchema } from "@/lib/schemas";
import type { Reparto, SelectOption, Cliente } from "@/types";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getRepartidoresForSelectAction } from "@/app/repartidores/actions"; // Assumed to exist and be correct
import { getEmpresasForSelectAction } from "@/app/empresas/actions"; // Assumed to exist and be correct

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

export async function getClientesByEmpresaForSelectAction(id_empresa: string): Promise<SelectOption[]> {
    const supabase = createClient();
    const { data, error } = await supabase
        .from("clientes")
        .select("id, nombre, apellido")
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
    return data.map(c => ({ value: c.id, label: `${c.apellido || ''}${c.apellido && c.nombre ? ', ' : ''}${c.nombre}`.trim() }));
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
  // created_at should not be updated
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
  values: z.infer<typeof repartoLoteSchema>
): Promise<{ success: boolean; message: string; repartosCreados?: number }> {
  const supabase = createClient();
  const validatedFields = repartoLoteSchema.safeParse(values);

  if (!validatedFields.success) {
    return { success: false, message: "Error de validación en los datos del lote." };
  }

  const { id_tipo_reparto, id_empresa, fecha_programada, id_repartidor, cliente_ids } = validatedFields.data;

  let clientesParaReparto: Pick<Cliente, 'id'>[] = [];

  if (cliente_ids && cliente_ids.length > 0) {
    const { data, error } = await supabase
      .from("clientes")
      .select("id")
      .in("id", cliente_ids)
      .eq("id_empresa", id_empresa); // Ensure selected clients belong to the specified empresa
    if (error) {
      console.error("Error fetching selected clients for batch:", error);
      return { success: false, message: "Error al obtener clientes seleccionados para el lote." };
    }
    clientesParaReparto = data || [];
  } else {
    const { data, error } = await supabase
      .from("clientes")
      .select("id")
      .eq("id_empresa", id_empresa);
    if (error) {
      console.error("Error fetching all clients for empresa for batch:", error);
      return { success: false, message: "Error al obtener todos los clientes de la empresa para el lote." };
    }
    clientesParaReparto = data || [];
  }

  if (clientesParaReparto.length === 0) {
    return { success: false, message: "No se encontraron clientes para esta empresa o selección." };
  }

  const repartosToInsert = clientesParaReparto.map(cliente => ({
    id_tipo_reparto,
    id_empresa, // The company for whom the deliveries are made
    fecha_programada,
    id_repartidor: id_repartidor || null,
    estado: 'PENDIENTE',
    tipo: 'LOTE', // Marking these as batch deliveries
    // Note: We are not setting id_empresa_despachante here, assuming it's not relevant for batch client deliveries or will be handled differently.
    // Also, we are not linking specific 'envios' here, as a 'reparto' is a collection of potential 'envios'.
  }));

  const { data: newRepartos, error: insertError } = await supabase
    .from("repartos")
    .insert(repartosToInsert)
    .select();

  if (insertError) {
    console.error(
      "Error adding batch repartos. Message:", insertError.message,
      "Code:", insertError.code,
      "Details:", insertError.details,
      "Hint:", insertError.hint,
      "Full error:", JSON.stringify(insertError, null, 2)
    );
    return { success: false, message: `Error al crear repartos por lote: ${insertError.message}` };
  }

  revalidatePath("/repartos");
  return { success: true, message: `Se crearon ${newRepartos?.length || 0} repartos exitosamente.`, repartosCreados: newRepartos?.length || 0 };
}

    