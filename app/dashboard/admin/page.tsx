import { getUsers } from "@/app/actions/admin";
import { UserForm } from "@/components/admin-dashboard/UserForm";
import { UserList } from "@/components/admin-dashboard/UserList";

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const users = await getUsers();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin — User Management</h1>
        <p className="text-muted-foreground">Create and manage users.</p>
      </div>

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
