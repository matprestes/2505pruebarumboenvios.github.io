
"use server";

import { createClient } from "@/lib/supabase/server";
import { tipoClienteSchema } from "@/lib/schemas";
import type { TipoCliente } from "@/types";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function getTiposClienteAction({
  page = 1,
  pageSize = 10,
  query,
}: {
  page?: number;
  pageSize?: number;
  query?: string;
}): Promise<{ data: TipoCliente[]; count: number }> {
  const supabase = createClient();
  const offset = (page - 1) * pageSize;

  let supabaseQuery = supabase
    .from("tipos_cliente")
    .select("*", { count: "exact" })
    .range(offset, offset + pageSize - 1)
    .order("created_at", { ascending: false });

  if (query) {
    supabaseQuery = supabaseQuery.or(`nombre.ilike.%${query}%,descripcion.ilike.%${query}%`);
  }

  const { data, error, count } = await supabaseQuery;

  if (error) {
    console.error(
      "Error fetching tipos_cliente. Message:", error.message, 
      "Code:", error.code, 
      "Details:", error.details, 
      "Hint:", error.hint,
      "Full error:", JSON.stringify(error, null, 2)
    );
    return { data: [], count: 0 };
  }
  return { data: data as TipoCliente[], count: count ?? 0 };
}

export async function getTipoClienteByIdAction(id_tipo_cliente: string): Promise<TipoCliente | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("tipos_cliente")
    .select("*")
    .eq("id_tipo_cliente", id_tipo_cliente)
    .single();

  if (error) {
    console.error(
      "Error fetching tipo_cliente by ID. Message:", error.message, 
      "Code:", error.code, 
      "Details:", error.details, 
      "Hint:", error.hint,
      "Full error:", JSON.stringify(error, null, 2)
    );
    return null;
  }
  return data as TipoCliente;
}

export async function addTipoClienteAction(
  values: z.infer<typeof tipoClienteSchema>
): Promise<{ success: boolean; message: string; tipoCliente?: TipoCliente }> {
  const supabase = createClient();
  // Omitting id_tipo_cliente and created_at as they are auto-generated or optional
  const { id_tipo_cliente, created_at, ...insertData } = values;
  const validatedFields = tipoClienteSchema.safeParse(insertData);


  if (!validatedFields.success) {
    console.error("Validation errors (addTipoClienteAction):", validatedFields.error.flatten().fieldErrors);
    return { success: false, message: "Error de validación al crear tipo de cliente." };
  }

  const { error, data } = await supabase
    .from("tipos_cliente")
    .insert(validatedFields.data)
    .select()
    .single();

  if (error) {
     console.error(
      "Error adding tipo_cliente. Message:", error.message, 
      "Code:", error.code, 
      "Details:", error.details, 
      "Hint:", error.hint,
      "Full error:", JSON.stringify(error, null, 2)
    );
    return { success: false, message: `Error al crear tipo de cliente: ${error.message}` };
  }
  revalidatePath("/tipos-cliente");
  return { success: true, message: "Tipo de cliente creado exitosamente.", tipoCliente: data as TipoCliente };
}

export async function updateTipoClienteAction(
  id_tipo_cliente: string,
  values: z.infer<typeof tipoClienteSchema>
): Promise<{ success: boolean; message: string; tipoCliente?: TipoCliente }> {
  const supabase = createClient();
  const { created_at, ...updateData } = values; // Exclude created_at from update
  const validatedFields = tipoClienteSchema.partial().safeParse(updateData);


  if (!validatedFields.success) {
    console.error("Validation errors (updateTipoClienteAction):", validatedFields.error.flatten().fieldErrors);
    return { success: false, message: "Error de validación al actualizar tipo de cliente." };
  }

  const { error, data } = await supabase
    .from("tipos_cliente")
    .update(validatedFields.data)
    .eq("id_tipo_cliente", id_tipo_cliente)
    .select()
    .single();

  if (error) {
    console.error(
      "Error updating tipo_cliente. Message:", error.message, 
      "Code:", error.code, 
      "Details:", error.details, 
      "Hint:", error.hint,
      "Full error:", JSON.stringify(error, null, 2)
    );
    return { success: false, message: `Error al actualizar tipo de cliente: ${error.message}` };
  }
  revalidatePath("/tipos-cliente");
  return { success: true, message: "Tipo de cliente actualizado exitosamente.", tipoCliente: data as TipoCliente };
}

export async function deleteTipoClienteAction(id_tipo_cliente: string): Promise<{ success: boolean; message: string }> {
  const supabase = createClient();
  const { error } = await supabase.from("tipos_cliente").delete().eq("id_tipo_cliente", id_tipo_cliente);

  if (error) {
    console.error(
      "Error deleting tipo_cliente. Message:", error.message, 
      "Code:", error.code, 
      "Details:", error.details, 
      "Hint:", error.hint,
      "Full error:", JSON.stringify(error, null, 2)
    );
    return { success: false, message: `Error al eliminar tipo de cliente: ${error.message}` };
  }
  revalidatePath("/tipos-cliente");
  return { success: true, message: "Tipo de cliente eliminado exitosamente." };
}
