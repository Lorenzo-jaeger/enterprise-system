"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { useAuthStore } from "@/lib/store/auth-store"
import {
    Plus,
    Newspaper,
    Loader2,
    Search,
    Trash2,
    MoreHorizontal,
    Calendar,
    ExternalLink,
    Eye,
    Edit,
    ListFilter
} from "lucide-react"
import { toast } from "sonner"
import { FinanceTicker } from "@/components/organisms/finance-ticker"
import { SmoothScroll } from "@/components/providers/smooth-scroll"

interface NewsItem {
    id: string
    title: string
    category: string
    summary: string
    content: string
    image: string
    createdAt: string
    views: number
}

export default function ManageNewsPage() {
    const { token } = useAuthStore()
    const [loading, setLoading] = useState(false)
    const [news, setNews] = useState<NewsItem[]>([])
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [editingNews, setEditingNews] = useState<NewsItem | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [mounted, setMounted] = useState(false)

    const [formData, setFormData] = useState({
        title: "",
        category: "",
        summary: "",
        content: "",
        image: ""
    })

    useEffect(() => {
        setMounted(true)
    }, [])

    const categories = ["Corporativo", "RH", "Financeiro", "Tecnologia", "Bem-estar", "Segurança"]

    const fetchNews = async () => {
        if (!token) return
        try {
            const res = await fetch("http://localhost:3001/news?limit=100", {
                headers: { "Authorization": `Bearer ${token}` }
            })
            if (res.ok) {
                const response = await res.json()
                setNews(Array.isArray(response.data) ? response.data : [])
            }
        } catch (error) {
            console.error("Failed to fetch news", error)
            setNews([])
        }
    }

    useEffect(() => {
        fetchNews()
    }, [token])

    const handleCreateNew = () => {
        setEditingNews(null)
        setFormData({ title: "", category: "", summary: "", content: "", image: "" })
        setIsCreateOpen(true)
    }

    const handleEdit = (item: NewsItem) => {
        setEditingNews(item)
        setFormData({
            title: item.title,
            category: item.category,
            summary: item.summary,
            content: item.content,
            image: item.image || ""
        })
        setIsCreateOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!token) return

        setLoading(true)
        try {
            const url = editingNews
                ? `http://localhost:3001/news/${editingNews.id}`
                : "http://localhost:3001/news"

            const method = editingNews ? "PATCH" : "POST"

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            })

            if (res.ok) {
                toast.success(editingNews ? "Notícia atualizada!" : "Notícia publicada com sucesso!")
                setIsCreateOpen(false)
                setEditingNews(null)
                setFormData({ title: "", category: "", summary: "", content: "", image: "" })
                fetchNews()
            }
        } catch (error) {
            toast.error("Erro ao salvar notícia.")
            console.error("Failed to save news", error)
        } finally {
            setLoading(false)
        }
    }

    const deleteNews = async (id: string) => {
        if (!token || !confirm("Tem certeza que deseja excluir esta notícia?")) return
        try {
            const res = await fetch(`http://localhost:3001/news/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            })
            if (res.ok) {
                toast.success("Notícia removida.")
                fetchNews()
            }
        } catch (error) {
            toast.error("Erro ao remover notícia.")
        }
    }

    const filteredNews = Array.isArray(news) ? news.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    ) : []

    if (!mounted) return null

    return (
        <div className="flex flex-col h-full bg-background/50 text-foreground overflow-hidden">
            {/* Top Ticker - Sticky */}
            <div className="flex-shrink-0 z-20 border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
                <FinanceTicker />
            </div>

            {/* Scrollable Main Content */}
            <SmoothScroll className="flex-1 p-8 md:p-12 space-y-12">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 mb-4">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-bold tracking-tight text-foreground">Gestão de Comunicados</h1>
                        <p className="text-muted-foreground text-base">Crie, edite e analise o impacto das notícias internas.</p>
                    </div>

                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <Button
                            onClick={handleCreateNew}
                            className="h-12 px-8 rounded-2xl font-bold text-sm shadow-lg hover:scale-105 transition-all"
                        >
                            <Plus className="h-5 w-5 mr-2" />
                            Nova Publicação
                        </Button>
                        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden rounded-[2rem] border-none shadow-2xl p-0 flex flex-col bg-card">
                            <div className="p-10 pb-6 border-b border-border/40">
                                <DialogHeader>
                                    <DialogTitle className="flex items-center gap-4 text-3xl font-bold tracking-tight">
                                        <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                                            <Newspaper className="h-6 w-6" />
                                        </div>
                                        {editingNews ? "Editar Notícia" : "Nova Notícia"}
                                    </DialogTitle>
                                    <DialogDescription className="text-muted-foreground font-medium ml-[4rem] text-base">
                                        Preencha os detalhes abaixo para publicar no feed corporativo.
                                    </DialogDescription>
                                </DialogHeader>
                            </div>

                            <div className="flex-1 overflow-y-auto px-10 py-8 custom-scrollbar">
                                <form id="news-form" onSubmit={handleSubmit} className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">Título</label>
                                            <Input
                                                placeholder="Título da notícia"
                                                value={formData.title}
                                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                                className="h-12 rounded-2xl bg-muted/30 border-border/50 focus:bg-background transition-all font-medium text-base"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">Categoria</label>
                                            <Select
                                                value={formData.category}
                                                onValueChange={v => setFormData({ ...formData, category: v })}
                                                required
                                            >
                                                <SelectTrigger className="h-12 rounded-2xl bg-muted/30 border-border/50 font-medium text-base">
                                                    <SelectValue placeholder="Selecione" />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-2xl">
                                                    {categories.map(c => <SelectItem key={c} value={c} className="rounded-lg">{c}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">Imagem URL</label>
                                        <Input
                                            placeholder="URL da imagem de capa"
                                            value={formData.image}
                                            onChange={e => setFormData({ ...formData, image: e.target.value })}
                                            className="h-12 rounded-2xl bg-muted/30 border-border/50 transition-all font-medium text-sm"
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">Resumo</label>
                                        <Textarea
                                            placeholder="Breve resumo para o card..."
                                            className="min-h-[100px] rounded-2xl bg-muted/30 border-border/50 font-medium resize-none p-5 text-base"
                                            value={formData.summary}
                                            onChange={e => setFormData({ ...formData, summary: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">Conteúdo</label>
                                        <Textarea
                                            placeholder="Texto completo da notícia..."
                                            className="min-h-[250px] rounded-2xl bg-muted/30 border-border/50 font-medium resize-none p-5 text-base"
                                            value={formData.content}
                                            onChange={e => setFormData({ ...formData, content: e.target.value })}
                                            required
                                        />
                                    </div>
                                </form>
                            </div>

                            <DialogFooter className="p-8 bg-muted/20 border-t flex items-center justify-between">
                                <Button type="button" variant="ghost" onClick={() => setIsCreateOpen(false)} className="rounded-xl text-muted-foreground font-bold hover:bg-muted/50 h-11 px-6">Cancelar</Button>
                                <Button form="news-form" type="submit" disabled={loading} className="rounded-xl h-12 px-10 font-bold shadow-lg bg-primary text-primary-foreground hover:bg-primary/90">
                                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : editingNews ? "Salvar Alterações" : "Publicar Notícia"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="grid grid-cols-1 gap-10">
                    <Card className="rounded-[2.5rem] shadow-xl border-none ring-1 ring-border/50 bg-card/80 backdrop-blur-md shadow-sm overflow-hidden">
                        <CardHeader className="pt-10 !pb-10 border-b border-border/40 flex flex-row items-center justify-between px-10 bg-muted/5">
                            <div className="flex items-center gap-6 w-full">
                                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                                    <ListFilter className="h-6 w-6" />
                                </div>
                                <div className="relative flex-1 max-w-2xl">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input
                                        placeholder="Buscar comunicados por título, categoria ou data..."
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                        className="h-14 w-full pl-12 text-sm font-medium rounded-2xl bg-background border-transparent shadow-sm focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all"
                                    />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent border-b border-border/50 h-24">
                                        <TableHead className="py-8 font-black text-[11px] uppercase tracking-[0.2em] pl-10 w-[45%] text-muted-foreground align-middle">Notícia</TableHead>
                                        <TableHead className="py-8 font-black text-[11px] uppercase tracking-[0.2em] text-center text-muted-foreground align-middle">Canal</TableHead>
                                        <TableHead className="py-8 font-black text-[11px] uppercase tracking-[0.2em] text-muted-foreground align-middle">Publicação</TableHead>
                                        <TableHead className="py-8 font-black text-[11px] uppercase tracking-[0.2em] text-center text-muted-foreground align-middle">Impacto</TableHead>
                                        <TableHead className="py-8 font-black text-[11px] uppercase tracking-[0.2em] text-right pr-10 text-muted-foreground align-middle">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredNews.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-96 text-center">
                                                <div className="flex flex-col items-center gap-4 opacity-40">
                                                    <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
                                                        <Newspaper className="h-10 w-10 text-muted-foreground" />
                                                    </div>
                                                    <p className="text-lg font-bold text-muted-foreground">Nenhum comunicado encontrado</p>
                                                    <p className="text-sm font-medium text-muted-foreground/60 max-w-xs leading-relaxed">Tente buscar por outro termo ou crie uma nova publicação.</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredNews.map((item) => (
                                            <TableRow key={item.id} className="group hover:bg-muted/40 transition-all duration-300 border-b border-border/40 last:border-0 border-l-[6px] border-l-transparent hover:border-l-primary cursor-default">
                                                <TableCell className="pl-10 py-6">
                                                    <div className="flex items-center gap-8">
                                                        <div className="h-24 w-36 shrink-0 rounded-2xl overflow-hidden bg-muted border border-border/50 shadow-md group-hover:shadow-xl transition-all duration-500 group-hover:scale-105">
                                                            {item.image ? (
                                                                <img src={item.image} alt="" className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center bg-muted">
                                                                    <Newspaper className="h-8 w-8 text-muted-foreground/20" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="space-y-2 max-w-[400px]">
                                                            <span className="font-bold text-lg text-foreground leading-tight line-clamp-1 block group-hover:text-primary transition-colors">{item.title}</span>
                                                            <span className="text-sm text-muted-foreground line-clamp-2 font-medium leading-relaxed">{item.summary}</span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider">
                                                        {item.category}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                                                            <Calendar className="h-4 w-4 text-primary/40" />
                                                            {new Date(item.createdAt).toLocaleDateString('pt-BR')}
                                                        </div>
                                                        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest ml-6 opacity-60">Postado</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <div className="inline-flex flex-col items-center">
                                                        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-background border border-border/50 text-foreground font-black text-sm shadow-sm group-hover:border-primary/20 transition-colors">
                                                            <Eye className="h-4 w-4 text-primary/60" />
                                                            {item.views || 0}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="pr-10 text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-background hover:shadow-md border border-transparent hover:border-border/50 transition-all">
                                                                <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-56 rounded-2xl shadow-2xl border-border/50 p-2 bg-card/95 backdrop-blur-xl">
                                                            <DropdownMenuItem className="rounded-xl gap-3 py-3 px-4 font-bold text-xs cursor-pointer focus:bg-primary/5 focus:text-primary transition-colors" onClick={() => handleEdit(item)}>
                                                                <Edit className="h-4 w-4" />
                                                                Editar Detalhes
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="rounded-xl gap-3 py-3 px-4 font-bold text-xs cursor-pointer focus:bg-muted transition-colors" onClick={() => window.open(`/news/${item.id}`, '_blank')}>
                                                                <ExternalLink className="h-4 w-4" />
                                                                Visualizar Página
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator className="my-1 bg-border/50" />
                                                            <DropdownMenuItem className="rounded-xl gap-3 py-3 px-4 font-bold text-xs text-destructive focus:bg-destructive/10 cursor-pointer transition-colors" onClick={() => deleteNews(item.id)}>
                                                                <Trash2 className="h-4 w-4" />
                                                                Remover Publicação
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </SmoothScroll>

            <style jsx>{`
              .custom-scrollbar::-webkit-scrollbar {
                width: 5px;
              }
              .custom-scrollbar::-webkit-scrollbar-track {
                background: transparent;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb {
                background: var(--muted-foreground);
                border-radius: 20px;
                opacity: 0.2;
              }
            `}</style>
        </div>
    )
}
