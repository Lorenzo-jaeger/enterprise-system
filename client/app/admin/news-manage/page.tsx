"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { useAuthStore } from "@/lib/store/auth-store"
import { Plus, Newspaper, Loader2, CheckCircle2 } from "lucide-react"

export default function ManageNewsPage() {
    const { token } = useAuthStore()
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    
    const [formData, setFormData] = useState({
        title: "",
        category: "",
        summary: "",
        content: "",
        image: ""
    })

    const categories = ["Corporativo", "RH", "Financeiro", "Tecnologia", "Bem-estar", "Segurança"]

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!token) return

        setLoading(true)
        try {
            const res = await fetch("http://localhost:3001/news", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            })

            if (res.ok) {
                setSuccess(true)
                setFormData({ title: "", category: "", summary: "", content: "", image: "" })
                setTimeout(() => setSuccess(false), 3000)
            }
        } catch (error) {
            console.error("Failed to create news", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-8 space-y-8 max-w-4xl mx-auto">
             <div>
                <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Notícias</h1>
                <p className="text-muted-foreground mt-2">Crie e publique novos comunicados para a empresa.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Newspaper className="h-5 w-5 text-primary" />
                        Nova Notícia
                    </CardTitle>
                    <CardDescription>Preencha os dados abaixo para publicar.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Título</label>
                                <Input 
                                    placeholder="Ex: Novo benefício disponível" 
                                    value={formData.title}
                                    onChange={e => setFormData({...formData, title: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Categoria</label>
                                <Select 
                                    value={formData.category} 
                                    onValueChange={v => setFormData({...formData, category: v})}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Imagem de Capa (URL)</label>
                            <Input 
                                placeholder="https://..." 
                                value={formData.image}
                                onChange={e => setFormData({...formData, image: e.target.value})}
                            />
                            <p className="text-[11px] text-muted-foreground">Use uma URL de imagem pública (Unsplash, etc).</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Resumo</label>
                            <Textarea 
                                placeholder="Breve descrição que aparece no card..." 
                                className="h-20 resize-none"
                                value={formData.summary}
                                onChange={e => setFormData({...formData, summary: e.target.value})}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Conteúdo Completo (HTML aceito)</label>
                            <Textarea 
                                placeholder="<p>Escreva o texto completo da notícia aqui...</p>" 
                                className="h-48 font-mono text-sm"
                                value={formData.content}
                                onChange={e => setFormData({...formData, content: e.target.value})}
                                required
                            />
                        </div>

                        <div className="flex items-center justify-end gap-4 pt-4 border-t">
                             {success && (
                                <div className="flex items-center gap-2 text-green-600 text-sm font-medium animate-in fade-in slide-in-from-bottom-2">
                                    <CheckCircle2 className="h-4 w-4" />
                                    Publicado com sucesso!
                                </div>
                            )}
                            <Button type="submit" disabled={loading} className="min-w-[150px]">
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Plus className="h-4 w-4 mr-2" /> Publicar Notícia</>}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
