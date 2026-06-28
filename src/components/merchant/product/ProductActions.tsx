"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ProductActionsProps {
  productId: string;
  productName: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ProductActions({
  productId,
  productName,
  onEdit,
  onDelete,
}: ProductActionsProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDelete = () => {
    onDelete(productId);
    setDialogOpen(false);
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(productId)}
          className="h-8 w-8 p-0 hover:bg-orange-100 hover:text-orange-600"
        >
          <Pencil className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setDialogOpen(true)}
          className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {productName}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}