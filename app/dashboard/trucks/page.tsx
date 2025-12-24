import { getTrucks } from "@/app/actions/trucks";
import { AddTruckForm } from "@/components/dashboard/trucks/AddTruckForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = 'force-dynamic';

export default async function TrucksPage() {
  const trucks = await getTrucks();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Fleet Management</h1>
        <p className="text-muted-foreground">Manage your trucks.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Truck</CardTitle>
        </CardHeader>
        <CardContent>
          <AddTruckForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Truck List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {trucks.length === 0 ? (
              <p className="text-sm text-muted-foreground">No trucks found.</p>
            ) : (
              trucks.map((truck) => (
                <div key={truck.id} className="flex justify-between items-center border-b pb-4 last:border-0">
                  <div>
                    <p className="font-medium">{truck.name}</p>
                    <p className="text-sm text-muted-foreground">Status: {truck.status}</p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Added {new Date(truck.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
