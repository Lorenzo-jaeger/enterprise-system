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
        <div className="flex-shrink-0 z-20">
             <FinanceTicker />
        </div>

        {/* Scrollable Main Content with Lenis Smooth Scroll */}
        <SmoothScroll className="flex-1 p-2 md:p-4 space-y-8">
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Main Content Column (3/4 width) */}
                <div className="lg:col-span-3 space-y-4">
                    {/* Hero Banner (Carousel) */}
                    <HeroBanner />

                    {/* News Feed Section */}
                    <NewsFeed />
                </div>

                {/* Right Sidebar Column (1/3 width) - Sticky top-0 */}
                <div className="space-y-6 sticky top-0 self-start">
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
