import { getMaintenanceLogs } from "@/app/actions/maintenance";
import { getTrucks } from "@/app/actions/trucks";
import { MaintenanceForm } from "@/components/dashboard/maintenance/MaintenanceForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = 'force-dynamic';

export default async function MaintenancePage() {
  const logs = await getMaintenanceLogs();
  const trucks = await getTrucks();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Maintenance Log</h1>
        <p className="text-muted-foreground">Track maintenance, inspections, and washes.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <MaintenanceForm trucks={trucks} />
        </div>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {logs.length === 0 ? (
                <p className="text-sm text-muted-foreground">No maintenance logs found.</p>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className="flex justify-between items-start border-b pb-4 last:border-0">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{log.truckName}</span>
                        <span className={`text-xs px-2 py-0.5 rounded capitalize ${
                          log.type === 'maintenance' ? 'bg-orange-100 text-orange-800' :
                          log.type === 'inspection' ? 'bg-blue-100 text-blue-800' :
                          'bg-cyan-100 text-cyan-800'
                        }`}>
                          {log.type}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {new Date(log.date).toLocaleDateString()} • {log.vendor || 'Unknown Vendor'}
                      </p>
                      {log.notes && (
                        <p className="text-sm text-muted-foreground mt-1">{log.notes}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">Logged by {log.userName}</p>
                    </div>
                    <div className="font-semibold">
                      ${(log.cost / 100).toFixed(2)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
