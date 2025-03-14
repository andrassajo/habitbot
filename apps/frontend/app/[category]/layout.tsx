import React from "react";

export default async function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen md:h-screen w-screen pt-5 pb-10 flex flex-col items-center justify-center bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-tertiary)]">
            <main className="w-full lg:max-w-[1440px] flex flex-row p-6 md:p-0 gap-10 justify-center items-center h-full">
                {children}
            </main>
        </div>
    );
}
