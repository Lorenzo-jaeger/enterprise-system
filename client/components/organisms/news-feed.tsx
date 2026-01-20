"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Newspaper, Heart, Search, X, ChevronRight, Loader2, Calendar, Eye } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/lib/store/auth-store"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

interface NewsItem {
    id: string
    title: string
    summary: string
    content: string
    image: string | null
    category: string
    publishDate: string
    likes: number
    views: number
    hasLiked?: boolean
}

export function NewsFeed() {
    const { token } = useAuthStore()
    const [newsData, setNewsData] = useState<NewsItem[]>([])
    const [loading, setLoading] = useState(true)

    // Details Modal State
    const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null)
    const [detailsOpen, setDetailsOpen] = useState(false)

    // All News Modal State
    const [allNewsOpen, setAllNewsOpen] = useState(false)
    const [allNews, setAllNews] = useState<NewsItem[]>([])
    const [filters, setFilters] = useState({ search: '', category: 'Todos' })
    const [loadingAll, setLoadingAll] = useState(false)

    // Fetch initial feed (limit 4 for layout)
    useEffect(() => {
        fetchFeed()
    }, [token])

    const fetchFeed = async () => {
        if (!token) return
        try {
            const res = await fetch("http://localhost:3001/news?limit=4", {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (res.ok) {
                const data = await res.json()
                setNewsData(data.data)
            }
        } catch (e) {
            console.error("Failed to fetch news feed", e)
        } finally {
            setLoading(false)
        }
    }

    // Toggle Like
    const toggleLike = async (id: string, e?: React.MouseEvent) => {
        e?.stopPropagation()
        if (!token) return

        // Optimistic UI update
        const updateList = (list: NewsItem[]) => list.map(item => {
            if (item.id === id) {
                const newLiked = !item.hasLiked
                return {
                    ...item,
                    hasLiked: newLiked,
                    likes: newLiked ? item.likes + 1 : item.likes - 1
                }
            }
            return item
        })

        setNewsData(updateList)
        setAllNews(updateList) // Update in modal list too
        if (selectedNews?.id === id) {
            setSelectedNews(curr => curr ? ({
                ...curr,
                hasLiked: !curr.hasLiked,
                likes: !curr.hasLiked ? curr.likes + 1 : curr.likes - 1
            }) : null)
        }

        try {
            await fetch(`http://localhost:3001/news/${id}/like`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` }
            })
        } catch (error) {
            console.error("Failed to toggle like", error)
        }
    }

    // Open Details (and record view)
    const handleOpenNews = async (news: NewsItem) => {
        setSelectedNews(news)
        setDetailsOpen(true)

        if (!token) return

        try {
            const res = await fetch(`http://localhost:3001/news/${news.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (res.ok) {
                const fullData = await res.json()
                setSelectedNews(fullData)
                // Update view count in local list if changed
                setNewsData(curr => curr.map(n => n.id === fullData.id ? { ...n, views: fullData.views } : n))
            }
        } catch (e) {
            console.error("Failed to load news details", e)
        }
    }

    // Fetch All News with filters
    useEffect(() => {
        if (allNewsOpen) {
            fetchAllNews()
        }
    }, [allNewsOpen, filters])

    const fetchAllNews = async () => {
        if (!token) return
        setLoadingAll(true)
        try {
            const query = new URLSearchParams({
                limit: '50',
                search: filters.search,
                category: filters.category
            })
            const res = await fetch(`http://localhost:3001/news?${query.toString()}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (res.ok) {
                const data = await res.json()
                setAllNews(data.data)
            }
        } finally {
            setLoadingAll(false)
        }
    }

    const featured = newsData[0]
    const others = newsData.slice(1, 4)
    const categories = ["Todos", "Corporativo", "RH", "Financeiro", "Tecnologia", "Bem-estar", "Segurança"]

    return (
        <>
            <Card className="shadow-sm hover:shadow-md transition-shadow duration-300 border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden flex flex-col h-full">
                <CardHeader className="p-3 border-b border-border/40 bg-muted/20">
                    <CardTitle className="text-lg font-semibold tracking-tight text-foreground flex items-center justify-start gap-2">
                        <Newspaper className="h-4 w-4 text-primary" />
                        Notícias
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0 flex-1">
                    {loading ? (
                        <div className="flex h-[300px] items-center justify-center">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : newsData.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-5 h-full divide-x divide-border/40">
                            {/* Featured News */}
                            <div
                                className="md:col-span-3 h-full min-h-[300px] relative group cursor-pointer shadow-sm transition-all duration-300 hover:shadow-lg overflow-hidden"
                                onClick={() => handleOpenNews(featured)}
                            >
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                    style={{ backgroundImage: `url(${featured.image})` }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-100" />

                                <div className="absolute top-4 right-4 z-10">
                                    <button
                                        onClick={(e) => toggleLike(featured.id, e)}
                                        className="group/btn p-2 rounded-full bg-black/20 backdrop-blur-md border border-white/10 hover:bg-white/20 transition-all focus:outline-none"
                                    >
                                        <Heart className={cn("h-5 w-5 transition-all duration-300", featured.hasLiked ? "fill-red-500 text-red-500 scale-110" : "text-white group-hover/btn:scale-110")} />
                                    </button>
                                </div>

                                <div className="absolute bottom-0 left-0 right-0 p-6 text-white space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="inline-flex px-2 py-0.5 bg-blue-600/90 backdrop-blur-md rounded text-[10px] font-bold uppercase tracking-widest mb-1 shadow-sm">
                                            {featured.category}
                                        </div>
                                        <div className="flex items-center gap-3 text-xs font-medium text-white/80">
                                            <div className="flex items-center gap-1">
                                                <Heart className={cn("h-3.5 w-3.5", featured.hasLiked ? "fill-red-500 text-red-500" : "fill-white/20")} />
                                                {featured.likes}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Eye className="h-3.5 w-3.5 text-white/60" />
                                                {featured.views}
                                            </div>
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold leading-tight tracking-tight text-white group-hover:text-blue-50 transition-colors">
                                        {featured.title}
                                    </h3>
                                    <p className="text-[13px] text-gray-200 line-clamp-2 leading-relaxed opacity-90">
                                        {featured.summary}
                                    </p>
                                    <p className="text-[11px] text-gray-400 font-medium pt-1">
                                        {new Date(featured.publishDate).toLocaleDateString('pt-BR')}
                                    </p>
                                </div>
                            </div>

                            {/* Sidebar List */}
                            <div className="md:col-span-2 flex flex-col h-full bg-muted/5 max-h-[450px]">
                                <div className="flex-1 flex flex-col overflow-y-auto">
                                    {others.map((item, i) => (
                                        <div
                                            key={item.id}
                                            onClick={() => handleOpenNews(item)}
                                            className={`flex gap-4 px-4 py-3 cursor-pointer group hover:bg-muted/50 transition-colors ${i !== others.length - 1 ? 'border-b border-border/40' : ''}`}
                                        >
                                            <div className="h-16 w-20 rounded-lg overflow-hidden flex-shrink-0 bg-muted relative ring-1 ring-border/10">
                                                <img
                                                    src={item.image || ''}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
                                                <div className="flex justify-between items-start gap-2">
                                                    <h4 className="text-[13px] font-medium leading-snug tracking-tight text-foreground/90 group-hover:text-primary transition-colors line-clamp-2">
                                                        {item.title}
                                                    </h4>
                                                    <button
                                                        onClick={(e) => toggleLike(item.id, e)}
                                                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-muted rounded-full focus:outline-none"
                                                    >
                                                        <Heart className={cn("h-3.5 w-3.5 transition-colors", item.hasLiked ? "fill-red-500 text-red-500" : "text-muted-foreground")} />
                                                    </button>
                                                </div>
                                                <div className="flex items-center justify-between mt-auto">
                                                    <p className="text-[11px] text-muted-foreground">
                                                        {new Date(item.publishDate).toLocaleDateString('pt-BR')}
                                                    </p>
                                                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground/70">
                                                        <Heart className="h-3 w-3" /> {item.likes}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-3 border-t border-border/40 bg-background/50">
                                    <Button
                                        variant="ghost"
                                        onClick={() => setAllNewsOpen(true)}
                                        className="w-full text-xs font-medium h-8 rounded-lg text-muted-foreground hover:text-foreground"
                                    >
                                        Ver todas as notícias
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex h-[300px] items-center justify-center text-muted-foreground text-sm">
                            Nenhuma notícia encontrada.
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Details Modal */}
            <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
                <DialogContent className="max-w-3xl p-0 overflow-hidden gap-0 bg-background border-border shadow-2xl">
                    <div className="relative h-64 w-full">
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url(${selectedNews?.image})` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        <DialogClose className="absolute top-4 right-4 rounded-full bg-black/20 p-2 text-white hover:bg-black/40 transition-colors cursor-pointer z-50">
                            <X className="h-4 w-4" />
                        </DialogClose>
                        <div className="absolute bottom-6 left-6 right-6 text-white">
                            <Badge className="bg-primary/80 hover:bg-primary border-none mb-2 pointer-events-none">{selectedNews?.category}</Badge>
                            <DialogTitle className="text-2xl font-bold leading-tight mb-2">{selectedNews?.title}</DialogTitle>
                            <div className="flex items-center gap-4 text-sm text-white/80">
                                <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {selectedNews && new Date(selectedNews.publishDate).toLocaleDateString('pt-BR')}</span>
                                <span className="flex items-center gap-1"><Heart className="h-3.5 w-3.5" /> {selectedNews?.likes}</span>
                                <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {selectedNews?.views}</span>
                            </div>
                        </div>
                    </div>
                    <ScrollArea className="max-h-[60vh] p-8">
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                            <p className="lead text-lg text-muted-foreground mb-6 font-medium border-l-4 border-primary pl-4">{selectedNews?.summary}</p>
                            <div dangerouslySetInnerHTML={{ __html: selectedNews?.content || '' }} />
                        </div>
                    </ScrollArea>
                    <DialogFooter className="p-4 border-t bg-muted/20 flex justify-between items-center w-full sm:justify-between">
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            Visualizado por você e outros {selectedNews?.views} colegas
                        </div>
                        <Button
                            variant={selectedNews?.hasLiked ? "default" : "secondary"}
                            onClick={() => selectedNews && toggleLike(selectedNews.id)}
                            className="gap-2"
                        >
                            <Heart className={cn("h-4 w-4", selectedNews?.hasLiked && "fill-current")} />
                            {selectedNews?.hasLiked ? "Curtiu" : "Curtir"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* All News Modal */}
            <Dialog open={allNewsOpen} onOpenChange={setAllNewsOpen}>
                <DialogContent className="w-[95vw] sm:max-w-[85vw] h-[90vh] flex flex-col p-0 gap-0 bg-background border-border shadow-2xl">
                    <DialogHeader className="p-6 border-b pb-4 bg-muted/10">
                        <div className="flex items-center justify-between">
                            <DialogTitle className="text-xl font-semibold tracking-tight">Central de Notícias</DialogTitle>
                        </div>
                        <div className="flex gap-3 mt-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Buscar por título ou assunto..."
                                    className="pl-9 bg-background/50 border-border/50 focus:bg-background"
                                    value={filters.search}
                                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                                />
                            </div>
                            <Select
                                value={filters.category}
                                onValueChange={(val) => setFilters(prev => ({ ...prev, category: val }))}
                            >
                                <SelectTrigger className="w-[180px] bg-background/50 border-border/50">
                                    <SelectValue placeholder="Categoria" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map(cat => (
                                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </DialogHeader>
                    <div className="flex-1 overflow-y-auto p-6 min-h-0 bg-muted/5">
                        {loadingAll ? (
                            <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {allNews.map(item => (
                                    <Card
                                        key={item.id}
                                        className="cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group overflow-hidden border-border/60 bg-card"
                                        onClick={() => handleOpenNews(item)}
                                    >
                                        <div className="aspect-video relative overflow-hidden bg-muted">
                                            <img
                                                src={item.image || ''}
                                                alt={item.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                            <Badge className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 border-none backdrop-blur-sm text-[10px]">
                                                {item.category}
                                            </Badge>
                                        </div>
                                        <CardContent className="p-4">
                                            <h4 className="font-semibold leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2 min-h-[40px]">{item.title}</h4>
                                            <p className="text-xs text-muted-foreground line-clamp-3 mb-4 h-[45px]">{item.summary}</p>
                                            <div className="flex items-center justify-between text-[11px] text-muted-foreground border-t pt-3 border-border/40">
                                                <span>{new Date(item.publishDate).toLocaleDateString('pt-BR')}</span>
                                                <div className="flex gap-3">
                                                    <span className="flex items-center gap-1"><Heart className="h-3 w-3" /> {item.likes}</span>
                                                    <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {item.views}</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                                {allNews.length === 0 && (
                                    <div className="col-span-full flex flex-col items-center justify-center py-20 text-muted-foreground opacity-60">
                                        <Newspaper className="h-12 w-12 mb-2" />
                                        <p>Nenhuma notícia encontrada para os filtros selecionados.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
