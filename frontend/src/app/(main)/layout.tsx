"use client";

import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";

import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Sidebar";
import { createApi } from "@/lib/api";

export default function MainLayout({ children }: any) {
  const { getToken } = useAuth();

  const { data: projects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const token = await getToken();
      const api = createApi(token);
      const res = await api.get("/projects/");
      return res.data.data;
    },
  });

  return (
    <SidebarProvider>
      <AppSidebar projects={projects} />
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
