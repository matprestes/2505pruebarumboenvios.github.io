
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type * as z from "zod";
import { DataTable } from "@/components/data-table/data-table";
import { getTipoServicioColumns } from "./columns";
import { TipoServicioForm } from "./service-type-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import type { TipoServicio } from "@/types";
import { tipoServicioSchema } from "@/lib/schemas";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { 
  addTipoServicioAction, 
  updateTipoServicioAction, 
  deleteTipoServicioAction,
  getTipoServicioByIdAction
} from "@/app/tipos-servicio/actions";

interface TiposServicioDataTableProps {
  initialData: TipoServicio[];
  initialCount: number;
  pageSize: number;
  currentPage: number;
  currentQuery: string;
}

export default function TiposServicioDataTable({
  initialData,
  initialCount,
  pageSize,
  currentPage,
  currentQuery,
}: TiposServicioDataTableProps) {
  const [data, setData] = useState<TipoServicio[]>(initialData);
  const [totalCount, setTotalCount] = useState(initialCount);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTipoServicio, setEditingTipoServicio] = useState<Partial<TipoServicio> | null>(null);
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false);
  const [tipoServicioToDelete, setTipoServicioToDelete] = useState<TipoServicio | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    setData(initialData);
    setTotalCount(initialCount);
  }, [initialData, initialCount]);

  const handleNew = () => {
    setEditingTipoServicio(null);
    setIsFormOpen(true);
  };

  const handleEdit = async (tipoServicio: TipoServicio) => {
    if (!tipoServicio.id_tipo_servicio) {
      toast({ title: "Error", description: "ID de tipo de servicio no válido.", variant: "destructive" });
      return;
    }
    const fullTipoServicio = await getTipoServicioByIdAction(tipoServicio.id_tipo_servicio);
    setEditingTipoServicio(fullTipoServicio);
    setIsFormOpen(true);
  };

  const handleDelete = (tipoServicio: TipoServicio) => {
    setTipoServicioToDelete(tipoServicio);
    setIsConfirmDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (tipoServicioToDelete && tipoServicioToDelete.id_tipo_servicio) {
      setIsSubmitting(true);
      const result = await deleteTipoServicioAction(tipoServicioToDelete.id_tipo_servicio);
      if (result.success) {
        toast({ title: "Éxito", description: result.message });
        // Trigger re-fetch by navigating
        router.replace(\`\${pathname}?\${searchParams.toString()}\`);
      } else {
        toast({ title: "Error", description: result.message, variant: "destructive" });
      }
      setTipoServicioToDelete(null);
      setIsSubmitting(false);
    }
    setIsConfirmDeleteDialogOpen(false);
  };

  const handleFormSubmit = async (values: z.infer<typeof tipoServicioSchema>) => {
    setIsSubmitting(true);
    const action = editingTipoServicio?.id_tipo_servicio
      ? updateTipoServicioAction(editingTipoServicio.id_tipo_servicio, values)
      : addTipoServicioAction(values);
    
    const result = await action;

    if (result.success) {
      toast({ title: "Éxito", description: result.message });
      setIsFormOpen(false);
      setEditingTipoServicio(null);
      // Trigger re-fetch
      router.replace(\`\${pathname}?\${searchParams.toString()}\`);
    } else {
      toast({ title: "Error", description: result.message, variant: "destructive" });
    }
    setIsSubmitting(false);
  };
  
  const columns = useMemo(() => getTipoServicioColumns(handleEdit, handleDelete), []);

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        filterColumnId="nombre"
        filterPlaceholder="Filtrar por nombre..."
        newButtonLabel="Nuevo Tipo de Servicio"
        onNew={handleNew}
        onEdit={handleEdit} 
        onDelete={handleDelete}
        pageCount={Math.ceil(totalCount / pageSize)}
        currentPage={currentPage}
        currentQuery={currentQuery}
        pageSize={pageSize}
      />
      <Dialog open={isFormOpen} onOpenChange={(isOpen) => {
        if (!isOpen) setEditingTipoServicio(null);
        setIsFormOpen(isOpen);
      }}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingTipoServicio?.id_tipo_servicio ? "Editar Tipo de Servicio" : "Crear Nuevo Tipo de Servicio"}
            </DialogTitle>
            {editingTipoServicio?.id_tipo_servicio && <DialogDescription>ID: {editingTipoServicio.id_tipo_servicio}</DialogDescription>}
          </DialogHeader>
          <TipoServicioForm
            onSubmit={handleFormSubmit}
            initialData={editingTipoServicio as TipoServicio | null}
            onCancel={() => { setIsFormOpen(false); setEditingTipoServicio(null); }}
          />
        </DialogContent>
      </Dialog>
       <ConfirmDialog
        isOpen={isConfirmDeleteDialogOpen}
        onClose={() => setIsConfirmDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Confirmar Eliminación"
        description={\`¿Estás seguro de que deseas eliminar el tipo de servicio "\${tipoServicioToDelete?.nombre}"? Esta acción no se puede deshacer.\`}
      />
    </>
  );
}
