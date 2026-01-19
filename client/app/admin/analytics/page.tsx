"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Eye, TrendingUp, Users } from "lucide-react"
import { useEffect, useState } from "react"
import { useAuthStore } from "@/lib/store/auth-store"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface Metric {
    id: string
    newsTitle: string
    newsCategory: string
    userName: string
    userRole: string
    viewedAt: string
}

export default function AnalyticsPage() {
    const { token } = useAuthStore()
    const [metrics, setMetrics] = useState<Metric[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchMetrics = async () => {
            if (!token) return
            try {
                const res = await fetch("http://localhost:3001/news/metrics", {
                    headers: { Authorization: `Bearer ${token}` }
                })
                if (res.ok) {
                    setMetrics(await res.json())
                }
            } finally {
                setLoading(false)
            }
        }
        fetchMetrics()
    }, [token])

    // Simple stats
    const totalViews = metrics.length
    const uniqueUsers = new Set(metrics.map(m => m.userName)).size
    const topNews = metrics.reduce((acc, curr) => {
        acc[curr.newsTitle] = (acc[curr.newsTitle] || 0) + 1
        return acc
    }, {} as Record<string, number>)
    const topNewsTitle = Object.entries(topNews).sort((a,b) => b[1] - a[1])[0]?.[0] || 'N/A'

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Métricas de Acesso</h1>
                <p className="text-muted-foreground mt-2">Monitore o engajamento e alcance das notícias internas.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Visualizações Totais</CardTitle>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalViews}</div>
                        <p className="text-xs text-muted-foreground">+20.1% este mês</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Usuários Alcançados</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{uniqueUsers}</div>
                        <p className="text-xs text-muted-foreground">Colaboradores distintos</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Notícia em Destaque</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm font-bold truncate" title={topNewsTitle}>{topNewsTitle}</div>
                        <p className="text-xs text-muted-foreground">Maior número de acessos</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Histórico de Visualizações</CardTitle>
                    <CardDescription>
                        Registro detalhado de quem acessou qual notícia recentemente.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Data/Hora</TableHead>
                                <TableHead>Colaborador</TableHead>
                                <TableHead>Função</TableHead>
                                <TableHead>Notícia</TableHead>
                                <TableHead>Categoria</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8">Carregando...</TableCell>
                                </TableRow>
                            ) : metrics.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8">Nenhum acesso registrado.</TableCell>
                                </TableRow>
                            ) : (
                                metrics.map((metric) => (
                                    <TableRow key={metric.id}>
                                        <TableCell className="font-mono text-xs text-muted-foreground">
                                            {new Date(metric.viewedAt).toLocaleString('pt-BR')}
                                        </TableCell>
                                        <TableCell className="font-medium">{metric.userName}</TableCell>
                                        <TableCell>{metric.userRole}</TableCell>
                                        <TableCell className="max-w-[300px] truncate" title={metric.newsTitle}>{metric.newsTitle}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="text-xs">{metric.newsCategory}</Badge>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
