"use client";

import React, { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { createUser } from "@/app/actions/admin";

export function UserForm() {
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("employee");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return toast.error("Email is required");

    startTransition(async () => {
      try {
        await createUser({ email, name, role });
        toast.success("User created");
        setEmail("");
        setName("");
        setRole("employee");
      } catch (err) {
        console.error(err);
        toast.error("Failed to create user");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 border rounded-lg bg-card">
      <h3 className="text-lg font-semibold">Add User</h3>

      <div className="grid gap-2">
        <Input
          placeholder="email@mytruck.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="employee">Employee</option>
          <option value="manager">Manager</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Adding..." : "Create User"}
      </Button>
    </form>
  );
}
