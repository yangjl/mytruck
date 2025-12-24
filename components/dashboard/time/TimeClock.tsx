"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { clockIn, clockOut } from "@/app/actions/time-logs";
import { toast } from "sonner";

export function TimeClock({ activeLog }: { activeLog: any }) {
  const [isPending, startTransition] = useTransition();
  const [notes, setNotes] = useState("");

  const handleClockIn = () => {
    startTransition(async () => {
      try {
        await clockIn(notes);
        toast.success("Clocked in successfully");
        setNotes("");
      } catch (error) {
        toast.error("Failed to clock in");
      }
    });
  };

  const handleClockOut = () => {
    startTransition(async () => {
      try {
        await clockOut(notes);
        toast.success("Clocked out successfully");
        setNotes("");
      } catch (error) {
        toast.error("Failed to clock out");
      }
    });
  };

  if (activeLog) {
    return (
      <div className="p-6 border rounded-lg bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800">
        <h3 className="text-lg font-semibold mb-2 text-green-800 dark:text-green-300">Currently Clocked In</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Started at: {new Date(activeLog.startTime).toLocaleString()}
        </p>
        <div className="space-y-4">
          <Textarea
            placeholder="Add notes for this shift..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <Button 
            onClick={handleClockOut} 
            disabled={isPending}
            variant="destructive"
            className="w-full"
          >
            {isPending ? "Clocking Out..." : "Clock Out"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 border rounded-lg bg-card">
      <h3 className="text-lg font-semibold mb-4">Start Your Shift</h3>
      <div className="space-y-4">
        <Textarea
          placeholder="Optional notes..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <Button 
          onClick={handleClockIn} 
          disabled={isPending}
          className="w-full"
        >
          {isPending ? "Clocking In..." : "Clock In"}
        </Button>
      </div>
    </div>
  );
}
