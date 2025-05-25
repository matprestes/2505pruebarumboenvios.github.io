
"use server";

import { createClient } from "@/lib/supabase/server";
import { tipoPaqueteSchema } from "@/lib/schemas";
import type { TipoPaquete, SelectOption } from "@/types";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function getTiposPaqueteAction({
  page = 1,
  pageSize = 10,
  query,
}: {
  page?: number;
  pageSize?: number;
  query?: string;
}): Promise<{ data: TipoPaquete[]; count: number }> {
  const supabase = createClient();
  const offset = (page - 1) * pageSize;

  let supabaseQuery = supabase
    .from("tipos_paquete")
    .select("*", { count: "exact" })
    .range(offset, offset + pageSize - 1)
    .order("created_at", { ascending: false });

  if (query) {
    supabaseQuery = supabaseQuery.or(\`nombre.ilike.%\${query}%,descripcion.ilike.%\${query}%,dimensiones.ilike.%\${query}%\`);
  }

  const { data, error, count } = await supabaseQuery;

  if (error) {
    console.error(
      "Error fetching tipos_paquete. Message:", error.message, 
      "Code:", error.code, 
      "Details:", error.details, 
      "Hint:", error.hint,
      "Full error:", JSON.stringify(error, null, 2)
    );
    return { data: [], count: 0 };
  }
  return { data: data as TipoPaquete[], count: count ?? 0 };
}

export async function getTipoPaqueteByIdAction(id_tipo_paquete: string): Promise<TipoPaquete | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("tipos_paquete")
    .select("*")
    .eq("id_tipo_paquete", id_tipo_paquete)
    .single();

  if (error) {
    console.error(
      "Error fetching tipo_paquete by ID. Message:", error.message, 
      "Code:", error.code, 
      "Details:", error.details, 
      "Hint:", error.hint,
      "Full error:", JSON.stringify(error, null, 2)
    );
    return null;
  }
  return data as TipoPaquete;
}

export async function addTipoPaqueteAction(
  values: z.infer<typeof tipoPaqueteSchema>
): Promise<{ success: boolean; message: string; tipoPaquete?: TipoPaquete }> {
  const supabase = createClient();
  const { id_tipo_paquete, created_at, ...insertData } = values;
  const validatedFields = tipoPaqueteSchema.omit({ id_tipo_paquete: true, created_at: true }).safeParse(insertData);

  if (!validatedFields.success) {
    console.error("Validation errors (addTipoPaqueteAction):", validatedFields.error.flatten().fieldErrors);
    return { success: false, message: "Error de validación al crear tipo de paquete." };
  }
  
  const { error, data } = await supabase
    .from("tipos_paquete")
    .insert(validatedFields.data)
    .select()
    .single();

  if (error) {
    console.error(
      "Error adding tipo_paquete. Message:", error.message, 
      "Code:", error.code, 
      "Details:", error.details, 
      "Hint:", error.hint,
      "Full error:", JSON.stringify(error, null, 2)
    );
    return { success: false, message: \`Error al crear tipo de paquete: \${error.message}\` };
  }
  revalidatePath("/tipos-paquete");
  return { success: true, message: "Tipo de paquete creado exitosamente.", tipoPaquete: data as TipoPaquete };
}

export async function updateTipoPaqueteAction(
  id_tipo_paquete: string,
  values: z.infer<typeof tipoPaqueteSchema>
): Promise<{ success: boolean; message: string; tipoPaquete?: TipoPaquete }> {
  const supabase = createClient();
  const { created_at, id_tipo_paquete: idToExclude, ...updateData } = values;
  const validatedFields = tipoPaqueteSchema.omit({id_tipo_paquete: true, created_at: true }).partial().safeParse(updateData);

  if (!validatedFields.success) {
    console.error("Validation errors (updateTipoPaqueteAction):", validatedFields.error.flatten().fieldErrors);
    return { success: false, message: "Error de validación al actualizar tipo de paquete." };
  }

  const { error, data } = await supabase
    .from("tipos_paquete")
    .update(validatedFields.data)
    .eq("id_tipo_paquete", id_tipo_paquete)
    .select()
    .single();

  if (error) {
    console.error(
      "Error updating tipo_paquete. Message:", error.message, 
      "Code:", error.code, 
      "Details:", error.details, 
      "Hint:", error.hint,
      "Full error:", JSON.stringify(error, null, 2)
    );
    return { success: false, message: \`Error al actualizar tipo de paquete: \${error.message}\` };
  }
  revalidatePath("/tipos-paquete");
  return { success: true, message: "Tipo de paquete actualizado exitosamente.", tipoPaquete: data as TipoPaquete };
}

export async function deleteTipoPaqueteAction(id_tipo_paquete: string): Promise<{ success: boolean; message: string }> {
  const supabase = createClient();
  const { error } = await supabase.from("tipos_paquete").delete().eq("id_tipo_paquete", id_tipo_paquete);

  if (error) {
    console.error(
      "Error deleting tipo_paquete. Message:", error.message, 
      "Code:", error.code, 
      "Details:", error.details, 
      "Hint:", error.hint,
      "Full error:", JSON.stringify(error, null, 2)
    );
    return { success: false, message: \`Error al eliminar tipo de paquete: \${error.message}\` };
  }
  revalidatePath("/tipos-paquete");
  return { success: true, message: "Tipo de paquete eliminado exitosamente." };
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
  return data.map((tp) => ({ value: tp.id_tipo_paquete, label: tp.nombre }));
}

    