
"use server";

import { createClient } from "@/lib/supabase/server";
import { envioSchema } from "@/lib/schemas";
import type { Envio, SelectOption } from "@/types";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Helper actions to get data for select fields
export async function getClientesForSelectAction(): Promise<SelectOption[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("clientes")
    .select("id, nombre, apellido")
    .order("apellido")
    .order("nombre");
  if (error) { 
    console.error(
        "Error fetching clientes for select. Message:", error.message,
        "Code:", error.code,
        "Details:", error.details,
        "Hint:", error.hint,
        "Full error:", JSON.stringify(error, null, 2)
    ); 
    return []; 
  }
  return data.map(c => ({ value: c.id, label: `${c.apellido || ''}, ${c.nombre}`.trimStart().replace(/^, /, '') }));
}

export async function getTiposEnvioForSelectAction(): Promise<SelectOption[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("tipos_envio")
    .select("id_tipo_envio, nombre")
    .eq("activo", true)
    .order("nombre");
  if (error) { 
    console.error(
        "Error fetching tipos_envio for select. Message:", error.message,
        "Code:", error.code,
        "Details:", error.details,
        "Hint:", error.hint,
        "Full error:", JSON.stringify(error, null, 2)
    ); 
    return []; 
  }
  return data.map(te => ({ value: te.id_tipo_envio, label: te.nombre }));
}

export async function getTiposPaqueteForSelectAction(): Promise<SelectOption[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("tipos_paquete")
    .select("id_tipo_paquete, nombre")
    .eq("activo", true)
    .order("nombre");
  if (error) { 
    console.error(
        "Error fetching tipos_paquete for select. Message:", error.message,
        "Code:", error.code,
        "Details:", error.details,
        "Hint:", error.hint,
        "Full error:", JSON.stringify(error, null, 2)
    ); 
    return []; 
  }
  return data.map(tp => ({ value: tp.id_tipo_paquete, label: tp.nombre }));
}

export async function getTiposServicioForSelectAction(): Promise<SelectOption[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("tipos_servicio")
    .select("id_tipo_servicio, nombre")
    .order("nombre");
  if (error) { 
    console.error(
        "Error fetching tipos_servicio for select. Message:", error.message,
        "Code:", error.code,
        "Details:", error.details,
        "Hint:", error.hint,
        "Full error:", JSON.stringify(error, null, 2)
    ); 
    return []; 
  }
  return data.map(ts => ({ value: ts.id_tipo_servicio, label: ts.nombre }));
}

export async function getRepartosForSelectAction(): Promise<SelectOption[]> {
  const supabase = createClient();
  // Simplified: Consider filtering by date or status
  const { data, error } = await supabase
    .from("repartos")
    .select("id, fecha_programada, estado")
    .order("fecha_programada", { ascending: false });
  if (error) { 
    console.error(
        "Error fetching repartos for select. Message:", error.message,
        "Code:", error.code,
        "Details:", error.details,
        "Hint:", error.hint,
        "Full error:", JSON.stringify(error, null, 2)
    ); 
    return []; 
  }
  return data.map(r => ({ value: r.id, label: `ID: ${r.id.substring(0,8)} (${r.fecha_programada}) - ${r.estado}` }));
}

export async function getEmpresasClienteForSelectAction(): Promise<SelectOption[]> {
   const supabase = createClient();
   const { data, error } = await supabase
    .from("empresas")
    .select("id, razon_social")
    .order("razon_social");
  if (error) { 
    console.error(
        "Error fetching empresas for select (cliente context). Message:", error.message,
        "Code:", error.code,
        "Details:", error.details,
        "Hint:", error.hint,
        "Full error:", JSON.stringify(error, null, 2)
    ); 
    return []; 
  }
  return data.map(e => ({ value: e.id, label: e.razon_social }));
}


export async function getEnviosAction({
  page = 1,
  pageSize = 10,
  query,
}: {
  page?: number;
  pageSize?: number;
  query?: string;
}): Promise<{ data: Envio[]; count: number }> {
  const supabase = createClient();
  const offset = (page - 1) * pageSize;

  let supabaseQuery = supabase
    .from("envios")
    .select(`
      *,
      clientes (nombre, apellido),
      tipos_envio (nombre),
      tipos_paquete (nombre),
      tipos_servicio (nombre),
      repartos (id, fecha_programada, estado),
      repartidores (nombre, apellido)
    `, { count: "exact" })
    .range(offset, offset + pageSize - 1)
    .order("fecha_solicitud", { ascending: false });

  if (query) {
    supabaseQuery = supabaseQuery.or(
      `id.ilike.%${query}%,clientes(nombre).ilike.%${query}%,clientes(apellido).ilike.%${query}%,direccion_destino.ilike.%${query}%,estado.ilike.%${query}%`
    );
  }

  const { data, error, count } = await supabaseQuery;

  if (error) {
    console.error(
        "Error fetching envios. Message:", error.message,
        "Code:", error.code,
        "Details:", error.details,
        "Hint:", error.hint,
        "Full error:", JSON.stringify(error, null, 2)
    );
    return { data: [], count: 0 };
  }
  return { data: data as Envio[], count: count ?? 0 };
}

export async function getEnvioByIdAction(id: string): Promise<Envio | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("envios")
    .select(`
      *,
      clientes (*),
      tipos_envio (*),
      tipos_paquete (*),
      tipos_servicio (*),
      repartos (*),
      repartidores (*),
      empresas (*)
    `)
    .eq("id", id)
    .single();
  if (error) {
    console.error(
        "Error fetching envio by ID. Message:", error.message,
        "Code:", error.code,
        "Details:", error.details,
        "Hint:", error.hint,
        "Full error:", JSON.stringify(error, null, 2)
    );
    return null;
  }
  return data as Envio;
}

export async function addEnvioAction(
  values: z.infer<typeof envioSchema>
): Promise<{ success: boolean; message: string; envio?: Envio }> {
  const supabase = createClient();
  const validatedFields = envioSchema.safeParse(values);

  if (!validatedFields.success) {
    console.error("Validation errors:", validatedFields.error.flatten().fieldErrors);
    return { success: false, message: "Error de validación. Revise los campos." };
  }

  const { error, data } = await supabase
    .from("envios")
    .insert(validatedFields.data)
    .select()
    .single();

  if (error) {
    console.error(
        "Error adding envio. Message:", error.message,
        "Code:", error.code,
        "Details:", error.details,
        "Hint:", error.hint,
        "Full error:", JSON.stringify(error, null, 2)
    );
    return { success: false, message: `Error al crear envío: ${error.message}` };
  }
  revalidatePath("/envios");
  return { success: true, message: "Envío creado exitosamente.", envio: data as Envio };
}

export async function updateEnvioAction(
  id: string,
  values: z.infer<typeof envioSchema>
): Promise<{ success: boolean; message: string; envio?: Envio }> {
  const supabase = createClient();
  const validatedFields = envioSchema.safeParse(values);

  if (!validatedFields.success) {
    console.error("Validation errors:", validatedFields.error.flatten().fieldErrors);
    return { success: false, message: "Error de validación. Revise los campos." };
  }

  const { error, data } = await supabase
    .from("envios")
    .update(validatedFields.data)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(
        "Error updating envio. Message:", error.message,
        "Code:", error.code,
        "Details:", error.details,
        "Hint:", error.hint,
        "Full error:", JSON.stringify(error, null, 2)
    );
    return { success: false, message: `Error al actualizar envío: ${error.message}` };
  }
  revalidatePath("/envios");
  revalidatePath(`/envios/${id}`); 
  return { success: true, message: "Envío actualizado exitosamente.", envio: data as Envio };
}

export async function deleteEnvioAction(id: string): Promise<{ success: boolean; message: string }> {
  const supabase = createClient();
  const { error } = await supabase.from("envios").delete().eq("id", id);

  if (error) {
    console.error(
        "Error deleting envio. Message:", error.message,
        "Code:", error.code,
        "Details:", error.details,
        "Hint:", error.hint,
        "Full error:", JSON.stringify(error, null, 2)
    );
    return { success: false, message: `Error al eliminar envío: ${error.message}` };
  }
  revalidatePath("/envios");
  return { success: true, message: "Envío eliminado exitosamente." };
}
