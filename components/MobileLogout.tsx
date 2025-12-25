"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function MobileLogout() {
  return (
    <button
      onClick={() => signOut()}
      className="w-full flex items-center gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 p-2 rounded-sm min-h-[44px]"
    >
      <LogOut className="h-4 w-4" />
      Sign Out
    </button>
  );
}