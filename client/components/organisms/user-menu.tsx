"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuthStore } from "@/lib/store/auth-store"
import { useTheme } from "next-themes"
import { 
    LogOut, 
    User, 
    Sun, 
    Moon, 
    Laptop, 
    Settings,
    ChevronsUpDown
} from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function UserMenu({ collapsed }: { collapsed?: boolean }) {
    const { user, logout } = useAuthStore()
    const { setTheme } = useTheme()
    const router = useRouter()

    const handleLogout = () => {
        logout()
        toast.info("Você saiu do sistema.")
        router.push("/login")
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className={`flex items-center gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer transition-all ${collapsed ? 'justify-center' : ''}`}>
                    <Avatar className="h-9 w-9 border flex-shrink-0">
                        <AvatarImage src={`https://ui-avatars.com/api/?name=${user?.name || "User"}&background=random`} />
                        <AvatarFallback>US</AvatarFallback>
                    </Avatar>
                    {!collapsed && (
                        <>
                            <div className="flex flex-col text-left flex-1 overflow-hidden">
                                <span className="text-sm font-medium truncate">{user?.name || "Usuário"}</span>
                                <span className="text-xs text-muted-foreground truncate">{user?.email}</span>
                            </div>
                            <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
                        </>
                    )}
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start" side="right" sideOffset={18}>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user?.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        <span>Meu Perfil</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                     <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                            <Sun className="mr-2 h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <Moon className="absolute mr-2 h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                            <span>Tema</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                             <DropdownMenuItem onClick={() => setTheme("light")}>
                                <Sun className="mr-2 h-4 w-4" />
                                <span>Claro</span>
                            </DropdownMenuItem>
                             <DropdownMenuItem onClick={() => setTheme("dark")}>
                                <Moon className="mr-2 h-4 w-4" />
                                <span>Escuro</span>
                            </DropdownMenuItem>
                             <DropdownMenuItem onClick={() => setTheme("system")}>
                                <Laptop className="mr-2 h-4 w-4" />
                                <span>Sistema</span>
                            </DropdownMenuItem>
                        </DropdownMenuSubContent>
                    </DropdownMenuSub>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair do Sistema</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
