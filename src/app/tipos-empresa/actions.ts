
"use server";

import { createClient } from "@/lib/supabase/server";
import { tipoEmpresaSchema } from "@/lib/schemas";
import type { TipoEmpresa } from "@/types";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function getTiposEmpresaAction({
  page = 1,
  pageSize = 10,
  query,
}: {
  page?: number;
  pageSize?: number;
  query?: string;
}): Promise<{ data: TipoEmpresa[]; count: number }> {
  const supabase = createClient();
  const offset = (page - 1) * pageSize;

  let supabaseQuery = supabase
    .from("tipos_empresa")
    .select("*", { count: "exact" })
    .range(offset, offset + pageSize - 1)
    .order("created_at", { ascending: false });

  if (query) {
    supabaseQuery = supabaseQuery.or(`nombre.ilike.%${query}%,descripcion.ilike.%${query}%`);
  }

  const { data, error, count } = await supabaseQuery;

  if (error) {
    console.error(
      "Error fetching tipos_empresa. Message:", error.message, 
      "Code:", error.code, 
      "Details:", error.details, 
      "Hint:", error.hint,
      "Full error:", JSON.stringify(error, null, 2)
    );
    return { data: [], count: 0 };
  }
  return { data: data as TipoEmpresa[], count: count ?? 0 };
}

export async function getTipoEmpresaByIdAction(id: string): Promise<TipoEmpresa | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("tipos_empresa")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(
      "Error fetching tipo_empresa by ID. Message:", error.message, 
      "Code:", error.code, 
      "Details:", error.details, 
      "Hint:", error.hint,
      "Full error:", JSON.stringify(error, null, 2)
    );
    return null;
  }
  return data as TipoEmpresa;
}

export async function addTipoEmpresaAction(
  values: z.infer<typeof tipoEmpresaSchema>
): Promise<{ success: boolean; message: string; tipoEmpresa?: TipoEmpresa }> {
  const supabase = createClient();
  const { id, created_at, ...insertData } = values;
  const validatedFields = tipoEmpresaSchema.omit({ id: true, created_at: true }).safeParse(insertData);

  if (!validatedFields.success) {
    console.error("Validation errors (addTipoEmpresaAction):", validatedFields.error.flatten().fieldErrors);
    return { success: false, message: "Error de validación." };
  }

  const { error, data } = await supabase
    .from("tipos_empresa")
    .insert(validatedFields.data)
    .select()
    .single();

  if (error) {
    console.error(
      "Error adding tipo_empresa. Message:", error.message, 
      "Code:", error.code, 
      "Details:", error.details, 
      "Hint:", error.hint,
      "Full error:", JSON.stringify(error, null, 2)
    );
    return { success: false, message: `Error al crear tipo de empresa: ${error.message}` };
  }
  revalidatePath("/tipos-empresa");
  return { success: true, message: "Tipo de empresa creado exitosamente.", tipoEmpresa: data as TipoEmpresa };
}

export async function updateTipoEmpresaAction(
  id_param: string,
  values: z.infer<typeof tipoEmpresaSchema>
): Promise<{ success: boolean; message: string; tipoEmpresa?: TipoEmpresa }> {
  const supabase = createClient();
  const { created_at, id, ...updateData } = values;
  const validatedFields = tipoEmpresaSchema.omit({id: true, created_at: true}).partial().safeParse(updateData);

  if (!validatedFields.success) {
     console.error("Validation errors (updateTipoEmpresaAction):", validatedFields.error.flatten().fieldErrors);
    return { success: false, message: "Error de validación." };
  }

  const { error, data } = await supabase
    .from("tipos_empresa")
    .update(validatedFields.data)
    .eq("id", id_param)
    .select()
    .single();

  if (error) {
    console.error(
      "Error updating tipo_empresa. Message:", error.message, 
      "Code:", error.code, 
      "Details:", error.details, 
      "Hint:", error.hint,
      "Full error:", JSON.stringify(error, null, 2)
    );
    return { success: false, message: `Error al actualizar tipo de empresa: ${error.message}` };
  }
  revalidatePath("/tipos-empresa");
  revalidatePath(`/tipos-empresa/${id_param}`);
  return { success: true, message: "Tipo de empresa actualizado exitosamente.", tipoEmpresa: data as TipoEmpresa };
}

export async function deleteTipoEmpresaAction(id: string): Promise<{ success: boolean; message: string }> {
  const supabase = createClient();
  const { error } = await supabase.from("tipos_empresa").delete().eq("id", id);

  if (error) {
    console.error(
      "Error deleting tipo_empresa. Message:", error.message, 
      "Code:", error.code, 
      "Details:", error.details, 
      "Hint:", error.hint,
      "Full error:", JSON.stringify(error, null, 2)
    );
    return { success: false, message: `Error al eliminar tipo de empresa: ${error.message}` };
  }
  revalidatePath("/tipos-empresa");
  return { success: true, message: "Tipo de empresa eliminado exitosamente." };
}

    