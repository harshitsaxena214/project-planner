"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Ship,
  FolderKanban,
  Code2,
  Plus,
  MoreHorizontal,
  Trash,
} from "lucide-react";
import { UserButton, useUser } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { useProjects } from "@/hooks/useProjects";

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

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AppSidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const { projects, deleteProject, isLoading } = useProjects();

  return (
    <Sidebar
      collapsible="icon"
      style={
        {
          "--sidebar-background":
            "linear-gradient(180deg, #f0f2e8 0%, #e8edd8 100%)",
        } as React.CSSProperties
      }
      className="[&>[data-sidebar=sidebar]]:bg-[linear-gradient(180deg,#f0f2e8_0%,#e8edd8_100%)] border-r border-black/[0.07]"
    >
      {/* Header */}
      <SidebarHeader className="px-4 py-4 border-b border-black/[0.07]">
        <div className="flex items-center gap-2.5">
          <div
            className="h-9 w-9 rounded-lg flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #2d6a30 0%, #3a8c3f 100%)",
            }}
          >
            <Ship className="h-4 w-4 text-white" />
          </div>

          <div className="group-data-[collapsible=icon]:hidden">
            <p className="text-sm font-semibold text-gray-800">
              Flow<span className="text-green-800">Ship</span>
            </p>
            <p className="text-[11px] text-gray-400">AI project copilot</p>
          </div>
        </div>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent>
        {/* Actions */}
        <SidebarGroup>
          <SidebarGroupContent className="space-y-1">
            <SidebarMenuItem className="list-none">
              <SidebarMenuButton
                asChild
                className="px-4 py-2.5 text-white rounded-md"
                style={{
                  background:
                    "linear-gradient(135deg, #2d6a30 0%, #3a8c3f 100%)",
                }}
              >
                <Link href="/">
                  <Plus className="h-4 w-4" />
                  <span>New project</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem className="list-none pt-1.5">
              <SidebarMenuButton
                asChild
                isActive={pathname === "/code-review"}
                className={cn(
                  "rounded-md",
                  pathname === "/code-review"
                    ? "bg-white/60 text-gray-800"
                    : "text-gray-500 hover:bg-white/40",
                )}
              >
                <Link href="/code-review">
                  <Code2 className="h-4 w-4" />
                  <span>Code review</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Projects */}
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2 text-xs text-gray-400 uppercase">
            <FolderKanban className="h-3.5 w-3.5" />
            Projects
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {isLoading && (
                <p className="px-3 py-2 text-xs text-gray-400">Loading...</p>
              )}

              {!isLoading && projects.length === 0 && (
                <p className="px-3 py-2 text-xs text-gray-400">
                  No projects yet
                </p>
              )}

              {projects.map((p: any) => (
                <SidebarMenuItem key={p.id} className="group/item relative">
                  <div className="flex items-center justify-between w-full">
                    {/* Project Link */}
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === `/p/${p.id}`}
                      className={cn(
                        "rounded-md h-auto py-2 w-full",
                        pathname === `/p/${p.id}`
                          ? "bg-white/60 text-gray-800"
                          : "text-gray-500 hover:bg-white/40",
                      )}
                    >
                      <Link
                        href={`/p/${p.id}`}
                        className="flex items-center gap-2 w-full"
                      >
                        <span className="truncate text-sm font-medium text-gray-800">
                          {p.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>

                    {/* Hover Menu */}
                    <div className="opacity-0 group-hover/item:opacity-100 absolute transition right-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-1 rounded hover:bg-black/10">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              deleteProject(p.id, {
                                onSuccess: () => {
                                  if (pathname === `/p/${p.id}`) {
                                    window.location.href = "/";
                                  }
                                },
                              });
                            }}
                            className="text-red-600 cursor-pointer"
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t">
        <div className="flex items-center gap-3 px-2 py-2">
          <UserButton />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium truncate">
              {user?.fullName ?? ""}
            </p>
            <p className="text-xs text-gray-400 truncate">
              {user?.primaryEmailAddress?.emailAddress ?? ""}
            </p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
