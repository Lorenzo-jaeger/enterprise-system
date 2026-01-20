"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
// import { Button } from "@/components/ui/button" // Removed, using from within UserMenu or specific icons
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import {
    LayoutDashboard,
    Database,
    Users,
    FileText,
    Settings,
    Menu,
    Zap,
    ChevronLeft,
    ChevronRight,
    Newspaper,
    LineChart
} from "lucide-react"
import { useAuthStore } from "@/lib/store/auth-store"
import { useUiStore } from "@/lib/store/ui-store" // Import Store
import { useState, useEffect } from "react"
import { UserMenu } from "@/components/organisms/user-menu" // Import UserMenu
import { useCompany } from "@/lib/context/company-context" // Add import

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function AdminSidebar({ className }: SidebarProps) {
    const pathname = usePathname()
    const [open, setOpen] = useState(false)
    const [mounted, setMounted] = useState(false)
    const { settings } = useCompany() // Get settings

    // Store State
    const { isSidebarCollapsed, setSidebarCollapsed, toggleSidebar } = useUiStore()

    useEffect(() => {
        setMounted(true)
    }, [])

    // Automatic Collapse Logic based on Route
    useEffect(() => {
        if (pathname === "/admin") {
            setSidebarCollapsed(false) // Open on Home
        } else {
            setSidebarCollapsed(true) // Closed on other pages
        }
    }, [pathname, setSidebarCollapsed])

    const routes = [
        {
            label: "Home",
            icon: LayoutDashboard,
            href: "/admin",
            active: pathname === "/admin",
        },
        {
            label: "SQL Playground",
            icon: Database,
            href: "/admin/sql",
            active: pathname === "/admin/sql",
        },
        {
            label: "Notícias",
            icon: Newspaper,
            href: "/admin/news-manage",
            active: pathname === "/admin/news-manage",
        },
        {
            label: "Métricas",
            icon: LineChart,
            href: "/admin/analytics",
            active: pathname === "/admin/analytics",
        },
        {
            label: "Usuários",
            icon: Users,
            href: "/admin/users",
            active: pathname === "/admin/users",
            disabled: true
        },
        {
            label: "Relatórios",
            icon: FileText,
            href: "/admin/reports",
            active: pathname === "/admin/reports",
            disabled: true
        },
        {
            label: "Configurações",
            icon: Settings,
            href: "/admin/settings/company",
            active: pathname?.startsWith("/admin/settings"),
            disabled: false
        },
    ]

    const collapsed = mounted ? isSidebarCollapsed : false;

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-muted/20 border-r relative transition-all duration-300 backdrop-blur-xl"> {/* Glassmorphism */}
            {/* Header */}
            <div className={cn("h-16 flex items-center border-b border-border/50 transition-all px-4", collapsed ? "justify-center" : "justify-between")}>
                {/* Expanded Logo */}
                <Link href="/admin" className={cn("flex items-center gap-2 font-bold text-lg tracking-tight hover:opacity-80 transition-all overflow-hidden whitespace-nowrap", collapsed ? "hidden" : "w-auto opacity-100")}>
                    <div className="h-8 w-8 min-w-[2rem] flex items-center justify-center overflow-hidden">
                        {settings?.logoUrl ? (
                            <img src={settings.logoUrl.startsWith('http') ? settings.logoUrl : `http://localhost:3001${settings.logoUrl}`} alt="Logo" className="w-full h-full object-contain" />
                        ) : (
                            <Zap className="h-5 w-5 text-primary" />
                        )}
                    </div>
                    <span className="transition-all duration-300">{settings?.companyName || "Enterprise"}</span>
                </Link>

                {/* Collapsed Logo (Click to Expand) */}
                {collapsed && (
                    <div
                        onClick={toggleSidebar}
                        className="absolute left-1/2 -translate-x-1/2 cursor-pointer hover:scale-105 transition-transform"
                        title="Expandir Menu"
                    >
                        <div className="h-8 w-8 min-w-[2rem] flex items-center justify-center overflow-hidden">
                            {settings?.logoUrl ? (
                                <img src={settings.logoUrl.startsWith('http') ? settings.logoUrl : `http://localhost:3001${settings.logoUrl}`} alt="Logo" className="w-full h-full object-contain" />
                            ) : (
                                <Zap className="h-5 w-5 text-primary" />
                            )}
                        </div>
                    </div>
                )}

                {/* Desktop Collapse Trigger (Visible ONLY when Expanded) */}
                {!collapsed && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="hidden md:flex h-7 w-7 rounded-lg hover:bg-muted"
                        onClick={toggleSidebar}
                        title="Recolher"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                )}
            </div>

            <ScrollArea className="flex-1 px-3 py-4">
                <div className="space-y-1">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.disabled ? "#" : route.href}
                            onClick={() => {
                                if (route.disabled) return;
                                setOpen(false);
                            }}
                            className={cn(
                                "flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 group relative",
                                collapsed ? "justify-center" : "gap-3",
                                route.active
                                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                                route.disabled && "opacity-50 cursor-not-allowed"
                            )}
                            title={collapsed ? route.label : undefined}
                        >
                            <route.icon className={cn("h-4 w-4 min-w-[1rem] transition-all", collapsed ? "h-5 w-5" : "")} />

                            <span className={cn("transition-all duration-300 overflow-hidden whitespace-nowrap", collapsed ? "w-0 opacity-0 absolute" : "w-auto opacity-100 relative")}>
                                {route.label}
                            </span>
                        </Link>
                    ))}
                </div>
            </ScrollArea>

            <div className="p-3 border-t border-border/50 bg-background/30 backdrop-blur-md">
                <UserMenu collapsed={collapsed} />
            </div>
        </div>
    )

    return (
        <>
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="md:hidden fixed top-3 left-3 z-40 bg-background/80 backdrop-blur-md border shadow-sm rounded-xl">
                        <Menu className="h-5 w-5" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-72 border-r-0">
                    <SidebarContent />
                </SheetContent>
            </Sheet>

            <div
                className={cn(
                    "hidden md:flex flex-col fixed inset-y-0 z-50 transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)",
                    collapsed ? "w-[80px]" : "w-72",
                    className
                )}
            >
                <SidebarContent />
            </div>
        </>
    )
}

// Helper to render content fully expanded in mobile sheet

