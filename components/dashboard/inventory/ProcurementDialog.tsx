"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createProcurementOrder, getEmployees } from "@/app/actions/procurement";
import { toast } from "sonner";
import { ShoppingCart } from "lucide-react";

export function ProcurementDialog({ item }: { item: any }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [employees, setEmployees] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    assignedUserId: "",
    quantity: "10",
    notes: "",
  });

  const handleOpen = async (open: boolean) => {
    setOpen(open);
    if (open && employees.length === 0) {
      const users = await getEmployees();
      setEmployees(users);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        await createProcurementOrder({
          inventoryItemId: item.id,
          assignedUserId: formData.assignedUserId ? parseInt(formData.assignedUserId) : undefined,
          quantity: parseInt(formData.quantity),
          notes: formData.notes,
        });
        toast.success("Procurement order created");
        setOpen(false);
        setFormData({
          assignedUserId: "",
          quantity: "10",
          notes: "",
        });
      } catch (error) {
        toast.error("Failed to create order");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1 min-h-[44px]">
          <ShoppingCart className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Restock
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Restock {item.name}</DialogTitle>
            <DialogDescription>
              Create a procurement order to restock this item.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">
                Quantity
              </Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="assignedUser" className="text-right">
                Assign To
              </Label>
              <select
                id="assignedUser"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 col-span-3"
                value={formData.assignedUserId}
                onChange={(e) => setFormData({ ...formData, assignedUserId: e.target.value })}
              >
                <option value="">Select an employee...</option>
                {employees.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.role})
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                Notes
              </Label>
              <Input
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button type="submit" disabled={isPending} className="w-full sm:w-auto min-h-[44px]">
              {isPending ? "Creating..." : "Create Order"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
