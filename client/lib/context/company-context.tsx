
"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { CompanySettings } from "@/types/settings"
import { useAuthStore } from "@/lib/store/auth-store"

interface CompanyContextType {
    settings: CompanySettings | null
    updateSettings: (newSettings: Partial<CompanySettings>) => void
    fetchSettings: () => Promise<void>
    isLoading: boolean
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined)

import { useTheme } from "next-themes"

// ... imports

export function CompanyProvider({ children }: { children: React.ReactNode }) {
    const [settings, setSettings] = useState<CompanySettings | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const { token } = useAuthStore()
    const { theme, resolvedTheme } = useTheme() // Get functionality to detect dark mode

    // Re-apply theme whenever settings OR theme changes
    useEffect(() => {
        if (settings) {
            applyTheme(settings, resolvedTheme || theme)
        }
    }, [settings, theme, resolvedTheme])

    const fetchSettings = async () => {
        try {
            const res = await fetch("http://localhost:3001/settings")
            if (res.ok) {
                const data = await res.json()
                setSettings(data)
                // applyTheme(data) - Removed here, useEffect handles it
            }
        } catch (error) {
            console.error("Failed to fetch company settings", error)
        } finally {
            setIsLoading(false)
        }
    }

    const applyTheme = (settings: CompanySettings, currentTheme?: string) => {
        if (!settings) return
        const root = document.documentElement
        const isDark = currentTheme === 'dark' || root.classList.contains('dark')

        // Always use Primary from settings as --primary for consistent brand details
        const primary = settings.primaryColor
        const secondary = settings.secondaryColor

        // Safety check if colors exist
        if (primary) {
            root.style.setProperty("--primary", primary)
            root.style.setProperty("--sidebar-primary", primary)
            root.style.setProperty("--ring", primary)
        }

        if (secondary) {
            root.style.setProperty("--secondary", secondary)
        }
    }

    const updateSettings = (newSettings: Partial<CompanySettings>) => {
        if (settings) {
            const updated = { ...settings, ...newSettings }
            setSettings(updated)
            applyTheme(updated)
        }
    }

    useEffect(() => {
        fetchSettings()
    }, [])

    return (
        <CompanyContext.Provider value={{ settings, updateSettings, fetchSettings, isLoading }}>
            {children}
        </CompanyContext.Provider>
    )
}

export const useCompany = () => {
    const context = useContext(CompanyContext)
    if (context === undefined) {
        throw new Error("useCompany must be used within a CompanyProvider")
    }
    return context
}
