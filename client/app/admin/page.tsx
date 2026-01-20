"use client"

import { useAuthStore } from "@/lib/store/auth-store"
import { FinanceTicker } from "@/components/organisms/finance-ticker"
import { QuickLinks } from "@/components/organisms/quick-links"
import { BirthdayList } from "@/components/organisms/birthday-list"
import { HeroBanner } from "@/components/organisms/hero-banner"
import { NewsFeed } from "@/components/organisms/news-feed"
import { SmoothScroll } from "@/components/providers/smooth-scroll"

export default function AdminDashboard() {
    const user = useAuthStore((state) => state.user)

    return (
        <div className="flex flex-col h-full bg-background/50 text-foreground overflow-hidden">
            {/* Top Ticker - Sticky */}
            <div className="flex-shrink-0 z-20 border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
                <FinanceTicker />
            </div>

            {/* Scrollable Main Content with Lenis Smooth Scroll */}
            <SmoothScroll className="flex-1 p-4 md:p-8 space-y-8">
                {/* Dashboard Title Removed as requested */}
                {/* <div className="flex flex-col gap-2">
                 <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                 <p className="text-muted-foreground">Visão geral e atualizações da empresa.</p>
            </div> */}

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Main Content Column (3/4 width) */}
                    <div className="lg:col-span-3 space-y-8">
                        {/* Hero Banner (Carousel) */}
                        <div className="rounded-2xl overflow-hidden shadow-lg border-none ring-1 ring-border/50">
                            <HeroBanner />
                        </div>

                        {/* News Feed Section */}
                        <div className="space-y-4">
                            <NewsFeed />
                        </div>
                    </div>

                    {/* Right Sidebar Column (1/3 width) - Sticky top-0 */}
                    <div className="space-y-8 sticky top-0 self-start">
                        {/* Birthdays (Top) */}
                        <BirthdayList />

                        {/* Quick Access Links (Moved here) */}
                        <QuickLinks />
                    </div>
                </div>
            </SmoothScroll>
        </div>
    )
}
