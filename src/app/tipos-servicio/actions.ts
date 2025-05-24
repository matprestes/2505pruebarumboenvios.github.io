
"use server";

import { createClient } from "@/lib/supabase/server";
import { tipoServicioSchema, tarifaServicioSchema } from "@/lib/schemas";
import type { TipoServicio, TarifaServicio } from "@/types";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function getTiposServicioAction({
  page = 1,
  pageSize = 10,
  query,
}: {
  page?: number;
  pageSize?: number;
  query?: string;
}): Promise<{ data: TipoServicio[]; count: number }> {
  const supabase = createClient();
  const offset = (page - 1) * pageSize;

  let supabaseQuery = supabase
    .from("tipos_servicio")
    .select("*, tarifas_servicio(*)", { count: "exact" })
    .range(offset, offset + pageSize - 1)
    .order("created_at", { ascending: false });

  if (query) {
    supabaseQuery = supabaseQuery.or(`nombre.ilike.%${query}%,descripcion.ilike.%${query}%`);
  }

  const { data, error, count } = await supabaseQuery;

  if (error) {
    console.error(
      "Error fetching tipos_servicio. Message:", error.message, 
      "Code:", error.code, 
      "Details:", error.details, 
      "Hint:", error.hint,
      "Full error:", JSON.stringify(error, null, 2)
    );
    return { data: [], count: 0 };
  }
  return { data: data as TipoServicio[], count: count ?? 0 };
}

export async function getTipoServicioByIdAction(id_tipo_servicio: string): Promise<TipoServicio | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("tipos_servicio")
    .select("*, tarifas_servicio(*)")
    .eq("id_tipo_servicio", id_tipo_servicio)
    .single();

  if (error) {
    console.error(
      "Error fetching tipo_servicio by ID. Message:", error.message, 
      "Code:", error.code, 
      "Details:", error.details, 
      "Hint:", error.hint,
      "Full error:", JSON.stringify(error, null, 2)
    );
    return null;
  }
  return data as TipoServicio;
}

export async function addTipoServicioAction(
  values: z.infer<typeof tipoServicioSchema>
): Promise<{ success: boolean; message: string; tipoServicio?: TipoServicio }> {
  const supabase = createClient();
  const { id_tipo_servicio, created_at, tarifas_servicio, ...tipoServicioDataToInsert } = values;
  
  const validatedTipoServicio = tipoServicioSchema
    .omit({ id_tipo_servicio: true, created_at: true, tarifas_servicio: true })
    .safeParse(tipoServicioDataToInsert);

  if (!validatedTipoServicio.success) {
    console.error("Validation errors (addTipoServicioAction - tipoServicio):", validatedTipoServicio.error.flatten().fieldErrors);
    return { success: false, message: "Error de validación al crear tipo de servicio." };
  }

  const { data: newTipoServicio, error: tipoServicioError } = await supabase
    .from("tipos_servicio")
    .insert(validatedTipoServicio.data)
    .select()
    .single();

  if (tipoServicioError || !newTipoServicio) {
    console.error(
      "Error adding tipo_servicio. Message:", tipoServicioError?.message, 
      "Code:", tipoServicioError?.code, 
      "Details:", tipoServicioError?.details, 
      "Hint:", tipoServicioError?.hint,
      "Full error:", JSON.stringify(tipoServicioError, null, 2)
    );
    return { success: false, message: `Error al crear tipo de servicio: ${tipoServicioError?.message}` };
  }

  if (tarifas_servicio && tarifas_servicio.length > 0) {
    const tarifasToInsert = tarifas_servicio.map(tarifa => {
      const { id_tarifa_servicio, created_at: tarifaCreatedAt, ...tarifaData } = tarifa;
      return { ...tarifaData, id_tipo_servicio: newTipoServicio.id_tipo_servicio };
    });

    const validatedTarifas = z.array(
        tarifaServicioSchema.omit({ id_tarifa_servicio: true, created_at: true })
    ).safeParse(tarifasToInsert);
    
    if(!validatedTarifas.success) {
        console.error("Validation errors (addTipoServicioAction - tarifas):", validatedTarifas.error.flatten().fieldErrors);
        // Optionally delete the just created tipo_servicio or handle rollback
        return { success: false, message: "Error de validación en las tarifas del servicio." };
    }
    
    const { error: tarifasError } = await supabase
      .from("tarifas_servicio")
      .insert(validatedTarifas.data);

    if (tarifasError) {
      console.error(
        "Error adding tarifas_servicio. Message:", tarifasError.message, 
        "Code:", tarifasError.code, 
        "Details:", tarifasError.details, 
        "Hint:", tarifasError.hint,
        "Full error:", JSON.stringify(tarifasError, null, 2)
      );
      return { success: false, message: `Error al crear tarifas para el servicio: ${tarifasError.message}` };
    }
  }

  revalidatePath("/tipos-servicio");
  const resultData = await getTipoServicioByIdAction(newTipoServicio.id_tipo_servicio);
  return { success: true, message: "Tipo de servicio creado exitosamente.", tipoServicio: resultData || undefined };
}

export async function updateTipoServicioAction(
  id_tipo_servicio_param: string, // Renamed to avoid conflict with values
  values: z.infer<typeof tipoServicioSchema>
): Promise<{ success: boolean; message: string; tipoServicio?: TipoServicio }> {
  const supabase = createClient();
  const { id_tipo_servicio, created_at, tarifas_servicio, ...tipoServicioDataToUpdate } = values;
  
  const validatedTipoServicio = tipoServicioSchema
    .omit({ id_tipo_servicio: true, created_at: true, tarifas_servicio: true })
    .partial()
    .safeParse(tipoServicioDataToUpdate);

  if (!validatedTipoServicio.success) {
     console.error("Validation errors (updateTipoServicioAction - tipoServicio):", validatedTipoServicio.error.flatten().fieldErrors);
    return { success: false, message: "Error de validación al actualizar tipo de servicio." };
  }
  
  const { error: tipoServicioError } = await supabase
    .from("tipos_servicio")
    .update(validatedTipoServicio.data)
    .eq("id_tipo_servicio", id_tipo_servicio_param);

  if (tipoServicioError) {
    console.error(
      "Error updating tipo_servicio. Message:", tipoServicioError.message, 
      "Code:", tipoServicioError.code, 
      "Details:", tipoServicioError.details, 
      "Hint:", tipoServicioError.hint,
      "Full error:", JSON.stringify(tipoServicioError, null, 2)
    );
    return { success: false, message: `Error al actualizar tipo de servicio: ${tipoServicioError.message}` };
  }

  const { error: deleteTarifasError } = await supabase
    .from("tarifas_servicio")
    .delete()
    .eq("id_tipo_servicio", id_tipo_servicio_param);

  if (deleteTarifasError) {
     console.error(
      "Error deleting old tarifas_servicio. Message:", deleteTarifasError.message, 
      "Code:", deleteTarifasError.code, 
      "Details:", deleteTarifasError.details, 
      "Hint:", deleteTarifasError.hint,
      "Full error:", JSON.stringify(deleteTarifasError, null, 2)
    );
    return { success: false, message: `Error al actualizar tarifas (eliminación): ${deleteTarifasError.message}` };
  }

  if (tarifas_servicio && tarifas_servicio.length > 0) {
    const tarifasToInsert = tarifas_servicio.map(tarifa => {
      const { id_tarifa_servicio, created_at: tarifaCreatedAt, ...tarifaData } = tarifa;
      return { ...tarifaData, id_tipo_servicio: id_tipo_servicio_param };
    });
    
    const validatedTarifas = z.array(
        tarifaServicioSchema.omit({ id_tarifa_servicio: true, created_at: true })
    ).safeParse(tarifasToInsert);

    if(!validatedTarifas.success) {
        console.error("Validation errors (updateTipoServicioAction - tarifas):", validatedTarifas.error.flatten().fieldErrors);
        return { success: false, message: "Error de validación en las nuevas tarifas del servicio." };
    }

    const { error: insertTarifasError } = await supabase
      .from("tarifas_servicio")
      .insert(validatedTarifas.data);

    if (insertTarifasError) {
      console.error(
        "Error inserting new tarifas_servicio. Message:", insertTarifasError.message, 
        "Code:", insertTarifasError.code, 
        "Details:", insertTarifasError.details, 
        "Hint:", insertTarifasError.hint,
        "Full error:", JSON.stringify(insertTarifasError, null, 2)
      );
      return { success: false, message: `Error al actualizar tarifas (inserción): ${insertTarifasError.message}` };
    }
  }

  revalidatePath("/tipos-servicio");
  const resultData = await getTipoServicioByIdAction(id_tipo_servicio_param);
  return { success: true, message: "Tipo de servicio actualizado exitosamente.", tipoServicio: resultData || undefined };
}


export async function deleteTipoServicioAction(id_tipo_servicio: string): Promise<{ success: boolean; message: string }> {
  const supabase = createClient();
  
  // ON DELETE CASCADE will handle deleting tarifas_servicio
  const { error } = await supabase.from("tipos_servicio").delete().eq("id_tipo_servicio", id_tipo_servicio);

  if (error) {
    console.error(
      "Error deleting tipo_servicio. Message:", error.message, 
      "Code:", error.code, 
      "Details:", error.details, 
      "Hint:", error.hint,
      "Full error:", JSON.stringify(error, null, 2)
    );
    return { success: false, message: `Error al eliminar tipo de servicio: ${error.message}` };
  }
  revalidatePath("/tipos-servicio");
  return { success: true, message: "Tipo de servicio eliminado exitosamente." };
}

    