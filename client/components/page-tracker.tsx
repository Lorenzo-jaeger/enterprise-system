"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { useAuthStore } from "@/lib/store/auth-store"

export function PageTracker() {
    const pathname = usePathname()
    const { token } = useAuthStore()

    useEffect(() => {
        if (!token || !pathname) return

        const trackPage = async () => {
            try {
                await fetch("http://localhost:3001/analytics/page-view", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        pageUrl: pathname,
                        pageName: document.title || pathname,
                    }),
                })
            } catch (error) {
                console.error("Failed to track page view:", error)
            }
        }

        trackPage()
    }, [pathname, token])

    return null
}
