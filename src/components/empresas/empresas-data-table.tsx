
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { DataTable } from "@/components/data-table/data-table";
import { getEmpresaColumns } from "./columns";
import { EmpresaForm } from "./empresa-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import type { Empresa, SelectOption } from "@/types";
import { addEmpresaAction, updateEmpresaAction, deleteEmpresaAction, getEmpresaByIdAction, getTiposEmpresaForSelectAction } from "@/app/empresas/actions";
import { ConfirmDialog } from "@/components/confirm-dialog";

interface EmpresasDataTableProps {
  initialData: Empresa[];
  initialCount: number;
  pageSize: number;
  currentPage: number;
  currentQuery: string;
}

export default function EmpresasDataTable({
  initialData,
  initialCount,
  pageSize,
  currentPage,
  currentQuery,
}: EmpresasDataTableProps) {
  const [data, setData] = useState<Empresa[]>(initialData);
  const [totalCount, setTotalCount] = useState(initialCount);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEmpresa, setEditingEmpresa] = useState<Partial<Empresa> | null>(null);
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false);
  const [empresaToDelete, setEmpresaToDelete] = useState<Empresa | null>(null);
  const [tiposEmpresaOptions, setTiposEmpresaOptions] = useState<SelectOption[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    setData(initialData);
    setTotalCount(initialCount);
  }, [initialData, initialCount]);

  useEffect(() => {
    async function fetchOptions() {
      const tiposEmpresa = await getTiposEmpresaForSelectAction();
      setTiposEmpresaOptions(tiposEmpresa);
    }
    fetchOptions();
  }, []);

  const handleNew = () => {
    setEditingEmpresa(null);
    setIsFormOpen(true);
  };

  const handleEdit = async (empresa: Empresa) => {
    const fullEmpresa = await getEmpresaByIdAction(empresa.id);
    setEditingEmpresa(fullEmpresa);
    setIsFormOpen(true);
  };

  const handleDelete = (empresa: Empresa) => {
    setEmpresaToDelete(empresa);
    setIsConfirmDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (empresaToDelete) {
      setIsSubmitting(true);
      const result = await deleteEmpresaAction(empresaToDelete.id);
      if (result.success) {
        toast({ title: "Éxito", description: result.message });
        router.replace(`${pathname}?${searchParams.toString()}`);
      } else {
        toast({ title: "Error", description: result.message, variant: "destructive" });
      }
      setEmpresaToDelete(null);
      setIsSubmitting(false);
    }
    setIsConfirmDeleteDialogOpen(false);
  };

  const handleFormSubmit = async (values: any) => {
    setIsSubmitting(true);
    const action = editingEmpresa?.id ? updateEmpresaAction(editingEmpresa.id, values) : addEmpresaAction(values);
    const result = await action;

    if (result.success) {
      toast({ title: "Éxito", description: result.message });
      setIsFormOpen(false);
      setEditingEmpresa(null);
      router.replace(`${pathname}?${searchParams.toString()}`);
    } else {
      toast({ title: "Error", description: result.message, variant: "destructive" });
    }
    setIsSubmitting(false);
  };

  const columns = useMemo(() => getEmpresaColumns(handleEdit, handleDelete), []);

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        filterColumnId="razon_social"
        filterPlaceholder="Buscar por razón social, CUIT..."
        newButtonLabel="Nueva Empresa"
        onNew={handleNew}
        onEdit={handleEdit}
        onDelete={handleDelete}
        pageCount={Math.ceil(totalCount / pageSize)}
        currentPage={currentPage}
        currentQuery={currentQuery}
        pageSize={pageSize}
      />
      <Dialog open={isFormOpen} onOpenChange={(isOpen) => {
        if (!isOpen) setEditingEmpresa(null);
        setIsFormOpen(isOpen);
      }}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingEmpresa?.id ? "Editar Empresa" : "Crear Nueva Empresa"}
            </DialogTitle>
            {editingEmpresa?.id && <DialogDescription>ID: {editingEmpresa.id}</DialogDescription>}
          </DialogHeader>
          <EmpresaForm
            onSubmit={handleFormSubmit}
            initialData={editingEmpresa}
            onCancel={() => { setIsFormOpen(false); setEditingEmpresa(null); }}
            tiposEmpresaOptions={tiposEmpresaOptions}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>
      <ConfirmDialog
        isOpen={isConfirmDeleteDialogOpen}
        onClose={() => setIsConfirmDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Confirmar Eliminación"
        description={`¿Estás seguro de que deseas eliminar la empresa "${empresaToDelete?.razon_social}"? Esta acción no se puede deshacer.`}
      />
    </>
  );
}

    