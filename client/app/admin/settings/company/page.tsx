
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
        <div className="p-6 h-full overflow-hidden w-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Configurações da Empresa</h2>
                    <p className="text-sm text-muted-foreground">Identidade visual e informações institucionais.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="ghost" type="button" onClick={() => form.reset()} className="rounded-xl px-4">Cancelar</Button>
                    <Button
                        onClick={form.handleSubmit(onSubmit)}
                        disabled={isSaving}
                        className="rounded-xl px-8 bg-primary hover:opacity-90 transition-all font-bold shadow-lg"
                    >
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Salvar Alterações
                    </Button>
                </div>
            </div>

            <Separator className="mb-6" />

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                            {/* Branding Section */}
                            <Card className="shadow-sm border-zinc-200/50">
                                <CardHeader className="py-4 px-6 flex flex-row items-center gap-3 space-y-0 border-b border-zinc-100 mb-4">
                                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                        <Palette className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">Identidade Visual</CardTitle>
                                        <CardDescription className="text-xs">Gerencie logo e esquema de cores.</CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-6 px-6 pb-6">
                                    <div className="flex flex-col gap-3">
                                        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Logotipo Oficial</Label>
                                        <div className="flex items-center gap-6 p-4 rounded-xl bg-zinc-50 border border-dashed border-zinc-200">
                                            <div className="w-20 h-20 border rounded-xl flex items-center justify-center bg-white shadow-sm overflow-hidden relative ring-1 ring-black/5">
                                                {(logoFile || settings?.logoUrl) ? (
                                                    <img
                                                        src={logoFile ? URL.createObjectURL(logoFile) : (settings?.logoUrl?.startsWith('http') ? settings.logoUrl : `http://localhost:3001${settings?.logoUrl}`)}
                                                        alt="Logo Preview"
                                                        className="w-full h-full object-contain p-2"
                                                    />
                                                ) : (
                                                    <Building2 className="w-8 h-8 text-zinc-300" />
                                                )}
                                            </div>
                                            <div className="flex-1 flex flex-col gap-2">
                                                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Resolução recomendada: 512x512px</p>
                                                <Input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleLogoChange}
                                                    className="h-9 text-xs cursor-pointer file:cursor-pointer bg-white"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="primaryColor"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Cor Primária</FormLabel>
                                                    <div className="flex gap-2 items-center">
                                                        <div className="w-9 h-9 rounded-lg border-2 border-white shadow-md ring-1 ring-black/5 shrink-0" style={{ backgroundColor: field.value }}></div>
                                                        <FormControl>
                                                            <Input placeholder="#000000" {...field} className="font-mono h-9 text-xs" />
                                                        </FormControl>
                                                    </div>
                                                    <FormMessage className="text-[10px]" />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="secondaryColor"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Cor Secundária</FormLabel>
                                                    <div className="flex gap-2 items-center">
                                                        <div className="w-9 h-9 rounded-lg border-2 border-white shadow-md ring-1 ring-black/5 shrink-0" style={{ backgroundColor: field.value }}></div>
                                                        <FormControl>
                                                            <Input placeholder="#ffffff" {...field} className="font-mono h-9 text-xs" />
                                                        </FormControl>
                                                    </div>
                                                    <FormMessage className="text-[10px]" />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Info Section */}
                            <Card className="shadow-sm border-zinc-200/50">
                                <CardHeader className="py-4 px-6 flex flex-row items-center gap-3 space-y-0 border-b border-zinc-100 mb-4">
                                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                        <Building2 className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">Informações Institucionais</CardTitle>
                                        <CardDescription className="text-xs">Dados de contato e endereçamento.</CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4 px-6 pb-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="companyName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Nome da Empresa</FormLabel>
                                                    <FormControl><Input {...field} className="h-9 text-sm" /></FormControl>
                                                    <FormMessage className="text-[10px]" />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="slogan"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Slogan Corporativo</FormLabel>
                                                    <FormControl><Input {...field} className="h-9 text-sm" /></FormControl>
                                                    <FormMessage className="text-[10px]" />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="website"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Website</FormLabel>
                                                    <FormControl><Input {...field} className="h-9 text-sm" /></FormControl>
                                                    <FormMessage className="text-[10px]" />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Email de Contato</FormLabel>
                                                    <FormControl><Input {...field} className="h-9 text-sm" /></FormControl>
                                                    <FormMessage className="text-[10px]" />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name="address"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Endereço Sede</FormLabel>
                                                <FormControl><Input {...field} className="h-9 text-sm" /></FormControl>
                                                <FormMessage className="text-[10px]" />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>
                        </div>
                    </form>
                </Form>
            </div>

            <style jsx>{`
              .custom-scrollbar::-webkit-scrollbar {
                width: 4px;
              }
              .custom-scrollbar::-webkit-scrollbar-track {
                background: transparent;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb {
                background: rgba(0, 0, 0, 0.1);
                border-radius: 10px;
              }
            `}</style>
        </div>
    )
}
