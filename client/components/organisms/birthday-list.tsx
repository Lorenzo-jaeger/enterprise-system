"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Cake, Gift, Loader2, ChevronDown, Check, UserPlus, Home } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useEffect, useState } from "react"
import { useAuthStore } from "@/lib/store/auth-store"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"

interface PersonData {
    name: string
    role: string
    img: string | null
    isToday?: boolean // For birthdays
    date?: string // For anniversaries/new hires
}

export function BirthdayList({ className }: { className?: string }) {
    const { token } = useAuthStore()
    const [listData, setListData] = useState<PersonData[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<'birthdays' | 'anniversaries' | 'new_hires'>('birthdays')

    useEffect(() => {
        async function fetchData() {
            if (!token) return
            setLoading(true)
            try {
                let endpoint = "birthdays"
                if (activeTab === 'anniversaries') endpoint = "anniversaries"
                if (activeTab === 'new_hires') endpoint = "new-hires"

                const res = await fetch(`http://localhost:3001/admin/${endpoint}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                if (res.ok) {
                    const data = await res.json()
                    setListData(data)
                } else {
                    setListData([])
                }
            } catch (e) {
                console.error("Failed to fetch data", e)
                setListData([])
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [token, activeTab])

    const displayList = listData.slice(0, 4)
    const [open, setOpen] = useState(false)

    const getTitle = () => {
        switch (activeTab) {
            case 'anniversaries': return "Tempo de Casa"
            case 'new_hires': return "Novos Colaboradores"
            default: return "Aniversariantes"
        }
    }

    return (
        <Card className={`shadow-sm hover:shadow-md transition-shadow duration-300 border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden flex flex-col ${className}`}>
            <CardHeader className="p-3 border-b border-border/40 bg-muted/20">
                <div className="flex items-center justify-between">
                    <DropdownMenu>
                        <DropdownMenuTrigger className="focus:outline-none group">
                             <CardTitle className="text-sm font-semibold tracking-tight flex items-center gap-2 group-hover:text-primary transition-colors cursor-pointer">
                                {activeTab === 'birthdays' && <Cake className="h-4 w-4 text-pink-500" />}
                                {activeTab === 'anniversaries' && <Gift className="h-4 w-4 text-orange-500" />}
                                {activeTab === 'new_hires' && <div className="h-4 w-4 rounded-full bg-green-500 flex items-center justify-center text-[10px] text-white font-bold">+</div>}
                                <span>{getTitle()}</span>
                                <ChevronDown className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors ml-1" />
                            </CardTitle>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-[200px]">
                            <DropdownMenuItem onClick={() => setActiveTab('birthdays')} className="gap-2 cursor-pointer">
                                <Cake className="h-4 w-4 text-pink-500" />
                                <span>Aniversariantes</span>
                                {activeTab === 'birthdays' && <Check className="h-3 w-3 ml-auto text-primary" />}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setActiveTab('anniversaries')} className="gap-2 cursor-pointer">
                                <Home className="h-4 w-4 text-orange-500" />
                                <span>Tempo de Casa</span>
                                {activeTab === 'anniversaries' && <Check className="h-3 w-3 ml-auto text-primary" />}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setActiveTab('new_hires')} className="gap-2 cursor-pointer">
                                <UserPlus className="h-4 w-4 text-green-500" />
                                <span>Novos Colaboradores</span>
                                {activeTab === 'new_hires' && <Check className="h-3 w-3 ml-auto text-primary" />}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                {loading ? (
                    <div className="flex justify-center p-4"><Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /></div>
                ) : displayList.length > 0 ? (
                    <div className="flex flex-col">
                        {displayList.map((person, i) => (
                            <div key={i} className={`relative flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/30 ${i !== displayList.length - 1 ? 'border-b border-border/40' : ''}`}>
                                <Avatar className={`h-8 w-8 border ${person.isToday || activeTab === 'new_hires' ? 'border-pink-200 dark:border-pink-900' : 'border-transparent'}`}>
                                    <AvatarImage src={person.img || undefined} />
                                    <AvatarFallback className="text-[10px] bg-pink-50 text-pink-600 dark:bg-pink-900/50 dark:text-pink-300">
                                        {person.name.substring(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[13px] font-medium leading-none truncate mb-1 text-foreground/90">{person.name}</p>
                                    {/* Conditional Subtext based on Tab */}
                                    {activeTab === 'birthdays' ? (
                                        person.isToday ? (
                                            <p className="text-[10px] text-pink-500 font-bold tracking-wide uppercase">Happy Birthday!</p>
                                        ) : (
                                            <div className="flex items-center gap-1.5">
                                                <span className="w-1 h-1 rounded-full bg-blue-400" />
                                                <p className="text-[11px] text-muted-foreground font-medium">Amanhã</p>
                                            </div>
                                        )
                                    ) : activeTab === 'anniversaries' ? (
                                        <p className="text-[11px] text-orange-500 font-medium">{person.role}</p>
                                    ) : (
                                        <p className="text-[11px] text-green-600 font-medium">{person.role}</p>
                                    )}
                                </div>
                                {activeTab === 'birthdays' && person.isToday && <Gift className="h-3.5 w-3.5 text-pink-400" />}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-xs text-muted-foreground bg-accent/20 rounded-xl border border-dashed mx-4 mb-4 mt-4 py-6">
                        Nenhum registro encontrado.
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
