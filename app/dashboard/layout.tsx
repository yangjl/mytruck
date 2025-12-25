import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth";
import { LayoutDashboard, Clock, Wrench, Truck, LogOut, Users, Package, ShoppingCart, Menu } from "lucide-react";
import { auth } from "@/lib/auth";
import { Notifications } from "@/components/dashboard/Notifications";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const isAdmin = session?.user?.role === "admin";
  const isManager = session?.user?.role === "manager" || isAdmin;

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-gray-100 dark:bg-gray-900 border-r p-6 flex flex-col gap-4">
        <div className="font-bold text-xl mb-4 flex items-center gap-2">
          <Truck className="h-6 w-6" />
          Truck App
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex flex-col gap-2">
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
          {isManager && (
            <>
              <Link href="/dashboard/inventory">
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <Package className="h-4 w-4" />
                  Inventory
                </Button>
              </Link>
              <Link href="/dashboard/procurement">
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  Procurement
                </Button>
              </Link>
            </>
          )}
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
      <main className="flex-1 flex flex-col">
        <header className="flex justify-between items-center p-4 border-b">
          {/* Mobile Menu - Left Aligned */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="justify-start gap-2 min-h-[44px]">
                  <Menu className="h-4 w-4" />
                  Menu
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="flex items-center gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/time" className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Time Clock
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/maintenance" className="flex items-center gap-2">
                    <Wrench className="h-4 w-4" />
                    Maintenance
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/trucks" className="flex items-center gap-2">
                    <Truck className="h-4 w-4" />
                    Fleet
                  </Link>
                </DropdownMenuItem>
                {isManager && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/inventory" className="flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        Inventory
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/procurement" className="flex items-center gap-2">
                        <ShoppingCart className="h-4 w-4" />
                        Procurement
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/admin" className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Admin
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <form
                    action={async () => {
                      "use server";
                      await signOut();
                    }}
                  >
                    <button
                      type="submit"
                      className="w-full flex items-center gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 p-2 rounded-sm min-h-[44px]"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </form>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Desktop spacer for left alignment */}
          <div className="hidden md:block"></div>

          {/* Notifications - Right Aligned */}
          {isManager && <Notifications />}
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
