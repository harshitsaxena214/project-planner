"use client";

import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Sidebar";

export default function MainLayout({ children }: any) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="md:hidden flex items-center gap-2 px-4 py-3 border-b bg-white">
          <SidebarTrigger />
          <span className="font-semibold tracking-tight">
            <span className="text-black">Flow</span>
            <span className="text-green-800">Ship</span>
          </span>
        </div>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
