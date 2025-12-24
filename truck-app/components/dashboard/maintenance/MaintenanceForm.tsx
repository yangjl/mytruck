"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { logMaintenance } from "@/app/actions/maintenance";
import { toast } from "sonner";

export function MaintenanceForm({ trucks }: { trucks: any[] }) {
  const [isPending, startTransition] = useTransition();
  const [truckId, setTruckId] = useState<string>("");
  const [type, setType] = useState<string>("maintenance");
  const [cost, setCost] = useState<string>("");
  const [vendor, setVendor] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!truckId) {
      toast.error("Please select a truck");
      return;
    }

    startTransition(async () => {
      try {
        await logMaintenance({
          truckId: parseInt(truckId),
          date: new Date(),
          type,
          cost: Math.round(parseFloat(cost) * 100), // Convert to cents
          vendor,
          notes,
        });
        toast.success("Maintenance logged successfully");
        // Reset form
        setCost("");
        setVendor("");
        setNotes("");
      } catch (error) {
        toast.error("Failed to log maintenance");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 border rounded-lg bg-card">
      <h3 className="text-lg font-semibold">Log Maintenance</h3>
      
      <div className="space-y-2">
        <Label>Truck</Label>
        <select 
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          value={truckId} 
          onChange={(e) => setTruckId(e.target.value)}
        >
          <option value="" disabled>Select truck</option>
          {trucks.map((truck) => (
            <option key={truck.id} value={String(truck.id)}>
              {truck.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label>Type</Label>
        <select 
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          value={type} 
          onChange={(e) => setType(e.target.value)}
        >
          <option value="maintenance">Maintenance</option>
          <option value="inspection">Inspection</option>
          <option value="wash">Car Wash</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label>Cost ($)</Label>
        <Input 
          type="number" 
          step="0.01" 
          placeholder="0.00" 
          value={cost}
          onChange={(e) => setCost(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Vendor</Label>
        <Input 
          placeholder="e.g. Joe's Garage" 
          value={vendor}
          onChange={(e) => setVendor(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Notes</Label>
        <Textarea 
          placeholder="Details..." 
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Logging..." : "Log Entry"}
      </Button>
    </form>
  );
}
