import React from "react";

export default async function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen py-10 flex flex-col items-center justify-center bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-tertiary)]">
            <main className="max-w-[1440px] flex flex-col p-6 md:p-0 gap-10 justify-center items-center">
                {children}
            </main>
        </div >
    );
}