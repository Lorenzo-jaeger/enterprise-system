"use client"

import { useEffect, useRef } from 'react'
import Lenis from 'lenis'

interface SmoothScrollProps {
    children: React.ReactNode
    className?: string
}

export function SmoothScroll({ children, className }: SmoothScrollProps) {
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!scrollRef.current) return

        const lenis = new Lenis({
            wrapper: scrollRef.current,
            content: scrollRef.current.firstElementChild as HTMLElement, // Lenis needs a clear content wrapper
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 2,
        })

        function raf(time: number) {
            lenis.raf(time)
            requestAnimationFrame(raf)
        }

        requestAnimationFrame(raf)

        return () => {
            lenis.destroy()
        }
    }, [])

    return (
        <div 
            ref={scrollRef} 
            className={`overflow-y-auto h-full relative ${className}`}
        >
            {/* Wrapper div for Lenis content targeting */}
            <div> 
                {children}
            </div>
        </div>
    )
}
