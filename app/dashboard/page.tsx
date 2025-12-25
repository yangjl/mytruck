import { getMyTimeLogs } from "@/app/actions/time-logs";
import { getMaintenanceLogs } from "@/app/actions/maintenance";
import { getInventoryItems } from "@/app/actions/inventory";
import { getTrucks } from "@/app/actions/trucks";
import { getAllTimeLogs } from "@/app/actions/time-logs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { Package, Truck, Clock, AlertTriangle, CheckCircle, Wrench } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await auth();
  const isAdmin = session?.user?.role === "admin";
  const isManager = session?.user?.role === "manager" || isAdmin;

  const timeLogs = await getMyTimeLogs();
  const maintenanceLogs = await getMaintenanceLogs();

  // Calculate total hours this week (mock calculation)
  const totalHours = timeLogs.reduce((acc, log) => {
    if (log.endTime) {
      const duration = new Date(log.endTime).getTime() - new Date(log.startTime).getTime();
      return acc + duration;
    }
    return acc;
  }, 0) / (1000 * 60 * 60);

  // Calculate total maintenance cost
  const totalCost = maintenanceLogs.reduce((acc, log) => acc + log.cost, 0) / 100;

  // Manager/Admin specific data
  let inventoryItems = [];
  let trucks = [];
  let allTimeLogs = [];
  let lowStockCount = 0;
  let totalFleetHours = 0;
  let activeTrucks = 0;

  if (isManager) {
    inventoryItems = await getInventoryItems();
    trucks = await getTrucks();
    allTimeLogs = await getAllTimeLogs();

    // Calculate low stock items
    lowStockCount = inventoryItems.filter(item => item.quantity <= item.minQuantity).length;

    // Calculate total fleet hours (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    totalFleetHours = allTimeLogs.reduce((acc, log) => {
      if (log.endTime && new Date(log.startTime) >= thirtyDaysAgo) {
        const duration = new Date(log.endTime).getTime() - new Date(log.startTime).getTime();
        return acc + duration;
      }
      return acc;
    }, 0) / (1000 * 60 * 60);

    // Count active trucks
    activeTrucks = trucks.filter(truck => truck.status === "active").length;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          {isManager ? "Operations overview and key metrics." : "Welcome back."}
        </p>
      </div>

      {/* Manager/Admin Summary Cards */}
      {isManager && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Link href="/dashboard/inventory">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Inventory Status</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold flex items-center gap-2">
                  {lowStockCount > 0 ? (
                    <>
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                      {lowStockCount}
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      {inventoryItems.length}
                    </>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {lowStockCount > 0 ? `${lowStockCount} items low stock` : "All items in stock"}
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/trucks">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Fleet Health</CardTitle>
                <Truck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  {activeTrucks}/{trucks.length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Active trucks in fleet
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href={isAdmin ? "/dashboard/admin" : "/dashboard/time"}>
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Team Hours</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalFleetHours.toFixed(1)}</div>
                <p className="text-xs text-muted-foreground">Hours logged (30 days)</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/maintenance">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
                <Wrench className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalCost.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Total maintenance spend</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      )}

      {/* Personal Dashboard for Regular Users */}
      {!isManager && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Link href="/dashboard/time">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">My Hours</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalHours.toFixed(1)}</div>
                <p className="text-xs text-muted-foreground">Lifetime hours logged</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/dashboard/maintenance">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
                <Wrench className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalCost.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Total maintenance logged</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4">
            {!isAdmin && (
              <Link href="/dashboard/time">
                <Button className="min-h-[44px]">Time Clock</Button>
              </Link>
            )}
            <Link href="/dashboard/maintenance">
              <Button variant="outline" className="min-h-[44px]">Log Maintenance</Button>
            </Link>
            {isManager && (
              <>
                <Link href="/dashboard/inventory">
                  <Button variant="outline" className="min-h-[44px]">Inventory</Button>
                </Link>
                {isAdmin && (
                  <Link href="/dashboard/admin">
                    <Button variant="outline" className="min-h-[44px]">Admin</Button>
                  </Link>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
