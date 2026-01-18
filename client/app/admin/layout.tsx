"use client"

import { AdminSidebar } from "@/components/organisms/admin-sidebar"
import { useUiStore } from "@/lib/store/ui-store"
import { cn } from "@/lib/utils"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isSidebarCollapsed } = useUiStore()

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Sidebar - Fixed Height handled internally */}
      <AdminSidebar />

      {/* Main Content Area - Fixed Layout Container */}
      <main
        className={cn(
            "flex-1 flex flex-col h-full relative transition-all duration-300 ease-in-out overflow-hidden", // No scroll here, children must scroll
            isSidebarCollapsed ? "md:pl-[80px]" : "md:pl-72"
        )}
      >
        <div className="h-full w-full">
            {children}
        </div>
      </main>
    </div>
  )
}
