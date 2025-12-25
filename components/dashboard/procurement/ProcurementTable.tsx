"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { updateProcurementStatus } from "@/app/actions/procurement";
import { toast } from "sonner";
import { useTransition } from "react";

export function ProcurementTable({ orders }: { orders: any[] }) {
  const [isPending, startTransition] = useTransition();

  const handleStatusUpdate = (id: number, status: "Pending" | "Ordered" | "Restocked") => {
    startTransition(async () => {
      try {
        await updateProcurementStatus(id, status);
        toast.success(`Order status updated to ${status}`);
      } catch (error) {
        toast.error("Failed to update status");
      }
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "Ordered":
        return <Badge variant="default" className="bg-blue-500">Ordered</Badge>;
      case "Restocked":
        return <Badge variant="default" className="bg-green-500">Restocked</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Procurement Orders</CardTitle>
        <CardDescription>
          Manage and track inventory restocking orders.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No procurement orders found.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.itemName ?? order.inventoryItem?.name ?? "-"}</TableCell>
                  <TableCell>{order.quantity}</TableCell>
                  <TableCell>{order.assignedUser?.name ? order.assignedUser.name : (order.assignedUser ?? "Unassigned")}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="max-w-[200px] truncate" title={order.notes || ""}>
                    {order.notes || "-"}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {order.status === "Pending" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusUpdate(order.id, "Ordered")}
                          disabled={isPending}
                          className="min-h-[44px]"
                        >
                          Mark Ordered
                        </Button>
                      )}
                      {order.status === "Ordered" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusUpdate(order.id, "Restocked")}
                          disabled={isPending}
                          className="min-h-[44px]"
                        >
                          Mark Restocked
                        </Button>
                      )}
                      {order.status === "Restocked" && (
                        <span className="text-muted-foreground text-sm">Completed</span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
