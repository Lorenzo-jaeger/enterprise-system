"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog"

const slides = [
    {
        id: 1,
        title: "SOMOS GPTW",
        subtitle: "Pela 7ª vez consecutiva",
        description: "Great Place To Work Certificada",
        modalContent: "Temos o orgulho de anunciar que, pela 7ª vez consecutiva, fomos certificados como um excelente lugar para trabalhar! Essa conquista é fruto do empenho de cada colaborador em construir um ambiente colaborativo, inovador e humano. Agradecemos a todos que fazem parte dessa história.",
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=2000",
        color: "bg-blue-600"
    },
    {
        id: 2,
        title: "Nova Cultura",
        subtitle: "Inovação e Crescimento",
        description: "Confira as novidades para 2026",
        modalContent: "Nosso plano estratégico para 2026 foca em três pilares principais: Inovação Tecnológica, Desenvolvimento de Talentos e Sustentabilidade. Estamos lançando novos programas de incentivo à educação e reformulando nossos processos internos para garantir mais agilidade e autonomia para as equipes.",
        image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=2000",
        color: "bg-emerald-600"
    }
]

export function HeroBanner() {
    const [current, setCurrent] = useState(0)

    const next = () => setCurrent((curr) => (curr + 1) % slides.length)
    const prev = () => setCurrent((curr) => (curr - 1 + slides.length) % slides.length)

    return (
        <div className="relative group rounded-xl overflow-hidden min-h-[320px] shadow-lg">
            {slides.map((slide, index) => (
                <div 
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === current ? "opacity-100" : "opacity-0"}`}
                >
                    {/* Background Image with Overlay */}
                    <div 
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${slide.image})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />

                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col justify-center p-8 md:p-12 text-white max-w-2xl">
                        <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-700">
                            <div>
                                <h3 className="text-base font-semibold text-blue-200 tracking-wider mb-2 uppercase">{slide.subtitle}</h3>
                                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
                                    {slide.title}
                                </h2>
                            </div>
                            <div className="inline-flex items-center px-3 py-1 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 text-xs font-medium tracking-wide text-white/90">
                                {slide.description}
                            </div>
                            <div className="pt-4">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button className="bg-white text-blue-950 hover:bg-white/90 font-bold rounded-full px-6 h-10 text-sm shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer border-0 ring-0">
                                            Saiba mais
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-md">
                                        <DialogHeader>
                                            <DialogTitle className="text-2xl font-bold text-blue-900">{slide.title}</DialogTitle>
                                            <DialogDescription className="text-base text-gray-600 mt-2">
                                                {slide.modalContent}
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="mt-4 pt-4 border-t flex justify-end">
                                            <Button type="button" variant="secondary">Fechar</Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Controls - Always visible on hover */}
            <div className="absolute inset-y-0 left-0 flex items-center pl-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full bg-black/30 text-white hover:bg-black/50 hover:text-white backdrop-blur-sm" onClick={prev}>
                    <ChevronLeft className="h-8 w-8" />
                </Button>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full bg-black/30 text-white hover:bg-black/50 hover:text-white backdrop-blur-sm" onClick={next}>
                    <ChevronRight className="h-8 w-8" />
                </Button>
            </div>

            {/* Dots */}
            <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
                {slides.map((_, i) => (
                    <button
                        key={i}
                        className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? "w-8 bg-white" : "w-1.5 bg-white/40 hover:bg-white/60"}`}
                        onClick={() => setCurrent(i)}
                    />
                ))}
            </div>
        </div>
    )
}
