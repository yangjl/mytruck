import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-gray-100 dark:bg-gray-900 border-r p-6 flex flex-col gap-4">
        <div className="font-bold text-xl mb-4">Truck App</div>
        <nav className="flex flex-col gap-2">
          <Link href="/dashboard">
            <Button variant="ghost" className="w-full justify-start">Dashboard</Button>
          </Link>
          <Link href="/dashboard/time">
            <Button variant="ghost" className="w-full justify-start">Time Clock</Button>
          </Link>
          <Link href="/dashboard/maintenance">
            <Button variant="ghost" className="w-full justify-start">Maintenance</Button>
          </Link>
          <Link href="/dashboard/trucks">
            <Button variant="ghost" className="w-full justify-start">Fleet</Button>
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
