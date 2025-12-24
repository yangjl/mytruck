"use client";

import React, { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { updateUserRole, deleteUser } from "@/app/actions/admin";

export function UserList({ users }: { users: any[] }) {
  const [isPending, startTransition] = useTransition();
  const [local, setLocal] = useState(users || []);

  const handleRoleChange = (id: number, role: string) => {
    startTransition(async () => {
      try {
        await updateUserRole(id, role);
        toast.success("Role updated");
        setLocal((s) => s.map((u) => (u.id === id ? { ...u, role } : u)));
      } catch (err) {
        console.error(err);
        toast.error("Failed to update role");
      }
    });
  };

  const handleDelete = (id: number) => {
    if (!confirm("Delete user?")) return;
    startTransition(async () => {
      try {
        await deleteUser(id);
        toast.success("User deleted");
        setLocal((s) => s.filter((u) => u.id !== id));
      } catch (err) {
        console.error(err);
        toast.error("Failed to delete user");
      }
    });
  };

  return (
    <div className="p-6 border rounded-lg bg-card">
      <h3 className="text-lg font-semibold mb-4">Users</h3>
      <div className="space-y-3">
        {local.length === 0 ? (
          <p className="text-sm text-muted-foreground">No users found.</p>
        ) : (
          local.map((u) => (
            <div key={u.id} className="flex items-center justify-between gap-4">
              <div>
                <div className="font-medium">{u.name || u.email}</div>
                <div className="text-sm text-muted-foreground">{u.email}</div>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={u.role}
                  onChange={(e) => handleRoleChange(u.id, e.target.value)}
                  className="flex h-8 rounded-md border border-input bg-background px-2 text-sm"
                >
                  <option value="employee">Employee</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
                <Button variant="destructive" onClick={() => handleDelete(u.id)}>
                  Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
