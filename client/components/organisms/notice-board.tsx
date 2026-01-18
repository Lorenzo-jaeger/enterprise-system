"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Bell, Calendar, ChevronRight, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/lib/store/auth-store"
import { useEffect, useState } from "react"

const notices = [
    {
        id: 1,
        title: "Manutenção Programada do Servidor",
        desc: "Neste final de semana realizaremos uma atualização crítica nos servidores. Podem ocorrer instabilidades.",
        date: "Hoje, 10:30",
        tag: "IMPORTANTE",
        tagColor: "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300",
        image: "https://images.unsplash.com/photo-1558494949-ef526b01201b?auto=format&fit=crop&q=80&w=1000",
        link: "#"
    },
    {
        id: 2,
        title: "Festa de Final de Ano",
        desc: "Confirme sua presença até sexta-feira! Teremos sorteios e música ao vivo.",
        date: "Ontem",
        tag: "EVENTO",
        tagColor: "bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-300",
        image: null,
        link: "#"
    }
]

export function NoticeBoard() {
    const user = useAuthStore((state) => state.user)
    const [greeting, setGreeting] = useState("")

    useEffect(() => {
        const hour = new Date().getHours()
        if (hour < 12) setGreeting("Bom dia")
        else if (hour < 18) setGreeting("Boa tarde")
        else setGreeting("Boa noite")
    }, [])

    return (
        <Card className="flex flex-col h-full min-h-[300px] shadow-sm border-blue-500/20 overflow-hidden">
            <CardHeader className="pb-2 border-b bg-muted/20">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <Bell className="h-4 w-4 text-blue-500" />
                            Mural de Avisos
                        </CardTitle>
                        <CardDescription className="text-xs">
                             {greeting}, <span className="font-semibold text-foreground">{user?.name || "Colaborador"}</span>.
                        </CardDescription>
                    </div>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                         <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="flex-1 p-0 overflow-y-auto">
                <div className="flex flex-col">
                    {notices.map((notice, i) => (
                        <div 
                            key={notice.id} 
                            className={`
                                group relative p-4 transition-all hover:bg-muted/40 cursor-pointer border-b last:border-0
                                ${i === 0 ? 'bg-gradient-to-r from-background to-blue-50/10 dark:to-blue-950/5' : ''}
                            `}
                            onClick={() => window.open(notice.link, '_blank')}
                        >
                            {/* Start Featured Image for first item */}
                            {i === 0 && notice.image && (
                                <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 group-hover:opacity-20 transition-opacity bg-cover bg-center mask-linear" 
                                    style={{ backgroundImage: `url(${notice.image})`, maskImage: 'linear-gradient(to left, black, transparent)' }} 
                                />
                            )}
                            
                            <div className="relative z-10">
                                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {notice.date}</span>
                                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${notice.tagColor}`}>{notice.tag}</span>
                                </div>
                                <h3 className="font-semibold text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center gap-2">
                                    {notice.title}
                                    <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-50 transition-opacity" />
                                </h3>
                                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                                    {notice.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
