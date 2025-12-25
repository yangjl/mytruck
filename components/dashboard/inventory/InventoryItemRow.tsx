"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { deleteInventoryItem } from "@/app/actions/inventory";
import { toast } from "sonner";
import EditInventoryDialog from "./EditInventoryDialog";
import { ProcurementDialog } from "./ProcurementDialog";

export function InventoryItemRow({ item }: { item: any }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    startTransition(async () => {
      try {
        await deleteInventoryItem(item.id);
        toast.success("Item deleted");
      } catch (error) {
        toast.error("Failed to delete item");
      }
    });
  };

  return (
    <TableRow>
      <TableCell className="font-medium">{item.name}</TableCell>
      <TableCell>
        {item.quantity <= item.minQuantity ? (
          <Badge variant="destructive">Low Stock</Badge>
        ) : (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">In Stock</Badge>
        )}
      </TableCell>
      <TableCell className="flex items-center gap-2">
        <ProcurementDialog item={item} />
        <EditInventoryDialog item={item} />
        <Button onClick={handleDelete} size="icon" variant="ghost" className="text-red-600 min-h-[44px] min-w-[44px]" aria-label="Delete item">
          <Trash className="h-4 w-4" />
        </Button>
      </TableCell>
      <TableCell>{item.category || "-"}</TableCell>
      <TableCell>{item.sku || "-"}</TableCell>
      <TableCell>{item.location || "-"}</TableCell>
      <TableCell>
        {item.quantity} {item.unit}
      </TableCell>
      <TableCell className="hidden md:table-cell">{item.minQuantity}</TableCell>
    </TableRow>
  );
}
