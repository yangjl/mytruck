import { getInventoryItems } from "@/app/actions/inventory";
import { InventoryTable } from "@/components/dashboard/inventory/InventoryTable";
import { AddInventoryDialog } from "@/components/dashboard/inventory/AddInventoryDialog";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function InventoryPage() {
  const session = await auth();
  if (!session?.user || (session.user.role !== "manager" && session.user.role !== "admin")) {
    redirect("/dashboard");
  }

  const items = await getInventoryItems();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
          <p className="text-muted-foreground">Manage truck parts and supplies.</p>
        </div>
        <AddInventoryDialog />
      </div>

      <InventoryTable items={items} />
    </div>
  );
}
