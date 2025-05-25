
"use server";

import { createClient } from "@/lib/supabase/server";
import { repartidorSchema } from "@/lib/schemas";
import type { Repartidor, SelectOption } from "@/types";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function getRepartidoresAction({
  page = 1,
  pageSize = 10,
  query,
}: {
  page?: number;
  pageSize?: number;
  query?: string;
}): Promise<{ data: Repartidor[]; count: number }> {
  const supabase = createClient();
  const offset = (page - 1) * pageSize;

  let supabaseQuery = supabase
    .from("repartidores")
    .select("*", { count: "exact" })
    .range(offset, offset + pageSize - 1)
    .order("created_at", { ascending: false });

  if (query) {
    supabaseQuery = supabaseQuery.or(
      `nombre.ilike.%${query}%,apellido.ilike.%${query}%,dni.ilike.%${query}%,email.ilike.%${query}%`
    );
  }

  const { data, error, count } = await supabaseQuery;

  if (error) {
    console.error(
        "Error fetching repartidores. Message:", error.message,
        "Code:", error.code,
        "Details:", error.details,
        "Hint:", error.hint,
        "Full error:", JSON.stringify(error, null, 2)
    );
    return { data: [], count: 0 };
  }
  return { data: data as Repartidor[], count: count ?? 0 };
}

export async function getRepartidorByIdAction(id: string): Promise<Repartidor | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("repartidores")
    .select("*")
    .eq("id", id)
    .single();
  if (error) {
    console.error(
        "Error fetching repartidor by ID. Message:", error.message,
        "Code:", error.code,
        "Details:", error.details,
        "Hint:", error.hint,
        "Full error:", JSON.stringify(error, null, 2)
    );
    return null;
  }
  return data as Repartidor;
}

export async function addRepartidorAction(
  values: z.infer<typeof repartidorSchema>
): Promise<{ success: boolean; message: string; repartidor?: Repartidor }> {
  const supabase = createClient();
  const validatedFields = repartidorSchema.safeParse(values);

  if (!validatedFields.success) {
    return { success: false, message: "Error de validación." };
  }

  const { error, data } = await supabase
    .from("repartidores")
    .insert(validatedFields.data)
    .select()
    .single();

  if (error) {
    console.error(
        "Error adding repartidor. Message:", error.message,
        "Code:", error.code,
        "Details:", error.details,
        "Hint:", error.hint,
        "Full error:", JSON.stringify(error, null, 2)
    );
    return { success: false, message: `Error al crear repartidor: ${error.message}` };
  }
  revalidatePath("/repartidores");
  return { success: true, message: "Repartidor creado exitosamente.", repartidor: data as Repartidor };
}

export async function updateRepartidorAction(
  id: string,
  values: z.infer<typeof repartidorSchema>
): Promise<{ success: boolean; message: string; repartidor?: Repartidor }> {
  const supabase = createClient();
  const validatedFields = repartidorSchema.safeParse(values);

  if (!validatedFields.success) {
    return { success: false, message: "Error de validación." };
  }

  const { error, data } = await supabase
    .from("repartidores")
    .update(validatedFields.data)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(
        "Error updating repartidor. Message:", error.message,
        "Code:", error.code,
        "Details:", error.details,
        "Hint:", error.hint,
        "Full error:", JSON.stringify(error, null, 2)
    );
    return { success: false, message: `Error al actualizar repartidor: ${error.message}` };
  }
  revalidatePath("/repartidores");
  revalidatePath(`/repartidores/${id}`);
  return { success: true, message: "Repartidor actualizado exitosamente.", repartidor: data as Repartidor };
}

export async function deleteRepartidorAction(id: string): Promise<{ success: boolean; message: string }> {
  const supabase = createClient();
  const { error } = await supabase.from("repartidores").delete().eq("id", id);

  if (error) {
    console.error(
        "Error deleting repartidor. Message:", error.message,
        "Code:", error.code,
        "Details:", error.details,
        "Hint:", error.hint,
        "Full error:", JSON.stringify(error, null, 2)
    );
    return { success: false, message: `Error al eliminar repartidor: ${error.message}` };
  }
  revalidatePath("/repartidores");
  return { success: true, message: "Repartidor eliminado exitosamente." };
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
