"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Eye, TrendingUp, Users, MousePointer2, ListFilter, Globe, Heart, Calendar as CalendarIcon, Filter, Activity, UserMinus, UserCheck } from "lucide-react"
import { useEffect, useState } from "react"
import { useAuthStore } from "@/lib/store/auth-store"
import { useCompany } from "@/lib/context/company-context"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { FinanceTicker } from "@/components/organisms/finance-ticker"
import { SmoothScroll } from "@/components/providers/smooth-scroll"
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell
} from 'recharts'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface NewsRankingResponse {
    items: NewsRanking[]
    total: number
    pages: number
}

interface NewsRanking {
    id: string
    title: string
    category: string
    views: number
    likes: number
}

interface PageMetric {
    id: string
    pageUrl: string
    pageName: string
    userName: string
    viewedAt: string
}

interface TopPage {
    url: string
    name: string
    count: number
}

interface Stats {
    newsViews: number
    uniqueNewsUsers: number
    pageViews: number
    uniquePageUsers: number
    totalLikes: number
    totalUsers: number
    activeUsers: number
    disabledUsers: number
}

interface HistoryData {
    date: string
    pageViews: number
}

interface MonthlyData {
    month: string
    accesses: number
    uniqueAccesses: number
}

export default function AnalyticsPage() {
    const { token } = useAuthStore()
    const { settings } = useCompany()

    const [newsData, setNewsData] = useState<NewsRankingResponse | null>(null)
    const [pageMetrics, setPageMetrics] = useState<PageMetric[]>([])
    const [topPages, setTopPages] = useState<TopPage[]>([])
    const [history, setHistory] = useState<HistoryData[]>([])
    const [monthly, setMonthly] = useState<MonthlyData[]>([])
    const [stats, setStats] = useState<Stats | null>(null)
    const [loading, setLoading] = useState(true)
    const [period, setPeriod] = useState("7")
    const [newsPage, setNewsPage] = useState(1)
    const [newsCategory, setNewsCategory] = useState("all")
    const [monthlyPage, setMonthlyPage] = useState(1)
    const [usefulPage, setUsefulPage] = useState(1)
    const ITEMS_PER_PAGE = 5

    useEffect(() => {
        const fetchNews = async () => {
            if (!token) return
            try {
                const res = await fetch(`http://localhost:3001/analytics/news-ranking?page=${newsPage}&category=${newsCategory}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                if (res.ok) setNewsData(await res.json())
            } catch (error) {
                console.error("Failed to fetch news ranking:", error)
            }
        }
        fetchNews()
    }, [token, newsPage, newsCategory])

    useEffect(() => {
        const fetchData = async () => {
            if (!token) return
            setLoading(true)
            try {
                const [pageRes, statsRes, topRes, historyRes, monthlyRes] = await Promise.all([
                    fetch("http://localhost:3001/analytics/page-metrics", { headers: { Authorization: `Bearer ${token}` } }),
                    fetch("http://localhost:3001/analytics/stats", { headers: { Authorization: `Bearer ${token}` } }),
                    fetch("http://localhost:3001/analytics/top-pages", { headers: { Authorization: `Bearer ${token}` } }),
                    fetch(`http://localhost:3001/analytics/history?days=${period}`, { headers: { Authorization: `Bearer ${token}` } }),
                    fetch("http://localhost:3001/analytics/monthly-metrics", { headers: { Authorization: `Bearer ${token}` } })
                ])

                if (pageRes.ok) setPageMetrics(await pageRes.json())
                if (statsRes.ok) setStats(await statsRes.json())
                if (topRes.ok) setTopPages(await topRes.json())
                if (historyRes.ok) setHistory(await historyRes.json())
                if (monthlyRes.ok) setMonthly(await monthlyRes.json())

            } catch (error) {
                console.error("Failed to fetch analytics:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [token, period])

    const cardClassName = "rounded-2xl shadow-lg border-none ring-1 ring-border/50 bg-card/80 backdrop-blur-sm shadow-sm"

    // Gauge component helper
    const GaugeChart = ({ value, label, color, max }: { value: number, label: string, color: string, max: number }) => {
        const data = [
            { value: value },
            { value: Math.max(0, max - value) }
        ];
        return (
            <div className="flex flex-col items-center">
                <div className="h-40 w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="80%"
                                startAngle={180}
                                endAngle={0}
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={0}
                                dataKey="value"
                                stroke="none"
                            >
                                <Cell fill={color} />
                                <Cell fill="var(--muted-foreground)" opacity={0.1} />
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center pt-8">
                        <span className="text-3xl font-black text-foreground">{value}</span>
                    </div>
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground -mt-4">{label}</p>
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full bg-background/50 text-foreground overflow-hidden">
            <div className="flex-shrink-0 z-20 border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
                <FinanceTicker />
            </div>

            <SmoothScroll className="flex-1 p-6 md:p-10 space-y-12">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-4">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight">Analytics & Métricas</h1>
                        <p className="text-muted-foreground text-sm">Monitore o desempenho e engajamento da rede.</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Select value={period} onValueChange={setPeriod}>
                            <SelectTrigger className="w-[180px] h-10 text-xs font-semibold rounded-xl bg-background border-border/50 shadow-sm">
                                <CalendarIcon className="h-4 w-4 mr-2 opacity-50" />
                                <SelectValue placeholder="Período" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                                <SelectItem value="7">Últimos 7 dias</SelectItem>
                                <SelectItem value="15">Últimos 15 dias</SelectItem>
                                <SelectItem value="30">Últimos 30 dias</SelectItem>
                                <SelectItem value="90">Últimos 90 dias</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Top Row: Gauge + Access Flux Chart (Chart now spans 3 cols) */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6" style={{ marginBottom: '2.5rem' }}>
                    <Card className={cardClassName}>
                        <CardContent className="p-6">
                            <GaugeChart value={stats?.pageViews || 0} label="Quantidade de acessos" color="var(--primary)" max={Math.max(2000, (stats?.pageViews || 0) * 1.5)} />
                        </CardContent>
                    </Card>

                    {/* Fluxo de Acessos Chart expanded to 3 columns */}
                    <Card className={cn(cardClassName, "lg:col-span-3 overflow-hidden")}>
                        <CardHeader className="pb-4 pt-6 px-8">
                            <CardTitle className="text-base font-bold flex items-center gap-2">
                                <Activity className="h-4 w-4 text-primary" />
                                Fluxo de Acessos
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="h-[180px] p-0 pr-6">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={history} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.05} />
                                    <XAxis
                                        dataKey="date"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 9, fontWeight: 600, opacity: 0.5 }}
                                        tickFormatter={(str) => new Date(str).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 9, fontWeight: 600, opacity: 0.5 }}
                                    />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold', fontSize: '10px' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="pageViews"
                                        stroke="var(--primary)"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorViews)"
                                        animationDuration={1500}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* KPI Cards - Clean 3-column layout as requested */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6" style={{ marginBottom: '3.5rem' }}>
                    {[
                        { label: "Visu. Notícias", value: stats?.newsViews, icon: Eye, trend: "+12.5%", desc: "Impressões totais no período" },
                        { label: "Total Reações", value: stats?.totalLikes, icon: Heart, trend: "+8.2%", desc: "Engajamento positivo da rede" },
                        { label: "Navegações", value: stats?.pageViews, icon: MousePointer2, trend: "+15.0%", desc: "Cliques e interações de sistema" },
                    ].map((kpi, i) => (
                        <Card key={i} className={cn(cardClassName, "transition-all hover:shadow-xl border-t-4 border-t-primary/20")}>
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{kpi.label}</p>
                                    <Badge variant="secondary" className="bg-primary/10 text-primary border-none text-[10px] font-black px-2 py-0">
                                        {kpi.trend}
                                    </Badge>
                                </div>
                                <div className="flex items-baseline gap-2 mb-4">
                                    <h3 className="text-3xl font-black tracking-tight">{kpi.value ?? 0}</h3>
                                    <kpi.icon className="h-5 w-5 text-primary opacity-20" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-primary flex items-center gap-1">
                                        <TrendingUp className="h-3 w-3" />
                                        Performance em alta
                                    </p>
                                    <p className="text-[10px] text-muted-foreground font-medium">{kpi.desc}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Monthly Tables like Grafana */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" style={{ marginBottom: '3rem' }}>
                    <Card className={cardClassName}>
                        <CardHeader className="py-4 border-b flex flex-row items-center justify-between">
                            <CardTitle className="text-sm font-bold">Quantidade de acessos por mês</CardTitle>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setMonthlyPage(p => Math.max(1, p - 1))}
                                    disabled={monthlyPage === 1}
                                    className="h-7 px-2 rounded-lg border border-border/50 hover:bg-muted disabled:opacity-30 transition-colors text-[9px] font-bold"
                                >
                                    ‹
                                </button>
                                <span className="text-[9px] font-bold px-1">{monthlyPage} / {Math.ceil(monthly.length / ITEMS_PER_PAGE) || 1}</span>
                                <button
                                    onClick={() => setMonthlyPage(p => Math.min(Math.ceil(monthly.length / ITEMS_PER_PAGE), p + 1))}
                                    disabled={monthlyPage === Math.ceil(monthly.length / ITEMS_PER_PAGE)}
                                    className="h-7 px-2 rounded-lg border border-border/50 hover:bg-muted disabled:opacity-30 transition-colors text-[9px] font-bold"
                                >
                                    ›
                                </button>
                            </div>
                        </CardHeader>
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="font-black text-[10px] uppercase tracking-widest pl-6">Ano-Mês</TableHead>
                                    <TableHead className="font-black text-[10px] uppercase tracking-widest text-right pr-6">Quantidade de acessos</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {monthly.slice((monthlyPage - 1) * ITEMS_PER_PAGE, monthlyPage * ITEMS_PER_PAGE).map((m) => (
                                    <TableRow key={m.month} className="hover:bg-muted/50 transition-colors border-b last:border-0">
                                        <TableCell className="pl-6 font-bold text-xs">{m.month}</TableCell>
                                        <TableCell className="text-right pr-6">
                                            <div className="bg-primary/5 border border-primary/20 px-2 py-1 rounded inline-block font-mono text-xs font-bold text-primary">
                                                {m.accesses}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>

                    <Card className={cardClassName}>
                        <CardHeader className="py-4 border-b flex flex-row items-center justify-between">
                            <CardTitle className="text-sm font-bold">Quantidade de acessos únicos por mês</CardTitle>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setMonthlyPage(p => Math.max(1, p - 1))}
                                    disabled={monthlyPage === 1}
                                    className="h-7 px-2 rounded-lg border border-border/50 hover:bg-muted disabled:opacity-30 transition-colors text-[9px] font-bold"
                                >
                                    ‹
                                </button>
                                <span className="text-[9px] font-bold px-1">{monthlyPage} / {Math.ceil(monthly.length / ITEMS_PER_PAGE) || 1}</span>
                                <button
                                    onClick={() => setMonthlyPage(p => Math.min(Math.ceil(monthly.length / ITEMS_PER_PAGE), p + 1))}
                                    disabled={monthlyPage === Math.ceil(monthly.length / ITEMS_PER_PAGE)}
                                    className="h-7 px-2 rounded-lg border border-border/50 hover:bg-muted disabled:opacity-30 transition-colors text-[9px] font-bold"
                                >
                                    ›
                                </button>
                            </div>
                        </CardHeader>
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="font-black text-[10px] uppercase tracking-widest pl-6">Ano-Mês</TableHead>
                                    <TableHead className="font-black text-[10px] uppercase tracking-widest text-right pr-6">Quantidade de acessos</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {monthly.slice((monthlyPage - 1) * ITEMS_PER_PAGE, monthlyPage * ITEMS_PER_PAGE).map((m) => (
                                    <TableRow key={m.month} className="hover:bg-muted/50 transition-colors border-b last:border-0">
                                        <TableCell className="pl-6 font-bold text-xs">{m.month}</TableCell>
                                        <TableCell className="text-right pr-6">
                                            <div className="bg-emerald-500/5 border border-emerald-500/20 px-2 py-1 rounded inline-block font-mono text-xs font-bold text-emerald-600">
                                                {m.uniqueAccesses}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                    <div className="lg:col-span-3 space-y-12">

                        <div className="space-y-6" style={{ marginBottom: '4rem' }}>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-1">
                                <h2 className="text-lg font-bold flex items-center gap-2">
                                    <TrendingUp className="h-4 w-4 text-primary" />
                                    Ranking de Engajamento (Notícias)
                                </h2>

                                <div className="flex items-center gap-3">
                                    <Select value={newsCategory} onValueChange={(val) => { setNewsCategory(val); setNewsPage(1); }}>
                                        <SelectTrigger className="w-[140px] h-9 text-[10px] font-bold rounded-xl border-border/50">
                                            <Filter className="h-3 w-3 mr-2 opacity-50" />
                                            <SelectValue placeholder="Categoria" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            <SelectItem value="all">Todas</SelectItem>
                                            <SelectItem value="Corporativo">Corporativo</SelectItem>
                                            <SelectItem value="RH">RH</SelectItem>
                                            <SelectItem value="Tecnologia">Tecnologia</SelectItem>
                                            <SelectItem value="Financeiro">Financeiro</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => setNewsPage(p => Math.max(1, p - 1))}
                                            disabled={newsPage === 1}
                                            className="h-9 px-3 rounded-xl border border-border/50 hover:bg-muted disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-[10px] font-bold"
                                        >
                                            Anterior
                                        </button>
                                        <span className="text-[10px] font-bold px-2">{newsPage} / {newsData?.pages || 1}</span>
                                        <button
                                            onClick={() => setNewsPage(p => Math.min(newsData?.pages || 1, p + 1))}
                                            disabled={newsPage === (newsData?.pages || 1)}
                                            className="h-9 px-3 rounded-xl border border-border/50 hover:bg-muted disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-[10px] font-bold"
                                        >
                                            Próxima
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                {newsData?.items.map((news, idx) => (
                                    <Card key={news.id} className={cn(cardClassName, "hover:bg-accent/50 group transition-all")}>
                                        <CardContent className="p-4 flex items-center gap-4">
                                            <div className="h-10 w-10 shrink-0 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                                                {(newsPage - 1) * 6 + idx + 1}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Badge variant="outline" className="text-[9px] h-4 py-0 font-bold bg-primary/5 border-primary/20 text-primary uppercase">
                                                        {news.category}
                                                    </Badge>
                                                </div>
                                                <h4 className="font-bold text-sm truncate group-hover:text-primary transition-colors">
                                                    {news.title}
                                                </h4>
                                                <div className="flex gap-4 mt-2">
                                                    <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground">
                                                        <Eye className="h-3 w-3" />
                                                        {news.views}
                                                    </div>
                                                    <div className="flex items-center gap-1 text-[10px] font-bold text-primary">
                                                        <Heart className="h-3 w-3 fill-primary" />
                                                        {news.likes}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8 sticky top-0 self-start">
                        <Card className={cn(cardClassName, "border-l-4", "border-l-primary")}>
                            <CardHeader className="pb-4 pt-6 px-6 border-b flex flex-row items-center justify-between">
                                <CardTitle className="text-sm font-bold flex items-center gap-3">
                                    <Globe className="h-5 w-5 text-primary" />
                                    Páginas Úteis
                                </CardTitle>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => setUsefulPage(p => Math.max(1, p - 1))}
                                        disabled={usefulPage === 1}
                                        className="h-7 px-2 rounded-lg border border-border/50 hover:bg-muted disabled:opacity-30 transition-colors text-[9px] font-bold"
                                    >
                                        ‹
                                    </button>
                                    <button
                                        onClick={() => setUsefulPage(p => Math.min(Math.ceil(topPages.length / ITEMS_PER_PAGE), p + 1))}
                                        disabled={usefulPage === Math.ceil(topPages.length / ITEMS_PER_PAGE)}
                                        className="h-7 px-2 rounded-lg border border-border/50 hover:bg-muted disabled:opacity-30 transition-colors text-[9px] font-bold"
                                    >
                                        ›
                                    </button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y divide-border/30">
                                    {topPages.slice((usefulPage - 1) * ITEMS_PER_PAGE, usefulPage * ITEMS_PER_PAGE).map((page, idx) => (
                                        <div key={idx} className="p-4 hover:bg-muted/30 transition-colors flex items-center justify-between gap-3">
                                            <div className="space-y-0.5 overflow-hidden">
                                                <p className="text-xs font-bold truncate">{page.name || "Sem Nome"}</p>
                                                <p className="text-[9px] font-mono text-muted-foreground opacity-70 truncate">{page.url}</p>
                                            </div>
                                            <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                                <span className="text-[10px] font-black text-primary">{page.count}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="rounded-2xl border-none bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg">
                            <CardContent className="p-5">
                                <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center mb-4">
                                    <ListFilter className="h-5 w-5" />
                                </div>
                                <h3 className="font-bold mb-2">Dica de Dados</h3>
                                <p className="text-[11px] opacity-90 leading-relaxed font-medium">
                                    Notícias com reações positivas têm 3x mais chances de serem compartilhadas internamente.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </SmoothScroll>
        </div>
    )
}
