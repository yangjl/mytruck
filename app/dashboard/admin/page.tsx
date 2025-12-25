import { getUsers } from "@/app/actions/admin";
import { getAllTimeLogs } from "@/app/actions/time-logs";
import { UserForm } from "@/components/admin/UserForm";
import { UserList } from "@/components/admin/UserList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const users = await getUsers();
  const allTimeLogs = await getAllTimeLogs();

  // Calculate hours for each user
  const userHours = users.map(user => {
    const userLogs = allTimeLogs.filter(log => log.user?.id === user.id);
    const totalHours = userLogs.reduce((acc, log) => {
      if (log.endTime) {
        const duration = new Date(log.endTime).getTime() - new Date(log.startTime).getTime();
        return acc + duration;
      }
      return acc;
    }, 0) / (1000 * 60 * 60);

    return {
      ...user,
      totalHours: totalHours,
      lastLog: userLogs.length > 0 ? userLogs[0] : null
    };
  });

  // Separate employees and managers
  const employees = userHours.filter(user => user.role === 'employee');
  const managers = userHours.filter(user => user.role === 'manager');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage users and monitor team activity.</p>
      </div>

      {/* Hours Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Team Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userHours.reduce((acc, user) => acc + user.totalHours, 0).toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">All time logged</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employees.length}</div>
            <p className="text-xs text-muted-foreground">Employee count</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Managers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{managers.length}</div>
            <p className="text-xs text-muted-foreground">Manager count</p>
          </CardContent>
        </Card>
      </div>

      {/* Employee Hours */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Hours</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {employees.length === 0 ? (
              <p className="text-muted-foreground">No employees found.</p>
            ) : (
              employees.map(employee => (
                <div key={employee.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{employee.name}</p>
                    <p className="text-sm text-muted-foreground">{employee.email}</p>
                    {employee.lastLog && (
                      <p className="text-xs text-muted-foreground">
                        Last active: {new Date(employee.lastLog.startTime).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{employee.totalHours.toFixed(1)}</p>
                    <p className="text-sm text-muted-foreground">hours</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Manager Hours */}
      <Card>
        <CardHeader>
          <CardTitle>Manager Hours</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {managers.length === 0 ? (
              <p className="text-muted-foreground">No managers found.</p>
            ) : (
              managers.map(manager => (
                <div key={manager.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{manager.name}</p>
                    <p className="text-sm text-muted-foreground">{manager.email}</p>
                    {manager.lastLog && (
                      <p className="text-xs text-muted-foreground">
                        Last active: {new Date(manager.lastLog.startTime).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{manager.totalHours.toFixed(1)}</p>
                    <p className="text-sm text-muted-foreground">hours</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* User Management Section */}
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <UserForm />
        </div>
        <div className="md:col-span-2">
          <UserList users={users} />
        </div>
      </div>
    </div>
  );
}
