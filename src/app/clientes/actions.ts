
"use server";

import { createClient } from "@/lib/supabase/server";
import { clienteSchema } from "@/lib/schemas";
import type { Cliente, TipoCliente, Empresa, SelectOption } from "@/types";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function getClientesAction({
  page = 1,
  pageSize = 10,
  query,
}: {
  page?: number;
  pageSize?: number;
  query?: string;
}): Promise<{ data: Cliente[]; count: number }> {
  const supabase = createClient();
  const offset = (page - 1) * pageSize;

  let supabaseQuery = supabase
    .from("clientes")
    .select(`
      *,
      tipos_cliente (nombre),
      empresas (razon_social)
    `, { count: "exact" })
    .range(offset, offset + pageSize - 1)
    .order("created_at", { ascending: false });

  if (query) {
    supabaseQuery = supabaseQuery.or(
      `nombre.ilike.%${query}%,apellido.ilike.%${query}%,email.ilike.%${query}%,empresas(razon_social).ilike.%${query}%`
    );
  }

  const { data, error, count } = await supabaseQuery;

  if (error) {
    console.error("Error fetching clientes:", error);
    return { data: [], count: 0 };
  }
  return { data: data as Cliente[], count: count ?? 0 };
}

export async function getClienteByIdAction(id: string): Promise<Cliente | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("clientes")
    .select("*")
    .eq("id", id)
    .single();
  if (error) {
    console.error("Error fetching cliente by ID:", error);
    return null;
  }
  return data as Cliente;
}

export async function addClienteAction(
  values: z.infer<typeof clienteSchema>
): Promise<{ success: boolean; message: string; cliente?: Cliente }> {
  const supabase = createClient();
  const validatedFields = clienteSchema.safeParse(values);

  if (!validatedFields.success) {
    return { success: false, message: "Error de validación." };
  }

  const { error, data } = await supabase
    .from("clientes")
    .insert(validatedFields.data)
    .select()
    .single();

  if (error) {
    console.error("Error adding cliente:", error);
    return { success: false, message: `Error al crear cliente: ${error.message}` };
  }
  revalidatePath("/clientes");
  return { success: true, message: "Cliente creado exitosamente.", cliente: data as Cliente };
}

export async function updateClienteAction(
  id: string,
  values: z.infer<typeof clienteSchema>
): Promise<{ success: boolean; message: string; cliente?: Cliente }> {
  const supabase = createClient();
  const validatedFields = clienteSchema.safeParse(values);

  if (!validatedFields.success) {
    return { success: false, message: "Error de validación." };
  }

  const { error, data } = await supabase
    .from("clientes")
    .update(validatedFields.data)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating cliente:", error);
    return { success: false, message: `Error al actualizar cliente: ${error.message}` };
  }
  revalidatePath("/clientes");
  revalidatePath(`/clientes/${id}`);
  return { success: true, message: "Cliente actualizado exitosamente.", cliente: data as Cliente };
}

export async function deleteClienteAction(id: string): Promise<{ success: boolean; message: string }> {
  const supabase = createClient();
  const { error } = await supabase.from("clientes").delete().eq("id", id);

  if (error) {
    console.error("Error deleting cliente:", error);
    return { success: false, message: `Error al eliminar cliente: ${error.message}` };
  }
  revalidatePath("/clientes");
  return { success: true, message: "Cliente eliminado exitosamente." };
}

export async function getTiposClienteForSelectAction(): Promise<SelectOption[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("tipos_cliente")
    .select("id_tipo_cliente, nombre")
    .order("nombre");

  if (error) {
    console.error("Error fetching tipos_cliente for select:", error);
    return [];
  }
  return data.map((tc) => ({ value: tc.id_tipo_cliente, label: tc.nombre }));
}

export async function getEmpresasForSelectAction(): Promise<SelectOption[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("empresas")
    .select("id, razon_social")
    .order("razon_social");

  if (error) {
    console.error("Error fetching empresas for select:", error);
    return [];
  }
  return data.map((e) => ({ value: e.id, label: e.razon_social }));
}

    