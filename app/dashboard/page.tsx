import { getMyTimeLogs } from "@/app/actions/time-logs";
import { getMaintenanceLogs } from "@/app/actions/maintenance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHours.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">Lifetime hours logged</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance Spend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalCost.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Total fleet maintenance</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Link href="/dashboard/time">
              <Button className="min-h-[44px]">Time Clock</Button>
            </Link>
            <Link href="/dashboard/maintenance">
              <Button variant="outline" className="min-h-[44px]">Log Maintenance</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
