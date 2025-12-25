import { getActiveTimeLog, getMyTimeLogs } from "@/app/actions/time-logs";
import { TimeClock } from "@/components/dashboard/time/TimeClock";
import { ManualTimeEntry } from "@/components/dashboard/time/ManualTimeEntry";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = 'force-dynamic';

export default async function TimePage() {
  const activeLog = await getActiveTimeLog();
  const logs = await getMyTimeLogs();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Time Clock</h1>
        <p className="text-muted-foreground">Manage your working hours.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-8">
          <TimeClock activeLog={activeLog} />
          <ManualTimeEntry />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {logs.length === 0 ? (
                <p className="text-sm text-muted-foreground">No logs found.</p>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className="flex justify-between items-start border-b pb-4 last:border-0">
                    <div>
                      <p className="font-medium">
                        {new Date(log.startTime).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(log.startTime).toLocaleTimeString()} -{" "}
                        {log.endTime ? new Date(log.endTime).toLocaleTimeString() : "Active"}
                      </p>
                      {log.notes && (
                        <p className="text-sm text-muted-foreground mt-1">{log.notes}</p>
                      )}
                    </div>
                    <div className={`px-2 py-1 rounded text-xs ${
                      log.status === 'active' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                    }`}>
                      {log.status}
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
