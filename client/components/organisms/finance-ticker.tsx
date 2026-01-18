"use client"

import { useEffect, useState } from "react"
import { ArrowUp, ArrowDown, TrendingUp } from "lucide-react"

export function FinanceTicker() {
    // Mock Data mimicking the image content (USD, BTC, IFIX, MGLU3, PETR4)
    const [quotes, setQuotes] = useState([
        { symbol: "DÓLAR", price: "R$ 5,37", change: "-0.09%", isUp: false },
        { symbol: "BITCOIN", price: "R$ 510.337,00", change: "-0.28%", isUp: false },
        { symbol: "IFIX", price: "3.809pts", change: "+0.13%", isUp: true },
        { symbol: "MGLU3", price: "R$ 8,46", change: "-3.20%", isUp: false },
        { symbol: "PETR4", price: "R$ 32,04", change: "+1.45%", isUp: true },
        { symbol: "EURO", price: "R$ 6,12", change: "+0.05%", isUp: true },
        { symbol: "NASDAQ", price: "18.400pts", change: "+0.80%", isUp: true },
    ])

    return (
        <div className="w-full bg-background/80 backdrop-blur border-b border-border/50 h-10 flex items-center overflow-hidden relative z-40">
            {/* Gradient Fade Edges */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

            {/* Scrolling Content */}
            <div className="flex animate-marquee hover:pause-animation whitespace-nowrap">
                {/* Duplicate the list to ensure smooth infinite loop */}
                {[...quotes, ...quotes, ...quotes].map((quote, i) => (
                    <div key={i} className="flex items-center gap-2 px-6 border-r border-border/30 last:border-r-0 text-xs font-medium tracking-wide">
                        <span className="font-bold text-muted-foreground">{quote.symbol}</span>
                        <span className="text-foreground">{quote.price}</span>
                        <span className={`flex items-center ${quote.isUp ? "text-green-500" : "text-red-500"}`}>
                            {quote.change}
                            {quote.isUp ? <ArrowUp className="w-3 h-3 ml-0.5" /> : <ArrowDown className="w-3 h-3 ml-0.5" />}
                        </span>
                    </div>
                ))}
            </div>
            
            <style jsx>{`
                .animate-marquee {
                    animation: marquee 40s linear infinite;
                }
                .hover\\:pause-animation:hover {
                    animation-play-state: paused;
                }
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
            `}</style>
        </div>
    )
}
