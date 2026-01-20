
"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { useCompany } from "@/lib/context/company-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Loader2, Upload, Building2, Palette } from "lucide-react"

const formSchema = z.object({
    companyName: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
    slogan: z.string().optional(),
    primaryColor: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, "Cor inválida"),
    secondaryColor: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, "Cor inválida"),
    website: z.string().url("URL inválida").optional().or(z.literal("")),
    email: z.string().email("Email inválido").optional().or(z.literal("")),
    phone: z.string().optional(),
    address: z.string().optional(),
})

export default function CompanySettingsPage() {
    const { settings, updateSettings, fetchSettings } = useCompany()
    const [isSaving, setIsSaving] = useState(false)
    const [logoFile, setLogoFile] = useState<File | null>(null)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            companyName: "",
            slogan: "",
            primaryColor: "#000000",
            secondaryColor: "#ffffff",
            website: "",
            email: "",
            phone: "",
            address: "",
        },
    })

    // Load backend data into form
    useEffect(() => {
        if (settings) {
            form.reset({
                companyName: settings.companyName,
                slogan: settings.slogan || "",
                primaryColor: settings.primaryColor,
                secondaryColor: settings.secondaryColor,
                website: settings.website || "",
                email: settings.email || "",
                phone: settings.phone || "",
                address: settings.address || "",
            })
        }
    }, [settings, form])

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsSaving(true)
        try {
            // 1. Upload Logo if changed
            if (logoFile) {
                const formData = new FormData()
                formData.append('file', logoFile)
                const token = localStorage.getItem('auth-storage') ? JSON.parse(localStorage.getItem('auth-storage')!).state.token : ''

                await fetch('http://localhost:3001/settings/upload-logo', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
                })
            }

            // 2. Update Settings
            const token = localStorage.getItem('auth-storage') ? JSON.parse(localStorage.getItem('auth-storage')!).state.token : ''
            const res = await fetch('http://localhost:3001/settings', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(values)
            })

            if (!res.ok) throw new Error("Falha ao salvar")

            toast.success("Configurações atualizadas com sucesso!")
            fetchSettings() // Refresh context
        } catch (error) {
            toast.error("Erro ao salvar configurações.")
            console.error(error)
        } finally {
            setIsSaving(false)
        }
    }

    // Preview Image Handler
    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setLogoFile(e.target.files[0])
        }
    }

    return (
        <div className="p-8 space-y-8 h-full overflow-y-auto w-full max-w-7xl mx-auto">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Configurações da Empresa</h2>
                <p className="text-muted-foreground">Gerencie a identidade visual e informações institucionais.</p>
            </div>

            <Separator />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* FORMULÁRIO */}
                <div className="space-y-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                            {/* Branding Section */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Palette className="w-5 h-5 text-primary" />
                                        Identidade Visual
                                    </CardTitle>
                                    <CardDescription>Cores e Logo da sua empresa.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* Logo Upload */}
                                    <div className="flex flex-col gap-4">
                                        <Label>Logotipo</Label>
                                        <div className="flex items-center gap-4">
                                            <div className="w-24 h-24 border rounded-lg flex items-center justify-center bg-muted/50 overflow-hidden relative">
                                                {(logoFile || settings?.logoUrl) ? (
                                                    <img
                                                        src={logoFile ? URL.createObjectURL(logoFile) : (settings?.logoUrl?.startsWith('http') ? settings.logoUrl : `http://localhost:3001${settings?.logoUrl}`)}
                                                        alt="Logo Preview"
                                                        className="w-full h-full object-contain p-2"
                                                    />
                                                ) : (
                                                    <span className="text-xs text-muted-foreground">Sem Logo</span>
                                                )}
                                            </div>
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleLogoChange}
                                                className="max-w-xs"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="primaryColor"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Cor Primária</FormLabel>
                                                    <div className="flex gap-2 items-center">
                                                        <div className="w-10 h-10 rounded border" style={{ backgroundColor: field.value }}></div>
                                                        <FormControl>
                                                            <Input placeholder="#000000" {...field} />
                                                        </FormControl>
                                                    </div>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="secondaryColor"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Cor Secundária</FormLabel>
                                                    <div className="flex gap-2 items-center">
                                                        <div className="w-10 h-10 rounded border" style={{ backgroundColor: field.value }}></div>
                                                        <FormControl>
                                                            <Input placeholder="#ffffff" {...field} />
                                                        </FormControl>
                                                    </div>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Info Section */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Building2 className="w-5 h-5 text-primary" />
                                        Informações Institucionais
                                    </CardTitle>
                                    <CardDescription>Dados exibidos em relatórios e no rodapé.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="companyName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Nome da Empresa</FormLabel>
                                                <FormControl><Input {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="slogan"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Slogan</FormLabel>
                                                <FormControl><Input {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="website"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Website</FormLabel>
                                                    <FormControl><Input {...field} /></FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Email de Contato</FormLabel>
                                                    <FormControl><Input {...field} /></FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name="address"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Endereço</FormLabel>
                                                <FormControl><Input {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>

                            <div className="flex justify-end gap-4">
                                <Button variant="outline" type="button" onClick={() => form.reset()}>Cancelar</Button>
                                <Button type="submit" disabled={isSaving}>
                                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Salvar Alterações
                                </Button>
                            </div>

                        </form>
                    </Form>
                </div>

                {/* PREVIEW */}
                <div className="space-y-6">
                    <h3 className="text-lg font-medium">Live Preview</h3>

                    {/* Mock Card Preview */}
                    <div className="border rounded-xl shadow-xl overflow-hidden bg-background">
                        {/* Mock Header */}
                        <div style={{ backgroundColor: form.watch("primaryColor") }} className="p-6 text-white flex justify-between items-center transition-colors duration-500">
                            <div className="flex items-center gap-4">
                                {/* Mock Logo */}
                                <div className="w-12 h-12 bg-white/20 rounded-md flex items-center justify-center backdrop-blur-sm">
                                    {(logoFile || settings?.logoUrl) ? (
                                        <img
                                            src={logoFile ? URL.createObjectURL(logoFile) : (settings?.logoUrl?.startsWith('http') ? settings.logoUrl : `http://localhost:3001${settings?.logoUrl}`)}
                                            className="w-10 h-10 object-contain"
                                        />
                                    ) : (
                                        <Building2 className="w-8 h-8 text-white" />
                                    )}
                                </div>
                                <div>
                                    <h4 className="font-bold text-xl">{form.watch("companyName") || "Nome da Empresa"}</h4>
                                    <p className="text-sm opacity-90">{form.watch("slogan") || "O slogan da sua empresa aparecerá aqui"}</p>
                                </div>
                            </div>
                        </div>

                        {/* Mock Body */}
                        <div className="p-6 space-y-4">
                            <div className="flex gap-2">
                                <div className="h-8 w-24 rounded bg-muted animate-pulse"></div>
                                <div className="h-8 w-16 rounded bg-muted animate-pulse"></div>
                            </div>
                            <div className="h-32 rounded bg-muted/50 border-2 border-dashed flex items-center justify-center text-muted-foreground">
                                Conteúdo da Aplicação
                            </div>

                            <div className="flex justify-end">
                                <Button style={{ backgroundColor: form.watch("secondaryColor"), color: '#1A2B4B' }}>
                                    Ação Principal
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Color Palette Chips */}
                    <div className="flex gap-4">
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-full shadow-lg mb-2 mx-auto" style={{ backgroundColor: form.watch("primaryColor") }}></div>
                            <span className="text-xs font-mono">{form.watch("primaryColor")}</span>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-full shadow-lg mb-2 mx-auto" style={{ backgroundColor: form.watch("secondaryColor") }}></div>
                            <span className="text-xs font-mono">{form.watch("secondaryColor")}</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
