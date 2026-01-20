
"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, X, Calendar, Clock } from "lucide-react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog"
import { useAuthStore } from "@/lib/store/auth-store"
import { useCompany } from "@/lib/context/company-context" // Import context

const staticSlides = [
    {
        id: 2,
        title: "SOMOS GPTW",
        subtitle: "Pela 7ª vez consecutiva",
        description: "Great Place To Work Certificada",
        modalContent: "Temos o orgulho de anunciar que, pela 7ª vez consecutiva, fomos certificados como um excelente lugar para trabalhar! Essa conquista é fruto do empenho de cada colaborador em construir um ambiente colaborativo, inovador e humano. Agradecemos a todos que fazem parte dessa história.",
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=2000",
        color: "bg-blue-600"
    },
    {
        id: 3,
        title: "Nova Cultura",
        subtitle: "Inovação e Crescimento",
        description: "Confira as novidades para 2026",
        modalContent: "Nosso plano estratégico para 2026 foca em três pilares principais: Inovação Tecnológica, Desenvolvimento de Talentos e Sustentabilidade. Estamos lançando novos programas de incentivo à educação e reformulando nossos processos internos para garantir mais agilidade e autonomia para as equipes.",
        image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=2000",
        color: "bg-emerald-600"
    },
    {
        id: 4,
        title: "Benefícios Flexíveis",
        subtitle: "Mais autonomia para você",
        description: "Escolha como usar seu crédito",
        modalContent: "Agora você pode personalizar seu pacote de benefícios! Acesse o portal RH e distribua seus créditos entre alimentação, cultura, educação e saúde de acordo com suas necessidades atuais.",
        image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=2000",
        color: "bg-purple-600"
    },
    {
        id: 5,
        title: "Hackathon 2026",
        subtitle: "Inscrições Abertas",
        description: "Mostre seu talento",
        modalContent: "Prepare-se para o maior Hackathon da nossa história! 48 horas de codificação, prêmios incríveis e a chance de transformar sua ideia em um produto real da empresa. Inscreva sua equipe até 30/01.",
        image: "https://images.unsplash.com/photo-1504384308090-c54be3852f33?auto=format&fit=crop&q=80&w=2000",
        color: "bg-orange-600"
    }
]

export function HeroBanner() {
    const [current, setCurrent] = useState(0)
    const [slides, setSlides] = useState<any[]>(staticSlides)
    const { user } = useAuthStore()
    const { settings } = useCompany() // Get settings

    useEffect(() => {
        // Dynamic Welcome Slide
        const now = new Date();
        const hour = now.getHours();
        const greeting = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";
        const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const dateString = now.toLocaleDateString('pt-BR', options);

        // Reminder Logic (Mock)
        const day = now.getDate();
        const month = now.getMonth(); // 0-11
        let reminderTitle = "Lembretes do Dia";
        let reminderContent = "Nenhum evento especial hoje. Aproveite seu dia de trabalho!";

        if (month === 9 && day === 15) { // Oct 15
            reminderTitle = "Dia do Professor";
            reminderContent = "Hoje é dia de homenagear aqueles que nos ensinam! Parabéns a todos os mentores e educadores.";
        } else if (now.getDay() === 5) { // Friday
            reminderTitle = "Sexta-feira!";
            reminderContent = "Não esqueça de preencher sua timesheet antes de sair para o fim de semana.";
        } else {
            // Generic Message
            reminderContent = `Confira sua agenda e pendências. Hoje é ${dateString}.`;
        }

        const welcomeSlide = {
            id: 0,
            title: `${greeting}, ${user?.name?.split(" ")[0] || "Colaborador"}`,
            subtitle: dateString.charAt(0).toUpperCase() + dateString.slice(1),
            description: "Clique para ver os lembretes do dia",
            modalContent: reminderContent,
            modalTitle: reminderTitle,
            // Use a scenic, calm image for welcome
            image: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&q=80&w=2000",
            color: "bg-primary" // Uses theme primary
        };

        setSlides([welcomeSlide, ...staticSlides]);
    }, [user]);

    // Auto-play 10 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 10000);
        return () => clearInterval(timer);
    }, [slides.length]);

    const next = () => setCurrent((curr) => (curr + 1) % slides.length)
    const prev = () => setCurrent((curr) => (curr - 1 + slides.length) % slides.length)

    if (slides.length === 0) return null; // Loading

    return (
        <div className="relative group rounded-xl overflow-hidden min-h-[350px] shadow-lg">

            {/* Branding Logo Overlay REMOVED as requested */}

            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === current ? "opacity-100" : "opacity-0"}`}
                >
                    {/* Background Image with Overlay */}
                    <div
                        className="absolute inset-0 bg-cover bg-center transform hover:scale-105 transition-transform duration-[10s]"
                        style={{ backgroundImage: `url(${slide.image})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col justify-center p-8 md:p-14 text-white max-w-3xl">
                        <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-700">
                            <div>
                                <h3 className="text-base font-semibold text-blue-200 tracking-wider mb-2 uppercase flex items-center gap-2">
                                    {slide.id === 0 && <Calendar className="w-4 h-4 text-gold-500" />} {slide.subtitle}
                                </h3>
                                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
                                    {slide.title}
                                </h2>
                            </div>

                            <div className="inline-flex items-center px-4 py-1.5 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 text-sm font-medium tracking-wide text-white/90">
                                {slide.description}
                            </div>

                            <div className="pt-2">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button className="bg-white text-black hover:bg-white/90 font-bold rounded-full px-8 h-12 text-base shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer border-0 ring-0">
                                            Saiba mais
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-md">
                                        <DialogHeader>
                                            <DialogTitle className="text-2xl font-bold text-primary flex items-center gap-2">
                                                {slide.id === 0 && <Clock className="w-5 h-5" />}
                                                {slide.modalTitle || slide.title}
                                            </DialogTitle>
                                            <DialogDescription className="text-base text-gray-600 mt-4 leading-relaxed">
                                                {slide.modalContent}
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="mt-6 flex justify-end">
                                            <Button type="button" onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { 'key': 'Escape' }))}>Entendido</Button>
                                            {/* Simple close trigger, but usually DialogClose is better. Using default pattern for now. */}
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Controls - Always visible on hover */}
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full bg-black/20 text-white hover:bg-black/40 hover:text-white backdrop-blur-sm border border-white/10" onClick={prev}>
                    <ChevronLeft className="h-6 w-6" />
                </Button>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full bg-black/20 text-white hover:bg-black/40 hover:text-white backdrop-blur-sm border border-white/10" onClick={next}>
                    <ChevronRight className="h-6 w-6" />
                </Button>
            </div>

            {/* Dots */}
            <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2">
                {slides.map((_, i) => (
                    <button
                        key={i}
                        className={`h-1.5 rounded-full transition-all duration-500 ${i === current ? "w-8 bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]" : "w-1.5 bg-white/30 hover:bg-white/50"}`}
                        onClick={() => setCurrent(i)}
                    />
                ))}
            </div>
        </div>
    )
}
