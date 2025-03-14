import Categories from "@/components/categories";
import SkeletonCategories from "@/components/categories/categories-skeleton";
import Chat from "@/components/chat";
import Hero from "@/components/hero";
import { Suspense } from "react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-tertiary)]">
      <main className="max-w-[1440px] flex flex-col p-6 md:p-0 gap-10 justify-center items-center">
        <Hero />
        <Suspense fallback={<SkeletonCategories />}>
          <Categories />
        </Suspense>
        <Chat />
      </main>
    </div>
  );
}
