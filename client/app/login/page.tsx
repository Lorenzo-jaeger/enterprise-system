"use client"

import { LoginForm } from "@/components/organisms/login-form"
import Image from "next/image"
import { useCompany } from "@/lib/context/company-context"
import React from "react"

export default function LoginPage() {
  const { settings } = useCompany()
  const [currentIndex, setCurrentIndex] = React.useState(0)

  const highlights = [
    { title: "SOMOS GPTW", text: "Pela 7ª vez consecutiva, fomos certificados como um excelente lugar para trabalhar!", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" /></svg> },
    { title: "Nova Cultura 2026", text: "Inovação e Crescimento: confira os novos pilares estratégicos para este ano.", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg> },
    { title: "Benefícios Flexíveis", text: "Escolha como usar seu crédito. Acesse o portal RH e personalize seu pacote.", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><polyline points="16 11 18 13 22 9" /></svg> },
  ]

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1 >= highlights.length - 1 ? 0 : prev + 1))
    }, 5000)
    return () => clearInterval(timer)
  }, [highlights.length])

  const logoUrl = settings?.logoUrl
    ? (settings.logoUrl.startsWith('http') ? settings.logoUrl : `http://localhost:3001${settings.logoUrl}`)
    : "/fami-logo.svg"

  const goldColor = settings?.primaryColor || "#BFA15F"

  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row bg-white dark:bg-zinc-950">
      {/* Lado Esquerdo: Imagem e Branding */}
      <div className="relative hidden w-1/2 md:flex flex-col justify-between p-12 pb-2 overflow-hidden bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800">
        <div className="absolute inset-0 z-0">
          <Image
            src="/login-background.png"
            alt="Corporate Team"
            fill
            className="object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-700"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent z-10" />
        </div>

        <div className="relative z-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-white flex items-center justify-center p-3 shadow-2xl overflow-hidden ring-4 ring-white/10">
              <img
                src={logoUrl}
                alt={settings?.companyName || "Logo"}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.src = "/fami-logo.svg";
                }}
              />
            </div>
          </div>
        </div>

        <div className="relative z-20 mt-auto">
          <div className="max-w-lg mb-8 animate-in fade-in slide-in-from-left-6 duration-1000">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#BFA15F]/10 border border-[#BFA15F]/20 text-[#BFA15F] text-[11px] font-bold tracking-[0.25em] uppercase mb-6 shadow-sm">
              <span className="flex h-1.5 w-1.5 rounded-full bg-[#BFA15F] animate-pulse" />
              Destaques
            </div>

            <div className="relative h-[190px] overflow-hidden">
              {/* Mask to hide edges and create fake soft transition */}
              <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-zinc-900/0 to-transparent z-10 pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-zinc-900/0 to-transparent z-10 pointer-events-none" />

              <div className="space-y-3 transition-all duration-1000 ease-in-out" style={{ transform: `translateY(-${currentIndex * 101}px)` }}>
                {highlights.map((item, i) => (
                  <div key={i} className="group flex items-center gap-5 p-4 rounded-[1.5rem] bg-white/5 backdrop-blur-md border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all duration-500 cursor-default h-[88px]">
                    <div className="h-11 w-11 shrink-0 rounded-xl bg-gradient-to-br from-[#BFA15F]/20 to-[#BFA15F]/5 flex items-center justify-center text-[#BFA15F] group-hover:scale-110 transition-transform duration-500 shadow-inner">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-sm tracking-tight">{item.title}</h4>
                      <p className="text-zinc-400 text-xs leading-relaxed mt-0.5 font-medium group-hover:text-zinc-300 transition-colors line-clamp-2">
                        {item.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative -mx-12 border-t border-white/10 bg-black/40 backdrop-blur-md py-4 overflow-hidden group">
            {/* Gradient Masks */}
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-zinc-950 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-zinc-950 to-transparent z-10 pointer-events-none" />

            <div className="flex animate-marquee whitespace-nowrap gap-12">
              {[...Array(4)].map((_, groupIdx) => (
                <div key={groupIdx} className="flex gap-12 items-center">
                  {[
                    { label: "EURO", value: "R$ 6,12", change: "+0,05%", up: true },
                    { label: "NASDAQ", value: "18.400", change: "+0,80%", up: true },
                    { label: "DÓLAR", value: "R$ 5,37", change: "-0,09%", up: false },
                    { label: "BITCOIN", value: "R$ 510.337", change: "-0,28%", up: false },
                    { label: "S&P 500", value: "5.210", change: "+0,45%", up: true },
                    { label: "VALE3", value: "R$ 68,12", change: "+2,10%", up: true },
                    { label: "ITUB4", value: "R$ 34,45", change: "-0,15%", up: false },
                    { label: "PETR4", value: "R$ 32,04", change: "+1,45%", up: true },
                    { label: "IFIX", value: "3.309", change: "+0,13%", up: true },
                    { label: "MGLU3", value: "R$ 8,46", change: "-3,20%", up: false },
                    { label: "BBDC4", value: "R$ 13,82", change: "+0,52%", up: true },
                    { label: "ETH", value: "R$ 12.430", change: "-1,12%", up: false },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-[10px] font-bold text-zinc-500 tracking-[0.2em] uppercase">{item.label}</span>
                      <span className="text-sm font-bold text-white tracking-tight">{item.value}</span>
                      <span className={`text-[11px] font-bold flex items-center ${item.up ? "text-emerald-400" : "text-rose-400"}`}>
                        {item.change}
                        <span className="ml-1 text-[8px]">{item.up ? "▲" : "▼"}</span>
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <style jsx>{`
              .animate-marquee {
                animation: marquee 15s linear infinite;
              }
              @keyframes marquee {
                0% { transform: translateX(0); }
                100% { transform: translateX(-25%); }
              }
            `}</style>
          </div>
        </div>
      </div>

      {/* Lado Direito: Formulário de Login */}
      <div className="flex flex-1 items-center justify-center p-8 bg-zinc-50 dark:bg-zinc-950">
        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="md:hidden flex flex-col items-center justify-center mb-8 gap-4 text-center">
            <div className="h-20 w-20 rounded-2xl bg-white flex items-center justify-center p-4 shadow-xl overflow-hidden">
              <img
                src={logoUrl}
                alt="Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-zinc-900 dark:text-white text-3xl font-bold tracking-tight">
              {settings?.companyName?.split(' ')[0] || "FAMI"}{" "}
              <span style={{ color: goldColor }}>
                {settings?.companyName?.split(' ').slice(1).join(' ') || "Enterprise"}
              </span>
            </span>
          </div>
          <LoginForm />

          <p className="text-center text-sm text-zinc-500">
            &copy; 2026 {settings?.companyName || "FAMI Capital"}. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  )
}

