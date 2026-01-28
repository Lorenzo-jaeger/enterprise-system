"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/store/auth-store"
import { toast } from "sonner" // Usando Sonner como pedido (substituto do toast)
import { Loader2, Lock, Mail } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

import { useCompany } from "@/lib/context/company-context"

const formSchema = z.object({
  email: z.string().trim().email({ message: "Digite um e-mail válido." }),
  password: z.string().min(6, { message: "A senha deve ter no mínimo 6 caracteres." }),
})

export function LoginForm() {
  const router = useRouter()
  const { settings } = useCompany()
  const setAuth = useAuthStore((state) => state.setAuth)
  const [isLoading, setIsLoading] = useState(false)

  const primaryColor = settings?.primaryColor || "#1A2B4B"
  const secondaryColor = settings?.secondaryColor || "#BFA15F"

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const handleMicrosoftLogin = () => {
    toast.info("Conectando ao Azure Active Directory...")
    // Futura implementação do MSAL
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      const response = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error("Credenciais inválidas")
      }

      const data = await response.json()
      const profileResponse = await fetch("http://localhost:3001/auth/profile", {
        headers: { Authorization: `Bearer ${data.access_token}` },
      })

      const user = await profileResponse.json()
      setAuth(data.access_token, user)
      toast.success("Login realizado com sucesso!")
      router.push("/admin")

    } catch (error) {
      toast.error("Erro ao entrar. Verifique suas credenciais.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full shadow-none border-0 bg-transparent text-left">
      <CardHeader className="space-y-2 px-0 pt-0">
        <CardTitle className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Acessar conta</CardTitle>
        <CardDescription className="text-zinc-500 text-base">
          Bem-vindo ao sistema corporativo da {settings?.companyName || "FAMI Capital"}.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0 py-6">
        <Button
          variant="outline"
          type="button"
          onClick={handleMicrosoftLogin}
          className="w-full h-12 mb-6 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 flex items-center justify-center gap-3 text-zinc-700 dark:text-zinc-300 transition-all duration-200"
        >
          <svg className="w-5 h-5" viewBox="0 0 23 23" xmlns="http://www.w3.org/2000/svg">
            <path fill="#f3f3f3" d="M0 0h23v23H0z" />
            <path fill="#f35325" d="M1 1h10v10H1z" />
            <path fill="#81bc06" d="M12 1h10v10H12z" />
            <path fill="#05a6f0" d="M1 12h10v10H1z" />
            <path fill="#ffba08" d="M12 12h10v10H12z" />
          </svg>
          Entrar com conta Microsoft
        </Button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <Separator />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-zinc-50 dark:bg-zinc-950 px-2 text-zinc-500">Ou use suas credenciais</span>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-zinc-700 dark:text-zinc-300 font-medium text-left block">E-mail Corporativo</FormLabel>
                  <FormControl>
                    <div className="relative group text-left">
                      <Mail className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-zinc-400 transition-colors" style={{ color: primaryColor }} />
                      <Input
                        placeholder="nome.sobrenome@famicapital.com"
                        className="pl-11 h-12 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-zinc-700 dark:text-zinc-300 font-medium">Sua Senha</FormLabel>
                    <Link href="/forgot-password">
                      <span className="text-sm font-medium hover:opacity-80 transition-colors" style={{ color: secondaryColor }}>Esqueceu a senha?</span>
                    </Link>
                  </div>
                  <FormControl>
                    <div className="relative group">
                      <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-zinc-400 transition-colors" style={{ color: primaryColor }} />
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="pl-11 h-12 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold transition-all duration-300 shadow-md text-white hover:opacity-90"
              style={{ backgroundColor: primaryColor, borderColor: primaryColor }}
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin text-white" /> : "Entrar no sistema"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
