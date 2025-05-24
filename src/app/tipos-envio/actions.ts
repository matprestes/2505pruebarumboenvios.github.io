
"use server";

import { createClient } from "@/lib/supabase/server";
import { tipoEnvioSchema } from "@/lib/schemas";
import type { TipoEnvio, SelectOption } from "@/types";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function getTiposEnvioAction({
  page = 1,
  pageSize = 10,
  query,
}: {
  page?: number;
  pageSize?: number;
  query?: string;
}): Promise<{ data: TipoEnvio[]; count: number }> {
  const supabase = createClient();
  const offset = (page - 1) * pageSize;

  let supabaseQuery = supabase
    .from("tipos_envio")
    .select("*", { count: "exact" })
    .range(offset, offset + pageSize - 1)
    .order("created_at", { ascending: false });

  if (query) {
    supabaseQuery = supabaseQuery.or(`nombre.ilike.%${query}%,descripcion.ilike.%${query}%`);
  }

  const { data, error, count } = await supabaseQuery;

  if (error) {
    console.error(
      "Error fetching tipos_envio. Message:", error.message, 
      "Code:", error.code, 
      "Details:", error.details, 
      "Hint:", error.hint,
      "Full error:", JSON.stringify(error, null, 2)
    );
    return { data: [], count: 0 };
  }
  return { data: data as TipoEnvio[], count: count ?? 0 };
}

export async function getTipoEnvioByIdAction(id_tipo_envio: string): Promise<TipoEnvio | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("tipos_envio")
    .select("*")
    .eq("id_tipo_envio", id_tipo_envio)
    .single();

  if (error) {
    console.error(
      "Error fetching tipo_envio by ID. Message:", error.message, 
      "Code:", error.code, 
      "Details:", error.details, 
      "Hint:", error.hint,
      "Full error:", JSON.stringify(error, null, 2)
    );
    return null;
  }
  return data as TipoEnvio;
}

export async function addTipoEnvioAction(
  values: z.infer<typeof tipoEnvioSchema>
): Promise<{ success: boolean; message: string; tipoEnvio?: TipoEnvio }> {
  const supabase = createClient();
  const { id_tipo_envio, created_at, ...insertData } = values;
  const validatedFields = tipoEnvioSchema.omit({ id_tipo_envio: true, created_at: true }).safeParse(insertData);

  if (!validatedFields.success) {
     console.error("Validation errors (addTipoEnvioAction):", validatedFields.error.flatten().fieldErrors);
    return { success: false, message: "Error de validación al crear tipo de envío." };
  }
  
  const { error, data } = await supabase
    .from("tipos_envio")
    .insert(validatedFields.data)
    .select()
    .single();

  if (error) {
    console.error(
      "Error adding tipo_envio. Message:", error.message, 
      "Code:", error.code, 
      "Details:", error.details, 
      "Hint:", error.hint,
      "Full error:", JSON.stringify(error, null, 2)
    );
    return { success: false, message: `Error al crear tipo de envío: ${error.message}` };
  }
  revalidatePath("/tipos-envio");
  return { success: true, message: "Tipo de envío creado exitosamente.", tipoEnvio: data as TipoEnvio };
}

export async function updateTipoEnvioAction(
  id_tipo_envio_param: string,
  values: z.infer<typeof tipoEnvioSchema>
): Promise<{ success: boolean; message: string; tipoEnvio?: TipoEnvio }> {
  const supabase = createClient();
  const { created_at, id_tipo_envio, ...updateData } = values;
  const validatedFields = tipoEnvioSchema.omit({id_tipo_envio: true, created_at: true }).partial().safeParse(updateData);

  if (!validatedFields.success) {
    console.error("Validation errors (updateTipoEnvioAction):", validatedFields.error.flatten().fieldErrors);
    return { success: false, message: "Error de validación al actualizar tipo de envío." };
  }

  const { error, data } = await supabase
    .from("tipos_envio")
    .update(validatedFields.data)
    .eq("id_tipo_envio", id_tipo_envio_param)
    .select()
    .single();

  if (error) {
     console.error(
      "Error updating tipo_envio. Message:", error.message, 
      "Code:", error.code, 
      "Details:", error.details, 
      "Hint:", error.hint,
      "Full error:", JSON.stringify(error, null, 2)
    );
    return { success: false, message: `Error al actualizar tipo de envío: ${error.message}` };
  }
  revalidatePath("/tipos-envio");
  return { success: true, message: "Tipo de envío actualizado exitosamente.", tipoEnvio: data as TipoEnvio };
}

export async function deleteTipoEnvioAction(id_tipo_envio: string): Promise<{ success: boolean; message: string }> {
  const supabase = createClient();
  const { error } = await supabase.from("tipos_envio").delete().eq("id_tipo_envio", id_tipo_envio);

  if (error) {
    console.error(
      "Error deleting tipo_envio. Message:", error.message, 
      "Code:", error.code, 
      "Details:", error.details, 
      "Hint:", error.hint,
      "Full error:", JSON.stringify(error, null, 2)
    );
    return { success: false, message: `Error al eliminar tipo de envío: ${error.message}` };
  }
  revalidatePath("/tipos-envio");
  return { success: true, message: "Tipo de envío eliminado exitosamente." };
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
  return data.map((te) => ({ value: te.id_tipo_envio, label: te.nombre }));
}

    