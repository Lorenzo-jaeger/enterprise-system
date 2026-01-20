"use client"

import { useState, useEffect } from "react"
import { useAuthStore } from "@/lib/store/auth-store"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Loader2, Save, User, FileSignature } from "lucide-react"
import { toast } from "sonner"
import { SignatureGenerator } from "@/components/organisms/signature-generator"

const profileSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email().readonly(),
  jobTitle: z.string().optional(),
  branch: z.string().optional(),
  phone: z.string().optional(),
  certifications: z.string().optional(),
  avatarUrl: z.string().optional(),
  signatureBackgroundUrl: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileSchema>

export default function ProfilePage() {
  const { user, token, updateUser } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      jobTitle: "",
      branch: "",
      phone: "",
      certifications: "",
      avatarUrl: "",
      signatureBackgroundUrl: ""
    },
  })

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || "",
        email: user.email || "",
        jobTitle: user.jobTitle || "",
        branch: user.branch || "",
        phone: user.phone || "",
        certifications: user.certifications || "",
        avatarUrl: user.avatarUrl || "",
        signatureBackgroundUrl: user.signatureBackgroundUrl || ""
      })
    }
  }, [user, form])

  async function onSubmit(data: ProfileFormValues) {
    setIsLoading(true)
    try {
      const res = await fetch(`http://localhost:3001/users/${user?.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      })

      if (res.ok) {
        const updatedUser = await res.json()
        updateUser(updatedUser)
        toast.success("Perfil atualizado com sucesso!")
      } else {
        toast.error("Erro ao atualizar perfil.")
      }
    } catch (error) {
      toast.error("Erro de conexão.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Playground do Perfil</h1>
        <p className="text-muted-foreground text-lg">Personalize suas informações e gere sua assinatura corporativa em tempo real.</p>
      </div>
      <Separator />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        {/* Profile Form */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><User className="w-5 h-5" /> Dados Pessoais</CardTitle>
            <CardDescription>Edite as informações que aparecerão na sua assinatura.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome Completo</FormLabel>
                        <FormControl>
                          <Input placeholder="Seu nome" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Corporativo</FormLabel>
                        <FormControl>
                          <Input placeholder="email@empresa.com" {...field} disabled />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="jobTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cargo</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Analista Financeiro" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="branch"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Filial / Área</FormLabel>
                        <FormControl>
                          {/* Free text input for branch */}
                          <Input placeholder="Ex: São Paulo, Home Office, TI" {...field} />
                        </FormControl>
                        <FormDescription>Digite o nome da sua unidade ou localização.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone / Celular</FormLabel>
                        <FormControl>
                          <Input placeholder="+55 (11) 99999-9999" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="certifications"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Certificações</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: CPA-20, PMP, AWS" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />
                <div className="space-y-4">
                  <h3 className="font-medium text-sm text-muted-foreground">Imagens Personalizadas</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="avatarUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Foto de Perfil (Avatar URL)</FormLabel>
                          <FormControl>
                            <Input placeholder="https://..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="signatureBackgroundUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fundo da Assinatura (URL)</FormLabel>
                          <FormControl>
                            <Input placeholder="https://..." {...field} />
                          </FormControl>
                          <FormDescription>Deixe vazio para usar o padrão.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button type="submit" disabled={isLoading} size="lg" className="w-full md:w-auto">
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Dados
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Signature Generator Preview */}
        <div className="space-y-6">
          <Card className="h-full border-2 border-dashed border-muted-foreground/20 bg-muted/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><FileSignature className="w-5 h-5" /> Preview da Assinatura</CardTitle>
              <CardDescription>O que você digitar ao lado aparece aqui em tempo real.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center p-8">
              {/* Pass current form values to generator for real-time preview */}
              <SignatureGenerator data={form.watch()} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
