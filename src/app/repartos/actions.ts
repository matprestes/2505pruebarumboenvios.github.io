
"use server";

import { createClient } from "@/lib/supabase/server";
import { repartoSchema } from "@/lib/schemas";
import type { Reparto, SelectOption } from "@/types";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getRepartidoresForSelectAction } from "@/app/repartidores/actions";
import { getEmpresasForSelectAction } from "@/app/empresas/actions";


export async function getTiposRepartoForSelectAction(): Promise<SelectOption[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("tipos_reparto")
    .select("id_tipo_reparto, nombre")
    .eq("activo", true)
    .order("nombre");

  if (error) {
    console.error("Error fetching tipos_reparto for select:", error);
    return [];
  }
  return data.map((tr) => ({ value: tr.id_tipo_reparto, label: tr.nombre }));
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
      *,
      tipos_reparto (nombre),
      repartidores (nombre, apellido),
      empresas (razon_social),
      empresa_despachante:empresas (razon_social) 
    `, { count: "exact" })
    .range(offset, offset + pageSize - 1)
    .order("fecha_programada", { ascending: false });

  if (query) {
    // Basic query, can be expanded
    supabaseQuery = supabaseQuery.or(
      `estado.ilike.%${query}%,tipos_reparto(nombre).ilike.%${query}%,repartidores(nombre).ilike.%${query}%,repartidores(apellido).ilike.%${query}%`
    );
  }

  const { data, error, count } = await supabaseQuery;

  if (error) {
    console.error("Error fetching repartos:", error);
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
      empresas (*),
      empresa_despachante:empresas (*)
    `)
    .eq("id", id)
    .single();
  if (error) {
    console.error("Error fetching reparto by ID:", error);
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
    console.error("Error adding reparto:", error);
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

  const { error, data } = await supabase
    .from("repartos")
    .update(validatedFields.data)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating reparto:", error);
    return { success: false, message: `Error al actualizar reparto: ${error.message}` };
  }
  revalidatePath("/repartos");
  revalidatePath(`/repartos/${id}`); // If there's a detail page
  return { success: true, message: "Reparto actualizado exitosamente.", reparto: data as Reparto };
}

export async function deleteRepartoAction(id: string): Promise<{ success: boolean; message: string }> {
  const supabase = createClient();
  // Consider cascading deletes or handling related paradas_reparto
  const { error } = await supabase.from("repartos").delete().eq("id", id);

  if (error) {
    console.error("Error deleting reparto:", error);
    return { success: false, message: `Error al eliminar reparto: ${error.message}` };
  }
  revalidatePath("/repartos");
  return { success: true, message: "Reparto eliminado exitosamente." };
}

    