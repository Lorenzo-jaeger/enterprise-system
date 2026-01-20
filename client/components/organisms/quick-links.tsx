"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, HardDrive, LifeBuoy, Users, LayoutGrid, ExternalLink, ChevronRight, FileText, Calendar, MessageCircle, Briefcase, CreditCard, Globe, Server, Code, Database, Shield } from "lucide-react"
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
    { label: "Contra-cheque", icon: FileText, href: "#", color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Agendamento Salas", icon: Calendar, href: "#", color: "text-red-500", bg: "bg-red-500/10" },
    { label: "Slack", icon: MessageCircle, href: "#", color: "text-pink-500", bg: "bg-pink-500/10" },
    { label: "Vagas Internas", icon: Briefcase, href: "#", color: "text-cyan-500", bg: "bg-cyan-500/10" },
    { label: "Reembolso", icon: CreditCard, href: "#", color: "text-yellow-500", bg: "bg-yellow-500/10" },
    { label: "Intranet Global", icon: Globe, href: "#", color: "text-indigo-500", bg: "bg-indigo-500/10" },
    { label: "Status Server", icon: Server, href: "#", color: "text-slate-500", bg: "bg-slate-500/10" },
    { label: "GitLab", icon: Code, href: "#", color: "text-orange-600", bg: "bg-orange-600/10" },
    { label: "Banco de Dados", icon: Database, href: "#", color: "text-teal-500", bg: "bg-teal-500/10" },
    { label: "Portal Segurança", icon: Shield, href: "#", color: "text-rose-500", bg: "bg-rose-500/10" },
]

export function QuickLinks({ className }: { className?: string }) {
    const [open, setOpen] = useState(false)
    const displayedLinks = links.slice(0, 4)

    return (
        <Card className={`shadow-sm hover:shadow-md transition-shadow duration-300 border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden flex flex-col ${className}`}>
            <CardHeader className="p-3 border-b border-border/40 bg-muted/20">
                <CardTitle className="text-sm font-semibold tracking-tight text-foreground flex items-center justify-start">
                    <div className="flex items-center gap-2">
                        <ExternalLink className="h-4 w-4" style={{ color: 'var(--icon-color)' }} />
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
                            <div className={`h-8 w-8 rounded-lg bg-opacity-10 dark:bg-opacity-10 flex items-center justify-center transition-transform group-hover:scale-105`} style={{ backgroundColor: 'rgba(191, 161, 95, 0.1)' }}>
                                <link.icon className="h-4 w-4" style={{ color: 'var(--icon-color)' }} />
                            </div>
                            <span className="text-[13px] font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                                {link.label}
                            </span>
                            <ChevronRight className="h-3.5 w-3.5 ml-auto text-muted-foreground/30 group-hover:text-muted-foreground transition-all" />
                        </a>
                    ))}

                    {links.length > 4 && (
                        <Dialog open={open} onOpenChange={setOpen}>
                            <div className="p-2 border-t border-border/40">
                                <DialogTrigger asChild>
                                    <Button variant="ghost" className="w-full text-[11px] font-medium text-muted-foreground hover:text-foreground h-7 rounded-lg cursor-pointer">
                                        Ver todos
                                    </Button>
                                </DialogTrigger>
                            </div>
                            <DialogContent className="sm:max-w-lg">
                                <DialogHeader>
                                    <DialogTitle className="text-center">Acesso Rápido</DialogTitle>
                                </DialogHeader>
                                <div className="grid grid-cols-2 gap-4 py-4">
                                    {links.map((link, i) => (
                                        <a
                                            key={i}
                                            href={link.href}
                                            className="flex items-center gap-3 p-3 rounded-xl border border-border/50 hover:bg-accent/50 hover:border-border transition-all cursor-pointer group"
                                        >
                                            <div className={`h-10 w-10 rounded-xl bg-opacity-10 flex items-center justify-center group-hover:scale-110 transition-transform`} style={{ backgroundColor: 'rgba(191, 161, 95, 0.1)' }}>
                                                <link.icon className="h-5 w-5" style={{ color: 'var(--icon-color)' }} />
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
