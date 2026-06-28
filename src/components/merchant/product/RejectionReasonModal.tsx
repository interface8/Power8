"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface RejectionReasonModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rejectionReason: string;
  onEdit: () => void;
}

export function RejectionReasonModal({
  open,
  onOpenChange,
  rejectionReason,
  onEdit,
}: RejectionReasonModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-red-600">Product rejected</DialogTitle>
          <DialogDescription className="pt-2">
            Review the reason below and update your product
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg border">
            {rejectionReason}
          </p>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Close
          </Button>
          <Button
            onClick={onEdit}
            className="bg-orange-500 hover:bg-orange-600 text-white w-full sm:w-auto"
          >
            Edit product
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}