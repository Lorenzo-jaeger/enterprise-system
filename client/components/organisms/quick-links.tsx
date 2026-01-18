"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, HardDrive, LifeBuoy, Users, LayoutGrid, ExternalLink, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

const links = [
    { label: "Webmail", icon: Mail, href: "#", color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Google Drive", icon: HardDrive, href: "#", color: "text-green-500", bg: "bg-green-500/10" },
    { label: "Suporte TI", icon: LifeBuoy, href: "#", color: "text-orange-500", bg: "bg-orange-500/10" },
    { label: "RH Portal", icon: Users, href: "#", color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Jira", icon: LayoutGrid, href: "#", color: "text-blue-400", bg: "bg-blue-400/10" },
]

export function QuickLinks() {
    const [open, setOpen] = useState(false)
    const displayedLinks = links.slice(0, 4)

    return (
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-300 border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
            <CardHeader className="py-3 px-4 border-b border-border/40 bg-muted/20">
                <CardTitle className="text-sm font-semibold tracking-tight text-foreground flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <ExternalLink className="h-4 w-4 text-primary" />
                        <span>Acesso Rápido</span>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="flex flex-col">
                    {displayedLinks.map((link, i) => (
                        <a 
                            key={i} 
                            href={link.href}
                            className={`flex items-center gap-3 px-4 py-2.5 transition-all hover:bg-muted/30 group cursor-pointer ${i !== displayedLinks.length - 1 ? 'border-b border-border/40' : ''}`}
                        >
                            <div className={`h-8 w-8 rounded-lg ${link.color} bg-opacity-10 dark:bg-opacity-10 flex items-center justify-center transition-transform group-hover:scale-105`}>
                                <link.icon className={`h-4 w-4 ${link.color}`} />
                            </div>
                            <span className="text-[13px] font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                                {link.label}
                            </span>
                            <ChevronRight className="h-3.5 w-3.5 ml-auto text-muted-foreground/30 group-hover:text-muted-foreground transition-all" />
                        </a>
                    ))}
                    
                    {links.length > 4 && (
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <div className="p-2 border-t border-border/40">
                                    <Button variant="ghost" className="w-full text-[11px] font-medium text-muted-foreground hover:text-foreground h-7 rounded-lg cursor-pointer">
                                        Ver todos
                                    </Button>
                                </div>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-lg">
                                <DialogHeader>
                                    <DialogTitle>Acesso Rápido</DialogTitle>
                                </DialogHeader>
                                <div className="grid grid-cols-2 gap-4 py-4">
                                    {links.map((link, i) => (
                                        <a 
                                            key={i} 
                                            href={link.href}
                                            className="flex items-center gap-3 p-3 rounded-xl border border-border/50 hover:bg-accent/50 hover:border-border transition-all cursor-pointer group"
                                        >
                                            <div className={`h-10 w-10 rounded-xl ${link.color} bg-opacity-10 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                                <link.icon className={`h-5 w-5 ${link.color}`} />
                                            </div>
                                            <span className="text-sm font-medium">{link.label}</span>
                                        </a>
                                    ))}
                                </div>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
