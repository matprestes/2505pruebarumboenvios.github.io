
"use server";

import { createClient } from "@/lib/supabase/server";
import { empresaSchema } from "@/lib/schemas";
import type { Empresa, TipoEmpresa, SelectOption } from "@/types";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function getEmpresasAction({
  page = 1,
  pageSize = 10,
  query,
}: {
  page?: number;
  pageSize?: number;
  query?: string;
}): Promise<{ data: Empresa[]; count: number }> {
  const supabase = createClient();
  const offset = (page - 1) * pageSize;

  let supabaseQuery = supabase
    .from("empresas")
    .select(`
      *,
      tipos_empresa (nombre)
    `, { count: "exact" })
    .range(offset, offset + pageSize - 1)
    .order("created_at", { ascending: false });

  if (query) {
    supabaseQuery = supabaseQuery.or(
      `razon_social.ilike.%${query}%,cuit.ilike.%${query}%,email_contacto.ilike.%${query}%`
    );
  }

  const { data, error, count } = await supabaseQuery;

  if (error) {
    console.error("Error fetching empresas:", error);
    return { data: [], count: 0 };
  }
  return { data: data as Empresa[], count: count ?? 0 };
}

export async function getEmpresaByIdAction(id: string): Promise<Empresa | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("empresas")
    .select("*, tipos_empresa(id, nombre)")
    .eq("id", id)
    .single();
  if (error) {
    console.error("Error fetching empresa by ID:", error);
    return null;
  }
  return data as Empresa;
}

export async function addEmpresaAction(
  values: z.infer<typeof empresaSchema>
): Promise<{ success: boolean; message: string; empresa?: Empresa }> {
  const supabase = createClient();
  const validatedFields = empresaSchema.safeParse(values);

  if (!validatedFields.success) {
    return { success: false, message: "Error de validación." };
  }

  const { error, data } = await supabase
    .from("empresas")
    .insert(validatedFields.data)
    .select()
    .single();

  if (error) {
    console.error("Error adding empresa:", error);
    return { success: false, message: `Error al crear empresa: ${error.message}` };
  }
  revalidatePath("/empresas");
  return { success: true, message: "Empresa creada exitosamente.", empresa: data as Empresa };
}

export async function updateEmpresaAction(
  id: string,
  values: z.infer<typeof empresaSchema>
): Promise<{ success: boolean; message: string; empresa?: Empresa }> {
  const supabase = createClient();
  const validatedFields = empresaSchema.safeParse(values);

  if (!validatedFields.success) {
    return { success: false, message: "Error de validación." };
  }

  const { error, data } = await supabase
    .from("empresas")
    .update(validatedFields.data)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating empresa:", error);
    return { success: false, message: `Error al actualizar empresa: ${error.message}` };
  }
  revalidatePath("/empresas");
  revalidatePath(`/empresas/${id}`);
  return { success: true, message: "Empresa actualizada exitosamente.", empresa: data as Empresa };
}

export async function deleteEmpresaAction(id: string): Promise<{ success: boolean; message: string }> {
  const supabase = createClient();
  const { error } = await supabase.from("empresas").delete().eq("id", id);

  if (error) {
    console.error("Error deleting empresa:", error);
    return { success: false, message: `Error al eliminar empresa: ${error.message}` };
  }
  revalidatePath("/empresas");
  return { success: true, message: "Empresa eliminada exitosamente." };
}

export async function getTiposEmpresaForSelectAction(): Promise<SelectOption[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("tipos_empresa")
    .select("id, nombre")
    .order("nombre");

  if (error) {
    console.error("Error fetching tipos_empresa for select:", error);
    return [];
  }
  return data.map((te) => ({ value: te.id, label: te.nombre }));
}


    