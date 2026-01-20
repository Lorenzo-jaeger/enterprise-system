
export const businessImages = {
    corporate: [
        "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1504384308090-c54be3852f33?auto=format&fit=crop&q=80&w=1200"
    ],
    technology: [
        "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200"
    ],
    people: [
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=1200"
    ],
    abstract: [
        "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200"
    ]
};

export function getRandomImage(category: keyof typeof businessImages = 'corporate'): string {
    const list = businessImages[category] || businessImages.corporate;
    return list[Math.floor(Math.random() * list.length)];
}

export function getPlaceholderImage(text: string): string {
    return `https://placehold.co/800x600/1A2B4B/FFF?text=${encodeURIComponent(text)}`;
}
