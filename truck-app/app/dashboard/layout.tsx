import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth";
import { LayoutDashboard, Clock, Wrench, Truck, LogOut, Users } from "lucide-react";
import { auth } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const isAdmin = session?.user?.role === "admin";

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-gray-100 dark:bg-gray-900 border-r p-6 flex flex-col gap-4">
        <div className="font-bold text-xl mb-4 flex items-center gap-2">
          <Truck className="h-6 w-6" />
          Truck App
        </div>
        <nav className="flex flex-col gap-2">
          <Link href="/dashboard">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          <Link href="/dashboard/time">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Clock className="h-4 w-4" />
              Time Clock
            </Button>
          </Link>
          <Link href="/dashboard/maintenance">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Wrench className="h-4 w-4" />
              Maintenance
            </Button>
          </Link>
          <Link href="/dashboard/trucks">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Truck className="h-4 w-4" />
              Fleet
            </Button>
          </Link>
          {isAdmin && (
            <Link href="/dashboard/admin">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <Users className="h-4 w-4" />
                Admin
              </Button>
            </Link>
          )}
          <div className="mt-auto pt-4 border-t">
            <form
              action={async () => {
                "use server";
                await signOut();
              }}
            >
              <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 gap-2">
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </form>
          </div>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
