"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Ship, FolderKanban, Code2, Plus } from "lucide-react";
import { UserButton, useUser } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from "@/components/ui/sidebar";

export function AppSidebar({ projects }: any) {
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <Sidebar
      collapsible="icon"
      style={
        {
          "--sidebar-background": "linear-gradient(180deg, #f0f2e8 0%, #e8edd8 100%)",
        } as React.CSSProperties
      }
      className="[&>[data-sidebar=sidebar]]:bg-[linear-gradient(180deg,#f0f2e8_0%,#e8edd8_100%)] border-r border-black/[0.07]"
    >

      {/* ── Header: Brand ── */}
      <SidebarHeader className="px-4 py-4 border-b border-black/[0.07]">
        <div className="flex items-center gap-2.5">
          <div
            className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0"
            style={{
              background: "linear-gradient(135deg, #2d6a30 0%, #3a8c3f 100%)",
              boxShadow: "0 2px 10px rgba(45,106,48,0.30)",
            }}
          >
            <Ship className="h-4 w-4 text-white" />
          </div>
          <div className="group-data-[collapsible=icon]:hidden">
            <p className="text-sm font-semibold tracking-tight text-gray-800">Flow<span className="text-green-800">Ship</span></p>
            <p className="text-[11px] text-gray-400">AI project copilot</p>
          </div>
        </div>
      </SidebarHeader>

      {/* ── Content ── */}
      <SidebarContent>

        {/* Actions group */}
        <SidebarGroup>
          <SidebarGroupContent className="space-y-1">

            {/* New Project */}
            <SidebarMenuItem className="list-none">
              <SidebarMenuButton
                asChild
                className="h-auto px-4 py-2.5 rounded-md font-semibold text-white hover:text-white hover:opacity-90 active:opacity-80"
                style={{
                  background: "linear-gradient(135deg, #2d6a30 0%, #3a8c3f 100%)",
                  boxShadow: "0 2px 10px rgba(45,106,48,0.28)",
                }}
              >
                <Link href="/">
                  <Plus className="h-4 w-4 shrink-0" />
                  <span>New project</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* Code Review */}
            <SidebarMenuItem className="list-none pt-1.5">
              <SidebarMenuButton
                asChild
                isActive={pathname === "/code-review"}
                className={cn(
                  "rounded-md font-medium",
                  pathname === "/code-review"
                    ? "bg-white/60 text-gray-800 shadow-sm hover:bg-white/70"
                    : "text-gray-500 hover:bg-white/40 hover:text-gray-700"
                )}
              >
                <Link href="/code-review">
                  <Code2 className="h-4 w-4 shrink-0" />
                  <span>Code review</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Projects group */}
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-gray-400 font-semibold">
            <FolderKanban className="h-3.5 w-3.5 text-gray-400" />
            Projects
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>

              {Array.isArray(projects) && projects.length === 0 && (
                <p className="px-3 py-2 text-xs text-gray-400 group-data-[collapsible=icon]:hidden">
                  No projects yet. Create one to get started.
                </p>
              )}

              {Array.isArray(projects) &&
                projects.map((p: any) => (
                  <SidebarMenuItem key={p.id}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === `/p/${p.id}`}
                      className={cn(
                        "rounded-md h-auto py-2",
                        pathname === `/p/${p.id}`
                          ? "bg-white/60 text-gray-800 shadow-sm hover:bg-white/70"
                          : "text-gray-500 hover:bg-white/40 hover:text-gray-700"
                      )}
                    >
                      <Link href={`/p/${p.id}`}>
                        {/* Collapsed: letter avatar */}
                        <span className="flex h-5 w-5 items-center justify-center rounded text-xs font-bold bg-white/50 text-gray-600 shrink-0 group-data-[collapsible=icon]:flex hidden">
                          {p.title?.slice(0, 1).toUpperCase()}
                        </span>

                        {/* Expanded: title + meta */}
                        <span className="group-data-[collapsible=icon]:hidden flex flex-col min-w-0">
                          <span className="text-sm font-medium truncate text-gray-800">
                            {p.title}
                          </span>
                          {p.tasks && (
                            <span className="text-[11px] text-gray-400 truncate">
                              {p.tasks.length} tasks ·{" "}
                              {new Date(p.createdAt).toLocaleDateString()}
                            </span>
                          )}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}

            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

      </SidebarContent>

      {/*Footer: User*/}
      <SidebarFooter className="border-t border-black/[0.07]">
        <div className="flex items-center gap-3 px-2 py-1">
          <UserButton />
          <div className="group-data-[collapsible=icon]:hidden min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-800 truncate">
              {user?.fullName ?? user?.firstName ?? ""}
            </p>
            <p className="text-[11px] text-gray-400 truncate">
              {user?.primaryEmailAddress?.emailAddress ?? ""}
            </p>
          </div>
        </div>
      </SidebarFooter>

    </Sidebar>
  );
}