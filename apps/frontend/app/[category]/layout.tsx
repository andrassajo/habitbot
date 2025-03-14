import MobileNav from "@/components/mobile-nav";

export default async function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="h-screen w-screen pt-0 lg:pt-5 pb-20 lg:pb-10 flex flex-col items-center justify-center bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-tertiary)]">
            <main className="w-full lg:max-w-[1440px] flex flex-row md:p-0 gap-10 justify-center items-center h-full">
                {children}
            </main>
            <MobileNav />
        </div>
    );
}
