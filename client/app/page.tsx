import Link from "next/link"
import { ArrowRight, BarChart3, Lock, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="px-6 h-16 flex items-center justify-between border-b backdrop-blur-sm fixed w-full z-50 bg-background/80">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
            <Zap className="h-5 w-5" />
          </div>
          <span>Enterprise System</span>
        </div>
        <nav className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
          <Link href="#" className="hover:text-foreground transition-colors">Soluções</Link>
          <Link href="#" className="hover:text-foreground transition-colors">Preços</Link>
          <Link href="#" className="hover:text-foreground transition-colors">Sobre</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" size="sm">Entrar</Button>
          </Link>
          <Link href="/login">
            <Button size="sm">Começar Agora</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 pt-32 pb-16 px-6">
        <section className="container mx-auto max-w-5xl text-center space-y-8">
          <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium text-muted-foreground bg-muted/50">
            <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
            Nova Versão 2.0 Disponível
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
            Gestão Empresarial <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Simples e Poderosa.</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground leading-relaxed">
            Controle total sobre seus dados, clientes e processos. 
            Uma plataforma unificada para escalar seu negócio com segurança e inteligência.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/login">
                <Button size="lg" className="h-12 px-8 text-base">
                Acessar Plataforma <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </Link>
            <Button variant="outline" size="lg" className="h-12 px-8 text-base">
              Ver Demonstração
            </Button>
          </div>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-3 gap-8 pt-20 text-left">
            <div className="space-y-3 p-6 rounded-2xl border bg-card/50 hover:bg-card transition-colors">
              <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                <BarChart3 className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-lg">Analytics em Tempo Real</h3>
              <p className="text-sm text-muted-foreground">Dashboards interativos para tomada de decisão baseada em dados reais.</p>
            </div>
            <div className="space-y-3 p-6 rounded-2xl border bg-card/50 hover:bg-card transition-colors">
               <div className="h-10 w-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-lg">Automação Inteligente</h3>
              <p className="text-sm text-muted-foreground">Reduza tarefas manuais com nossos fluxos de trabalho automatizados.</p>
            </div>
            <div className="space-y-3 p-6 rounded-2xl border bg-card/50 hover:bg-card transition-colors">
               <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600">
                <Lock className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-lg">Segurança de Ponta</h3>
              <p className="text-sm text-muted-foreground">Seus dados protegidos com criptografia enterprise-grade e RBAC.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 px-6 bg-muted/20">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            © 2026 Enterprise System. Todos os direitos reservados.
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-foreground">Privacidade</Link>
            <Link href="#" className="hover:text-foreground">Termos</Link>
            <Link href="#" className="hover:text-foreground">Suporte</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
