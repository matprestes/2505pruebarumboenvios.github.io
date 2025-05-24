
"use server";

import { createClient } from "@/lib/supabase/server";
import { tipoRepartoSchema } from "@/lib/schemas";
import type { TipoReparto, SelectOption } from "@/types";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function getTiposRepartoAction({
  page = 1,
  pageSize = 10,
  query,
}: {
  page?: number;
  pageSize?: number;
  query?: string;
}): Promise<{ data: TipoReparto[]; count: number }> {
  const supabase = createClient();
  const offset = (page - 1) * pageSize;

  let supabaseQuery = supabase
    .from("tipos_reparto")
    .select("*", { count: "exact" })
    .range(offset, offset + pageSize - 1)
    .order("created_at", { ascending: false });

  if (query) {
    supabaseQuery = supabaseQuery.or(`nombre.ilike.%${query}%,descripcion.ilike.%${query}%`);
  }

  const { data, error, count } = await supabaseQuery;

  if (error) {
    console.error(
      "Error fetching tipos_reparto. Message:", error.message, 
      "Code:", error.code, 
      "Details:", error.details, 
      "Hint:", error.hint,
      "Full error:", JSON.stringify(error, null, 2)
    );
    return { data: [], count: 0 };
  }
  return { data: data as TipoReparto[], count: count ?? 0 };
}

export async function getTipoRepartoByIdAction(id_tipo_reparto: string): Promise<TipoReparto | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("tipos_reparto")
    .select("*")
    .eq("id_tipo_reparto", id_tipo_reparto)
    .single();

  if (error) {
     console.error(
      "Error fetching tipo_reparto by ID. Message:", error.message, 
      "Code:", error.code, 
      "Details:", error.details, 
      "Hint:", error.hint,
      "Full error:", JSON.stringify(error, null, 2)
    );
    return null;
  }
  return data as TipoReparto;
}

export async function addTipoRepartoAction(
  values: z.infer<typeof tipoRepartoSchema>
): Promise<{ success: boolean; message: string; tipoReparto?: TipoReparto }> {
  const supabase = createClient();
  const { id_tipo_reparto, created_at, ...insertData } = values;
  const validatedFields = tipoRepartoSchema.safeParse(insertData);

  if (!validatedFields.success) {
    console.error("Validation errors (addTipoRepartoAction):", validatedFields.error.flatten().fieldErrors);
    return { success: false, message: "Error de validación al crear tipo de reparto." };
  }
  
  const { error, data } = await supabase
    .from("tipos_reparto")
    .insert(validatedFields.data)
    .select()
    .single();

  if (error) {
    console.error(
      "Error adding tipo_reparto. Message:", error.message, 
      "Code:", error.code, 
      "Details:", error.details, 
      "Hint:", error.hint,
      "Full error:", JSON.stringify(error, null, 2)
    );
    return { success: false, message: `Error al crear tipo de reparto: ${error.message}` };
  }
  revalidatePath("/tipos-reparto");
  return { success: true, message: "Tipo de reparto creado exitosamente.", tipoReparto: data as TipoReparto };
}

export async function updateTipoRepartoAction(
  id_tipo_reparto: string,
  values: z.infer<typeof tipoRepartoSchema>
): Promise<{ success: boolean; message: string; tipoReparto?: TipoReparto }> {
  const supabase = createClient();
  const { created_at, ...updateData } = values;
  const validatedFields = tipoRepartoSchema.partial().safeParse(updateData);


  if (!validatedFields.success) {
    console.error("Validation errors (updateTipoRepartoAction):", validatedFields.error.flatten().fieldErrors);
    return { success: false, message: "Error de validación al actualizar tipo de reparto." };
  }

  const { error, data } = await supabase
    .from("tipos_reparto")
    .update(validatedFields.data)
    .eq("id_tipo_reparto", id_tipo_reparto)
    .select()
    .single();

  if (error) {
    console.error(
      "Error updating tipo_reparto. Message:", error.message, 
      "Code:", error.code, 
      "Details:", error.details, 
      "Hint:", error.hint,
      "Full error:", JSON.stringify(error, null, 2)
    );
    return { success: false, message: `Error al actualizar tipo de reparto: ${error.message}` };
  }
  revalidatePath("/tipos-reparto");
  return { success: true, message: "Tipo de reparto actualizado exitosamente.", tipoReparto: data as TipoReparto };
}

export async function deleteTipoRepartoAction(id_tipo_reparto: string): Promise<{ success: boolean; message: string }> {
  const supabase = createClient();
  const { error } = await supabase.from("tipos_reparto").delete().eq("id_tipo_reparto", id_tipo_reparto);

  if (error) {
    console.error(
      "Error deleting tipo_reparto. Message:", error.message, 
      "Code:", error.code, 
      "Details:", error.details, 
      "Hint:", error.hint,
      "Full error:", JSON.stringify(error, null, 2)
    );
    return { success: false, message: `Error al eliminar tipo de reparto: ${error.message}` };
  }
  revalidatePath("/tipos-reparto");
  return { success: true, message: "Tipo de reparto eliminado exitosamente." };
}

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
