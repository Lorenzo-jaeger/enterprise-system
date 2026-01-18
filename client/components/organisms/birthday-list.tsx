"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Cake, Gift, Loader2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useEffect, useState } from "react"
import { useAuthStore } from "@/lib/store/auth-store"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface BirthdayGuy {
    name: string
    role: string
    img: string | null
    isToday: boolean
}

export function BirthdayList() {
    const { token } = useAuthStore()
    const [birthdays, setBirthdays] = useState<BirthdayGuy[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchBirthdays() {
            if (!token) return
            try {
                const res = await fetch("http://localhost:3001/admin/birthdays", {
                    headers: { Authorization: `Bearer ${token}` }
                })
                if (res.ok) {
                    const data = await res.json()
                    setBirthdays(data)
                }
            } catch (e) {
                console.error("Failed to fetch birthdays", e)
            } finally {
                setLoading(false)
            }
        }
        fetchBirthdays()
    }, [token])

    const todayList = birthdays.filter(b => b.isToday)
    const tomorrowList = birthdays.filter(b => !b.isToday)
    
    const allBirthdays = [...todayList, ...tomorrowList]
    const displayList = allBirthdays.slice(0, 4)
    const [open, setOpen] = useState(false)

    return (
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-300 border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
            <CardHeader className="py-3 px-4 border-b border-border/40 bg-muted/20">
                <CardTitle className="text-sm font-semibold tracking-tight flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Cake className="h-4 w-4 text-pink-500" />
                        <span>Aniversariantes</span>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                {loading ? (
                    <div className="flex justify-center p-4"><Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /></div>
                ) : allBirthdays.length > 0 ? (
                    <div className="flex flex-col">
                        {displayList.map((person, i) => (
                            <div key={i} className={`relative flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/30 ${i !== displayList.length - 1 ? 'border-b border-border/40' : ''}`}>
                                <Avatar className={`h-8 w-8 border ${person.isToday ? 'border-pink-200 dark:border-pink-900' : 'border-transparent'}`}>
                                    <AvatarImage src={person.img || undefined} />
                                    <AvatarFallback className="text-[10px] bg-pink-50 text-pink-600 dark:bg-pink-900/50 dark:text-pink-300">
                                        {person.name.substring(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[13px] font-medium leading-none truncate mb-1 text-foreground/90">{person.name}</p>
                                    {person.isToday ? (
                                        <p className="text-[10px] text-pink-500 font-bold tracking-wide uppercase">Happy Birthday!</p>
                                    ) : (
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-1 h-1 rounded-full bg-blue-400" />
                                            <p className="text-[11px] text-muted-foreground font-medium">Amanhã</p>
                                        </div>
                                    )}
                                </div>
                                {person.isToday && <Gift className="h-3.5 w-3.5 text-pink-400" />}
                            </div>
                        ))}

                        {allBirthdays.length > 4 && (
                             <Dialog open={open} onOpenChange={setOpen}>
                                <DialogTrigger asChild>
                                    <div className="p-2 border-t border-border/40">
                                        <Button variant="ghost" className="w-full text-[11px] font-medium text-muted-foreground hover:text-foreground h-7 rounded-lg">
                                            Ver todos ({allBirthdays.length})
                                        </Button>
                                    </div>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle>Aniversariantes</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-6 py-4">
                                        {/* Today Section in Modal */}
                                        {todayList.length > 0 && (
                                            <div>
                                                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2 text-pink-500">
                                                    <Cake className="h-4 w-4" /> Hoje
                                                </h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {todayList.map((person, i) => (
                                                         <div key={i} className="flex items-center gap-3 p-3 rounded-xl border bg-pink-50/50 dark:bg-pink-900/10">
                                                            <Avatar className="h-10 w-10">
                                                                <AvatarImage src={person.img || undefined} />
                                                                <AvatarFallback>{person.name.substring(0,2)}</AvatarFallback>
                                                            </Avatar>
                                                            <div>
                                                                <p className="text-sm font-semibold">{person.name}</p>
                                                                <p className="text-xs text-muted-foreground">{person.role}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        
                                        {/* Tomorrow Section in Modal */}
                                        {tomorrowList.length > 0 && (
                                            <div>
                                                <h4 className="text-sm font-semibold mb-3 text-blue-500">Amanhã</h4>
                                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {tomorrowList.map((person, i) => (
                                                         <div key={i} className="flex items-center gap-3 p-3 rounded-xl border hover:bg-accent/50 transition-colors">
                                                            <Avatar className="h-10 w-10">
                                                                <AvatarImage src={person.img || undefined} />
                                                                <AvatarFallback>{person.name.substring(0,2)}</AvatarFallback>
                                                            </Avatar>
                                                            <div>
                                                                <p className="text-sm font-semibold">{person.name}</p>
                                                                <p className="text-xs text-muted-foreground">{person.role}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </DialogContent>
                            </Dialog>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-6 text-xs text-muted-foreground bg-accent/20 rounded-xl border border-dashed mx-4 mb-4">
                        Nenhum aniversário próximo.
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
