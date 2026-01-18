"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, ChevronRight, Newspaper, Settings } from "lucide-react"

const news = [
    {
        id: 1,
        title: "Fami Lança novo projeto de expansão",
        date: "10 de novembro de 2025",
        summary: "Hoje, 10/11, durante a nossa Reunião Geral, anunciamos os planos de expansão para o próximo triênio...",
        image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=500",
        category: "Corporativo"
    },
    {
        id: 2,
        title: "Assessores com Certificação CFP",
        date: "24 de setembro de 2025",
        summary: "Parabenizamos nossos novos assessores certificados! A qualificação contínua é nosso pilar...",
        image: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?auto=format&fit=crop&q=80&w=500",
        category: "RH"
    },
    {
        id: 3,
        title: "Resultados do Terceiro Trimestre",
        date: "15 de outubro de 2025",
        summary: "Apresentamos crescimento de 25% no AUM. Confira o relatório completo na área de RI...",
        image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=500",
        category: "Financeiro"
    }
]

export function NewsFeed() {
    const featured = news[0]
    const others = news.slice(1)

    return (
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-300 border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
            <CardHeader className="py-4 border-b border-border/40 bg-muted/20">
                <CardTitle className="text-lg font-semibold tracking-tight text-foreground flex items-center justify-center gap-2">
                    <Newspaper className="h-4 w-4 text-primary" />
                    Notícias
                </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                    {/* Featured News - Left (3/5 width) */}
                    <div className="md:col-span-3 h-full min-h-[340px] relative rounded-xl overflow-hidden group cursor-pointer ring-1 ring-border/20 shadow-sm transition-all duration-300 hover:shadow-lg">
                        <div 
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                        style={{ backgroundImage: `url(${featured.image})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-100" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white space-y-2">
                            <div className="inline-flex px-2 py-0.5 bg-blue-600/90 backdrop-blur-md rounded text-[10px] font-bold uppercase tracking-widest mb-1 shadow-sm">
                            {featured.category}
                        </div>
                        <h3 className="text-xl font-bold leading-tight tracking-tight text-white group-hover:text-blue-50 transition-colors">
                            {featured.title}
                        </h3>
                            <p className="text-[13px] text-gray-200 line-clamp-2 leading-relaxed opacity-90">
                            {featured.summary}
                        </p>
                        <p className="text-[11px] text-gray-400 font-medium pt-1">{featured.date}</p>
                    </div>
                </div>

                {/* Other News List - Right (2/5 width) */}
                <div className="md:col-span-2 flex flex-col h-full justify-between gap-2">
                    <div className="flex-1 flex flex-col space-y-3">
                        {others.map((item, i) => (
                            <div key={item.id} className="flex gap-4 p-3 rounded-xl bg-background/50 border border-border/40 hover:bg-background hover:border-border transition-all duration-300 cursor-pointer group shadow-sm">
                                <div className="h-16 w-20 rounded-lg overflow-hidden flex-shrink-0 bg-muted relative">
                                        <img 
                                        src={item.image} 
                                        alt={item.title} 
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>
                                <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
                                    <h4 className="text-[13px] font-semibold leading-snug tracking-tight text-foreground/90 group-hover:text-primary transition-colors line-clamp-2">
                                        {item.title}
                                    </h4>
                                    <p className="text-[11px] text-muted-foreground">{item.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pt-2">
                        <Button variant="outline" className="w-full text-xs font-medium h-9 rounded-lg hover:bg-muted/80">
                            Ver todas as notícias
                        </Button>
                    </div>
                </div>
            </div>
            </CardContent>
        </Card>
    )
}
