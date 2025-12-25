import { getProcurementOrders } from "@/app/actions/procurement";
import { ProcurementTable } from "@/components/dashboard/procurement/ProcurementTable";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function ProcurementPage() {
  const session = await auth();
  if (!session?.user || (session.user.role !== "manager" && session.user.role !== "admin")) {
    redirect("/dashboard");
  }

  const orders = await getProcurementOrders();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Procurement</h1>
        <p className="text-muted-foreground">Track and manage inventory orders.</p>
      </div>

      <ProcurementTable orders={orders} />
    </div>
  );
}
