"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addTruck } from "@/app/actions/trucks";
import { toast } from "sonner";

export function AddTruckForm() {
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        await addTruck(name);
        toast.success("Truck added successfully");
        setName("");
      } catch (error) {
        toast.error("Failed to add truck");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-end">
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Input
          type="text"
          placeholder="Truck Name (e.g. Truck #101)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <Button type="submit" disabled={isPending} className="min-h-[44px]">
        {isPending ? "Adding..." : "Add Truck"}
      </Button>
    </form>
  );
}
